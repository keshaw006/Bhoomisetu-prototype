import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useDependencyImpact } from '../hooks/useDependencyImpact';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  FolderGit2, 
  Info,
  Calendar
} from 'lucide-react';

export const PipelineVisualizer = ({ onOpenWorkspaceForStage }) => {
  const { selectedProject, setSelectedProjectId, projects } = useProjects();
  const { stages, primaryBottleneckStage, affectedDownstreamStages, recommendedAction } = useDependencyImpact(selectedProject);
  const [activeStageDetail, setActiveStageDetail] = useState(stages[2] || stages[0]);

  return (
    <div className="pipeline-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <FolderGit2 size={20} color="#2563eb" />
            Land Acquisition Critical Path & Cascading Dependency Flow
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
            Linear dependency: Survey (15%) &rarr; Legal (15%) &rarr; Compensation (30%) &rarr; Rehabilitation (25%) &rarr; Possession (15%)
          </p>
        </div>

        {/* Project Selector for Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>Active Project:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.82rem', fontWeight: 600 }}
            value={selectedProject.id}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.title.split('(')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Pipeline Sequence */}
      <div className="pipeline-diagram">
        {stages.map((stage, idx) => {
          const isBottleneck = primaryBottleneckStage && primaryBottleneckStage.id === stage.id;
          const isDownstreamBlocked = affectedDownstreamStages.some(s => s.id === stage.id);
          const isCompleted = stage.progress >= 100;

          let nodeClass = 'pipeline-node';
          if (isCompleted) nodeClass += ' stage-completed';
          else if (isBottleneck) nodeClass += ' stage-bottleneck';
          else if (isDownstreamBlocked) nodeClass += ' stage-downstream-blocked';

          let statusIcon = <Clock size={13} />;
          if (isCompleted) statusIcon = <CheckCircle2 size={13} color="#10b981" />;
          else if (isBottleneck) statusIcon = <AlertOctagon size={13} color="#ef4444" />;
          else if (isDownstreamBlocked) statusIcon = <AlertTriangle size={13} color="#f59e0b" />;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={nodeClass}
                onClick={() => setActiveStageDetail(stage)}
                style={{
                  cursor: 'pointer',
                  borderWidth: activeStageDetail?.id === stage.id ? '2px' : undefined,
                  boxShadow: activeStageDetail?.id === stage.id ? '0 0 0 3px rgba(37,99,235,0.2)' : undefined
                }}
              >
                <div className="node-top">
                  <span className="node-title">{stage.shortName}</span>
                  <span className="node-weight">{stage.weightPercent}% Wt</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="node-progress-val">{stage.progress}%</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>/ {stage.plannedProgress}%</span>
                </div>

                <div className="node-bar">
                  <div
                    className="node-bar-fill"
                    style={{
                      width: `${stage.progress}%`,
                      backgroundColor: isCompleted ? '#10b981' : isBottleneck ? '#ef4444' : isDownstreamBlocked ? '#f59e0b' : '#3b82f6'
                    }}
                  />
                </div>

                <div className="node-subinfo">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    {statusIcon}
                    {isCompleted ? 'Done' : isBottleneck ? 'Bottleneck' : isDownstreamBlocked ? 'Blocked' : 'Active'}
                  </span>
                  <span>{stage.pendingCases} pending</span>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="pipeline-arrow">
                  <div className={`arrow-line ${isBottleneck ? 'blocked' : ''}`} />
                  <ArrowRight size={14} color={isBottleneck ? '#ef4444' : '#94a3b8'} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cascading Impact Alert Box */}
      {affectedDownstreamStages.length > 0 && primaryBottleneckStage && (
        <div className="cascade-impact-box">
          <AlertOctagon size={20} color="#b45309" style={{ flexShrink: 0 }} />
          <div>
            <strong>Cascading Dependency Impact: </strong>
            Because <strong>{primaryBottleneckStage.shortName}</strong> is delayed by {primaryBottleneckStage.lag}%, the following downstream stages are currently obstructed:
            <ul style={{ margin: '0.35rem 0 0.35rem 1.2rem', lineHeight: 1.4 }}>
              {affectedDownstreamStages.map(s => (
                <li key={s.id}>
                  <strong>{s.shortName}</strong>: {s.reason}. Projected impact: +{s.projectedDelayWeeks} weeks slippage.
                </li>
              ))}
            </ul>
            <span>
              <strong>Resolution:</strong> Completing the {primaryBottleneckStage.pendingCases} pending cases in {primaryBottleneckStage.shortName} will immediately release downstream progression.
            </span>
          </div>
        </div>
      )}

      {/* Selected Stage Detail Drawer */}
      {activeStageDetail && (
        <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                  {activeStageDetail.name} ({activeStageDetail.shortName})
                </h3>
                <span className="sih-tag" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
                  Stage Weight: {activeStageDetail.weightPercent}%
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                Assigned Authority: {activeStageDetail.id === 'compensation' ? 'Special Land Acquisition Officer (DLAO)' : 'Department Taskforce'}
              </p>
            </div>

            <button
              className="btn-primary-action"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              onClick={() => onOpenWorkspaceForStage(activeStageDetail.id)}
            >
              Open Department Workspace
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>COMPLETED CASES</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{activeStageDetail.completedCases}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>PENDING CASES</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: activeStageDetail.pendingCases > 0 ? '#ef4444' : '#0f172a' }}>
                {activeStageDetail.pendingCases}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>TARGET DATE</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} color="#64748b" />
                {activeStageDetail.expectedCompletionDate || 'Not specified'}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>PRIMARY DELAY CAUSE</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b91c1c', marginTop: '0.2rem' }}>
                {activeStageDetail.delayReason || 'None'}
              </div>
            </div>
          </div>

          {activeStageDetail.delayNotes && (
            <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3', fontSize: '0.82rem', color: '#9f1239' }}>
              <strong>Department Field Notes:</strong> {activeStageDetail.delayNotes}
            </div>
          )}

          {activeStageDetail.documents && activeStageDetail.documents.length > 0 && (
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Supporting Documents:</span>
              {activeStageDetail.documents.map((doc, idx) => (
                <span key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0369a1' }}>
                  <FileCheck2 size={12} />
                  {doc}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
