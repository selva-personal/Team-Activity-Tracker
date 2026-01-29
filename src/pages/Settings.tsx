import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <Input label="Name" defaultValue="Admin User" />
            <Input label="Email" type="email" defaultValue="admin@company.com" />
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'lead', label: 'Team Lead' },
                { value: 'member', label: 'Member' },
              ]}
              defaultValue="admin"
            />
            <Button variant="primary">Save Changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <Select
              label="Theme"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto' },
              ]}
              defaultValue="light"
            />
            <Select
              label="Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
              ]}
              defaultValue="en"
            />
            <Input label="Items per page" type="number" defaultValue="10" />
            <Button variant="primary">Save Preferences</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span className="text-gray-900 dark:text-white">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span className="text-gray-900 dark:text-white">Task reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5" />
              <span className="text-gray-900 dark:text-white">Weekly reports</span>
            </label>
            <Button variant="primary">Save Notifications</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
              <span className="text-gray-900 dark:text-white">January 23, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="text-green-600">Operational</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
