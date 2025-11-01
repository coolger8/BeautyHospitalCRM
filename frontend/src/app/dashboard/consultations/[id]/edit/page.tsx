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
}

interface Customer {
  id: number;
  name: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
}

export default function EditConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation>({
    id: 0,
    customerId: 0,
    consultantId: 0,
    communicationContent: '',
    recommendedProject: '',
    quotedPrice: 0,
    diagnosisContent: '',
    skinTestResult: '',
    aestheticDesign: '',
    isConsentSigned: false,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const consultationId = parseInt(params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch consultation details
        const consultationResponse = await fetch(`http://localhost:3001/consultations/${consultationId}`);
        const consultationData: Consultation = await consultationResponse.json();
        
        // Fetch customers for dropdown
        const customersResponse = await fetch('http://localhost:3001/customers');
        const customersData = await customersResponse.json();
        
        // Fetch staff for dropdown
        const staffResponse = await fetch('http://localhost:3001/staff');
        const staffData = await staffResponse.json();
        
        setConsultation(consultationData);
        setCustomers(customersData.data || customersData);
        setStaff(staffData.data || staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchData();
    }
  }, [consultationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setConsultation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               name === 'customerId' || name === 'consultantId' || name === 'quotedPrice' 
               ? parseInt(value) || 0 
               : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`http://localhost:3001/consultations/${consultationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultation),
      });
      
      if (response.ok) {
        router.push(`/dashboard/consultations/${consultationId}`);
      } else {
        console.error('Failed to update consultation');
        alert('Failed to update consultation');
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
      alert('Error updating consultation');
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
        <Link href={`/dashboard/consultations/${consultationId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to consultation
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Edit Consultation</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={consultation.customerId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="consultantId" className="block text-sm font-medium text-gray-700">Consultant</label>
                  <select
                    id="consultantId"
                    name="consultantId"
                    value={consultation.consultantId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Consultant</option>
                    {staff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} ({staffMember.role})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="recommendedProject" className="block text-sm font-medium text-gray-700">Recommended Project</label>
                  <input
                    type="text"
                    id="recommendedProject"
                    name="recommendedProject"
                    value={consultation.recommendedProject}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="quotedPrice" className="block text-sm font-medium text-gray-700">Quoted Price (¥)</label>
                  <input
                    type="number"
                    id="quotedPrice"
                    name="quotedPrice"
                    value={consultation.quotedPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status & Consent</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="isConsentSigned"
                    name="isConsentSigned"
                    type="checkbox"
                    checked={consultation.isConsentSigned}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isConsentSigned" className="ml-2 block text-sm text-gray-900">
                    Consent Signed
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Consultation Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="communicationContent" className="block text-sm font-medium text-gray-700">Communication Content</label>
                  <textarea
                    id="communicationContent"
                    name="communicationContent"
                    value={consultation.communicationContent}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="diagnosisContent" className="block text-sm font-medium text-gray-700">Diagnosis Content</label>
                  <textarea
                    id="diagnosisContent"
                    name="diagnosisContent"
                    value={consultation.diagnosisContent}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="skinTestResult" className="block text-sm font-medium text-gray-700">Skin Test Result</label>
                  <textarea
                    id="skinTestResult"
                    name="skinTestResult"
                    value={consultation.skinTestResult}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="aestheticDesign" className="block text-sm font-medium text-gray-700">Aesthetic Design</label>
                  <textarea
                    id="aestheticDesign"
                    name="aestheticDesign"
                    value={consultation.aestheticDesign}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link href={`/dashboard/consultations/${consultationId}`} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}