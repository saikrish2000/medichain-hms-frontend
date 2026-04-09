import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AmbulanceFleet() {
  const { data: fleet = [], isLoading } = useQuery({
    queryKey: ['ambulance-fleet'],
    queryFn: () => api.get('/ambulance/fleet').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Ambulance Fleet" subtitle={`${fleet.length} vehicles`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fleet.length===0
          ? <div className="col-span-3 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No fleet data</div>
          : fleet.map(a=>(
          <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🚑</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status==='AVAILABLE'?'bg-green-100 text-green-700':a.status==='ON_CALL'?'bg-blue-100 text-blue-700':'bg-red-100 text-red-600'}`}>
                {a.status}
              </span>
            </div>
            <p className="font-bold text-gray-800">{a.vehicleNumber}</p>
            <p className="text-sm text-gray-500">{a.model||'—'}</p>
            <p className="text-xs text-gray-400 mt-2">Driver: {a.driverName||'Unassigned'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
