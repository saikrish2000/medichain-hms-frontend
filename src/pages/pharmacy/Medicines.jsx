import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PharmacyMedicines() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', genericName:'', category:'', manufacturer:'', unitPrice:'', quantityInStock:'', minStockLevel:'', expiryDate:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => api.get('/pharmacy/medicines').then(r => r.data)
  });
  const createMut = useMutation({
    mutationFn: (d) => api.post('/pharmacy/medicines', d),
    onSuccess: () => { toast.success('Medicine added'); qc.invalidateQueries(['medicines']); setShowForm(false); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Medicine Inventory" subtitle={`${medicines.length} medicines`}
        action={<button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">+ Add Medicine</button>}
      />

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
          <h3 className="font-semibold text-gray-800 mb-4">Add New Medicine</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['name','Name *'],['genericName','Generic Name'],['category','Category'],['manufacturer','Manufacturer'],
              ['unitPrice','Unit Price (₹)'],['quantityInStock','Stock Qty'],['minStockLevel','Min Stock'],['expiryDate','Expiry Date']
            ].map(([k,label])=>(
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={k==='expiryDate'?'date':k.includes('Price')||k.includes('Stock')||k.includes('Level')?'number':'text'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[k]} onChange={e=>set(k,e.target.value)} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>createMut.mutate(form)} disabled={!form.name||createMut.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {createMut.isPending?'Saving...':'Add Medicine'}
            </button>
            <button onClick={()=>setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name','Generic','Category','Stock','Min Stock','Price','Expiry','Status'].map(h=><th key={h} className="px-3 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {medicines.length===0
              ? <tr><td colSpan={8} className="text-center py-10 text-gray-400">No medicines</td></tr>
              : medicines.map(m=>(
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 font-medium">{m.name}</td>
                <td className="px-3 py-3 text-gray-600">{m.genericName||'—'}</td>
                <td className="px-3 py-3 text-gray-600">{m.category||'—'}</td>
                <td className="px-3 py-3 font-semibold">{m.quantityInStock||0}</td>
                <td className="px-3 py-3 text-gray-500">{m.minStockLevel||0}</td>
                <td className="px-3 py-3 text-blue-600">₹{m.unitPrice||0}</td>
                <td className="px-3 py-3 text-gray-500 text-xs">{m.expiryDate||'—'}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${(m.quantityInStock||0)<=(m.minStockLevel||0)?'bg-red-100 text-red-600':'bg-green-100 text-green-700'}`}>
                    {(m.quantityInStock||0)<=(m.minStockLevel||0)?'Low Stock':'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
