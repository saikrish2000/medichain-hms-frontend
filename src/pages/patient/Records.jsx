import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TYPE_COLOR = {
  VISIT:'bg-blue-100 text-blue-700', PRESCRIPTION:'bg-purple-100 text-purple-700',
  LAB:'bg-orange-100 text-orange-700', IMAGING:'bg-teal-100 text-teal-700',
  SURGERY:'bg-red-100 text-red-700', DISCHARGE:'bg-green-100 text-green-700',
};

export default function PatientRecords() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['patient-records'],
    queryFn: () => api.get('/patient/records').then(r => r.data),
    staleTime: 30000,
  });

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
      r.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor?.user?.firstName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || r.recordType === filter;
    return matchSearch && matchFilter;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Medical Records" subtitle={`${records.length} total records`} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search by diagnosis, doctor…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {['ALL','VISIT','PRESCRIPTION','LAB','IMAGING','SURGERY'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Records */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">No records found</p>
            <p className="text-gray-400 text-sm">Try changing your search or filter</p>
          </div>
        ) : filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-gray-800 text-base">{r.diagnosis || 'General Consultation'}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Dr. {r.doctor?.user?.firstName} {r.doctor?.user?.lastName}
                  {r.doctor?.specialization?.name && ` · ${r.doctor.specialization.name}`}
                  {' · '}{r.visitDate || r.createdAt?.split('T')[0]}
                </p>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${TYPE_COLOR[r.recordType] || 'bg-gray-100 text-gray-600'}`}>
                {r.recordType || 'VISIT'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {r.symptoms && (
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-xs font-semibold text-red-600 mb-1">🤒 Symptoms</p>
                  <p className="text-gray-700">{r.symptoms}</p>
                </div>
              )}
              {r.notes && (
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs font-semibold text-blue-600 mb-1">📝 Doctor's Notes</p>
                  <p className="text-gray-700">{r.notes}</p>
                </div>
              )}
              {r.treatment && (
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-xs font-semibold text-green-600 mb-1">💊 Treatment</p>
                  <p className="text-gray-700">{r.treatment}</p>
                </div>
              )}
              {r.followUpDate && (
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <p className="text-xs font-semibold text-yellow-600 mb-1">📅 Follow-up</p>
                  <p className="text-gray-700">{r.followUpDate}</p>
                </div>
              )}
            </div>

            {r.documentUrl && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <a href={r.documentUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  📎 View attached document
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
