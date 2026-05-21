import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Grid3x3, Landmark, FileText, Menu, X, ExternalLink,
  Phone, Mail, MapPin, MessageCircle, Edit2, Trash2, Plus,
  GripVertical, Search, Download, Check, CheckCircle2, XCircle, AlertCircle,
  User, CreditCard, Hash, Calendar, MapPinIcon, Printer, Settings
} from 'lucide-react';

const Instagram = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as XLSX from 'xlsx';

// ---------------------------------------------------------------------------
// saveExcelBlob — guaranteed cross-browser Excel download
//
// Strategy 1 (Chrome 86+ / Edge 86+):
//   Use File System Access API (showSaveFilePicker). This opens the native OS
//   "Save As" dialog. The user picks the location; Chrome writes the file
//   directly — no blob URL, no UUID, 100% correct filename every time.
//
// Strategy 2 (Firefox, Safari, older Chrome):
//   Classic hidden-anchor + .click() fallback. We use .click() (not
//   dispatchEvent) so the event is trusted and the `download` attribute
//   is always honoured.
// ---------------------------------------------------------------------------
async function saveExcelBlob(blob: Blob, filename: string): Promise<void> {
  // ── Strategy 1: File System Access API ──────────────────────────────────
  if (typeof (window as any).showSaveFilePicker === 'function') {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Excel Workbook',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return; // ✅ done — file saved via native dialog
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // user cancelled — nothing to do
      // Any other error: fall through to Strategy 2
    }
  }

  // ── Strategy 2: hidden anchor + .click() ─────────────────────────────────
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click(); // trusted synthetic click — download attribute is honoured
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 30000);
}
import * as LucideIcons from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import DocumentManagementPage from './DocumentManagementPage';
import SettingsPage from './SettingsPage';
import SplashScreen from './SplashScreen';
import {
  fetchDbRecords,
  insertDbRecord,
  updateDbRecord,
  deleteDbRecord,
  clearAllDbRecords,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  getSupabaseSource,
  fetchDbServices,
  insertDbService,
  updateDbService,
  deleteDbService,
  updateDbServicePositions,
  Service
} from './lib/supabase';

const ServiceIcon = ({ 
  iconName, 
  name = '', 
  url = '',
  size = 28, 
  className = '' 
}: { 
  iconName: string; 
  name?: string; 
  url?: string;
  size?: number; 
  className?: string; 
}) => {
  const normalizedName = (name || '').toLowerCase();

  // 1. Aadhaar Card (reverted to previous Fingerprint icon)
  if (normalizedName.includes('aadhaar')) {
    const Icon = LucideIcons.Fingerprint;
    return <Icon size={size} className={className} />;
  }

  // 2. PAN Card (NSDL / UTI) - Blue & Black only
  if (normalizedName.includes('pan')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#pan-bg)" />
        <rect x="4" y="12" width="40" height="24" rx="4" fill="url(#pan-card)" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="8" y="20" width="8" height="6" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
        <line x1="12" y1="20" x2="12" y2="26" stroke="#475569" strokeWidth="0.5" />
        <line x1="8" y1="23" x2="16" y2="23" stroke="#475569" strokeWidth="0.5" />
        <rect x="30" y="16" width="10" height="12" rx="1" fill="#cbd5e1" stroke="#ffffff" strokeWidth="0.75" />
        <circle cx="35" cy="20" r="2.5" fill="#475569" />
        <path d="M31 28C31 25.5 33 24 35 24C37 24 39 25.5 39 28" fill="#475569" />
        <line x1="8" y1="30" x2="26" y2="30" stroke="#f1f5f9" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="22" y2="16" stroke="#93c5fd" strokeWidth="1" />
        <line x1="8" y1="33" x2="26" y2="33" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        <defs>
          <linearGradient id="pan-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="pan-card" x1="4" y1="12" x2="44" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 3. Passport - Blue & Black only
  if (normalizedName.includes('passport')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#passport-bg)" />
        <rect x="10" y="8" width="28" height="32" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="24" cy="22" r="7" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="24" cy="22" r="5" fill="none" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="24" y1="17" x2="24" y2="27" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="19" y1="22" x2="29" y2="22" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="16" y="12" width="16" height="2" rx="0.5" fill="#cbd5e1" />
        <rect x="18" y="32" width="12" height="2" rx="0.5" fill="#cbd5e1" />
        <defs>
          <linearGradient id="passport-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 4. Voter ID - Blue & Black only
  if (normalizedName.includes('voter')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#voter-bg)" />
        <rect x="6" y="10" width="36" height="28" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M6 10H42V18H6V10Z" fill="#1e3a8a" opacity="0.8" />
        <path d="M6 30H42V38H6V30Z" fill="#0f172a" opacity="0.8" />
        <circle cx="24" cy="24" r="3.5" stroke="#3b82f6" strokeWidth="1" />
        <circle cx="24" cy="24" r="0.75" fill="#3b82f6" />
        <rect x="10" y="13" width="10" height="2" fill="#ffffff" />
        <rect x="10" y="33" width="12" height="2" fill="#ffffff" />
        <circle cx="34" cy="24" r="5" fill="#2563eb" />
        <path d="M32 24L33.5 25.5L36.5 22.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="voter-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 5. Ration Card - Blue & Black Wheat Grain Icon
  if (normalizedName.includes('ration')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#ration-new-bg)" />
        <path d="M24 10V38" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Left branches (wheat kernels) */}
        <path d="M24 16C21 16 19 18 19 21C19 23 21 24 24 24" fill="#1e3a8a" opacity="0.85" />
        <path d="M24 22C21 22 19 24 19 27C19 29 21 30 24 30" fill="#0f172a" />
        <path d="M24 28C21 28 19 30 19 33C19 35 21 36 24 36" fill="#1e3a8a" opacity="0.85" />

        {/* Right branches (wheat kernels) */}
        <path d="M24 16C27 16 29 18 29 21C29 23 27 24 24 24" fill="#1e3a8a" opacity="0.85" />
        <path d="M24 22C27 22 29 24 29 27C29 29 27 30 24 30" fill="#0f172a" />
        <path d="M24 28C27 28 29 30 29 33C29 35 27 36 24 36" fill="#1e3a8a" opacity="0.85" />

        <defs>
          <linearGradient id="ration-new-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 6. Nadakacheri - Blue & Black only
  if (normalizedName.includes('nadakacheri')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#nadaka-bg)" />
        <path d="M12 10H36V26C36 32 30 38 24 40C18 38 12 32 12 26V10Z" fill="url(#nadaka-shield)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="5" fill="#cbd5e1" />
        <circle cx="24" cy="20" r="3" fill="#94a3b8" />
        <line x1="24" y1="20" x2="24" y2="32" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M18 30H30" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="15" r="1.5" fill="#ffffff" />
        <circle cx="31" cy="15" r="1.5" fill="#ffffff" />
        <defs>
          <linearGradient id="nadaka-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="nadaka-shield" x1="12" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 7. Birth/Death (eJanma) - Blue & Black only
  if (normalizedName.includes('birth') || normalizedName.includes('death') || normalizedName.includes('ejanma')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#birth-bg)" />
        <path d="M14 12C14 10 16 8 20 8H36C36 8 36 10 34 12V34C34 36 32 38 28 38H12C12 38 12 36 14 34V12Z" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M10 34C10 32 12 30 16 30H30V38H16C12 38 10 36 10 34Z" fill="#e2e8f0" stroke="#1e3a8a" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="30" y2="14" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="19" x2="28" y2="19" stroke="#0f172a" strokeWidth="1" />
        <line x1="18" y1="23" x2="26" y2="23" stroke="#0f172a" strokeWidth="1" />
        <circle cx="28" cy="28" r="4.5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
        <path d="M26.5 32L26 36L28 35L30 36L29.5 32" stroke="#1e3a8a" strokeWidth="1" fill="#3b82f6" />
        <defs>
          <linearGradient id="birth-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 8. Udyam Registration - Blue & Black only
  if (normalizedName.includes('udyam') || normalizedName.includes('factory')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#udyam-bg)" />
        <rect x="8" y="24" width="32" height="14" rx="2" fill="url(#udyam-grad)" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M12 24V16L18 20V16L24 20V16L30 20V24" stroke="#1e3a8a" strokeWidth="1.5" strokeLinejoin="round" fill="#1e3a8a" />
        <rect x="12" y="28" width="4" height="6" fill="#cbd5e1" />
        <rect x="20" y="28" width="4" height="6" fill="#cbd5e1" />
        <rect x="28" y="28" width="4" height="6" fill="#cbd5e1" />
        <line x1="36" y1="14" x2="36" y2="24" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 14C34 11 38 11 38 14" stroke="#0f172a" strokeWidth="1.5" />
        <defs>
          <linearGradient id="udyam-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="udyam-grad" x1="8" y1="16" x2="40" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 9. Ayushman Bharat - Blue & Black only
  if (normalizedName.includes('ayushman') || normalizedName.includes('health') || normalizedName.includes('heart')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#ayush-bg)" />
        <path d="M24 38C24 38 36 29 36 19C36 13.5 31.5 9 26 9C23.2 9 24.8 11.5 24 13.5C23.2 11.5 24.8 9 22 9C16.5 9 12 13.5 12 19C12 29 24 38 24 38Z" fill="url(#ayush-heart)" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M24 13.5C24 13.5 21 16 21 21C21 26 24 29 24 29" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 13.5C24 13.5 27 16 27 21C27 26 24 29 24 29" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 17V25M20 21H28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="ayush-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="ayush-heart" x1="12" y1="9" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 10. eShram Card - Blue & Black only
  if (normalizedName.includes('shram') || normalizedName.includes('hardhat')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#shram-bg)" />
        <circle cx="24" cy="24" r="14" stroke="#0f172a" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M14 26C14 18 18 15 24 15C30 15 34 18 34 26H14Z" fill="#3b82f6" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M12 26H36V28H12V26Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="22" y="14" width="4" height="12" rx="1" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
        <rect x="23" y="8" width="2" height="4" fill="#0f172a" />
        <rect x="23" y="36" width="2" height="4" fill="#0f172a" />
        <rect x="8" y="23" width="4" height="2" fill="#0f172a" />
        <rect x="36" y="23" width="4" height="2" fill="#0f172a" />
        <defs>
          <linearGradient id="shram-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 11. UDID Card - Blue & Black only
  if (normalizedName.includes('udid') || normalizedName.includes('accessibility')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#udid-bg)" />
        <circle cx="26" cy="15" r="3.5" fill="#2563eb" />
        <path d="M25 22.5H20.5V28H26" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M22 28.5C22 31.5 19.5 34 16.5 34C13.5 34 11 31.5 11 28.5C11 25.5 13.5 23 16.5 23" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M22 18.5L25 22.5L29 20" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="6" y="8" width="36" height="32" rx="4" stroke="#3b82f6" strokeWidth="1.5" />
        <defs>
          <linearGradient id="udid-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 12. Karnataka Education / SSP - Blue & Black only
  if (normalizedName.includes('education') || normalizedName.includes('ssp') || normalizedName.includes('academic') || normalizedName.includes('graduation')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#edu-bg)" />
        <path d="M24 10L38 17L24 24L10 17L24 10Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <path d="M16 21V28C16 31 19 33 24 33C29 33 32 31 32 28V21" fill="#1e3a8a" stroke="#475569" strokeWidth="1.5" />
        <path d="M32 18V24L34 26" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="32" width="20" height="4" rx="1" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
        <rect x="16" y="35" width="16" height="3" rx="1" fill="#0f172a" stroke="#1e3a8a" strokeWidth="1" />
        <defs>
          <linearGradient id="edu-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 13. KSRTC Pass - Blue & Black only
  if (normalizedName.includes('ksrtc') || normalizedName.includes('bus') || normalizedName.includes('transport')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#bus-bg)" />
        <rect x="10" y="12" width="28" height="24" rx="4" fill="url(#bus-body)" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="13" y="15" width="22" height="8" rx="1" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
        <line x1="24" y1="15" x2="24" y2="23" stroke="#0284c7" strokeWidth="1" />
        <circle cx="15" cy="30" r="2.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
        <circle cx="33" cy="30" r="2.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
        <rect x="20" y="29" width="8" height="3" rx="0.5" fill="#0f172a" />
        <rect x="12" y="36" width="6" height="4" rx="1.5" fill="#111827" />
        <rect x="30" y="36" width="6" height="4" rx="1.5" fill="#111827" />
        <defs>
          <linearGradient id="bus-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="bus-body" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 14. Bhoomi / RTC - Blue & Black only
  if (normalizedName.includes('bhoomi') || normalizedName.includes('rtc') || normalizedName.includes('map') || normalizedName.includes('land')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#bhoomi-bg)" />
        <rect x="8" y="10" width="32" height="28" rx="4" fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M8 24H40" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M22 10V38" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M8 17H22" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M22 31H40" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="15" cy="31" r="3.5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="0.75" />
        <circle cx="31" cy="17" r="3.5" fill="#0f172a" stroke="#1e3a8a" strokeWidth="0.75" />
        <defs>
          <linearGradient id="bhoomi-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 15. Parivahan (Driving License) - Blue & Black only
  if (normalizedName.includes('parivahan') || normalizedName.includes('car') || normalizedName.includes('license') || normalizedName.includes('steering')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#pari-bg)" />
        <circle cx="24" cy="24" r="12" stroke="#1d4ed8" strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="24" r="3" fill="#1d4ed8" />
        <line x1="24" y1="12" x2="24" y2="21" stroke="#1d4ed8" strokeWidth="2.5" />
        <line x1="12" y1="24" x2="21" y2="24" stroke="#1d4ed8" strokeWidth="2.5" />
        <line x1="36" y1="24" x2="27" y2="24" stroke="#1d4ed8" strokeWidth="2.5" />
        <path d="M21 32.5L24 27L27 32.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <defs>
          <linearGradient id="pari-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 16. Pahani (Land records scroll) - Blue & Black only
  if (normalizedName.includes('pahani') || normalizedName.includes('scroll') || normalizedName.includes('survey')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#pahani-bg)" />
        <path d="M10 18C10 14 13 14 16 14H32C35 14 38 14 38 18V32C38 36 35 36 32 36H16C13 36 10 36 10 32V18Z" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="1.5" />
        <ellipse cx="10" cy="25" rx="2" ry="7" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
        <ellipse cx="38" cy="25" rx="2" ry="7" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
        <line x1="15" y1="20" x2="33" y2="20" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="15" y1="25" x2="33" y2="25" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="15" y1="30" x2="28" y2="30" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 2" />
        <defs>
          <linearGradient id="pahani-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 17. Seva Sindhu - Blue & Black only
  if (normalizedName.includes('sindhu') || normalizedName.includes('seva') || normalizedName.includes('globe')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#sindhu-bg)" />
        <circle cx="24" cy="24" r="13" stroke="#0ea5e9" strokeWidth="1.5" />
        <ellipse cx="24" cy="24" rx="13" ry="5" stroke="#0ea5e9" strokeWidth="1.5" />
        <ellipse cx="24" cy="24" rx="5" ry="13" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="1.5" fill="#032e60" />
        <circle cx="15" cy="18" r="2.5" fill="#38bdf8" />
        <circle cx="33" cy="30" r="2.5" fill="#38bdf8" />
        <circle cx="30" cy="14" r="2" fill="#0284c7" />
        <circle cx="18" cy="34" r="2" fill="#0284c7" />
        <defs>
          <linearGradient id="sindhu-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
      </svg>
    );
  }



  // 23. Passbook Creator / Tool
  if (normalizedName.includes('passbook')) {
    return (
      <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#pb-bg)" />
        <rect x="10" y="12" width="28" height="24" rx="3" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="24" y1="12" x2="24" y2="36" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 1" />
        <line x1="14" y1="18" x2="20" y2="18" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="14" y1="23" x2="22" y2="23" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="28" y1="18" x2="34" y2="18" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="28" y1="23" x2="34" y2="23" stroke="#e2e8f0" strokeWidth="1" />
        <defs>
          <linearGradient id="pb-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>
      </svg>
    );
  }



  // Fallback to Lucide Icons
  let Icon = (LucideIcons as any)[iconName];
  
  if (!Icon) {
    if (normalizedName.includes('kea') || normalizedName.includes('nta')) Icon = LucideIcons.BookOpen || LucideIcons.GraduationCap;
    else if (normalizedName.includes('google')) Icon = LucideIcons.Search;
    else if (normalizedName.includes('bank') || normalizedName.includes('pay') || normalizedName.includes('finance') || normalizedName.includes('money')) Icon = LucideIcons.Landmark;
    else if (normalizedName.includes('school') || normalizedName.includes('college') || normalizedName.includes('university') || normalizedName.includes('student') || normalizedName.includes('exam')) Icon = LucideIcons.GraduationCap;
    else if (normalizedName.includes('health') || normalizedName.includes('medical') || normalizedName.includes('hospital') || normalizedName.includes('doctor')) Icon = LucideIcons.HeartPulse;
    else if (normalizedName.includes('job') || normalizedName.includes('work') || normalizedName.includes('employ')) Icon = LucideIcons.Briefcase;
    else if (normalizedName.includes('tax') || normalizedName.includes('gst') || normalizedName.includes('file') || normalizedName.includes('pan')) Icon = LucideIcons.FileText;
    else if (normalizedName.includes('police') || normalizedName.includes('fir') || normalizedName.includes('law') || normalizedName.includes('court')) Icon = LucideIcons.Shield;
    else if (normalizedName.includes('water') || normalizedName.includes('electricity') || normalizedName.includes('bill') || normalizedName.includes('power')) Icon = LucideIcons.Zap;
    else if (normalizedName.includes('certificate') || normalizedName.includes('income') || normalizedName.includes('caste')) Icon = LucideIcons.FileBadge;
    else if (normalizedName.includes('travel') || normalizedName.includes('ticket') || normalizedName.includes('bus') || normalizedName.includes('train') || normalizedName.includes('flight')) Icon = LucideIcons.Ticket;
    else if (normalizedName.includes('shop') || normalizedName.includes('store') || normalizedName.includes('buy') || normalizedName.includes('sell')) Icon = LucideIcons.ShoppingCart;
    else if (normalizedName.includes('car') || normalizedName.includes('vehicle') || normalizedName.includes('transport') || normalizedName.includes('drive')) Icon = LucideIcons.Car;
    else if (normalizedName.includes('house') || normalizedName.includes('home') || normalizedName.includes('property') || normalizedName.includes('estate') || normalizedName.includes('land')) Icon = LucideIcons.Home;
    else if (iconName && iconName.length <= 2 && iconName !== '🔗') {
      return <span className={className}>{iconName}</span>;
    } else {
      Icon = LucideIcons.Globe;
    }
  }

  if (Icon) {
    return <Icon size={size} className={className} />;
  }
  return <span className={className}>{iconName}</span>;
};


const PRIMARY = '#032e60';
const ACCENT = '#eff6ff';


interface BankingPortal {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string;
}

interface Record {
  id: number;
  customer_id: string;
  date: string;
  customer_name: string;
  service: string;
  document_id: string;
  contact_number: string;
  document_received: boolean;
  status: string;
  created_at: string;
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Grid3x3 },
    { name: 'Banking', path: '/banking', icon: Landmark },
    { name: 'Record', path: '/record', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50" style={{ background: PRIMARY }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logo-new.png" alt="Airnet" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="text-white font-bold text-[19px] leading-none tracking-tight" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>AIRNET COMPUTERS</div>
              <div className="text-white/70 text-[11px] mt-0.5 font-medium">Internet Cafe and Online services Hub</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isActive
                      ? 'bg-white text-[#032e60]'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 overflow-hidden"
            style={{ background: PRIMARY }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${isActive
                        ? 'bg-white text-[#032e60]'
                        : 'text-white/90'
                      }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#f9fafb] border-t border-gray-200 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo-new.png" alt="Airnet Computers Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="font-bold text-[18px]" style={{ color: PRIMARY }}>Airnet Computers</span>
            </div>
            <div className="space-y-2 text-[14px] text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: PRIMARY }} />
                <span>Opp. Congress Office (Talampally Foundation)<br />Haralayya Chowk, Basavakalyan – 585327<br />Bidar, Karnataka, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: PRIMARY }}>Contact</h3>
            <div className="space-y-3 text-[14px]">
              <div>
                <div className="text-gray-500 text-[12px]">Owner & Chief Operator</div>
                <div className="font-medium">Md Amjad Ali</div>
                <a href="tel:+917892881086" className="flex items-center gap-1.5 text-[#032e60] hover:underline">
                  <Phone size={14} /> +91-7892881086
                </a>
              </div>
              <div>
                <div className="text-gray-500 text-[12px]">Assistant</div>
                <div className="font-medium">Rasool Ahmed</div>
                <a href="tel:+918792900246" className="flex items-center gap-1.5 text-[#032e60] hover:underline">
                  <Phone size={14} /> +91-8792900246
                </a>
              </div>
              <a href="mailto:airnetbsk@gmail.com" className="flex items-center gap-1.5 text-[#032e60] hover:underline">
                <Mail size={14} /> airnetbsk@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: PRIMARY }}>Connect</h3>
            <div className="flex gap-3">
              <a href="https://api.whatsapp.com/send/?phone=7892881086" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:airnetbsk@gmail.com" className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity" style={{ background: PRIMARY }}>
                <Mail size={18} />
              </a>
              <a href="https://www.instagram.com/airnet_computers" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/airnetcomputers.bsk" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@airnetcomputers4U" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Youtube size={18} />
              </a>
              <a href="https://maps.app.goo.gl/EMuzi5SM4g1Cht3w6" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                <MapPin size={18} />
              </a>
            </div>
            <div className="mt-6 text-[12px] text-gray-500">
              © 2024 Airnet Computers. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const [bankingPortals, setBankingPortals] = useState<BankingPortal[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const defaultBanking = [
      { id: 1, name: 'Rapipay withdrawal', url: 'https://agent.rapipay.com/', description: 'Rapipay Agent Portal', icon: 'Wallet' },
      { id: 2, name: 'Airtel Bank', url: 'https://www.airtel.in/common/paymentBank/index.html', description: 'Airtel Payments Bank', icon: 'Briefcase' },
      { id: 3, name: 'IndusInd Bank', url: 'https://csp.bfil.co.in/', description: 'IndusInd CSP Login', icon: 'Building' },
      { id: 4, name: 'Jio Payment Bank', url: 'https://partner.jiobank.in/', description: 'Jio Bank Partner Portal', icon: 'CreditCard' }
    ];

    const defaultServices = [
      { id: 1, name: 'Aadhaar', url: 'https://myaadhaar.uidai.gov.in/', icon: 'Fingerprint', position: 1 },
      { id: 2, name: 'PAN (NSDL)', url: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html', icon: 'CreditCard', position: 2 },
      { id: 3, name: 'PAN (UTIITSL)', url: 'https://www.pan.utiitsl.com/', icon: 'CreditCard', position: 3 },
      { id: 4, name: 'Passport', url: 'https://passportindia.gov.in/', icon: 'Plane', position: 4 },
      { id: 5, name: 'Voter ID', url: 'https://voters.eci.gov.in/', icon: 'UserSquare', position: 5 },
      { id: 6, name: 'Ration Card', url: 'https://ahara.karnataka.gov.in/', icon: 'ShoppingCart', position: 6 },
      { id: 7, name: 'Nadakacheri', url: 'https://nadakacheri.karnataka.gov.in/', icon: 'Landmark', position: 7 },
      { id: 8, name: 'Birth/Death', url: 'https://ejanma.karnataka.gov.in/', icon: 'Activity', position: 8 },
      { id: 9, name: 'Udyam', url: 'https://udyamregistration.gov.in/', icon: 'Factory', position: 9 },
      { id: 10, name: 'Ayushman', url: 'https://beneficiary.nha.gov.in/', icon: 'HeartPulse', position: 10 },
      { id: 11, name: 'eShram', url: 'https://eshram.gov.in/', icon: 'HardHat', position: 11 },
      { id: 12, name: 'UDID', url: 'https://www.swavlambancard.gov.in/', icon: 'Accessibility', position: 12 },
      { id: 13, name: 'Karnataka Education', url: 'https://kseab.karnataka.gov.in/', icon: 'GraduationCap', position: 13 },
      { id: 14, name: 'KSRTC Pass', url: 'https://ksrtc.karnataka.gov.in/', icon: 'Bus', position: 14 },
      { id: 15, name: 'SSP', url: 'https://ssp.postmatric.karnataka.gov.in/', icon: 'GraduationCap', position: 15 },
      { id: 16, name: 'Bhoomi', url: 'https://rtc.karnataka.gov.in/Service78/Login.aspx', icon: 'Map', position: 16 },
      { id: 17, name: 'Parivahan', url: 'https://parivahan.gov.in/', icon: 'Car', position: 17 },
      { id: 18, name: 'Pahani', url: 'https://landrecords.karnataka.gov.in/Service2/', icon: 'ScrollText', position: 18 },
      { id: 19, name: 'Seva Sindhu', url: 'https://sevasindhuservices.karnataka.gov.in', icon: 'Globe', position: 19 }
    ];

    const savedBanking = localStorage.getItem('airnet_banking');
    if (savedBanking) {
      const parsed = JSON.parse(savedBanking);
      if (parsed.some((b: any) => b.name === 'Fino Payments Bank') || parsed.length !== defaultBanking.length) {
        setBankingPortals(defaultBanking);
        localStorage.setItem('airnet_banking', JSON.stringify(defaultBanking));
      } else {
        setBankingPortals(parsed);
      }
    } else {
      setBankingPortals(defaultBanking);
    }

    fetchDbServices().then(data => {
      if (data.length > 0) {
        setServices(data.slice(0, 6));
      } else {
        setServices(defaultServices.slice(0, 6));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)` }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[12px] font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Open Now • Basavakalyan
              </div>
              <h1 className="text-[42px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                Your Trusted
                <br />
                <span className="text-white/80">Digital Services</span>
                <br />
                Partner
              </h1>
              <p className="text-[18px] text-white/70 leading-relaxed mb-8 max-w-[520px]">
                Comprehensive Digital Solutions • Banking CSP • Government Services • Document Processing
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/services')} className="px-6 py-3 bg-white text-[#032e60] rounded-xl font-semibold text-[15px] hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Explore Services
                </button>
                <button onClick={() => navigate('/banking')} className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold text-[15px] hover:bg-white/20 transition-all">
                  Banking Portal
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-[24px] border border-white/20 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service, i) => (
                    <motion.a
                      key={service.id}
                      href={service.url}
                      target="_blank"
                      rel="noopener"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="group bg-white/95 backdrop-blur rounded-2xl p-4 hover:bg-white transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center"
                    >
                      <div className="text-[#032e60] mb-2 flex justify-center"><ServiceIcon iconName={service.icon} name={service.name} url={service.url} size={28} /></div>
                      <div className="font-semibold text-[14px] text-gray-900 group-hover:text-[#032e60]">{service.name}</div>
                      <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                        Open <ExternalLink size={10} />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-[32px] blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Government Services', icon: Grid3x3, path: '/services', desc: '12 portals', color: '#032e60' },
            { name: 'Banking CSP', icon: Landmark, path: '/banking', desc: '4 banks', color: '#0ea5e9' },
            { name: 'Passbook Generator', icon: CreditCard, path: '/banking', desc: 'Instant print', color: '#8b5cf6' },
            { name: 'Customer Records', icon: FileText, path: '/record', desc: 'Manage data', color: '#10b981' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={item.path} className="card p-5 flex flex-col items-center text-center group hover:border-[#032e60]/20 border border-transparent">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${item.color}15` }}>
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <div className="font-semibold text-[15px] text-gray-900 mb-1">{item.name}</div>
                  <div className="text-[12px] text-gray-500">{item.desc}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-[28px] font-bold tracking-tight" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Banking Portals</h2>
            <p className="text-gray-600 mt-1">Access all CSP banking services in one place</p>
          </div>
          <Link to="/banking" className="hidden sm:flex items-center gap-1.5 text-[14px] font-medium hover:gap-2 transition-all" style={{ color: PRIMARY }}>
            View all <ExternalLink size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {bankingPortals.map((bank) => (
            <div key={bank.id} className="banking-card card overflow-hidden group flex flex-col justify-between">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[#032e60] mb-4" style={{ background: ACCENT }}>
                  <ServiceIcon iconName={bank.icon} name={bank.name} url={bank.url} size={36} />
                </div>
                <h3 className="font-bold text-[17px] mb-1.5" style={{ color: PRIMARY }}>{bank.name}</h3>
                <p className="text-[13px] text-gray-600 leading-snug min-h-[36px]">{bank.description}</p>
              </div>
              <div className="banking-card-footer px-6 py-3.5 flex items-center justify-between border-t border-[#032e60]/5">
                <span className="text-[13px] font-medium" style={{ color: PRIMARY }}>Open Portal</span>
                <a href={bank.url} target="_blank" rel="noopener" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: PRIMARY }}>
                  <ExternalLink size={14} className="text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="card p-6 lg:p-8" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, white 100%)` }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-[20px] font-bold mb-2" style={{ color: PRIMARY }}>Need assistance?</h3>
              <p className="text-gray-600">Visit us or call for quick support with any service</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+917892881086" className="btn-primary px-5 py-2.5 rounded-xl font-medium text-[14px] flex flex-col items-start gap-0.5 min-w-[160px]">
                <span className="flex items-center gap-1.5"><Phone size={14} /> Md Amjad Ali</span>
                <span className="text-[12px] opacity-90 font-mono">+91-7892881086</span>
              </a>
              <a href="tel:+918792900246" className="px-5 py-2.5 rounded-xl font-medium text-[14px] border-2 flex flex-col items-start gap-0.5 hover:bg-gray-50 transition-colors min-w-[160px]" style={{ borderColor: PRIMARY, color: PRIMARY }}>
                <span className="flex items-center gap-1.5"><Phone size={14} /> Rasool Ahmed</span>
                <span className="text-[12px] opacity-75 font-mono">+91-8792900246</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableServiceCard({ service, onEdit, onDelete }: { service: Service; onEdit: (s: Service) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`card p-5 group relative flex flex-col items-center text-center justify-between min-h-[220px] ${isDragging ? 'opacity-50 scale-105 shadow-2xl z-50' : ''}`}>
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} style={{ cursor: 'move' }} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
          <GripVertical size={14} className="text-gray-600" />
        </button>
      </div>
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(service)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600">
          <Edit2 size={14} />
        </button>
        <button onClick={() => onDelete(service.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full mt-4">
        <div className="text-[#032e60] mb-3 flex justify-center"><ServiceIcon iconName={service.icon} name={service.name} url={service.url} size={36} /></div>
        <h3 className="font-bold text-[16px] mb-4" style={{ color: PRIMARY }}>{service.name}</h3>
      </div>
      <a href={service.url} target="_blank" rel="noopener" className="btn-primary w-full py-2.5 rounded-full font-medium text-[13px] flex items-center justify-center gap-1.5 group/btn">
        Open Portal <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
}

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', icon: '' });
  const [toast, setToast] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchServices = async () => {
    const savedServices = await fetchDbServices();
    if (savedServices && savedServices.length > 0) {
      setServices(savedServices);
    } else {
      const defaultServices = [
        { id: 1, name: 'Aadhaar', url: 'https://myaadhaar.uidai.gov.in/', icon: 'Fingerprint', position: 1 },
        { id: 2, name: 'PAN (NSDL)', url: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html', icon: 'CreditCard', position: 2 },
        { id: 3, name: 'PAN (UTIITSL)', url: 'https://www.pan.utiitsl.com/', icon: 'CreditCard', position: 3 },
        { id: 4, name: 'Passport', url: 'https://passportindia.gov.in/', icon: 'Plane', position: 4 },
        { id: 5, name: 'Voter ID', url: 'https://voters.eci.gov.in/', icon: 'UserSquare', position: 5 },
        { id: 6, name: 'Ration Card', url: 'https://ahara.karnataka.gov.in/', icon: 'ShoppingCart', position: 6 },
        { id: 7, name: 'Nadakacheri', url: 'https://nadakacheri.karnataka.gov.in/', icon: 'Landmark', position: 7 },
        { id: 8, name: 'Birth/Death', url: 'https://ejanma.karnataka.gov.in/', icon: 'Activity', position: 8 },
        { id: 9, name: 'Udyam', url: 'https://udyamregistration.gov.in/', icon: 'Factory', position: 9 },
        { id: 10, name: 'Ayushman', url: 'https://beneficiary.nha.gov.in/', icon: 'HeartPulse', position: 10 },
        { id: 11, name: 'eShram', url: 'https://eshram.gov.in/', icon: 'HardHat', position: 11 },
        { id: 12, name: 'UDID', url: 'https://www.swavlambancard.gov.in/', icon: 'Accessibility', position: 12 },
        { id: 13, name: 'Karnataka Education', url: 'https://kseab.karnataka.gov.in/', icon: 'GraduationCap', position: 13 },
        { id: 14, name: 'KSRTC Pass', url: 'https://ksrtc.karnataka.gov.in/', icon: 'Bus', position: 14 },
        { id: 15, name: 'SSP', url: 'https://ssp.postmatric.karnataka.gov.in/', icon: 'GraduationCap', position: 15 },
        { id: 16, name: 'Bhoomi', url: 'https://rtc.karnataka.gov.in/Service78/Login.aspx', icon: 'Map', position: 16 },
        { id: 17, name: 'Parivahan', url: 'https://parivahan.gov.in/', icon: 'Car', position: 17 },
        { id: 18, name: 'Pahani', url: 'https://landrecords.karnataka.gov.in/Service2/', icon: 'ScrollText', position: 18 },
        { id: 19, name: 'Seva Sindhu', url: 'https://sevasindhuservices.karnataka.gov.in', icon: 'Globe', position: 19 }
      ];
      setServices(defaultServices);
      await updateDbServicePositions(defaultServices);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      const newServices = arrayMove(services, oldIndex, newIndex);

      const updatedServices = newServices.map((s, idx) => ({ ...s, position: idx + 1 }));
      setServices(updatedServices);
      await updateDbServicePositions(updatedServices);

      setToast('Position saved');
      setTimeout(() => setToast(''), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const updatedService = { ...editingService, ...formData };
      setServices(services.map(s => s.id === editingService.id ? updatedService : s));
      await updateDbService(editingService.id, formData);
    } else {
      const newService = {
        id: Date.now(),
        ...formData,
        position: services.length + 1
      };
      setServices([...services, newService]);
      await insertDbService(newService);
    }

    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', url: '', icon: '' });
  };

  const handleDelete = async () => {
    if (deleteId) {
      setServices(services.filter(s => s.id !== deleteId));
      await deleteDbService(deleteId);
      setDeleteId(null);
    }
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setFormData({ name: service.name, url: service.url, icon: service.icon });
    setShowModal(true);
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight mb-2" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Government Services</h1>
            <p className="text-gray-600">Access all government portals • Drag to reorder • Click to open</p>
          </div>
          <div className="w-full md:w-80">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] transition-all text-[14px] bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredServices.map(s => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {filteredServices.map((service) => (
                <SortableServiceCard key={service.id} service={service} onEdit={openEdit} onDelete={setDeleteId} />
              ))}

              {!searchQuery && (
                <button onClick={() => { setEditingService(null); setFormData({ name: '', url: '', icon: '' }); setShowModal(true); }} className="card p-5 border-2 border-dashed border-gray-300 hover:border-[#032e60]/50 bg-white/50 hover:bg-white transition-all group min-h-[220px] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-[#032e60] flex items-center justify-center mb-3 transition-colors">
                    <Plus size={24} className="text-gray-400 group-hover:text-[#032e60]" />
                  </div>
                  <span className="font-medium text-gray-600 group-hover:text-[#032e60]">Add Service</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden">
              <div className="px-6 py-5 border-b" style={{ background: ACCENT }}>
                <h3 className="text-[20px] font-bold" style={{ color: PRIMARY }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Service Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] transition-all" placeholder="e.g., Aadhaar" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Service URL</label>
                  <input type="url" required value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] transition-all" placeholder="https://..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-2.5 rounded-xl font-medium">{editingService ? 'Save Changes' : 'Add Service'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-[20px] font-bold mb-2">Are you sure?</h3>
              <p className="text-gray-600 text-[14px] mb-6">This will permanently delete the service. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors">No, Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-[14px] font-medium">
              <CheckCircle2 size={18} className="text-green-400" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BankingPage() {
  const [bankingPortals, setBankingPortals] = useState<BankingPortal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const defaultBanking = [
      { id: 1, name: 'Rapipay withdrawal', url: 'https://agent.rapipay.com/', description: 'Rapipay Agent Portal', icon: 'Wallet' },
      { id: 2, name: 'Airtel Bank', url: 'https://www.airtel.in/common/paymentBank/index.html', description: 'Airtel Payments Bank', icon: 'Briefcase' },
      { id: 3, name: 'IndusInd Bank', url: 'https://csp.bfil.co.in/', description: 'IndusInd CSP Login', icon: 'Building' },
      { id: 4, name: 'Jio Payment Bank', url: 'https://partner.jiobank.in/', description: 'Jio Bank Partner Portal', icon: 'CreditCard' }
    ];
    const savedBanking = localStorage.getItem('airnet_banking');
    if (savedBanking) {
      const parsed = JSON.parse(savedBanking);
      if (parsed.some((b: any) => b.name === 'Fino Payments Bank') || parsed.length !== defaultBanking.length) {
        setBankingPortals(defaultBanking);
        localStorage.setItem('airnet_banking', JSON.stringify(defaultBanking));
      } else {
        setBankingPortals(parsed);
      }
    } else {
      setBankingPortals(defaultBanking);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight mb-2" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Banking Services</h1>
          <p className="text-gray-600">CSP banking portals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* IndusInd Account Opening Banner */}
          <div className="card p-8 flex flex-col justify-between" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[12px] font-medium mb-4">
                    <Landmark size={14} /> CSP Portal
                  </div>
                  <h2 className="text-[26px] font-bold text-white mb-2">IndusInd Account Opening</h2>
                  <p className="text-white/70 mb-6 max-w-[520px]">Open new IndusInd Bank accounts through CSP portal. Quick KYC and instant account activation.</p>
                </div>
                <a href="https://csp.bfil.co.in/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 w-fit px-5 py-2.5 bg-white text-[#032e60] rounded-xl font-semibold hover:bg-gray-100 transition-all hover:shadow-lg mt-auto">
                  Open CSP Portal <ExternalLink size={16} />
                </a>
              </div>
              <div className="hidden sm:flex text-white items-center justify-center self-center pl-4">
                <Landmark size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* Create Passbook Banner */}
          <div className="card p-8 flex flex-col justify-between" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[12px] font-medium mb-4">
                    <CreditCard size={14} /> Passbook Tool
                  </div>
                  <h2 className="text-[26px] font-bold text-white mb-2">Create Passbook</h2>
                  <p className="text-white/70 mb-6 max-w-[520px]">Generate, format and print professional bank passbooks instantly for all CSP bank accounts.</p>
                </div>
                <button onClick={() => navigate('/passbook')} className="inline-flex items-center gap-2 w-fit px-5 py-2.5 bg-white text-[#032e60] rounded-xl font-semibold hover:bg-gray-100 transition-all hover:shadow-lg mt-auto">
                  Generate Passbook <ExternalLink size={16} />
                </button>
              </div>
              <div className="hidden sm:flex text-white items-center justify-center self-center pl-4">
                <CreditCard size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[20px] font-bold mb-5" style={{ color: PRIMARY }}>All Banking Portals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {bankingPortals.map((bank) => (
              <div key={bank.id} className="banking-card card overflow-hidden group flex flex-col justify-between">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[#032e60] mb-4" style={{ background: ACCENT }}>
                    <ServiceIcon iconName={bank.icon} name={bank.name} url={bank.url} size={36} />
                  </div>
                  <h3 className="font-bold text-[17px] mb-1.5" style={{ color: PRIMARY }}>{bank.name}</h3>
                  <p className="text-[13px] text-gray-600 leading-snug min-h-[36px]">{bank.description}</p>
                </div>
                <div className="banking-card-footer px-6 py-3.5 flex items-center justify-between border-t border-[#032e60]/5">
                  <span className="text-[13px] font-medium" style={{ color: PRIMARY }}>Open Portal</span>
                  <a href={bank.url} target="_blank" rel="noopener" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: PRIMARY }}>
                    <ExternalLink size={14} className="text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer_name: '', service: '', document_id: '', contact_number: '', document_received: false });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [clearAll, setClearAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(isSupabaseConfigured());
  const [showDbConfig, setShowDbConfig] = useState(false);
  const [dbConfigUrl, setDbConfigUrl] = useState(localStorage.getItem('airnet_supabase_url') || '');
  const [dbConfigKey, setDbConfigKey] = useState(localStorage.getItem('airnet_supabase_anon_key') || '');

  // Fixed WhatsApp target number
  const WA_TARGET_NUMBER = '7892881086';

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(dbConfigUrl, dbConfigKey);
    setShowDbConfig(false);
  };
  
  const handleDisconnectDb = () => {
    if (confirm('Are you sure you want to disconnect your cloud database? The app will fallback to your local browser storage.')) {
      saveSupabaseCredentials('', '');
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const dbRecords = await fetchDbRecords();
      setRecords(dbRecords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const filtered = Array.isArray(records) ? records.filter(r => {
    const cid = r?.customer_id ? String(r.customer_id) : '';
    const cname = r?.customer_name ? String(r.customer_name) : '';
    const cnum = r?.contact_number ? String(r.contact_number) : '';
    const s = (search || '').toLowerCase();

    return cid.toLowerCase().includes(s) ||
      cname.toLowerCase().includes(s) ||
      cnum.includes(s);
  }) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contact_number.length !== 10) {
      alert('Mobile number must be exactly 10 digits');
      return;
    }

    const today = new Date();
    const date_str = String(today.getDate()).padStart(2, '0') + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      today.getFullYear();

    const newRecord: Record = {
      id: Date.now(),
      customer_id: 'AN' + Math.floor(1000000000 + Math.random() * 9000000000),
      date: date_str,
      ...formData,
      status: 'pending',
      created_at: today.toISOString()
    };

    setLoading(true);
    try {
      const inserted = await insertDbRecord(newRecord);
      setRecords(prev => [inserted, ...prev]);
      setShowForm(false);
      setFormData({ customer_name: '', service: '', document_id: '', contact_number: '', document_received: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReceived = async (id: number, current: boolean) => {
    const updatedStatus = !current ? 'completed' : 'pending';
    const updates = { document_received: !current, status: updatedStatus };
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    try {
      await updateDbRecord(id, updates);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      const idToDelete = deleteId;
      setRecords(prev => prev.filter(r => r.id !== idToDelete));
      setDeleteId(null);
      try {
        await deleteDbRecord(idToDelete);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearAll = async () => {
    setRecords([]);
    setClearAll(false);
    try {
      await clearAllDbRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');

  const exportExcel = async () => {
    const recordsToExport = Array.isArray(records) && records.length > 0 ? records : [];

    if (recordsToExport.length === 0) {
      alert('No records to export');
      return;
    }

    const excelData = recordsToExport.map((r, idx) => ({
      'SL': idx + 1,
      'Customer ID': r.customer_id || '',
      'Date': r.date || '',
      'Name': r.customer_name || '',
      'Service': r.service || '',
      'Doc ID': r.document_id || '',
      'Contact': r.contact_number || '',
      'Received': r.document_received ? 'Yes' : 'No',
      'Status': r.status || '',
      'Timestamp': r.created_at ? new Date(r.created_at).toLocaleString('en-GB') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');

    const today = new Date();
    const filename = `Airnet_${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}.xlsx`;

    try {
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      await saveExcelBlob(blob, filename);
    } catch (err) {
      console.error('Excel download failed:', err);
      alert('Failed to download Excel file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[32px] font-bold tracking-tight" style={{ color: PRIMARY, fontFamily: 'Arial, sans-serif' }}>Customer Records</h1>
              {dbConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm" title="Synchronizing to your custom Supabase Postgres cloud database">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Database (Supabase)
                  <button onClick={() => setShowDbConfig(true)} className="ml-1 hover:text-emerald-900 transition-colors" title="Database Settings">
                    <Settings size={12} />
                  </button>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#eef2ff] text-[#4f46e5] border border-[#e0e7ff] shadow-sm" title="Synchronizing to the Central records.json Database on your host machine. Any browser or computer on your network will share these records!">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] animate-pulse" />
                  Network Database Shared (Active)
                  <button onClick={() => setShowDbConfig(true)} className="ml-1 hover:text-[#3730a3] transition-colors" title="Database Settings">
                    <Settings size={12} />
                  </button>
                </span>
              )}
            </div>
            <p className="text-gray-600">Manage customer service records • {filtered.length} of {records.length} records</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExcel} className="px-4 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-white flex items-center gap-1.5 text-[14px] transition-colors">
              <Download size={16} /> Export Excel
            </button>
            <button onClick={() => setClearAll(true)} className="px-4 py-2.5 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1.5 text-[14px] transition-colors">
              <Trash2 size={16} /> Clear All
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 text-[14px]">
              <Plus size={16} /> New Record
            </button>
          </div>
        </div>

        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, white 100%)` }}>
          <div>
            <h2 className="text-[20px] font-bold mb-1" style={{ color: PRIMARY }}>WhatsApp Notification System</h2>
            <p className="text-gray-600 text-[14px]">Send automated alerts and track documents</p>
          </div>
          <button onClick={() => navigate('/document-management')} className="btn-primary px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 text-[14px]">
            <MessageCircle size={16} /> Document Management
          </button>
        </div>

        <div className="card p-4 mb-5">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by Customer ID, Name, or Mobile..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] transition-all" />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200" style={{ background: ACCENT }}>
                  {['SL', 'Customer ID', 'Date', 'Customer Name', 'Service', 'Document ID', 'Contact', 'Received', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: PRIMARY }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((record, idx) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-[14px] text-gray-600">{idx + 1}</td>
                    <td className="px-4 py-3.5"><span className="font-mono text-[13px] font-medium px-2 py-1 rounded bg-gray-100">{record.customer_id}</span></td>
                    <td className="px-4 py-3.5 text-[14px] font-mono">{record.date}</td>
                    <td className="px-4 py-3.5 text-[14px] font-medium">{record.customer_name}</td>
                    <td className="px-4 py-3.5 text-[14px]">{record.service}</td>
                    <td className="px-4 py-3.5 text-[13px] font-mono text-gray-600">{record.document_id || '-'}</td>
                    <td className="px-4 py-3.5 text-[14px] font-mono">{record.contact_number}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleReceived(record.id, record.document_received)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                        {record.document_received ? <CheckCircle2 size={20} className="text-green-600" /> : <XCircle size={20} className="text-gray-300 hover:text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${record.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {record.status === 'completed' ? <Check size={12} /> : <AlertCircle size={12} />}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => setDeleteId(record.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center text-gray-500">
                      <FileText size={32} className="mx-auto mb-3 opacity-30" />
                      <div className="font-medium">No records found</div>
                      <div className="text-[13px] mt-1">{search ? 'Try a different search' : 'Create your first record'}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px]">
              <div className="px-6 py-5 border-b" style={{ background: ACCENT }}>
                <h3 className="text-[20px] font-bold" style={{ color: PRIMARY }}>New Customer Record</h3>
                <p className="text-[13px] text-gray-600 mt-0.5">Customer ID and Date will be auto-generated</p>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Customer Name *</label>
                    <input type="text" required value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Service *</label>
                    <input type="text" required value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60]" placeholder="e.g., Aadhaar Update" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Document ID / RD Number</label>
                    <input type="text" value={formData.document_id} onChange={e => setFormData({ ...formData, document_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Contact Number *</label>
                    <input type="tel" required pattern="[0-9]{10}" maxLength={10} value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value.replace(/\D/g, '') })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] font-mono" placeholder="10 digits" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer py-2">
                      <input type="checkbox" checked={formData.document_received} onChange={e => setFormData({ ...formData, document_received: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#032e60] focus:ring-[#032e60]" />
                      <span className="text-[14px]">Document Received</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-2.5 rounded-xl font-medium">Create Record</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(deleteId || clearAll) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-[20px] font-bold mb-2">Are you sure?</h3>
              <p className="text-gray-600 text-[14px] mb-6">{clearAll ? 'This will permanently delete ALL records. This cannot be undone.' : 'This will permanently delete this record.'}</p>
              <div className="flex gap-3">
                <button onClick={() => { setDeleteId(null); setClearAll(false); }} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50">No, Cancel</button>
                <button onClick={clearAll ? handleClearAll : handleDelete} className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700">Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Export Modal - Guaranteed to work */}
      <AnimatePresence>
        {showCsvModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCsvModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: ACCENT }}>
                <div>
                  <h3 className="text-[18px] font-bold" style={{ color: PRIMARY }}>Download CSV File</h3>
                  <p className="text-[12px] text-gray-600 mt-0.5">Click the download button below - works in all browsers</p>
                </div>
                <button onClick={() => setShowCsvModal(false)} className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex gap-2 mb-4">
                  <a
                    href={`data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csvContent)}`}
                    download={`Airnet_${new Date().getDate().toString().padStart(2, '0')}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}.csv`}
                    className="px-5 py-2.5 btn-primary rounded-xl font-medium text-[14px] flex items-center gap-2 hover:shadow-lg transition-all"
                    onClick={() => setTimeout(() => setShowCsvModal(false), 500)}
                  >
                    <Download size={16} /> Download CSV File
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(csvContent); alert('Copied! Paste into Excel.'); }} className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-[14px] font-medium hover:bg-gray-50 transition-colors">
                    Copy Data
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                  <p className="text-[13px] text-amber-900"><strong>✓ Click "Download CSV File" above</strong> - Your browser will download Airnet_DD-MM-YYYY.csv instantly. Open it in Excel.</p>
                </div>
                <textarea readOnly value={csvContent} className="flex-1 w-full p-3 border border-gray-300 rounded-xl font-mono text-[11px] resize-none focus:outline-none bg-gray-50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDbConfig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDbConfig(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px]">
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ background: ACCENT }}>
                <div>
                  <h3 className="text-[20px] font-bold" style={{ color: PRIMARY }}>Database Connection Settings</h3>
                  <p className="text-[13px] text-gray-600 mt-0.5">Configure cloud sync using Supabase credentials</p>
                </div>
                <button onClick={() => setShowDbConfig(false)} className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSaveDbConfig} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Supabase Project URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://xxxxxx.supabase.co"
                      value={dbConfigUrl}
                      onChange={e => setDbConfigUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] font-mono text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Supabase Anon Key *</label>
                    <textarea
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={dbConfigKey}
                      onChange={e => setDbConfigKey(e.target.value)}
                      className="w-full h-24 px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032e60]/20 focus:border-[#032e60] font-mono text-[12px] resize-none"
                    />
                  </div>
                  {getSupabaseSource() === 'env' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-[12px]">
                      <strong>Note:</strong> Currently locked to credentials defined in your system environment (<code>.env</code> file). To change them here, remove VITE_SUPABASE_URL from the .env file first.
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  {dbConnected && getSupabaseSource() === 'local' && (
                    <button type="button" onClick={handleDisconnectDb} className="px-4 py-2.5 rounded-xl font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-[14px]">
                      Disconnect
                    </button>
                  )}
                  <button type="button" onClick={() => setShowDbConfig(false)} className="flex-1 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 text-[14px]">
                    Cancel
                  </button>
                  {getSupabaseSource() !== 'env' && (
                    <button type="submit" className="flex-1 btn-primary py-2.5 rounded-xl font-medium text-[14px]">
                      Save & Connect
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

// --- PassbookPage Component ---
function PassbookPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [guardianType, setGuardianType] = useState('Father Name');
  const [dob, setDob] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [idNo, setIdNo] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const a4ContainerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFullName('');
    setFatherName('');
    setGuardianType('Father Name');
    setDob('');
    setAccountNo('');
    setIdNo('');
    setAddress('');
    setMobileNo('');
    setProfileImage(null);

    // Reset draggable card's position
    const card = document.getElementById('printable-passbook-card');
    if (card) {
      card.style.transform = 'none';
      card.style.setProperty('transform', 'none', 'important');
      setTimeout(() => {
        card.style.transform = '';
        card.style.removeProperty('transform');
      }, 50);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) { // YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`; 
      }
      return dateStr; // Already DD-MM-YYYY or other format
    }
    return dateStr;
  };

  const formatID = (idStr: string) => {
    const clean = idStr.replace(/\s+/g, '');
    if (clean.length === 12) {
      return `${clean.substring(0, 4)} ${clean.substring(4, 8)} ${clean.substring(8, 12)}`;
    }
    return idStr;
  };

  const downloadPDF = () => {
    const element = document.getElementById('a4-print-sheet');
    const proxy = document.getElementById('drag-proxy');
    const realContent = document.getElementById('real-card-content');
    if (!element) return;

    // Save active transform
    const prevTransform = element.style.transform;
    element.style.transform = 'none';
    
    // Temporarily hide grid background for clean PDF
    const prevBg = element.style.backgroundImage;
    element.style.backgroundImage = 'none';

    // Hide drag proxy, show real content
    if (proxy) proxy.style.display = 'none';
    if (realContent) realContent.classList.remove('opacity-0');

    html2canvas(element, {
      scale: 3, // Extremely high resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    }).then((canvas) => {
      // Restore states
      element.style.transform = prevTransform;
      element.style.backgroundImage = prevBg;
      
      if (proxy) proxy.style.display = 'flex';
      if (realContent) realContent.classList.add('opacity-0');
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`Passbook_A4_${fullName.replace(/\s+/g, '_')}.pdf`);
    });
  };

  const triggerPrint = () => {
    const proxy = document.getElementById('drag-proxy');
    const realContent = document.getElementById('real-card-content');
    
    if (proxy) proxy.style.display = 'none';
    if (realContent) realContent.style.setProperty('opacity', '1', 'important');
    
    window.print();

    if (proxy) proxy.style.display = 'flex';
    if (realContent) realContent.style.removeProperty('opacity');
  };

  const PassbookCard = ({ id, isDraggable = false, scale = 1, constraintsRef = null }: { id: string, isDraggable?: boolean, scale?: number, constraintsRef?: any }) => {
    const cardContent = (
      <div 
        id={isDraggable ? "real-card-content" : id}
        className={`bg-white text-black relative select-none shadow-2xl border-2 border-black print:shadow-none ${isDraggable ? 'opacity-0 print:opacity-100' : ''}`}
        style={{
          width: '9cm',
          height: '7.2cm',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: '"Arial", sans-serif',
          color: '#000000',
          backgroundColor: '#ffffff',
          ...(isDraggable ? {} : { transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.05s ease-out' })
        }}
      >
        {/* Top Area: Bank Logo Banner */}
        <div className="w-full flex items-center justify-center gap-4 border-b border-black bg-white" style={{ height: '1.45cm', boxSizing: 'border-box' }}>
          <div className="flex flex-col leading-none" style={{ marginTop: '0.05cm' }}>
            <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 900, fontStyle: 'italic', color: '#922529', fontSize: '20px', letterSpacing: '-0.8px' }}>IndusInd</span>
            <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 900, fontStyle: 'italic', color: '#d98d24', fontSize: '15px', letterSpacing: '-0.3px', marginLeft: '0.7cm', marginTop: '-1px' }}>Bank</span>
          </div>
          {/* SVG IndusInd Logo */}
          <div style={{ marginRight: '0.05cm' }}>
            <svg width="40" height="38" viewBox="0 0 100 80">
              <circle cx="50" cy="40" r="30" fill="#1b95d1" />
              <ellipse cx="50" cy="40" rx="30" ry="12" fill="none" stroke="white" strokeWidth="1.5" />
              <ellipse cx="50" cy="40" rx="12" ry="30" fill="none" stroke="white" strokeWidth="1.5" />
              <line x1="20" y1="40" x2="80" y2="40" stroke="white" strokeWidth="1.5" />
              <line x1="50" y1="10" x2="50" y2="70" stroke="white" strokeWidth="1.5" />
              <circle cx="50" cy="40" r="18" fill="white" />
              <path d="M 42,46 C 41,42 42,36 44,35 C 46,34 48,34 50,35 C 51,32 54,30 57,32 C 59,33 60,36 60,39 C 61,40 63,40 64,41 C 65,42 64,44 63,45 C 62,46 60,47 58,47 C 56,47 55,46 54,45 C 53,44 51,44 50,45 C 48,46 46,47 44,47 C 43,47 42,46 42,46 Z" fill="#922529" />
              <path d="M 46,40 C 45,37 46,35 47,35 C 48,35 49,36 49,38 C 50,39 51,39 52,38 C 53,37 54,38 54,40 C 53,42 52,43 51,43 C 49,43 47,42 46,40 Z" fill="#922529" />
              <path d="M 41,43 L 43,45 M 41,41 L 43,43" stroke="#922529" strokeWidth="1.5" />
              <path d="M 52,34 Q 55,26 55,33 Q 57,26 56,35" fill="none" stroke="#922529" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Details Grid Table */}
        <div className="w-full relative" style={{ height: '5.65cm', boxSizing: 'border-box' }}>
          <table 
            className="w-full" 
            style={{ 
              border: 'none',
              borderCollapse: 'separate',
              borderSpacing: 0,
              width: '100%',
              height: '5.3cm',
              tableLayout: 'fixed',
              position: 'relative',
              zIndex: 1
            }}
          >
            <tbody>
              {[
                { label: 'Name', val: fullName, isBold: true },
                { label: guardianType, val: fatherName },
                { label: 'D.O.B', val: formatDate(dob) },
                { label: 'Account No.', val: accountNo, isUnderline: true },
                { label: 'IFSC code', val: 'INDB0000058', fontMono: true, isBold: true },
                { label: 'MICR Code', val: '580234002', fontMono: true, isBold: true },
                { label: 'Branch', val: 'Hubli' },
                { label: 'ID No.', val: formatID(idNo), fontMono: true, isBold: true },
                { label: 'Address', val: address, isBold: true },
                { label: 'Mobile No.', val: mobileNo, fontMono: true, isBold: true }
              ].map((row, idx) => {
                const isOverlapRow = idx >= 1 && idx <= 5;
                return (
                  <tr key={idx} style={{ height: '0.53cm', boxSizing: 'border-box' }}>
                    <td 
                      style={{ 
                        width: '2.3cm', 
                        height: '0.53cm',
                        fontSize: '10px', 
                        fontWeight: 500, 
                        padding: '0 0.15cm',
                        borderRight: '1.2px solid black',
                        borderBottom: '1.2px solid black',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                        boxSizing: 'border-box'
                      }}
                    >
                      {row.label}
                    </td>
                    <td 
                      style={{ 
                        height: '0.53cm',
                        fontSize: '11px', 
                        fontWeight: row.isBold || row.isUnderline ? 'bold' : 500, 
                        textDecoration: row.isUnderline ? 'underline font-extrabold' : 'none',
                        paddingLeft: '0.15cm',
                        paddingRight: isOverlapRow ? '2.2cm' : '0.15cm',
                        borderBottom: '1.2px solid black',
                        fontFamily: row.fontMono ? '"Courier New", Courier, monospace' : '"Arial", sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'middle',
                        boxSizing: 'border-box'
                      }}
                      title={row.val}
                    >
                      {row.val}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Floating Profile Photo Box */}
          <div 
            className="absolute flex items-center justify-center overflow-hidden shadow-[(147,197,253,0.5)]"
            style={{
              top: '0.53cm', 
              right: '0.12cm',
              width: '2.05cm',
              height: '2.65cm',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              border: '1.2px solid black',
              zIndex: 20
            }}
          >
            {profileImage ? (
              <img 
                src={profileImage} 
                className="w-full h-full object-cover" 
                alt="Holder Profile" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-1 text-gray-400 select-none">
                <User size={24} className="opacity-40 mb-1" />
                <span style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.2px', color: '#888' }}>PHOTO PREVIEW</span>
              </div>
            )}
          </div>

          {/* Footer Text */}
          <div 
            className="w-full text-center select-none"
            style={{ 
              position: 'absolute',
              bottom: '0.04cm',
              left: 0,
              fontSize: '8px',
              fontWeight: 'bold',
              letterSpacing: '0.1px',
              fontFamily: '"Arial", sans-serif',
              color: '#000000',
              lineHeight: 1
            }}
          >
            Merchant ID. I0027559 (AIRNET COMPUTERS)
          </div>
        </div>
      </div>
    );

    if (isDraggable) {
      return (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          className="cursor-move focus:outline-none absolute top-4 left-4"
          whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 50 }}
          style={{ zIndex: 10, width: '9cm', height: '7.2cm' }}
          id={id}
        >
          {cardContent}
          {/* Dark blue proxy box for UI drag interactions */}
          <div 
            id="drag-proxy"
            className="absolute inset-0 bg-blue-900/20 border-2 border-blue-900 border-dashed flex flex-col items-center justify-center text-blue-900 print:hidden rounded-xl backdrop-blur-[2px]"
            style={{ boxSizing: 'border-box' }}
          >
            <LucideIcons.Move size={28} className="mb-2 opacity-80" />
            <span className="font-bold text-[14px] text-center px-2">Passbook Card Position</span>
            <span className="text-[11px] font-medium opacity-80 mt-1">Drag to position (9cm × 7.2cm)</span>
          </div>
        </motion.div>
      );
    }

    return cardContent;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Refined Ambient Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[50%] rounded-full bg-indigo-200/20 blur-[140px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[60%] rounded-full bg-blue-200/20 blur-[150px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-200/10 blur-[120px] pointer-events-none mix-blend-multiply" />

      {/* Top Banner Navigation - SaaS Glassmorphic Style */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40 py-5 print:hidden transition-all duration-300 shadow-[(147,197,253,0.5)]">
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
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[(147,197,253,0.5)] flex-1 flex flex-col overflow-hidden relative rounded-[32px]">
              
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
                        placeholder={guardianType === 'Father Name' ? 'Enter father\'s name' : 'Enter husband\'s name'}
                      />
                    </div>

                    {/* DOB & Mobile Row */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="group/field">
                        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 mb-2 group-focus-within/field:text-indigo-600 transition-colors">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={dob} 
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2);
                            if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5, 9);
                            setDob(val);
                          }}
                          placeholder="DD-MM-YYYY"
                          maxLength={10}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white text-[14px] text-slate-800 transition-all font-medium shadow-sm" 
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

                {/* Light Blue Constants Widget */}
                <div className="mt-10 bg-blue-50 p-6 rounded-[24px] border border-blue-200 relative overflow-hidden shadow-lg shadow-blue-300/50 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="text-[11px] font-bold text-blue-800 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Branch Constants
                    </div>
                    <LucideIcons.ShieldCheck size={16} className="text-blue-400" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                    <div className="bg-white/60 hover:bg-white/80 transition-colors p-3.5 rounded-[16px] border border-blue-100 flex flex-col justify-center">
                      <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mb-1">IFSC Code</div>
                      <div className="text-[12px] font-bold text-blue-900 font-mono">INDB0000058</div>
                    </div>
                    <div className="bg-white/60 hover:bg-white/80 transition-colors p-3.5 rounded-[16px] border border-blue-100 flex flex-col justify-center">
                      <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mb-1">MICR Code</div>
                      <div className="text-[12px] font-bold text-blue-900 font-mono">580234002</div>
                    </div>
                    <div className="bg-white/60 hover:bg-white/80 transition-colors p-3.5 rounded-[16px] border border-blue-100 flex flex-col justify-center">
                      <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mb-1">Branch</div>
                      <div className="text-[12px] font-bold text-blue-900">Hubli</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Previews & A4 Placement (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Live Static Preview Card */}
            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[(147,197,253,0.5)] flex flex-col items-center print:hidden rounded-[32px] relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-100/80 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50 border border-blue-100/50 shadow-inner">
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
            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[(147,197,253,0.5)] flex flex-col items-center rounded-[32px] relative overflow-hidden print:overflow-visible print:bg-transparent print:border-none print:shadow-none print:rounded-none print:p-0">
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
                  <LucideIcons.Maximize size={14} className="text-indigo-500" /> A4 CANVAS (210 × 297mm)
                </div>

                {/* A4 Scaled Page Container */}
                <div 
                  ref={a4ContainerRef}
                  id="a4-print-sheet"
                  className="bg-white absolute shadow-[(147,197,253,0.5)] print:shadow-none transition-shadow border border-slate-200"
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
                  style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #021a35 100%)` }}
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
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all print-hidden elements */
          nav, footer, .print\\:hidden {
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
            position: absolute !important;
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <AnimatePresence mode="wait">
          {showSplash && (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/document-management" element={<DocumentManagementPage />} />
            <Route path="/passbook" element={<PassbookPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
