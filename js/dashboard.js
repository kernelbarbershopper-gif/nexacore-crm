// Called from index.html after data loads

function renderKPIs() {
    const kpiContainer = document.getElementById('kpiContainer');
    if (!kpiContainer) return;

    const kpisData = (window.NexaData && window.NexaData.kpis) || {
        totalLeads: { value: 0, trend: 0, period: '' },
        conversions: { value: 0, trend: 0, period: '' },
        revenue: { value: 0, trend: 0, period: '' },
        engagementScore: { value: 0, trend: 0, period: '' }
    };

    const kpiList = [
        { id: 'leads', title: 'Total Leads', k: 'totalLeads', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
        { id: 'conversions', title: 'Conversões', k: 'conversions', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' },
        { id: 'revenue', title: 'Receita', k: 'revenue', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' },
        { id: 'engagement', title: 'Score de Engajamento', k: 'engagementScore', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' }
    ];

    kpiContainer.innerHTML = '';

    kpiList.forEach((item, index) => {
        const k = kpisData[item.k] || { value: 0, trend: 0 };
        const value = typeof k.value === 'number' ? NexaData.formatNumber(k.value) : k.value;
        const trend = k.trend || 0;
        const isPositive = trend >= 0;
        const trendClass = isPositive ? 'positive' : 'negative';
        const trendIcon = isPositive ?
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' :
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>';

        const card = document.createElement('div');
        card.className = 'kpi-card animate-fade-in-up';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="kpi-header">
                <h3 class="kpi-title">${item.title}</h3>
                <div class="kpi-icon">${item.icon}</div>
            </div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-trend ${trendClass}">
                ${trendIcon}
                <span>${Math.abs(trend)}%</span>
            </div>
        `;

        kpiContainer.appendChild(card);
    });
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
        return;
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

    const totalRevenue = (NexaData.kpis && NexaData.kpis.revenue && NexaData.kpis.revenue.value) || 0;
    const projected = totalRevenue * 1.24;

    let currentValue = 0;
    const duration = 2000;
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = projected / steps;

    const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= projected) {
            currentValue = projected;
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
        <span>${totalRevenue > 0 ? '+24% esperado' : '0'}</span>
    `;
}

function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;

    const activities = (window.NexaData && window.NexaData.activities) || [];

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
