import sys
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('  return (\n    <div className="min-h-screen bg-gradient-to-b from-slate-50')
end_idx = content.find('    </div>\n  );\n}\n', start_idx)
if end_idx != -1:
    end_idx += len('    </div>\n  );\n}\n')

if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
    print('Could not find target content')
    sys.exit(1)

new_jsx = """  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Refined Ambient Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[50%] rounded-full bg-indigo-200/20 blur-[140px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[60%] rounded-full bg-blue-200/20 blur-[150px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-200/10 blur-[120px] pointer-events-none mix-blend-multiply" />

      {/* Top Banner Navigation - SaaS Glassmorphic Style */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40 py-5 print:hidden transition-all duration-300 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/banking')} 
              className="px-4 py-2.5 bg-white/50 hover:bg-white rounded-2xl text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2.5 font-semibold text-[13.5px] border border-slate-200/60 hover:shadow-sm"
            >
              <LucideIcons.ArrowLeft size={16} />
              Back
            </button>
            <div className="h-8 w-[1.5px] bg-slate-200/80 rounded-full"></div>
            <div>
              <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
                Passbook Generator 
                <span className="text-[10px] font-bold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase shadow-sm">IndusInd CSP</span>
              </h1>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Configure, preview, and print high-resolution customer passbooks.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 text-emerald-600 text-[12px] font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Print Ready System
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SECTION: Input Form & Constants (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col print:hidden">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden relative rounded-[32px]">
              
              <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
                <div>
                  {/* Card Section Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100/80">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 border border-indigo-100/50 shadow-inner">
                        <FileText size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="text-[19px] font-bold text-slate-800 tracking-tight">Customer Details</h2>
                        <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">Enter information for passbook generation</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Photo Upload Section */}
                  <div className="flex justify-center mb-10">
                    <div 
                      className="flex flex-col items-center justify-center p-6 rounded-[28px] border-[1.5px] border-dashed border-slate-300/80 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 transition-all duration-300 group cursor-pointer w-full max-w-[280px]" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      
                      <div className="w-[100px] h-[130px] rounded-2xl shadow-md overflow-hidden relative bg-white border border-slate-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                        {profileImage ? (
                          <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-300 p-2">
                            <User size={36} strokeWidth={1.5} className="mb-2" />
                            <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Passport</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                          <LucideIcons.Camera size={24} strokeWidth={1.5} className="mb-1.5" />
                          <span className="text-[10px] font-semibold tracking-wider uppercase">{profileImage ? "Change" : "Upload"}</span>
                        </div>
                      </div>
                      <span className="text-[12.5px] font-medium text-slate-500 mt-5 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <LucideIcons.Upload size={14} strokeWidth={2} /> 
                        {profileImage ? "Update Photo" : "Upload Passport Photo"}
                      </span>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="flex flex-col gap-6">
                    {/* Full Name */}
                    <div className="group/field">
                      <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                        Customer Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-medium placeholder:text-slate-400 shadow-sm" 
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Guardian Name */}
                    <div className="group/field">
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 group-focus-within/field:text-indigo-600 transition-colors">
                          {guardianType} <span className="text-rose-500">*</span>
                        </label>
                        
                        <div className="flex bg-slate-100/80 p-0.5 rounded-[10px] border border-slate-200/50">
                          <button 
                            onClick={() => setGuardianType('Father Name')} 
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${guardianType === 'Father Name' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            FATHER
                          </button>
                          <button 
                            onClick={() => setGuardianType('Husband Name')} 
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${guardianType === 'Husband Name' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            HUSBAND
                          </button>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={fatherName} 
                        onChange={(e) => setFatherName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-medium placeholder:text-slate-400 shadow-sm" 
                        placeholder={guardianType === 'Father Name' ? "Enter father's name" : "Enter husband's name"}
                      />
                    </div>

                    {/* DOB & Mobile Row */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="group/field">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          value={dob} 
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-medium shadow-sm cursor-pointer" 
                        />
                      </div>
                      <div className="group/field">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          value={mobileNo} 
                          maxLength={10}
                          onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-mono placeholder:text-slate-400 shadow-sm" 
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>

                    {/* Account & ID Row */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="group/field">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                          Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={accountNo} 
                          onChange={(e) => setAccountNo(e.target.value.replace(/\s/g, ''))}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-mono font-medium placeholder:text-slate-400 shadow-sm" 
                          placeholder="12-digit account"
                        />
                      </div>
                      <div className="group/field">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                          Aadhaar ID <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={idNo} 
                          maxLength={14}
                          onChange={(e) => setIdNo(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-mono placeholder:text-slate-400 shadow-sm" 
                          placeholder="12-digit ID"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="group/field">
                      <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                        Residential Address <span className="text-rose-500">*</span>
                      </label>
                      <textarea 
                        value={address} 
                        rows={2}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-medium resize-none placeholder:text-slate-400 shadow-sm" 
                        placeholder="Enter complete residential address"
                      />
                    </div>
                  </div>

                </div>

                {/* Dark Premium Constants Widget */}
                <div className="mt-10 bg-[#0A0F1C] p-6 rounded-[24px] border border-slate-800 relative overflow-hidden shadow-2xl shadow-indigo-900/10 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Branch Constants
                    </div>
                    <LucideIcons.ShieldCheck size={16} className="text-indigo-400/50" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <div className="bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3.5 rounded-[16px] border border-white/5 flex flex-col justify-center">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">IFSC Code</div>
                      <div className="text-[12px] font-bold text-slate-200 font-mono">INDB0000058</div>
                    </div>
                    <div className="bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3.5 rounded-[16px] border border-white/5 flex flex-col justify-center">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">MICR Code</div>
                      <div className="text-[12px] font-bold text-slate-200 font-mono">580234002</div>
                    </div>
                    <div className="bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3.5 rounded-[16px] border border-white/5 flex flex-col justify-center">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Branch</div>
                      <div className="text-[12px] font-bold text-slate-200">Hubli</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Previews & A4 Placement (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Live Static Preview Card */}
            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] flex flex-col items-center print:hidden rounded-[32px] relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-100/80 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 border border-indigo-100/50 shadow-inner">
                    <LucideIcons.Eye size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[19px] font-bold text-slate-800" style={{ color: PRIMARY }}>Passbook Preview</h2>
                    <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">Real-time design validation</p>
                  </div>
                </div>
                
                {/* Refined Zoom controls */}
                <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <button 
                    onClick={() => setZoom(Math.max(0.6, zoom - 0.1))} 
                    className="w-8 h-8 rounded-[10px] bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
                    title="Zoom Out"
                  >
                    <LucideIcons.Minus size={14} strokeWidth={2} />
                  </button>
                  <span className="text-[12px] font-semibold text-slate-600 px-3 min-w-[56px] text-center font-mono">{(zoom * 100).toFixed(0)}%</span>
                  <button 
                    onClick={() => setZoom(Math.min(2.0, zoom + 0.1))} 
                    className="w-8 h-8 rounded-[10px] bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
                    title="Zoom In"
                  >
                    <LucideIcons.Plus size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
              
              {/* Premium Grid Preview Container */}
              <div className="flex justify-center items-center py-12 w-full bg-[#F8FAFC] rounded-[24px] border border-slate-200/60 overflow-hidden relative shadow-inner" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
                  {PassbookCard({ id: 'preview-card', isDraggable: false, scale: zoom })}
                </div>
              </div>
            </div>

            {/* A4 Sheet Placement Sandbox Card */}
            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] flex flex-col items-center rounded-[32px] relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-100/80 pb-6 mb-8 print:hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 border border-emerald-100/50 shadow-inner">
                    <LucideIcons.Layout size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[19px] font-bold text-slate-800" style={{ color: PRIMARY }}>Print Positioning</h2>
                    <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">Drag to place the card exactly where needed on A4</p>
                  </div>
                </div>
              </div>
              
              {/* Modern Sandbox Area */}
              <div className="w-full flex justify-center bg-slate-50/50 rounded-[24px] border-2 border-slate-200/80 overflow-hidden relative shadow-inner" style={{ height: '380px', backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                
                {/* Modern Indicator */}
                <div className="absolute top-4 left-4 text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-2 print:hidden select-none bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <LucideIcons.Scaling size={14} className="text-indigo-500" /> A4 CANVAS (210 × 297mm)
                </div>

                {/* A4 Scaled Page Container */}
                <div 
                  ref={a4ContainerRef}
                  id="a4-print-sheet"
                  className="bg-white absolute shadow-[0_20px_60px_rgba(0,0,0,0.05)] print:shadow-none transition-shadow border border-slate-200"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    left: '50%',
                    top: '20px',
                    transform: 'translateX(-50%) scale(0.31)',
                    transformOrigin: 'top center',
                    backgroundImage: 'linear-gradient(#F1F5F9 1px, transparent 1px), linear-gradient(90deg, #F1F5F9 1px, transparent 1px)',
                    backgroundSize: '10mm 10mm'
                  }}
                >
                  {PassbookCard({ id: 'printable-passbook-card', isDraggable: true, constraintsRef: a4ContainerRef })}
                </div>
              </div>
              
              {/* Refined Form Actions */}
              <div className="w-full grid grid-cols-2 gap-5 mt-8 print:hidden">
                <button
                  onClick={handleReset}
                  className="py-4 px-6 rounded-2xl border-[1.5px] border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-sm hover:shadow"
                >
                  <XCircle size={18} strokeWidth={2} /> Clear Details
                </button>
                <button
                  onClick={triggerPrint}
                  className="py-4 px-6 rounded-2xl text-white font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
                  style={{ background: f'linear-gradient(135deg, {PRIMARY} 0%, #021a35 100%)' }}
                >
                  <Printer size={18} strokeWidth={2} /> Generate Print
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* High-fidelity CSS Print Overrides */}
      <style>{`
        @media print {
          /* Enforce exactly one page with absolutely no vertical overflow */
          html, body {
            height: 100% !important;
            overflow: hidden !important;
            background: white !important;
          }
          /* Hide all print-hidden elements */
          nav, footer, .print\\\\:hidden {
            display: none !important;
          }
          /* Strip all layout spacing and styles from the remaining parents of #a4-print-sheet */
          .min-h-screen, 
          main, 
          div[className*="max-w-"], 
          div[className*="grid-cols-"], 
          div[className*="lg:col-span-7"],
          .card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
            width: auto !important;
          }
          /* Strip wrapper div styles */
          div[style*="height: 380px"],
          div[style*="height:380px"] {
            border: none !important;
            background: transparent !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Force #a4-print-sheet to be exactly A4 and centered */
          #a4-print-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 296mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
            background: white !important;
            background-image: none !important;
            z-index: 9999999 !important;
            overflow: hidden !important;
          }
          /* Hide drag proxy completely */
          #drag-proxy {
            display: none !important;
          }
          /* Eliminate all browser margins and force exact A4 printing */
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}
"""

# Re-evaluate the f-string style inline for {PRIMARY} since we need to format it in Python if we want to replace it. 
# Wait, actually in JSX it's a template literal: `{`linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)`}`
new_jsx = new_jsx.replace("f'linear-gradient(135deg, {PRIMARY} 0%, #021a35 100%)'", "`linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)`")


content = content[:start_idx] + new_jsx + content[end_idx:]

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully replaced PassbookPage return block!')
