import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PatientRecords() {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['patient-records'],
    queryFn: () => api.get('/patient/records').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Medical Records" subtitle={`${records.length} records`} />
      <div className="space-y-4">
        {records.length===0
          ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No medical records yet</div>
          : records.map(r=>(
          <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-800">{r.diagnosis||'General Consultation'}</p>
                <p className="text-xs text-gray-500">Dr. {r.doctor?.user?.firstName} {r.doctor?.user?.lastName} · {r.visitDate||r.createdAt?.split('T')[0]}</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{r.recordType||'VISIT'}</span>
            </div>
            {r.symptoms && <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Symptoms:</span> {r.symptoms}</p>}
            {r.notes && <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {r.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
