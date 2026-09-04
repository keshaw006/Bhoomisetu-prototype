import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS, DEPARTMENTS } from '../data/mockData';

const ProjectContext = createContext(null);

const STORAGE_KEY = 'bhoomisetu_projects_v1';

// Calculate weighted overall progress for a project
export const calculateProjectMetrics = (project) => {
  let weightedActual = 0;
  let criticalBottleneck = null;
  let maxLag = -999;

  DEPARTMENTS.forEach((dept) => {
    const stageData = project.departments[dept.id] || { progress: 0, plannedProgress: 0 };
    weightedActual += (stageData.progress || 0) * dept.weight;

    const lag = (stageData.plannedProgress || 0) - (stageData.progress || 0);
    if (lag > maxLag && stageData.progress < 100) {
      maxLag = lag;
      criticalBottleneck = {
        departmentId: dept.id,
        departmentName: dept.name,
        shortName: dept.shortName,
        actualProgress: stageData.progress,
        plannedProgress: stageData.plannedProgress,
        lag: Math.max(0, lag),
        pendingCases: stageData.pendingCases || 0,
        delayReason: stageData.delayReason || 'Unspecified delay'
      };
    }
  });

  const overallProgress = Math.round(weightedActual);
  const plannedProgress = project.plannedProgress || 70;
  const scheduleVariance = plannedProgress - overallProgress;

  let calculatedStatus = 'On Track';
  if (scheduleVariance > 15) {
    calculatedStatus = 'Delayed';
  } else if (scheduleVariance > 5) {
    calculatedStatus = 'At Risk';
  }

  return {
    overallProgress,
    scheduleVariance,
    calculatedStatus,
    criticalBottleneck
  };
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  });

  const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_PROJECTS[0].id);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [projects]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Update a specific department's stage progress and attributes
  const updateDepartmentStage = (projectId, departmentId, payload) => {
    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        const currentDeptData = proj.departments[departmentId] || {};
        const newProgress = payload.progress !== undefined ? Number(payload.progress) : currentDeptData.progress;
        const plannedProg = payload.plannedProgress !== undefined ? Number(payload.plannedProgress) : currentDeptData.plannedProgress;
        
        let deptStatus = 'On Track';
        if (newProgress >= 100) {
          deptStatus = 'Completed';
        } else if ((plannedProg - newProgress) > 15) {
          deptStatus = 'Delayed';
        } else if ((plannedProg - newProgress) > 5) {
          deptStatus = 'At Risk';
        }

        const updatedDepartment = {
          ...currentDeptData,
          ...payload,
          progress: newProgress,
          status: deptStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        const updatedDepts = {
          ...proj.departments,
          [departmentId]: updatedDepartment
        };

        const updatedProject = {
          ...proj,
          departments: updatedDepts
        };

        // Recalculate project-wide metrics
        const metrics = calculateProjectMetrics(updatedProject);
        return {
          ...updatedProject,
          overallProgress: metrics.overallProgress,
          status: metrics.calculatedStatus
        };
      });
    });

    const deptObj = DEPARTMENTS.find(d => d.id === departmentId);
    addToast(`Updated ${deptObj?.shortName || departmentId} progress successfully.`, 'success');
  };

  // Add a new infrastructure corridor project manually
  const addProject = (projectData) => {
    const id = `proj-${Date.now()}`;
    const code = projectData.code?.trim() || `COR-${Math.floor(100 + Math.random() * 900)}`;
    const plannedProgress = projectData.plannedProgress !== undefined ? Number(projectData.plannedProgress) : 60;
    
    // Build departments structure with realistic fallbacks
    const departments = {};
    DEPARTMENTS.forEach(dept => {
      const initialStage = (projectData.departments && projectData.departments[dept.id]) || {};
      const progress = initialStage.progress !== undefined ? Number(initialStage.progress) : 0;
      const stagePlanned = initialStage.plannedProgress !== undefined ? Number(initialStage.plannedProgress) : (dept.id === 'survey' ? 100 : dept.id === 'legal' ? 80 : 50);
      
      let deptStatus = 'On Track';
      if (progress >= 100) {
        deptStatus = 'Completed';
      } else if ((stagePlanned - progress) > 15) {
        deptStatus = 'Delayed';
      } else if ((stagePlanned - progress) > 5) {
        deptStatus = 'At Risk';
      }

      departments[dept.id] = {
        progress,
        plannedProgress: stagePlanned,
        status: deptStatus,
        completedCases: initialStage.completedCases !== undefined ? Number(initialStage.completedCases) : (progress > 0 ? Math.round(progress * 10) : 0),
        pendingCases: initialStage.pendingCases !== undefined ? Number(initialStage.pendingCases) : 0,
        delayReason: initialStage.delayReason || (deptStatus === 'Delayed' ? 'Awaiting predecessor milestone' : 'None'),
        delayNotes: initialStage.delayNotes || '',
        expectedCompletionDate: initialStage.expectedCompletionDate || projectData.targetDate || '',
        lastUpdated: new Date().toISOString().split('T')[0],
        documents: initialStage.documents || [`${dept.shortName}_Init_Notice.pdf`],
        casesList: initialStage.casesList || []
      };
    });

    const newProjectDraft = {
      id,
      code,
      title: projectData.title?.trim() || 'New Infrastructure Corridor',
      district: projectData.district?.trim() || 'Central District',
      state: projectData.state?.trim() || 'Maharashtra',
      totalLandHa: Number(projectData.totalLandHa) || 120,
      budgetCrores: Number(projectData.budgetCrores) || 250,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      targetDate: projectData.targetDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      durationMonths: Number(projectData.durationMonths) || 12,
      currentMonth: Number(projectData.currentMonth) || 1,
      plannedProgress,
      status: 'On Track',
      priority: projectData.priority || 'High',
      nodalOfficer: projectData.nodalOfficer?.trim() || 'Senior District Collector & CALA',
      departments,
      executiveDirectives: projectData.executiveDirectives || [],
      progressHistory: [
        {
          id: `ph-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          stage: 'Onboarding',
          progress: 0,
          note: 'Corridor officially registered in Bhoomisetu project monitoring system.',
          by: projectData.nodalOfficer?.split('(')[0]?.trim() || 'Administration'
        }
      ]
    };

    const metrics = calculateProjectMetrics(newProjectDraft);
    const newProject = {
      ...newProjectDraft,
      overallProgress: metrics.overallProgress,
      status: metrics.calculatedStatus
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    addToast(`Corridor "${newProject.title}" registered successfully!`, 'success');
    return newProject;
  };

  // Add / update department progress with milestone logging
  const updateProjectProgress = (projectId, departmentId, payload) => {
    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        const currentDeptData = proj.departments[departmentId] || {};
        const newProgress = payload.progress !== undefined ? Math.min(100, Math.max(0, Number(payload.progress))) : currentDeptData.progress;
        const plannedProg = payload.plannedProgress !== undefined ? Number(payload.plannedProgress) : (currentDeptData.plannedProgress || 70);
        
        let deptStatus = 'On Track';
        if (newProgress >= 100) {
          deptStatus = 'Completed';
        } else if ((plannedProg - newProgress) > 15) {
          deptStatus = 'Delayed';
        } else if ((plannedProg - newProgress) > 5) {
          deptStatus = 'At Risk';
        }

        const updatedDepartment = {
          ...currentDeptData,
          ...payload,
          progress: newProgress,
          status: deptStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        const updatedDepts = {
          ...proj.departments,
          [departmentId]: updatedDepartment
        };

        let updatedHistory = proj.progressHistory || [];
        if (payload.updateNote && payload.updateNote.trim()) {
          const deptObj = DEPARTMENTS.find(d => d.id === departmentId);
          updatedHistory = [
            {
              id: `ph-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              stage: deptObj?.shortName || departmentId,
              progress: newProgress,
              note: payload.updateNote.trim(),
              by: payload.updatedBy || proj.nodalOfficer?.split('(')[0]?.trim() || 'Nodal Officer'
            },
            ...updatedHistory
          ];
        }

        const updatedProject = {
          ...proj,
          departments: updatedDepts,
          progressHistory: updatedHistory
        };

        const metrics = calculateProjectMetrics(updatedProject);
        return {
          ...updatedProject,
          overallProgress: metrics.overallProgress,
          status: metrics.calculatedStatus
        };
      });
    });

    const deptObj = DEPARTMENTS.find(d => d.id === departmentId);
    addToast(`Updated ${deptObj?.shortName || departmentId} progress to ${payload.progress}%.`, 'success');
  };

  // Delete project
  const deleteProject = (projectId) => {
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== projectId);
      if (remaining.length > 0 && selectedProjectId === projectId) {
        setSelectedProjectId(remaining[0].id);
      }
      return remaining;
    });
    addToast('Corridor removed from monitoring list.', 'info');
  };

  // Resolve a specific pending case (e.g. landowner verification dispute)
  const resolveParcelCase = (projectId, departmentId, caseId, resolutionNote) => {
    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;
        const dept = proj.departments[departmentId];
        if (!dept || !dept.casesList) return proj;

        const updatedCases = dept.casesList.map(c => {
          if (c.id === caseId) {
            return { ...c, status: 'Resolved', resolutionNote, resolvedAt: new Date().toISOString().split('T')[0] };
          }
          return c;
        });

        const pendingCount = updatedCases.filter(c => c.status !== 'Resolved').length;
        const completedCount = (dept.completedCases || 0) + 1;
        
        // Slightly advance progress if appropriate
        const newProgress = Math.min(100, Math.round((completedCount / (completedCount + pendingCount)) * 100));

        return {
          ...proj,
          departments: {
            ...proj.departments,
            [departmentId]: {
              ...dept,
              casesList: updatedCases,
              pendingCases: pendingCount,
              completedCases: completedCount,
              progress: newProgress,
              status: pendingCount === 0 ? 'Completed' : (newProgress < 50 ? 'Delayed' : 'At Risk')
            }
          }
        };
      });
    });

    addToast(`Case #${caseId} resolved. Department metrics updated!`, 'success');
  };

  // Issue executive directive
  const addExecutiveDirective = (projectId, directiveText, officerTitle) => {
    setProjects(prev => {
      return prev.map(proj => {
        if (proj.id !== projectId) return proj;
        const newDirective = {
          id: `dir-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          by: officerTitle || 'Executive Authority',
          message: directiveText,
          status: 'Active'
        };
        return {
          ...proj,
          executiveDirectives: [newDirective, ...(proj.executiveDirectives || [])]
        };
      });
    });
    addToast('Executive Intervention Directive issued to nodal officers.', 'warning');
  };

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem(STORAGE_KEY);
    addToast('Reset platform to initial prototype demonstration dataset.', 'info');
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <ProjectContext.Provider
      value={{
        projects,
        departments: DEPARTMENTS,
        selectedProjectId,
        selectedProject,
        setSelectedProjectId,
        districtFilter,
        setDistrictFilter,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        updateDepartmentStage,
        addProject,
        updateProjectProgress,
        deleteProject,
        resolveParcelCase,
        addExecutiveDirective,
        resetDemoData,
        toasts,
        removeToast,
        calculateProjectMetrics
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
