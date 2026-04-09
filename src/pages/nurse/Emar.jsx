import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function NurseEmar() {
  const { data: meds = [], isLoading } = useQuery({
    queryKey: ['nurse-emar'],
    queryFn: () => api.get('/nurse/emar').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="eMAR — Medication Administration" subtitle="Electronic medication records" />
      {meds.length===0
        ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No pending medications</div>
        : <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Patient','Medicine','Dosage','Frequency','Status'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {meds.map((m,i)=>(
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{m.patientName||'—'}</td>
                    <td className="px-4 py-3">{m.medicineName||m.medicine?.name||'—'}</td>
                    <td className="px-4 py-3 text-gray-600">{m.dosage||'—'}</td>
                    <td className="px-4 py-3 text-gray-600">{m.frequency||'—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m.administered?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                        {m.administered?'Given':'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}
