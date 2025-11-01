'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
}

interface Consultation {
  id: number;
  customerId: number;
  recommendedProject: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
}

export default function NewTreatmentPage() {
  const router = useRouter();
  const [treatment, setTreatment] = useState({
    customerId: 0,
    consultationId: 0,
    doctorId: 0,
    nurseId: 0,
    projectId: 0,
    productName: '',
    dosage: '',
    treatmentTime: new Date().toISOString().slice(0, 16),
    recoveryNotes: '',
    rednessLevel: 5,
    customerFeedback: '',
    nextTreatmentTime: null as string | null,
    treatmentSequence: 1,
    totalTreatments: 1,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers for dropdown
        const customersResponse = await fetch('http://localhost:3001/customers');
        const customersData = await customersResponse.json();
        
        // Fetch consultations for dropdown
        const consultationsResponse = await fetch('http://localhost:3001/consultations');
        const consultationsData = await consultationsResponse.json();
        
        // Fetch staff for dropdown
        const staffResponse = await fetch('http://localhost:3001/staff');
        const staffData = await staffResponse.json();
        
        setCustomers(customersData.data || customersData);
        setConsultations(consultationsData.data || consultationsData);
        setStaff(staffData.data || staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setTreatment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               name === 'customerId' || name === 'consultationId' || name === 'doctorId' || 
               name === 'nurseId' || name === 'projectId' || name === 'rednessLevel' || 
               name === 'treatmentSequence' || name === 'totalTreatments' 
               ? parseInt(value) || 0 
               : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('http://localhost:3001/treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(treatment),
      });
      
      if (response.ok) {
        const newTreatment = await response.json();
        router.push(`/dashboard/treatments/${newTreatment.id}`);
      } else {
        console.error('Failed to create treatment');
        alert('Failed to create treatment');
      }
    } catch (error) {
      console.error('Error creating treatment:', error);
      alert('Error creating treatment');
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
        <Link href="/dashboard/treatments" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to treatments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">New Treatment</h1>
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
                    value={treatment.customerId}
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
                  <label htmlFor="consultationId" className="block text-sm font-medium text-gray-700">Consultation</label>
                  <select
                    id="consultationId"
                    name="consultationId"
                    value={treatment.consultationId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Consultation</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.recommendedProject} (ID: {consultation.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Doctor</label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={treatment.doctorId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {staff.filter(s => s.role === 'doctor').map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">Nurse</label>
                  <select
                    id="nurseId"
                    name="nurseId"
                    value={treatment.nurseId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Nurse</option>
                    {staff.filter(s => s.role === 'nurse').map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={treatment.productName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={treatment.dosage}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="treatmentTime" className="block text-sm font-medium text-gray-700">Treatment Time</label>
                  <input
                    type="datetime-local"
                    id="treatmentTime"
                    name="treatmentTime"
                    value={treatment.treatmentTime}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="rednessLevel" className="block text-sm font-medium text-gray-700">Redness Level (1-10)</label>
                  <input
                    type="range"
                    id="rednessLevel"
                    name="rednessLevel"
                    min="1"
                    max="10"
                    value={treatment.rednessLevel}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">Level: {treatment.rednessLevel}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Sequence</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="treatmentSequence" className="block text-sm font-medium text-gray-700">Current Sequence</label>
                  <input
                    type="number"
                    id="treatmentSequence"
                    name="treatmentSequence"
                    value={treatment.treatmentSequence}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="totalTreatments" className="block text-sm font-medium text-gray-700">Total Treatments</label>
                  <input
                    type="number"
                    id="totalTreatments"
                    name="totalTreatments"
                    value={treatment.totalTreatments}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes & Feedback</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recoveryNotes" className="block text-sm font-medium text-gray-700">Recovery Notes</label>
                  <textarea
                    id="recoveryNotes"
                    name="recoveryNotes"
                    value={treatment.recoveryNotes}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerFeedback" className="block text-sm font-medium text-gray-700">Customer Feedback</label>
                  <textarea
                    id="customerFeedback"
                    name="customerFeedback"
                    value={treatment.customerFeedback}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link href="/dashboard/treatments" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Treatment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}