-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  plan_type TEXT NOT NULL DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'annual')),
  price_usd DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'usdt_bsc',
  transaction_hash TEXT,
  wallet_address TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table for WhatsApp configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  whatsapp_number TEXT NOT NULL,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for subscriptions (T1 - private user data)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- RLS for admin_settings (T1 - private user data)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_settings" ON admin_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_settings" ON admin_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_settings" ON admin_settings FOR UPDATE USING (auth.uid() = user_id);

-- Update leads table to associate with user_id (each admin sees only their leads)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS for leads to be user-specific
DROP POLICY IF EXISTS "public_read" ON leads;
DROP POLICY IF EXISTS "anon_insert" ON leads;

CREATE POLICY "select_own_leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "update_own_leads" ON leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_leads" ON leads FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_timestamp
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_subscription_timestamp();

CREATE TRIGGER update_admin_settings_timestamp
BEFORE UPDATE ON admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_subscription_timestamp();