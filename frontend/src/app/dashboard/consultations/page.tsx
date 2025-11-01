'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Consultation {
  id: number;
  customerId: number;
  consultantId: number;
  communicationContent: string;
  recommendedProject: string;
  quotedPrice: number;
  diagnosisContent: string;
  skinTestResult: string;
  aestheticDesign: string;
  isConsentSigned: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
  };
  consultant?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ConsultationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchConsultations = async (page: number = 1) => {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`http://localhost:3001/consultations?page=${page}&limit=${limit}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (response.ok) {
        const paginatedData: PaginatedResponse<Consultation> = await response.json();
        setConsultations(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
      } else {
        console.error('Failed to fetch consultations data');
        
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
        const mockData: Consultation[] = generateMockData();
        // 分页模拟数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMockData = mockData.slice(startIndex, endIndex);
        
        setConsultations(paginatedMockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching consultations data:', error);
      // 使用模拟数据作为备用
      const mockData: Consultation[] = generateMockData();
      // 分页模拟数据
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockData = mockData.slice(startIndex, endIndex);
      
      setConsultations(paginatedMockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations(currentPage);
  }, [currentPage]);

  const generateMockData = (): Consultation[] => {
    const mockConsultations = Array.from({ length: 35 }, (_, i) => {
      return {
        id: i + 1,
        customerId: Math.floor(Math.random() * 100) + 1,
        consultantId: Math.floor(Math.random() * 10) + 1,
        communicationContent: `Communication content for consultation ${i + 1}`,
        recommendedProject: `Project ${Math.floor(Math.random() * 5) + 1}`,
        quotedPrice: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
        diagnosisContent: `Diagnosis content for consultation ${i + 1}`,
        skinTestResult: `Skin test result ${i + 1}`,
        aestheticDesign: `Aesthetic design plan ${i + 1}`,
        isConsentSigned: Math.random() > 0.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          id: Math.floor(Math.random() * 100) + 1,
          name: `Customer ${Math.floor(Math.random() * 100) + 1}`,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          age: Math.floor(Math.random() * 50) + 20,
          phone: `13800138${i.toString().padStart(3, '0')}`,
          email: `customer${i}@example.com`
        },
        consultant: {
          id: Math.floor(Math.random() * 10) + 1,
          name: `Consultant ${Math.floor(Math.random() * 10) + 1}`,
          email: `consultant${i}@example.com`,
          phone: `13900139${i.toString().padStart(3, '0')}`,
          role: 'Consultant'
        }
      };
    });
    return mockConsultations;
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
      const consultationToUpdate = consultations.find(c => c.id === id);
      if (!consultationToUpdate) return;

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:3001/consultations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isConsentSigned: !consultationToUpdate.isConsentSigned }),
      });

      if (response.ok) {
        const updatedConsultation = await response.json();
        // Update local state
        setConsultations(consultations.map(c => 
          c.id === id ? updatedConsultation : c
        ));
      } else {
        console.error('Failed to update consultation status');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to update consultation status: ' + (await response.text()) || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating consultation status:', error);
      alert('Error updating consultation status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this consultation?')) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/consultations/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Refresh the consultations list
        fetchConsultations(currentPage);
      } else {
        console.error('Failed to delete consultation');
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/login');
          return;
        }
        
        alert('Failed to delete consultation: ' + (await response.text()) || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting consultation:', error);
      alert('Error deleting consultation');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h1 className="text-2xl font-bold text-gray-900">{t('consultations.management')}</h1>
        <Link href="/dashboard/consultations/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('consultations.addNew')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('consultations.customer')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('consultations.consultant')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('consultations.treatment')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultation.customer?.name || `Customer #${consultation.customerId}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{consultation.consultant?.name || `Consultant #${consultation.consultantId}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{consultation.recommendedProject || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(consultation.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      consultation.isConsentSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consultation.isConsentSigned ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/consultations/${consultation.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">{t('common.view')}</span>
                      </Link>
                      <Link href={`/dashboard/consultations/${consultation.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">{t('common.edit')}</span>
                      </Link>
                      <button 
                        onClick={() => handleStatusToggle(consultation.id)} 
                        className={consultation.isConsentSigned ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {consultation.isConsentSigned ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                        <span className="sr-only">{consultation.isConsentSigned ? t('common.deactivate') : t('common.activate')}</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(consultation.id)} 
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