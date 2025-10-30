'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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
  customer?: {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchMemberships = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/memberships?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Membership> = await response.json();
        setMemberships(paginatedData.data);
        setTotalPages(paginatedData.totalPages);
        setTotalItems(paginatedData.total);
        setCurrentPage(paginatedData.page);
      } else {
        console.error('Failed to fetch memberships data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        setMemberships(mockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching memberships data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      setMemberships(mockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships(currentPage);
  }, [currentPage]);

  const generateMockData = (): Membership[] => {
    const levels = ['normal', 'silver', 'gold', 'platinum'];
    const customerNames = [
      'John Smith', 'Emma Johnson', 'Michael Brown', 'Olivia Davis', 'William Wilson',
      'Sophia Martinez', 'James Anderson', 'Isabella Taylor', 'Robert Thomas', 'Mia Garcia',
      'David Rodriguez', 'Charlotte Lewis', 'Joseph Lee', 'Amelia Walker', 'Daniel Hall',
      'Evelyn Allen', 'Matthew Young', 'Abigail King', 'Andrew Wright', 'Elizabeth Scott'
    ];
    
    const mockMemberships = Array.from({ length: 20 }, (_, i) => {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 12) + 1);
      
      return {
        id: i + 1,
        customerId: i + 1,
        level: levels[Math.floor(Math.random() * levels.length)],
        points: Math.floor(Math.random() * 10000),
        balance: parseFloat((Math.random() * 10000).toFixed(2)),
        expiryDate: expiryDate.toISOString().split('T')[0],
        isActive: Math.random() > 0.1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          id: i + 1,
          name: customerNames[i],
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          age: Math.floor(Math.random() * 50) + 20,
          phone: `13800138${i.toString().padStart(3, '0')}`,
          email: `customer${i}@example.com`
        }
      };
    });
    
    return mockMemberships;
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
      const membershipToUpdate = memberships.find(m => m.id === id);
      if (!membershipToUpdate) return;

      // 实际项目中应该调用API
      // await fetch(`http://localhost:3001/memberships/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isActive: !membershipToUpdate.isActive }),
      // });

      // 更新本地状态
      setMemberships(memberships.map(m => 
        m.id === id ? { ...m, isActive: !m.isActive } : m
      ));
    } catch (error) {
      console.error('Error updating membership status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    
    try {
      // 实际项目中应该调用API
      // await fetch(`http://localhost:3001/memberships/${id}`, { method: 'DELETE' });
      
      // 更新本地状态
      setMemberships(memberships.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting membership:', error);
    }
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Memberships</h1>
        <Link href="/dashboard/memberships/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Membership
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{membership.customer?.name || `Customer #${membership.customerId}`}</div>
                    {membership.customer?.phone && (
                      <div className="text-sm text-gray-500">{membership.customer.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelBadgeColor(membership.level)}`}>
                      {membership.level.charAt(0).toUpperCase() + membership.level.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{membership.points.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${membership.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(membership.expiryDate).toLocaleDateString('en-US')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      membership.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {membership.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/memberships/${membership.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link href={`/dashboard/memberships/${membership.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleStatusToggle(membership.id)} 
                        className={membership.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {membership.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(membership.id)} 
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