import { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { DEPARTMENTS } from '../data/mockData';

export const useDepartmentWorkspace = (projectId, departmentId) => {
  const { projects, updateDepartmentStage, resolveParcelCase } = useProjects();

  const project = projects.find(p => p.id === projectId) || projects[0];
  const deptMeta = DEPARTMENTS.find(d => d.id === departmentId) || DEPARTMENTS[0];
  const deptData = project?.departments?.[deptMeta.id] || {
    progress: 0,
    plannedProgress: 70,
    status: 'On Track',
    completedCases: 0,
    pendingCases: 0,
    delayReason: 'None',
    delayNotes: '',
    expectedCompletionDate: '',
    casesList: [],
    documents: []
  };

  // Local form state for draft changes
  const [formData, setFormData] = useState({
    progress: deptData.progress || 0,
    plannedProgress: deptData.plannedProgress || 70,
    completedCases: deptData.completedCases || 0,
    pendingCases: deptData.pendingCases || 0,
    delayReason: deptData.delayReason || 'None',
    delayNotes: deptData.delayNotes || '',
    expectedCompletionDate: deptData.expectedCompletionDate || '',
    newDocumentName: ''
  });

  // Sync form when department or project changes
  useEffect(() => {
    setFormData({
      progress: deptData.progress || 0,
      plannedProgress: deptData.plannedProgress || 70,
      completedCases: deptData.completedCases || 0,
      pendingCases: deptData.pendingCases || 0,
      delayReason: deptData.delayReason || 'None',
      delayNotes: deptData.delayNotes || '',
      expectedCompletionDate: deptData.expectedCompletionDate || '',
      newDocumentName: ''
    });
  }, [projectId, deptMeta.id, deptData.progress, deptData.pendingCases]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderProgressChange = (val) => {
    setFormData(prev => ({
      ...prev,
      progress: Number(val)
    }));
  };

  const saveDepartmentUpdate = () => {
    const documents = [...(deptData.documents || [])];
    if (formData.newDocumentName.trim()) {
      documents.push(formData.newDocumentName.trim());
    }

    updateDepartmentStage(project.id, deptMeta.id, {
      progress: Number(formData.progress),
      plannedProgress: Number(formData.plannedProgress),
      completedCases: Number(formData.completedCases),
      pendingCases: Number(formData.pendingCases),
      delayReason: formData.delayReason,
      delayNotes: formData.delayNotes,
      expectedCompletionDate: formData.expectedCompletionDate,
      documents
    });

    setFormData(prev => ({ ...prev, newDocumentName: '' }));
  };

  const resolveCase = (caseId, note) => {
    resolveParcelCase(project.id, deptMeta.id, caseId, note);
  };

  return {
    project,
    deptMeta,
    deptData,
    formData,
    handleInputChange,
    handleSliderProgressChange,
    saveDepartmentUpdate,
    resolveCase
  };
};
