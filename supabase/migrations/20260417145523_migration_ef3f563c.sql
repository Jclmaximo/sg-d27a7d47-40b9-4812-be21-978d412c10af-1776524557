-- 1. Agregar campo referred_by a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN profiles.referred_by IS 'ID of the user who referred this user (for MLM tracking)';

-- 2. Crear tabla de comisiones
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount_usd DECIMAL(10, 2) NOT NULL,
  commission_level INTEGER NOT NULL CHECK (commission_level IN (1, 2)),
  percentage DECIMAL(5, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE commissions IS 'MLM commission tracking for referrals';
COMMENT ON COLUMN commissions.user_id IS 'User who earns the commission';
COMMENT ON COLUMN commissions.referred_user_id IS 'User who made the purchase (referral)';
COMMENT ON COLUMN commissions.commission_level IS 'Level 1 (direct) or Level 2 (indirect)';
COMMENT ON COLUMN commissions.percentage IS 'Percentage of commission (30% for L1, 10% for L2)';
COMMENT ON COLUMN commissions.status IS 'pending: not paid yet, paid: commission paid, cancelled: voided';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);

-- Habilitar RLS
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para commissions
CREATE POLICY "Users can view their own commissions"
  ON commissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all commissions"
  ON commissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert commissions"
  ON commissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update commissions"
  ON commissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );