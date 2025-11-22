// src/backend/controllers/bulk.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../lib/mongoose";
import { Experience, Projects } from "../models/model";

/* ---------------------------
   Small helpers (no Zod)
---------------------------- */
function isNonEmptyString(v: unknown, min = 1) {
  return typeof v === "string" && v.trim().length >= min;
}
function toDate(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}
function asArray<T = any>(body: any): T[] {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.items)) return body.items;
  return [];
}
const MAX_BULK = 100;

/* -----------------------------------------
   Minimal validators matching your schemas
------------------------------------------ */
// Experience input validator
function validateExperienceInput(e: any) {
  const errors: string[] = [];

  if (!isNonEmptyString(e?.role, 3) || String(e.role).length > 100) {
    errors.push("Invalid role (3–100 chars).");
  }

  if (
    !isNonEmptyString(e?.company?.name, 3) ||
    String(e.company.name).length > 100
  ) {
    errors.push("Invalid company.name (3–100 chars).");
  }

  const start = toDate(e?.startDate);
  if (!start) errors.push("Invalid or missing startDate.");

  const end = toDate(e?.endDate);
  if (end && start && end < start) {
    errors.push("endDate cannot be before startDate.");
  }

  // projects[] shape (optional)
  if (e?.projects) {
    if (!Array.isArray(e.projects)) errors.push("projects must be an array.");
    else {
      e.projects.forEach((p: any, i: number) => {
        if (!isNonEmptyString(p?.title, 1)) {
          errors.push(`projects[${i}].title is required.`);
        }
        if (p?.technologies && !Array.isArray(p.technologies)) {
          errors.push(`projects[${i}].technologies must be an array.`);
        }
        if (p?.features && !Array.isArray(p.features)) {
          errors.push(`projects[${i}].features must be an array.`);
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

// Project input validator
function validateProjectInput(p: any) {
  const errors: string[] = [];
  if (!isNonEmptyString(p?.title, 1)) errors.push("title is required.");
  if (!isNonEmptyString(p?.coverImage, 1))
    errors.push("coverImage is required.");
  if (p?.technologies && !Array.isArray(p.technologies))
    errors.push("technologies must be an array.");
  if (p?.features && !Array.isArray(p.features))
    errors.push("features must be an array.");
  return { valid: errors.length === 0, errors };
}

/* -------------------------------------------------
   Controller: createManyExperiences (bulk insert)
-------------------------------------------------- */
export async function createManyExperiences(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const items = asArray<any>(body);
    if (items.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Provide an array of experiences or { items: [...] }.",
        },
        { status: 400 }
      );
    }
    if (items.length > MAX_BULK) {
      return NextResponse.json(
        { ok: false, message: `Too many items. Max allowed is ${MAX_BULK}.` },
        { status: 413 }
      );
    }

    // validate each item
    const invalids: Array<{ index: number; errors: string[] }> = [];
    const docs = items.map((raw, index) => {
      const { valid, errors } = validateExperienceInput(raw);
      if (!valid) invalids.push({ index, errors });
      // normalize minimal fields (leave others as-is)
      return {
        role: String(raw.role),
        company: {
          name: String(raw?.company?.name || ""),
          jobLocation: raw?.company?.jobLocation ?? "",
          jobType: raw?.company?.jobType ?? "",
        },
        projects: Array.isArray(raw?.projects) ? raw.projects : [],
        startDate: toDate(raw?.startDate),
        endDate: toDate(raw?.endDate) ?? undefined,
        isCurrent: Boolean(raw?.isCurrent ?? false),
      };
    });

    if (invalids.length) {
      return NextResponse.json(
        { ok: false, message: "Validation error", errors: invalids },
        { status: 422 }
      );
    }

    // insert many (ordered:false -> continue on individual errors like dup keys)
    const created = await Experience.insertMany(docs, { ordered: false });
    return NextResponse.json(
      {
        ok: true,
        insertedCount: created.length,
        created,
        errors: [], // keep for symmetry with projects
      },
      { status: 201 }
    );
  } catch (err: any) {
    // If insertMany partially fails, Mongoose throws with a result-like error
    const writeErrors =
      err?.writeErrors?.map((w: any) => ({
        index: w?.index,
        code: w?.code,
        message: w?.errmsg || w?.message,
      })) ?? [];

    // Try to surface the successfully inserted docs count if available
    const inserted = err?.result?.result?.nInserted ?? 0;

    return NextResponse.json(
      {
        ok: writeErrors.length === 0,
        insertedCount: inserted,
        created: err?.result?.insertedDocs ?? [],
        errors: writeErrors,
        message: writeErrors.length
          ? "Some items failed to insert."
          : err?.message || "Bulk insert failed.",
      },
      { status: writeErrors.length ? 207 : 500 } // 207 Multi-Status for partial success
    );
  }
}

/* -----------------------------------------------
   Controller: createManyProjects (bulk insert)
------------------------------------------------ */
export async function createManyProjects(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const items = asArray<any>(body);
    if (items.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Provide an array of projects or { items: [...] }.",
        },
        { status: 400 }
      );
    }
    if (items.length > MAX_BULK) {
      return NextResponse.json(
        { ok: false, message: `Too many items. Max allowed is ${MAX_BULK}.` },
        { status: 413 }
      );
    }

    const invalids: Array<{ index: number; errors: string[] }> = [];
    const docs = items.map((raw, index) => {
      const { valid, errors } = validateProjectInput(raw);
      if (!valid) invalids.push({ index, errors });
      return {
        title: String(raw.title),
        description: raw?.description ?? "",
        technologies: Array.isArray(raw?.technologies) ? raw.technologies : [],
        features: Array.isArray(raw?.features) ? raw.features : [],
        coverImage: String(raw?.coverImage || ""),
      };
    });

    if (invalids.length) {
      return NextResponse.json(
        { ok: false, message: "Validation error", errors: invalids },
        { status: 422 }
      );
    }

    const created = await Projects.insertMany(docs, { ordered: false });
    return NextResponse.json(
      {
        ok: true,
        insertedCount: created.length,
        created,
        errors: [],
      },
      { status: 201 }
    );
  } catch (err: any) {
    const writeErrors =
      err?.writeErrors?.map((w: any) => ({
        index: w?.index,
        code: w?.code,
        message: w?.errmsg || w?.message,
      })) ?? [];
    const inserted = err?.result?.result?.nInserted ?? 0;

    return NextResponse.json(
      {
        ok: writeErrors.length === 0,
        insertedCount: inserted,
        created: err?.result?.insertedDocs ?? [],
        errors: writeErrors,
        message: writeErrors.length
          ? "Some items failed to insert."
          : err?.message || "Bulk insert failed.",
      },
      { status: writeErrors.length ? 207 : 500 }
    );
  }
}
