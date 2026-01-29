export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Lead' | 'Member';
  teamId: string;
  avatar?: string;
  performanceScore?: number;
}

export interface Team {
  id: string;
  name: string;
  leadId: string;
  memberIds: string[];
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  completionPercentage: number;
  health: 'healthy' | 'at-risk' | 'critical';
  teamIds: string[];
}

export interface Task {
  id: string;
  employeeId: string;
  projectId: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress';
  hoursWorked: number;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DailyActivity {
  id: string;
  employeeId: string;
  employeeName: string;
  teamId: string;
  teamName: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  status: 'completed' | 'pending' | 'in-progress';
  hoursWorked: number;
  date: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  tasksCompletedToday: number;
  tasksPending: number;
  teamPerformance: number;
  projectCompletion: number;
}

export interface Report {
  id: string;
  type: 'team' | 'employee' | 'project' | 'daily';
  title: string;
  generatedAt: string;
  data: any;
}

export interface TeamProjectBreakdown {
  project: string;
  completed: number;
  pending: number;
}

export interface TeamMemberPerformance {
  name: string;
  tasksCompleted: number;
  tasksPending: number;
  hoursWorked: number;
  performance: number;
}

export interface TeamReportData {
  teamName: string;
  lead: string;
  totalMembers: number;
  tasksCompleted: number;
  tasksPending: number;
  productivityScore: number;
  avgHoursWorked: number;
  projectBreakdown: TeamProjectBreakdown[];
  memberPerformance: TeamMemberPerformance[];
}

export interface EmployeeProjectContribution {
  project: string;
  completed: number;
  pending: number;
  hoursWorked: number;
}

export interface EmployeeDailyPerformancePoint {
  date: string;
  completed: number;
  pending: number;
  hoursWorked: number;
}

export interface EmployeeActivityRow {
  date: string;
  project: string;
  task: string;
  status: 'completed' | 'pending' | 'in-progress';
  hoursWorked: number;
}

export interface EmployeeReportData {
  employeeId: string;
  employeeName: string;
  role: string;
  completedTasks: number;
  pendingTasks: number;
  totalHoursWorked: number;
  productivityScore: number;
  projectContribution: EmployeeProjectContribution[];
  dailyPerformance: EmployeeDailyPerformancePoint[];
  activity: EmployeeActivityRow[];
}

export interface ProjectTeamContribution {
  team: string;
  completed: number;
  pending: number;
  hoursWorked: number;
}

export interface ProjectMemberContribution {
  member: string;
  team: string;
  completed: number;
  pending: number;
  hoursWorked: number;
}

export interface ProjectActivityRow {
  team: string;
  member: string;
  completed: number;
  pending: number;
  hoursWorked: number;
}

export interface ProjectReportData {
  projectId: string;
  projectName: string;
  completionPercent: number;
  tasksCompleted: number;
  tasksPending: number;
  healthStatus: 'healthy' | 'at-risk' | 'delayed';
  teamContribution: ProjectTeamContribution[];
  workloadDistribution: ProjectMemberContribution[];
  activity: ProjectActivityRow[];
}

export interface DailyTeamActivityPoint {
  team: string;
  tasksCompleted: number;
  hoursWorked: number;
}

export interface DailyHourlyWorkPoint {
  hour: string;
  tasksCompleted: number;
}

export interface DailyActivityRow {
  employee: string;
  team: string;
  project: string;
  task: string;
  status: 'completed' | 'pending' | 'in-progress';
  hoursWorked: number;
}

export interface DailyReportData {
  date: string;
  activeEmployees: number;
  totalTasksCompleted: number;
  averageHoursWorked: number;
  teamActivity: DailyTeamActivityPoint[];
  hourlyDistribution: DailyHourlyWorkPoint[];
  entries: DailyActivityRow[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'member';
  avatar?: string;
  teamId?: string;
}

export type NotificationType =
  | 'taskCompleted'
  | 'taskPending'
  | 'projectDelayed'
  | 'performanceAlert'
  | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string; // human-friendly, e.g. "5 min ago"
  read: boolean;
}

