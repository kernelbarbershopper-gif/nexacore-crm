function initPipeline() {
    const pipelineBoard = document.getElementById('pipelineBoard');

    const stages = (window.NexaData && window.NexaData.pipelineStages) || [];
    let deals = (window.NexaData && window.NexaData.deals) || [];

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function getPlatformIcon(platform) {
        if (platform === 'whatsapp') {
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
        }
        if (platform === 'instagram') {
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
        }
        return '';
    }

    function getPulseColor(score) {
        if (score >= 80) return '#10B981'; // Green
        if (score >= 50) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    }

    function renderBoard() {
        pipelineBoard.innerHTML = '';

        stages.forEach((stage, index) => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
            
            const colEl = document.createElement('div');
            colEl.className = 'pipeline-column animate-fade-in-up';
            colEl.style.animationDelay = `${index * 0.1}s`;
            colEl.dataset.stageId = stage.id;
            
            colEl.innerHTML = `
                <div class="column-header">
                    <div class="column-title-row">
                        <span class="column-title">${stage.name}</span>
                        <span class="column-count">${stageDeals.length}</span>
                    </div>
                    <div class="revenue-oracle" title="Revenue Oracle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Predição: ${formatCurrency(totalValue)}
                    </div>
                </div>
                <div class="column-body" id="col-${stage.id}">
                </div>
            `;

            const bodyEl = colEl.querySelector('.column-body');
            
            stageDeals.forEach(deal => {
                const pulseScore = (window.NexaAI && window.NexaAI.calculatePulse) ? window.NexaAI.calculatePulse(deal) : 50;
                const pulseColor = getPulseColor(pulseScore);
                
                const cardEl = document.createElement('div');
                cardEl.className = 'deal-card';
                cardEl.draggable = true;
                cardEl.dataset.dealId = deal.id;

                cardEl.innerHTML = `
                    <div class="deal-header">
                        <div>
                            <div class="deal-title">${deal.title || 'Oportunidade'}</div>
                            <div class="deal-contact">${deal.contact || 'Sem contato'}</div>
                        </div>
                        <div class="platform-icon ${deal.platform || 'whatsapp'}" title="${deal.platform}">
                            ${getPlatformIcon(deal.platform || 'whatsapp')}
                        </div>
                    </div>
                    
                    <div class="deal-meta">
                        <div class="deal-value">${formatCurrency(deal.value || 0)}</div>
                        <div class="pulse-score" title="Relationship Pulse Score">
                            <span class="pulse-indicator" style="background: ${pulseColor}; box-shadow: 0 0 8px ${pulseColor}"></span>
                            ${pulseScore}
                        </div>
                    </div>
                    
                    ${deal.aiReason ? `
                    <div class="ai-badge" title="AI Pipeline Intelligence">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <span>${deal.aiReason}</span>
                    </div>
                    ` : ''}
                `;

                // Drag Events
                cardEl.addEventListener('dragstart', (e) => {
                    cardEl.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', deal.id);
                    e.dataTransfer.effectAllowed = 'move';
                });

                cardEl.addEventListener('dragend', () => {
                    cardEl.classList.remove('dragging');
                    document.querySelectorAll('.pipeline-column').forEach(col => col.classList.remove('drag-over'));
                });

                bodyEl.appendChild(cardEl);
            });

            // Drop Events for Column
            colEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                colEl.classList.add('drag-over');
            });

            colEl.addEventListener('dragleave', () => {
                colEl.classList.remove('drag-over');
            });

            colEl.addEventListener('drop', (e) => {
                e.preventDefault();
                colEl.classList.remove('drag-over');
                const dealId = e.dataTransfer.getData('text/plain');
                const newStageId = colEl.dataset.stageId;
                
                // Update deal stage
                const dealIndex = deals.findIndex(d => d.id === dealId);
                if (dealIndex > -1 && deals[dealIndex].stage !== newStageId) {
                    const oldStageName = stages.find(s => s.id === deals[dealIndex].stage)?.name || '';
                    deals[dealIndex].stage = newStageId;
                    
                    // Add AI intelligence note for move
                    deals[dealIndex].aiReason = `Atualização manual de "${oldStageName}" para "${stage.name}".`;
                    
                    // Re-render
                    renderBoard();
                }
            });

            pipelineBoard.appendChild(colEl);
        });
    }

    renderBoard();
}
