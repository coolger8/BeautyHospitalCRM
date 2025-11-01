'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we're in browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const navigation = [
    { name: t('dashboard.dashboard'), href: '/dashboard' },
    { name: t('dashboard.customers'), href: '/dashboard/customers' },
    { name: t('dashboard.consultations'), href: '/dashboard/consultations' },
    { name: t('dashboard.appointments'), href: '/dashboard/appointments' },
    { name: t('dashboard.treatments'), href: '/dashboard/treatments' },
    { name: t('dashboard.memberships'), href: '/dashboard/memberships' },
    { name: t('dashboard.campaigns'), href: '/dashboard/campaigns' },
    { name: t('dashboard.orders'), href: '/dashboard/orders' },
    { name: t('dashboard.staff'), href: '/dashboard/staff' },
  ];

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch('http://localhost:3001/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
        
        // Remove token from localStorage
        localStorage.removeItem('token');
      }
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, still remove the token and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      router.push('/login');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  // Don't render the layout until we've checked authentication
  if (isAuthenticated === null) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated === false || (typeof window !== 'undefined' && !localStorage.getItem('token'))) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">{t('dashboard.title')}</h1>
        </div>
        <nav className="mt-5">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.dashboard')}</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md bg-gray-100"
              >
                {language === 'en' ? '中文' : 'English'}
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{t('dashboard.adminUser')}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}