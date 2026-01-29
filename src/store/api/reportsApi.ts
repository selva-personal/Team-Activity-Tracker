import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Report,
  TeamReportData,
  EmployeeReportData,
  ProjectReportData,
  DailyReportData,
} from '@/types';

type TeamKey =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'testing'
  | 'datascience'
  | 'network'
  | 'hr'
  | 'medical'
  | 'seo'
  | 'it'
  | 'ceo'
  | 'uiux';

const TEAM_REPORTS: Record<TeamKey, TeamReportData> = {
  frontend: {
    teamName: 'Frontend Team',
    lead: 'Selva',
    totalMembers: 4,
    tasksCompleted: 86,
    tasksPending: 18,
    productivityScore: 88,
    avgHoursWorked: 7.5,
    projectBreakdown: [
      { project: 'Risk Adjustment', completed: 24, pending: 4 },
      { project: 'GI Coding',     completed: 20, pending: 3 },
      { project: 'Home Health',   completed: 18, pending: 4 },
      { project: 'AR Calling',    completed: 24, pending: 7 },
    ],
    memberPerformance: [
      { name: 'Adithya',       tasksCompleted: 24, tasksPending: 4, hoursWorked: 8.0, performance: 90 },
      { name: 'Bharani',       tasksCompleted: 22, tasksPending: 3, hoursWorked: 7.6, performance: 86 },
      { name: 'Karthick Rajan', tasksCompleted: 20, tasksPending: 5, hoursWorked: 7.1, performance: 82 },
      { name: 'Murali',        tasksCompleted: 20, tasksPending: 6, hoursWorked: 7.3, performance: 80 },
    ],
  },
  backend: {
    teamName: 'Backend Team',
    lead: 'Ajay',
    totalMembers: 2,
    tasksCompleted: 64,
    tasksPending: 12,
    productivityScore: 82,
    avgHoursWorked: 7.2,
    projectBreakdown: [
      { project: 'E/M Coding',      completed: 18, pending: 4 },
      { project: 'Radiology Coding', completed: 16, pending: 3 },
      { project: 'AM Coding',       completed: 30, pending: 5 },
    ],
    memberPerformance: [
      { name: 'Ajay',  tasksCompleted: 34, tasksPending: 6, hoursWorked: 7.5, performance: 85 },
      { name: 'Mani',  tasksCompleted: 30, tasksPending: 6, hoursWorked: 6.9, performance: 79 },
    ],
  },
  devops: {
    teamName: 'DevOps Team',
    lead: 'Karthick',
    totalMembers: 1,
    tasksCompleted: 40,
    tasksPending: 8,
    productivityScore: 80,
    avgHoursWorked: 7.0,
    projectBreakdown: [
      { project: 'Infrastructure Upgrades', completed: 18, pending: 4 },
      { project: 'Monitoring Setup',        completed: 22, pending: 4 },
    ],
    memberPerformance: [
      { name: 'Selva', tasksCompleted: 40, tasksPending: 8, hoursWorked: 7.0, performance: 80 },
    ],
  },
  testing: {
    teamName: 'Testing Team',
    lead: 'Balaji',
    totalMembers: 2,
    tasksCompleted: 72,
    tasksPending: 16,
    productivityScore: 84,
    avgHoursWorked: 7.1,
    projectBreakdown: [
      { project: 'Regression Suite',  completed: 30, pending: 6 },
      { project: 'Smoke Tests',       completed: 22, pending: 4 },
      { project: 'UAT Support',       completed: 20, pending: 6 },
    ],
    memberPerformance: [
      { name: 'Sai Prasath', tasksCompleted: 36, tasksPending: 8, hoursWorked: 7.0, performance: 85 },
      { name: 'Aarthi',      tasksCompleted: 36, tasksPending: 8, hoursWorked: 7.2, performance: 83 },
    ],
  },
  datascience: {
    teamName: 'Data Science Team',
    lead: 'Sri Hari',
    totalMembers: 2,
    tasksCompleted: 78,
    tasksPending: 10,
    productivityScore: 90,
    avgHoursWorked: 7.8,
    projectBreakdown: [
      { project: 'Risk Models',     completed: 28, pending: 4 },
      { project: 'Utilization ML',  completed: 26, pending: 3 },
      { project: 'Predictive Ops',  completed: 24, pending: 3 },
    ],
    memberPerformance: [
      { name: 'Sri Hari', tasksCompleted: 40, tasksPending: 5, hoursWorked: 8.1, performance: 92 },
      { name: 'Selvamani', tasksCompleted: 38, tasksPending: 5, hoursWorked: 7.5, performance: 88 },
    ],
  },
  network: {
    teamName: 'Network Security Team',
    lead: 'Kevin',
    totalMembers: 1,
    tasksCompleted: 52,
    tasksPending: 9,
    productivityScore: 83,
    avgHoursWorked: 7.4,
    projectBreakdown: [
      { project: 'Firewall Rules',  completed: 22, pending: 4 },
      { project: 'Vulnerability Scan', completed: 18, pending: 3 },
      { project: 'Audit Prep',      completed: 12, pending: 2 },
    ],
    memberPerformance: [
      { name: 'Kevin', tasksCompleted: 52, tasksPending: 9, hoursWorked: 7.4, performance: 83 },
    ],
  },
  hr: {
    teamName: 'HR Team',
    lead: 'Sujitha',
    totalMembers: 2,
    tasksCompleted: 60,
    tasksPending: 12,
    productivityScore: 81,
    avgHoursWorked: 6.8,
    projectBreakdown: [
      { project: 'Recruitment',   completed: 25, pending: 5 },
      { project: 'Onboarding',    completed: 20, pending: 4 },
      { project: 'Policy Update', completed: 15, pending: 3 },
    ],
    memberPerformance: [
      { name: 'Sujitha', tasksCompleted: 32, tasksPending: 6, hoursWorked: 7.0, performance: 83 },
      { name: 'Kezi',    tasksCompleted: 28, tasksPending: 6, hoursWorked: 6.6, performance: 79 },
    ],
  },
  medical: {
    teamName: 'Medical Coding Team',
    lead: 'Nadhiya',
    totalMembers: 2,
    tasksCompleted: 92,
    tasksPending: 10,
    productivityScore: 91,
    avgHoursWorked: 7.9,
    projectBreakdown: [
      { project: 'HCC Coding',     completed: 30, pending: 3 },
      { project: 'Manual Coding',  completed: 32, pending: 3 },
      { project: 'RAF Calculator', completed: 30, pending: 4 },
    ],
    memberPerformance: [
      { name: 'Nadhiya', tasksCompleted: 48, tasksPending: 5, hoursWorked: 8.0, performance: 93 },
      { name: 'Kayal',   tasksCompleted: 44, tasksPending: 5, hoursWorked: 7.8, performance: 89 },
    ],
  },
  seo: {
    teamName: 'SEO Team',
    lead: 'Rasiga',
    totalMembers: 2,
    tasksCompleted: 54,
    tasksPending: 8,
    productivityScore: 79,
    avgHoursWorked: 6.7,
    projectBreakdown: [
      { project: 'Content Optimization', completed: 22, pending: 3 },
      { project: 'Keyword Research',     completed: 18, pending: 3 },
      { project: 'Analytics Review',     completed: 14, pending: 2 },
    ],
    memberPerformance: [
      { name: 'Rasiga', tasksCompleted: 30, tasksPending: 4, hoursWorked: 6.8, performance: 80 },
      { name: 'Parvatha', tasksCompleted: 24, tasksPending: 4, hoursWorked: 6.6, performance: 78 },
    ],
  },
  it: {
    teamName: 'IT Team',
    lead: 'George',
    totalMembers: 1,
    tasksCompleted: 48,
    tasksPending: 6,
    productivityScore: 87,
    avgHoursWorked: 7.2,
    projectBreakdown: [
      { project: 'Helpdesk',      completed: 20, pending: 3 },
      { project: 'System Upgrades', completed: 18, pending: 2 },
      { project: 'Asset Management', completed: 10, pending: 1 },
    ],
    memberPerformance: [
      { name: 'George', tasksCompleted: 48, tasksPending: 6, hoursWorked: 7.2, performance: 87 },
    ],
  },
  ceo: {
    teamName: 'Executive Office',
    lead: 'Prem',
    totalMembers: 2,
    tasksCompleted: 30,
    tasksPending: 5,
    productivityScore: 90,
    avgHoursWorked: 6.5,
    projectBreakdown: [
      { project: 'Strategic Planning', completed: 12, pending: 2 },
      { project: 'Board Reviews',      completed: 10, pending: 1 },
      { project: 'Stakeholder Meetings', completed: 8, pending: 2 },
    ],
    memberPerformance: [
      { name: 'Prem',    tasksCompleted: 18, tasksPending: 3, hoursWorked: 6.7, performance: 92 },
      { name: 'Karthick', tasksCompleted: 12, tasksPending: 2, hoursWorked: 6.2, performance: 88 },
    ],
  },
  uiux: {
    teamName: 'UI/UX Team',
    lead: 'Shibi',
    totalMembers: 2,
    tasksCompleted: 68,
    tasksPending: 10,
    productivityScore: 86,
    avgHoursWorked: 7.0,
    projectBreakdown: [
      { project: 'Dashboard Redesign',  completed: 24, pending: 4 },
      { project: 'Design System',       completed: 22, pending: 3 },
      { project: 'User Testing',        completed: 22, pending: 3 },
    ],
    memberPerformance: [
      { name: 'Shibi',   tasksCompleted: 34, tasksPending: 5, hoursWorked: 7.1, performance: 88 },
      { name: 'Prakash', tasksCompleted: 34, tasksPending: 5, hoursWorked: 6.9, performance: 84 },
    ],
  },
};

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getReports: builder.query<Report[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const reports: Report[] = [
          {
            id: '1',
            type: 'team',
            title: 'Team Performance Reports',
            generatedAt: new Date().toISOString(),
            data: {},
          },
          {
            id: '2',
            type: 'employee',
            title: 'Employee Productivity Report - January 2026',
            generatedAt: new Date().toISOString(),
            data: {},
          },
          {
            id: '3',
            type: 'project',
            title: 'Project Status Report - January 2026',
            generatedAt: new Date().toISOString(),
            data: {},
          },
        ];
        return { data: reports };
      },
      providesTags: ['Reports'],
    }),
    getTeamReport: builder.query<TeamReportData, TeamKey>({
      queryFn: async (teamKey) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const data = TEAM_REPORTS[teamKey];
        return { data };
      },
    }),
    getEmployeeReport: builder.query<
      EmployeeReportData,
      { employeeId: string; fromDate: string; toDate: string }
    >({
      queryFn: async ({ employeeId }) => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Simple mock routing based on employeeId; fall back to a default
        const base: EmployeeReportData = {
          employeeId,
          employeeName: employeeId,
          role: 'Member',
          completedTasks: 42,
          pendingTasks: 8,
          totalHoursWorked: 38,
          productivityScore: 84,
          projectContribution: [
            { project: 'Risk Adjustment', completed: 14, pending: 3, hoursWorked: 12 },
            { project: 'GI Coding', completed: 12, pending: 2, hoursWorked: 10 },
            { project: 'Home Health Coding', completed: 16, pending: 3, hoursWorked: 16 },
          ],
          dailyPerformance: [
            { date: 'Mon', completed: 6, pending: 2, hoursWorked: 7.5 },
            { date: 'Tue', completed: 7, pending: 1, hoursWorked: 7.0 },
            { date: 'Wed', completed: 5, pending: 2, hoursWorked: 6.5 },
            { date: 'Thu', completed: 9, pending: 1, hoursWorked: 8.0 },
            { date: 'Fri', completed: 8, pending: 2, hoursWorked: 9.0 },
          ],
          activity: [
            {
              date: '2026-01-19',
              project: 'Risk Adjustment',
              task: 'HCC coding batch 12',
              status: 'completed',
              hoursWorked: 3.5,
            },
            {
              date: '2026-01-19',
              project: 'GI Coding',
              task: 'GI cases review',
              status: 'completed',
              hoursWorked: 2.5,
            },
            {
              date: '2026-01-19',
              project: 'Home Health Coding',
              task: 'Home health audit',
              status: 'in-progress',
              hoursWorked: 2,
            },
          ],
        };

        return { data: base };
      },
    }),
    getProjectReport: builder.query<
      ProjectReportData,
      { projectId: string; fromDate: string; toDate: string }
    >({
      queryFn: async ({ projectId }) => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const name = projectId;
        const data: ProjectReportData = {
          projectId,
          projectName: name,
          completionPercent: 82,
          tasksCompleted: 160,
          tasksPending: 28,
          healthStatus: 'at-risk',
          teamContribution: [
            { team: 'Frontend', completed: 40, pending: 6, hoursWorked: 32 },
            { team: 'Backend', completed: 36, pending: 8, hoursWorked: 30 },
            { team: 'Medical Coding', completed: 48, pending: 8, hoursWorked: 40 },
            { team: 'Testing', completed: 36, pending: 6, hoursWorked: 28 },
          ],
          workloadDistribution: [
            { member: 'Adithya', team: 'Frontend', completed: 18, pending: 3, hoursWorked: 14 },
            { member: 'Bharani', team: 'Frontend', completed: 22, pending: 3, hoursWorked: 18 },
            { member: 'Ajay', team: 'Backend', completed: 20, pending: 4, hoursWorked: 16 },
            { member: 'Mani', team: 'Backend', completed: 16, pending: 4, hoursWorked: 14 },
            { member: 'Nadhiya', team: 'Medical Coding', completed: 26, pending: 4, hoursWorked: 20 },
            { member: 'Kayal', team: 'Medical Coding', completed: 22, pending: 4, hoursWorked: 20 },
          ],
          activity: [
            { team: 'Frontend', member: 'Adithya', completed: 18, pending: 3, hoursWorked: 14 },
            { team: 'Frontend', member: 'Bharani', completed: 22, pending: 3, hoursWorked: 18 },
            { team: 'Backend', member: 'Ajay', completed: 20, pending: 4, hoursWorked: 16 },
            { team: 'Backend', member: 'Mani', completed: 16, pending: 4, hoursWorked: 14 },
            { team: 'Medical Coding', member: 'Nadhiya', completed: 26, pending: 4, hoursWorked: 20 },
            { team: 'Medical Coding', member: 'Kayal', completed: 22, pending: 4, hoursWorked: 20 },
          ],
        };

        return { data };
      },
    }),
    getDailyReport: builder.query<DailyReportData, { date: string }>({
      queryFn: async ({ date }) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const data: DailyReportData = {
          date,
          activeEmployees: 18,
          totalTasksCompleted: 96,
          averageHoursWorked: 7.4,
          teamActivity: [
            { team: 'Frontend', tasksCompleted: 22, hoursWorked: 16 },
            { team: 'Backend', tasksCompleted: 18, hoursWorked: 14 },
            { team: 'Medical Coding', tasksCompleted: 24, hoursWorked: 18 },
            { team: 'Testing', tasksCompleted: 16, hoursWorked: 12 },
            { team: 'Data Science', tasksCompleted: 16, hoursWorked: 12 },
          ],
          hourlyDistribution: [
            { hour: '09:00', tasksCompleted: 8 },
            { hour: '10:00', tasksCompleted: 10 },
            { hour: '11:00', tasksCompleted: 12 },
            { hour: '12:00', tasksCompleted: 14 },
            { hour: '13:00', tasksCompleted: 16 },
            { hour: '14:00', tasksCompleted: 14 },
            { hour: '15:00', tasksCompleted: 12 },
            { hour: '16:00', tasksCompleted: 10 },
          ],
          entries: [
            {
              employee: 'Adithya',
              team: 'Frontend',
              project: 'Risk Adjustment',
              task: 'HCC coding batch 10',
              status: 'completed',
              hoursWorked: 3,
            },
            {
              employee: 'Bharani',
              team: 'Frontend',
              project: 'GI Coding',
              task: 'GI cases review',
              status: 'completed',
              hoursWorked: 2.5,
            },
            {
              employee: 'Ajay',
              team: 'Backend',
              project: 'E/M Coding',
              task: 'API enhancements',
              status: 'in-progress',
              hoursWorked: 3,
            },
            {
              employee: 'Nadhiya',
              team: 'Medical Coding',
              project: 'HCC Coding',
              task: 'Risk score validation',
              status: 'completed',
              hoursWorked: 3.5,
            },
          ],
        };

        return { data };
      },
    }),
  }),
});

export const {
  useGetReportsQuery,
  useLazyGetTeamReportQuery,
  useLazyGetEmployeeReportQuery,
  useLazyGetProjectReportQuery,
  useLazyGetDailyReportQuery,
} = reportsApi;
