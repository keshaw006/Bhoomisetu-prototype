import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { BottleneckAlert } from './components/BottleneckAlert';
import { ManagementDashboard } from './components/ManagementDashboard';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { DepartmentWorkspace } from './components/DepartmentWorkspace';
import { ExecutiveDirectiveModal } from './components/ExecutiveDirectiveModal';
import { CaseResolutionModal } from './components/CaseResolutionModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AddProjectModal } from './components/AddProjectModal';
import { UpdateProgressModal } from './components/UpdateProgressModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent = () => {
  const { toasts, removeToast, selectedProjectId } = useProjects();
  const { isDepartmentOfficer } = useAuth();

  // Navigation tab state: 'management' | 'pipeline' | 'department'
  const [activeTab, setActiveTab] = useState('management');

  // Modals state
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseModalDeptId, setCaseModalDeptId] = useState('compensation');
  const [detailProject, setDetailProject] = useState(null);
  const [workspaceStage, setWorkspaceStage] = useState('compensation');

  // New project & progress modal states
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] = useState(false);
  const [progressModalProjId, setProgressModalProjId] = useState(null);
  const [progressModalDeptId, setProgressModalDeptId] = useState(null);

  const handleOpenCasesFromAlert = (deptId) => {
    setCaseModalDeptId(deptId);
    setIsCaseModalOpen(true);
  };

  const handleOpenPipelineFromAlert = () => {
    setActiveTab('pipeline');
  };

  const handleOpenWorkspaceForStage = (stageId) => {
    setWorkspaceStage(stageId);
    setActiveTab('department');
  };

  const handleOpenUpdateProgress = (projId, deptId) => {
    setProgressModalProjId(projId || selectedProjectId);
    setProgressModalDeptId(deptId || null);
    setIsUpdateProgressModalOpen(true);
  };

  return (
    <div className="app-wrapper">
      {/* Top Header & Role Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDirectiveModal={() => setIsDirectiveModalOpen(true)}
        onOpenAddProjectModal={() => setIsAddProjectModalOpen(true)}
        onOpenUpdateProgressModal={handleOpenUpdateProgress}
      />

      <main className="main-content">
        {/* Executive Macro KPIs */}
        <KPICards />

        {/* Dynamic Critical Bottleneck Banner */}
        <BottleneckAlert
          onResolveCasesClick={handleOpenCasesFromAlert}
          onOpenPipelineClick={handleOpenPipelineFromAlert}
        />

        {/* Tab Views */}
        {activeTab === 'management' && (
          <ManagementDashboard
            onOpenDetailModal={(proj) => setDetailProject(proj)}
            onOpenPipeline={() => setActiveTab('pipeline')}
            onOpenAddProject={() => setIsAddProjectModalOpen(true)}
            onOpenUpdateProgress={handleOpenUpdateProgress}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineVisualizer
            onOpenWorkspaceForStage={handleOpenWorkspaceForStage}
          />
        )}

        {activeTab === 'department' && (
          <DepartmentWorkspace
            initialDepartmentId={workspaceStage}
            onOpenPipeline={() => setActiveTab('pipeline')}
          />
        )}
      </main>

      {/* Modals */}
      <ExecutiveDirectiveModal
        isOpen={isDirectiveModalOpen}
        onClose={() => setIsDirectiveModalOpen(false)}
      />

      <CaseResolutionModal
        isOpen={isCaseModalOpen}
        targetDepartmentId={caseModalDeptId}
        onClose={() => setIsCaseModalOpen(false)}
      />

      <ProjectDetailModal
        project={detailProject}
        isOpen={Boolean(detailProject)}
        onClose={() => setDetailProject(null)}
        onOpenWorkspace={(deptId) => {
          setWorkspaceStage(deptId);
          setActiveTab('department');
        }}
        onOpenUpdateProgress={handleOpenUpdateProgress}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <UpdateProgressModal
        isOpen={isUpdateProgressModalOpen}
        targetProjectId={progressModalProjId}
        initialDepartmentId={progressModalDeptId}
        onClose={() => setIsUpdateProgressModalOpen(false)}
      />

      {/* Toast Notification Hub */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={16} color="#10b981" />}
            {t.type === 'warning' && <AlertCircle size={16} color="#f59e0b" />}
            {t.type === 'info' && <Info size={16} color="#60a5fa" />}
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
