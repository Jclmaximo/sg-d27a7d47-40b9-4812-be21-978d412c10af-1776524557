-- Create payments table for tracking all payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL UNIQUE, -- Disruptive payment ID
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  network TEXT NOT NULL DEFAULT 'BSC',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, expired
  provider TEXT NOT NULL DEFAULT 'disruptive',
  discount_code_used TEXT,
  payment_address TEXT, -- Crypto address where payment was sent
  transaction_hash TEXT, -- Blockchain tx hash
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update payments"
  ON payments FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payments_timestamp ON payments;
CREATE TRIGGER update_payments_timestamp
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payment_timestamp();