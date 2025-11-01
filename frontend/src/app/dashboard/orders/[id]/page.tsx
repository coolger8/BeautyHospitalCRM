'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const orderId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (response.ok) {
          const orderData: Order = await response.json();
          setOrder(orderData);
        } else {
          console.error('Failed to fetch order data');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          alert('Authentication required. Please log in again.');
          router.push('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          router.push('/dashboard/orders');
        } else {
          const errorData = await response.json();
          console.error('Failed to delete order:', errorData);
          alert('Failed to delete order: ' + (errorData.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-800">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/orders/${order.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Edit
              </Link>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Name</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.customer.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Gender</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.customer.gender}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Age</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.customer.age}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.customer.phone}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.customer.email}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Treatment</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.project.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Category</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.project.category}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Base Price</div>
                  <div className="w-2/3 text-sm text-gray-900">${order.project.basePrice.toFixed(2)}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Description</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.project.description}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Staff Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Consultant</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.consultant.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Role</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.consultant.role}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.consultant.phone}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{order.consultant.email}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Status</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Payment Method</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatPaymentMethod(order.paymentMethod)}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Amount</div>
                  <div className="w-2/3 text-sm text-gray-900">${order.amount.toFixed(2)}</div>
                </div>
                
                {order.discountAmount > 0 && (
                  <>
                    <div className="flex">
                      <div className="w-1/3 text-sm font-medium text-gray-500">Discount</div>
                      <div className="w-2/3 text-sm text-green-600">-${order.discountAmount.toFixed(2)}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm font-medium text-gray-500">Final Amount</div>
                      <div className="w-2/3 text-sm font-medium text-gray-900">${order.finalAmount.toFixed(2)}</div>
                    </div>
                  </>
                )}
                
                {order.discountApprover && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Discount Approved By</div>
                    <div className="w-2/3 text-sm text-gray-900">{order.discountApprover.name}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                {order.notes || 'No notes provided'}
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Created At</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(order.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}