import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { DEPARTMENTS } from '../data/mockData';
import {
  X,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Save,
  ArrowRight,
  Layers,
  Building2,
  Calendar
} from 'lucide-react';

export const UpdateProgressModal = ({ isOpen, onClose, targetProjectId, initialDepartmentId }) => {
  const { projects, updateProjectProgress, calculateProjectMetrics } = useProjects();

  const [selectedProjId, setSelectedProjId] = useState(targetProjectId || (projects[0] && projects[0].id));
  const [selectedDeptId, setSelectedDeptId] = useState(initialDepartmentId || 'compensation');

  useEffect(() => {
    if (targetProjectId) {
      setSelectedProjId(targetProjectId);
    }
  }, [targetProjectId]);

  useEffect(() => {
    if (initialDepartmentId) {
      setSelectedDeptId(initialDepartmentId);
    }
  }, [initialDepartmentId]);

  const currentProject = projects.find(p => p.id === selectedProjId) || projects[0];
  const currentDeptMeta = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const currentStageData = currentProject?.departments?.[selectedDeptId] || {
    progress: 0,
    plannedProgress: 70,
    status: 'On Track',
    completedCases: 0,
    pendingCases: 0,
    delayReason: 'None',
    delayNotes: '',
    expectedCompletionDate: ''
  };

  // Local form state for draft updates
  const [newProgress, setNewProgress] = useState(currentStageData.progress || 0);
  const [completedCases, setCompletedCases] = useState(currentStageData.completedCases || 0);
  const [pendingCases, setPendingCases] = useState(currentStageData.pendingCases || 0);
  const [delayReason, setDelayReason] = useState(currentStageData.delayReason || 'None');
  const [delayNotes, setDelayNotes] = useState(currentStageData.delayNotes || '');
  const [updateNote, setUpdateNote] = useState('');
  const [expectedDate, setExpectedDate] = useState(currentStageData.expectedCompletionDate || '');

  // Reset form when project or department changes
  useEffect(() => {
    if (currentProject && currentDeptMeta) {
      const stage = currentProject.departments?.[currentDeptMeta.id] || {};
      setNewProgress(stage.progress !== undefined ? stage.progress : 0);
      setCompletedCases(stage.completedCases || 0);
      setPendingCases(stage.pendingCases || 0);
      setDelayReason(stage.delayReason || 'None');
      setDelayNotes(stage.delayNotes || '');
      setExpectedDate(stage.expectedCompletionDate || '');
      setUpdateNote('');
    }
  }, [selectedProjId, selectedDeptId, currentProject]);

  if (!isOpen || !currentProject) return null;

  // Calculate before and simulated after metrics
  const currentMetrics = calculateProjectMetrics(currentProject);

  const simulatedProject = {
    ...currentProject,
    departments: {
      ...currentProject.departments,
      [selectedDeptId]: {
        ...currentStageData,
        progress: Number(newProgress)
      }
    }
  };
  const simulatedMetrics = calculateProjectMetrics(simulatedProject);

  const handleQuickAdd = (increment) => {
    setNewProgress(prev => Math.min(100, Math.max(0, Number(prev) + increment)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProjectProgress(selectedProjId, selectedDeptId, {
      progress: Number(newProgress),
      completedCases: Number(completedCases),
      pendingCases: Number(pendingCases),
      delayReason,
      delayNotes,
      expectedCompletionDate: expectedDate,
      updateNote: updateNote.trim() || `Progress updated to ${newProgress}% in ${currentDeptMeta.shortName}`
    });
    onClose();
  };

  const delayReasonOptions = [
    'None',
    'Landowner verification pending & Heirship disputes',
    'High court stay / Title Injunction',
    'Pending Khatauni & RTC Mutation Updates',
    'Forest Clearance / NGT Environmental Review',
    'Gram Sabha Consent & Public Hearing Objections',
    'Banking KYC / Aadhaar DBT Mapping Failure',
    'Demanding commercial guidance value parity',
    'Utility shifting pending (Electricity/Water lines)',
    'Awaiting predecessor department sign-off'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo-badge" style={{ width: '38px', height: '38px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                Update Corridor Stage Progress
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Record milestone advancement, cleared parcel cases, and schedule notes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {/* Project Selection Bar */}
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Infrastructure Corridor
                  </span>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                    {currentProject.title} ({currentProject.code})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="corridor-select" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Switch Corridor:</label>
                  <select
                    id="corridor-select"
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem', fontWeight: 600 }}
                    value={selectedProjId}
                    onChange={(e) => setSelectedProjId(e.target.value)}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {p.title.split('(')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Department Stage Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.4rem' }}>
                Select Department Stage to Update
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  const dData = currentProject.departments?.[dept.id] || { progress: 0 };
                  const isCompleted = dData.progress >= 100;

                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setSelectedDeptId(dept.id)}
                      style={{
                        padding: '0.6rem 0.4rem',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#1e40af' : '#1e293b' }}>
                        {dept.shortName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: isCompleted ? '#059669' : '#64748b', marginTop: '0.2rem', fontWeight: 700 }}>
                        {dData.progress}% {isCompleted ? '✓' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Slider & Quick Actions */}
            <div className="progress-slider-wrapper" style={{ marginBottom: '1.25rem' }}>
              <div className="slider-readout">
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    {currentDeptMeta.name} Progress
                  </span>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    Department Weight: <strong>{currentDeptMeta.weight * 100}%</strong> &bull; Planned Target: <strong>{currentStageData.plannedProgress}%</strong>
                  </div>
                </div>
                <div className="slider-val-large" style={{ color: newProgress >= 100 ? '#10b981' : '#2563eb' }}>
                  {newProgress}%
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                className="range-slider"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
              />

              {/* Quick Increment Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Quick Adjust:</span>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }} onClick={() => handleQuickAdd(5)}>+5%</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }} onClick={() => handleQuickAdd(10)}>+10%</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }} onClick={() => handleQuickAdd(25)}>+25%</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }} onClick={() => setNewProgress(100)}>
                  100% (Cleared)
                </button>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: '#64748b' }} onClick={() => setNewProgress(0)}>
                  Reset 0%
                </button>
              </div>
            </div>

            {/* Cases & Date Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Completed Parcels</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={completedCases}
                  onChange={(e) => setCompletedCases(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pending / Disputed</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  style={{ borderColor: pendingCases > 0 ? '#fca5a5' : undefined }}
                  value={pendingCases}
                  onChange={(e) => setPendingCases(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expected Completion</label>
                <input
                  type="date"
                  className="form-input"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Milestone Note */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">
                Milestone Progress Note & Gazette Reference
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Completed Section 3D notification across 14 revenue villages; disbursed ₹12 Cr award via escrow"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
              />
              <span className="form-helper">This update will be logged to the corridor's chronological audit trail</span>
            </div>

            {/* Delay Reason (Conditional or dropdown) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Delay Reason (If Applicable)</label>
                <select
                  className="form-select"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                >
                  {delayReasonOptions.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Roadblock Specifics / Field Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 18 heirship certificates awaited from Tehsildar"
                  value={delayNotes}
                  onChange={(e) => setDelayNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Live Impact Preview */}
            <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.9rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                    Project Impact Preview
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748b' }}>
                      {currentMetrics.overallProgress}%
                    </div>
                    <ArrowRight size={16} color="#2563eb" />
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                      {simulatedMetrics.overallProgress}%
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                      ({simulatedMetrics.overallProgress >= currentMetrics.overallProgress ? `+${simulatedMetrics.overallProgress - currentMetrics.overallProgress}%` : `${simulatedMetrics.overallProgress - currentMetrics.overallProgress}%`})
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${simulatedMetrics.calculatedStatus.toLowerCase().replace(' ', '')}`}>
                    {simulatedMetrics.calculatedStatus}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Variance: {simulatedMetrics.scheduleVariance > 0 ? `-${simulatedMetrics.scheduleVariance}% Lag` : '+Ahead of Target'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-action">
              <Save size={16} />
              Save & Apply Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
