import pg from 'pg';
const { Client } = pg;

const SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar TEXT,
  initials TEXT,
  platform TEXT DEFAULT 'instagram',
  handle TEXT,
  status TEXT DEFAULT 'lead',
  tags TEXT[] DEFAULT '{}',
  score INT DEFAULT 50,
  pulse_score INT DEFAULT 50,
  last_contact TIMESTAMPTZ,
  last_message TEXT,
  city TEXT,
  company TEXT,
  dna JSONB DEFAULT '{"frequency":50,"emotion":50,"response":50,"interest":50,"loyalty":50,"influence":50}',
  notes TEXT,
  conversations INT DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  predicted_value NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'instagram',
  unread INT DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT now(),
  sentiment TEXT DEFAULT 'neutral',
  sentiment_score INT DEFAULT 50,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT DEFAULT 'blue',
  icon TEXT DEFAULT '📋',
  sort_order INT DEFAULT 0
);

INSERT INTO pipeline_stages (id, label, color, icon, sort_order) VALUES
  ('new', 'Novo Lead', 'blue', '🆕', 1),
  ('contacted', 'Contatado', 'purple', '📨', 2),
  ('qualified', 'Qualificado', 'orange', '⭐', 3),
  ('proposal', 'Proposta', 'yellow', '📝', 4),
  ('negotiation', 'Negociação', 'pink', '🤝', 5),
  ('closed', 'Fechado', 'green', '✅', 6)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  stage TEXT REFERENCES pipeline_stages(id),
  value NUMERIC(10,2) DEFAULT 0,
  probability INT DEFAULT 50,
  title TEXT NOT NULL,
  ai_reason TEXT,
  days_in_stage INT DEFAULT 0,
  platform TEXT DEFAULT 'instagram',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT now(),
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  brand_voice JSONB DEFAULT '{"tone":"friendly-professional","emojiUsage":"moderate","language":"pt-br","signOff":"Equipe NexaCore","responseStyle":"consultive"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  platform TEXT DEFAULT 'both',
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO automations (name, trigger, action, active, platform) VALUES
  ('Boas-vindas automática', 'novo_lead', 'enviar_mensagem', true, 'both'),
  ('Follow-up 48h', 'sem_resposta_48h', 'enviar_followup', true, 'both'),
  ('Alerta lead esfriando', 'pulse_score_baixo', 'notificar_equipe', true, 'both'),
  ('Mover pipeline automático', 'conversa_qualificada', 'mover_estagio', false, 'both')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent',
  email TEXT,
  avatar TEXT,
  initials TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO settings (id, brand_voice) VALUES (1, '{"tone":"friendly-professional","emojiUsage":"moderate","language":"pt-br","signOff":"Equipe NexaCore","responseStyle":"consultive"}') ON CONFLICT (id) DO NOTHING;

INSERT INTO team_members (name, role, email, initials, active) VALUES
  ('Admin NexaCore', 'admin', 'admin@nexacore.com', 'AN', true)
ON CONFLICT DO NOTHING;
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = req.headers['x-setup-key'];
  if (key !== process.env.SETUP_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = new Client({
    host: process.env.SUPABASE_DB_HOST,
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(SQL);
    await client.end();
    res.status(200).json({ success: true, message: 'Schema created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
