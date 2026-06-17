/* ═══════════════════════════════════════════════════════════════
   CRM Intelligence — Authentication Module
   Supabase Auth integration with session management
   ═══════════════════════════════════════════════════════════════ */

const NexaAuth = {
  currentUser: null,
  currentSession: null,

  async init() {
    const { data: { session } } = await _supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user || null;

    _supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session;
      this.currentUser = session?.user || null;
      this.onAuthStateChange(event, session);
    });

    return this.currentUser;
  },

  onAuthStateChange(event, session) {
    const publicPages = ['login.html', 'register.html', ''];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!session && !publicPages.includes(currentPage)) {
      window.location.href = 'login.html';
    } else if (session && (currentPage === 'login.html' || currentPage === 'register.html')) {
      window.location.href = 'index.html';
    }

    if (session) {
      this.loadUserProfile(session.user.id);
    }
  },

  async loadUserProfile(userId) {
    try {
      const { data } = await _supabase
        .from('team_members')
        .select('*')
        .eq('id', userId)
        .single();
      this.userProfile = data;
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.name || '',
          role: metadata.role || 'agent'
        }
      }
    });

    if (error) throw error;

    if (data.user && !data.session) {
      await this.createTeamMember(data.user.id, metadata);
    }

    return data;
  },

  async createTeamMember(userId, metadata) {
    const { error } = await _supabase.from('team_members').insert({
      id: userId,
      name: metadata.name,
      email: metadata.email,
      role: metadata.role || 'agent',
      initials: metadata.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US',
      active: true
    });

    if (error) throw error;
  },

  async signIn(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    this.currentUser = null;
    this.currentSession = null;
    this.userProfile = null;
    window.location.href = 'login.html';
  },

  async resetPassword(email) {
    const { error } = await _supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });
    if (error) throw error;
  },

  async updatePassword(newPassword) {
    const { error } = await _supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  getUser() {
    return this.currentUser;
  },

  getProfile() {
    return this.userProfile;
  },

  isAdmin() {
    return this.userProfile?.role === 'admin';
  },

  requireAuth() {
    if (!this.currentUser) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.requireAuth()) return false;
    if (!this.isAdmin()) {
      NexaApp.showToast('Acesso negado: apenas administradores', 'error');
      return false;
    }
    return true;
  }
};

async function initNexaAuth() {
  await NexaAuth.init();
}