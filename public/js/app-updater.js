// ═══════════════════════════════════════════════════════════════
// NexaCore CRM — Auto Updater
// ═══════════════════════════════════════════════════════════════

const AppUpdater = {
  currentVersion: '1.0.0.1',
  checkUrl: 'https://nexacore-crm.vercel.app/version.json',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nexacore.crm',
  checkInterval: 24 * 60 * 60 * 1000, // 24h

  async checkForUpdate() {
    try {
      const response = await fetch(this.checkUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error('Failed to fetch version');
      
      const data = await response.json();
      const latestVersion = data.version;
      
      if (this.isNewerVersion(latestVersion, this.currentVersion)) {
        this.showUpdatePrompt(data);
        return { updateAvailable: true, latestVersion, data };
      }
      
      return { updateAvailable: false, currentVersion: this.currentVersion };
    } catch (error) {
      console.warn('Update check failed:', error);
      return { updateAvailable: false, error: error.message };
    }
  },

  isNewerVersion(latest, current) {
    const l = latest.split('.').map(Number);
    const c = current.split('.').map(Number);
    
    for (let i = 0; i < Math.max(l.length, c.length); i++) {
      const lv = l[i] || 0;
      const cv = c[i] || 0;
      if (lv > cv) return true;
      if (lv < cv) return false;
    }
    return false;
  },

  showUpdatePrompt(data) {
    const isCritical = data.critical === true;
    const message = data.message || `Nova versão ${data.version} disponível!`;
    
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal" style="max-width: 400px; text-align: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--gradient-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">⬆️</div>
        <h3 style="margin-bottom: 8px;">Atualização Disponível</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;">${message}</p>
        <p style="font-size: 13px; color: var(--text-tertiary); margin-bottom: 24px;">Versão atual: ${this.currentVersion} → Nova: ${data.version}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          ${!isCritical ? '<button class="btn btn-ghost btn-sm" id="updateLater">Agora não</button>' : ''}
          <a href="${this.playStoreUrl}" target="_blank" class="btn btn-primary btn-sm" id="updateNow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Atualizar
          </a>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    if (!isCritical) {
      modal.querySelector('#updateLater').addEventListener('click', () => {
        modal.remove();
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (!isCritical) modal.remove();
      }
    });
  },

  init() {
    if (!window.Capacitor || !Capacitor.isNativePlatform()) return;
    
    this.checkForUpdate();
    
    setInterval(() => this.checkForUpdate(), this.checkInterval);
    
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.checkForUpdate();
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppUpdater;
} else {
  window.AppUpdater = AppUpdater;
}