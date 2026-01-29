import React from 'react';
import { useGetProjectsQuery } from '@/store/api/projectsApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FolderKanban, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data: projects, isLoading } = useGetProjectsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'success';
      case 'at-risk':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'info';
      case 'completed':
        return 'success';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">Track project progress and health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FolderKanban size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {project.completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${project.completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    Status
                  </span>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(project.status) as any} className="flex items-center gap-1.5 w-fit">
                      {project.status === 'active' && <Clock size={14} />}
                      {project.status === 'completed' && <CheckCircle2 size={14} />}
                      {project.status === 'on-hold' && <AlertTriangle size={14} />}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    Health
                  </span>
                  <div className="mt-1">
                    <Badge variant={getHealthColor(project.health) as any} className="flex items-center gap-1.5 w-fit">
                      {project.health === 'healthy' && <CheckCircle2 size={14} />}
                      {project.health === 'at-risk' && <AlertTriangle size={14} />}
                      {project.health === 'critical' && <AlertTriangle size={14} />}
                      {project.health.charAt(0).toUpperCase() + project.health.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
