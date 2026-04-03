import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PharmacyPrescriptions() {
  const qc = useQueryClient();
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['pharmacy-prescriptions'],
    queryFn: () => api.get('/pharmacy/prescriptions/pending').then(r => r.data)
  });
  const dispenseMut = useMutation({
    mutationFn: (id) => api.post(`/pharmacy/prescriptions/${id}/dispense`),
    onSuccess: () => { toast.success('Prescription dispensed'); qc.invalidateQueries(['pharmacy-prescriptions']); }
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Pending Prescriptions" subtitle={`${prescriptions.length} to dispense`} />
      <div className="space-y-4">
        {prescriptions.length===0
          ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No pending prescriptions</div>
          : prescriptions.map(p=>(
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">{p.appointment?.patient?.user?.firstName} {p.appointment?.patient?.user?.lastName}</p>
                <p className="text-xs text-gray-500">Dr. {p.appointment?.doctor?.user?.firstName} {p.appointment?.doctor?.user?.lastName} · {p.createdAt?.split('T')[0]}</p>
              </div>
              <button onClick={()=>dispenseMut.mutate(p.id)} disabled={dispenseMut.isPending}
                className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                Mark Dispensed
              </button>
            </div>
            <div className="space-y-1">
              {p.items?.map((item,i)=>(
                <div key={i} className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-purple-600">💊</span>
                  <span className="font-medium">{item.medicineName}</span>
                  <span className="text-gray-500">{item.dosage}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{item.frequency}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{item.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
