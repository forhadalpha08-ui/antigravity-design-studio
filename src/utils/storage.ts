import { Project, BrandKit } from '../types/canvas';

const PROJECTS_KEY = 'antigravity_projects_v1';
const CURRENT_PROJECT_ID_KEY = 'antigravity_current_project_id';
const BRAND_KIT_KEY = 'antigravity_brand_kit_v1';
const UPLOADED_ASSETS_KEY = 'antigravity_user_assets_v1';

// Default Brand Kit
export const DEFAULT_BRAND_KIT: BrandKit = {
  name: 'Antigravity Studio',
  colors: ['#0b0c10', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#ffffff'],
  fonts: {
    heading: "'Cinzel', serif",
    subheading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  logos: [],
};

// Local storage wrappers with error protection
export function loadProjectsFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load projects from storage', e);
    return [];
  }
}

export function saveProjectsToStorage(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
}

export function saveProject(project: Project): void {
  const projects = loadProjectsFromStorage();
  const index = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: Date.now() };

  if (index >= 0) {
    projects[index] = updated;
  } else {
    projects.unshift(updated);
  }
  saveProjectsToStorage(projects);
}

export function deleteProjectFromStorage(id: string): void {
  const projects = loadProjectsFromStorage().filter((p) => p.id !== id);
  saveProjectsToStorage(projects);
}

export function duplicateProjectInStorage(id: string): Project | null {
  const projects = loadProjectsFromStorage();
  const target = projects.find((p) => p.id === id);
  if (!target) return null;

  const newProject: Project = {
    ...target,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: `${target.title} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  projects.unshift(newProject);
  saveProjectsToStorage(projects);
  return newProject;
}

export function getCurrentProjectId(): string | null {
  return localStorage.getItem(CURRENT_PROJECT_ID_KEY);
}

export function setCurrentProjectId(id: string): void {
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
}

export function loadBrandKitFromStorage(): BrandKit {
  try {
    const raw = localStorage.getItem(BRAND_KIT_KEY);
    if (!raw) return DEFAULT_BRAND_KIT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BRAND_KIT;
  }
}

export function saveBrandKitToStorage(brandKit: BrandKit): void {
  try {
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(brandKit));
  } catch (e) {
    console.error('Failed to save brand kit', e);
  }
}

export function loadUserAssets(): string[] {
  try {
    const raw = localStorage.getItem(UPLOADED_ASSETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserAsset(dataUrl: string): void {
  try {
    const assets = loadUserAssets();
    assets.unshift(dataUrl);
    // Keep last 30 assets to avoid localStorage quota overflow
    const trimmed = assets.slice(0, 30);
    localStorage.setItem(UPLOADED_ASSETS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Could not persist image asset to localStorage quota', e);
  }
}
