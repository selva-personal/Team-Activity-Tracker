import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  const containerClass = isAuthPage ? 'ml-0' : collapsed ? 'ml-20' : 'ml-64';
  const mainClass = isAuthPage
    ? 'min-h-[100vh] p-0'
    : 'p-6';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {!isAuthPage && <Sidebar />}
      <div className={containerClass} style={{ transition: 'margin-left 0.3s' }}>
        {!isAuthPage && <Header />}
        <main className={mainClass}>{children}</main>
      </div>
    </div>
  );
};
