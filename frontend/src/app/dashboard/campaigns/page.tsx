'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchCampaigns = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/campaigns?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Campaign> = await response.json();
        setCampaigns(paginatedData.data);
        setTotalPages(paginatedData.totalPages);
        setTotalItems(paginatedData.total);
        setCurrentPage(paginatedData.page);
      } else {
        console.error('Failed to fetch campaigns data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        setCampaigns(mockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching campaigns data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      setCampaigns(mockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage);
  }, [currentPage]);

  const generateMockData = (): Campaign[] => {
    const campaignNames = [
      'Summer Special', 'New Year Promotion', 'Holiday Package', 'VIP Member Exclusive',
      'Anniversary Sale', 'Spring Festival Offer', 'Back to School', 'Weekend Special',
      'Birthday Month Discount', 'Referral Reward', 'First-Time Customer', 'Seasonal Package',
      'Flash Sale', 'Limited Time Offer', 'Loyalty Bonus', 'Premium Treatment Bundle',
      'Special Holiday Package', 'End of Season Sale', 'Member Appreciation', 'Grand Opening Special'
    ];
    
    const targetCriteria = [
      'All Customers', 'VIP Members Only', 'New Customers', 'Returning Customers',
      'Gold & Platinum Members', 'Customers aged 25-40', 'Female Customers', 'Male Customers',
      'Customers with 5+ visits', 'Customers interested in skin treatments', 'Local Residents',
      'Corporate Clients', 'Students', 'Senior Citizens', 'Family Packages',
      'Customers with birthdays this month', 'Referral Program Participants', 'App Users',
      'Online Booking Customers', 'Weekend Visitors'
    ];
    
    const mockCampaigns = Array.from({ length: 20 }, (_, i) => {
      // 随机开始日期（过去30天内到未来30天）
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30) + Math.floor(Math.random() * 30));
      
      // 随机结束日期（开始日期后的7-90天）
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 83) + 7);
      
      // 随机选择折扣类型（百分比或固定金额）
      const usePercentage = Math.random() > 0.5;
      
      return {
        id: i + 1,
        name: campaignNames[i],
        description: `Special promotion for ${campaignNames[i].toLowerCase()}. Limited time offer with great savings!`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        targetCustomerCriteria: targetCriteria[i],
        discountPercentage: usePercentage ? Math.floor(Math.random() * 50) + 5 : null,
        fixedDiscount: !usePercentage ? Math.floor(Math.random() * 200) + 10 : null,
        isActive: Math.random() > 0.2,
      };
    });
    
    return mockCampaigns;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    // 如果没有数据，不显示分页
    if (totalItems === 0) {
      return null;
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || totalPages <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const handleStatusToggle = async (id: number) => {
    try {
      const campaignToUpdate = campaigns.find(c => c.id === id);
      if (!campaignToUpdate) return;

      // 实际项目中应该调用API
      // await fetch(`http://localhost:3001/campaigns/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isActive: !campaignToUpdate.isActive }),
      // });

      // 更新本地状态
      setCampaigns(campaigns.map(c => 
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ));
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      // 实际项目中应该调用API
      // await fetch(`http://localhost:3001/campaigns/${id}`, { method: 'DELETE' });
      
      // 更新本地状态
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
        <Link href="/dashboard/campaigns/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{campaign.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.targetCustomerCriteria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{getDiscountDisplay(campaign)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/campaigns/${campaign.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link href={`/dashboard/campaigns/${campaign.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleStatusToggle(campaign.id)} 
                        className={campaign.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {campaign.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(campaign.id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    </div>
  );
}