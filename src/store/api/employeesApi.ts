import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Employee } from '@/types';
import { mockEmployees } from '@/data/mockData';

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Employees'],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: mockEmployees };
      },
      providesTags: ['Employees'],
    }),
    getEmployeeById: builder.query<Employee, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const employee = mockEmployees.find(e => e.id === id);
        if (!employee) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data: employee };
      },
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),
    getEmployeesByTeam: builder.query<Employee[], string>({
      queryFn: async (teamId) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const employees = mockEmployees.filter(e => e.teamId === teamId);
        return { data: employees };
      },
      providesTags: ['Employees'],
    }),
  }),
});

export const { useGetEmployeesQuery, useGetEmployeeByIdQuery, useGetEmployeesByTeamQuery } = employeesApi;
