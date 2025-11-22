// src/utils/validators.ts
import {
  ExperienceFormValues,
  ProjectFormValues,
  TechnologyFormValues,
  ProjectItem,
} from "@/types";

export type FieldErrors = Record<string, string>;

const isNonEmpty = (v?: string | null) =>
  typeof v === "string" && v.trim().length > 0;

const lenBetween = (v: string, min: number, max: number) =>
  v.trim().length >= min && v.trim().length <= max;

const parseDate = (v?: string | null) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const add = (errs: FieldErrors, path: string, msg: string) => {
  if (!errs[path]) errs[path] = msg;
};

function validateProjectItem(
  item: ProjectItem,
  idx: number,
  errs: FieldErrors
) {
  if (!isNonEmpty(item.title)) {
    add(errs, `projects.${idx}.title`, "Please provide a project title.");
  }
  if (item.technologies && !Array.isArray(item.technologies)) {
    add(errs, `projects.${idx}.technologies`, "Technologies must be an array.");
  }
  if (item.features && !Array.isArray(item.features)) {
    add(errs, `projects.${idx}.features`, "Features must be an array.");
  }
}

/** EXPERIENCE */
export function validateExperience(values: ExperienceFormValues) {
  const errors: FieldErrors = {};

  // role
  if (!isNonEmpty(values.role)) {
    add(errors, "role", "Role is required.");
  } else if (!lenBetween(values.role, 3, 100)) {
    add(errors, "role", "Role should be 3–100 characters.");
  }

  // company.name
  if (!isNonEmpty(values.company?.name)) {
    add(errors, "company.name", "Company name is required.");
  } else if (!lenBetween(values.company.name!, 3, 100)) {
    add(errors, "company.name", "Company name should be 3–100 characters.");
  }

  // projects
  if (values.projects && Array.isArray(values.projects)) {
    values.projects.forEach((p: any, i: number) =>
      validateProjectItem(p, i, errors)
    );
  }

  // dates
  const start = parseDate(values.startDate);
  if (!start)
    add(errors, "startDate", "Start date is required and must be valid.");

  const end = parseDate(values.endDate ?? undefined);

  // isCurrent logic
  if (values.isCurrent && end) {
    add(
      errors,
      "endDate",
      'End date must be empty when "Current role" is selected.'
    );
  }

  // end >= start
  if (!values.isCurrent && end && start && end < start) {
    add(errors, "endDate", "End date cannot be before start date.");
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** PROJECT */
export function validateProject(values: ProjectFormValues) {
  const errors: FieldErrors = {};
  if (!isNonEmpty(values.title)) add(errors, "title", "Title is required.");

  // if (!isNonEmpty(values.coverImage)) {
  //   add(errors, "coverImage", "Cover image is required.");
  // }

  if (values.technologies && !Array.isArray(values.technologies)) {
    add(errors, "technologies", "Technologies must be an array.");
  }
  if (values.features && !Array.isArray(values.features)) {
    add(errors, "features", "Features must be an array.");
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** TECHNOLOGY */
export function validateTechnology(values: TechnologyFormValues) {
  const errors: FieldErrors = {};
  if (!isNonEmpty(values.name)) {
    add(errors, "name", "Technology name is required.");
  } else if (!lenBetween(values.name, 3, 50)) {
    add(errors, "name", "Technology name should be 3–50 characters.");
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
