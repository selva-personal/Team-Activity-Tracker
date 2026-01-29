import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team } from '@/types';
import { mockTeams } from '@/data/mockData';

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Teams'],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: mockTeams };
      },
      providesTags: ['Teams'],
    }),
    getTeamById: builder.query<Team, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const team = mockTeams.find(t => t.id === id);
        if (!team) {
          return { error: { status: 404, data: 'Team not found' } };
        }
        return { data: team };
      },
      providesTags: (_result, _error, id) => [{ type: 'Teams', id }],
    }),
  }),
});

export const { useGetTeamsQuery, useGetTeamByIdQuery } = teamsApi;
