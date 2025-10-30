'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
  customer: {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
  };
  consultant: {
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
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchConsultations = async (page: number = 1) => {
    try {
      console.log('Fetching consultations, page:', page);
      // Fixed the URL to use the correct backend port
      const response = await fetch(`http://localhost:3001/consultations?page=${page}&limit=${limit}`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Consultation> = await response.json();
        console.log('API data:', paginatedData);
        setConsultations(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
      } else {
        console.error('Failed to fetch consultations data, status:', response.status);
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        console.log('Generated mock data length:', mockData.length);
        // 分页模拟数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMockData = mockData.slice(startIndex, endIndex);
        console.log('Paginated mock data:', { startIndex, endIndex, length: paginatedMockData.length });
        
        setConsultations(paginatedMockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(page);
        console.log('Set mock data pagination:', {
          totalItems: mockData.length,
          totalPages: Math.ceil(mockData.length / limit),
          currentPage: page
        });
      }
    } catch (error) {
      console.error('Error fetching consultations data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      console.log('Generated mock data (error case) length:', mockData.length);
      // 分页模拟数据
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockData = mockData.slice(startIndex, endIndex);
      console.log('Paginated mock data (error case):', { startIndex, endIndex, length: paginatedMockData.length });
      
      setConsultations(paginatedMockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(page);
      console.log('Set mock data pagination (error case):', {
        totalItems: mockData.length,
        totalPages: Math.ceil(mockData.length / limit),
        currentPage: page
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, currentPage:', currentPage);
    fetchConsultations(currentPage);
  }, [currentPage]);

  const generateMockData = (): Consultation[] => {
    // 生成更多模拟数据以测试分页
    const mockConsultations: Consultation[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      customerId: (i % 3) + 1,
      consultantId: (i % 3) + 1,
      communicationContent: `Customer interested in anti-aging treatments - Consultation ${i + 1}`,
      recommendedProject: `Skin Rejuvenation Package ${i + 1}`,
      quotedPrice: 5000 + (i * 100),
      diagnosisContent: `Good skin condition, minor wrinkles around eyes - Consultation ${i + 1}`,
      skinTestResult: `Normal skin type, no allergies detected - Test ${i + 1}`,
      aestheticDesign: `Botox injections for forehead lines - Design ${i + 1}`,
      isConsentSigned: i % 2 === 0,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      customer: {
        id: (i % 3) + 1,
        name: `Customer ${(i % 3) + 1}`,
        gender: i % 2 === 0 ? 'Female' : 'Male',
        age: 25 + (i % 40),
        phone: `1380013800${(i % 9) + 1}`,
        email: `customer${(i % 3) + 1}@example.com`,
      },
      consultant: {
        id: (i % 3) + 1,
        name: `Dr. Consultant ${(i % 3) + 1}`,
        email: `consultant${(i % 3) + 1}@hospital.com`,
        phone: `1380013801${(i % 9) + 1}`,
        role: 'Senior Consultant',
      },
    }));

    return mockConsultations;
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
        <Link href="/dashboard/consultations/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Consultation
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {consultation.customer?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/dashboard/customers/${consultation.customerId}`} className="hover:underline">
                              {consultation.customer?.name || 'Unknown Customer'}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{consultation.customer?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultation.consultant?.name || 'Unknown Consultant'}</div>
                      <div className="text-sm text-gray-500">{consultation.consultant?.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(consultation.createdAt)}</div>
                      <div className="text-sm text-gray-500">¥{consultation.quotedPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.recommendedProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${consultation.isConsentSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {consultation.isConsentSigned ? 'Consent Signed' : 'Pending Consent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/consultations/${consultation.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link href={`/dashboard/consultations/${consultation.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
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