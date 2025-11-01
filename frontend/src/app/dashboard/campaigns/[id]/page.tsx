'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Campaign {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetCustomerCriteria: string;
  discountPercentage: number | null;
  fixedDiscount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const campaignId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const response = await fetch(`http://localhost:3001/campaigns/${campaignId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        if (response.ok) {
          const campaignData: Campaign = await response.json();
          setCampaign(campaignData);
        } else {
          console.error('Failed to fetch campaign data');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to load campaign data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          alert('Authentication required. Please log in again.');
          router.push('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:3001/campaigns/${campaignId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          router.push('/dashboard/campaigns');
        } else {
          console.error('Failed to delete campaign');
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            alert('Authentication failed. Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/login');
            return;
          }
          
          alert('Failed to delete campaign: ' + (await response.text()) || 'Unknown error');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Error deleting campaign');
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!campaign) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !campaign.isActive }),
      });
      
      if (response.ok) {
        const updatedCampaign = await response.json();
        setCampaign(updatedCampaign);
      } else {
        console.error('Failed to update campaign status');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update campaign status: ' + (await response.text()) || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      alert('Error updating campaign status');
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

  const getDiscountDisplay = (campaign: Campaign) => {
    if (campaign.discountPercentage) {
      return `${campaign.discountPercentage}%`;
    } else if (campaign.fixedDiscount) {
      return `$${campaign.fixedDiscount.toFixed(2)}`;
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h2>
        <Link href="/dashboard/campaigns" className="text-blue-600 hover:text-blue-800">
          ← Back to campaigns
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/campaigns" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/campaigns/${campaign.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('campaigns.campaignInfo')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.name')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{campaign.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.description')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{campaign.description || 'N/A'}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('campaigns.target')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{campaign.targetCustomerCriteria || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('common.date')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.startDate')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(campaign.startDate)}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.endDate')}</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(campaign.endDate)}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('campaigns.discount')}</div>
                  <div className="w-2/3 text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getDiscountDisplay(campaign)}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.status')}</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">{t('common.id')}</div>
                  <div className="w-2/3 text-sm text-gray-900">#{campaign.id}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('common.date')}</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('common.createdAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(campaign.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">{t('common.updatedAt')}</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(campaign.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleStatusToggle}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                campaign.isActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {campaign.isActive ? t('common.deactivate') + ' ' + t('campaigns.management') : t('common.activate') + ' ' + t('campaigns.management')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}