import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminApprovals() {
  const qc = useQueryClient();

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['pending-doctors'],
    queryFn: () => api.get('/admin/doctors?page=0').then(r =>
      (r.data.content || r.data || []).filter(d => d.user?.approvalStatus === 'PENDING' || !d.approvedAt)
    )
  });

  const approveMut = useMutation({
    mutationFn: (id) => api.post(`/admin/doctors/${id}/approve`),
    onSuccess: () => { toast.success('Doctor approved'); qc.invalidateQueries(['pending-doctors']); }
  });
  const rejectMut = useMutation({
    mutationFn: (id) => api.post(`/admin/doctors/${id}/reject`),
    onSuccess: () => { toast.success('Doctor rejected'); qc.invalidateQueries(['pending-doctors']); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Pending Approvals" subtitle="Review and approve new doctor registrations" />
      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-gray-500">No pending approvals</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Doctor','Specialization','License','Email','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.user?.firstName} {d.user?.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{d.specialization?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{d.licenseNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{d.user?.email}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => approveMut.mutate(d.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition">
                      Approve
                    </button>
                    <button onClick={() => rejectMut.mutate(d.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
