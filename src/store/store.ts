import { configureStore } from '@reduxjs/toolkit';
import { teamsApi } from './api/teamsApi';
import { employeesApi } from './api/employeesApi';
import { projectsApi } from './api/projectsApi';
import { activityApi } from './api/activityApi';
import { reportsApi } from './api/reportsApi';
import { notificationsApi } from './api/notificationsApi';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      teamsApi.middleware,
      employeesApi.middleware,
      projectsApi.middleware,
      activityApi.middleware,
      reportsApi.middleware,
      notificationsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
