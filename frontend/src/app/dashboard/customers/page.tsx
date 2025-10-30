'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  source: string;
  valueLevel: string;
  consumptionLevel: string;
  demandType: string;
  visitFrequency: number;
  satisfactionScore: number;
  allergyHistory?: string;
  contraindications?: string;
  consumptionPreference?: string;
  relatedCustomerId?: number;
  isEncrypted: boolean;
  membershipId?: number;
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchCustomers = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/customers?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Customer> = await response.json();
        setCustomers(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
      } else {
        console.error('Failed to fetch customers data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        // 分页模拟数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMockData = mockData.slice(startIndex, endIndex);
        
        setCustomers(paginatedMockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(page);
        // 调试信息
        console.log('Using mock data:', {
          totalItems: mockData.length,
          totalPages: Math.ceil(mockData.length / limit),
          currentPage: page,
          limit: limit,
          startIndex: startIndex,
          endIndex: endIndex,
          dataLength: paginatedMockData.length
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      // 分页模拟数据
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockData = mockData.slice(startIndex, endIndex);
      
      setCustomers(paginatedMockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(page);
      // 调试信息
      console.log('Using mock data due to error:', {
        totalItems: mockData.length,
        totalPages: Math.ceil(mockData.length / limit),
        currentPage: page,
        limit: limit,
        startIndex: startIndex,
        endIndex: endIndex,
        dataLength: paginatedMockData.length
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): Customer[] => {
    // 生成更多模拟数据以测试分页
    const mockCustomers: Customer[] = Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      name: `Customer ${i + 1}`,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      age: 20 + (i % 50),
      phone: `13800138${i.toString().padStart(4, '0')}`,
      email: `customer${i + 1}@example.com`,
      address: `${i + 1} Main St, City ${i + 1}`,
      source: ['Advertisement', 'Referral', 'Meituan', 'Website', 'Walk-in'][i % 5],
      valueLevel: ['Bronze', 'Silver', 'Gold', 'Platinum'][(i % 4)],
      consumptionLevel: ['Low', 'Medium', 'High'][(i % 3)],
      demandType: ['Skin Management', 'Plastic Surgery', 'Anti Aging', 'Body Care'][(i % 4)],
      visitFrequency: Math.floor(Math.random() * 20) + 1,
      satisfactionScore: Math.floor(Math.random() * 10) + 1,
      isEncrypted: false,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    
    return mockCustomers;
  };

  useEffect(() => {
    console.log('useEffect triggered, currentPage:', currentPage);
    fetchCustomers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    console.log('handlePageChange called with page:', page, 'totalPages:', totalPages);
    if (page >= 1 && page <= totalPages) {
      console.log('Setting current page to:', page);
      setCurrentPage(page);
    } else {
      console.log('Page change rejected: page out of range');
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
            onClick={() => {
              handlePageChange(currentPage + 1);
            }}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Link href="/dashboard/customers/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Customer
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.age} years old</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${customer.valueLevel === 'gold' ? 'bg-yellow-100 text-yellow-800' : 
                          customer.valueLevel === 'silver' ? 'bg-gray-100 text-gray-800' : 
                          customer.valueLevel === 'platinum' ? 'bg-purple-100 text-purple-800' :
                          customer.valueLevel === 'diamond' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'}`}>
                        {customer.valueLevel.charAt(0).toUpperCase() + customer.valueLevel.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.visitFrequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.satisfactionScore}/10</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/customers/${customer.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link href={`/dashboard/customers/${customer.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
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
      )}
    </div>
  );
}