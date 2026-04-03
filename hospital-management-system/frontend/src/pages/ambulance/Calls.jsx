import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-700',DISPATCHED:'bg-blue-100 text-blue-700',EN_ROUTE:'bg-purple-100 text-purple-700',ARRIVED:'bg-orange-100 text-orange-600',COMPLETED:'bg-green-100 text-green-700',CANCELLED:'bg-red-100 text-red-600' };

export default function AmbulanceCalls() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['ambulance-calls', page],
    queryFn: () => api.get(`/ambulance/calls?page=${page}`).then(r => r.data)
  });
  const calls = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Emergency Calls" subtitle={`${data?.totalElements??calls.length} total calls`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Caller','Phone','Address','Type','Priority','Status','Time'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calls.length===0
              ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No calls</td></tr>
              : calls.map(c=>(
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.callerName||'—'}</td>
                <td className="px-4 py-3">{c.callerPhone}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{c.pickupAddress}</td>
                <td className="px-4 py-3 text-gray-600">{c.emergencyType||'—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.priorityLevel==='CRITICAL'?'bg-red-100 text-red-600':c.priorityLevel==='HIGH'?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-600'}`}>
                    {c.priorityLevel||'—'}
                  </span>
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[c.status]||'bg-gray-100 text-gray-600'}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.createdAt?.replace('T',' ').slice(0,16)||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
