import type { BepBundle } from "../types/bep";

// API client for the Express + PostgreSQL backend.
// Replaces the previous localStorage-based persistence.

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export interface ProjectMeta {
  id: string;
  name: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
  revision: string;
  versionCount: number;
}

// List all saved projects (metadata only).
export async function listProjectsApi(): Promise<ProjectMeta[]> {
  return request<ProjectMeta[]>("/projects");
}

// Fetch a full bundle (current + changelog) by project id.
export async function getBundleApi(id: string): Promise<BepBundle> {
  return request<BepBundle>(`/projects/${encodeURIComponent(id)}`);
}

// Save/upsert a full bundle. Returns updated metadata.
export async function saveBundleApi(
  id: string,
  bundle: BepBundle,
  opts?: { note?: string; author?: string },
): Promise<ProjectMeta> {
  return request<ProjectMeta>(`/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ current: bundle.current, ...opts }),
  });
}

// Create a new project from a bundle. Returns metadata (id = slug of name).
export async function createProjectApi(bundle: BepBundle): Promise<ProjectMeta> {
  return request<ProjectMeta>("/projects", {
    method: "POST",
    body: JSON.stringify({ current: bundle.current }),
  });
}

export async function deleteProjectApi(id: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function healthApi(): Promise<{ status: string }> {
  return request<{ status: string }>("/health");
}

export interface Analytics {
  totalProjects: number;
  preAppointment: number;
  delivery: number;
  totalVersions: number;
  compliance: { met: number; total: number };
  activity: { day: string; count: number }[];
}

export async function analyticsApi(): Promise<Analytics> {
  return request<Analytics>("/analytics");
}

// Derive a stable project id (slug) from a name — must match server slug().
export function projectIdFromName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled"
  );
}
