/* ═══════════════════════════════════════════════════════════════
   NexaCore CRM — Contacts Module
   ═══════════════════════════════════════════════════════════════ */

function renderContactsModule() {
  if (!window.NexaAI) window.NexaAI = {};
  if (!NexaAI.generateDNAProfile) {
    NexaAI.generateDNAProfile = function(canvas, dna) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 40;

      ctx.clearRect(0, 0, w, h);

      const attributes = [
        { label: 'Frequência', val: dna.frequency || 50 },
        { label: 'Emoção', val: dna.emotion || 50 },
        { label: 'Resposta', val: dna.response || 50 },
        { label: 'Interesse', val: dna.interest || 50 },
        { label: 'Lealdade', val: dna.loyalty || 50 },
        { label: 'Influência', val: dna.influence || 50 }
      ];

      const sides = attributes.length;
      const angleStep = (Math.PI * 2) / sides;

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let level = 1; level <= 5; level++) {
        const r = radius * (level / 5);
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw Axes & Labels
      ctx.font = '11px Inter';
      ctx.fillStyle = '#8892a8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        const lx = cx + Math.cos(angle) * (radius + 25);
        const ly = cy + Math.sin(angle) * (radius + 25);
        ctx.fillText(attributes[i].label, lx, ly);
      }

      // Draw Data Polygon
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const val = attributes[i].val / 100;
        const x = cx + Math.cos(angle) * (radius * val);
        const y = cy + Math.sin(angle) * (radius * val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(108, 92, 231, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Data Points
      ctx.fillStyle = '#f472b6';
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const val = attributes[i].val / 100;
        const x = cx + Math.cos(angle) * (radius * val);
        const y = cy + Math.sin(angle) * (radius * val);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  }

  // --- Filter and Search Logic ---
  const grid = document.getElementById('contactsGrid');
  const searchInput = document.getElementById('globalSearch');
  const platformFilter = document.getElementById('platformFilter');
  const statusFilter = document.getElementById('statusFilter');
  const sortFilter = document.getElementById('sortFilter');

  function renderContacts() {
    if (!grid) return;
    grid.innerHTML = '';
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const pf = platformFilter ? platformFilter.value : 'all';
    const sf = statusFilter ? statusFilter.value : 'all';
    const sort = sortFilter ? sortFilter.value : 'recent';

    let filtered = (NexaData && NexaData.contacts) ? [...NexaData.contacts] : [];
    
    filtered = filtered.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(query) || (c.email && c.email.toLowerCase().includes(query));
      const matchPlatform = pf === 'all' || c.platform === pf;
      const matchStatus = sf === 'all' || c.status === sf;
      return matchSearch && matchPlatform && matchStatus;
    });

    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'score_desc') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sort === 'value_desc') {
      filtered.sort((a, b) => b.predictedValue - a.predictedValue);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-secondary);">Nenhum contato encontrado.</div>`;
      return;
    }

    filtered.forEach((contact, i) => {
      const card = document.createElement('div');
      card.className = 'contact-card glass-card';
      card.style.animationDelay = `${i * 0.05}s`;
      card.classList.add('animate-fade-in-up');
      
      const badgeClass = contact.platform === 'whatsapp' ? 'whatsapp' : 'instagram';
      let iconSvg = '';
      if (contact.platform === 'whatsapp') {
        iconSvg = `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>`;
      } else {
        iconSvg = `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`;
      }
      
      const tagsHtml = (contact.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

      card.innerHTML = `
        <div class="contact-card-header">
          <div class="contact-avatar">${contact.initials}</div>
          <div class="contact-info">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-handle">
              <svg class="platform-icon ${badgeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${iconSvg}
              </svg>
              ${contact.handle}
            </div>
          </div>
        </div>
        <div class="contact-score-badge">Score: ${contact.score}</div>
        <div class="contact-card-body">
          <div class="contact-status-tags">
            <span class="tag" style="background: var(--primary-glow); border-color: var(--primary-500); color: #e8ecf4;">${(contact.status||'').toUpperCase()}</span>
            ${tagsHtml}
          </div>
          <div class="contact-meta">
            <div class="meta-item">
              <span class="meta-label">Predito</span>
              <span class="meta-value">R$ ${((contact.predictedValue||0)/1000).toFixed(1)}k</span>
            </div>
            <div class="meta-item" style="text-align: right;">
              <span class="meta-label">Conversas</span>
              <span class="meta-value">${contact.conversations||0}</span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProfile(contact));
      grid.appendChild(card);
    });
  }

  // Bind events
  if (searchInput) searchInput.addEventListener('input', renderContacts);
  if (platformFilter) platformFilter.addEventListener('change', renderContacts);
  if (statusFilter) statusFilter.addEventListener('change', renderContacts);
  if (sortFilter) sortFilter.addEventListener('change', renderContacts);

  // --- Profile Panel Logic ---
  const overlay = document.getElementById('profilePanelOverlay');
  const closeBtn = document.getElementById('closeProfileBtn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  }

  function generateHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    container.innerHTML = '';
  }

  function openProfile(contact) {
    if (!overlay) return;
    document.getElementById('profileAvatar').textContent = contact.initials;
    document.getElementById('profileName').textContent = contact.name;
    document.getElementById('profileHandle').textContent = contact.handle;
    document.getElementById('profileScore').textContent = contact.score;
    document.getElementById('profilePredicted').textContent = `R$ ${(contact.predictedValue/1000).toFixed(1)}k`;
    document.getElementById('profileSpent').textContent = `R$ ${(contact.totalSpent/1000).toFixed(1)}k`;
    
    document.getElementById('profileEmail').textContent = contact.email || '--';
    document.getElementById('profilePhone').textContent = contact.phone || '--';
    document.getElementById('profileCity').textContent = contact.city || '--';
    document.getElementById('profileCompany').textContent = contact.company || '--';
    
    document.getElementById('profileNotes').textContent = contact.notes || 'Sem notas.';

    // Badges
    const badgesContainer = document.getElementById('profileBadges');
    if (badgesContainer) {
      badgesContainer.innerHTML = `<span class="tag" style="background: var(--primary-glow); border-color: var(--primary-500); color: #e8ecf4;">${(contact.status||'').toUpperCase()}</span>` +
                                  (contact.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    }

    // DNA Chart
    const canvas = document.getElementById('dnaCanvas');
    if (canvas && contact.dna) {
      NexaAI.generateDNAProfile(canvas, contact.dna);
    }

    // Heatmap
    generateHeatmap();

    overlay.classList.add('active');
  }

  renderContacts();
}
