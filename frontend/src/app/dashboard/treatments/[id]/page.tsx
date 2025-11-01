'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function TreatmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const treatmentId = parseInt(params.id);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await fetch(`http://localhost:3001/treatments/${treatmentId}`);
        if (response.ok) {
          const treatmentData: Treatment = await response.json();
          setTreatment(treatmentData);
        } else {
          console.error('Failed to fetch treatment data');
        }
      } catch (error) {
        console.error('Error fetching treatment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (treatmentId) {
      fetchTreatment();
    }
  }, [treatmentId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this treatment?')) {
      try {
        const response = await fetch(`http://localhost:3001/treatments/${treatmentId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/dashboard/treatments');
        } else {
          console.error('Failed to delete treatment');
          alert('Failed to delete treatment');
        }
      } catch (error) {
        console.error('Error deleting treatment:', error);
        alert('Error deleting treatment');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Treatment not found</h2>
        <Link href="/dashboard/treatments" className="text-blue-600 hover:text-blue-800">
          ← Back to treatments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/treatments" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to treatments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Treatment Details</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/treatments/${treatment.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Treatment ID</div>
                  <div className="w-2/3 text-sm text-gray-900">#{treatment.id}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Treatment Time</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(treatment.treatmentTime)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Created At</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(treatment.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(treatment.updatedAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Treatment Sequence</div>
                  <div className="w-2/3 text-sm text-gray-900">{treatment.treatmentSequence} of {treatment.totalTreatments}</div>
                </div>
                {treatment.nextTreatmentTime && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Next Treatment</div>
                    <div className="w-2/3 text-sm text-gray-900">{formatDate(treatment.nextTreatmentTime)}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Name</div>
                  <div className="w-2/3 text-sm text-gray-900">
                    <Link href={`/dashboard/customers/${treatment.customerId}`} className="text-blue-600 hover:underline">
                      {treatment.customer?.name || 'Unknown Customer'}
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{treatment.customer?.phone || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{treatment.customer?.email || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Details</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Product Name</div>
                  <div className="w-3/4 text-sm text-gray-900">{treatment.productName || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Dosage</div>
                  <div className="w-3/4 text-sm text-gray-900">{treatment.dosage || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Project</div>
                  <div className="w-3/4 text-sm text-gray-900">{treatment.consultation?.recommendedProject || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Doctor</div>
                  <div className="w-3/4 text-sm text-gray-900">{treatment.doctor?.name || 'Unassigned'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Nurse</div>
                  <div className="w-3/4 text-sm text-gray-900">{treatment.nurse?.name || 'Unassigned'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Recovery Notes</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {treatment.recoveryNotes || 'No recovery notes provided'}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Customer Feedback</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {treatment.customerFeedback || 'No customer feedback provided'}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Redness Level</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <span className="mr-2">Level {treatment.rednessLevel}/10</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${treatment.rednessLevel <= 3 ? 'bg-green-100 text-green-800' : 
                        treatment.rednessLevel <= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {treatment.rednessLevel <= 3 ? 'Low' : 
                        treatment.rednessLevel <= 6 ? 'Medium' : 'High'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}