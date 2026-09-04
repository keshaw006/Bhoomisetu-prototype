import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { X, CheckCircle2, ShieldAlert, Scale, User, MapPin, IndianRupee } from 'lucide-react';

export const CaseResolutionModal = ({ isOpen, onClose, targetDepartmentId }) => {
  const { selectedProject, resolveParcelCase } = useProjects();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('Verification completed via Joint Gram Panchayat session; DBT bank KYC validated.');

  if (!isOpen) return null;

  const deptId = targetDepartmentId || 'compensation';
  const dept = selectedProject?.departments?.[deptId];
  const cases = dept?.casesList || [];

  const handleResolve = (caseItem) => {
    resolveParcelCase(
      selectedProject.id,
      deptId,
      caseItem.id,
      resolutionNote
    );
    setSelectedCaseId(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={22} color="#dc2626" />
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>
                Pending Land Parcel Disputes & Verification Cases
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {selectedProject.title} — {deptId.toUpperCase()} DEPARTMENT ({dept?.pendingCases || 0} Total Pending Cases)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#1e40af' }}>
            <strong>Executive Bottleneck Resolution Mode:</strong> Resolving disputes below automatically decrements pending case backlog, increases actual progress %, and clears downstream blocks for Rehabilitation & Possession.
          </div>

          {cases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>No individual flagged parcel disputes recorded for this department.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="cases-table">
                <thead>
                  <tr>
                    <th>Parcel / Survey No</th>
                    <th>Landowner & Village</th>
                    <th>Area & Value</th>
                    <th>Flagged Dispute Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => {
                    const isResolved = c.status === 'Resolved';
                    return (
                      <tr key={c.id} style={{ background: isResolved ? '#f0fdf4' : undefined }}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>
                          {c.parcelNo}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <User size={13} color="#64748b" />
                            {c.owner}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <MapPin size={11} />
                            {c.village}
                          </div>
                        </td>
                        <td>
                          <div>{c.areaAcres} Acres</div>
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                            <IndianRupee size={10} />
                            {c.amountLakhs} L
                          </div>
                        </td>
                        <td style={{ maxWidth: '220px', fontSize: '0.78rem', color: '#475569' }}>
                          {c.issue}
                          {c.resolutionNote && (
                            <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: '0.2rem' }}>
                              <strong>Resolved:</strong> {c.resolutionNote}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`case-status-chip ${isResolved ? 'case-resolved' : 'case-pending'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          {isResolved ? (
                            <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={13} />
                              Cleared
                            </span>
                          ) : (
                            <button
                              className="btn-resolve-case"
                              onClick={() => handleResolve(c)}
                              title="Resolve dispute and authorize award"
                            >
                              Resolve & Disburse
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
