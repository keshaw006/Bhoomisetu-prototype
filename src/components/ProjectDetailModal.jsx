import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { DEPARTMENTS } from '../data/mockData';
import { 
  X, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Layers, 
  FileText,
  TrendingUp 
} from 'lucide-react';

export const ProjectDetailModal = ({ project, isOpen, onClose, onOpenWorkspace, onOpenUpdateProgress }) => {
  const { calculateProjectMetrics } = useProjects();

  if (!isOpen || !project) return null;

  const metrics = calculateProjectMetrics(project);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="proj-code-badge">{project.code}</span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>{project.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} /> {project.district}, {project.state}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <IndianRupee size={13} /> ₹{project.budgetCrores} Crores
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building2 size={13} /> {project.totalLandHa} Hectares Linear ROW
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          {/* Progress Overview */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>WEIGHTED OVERALL COMPLETION</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                  {metrics.overallProgress}%
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginLeft: '0.5rem' }}>
                    (Planned Milestone: {project.plannedProgress}%)
                  </span>
                </div>
              </div>
              <span className={`status-badge status-${metrics.calculatedStatus.toLowerCase().replace(' ', '')}`}>
                {metrics.calculatedStatus} (Variance: -{metrics.scheduleVariance}%)
              </span>
            </div>

            <div className="progress-bar-bg" style={{ height: '10px' }}>
              <div
                className={`progress-bar-fill ${metrics.calculatedStatus.toLowerCase().replace(' ', '')}`}
                style={{ width: `${metrics.overallProgress}%` }}
              />
              <div 
                className="planned-benchmark-marker" 
                style={{ left: `${project.plannedProgress}%` }}
                title={`Planned Milestone: ${project.plannedProgress}%`}
              />
            </div>
          </div>

          {/* Department Breakdown Table */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={16} color="#2563eb" />
            Inter-Departmental Accountability & Stage Progression
          </h4>

          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Department Stage</th>
                  <th>Weight</th>
                  <th>Progress / Target</th>
                  <th>Cases (Comp / Pend)</th>
                  <th>Status</th>
                  <th>Reported Delay Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => {
                  const stage = project.departments[dept.id] || { progress: 0, plannedProgress: 0 };
                  const isDelayed = stage.status === 'Delayed';
                  const isCompleted = stage.progress >= 100;

                  return (
                    <tr key={dept.id}>
                      <td style={{ fontWeight: 700 }}>
                        {dept.shortName}
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>
                          {dept.roleTitle}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{dept.weight * 100}%</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{stage.progress}%</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Target: {stage.plannedProgress}%</div>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{stage.completedCases || 0}</span> / 
                        <span style={{ color: stage.pendingCases > 0 ? '#ef4444' : '#64748b', fontWeight: 600, marginLeft: '3px' }}>
                          {stage.pendingCases || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`case-status-chip ${isCompleted ? 'case-resolved' : isDelayed ? 'case-pending' : ''}`}>
                          {stage.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '0.76rem' }}>
                        {stage.delayReason && stage.delayReason !== 'None' ? (
                          <span style={{ color: '#b91c1c' }}>{stage.delayReason}</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>Nominal</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            className="btn-resolve-case"
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: '#059669', borderColor: '#059669' }}
                            onClick={() => {
                              onClose();
                              if (onOpenUpdateProgress) onOpenUpdateProgress(project.id, dept.id);
                            }}
                            title="Directly update stage progress percentage"
                          >
                            Update
                          </button>
                          <button
                            className="btn-resolve-case"
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => {
                              onClose();
                              onOpenWorkspace(dept.id);
                            }}
                            title="Open detailed department desk"
                          >
                            Desk
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Directives Section */}
          {project.executiveDirectives && project.executiveDirectives.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#991b1b' }}>
                <FileText size={16} />
                Executive Intervention Directives on Record
              </h4>
              {project.executiveDirectives.map((dir, i) => (
                <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#991b1b', marginBottom: '0.2rem' }}>
                    <span>Issued by: {dir.by}</span>
                    <span>Date: {dir.date}</span>
                  </div>
                  <div style={{ color: '#7f1d1d' }}>{dir.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            className="btn-primary-action"
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            onClick={() => {
              onClose();
              if (onOpenUpdateProgress) onOpenUpdateProgress(project.id);
            }}
          >
            <TrendingUp size={15} />
            Update Corridor Progress
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
