import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ specialization: null, doctor: null, slot: null });
  const [reason, setReason] = useState('');

  const { data: specializations = [], isLoading: loadSpec } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => api.get('/appointments/specializations').then(r => r.data)
  });

  const { data: doctors = [], isLoading: loadDoc } = useQuery({
    queryKey: ['doctors-by-spec', selected.specialization?.id],
    queryFn: () => api.get(`/appointments/doctors?specializationId=${selected.specialization.id}`).then(r => r.data),
    enabled: !!selected.specialization
  });

  const { data: slots = [], isLoading: loadSlot } = useQuery({
    queryKey: ['slots-by-doctor', selected.doctor?.id],
    queryFn: () => api.get(`/appointments/slots?doctorId=${selected.doctor.id}`).then(r => r.data),
    enabled: !!selected.doctor
  });

  const bookMut = useMutation({
    mutationFn: () => api.post('/appointments/book', { slotId: selected.slot.id, reason }),
    onSuccess: () => { toast.success('Appointment booked successfully!'); navigate('/patient/appointments'); }
  });

  const StepHeader = () => (
    <div className="flex items-center gap-2 mb-8">
      {['Specialty','Doctor','Time Slot','Confirm'].map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
            ${step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {step > i+1 ? '✓' : i+1}
          </div>
          <span className={`text-sm font-medium ${step===i+1?'text-blue-600':'text-gray-400'}`}>{label}</span>
          {i < 3 && <div className={`h-0.5 w-8 ${step > i+1 ? 'bg-green-400' : 'bg-gray-200'}`}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader title="Book Appointment" subtitle="Find a doctor and schedule your visit" />
      <StepHeader />

      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Specialization</h2>
          {loadSpec ? <LoadingSpinner /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specializations.map(s => (
                <button key={s.id} onClick={() => { setSelected(sel=>({...sel,specialization:s,doctor:null,slot:null})); setStep(2); }}
                  className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition text-left">
                  <p className="text-2xl mb-2">🏥</p>
                  <p className="font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.description||''}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
            <h2 className="text-lg font-semibold text-gray-800">Select Doctor — {selected.specialization?.name}</h2>
          </div>
          {loadDoc ? <LoadingSpinner /> : doctors.length === 0
            ? <p className="text-gray-400 text-center py-8">No doctors available for this specialization</p>
            : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <button key={d.id} onClick={() => { setSelected(sel=>({...sel,doctor:d,slot:null})); setStep(3); }}
                  className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {d.user?.firstName?.[0] || 'D'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Dr. {d.user?.firstName} {d.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{d.specialization?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{d.experience ? `${d.experience} years experience` : ''}</p>
                  <p className="text-sm font-semibold text-blue-600 mt-1">{d.consultationFee ? `₹${d.consultationFee}` : 'Fee not set'}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
            <h2 className="text-lg font-semibold text-gray-800">Select Time Slot — Dr. {selected.doctor?.user?.firstName} {selected.doctor?.user?.lastName}</h2>
          </div>
          {loadSlot ? <LoadingSpinner /> : slots.length === 0
            ? <p className="text-gray-400 text-center py-8">No available slots</p>
            : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map(s => (
                <button key={s.id} onClick={() => { setSelected(sel=>({...sel,slot:s})); setStep(4); }}
                  disabled={s.blocked || (s.bookedCount >= s.maxPatients)}
                  className={`p-4 rounded-2xl border text-sm font-medium transition
                    ${s.blocked||(s.bookedCount>=s.maxPatients)
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800'}`}>
                  <p className="font-semibold">{s.startTime?.slice(0,5)} – {s.endTime?.slice(0,5)}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.date}</p>
                  <p className="text-xs mt-1">{s.blocked ? '🔒 Blocked' : `${(s.maxPatients - (s.bookedCount||0))} slots left`}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
            <h2 className="text-lg font-semibold text-gray-800">Confirm Appointment</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Specialization</span><span className="font-medium">{selected.specialization?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span className="font-medium">Dr. {selected.doctor?.user?.firstName} {selected.doctor?.user?.lastName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selected.slot?.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selected.slot?.startTime?.slice(0,5)} – {selected.slot?.endTime?.slice(0,5)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fee</span><span className="font-semibold text-blue-600">{selected.doctor?.consultationFee ? `₹${selected.doctor.consultationFee}` : 'N/A'}</span></div>
            </div>
            <hr className="my-4 border-gray-100"/>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for visit</label>
            <textarea rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your symptoms or reason..." value={reason} onChange={e=>setReason(e.target.value)} />
          </div>
          <button onClick={() => bookMut.mutate()} disabled={bookMut.isPending}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 shadow-sm">
            {bookMut.isPending ? 'Booking...' : 'Confirm & Book Appointment'}
          </button>
        </div>
      )}
    </div>
  );
}
