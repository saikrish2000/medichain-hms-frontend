import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-700',PAID:'bg-green-100 text-green-700',PARTIAL:'bg-blue-100 text-blue-700',CANCELLED:'bg-red-100 text-red-600' };

export default function BillingInvoices() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId:'', appointmentId:'', description:'', amount:'', paymentMethod:'CASH' });

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', page],
    queryFn: () => api.get(`/billing/invoices?page=${page}`).then(r => r.data)
  });
  const createMut = useMutation({
    mutationFn: (d) => api.post('/billing/invoices', d),
    onSuccess: () => { toast.success('Invoice created'); qc.invalidateQueries(['invoices']); setShowForm(false); }
  });
  const markPaidMut = useMutation({
    mutationFn: ({id,method}) => api.post(`/billing/invoices/${id}/pay`, {paymentMethod:method}),
    onSuccess: () => { toast.success('Invoice marked as paid'); qc.invalidateQueries(['invoices']); }
  });

  const invoices = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Invoices" subtitle={`${data?.totalElements ?? invoices.length} total`}
        action={<button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">+ Create Invoice</button>}
      />
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5 max-w-xl">
          <h3 className="font-semibold mb-4">New Invoice</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Patient ID *</label>
              <input type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Appointment ID</label>
              <input type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.appointmentId} onChange={e=>setForm(f=>({...f,appointmentId:e.target.value}))} /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹) *</label>
              <input type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))}>
                {['CASH','CARD','UPI','RAZORPAY','INSURANCE'].map(m=><option key={m}>{m}</option>)}
              </select></div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Consultation + Lab Tests" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>createMut.mutate(form)} disabled={!form.patientId||!form.amount||createMut.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
              {createMut.isPending?'Creating...':'Create'}
            </button>
            <button onClick={()=>setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Patient','Amount','Paid','Method','Date','Status','Action'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.length===0
              ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No invoices</td></tr>
              : invoices.map(inv=>(
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{inv.patient?.user?.firstName} {inv.patient?.user?.lastName}</td>
                <td className="px-4 py-3 font-semibold">₹{inv.totalAmount||0}</td>
                <td className="px-4 py-3 text-green-600">₹{inv.amountPaid||0}</td>
                <td className="px-4 py-3 text-gray-500">{inv.paymentMethod||'—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{inv.createdAt?.split('T')[0]||'—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[inv.status]||'bg-gray-100 text-gray-600'}`}>{inv.status}</span></td>
                <td className="px-4 py-3">
                  {inv.status==='PENDING' && (
                    <button onClick={()=>markPaidMut.mutate({id:inv.id,method:inv.paymentMethod||'CASH'})}
                      className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
