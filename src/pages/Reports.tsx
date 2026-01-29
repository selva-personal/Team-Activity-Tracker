import React, { useEffect, useState } from 'react';
import {
  useLazyGetTeamReportQuery,
  useLazyGetEmployeeReportQuery,
  useLazyGetProjectReportQuery,
  useLazyGetDailyReportQuery,
} from '@/store/api/reportsApi';
import { Button } from '@/components/ui/Button';
import { Users, UserSquare2, FolderKanban, Calendar } from 'lucide-react';

type ReportType = 'team' | 'employee' | 'project' | 'daily';

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
    await fetchTeamReport(selectedTeam);
  };

  const handleGenerateEmployeeReport = async () => {
    await fetchEmployeeReport({
      employeeId: selectedEmployee,
      fromDate: employeeFrom,
      toDate: employeeTo,
    });
  };

  const handleGenerateProjectReport = async () => {
    await fetchProjectReport({
      projectId: selectedProject,
      fromDate: projectFrom,
      toDate: projectTo,
    });
  };

  const handleGenerateDailyReport = async () => {
    await fetchDailyReport({ date: dailyDate });
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
      fetchTeamReport(selectedTeam);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
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
          <div className="h-full min-h-[480px] rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 shadow-sm p-6 overflow-auto">
            {!activeReportType && (
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

