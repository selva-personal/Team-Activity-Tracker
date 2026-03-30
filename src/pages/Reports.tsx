import React, { useEffect, useState } from 'react';
import {
  useLazyGetTeamReportQuery,
  useLazyGetEmployeeReportQuery,
  useLazyGetProjectReportQuery,
  useLazyGetDailyReportQuery,
} from '@/store/api/reportsApi';
import { Button } from '@/components/ui/Button';
import { Users, UserSquare2, FolderKanban, Calendar, Loader2 } from 'lucide-react';
import type {
  TeamReportData,
  EmployeeReportData,
  ProjectReportData,
  DailyReportData,
} from '@/types';
import { APP_REPORTS_TITLE } from '@/config/appConfig';

type ReportType = 'team' | 'employee' | 'project' | 'daily';

type ReportData =
  | TeamReportData
  | EmployeeReportData
  | ProjectReportData
  | DailyReportData
  | null;

const TEAM_OPTIONS = [
  { key: 'frontend', label: 'Frontend Team' },
  { key: 'backend', label: 'Backend Team' },
  { key: 'devops', label: 'DevOps Team' },
  { key: 'testing', label: 'Testing Team' },
  { key: 'datascience', label: 'Data Science Team' },
  { key: 'network', label: 'Network Security Team' },
  { key: 'hr', label: 'HR Team' },
  { key: 'medical', label: 'Medical Coding Team' },
  { key: 'seo', label: 'SEO Team' },
  { key: 'it', label: 'IT Team' },
  { key: 'ceo', label: 'CEO Team' },
  { key: 'uiux', label: 'UI/UX Team' },
] as const;

type TeamKey = (typeof TEAM_OPTIONS)[number]['key'];

const EMPLOYEE_OPTIONS = [
  'Adithya',
  'Bharani',
  'Karthick Rajan',
  'Murali',
  'Mani',
  'Gowri',
  'Selva',
  'Sai Prasath',
  'Aarthi',
  'Selvamani',
  'Chris',
  'Kezi',
  'Ecsipha',
  'Kayal',
  'Nadhiya',
] as const;

const PROJECT_OPTIONS = [
  'Risk Adjustment',
  'GI Coding',
  'Home Health Coding',
  'Anesthesia Coding',
  'E/M Coding',
  'AR Calling',
  'Radiology Coding',
  'AM Coding',
] as const;

export const Reports: React.FC = () => {
  const [fetchTeamReport, { isLoading: isTeamReportLoading }] = useLazyGetTeamReportQuery();

  const [fetchEmployeeReport, { isLoading: isEmployeeReportLoading }] =
    useLazyGetEmployeeReportQuery();

  const [fetchProjectReport, { isLoading: isProjectReportLoading }] =
    useLazyGetProjectReportQuery();

  const [fetchDailyReport, { isLoading: isDailyReportLoading }] = useLazyGetDailyReportQuery();

  const [selectedReportType, setSelectedReportType] = useState<ReportType>('team');
  const [activeReportType, setActiveReportType] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState<ReportData>(null);

  const [selectedTeam, setSelectedTeam] = useState<TeamKey>('frontend');
  const [teamReportInitialized, setTeamReportInitialized] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<string>('Adithya');
  const [employeeFrom, setEmployeeFrom] = useState<string>('2026-01-01');
  const [employeeTo, setEmployeeTo] = useState<string>('2026-01-31');

  const [selectedProject, setSelectedProject] = useState<string>('Risk Adjustment');
  const [projectFrom, setProjectFrom] = useState<string>('2026-01-01');
  const [projectTo, setProjectTo] = useState<string>('2026-01-31');

  const [dailyDate, setDailyDate] = useState<string>('2026-01-23');

  const handleSelectReportType = (type: ReportType) => {
    setSelectedReportType(type);
    setActiveReportType(null);
  };

  const handleGenerateTeamReport = async () => {
    setTeamReportInitialized(true);
    const result = await fetchTeamReport(selectedTeam);
    if (result.data) setReportData(result.data);
  };

  const handleGenerateEmployeeReport = async () => {
    const result = await fetchEmployeeReport({
      employeeId: selectedEmployee,
      fromDate: employeeFrom,
      toDate: employeeTo,
    });
    if (result.data) setReportData(result.data);
  };

  const handleGenerateProjectReport = async () => {
    const result = await fetchProjectReport({
      projectId: selectedProject,
      fromDate: projectFrom,
      toDate: projectTo,
    });
    if (result.data) setReportData(result.data);
  };

  const handleGenerateDailyReport = async () => {
    const result = await fetchDailyReport({ date: dailyDate });
    if (result.data) setReportData(result.data);
  };

  const handleGenerateSelectedReport = async () => {
    setActiveReportType(selectedReportType);

    if (selectedReportType === 'team') {
      await handleGenerateTeamReport();
    } else if (selectedReportType === 'employee') {
      await handleGenerateEmployeeReport();
    } else if (selectedReportType === 'project') {
      await handleGenerateProjectReport();
    } else {
      await handleGenerateDailyReport();
    }
  };

  useEffect(() => {
    if (teamReportInitialized) {
      fetchTeamReport(selectedTeam).then((result) => {
        if (result.data) setReportData(result.data);
      });
    }
  }, [selectedTeam, teamReportInitialized, fetchTeamReport]);

  const isGeneratingSelected =
    (selectedReportType === 'team' && isTeamReportLoading) ||
    (selectedReportType === 'employee' && isEmployeeReportLoading) ||
    (selectedReportType === 'project' && isProjectReportLoading) ||
    (selectedReportType === 'daily' && isDailyReportLoading);

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {APP_REPORTS_TITLE}
        </h1>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Vigilon – AI-Based Employee Activity Monitoring & Face Recognition System
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Run detailed analytics reports for teams, employees, projects, and daily activity.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* LEFT: Controls */}
        <div className="w-full lg:w-72 xl:w-80">
          <div className="h-full rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 shadow-sm p-4 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Report Types
              </h2>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleSelectReportType('team')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedReportType === 'team'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Users size={16} />
                  <span>Team Performance Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReportType('employee')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedReportType === 'employee'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <UserSquare2 size={16} />
                  <span>Employee Performance Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReportType('project')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedReportType === 'project'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FolderKanban size={16} />
                  <span>Project Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReportType('daily')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedReportType === 'daily'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Calendar size={16} />
                  <span>Daily Activity Report</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Filters
              </h3>

              {selectedReportType === 'team' && (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Team
                    </span>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value as TeamKey)}
                      className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TEAM_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedReportType === 'employee' && (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Employee
                    </span>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {EMPLOYEE_OPTIONS.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        From
                      </span>
                      <input
                        type="date"
                        value={employeeFrom}
                        onChange={(e) => setEmployeeFrom(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        To
                      </span>
                      <input
                        type="date"
                        value={employeeTo}
                        onChange={(e) => setEmployeeTo(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedReportType === 'project' && (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Project
                    </span>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PROJECT_OPTIONS.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        From
                      </span>
                      <input
                        type="date"
                        value={projectFrom}
                        onChange={(e) => setProjectFrom(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        To
                      </span>
                      <input
                        type="date"
                        value={projectTo}
                        onChange={(e) => setProjectTo(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedReportType === 'daily' && (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Date
                    </span>
                    <input
                      type="date"
                      value={dailyDate}
                      onChange={(e) => setDailyDate(e.target.value)}
                      className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGenerateSelectedReport}
                disabled={isGeneratingSelected}
              >
                {isGeneratingSelected ? 'Generating Report...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: Workspace */}
        <div className="flex-1">
          <div className="h-full min-h-[480px] rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 shadow-sm p-6 overflow-auto relative">
            {isGeneratingSelected && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-2xl z-10 animate-fade-in"
                aria-busy="true"
              >
                <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generating Report...
                </p>
              </div>
            )}

            {!isGeneratingSelected && activeReportType && reportData && (
              <div className="animate-fade-in overflow-auto h-full">
                {activeReportType === 'team' && (
                  <TeamReportView data={reportData as TeamReportData} />
                )}
                {activeReportType === 'employee' && (
                  <EmployeeReportView data={reportData as EmployeeReportData} />
                )}
                {activeReportType === 'project' && (
                  <ProjectReportView data={reportData as ProjectReportData} />
                )}
                {activeReportType === 'daily' && (
                  <DailyReportView data={reportData as DailyReportData} />
                )}
              </div>
            )}

            {!isGeneratingSelected && (!activeReportType || !reportData) && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium mb-2">Select report type and generate report</p>
                <p className="text-sm max-w-md">
                  Choose a report on the left, configure filters, and click{' '}
                  <span className="font-semibold">Generate Report</span> to see full analytics here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Report view components ---

function TeamReportView({ data }: { data: TeamReportData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.teamName}</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">Lead: {data.lead}</span>
        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
          Productivity: {data.productivityScore}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.totalMembers} members · {data.tasksCompleted} completed · {data.tasksPending} pending
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Avg hours: {data.avgHoursWorked}h
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Project breakdown
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Project</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.projectBreakdown.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.project}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.completed}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.pending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Member performance
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Member</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.memberPerformance.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.name}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.tasksCompleted}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.tasksPending}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.performance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeeReportView({ data }: { data: EmployeeReportData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.employeeName}</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">{data.role}</span>
        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
          Score: {data.productivityScore}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.completedTasks} completed · {data.pendingTasks} pending · {data.totalHoursWorked}h
          total
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Project contribution
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Project</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.projectContribution.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.project}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.completed}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.pending}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Daily performance (trend)
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Day</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.dailyPerformance.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.date}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.completed}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.pending}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Activity</h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Project</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Task</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.activity.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.date}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.project}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.task}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        row.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                          : row.status === 'in-progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProjectReportView({ data }: { data: ProjectReportData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.projectName}</h2>
        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
          {data.completionPercent}% complete
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            data.healthStatus === 'healthy'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : data.healthStatus === 'at-risk'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          {data.healthStatus}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.tasksCompleted} completed · {data.tasksPending} pending
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Team contribution
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Team</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.teamContribution.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.team}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.completed}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.pending}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Workload distribution
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Member</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Team</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.workloadDistribution.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.member}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.team}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.completed}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.pending}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DailyReportView({ data }: { data: DailyReportData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Report — {data.date}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.activeEmployees} active employees
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.totalTasksCompleted} tasks completed
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Avg {data.averageHoursWorked}h worked
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Team activity
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Team</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">
                  Tasks completed
                </th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.teamActivity.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.team}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.tasksCompleted}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Hourly distribution
        </h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Hour</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Tasks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.hourlyDistribution.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.hour}</td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.tasksCompleted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Entries</h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Employee</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Team</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Project</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Task</th>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.entries.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-gray-900/50">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.employee}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.team}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.project}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.task}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        row.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                          : row.status === 'in-progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    {row.hoursWorked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

