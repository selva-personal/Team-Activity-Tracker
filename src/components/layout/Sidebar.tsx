import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar } from '@/contexts/SidebarContext';
import { APP_NAME, APP_SIDEBAR_TAGLINE, APP_FOOTER_TEXT } from '@/config/appConfig';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  FolderKanban,
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gauge,
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/employees', label: 'Employees', icon: UserSquare2 },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/activity', label: 'Daily Activity', icon: Activity },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const location = useLocation();
  const isDeveloperRoute = location.pathname.startsWith('/developer-productivity');
  const [isDeveloperMenuOpen, setIsDeveloperMenuOpen] = useState(isDeveloperRoute);

  useEffect(() => {
    if (isDeveloperRoute) {
      setIsDeveloperMenuOpen(true);
    }
  }, [isDeveloperRoute]);

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {APP_NAME}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {APP_SIDEBAR_TAGLINE}
                </p>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'sidebar-link',
                  collapsed ? 'justify-center px-0' : 'px-4',
                  isActive ? 'active' : ''
                )
              }
              title={collapsed ? item.label : undefined}
              end={item.path === '/dashboard'}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={clsx(
                      'sidebar-icon',
                      isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    )}
                  />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}

          {/* Developer Productivity module */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                if (!collapsed) {
                  setIsDeveloperMenuOpen((prev) => !prev);
                }
              }}
              className={clsx(
                'w-full px-4 py-2 mb-1 flex items-center gap-3 text-sm font-semibold rounded-lg transition-colors',
                collapsed ? 'justify-center px-0' : 'justify-between',
                isDeveloperRoute
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
              )}
              title={collapsed ? 'Developer Productivity' : undefined}
            >
              <div className="flex items-center gap-3">
                <Gauge
                  size={18}
                  className={clsx(
                    isDeveloperRoute
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-indigo-600 dark:text-indigo-400',
                  )}
                />
                {!collapsed && (
                  <span className="text-xs font-semibold whitespace-nowrap">
                    Developer Productivity
                  </span>
                )}
              </div>
              {!collapsed &&
                (isDeveloperMenuOpen ? (
                  <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                ))}
            </button>

            {!collapsed && isDeveloperMenuOpen && (
              <div className="space-y-1">
                {[
                  { path: '/developer-productivity/overview', label: 'Overview' },
                  { path: '/developer-productivity/commits', label: 'Commits Analytics' },
                  { path: '/developer-productivity/attendance', label: 'Attendance Insights' },
                  { path: '/developer-productivity/hours', label: 'Work Hours Tracking' },
                  { path: '/developer-productivity/performance', label: 'Performance Score' },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        'sidebar-link text-sm',
                        'pl-9 pr-4',
                        isActive
                          ? 'active border-l-2 border-indigo-500 rounded-l-none'
                          : '',
                      )
                    }
                  >
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {APP_FOOTER_TEXT}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
