import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { useProjectAnalytics } from '../hooks/useProjectAnalytics';
import { DEPARTMENTS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  MapPin, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  Building,
  FolderPlus,
  TrendingUp,
  Plus
} from 'lucide-react';

export const ManagementDashboard = ({ 
  onOpenDetailModal, 
  onOpenPipeline, 
  onOpenAddProject, 
  onOpenUpdateProgress 
}) => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    districtFilter,
    setDistrictFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery
  } = useProjects();

  const {
    filteredProjects,
    topBottlenecks,
    sortedDelayReasons
  } = useProjectAnalytics();

  // Distinct districts for dropdown
  const districts = ['All', 'Nashik', 'Palghar & Thane', 'Varanasi & Chandauli', 'Bengaluru Urban'];

  return (
    <div>
      {/* Search & Filter Controls */}
      <div className="toolbar-bar">
        <div className="search-input-group">
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search corridors by name, code, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="select-filter">
            <Filter size={14} />
            <span>District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="select-filter">
            <span>Health Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
        </div>

        {/* Dashboard Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            className="btn-primary-action"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', whiteSpace: 'nowrap' }}
            onClick={onOpenAddProject}
            title="Manually register a new corridor"
          >
            <FolderPlus size={15} />
            + Add Corridor
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
            onClick={() => onOpenUpdateProgress()}
            title="Update stage progress or log milestone for corridors"
          >
            <TrendingUp size={15} />
            Log Progress
          </button>
        </div>
      </div>

      {/* Main Analytics Layout */}
      <div className="analytics-two-col">
        {/* Left Column: Projects Overview List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Active Infrastructure Corridors ({filteredProjects.length})
              </h2>
            </div>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Click card to set active project &bull; Inspect for department drill-down
            </span>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              const { overallProgress, calculatedStatus, scheduleVariance } = proj.metrics;
              const statusClass = calculatedStatus.toLowerCase().replace(' ', '');

              return (
                <div
                  key={proj.id}
                  className={`project-summary-card ${isSelected ? 'active-selected' : ''}`}
                  onClick={() => setSelectedProjectId(proj.id)}
                >
                  <div className="project-card-top">
                    <div>
                      <span className="proj-code-badge">{proj.code}</span>
                      <h3 className="proj-title">{proj.title}</h3>
                      <div className="proj-district">
                        <MapPin size={12} />
                        {proj.district}, {proj.state} &bull; {proj.totalLandHa} Ha &bull; ₹{proj.budgetCrores} Cr
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-badge status-${statusClass}`}>
                        {calculatedStatus}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Variance: {scheduleVariance > 0 ? `-${scheduleVariance}% Lag` : '+Ahead'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar with Milestone Benchmark */}
                  <div className="progress-container">
                    <div className="progress-header">
                      <span>Overall Progress (Weighted)</span>
                      <span style={{ fontWeight: 800 }}>{overallProgress}%</span>
                    </div>

                    <div className="progress-bar-bg">
                      <div
                        className={`progress-bar-fill ${statusClass}`}
                        style={{ width: `${overallProgress}%` }}
                      />
                      <div
                        className="planned-benchmark-marker"
                        style={{ left: `${proj.plannedProgress}%` }}
                        title={`Planned Target: ${proj.plannedProgress}%`}
                      />
                    </div>

                    <div className="progress-stats-row">
                      <span>Target Milestone: {proj.plannedProgress}%</span>
                      <span>Month {proj.currentMonth} of {proj.durationMonths}</span>
                    </div>
                  </div>

                  {/* Department Stage Chips */}
                  <div className="dept-chips-row">
                    {DEPARTMENTS.map((dept) => {
                      const dData = proj.departments[dept.id] || { progress: 0 };
                      const isDone = dData.progress >= 100;
                      const isLagging = dData.status === 'Delayed';
                      const isAtRisk = dData.status === 'At Risk';

                      let chipStyle = 'completed';
                      let icon = '✅';
                      if (isDone) {
                        chipStyle = 'completed';
                        icon = '✅';
                      } else if (isLagging) {
                        chipStyle = 'delayed';
                        icon = '🔴';
                      } else if (isAtRisk) {
                        chipStyle = 'atrisk';
                        icon = '🟡';
                      } else {
                        chipStyle = 'ontrack';
                        icon = '🔷';
                      }

                      return (
                        <div key={dept.id} className={`dept-chip ${chipStyle}`} title={`${dept.name}: ${dData.progress}% (${dData.status})`}>
                          <span>{icon}</span>
                          <span>{dept.shortName}:</span>
                          <strong>{dData.progress}%</strong>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer actions on Card */}
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Nodal Officer: {proj.nodalOfficer.split('(')[0]}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(proj.id);
                          onOpenUpdateProgress(proj.id);
                        }}
                        title="Update stage progress and milestones for this corridor"
                      >
                        <TrendingUp size={12} />
                        Update Progress
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(proj.id);
                          onOpenDetailModal(proj);
                        }}
                      >
                        <Eye size={12} />
                        Full Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Executive Insights & Aggregated Bottlenecks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Bottlenecks Summary Box */}
          <div className="card-panel">
            <h3 className="panel-title">
              <AlertOctagon size={18} color="#dc2626" />
              Critical Bottleneck Heatmap
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Departments causing highest critical path delays across all corridors:
            </p>

            {topBottlenecks.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#059669', fontStyle: 'italic' }}>
                All departments performing within nominal thresholds.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {topBottlenecks.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#991b1b' }}>
                        {b.name}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                        Primary blocker in {b.count} corridor{b.count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                      {b.count} Projects
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Reported Reasons for Delay */}
          <div className="card-panel">
            <h3 className="panel-title">
              <TrendingDown size={18} color="#f59e0b" />
              Root Causes Behind Schedule Lags
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Aggregated from field officer weekly submissions:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sortedDelayReasons.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#1e293b' }}>
                    <span>{item.reason}</span>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>{item.count} hits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="card-panel" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#bfdbfe' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={16} />
              Bhoomisetu Decision Intelligence
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#1e3a8a', lineHeight: 1.45 }}>
              The system automatically flags downstream stages when upstream milestones lag. For instance, delays in <strong>Compensation</strong> automatically hold back <strong>Rehabilitation</strong> and <strong>Possession</strong> handovers.
            </p>
            <button
              className="btn-primary-action"
              style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
              onClick={onOpenPipeline}
            >
              Inspect Active Corridor Critical Path
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
