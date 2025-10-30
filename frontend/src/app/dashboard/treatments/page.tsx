'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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
  customer: {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
  };
  consultation: {
    id: number;
    customerId: number;
    consultantId: number;
    communicationContent: string;
    recommendedProject: string;
    quotedPrice: number;
  };
  doctor: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  nurse: {
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

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchTreatments = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/treatments?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Treatment> = await response.json();
        setTreatments(paginatedData.data);
        // Ensure all pagination values are numbers, not strings
        setTotalPages(Number(paginatedData.totalPages));
        setTotalItems(paginatedData.total);
        setCurrentPage(Number(paginatedData.page));
      } else {
        console.error('Failed to fetch treatments data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
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
      const mockData = generateMockData();
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
    // 生成更多模拟数据以测试分页
    const mockTreatments: Treatment[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      customerId: (i % 5) + 1,
      consultationId: (i % 4) + 1,
      doctorId: (i % 3) + 1,
      nurseId: (i % 2) + 1,
      projectId: (i % 6) + 1,
      productName: `Treatment Product ${i + 1}`,
      dosage: `${10 + (i % 20)}ml`,
      treatmentTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      recoveryNotes: `Recovery notes for treatment ${i + 1}`,
      rednessLevel: Math.floor(Math.random() * 5) + 1,
      customerFeedback: `Customer feedback for treatment ${i + 1}`,
      nextTreatmentTime: i % 3 === 0 ? null : new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      treatmentSequence: (i % 6) + 1,
      totalTreatments: 6,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      customer: {
        id: (i % 5) + 1,
        name: `Customer ${(i % 5) + 1}`,
        gender: i % 2 === 0 ? 'Female' : 'Male',
        age: 20 + (i % 50),
        phone: `1380013800${(i % 9) + 1}`,
        email: `customer${(i % 5) + 1}@example.com`
      },
      consultation: {
        id: (i % 4) + 1,
        customerId: (i % 5) + 1,
        consultantId: (i % 3) + 1,
        communicationContent: `Consultation content ${i + 1}`,
        recommendedProject: `Recommended project ${i + 1}`,
        quotedPrice: 1000 + (i * 100)
      },
      doctor: {
        id: (i % 3) + 1,
        name: `Doctor ${(i % 3) + 1}`,
        email: `doctor${(i % 3) + 1}@beautyhospital.com`,
        phone: `1380013801${(i % 9) + 1}`,
        role: 'doctor'
      },
      nurse: {
        id: (i % 2) + 1,
        name: `Nurse ${(i % 2) + 1}`,
        email: `nurse${(i % 2) + 1}@beautyhospital.com`,
        phone: `1380013802${(i % 9) + 1}`,
        role: 'nurse'
      }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Treatment Management</h1>
        <Link href="/dashboard/treatments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Treatment
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical Team
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment Info
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
                  {treatments.map((treatment) => (
                    <tr key={treatment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-800 font-medium">
                                {treatment.customer.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{treatment.customer.name}</div>
                            <div className="text-sm text-gray-500">{treatment.customer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{treatment.productName}</div>
                        <div className="text-sm text-gray-500">Dosage: {treatment.dosage}</div>
                        <div className="text-sm text-gray-500">Project: {treatment.consultation.recommendedProject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Doctor: {treatment.doctor.name}</div>
                        <div className="text-sm text-gray-500">Nurse: {treatment.nurse.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(treatment.treatmentTime).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">Sequence: {treatment.treatmentSequence}/{treatment.totalTreatments}</div>
                        {treatment.nextTreatmentTime && (
                          <div className="text-sm text-blue-600">Next: {new Date(treatment.nextTreatmentTime).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${treatment.rednessLevel <= 3 ? 'bg-green-100 text-green-800' : 
                            treatment.rednessLevel <= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          Redness: {treatment.rednessLevel}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/treatments/${treatment.id}`} className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link href={`/dashboard/treatments/${treatment.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
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
          </div>
          <Pagination />
        </>
      )}
    </div>
  );
}