'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Customer {
  id: number;
  name: string;
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
}

export default function EditMembershipPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [membership, setMembership] = useState<Membership>({
    id: 0,
    customerId: 0,
    level: 'normal',
    points: 0,
    balance: 0,
    expiryDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const resolvedParams = use(params);
  const membershipId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        // Fetch membership data
        const membershipResponse = await fetch(`http://localhost:3001/memberships/${membershipId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        // Fetch customers data
        const customersResponse = await fetch('http://localhost:3001/customers?page=1&limit=100', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        if (membershipResponse.ok) {
          const membershipData: Membership = await membershipResponse.json();
          setMembership(membershipData);
        } else {
          console.error('Failed to fetch membership data');
          
          // If unauthorized, redirect to login
          if (membershipResponse.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to load membership data. Please try again.');
        }
        
        if (customersResponse.ok) {
          const data = await customersResponse.json();
          setCustomers(data.data);
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (membershipId) {
      fetchData();
    }
  }, [membershipId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setMembership(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMembership(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!membership.customerId) {
      alert('Please select a customer');
      return;
    }
    
    if (membership.points < 0) {
      alert('Points cannot be negative');
      return;
    }
    
    if (membership.balance < 0) {
      alert('Balance cannot be negative');
      return;
    }
    
    setSaving(true);
    
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
        body: JSON.stringify(membership),
      });
      
      if (response.ok) {
        router.push(`/dashboard/memberships/${membershipId}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to update membership. Status:', response.status, 'Response:', errorText);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update membership: ' + errorText || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      alert('Error updating membership');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={`/dashboard/memberships/${membershipId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{t('common.edit')} {t('memberships.management')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('memberships.membershipInfo')}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">{t('memberships.customer')}</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={membership.customerId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">{t('memberships.level')}</label>
                  <select
                    id="level"
                    name="level"
                    value={membership.level}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="normal">{t('memberships.normal')}</option>
                    <option value="silver">{t('memberships.silver')}</option>
                    <option value="gold">{t('memberships.gold')}</option>
                    <option value="platinum">{t('memberships.platinum')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">{t('memberships.expiryDate')}</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={membership.expiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('memberships.points')} & {t('memberships.balance')}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700">{t('memberships.points')}</label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={membership.points}
                    onChange={handleNumberChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="balance" className="block text-sm font-medium text-gray-700">{t('memberships.balance')} ($)</label>
                  <input
                    type="number"
                    id="balance"
                    name="balance"
                    value={membership.balance}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={membership.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    {t('common.status')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link href={`/dashboard/memberships/${membershipId}`} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? t('common.saving') + '...' : t('common.update') + ' ' + t('memberships.management')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}