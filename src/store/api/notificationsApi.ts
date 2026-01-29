import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Notification } from '@/types';
import { mockNotifications } from '@/data/mockData';

let notificationsState: Notification[] = [...mockNotifications];

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      queryFn: async () => {
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: notificationsState };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((n) => ({
                type: 'Notifications' as const,
                id: n.id,
              })),
              { type: 'Notifications' as const, id: 'LIST' },
            ]
          : [{ type: 'Notifications' as const, id: 'LIST' }],
    }),
    markAsRead: builder.mutation<Notification, string>({
      queryFn: async (id) => {
        const index = notificationsState.findIndex((n) => n.id === id);
        if (index === -1) {
          return {
            error: { status: 404, data: 'Notification not found' } as any,
          };
        }
        const updated: Notification = {
          ...notificationsState[index],
          read: true,
        };
        notificationsState[index] = updated;
        return { data: updated };
      },
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'Notifications', id },
              { type: 'Notifications', id: 'LIST' },
            ],
    }),
    markAllRead: builder.mutation<Notification[], void>({
      queryFn: async () => {
        notificationsState = notificationsState.map((n) => ({
          ...n,
          read: true,
        }));
        return { data: notificationsState };
      },
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllReadMutation,
} = notificationsApi;

