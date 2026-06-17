let activeConversationId = null;
let contactListEl, chatHeaderEl, chatMessagesEl, ghostWriterPanelEl, dnaProfileEl, sendBtn, chatInput, btnFilters;

function initConversations() {
    contactListEl = document.getElementById('contactList');
    chatHeaderEl = document.getElementById('chatHeader');
    chatMessagesEl = document.getElementById('chatMessages');
    ghostWriterPanelEl = document.getElementById('ghostWriterPanel');
    dnaProfileEl = document.getElementById('dnaProfile');
    sendBtn = document.getElementById('sendBtn');
    chatInput = document.getElementById('chatInput');
    btnFilters = document.querySelectorAll('.btn-filter');

    activeConversationId = (NexaData.conversations && NexaData.conversations[0]?.id) || null;
    renderContactList('all');
    if (activeConversationId) {
        selectConversation(activeConversationId);
    }
    setupEventListeners();
}

function setupEventListeners() {
    btnFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnFilters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filterMap = { 'Todas': 'all', 'WhatsApp': 'whatsapp', 'Instagram': 'instagram' };
            renderContactList(filterMap[e.target.innerText]);
        });
    });

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function renderContactList(filter = 'all') {
    contactListEl.innerHTML = '';
    const filtered = NexaData.conversations.filter(c => filter === 'all' || c.platform === filter);
    
    if (filtered.length === 0 && contactListEl) {
        contactListEl.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-secondary)">Nenhuma conversa ainda. Contatos aparecerão aqui quando houver mensagens.</div>';
        return;
    }

    filtered.forEach(contact => {
        const item = document.createElement('div');
        item.className = `contact-item ${contact.id === activeConversationId ? 'active' : ''}`;
        item.onclick = () => selectConversation(contact.id);

        const badgeHtml = contact.unread > 0 ? `<span class="unread-badge">${contact.unread}</span>` : '';
        const sentimentClass = `sentiment-${contact.sentiment}`;
        
        item.innerHTML = `
            <div class="contact-avatar-wrapper">
                <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
                <div class="platform-indicator ${contact.platform}">
                    ${getPlatformIcon(contact.platform)}
                </div>
            </div>
            <div class="contact-info">
                <div class="contact-header-row">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-time">${contact.time}</span>
                </div>
                <div class="contact-last-msg-row">
                    <span class="contact-last-msg">${contact.lastMessage}</span>
                    <div style="display:flex; align-items:center; gap:0.5rem">
                        ${badgeHtml}
                        <div class="sentiment-indicator ${sentimentClass}" title="Sentimento ${contact.sentiment}"></div>
                    </div>
                </div>
            </div>
        `;
        contactListEl.appendChild(item);
    });
}

function selectConversation(id) {
    activeConversationId = id;
    
    // Update active state in sidebar
    const items = contactListEl.querySelectorAll('.contact-item');
    items.forEach(item => item.classList.remove('active'));
    
    // A bit hacky to re-render everything just for active state, let's just re-render cleanly
    const currentFilter = document.querySelector('.btn-filter.active').innerText;
    const filterMap = { 'Todas': 'all', 'WhatsApp': 'whatsapp', 'Instagram': 'instagram' };
    renderContactList(filterMap[currentFilter]);
    
    const contact = NexaData.conversations.find(c => c.id === id);
    if (!contact) return;

    // Reset unread locally when selected
    contact.unread = 0;

    // Mobile view: show chat, hide sidebar
    const sidebar = document.querySelector('.chat-sidebar');
    const chatMain = document.querySelector('.chat-main');
    if (window.innerWidth <= 768 && sidebar && chatMain) {
        sidebar.style.display = 'none';
        chatMain.style.display = 'flex';
    }

    // Render Header
    chatHeaderEl.innerHTML = `
        <button class="btn-icon btn-ghost mobile-chat-back" onclick="backToChatList()" style="display:none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="contact-avatar-wrapper">
            <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar" style="width:40px;height:40px;">
        </div>
        <div class="chat-header-info">
            <h2 class="chat-header-name">${contact.name} <div class="sentiment-indicator sentiment-${contact.sentiment}" title="Sentimento ${contact.sentiment}"></div></h2>
            <span class="chat-header-status">${contact.status === 'online' ? '<span class="text-success">● Online</span>' : 'Visto por último: ' + contact.time} | via ${contact.platform}</span>
        </div>
        <div class="chat-actions">
            <button class="btn-icon btn-ghost"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
            <button class="btn-icon btn-ghost"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
        </div>
    `;
    // Show back button on mobile
    if (window.innerWidth <= 768) {
        const backBtn = chatHeaderEl.querySelector('.mobile-chat-back');
        if (backBtn) backBtn.style.display = 'flex';
    }

    // Render Messages
    chatMessagesEl.innerHTML = '';
    (contact.messages || []).forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.sender === 'agent' ? 'sent' : 'received'}`;
        msgEl.innerHTML = `
            <div class="message-bubble">${msg.text}</div>
            <span class="message-time">${msg.time || ''}</span>
        `;
        chatMessagesEl.appendChild(msgEl);
    });
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    // Render Ghost Writer Loading State
    ghostWriterPanelEl.innerHTML = `
        <div style="display:flex; gap:8px; padding:10px; color:var(--text-muted); align-items:center; width:100%; justify-content:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            NVIDIA AI pensando...
        </div>
    `;

    // Fetch async suggestions
    if (NexaAI.getGhostWriterSuggestionsAsync) {
        NexaAI.getGhostWriterSuggestionsAsync(contact, contact).then(suggestions => {
            ghostWriterPanelEl.innerHTML = '';
            suggestions.forEach(sug => {
                const btn = document.createElement('button');
                btn.className = 'ghost-suggestion';
                // sug.text instead of sug since it returns objects
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> ${sug.label}: ${sug.text.substring(0, 30)}...`;
                btn.title = sug.text;
                btn.onclick = () => {
                    chatInput.value = sug.text;
                    chatInput.focus();
                };
                ghostWriterPanelEl.appendChild(btn);
            });
        });
    }

    if (contact.dna) {
        const d = contact.dna;
        dnaProfileEl.innerHTML = `
            <div class="dna-section">
                <div class="dna-label">LTV (Lifetime Value)</div>
                <div class="dna-value" style="color:var(--primary-400); font-weight:600; font-size:1.125rem">${d.ltv || 'R$ 0'}</div>
            </div>
            <div class="dna-section">
                <div class="dna-label">Risco de Churn</div>
                <div class="dna-value ${(d.churnRisk || '').includes('Alto') ? 'text-danger' : 'text-success'}">${d.churnRisk || 'Baixo'}</div>
            </div>
            <div class="dna-section">
                <div class="dna-label">Perfil de Compra</div>
                <div class="dna-value">${d.profile || 'Regular'}</div>
            </div>
            <div class="dna-section">
                <div class="dna-label">Última Compra</div>
                <div class="dna-value">${d.lastPurchase || 'N/A'}</div>
            </div>
            <div class="dna-section">
                <div class="dna-label">Tags</div>
                <div class="dna-tags">
                    ${(d.tags || []).map(t => `<span class="dna-tag">${t}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Render Emotion Radar
    let emotions;
    if (NexaAI.getEmotionRadar) {
        // ai-engine.js version expects messages array
        emotions = NexaAI.getEmotionRadar(contact.messages);
    } else {
        emotions = { 'Alegria': 0.5, 'Interesse': 0.6, 'Confiança': 0.5, 'Urgência': 0.5, 'Frustração': 0.4 };
    }
    // Normalize to 0-1 for radar chart if values are 0-100
    for(let key in emotions) {
        if(emotions[key] > 1) emotions[key] = emotions[key] / 100;
    }
    drawRadarChart('emotionRadarCanvas', emotions);
}

function getPlatformIcon(platform) {
    if (platform === 'whatsapp') {
        return `<svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`;
    } else {
        return `<svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`;
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !activeConversationId) return;

    const contact = NexaData.conversations.find(c => c.id === activeConversationId);
    if (contact) {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        contact.messages.push({
            id: 'm' + Date.now(),
            sender: 'agent',
            text: text,
            time: timeString
        });
        
        contact.lastMessage = text;
        contact.time = timeString;
        
        // Re-render
        selectConversation(activeConversationId);
        chatInput.value = '';
    }
}

function drawRadarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Leaving room for labels
    const radius = Math.min(width, height) / 2 - 30;

    ctx.clearRect(0, 0, width, height);

    const labels = Object.keys(data);
    const values = Object.values(data);
    const numPoints = labels.length;
    const angleStep = (Math.PI * 2) / numPoints;

    // Draw background rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        for (let j = 0; j < numPoints; j++) {
            const r = radius * (i / 4);
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    for (let j = 0; j < numPoints; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Data Polygon
    ctx.beginPath();
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    
    for (let j = 0; j < numPoints; j++) {
        const r = radius * values[j];
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#fff';
    for (let j = 0; j < numPoints; j++) {
        const r = radius * values[j];
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw labels
    ctx.fillStyle = '#a1a1aa'; // var(--text-muted)
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let j = 0; j < numPoints; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const labelR = radius + 15;
        const x = centerX + Math.cos(angle) * labelR;
        const y = centerY + Math.sin(angle) * labelR;
        
        ctx.fillText(labels[j], x, y);
    }
}

function backToChatList() {
    const sidebar = document.querySelector('.chat-sidebar');
    const chatMain = document.querySelector('.chat-main');
    if (sidebar && chatMain) {
        sidebar.style.display = 'flex';
        chatMain.style.display = 'none';
    }
}

// Called from conversations.html after data loads
