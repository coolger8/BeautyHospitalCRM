'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const appointmentId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:3001/appointments/${appointmentId}`);
        if (response.ok) {
          const appointmentData: Appointment = await response.json();
          setAppointment(appointmentData);
        } else {
          console.error('Failed to fetch appointment data');
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://localhost:3001/appointments/${appointmentId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/dashboard/appointments');
        } else {
          console.error('Failed to delete appointment');
          alert('Failed to delete appointment');
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment not found</h2>
        <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-800">
          ← Back to appointments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to appointments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <div className="flex space-x-2">
              <Link href={`/dashboard/appointments/${appointment.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Appointment ID</div>
                  <div className="w-2/3 text-sm text-gray-900">#{appointment.id}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Scheduled Time</div>
                  <div className="w-2/3 text-sm text-gray-900">{formatDate(appointment.scheduledTime)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Status</div>
                  <div className="w-2/3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Project ID</div>
                  <div className="w-2/3 text-sm text-gray-900">#{appointment.projectId}</div>
                </div>
                {appointment.notes && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Notes</div>
                    <div className="w-2/3 text-sm text-gray-900">{appointment.notes}</div>
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
                    <Link href={`/dashboard/customers/${appointment.customerId}`} className="text-blue-600 hover:underline">
                      {appointment.customer?.name || 'Unknown Customer'}
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm text-gray-900">{appointment.customer?.phone || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-2/3 text-sm text-gray-900">{appointment.customer?.email || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned Staff</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Staff Name</div>
                  <div className="w-3/4 text-sm text-gray-900">
                    <Link href={`/dashboard/staff/${appointment.assignedStaffId}`} className="text-blue-600 hover:underline">
                      {appointment.assignedStaff?.name || 'Unassigned'}
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Phone</div>
                  <div className="w-3/4 text-sm text-gray-900">{appointment.assignedStaff?.phone || 'N/A'}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Email</div>
                  <div className="w-3/4 text-sm text-gray-900">{appointment.assignedStaff?.email || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Created At</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(appointment.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="w-3/4 text-sm text-gray-900">{formatDate(appointment.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}