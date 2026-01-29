import React, { useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import clsx from 'clsx';

interface HeatmapData {
  team: string;
  date: string;
  tasksCompleted: number;
}

interface TeamProductivityHeatmapProps {
  data: HeatmapData[];
  teams: string[];
  month?: Date;
}

export const TeamProductivityHeatmap: React.FC<TeamProductivityHeatmapProps> = ({
  data,
  teams,
  month = new Date(),
}) => {
  const [tooltip, setTooltip] = useState<{
    team: string;
    date: string;
    tasksCompleted: number;
    x: number;
    y: number;
  } | null>(null);

  const daysInMonth = getDaysInMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const currentYear = month.getFullYear();
  const currentMonth = month.getMonth() + 1;

  // Create a map for quick lookup: team-date -> tasksCompleted
  const dataMap = new Map<string, number>();
  data.forEach((item) => {
    const key = `${item.team}-${item.date}`;
    dataMap.set(key, item.tasksCompleted);
  });

  // Find max value for color scaling
  const maxTasks = Math.max(...Array.from(dataMap.values()), 1);

  // Get color intensity based on value
  const getColorIntensity = (tasksCompleted: number): string => {
    if (tasksCompleted === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = tasksCompleted / maxTasks;
    
    if (intensity < 0.3) {
      return 'bg-blue-200 dark:bg-blue-900/30';
    } else if (intensity < 0.6) {
      return 'bg-blue-400 dark:bg-blue-700/50';
    } else if (intensity < 0.8) {
      return 'bg-blue-600 dark:bg-blue-600/70';
    } else {
      return 'bg-blue-800 dark:bg-blue-500';
    }
  };

  const handleCellHover = (
    team: string,
    day: number,
    tasksCompleted: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      team,
      date: format(new Date(dateStr), 'MMM dd, yyyy'),
      tasksCompleted,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header with day numbers */}
          <div className="flex mb-2">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex gap-1 flex-1">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex-1 text-center text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[24px]"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {teams.map((team) => (
              <div key={team} className="flex items-center gap-1">
                <div className="w-32 flex-shrink-0 text-sm text-gray-700 dark:text-gray-300 font-medium truncate pr-2">
                  {team}
                </div>
                <div className="flex gap-1 flex-1">
                  {days.map((day) => {
                    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const key = `${team}-${dateStr}`;
                    const tasksCompleted = dataMap.get(key) || 0;

                    return (
                      <div
                        key={`${team}-${day}`}
                        className={clsx(
                          'flex-1 h-8 rounded transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-md min-w-[24px]',
                          getColorIntensity(tasksCompleted)
                        )}
                        onMouseEnter={(e) => handleCellHover(team, day, tasksCompleted, e)}
                        onMouseLeave={handleCellLeave}
                        title={`${team} - ${format(new Date(dateStr), 'MMM dd')}: ${tasksCompleted} tasks`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-900/30"></div>
            <div className="w-4 h-4 rounded bg-blue-400 dark:bg-blue-700/50"></div>
            <div className="w-4 h-4 rounded bg-blue-600 dark:bg-blue-600/70"></div>
            <div className="w-4 h-4 rounded bg-blue-800 dark:bg-blue-500"></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">More</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Tasks completed per day
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold">{tooltip.team}</div>
          <div className="text-gray-300">{tooltip.date}</div>
          <div className="text-blue-400">{tooltip.tasksCompleted} tasks completed</div>
        </div>
      )}
    </div>
  );
};
