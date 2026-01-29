import React, { useState } from 'react';
import { useGetEmployeesQuery } from '@/store/api/employeesApi';
import { useGetTeamsQuery } from '@/store/api/teamsApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserSquare2, Award, Search } from 'lucide-react';

export const Employees: React.FC = () => {
  const { data: employees, isLoading } = useGetEmployeesQuery();
  const { data: teams } = useGetTeamsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getTeamName = (teamId: string) => {
    return teams?.find(t => t.id === teamId)?.name || 'Unknown';
  };

  const filteredEmployees = employees?.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter === 'all' || emp.teamId === teamFilter;
    return matchesSearch && matchesTeam;
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employees</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage all employees</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 pl-10"
          />
        </div>
        <Select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Teams' },
            ...(teams?.map(t => ({ value: t.id, label: t.name })) || []),
          ]}
          className="sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <UserSquare2 size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                <Badge variant={employee.role === 'Lead' ? 'info' : 'default'}>
                  {employee.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Team</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTeamName(employee.teamId)}
                </span>
              </div>
              {employee.performanceScore && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    <Award size={14} />
                    Performance
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${employee.performanceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.performanceScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No employees found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};
