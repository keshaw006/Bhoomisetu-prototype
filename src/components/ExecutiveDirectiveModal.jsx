import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { X, Send, AlertTriangle } from 'lucide-react';

export const ExecutiveDirectiveModal = ({ isOpen, onClose }) => {
  const { selectedProject, addExecutiveDirective, projects, setSelectedProjectId } = useProjects();
  const { currentUser } = useAuth();
  const [directiveText, setDirectiveText] = useState('');
  const [priority, setPriority] = useState('High');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!directiveText.trim()) return;

    addExecutiveDirective(
      selectedProject.id, 
      `[${priority.toUpperCase()} PRIORITY] ${directiveText.trim()}`,
      currentUser.name
    );
    setDirectiveText('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <h3 style={{ fontSize: '1.1rem' }}>Issue Executive Intervention Directive</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Target Infrastructure Project</label>
              <select
                className="form-select"
                value={selectedProject.id}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Authority</label>
              <input
                type="text"
                className="form-input"
                readOnly
                value={`${currentUser.name} (${currentUser.badge})`}
                style={{ background: '#f8fafc', color: '#475569' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Intervention Priority Level</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Urgent">Immediate / Fast-Track Lok Adalat (24-48 Hours)</option>
                <option value="High">High Priority Inter-Departmental Joint Review</option>
                <option value="Medium">Regular Department Escalation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Directive Order / Action Items</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. Convene a special Lok Adalat camp on Saturday in Tehsil office to resolve the 32 pending landowner heirship disputes and unblock Compensation disbursement."
                value={directiveText}
                onChange={(e) => setDirectiveText(e.target.value)}
                required
              />
              <span className="form-helper">
                This directive will be dispatched to the DLAO, CALA, and respective Department Heads with mandatory compliance tracking.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-action" style={{ background: '#dc2626' }}>
              <Send size={15} />
              Broadcast Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
