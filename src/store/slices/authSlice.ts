import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  name: string;
  role: string;
  email: string;
  team?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn:
    typeof window !== 'undefined' &&
    localStorage.getItem('isLoggedIn') === 'true',
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; user?: Partial<User> }>) => {
      state.isLoggedIn = true;
      state.user = {
        name: action.payload.user?.name || 'Demo User',
        role: action.payload.user?.role || 'Employee',
        email: action.payload.email,
        team: action.payload.user?.team,
      };
      localStorage.setItem('isLoggedIn', 'true');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('isLoggedIn');
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

