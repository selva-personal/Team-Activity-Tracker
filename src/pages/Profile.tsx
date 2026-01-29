import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  UserCircle,
  Shield,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ActivityItem {
  date: string;
  project: string;
  task: string;
  status: 'Completed' | 'Pending' | 'In Progress';
  hours: number;
}

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) || {
    name: 'Demo User',
    role: 'Employee',
    email: 'demo@company.com',
    team: 'Frontend Team',
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState('+1 (555) 123-4567');
  const [editLocation, setEditLocation] = useState('Chennai, India');

  const employeeId = 'EMP-1024';
  const department = user.team || 'Productivity';
  const joinDate = '2023-04-15';
  const location = editLocation;

  const performance = {
    completed: 124,
    pending: 18,
    hoursThisWeek: 42,
    productivity: 88,
  };

  const recentActivity: ActivityItem[] = [
    {
      date: '2026-01-24',
      project: 'Risk Adjustment',
      task: 'HCC coding audit – batch 12',
      status: 'Completed',
      hours: 3.5,
    },
    {
      date: '2026-01-23',
      project: 'Radiology Coding',
      task: 'Case review – MRI backlog',
      status: 'In Progress',
      hours: 4,
    },
    {
      date: '2026-01-23',
      project: 'GI Coding',
      task: 'Daily charge review',
      status: 'Completed',
      hours: 2.5,
    },
    {
      date: '2026-01-22',
      project: 'Home Health Coding',
      task: 'Plan of care validation',
      status: 'Pending',
      hours: 1.5,
    },
  ];

  const handleSaveProfile = () => {
    dispatch(
      updateUser({
        name: editName,
        email: editEmail,
      }),
    );
    setIsEditOpen(false);
  };

  const statusBadge = (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      Online
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage your account details and performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Shield size={16} />
          Edit Profile
        </button>
      </div>

      {/* Top profile card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <UserCircle size={40} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <Badge variant="default">{user.role}</Badge>
                {statusBadge}
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Joined</p>
                <p className="text-gray-900 dark:text-white">
                  {joinDate} · 1+ yr
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-900 dark:text-white">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-indigo-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Employee ID</p>
                <p className="text-gray-900 dark:text-white">{employeeId}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info + performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User info card */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Name</dt>
              <dd className="text-gray-900 dark:text-white text-right">
                {user.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="text-gray-900 dark:text-white text-right">
                {user.email}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Role</dt>
              <dd className="text-gray-900 dark:text-white text-right">
                {user.role}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Team</dt>
              <dd className="text-gray-900 dark:text-white text-right">
                {user.team || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Department</dt>
              <dd className="text-gray-900 dark:text-white text-right">
                {department}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Performance summary */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Performance Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Tasks Completed
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {performance.completed}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <AlertTriangle size={16} className="text-amber-500" />
                Tasks Pending
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {performance.pending}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={16} className="text-sky-500" />
                Hours This Week
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {performance.hoursThisWeek}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield size={16} className="text-indigo-500" />
                Productivity Score
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {performance.productivity}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Project
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Task
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {item.date}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {item.project}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {item.task}
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        item.status === 'Completed'
                          ? 'success'
                          : item.status === 'In Progress'
                          ? 'default'
                          : 'warning'
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                    {item.hours.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Profile Modal (simple overlay) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

