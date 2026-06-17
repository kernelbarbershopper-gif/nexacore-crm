/* ═══════════════════════════════════════════════════════════════
   CRM Intelligence — Sidebar Navigation
   ═══════════════════════════════════════════════════════════════ */

const NexaSidebar = {
  init() {
    this.render();
    this.setActiveItem();
    this.initMobileToggle();
  },

  render() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const unreadCount = NexaData.getUnreadCount();
    const currentPage = NexaApp.currentPage;

    sidebar.innerHTML = `
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="sidebar-brand-logo">${BrandConfig.logoLetter}</div>
        <div class="sidebar-brand-text">
          <div class="sidebar-brand-name">${BrandConfig.name}</div>
          <div class="sidebar-brand-tag">${BrandConfig.tagline}</div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="sidebar-section-label">Principal</div>

        <a href="index.html" class="sidebar-item ${currentPage === 'index' ? 'active' : ''}" data-page="index">
          <span class="sidebar-item-icon">${NexaApp.icons.home}</span>
          <span>Dashboard</span>
        </a>

        <a href="conversations.html" class="sidebar-item ${currentPage === 'conversations' ? 'active' : ''}" data-page="conversations">
          <span class="sidebar-item-icon">${NexaApp.icons.messageCircle}</span>
          <span>Conversas</span>
          ${unreadCount > 0 ? `<span class="sidebar-item-badge">${unreadCount}</span>` : ''}
        </a>

        <a href="pipeline.html" class="sidebar-item ${currentPage === 'pipeline' ? 'active' : ''}" data-page="pipeline">
          <span class="sidebar-item-icon">${NexaApp.icons.pipeline}</span>
          <span>Pipeline</span>
        </a>

        <a href="contacts.html" class="sidebar-item ${currentPage === 'contacts' ? 'active' : ''}" data-page="contacts">
          <span class="sidebar-item-icon">${NexaApp.icons.users}</span>
          <span>Contatos</span>
        </a>

        <div class="sidebar-section-label">Inteligência</div>

        <a href="analytics.html" class="sidebar-item ${currentPage === 'analytics' ? 'active' : ''}" data-page="analytics">
          <span class="sidebar-item-icon">${NexaApp.icons.chart}</span>
          <span>Analytics & IA</span>
        </a>

        <div class="sidebar-section-label">Sistema</div>

        <a href="settings.html" class="sidebar-item ${currentPage === 'settings' ? 'active' : ''}" data-page="settings">
          <span class="sidebar-item-icon">${NexaApp.icons.settings}</span>
          <span>Configurações</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="avatar avatar-sm" style="background: var(--gradient-primary);">AD</div>
          <div class="sidebar-brand-text">
            <div style="font-size: var(--text-sm); font-weight: 500;">Admin ${BrandConfig.name}</div>
            <div style="font-size: var(--text-xs); color: var(--text-tertiary);">${BrandConfig.email}</div>
          </div>
        </div>
      </div>
    `;
  },

  setActiveItem() {
    // Already handled in render via class check
  },

  initMobileToggle() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });

      // Close sidebar on outside click (mobile)
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !menuBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  }
};
