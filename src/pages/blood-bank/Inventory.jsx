import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A_POSITIVE','A_NEGATIVE','B_POSITIVE','B_NEGATIVE','AB_POSITIVE','AB_NEGATIVE','O_POSITIVE','O_NEGATIVE'];

export default function BloodBankInventory() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('inventory');
  const [stockForm, setStockForm] = useState({ bankId:'1', bloodGroup:'A_POSITIVE', units:'' });
  const [requestForm, setRequestForm] = useState({ bloodGroup:'A_POSITIVE', unitsRequired:'', reason:'', urgencyLevel:'NORMAL' });

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['blood-inventory'],
    queryFn: () => api.get('/blood-bank/inventory').then(r => r.data)
  });
  const { data: requests = [] } = useQuery({
    queryKey: ['blood-requests'],
    queryFn: () => api.get('/blood-bank/requests').then(r => r.data)
  });

  const updateStockMut = useMutation({
    mutationFn: (d) => api.post(`/blood-bank/${d.bankId}/stock`, d),
    onSuccess: () => { toast.success('Stock updated'); qc.invalidateQueries(['blood-inventory']); }
  });
  const approveMut = useMutation({
    mutationFn: ({id,units}) => api.post(`/blood-bank/requests/${id}/approve`, {unitsApproved:units}),
    onSuccess: () => { toast.success('Request approved'); qc.invalidateQueries(['blood-requests']); }
  });
  const rejectMut = useMutation({
    mutationFn: ({id,reason}) => api.post(`/blood-bank/requests/${id}/reject`, {reason}),
    onSuccess: () => { toast.success('Request rejected'); qc.invalidateQueries(['blood-requests']); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Blood Bank Inventory" subtitle="Stock management and requests" />
      <div className="flex gap-2 mb-6">
        {[['inventory','Inventory'],['requests','Requests'],['addStock','Add Stock']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab===k?'bg-red-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab==='inventory' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BLOOD_GROUPS.map(bg=>{
            const inv = inventory.find?.(i=>i.bloodGroup===bg) || {};
            return (
              <div key={bg} className={`bg-white rounded-2xl p-5 shadow-sm border ${inv.unitsAvailable<=(inv.minimumThreshold||5)?'border-red-300':'border-gray-100'}`}>
                <div className={`inline-block px-3 py-1 rounded-full text-lg font-bold mb-3 ${inv.unitsAvailable<=(inv.minimumThreshold||5)?'bg-red-100 text-red-700':'bg-red-50 text-red-600'}`}>
                  {bg.replace('_POSITIVE','+').replace('_NEGATIVE','-')}
                </div>
                <p className="text-3xl font-bold text-gray-800">{inv.unitsAvailable??0}</p>
                <p className="text-xs text-gray-400">available units</p>
                <p className="text-xs text-gray-400">Min: {inv.minimumThreshold??5}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab==='requests' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Requested By','Blood Group','Units','Urgency','Reason','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length===0
                ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No requests</td></tr>
                : requests.map(r=>(
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{r.requestedBy?.firstName||'—'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">{r.bloodGroup?.replace('_POSITIVE','+').replace('_NEGATIVE','-')}</span></td>
                  <td className="px-4 py-3 font-semibold">{r.unitsRequired}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.urgencyLevel==='CRITICAL'?'bg-red-100 text-red-600':r.urgencyLevel==='HIGH'?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-600'}`}>{r.urgencyLevel||'NORMAL'}</span></td>
                  <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{r.reason||'—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status==='APPROVED'?'bg-green-100 text-green-700':r.status==='REJECTED'?'bg-red-100 text-red-600':'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                  <td className="px-4 py-3">
                    {r.status==='PENDING' && (
                      <div className="flex gap-1">
                        <button onClick={()=>approveMut.mutate({id:r.id,units:r.unitsRequired})} className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs">Approve</button>
                        <button onClick={()=>rejectMut.mutate({id:r.id,reason:'Insufficient stock'})} className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='addStock' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md">
          <h3 className="font-semibold text-gray-800 mb-4">Add Blood Stock</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={stockForm.bloodGroup} onChange={e=>setStockForm(f=>({...f,bloodGroup:e.target.value}))}>
                {BLOOD_GROUPS.map(bg=><option key={bg} value={bg}>{bg.replace('_POSITIVE','+').replace('_NEGATIVE','-')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Units to Add</label>
              <input type="number" min={1} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={stockForm.units} onChange={e=>setStockForm(f=>({...f,units:e.target.value}))} />
            </div>
            <button onClick={()=>updateStockMut.mutate(stockForm)} disabled={!stockForm.units||updateStockMut.isPending}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50">
              {updateStockMut.isPending?'Updating...':'Update Stock'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
