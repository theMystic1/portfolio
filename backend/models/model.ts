import mongoose, { Model } from "mongoose";
import {
  experienceSchema,
  technologySchema,
  projectsSchema,
} from "../lib/backend-schema";

/** Optional interfaces if you want typing */
export interface IProject {
  title: string;
  description?: string | null;
  technologies: string[];
  features: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  githubUrl?: string;
  liveUrl?: string;
}
export interface ITechnology {
  name: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IExperience {
  role: string;
  company: { name: string; jobLocation?: string; jobType?: string };
  projects: {
    title: string;
    description?: string;
    technologies: string[];
    features?: string[];
  }[];
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Guarded singletons — prevents OverwriteModelError on HMR */
export const Experience: Model<IExperience> =
  (mongoose.models.Experience as Model<IExperience>) ||
  mongoose.model<IExperience>("Experience", experienceSchema);

export const Technologies: Model<ITechnology> =
  (mongoose.models.Technologies as Model<ITechnology>) ||
  mongoose.model<ITechnology>("Technologies", technologySchema);

export const Projects: Model<IProject> =
  (mongoose.models.Projects as Model<IProject>) ||
  mongoose.model<IProject>("Projects", projectsSchema);
