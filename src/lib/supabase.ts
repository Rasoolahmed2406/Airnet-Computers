import { createClient } from '@supabase/supabase-js';

export interface Record {
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

// Local Shared Database API Endpoint (Runs on host Vite server)
const LOCAL_API_ENDPOINT = '/api/records';

const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, source: 'env' };
  }
  
  try {
    const localUrl = localStorage.getItem('airnet_supabase_url');
    const localKey = localStorage.getItem('airnet_supabase_anon_key');
    if (localUrl && localKey) {
      return { url: localUrl, key: localKey, source: 'local' };
    }
  } catch (e) {}
  
  return { url: '', key: '', source: 'none' };
};

const creds = getSupabaseCredentials();

export const isSupabaseConfigured = () => {
  return !!creds.url && !!creds.key;
};

export const getSupabaseSource = () => {
  return creds.source;
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  try {
    if (!url || !key) {
      localStorage.removeItem('airnet_supabase_url');
      localStorage.removeItem('airnet_supabase_anon_key');
    } else {
      localStorage.setItem('airnet_supabase_url', url.trim());
      localStorage.setItem('airnet_supabase_anon_key', key.trim());
    }
  } catch (e) {
    console.error(e);
  }
  window.location.reload();
};

export const supabase = isSupabaseConfigured()
  ? createClient(creds.url, creds.key)
  : null;

// Offline Local Storage backup helper
const getOfflineRecords = (): Record[] => {
  try {
    const saved = localStorage.getItem('airnet_records');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveOfflineRecords = (records: Record[]) => {
  localStorage.setItem('airnet_records', JSON.stringify(records));
};

// Local API Shared Store Helpers
const fetchLocalServerRecords = async (): Promise<Record[]> => {
  try {
    const res = await fetch(LOCAL_API_ENDPOINT);
    if (!res.ok) {
      throw new Error('Local server database request failed');
    }
    const data = await res.json();
    return Array.isArray(data) ? data : getOfflineRecords();
  } catch (e) {
    console.error('Local server sync failed, falling back to browser backup:', e);
    return getOfflineRecords();
  }
};

const saveLocalServerRecords = async (records: Record[]) => {
  saveOfflineRecords(records); // offline copy
  try {
    await fetch(LOCAL_API_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records)
    });
  } catch (e) {
    console.error('Local server sync save failed:', e);
  }
};

// Unified Database API
export const fetchDbRecords = async (): Promise<Record[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('customer_records')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase fetch error, falling back to local server store:', error);
      return fetchLocalServerRecords();
    }
    return data || [];
  }
  
  // Default to Local Server Database
  return fetchLocalServerRecords();
};

export const insertDbRecord = async (record: Record): Promise<Record> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('customer_records')
      .insert([record])
      .select();
      
    if (error) {
      console.error('Supabase insert error, falling back to local server store:', error);
      const current = await fetchLocalServerRecords();
      await saveLocalServerRecords([record, ...current]);
      return record;
    }
    return data && data[0] ? data[0] : record;
  }
  
  const current = await fetchLocalServerRecords();
  const updated = [record, ...current];
  await saveLocalServerRecords(updated);
  return record;
};

export const updateDbRecord = async (id: number, updates: Partial<Record>): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('customer_records')
      .update(updates)
      .eq('id', id);
      
    if (!error) return;
    console.error('Supabase update error, falling back to local server store:', error);
  }
  
  const current = await fetchLocalServerRecords();
  const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
  await saveLocalServerRecords(updated);
};

export const deleteDbRecord = async (id: number): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('customer_records')
      .delete()
      .eq('id', id);
      
    if (!error) return;
    console.error('Supabase delete error, falling back to local server store:', error);
  }
  
  const current = await fetchLocalServerRecords();
  const updated = current.filter(r => r.id !== id);
  await saveLocalServerRecords(updated);
};

export const clearAllDbRecords = async (): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('customer_records')
      .delete()
      .neq('id', 0);
      
    if (!error) return;
    console.error('Supabase clear error, falling back to local server store:', error);
  }
  
  await saveLocalServerRecords([]);
};

// --- Services API ---

export interface Service {
  id: number;
  name: string;
  url: string;
  icon: string;
  position: number;
}

const getOfflineServices = (): Service[] => {
  try {
    const saved = localStorage.getItem('airnet_services');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveOfflineServices = (services: Service[]) => {
  localStorage.setItem('airnet_services', JSON.stringify(services));
};

const fetchLocalServerServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Local server services fetch failed');
    const data = await res.json();
    return Array.isArray(data) ? data : getOfflineServices();
  } catch (e) {
    console.error('Local API fetch failed, falling back to offline:', e);
    return getOfflineServices();
  }
};

export const fetchDbServices = async (): Promise<Service[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('position', { ascending: true });
      
    if (error) {
      console.error('Supabase fetch services error:', error);
      return fetchLocalServerServices();
    }
    return data || [];
  }
  return fetchLocalServerServices();
};

export const insertDbService = async (service: Service): Promise<Service> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select();
      
    if (error) {
      console.error('Supabase insert service error:', error);
    } else {
      return data && data[0] ? data[0] : service;
    }
  }
  
  // Fallback to local server / offline
  const current = getOfflineServices();
  saveOfflineServices([...current, service]);
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Local API insert failed:', e);
  }
  return service;
};

export const updateDbService = async (id: number, updates: Partial<Service>): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);
      
    if (!error) return;
    console.error('Supabase update service error:', error);
  }
  
  // Fallback to local server / offline
  const current = getOfflineServices();
  const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
  saveOfflineServices(updated);
  try {
    await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
  } catch (e) {
    console.error('Local API update failed:', e);
  }
};

export const deleteDbService = async (id: number): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (!error) return;
    console.error('Supabase delete service error:', error);
  }
  
  // Fallback to local server / offline
  const current = getOfflineServices();
  const updated = current.filter(s => s.id !== id);
  saveOfflineServices(updated);
  try {
    await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  } catch (e) {
    console.error('Local API delete failed:', e);
  }
};

export const updateDbServicePositions = async (services: Service[]): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('services')
      .upsert(services);
      
    if (error) {
      console.error('Supabase upsert services error:', error);
    } else {
      return;
    }
  }
  
  // Fallback to local server / offline
  saveOfflineServices(services);
  try {
    // /api/services doesn't have a bulk upsert, so we sequentially update positions
    for (const s of services) {
      await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, position: s.position })
      });
    }
  } catch (e) {
    console.error('Local API bulk update failed:', e);
  }
};

