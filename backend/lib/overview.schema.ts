// src/schemas/overview.ts
import { z } from "zod";

/** Query schema (coerces date from query strings) */
export const BucketEnum = z.enum(["day", "week", "month", "quarter", "year"]);
export type Bucket = z.infer<typeof BucketEnum>;

export const OverviewQuerySchema = z.object({
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  bucket: BucketEnum.default("month"),
  top: z.coerce.number().min(3).max(24).default(12),
});
export type OverviewQuery = z.infer<typeof OverviewQuerySchema>;

/** Response schemas */
export const KPISchema = z.object({
  projects: z.number().int().nonnegative(),
  technologies: z.number().int().nonnegative(),
  roles: z.number().int().nonnegative(),
  activeThisMonth: z.number().int().nonnegative(),
  currentRole: z.string().nullable().optional(),
});

export const WorkMixSchema = z.object({
  "React/Next": z.number().int().nonnegative(),
  "Mobile (RN)": z.number().int().nonnegative(),
  "Node/API": z.number().int().nonnegative(),
  Other: z.number().int().nonnegative(),
});

export const TopTechnologySchema = z.object({
  label: z.string(),
  value: z.number().int().nonnegative(),
});

export const TimelinePointSchema = z.object({
  bucket: z.string(), // e.g. "2025-11" | "2025-W46" | "2025-Q4"
  count: z.number().int().nonnegative(),
});

export const RecentProjectSchema = z.object({
  title: z.string(),
  createdAt: z.date(),
  technologies: z.array(z.string()),
  coverImage: z.string(),
});

export const OverviewDataSchema = z.object({
  kpis: KPISchema,
  workMix: WorkMixSchema,
  topTechnologies: z.array(TopTechnologySchema),
  timeline: z.array(TimelinePointSchema),
  recent: z.array(RecentProjectSchema),
});

export const OverviewResponseSchema = z.object({
  ok: z.literal(true),
  data: OverviewDataSchema,
  meta: z.object({
    range: z.object({
      start: z.date().optional(),
      end: z.date().optional(),
    }),
    bucket: BucketEnum,
    topLimit: z.number().int(),
    generatedAt: z.string(),
  }),
});
export type OverviewResponse = z.infer<typeof OverviewResponseSchema>;
