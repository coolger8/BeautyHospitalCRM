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
}

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [campaign, setCampaign] = useState<Campaign>({
    id: 0,
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetCustomerCriteria: '',
    discountPercentage: null,
    fixedDiscount: null,
    isActive: true,
  });
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          
          // Set discount type based on which discount value is present
          if (campaignData.discountPercentage !== null) {
            setDiscountType('percentage');
          } else if (campaignData.fixedDiscount !== null) {
            setDiscountType('fixed');
          }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'discountValue') {
      const numValue = value ? parseFloat(value) : null;
      setCampaign(prev => ({
        ...prev,
        [discountType === 'percentage' ? 'discountPercentage' : 'fixedDiscount']: numValue,
        [discountType === 'fixed' ? 'discountPercentage' : 'fixedDiscount']: null
      }));
    } else {
      setCampaign(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDiscountTypeChange = (type: 'percentage' | 'fixed') => {
    setDiscountType(type);
    // Reset the other discount value when switching types
    setCampaign(prev => ({
      ...prev,
      discountPercentage: type === 'percentage' ? prev.discountPercentage : null,
      fixedDiscount: type === 'fixed' ? prev.fixedDiscount : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!campaign.name) {
      alert('Campaign name is required');
      return;
    }
    
    if (!campaign.startDate || !campaign.endDate) {
      alert('Start date and end date are required');
      return;
    }
    
    if (new Date(campaign.startDate) >= new Date(campaign.endDate)) {
      alert('End date must be after start date');
      return;
    }
    
    if (discountType === 'percentage' && campaign.discountPercentage !== null && 
        (campaign.discountPercentage <= 0 || campaign.discountPercentage > 100)) {
      alert('Percentage discount must be between 1 and 100');
      return;
    }
    
    if (discountType === 'fixed' && campaign.fixedDiscount !== null && campaign.fixedDiscount <= 0) {
      alert('Fixed discount must be greater than 0');
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
      
      const response = await fetch(`http://localhost:3001/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(campaign),
      });
      
      if (response.ok) {
        router.push(`/dashboard/campaigns/${campaignId}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to update campaign. Status:', response.status, 'Response:', errorText);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update campaign: ' + errorText || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Error updating campaign');
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
        <Link href={`/dashboard/campaigns/${campaignId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{t('common.edit')} {t('campaigns.management')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('campaigns.campaignInfo')}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('common.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={campaign.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('common.description')}</label>
                  <textarea
                    id="description"
                    name="description"
                    value={campaign.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetCustomerCriteria" className="block text-sm font-medium text-gray-700">{t('campaigns.target')}</label>
                  <input
                    type="text"
                    id="targetCustomerCriteria"
                    name="targetCustomerCriteria"
                    value={campaign.targetCustomerCriteria}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('common.date')}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">{t('common.startDate')}</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={campaign.startDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">{t('common.endDate')}</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={campaign.endDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('campaigns.discount')}</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        checked={discountType === 'percentage'}
                        onChange={() => handleDiscountTypeChange('percentage')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('campaigns.percentage')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        checked={discountType === 'fixed'}
                        onChange={() => handleDiscountTypeChange('fixed')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('campaigns.fixedAmount')}</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                    {discountType === 'percentage' ? t('campaigns.percentage') + ' (%)' : t('campaigns.fixedAmount') + ' ($)'}
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={discountType === 'percentage' ? campaign.discountPercentage || '' : campaign.fixedDiscount || ''}
                    onChange={handleChange}
                    min={discountType === 'percentage' ? "1" : "0"}
                    max={discountType === 'percentage' ? "100" : undefined}
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={campaign.isActive}
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
            <Link href={`/dashboard/campaigns/${campaignId}`} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? t('common.saving') + '...' : t('common.update') + ' ' + t('campaigns.management')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}