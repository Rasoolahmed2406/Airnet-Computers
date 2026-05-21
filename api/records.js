import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { customer_name, service, document_id, contact_number, document_received } = req.body;
      
      const customer_id = 'AN' + Math.floor(1000000000 + Math.random() * 9000000000);
      const today = new Date();
      const date_str = String(today.getDate()).padStart(2, '0') + '-' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      today.getFullYear();
      
      const { data, error } = await supabase
        .from('records')
        .insert({
          customer_id,
          date: date_str,
          customer_name,
          service,
          document_id,
          contact_number,
          document_received: document_received || false,
          status: 'pending'
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const { id, document_received, status } = req.body;
      const updateData = {};
      if (document_received !== undefined) updateData.document_received = document_received;
      if (status !== undefined) updateData.status = status;
      
      const { data, error } = await supabase
        .from('records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'DELETE') {
      const { id, clear_all } = req.body;
      if (clear_all) {
        const { error } = await supabase.from('records').delete().neq('id', 0);
        if (error) throw error;
        return res.status(200).json({ ok: true, cleared: true });
      }
      const { error } = await supabase.from('records').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}