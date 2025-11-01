'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const staffId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const response = await fetch(`http://localhost:3001/staff/${staffId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        console.log('Staff fetch response status:', response.status);
        console.log('Staff fetch response headers:', response.headers);
        
        if (response.ok) {
          const staffData: Staff = await response.json();
          setStaff(staffData);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch staff data. Status:', response.status, 'Response:', errorText);
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to load staff data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (staffId) {
      fetchStaff();
    }
  }, [staffId, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          alert('Authentication required. Please log in again.');
          router.push('/login');
          return;
        }
        
        // Use DELETE method for deleting staff
        const response = await fetch(`http://localhost:3001/staff/${staffId}`, {
          method: 'DELETE', // This is correct as per the backend controller
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          router.push('/dashboard/staff');
        } else {
          const errorText = await response.text();
          console.error('Failed to delete staff. Status:', response.status, 'Response:', errorText);
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to delete staff: ' + errorText || 'Unknown error');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Error deleting staff');
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!staff) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      // Use PATCH method for updating staff status
      const response = await fetch(`http://localhost:3001/staff/${staffId}`, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !staff.isActive }),
      });
      
      if (response.ok) {
        const updatedStaff = await response.json();
        setStaff(updatedStaff);
      } else {
        const errorText = await response.text();
        console.error('Failed to update staff status. Status:', response.status, 'Response:', errorText);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update staff status: ' + errorText || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating staff status:', error);
      alert('Error updating staff status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'consultant': return 'Consultant';
      case 'doctor': return 'Doctor';
      case 'nurse': return 'Nurse';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff member not found</h2>
        <Link href="/dashboard/staff" className="text-blue-600 hover:text-blue-800">
          ← Back to staff
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/staff" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{staff.name}</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/staff/${staff.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                {t('common.edit')}
              </Link>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('staff.personalInfo')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('staff.fullName')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{staff.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('staff.email')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{staff.email}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('staff.phone')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{staff.phone}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('staff.accountDetails')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('staff.role')}</div>
                  <div className="w-2/3 text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatRole(staff.role)}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('staff.status')}</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.isActive ? t('staff.active') : t('staff.inactive')}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Staff ID</div>
                  <div className="w-2/3 text-sm text-gray-900">#{staff.id}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('staff.createdAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(staff.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('staff.updatedAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(staff.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleStatusToggle}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                staff.isActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {staff.isActive ? t('staff.deactivate') : t('staff.activate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}