function hexToRgb(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  return `${(num >> 16)}, ${(num >> 8) & 0xFF}, ${num & 0xFF}`;
}

function hexToRgba(hex, alpha) {
  return `rgba(${hexToRgb(hex)}, ${alpha})`;
}

function adjustHex(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const BrandConfig = {
  name: 'CRM Intelligence',
  logoLetter: 'C',
  tagline: 'Gestão Inteligente',
  email: 'admin@crmintelligence.com',
  company: 'CRM Intelligence',
  primaryColor: '#6c5ce7',
  primaryColor400: '#8b7cf6',
  primaryColor600: '#5a4bd1',
  primaryGlow: 'rgba(108, 92, 231, 0.25)',
  gradientPrimary: 'linear-gradient(135deg, #6c5ce7, #a855f7)',

  load() {
    try {
      const saved = localStorage.getItem('appBrandConfig');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(this, parsed);
      }
    } catch (e) { /* ignore */ }
  },

  save() {
    localStorage.setItem('appBrandConfig', JSON.stringify({
      name: this.name, logoLetter: this.logoLetter, tagline: this.tagline,
      email: this.email, company: this.company,
      primaryColor: this.primaryColor, primaryColor400: this.primaryColor400,
      primaryColor600: this.primaryColor600, primaryGlow: this.primaryGlow,
      gradientPrimary: this.gradientPrimary
    }));
  },

  applyCSS() {
    const root = document.documentElement;
    const rgb = hexToRgb(this.primaryColor);
    root.style.setProperty('--primary-300', adjustHex(this.primaryColor, 60));
    root.style.setProperty('--primary-400', this.primaryColor400);
    root.style.setProperty('--primary-500', this.primaryColor);
    root.style.setProperty('--primary-600', this.primaryColor600);
    root.style.setProperty('--primary-700', adjustHex(this.primaryColor, -40));
    root.style.setProperty('--primary-rgb', rgb);
    root.style.setProperty('--primary-glow', this.primaryGlow);
    root.style.setProperty('--gradient-primary', this.gradientPrimary);
  },

  setTitle(pageName) {
    document.title = `${pageName} — ${this.name}`;
  }
};
