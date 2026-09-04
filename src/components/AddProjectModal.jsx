import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { DEPARTMENTS } from '../data/mockData';
import {
  X,
  Building2,
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
  Sliders,
  FileText
} from 'lucide-react';

export const AddProjectModal = ({ isOpen, onClose }) => {
  const { addProject } = useProjects();

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'scope' | 'stages'

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    district: '',
    state: 'Maharashtra',
    priority: 'High',
    nodalOfficer: '',
    totalLandHa: '',
    budgetCrores: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationMonths: 12,
    plannedProgress: 65,
    departments: {
      survey: { progress: 100, plannedProgress: 100, delayReason: 'None' },
      legal: { progress: 80, plannedProgress: 85, delayReason: 'None' },
      compensation: { progress: 40, plannedProgress: 60, delayReason: 'None' },
      rehabilitation: { progress: 20, plannedProgress: 40, delayReason: 'None' },
      possession: { progress: 0, plannedProgress: 20, delayReason: 'None' }
    }
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Calculate live weighted overall progress
  let liveWeightedProgress = 0;
  DEPARTMENTS.forEach(dept => {
    const stage = formData.departments[dept.id] || { progress: 0 };
    liveWeightedProgress += (Number(stage.progress) || 0) * dept.weight;
  });
  liveWeightedProgress = Math.round(liveWeightedProgress);

  const scheduleVariance = Number(formData.plannedProgress) - liveWeightedProgress;
  let liveStatus = 'On Track';
  if (scheduleVariance > 15) {
    liveStatus = 'Delayed';
  } else if (scheduleVariance > 5) {
    liveStatus = 'At Risk';
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDepartmentProgressChange = (deptId, progressVal) => {
    const val = Math.min(100, Math.max(0, Number(progressVal) || 0));
    setFormData(prev => ({
      ...prev,
      departments: {
        ...prev.departments,
        [deptId]: {
          ...prev.departments[deptId],
          progress: val
        }
      }
    }));
  };

  const handleGenerateCode = () => {
    const initials = formData.title
      ? formData.title.split(' ').map(w => w[0]).join('').substring(0, 4).toUpperCase()
      : 'NHAI';
    const randNum = Math.floor(100 + Math.random() * 900);
    handleInputChange('code', `${initials}-EXP-${randNum}`);
  };

  const handleApplyPreset = (type) => {
    if (type === 'clean') {
      setFormData(prev => ({
        ...prev,
        departments: {
          survey: { progress: 0, plannedProgress: 30, delayReason: 'None' },
          legal: { progress: 0, plannedProgress: 20, delayReason: 'None' },
          compensation: { progress: 0, plannedProgress: 10, delayReason: 'None' },
          rehabilitation: { progress: 0, plannedProgress: 0, delayReason: 'None' },
          possession: { progress: 0, plannedProgress: 0, delayReason: 'None' }
        },
        plannedProgress: 20
      }));
    } else if (type === 'sample') {
      setFormData(prev => ({
        ...prev,
        departments: {
          survey: { progress: 100, plannedProgress: 100, delayReason: 'None' },
          legal: { progress: 85, plannedProgress: 90, delayReason: 'None' },
          compensation: { progress: 50, plannedProgress: 70, delayReason: 'Landowner verification pending' },
          rehabilitation: { progress: 30, plannedProgress: 50, delayReason: 'None' },
          possession: { progress: 10, plannedProgress: 25, delayReason: 'None' }
        },
        plannedProgress: 65
      }));
    }
  };

  const handleFillDemoData = () => {
    setFormData({
      title: 'Delhi-Varanasi High Speed Economic Corridor (Sec-2)',
      code: 'DVHSR-PKG-02',
      district: 'Prayagraj & Varanasi',
      state: 'Uttar Pradesh',
      priority: 'Critical',
      nodalOfficer: 'Dr. Vivek Saxena, IAS (Special Secretary & CALA)',
      totalLandHa: '420.8',
      budgetCrores: '780.50',
      startDate: '2025-03-01',
      targetDate: '2026-06-30',
      durationMonths: 16,
      plannedProgress: 70,
      departments: {
        survey: { progress: 100, plannedProgress: 100, delayReason: 'None' },
        legal: { progress: 90, plannedProgress: 95, delayReason: 'None' },
        compensation: { progress: 45, plannedProgress: 75, delayReason: 'Landowner verification pending & Heirship disputes' },
        rehabilitation: { progress: 35, plannedProgress: 60, delayReason: 'Awaiting compensation disbursements' },
        possession: { progress: 10, plannedProgress: 30, delayReason: 'Blocked: Awaiting R&R handover' }
      }
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.totalLandHa || Number(formData.totalLandHa) <= 0) newErrors.totalLandHa = 'Enter valid land area';
    if (!formData.budgetCrores || Number(formData.budgetCrores) <= 0) newErrors.budgetCrores = 'Enter valid budget amount';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.title || newErrors.district) setActiveTab('basic');
      else if (newErrors.totalLandHa || newErrors.budgetCrores) setActiveTab('scope');
      return;
    }

    addProject({
      ...formData,
      code: formData.code.trim() || `COR-${Math.floor(100 + Math.random() * 900)}`,
      totalLandHa: Number(formData.totalLandHa),
      budgetCrores: Number(formData.budgetCrores),
      durationMonths: Number(formData.durationMonths) || 12,
      plannedProgress: Number(formData.plannedProgress) || 60
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo-badge" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
              <FolderPlus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                Register New Infrastructure Corridor
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Define physical scope, linear ROW alignment, and configure initial stage progress
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#2563eb' }}
              onClick={handleFillDemoData}
              title="Pre-fill with realistic corridor data for quick testing"
            >
              <Sparkles size={13} />
              Auto-Fill Sample
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.5rem' }}>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            style={{ borderRadius: 0, borderBottom: activeTab === 'basic' ? '2px solid #2563eb' : '2px solid transparent' }}
            onClick={() => setActiveTab('basic')}
          >
            1. Corridor Identity
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'scope' ? 'active' : ''}`}
            style={{ borderRadius: 0, borderBottom: activeTab === 'scope' ? '2px solid #2563eb' : '2px solid transparent' }}
            onClick={() => setActiveTab('scope')}
          >
            2. Land & Financial Scope
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'stages' ? 'active' : ''}`}
            style={{ borderRadius: 0, borderBottom: activeTab === 'stages' ? '2px solid #2563eb' : '2px solid transparent' }}
            onClick={() => setActiveTab('stages')}
          >
            3. Department Stage Progress
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {/* TAB 1: BASIC IDENTITY */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Project Corridor Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: errors.title ? '#ef4444' : undefined }}
                    placeholder="e.g. NH-48 Western Dedicated Corridor (PKG-3)"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  {errors.title && <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.title}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Corridor / Gazette Code</label>
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <RefreshCw size={11} /> Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. NHAI-EXP-48"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Priority Rating</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="Critical">Critical (PMO Pragati Monitored)</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Standard">Standard Routine</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      District(s) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderColor: errors.district ? '#ef4444' : undefined }}
                      placeholder="e.g. Nashik & Ahmednagar"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    />
                    {errors.district && <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.district}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">State Jurisdiction</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Designated Nodal Officer / CALA</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Shri Alok Deshpande, IAS (Addl. Collector & CALA)"
                    value={formData.nodalOfficer}
                    onChange={(e) => handleInputChange('nodalOfficer', e.target.value)}
                  />
                  <span className="form-helper">Competent Authority for Land Acquisition responsible for milestone clearance</span>
                </div>
              </div>
            )}

            {/* TAB 2: SCOPE & TIMELINE */}
            {activeTab === 'scope' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Total Land Required (Hectares) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      style={{ borderColor: errors.totalLandHa ? '#ef4444' : undefined }}
                      placeholder="e.g. 350.5"
                      value={formData.totalLandHa}
                      onChange={(e) => handleInputChange('totalLandHa', e.target.value)}
                    />
                    {errors.totalLandHa && <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.totalLandHa}</span>}
                    <span className="form-helper">Gross linear right-of-way alignment</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Total Land Budget (₹ in Crores) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={{ borderColor: errors.budgetCrores ? '#ef4444' : undefined }}
                      placeholder="e.g. 520.00"
                      value={formData.budgetCrores}
                      onChange={(e) => handleInputChange('budgetCrores', e.target.value)}
                    />
                    {errors.budgetCrores && <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.budgetCrores}</span>}
                    <span className="form-helper">Estimated 3G award and compensation outlay</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Notification Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Target Handover Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.targetDate}
                      onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Acquisition Horizon (Months)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={formData.durationMonths}
                      onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Planned Schedule Target Milestone ({formData.plannedProgress}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      className="range-slider"
                      value={formData.plannedProgress}
                      onChange={(e) => handleInputChange('plannedProgress', e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>Early (20%)</span>
                      <span>Target Benchmark: {formData.plannedProgress}%</span>
                      <span>Target End (100%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STAGE PROGRESS INITIALIZATION */}
            {activeTab === 'stages' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#f1f5f9', padding: '0.65rem 1rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      Configure Initial Department Stages
                    </span>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                      Adjust progress for each department to reflect current ground reality
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                      onClick={() => handleApplyPreset('clean')}
                    >
                      Reset All 0%
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                      onClick={() => handleApplyPreset('sample')}
                    >
                      In-Progress Preset
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {DEPARTMENTS.map((dept) => {
                    const currentStage = formData.departments[dept.id] || { progress: 0 };
                    const progressVal = Number(currentStage.progress) || 0;

                    return (
                      <div
                        key={dept.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0.85rem 1rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                              {dept.shortName}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                              Weight: {dept.weight * 100}%
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              style={{ width: '60px', padding: '0.2rem 0.4rem', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                              value={progressVal}
                              onChange={(e) => handleDepartmentProgressChange(dept.id, e.target.value)}
                            />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>%</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="range-slider"
                          value={progressVal}
                          onChange={(e) => handleDepartmentProgressChange(dept.id, e.target.value)}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                          <span>Key milestones: {dept.milestones.slice(0, 2).join(' • ')}</span>
                          <span style={{ fontWeight: 600, color: progressVal >= 100 ? '#10b981' : '#3b82f6' }}>
                            {progressVal >= 100 ? 'Completed' : progressVal > 0 ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Calculated Metric Bar */}
            <div style={{ marginTop: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Live Calculated Health
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {liveWeightedProgress}%{' '}
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>
                      Overall Weighted Progress (Target: {formData.plannedProgress}%)
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${liveStatus.toLowerCase().replace(' ', '')}`}>
                    {liveStatus}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Variance: {scheduleVariance > 0 ? `-${scheduleVariance}% Lag` : '+Ahead of Target'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {activeTab !== 'basic' && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveTab(activeTab === 'stages' ? 'scope' : 'basic')}
              >
                Previous Step
              </button>
            )}

            {activeTab !== 'stages' ? (
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setActiveTab(activeTab === 'basic' ? 'scope' : 'stages')}
              >
                Continue to {activeTab === 'basic' ? 'Scope & Budget' : 'Stage Progress'}
              </button>
            ) : (
              <button type="submit" className="btn-primary-action">
                <FolderPlus size={16} />
                Register & Track Corridor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
