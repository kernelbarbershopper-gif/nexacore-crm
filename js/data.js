const SUPABASE_URL = 'https://lllrvopolytzyllnuvse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbHJ2b3BvbHl0enlsbG51dnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzE0MjcsImV4cCI6MjA5NzE0NzQyN30.MhEbWsQZiauzvn2QXUzwqGCYBMpEx3sqFwDKvmplx9o';

let _supabase = null;
try {
  _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('Supabase init error:', e);
}

function fmt(d) {
  if (!d) return null;
  return {
    id: d.id, name: d.name, email: d.email, phone: d.phone,
    avatar: d.avatar, initials: d.initials, platform: d.platform,
    handle: d.handle, status: d.status, tags: d.tags || [],
    score: d.score, pulseScore: d.pulse_score,
    lastContact: d.last_contact, lastMessage: d.last_message,
    city: d.city, company: d.company,
    dna: d.dna || { frequency: 50, emotion: 50, response: 50, interest: 50, loyalty: 50, influence: 50 },
    notes: d.notes, conversations: d.conversations || 0,
    totalSpent: Number(d.total_spent || 0), predictedValue: Number(d.predicted_value || 0),
    createdAt: d.created_at
  };
}

const NexaData = {
  contacts: [],
  conversations: [],
  deals: [],
  activities: [],
  settings: null,
  pipelineStages: [],
  automations: [],
  team: [],

  kpis: {
    totalLeads: { value: 0, trend: 0, period: '' },
    conversions: { value: 0, trend: 0, period: '' },
    revenue: { value: 0, trend: 0, period: '' },
    engagementScore: { value: 0, trend: 0, period: '' },
    activeConversations: { value: 0, trend: 0, period: '' },
    responseTime: { value: '0min', trend: 0, period: '' }
  },

  analytics: {
    revenueByMonth: [],
    conversationsByDay: [],
    sentimentDistribution: {},
    platformSplit: {},
    topMetrics: {}
  },

  ghostWriterResponses: {
    greeting: ['Oi! Tudo bem? Como posso ajudar?', 'Olá! Bem-vindo(a) à NexaCore!', 'E aí! Vamos conversar?'],
    pricing: ['Nossos planos começam em R$ 997/mês.', 'Ótima pergunta! Temos opções flexíveis.', 'Investimento a partir de R$ 997/mês.'],
    followUp: ['Passando para saber se teve dúvidas!', 'Conseguiu analisar a proposta?', 'Bom dia! Condição especial válida até sexta.'],
    objection: ['Entendo! Posso ajustar o pacote.', 'Compreendo! Quer ver o ROI?', 'Sem problemas! Que tal o Starter?'],
    closing: ['Perfeito! Vou preparar tudo.', 'Ótima decisão! Bem-vindo(a)!', 'Fechado! Bem-vindo ao time!']
  },

  async load() {
    try {
      const [contacts, conversations, deals, activities, stages, settings, automations, team] = await Promise.all([
        _supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        _supabase.from('conversations').select('*').order('last_activity', { ascending: false }),
        _supabase.from('deals').select('*'),
        _supabase.from('activities').select('*').order('time', { ascending: false }).limit(20),
        _supabase.from('pipeline_stages').select('*').order('sort_order', { ascending: true }),
        _supabase.from('settings').select('*').single(),
        _supabase.from('automations').select('*'),
        _supabase.from('team_members').select('*')
      ]);

      this.contacts = (contacts.data || []).map(fmt);
      this.conversations = conversations.data || [];
      this.deals = deals.data || [];
      this.activities = activities.data || [];
      this.pipelineStages = stages.data || [];
      this.settings = settings.data || null;
      this.automations = automations.data || [];
      this.team = team.data || [];

      this._computeKPIs();
      return true;
    } catch (e) {
      console.error('Failed to load data:', e);
      return false;
    }
  },

  _computeKPIs() {
    const totalLeads = this.contacts.filter(c => c.status === 'lead').length;
    const customers = this.contacts.filter(c => c.status === 'customer').length;
    const totalRevenue = this.contacts.reduce((s, c) => s + c.totalSpent, 0);
    const avgScore = this.contacts.length ? Math.round(this.contacts.reduce((s, c) => s + c.score, 0) / this.contacts.length) : 0;
    const activeConvs = this.conversations.filter(c => (c.messages || []).length > 0).length;
    const unread = this.conversations.reduce((s, c) => s + (c.unread || 0), 0);

    this.kpis = {
      totalLeads: { value: totalLeads, trend: 0, period: 'total' },
      conversions: { value: customers, trend: 0, period: 'total' },
      revenue: { value: totalRevenue, trend: 0, period: 'total' },
      engagementScore: { value: avgScore, trend: 0, period: 'médio' },
      activeConversations: { value: activeConvs, trend: 0, period: 'ativas' },
      responseTime: { value: 'em tempo real', trend: 0, period: '' }
    };
  },

  async getContact(id) {
    const cached = this.contacts.find(c => c.id === id);
    if (cached) return cached;
    const { data } = await _supabase.from('contacts').select('*').eq('id', id).single();
    return fmt(data);
  },

  async getConversation(id) {
    const cached = this.conversations.find(c => c.id === id);
    if (cached) return cached;
    const { data } = await _supabase.from('conversations').select('*').eq('id', id).single();
    return data;
  },

  getConversationByContact(contactId) {
    return this.conversations.find(c => c.contact_id === contactId) || null;
  },

  getDealsForStage(stageId) {
    return this.deals.filter(d => d.stage === stageId);
  },

  getTotalPipelineValue() {
    return this.deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  },

  getUnreadCount() {
    return this.conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
  },

  async createContact(contact) {
    const { data, error } = await _supabase.from('contacts').insert([contact]).select().single();
    if (!error && data) { this.contacts.unshift(fmt(data)); return fmt(data); }
    throw error;
  },

  async updateContact(id, updates) {
    const { data, error } = await _supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (!error && data) {
      const idx = this.contacts.findIndex(c => c.id === id);
      if (idx >= 0) this.contacts[idx] = fmt(data);
      return fmt(data);
    }
    throw error;
  },

  async deleteContact(id) {
    await _supabase.from('conversations').delete().eq('contact_id', id);
    await _supabase.from('deals').delete().eq('contact_id', id);
    const { error } = await _supabase.from('contacts').delete().eq('id', id);
    if (!error) { this.contacts = this.contacts.filter(c => c.id !== id); return true; }
    throw error;
  },

  async createConversation(conv) {
    const { data, error } = await _supabase.from('conversations').insert([conv]).select().single();
    if (!error && data) { this.conversations.unshift(data); return data; }
    throw error;
  },

  async addMessage(conversationId, message) {
    const conv = this.conversations.find(c => c.id === conversationId);
    const messages = [...(conv?.messages || []), message];
    const { data, error } = await _supabase.from('conversations').update({
      messages, last_activity: new Date().toISOString()
    }).eq('id', conversationId).select().single();
    if (!error && data) {
      const idx = this.conversations.findIndex(c => c.id === conversationId);
      if (idx >= 0) this.conversations[idx] = data;
      return data;
    }
    throw error;
  },

  async createDeal(deal) {
    const { data, error } = await _supabase.from('deals').insert([deal]).select().single();
    if (!error && data) { this.deals.push(data); return data; }
    throw error;
  },

  async updateDeal(id, updates) {
    const { data, error } = await _supabase.from('deals').update(updates).eq('id', id).select().single();
    if (!error && data) {
      const idx = this.deals.findIndex(d => d.id === id);
      if (idx >= 0) this.deals[idx] = data;
      return data;
    }
    throw error;
  },

  async createActivity(activity) {
    const { data, error } = await _supabase.from('activities').insert([activity]).select().single();
    if (!error && data) { this.activities.unshift(data); return data; }
    throw error;
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  },

  formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  timeAgo(dateStr) {
    if (!dateStr) return '';
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

async function initNexaData() {
  await NexaData.load();
}
