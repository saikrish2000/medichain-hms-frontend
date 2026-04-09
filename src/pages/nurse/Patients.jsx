import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function NursePatients() {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['nurse-patients'],
    queryFn: () => api.get('/nurse/patients').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Assigned Patients" subtitle={`${patients.length} patients`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.length===0
          ? <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400">No assigned patients</div>
          : patients.map(p=>(
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {p.user?.firstName?.[0]||'P'}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{p.user?.firstName} {p.user?.lastName}</p>
                <p className="text-xs text-gray-500">Ward: {p.ward?.name||'—'} · Bed: {p.bed?.bedNumber||'—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded-lg"><span className="text-gray-400">Blood Group</span><p className="font-semibold">{p.bloodGroup||'—'}</p></div>
              <div className="p-2 bg-gray-50 rounded-lg"><span className="text-gray-400">Gender</span><p className="font-semibold capitalize">{p.gender?.toLowerCase()||'—'}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
