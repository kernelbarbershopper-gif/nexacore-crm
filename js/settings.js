function initSettings() {
    if (!NexaData.settings) initMockSettingsData();
    setupTabs();
    setupIntegrations();
    setupGhostWriterForm();
    renderAutomations();
    renderTeam();
}

function initMockSettingsData() {
    window.NexaData = window.NexaData || {};
    NexaData.settings = NexaData.settings || {};
    
    // Ghost Writer defaults
    NexaData.settings.brandVoice = NexaData.settings.brandVoice || {
        voiceDescription: "Sempre educado, persuasivo e focado em converter leads. Use linguagem moderna.",
        tone: "professional",
        creativity: 70
    };

    // Automations defaults
    NexaData.settings.automations = NexaData.settings.automations || [
        { id: 1, name: "Boas-vindas WhatsApp", description: "Envia mensagem automática para novos leads do WhatsApp.", active: true, icon: "zap" },
        { id: 2, name: "Triagem Ghost Writer", description: "IA classifica o lead antes de passar para um humano.", active: true, icon: "cpu" },
        { id: 3, name: "Follow-up 24h", description: "Mensagem de acompanhamento caso o lead não responda.", active: false, icon: "clock" },
        { id: 4, name: "Distribuição de Leads", description: "Encaminha leads para a equipe via round-robin.", active: true, icon: "users" }
    ];

    // Team defaults
    NexaData.settings.team = NexaData.settings.team || [
        { id: 1, name: "Carlos Silva", email: "carlos@nexacore.com", role: "Admin", status: "Ativo" },
        { id: 2, name: "Mariana Costa", email: "mariana@nexacore.com", role: "Vendedor", status: "Ativo" },
        { id: 3, name: "João Pedro", email: "joao@nexacore.com", role: "Vendedor", status: "Ausente" },
        { id: 4, name: "Ana Lima", email: "ana@nexacore.com", role: "Suporte", status: "Offline" }
    ];
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupIntegrations() {
    const wppToggle = document.getElementById('toggle-whatsapp');
    const igToggle = document.getElementById('toggle-instagram');

    function updateStatus(toggle, type) {
        const card = toggle.closest('.integration-card');
        const statusEl = card.querySelector('.status');
        
        if (toggle.checked) {
            statusEl.className = 'status connected';
            statusEl.innerHTML = '<span class="indicator"></span>Conectado';
            showToast(`${type} conectado com sucesso!`);
        } else {
            statusEl.className = 'status disconnected';
            statusEl.innerHTML = '<span class="indicator"></span>Desconectado';
            showToast(`${type} desconectado.`);
        }
    }

    if(wppToggle) {
        wppToggle.addEventListener('change', () => updateStatus(wppToggle, 'WhatsApp'));
    }
    
    if(igToggle) {
        igToggle.addEventListener('change', () => updateStatus(igToggle, 'Instagram'));
    }
}

function setupGhostWriterForm() {
    const apiKeyInput = document.getElementById('nvidia-api-key');
    const voiceInput = document.getElementById('brand-voice');
    const toneSelect = document.getElementById('ai-tone');
    const creativityInput = document.getElementById('ai-creativity');
    const form = document.getElementById('ghostwriter-form');
    const btnTest = document.getElementById('btn-test-ai');

    // Load saved data
    if(localStorage.getItem('nvidiaApiKey')) {
        apiKeyInput.value = localStorage.getItem('nvidiaApiKey');
    }

    if(NexaData.settings.brandVoice) {
        voiceInput.value = NexaData.settings.brandVoice.voiceDescription || '';
        toneSelect.value = NexaData.settings.brandVoice.tone || 'professional';
        creativityInput.value = NexaData.settings.brandVoice.creativity || 70;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        localStorage.setItem('nvidiaApiKey', apiKeyInput.value.trim());

        NexaData.settings.brandVoice = {
            voiceDescription: voiceInput.value,
            tone: toneSelect.value,
            creativity: parseInt(creativityInput.value)
        };
        showToast("Personalidade da IA e API Key salvas com sucesso!");
    });

    btnTest.addEventListener('click', () => {
        showToast("Testando IA... Simulando resposta baseada nas configurações.");
    });
}

function renderAutomations() {
    const container = document.getElementById('automations-container');
    if(!container) return;

    container.innerHTML = '';

    NexaData.settings.automations.forEach(auto => {
        const item = document.createElement('div');
        item.className = 'automation-item';
        
        // Simple SVG mapping
        let svg = '';
        if(auto.icon === 'zap') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
        else if(auto.icon === 'cpu') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>';
        else if(auto.icon === 'clock') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
        else svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';

        item.innerHTML = `
            <div class="automation-info">
                <div class="automation-icon">${svg}</div>
                <div class="automation-text">
                    <h4>${auto.name}</h4>
                    <p>${auto.description}</p>
                </div>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" id="auto-${auto.id}" ${auto.active ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        `;
        
        container.appendChild(item);

        const toggle = item.querySelector('input');
        toggle.addEventListener('change', () => {
            auto.active = toggle.checked;
            showToast(`Automação "${auto.name}" ${auto.active ? 'ativada' : 'desativada'}.`);
        });
    });
}

function renderTeam() {
    const tbody = document.getElementById('team-table-body');
    if(!tbody) return;

    tbody.innerHTML = '';

    NexaData.settings.team.forEach(member => {
        const tr = document.createElement('tr');
        const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        let statusClass = 'disconnected'; // default mute
        if(member.status === 'Ativo') statusClass = 'connected';
        if(member.status === 'Ausente') statusClass = 'text-warning'; // optional

        const roleClass = member.role === 'Admin' ? 'admin' : '';

        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <div class="avatar">${initials}</div>
                    <span>${member.name}</span>
                </div>
            </td>
            <td>${member.email}</td>
            <td><span class="role-badge ${roleClass}">${member.role}</span></td>
            <td><span class="status ${statusClass}"><span class="indicator"></span>${member.status}</span></td>
            <td>
                <button class="action-btn" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Simple toast notification helper (assuming one doesn't exist globally, or we can use it safely)
function showToast(message) {
    // Basic toast implementation if not in app.js
    const existing = document.querySelector('.toast-notification');
    if(existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification animate-fade-in-up';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--bg-surface);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 12px 24px;
        border-radius: 8px;
        color: var(--text-primary);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
