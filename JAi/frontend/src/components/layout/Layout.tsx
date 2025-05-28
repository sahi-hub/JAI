import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';
import useStore from '../../utils/store';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, sidebarOpen } = useStore();
  
  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Don't render layout on auth pages
  if (router.pathname === '/login' || router.pathname === '/register') {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Sidebar />
      <main 
        className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;