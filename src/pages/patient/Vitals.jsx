import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PatientVitals() {
  const { data: vitals = [], isLoading } = useQuery({
    queryKey: ['patient-vitals'],
    queryFn: () => api.get('/patient/vitals').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="My Vitals" subtitle="Recorded health measurements" />
      <div className="space-y-4">
        {vitals.length===0
          ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No vitals recorded yet</div>
          : vitals.map((v,i)=>(
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-3">{v.recordedAt ? new Date(v.recordedAt).toLocaleString() : '—'}</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                ['BP',v.bloodPressure,'mmHg'],['Temp',v.temperature,'°C'],
                ['Pulse',v.pulseRate,'bpm'],['SpO2',v.oxygenSaturation,'%'],
                ['Weight',v.weight,'kg'],['Height',v.height,'cm'],
              ].map(([label,val,unit])=>(
                <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-bold text-gray-800">{val??'—'}</p>
                  {val && <p className="text-xs text-gray-400">{unit}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
