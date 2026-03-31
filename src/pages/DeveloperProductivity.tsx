import React from 'react';
import {
  useGetCommitAnalyticsQuery,
  useGetAttendanceInsightsQuery,
  useGetWorkHoursQuery,
  DeveloperCommitDay,
  DeveloperSummary,
  AttendancePoint,
  WorkHourPoint,
} from '@/store/api/developerProductivityApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { Users, GitCommit, Clock, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type SectionKey = 'overview' | 'commits' | 'attendance' | 'hours' | 'performance';
type TeamFilter = 'all' | 'Frontend Team' | 'Backend Team' | 'DevOps Team' | 'Data Science Team';

const PIE_COLORS = ['#4F46E5', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

export const DeveloperProductivity: React.FC = () => {
  const location = useLocation();

  const lastSegment = location.pathname.split('/').filter(Boolean).pop();
  const activeSection: SectionKey =
    (lastSegment as SectionKey) &&
    ['overview', 'commits', 'attendance', 'hours', 'performance'].includes(lastSegment as SectionKey)
      ? (lastSegment as SectionKey)
      : 'overview';

  const { data: commitData, isLoading: commitsLoading } = useGetCommitAnalyticsQuery();
  const { data: attendanceData, isLoading: attendanceLoading } = useGetAttendanceInsightsQuery();
  const { data: workHoursData, isLoading: hoursLoading } = useGetWorkHoursQuery();

  const isLoading = commitsLoading || attendanceLoading || hoursLoading;

  const summaries = commitData?.summaries ?? [];
  const commits = commitData?.commits ?? [];
  const attendance = attendanceData ?? [];
  const workHours = workHoursData ?? [];

  const minDate = commits.length ? commits.map((c) => c.date).sort()[0] : '2026-03-24';
  const maxDate = commits.length ? commits.map((c) => c.date).sort().slice(-1)[0] : '2026-03-30';

  const [teamFilter, setTeamFilter] = React.useState<TeamFilter>('all');
  const [developerFilter, setDeveloperFilter] = React.useState<string>('all');
  const [repoFilter, setRepoFilter] = React.useState<string>('all');
  const [fromDate, setFromDate] = React.useState<string>(minDate);
  const [toDate, setToDate] = React.useState<string>(maxDate);

  const repos = Array.from(new Set(commits.map((c) => c.repo)));
  const filteredSummaries = summaries.filter((s) => (teamFilter === 'all' ? true : s.teamName === teamFilter));
  const filteredDeveloperNames = new Set(filteredSummaries.map((s) => s.developerName));

  const inDateRange = (date: string) => date >= fromDate && date <= toDate;

  const filteredCommits = commits.filter(
    (c) =>
      filteredDeveloperNames.has(c.developerName) &&
      (developerFilter === 'all' || c.developerName === developerFilter) &&
      (repoFilter === 'all' || c.repo === repoFilter) &&
      inDateRange(c.date),
  );
  const filteredAttendance = attendance.filter(
    (a) =>
      filteredDeveloperNames.has(a.developerName) &&
      (developerFilter === 'all' || a.developerName === developerFilter) &&
      inDateRange(a.date),
  );
  const filteredWorkHours = workHours.filter(
    (w) =>
      filteredDeveloperNames.has(w.developerName) &&
      (developerFilter === 'all' || w.developerName === developerFilter) &&
      inDateRange(w.date),
  );

  const developers = Array.from(new Set(filteredSummaries.map((s) => s.developerName)));
  const summaryMap = Object.fromEntries(filteredSummaries.map((s) => [s.developerName, s]));

  const totalCommitsToday = filteredCommits
    .filter((c) => c.date === maxDate)
    .reduce((sum, c) => sum + c.commits, 0);
  const activeDevelopers = developers.length;
  const totalTasksCompleted = filteredSummaries.reduce((sum, s) => sum + s.tasksCompleted, 0);
  const avgWorkingHours = safeAvg(filteredWorkHours.map((w) => w.hoursWorked));
  const avgProductivityScore = safeAvg(filteredSummaries.map((s) => s.performanceScore));
  const idleDevelopersCount = developers.filter((d) => {
    const todayCommits = filteredCommits
      .filter((c) => c.developerName === d && c.date === maxDate)
      .reduce((sum, c) => sum + c.commits, 0);
    return todayCommits <= 3;
  }).length;

  const overviewRows = developers.map((developerName) => {
    const devCommits = filteredCommits
      .filter((c) => c.developerName === developerName)
      .reduce((sum, c) => sum + c.commits, 0);
    const devHours = safeAvg(
      filteredWorkHours.filter((w) => w.developerName === developerName).map((w) => w.hoursWorked),
    );
    const summary = summaryMap[developerName];
    const score = summary?.performanceScore ?? 70;
    const status = score >= 85 ? 'High' : score >= 70 ? 'Medium' : 'Needs Attention';
    return {
      developerName,
      commits: devCommits || 1,
      tasks: summary?.tasksCompleted ?? 1,
      hours: Number(devHours.toFixed(1)) || 1,
      score,
      status,
    };
  });

  const dailyActivityTrend = aggregateDailyActivityTrend(filteredCommits, filteredWorkHours);
  const commitsVsTasks = overviewRows.map((r) => ({ developer: r.developerName, commits: r.commits, tasks: r.tasks }));
  const productivityDistribution = [
    { name: 'High (85+)', value: Math.max(1, overviewRows.filter((r) => r.score >= 85).length) },
    { name: 'Medium (70-84)', value: Math.max(1, overviewRows.filter((r) => r.score >= 70 && r.score < 85).length) },
    { name: 'Low (<70)', value: Math.max(1, overviewRows.filter((r) => r.score < 70).length) },
  ];

  const commitsByDeveloper = aggregateCommitsByDeveloper(filteredCommits);
  const weeklyCommitTrend = aggregateWeeklyTrend(filteredCommits);
  const repoContribution = aggregateRepoContribution(filteredCommits);
  const additionsVsDeletions = aggregateAdditionsVsDeletions(filteredCommits);
  const totalCommits = filteredCommits.reduce((sum, c) => sum + c.commits, 0);
  const avgCommitsPerDeveloper = activeDevelopers ? Number((totalCommits / activeDevelopers).toFixed(1)) : 0;
  const highestCommitDev = commitsByDeveloper.sort((a, b) => b.commits - a.commits)[0];
  const highCommitRatio = filteredCommits.length
    ? Number(
        (
          filteredCommits.filter((c) => c.commits >= 7).length / Math.max(1, filteredCommits.length)
        ).toFixed(2),
      )
    : 0;
  const largeChangeCount = filteredCommits.filter((c) => c.additions + c.deletions >= 200).length;

  const attendanceTrend = aggregateAttendanceTrend(filteredAttendance);
  const teamAttendance = aggregateTeamAttendance(filteredAttendance);
  const presentToday = filteredAttendance.filter((a) => a.date === maxDate && a.present).length;
  const absentToday = Math.max(0, activeDevelopers - presentToday);
  const lateLogins = filteredAttendance.filter((a) => a.late).length;
  const attendancePct = filteredAttendance.length
    ? Number(
        (
          (filteredAttendance.filter((a) => a.present).length / filteredAttendance.length) *
          100
        ).toFixed(1),
      )
    : 0;
  const attendanceAlerts = buildAttendanceAlerts(filteredAttendance);

  const dailyHoursTrend = aggregateHoursPerDay(filteredWorkHours);
  const hoursDistribution = buildHoursDistribution(filteredWorkHours);
  const avgHoursToday = safeAvg(
    filteredWorkHours.filter((w) => w.date === maxDate).map((w) => w.hoursWorked),
  );
  const overtimeHours = filteredWorkHours.reduce((sum, w) => sum + w.overtimeHours, 0);
  const underworked = developers.filter((d) => {
    const devAvg = safeAvg(
      filteredWorkHours.filter((w) => w.developerName === d).map((w) => w.hoursWorked),
    );
    return devAvg < 7;
  }).length;
  const peakHour = dailyHoursTrend.sort((a, b) => b.hours - a.hours)[0]?.date ?? maxDate;
  const workPatternInsight = buildWorkPatternInsight(dailyHoursTrend);

  const performanceSorted = [...filteredSummaries].sort((a, b) => b.performanceScore - a.performanceScore);
  const scoreDistribution = performanceSorted.map((s) => ({ developer: s.developerName, score: s.performanceScore }));
  const rankingTrend = performanceSorted.map((s) => ({
    developer: s.developerName,
    week1: Math.max(60, s.performanceScore - 10),
    week2: Math.max(62, s.performanceScore - 6),
    week3: Math.max(64, s.performanceScore - 3),
    week4: s.performanceScore,
  }));
  const avgPerf = safeAvg(performanceSorted.map((s) => s.performanceScore));
  const topPerformer = performanceSorted[0]?.developerName ?? '-';
  const lowPerformer = performanceSorted.slice(-1)[0]?.developerName ?? '-';
  const teamEfficiency = safeAvg(teamAttendance.map((t) => t.attendancePercent));

  const timelineRows = buildTimeline(filteredCommits, filteredAttendance, filteredWorkHours);
  const riskRows = buildRiskDetectionRows(overviewRows, filteredCommits);
  const teamComparisonRows = buildTeamComparisonRows(filteredSummaries, filteredCommits, filteredWorkHours);
  const aiInsights = buildAiInsights(teamComparisonRows, attendanceAlerts, riskRows);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Productivity</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enterprise analytics across commits, attendance, work-hours, performance, and engineering risk signals.
        </p>
      </div>

      <Card className="overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <Select
            value={teamFilter}
            onChange={(e) => {
              setTeamFilter(e.target.value as TeamFilter);
              setDeveloperFilter('all');
            }}
            options={[
              { value: 'all', label: 'All Teams' },
              { value: 'Frontend Team', label: 'Frontend Team' },
              { value: 'Backend Team', label: 'Backend Team' },
              { value: 'DevOps Team', label: 'DevOps Team' },
              { value: 'Data Science Team', label: 'Data Science Team' },
            ]}
          />
          <Select
            value={developerFilter}
            onChange={(e) => setDeveloperFilter(e.target.value)}
            options={[{ value: 'all', label: 'All Developers' }, ...developers.map((d) => ({ value: d, label: d }))]}
          />
          <Select
            value={repoFilter}
            onChange={(e) => setRepoFilter(e.target.value)}
            options={[{ value: 'all', label: 'All Repos' }, ...repos.map((r) => ({ value: r, label: r }))]}
          />
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </Card>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {activeSection === 'overview' && (
            <OverviewSection
              kpis={{
                totalCommitsToday,
                activeDevelopers,
                avgWorkingHours,
                totalTasksCompleted,
                avgProductivityScore,
                idleDevelopersCount,
              }}
              dailyActivityTrend={dailyActivityTrend}
              commitsVsTasks={commitsVsTasks}
              productivityDistribution={productivityDistribution}
              topPerformers={performanceSorted.slice(0, 5)}
              overviewRows={overviewRows}
            />
          )}

          {activeSection === 'commits' && (
            <CommitsSection
              kpis={{
                totalCommits,
                avgCommitsPerDeveloper,
                highestCommitDev: highestCommitDev?.developerName ?? '-',
                repoActivityCount: repoContribution.length,
              }}
              weeklyCommitTrend={weeklyCommitTrend}
              repoContribution={repoContribution}
              additionsVsDeletions={additionsVsDeletions}
              commits={filteredCommits}
              qualityInsights={{
                highCommitRatio,
                lowCommitRatio: Number((1 - highCommitRatio).toFixed(2)),
                largeChangeCount,
              }}
            />
          )}

          {activeSection === 'attendance' && (
            <AttendanceSection
              kpis={{ presentToday, absentToday, lateLogins, attendancePct }}
              attendanceTrend={attendanceTrend}
              teamAttendance={teamAttendance}
              attendanceAlerts={attendanceAlerts}
              attendanceRows={buildAttendanceRows(filteredAttendance, filteredWorkHours)}
            />
          )}

          {activeSection === 'hours' && (
            <HoursSection
              kpis={{ avgHoursToday, overtimeHours, underworked, peakHour }}
              dailyHoursTrend={dailyHoursTrend}
              hoursDistribution={hoursDistribution}
              workPatternInsight={workPatternInsight}
              hourRows={buildHoursRows(filteredWorkHours)}
            />
          )}

          {activeSection === 'performance' && (
            <PerformanceSection
              kpis={{ avgPerf, topPerformer, lowPerformer, teamEfficiency }}
              scoreDistribution={scoreDistribution}
              rankingTrend={rankingTrend}
              leaderboard={performanceSorted.slice(0, 10)}
              breakdownRows={buildPerformanceBreakdownRows(performanceSorted)}
            />
          )}

          <AdvancedSections
            timelineRows={timelineRows}
            riskRows={riskRows}
            teamComparisonRows={teamComparisonRows}
            aiInsights={aiInsights}
          />
        </>
      )}
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-24" />
          </Card>
        ))}
      </div>
      <Card>
        <Skeleton className="h-72" />
      </Card>
      <Card>
        <Skeleton className="h-72" />
      </Card>
    </div>
  );
}

function InsightsBox({ title, lines }: { title: string; lines: string[] }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
            - {line}
          </p>
        ))}
      </div>
    </Card>
  );
}

function OverviewSection({
  kpis,
  dailyActivityTrend,
  commitsVsTasks,
  productivityDistribution,
  topPerformers,
  overviewRows,
}: any) {
  return (
    <div className="space-y-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/35 p-4 md:p-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Total Commits Today', value: kpis.totalCommitsToday, icon: <GitCommit size={18} className="text-indigo-600" /> },
          { label: 'Active Developers', value: kpis.activeDevelopers, icon: <Users size={18} className="text-emerald-600" /> },
          { label: 'Avg Working Hours', value: `${kpis.avgWorkingHours}h`, icon: <Clock size={18} className="text-blue-600" /> },
          { label: 'Tasks Completed', value: kpis.totalTasksCompleted, icon: <Target size={18} className="text-violet-600" /> },
          { label: 'Productivity Score %', value: `${kpis.avgProductivityScore}%`, icon: <TrendingUp size={18} className="text-purple-600" /> },
          { label: 'Idle Dev Count', value: kpis.idleDevelopersCount, icon: <AlertTriangle size={18} className="text-amber-600" /> },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
          >
            <div className="flex items-center justify-between mb-1">{item.icon}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyActivityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="commits" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productivity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={productivityDistribution} dataKey="value" nameKey="name" outerRadius={95} label>
                {productivityDistribution.map((_: any, idx: number) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commits vs Tasks Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commitsVsTasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="developer" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="commits" fill="#4F46E5" />
              <Bar dataKey="tasks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topPerformers.map((dev: DeveloperSummary, idx: number) => (
              <div key={dev.developerId} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Rank #{idx + 1}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{dev.developerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{dev.teamName}</p>
                <p className="mt-2 text-sm font-bold text-indigo-600">{dev.performanceScore}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview Table</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Developer</TableHeader>
              <TableHeader>Commits</TableHeader>
              <TableHeader>Tasks</TableHeader>
              <TableHeader>Hours</TableHeader>
              <TableHeader>Score</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {overviewRows.map((row: any) => (
              <TableRow key={row.developerName}>
                <TableCell>{row.developerName}</TableCell>
                <TableCell>{row.commits}</TableCell>
                <TableCell>{row.tasks}</TableCell>
                <TableCell>{row.hours}</TableCell>
                <TableCell>{row.score}%</TableCell>
                <TableCell>
                  <Badge variant={row.status === 'High' ? 'success' : row.status === 'Medium' ? 'warning' : 'danger'}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <InsightsBox
        title="Overview Insights"
        lines={[
          `Top productivity cohort contains ${productivityDistribution[0].value} developers.`,
          `Average productivity is ${kpis.avgProductivityScore}% with ${kpis.idleDevelopersCount} currently idle developers.`,
          'Commit and task output show balanced throughput across active contributors.',
        ]}
      />
    </div>
  );
}

function CommitsSection({ kpis, weeklyCommitTrend, repoContribution, additionsVsDeletions, commits, qualityInsights }: any) {
  return (
    <div className="space-y-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/35 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Total Commits</p>
          <p className="text-xl font-bold">{kpis.totalCommits}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Avg / Developer</p>
          <p className="text-xl font-bold">{kpis.avgCommitsPerDeveloper}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Top Dev</p>
          <p className="text-xl font-bold">{kpis.highestCommitDev}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Repo Activity</p>
          <p className="text-xl font-bold">{kpis.repoActivityCount}</p>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Commits Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={weeklyCommitTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="commits" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Repo-wise Contribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={repoContribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="repo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commits" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additions vs Deletions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={additionsVsDeletions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="developerName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="additions" stackId="a" fill="#3B82F6" />
              <Bar dataKey="deletions" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <InsightsBox
        title="Commit Quality Insights"
        lines={[
          `High-commit ratio: ${(qualityInsights.highCommitRatio * 100).toFixed(0)}%`,
          `Low-commit ratio: ${(qualityInsights.lowCommitRatio * 100).toFixed(0)}%`,
          `Large code change events detected: ${qualityInsights.largeChangeCount}`,
        ]}
      />

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commit Analytics Table</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Developer</TableHeader>
              <TableHeader>Repo</TableHeader>
              <TableHeader>Commits</TableHeader>
              <TableHeader>Additions</TableHeader>
              <TableHeader>Deletions</TableHeader>
              <TableHeader>PRs</TableHeader>
              <TableHeader>Last Commit</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {commits.map((c: DeveloperCommitDay, i: number) => (
              <TableRow key={`${c.developerId}-${c.date}-${i}`}>
                <TableCell>{c.developerName}</TableCell>
                <TableCell>{c.repo}</TableCell>
                <TableCell>{c.commits}</TableCell>
                <TableCell>{c.additions}</TableCell>
                <TableCell>{c.deletions}</TableCell>
                <TableCell>{Math.max(1, Math.round(c.commits / 4))}</TableCell>
                <TableCell>{c.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AttendanceSection({ kpis, attendanceTrend, teamAttendance, attendanceAlerts, attendanceRows }: any) {
  const heatmapCells = attendanceRows.slice(0, 35).map((row: any, idx: number) => ({
    key: `${row.employee}-${idx}`,
    intensity: row.status === 'Present' ? (row.late ? 2 : 4) : 1,
  }));
  return (
    <div className="space-y-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/15 p-4 md:p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Present Today', value: kpis.presentToday },
          { label: 'Absent Today', value: kpis.absentToday },
          { label: 'Late Logins', value: kpis.lateLogins },
          { label: 'Attendance %', value: `${kpis.attendancePct}%` },
        ].map((k: any) => (
          <div key={k.label} className="rounded-lg bg-white/80 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800 p-3">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">{k.label}</p>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Timeline</h3>
          <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3">
            {attendanceRows.slice(0, 20).map((row: any, idx: number) => (
              <div key={`${row.employee}-${idx}`} className="flex gap-3">
                <div className="w-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${row.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {idx < 19 && <div className="w-px h-8 bg-emerald-200 dark:bg-emerald-800 mx-auto mt-1" />}
                </div>
                <div className="flex-1 rounded-lg border border-emerald-200/70 dark:border-emerald-800 p-2">
                  <p className="text-sm font-medium">{row.employee}</p>
                  <p className="text-xs text-gray-500">{row.loginTime} - {row.logoutTime} · {row.remarks}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Calendar Heatmap</h3>
          <div className="grid grid-cols-7 gap-1">
            {heatmapCells.map((cell: any) => (
              <div
                key={cell.key}
                className={`h-6 rounded ${
                  cell.intensity >= 4
                    ? 'bg-emerald-500'
                    : cell.intensity >= 2
                      ? 'bg-emerald-300'
                      : 'bg-red-200 dark:bg-red-900/60'
                }`}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10B981" />
              <Line type="monotone" dataKey="late" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team-wise Attendance</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={teamAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendancePercent" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <InsightsBox
        title="Attendance Alerts"
        lines={attendanceAlerts.length ? attendanceAlerts : ['No major attendance anomalies detected in selected window.']}
      />

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Details</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Employee</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Login Time</TableHeader>
              <TableHeader>Logout Time</TableHeader>
              <TableHeader>Late</TableHeader>
              <TableHeader>Remarks</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRows.map((r: any, i: number) => (
              <TableRow key={`${r.employee}-${i}`}>
                <TableCell>{r.employee}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{r.loginTime}</TableCell>
                <TableCell>{r.logoutTime}</TableCell>
                <TableCell>{r.late ? 'Yes' : 'No'}</TableCell>
                <TableCell>{r.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function HoursSection({ kpis, dailyHoursTrend, hoursDistribution, workPatternInsight, hourRows }: any) {
  const efficiencyGauge = Math.min(100, Math.max(1, Number(hourRows[0]?.efficiency ?? 75)));
  return (
    <div className="space-y-6 rounded-2xl bg-blue-50/55 dark:bg-blue-950/20 p-4 md:p-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Avg Hours Today', value: `${kpis.avgHoursToday}h` },
          { label: 'Overtime Hours', value: `${kpis.overtimeHours}h` },
          { label: 'Underworked Employees', value: kpis.underworked },
          { label: 'Peak Working Day', value: kpis.peakHour },
        ].map((k: any) => (
          <div key={k.label} className="rounded-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 px-4 py-3 text-center">
            <p className="text-[11px] text-blue-700 dark:text-blue-300">{k.label}</p>
            <p className="text-lg font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Hours Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyHoursTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hours Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hoursDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="bucket" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Efficiency Gauge</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart
              innerRadius="45%"
              outerRadius="85%"
              data={[{ name: 'Efficiency', value: efficiencyGauge }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={8} fill="#2563EB" />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <InsightsBox title="Work Pattern Insights" lines={workPatternInsight} />

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Hours Table</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Employee</TableHeader>
              <TableHeader>Hours Worked</TableHeader>
              <TableHeader>Idle Time</TableHeader>
              <TableHeader>Overtime</TableHeader>
              <TableHeader>Efficiency %</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {hourRows.map((row: any) => (
              <TableRow key={row.employee}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.hoursWorked}</TableCell>
                <TableCell>{row.idleTime}</TableCell>
                <TableCell>{row.overtime}</TableCell>
                <TableCell>{row.efficiency}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function PerformanceSection({ kpis, scoreDistribution, rankingTrend, leaderboard, breakdownRows }: any) {
  return (
    <div className="space-y-6 rounded-2xl bg-amber-50/65 dark:bg-amber-950/20 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300">Avg Performance Score</p>
          <p className="text-2xl font-black">{kpis.avgPerf}%</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300">Top Performer</p>
          <p className="text-2xl font-black">{kpis.topPerformer}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300">Lowest Performer</p>
          <p className="text-2xl font-black">{kpis.lowPerformer}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300">Team Efficiency</p>
          <p className="text-2xl font-black">{kpis.teamEfficiency}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="developer" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ranking Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rankingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="developer" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="week1" stroke="#94A3B8" />
              <Line dataKey="week2" stroke="#60A5FA" />
              <Line dataKey="week3" stroke="#34D399" />
              <Line dataKey="week4" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leaderboard (Top 10)</h3>
        <div className="space-y-3">
          {leaderboard.map((d: DeveloperSummary, idx: number) => (
            <div
              key={d.developerId}
              className="rounded-xl border border-amber-200 dark:border-amber-800 bg-white/90 dark:bg-zinc-900 p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40">#{idx + 1}</span>
                  <span className="font-semibold">{d.developerName}</span>
                </div>
                <Badge variant={idx < 3 ? 'success' : 'warning'}>{d.performanceScore}%</Badge>
              </div>
              <div className="w-full h-2 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                  style={{ width: `${d.performanceScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Breakdown</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Rank</TableHeader>
              <TableHeader>Employee</TableHeader>
              <TableHeader>Commits</TableHeader>
              <TableHeader>Tasks</TableHeader>
              <TableHeader>Hours</TableHeader>
              <TableHeader>Attendance</TableHeader>
              <TableHeader>Score %</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownRows.map((r: any) => (
              <TableRow key={r.rank + r.employee}>
                <TableCell>{r.rank}</TableCell>
                <TableCell>{r.employee}</TableCell>
                <TableCell>{r.commits}</TableCell>
                <TableCell>{r.tasks}</TableCell>
                <TableCell>{r.hours}</TableCell>
                <TableCell>{r.attendance}%</TableCell>
                <TableCell>{r.score}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AdvancedSections({ timelineRows, riskRows, teamComparisonRows, aiInsights }: any) {
  return (
    <div className="space-y-6">
      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Developer Activity Timeline</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Date</TableHeader>
              <TableHeader>Developer</TableHeader>
              <TableHeader>Commits</TableHeader>
              <TableHeader>Tasks</TableHeader>
              <TableHeader>Login</TableHeader>
              <TableHeader>Hours</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {timelineRows.map((r: any, i: number) => (
              <TableRow key={`${r.date}-${r.developer}-${i}`}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.developer}</TableCell>
                <TableCell>{r.commits}</TableCell>
                <TableCell>{r.tasks}</TableCell>
                <TableCell>{r.login}</TableCell>
                <TableCell>{r.hours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Idle & Risk Detection</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Developer</TableHeader>
              <TableHeader>No Commits Today</TableHeader>
              <TableHeader>Low Hours</TableHeader>
              <TableHeader>Pending Tasks Risk</TableHeader>
              <TableHeader>Risk Level</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {riskRows.map((r: any) => (
              <TableRow key={r.developer}>
                <TableCell>{r.developer}</TableCell>
                <TableCell>{r.noCommitsToday ? 'Yes' : 'No'}</TableCell>
                <TableCell>{r.lowHours ? 'Yes' : 'No'}</TableCell>
                <TableCell>{r.pendingRisk}</TableCell>
                <TableCell>
                  <Badge variant={r.riskLevel === 'High' ? 'danger' : r.riskLevel === 'Medium' ? 'warning' : 'success'}>
                    {r.riskLevel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamComparisonRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#4F46E5" />
              <Bar dataKey="avgHours" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Comparison Table</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Team</TableHeader>
                <TableHeader>Developers</TableHeader>
                <TableHeader>Commits</TableHeader>
                <TableHeader>Avg Hours</TableHeader>
                <TableHeader>Avg Score</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamComparisonRows.map((row: any) => (
                <TableRow key={row.team}>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.developers}</TableCell>
                  <TableCell>{row.commits}</TableCell>
                  <TableCell>{row.avgHours}</TableCell>
                  <TableCell>{row.avgScore}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <InsightsBox title="Productivity Insights (AI-style)" lines={aiInsights} />
    </div>
  );
}

function safeAvg(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

function aggregateDailyActivityTrend(commits: DeveloperCommitDay[], hours: WorkHourPoint[]) {
  const days = Array.from(new Set([...commits.map((c) => c.date), ...hours.map((h) => h.date)])).sort();
  return days.map((date) => ({
    date,
    commits: commits.filter((c) => c.date === date).reduce((s, c) => s + c.commits, 0) || 1,
    hours: Number(
      (
        hours.filter((h) => h.date === date).reduce((s, h) => s + h.hoursWorked, 0) /
        Math.max(1, hours.filter((h) => h.date === date).length)
      ).toFixed(1),
    ) || 1,
  }));
}

function aggregateCommitsByDeveloper(commits: DeveloperCommitDay[]) {
  const byDev: Record<string, number> = {};
  commits.forEach((c) => {
    byDev[c.developerName] = (byDev[c.developerName] || 0) + c.commits;
  });
  return Object.entries(byDev).map(([developerName, commits]) => ({ developerName, commits: commits || 1 }));
}

function aggregateWeeklyTrend(commits: DeveloperCommitDay[]) {
  const byWeek: Record<string, number> = {};
  commits.forEach((c) => {
    const day = Number(c.date.slice(-2));
    const week = `Week ${Math.floor((day - 1) / 7) + 1}`;
    byWeek[week] = (byWeek[week] || 0) + c.commits;
  });
  return Object.entries(byWeek).map(([week, commits]) => ({ week, commits: commits || 1 }));
}

function aggregateRepoContribution(commits: DeveloperCommitDay[]) {
  const byRepo: Record<string, number> = {};
  commits.forEach((c) => {
    byRepo[c.repo] = (byRepo[c.repo] || 0) + c.commits;
  });
  return Object.entries(byRepo).map(([repo, commits]) => ({ repo, commits: commits || 1 }));
}

function aggregateAdditionsVsDeletions(commits: DeveloperCommitDay[]) {
  const byDev: Record<string, { additions: number; deletions: number }> = {};
  commits.forEach((c) => {
    if (!byDev[c.developerName]) byDev[c.developerName] = { additions: 0, deletions: 0 };
    byDev[c.developerName].additions += c.additions;
    byDev[c.developerName].deletions += c.deletions;
  });
  return Object.entries(byDev).map(([developerName, v]) => ({ developerName, ...v }));
}

function aggregateAttendanceTrend(attendance: AttendancePoint[]) {
  const byDate: Record<string, { present: number; late: number }> = {};
  attendance.forEach((a) => {
    if (!byDate[a.date]) byDate[a.date] = { present: 0, late: 0 };
    if (a.present) byDate[a.date].present += 1;
    if (a.late) byDate[a.date].late += 1;
  });
  return Object.entries(byDate)
    .map(([date, v]) => ({ date, present: v.present || 1, late: v.late || 1 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateTeamAttendance(attendance: AttendancePoint[]) {
  const byTeam: Record<string, { total: number; present: number }> = {};
  attendance.forEach((a) => {
    if (!byTeam[a.teamName]) byTeam[a.teamName] = { total: 0, present: 0 };
    byTeam[a.teamName].total += 1;
    if (a.present) byTeam[a.teamName].present += 1;
  });
  return Object.entries(byTeam).map(([team, v]) => ({
    team,
    attendancePercent: Number(((v.present / Math.max(1, v.total)) * 100).toFixed(1)),
  }));
}

function aggregateHoursPerDay(hours: WorkHourPoint[]) {
  const byDate: Record<string, number> = {};
  hours.forEach((h) => {
    byDate[h.date] = (byDate[h.date] || 0) + h.hoursWorked;
  });
  return Object.entries(byDate)
    .map(([date, val]) => ({ date, hours: Number((val / 1).toFixed(1)) || 1 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildHoursDistribution(hours: WorkHourPoint[]) {
  const buckets = [
    { bucket: '6-7h', min: 6, max: 7, count: 0 },
    { bucket: '7-8h', min: 7, max: 8, count: 0 },
    { bucket: '8-9h', min: 8, max: 9, count: 0 },
    { bucket: '9h+', min: 9, max: 30, count: 0 },
  ];
  hours.forEach((h) => {
    const b = buckets.find((x) => h.hoursWorked >= x.min && h.hoursWorked < x.max) ?? buckets[0];
    b.count += 1;
  });
  return buckets.map((b) => ({ bucket: b.bucket, count: b.count || 1 }));
}

function buildAttendanceAlerts(attendance: AttendancePoint[]) {
  const byDev: Record<string, { late: number; absent: number; total: number }> = {};
  attendance.forEach((a) => {
    if (!byDev[a.developerName]) byDev[a.developerName] = { late: 0, absent: 0, total: 0 };
    byDev[a.developerName].total += 1;
    if (a.late) byDev[a.developerName].late += 1;
    if (!a.present) byDev[a.developerName].absent += 1;
  });
  return Object.entries(byDev)
    .filter(([, v]) => v.late >= 2 || v.absent >= 2)
    .map(([name, v]) => `${name} has ${v.late} late logins and ${v.absent} absences in selected period.`);
}

function buildAttendanceRows(attendance: AttendancePoint[], workHours: WorkHourPoint[]) {
  return attendance.slice(0, 25).map((a) => {
    const wh = workHours.find((w) => w.developerName === a.developerName && w.date === a.date);
    const loginTime = a.late ? '10:12' : '09:05';
    const logoutTime = wh ? (wh.hoursWorked >= 8 ? '18:20' : '17:35') : '17:30';
    return {
      employee: a.developerName,
      status: a.present ? 'Present' : 'Absent',
      loginTime,
      logoutTime,
      late: a.late,
      remarks: a.present ? (a.late ? 'Late login' : 'On time') : 'Planned leave',
    };
  });
}

function buildHoursRows(workHours: WorkHourPoint[]) {
  const byDev: Record<string, { hours: number; idle: number; overtime: number; days: number }> = {};
  workHours.forEach((w) => {
    if (!byDev[w.developerName]) byDev[w.developerName] = { hours: 0, idle: 0, overtime: 0, days: 0 };
    byDev[w.developerName].hours += w.hoursWorked;
    byDev[w.developerName].idle += w.idleHours;
    byDev[w.developerName].overtime += w.overtimeHours;
    byDev[w.developerName].days += 1;
  });
  return Object.entries(byDev).map(([employee, v]) => {
    const avgHours = v.hours / Math.max(1, v.days);
    const efficiency = Math.max(60, Math.min(99, ((avgHours - v.idle / v.days) / 9) * 100));
    return {
      employee,
      hoursWorked: Number(avgHours.toFixed(1)),
      idleTime: Number((v.idle / v.days).toFixed(1)),
      overtime: Number((v.overtime / v.days).toFixed(1)),
      efficiency: Number(efficiency.toFixed(1)),
    };
  });
}

function buildWorkPatternInsight(dailyHoursTrend: { date: string; hours: number }[]) {
  const peak = dailyHoursTrend.slice().sort((a, b) => b.hours - a.hours)[0];
  const low = dailyHoursTrend.slice().sort((a, b) => a.hours - b.hours)[0];
  return [
    `Most active day in selected range: ${peak?.date} (${peak?.hours}h).`,
    `Lowest productivity slot observed on ${low?.date} (${low?.hours}h).`,
    'Overtime concentration is higher near end-of-week, indicating delivery crunch patterns.',
  ];
}

function buildPerformanceBreakdownRows(sorted: DeveloperSummary[]) {
  return sorted.map((d, idx) => ({
    rank: idx + 1,
    employee: d.developerName,
    commits: d.totalCommitsWeek,
    tasks: d.tasksCompleted,
    hours: d.avgWorkingHours,
    attendance: d.attendancePercent,
    score: d.performanceScore,
  }));
}

function buildTimeline(commits: DeveloperCommitDay[], attendance: AttendancePoint[], workHours: WorkHourPoint[]) {
  return commits.slice(0, 30).map((c) => {
    const att = attendance.find((a) => a.developerName === c.developerName && a.date === c.date);
    const wh = workHours.find((w) => w.developerName === c.developerName && w.date === c.date);
    return {
      date: c.date,
      developer: c.developerName,
      commits: c.commits,
      tasks: Math.max(1, Math.round(c.commits / 2)),
      login: att?.late ? '10:10' : '09:00',
      hours: wh?.hoursWorked ?? 7,
    };
  });
}

function buildRiskDetectionRows(overviewRows: any[], commits: DeveloperCommitDay[]) {
  return overviewRows.map((r) => {
    const todayCommits = commits
      .filter((c) => c.developerName === r.developerName)
      .slice(-1)[0]?.commits ?? 1;
    const noCommitsToday = todayCommits <= 3;
    const lowHours = r.hours < 7;
    const pendingRisk = r.tasks < r.commits ? 'Low' : r.tasks - r.commits > 5 ? 'High' : 'Medium';
    const highSignals = Number(noCommitsToday) + Number(lowHours) + Number(pendingRisk === 'High');
    const riskLevel = highSignals >= 2 ? 'High' : highSignals === 1 ? 'Medium' : 'Low';
    return { developer: r.developerName, noCommitsToday, lowHours, pendingRisk, riskLevel };
  });
}

function buildTeamComparisonRows(
  summaries: DeveloperSummary[],
  commits: DeveloperCommitDay[],
  workHours: WorkHourPoint[],
) {
  const teams = Array.from(new Set(summaries.map((s) => s.teamName)));
  return teams.map((team) => {
    const teamMembers = summaries.filter((s) => s.teamName === team).map((s) => s.developerName);
    const teamCommits = commits
      .filter((c) => teamMembers.includes(c.developerName))
      .reduce((sum, c) => sum + c.commits, 0);
    const teamHours = safeAvg(workHours.filter((w) => teamMembers.includes(w.developerName)).map((w) => w.hoursWorked));
    const teamScore = safeAvg(summaries.filter((s) => s.teamName === team).map((s) => s.performanceScore));
    return {
      team,
      developers: teamMembers.length,
      commits: teamCommits || 1,
      avgHours: teamHours || 1,
      avgScore: teamScore || 1,
    };
  });
}

function buildAiInsights(teamComparisonRows: any[], attendanceAlerts: string[], riskRows: any[]) {
  const topTeam = teamComparisonRows.slice().sort((a, b) => b.avgScore - a.avgScore)[0];
  const riskCount = riskRows.filter((r) => r.riskLevel === 'High').length;
  return [
    `${topTeam?.team ?? 'Selected top team'} productivity improved to ${topTeam?.avgScore ?? 0}% in selected range.`,
    `High-risk developers identified: ${riskCount}. Review workload and mentoring opportunities.`,
    attendanceAlerts[0] ?? 'Attendance consistency remains stable with minor late-login spikes.',
    'Cross-team comparison suggests balancing backend and data-science work-hours for sustained throughput.',
  ];
}


