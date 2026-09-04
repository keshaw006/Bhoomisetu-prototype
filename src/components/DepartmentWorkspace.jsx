import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useDepartmentWorkspace } from '../hooks/useDepartmentWorkspace';
import { DEPARTMENTS } from '../data/mockData';
import { 
  Save, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Calendar, 
  Clock, 
  Layers, 
  ShieldAlert,
  User,
  MapPin,
  IndianRupee
} from 'lucide-react';

export const DepartmentWorkspace = ({ initialDepartmentId, onOpenPipeline }) => {
  const { selectedProjectId, setSelectedProjectId, projects } = useProjects();
  const { currentUser, isDepartmentOfficer, assignedDepartment } = useAuth();

  // If a department officer is logged in, force their assigned department; otherwise allow toggling
  const effectiveDeptId = isDepartmentOfficer && assignedDepartment 
    ? assignedDepartment 
    : (initialDepartmentId || 'compensation');

  const [activeDeptId, setActiveDeptId] = useState(effectiveDeptId);

  // Sync if role changed
  React.useEffect(() => {
    if (isDepartmentOfficer && assignedDepartment) {
      setActiveDeptId(assignedDepartment);
    }
  }, [isDepartmentOfficer, assignedDepartment]);

  const {
    project,
    deptMeta,
    deptData,
    formData,
    handleInputChange,
    handleSliderProgressChange,
    saveDepartmentUpdate,
    resolveCase
  } = useDepartmentWorkspace(selectedProjectId, activeDeptId);

  // Quick form to add a parcel dispute
  const [showAddCaseForm, setShowAddCaseForm] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    parcelNo: '',
    village: '',
    owner: '',
    areaAcres: '',
    amountLakhs: '',
    issue: ''
  });

  const handleAddCaseSubmit = (e) => {
    e.preventDefault();
    if (!newCaseData.parcelNo || !newCaseData.owner) return;

    const newCase = {
      id: `c-${Date.now()}`,
      parcelNo: newCaseData.parcelNo,
      village: newCaseData.village || project.district,
      owner: newCaseData.owner,
      areaAcres: Number(newCaseData.areaAcres) || 1.0,
      amountLakhs: Number(newCaseData.amountLakhs) || 10.0,
      issue: newCaseData.issue || 'Pending verification',
      status: 'Pending Verification'
    };

    const updatedCases = [newCase, ...(deptData.casesList || [])];
    const newPending = (deptData.pendingCases || 0) + 1;

    saveDepartmentUpdate(); // save current form
    // reset new case form
    setNewCaseData({
      parcelNo: '',
      village: '',
      owner: '',
      areaAcres: '',
      amountLakhs: '',
      issue: ''
    });
    setShowAddCaseForm(false);
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
    <div className="dept-workspace-container">
      {/* Left Column: Official Department Update Form */}
      <div>
        <div className="workspace-card">
          {/* Department Switcher Tabs (for Officers / Admins) */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={18} color="#2563eb" />
                Department Workspace & Submission Desk
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Project:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.82rem', fontWeight: 600 }}
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code} — {p.title.split('(')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Navigation Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {DEPARTMENTS.map((dept) => {
                const isActive = activeDeptId === dept.id;
                const isAssigned = isDepartmentOfficer && assignedDepartment === dept.id;

                return (
                  <button
                    key={dept.id}
                    className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.35rem 0.75rem',
                      border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                      background: isActive ? '#eff6ff' : '#ffffff'
                    }}
                    onClick={() => setActiveDeptId(dept.id)}
                  >
                    {dept.shortName}
                    {isAssigned && <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>My Dept</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Header Info */}
          <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', color: '#0f172a' }}>
                {deptMeta.name}
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Weight in Project: <strong>{deptMeta.weight * 100}%</strong> &bull; Nodal In-Charge: <strong>{deptMeta.roleTitle}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`status-badge status-${deptData.status?.toLowerCase().replace(' ', '') || 'ontrack'}`}>
                {deptData.status || 'Active'}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Last synced: {deptData.lastUpdated || 'Today'}
              </span>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={(e) => { e.preventDefault(); saveDepartmentUpdate(); }}>
            {/* Interactive Progress Slider */}
            <div className="progress-slider-wrapper">
              <div className="slider-readout">
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Reported Stage Progress
                  </span>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    Planned Schedule Benchmark: <strong>{formData.plannedProgress}%</strong>
                  </div>
                </div>
                <div className="slider-val-large">
                  {formData.progress}%
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                className="range-slider"
                value={formData.progress}
                onChange={(e) => handleSliderProgressChange(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                <span>0% (Initiation)</span>
                <span>50% (Mid-term Evaluation)</span>
                <span>100% (Full Clearance)</span>
              </div>
            </div>

            {/* Case Metrics (Completed & Pending) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Completed Land Parcels / Cases</label>
                <input
                  type="number"
                  name="completedCases"
                  className="form-input"
                  value={formData.completedCases}
                  onChange={handleInputChange}
                  min="0"
                />
                <span className="form-helper">Cleared & documented milestones</span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Pending Parcels / Disputed Cases
                </label>
                <input
                  type="number"
                  name="pendingCases"
                  className="form-input"
                  style={{ borderColor: formData.pendingCases > 0 ? '#fca5a5' : undefined }}
                  value={formData.pendingCases}
                  onChange={handleInputChange}
                  min="0"
                />
                <span className="form-helper">Cases requiring resolution or DBT</span>
              </div>
            </div>

            {/* Delay Reason & Expected Target Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Primary Delay Reason (If Any)</label>
                <select
                  name="delayReason"
                  className="form-select"
                  value={formData.delayReason}
                  onChange={handleInputChange}
                >
                  {delayReasonOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="form-helper">Surfaced directly on Senior Officer dashboard</span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expected Completion Date</label>
                <input
                  type="date"
                  name="expectedCompletionDate"
                  className="form-input"
                  value={formData.expectedCompletionDate}
                  onChange={handleInputChange}
                />
                <span className="form-helper">Revised departmental milestone deadline</span>
              </div>
            </div>

            {/* Delay Notes & Field Context */}
            <div className="form-group">
              <label className="form-label">Field Notes & Ground Reality Context</label>
              <textarea
                name="delayNotes"
                className="form-textarea"
                rows={3}
                placeholder="Detail the specific roadblocks (e.g. 32 key agricultural land parcels held up due to multiple family claimants and bank account Aadhaar linkage failures)..."
                value={formData.delayNotes}
                onChange={handleInputChange}
              />
            </div>

            {/* Document Upload Simulation */}
            <div className="form-group">
              <label className="form-label">Upload Supporting Verification Document</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="newDocumentName"
                  className="form-input"
                  placeholder="e.g. 3G_Award_Declaration_Signed.pdf or Drone_LiDAR_Pointcloud.kml"
                  value={formData.newDocumentName}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    if (!formData.newDocumentName) {
                      handleInputChange({ target: { name: 'newDocumentName', value: `Gazette_Notification_Sec_${Math.floor(Math.random()*100)}.pdf` } });
                    }
                  }}
                >
                  <UploadCloud size={14} />
                  Simulate File
                </button>
              </div>
              <span className="form-helper">Valid formats: PDF, GeoJSON, KML, XLSX, DWG</span>
            </div>

            {/* Submission Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onOpenPipeline}
              >
                Inspect Pipeline Impact
              </button>

              <button type="submit" className="btn-primary-action">
                <Save size={16} />
                Submit Department Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Ground Level Case Queue & Disputed Parcels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="workspace-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={16} color="#dc2626" />
              Pending Parcel Verification Queue
            </h3>

            <button
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              onClick={() => setShowAddCaseForm(!showAddCaseForm)}
            >
              <PlusCircle size={12} />
              {showAddCaseForm ? 'Cancel' : 'Add Parcel'}
            </button>
          </div>

          <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Disputed survey numbers and held disbursements causing the bottleneck:
          </p>

          {/* Inline Add Case Form */}
          {showAddCaseForm && (
            <form onSubmit={handleAddCaseSubmit} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
                Record Disputed Land Parcel
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                  placeholder="Survey/Khasra No."
                  value={newCaseData.parcelNo}
                  onChange={(e) => setNewCaseData({ ...newCaseData, parcelNo: e.target.value })}
                  required
                />
                <input
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                  placeholder="Village"
                  value={newCaseData.village}
                  onChange={(e) => setNewCaseData({ ...newCaseData, village: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                  placeholder="Owner Name"
                  value={newCaseData.owner}
                  onChange={(e) => setNewCaseData({ ...newCaseData, owner: e.target.value })}
                  required
                />
                <input
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                  type="number"
                  placeholder="Award (₹ Lakhs)"
                  value={newCaseData.amountLakhs}
                  onChange={(e) => setNewCaseData({ ...newCaseData, amountLakhs: e.target.value })}
                />
              </div>
              <input
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '0.4rem', marginBottom: '0.5rem' }}
                placeholder="Dispute Reason (e.g. Title clash, Aadhaar bank error)"
                value={newCaseData.issue}
                onChange={(e) => setNewCaseData({ ...newCaseData, issue: e.target.value })}
              />
              <button type="submit" className="btn-primary-action" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', width: '100%', justifyContent: 'center' }}>
                Save Parcel to Queue
              </button>
            </form>
          )}

          {/* Cases List */}
          {(!deptData.casesList || deptData.casesList.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
              <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.4rem auto', display: 'block' }} />
              No pending parcel disputes logged for this stage.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '420px', overflowY: 'auto' }}>
              {deptData.casesList.map((c) => {
                const isResolved = c.status === 'Resolved';
                return (
                  <div
                    key={c.id}
                    style={{
                      background: isResolved ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${isResolved ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.parcelNo}</span>
                      <span className={`case-status-chip ${isResolved ? 'case-resolved' : 'case-pending'}`}>
                        {c.status}
                      </span>
                    </div>

                    <div style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <User size={12} /> {c.owner} &bull; <MapPin size={11} /> {c.village}
                    </div>

                    <div style={{ marginTop: '0.3rem', fontSize: '0.74rem', color: '#b91c1c' }}>
                      <strong>Issue:</strong> {c.issue}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>₹{c.amountLakhs} L ({c.areaAcres} Ac)</span>
                      {!isResolved ? (
                        <button
                          type="button"
                          className="btn-resolve-case"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => resolveCase(c.id, 'Dispute cleared in Joint Lok Adalat')}
                        >
                          Resolve & Clear
                        </button>
                      ) : (
                        <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.7rem' }}>✓ Disbursed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Existing Attached Documents */}
        <div className="workspace-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={15} color="#0284c7" />
            Uploaded Gazette & Survey Records ({deptData.documents?.length || 0})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {deptData.documents && deptData.documents.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.74rem', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#0369a1', fontWeight: 600 }}>{doc}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
