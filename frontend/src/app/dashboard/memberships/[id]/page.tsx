'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Customer {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
}

interface Membership {
  id: number;
  customerId: number;
  level: string;
  points: number;
  balance: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export default function MembershipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const membershipId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const response = await fetch(`http://localhost:3001/memberships/${membershipId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        if (response.ok) {
          const membershipData: Membership = await response.json();
          setMembership(membershipData);
        } else {
          console.error('Failed to fetch membership data');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to load membership data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching membership:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (membershipId) {
      fetchMembership();
    }
  }, [membershipId, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this membership?')) {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          alert('Authentication required. Please log in again.');
          router.push('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:3001/memberships/${membershipId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          router.push('/dashboard/memberships');
        } else {
          console.error('Failed to delete membership');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to delete membership: ' + (await response.text()) || 'Unknown error');
        }
      } catch (error) {
        console.error('Error deleting membership:', error);
        alert('Error deleting membership');
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!membership) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/memberships/${membershipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !membership.isActive }),
      });
      
      if (response.ok) {
        const updatedMembership = await response.json();
        setMembership(updatedMembership);
      } else {
        console.error('Failed to update membership status');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update membership status: ' + (await response.text()) || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating membership status:', error);
      alert('Error updating membership status');
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

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'silver': return 'bg-gray-200 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Membership not found</h2>
        <Link href="/dashboard/memberships" className="text-blue-600 hover:text-blue-800">
          ← Back to memberships
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/memberships" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('memberships.management')} {t('common.details')}</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/memberships/${membership.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('customers.management')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.name')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{membership.customer?.name || `Customer #${membership.customerId}`}</div>
                </div>
                
                {membership.customer?.phone && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">{t('customers.phone')}</div>
                    <div className="w-2/3 text-sm text-gray-900">{membership.customer.phone}</div>
                  </div>
                )}
                
                {membership.customer?.email && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">{t('customers.email')}</div>
                    <div className="w-2/3 text-sm text-gray-900">{membership.customer.email}</div>
                  </div>
                )}
                
                {membership.customer?.gender && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">{t('customers.gender')}</div>
                    <div className="w-2/3 text-sm text-gray-900">{membership.customer.gender}</div>
                  </div>
                )}
                
                {membership.customer?.age && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">{t('customers.age')}</div>
                    <div className="w-2/3 text-sm text-gray-900">{membership.customer.age}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('memberships.management')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('memberships.level')}</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelBadgeColor(membership.level)}`}>
                      {t(`memberships.${membership.level}`) || membership.level.charAt(0).toUpperCase() + membership.level.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('memberships.points')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{membership.points.toLocaleString()}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('memberships.balance')}</div>
                  <div className="w-2/3 text-sm text-gray-900">${membership.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('memberships.expiryDate')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{new Date(membership.expiryDate).toLocaleDateString('en-US')}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.status')}</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      membership.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {membership.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.id')}</div>
                  <div className="w-2/3 text-sm text-gray-900">#{membership.id}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('common.date')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('common.createdAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(membership.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('common.updatedAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(membership.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleStatusToggle}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                membership.isActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {membership.isActive ? t('common.deactivate') + ' ' + t('memberships.management') : t('common.activate') + ' ' + t('memberships.management')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}