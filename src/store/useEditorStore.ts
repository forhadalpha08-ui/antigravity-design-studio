import { useState, useCallback } from 'react';
import { Template } from '../types/canvas';
import { SnapGuide } from '../utils/math';

export type ToolType = 'select' | 'hand' | 'text' | 'shape' | 'image' | 'line' | 'draw' | 'crop';
export type DrawerType =
  | 'templates'
  | 'elements'
  | 'text'
  | 'images'
  | 'background'
  | 'brand-kit'
  | 'layers'
  | 'drawing'
  | 'charts'
  | 'qr'
  | 'table'
  | 'ai'
  | 'comments'
  | 'resize'
  | null;
export type ModalType = 'new-design' | 'export' | 'brand-kit' | 'template-preview' | 'presentation' | null;

export function useEditorState() {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>('templates');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scale, setScale] = useState<number>(0.65);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  // Mobile drawer & inspector
  const [mobileDrawer, setMobileDrawer] = useState<DrawerType>(null);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState<boolean>(false);

  // Single selected element (first in selectedIds, or null)
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : selectedIds.length > 1 ? selectedIds[0] : null;

  const selectElement = useCallback((id: string | null) => {
    setSelectedIds(id ? [id] : []);
    if (id) {
      setMobileInspectorOpen(true);
    }
  }, []);

  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const toggleSelectElement = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      return [...prev, id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setMobileInspectorOpen(false);
  }, []);

  const openModal = useCallback((modal: ModalType, tpl?: Template) => {
    setActiveModal(modal);
    if (tpl) {
      setPreviewTemplate(tpl);
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setPreviewTemplate(null);
  }, []);

  const resetView = useCallback(() => {
    setScale(0.65);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.15, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(s - 0.15, 0.15));
  }, []);

  const playAnimations = useCallback(() => {
    setIsPlayingAnimation(true);
    setTimeout(() => {
      setIsPlayingAnimation(false);
    }, 3500);
  }, []);

  return {
    activeTool,
    setActiveTool,
    activeDrawer,
    setActiveDrawer,
    selectedId,
    selectedIds,
    selectElement,
    selectMultiple,
    toggleSelectElement,
    clearSelection,
    scale,
    setScale,
    pan,
    setPan,
    resetView,
    zoomIn,
    zoomOut,
    activeModal,
    openModal,
    closeModal,
    previewTemplate,
    snapGuides,
    setSnapGuides,
    isPlayingAnimation,
    playAnimations,
    presentationMode,
    setPresentationMode,
    mobileDrawer,
    setMobileDrawer,
    mobileInspectorOpen,
    setMobileInspectorOpen,
  };
}
