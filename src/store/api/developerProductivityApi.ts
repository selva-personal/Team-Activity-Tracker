import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type DeveloperId = 'adithya' | 'bharani' | 'selva' | 'mani' | 'gowri';
type TeamName = 'Frontend Team' | 'Backend Team' | 'DevOps Team' | 'Data Science Team';

export interface DeveloperCommitDay {
  developerId: DeveloperId;
  developerName: string;
  teamName: TeamName;
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  repo: string;
}

export interface DeveloperSummary {
  developerId: DeveloperId;
  developerName: string;
  teamName: TeamName;
  totalCommitsToday: number;
  totalCommitsWeek: number;
  avgWorkingHours: number;
  tasksCompleted: number;
  attendancePercent: number;
  performanceScore: number;
}

export interface AttendancePoint {
  developerId: DeveloperId;
  developerName: string;
  teamName: TeamName;
  date: string;
  present: boolean;
  late: boolean;
}

export interface WorkHourPoint {
  developerId: DeveloperId;
  developerName: string;
  teamName: TeamName;
  date: string;
  hoursWorked: number;
  overtimeHours: number;
  idleHours: number;
}

// Mock developers
const developers: Record<DeveloperId, string> = {
  adithya: 'Adithya',
  bharani: 'Bharani',
  selva: 'Selva',
  mani: 'Mani',
  gowri: 'Gowri',
};

const developerTeams: Record<DeveloperId, TeamName> = {
  adithya: 'Frontend Team',
  bharani: 'Backend Team',
  selva: 'DevOps Team',
  mani: 'Data Science Team',
  gowri: 'Frontend Team',
};

// Simple deterministic mock data
const today = '2026-03-30';
const last7Days = Array.from({ length: 7 }, (_, i) => {
  const day = 24 + i;
  return `2026-03-${day}`;
});

const repos = ['frontend-app', 'api-service', 'infra-scripts'];

const mockCommitDays: DeveloperCommitDay[] = [];
const mockAttendance: AttendancePoint[] = [];
const mockWorkHours: WorkHourPoint[] = [];
const summaryByDev: Record<DeveloperId, DeveloperSummary> = {} as any;

Object.entries(developers).forEach(([id, name], index) => {
  const devId = id as DeveloperId;
  const teamName = developerTeams[devId];

  let weeklyCommits = 0;
  let totalHours = 0;
  let tasksCompleted = 0;
  let daysPresent = 0;

  last7Days.forEach((date, di) => {
    const baseCommits = 4 + index + di;
    const commits = baseCommits % 7 === 0 ? baseCommits - 1 : baseCommits;
    const additions = commits * (20 + index * 5);
    const deletions = Math.max(5, Math.round(additions * 0.25));
    const repo = repos[(index + di) % repos.length];

    mockCommitDays.push({
      developerId: devId,
      developerName: name,
      teamName,
      date,
      commits,
      additions,
      deletions,
      repo,
    });

    const present = di !== 5 || index % 2 === 0;
    const late = present && (di === 2 || (index + di) % 4 === 0);
    mockAttendance.push({
      developerId: devId,
      developerName: name,
      teamName,
      date,
      present,
      late,
    });

    const baseHours = 7 + ((index + di) % 3); // 7–9h
    const overtime = di % 3 === 0 ? 1 : 0;
    const idle = present ? Math.max(0.5, 1.5 - index * 0.1) : 0.5;
    const hoursWorked = present ? baseHours + overtime : 0;

    mockWorkHours.push({
      developerId: devId,
      developerName: name,
      teamName,
      date,
      hoursWorked,
      overtimeHours: overtime,
      idleHours: Number(idle.toFixed(1)),
    });

    if (present) {
      daysPresent += 1;
      totalHours += hoursWorked;
      tasksCompleted += commits > 0 ? Math.max(1, Math.round(commits / 2)) : 1;
    }

    weeklyCommits += commits;
  });

  const todayCommits = mockCommitDays
    .filter((d) => d.developerId === devId && d.date === today)
    .reduce((sum, d) => sum + d.commits, 0);

  const attendancePercent = (daysPresent / last7Days.length) * 100;
  const avgWorkingHours = daysPresent ? totalHours / daysPresent : 0;

  const commitsScore = Math.min(100, (weeklyCommits / 80) * 100);
  const tasksScore = Math.min(100, (tasksCompleted / 40) * 100);
  const hoursScore = Math.min(100, (avgWorkingHours / 9) * 100);
  const attendanceScore = attendancePercent;

  const performanceScore =
    commitsScore * 0.3 + tasksScore * 0.3 + hoursScore * 0.2 + attendanceScore * 0.2;

  summaryByDev[devId] = {
    developerId: devId,
    developerName: name,
    teamName,
    totalCommitsToday: todayCommits || 3 + index,
    totalCommitsWeek: weeklyCommits,
    avgWorkingHours: Number(avgWorkingHours.toFixed(1)),
    tasksCompleted,
    attendancePercent: Number(attendancePercent.toFixed(1)),
    performanceScore: Number(performanceScore.toFixed(1)),
  };
});

export const developerProductivityApi = createApi({
  reducerPath: 'developerProductivityApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['DeveloperProductivity'],
  endpoints: (builder) => ({
    // Future: /api/github/commits and /api/gitlab/commits
    getCommitAnalytics: builder.query<
      { commits: DeveloperCommitDay[]; summaries: DeveloperSummary[] },
      void
    >({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return {
          data: {
            commits: mockCommitDays,
            summaries: Object.values(summaryByDev),
          },
        };
      },
      providesTags: ['DeveloperProductivity'],
    }),

    // Future: /api/attendance
    getAttendanceInsights: builder.query<AttendancePoint[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: mockAttendance };
      },
      providesTags: ['DeveloperProductivity'],
    }),

    // Future: /api/work-hours
    getWorkHours: builder.query<WorkHourPoint[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: mockWorkHours };
      },
      providesTags: ['DeveloperProductivity'],
    }),
  }),
});

export const {
  useGetCommitAnalyticsQuery,
  useGetAttendanceInsightsQuery,
  useGetWorkHoursQuery,
} = developerProductivityApi;

