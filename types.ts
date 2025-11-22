export const ROLE_TYPES = ["INTERN", "JUNIOR", "MID", "SENIOR"] as const;
export type ROLETYPE = (typeof ROLE_TYPES)[number];

export const LOCATION_TYPES = ["REMOTE", "HYBRID", "ONSITE"] as const;
export type LOCATIONTYPE = (typeof LOCATION_TYPES)[number];

export interface IExperienceProject {
  title: string;
  description?: string;
  technologies?: string[];
}

export interface IExperience {
  role: string;
  company: {
    name: string;
    jobLocation?: string;
    jobType?: LOCATIONTYPE;
  };
  projects?: IExperienceProject[];
  isCurrent: boolean;
  startDate: Date;
  endDate?: Date;
}

// types/experience.ts
export type ExperienceProject = {
  title: string;
  description?: string;
  technologies?: string[];
  features?: string[];
};

export type Experience = {
  _id?: string;
  role: string;
  company: {
    name: string;
    jobLocation?: string;
    jobType?: string; // LOCATION_TYPES
  };
  projects: ExperienceProject[];
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// types/technology.ts
export type Technology = {
  _id?: string;
  name: string;
  icon?: string; // icon URL (optional)
  color?: string; // hex or CSS color
  createdAt?: string;
  updatedAt?: string;
};

// types/project.ts
export type Project = {
  _id?: string;
  title: string;
  description?: string;
  technologies: string[]; // array of technology names/ids (strings)
  features?: string[];
  coverImage: string; // required
  createdAt?: string;
  updatedAt?: string;
};
// lib/api.ts

/* ---------- Base API types ---------- */

export interface ApiBaseResponse {
  ok: boolean;
  message?: string;
}

/* ---------- Experience ---------- */

export interface ExperienceProjectPayload {
  title: string;
  description?: string;
  technologies?: string[];
  features?: string[];
}

export interface ExperienceCompanyPayload {
  name: string;
  jobLocation?: string;
  jobType?: string; // or "REMOTE" | "HYBRID" | "ONSITE"
}

export interface ExperiencePayload {
  role: string;
  company: ExperienceCompanyPayload;
  projects?: ExperienceProjectPayload[];
  startDate: string; // ISO string from frontend
  endDate?: string; // ISO string or omitted
  isCurrent?: boolean;
}

/** What an Experience document looks like coming back from the API */
export interface ExperienceDocument extends ExperiencePayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceResponse extends ApiBaseResponse {
  experience: ExperienceDocument;
}

export interface GetExperiencesResponse extends ApiBaseResponse {
  count: number;
  experiences: ExperienceDocument[];
}

export interface GetExperienceByIdResponse extends ApiBaseResponse {
  experience: ExperienceDocument;
}

export interface UpdateExperienceResponse extends ApiBaseResponse {
  experience: ExperienceDocument;
}

export interface DeleteExperienceResponse extends ApiBaseResponse {}

/* ---------- Technology ---------- */

export interface TechnologyPayload {
  name: string;
  icon?: string;
  color?: string;
}

export interface TechnologyDocument extends TechnologyPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechnologyResponse extends ApiBaseResponse {
  technology: TechnologyDocument;
}

export interface GetTechnologiesResponse extends ApiBaseResponse {
  count: number;
  technologies: TechnologyDocument[];
}

export interface GetTechnologyByIdResponse extends ApiBaseResponse {
  technology: TechnologyDocument;
}

export interface UpdateTechnologyResponse extends ApiBaseResponse {
  technology: TechnologyDocument;
}

export interface DeleteTechnologyResponse extends ApiBaseResponse {}

/* ---------- Projects ---------- */

export interface ProjectPayload {
  title: string;
  description?: string | null;
  technologies?: string[];
  features?: string[];
  coverImage: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ProjectDocument extends ProjectPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectResponse extends ApiBaseResponse {
  project: ProjectDocument;
}

export interface GetProjectsResponse extends ApiBaseResponse {
  count: number;
  projects: ProjectDocument[];
}

export interface GetProjectByIdResponse extends ApiBaseResponse {
  project: ProjectDocument;
}

export interface UpdateProjectResponse extends ApiBaseResponse {
  project: ProjectDocument;
}

export interface DeleteProjectResponse extends ApiBaseResponse {}

/* ---------- Auth / User ---------- */

export type UserRole = "USER" | "ADMIN";

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse extends ApiBaseResponse {
  token: string;
  user: UserDocument;
}

// src/types/forms.ts
export type ProjectItem = {
  title: string;
  description?: string | null;
  technologies?: string[];
  features?: string[];
};

export type ExperienceFormValues = {
  role: string;
  company: {
    name: string;
    jobLocation?: string | null;
    jobType?: string | null; // enum handled in UI/server if you want
  };
  projects?: ProjectItem[];
  startDate: string; // ISO or yyyy-mm-dd from <input type="date" />
  endDate?: string | null; // optional
  isCurrent: boolean;
};

export type TechnologyFormValues = {
  name: string;
  icon?: string | null;
  color?: string | null;
};

export type ProjectFormValues = {
  title: string;
  description?: string | null;
  technologies?: string[];
  features?: string[];
  coverImage: string;
};

export type ExperienceFormProps = {
  /** pass when editing; if provided we call PUT /api/experience/:id */
  experienceId?: string;
  /** initial values to prefill the form in edit mode */
  initial?: Partial<ExperienceFormValues> & { _id?: string | undefined };
  /** called after successful save */
  onSuccess?: (saved: any) => void;
  /** optional: label overrides */
  labels?: {
    title?: string;
    submit?: string;
  };
};

// Bucketing you already use server-side
export type Bucket = "day" | "week" | "month" | "quarter" | "year";

// Fixed work-mix categories found in the payload
export type WorkCategory = "React/Next" | "Mobile (RN)" | "Node/API" | "Other";

export interface OverviewKPIs {
  projects: number;
  technologies: number;
  roles: number;
  activeThisMonth: number;
  currentRole: string | null;
}

export type WorkMix = Record<WorkCategory, number>;

export interface TopTechnology {
  label: string;
  value: number;
}

export interface TimelinePoint {
  bucket: string; // e.g. "2025-11" (keep generic string for flexibility)
  count: number;
}

export interface RecentProject {
  title: string;
  createdAt: string; // ISO timestamp string in the response
  technologies: string[];
  coverImage: string;
}

export interface OverviewData {
  kpis: OverviewKPIs;
  workMix: WorkMix;
  topTechnologies: TopTechnology[];
  timeline: TimelinePoint[];
  recent: RecentProject[];
}

export interface OverviewMeta {
  range: { start?: string; end?: string }; // can be empty
  bucket: Bucket;
  topLimit: number;
  generatedAt: string; // ISO timestamp string
}

export interface OverviewResponse {
  ok: true;
  data: OverviewData;
  meta: OverviewMeta;
}

// Optional: error shape if you also return failures from the same route
export type OverviewApiResponse = OverviewResponse;

export type Ctx = { params: Promise<{ id: string }> };
