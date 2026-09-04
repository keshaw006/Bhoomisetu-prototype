import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { useDependencyImpact } from '../hooks/useDependencyImpact';
import { AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';

export const BottleneckAlert = ({ onResolveCasesClick, onOpenPipelineClick }) => {
  const { selectedProject } = useProjects();
  const { primaryBottleneckStage, affectedDownstreamStages, recommendedAction } = useDependencyImpact(selectedProject);

  if (!primaryBottleneckStage) {
    return null;
  }

  return (
    <div className="bottleneck-alert-banner">
      <div className="bottleneck-left">
        <div className="alert-pulse-icon">
          <AlertOctagon size={22} />
        </div>
        <div className="alert-content">
          <h3>
            Critical Project Bottleneck Detected: {selectedProject.title}
          </h3>
          <p>
            <strong>{primaryBottleneckStage.shortName}</strong> is running at <strong>{primaryBottleneckStage.progress}%</strong> against a planned milestone of <strong>{primaryBottleneckStage.plannedProgress}%</strong> ({primaryBottleneckStage.lag}% schedule lag).
            {primaryBottleneckStage.pendingCases > 0 && ` There are ${primaryBottleneckStage.pendingCases} unresolved pending parcel cases.`}
          </p>
          
          <div className="bottleneck-meta-pills">
            <span className="meta-pill danger">
              Delay: -{primaryBottleneckStage.lag}% Behind Schedule
            </span>
            <span className="meta-pill warning">
              Cause: {primaryBottleneckStage.delayReason}
            </span>
            {affectedDownstreamStages.length > 0 && (
              <span className="meta-pill info">
                Cascading Risk: Blocks {affectedDownstreamStages.map(s => s.shortName).join(' & ')}
              </span>
            )}
          </div>

          {recommendedAction && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#881337' }}>
              <strong>Recommended Action:</strong> {recommendedAction.title} — {recommendedAction.description}
            </div>
          )}
        </div>
      </div>

      <div className="bottleneck-actions">
        {primaryBottleneckStage.pendingCases > 0 && (
          <button
            className="btn-resolve-bottleneck"
            onClick={() => onResolveCasesClick(primaryBottleneckStage.id)}
          >
            <ShieldAlert size={15} />
            Review {primaryBottleneckStage.pendingCases} Cases
          </button>
        )}
        <button
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.6rem 0.9rem' }}
          onClick={onOpenPipelineClick}
        >
          View Pipeline
          <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
};
