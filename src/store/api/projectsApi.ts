import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project } from '@/types';
import { mockProjects } from '@/data/mockData';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: mockProjects };
      },
      providesTags: ['Projects'],
    }),
    getProjectById: builder.query<Project, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const project = mockProjects.find(p => p.id === id);
        if (!project) {
          return { error: { status: 404, data: 'Project not found' } };
        }
        return { data: project };
      },
      providesTags: (_result, _error, id) => [{ type: 'Projects', id }],
    }),
  }),
});

export const { useGetProjectsQuery, useGetProjectByIdQuery } = projectsApi;
