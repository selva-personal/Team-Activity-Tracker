import React from 'react';
import { useGetTeamsQuery } from '@/store/api/teamsApi';
import { useGetEmployeesQuery } from '@/store/api/employeesApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, UserCircle, Award } from 'lucide-react';

export const Teams: React.FC = () => {
  const { data: teams, isLoading } = useGetTeamsQuery();
  const { data: employees } = useGetEmployeesQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getTeamMembers = (teamId: string) => {
    return employees?.filter(emp => emp.teamId === teamId) || [];
  };

  const getTeamLead = (leadId: string) => {
    return employees?.find(emp => emp.id === leadId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teams</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and view all teams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map((team) => {
          const lead = getTeamLead(team.leadId);
          const members = getTeamMembers(team.id);

          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: team.color }}
                >
                  <Users size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                    <Award size={16} />
                    Team Lead
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <UserCircle size={18} />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{lead?.name || 'N/A'}</span>
                    <Badge variant="info">Lead</Badge>
                  </div>
                </div>

                {members.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Members</p>
                    <div className="flex flex-wrap gap-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-900 dark:text-white">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {members.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No members</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
