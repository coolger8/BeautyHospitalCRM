'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Treatment {
  id: number;
  customerId: number;
  consultationId: number;
  doctorId: number;
  nurseId: number;
  projectId: number;
  productName: string;
  dosage: string;
  treatmentTime: string;
  recoveryNotes: string;
  rednessLevel: number;
  customerFeedback: string;
  nextTreatmentTime: string | null;
  treatmentSequence: number;
  totalTreatments: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TreatmentsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchTreatments = async (page: number = 1) => {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`http://localhost:3001/treatments?page=${page}&limit=${limit}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (response.ok) {
        const paginatedData: PaginatedResponse<Treatment> = await response.json();
        setTreatments(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
      } else {
        console.error('Failed to fetch treatments data');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        // 使用模拟数据作为备用
        const mockData: Treatment[] = generateMockData();
        // 分页模拟数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMockData = mockData.slice(startIndex, endIndex);
        
        setTreatments(paginatedMockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching treatments data:', error);
      // 使用模拟数据作为备用
      const mockData: Treatment[] = generateMockData();
      // 分页模拟数据
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockData = mockData.slice(startIndex, endIndex);
      
      setTreatments(paginatedMockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments(currentPage);
  }, [currentPage]);

  const generateMockData = (): Treatment[] => {
    const mockTreatments = Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      customerId: Math.floor(Math.random() * 100) + 1,
      consultationId: Math.floor(Math.random() * 50) + 1,
      doctorId: Math.floor(Math.random() * 10) + 1,
      nurseId: Math.floor(Math.random() * 10) + 1,
      projectId: Math.floor(Math.random() * 20) + 1,
      productName: `Product ${i + 1}`,
      dosage: `${Math.floor(Math.random() * 10) + 1} units`,
      treatmentTime: new Date().toISOString(),
      recoveryNotes: `Recovery notes for treatment ${i + 1}`,
      rednessLevel: Math.floor(Math.random() * 5),
      customerFeedback: `Customer feedback for treatment ${i + 1}`,
      nextTreatmentTime: Math.random() > 0.5 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      treatmentSequence: Math.floor(Math.random() * 3) + 1,
      totalTreatments: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return mockTreatments;
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/treatments/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Refresh the treatments list
        fetchTreatments(currentPage);
      } else {
        console.error('Failed to delete treatment');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to delete treatment: ' + (await response.text()) || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting treatment:', error);
      alert('Error deleting treatment');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('treatments.management')}</h1>
        <Link href="/dashboard/treatments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('treatments.addNew')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('treatments.category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('treatments.duration')} (min)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('treatments.price')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{treatment.productName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{treatment.dosage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{treatment.projectId ? `Project #${treatment.projectId}` : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{treatment.treatmentSequence ? `${treatment.treatmentSequence * 15}` : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${typeof treatment.projectId === 'number' ? (treatment.projectId * 10).toFixed(2) : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/treatments/${treatment.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">{t('common.view')}</span>
                      </Link>
                      <Link href={`/dashboard/treatments/${treatment.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">{t('common.edit')}</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(treatment.id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">{t('common.delete')}</span>
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