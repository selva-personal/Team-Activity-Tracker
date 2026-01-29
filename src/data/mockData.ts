import { Employee, Team, Project, Task, DailyActivity, Notification } from '@/types';

// Teams Data
export const mockTeams: Team[] = [
  { id: '1', name: 'Frontend Team', leadId: 'emp-1', memberIds: ['emp-2', 'emp-3', 'emp-4', 'emp-5'], color: '#3B82F6' },
  { id: '2', name: 'Backend Team', leadId: 'emp-6', memberIds: ['emp-7', 'emp-8'], color: '#10B981' },
  { id: '3', name: 'DevOps Team', leadId: 'emp-9', memberIds: ['emp-1'], color: '#F59E0B' },
  { id: '4', name: 'Testing Team', leadId: 'emp-10', memberIds: ['emp-11', 'emp-12'], color: '#8B5CF6' },
  { id: '5', name: 'Data Science Team', leadId: 'emp-13', memberIds: ['emp-14', 'emp-15'], color: '#EC4899' },
  { id: '6', name: 'Network Security Team', leadId: 'emp-16', memberIds: [], color: '#EF4444' },
  { id: '7', name: 'HR Team', leadId: 'emp-17', memberIds: ['emp-18', 'emp-19'], color: '#14B8A6' },
  { id: '8', name: 'Medical Coding Team', leadId: 'emp-20', memberIds: ['emp-21', 'emp-22'], color: '#06B6D4' },
  { id: '9', name: 'SEO Team', leadId: 'emp-23', memberIds: ['emp-7', 'emp-24'], color: '#84CC16' },
  { id: '10', name: 'IT Team', leadId: 'emp-25', memberIds: [], color: '#6366F1' },
  { id: '11', name: 'Pantry Team', leadId: 'emp-26', memberIds: [], color: '#F97316' },
  { id: '12', name: 'CEO Team', leadId: 'emp-27', memberIds: ['emp-28', 'emp-9'], color: '#A855F7' },
  { id: '13', name: 'UI/UX Team', leadId: 'emp-29', memberIds: ['emp-30', 'emp-31'], color: '#22C55E' },
];

// Employees Data
export const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'Selva', email: 'selva@company.com', role: 'Lead', teamId: '1', performanceScore: 92 },
  { id: 'emp-2', name: 'Adithya', email: 'adithya@company.com', role: 'Member', teamId: '1', performanceScore: 88 },
  { id: 'emp-3', name: 'Bharani', email: 'bharani@company.com', role: 'Member', teamId: '1', performanceScore: 85 },
  { id: 'emp-4', name: 'Karthick Rajan', email: 'karthick@company.com', role: 'Member', teamId: '1', performanceScore: 90 },
  { id: 'emp-5', name: 'Murali', email: 'murali@company.com', role: 'Member', teamId: '1', performanceScore: 87 },
  { id: 'emp-6', name: 'Ajay', email: 'ajay@company.com', role: 'Lead', teamId: '2', performanceScore: 94 },
  { id: 'emp-7', name: 'Mani', email: 'mani@company.com', role: 'Member', teamId: '2', performanceScore: 89 },
  { id: 'emp-8', name: 'Gowri', email: 'gowri@company.com', role: 'Member', teamId: '2', performanceScore: 86 },
  { id: 'emp-9', name: 'Karthick', email: 'karthick.devops@company.com', role: 'Lead', teamId: '3', performanceScore: 91 },
  { id: 'emp-10', name: 'Balaji', email: 'balaji@company.com', role: 'Lead', teamId: '4', performanceScore: 93 },
  { id: 'emp-11', name: 'Sai Prasath', email: 'sai@company.com', role: 'Member', teamId: '4', performanceScore: 84 },
  { id: 'emp-12', name: 'Aarthi', email: 'aarthi@company.com', role: 'Member', teamId: '4', performanceScore: 88 },
  { id: 'emp-13', name: 'Sri Hari', email: 'srihari@company.com', role: 'Lead', teamId: '5', performanceScore: 95 },
  { id: 'emp-14', name: 'Selvamani', email: 'selvamani@company.com', role: 'Member', teamId: '5', performanceScore: 87 },
  { id: 'emp-15', name: 'Chris', email: 'chris@company.com', role: 'Member', teamId: '5', performanceScore: 90 },
  { id: 'emp-16', name: 'Kevin', email: 'kevin@company.com', role: 'Lead', teamId: '6', performanceScore: 92 },
  { id: 'emp-17', name: 'Sujitha', email: 'sujitha@company.com', role: 'Lead', teamId: '7', performanceScore: 88 },
  { id: 'emp-18', name: 'Kezi', email: 'kezi@company.com', role: 'Member', teamId: '7', performanceScore: 85 },
  { id: 'emp-19', name: 'Ecsipha', email: 'ecsipha@company.com', role: 'Member', teamId: '7', performanceScore: 83 },
  { id: 'emp-20', name: 'Nadhiya', email: 'nadhiya@company.com', role: 'Lead', teamId: '8', performanceScore: 91 },
  { id: 'emp-21', name: 'Kayal', email: 'kayal@company.com', role: 'Member', teamId: '8', performanceScore: 89 },
  { id: 'emp-22', name: 'Nadhiya Member', email: 'nadhiya.member@company.com', role: 'Member', teamId: '8', performanceScore: 86 },
  { id: 'emp-23', name: 'Rasiga', email: 'rasiga@company.com', role: 'Lead', teamId: '9', performanceScore: 87 },
  { id: 'emp-24', name: 'Parvatha', email: 'parvatha@company.com', role: 'Member', teamId: '9', performanceScore: 84 },
  { id: 'emp-25', name: 'George', email: 'george@company.com', role: 'Lead', teamId: '10', performanceScore: 90 },
  { id: 'emp-26', name: 'Mahi', email: 'mahi@company.com', role: 'Lead', teamId: '11', performanceScore: 75 },
  { id: 'emp-27', name: 'Prem', email: 'prem@company.com', role: 'Lead', teamId: '12', performanceScore: 98 },
  { id: 'emp-28', name: 'Gaj', email: 'gaj@company.com', role: 'Member', teamId: '12', performanceScore: 94 },
  { id: 'emp-29', name: 'Shibi', email: 'shibi@company.com', role: 'Lead', teamId: '13', performanceScore: 92 },
  { id: 'emp-30', name: 'Prakash', email: 'prakash@company.com', role: 'Member', teamId: '13', performanceScore: 88 },
  { id: 'emp-31', name: 'Nikitha', email: 'nikitha@company.com', role: 'Member', teamId: '13', performanceScore: 90 },
];

// Projects Data
export const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Risk Adjustment', description: 'HCC Coding, Manual Coding, RAF Calculator', status: 'active', completionPercentage: 75, health: 'healthy', teamIds: ['8', '5'] },
  { id: 'proj-2', name: 'GI Coding', description: 'Gastrointestinal Coding System', status: 'active', completionPercentage: 68, health: 'at-risk', teamIds: ['8'] },
  { id: 'proj-3', name: 'Home Health Coding', description: 'Home Health Services Coding', status: 'active', completionPercentage: 82, health: 'healthy', teamIds: ['8'] },
  { id: 'proj-4', name: 'Anesthesia Coding', description: 'Anesthesia Services Coding', status: 'active', completionPercentage: 55, health: 'critical', teamIds: ['8'] },
  { id: 'proj-5', name: 'E/M Coding', description: 'Evaluation and Management Coding', status: 'active', completionPercentage: 70, health: 'at-risk', teamIds: ['8'] },
  { id: 'proj-6', name: 'AR Calling', description: 'Accounts Receivable Calling System', status: 'active', completionPercentage: 88, health: 'healthy', teamIds: ['7'] },
  { id: 'proj-7', name: 'Radiology Coding', description: 'Radiology Services Coding', status: 'active', completionPercentage: 65, health: 'at-risk', teamIds: ['8'] },
  { id: 'proj-8', name: 'AM Coding', description: 'Ambulatory Coding System', status: 'active', completionPercentage: 72, health: 'healthy', teamIds: ['8'] },
];

// Generate tasks for today and past few days
const today = new Date();
const generateDate = (daysAgo: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const statuses: ('completed' | 'pending' | 'in-progress')[] = ['completed', 'pending', 'in-progress'];
const projects = mockProjects.map(p => p.id);
const employees = mockEmployees.map(e => e.id);

// Generate realistic tasks
export const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const taskTitles = [
    'Code Review', 'Bug Fix', 'Feature Implementation', 'Documentation', 'Testing',
    'API Integration', 'UI Design', 'Database Optimization', 'Security Audit', 'Performance Tuning',
    'HCC Code Validation', 'Manual Coding Review', 'RAF Calculation', 'Data Analysis', 'Report Generation'
  ];

  employees.forEach((empId) => {
    // Each employee has 2-5 tasks
    const taskCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < taskCount; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // Last 7 days
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const hoursWorked = status === 'completed' ? 2 + Math.floor(Math.random() * 6) : (status === 'in-progress' ? Math.floor(Math.random() * 4) : 0);
      
      tasks.push({
        id: `task-${empId}-${i}`,
        employeeId: empId,
        projectId: projects[Math.floor(Math.random() * projects.length)],
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        description: `Task description for ${taskTitles[Math.floor(Math.random() * taskTitles.length)]}`,
        status,
        hoursWorked,
        date: generateDate(daysAgo),
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      });
    }
  });

  return tasks;
};

export const mockTasks = generateTasks();

// Generate Daily Activity from Tasks
export const generateDailyActivity = (): DailyActivity[] => {
  return mockTasks.map(task => {
    const employee = mockEmployees.find(e => e.id === task.employeeId)!;
    const team = mockTeams.find(t => t.id === employee.teamId)!;
    const project = mockProjects.find(p => p.id === task.projectId)!;

    return {
      id: `activity-${task.id}`,
      employeeId: task.employeeId,
      employeeName: employee.name,
      teamId: team.id,
      teamName: team.name,
      projectId: project.id,
      projectName: project.name,
      taskTitle: task.title,
      status: task.status,
      hoursWorked: task.hoursWorked,
      date: task.date,
    };
  });
};

export const mockDailyActivity = generateDailyActivity();

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n-1',
    type: 'taskCompleted',
    title: 'Frontend team crushed their goals',
    description: '12 user stories were completed today in the Risk Adjustment project.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 'n-2',
    type: 'projectDelayed',
    title: 'Radiology Coding at risk',
    description: 'Overall completion dropped to 58%. Review blockers with the Medical Coding team.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'n-3',
    type: 'performanceAlert',
    title: 'Data Science throughput decreased',
    description: 'Average task completion time increased by 12% this week.',
    time: '45 min ago',
    read: false,
  },
  {
    id: 'n-4',
    type: 'taskPending',
    title: 'Pending reviews in GI Coding',
    description: '8 code review tasks are still pending for today’s SLA.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n-5',
    type: 'taskCompleted',
    title: 'AR Calling backlog cleared',
    description: 'All 35 assigned AR follow-ups were completed ahead of schedule.',
    time: '2 hrs ago',
    read: true,
  },
  {
    id: 'n-6',
    type: 'info',
    title: 'New team member joined',
    description: 'Nikitha has joined the UI/UX Team.',
    time: '3 hrs ago',
    read: true,
  },
  {
    id: 'n-7',
    type: 'taskPending',
    title: 'E/M Coding tasks piling up',
    description: '5 high-priority tickets are still open for today.',
    time: '5 hrs ago',
    read: false,
  },
  {
    id: 'n-8',
    type: 'info',
    title: 'System maintenance scheduled',
    description: 'Planned downtime on Saturday from 2:00 AM to 4:00 AM.',
    time: '8 hrs ago',
    read: true,
  },
];

