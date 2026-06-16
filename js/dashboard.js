// Called from index.html after data loads

function getMockKPIs() {
    return [
        { id: 'leads', title: 'Total Leads', value: '12,450', trend: 12.5, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
        { id: 'conversions', title: 'Conversões', value: '3,820', trend: 8.2, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' },
        { id: 'revenue', title: 'Receita', value: 'R$ 485K', trend: 15.4, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' },
        { id: 'engagement', title: 'Score de Engajamento', value: '94%', trend: 2.1, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' }
    ];
}

function renderKPIs() {
    const kpiContainer = document.getElementById('kpiContainer');
    if (!kpiContainer) return;

    let kpisData = [];
    if (window.NexaData && window.NexaData.kpis) {
        kpisData = window.NexaData.kpis;
    } else {
        kpisData = getMockKPIs();
    }

    kpiContainer.innerHTML = '';

    kpisData.forEach((kpi, index) => {
        const isPositive = kpi.trend >= 0;
        const trendClass = isPositive ? 'positive' : 'negative';
        const trendIcon = isPositive ? 
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' : 
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>';
        
        let iconHtml = kpi.icon;
        if (!iconHtml) {
            iconHtml = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
        }

        const card = document.createElement('div');
        card.className = `kpi-card animate-fade-in-up`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="kpi-header">
                <h3 class="kpi-title">${kpi.title}</h3>
                <div class="kpi-icon">
                    ${iconHtml}
                </div>
            </div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-trend ${trendClass}">
                ${trendIcon}
                <span>${Math.abs(kpi.trend)}%</span>
            </div>
        `;
        
        kpiContainer.appendChild(card);
    });
}

function getMockMapData() {
    const nodes = [];
    for (let i = 0; i < 50; i++) {
        nodes.push({
            id: i,
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.002,
            vy: (Math.random() - 0.5) * 0.002,
            active: Math.random() > 0.8
        });
    }
    const links = [];
    for (let i = 0; i < 60; i++) {
        links.push({
            source: Math.floor(Math.random() * nodes.length),
            target: Math.floor(Math.random() * nodes.length),
            strength: Math.random()
        });
    }
    return { nodes, links };
}

function initNeuralMap() {
    const canvas = document.getElementById('neuralMapCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    let mapData;
    if (window.NexaAI && typeof window.NexaAI.generateNeuralMapData === 'function') {
        mapData = window.NexaAI.generateNeuralMapData();
    } else {
        mapData = getMockMapData();
    }

    const { nodes, links } = mapData;

    function resize() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    nodes.forEach(n => {
        n.px = n.x * width;
        n.py = n.y * height;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > 1) n.vx *= -1;
            if (n.y < 0 || n.y > 1) n.vy *= -1;

            n.px = n.x * width;
            n.py = n.y * height;
            
            if (Math.random() < 0.01) n.active = !n.active;
        });

        links.forEach(l => {
            const source = nodes[l.source];
            const target = nodes[l.target];
            
            if (!source || !target) return;

            const dx = source.px - target.px;
            const dy = source.py - target.py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                const alpha = (1 - dist / 200) * 0.3 * l.strength;
                ctx.beginPath();
                ctx.moveTo(source.px, source.py);
                ctx.lineTo(target.px, target.py);
                
                if (source.active && target.active) {
                    ctx.strokeStyle = `rgba(138, 43, 226, ${alpha * 2})`;
                    ctx.lineWidth = 1.5;
                } else if (source.active || target.active) {
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 1.5})`;
                    ctx.lineWidth = 1;
                } else {
                    ctx.strokeStyle = `rgba(100, 100, 150, ${alpha})`;
                    ctx.lineWidth = 0.5;
                }
                ctx.stroke();
            }
        });

        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.px, n.py, n.size, 0, Math.PI * 2);
            if (n.active) {
                ctx.fillStyle = '#8a2be2';
                ctx.shadowColor = '#8a2be2';
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

function initRevenueOracle() {
    const valueEl = document.getElementById('oracleValue');
    const trendEl = document.getElementById('oracleTrend');
    
    let targetValue = 1250000;
    if (window.NexaData && window.NexaData.kpis) {
        const rev = window.NexaData.kpis.find(k => k.id === 'revenue');
        if (rev) {
            targetValue = parseFloat(rev.value.replace(/[^0-9.]/g, '')) * 1000;
        }
    }
    targetValue = targetValue * 1.24;

    let currentValue = 0;
    const duration = 2000;
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = targetValue / steps;

    const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(interval);
        }
        
        valueEl.textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(currentValue);
    }, 1000 / fps);
    
    trendEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        <span>+24% esperado</span>
    `;
}

function getMockActivities() {
    return [
        { type: 'whatsapp', title: 'Novo Lead', desc: 'João Silva iniciou conversa', time: 'Há 2 min' },
        { type: 'system', title: 'Conversão', desc: 'Venda de Plano Pro via IA', time: 'Há 15 min' },
        { type: 'instagram', title: 'Engajamento', desc: 'Maria curtiu e comentou no post', time: 'Há 45 min' },
        { type: 'whatsapp', title: 'Lead Quente', desc: 'IA identificou intenção de compra (98%)', time: 'Há 1 hora' },
        { type: 'system', title: 'Relatório', desc: 'Sumário diário gerado e enviado', time: 'Há 2 horas' }
    ];
}

function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;

    let activities = [];
    if (window.NexaData && window.NexaData.activities) {
        activities = window.NexaData.activities;
    } else {
        activities = getMockActivities();
    }

    feed.innerHTML = '';

    activities.forEach((activity, index) => {
        let iconHtml = '';
        if (activity.type === 'whatsapp') {
            iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
        } else if (activity.type === 'instagram') {
            iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';
        } else {
            iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>';
        }

        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${activity.type}">
                ${iconHtml}
            </div>
            <div class="activity-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h4 class="activity-title">${activity.title}</h4>
                    <span class="activity-time">${activity.time}</span>
                </div>
                <p class="activity-desc">${activity.desc}</p>
            </div>
        `;
        
        feed.appendChild(item);
    });
}
