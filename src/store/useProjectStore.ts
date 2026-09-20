import { useState, useCallback, useRef } from 'react';
import { Project, CanvasElement, CanvasBackground, Template, BrandKit } from '../types/canvas';
import { TEMPLATES, createProjectFromTemplate } from '../templates/templatesData';
import {
  loadProjectsFromStorage,
  saveProjectsToStorage,
  saveProject as persistProject,
  deleteProjectFromStorage,
  duplicateProjectInStorage,
  getCurrentProjectId,
  setCurrentProjectId,
} from '../utils/storage';
import { historyManager } from './useHistoryStore';
import { generateId } from '../utils/id';

// Initialize default demo projects if storage is empty
function getInitialProjects(): Project[] {
  const existing = loadProjectsFromStorage();
  if (existing.length > 0) {
    return existing;
  }

  // Populate 6 demo projects from template collection
  const demoIds = ['tpl-01', 'tpl-50', 'tpl-17', 'tpl-08', 'tpl-21', 'tpl-44'];
  const initial = demoIds.map((tid) => {
    const tpl = TEMPLATES.find((t) => t.id === tid) || TEMPLATES[0];
    return createProjectFromTemplate(tpl);
  });

  saveProjectsToStorage(initial);
  return initial;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export function useProjectState() {
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [currentProjectId, setCurrentId] = useState<string | null>(() => {
    const savedId = getCurrentProjectId();
    const all = getInitialProjects();
    if (savedId && all.some((p) => p.id === savedId)) {
      return savedId;
    }
    return null; // Start on Dashboard if no project actively selected
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId) || null;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyManager.canUndo());
    setCanRedo(historyManager.canRedo());
  }, []);

  // Update a project with auto-save and history push
  const updateProject = useCallback(
    (updater: (prev: Project) => Project, pushToHistory = true) => {
      if (!currentProjectId) return;

      setProjects((prevProjects) => {
        const idx = prevProjects.findIndex((p) => p.id === currentProjectId);
        if (idx === -1) return prevProjects;

        const oldProject = prevProjects[idx];
        if (pushToHistory) {
          historyManager.push(oldProject);
          updateHistoryFlags();
        }

        const updated = updater(oldProject);
        updated.updatedAt = Date.now();

        const copy = [...prevProjects];
        copy[idx] = updated;

        // Auto-save debounce
        setSaveStatus('unsaved');
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus('saving');
          persistProject(updated);
          setTimeout(() => setSaveStatus('saved'), 400);
        }, 800);

        return copy;
      });
    },
    [currentProjectId, updateHistoryFlags]
  );

  // Undo
  const undo = useCallback(() => {
    if (!currentProject) return;
    const prev = historyManager.undo(currentProject);
    if (prev) {
      setProjects((all) => all.map((p) => (p.id === prev.id ? prev : p)));
      updateHistoryFlags();
      persistProject(prev);
    }
  }, [currentProject, updateHistoryFlags]);

  // Redo
  const redo = useCallback(() => {
    if (!currentProject) return;
    const next = historyManager.redo(currentProject);
    if (next) {
      setProjects((all) => all.map((p) => (p.id === next.id ? next : p)));
      updateHistoryFlags();
      persistProject(next);
    }
  }, [currentProject, updateHistoryFlags]);

  // Create brand new blank project
  const createBlankProject = useCallback((title: string, width: number, height: number, category = 'custom') => {
    const newProj: Project = {
      id: generateId('proj'),
      title: title || 'Untitled Design',
      category,
      width,
      height,
      background: {
        type: 'solid',
        color: '#0e0f14',
      },
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };

    setProjects((prev) => [newProj, ...prev]);
    setCurrentId(newProj.id);
    setCurrentProjectId(newProj.id);
    persistProject(newProj);
    historyManager.clear();
    updateHistoryFlags();
    return newProj;
  }, [updateHistoryFlags]);

  // Load a template as a fresh project
  const openTemplateAsProject = useCallback((template: Template) => {
    const newProj = createProjectFromTemplate(template);
    setProjects((prev) => [newProj, ...prev]);
    setCurrentId(newProj.id);
    setCurrentProjectId(newProj.id);
    persistProject(newProj);
    historyManager.clear();
    updateHistoryFlags();
    return newProj;
  }, [updateHistoryFlags]);

  // Open an existing project
  const openProject = useCallback((id: string) => {
    setCurrentId(id);
    setCurrentProjectId(id);
    historyManager.clear();
    updateHistoryFlags();
  }, [updateHistoryFlags]);

  // Close editor and return to Dashboard
  const closeEditor = useCallback(() => {
    if (currentProject) {
      persistProject(currentProject);
    }
    setCurrentId(null);
  }, [currentProject]);

  // Duplicate a project
  const duplicateProject = useCallback((id: string) => {
    const duplicated = duplicateProjectInStorage(id);
    if (duplicated) {
      setProjects((prev) => [duplicated, ...prev]);
    }
  }, []);

  // Delete project
  const deleteProject = useCallback((id: string) => {
    deleteProjectFromStorage(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProjectId === id) {
      setCurrentId(null);
    }
  }, [currentProjectId]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
      saveProjectsToStorage(updated);
      return updated;
    });
  }, []);

  // Element actions
  const addElement = useCallback((element: CanvasElement) => {
    updateProject((prev) => {
      const maxZ = prev.elements.length > 0 ? Math.max(...prev.elements.map((e) => e.zIndex)) : 0;
      const elWithZ = { ...element, zIndex: maxZ + 1 };
      return {
        ...prev,
        elements: [...prev.elements, elWithZ],
      };
    });
  }, [updateProject]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>, pushHistory = true) => {
    updateProject((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? ({ ...el, ...updates } as CanvasElement) : el)),
    }), pushHistory);
  }, [updateProject]);

  const removeElement = useCallback((id: string) => {
    updateProject((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
  }, [updateProject]);

  const duplicateElement = useCallback((id: string) => {
    updateProject((prev) => {
      const target = prev.elements.find((el) => el.id === id);
      if (!target) return prev;

      const maxZ = Math.max(...prev.elements.map((e) => e.zIndex));
      const clone: CanvasElement = {
        ...JSON.parse(JSON.stringify(target)),
        id: generateId('el'),
        name: `${target.name} (Copy)`,
        x: target.x + 25,
        y: target.y + 25,
        zIndex: maxZ + 1,
      };

      return {
        ...prev,
        elements: [...prev.elements, clone],
      };
    });
  }, [updateProject]);

  const reorderLayer = useCallback((id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    updateProject((prev) => {
      const sorted = [...prev.elements].sort((a, b) => a.zIndex - b.zIndex);
      const index = sorted.findIndex((el) => el.id === id);
      if (index === -1) return prev;

      if (direction === 'up' && index < sorted.length - 1) {
        const temp = sorted[index];
        sorted[index] = sorted[index + 1];
        sorted[index + 1] = temp;
      } else if (direction === 'down' && index > 0) {
        const temp = sorted[index];
        sorted[index] = sorted[index - 1];
        sorted[index - 1] = temp;
      } else if (direction === 'top') {
        const [target] = sorted.splice(index, 1);
        sorted.push(target);
      } else if (direction === 'bottom') {
        const [target] = sorted.splice(index, 1);
        sorted.unshift(target);
      }

      // Re-assign neat zIndex
      const updatedElements = sorted.map((el, idx) => ({ ...el, zIndex: idx + 1 }));
      return { ...prev, elements: updatedElements };
    });
  }, [updateProject]);

  const updateCanvasSize = useCallback((width: number, height: number) => {
    updateProject((prev) => ({
      ...prev,
      width,
      height,
    }));
  }, [updateProject]);

  const updateCanvasBackground = useCallback((bg: CanvasBackground) => {
    updateProject((prev) => ({
      ...prev,
      background: bg,
    }));
  }, [updateProject]);

  // Apply brand kit colors & typography to the current design
  const applyBrandKit = useCallback((brandKit: BrandKit) => {
    updateProject((prev) => {
      const colors = brandKit.colors;
      const fonts = brandKit.fonts;

      const updatedElements = prev.elements.map((el, i) => {
        if (el.type === 'text') {
          const isLarge = el.fontSize > 36;
          const assignedColor = colors[i % colors.length] || '#ffffff';
          return {
            ...el,
            fontFamily: isLarge ? fonts.heading : fonts.body,
            color: assignedColor,
          };
        }
        if (el.type === 'shape') {
          const assignedColor = colors[(i + 1) % colors.length] || colors[0];
          return {
            ...el,
            fill: el.fill === 'transparent' ? 'transparent' : assignedColor,
            strokeColor: el.strokeColor ? colors[(i + 2) % colors.length] : undefined,
          };
        }
        return el;
      });

      return {
        ...prev,
        elements: updatedElements,
      };
    });
  }, [updateProject]);

  return {
    projects,
    currentProject,
    currentProjectId,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    openProject,
    closeEditor,
    createBlankProject,
    openTemplateAsProject,
    duplicateProject,
    deleteProject,
    toggleFavorite,
    updateProject,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    reorderLayer,
    updateCanvasSize,
    updateCanvasBackground,
    applyBrandKit,
  };
}
