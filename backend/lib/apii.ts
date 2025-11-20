import {
  AuthResponse,
  CreateExperienceResponse,
  CreateProjectResponse,
  CreateTechnologyResponse,
  DeleteExperienceResponse,
  DeleteProjectResponse,
  DeleteTechnologyResponse,
  ExperiencePayload,
  GetExperienceByIdResponse,
  GetExperiencesResponse,
  GetProjectByIdResponse,
  GetProjectsResponse,
  GetTechnologiesResponse,
  GetTechnologyByIdResponse,
  LoginPayload,
  ProjectPayload,
  RegisterPayload,
  TechnologyPayload,
  UpdateExperienceResponse,
  UpdateProjectResponse,
  UpdateTechnologyResponse,
} from "@/types";
import { post, get, del, patch } from "./api-client";
import { ExperienceFormValues } from "@/components/modals/experience-modal";

/* ---------- Experience API ---------- */

export async function createExperience(payload: ExperienceFormValues) {
  return post<ExperienceFormValues, CreateExperienceResponse>(
    "/api/experience",
    payload
  );
}

export async function fetchExperiences() {
  return get<GetExperiencesResponse>("/api/experience");
}

export async function fetchExperienceById(id: string) {
  return get<GetExperienceByIdResponse>(`/api/experience/${id}`);
}

export async function updateExperience(
  id: string,
  payload: Partial<ExperienceFormValues>
) {
  return patch<Partial<ExperienceFormValues>, UpdateExperienceResponse>(
    `/api/experience/${id}`,
    payload
  );
}

export async function deleteExperience(id: string) {
  return del<DeleteExperienceResponse>(`/api/experience/${id}`);
}

/* ---------- Technology API ---------- */

export async function createTechnology(payload: TechnologyPayload) {
  return post<TechnologyPayload, CreateTechnologyResponse>(
    "/api/technologies",
    payload
  );
}

export async function fetchTechnologies() {
  return get<GetTechnologiesResponse>("/api/technologies");
}

export async function fetchTechnologyById(id: string) {
  return get<GetTechnologyByIdResponse>(`/api/technologies/${id}`);
}

export async function updateTechnology(
  id: string,
  payload: Partial<TechnologyPayload>
) {
  return patch<Partial<TechnologyPayload>, UpdateTechnologyResponse>(
    `/api/technologies/${id}`,
    payload
  );
}

export async function deleteTechnology(id: string) {
  return del<DeleteTechnologyResponse>(`/api/technologies/${id}`);
}

/* ---------- Projects API ---------- */

export async function createProject(payload: ProjectPayload) {
  return post<ProjectPayload, CreateProjectResponse>("/api/projects", payload);
}

export async function fetchProjects() {
  return get<GetProjectsResponse>("/api/projects");
}

export async function fetchProjectById(id: string) {
  return get<GetProjectByIdResponse>(`/api/projects/${id}`);
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>
) {
  return patch<Partial<ProjectPayload>, UpdateProjectResponse>(
    `/api/projects/${id}`,
    payload
  );
}

export async function deleteProject(id: string) {
  return del<DeleteProjectResponse>(`/api/projects/${id}`);
}

/* ---------- Auth API ---------- */

export async function registerUser(payload: RegisterPayload) {
  return post<RegisterPayload, AuthResponse>("/api/sign-up", payload);
}

// alias if you want to keep the old name
export const createUser = registerUser;

export async function loginUser(payload: LoginPayload) {
  return post<LoginPayload, AuthResponse>("/api/login", payload);
}
