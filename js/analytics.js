/* ═══════════════════════════════════════════════════════════════
   Analytics Page Logic
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initTopMetrics();
    initInsights();
    initPlatformComparison();
    
    // Defer chart drawing slightly to ensure container dimensions are ready
    setTimeout(() => {
        drawRevenueChart();
        drawConversationsChart();
        drawSentimentChart();
    }, 100);

    // Handle window resize for canvas redraw
    window.addEventListener('resize', () => {
        drawRevenueChart();
        drawConversationsChart();
        drawSentimentChart();
    });
});

function initTopMetrics() {
    const container = document.getElementById('topMetricsContainer');
    const { kpis, analytics } = NexaData;

    const metrics = [
        { label: 'Receita Total', value: NexaData.formatCurrency(kpis.revenue.value), trend: kpis.revenue.trend, period: kpis.revenue.period },
        { label: 'Taxa de Conversão', value: analytics.topMetrics.conversionRate + '%', trend: 2.4, period: 'vs. mês passado' },
        { label: 'Tempo Médio Resposta', value: analytics.topMetrics.avgResponseTime, trend: -18.0, period: 'melhoria' },
        { label: 'Satisfação Cliente', value: analytics.topMetrics.customerSatisfaction + '%', trend: 5.1, period: 'vs. mês passado' }
    ];

    container.innerHTML = metrics.map(m => {
        const isPositive = m.trend > 0;
        const isImprovement = m.label === 'Tempo Médio Resposta' ? m.trend < 0 : isPositive;
        const trendClass = isImprovement ? 'positive' : 'negative';
        const trendIcon = isImprovement ? '↑' : '↓';
        const trendAbs = Math.abs(m.trend) + '%';
        
        return `
        <div class="kpi-card">
            <div class="kpi-header">
                <span>${m.label}</span>
            </div>
            <div class="kpi-value">${m.value}</div>
            <div class="kpi-trend ${trendClass}">
                <span>${trendIcon} ${trendAbs}</span>
                <span class="kpi-trend-period">${m.period}</span>
            </div>
        </div>
        `;
    }).join('');
}

function initInsights() {
    const container = document.getElementById('insightsContainer');
    const insights = NexaAI.generateInsights();

    container.innerHTML = insights.map(i => {
        let icon = '💡';
        if (i.type === 'opportunity') icon = '🎯';
        else if (i.type === 'risk') icon = '⚠️';
        else if (i.type === 'trend') icon = '📈';

        return `
        <div class="insight-card priority-${i.priority}">
            <div class="insight-header">
                <span class="insight-title">${icon} ${i.title}</span>
            </div>
            <div class="insight-desc">${i.description}</div>
            <button class="insight-action">
                ${i.action} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:4px"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
        </div>
        `;
    }).join('');
}

function initPlatformComparison() {
    const split = NexaData.analytics.platformSplit;
    
    // Set widths after a small delay for animation
    setTimeout(() => {
        const wpBar = document.getElementById('whatsappBar');
        const igBar = document.getElementById('instagramBar');
        if (wpBar) wpBar.style.width = split.whatsapp + '%';
        if (igBar) igBar.style.width = split.instagram + '%';
        
        const wpVal = document.getElementById('whatsappValue');
        const igVal = document.getElementById('instagramValue');
        if (wpVal) wpVal.textContent = split.whatsapp + '% das interações';
        if (igVal) igVal.textContent = split.instagram + '% das interações';
    }, 300);
}

// Custom Chart Rendering logic using Canvas API

function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    return { ctx, width: rect.width, height: rect.height };
}

function drawRevenueChart() {
    const chart = getCanvasContext('revenueChart');
    if (!chart) return;
    const { ctx, width, height } = chart;
    const data = NexaData.analytics.revenueByMonth;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxVal = Math.max(...data.map(d => d.instagram + d.whatsapp)) * 1.1;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight * i) / 4;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const val = Math.round(maxVal - (maxVal * i) / 4);
        ctx.fillText((val/1000) + 'k', padding.left - 10, y);
    }
    ctx.stroke();
    
    const stepX = chartWidth / Math.max(1, data.length - 1);
    const points = data.map((d, i) => {
        const total = d.instagram + d.whatsapp;
        return {
            x: padding.left + i * stepX,
            y: padding.top + chartHeight - ((total / maxVal) * chartHeight),
            label: d.month
        };
    });
    
    // Draw Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const cpX = (points[i-1].x + points[i].x) / 2;
        ctx.bezierCurveTo(cpX, points[i-1].y, cpX, points[i].y, points[i].x, points[i].y);
    }
    
    const gradLine = ctx.createLinearGradient(0, 0, width, 0);
    gradLine.addColorStop(0, '#8b5cf6'); // Primary
    gradLine.addColorStop(1, '#ec4899'); // Pink
    
    ctx.strokeStyle = gradLine;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Fill Gradient
    ctx.lineTo(points[points.length-1].x, padding.top + chartHeight);
    ctx.lineTo(points[0].x, padding.top + chartHeight);
    ctx.closePath();
    
    const gradFill = ctx.createLinearGradient(0, padding.top, 0, height);
    gradFill.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    gradFill.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = gradFill;
    ctx.fill();
    
    // Draw Points and X-axis labels
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#111827';
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(p.label, p.x, padding.top + chartHeight + 10);
    });
}

function drawConversationsChart() {
    const chart = getCanvasContext('conversationsChart');
    if (!chart) return;
    const { ctx, width, height } = chart;
    const data = NexaData.analytics.conversationsByDay;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { top: 20, right: 20, bottom: 30, left: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxVal = Math.max(...data.map(d => d.count)) * 1.2;
    const barWidth = Math.min(24, chartWidth / data.length - 8);
    const stepX = chartWidth / data.length;
    
    data.forEach((d, i) => {
        const barHeight = (d.count / maxVal) * chartHeight;
        const x = padding.left + i * stepX + (stepX - barWidth) / 2;
        const y = padding.top + chartHeight - barHeight;
        
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#00d4aa'); // Success
        grad.addColorStop(1, 'rgba(0, 212, 170, 0.2)');
        
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        } else {
            ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.day, x + barWidth / 2, padding.top + chartHeight + 10);
    });
}

function drawSentimentChart() {
    const chart = getCanvasContext('sentimentChart');
    if (!chart) return;
    const { ctx, width, height } = chart;
    const dataObj = NexaData.analytics.sentimentDistribution;
    
    const colors = {
        positive: '#00d4aa',
        neutral: '#60a5fa',
        negative: '#ef4444',
        excited: '#f472b6'
    };
    
    const labels = {
        positive: 'Positivo',
        neutral: 'Neutro',
        negative: 'Negativo',
        excited: 'Empolgado'
    };
    
    const entries = Object.entries(dataObj);
    const total = entries.reduce((sum, [_, val]) => sum + val, 0);
    
    ctx.clearRect(0, 0, width, height);
    
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 10;
    
    let currentAngle = -Math.PI / 2;
    
    entries.forEach(([key, value]) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[key];
        ctx.fill();
        
        // Inner gap (using a dark color close to background)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111827';
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Make it a doughnut chart
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, 2 * Math.PI);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw total text in center
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100%', cx, cy);
    
    // Render legend
    const legendContainer = document.getElementById('sentimentLegend');
    if (legendContainer) {
        legendContainer.innerHTML = entries.map(([key, value]) => `
            <div class="legend-item">
                <div class="legend-label">
                    <span class="legend-dot" style="background-color: ${colors[key]}"></span>
                    <span>${labels[key]}</span>
                </div>
                <span class="legend-value">${value}%</span>
            </div>
        `).join('');
    }
}
