-- SQL script to set up the customer_records table in Supabase.
-- Copy and paste this into the Supabase SQL Editor (https://supabase.com) to initialize your database structure.

create table if not exists customer_records (
  id bigint primary key,
  customer_id text not null,
  date text not null,
  customer_name text not null,
  service text not null,
  document_id text default '',
  contact_number text not null,
  document_received boolean default false,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table customer_records enable row level security;

-- Create simple public access policies for ease of integration
-- (In high-security production environments, you can link these with authentication roles)
create policy "Allow public read access" on customer_records for select using (true);
create policy "Allow public insert access" on customer_records for insert with check (true);
create policy "Allow public update access" on customer_records for update using (true);
create policy "Allow public delete access" on customer_records for delete using (true);
