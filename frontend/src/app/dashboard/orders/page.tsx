'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: number;
  customerId: number;
  projectId: number;
  consultantId: number;
  status: string;
  paymentMethod: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  discountApproverId: number | null;
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
  project: {
    id: number;
    name: string;
    description: string;
    category: string;
    basePrice: number;
    isActive: boolean;
  };
  consultant: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  discountApprover: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  } | null;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchOrders = async (page: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/orders?page=${page}&limit=${limit}`);
      if (response.ok) {
        const paginatedData: PaginatedResponse<Order> = await response.json();
        setOrders(paginatedData.data);
        setTotalPages(paginatedData.totalPages);
        setTotalItems(paginatedData.total);
        setCurrentPage(paginatedData.page);
      } else {
        console.error('Failed to fetch orders data');
        // 使用模拟数据作为备用
        const mockData = generateMockData();
        setOrders(mockData);
        // 设置模拟数据的分页状态
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / limit));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching orders data:', error);
      // 使用模拟数据作为备用
      const mockData = generateMockData();
      setOrders(mockData);
      // 设置模拟数据的分页状态
      setTotalItems(mockData.length);
      setTotalPages(Math.ceil(mockData.length / limit));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const generateMockData = (): Order[] => {
    const customerNames = [
      'John Smith', 'Emma Johnson', 'Michael Brown', 'Olivia Davis', 'William Wilson',
      'Sophia Martinez', 'James Anderson', 'Isabella Taylor', 'Robert Thomas', 'Mia Garcia',
      'David Rodriguez', 'Charlotte Lewis', 'Joseph Lee', 'Amelia Walker', 'Daniel Hall',
      'Evelyn Allen', 'Matthew Young', 'Abigail King', 'Andrew Wright', 'Elizabeth Scott'
    ];
    
    const projectNames = [
      'Facial Treatment', 'Skin Rejuvenation', 'Laser Hair Removal', 'Botox Injection',
      'Dermal Fillers', 'Chemical Peel', 'Microdermabrasion', 'Acne Treatment',
      'Anti-aging Package', 'Hydrafacial', 'Body Contouring', 'Scar Reduction',
      'Skin Tightening', 'Lip Enhancement', 'Eye Treatment', 'Neck Rejuvenation',
      'Full Face Makeover', 'Skin Analysis', 'Customized Facial', 'Wellness Package'
    ];
    
    const consultantNames = [
      'Consultant Zhang', 'Consultant Li', 'Consultant Wang', 'Consultant Zhao',
      'Consultant Liu', 'Consultant Chen', 'Consultant Yang', 'Consultant Huang',
      'Consultant Zhou', 'Consultant Wu', 'Consultant Zheng', 'Consultant Sun',
      'Consultant Ma', 'Consultant Zhu', 'Consultant Hu', 'Consultant Lin',
      'Consultant Guo', 'Consultant Gao', 'Consultant He', 'Consultant Tang'
    ];
    
    const statuses = ['pending_payment', 'paid', 'completed', 'refunded'];
    const paymentMethods = ['wechat', 'alipay', 'card', 'cash'];
    
    const mockOrders = Array.from({ length: 20 }, (_, i) => {
      const amount = Math.floor(Math.random() * 10000) + 500;
      const discountAmount = Math.floor(Math.random() * 500);
      const finalAmount = amount - discountAmount;
      
      // 随机创建日期（过去90天内）
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));
      
      return {
        id: i + 1,
        customerId: i + 1,
        projectId: i + 1,
        consultantId: i + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        amount,
        discountAmount,
        finalAmount,
        discountApproverId: Math.random() > 0.7 ? 1 : null,
        notes: `Order notes ${i}`,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        customer: {
          id: i + 1,
          name: customerNames[i],
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          age: Math.floor(Math.random() * 50) + 20,
          phone: `13800138${i.toString().padStart(3, '0')}`,
          email: `customer${i}@example.com`
        },
        project: {
          id: i + 1,
          name: projectNames[i],
          description: `Description for ${projectNames[i]}`,
          category: 'skin_care',
          basePrice: amount + 100,
          isActive: true
        },
        consultant: {
          id: i + 1,
          name: consultantNames[i],
          email: `consultant${i}@beautyhospital.com`,
          phone: `13800138${i.toString().padStart(3, '0')}`,
          role: 'consultant'
        },
        discountApprover: Math.random() > 0.7 ? {
          id: 1,
          name: 'Admin User',
          email: 'admin@beautyhospital.com',
          phone: '13800138000',
          role: 'admin'
        } : null
      };
    });
    
    return mockOrders;
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
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      // 实际项目中应该调用API
      // await fetch(`http://localhost:3001/orders/${id}`, { method: 'DELETE' });
      
      // 更新本地状态
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'wechat': return 'WeChat Pay';
      case 'alipay': return 'Alipay';
      case 'card': return 'Credit Card';
      case 'cash': return 'Cash';
      default: return method;
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
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/dashboard/orders/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Order
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{order.project.name}</div>
                    <div className="text-xs text-gray-500">${order.project.basePrice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{order.consultant.name}</div>
                    <div className="text-xs text-gray-500">{order.consultant.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${order.finalAmount.toFixed(2)}</div>
                    {order.discountAmount > 0 && (
                      <div className="text-xs text-green-600">Saved: ${order.discountAmount.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{formatPaymentMethod(order.paymentMethod)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link href={`/dashboard/orders/${order.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(order.id)} 
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