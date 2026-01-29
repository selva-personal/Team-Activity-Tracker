import React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Info,
  TrendingDown,
  X,
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllReadMutation,
} from '@/store/api/notificationsApi';
import { Notification } from '@/types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIconMap: Record<
  Notification['type'],
  { icon: React.ReactNode; colorClass: string }
> = {
  taskCompleted: {
    icon: <CheckCircle size={18} className="text-emerald-500" />,
    colorClass: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  taskPending: {
    icon: <Clock size={18} className="text-amber-500" />,
    colorClass: 'bg-amber-50 dark:bg-amber-900/20',
  },
  projectDelayed: {
    icon: <AlertTriangle size={18} className="text-red-500" />,
    colorClass: 'bg-red-50 dark:bg-red-900/20',
  },
  performanceAlert: {
    icon: <TrendingDown size={18} className="text-yellow-500" />,
    colorClass: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  info: {
    icon: <Info size={18} className="text-blue-500" />,
    colorClass: 'bg-blue-50 dark:bg-blue-900/20',
  },
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  if (!isOpen) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAll = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllRead().unwrap();
    } catch {
      // swallow in mock mode
    }
  };

  const handleMarkSingle = async (notification: Notification) => {
    if (notification.read) return;
    try {
      await markAsRead(notification.id).unwrap();
    } catch {
      // ignore in mock mode
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 rounded-none lg:rounded-l-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-gray-700 dark:text-gray-200" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={unreadCount === 0 || isMarkingAll}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close notifications"
            >
              <X size={18} className="text-gray-500 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Bell size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
              <p className="font-medium">No new notifications</p>
              <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                You&apos;re all caught up.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notifications.slice(0, 8).map((notification) => {
                const meta = typeIconMap[notification.type];
                const isUnread = !notification.read;

                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => handleMarkSingle(notification)}
                      className={`w-full text-left rounded-xl px 3 py-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isUnread ? 'bg-gray-50 dark:bg-gray-900/40' : ''
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${meta.colorClass}`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm truncate ${
                              isUnread
                                ? 'font-semibold text-gray-900 dark:text-white'
                                : 'font-medium text-gray-900 dark:text-white'
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="flex-shrink-0 text-[11px] text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {notification.description}
                        </p>
                        {isUnread && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Unread
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

