import { useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import { DEPARTMENTS } from '../data/mockData';

export const useProjectAnalytics = () => {
  const {
    projects,
    selectedProjectId,
    districtFilter,
    statusFilter,
    searchQuery,
    calculateProjectMetrics
  } = useProjects();

  const analytics = useMemo(() => {
    let totalProjects = projects.length;
    let onTrackCount = 0;
    let atRiskCount = 0;
    let delayedCount = 0;
    let totalProgressSum = 0;
    let totalLandHa = 0;
    let totalBudgetCrores = 0;

    // Bottlenecks count per department
    const bottleneckCounts = {
      survey: 0,
      legal: 0,
      compensation: 0,
      rehabilitation: 0,
      possession: 0
    };

    // Reasons aggregation
    const delayReasons = {};

    const enrichedProjects = projects.map(proj => {
      const metrics = calculateProjectMetrics(proj);
      totalLandHa += proj.totalLandHa || 0;
      totalBudgetCrores += proj.budgetCrores || 0;
      totalProgressSum += metrics.overallProgress;

      if (metrics.calculatedStatus === 'On Track') onTrackCount++;
      else if (metrics.calculatedStatus === 'At Risk') atRiskCount++;
      else if (metrics.calculatedStatus === 'Delayed') delayedCount++;

      if (metrics.criticalBottleneck && metrics.criticalBottleneck.lag > 10) {
        bottleneckCounts[metrics.criticalBottleneck.departmentId] = 
          (bottleneckCounts[metrics.criticalBottleneck.departmentId] || 0) + 1;
      }

      // Collect delay reasons
      Object.values(proj.departments).forEach(dept => {
        if (dept.delayReason && dept.delayReason !== 'None') {
          delayReasons[dept.delayReason] = (delayReasons[dept.delayReason] || 0) + 1;
        }
      });

      return {
        ...proj,
        metrics
      };
    });

    const averageProgress = totalProjects > 0 ? Math.round(totalProgressSum / totalProjects) : 0;

    // Filter projects according to user selection
    const filteredProjects = enrichedProjects.filter(p => {
      const matchesDistrict = districtFilter === 'All' || p.district.toLowerCase().includes(districtFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.metrics.calculatedStatus === statusFilter;
      const matchesSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistrict && matchesStatus && matchesSearch;
    });

    // Sort bottleneck departments by frequency
    const topBottlenecks = Object.entries(bottleneckCounts)
      .map(([deptId, count]) => {
        const d = DEPARTMENTS.find(dept => dept.id === deptId);
        return {
          id: deptId,
          name: d?.name || deptId,
          shortName: d?.shortName || deptId,
          color: d?.color || '#94a3b8',
          count
        };
      })
      .filter(b => b.count > 0)
      .sort((a, b) => b.count - a.count);

    // Sort top delay reasons
    const sortedDelayReasons = Object.entries(delayReasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProjects,
      onTrackCount,
      atRiskCount,
      delayedCount,
      averageProgress,
      totalLandHa: Math.round(totalLandHa),
      totalBudgetCrores: Math.round(totalBudgetCrores),
      topBottlenecks,
      sortedDelayReasons,
      enrichedProjects,
      filteredProjects
    };
  }, [projects, districtFilter, statusFilter, searchQuery, calculateProjectMetrics]);

  return analytics;
};
