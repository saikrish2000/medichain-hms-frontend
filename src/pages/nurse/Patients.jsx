import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const BLOOD_COLOR = {
  'A+':'bg-red-100 text-red-700', 'A-':'bg-red-100 text-red-700',
  'B+':'bg-orange-100 text-orange-700', 'B-':'bg-orange-100 text-orange-700',
  'O+':'bg-blue-100 text-blue-700', 'O-':'bg-blue-100 text-blue-700',
  'AB+':'bg-purple-100 text-purple-700', 'AB-':'bg-purple-100 text-purple-700',
};

export default function NursePatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['nurse-patients'],
    queryFn: () => api.get('/nurse/patients').then(r => r.data),
    staleTime: 30000,
  });

  const filtered = patients.filter(p => {
    const name = `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase();
    return !search || name.includes(search.toLowerCase()) ||
      p.ward?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.bed?.bedNumber?.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Assigned Patients" subtitle={`${patients.length} patients under your care`} />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text" placeholder="Search by name, ward, bed…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
          <p className="text-2xl font-bold text-blue-700">{patients.length}</p>
          <p className="text-xs text-blue-500 font-medium">Total Patients</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
          <p className="text-2xl font-bold text-green-700">
            {patients.filter(p => p.admissionStatus === 'ADMITTED').length}
          </p>
          <p className="text-xs text-green-500 font-medium">Admitted</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-100">
          <p className="text-2xl font-bold text-yellow-700">
            {patients.filter(p => p.bed?.bedNumber).length}
          </p>
          <p className="text-xs text-yellow-500 font-medium">With Beds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-3">👥</p>
            <p className="text-gray-500 font-medium">No patients found</p>
          </div>
        ) : filtered.map(p => (
          <div key={p.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/nurse/vitals`)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {p.user?.firstName?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {p.user?.firstName} {p.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase() : '—'}
                  {p.dateOfBirth && ` · ${new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()} yrs`}
                </p>
              </div>
              {p.bloodGroup && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${BLOOD_COLOR[p.bloodGroup] || 'bg-gray-100 text-gray-600'}`}>
                  {p.bloodGroup}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-400 font-medium">Ward</p>
                <p className="text-sm font-semibold text-blue-700">{p.ward?.name || '—'}</p>
              </div>
              <div className="p-2.5 bg-green-50 rounded-xl">
                <p className="text-xs text-green-400 font-medium">Bed</p>
                <p className="text-sm font-semibold text-green-700">{p.bed?.bedNumber || '—'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button className="flex-1 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                onClick={e => { e.stopPropagation(); navigate('/nurse/vitals'); }}>
                📊 Record Vitals
              </button>
              <button className="flex-1 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-200 transition-colors"
                onClick={e => { e.stopPropagation(); navigate('/nurse/emar'); }}>
                💊 eMAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
