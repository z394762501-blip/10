import React, { useMemo } from 'react';
import { Phase } from '../../types/project';
import { useLanguage } from '../../hooks/useLanguage';
import { Calendar, Clock } from 'lucide-react';

interface GanttChartProps {
  phases: Phase[];
}

export default function GanttChart({ phases }: GanttChartProps) {
  const { t } = useLanguage();

  // Calculate the date range and positioning
  const chartData = useMemo(() => {
    // Filter phases with dates
    const phasesWithDates = phases.filter(p => p.startDate && p.endDate);

    if (phasesWithDates.length === 0) {
      return null;
    }

    // Find the earliest start date and latest end date
    const allDates = phasesWithDates.flatMap(p => [
      new Date(p.startDate!),
      new Date(p.endDate!)
    ]);

    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

    // Calculate total days
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate positions for each phase
    const phasePositions = phasesWithDates.map(phase => {
      const start = new Date(phase.startDate!);
      const end = new Date(phase.endDate!);

      const startOffset = Math.floor((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      return {
        phase,
        startOffset,
        duration,
        startPercent: (startOffset / totalDays) * 100,
        widthPercent: (duration / totalDays) * 100
      };
    });

    return {
      minDate,
      maxDate,
      totalDays,
      phasePositions
    };
  }, [phases]);

  // Generate month labels
  const monthLabels = useMemo(() => {
    if (!chartData) return [];

    const labels: Array<{ label: string; position: number; width: number }> = [];
    const current = new Date(chartData.minDate);
    const end = new Date(chartData.maxDate);

    while (current <= end) {
      const monthStart = new Date(current);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      const displayEnd = monthEnd > end ? end : monthEnd;

      const startOffset = Math.floor((monthStart.getTime() - chartData.minDate.getTime()) / (1000 * 60 * 60 * 24));
      const endOffset = Math.floor((displayEnd.getTime() - chartData.minDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysInMonth = endOffset - startOffset + 1;

      labels.push({
        label: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        position: (startOffset / chartData.totalDays) * 100,
        width: (daysInMonth / chartData.totalDays) * 100
      });

      current.setMonth(current.getMonth() + 1);
      current.setDate(1);
    }

    return labels;
  }, [chartData]);

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">{t('gantt.noDateData')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('gantt.addDatesToPhases')}</p>
        </div>
      </div>
    );
  }

  const getPhaseColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-rose-500'
    ];
    return colors[index % colors.length];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('gantt.title')}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(chartData.minDate)} - {formatDate(chartData.maxDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{chartData.totalDays} {t('gantt.days')}</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Timeline Header */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <div className="w-48 flex-shrink-0 px-4 py-3 border-r border-gray-200">
              <span className="text-sm font-medium text-gray-700">{t('gantt.phase')}</span>
            </div>
            <div className="flex-1 relative" style={{ minWidth: '600px' }}>
              <div className="flex h-full">
                {monthLabels.map((month, idx) => (
                  <div
                    key={idx}
                    className="border-r border-gray-200 px-2 py-3 text-center"
                    style={{ width: `${month.width}%` }}
                  >
                    <span className="text-xs font-medium text-gray-600">{month.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Body */}
        <div className="divide-y divide-gray-200">
          {chartData.phasePositions.map((item, idx) => (
            <div key={idx} className="flex hover:bg-gray-50 transition-colors">
              {/* Phase Name */}
              <div className="w-48 flex-shrink-0 px-4 py-4 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPhaseColor(idx)}`} />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.phase.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.phase.duration}
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 relative py-4 px-2" style={{ minWidth: '600px' }}>
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  {monthLabels.map((month, i) => (
                    <div
                      key={i}
                      className="border-r border-gray-100"
                      style={{ width: `${month.width}%` }}
                    />
                  ))}
                </div>

                {/* Phase Bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md shadow-sm cursor-pointer group"
                  style={{
                    left: `${item.startPercent}%`,
                    width: `${item.widthPercent}%`
                  }}
                >
                  <div className={`h-full rounded-md ${getPhaseColor(idx)} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                    <span className="text-xs font-medium text-white px-2 truncate">
                      {item.phase.name}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <div className="font-semibold mb-1">{item.phase.name}</div>
                      <div className="space-y-1 text-gray-300">
                        <div>{t('gantt.start')}: {formatDate(new Date(item.phase.startDate!))}</div>
                        <div>{t('gantt.end')}: {formatDate(new Date(item.phase.endDate!))}</div>
                        <div>{t('gantt.duration')}: {item.duration} {t('gantt.days')}</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                  </div>
                </div>

                {/* Start and End markers */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-gray-400 rounded"
                  style={{ left: `${item.startPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-gray-400 rounded"
                  style={{ left: `${item.startPercent + item.widthPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-gray-600">{t('gantt.totalPhases')}: </span>
                <span className="font-semibold text-gray-900">{chartData.phasePositions.length}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('gantt.projectDuration')}: </span>
                <span className="font-semibold text-gray-900">{chartData.totalDays} {t('gantt.days')}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {t('gantt.hoverForDetails')}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('gantt.legend')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartData.phasePositions.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${getPhaseColor(idx)}`} />
              <span className="text-xs text-gray-700 truncate">{item.phase.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
