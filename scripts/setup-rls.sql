-- ============================================================
-- NexaCore CRM - Row Level Security (RLS) Policies
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS PARA CONTACTS
-- ============================================================
-- Usuários autenticados podem ver todos os contatos
CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

-- Usuários autenticados podem inserir contatos
CREATE POLICY "Authenticated users can insert contacts" ON contacts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Usuários autenticados podem atualizar contatos
CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Apenas admins podem deletar contatos
CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA CONVERSATIONS
-- ============================================================
CREATE POLICY "Authenticated users can view conversations" ON conversations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert conversations" ON conversations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update conversations" ON conversations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete conversations" ON conversations
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA DEALS
-- ============================================================
CREATE POLICY "Authenticated users can view deals" ON deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert deals" ON deals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update deals" ON deals
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete deals" ON deals
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA PIPELINE_STAGES (read-only para não-admins)
-- ============================================================
CREATE POLICY "Authenticated users can view stages" ON pipeline_stages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage stages" ON pipeline_stages
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA ACTIVITIES
-- ============================================================
CREATE POLICY "Authenticated users can view activities" ON activities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert activities" ON activities
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- POLÍTICAS PARA SETTINGS (apenas admins podem modificar)
-- ============================================================
CREATE POLICY "Authenticated users can view settings" ON settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA AUTOMATIONS
-- ============================================================
CREATE POLICY "Authenticated users can view automations" ON automations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage automations" ON automations
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- POLÍTICAS PARA TEAM_MEMBERS
-- ============================================================
-- Todos autenticados podem ver a equipe
CREATE POLICY "Authenticated users can view team" ON team_members
  FOR SELECT TO authenticated USING (true);

-- Apenas admins podem gerenciar equipe
CREATE POLICY "Admins can manage team" ON team_members
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usuário pode ver e atualizar próprio perfil
CREATE POLICY "Users can view own profile" ON team_members
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON team_members
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ============================================================
-- FUNÇÃO AUXILIAR: Verificar se é admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- POLÍTICAS ALTERNATIVAS USANDO A FUNÇÃO (mais limpo)
-- ============================================================
-- Exemplo para usar a função:
-- CREATE POLICY "Admins only" ON tabela
--   FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ============================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;