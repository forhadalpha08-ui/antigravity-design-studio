import React, { useState, useEffect } from 'react';
import { useProjectState } from './store/useProjectStore';
import { Template } from './types/canvas';
import { StudioHeader, DashboardTab } from './components/header/StudioHeader';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { TemplateLibrary } from './components/dashboard/TemplateLibrary';
import { ProjectsManager } from './components/dashboard/ProjectsManager';
import { AssetLibrary } from './components/dashboard/AssetLibrary';
import { StudioEditor } from './editor/StudioEditor';
import { MobileEditor } from './mobile/MobileEditor';
import { MobileDashboard } from './mobile/MobileDashboard';
import { NewDesignModal } from './components/modals/NewDesignModal';
import { ExportModal } from './components/modals/ExportModal';
import { TemplatePreviewModal } from './components/modals/TemplatePreviewModal';
import { PresentationModal } from './components/modals/PresentationModal';

export function App() {
  const {
    projects,
    currentProject,
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
  } = useProjectState();

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<DashboardTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewDesignOpen, setIsNewDesignOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Responsive breakpoint detection (< 768px is mobile)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When search query entered in header, auto-switch to templates tab if on home
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && currentTab === 'home') {
      setCurrentTab('templates');
    }
  };

  return (
    <div className="w-screen h-screen bg-[#090a0f] text-neutral-100 flex flex-col overflow-hidden font-sans select-none">
      {/* 1. IF IN EDITOR MODE */}
      {currentProject ? (
        isMobile ? (
          <MobileEditor
            project={currentProject}
            saveStatus={saveStatus}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onBack={closeEditor}
            onUpdateTitle={(title) => updateProject((p) => ({ ...p, title }))}
            onOpenExportModal={() => setIsExportOpen(true)}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onSelectTemplate={openTemplateAsProject}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={removeElement}
            onReorderLayer={reorderLayer}
            onUpdateCanvasSize={updateCanvasSize}
            onUpdateCanvasBackground={updateCanvasBackground}
            onApplyBrandKit={applyBrandKit}
          />
        ) : (
          <StudioEditor
            project={currentProject}
            saveStatus={saveStatus}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onBackToDashboard={closeEditor}
            onUpdateTitle={(title) => updateProject((p) => ({ ...p, title }))}
            onOpenExportModal={() => setIsExportOpen(true)}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onSelectTemplate={openTemplateAsProject}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={removeElement}
            onReorderLayer={reorderLayer}
            onUpdateCanvasSize={updateCanvasSize}
            onUpdateCanvasBackground={updateCanvasBackground}
            onApplyBrandKit={applyBrandKit}
          />
        )
      ) : (
        /* 2. IF IN DASHBOARD MODE */
        isMobile ? (
          <MobileDashboard
            projects={projects}
            onOpenProject={openProject}
            onOpenTemplate={openTemplateAsProject}
            onPreviewTemplate={setPreviewTemplate}
            onOpenNewDesignModal={() => setIsNewDesignOpen(true)}
            onCreateBlank={createBlankProject}
            onDuplicateProject={duplicateProject}
            onDeleteProject={deleteProject}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudioHeader
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              onOpenNewDesign={() => setIsNewDesignOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />

            <main className="flex-1 overflow-hidden flex flex-col">
              {currentTab === 'home' && (
                <HomeDashboard
                  projects={projects}
                  onOpenProject={openProject}
                  onCreateBlank={createBlankProject}
                  onOpenTemplate={openTemplateAsProject}
                  onPreviewTemplate={setPreviewTemplate}
                  onDuplicateProject={duplicateProject}
                  onDeleteProject={deleteProject}
                  onToggleFavorite={toggleFavorite}
                  onExploreTemplates={() => setCurrentTab('templates')}
                  onOpenNewDesignModal={() => setIsNewDesignOpen(true)}
                />
              )}

              {currentTab === 'templates' && (
                <TemplateLibrary
                  onOpenTemplate={openTemplateAsProject}
                  onPreviewTemplate={setPreviewTemplate}
                  initialSearch={searchQuery}
                />
              )}

              {currentTab === 'projects' && (
                <ProjectsManager
                  projects={projects}
                  onOpenProject={openProject}
                  onDuplicateProject={duplicateProject}
                  onDeleteProject={deleteProject}
                  onToggleFavorite={toggleFavorite}
                  onOpenNewDesign={() => setIsNewDesignOpen(true)}
                />
              )}

              {currentTab === 'assets' && <AssetLibrary />}

              {currentTab === 'brand-kit' && (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="max-w-md text-center space-y-4 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
                    <h2 className="text-lg font-bold text-white">Brand Kit Studio</h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Your Brand Kit allows you to store your brand colors, typography, and logos,
                      then re-theme any template with 1 click directly inside the editor!
                    </p>
                    <button
                      onClick={() => setIsNewDesignOpen(true)}
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                    >
                      Open Studio Editor
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )
      )}

      {/* MODALS */}
      {isNewDesignOpen && (
        <NewDesignModal
          onClose={() => setIsNewDesignOpen(false)}
          onCreate={createBlankProject}
        />
      )}

      {isExportOpen && currentProject && (
        <ExportModal
          project={currentProject}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={openTemplateAsProject}
        />
      )}

      {isPresentationOpen && currentProject && (
        <PresentationModal
          project={currentProject}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
