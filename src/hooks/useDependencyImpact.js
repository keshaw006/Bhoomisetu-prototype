import { useMemo } from 'react';
import { DEPARTMENTS } from '../data/mockData';

export const useDependencyImpact = (project) => {
  const analysis = useMemo(() => {
    if (!project || !project.departments) {
      return {
        stages: [],
        primaryBottleneckStage: null,
        affectedDownstreamStages: [],
        hasCascadingRisk: false,
        recommendedAction: null
      };
    }

    // Sequence of land acquisition stages
    const stageSequence = ['survey', 'legal', 'compensation', 'rehabilitation', 'possession'];
    
    let primaryBottleneckStage = null;
    let bottleneckIndex = -1;
    let maxDelayLag = -1;

    // Analyze each stage in sequence
    const analyzedStages = stageSequence.map((stageId, index) => {
      const deptMeta = DEPARTMENTS.find(d => d.id === stageId);
      const stageData = project.departments[stageId] || { progress: 0, plannedProgress: 0 };
      const lag = Math.max(0, (stageData.plannedProgress || 0) - (stageData.progress || 0));

      const isCompleted = stageData.progress >= 100;
      const isDelayed = stageData.status === 'Delayed' || lag > 15;
      const isAtRisk = stageData.status === 'At Risk' || (lag > 5 && lag <= 15);

      if (isDelayed && lag > maxDelayLag && primaryBottleneckStage === null) {
        maxDelayLag = lag;
        primaryBottleneckStage = {
          id: stageId,
          name: deptMeta.name,
          shortName: deptMeta.shortName,
          progress: stageData.progress,
          plannedProgress: stageData.plannedProgress,
          lag,
          pendingCases: stageData.pendingCases || 0,
          delayReason: stageData.delayReason || 'Operational delay',
          delayNotes: stageData.delayNotes || '',
          weight: deptMeta.weight * 100
        };
        bottleneckIndex = index;
      }

      return {
        id: stageId,
        index,
        name: deptMeta.name,
        shortName: deptMeta.shortName,
        weightPercent: Math.round(deptMeta.weight * 100),
        progress: stageData.progress || 0,
        plannedProgress: stageData.plannedProgress || 0,
        lag,
        status: stageData.status || (isCompleted ? 'Completed' : isDelayed ? 'Delayed' : 'On Track'),
        pendingCases: stageData.pendingCases || 0,
        completedCases: stageData.completedCases || 0,
        delayReason: stageData.delayReason,
        delayNotes: stageData.delayNotes,
        expectedCompletionDate: stageData.expectedCompletionDate,
        lastUpdated: stageData.lastUpdated,
        casesList: stageData.casesList || [],
        documents: stageData.documents || [],
        dependsOn: deptMeta.dependsOn
      };
    });

    // Identify downstream impacted stages
    const affectedDownstreamStages = [];
    if (bottleneckIndex !== -1 && bottleneckIndex < stageSequence.length - 1) {
      for (let i = bottleneckIndex + 1; i < stageSequence.length; i++) {
        const nextStage = analyzedStages[i];
        affectedDownstreamStages.push({
          ...nextStage,
          impactType: i === bottleneckIndex + 1 ? 'Direct Blocker' : 'Secondary Delay',
          projectedDelayWeeks: Math.ceil(maxDelayLag / 5) * (i - bottleneckIndex),
          reason: `Awaiting completion / clearance from ${primaryBottleneckStage.shortName}`
        });
      }
    }

    // Formulate actionable recommendation
    let recommendedAction = null;
    if (primaryBottleneckStage) {
      if (primaryBottleneckStage.id === 'compensation') {
        recommendedAction = {
          priority: 'Urgent',
          title: `Intervene in ${primaryBottleneckStage.pendingCases} Pending Compensation Verification Cases`,
          description: `Compensation is lagging by ${primaryBottleneckStage.lag}%. Conduct a special revenue Lok Adalat or DLAO camp to clear heirship disputes and bank Aadhaar mapping for the ${primaryBottleneckStage.pendingCases} pending parcels.`,
          downstreamWarning: `Clearing this will unblock ${affectedDownstreamStages.map(s => s.shortName).join(' and ')}.`
        };
      } else if (primaryBottleneckStage.id === 'legal') {
        recommendedAction = {
          priority: 'High',
          title: `Fast-Track Gazette 3D & Objection Hearings`,
          description: `Legal title verification is behind by ${primaryBottleneckStage.lag}%. Direct the Competent Authority to finalize inquiry reports for the ${primaryBottleneckStage.pendingCases} pending objections.`,
          downstreamWarning: `Prevents disbursement delays in Compensation awards.`
        };
      } else if (primaryBottleneckStage.id === 'survey') {
        recommendedAction = {
          priority: 'High',
          title: `Deploy Additional DGPS & Drone Teams`,
          description: `Boundary demarcation is lagging. Authorize private survey agency empanelment to complete drone flights for pending parcels.`,
          downstreamWarning: `Required before 3D legal notice publication.`
        };
      } else {
        recommendedAction = {
          priority: 'Moderate',
          title: `Review Inter-Departmental Coordination for ${primaryBottleneckStage.shortName}`,
          description: `${primaryBottleneckStage.shortName} shows ${primaryBottleneckStage.lag}% schedule delay with ${primaryBottleneckStage.pendingCases} pending cases.`,
          downstreamWarning: 'May delay handover to civil contractor.'
        };
      }
    }

    return {
      stages: analyzedStages,
      primaryBottleneckStage,
      affectedDownstreamStages,
      hasCascadingRisk: affectedDownstreamStages.length > 0,
      recommendedAction
    };
  }, [project]);

  return analysis;
};
