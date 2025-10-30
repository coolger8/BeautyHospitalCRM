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
      const response = await fetch(`http://localhost:3001/consultations?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Consultation> = await response.json();
        setConsultations(paginatedData.data);
        setTotalPages(paginatedData.totalPages);
        setTotalItems(paginatedData.total);
        setCurrentPage(paginatedData.page);
      } else {
        console.error('Failed to fetch consultations data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        setConsultations(mockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching consultations data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      setConsultations(mockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations(currentPage);
  }, [currentPage]);

  const generateMockData = (): Consultation[] => {
    const mockConsultations: Consultation[] = [
      {
        id: 1,
        customerId: 1,
        consultantId: 1,
        communicationContent: 'Customer interested in anti-aging treatments',
        recommendedProject: 'Skin Rejuvenation Package',
        quotedPrice: 5000,
        diagnosisContent: 'Good skin condition, minor wrinkles around eyes',
        skinTestResult: 'Normal skin type, no allergies detected',
        aestheticDesign: 'Botox injections for forehead lines',
        isConsentSigned: true,
        createdAt: '2023-06-15T10:00:00Z',
        updatedAt: '2023-06-15T10:30:00Z',
        customer: {
          id: 1,
          name: 'Alice Johnson',
          gender: 'Female',
          age: 32,
          phone: '13800138001',
          email: 'alice@example.com',
        },
        consultant: {
          id: 1,
          name: 'Dr. Zhang Wei',
          email: 'zhangwei@hospital.com',
          phone: '13800138011',
          role: 'Senior Consultant',
        },
      },
      {
        id: 2,
        customerId: 2,
        consultantId: 2,
        communicationContent: 'Follow-up for previous laser treatment',
        recommendedProject: 'Laser Spot Removal',
        quotedPrice: 2500,
        diagnosisContent: 'Good healing progress from previous treatment',
        skinTestResult: 'Sensitive skin, recommend gentle approach',
        aestheticDesign: 'Fractional laser for spot removal',
        isConsentSigned: false,
        createdAt: '2023-06-16T14:30:00Z',
        updatedAt: '2023-06-16T15:15:00Z',
        customer: {
          id: 2,
          name: 'Bob Smith',
          gender: 'Male',
          age: 45,
          phone: '13800138002',
          email: 'bob@example.com',
        },
        consultant: {
          id: 2,
          name: 'Dr. Li Na',
          email: 'lina@hospital.com',
          phone: '13800138012',
          role: 'Laser Specialist',
        },
      },
      {
        id: 3,
        customerId: 3,
        consultantId: 3,
        communicationContent: 'Recommended facial rejuvenation package',
        recommendedProject: 'Comprehensive Facial Rejuvenation',
        quotedPrice: 12000,
        diagnosisContent: 'Multiple aging signs, comprehensive approach needed',
        skinTestResult: 'Dry skin, recommend hydration treatments',
        aestheticDesign: 'Hyaluronic acid fillers + laser therapy',
        isConsentSigned: true,
        createdAt: '2023-06-14T09:15:00Z',
        updatedAt: '2023-06-14T10:15:00Z',
        customer: {
          id: 3,
          name: 'Charlie Brown',
          gender: 'Male',
          age: 28,
          phone: '13800138003',
          email: 'charlie@example.com',
        },
        consultant: {
          id: 3,
          name: 'Dr. Wang Chen',
          email: 'wangchen@hospital.com',
          phone: '13800138013',
          role: 'Aesthetic Director',
        },
      },
    ];

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