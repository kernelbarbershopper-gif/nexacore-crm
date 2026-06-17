const SUPABASE_URL = 'https://lllrvopolytzyllnuvse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbHJ2b3BvbHl0enlsbG51dnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzE0MjcsImV4cCI6MjA5NzE0NzQyN30.MhEbWsQZiauzvn2QXUzwqGCYBMpEx3sqFwDKvmplx9o';

let supabase = null;

try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('Supabase init error:', e);
}

const NexaDB = {
  /* ── Contacts ── */
  async getContacts(filters = {}) {
    let query = supabase.from('contacts').select('*');
    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    const sortField = filters.sort || 'created_at';
    const sortDir = sortField === 'score_desc' ? { field: 'score', dir: false } :
                    sortField === 'value_desc' ? { field: 'predicted_value', dir: false } :
                    { field: 'created_at', dir: false };
    query = query.order(sortField === 'recent' ? 'created_at' : sortDir.field, { ascending: sortDir.dir });
    const { data, error } = await query;
    if (error) throw error;
    return data.map(formatContact);
  },

  async getContact(id) {
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single();
    if (error) throw error;
    return formatContact(data);
  },

  async createContact(contact) {
    const { data, error } = await supabase.from('contacts').insert([contact]).select().single();
    if (error) throw error;
    return formatContact(data);
  },

  async updateContact(id, updates) {
    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return formatContact(data);
  },

  async deleteContact(id) {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /* ── Conversations ── */
  async getConversations() {
    const { data, error } = await supabase.from('conversations').select('*').order('last_activity', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getConversation(id) {
    const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getConversationByContact(contactId) {
    const { data, error } = await supabase.from('conversations').select('*').eq('contact_id', contactId).single();
    if (error) return null;
    return data;
  },

  async createConversation(conv) {
    const { data, error } = await supabase.from('conversations').insert([conv]).select().single();
    if (error) throw error;
    return data;
  },

  async updateConversation(id, updates) {
    const { data, error } = await supabase.from('conversations').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async addMessage(conversationId, message) {
    const conv = await this.getConversation(conversationId);
    const messages = [...(conv.messages || []), message];
    const { data, error } = await supabase.from('conversations').update({ messages, last_activity: new Date().toISOString() }).eq('id', conversationId).select().single();
    if (error) throw error;
    return data;
  },

  /* ── Deals ── */
  async getDeals() {
    const { data, error } = await supabase.from('deals').select('*');
    if (error) throw error;
    return data;
  },

  async getDealsForStage(stageId) {
    const { data, error } = await supabase.from('deals').select('*').eq('stage', stageId);
    if (error) throw error;
    return data;
  },

  async createDeal(deal) {
    const { data, error } = await supabase.from('deals').insert([deal]).select().single();
    if (error) throw error;
    return data;
  },

  async updateDeal(id, updates) {
    const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteDeal(id) {
    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getTotalPipelineValue() {
    const { data, error } = await supabase.from('deals').select('value');
    if (error) throw error;
    return data.reduce((sum, d) => sum + Number(d.value), 0);
  },

  /* ── Pipeline Stages ── */
  async getPipelineStages() {
    const { data, error } = await supabase.from('pipeline_stages').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  /* ── Activities ── */
  async getActivities() {
    const { data, error } = await supabase.from('activities').select('*').order('time', { ascending: false }).limit(20);
    if (error) throw error;
    return data;
  },

  async createActivity(activity) {
    const { data, error } = await supabase.from('activities').insert([activity]).select().single();
    if (error) throw error;
    return data;
  },

  /* ── Settings ── */
  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*').single();
    if (error) throw error;
    return data;
  },

  async updateSettings(updates) {
    const { data, error } = await supabase.from('settings').update(updates).eq('id', 1).select().single();
    if (error) throw error;
    return data;
  },

  /* ── Automations ── */
  async getAutomations() {
    const { data, error } = await supabase.from('automations').select('*');
    if (error) throw error;
    return data;
  },

  async updateAutomation(id, updates) {
    const { data, error } = await supabase.from('automations').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  /* ── Team Members ── */
  async getTeam() {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error) throw error;
    return data;
  },

  /* ── Utility ── */
  async getUnreadCount() {
    const { data, error } = await supabase.from('conversations').select('unread');
    if (error) throw error;
    return data.reduce((sum, c) => sum + (c.unread || 0), 0);
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  },

  formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
    return date.toLocaleDateString('pt-BR');
  },

  formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
};

function formatContact(data) {
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    initials: data.initials,
    platform: data.platform,
    handle: data.handle,
    status: data.status,
    tags: data.tags || [],
    score: data.score,
    pulseScore: data.pulse_score,
    lastContact: data.last_contact,
    lastMessage: data.last_message,
    city: data.city,
    company: data.company,
    dna: data.dna || { frequency: 50, emotion: 50, response: 50, interest: 50, loyalty: 50, influence: 50 },
    notes: data.notes,
    conversations: data.conversations || 0,
    totalSpent: Number(data.total_spent || 0),
    predictedValue: Number(data.predicted_value || 0),
    createdAt: data.created_at
  };
}
