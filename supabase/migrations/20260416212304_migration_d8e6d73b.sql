-- Add columns to subscriptions table for initial payment tracking
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS initial_payment_amount DECIMAL(10,2) DEFAULT 79.00,
ADD COLUMN IF NOT EXISTS monthly_payment_amount DECIMAL(10,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS is_initial_payment BOOLEAN DEFAULT true;

-- Update existing subscriptions
UPDATE subscriptions 
SET initial_payment_amount = 79.00,
    monthly_payment_amount = 10.00
WHERE initial_payment_amount IS NULL;