'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: number;
  customerId: number;
  assignedStaffId: number;
  projectId: number;
  scheduledTime: string;
  status: string;
  notes: string;
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
  assignedStaff: {
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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchAppointments = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/appointments?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Appointment> = await response.json();
        setAppointments(paginatedData.data);
        setTotalPages(paginatedData.totalPages);
        setTotalItems(paginatedData.total);
        setCurrentPage(paginatedData.page);
      } else {
        console.error('Failed to fetch appointments data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        setAppointments(mockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching appointments data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      setAppointments(mockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const generateMockData = (): Appointment[] => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        customerId: 1,
        assignedStaffId: 1,
        projectId: 1,
        scheduledTime: '2023-06-15T10:00:00',
        status: 'scheduled',
        notes: 'Customer needs special care',
        createdAt: '2023-06-01T00:00:00',
        updatedAt: '2023-06-01T00:00:00',
        customer: {
          id: 1,
          name: 'John Smith',
          gender: 'Male',
          age: 30,
          phone: '13800138000',
          email: 'john@example.com'
        },
        assignedStaff: {
          id: 1,
          name: 'Dr. Lee',
          email: 'lee@beautyhospital.com',
          phone: '13800138001',
          role: 'doctor'
        }
      },
      {
        id: 2,
        customerId: 2,
        assignedStaffId: 2,
        projectId: 2,
        scheduledTime: '2023-06-16T14:30:00',
        status: 'pending',
        notes: 'First treatment',
        createdAt: '2023-06-02T00:00:00',
        updatedAt: '2023-06-02T00:00:00',
        customer: {
          id: 2,
          name: 'Emily Johnson',
          gender: 'Female',
          age: 25,
          phone: '13800138002',
          email: 'emily@example.com'
        },
        assignedStaff: {
          id: 2,
          name: 'Dr. Wang',
          email: 'wang@beautyhospital.com',
          phone: '13800138003',
          role: 'doctor'
        }
      },
      {
        id: 3,
        customerId: 3,
        assignedStaffId: 3,
        projectId: 3,
        scheduledTime: '2023-06-14T09:15:00',
        status: 'completed',
        notes: 'Customer very satisfied with service',
        createdAt: '2023-06-03T00:00:00',
        updatedAt: '2023-06-03T00:00:00',
        customer: {
          id: 3,
          name: 'Michael Brown',
          gender: 'Male',
          age: 35,
          phone: '13800138004',
          email: 'michael@example.com'
        },
        assignedStaff: {
          id: 3,
          name: 'Dr. Zhao',
          email: 'zhao@beautyhospital.com',
          phone: '13800138005',
          role: 'doctor'
        }
      },
      {
        id: 4,
        customerId: 1,
        assignedStaffId: 1,
        projectId: 4,
        scheduledTime: '2023-06-20T11:00:00',
        status: 'scheduled',
        notes: 'Check treatment results',
        createdAt: '2023-06-04T00:00:00',
        updatedAt: '2023-06-04T00:00:00',
        customer: {
          id: 1,
          name: 'John Smith',
          gender: 'Male',
          age: 30,
          phone: '13800138000',
          email: 'john@example.com'
        },
        assignedStaff: {
          id: 1,
          name: 'Dr. Lee',
          email: 'lee@beautyhospital.com',
          phone: '13800138001',
          role: 'doctor'
        }
      },
    ];

    return mockAppointments;
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <Link href="/dashboard/appointments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Appointment
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
                    Doctor
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
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {appointment.customer?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/dashboard/customers/${appointment.customerId}`} className="hover:underline">
                              {appointment.customer?.name || 'Unknown Customer'}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{appointment.customer?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.assignedStaff?.name || 'Unknown Staff'}</div>
                      <div className="text-sm text-gray-500">{appointment.assignedStaff?.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.scheduledTime)}</div>
                      <div className="text-sm text-gray-500">Project #{appointment.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Appointment
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/appointments/${appointment.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link href={`/dashboard/appointments/${appointment.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
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