'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  phone: string;
}

interface Project {
  id: number;
  name: string;
  basePrice: number;
}

interface Staff {
  id: number;
  name: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState({
    customerId: 0,
    projectId: 0,
    consultantId: 0,
    status: 'pending_payment',
    paymentMethod: 'wechat',
    amount: 0,
    discountAmount: 0,
    finalAmount: 0,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        // Fetch customers
        const customersResponse = await fetch('http://localhost:3001/customers', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          // Handle both direct array and paginated response
          const customersArray = Array.isArray(customersData) 
            ? customersData 
            : customersData.data || [];
          setCustomers(customersArray);
        }
        
        // Fetch projects
        const projectsResponse = await fetch('http://localhost:3001/projects', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          // Handle both direct array and paginated response
          const projectsArray = Array.isArray(projectsData) 
            ? projectsData 
            : projectsData.data || [];
          setProjects(projectsArray);
        }
        
        // Fetch staff
        const staffResponse = await fetch('http://localhost:3001/staff', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          // Handle both direct array and paginated response
          const staffArray = Array.isArray(staffData) 
            ? staffData 
            : staffData.data || [];
          setStaff(staffArray);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate final amount when amount or discount changes
    const finalAmount = Math.max(0, order.amount - order.discountAmount);
    setOrder(prev => ({
      ...prev,
      finalAmount: parseFloat(finalAmount.toFixed(2))
    }));
  }, [order.amount, order.discountAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: name === 'customerId' || name === 'projectId' || name === 'consultantId' 
        ? parseInt(value) || 0 
        : name === 'amount' || name === 'discountAmount' || name === 'finalAmount'
        ? parseFloat(value) || 0
        : value
    }));
    
    // If project changes, update amount to project base price
    if (name === 'projectId' && value) {
      const projectId = parseInt(value);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setOrder(prev => ({
          ...prev,
          amount: project.basePrice,
          finalAmount: Math.max(0, project.basePrice - prev.discountAmount)
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Validation
    if (!order.customerId || !order.projectId || !order.consultantId) {
      alert('Please select customer, project, and consultant');
      setSaving(false);
      return;
    }
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }
      
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });
      
      if (response.ok) {
        const newOrder = await response.json();
        router.push(`/dashboard/orders/${newOrder.id}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create order:', errorData);
        alert('Failed to create order: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={order.customerId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Customer</option>
                    {Array.isArray(customers) && customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Treatment/Project</label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={order.projectId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Treatment</option>
                    {Array.isArray(projects) && projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} (${project.basePrice.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="consultantId" className="block text-sm font-medium text-gray-700">Consultant</label>
                  <select
                    id="consultantId"
                    name="consultantId"
                    value={order.consultantId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Consultant</option>
                    {Array.isArray(staff) && staff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={order.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="paid">Paid</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={order.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="wechat">WeChat Pay</option>
                    <option value="alipay">Alipay</option>
                    <option value="card">Credit Card</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={order.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700">Discount ($)</label>
                  <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={order.discountAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="finalAmount" className="block text-sm font-medium text-gray-700">Final Amount ($)</label>
                  <input
                    type="number"
                    id="finalAmount"
                    name="finalAmount"
                    value={order.finalAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                    readOnly
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={order.notes}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link href="/dashboard/orders" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}