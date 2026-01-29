import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { useGetNotificationsQuery } from '@/store/api/notificationsApi';
import {
  Search,
  Bell,
  Moon,
  Sun,
  UserCircle,
  LogOut,
  Settings,
  User,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const authUser = useAppSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: notifications = [] } = useGetNotificationsQuery();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fallback user data
  const user = authUser || {
    name: 'Demo User',
    role: 'Employee',
    email: 'demo@company.com',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('demoEmail');
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              type="search"
              placeholder="Search employees, projects, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun size={20} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 text-[10px] text-white px-1.5 py-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer"
                aria-label="User profile menu"
              >
                <UserCircle size={24} />
              </button>

              {/* Profile Dropdown - Desktop */}
              {isProfileOpen && (
                <div className="hidden md:block absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <UserCircle size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Email
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Role
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {user.role}
                      </span>
                    </div>
                    {user.team && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          Team
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {user.team}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={18} />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Bottom Sheet - Mobile */}
              {isProfileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex items-end">
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  {/* Bottom Sheet */}
                  <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Profile
                      </h3>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Close"
                      >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <UserCircle size={32} />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Email
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Role
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.role}
                        </p>
                      </div>
                      {user.team && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Team
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {user.team}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Status
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User size={20} />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings size={20} />
                        <span>Settings</span>
                      </button>
                      <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </header>
  );
};
