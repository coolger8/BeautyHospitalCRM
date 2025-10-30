'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  allergyHistory: string;
  contraindications: string;
  visitFrequency: number;
  satisfactionScore: number;
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const customerId = parseInt(resolvedParams.id);

  useEffect(() => {
    // In a real app, this would fetch data from the backend
    const mockCustomer: Customer = {
      id: customerId,
      name: 'Alice Johnson',
      gender: 'Female',
      age: 32,
      phone: '13800138001',
      email: 'alice@example.com',
      address: '123 Main St, Beijing',
      source: 'Advertisement',
      valueLevel: 'Gold',
      consumptionLevel: 'High',
      demandType: 'Skin Management',
      allergyHistory: 'Penicillin allergy',
      contraindications: 'None',
      visitFrequency: 5,
      satisfactionScore: 9,
    };

    setTimeout(() => {
      setCustomer(mockCustomer);
      setLoading(false);
    }, 500);
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer not found</h2>
        <Link href="/dashboard/customers" className="text-blue-600 hover:text-blue-800">
          ← Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/customers" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to customers
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Edit
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this customer?')) {
                    // In a real app, this would call the backend API
                    router.push('/dashboard/customers');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Name</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.name}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Gender</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.gender}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Age</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.age}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.phone}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.email}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Address</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.address}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Source</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.source}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Value Level</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${customer.valueLevel === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 
                        customer.valueLevel === 'Silver' ? 'bg-gray-100 text-gray-800' : 
                        'bg-orange-100 text-orange-800'}`}>
                      {customer.valueLevel}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Consumption Level</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.consumptionLevel}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Demand Type</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.demandType}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Visit Frequency</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.visitFrequency} times</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Satisfaction Score</div>
                  <div className="w-2/3 text-sm text-gray-900">{customer.satisfactionScore}/10</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Allergy History</div>
                  <div className="w-3/4 text-sm text-gray-900">{customer.allergyHistory || 'None'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Contraindications</div>
                  <div className="w-3/4 text-sm text-gray-900">{customer.contraindications || 'None'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Consultation</p>
                    <p className="text-sm text-gray-500">Consulted with Dr. Zhang about skin whitening treatment</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    2 days ago
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Appointment</p>
                    <p className="text-sm text-gray-500">Scheduled for laser treatment on June 15, 2025</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    1 week ago
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Treatment</p>
                    <p className="text-sm text-gray-500">Completed first session of laser treatment</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    2 weeks ago
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}