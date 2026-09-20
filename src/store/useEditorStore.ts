import { useState, useCallback } from 'react';
import { Template, BrushType } from '../types/canvas';
import { SnapGuide } from '../utils/math';

export type ToolType = 
  | 'select' 
  | 'hand' 
  | 'text' 
  | 'shape' 
  | 'image' 
  | 'line' 
  | 'draw' 
  | 'comment';

export type DrawerType = 
  | 'templates' 
  | 'elements' 
  | 'text' 
  | 'images' 
  | 'background' 
  | 'brand-kit' 
  | 'layers' 
  | 'draw' 
  | 'charts' 
  | 'tables' 
  | 'qr' 
  | 'ai-tools' 
  | 'comments' 
  | null;

export type ModalType = 
  | 'new-design' 
  | 'export' 
  | 'brand-kit' 
  | 'template-preview' 
  | 'presentation' 
  | null;

export function useEditorState() {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>('templates');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scale, setScale] = useState<number>(0.65);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(true);
  
  // Brush settings for Freehand Draw Tool
  const [brushType, setBrushType] = useState<BrushType>('pen');
  const [brushColor, setBrushColor] = useState<string>('#8b5cf6');
  const [brushSize, setBrushSize] = useState<number>(4);

  // Mobile drawer & inspector
  const [mobileDrawer, setMobileDrawer] = useState<DrawerType>(null);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState<boolean>(false);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
    setSelectedIds(id ? [id] : []);
    if (id) {
      setMobileInspectorOpen(true);
    }
  }, []);

  const toggleSelectElement = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        setSelectedId(next[next.length - 1] || null);
        return next;
      } else {
        const next = [...prev, id];
        setSelectedId(id);
        return next;
      }
    });
  }, []);

  const setSelection = useCallback((ids: string[]) => {
    setSelectedIds(ids);
    setSelectedId(ids[0] || null);
    if (ids.length > 0) {
      setMobileInspectorOpen(true);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedId(null);
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
    toggleSelectElement,
    setSelection,
    clearSelection,
    brushType,
    setBrushType,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    showComments,
    setShowComments,
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
