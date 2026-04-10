import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function VitalBadge({ value, normal, unit, label, icon }) {
  const isNormal = !normal || (value >= normal[0] && value <= normal[1]);
  const color = !value ? 'bg-gray-50 text-gray-400' : isNormal ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600';
  return (
    <div className={`${color} rounded-xl p-3 text-center`}>
      <p className="text-lg mb-0.5">{icon}</p>
      <p className="font-bold text-lg leading-none">{value ?? '—'}</p>
      {value && <p className="text-xs opacity-70 mt-0.5">{unit}</p>}
      <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
    </div>
  );
}

export default function PatientVitals() {
  const { data: vitals = [], isLoading } = useQuery({
    queryKey: ['patient-vitals'],
    queryFn: () => api.get('/patient/vitals').then(r => r.data),
    staleTime: 30000,
  });

  if (isLoading) return <LoadingSpinner />;

  const latest = vitals[0];

  return (
    <div>
      <PageHeader title="My Vitals" subtitle={`${vitals.length} recorded measurements`} />

      {latest && (
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Latest Reading</p>
              <p className="text-white font-semibold">
                {latest.recordedAt ? new Date(latest.recordedAt).toLocaleString('en-IN') : 'Recent'}
              </p>
            </div>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">Current</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label:'BP', value: latest.bloodPressure, unit:'mmHg', icon:'❤️' },
              { label:'Temp', value: latest.temperature, unit:'°C', icon:'🌡️' },
              { label:'Pulse', value: latest.pulseRate, unit:'bpm', icon:'💓' },
              { label:'SpO2', value: latest.oxygenSaturation, unit:'%', icon:'🫁' },
              { label:'Weight', value: latest.weight, unit:'kg', icon:'⚖️' },
              { label:'Height', value: latest.height, unit:'cm', icon:'📏' },
            ].map(({ label, value, unit, icon }) => (
              <div key={label} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <p className="text-xl mb-0.5">{icon}</p>
                <p className="font-bold text-white">{value ?? '—'}</p>
                {value && <p className="text-xs text-blue-100">{unit}</p>}
                <p className="text-xs text-blue-200 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {vitals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-5xl mb-3">🩺</p>
          <p className="text-gray-500 font-medium">No vitals recorded yet</p>
          <p className="text-gray-400 text-sm">Your nurse will record them during your next visit</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">History</h3>
          {vitals.slice(1).map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-3">
                {v.recordedAt ? new Date(v.recordedAt).toLocaleString('en-IN') : '—'}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label:'BP', value: v.bloodPressure, unit:'mmHg', icon:'❤️' },
                  { label:'Temp', value: v.temperature, unit:'°C', icon:'🌡️' },
                  { label:'Pulse', value: v.pulseRate, unit:'bpm', icon:'💓' },
                  { label:'SpO2', value: v.oxygenSaturation, unit:'%', icon:'🫁' },
                  { label:'Weight', value: v.weight, unit:'kg', icon:'⚖️' },
                  { label:'Height', value: v.height, unit:'cm', icon:'📏' },
                ].map(({ label, value, unit, icon }) => (
                  <VitalBadge key={label} label={label} value={value} unit={unit} icon={icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
