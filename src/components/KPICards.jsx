import React from 'react';
import { useProjectAnalytics } from '../hooks/useProjectAnalytics';
import { 
  FolderKanban, 
  CheckCircle2, 
  AlertTriangle, 
  ClockAlert, 
  TrendingUp, 
  LandPlot 
} from 'lucide-react';

export const KPICards = () => {
  const {
    totalProjects,
    onTrackCount,
    atRiskCount,
    delayedCount,
    averageProgress,
    totalLandHa
  } = useProjectAnalytics();

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div>
          <div className="kpi-info-label">Total Corridors</div>
          <div className="kpi-value">{totalProjects}</div>
          <div className="kpi-subtext">Active Mega Projects</div>
        </div>
        <div className="kpi-icon-badge kpi-blue">
          <FolderKanban size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div>
          <div className="kpi-info-label">On Track</div>
          <div className="kpi-value" style={{ color: '#059669' }}>{onTrackCount}</div>
          <div className="kpi-subtext">Meeting schedule variance &lt; 5%</div>
        </div>
        <div className="kpi-icon-badge kpi-green">
          <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div>
          <div className="kpi-info-label">At Risk</div>
          <div className="kpi-value" style={{ color: '#d97706' }}>{atRiskCount}</div>
          <div className="kpi-subtext">Schedule lag between 5% - 15%</div>
        </div>
        <div className="kpi-icon-badge kpi-amber">
          <AlertTriangle size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div>
          <div className="kpi-info-label">Delayed</div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>{delayedCount}</div>
          <div className="kpi-subtext">Schedule lag &gt; 15% or bottlenecked</div>
        </div>
        <div className="kpi-icon-badge kpi-red">
          <ClockAlert size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div>
          <div className="kpi-info-label">Avg. Progress</div>
          <div className="kpi-value">{averageProgress}%</div>
          <div className="kpi-subtext">{totalLandHa.toLocaleString()} Ha total linear ROW</div>
        </div>
        <div className="kpi-icon-badge kpi-purple">
          <TrendingUp size={24} />
        </div>
      </div>
    </div>
  );
};
