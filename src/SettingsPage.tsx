import React, { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle, ShieldCheck, Database, RefreshCw, CheckCircle2, FileText, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

// Two-tier download: native OS dialog (Chrome 86+) → blob anchor fallback
async function saveExcelBlob(blob: Blob, filename: string): Promise<void> {
  if (typeof (window as any).showSaveFilePicker === 'function') {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'Excel Workbook', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
      });
      const w = await handle.createWritable();
      await w.write(blob); await w.close();
      return;
    } catch (err: any) { if (err?.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 30000);
}

// Blob-only fallback for non-Excel files (JSON)
function saveAnyBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 30000);
}

const PRIMARY = '#032e60';

export default function SettingsPage() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Original JSON Backup implementation ("Old Setting")
  const handleBackupJSON = () => {
    try {
      const backupData: Record<string, any> = {};
      const keysToBackup = ['airnet_records', 'airnet_doc_management', 'airnet_services', 'airnet_banking'];
      
      let hasData = false;
      keysToBackup.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) {
          backupData[key] = val;
          hasData = true;
        }
      });

      if (!hasData) {
        showToast('No data to backup yet!', 'error');
        return;
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const dateStr = new Date().toISOString().split('T')[0];
      saveAnyBlob(blob, `Airnet_Backup_${dateStr}.json`);
      
      showToast('JSON backup file generated successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to create JSON backup', 'error');
    }
  };

  // Excel single workbook backup implementation
  const handleBackupExcel = async () => {
    try {
      const wb = XLSX.utils.book_new();
      let hasData = false;

      const keysToBackup = ['airnet_records', 'airnet_doc_management', 'airnet_services', 'airnet_banking'];
      
      keysToBackup.forEach(key => {
        const rawValue = localStorage.getItem(key);
        if (rawValue) {
          try {
            const parsed = JSON.parse(rawValue);
            const sheetName = key.replace('airnet_', '').substring(0, 30); // Excel sheet name limit is 31 chars
            const dataArray = Array.isArray(parsed) ? parsed : [parsed];
            const ws = XLSX.utils.json_to_sheet(dataArray);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            hasData = true;
          } catch (err) {
            console.error(`Failed to export key ${key} to Excel`, err);
          }
        }
      });

      if (!hasData) {
        showToast('No data to backup yet!', 'error');
        return;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `Airnet_Backup_${dateStr}.xlsx`;
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      await saveExcelBlob(blob, filename);

      showToast('Excel workbook backup file generated successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to create Excel backup', 'error');
    }
  };

  const handleRestoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Combined smart Restore handler supporting both JSON and Excel backups
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (window.confirm('WARNING: Restoring will overwrite your current data. Are you sure you want to proceed?')) {
          if (isExcel) {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            if (workbook.SheetNames.length === 0) {
              throw new Error('Invalid or empty backup Excel file');
            }

            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              const originalKey = `airnet_${sheetName}`;
              
              // Save parsed worksheet back to local storage
              localStorage.setItem(originalKey, JSON.stringify(jsonData));
            });
            
            showToast('Data restored successfully from Excel! Reloading...', 'success');
          } else {
            const text = event.target?.result as string;
            const backupData = JSON.parse(text);
            let restoredAny = false;

            Object.keys(backupData).forEach(key => {
              if (key.startsWith('airnet_')) {
                let val = backupData[key];
                if (typeof val !== 'string') {
                  val = JSON.stringify(val);
                }
                localStorage.setItem(key, val);
                restoredAny = true;
              }
            });

            if (!restoredAny) {
              throw new Error('Invalid or empty JSON backup file');
            }

            showToast('Data restored successfully from JSON! Reloading...', 'success');
          }

          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        showToast(isExcel ? 'Invalid backup Excel file format' : 'Invalid backup JSON file format', 'error');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('CRITICAL WARNING: This will permanently delete ALL data, records, services, and banking configurations. This action cannot be undone. Are you absolutely sure?')) {
      if (window.confirm('Final confirmation: Type OK to proceed or click Cancel.') === true) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('airnet_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        showToast('All data erased successfully. Reloading...', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database size={32} className="text-[#032e60]" />
          </div>
          <h1 className="text-[32px] font-bold tracking-tight mb-2" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Data Backup & Restore</h1>
          <p className="text-gray-600">Safeguard your records, configurations, and application data using standard files.</p>
        </div>

        <div className="space-y-6">
          {/* JSON Backup (Old Setting) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={20} className="text-blue-600" />
                <h3 className="font-bold text-[18px]">Create JSON Backup (Standard)</h3>
              </div>
              <p className="text-gray-600 text-[14px]">
                Download all your application data as a single `.json` file. This is the original, extremely fast and reliable backup format.
              </p>
            </div>
            <button onClick={handleBackupJSON} className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 w-full md:w-auto justify-center">
              <Download size={18} /> Download JSON
            </button>
          </div>

          {/* Excel Backup */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet size={20} className="text-green-600" />
                <h3 className="font-bold text-[18px]">Create Excel Backup</h3>
              </div>
              <p className="text-gray-600 text-[14px]">
                Download a clean Excel workbook (`.xlsx`) containing separate tabs for your customer records, banking setups, and service configurations.
              </p>
            </div>
            <button onClick={handleBackupExcel} className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 w-full md:w-auto justify-center" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}>
              <Download size={18} /> Download Excel
            </button>
          </div>

          {/* Restore Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={20} className="text-[#032e60]" />
                <h3 className="font-bold text-[18px]">Restore Data</h3>
              </div>
              <p className="text-gray-600 text-[14px]">
                Upload any previously downloaded `.json` or `.xlsx` file to restore your databases. <strong className="text-red-500">Warning:</strong> This will overwrite current data.
              </p>
            </div>
            <button onClick={handleRestoreClick} className="px-6 py-3 rounded-xl font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
              <Upload size={18} /> Upload Backup
            </button>
            <input type="file" accept=".xlsx,.xls,.json" className="hidden" ref={fileInputRef} onChange={handleRestore} />
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-red-700">
                <AlertTriangle size={20} />
                <h3 className="font-bold text-[18px]">Factory Reset</h3>
              </div>
              <p className="text-red-600/80 text-[14px]">
                Permanently erase all data stored in this browser. This cannot be undone unless you have a backup file.
              </p>
            </div>
            <button onClick={handleFactoryReset} className="px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
              <AlertTriangle size={18} /> Erase All Data
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className={`px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-[14px] font-medium text-white ${toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertTriangle size={18} className="text-white" />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

