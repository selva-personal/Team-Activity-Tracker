import React from 'react';
import { NavLink } from 'react-router-dom';
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
