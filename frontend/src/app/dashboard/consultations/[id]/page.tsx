'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const consultationId = parseInt(params.id);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await fetch(`http://localhost:3001/consultations/${consultationId}`);
        if (response.ok) {
          const consultationData: Consultation = await response.json();
          setConsultation(consultationData);
        } else {
          console.error('Failed to fetch consultation data');
        }
      } catch (error) {
        console.error('Error fetching consultation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchConsultation();
    }
  }, [consultationId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this consultation?')) {
      try {
        const response = await fetch(`http://localhost:3001/consultations/${consultationId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/dashboard/consultations');
        } else {
          console.error('Failed to delete consultation');
          alert('Failed to delete consultation');
        }
      } catch (error) {
        console.error('Error deleting consultation:', error);
        alert('Error deleting consultation');
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

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation not found</h2>
        <Link href="/dashboard/consultations" className="text-blue-600 hover:text-blue-800">
          ← Back to consultations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/consultations" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to consultations
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/consultations/${consultation.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Consultation Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Consultation ID</div>
                  <div className="w-2/3 text-sm text-gray-900">#{consultation.id}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Created At</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(consultation.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(consultation.updatedAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Consent Status</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${consultation.isConsentSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {consultation.isConsentSigned ? 'Consent Signed' : 'Pending Consent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Name</div>
                  <div className="w-2/3 text-sm text-gray-900">
                    <Link href={`/dashboard/customers/${consultation.customerId}`} className="text-blue-600 hover:underline">
                      {consultation.customer?.name || 'Unknown Customer'}
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{consultation.customer?.phone || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{consultation.customer?.email || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Consultation Details</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Consultant</div>
                  <div className="w-3/4 text-sm text-gray-900">{consultation.consultant?.name || 'Unassigned'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Recommended Project</div>
                  <div className="w-3/4 text-sm text-gray-900">{consultation.recommendedProject || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Quoted Price</div>
                  <div className="w-3/4 text-sm text-gray-900">¥{consultation.quotedPrice || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Communication Content</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {consultation.communicationContent || 'No communication content provided'}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Diagnosis Content</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {consultation.diagnosisContent || 'No diagnosis content provided'}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Skin Test Result</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {consultation.skinTestResult || 'No skin test result provided'}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Aesthetic Design</h3>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                  {consultation.aestheticDesign || 'No aesthetic design provided'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}