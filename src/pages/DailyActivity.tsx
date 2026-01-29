import React, { useState, useMemo } from 'react';
import { useGetDailyActivityQuery } from '@/store/api/activityApi';
import { useGetTeamsQuery } from '@/store/api/teamsApi';
import { useGetProjectsQuery } from '@/store/api/projectsApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  CheckCircle,
  Clock,
  Loader2,
  CalendarDays,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';

type SortField = 'employeeName' | 'teamName' | 'projectName' | 'date' | 'hoursWorked';
type SortDirection = 'asc' | 'desc';

export const DailyActivity: React.FC = () => {
  const { data: activity, isLoading } = useGetDailyActivityQuery();
  const { data: teams } = useGetTeamsQuery();
  const { data: projects } = useGetProjectsQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSorted = useMemo(() => {
    if (!activity) return [];

    let filtered = [...activity];

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (teamFilter !== 'all') {
      filtered = filtered.filter((a) => a.teamId === teamFilter);
    }

    if (projectFilter !== 'all') {
      filtered = filtered.filter((a) => a.projectId === projectFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter((a) => a.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((a) => a.date <= endDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'employeeName':
          aValue = a.employeeName;
          bValue = b.employeeName;
          break;
        case 'teamName':
          aValue = a.teamName;
          bValue = b.teamName;
          break;
        case 'projectName':
          aValue = a.projectName;
          bValue = b.projectName;
          break;
        case 'date':
          aValue = a.date;
          bValue = b.date;
          break;
        case 'hoursWorked':
          aValue = a.hoursWorked;
          bValue = b.hoursWorked;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [activity, searchQuery, teamFilter, projectFilter, statusFilter, startDate, endDate, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1.5 w-fit">
            <CheckCircle size={16} />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1.5 w-fit">
            <Clock size={16} />
            Pending
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="info" className="flex items-center gap-1.5 w-fit">
            <Loader2 size={16} className="animate-spin" />
            In Progress
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <Skeleton className="h-96" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Activity</h1>
          <p className="text-gray-600 dark:text-gray-400">Track daily work activities and tasks</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="xl:col-span-2"
          />
          <Select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Teams' },
              ...(teams?.map((t) => ({ value: t.id, label: t.name })) || []),
            ]}
          />
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Projects' },
              ...(projects?.map((p) => ({ value: p.id, label: p.name })) || []),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
            ]}
          />
          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader sortable onClick={() => handleSort('employeeName')}>
                  <div className="flex items-center gap-1.5">
                    Employee
                    <ArrowUpDown size={14} />
                  </div>
                </TableHeader>
                <TableHeader sortable onClick={() => handleSort('teamName')}>
                  <div className="flex items-center gap-1.5">
                    Team
                    <ArrowUpDown size={14} />
                  </div>
                </TableHeader>
                <TableHeader sortable onClick={() => handleSort('projectName')}>
                  <div className="flex items-center gap-1.5">
                    Project
                    <ArrowUpDown size={14} />
                  </div>
                </TableHeader>
                <TableHeader>Task</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader sortable onClick={() => handleSort('hoursWorked')}>
                  <div className="flex items-center gap-1.5">
                    Hours
                    <ArrowUpDown size={14} />
                  </div>
                </TableHeader>
                <TableHeader sortable onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Date
                    <ArrowUpDown size={14} />
                  </div>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.employeeName}</TableCell>
                  <TableCell>{activity.teamName}</TableCell>
                  <TableCell>{activity.projectName}</TableCell>
                  <TableCell>{activity.taskTitle}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>{activity.hoursWorked}h</TableCell>
                  <TableCell>{format(new Date(activity.date), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of{' '}
              {filteredAndSorted.length} entries
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {filteredAndSorted.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No activity found matching your criteria.
          </p>
        )}
      </Card>
    </div>
  );
};
