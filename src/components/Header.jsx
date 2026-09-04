import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { 
  Building2, 
  RotateCcw, 
  UserCheck, 
  Layers, 
  BarChart3, 
  Workflow, 
  FileText,
  FolderPlus,
  TrendingUp
} from 'lucide-react';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  onOpenDirectiveModal,
  onOpenAddProjectModal,
  onOpenUpdateProgressModal
}) => {
  const { currentUser, userRoles, switchRole } = useAuth();
  const { resetDemoData } = useProjects();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-logo-badge">
              <Building2 size={24} />
            </div>
            <div className="brand-title-group">
              <h1>
                Bhoomisetu 
                <span style={{ fontSize: '0.9em', color: '#f59e0b' }}>भूमिसेतु</span>
                <span className="sih-tag">SIH26016</span>
              </h1>
              <p className="brand-subtitle">
                Centralized Land Acquisition & Inter-Departmental Control Hub
              </p>
            </div>
          </div>

          <div className="header-actions">
            <div className="role-selector-card">
              <label htmlFor="role-select">Active Role:</label>
              <select
                id="role-select"
                className="role-select-dropdown"
                value={currentUser.id}
                onChange={(e) => switchRole(e.target.value)}
              >
                {userRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.badge} — {r.name.split('(')[0]}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="demo-reset-btn" 
              onClick={resetDemoData}
              title="Reset state to initial SIH demonstration scenario"
            >
              <RotateCcw size={13} />
              Reset Demo
            </button>
          </div>
        </div>
      </header>

      {/* Role Context Bar */}
      <div className="role-banner">
        <div className="role-banner-inner">
          <div className="role-identity">
            <span className="user-badge">
              <UserCheck size={14} />
              {currentUser.badge}
            </span>
            <span className="user-desc">
              {currentUser.description}
            </span>
          </div>

          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'management' ? 'active' : ''}`}
              onClick={() => setActiveTab('management')}
            >
              <BarChart3 size={15} />
              Executive Dashboard
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('pipeline')}
            >
              <Workflow size={15} />
              Dependency Pipeline
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'department' ? 'active' : ''}`}
              onClick={() => setActiveTab('department')}
            >
              <Layers size={15} />
              Department Workspace
            </button>

            {(currentUser.id === 'senior_officer' || currentUser.id === 'project_manager') && (
              <button
                className="nav-tab-btn"
                style={{ color: '#b91c1c', background: '#fee2e2' }}
                onClick={onOpenDirectiveModal}
              >
                <FileText size={15} />
                Issue Directive
              </button>
            )}

            <button
              className="nav-tab-btn header-add-proj-btn"
              onClick={onOpenAddProjectModal}
              title="Manually register a new infrastructure corridor"
            >
              <FolderPlus size={15} />
              + New Project
            </button>

            <button
              className="nav-tab-btn header-update-prog-btn"
              onClick={() => onOpenUpdateProgressModal()}
              title="Log milestone or stage progress update"
            >
              <TrendingUp size={15} />
              Update Progress
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};
