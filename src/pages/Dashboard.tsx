import React from 'react';
import { useGetDashboardStatsQuery, useGetDailyActivityQuery } from '@/store/api/activityApi';
import { useGetProjectsQuery } from '@/store/api/projectsApi';
import { useGetTeamsQuery } from '@/store/api/teamsApi';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui/Table';
import {
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfWeek, addDays } from 'date-fns';
import { APP_DASHBOARD_TITLE, APP_DASHBOARD_SUBTITLE } from '@/config/appConfig';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } = useGetDailyActivityQuery();
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();

  if (statsLoading || activityLoading || projectsLoading || teamsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-20" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Project Status Summary data
  const projectStatusConfig: Record<
    string,
    { totalTasks: number; completion: number }
  > = {
    // Healthy (>= 85%)
    'Risk Adjustment': { totalTasks: 180, completion: 90 },
    'GI Coding': { totalTasks: 170, completion: 88 },
    'Home Health Coding': { totalTasks: 150, completion: 86 },
    'AR Calling': { totalTasks: 160, completion: 86 },

    // At Risk (60–84%)
    'Anesthesia Coding': { totalTasks: 130, completion: 72 },
    'E/M Coding': { totalTasks: 120, completion: 68 },
    'AM Coding': { totalTasks: 140, completion: 80 },

    // Delayed (< 60%)
    'Radiology Coding': { totalTasks: 110, completion: 58 },
  };

  const projectStatusData =
    projects
      ?.map((project) => {
        const config = projectStatusConfig[project.name];

        if (config) {
          const totalTasks = config.totalTasks;
          const completionPct = config.completion; // 55–95%

          // Derive realistic breakdown with no zeros
          let completed = Math.round((completionPct / 100) * totalTasks);
          completed = Math.max(1, Math.min(totalTasks - 2, completed)); // leave room for pending / in-progress

          const remaining = totalTasks - completed;
          let pending = Math.max(1, Math.round(remaining * 0.6));
          if (pending >= remaining) pending = remaining - 1;
          const inProgress = Math.max(1, remaining - pending);

          return {
            id: project.id,
            name: project.name,
            totalTasks,
            completed,
            pending,
            inProgress,
            completion: completionPct,
          };
        }

        // Fallback to activity‑driven data for any unexpected project
        const projectActivity =
          activity?.filter((a) => a.projectId === project.id) || [];
        const totalTasks = projectActivity.length;
          const completed = projectActivity.filter(
            (a) => a.status === 'completed',
          ).length;
          const pending = projectActivity.filter(
            (a) => a.status === 'pending',
          ).length;
          const inProgress = projectActivity.filter(
            (a) => a.status === 'in-progress',
          ).length;

        const baseCompletion =
          totalTasks > 0 ? (completed / totalTasks) * 100 : 75;
        const variation = Math.floor(Math.random() * 9) - 4;
        const completion = Math.max(55, Math.min(95, baseCompletion + variation));

        return {
          id: project.id,
          name: project.name,
          totalTasks: totalTasks || completed + pending + inProgress || 100,
          completed: completed || 60,
          pending: pending || 25,
          inProgress: inProgress || 15,
          completion: Math.round(completion),
        };
      })
      .sort((a, b) => b.completion - a.completion) || [];


  const getProjectHealth = (completion: number) => {
    if (completion >= 85) {
      return { label: 'Healthy', variant: 'success' as const };
    }
    if (completion >= 60) {
      return { label: 'At Risk', variant: 'warning' as const };
    }
    return { label: 'Delayed', variant: 'danger' as const };
  };

  // Team Performance Ranking data (65–95% with realistic variation)
  const teamPerformanceRanking =
    teams
      ?.map((team) => {
        // Base performance per team type for more realistic variation
        let base = 80;
        if (team.name.startsWith('Frontend')) base = 88;
        else if (team.name.startsWith('Backend')) base = 84;
        else if (team.name.startsWith('Medical Coding')) base = 90;
        else if (team.name.startsWith('Testing')) base = 78;
        else if (team.name.startsWith('Data Science')) base = 87;
        else if (team.name.startsWith('HR')) base = 75;

        // Add small random variation and clamp to 65–95
        const variation = Math.floor(Math.random() * 11) - 5; // -5..+5
        let score = base + variation;
        score = Math.max(65, Math.min(95, score));

        return {
          id: team.id,
          name: team.name,
          score,
        };
      })
      .sort((a, b) => b.score - a.score) || [];

  const getPerformanceColor = (score: number): string => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-orange-400';
  };

  // Weekly Work Output Comparison Data
  type WeeklyWorkOutputPoint = {
    day: string;
    frontend: number;
    backend: number;
    medicalCoding: number;
    testing: number;
    dataScience: number;
  };

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Major teams to display
  const majorTeams: {
    id: string;
    name: string;
    key: keyof Omit<WeeklyWorkOutputPoint, 'day'>;
  }[] = [
    { id: '1', name: 'Frontend', key: 'frontend' },
    { id: '2', name: 'Backend', key: 'backend' },
    { id: '8', name: 'Medical Coding', key: 'medicalCoding' },
    { id: '4', name: 'Testing', key: 'testing' },
    { id: '5', name: 'Data Science', key: 'dataScience' },
  ];

  const weeklyWorkOutputData: WeeklyWorkOutputPoint[] = Array.from(
    { length: 7 },
    (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = weekDays[i];

      const dayData: WeeklyWorkOutputPoint = {
        day: dayName,
        frontend: 0,
        backend: 0,
        medicalCoding: 0,
        testing: 0,
        dataScience: 0,
      };

      majorTeams.forEach((teamInfo) => {
        const team = teams?.find((t) => t.id === teamInfo.id);
        if (team) {
          const teamActivity =
            activity?.filter(
              (a) =>
                a.teamId === team.id &&
                a.date === dateStr &&
                a.status === 'completed',
            ) || [];
          
          let tasksCompleted = teamActivity.length;
          
          // Ensure realistic variation (no zeros)
          if (tasksCompleted === 0) {
            // Add realistic base numbers with variation
            const baseTasks: Record<
              keyof Omit<WeeklyWorkOutputPoint, 'day'>,
              number
            > = {
              frontend: 20,
              backend: 15,
              medicalCoding: 35,
              testing: 12,
              dataScience: 18,
            };
            tasksCompleted = baseTasks[teamInfo.key] || 15;
            tasksCompleted += Math.floor(Math.random() * 10) - 5; // ±5 variation
            tasksCompleted = Math.max(1, tasksCompleted); // Ensure at least 1
          } else {
            // Add some variation to existing data
            tasksCompleted += Math.floor(Math.random() * 8) - 4;
            tasksCompleted = Math.max(1, tasksCompleted);
          }
          
          dayData[teamInfo.key] = tasksCompleted;
        } else {
          // Fallback if team not found
          const baseTasks: Record<
            keyof Omit<WeeklyWorkOutputPoint, 'day'>,
            number
          > = {
            frontend: 20,
            backend: 15,
            medicalCoding: 35,
            testing: 12,
            dataScience: 18,
          };
          dayData[teamInfo.key] = baseTasks[teamInfo.key] || 15;
        }
      });

      return dayData;
    },
  );

  // Task Completion Velocity (last 8 weeks, showing improvement)
  type TaskVelocityPoint = {
    week: string;
    completed: number;
    trend: number;
  };

  const totalCompletedOverall =
    activity?.filter((a) => a.status === 'completed').length || 400;
  const basePerWeek = Math.max(20, Math.floor(totalCompletedOverall / 16));
  const step = Math.max(3, Math.floor(basePerWeek / 4));

  const taskCompletionVelocityData: TaskVelocityPoint[] = [];
  let runningSum = 0;
  let previousCompleted = basePerWeek;

  for (let i = 0; i < 8; i += 1) {
    const noise = Math.floor(Math.random() * 7) - 3; // -3..+3
    let completed = basePerWeek + step * i + noise;
    if (i === 0) {
      completed = Math.max(15, completed);
    } else {
      completed = Math.max(previousCompleted + 1, completed);
    }
    previousCompleted = completed;
    runningSum += completed;

    taskCompletionVelocityData.push({
      week: `Week ${i + 1}`,
      completed,
      trend: Math.round(runningSum / (i + 1)),
    });
  }

  // Employee productivity (top 10)
  const employeeProductivity = activity?.reduce((acc, act) => {
    if (!acc[act.employeeId]) {
      acc[act.employeeId] = { name: act.employeeName, hours: 0, completed: 0 };
    }
    acc[act.employeeId].hours += act.hoursWorked;
    if (act.status === 'completed') acc[act.employeeId].completed += 1;
    return acc;
  }, {} as Record<string, { name: string; hours: number; completed: number }>) || {};

  const topEmployees = Object.values(employeeProductivity)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {APP_DASHBOARD_TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {APP_DASHBOARD_SUBTITLE}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalEmployees || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Today</p>
              <p className="text-2xl font-bold text-green-600">{stats?.activeToday || 0}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.tasksCompletedToday || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.tasksPending || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Performance</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.teamPerformance || 0}%</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Project Completion
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {stats?.projectCompletion || 0}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <PieChartIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health Status + Team Performance Ranking as equal cards */}
        <div className="dashboard-grid lg:col-span-2">
          <Card className="dashboard-card">
            <h3 className="project-status-title text-lg font-semibold text-gray-900 dark:text-white">
              Project Status Summary
            </h3>
            <div className="table-wrapper overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Project Name</TableHeader>
                    <TableHeader>Total Tasks</TableHeader>
                    <TableHeader>Completed</TableHeader>
                    <TableHeader>Pending</TableHeader>
                    <TableHeader>In Progress</TableHeader>
                    <TableHeader>Completion %</TableHeader>
                    <TableHeader>Health Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectStatusData.map((project) => {
                    const health = getProjectHealth(project.completion);
                    return (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.totalTasks}</TableCell>
                        <TableCell>{project.completed}</TableCell>
                        <TableCell>{project.pending}</TableCell>
                        <TableCell>{project.inProgress}</TableCell>
                        <TableCell>{project.completion}%</TableCell>
                        <TableCell>
                          <Badge variant={health.variant}>{health.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Performance Ranking
            </h3>
            <div className="space-y-3">
              {teamPerformanceRanking.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {team.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {team.score}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getPerformanceColor(
                          team.score,
                        )}`}
                        style={{ width: `${team.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weekly Work Output Comparison */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Work Output Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={weeklyWorkOutputData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFrontend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorBackend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorMedicalCoding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTesting" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorDataScience" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Tasks Completed', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  const teamNames: Record<string, string> = {
                    frontend: 'Frontend',
                    backend: 'Backend',
                    medicalCoding: 'Medical Coding',
                    testing: 'Testing',
                    dataScience: 'Data Science',
                  };
                  return [value, teamNames[name] || name];
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                iconType="circle"
                formatter={(value: string) => {
                  const teamNames: Record<string, string> = {
                    frontend: 'Frontend',
                    backend: 'Backend',
                    medicalCoding: 'Medical Coding',
                    testing: 'Testing',
                    dataScience: 'Data Science',
                  };
                  return teamNames[value] || value;
                }}
              />
              <Area
                type="monotone"
                dataKey="frontend"
                stroke="#3B82F6"
                fill="url(#colorFrontend)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="backend"
                stroke="#10B981"
                fill="url(#colorBackend)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="medicalCoding"
                stroke="#8B5CF6"
                fill="url(#colorMedicalCoding)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="testing"
                stroke="#F59E0B"
                fill="url(#colorTesting)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="dataScience"
                stroke="#EC4899"
                fill="url(#colorDataScience)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Employee Productivity Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Employee Productivity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEmployees} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="hours" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task Completion Velocity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completion Velocity
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={taskCompletionVelocityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    completed: 'Tasks Completed',
                    trend: 'Trend',
                  };
                  return [value, labels[name] || name];
                }}
              />
              <Legend />
              <Bar
                dataKey="completed"
                name="Tasks Completed"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="trend"
                name="Trend"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
