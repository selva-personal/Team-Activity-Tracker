import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DailyActivity, DashboardStats } from '@/types';
import { mockDailyActivity, mockEmployees, mockTasks, mockTeams, mockProjects } from '@/data/mockData';

interface ActivityFilters {
  teamId?: string;
  employeeId?: string;
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Activity', 'Dashboard'],
  endpoints: (builder) => ({
    getDailyActivity: builder.query<DailyActivity[], ActivityFilters | void>({
      queryFn: async (filters) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        let filtered = [...mockDailyActivity];

        const filterParams = filters || {};
        if (filterParams.teamId) {
          filtered = filtered.filter(a => a.teamId === filterParams.teamId);
        }
        if (filterParams.employeeId) {
          filtered = filtered.filter(a => a.employeeId === filterParams.employeeId);
        }
        if (filterParams.projectId) {
          filtered = filtered.filter(a => a.projectId === filterParams.projectId);
        }
        if (filterParams.status) {
          filtered = filtered.filter(a => a.status === filterParams.status);
        }
        if (filterParams.startDate) {
          filtered = filtered.filter(a => a.date >= filterParams.startDate!);
        }
        if (filterParams.endDate) {
          filtered = filtered.filter(a => a.date <= filterParams.endDate!);
        }

        return { data: filtered };
      },
      providesTags: ['Activity'],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = mockTasks.filter(t => t.date === today);
        const activeToday = new Set(todayTasks.map(t => t.employeeId)).size;
        const tasksCompletedToday = todayTasks.filter(t => t.status === 'completed').length;
        const tasksPending = mockTasks.filter(t => t.status === 'pending').length;

        // Calculate team performance (average completion rate)
        const teamPerformance = mockTeams.reduce((acc, team) => {
          const teamTasks = mockTasks.filter(t => {
            const emp = mockEmployees.find(e => e.id === t.employeeId);
            return emp?.teamId === team.id;
          });
          const completed = teamTasks.filter(t => t.status === 'completed').length;
          return acc + (teamTasks.length > 0 ? (completed / teamTasks.length) * 100 : 0);
        }, 0) / mockTeams.length;

        const projectCompletion = mockProjects.reduce((acc, p) => acc + p.completionPercentage, 0) / mockProjects.length;

        return {
          data: {
            totalEmployees: mockEmployees.length,
            activeToday,
            tasksCompletedToday,
            tasksPending,
            teamPerformance: Math.round(teamPerformance),
            projectCompletion: Math.round(projectCompletion),
          },
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDailyActivityQuery, useGetDashboardStatsQuery } = activityApi;
