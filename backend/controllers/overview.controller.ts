// src/backend/controllers/overviewController.ts
import { NextRequest, NextResponse } from "next/server";
import {
  Bucket,
  OverviewQuerySchema,
  OverviewResponseSchema,
} from "../lib/overview.schema";
import { dbConnect } from "../lib/mongoose";
import { Experience, Projects, Technologies } from "../models/model";

// ---------- helpers ----------
function classifyWork(techs: string[] = []) {
  const t = techs.map((s) => s.toLowerCase());
  if (t.some((k) => ["react", "next", "next.js", "nextjs"].includes(k)))
    return "React/Next" as const;
  if (t.some((k) => ["react native", "expo", "rn", "react-native"].includes(k)))
    return "Mobile (RN)" as const;
  if (t.some((k) => ["node", "node.js", "express", "api", "rest"].includes(k)))
    return "Node/API" as const;
  return "Other" as const;
}

function isoWeekKey(d: Date) {
  // ISO week: YYYY-Www
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
function quarterKey(d: Date) {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function bucketKey(d: Date, bucket: Bucket) {
  switch (bucket) {
    case "day":
      return dayKey(d);
    case "week":
      return isoWeekKey(d);
    case "quarter":
      return quarterKey(d);
    case "year":
      return String(d.getFullYear());
    case "month":
    default:
      return monthKey(d);
  }
}

/** Parse query params into typed values (supports ?start=&end=&bucket=&top=) */
function parseQuery(req: NextRequest) {
  const url = new URL(req.url);
  const raw = {
    start: url.searchParams.get("start") || undefined,
    end: url.searchParams.get("end") || undefined,
    bucket: (url.searchParams.get("bucket") as Bucket) || undefined,
    top: url.searchParams.get("top") || undefined,
  };
  return OverviewQuerySchema.parse(raw);
}

// ---------- Controller ----------
export async function getAdminOverview(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await dbConnect();

    const query = parseQuery(req);
    const { start, end, bucket, top } = query;

    // Build filters
    const createdFilter: any = {};
    if (start) createdFilter.$gte = start;
    if (end) createdFilter.$lte = end;
    const projectFilter = Object.keys(createdFilter).length
      ? { createdAt: createdFilter }
      : {};

    // Fetch minimal fields for speed
    const [projects, techCount, experiences, recent] = await Promise.all([
      Projects.find(projectFilter)
        .select("technologies createdAt coverImage title")
        .lean(),
      Technologies.estimatedDocumentCount(),
      Experience.find()
        .select("role isCurrent startDate endDate projects.technologies")
        .lean(),
      Projects.find()
        .select("title createdAt technologies coverImage")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    // KPIs
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const kpis = {
      projects: projects.length,
      technologies: techCount,
      roles: new Set(experiences.map((e) => e.role)).size,
      activeThisMonth: projects.filter(
        (p) => new Date(p.createdAt) >= monthStart
      ).length,
      currentRole: experiences.find((e) => e.isCurrent)?.role ?? null,
    };

    // Work mix
    const mix = { "React/Next": 0, "Mobile (RN)": 0, "Node/API": 0, Other: 0 };
    const bumpMix = (techs?: string[]) => {
      const key = classifyWork(techs || []);
      (mix as any)[key] += 1;
    };
    projects.forEach((p) => bumpMix(p.technologies));
    experiences.forEach((e) =>
      (e.projects || []).forEach((sp: any) => bumpMix(sp.technologies))
    );

    // Top technologies
    const freq: Record<string, number> = {};
    const bumpTech = (t: string) => {
      const k = t.trim();
      if (!k) return;
      freq[k] = (freq[k] || 0) + 1;
    };
    projects.forEach((p) => (p.technologies || []).forEach(bumpTech));
    experiences.forEach((e) =>
      (e.projects || []).forEach((sp: any) =>
        (sp.technologies || []).forEach(bumpTech)
      )
    );
    const topTechnologies = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, top)
      .map(([label, value]) => ({ label, value }));

    // Timeline (bucketed by createdAt)
    const series = new Map<string, number>();
    projects.forEach((p) => {
      const key = bucketKey(new Date(p.createdAt), bucket);
      series.set(key, (series.get(key) || 0) + 1);
    });
    const timeline = Array.from(series.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([bucket, count]) => ({ bucket, count }));

    // Recent list
    const recentOut = recent.map((r) => ({
      title: r.title,
      createdAt: new Date(r.createdAt),
      technologies: r.technologies || [],
      coverImage: r.coverImage,
    }));

    const payload = {
      ok: true as const,
      data: {
        kpis,
        workMix: mix,
        topTechnologies,
        timeline,
        recent: recentOut,
      },
      meta: {
        range: { start, end },
        bucket,
        topLimit: top,
        generatedAt: new Date().toISOString(),
      },
    };

    // Ensure we return what the UI expects
    const parsed = OverviewResponseSchema.parse(payload);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    console.error("Overview error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Failed to load overview" },
      { status: 500 }
    );
  }
}
