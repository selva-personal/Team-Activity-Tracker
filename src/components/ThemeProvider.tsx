import React, { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.remove('dark');
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  return <>{children}</>;
};
