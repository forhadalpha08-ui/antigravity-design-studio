import { useState, useCallback, useRef } from 'react';
import { Project, CanvasElement, CanvasBackground, Template, BrandKit, CommentThread } from '../types/canvas';
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
  // Always start on the main website / dashboard on load
  const [currentProjectId, setCurrentId] = useState<string | null>(null);

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
    setCurrentProjectId('');
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

  // Group elements
  const groupElements = useCallback((ids: string[]) => {
    if (ids.length < 2) return;
    const groupId = generateId('grp');
    updateProject((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        ids.includes(el.id) ? { ...el, groupId } : el
      ),
    }));
  }, [updateProject]);

  // Ungroup elements
  const ungroupElements = useCallback((groupId: string) => {
    updateProject((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.groupId === groupId ? { ...el, groupId: undefined } : el
      ),
    }));
  }, [updateProject]);

  // Smart Alignment
  const alignElements = useCallback((
    ids: string[],
    type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => {
    if (!currentProject || ids.length === 0) return;
    updateProject((prev) => {
      const selectedEls = prev.elements.filter((e) => ids.includes(e.id));
      if (selectedEls.length === 0) return prev;

      if (selectedEls.length === 1) {
        // Single element aligns to canvas
        const el = selectedEls[0];
        let newX = el.x;
        let newY = el.y;
        if (type === 'left') newX = 0;
        if (type === 'center') newX = Math.round((prev.width - el.width) / 2);
        if (type === 'right') newX = prev.width - el.width;
        if (type === 'top') newY = 0;
        if (type === 'middle') newY = Math.round((prev.height - el.height) / 2);
        if (type === 'bottom') newY = prev.height - el.height;

        return {
          ...prev,
          elements: prev.elements.map((e) => (e.id === el.id ? { ...e, x: newX, y: newY } : e)),
        };
      }

      // Multi-element: aligns to selection bounding box
      const minX = Math.min(...selectedEls.map((e) => e.x));
      const maxX = Math.max(...selectedEls.map((e) => e.x + e.width));
      const minY = Math.min(...selectedEls.map((e) => e.y));
      const maxY = Math.max(...selectedEls.map((e) => e.y + e.height));
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      return {
        ...prev,
        elements: prev.elements.map((e) => {
          if (!ids.includes(e.id)) return e;
          let nx = e.x;
          let ny = e.y;
          if (type === 'left') nx = minX;
          if (type === 'center') nx = Math.round(centerX - e.width / 2);
          if (type === 'right') nx = maxX - e.width;
          if (type === 'top') ny = minY;
          if (type === 'middle') ny = Math.round(centerY - e.height / 2);
          if (type === 'bottom') ny = maxY - e.height;
          return { ...e, x: nx, y: ny };
        }),
      };
    });
  }, [currentProject, updateProject]);

  // Distribute elements evenly
  const distributeElements = useCallback((
    ids: string[],
    axis: 'horizontal' | 'vertical'
  ) => {
    if (ids.length < 3) return;
    updateProject((prev) => {
      const selectedEls = prev.elements
        .filter((e) => ids.includes(e.id))
        .sort((a, b) => (axis === 'horizontal' ? a.x - b.x : a.y - b.y));

      if (selectedEls.length < 3) return prev;

      if (axis === 'horizontal') {
        const first = selectedEls[0];
        const last = selectedEls[selectedEls.length - 1];
        const totalSpan = (last.x + last.width) - first.x;
        const totalElementsWidth = selectedEls.reduce((sum, e) => sum + e.width, 0);
        const totalGap = totalSpan - totalElementsWidth;
        const gap = totalGap / (selectedEls.length - 1);

        let curX = first.x;
        const posMap: { [id: string]: number } = {};
        selectedEls.forEach((el) => {
          posMap[el.id] = Math.round(curX);
          curX += el.width + gap;
        });

        return {
          ...prev,
          elements: prev.elements.map((e) =>
            posMap[e.id] !== undefined ? { ...e, x: posMap[e.id] } : e
          ),
        };
      } else {
        const first = selectedEls[0];
        const last = selectedEls[selectedEls.length - 1];
        const totalSpan = (last.y + last.height) - first.y;
        const totalElementsHeight = selectedEls.reduce((sum, e) => sum + e.height, 0);
        const totalGap = totalSpan - totalElementsHeight;
        const gap = totalGap / (selectedEls.length - 1);

        let curY = first.y;
        const posMap: { [id: string]: number } = {};
        selectedEls.forEach((el) => {
          posMap[el.id] = Math.round(curY);
          curY += el.height + gap;
        });

        return {
          ...prev,
          elements: prev.elements.map((e) =>
            posMap[e.id] !== undefined ? { ...e, y: posMap[e.id] } : e
          ),
        };
      }
    });
  }, [updateProject]);

  // Comment thread actions
  const addComment = useCallback((comment: CommentThread) => {
    updateProject((prev) => ({
      ...prev,
      comments: [comment, ...(prev.comments || [])],
    }));
  }, [updateProject]);

  const resolveComment = useCallback((id: string) => {
    updateProject((prev) => ({
      ...prev,
      comments: (prev.comments || []).map((c) =>
        c.id === id ? { ...c, resolved: !c.resolved } : c
      ),
    }));
  }, [updateProject]);

  const deleteComment = useCallback((id: string) => {
    updateProject((prev) => ({
      ...prev,
      comments: (prev.comments || []).map((c) => c).filter((c) => c.id !== id),
    }));
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
    groupElements,
    ungroupElements,
    alignElements,
    distributeElements,
    addComment,
    resolveComment,
    deleteComment,
  };
}
