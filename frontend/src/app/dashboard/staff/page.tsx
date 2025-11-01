'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StaffPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchStaff = async (page: number = 1) => {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`http://localhost:3001/staff?page=${page}&limit=${limit}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      console.log('Staff list fetch response status:', response.status);
      console.log('Staff list fetch response headers:', response.headers);
      
      if (response.ok) {
        const paginatedData: PaginatedResponse<Staff> = await response.json();
        setStaff(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
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
        
        // 使用模拟数据作为备用
        const mockData: Staff[] = generateMockData();
        // 分页模拟数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMockData = mockData.slice(startIndex, endIndex);
        
        setStaff(paginatedMockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      // 使用模拟数据作为备用
      const mockData: Staff[] = generateMockData();
      // 分页模拟数据
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockData = mockData.slice(startIndex, endIndex);
      
      setStaff(paginatedMockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(currentPage);
  }, [currentPage]);

  const generateMockData = (): Staff[] => {
    const roles = ['consultant', 'doctor', 'nurse', 'admin'];
    const mockStaff = Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      name: `Staff Member ${i + 1}`,
      email: `staff${i + 1}@example.com`,
      phone: `1380013800${i < 9 ? '0' + (i + 1) : (i + 1)}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      isActive: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    }));
    return mockStaff;
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
      const staffToUpdate = staff.find(s => s.id === id);
      if (!staffToUpdate) return;

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      // Use PATCH method for updating staff status
      const response = await fetch(`http://localhost:3001/staff/${id}`, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !staffToUpdate.isActive }),
      });

      if (response.ok) {
        const updatedStaff = await response.json();
        // Update local state
        setStaff(staff.map(s => 
          s.id === id ? updatedStaff : s
        ));
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      // Use DELETE method for deleting staff
      const response = await fetch(`http://localhost:3001/staff/${id}`, { 
        method: 'DELETE', // This is correct as per the backend controller
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Refresh the staff list
        fetchStaff(currentPage);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('staff.management')}</h1>
        <Link href="/dashboard/staff/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('staff.addNew')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('staff.fullName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('staff.email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('staff.phone')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('staff.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('staff.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((staffMember) => (
                <tr key={staffMember.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staffMember.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staffMember.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatRole(staffMember.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staffMember.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staffMember.isActive ? t('staff.active') : t('staff.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/staff/${staffMember.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link href={`/dashboard/staff/${staffMember.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleStatusToggle(staffMember.id)} 
                        className={staffMember.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {staffMember.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(staffMember.id)} 
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