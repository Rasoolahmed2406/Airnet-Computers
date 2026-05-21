import React, { useState, useRef, useEffect } from 'react';
import { read, utils } from 'xlsx';
import { 
  Upload, Search, FileSpreadsheet, CheckCircle2, 
  X, MessageCircle, AlertCircle, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Edit2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIMARY = '#032e60';
const ACCENT = '#eff6ff';

interface DocumentRecord {
  id: string;
  customerName: string;
  mobileNumber: string;
  service: string;
  documentReceived: boolean;
  whatsappSent: 'Sent ✅' | 'Pending ⏳';
  rawStatus?: string;
}

export default function DocumentManagementPage() {
  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DocumentRecord; direction: 'asc' | 'desc' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean, record: DocumentRecord | null }>({ show: false, record: null });
  const [editingRecord, setEditingRecord] = useState<DocumentRecord | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('airnet_doc_management');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecords = (newRecords: DocumentRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('airnet_doc_management', JSON.stringify(newRecords));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet);

        const newRecords: DocumentRecord[] = jsonData.map((row: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          customerName: row['Customer Name'] || row['Name'] || '',
          mobileNumber: row['Mobile Number'] || row['Contact'] || row['Phone'] || '',
          service: row['Service'] || '',
          documentReceived: (row['Status (Document Received)'] || row['Status'] || row['Received'] || '').toString().toLowerCase().includes('yes'),
          whatsappSent: 'Pending ⏳' as const,
          rawStatus: row['Status (Document Received)'] || row['Status'] || ''
        })).filter(r => r.customerName && r.mobileNumber); // require basic fields

        if (newRecords.length === 0) {
          showToast('No valid records found. Ensure columns match: Customer Name, Mobile Number, Service', 'error');
          return;
        }

        saveRecords([...records, ...newRecords]);
        showToast(`Successfully imported ${newRecords.length} records`, 'success');
      } catch (err) {
        showToast('Error reading Excel file', 'error');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearAll = () => {
    saveRecords([]);
    setShowClearConfirm(false);
    showToast('All imported records cleared successfully', 'success');
  };

  const handleStatusChange = (record: DocumentRecord, checked: boolean) => {
    if (checked && record.whatsappSent === 'Pending ⏳') {
      setShowConfirmModal({ show: true, record });
    } else {
      const updated = records.map(r => r.id === record.id ? { ...r, documentReceived: checked } : r);
      saveRecords(updated);
    }
  };

  const generateWhatsAppLink = (record: DocumentRecord) => {
    let phone = record.mobileNumber.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;
    
    const message = `Dear ${record.customerName},

Your application for "${record.service}" has been completed successfully.

Please collect your document from our office.

Thank you.

Best Regards,
AIRNET COMPUTERS
Basavakalyan`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const sendWhatsApp = () => {
    const record = showConfirmModal.record;
    if (!record) return;

    let phone = record.mobileNumber.replace(/\D/g, '');
    if (phone.length < 10) {
      showToast('Invalid mobile number', 'error');
      setShowConfirmModal({ show: false, record: null });
      return;
    }

    // Update status locally
    const updated = records.map(r => 
      r.id === record.id ? { ...r, documentReceived: true, whatsappSent: 'Sent ✅' as const } : r
    );
    saveRecords(updated);
    
    // Open WA link
    window.open(generateWhatsAppLink(record), '_blank');
    
    showToast('WhatsApp message triggered', 'success');
    setShowConfirmModal({ show: false, record: null });
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      const updated = records.map(r => r.id === editingRecord.id ? editingRecord : r);
      saveRecords(updated);
      setEditingRecord(null);
      showToast('Record updated successfully', 'success');
    }
  };

  // Sorting
  const requestSort = (key: keyof DocumentRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtering & Sorting
  let processedRecords = [...records];
  
  if (filterStatus !== 'All') {
    if (filterStatus === 'Received') processedRecords = processedRecords.filter(r => r.documentReceived);
    if (filterStatus === 'Pending') processedRecords = processedRecords.filter(r => !r.documentReceived);
    if (filterStatus === 'WA Sent') processedRecords = processedRecords.filter(r => r.whatsappSent === 'Sent ✅');
  }

  if (search) {
    const s = search.toLowerCase();
    processedRecords = processedRecords.filter(r => 
      r.customerName.toLowerCase().includes(s) || 
      r.mobileNumber.includes(s) ||
      r.service.toLowerCase().includes(s)
    );
  }

  if (sortConfig) {
    processedRecords.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(processedRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = processedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight mb-2" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Document Management</h1>
            <p className="text-gray-600">Automate WhatsApp notifications on document arrival</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowClearConfirm(true)} className="px-4 py-2.5 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1.5 text-[14px] transition-colors">
              <Trash2 size={16} /> Clear List
            </button>
            <label className="btn-primary px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 text-[14px] cursor-pointer">
              <Upload size={16} /> Import Excel
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <div className="card p-4 lg:col-span-3">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search customer, mobile, or service..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] transition-all" />
            </div>
          </div>
          <div className="card p-4 flex gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 text-[14px] bg-white">
              <option value="All">All Status</option>
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="WA Sent">WA Sent</option>
            </select>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => requestSort('customerName')}>
                    <div className="flex items-center gap-1">Customer Name <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => requestSort('mobileNumber')}>
                    <div className="flex items-center gap-1">Mobile <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => requestSort('service')}>
                    <div className="flex items-center gap-1">Service <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase">
                    Status (Doc Received)
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => requestSort('whatsappSent')}>
                    <div className="flex items-center gap-1">WhatsApp Sent <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-700 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{record.customerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 font-mono text-[13px]">{record.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 text-[14px]">{record.service}</div>
                    </td>
                    <td className="px-6 py-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#032e60] focus:ring-[#032e60]"
                          checked={record.documentReceived}
                          onChange={(e) => handleStatusChange(record, e.target.checked)}
                        />
                        <span className={`text-[13px] font-bold px-2 py-1 rounded-full ${record.documentReceived ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {record.documentReceived ? 'YES' : 'NO'}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[13px] font-bold px-2 py-1 rounded-full ${record.whatsappSent.includes('Sent') ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {record.whatsappSent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditingRecord(record)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors inline-flex">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileSpreadsheet size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No records found</p>
                      <p className="text-[13px] text-gray-400 mt-1">Import an Excel file to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-[13px] text-gray-500">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, processedRecords.length)} of {processedRecords.length}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal.show && showConfirmModal.record && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <MessageCircle size={24} className="text-green-600" />
                </div>
                <h3 className="text-[20px] font-bold mb-2">Send WhatsApp notification?</h3>
                <p className="text-gray-600 text-[14px] mb-4">
                  Send completion message to <strong className="text-gray-900">{showConfirmModal.record.customerName}</strong> for <strong className="text-gray-900">{showConfirmModal.record.service}</strong>?
                </p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-[13px] text-gray-600 whitespace-pre-wrap font-mono">
                  {`Dear ${showConfirmModal.record.customerName},\n\nYour application for "${showConfirmModal.record.service}" has been completed successfully.\n\nPlease collect your document from our office.\n\nThank you.\n\nBest Regards,\nAIRNET COMPUTERS\nBasavakalyan`}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal({ show: false, record: null })} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={sendWhatsApp} className="flex-1 py-2.5 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={16} /> Send WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[20px] font-bold">Edit Record</h3>
                  <button onClick={() => setEditingRecord(null)} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"><X size={16} /></button>
                </div>
                <form onSubmit={saveEdit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Customer Name</label>
                    <input type="text" required value={editingRecord.customerName} onChange={e => setEditingRecord({...editingRecord, customerName: e.target.value})} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Mobile Number</label>
                    <input type="text" required value={editingRecord.mobileNumber} onChange={e => setEditingRecord({...editingRecord, mobileNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Service</label>
                    <input type="text" required value={editingRecord.service} onChange={e => setEditingRecord({...editingRecord, service: e.target.value})} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 transition-all" />
                  </div>
                  <button type="submit" className="w-full btn-primary py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 mt-2">
                    <Save size={16} /> Save Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-[20px] font-bold mb-2">Clear All Records?</h3>
              <p className="text-gray-600 text-[14px] mb-6">
                This will permanently delete all document management records. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                  No, Cancel
                </button>
                <button onClick={handleClearAll} className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className={`px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-[14px] font-medium text-white ${toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertCircle size={18} className="text-white" />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
