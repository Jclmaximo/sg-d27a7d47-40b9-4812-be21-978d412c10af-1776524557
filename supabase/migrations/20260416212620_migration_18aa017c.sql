-- Create discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active codes to validate them
CREATE POLICY "public_read_active_codes" ON discount_codes
  FOR SELECT USING (is_active = true);

-- Insert predefined discount codes
INSERT INTO discount_codes (code, discount_percentage, description, is_active, usage_limit) VALUES
  ('VL50', 50, 'Descuento del 50% - Lanzamiento Especial', true, NULL),
  ('VL40', 40, 'Descuento del 40% - Embajadores Elite', true, NULL),
  ('VL30', 30, 'Descuento del 30% - Promoción General', true, NULL);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discount_code_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_discount_codes_timestamp ON discount_codes;
CREATE TRIGGER update_discount_codes_timestamp
BEFORE UPDATE ON discount_codes
FOR EACH ROW
EXECUTE FUNCTION update_discount_code_timestamp();

-- Track discount code usage in subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS discount_code_used TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2);