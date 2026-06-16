/* ═══════════════════════════════════════════════════════════════
   NexaCore CRM — AI Engine
   Simulated AI capabilities: sentiment, predictions, suggestions
   ═══════════════════════════════════════════════════════════════ */

const NexaAI = {

  /* ── Sentiment Analysis ── */
  sentimentKeywords: {
    very_positive: ['incrível','maravilhoso','perfeito','amei','melhor','excelente','uau','wow','fantástico','sensacional','obrigada','obrigado','💜','❤️','🤩','🚀','😍','⭐'],
    positive: ['adorei','bom','gostei','legal','ótimo','bacana','top','valeu','parabéns','show','massa','demais','😊','👍','🤙','😄'],
    neutral: ['ok','certo','entendi','tá','sim','não','talvez','pode ser','vou ver','depois','volto','pensar'],
    negative: ['ruim','péssimo','horrível','caro','demora','nunca','problema','difícil','complicado','insatisfeito','decepcionado','😡','😤','😞'],
    very_negative: ['cancelar','encerrar','processar','denunciar','absurdo','vergonha','roubo','fraude','lixo','terrível']
  },

  analyzeSentiment(text) {
    if (!text) return { label: 'neutral', score: 50, emoji: '😐', color: 'blue' };
    const lower = text.toLowerCase();
    let score = 50;

    for (const [sentiment, keywords] of Object.entries(this.sentimentKeywords)) {
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          switch(sentiment) {
            case 'very_positive': score += 15; break;
            case 'positive': score += 8; break;
            case 'negative': score -= 10; break;
            case 'very_negative': score -= 20; break;
          }
        }
      }
    }

    score = Math.max(0, Math.min(100, score));

    if (score >= 80) return { label: 'Muito Positivo', score, emoji: '🤩', color: 'green' };
    if (score >= 60) return { label: 'Positivo', score, emoji: '😊', color: 'green' };
    if (score >= 40) return { label: 'Neutro', score, emoji: '😐', color: 'blue' };
    if (score >= 20) return { label: 'Negativo', score, emoji: '😟', color: 'orange' };
    return { label: 'Muito Negativo', score, emoji: '😡', color: 'red' };
  },

  /* ── Emotion Radar ── */
  getEmotionRadar(messages) {
    const emotions = {
      felicidade: 50, frustração: 10, interesse: 50,
      urgência: 20, confiança: 50, indecisão: 20
    };

    if (!messages || messages.length === 0) return emotions;

    const allText = messages
      .filter(m => m.from === 'contact')
      .map(m => m.text.toLowerCase())
      .join(' ');

    // Felicidade
    if (/amei|adorei|incrível|perfeito|😍|🤩|❤️|💜|ótimo|maravilh/.test(allText)) emotions.felicidade += 30;
    if (/bom|legal|gostei|bacana|😊/.test(allText)) emotions.felicidade += 15;

    // Frustração
    if (/caro|demora|problema|difícil|😤|😡/.test(allText)) emotions.frustração += 30;
    if (/não consigo|complicado|chateado/.test(allText)) emotions.frustração += 15;

    // Interesse
    if (/quero|como funciona|quanto custa|detalhes|saber mais|interessad/.test(allText)) emotions.interesse += 30;
    if (/proposta|orçamento|plano|pacote/.test(allText)) emotions.interesse += 15;

    // Urgência
    if (/urgente|rápido|agora|hoje|amanhã|prazo|preciso/.test(allText)) emotions.urgência += 35;
    if (/logo|breve|quando/.test(allText)) emotions.urgência += 10;

    // Confiança
    if (/confi|indiquei|recomend|sempre|melhor investimento|parceria/.test(allText)) emotions.confiança += 30;
    if (/valeu|obrigad|top|show/.test(allText)) emotions.confiança += 15;

    // Indecisão
    if (/pensar|depois|talvez|vou ver|não sei|analisar/.test(allText)) emotions.indecisão += 35;
    if (/mas|porém|entretanto|desconto/.test(allText)) emotions.indecisão += 10;

    // Cap values at 100
    for (const key in emotions) {
      emotions[key] = Math.min(100, Math.max(0, emotions[key]));
    }

    return emotions;
  },

  /* ── Revenue Oracle ── */
  predictRevenue(contact, deal) {
    const factors = [];
    let probability = deal ? deal.probability : 30;
    let predictedValue = contact.predictedValue || 0;

    // Pulse Score factor
    if (contact.pulseScore >= 80) {
      factors.push({ label: 'Relacionamento forte', impact: '+15%', positive: true });
      probability += 15;
    } else if (contact.pulseScore <= 40) {
      factors.push({ label: 'Relacionamento esfriando', impact: '-10%', positive: false });
      probability -= 10;
    }

    // Conversation frequency
    if (contact.conversations >= 20) {
      factors.push({ label: 'Alto engajamento em conversas', impact: '+10%', positive: true });
      probability += 10;
    }

    // Sentiment
    const dna = contact.dna;
    if (dna.emotion >= 75) {
      factors.push({ label: 'Sentimento muito positivo', impact: '+12%', positive: true });
      probability += 12;
    } else if (dna.emotion <= 40) {
      factors.push({ label: 'Sentimento baixo', impact: '-8%', positive: false });
      probability -= 8;
    }

    // Previous spend
    if (contact.totalSpent > 0) {
      factors.push({ label: 'Histórico de compras', impact: '+20%', positive: true });
      probability += 20;
    }

    // Influence score
    if (dna.influence >= 80) {
      factors.push({ label: 'Alto potencial de indicação', impact: '+8%', positive: true });
      probability += 8;
    }

    probability = Math.max(5, Math.min(98, probability));
    const confidence = probability >= 70 ? 'Alta' : probability >= 40 ? 'Média' : 'Baixa';
    const confidenceColor = probability >= 70 ? 'green' : probability >= 40 ? 'yellow' : 'red';

    return {
      probability,
      predictedValue,
      confidence,
      confidenceColor,
      factors,
      estimatedClose: this._getEstimatedCloseDate(probability),
      monthlyRecurring: contact.totalSpent > 0 ? Math.round(contact.totalSpent / 6) : 0
    };
  },

  _getEstimatedCloseDate(probability) {
    if (probability >= 80) return '1-3 dias';
    if (probability >= 60) return '1-2 semanas';
    if (probability >= 40) return '2-4 semanas';
    if (probability >= 20) return '1-2 meses';
    return '3+ meses';
  },

  /* ── Customer DNA Profile ── */
  generateDNAProfile(contact) {
    const dna = contact.dna;
    const dimensions = [
      { label: 'Frequência', value: dna.frequency, color: '#6c5ce7' },
      { label: 'Emoção', value: dna.emotion, color: '#f472b6' },
      { label: 'Resposta', value: dna.response, color: '#00d4aa' },
      { label: 'Interesse', value: dna.interest, color: '#60a5fa' },
      { label: 'Lealdade', value: dna.loyalty, color: '#fbbf24' },
      { label: 'Influência', value: dna.influence, color: '#fb923c' }
    ];

    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length
    );

    let archetype;
    if (dna.loyalty >= 80 && dna.influence >= 70) archetype = '🌟 Embaixador';
    else if (dna.frequency >= 80 && dna.emotion >= 70) archetype = '💎 VIP Engajado';
    else if (dna.interest >= 80 && dna.response >= 70) archetype = '🎯 Lead Quente';
    else if (dna.influence >= 80) archetype = '📢 Influenciador';
    else if (dna.loyalty >= 70) archetype = '🤝 Fiel';
    else if (dna.interest >= 60) archetype = '🔍 Explorador';
    else if (dna.frequency <= 30) archetype = '❄️ Inativo';
    else archetype = '📊 Padrão';

    return { dimensions, overallScore, archetype };
  },

  /* ── Ghost Writer ── */
  getGhostWriterSuggestions(conversation, contact) {
    const suggestions = [];
    const lastMsg = conversation.messages[conversation.messages.length - 1];

    if (!lastMsg || lastMsg.from === 'agent') {
      // Follow-up suggestions
      const followUps = NexaData.ghostWriterResponses.followUp;
      suggestions.push({
        type: 'follow_up',
        label: '📲 Follow-up',
        text: followUps[Math.floor(Math.random() * followUps.length)]
      });
    } else {
      const text = lastMsg.text.toLowerCase();

      // Detect intent and suggest responses
      if (/quanto|preço|valor|custa|investimento|plano/.test(text)) {
        const pricing = NexaData.ghostWriterResponses.pricing;
        suggestions.push({
          type: 'pricing',
          label: '💰 Preço',
          text: pricing[Math.floor(Math.random() * pricing.length)]
        });
      }

      if (/oi|olá|bom dia|boa tarde|boa noite|eae|e aí/.test(text)) {
        const greetings = NexaData.ghostWriterResponses.greeting;
        suggestions.push({
          type: 'greeting',
          label: '👋 Saudação',
          text: greetings[Math.floor(Math.random() * greetings.length)]
        });
      }

      if (/caro|desconto|barato|orçamento|acima|não cabe/.test(text)) {
        const objections = NexaData.ghostWriterResponses.objection;
        suggestions.push({
          type: 'objection',
          label: '🛡️ Objeção',
          text: objections[Math.floor(Math.random() * objections.length)]
        });
      }

      if (/fechar|fechamos|quero|vamos|bora|aceito/.test(text)) {
        const closings = NexaData.ghostWriterResponses.closing;
        suggestions.push({
          type: 'closing',
          label: '🎯 Fechamento',
          text: closings[Math.floor(Math.random() * closings.length)]
        });
      }

      // Always add a generic smart reply
      if (suggestions.length === 0) {
        suggestions.push({
          type: 'smart',
          label: '🤖 Resposta IA',
          text: `Oi ${contact.name.split(' ')[0]}! Que legal sua mensagem! Posso te ajudar com mais alguma coisa? 😊`
        });
      }
    }

    // Ensure at least 2 suggestions
    if (suggestions.length < 2) {
      suggestions.push({
        type: 'custom',
        label: '✨ Personalizada',
        text: `${contact.name.split(' ')[0]}, quero te ajudar da melhor forma! Me conta mais sobre o que você precisa? 💜`
      });
    }

    return suggestions;
  },

  /* ── NVIDIA NIM Integration ── */
  async fetchNvidiaCompletion(messages, systemPrompt = "") {
    const apiKey = localStorage.getItem('nvidiaApiKey');
    if (!apiKey) {
      throw new Error("NVIDIA API Key not found. Configure in Settings.");
    }

    const payload = {
      model: "meta/llama3-70b-instruct",
      messages: [],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 512,
      stream: false
    };

    if (systemPrompt) {
      payload.messages.push({ role: "system", content: systemPrompt });
    }

    payload.messages.push(...messages);

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API Error: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  async getGhostWriterSuggestionsAsync(conversation, contact) {
    // If no API Key, fallback to mock data
    if (!localStorage.getItem('nvidiaApiKey')) {
      return new Promise(resolve => setTimeout(() => resolve(this.getGhostWriterSuggestions(conversation, contact)), 1000));
    }

    // Prepare prompt
    const brandVoice = (NexaData.settings && NexaData.settings.brandVoice) ? 
        NexaData.settings.brandVoice.voiceDescription : 
        "Seja educado e prestativo.";

    const systemPrompt = `Você é um assistente Ghost Writer especializado em atendimento e vendas no CRM NexaCore.
Sua identidade e tom de voz: ${brandVoice}
Seu objetivo é sugerir 2 possíveis mensagens curtas (1 a 2 frases) de resposta ao cliente.
O cliente se chama: ${contact.name}.
A plataforma é: ${contact.platform}.
Formato de resposta EXIGIDO (retorne APENAS um JSON array de strings):
["Opção 1", "Opção 2"]`;

    // Convert conversation to OpenAI/NVIDIA message format
    const recentMessages = conversation.messages.slice(-5).map(m => ({
      role: m.sender === 'agent' ? 'assistant' : 'user',
      content: m.text
    }));

    try {
      const responseText = await this.fetchNvidiaCompletion(recentMessages, systemPrompt);
      // Try to parse JSON array
      const match = responseText.match(/\[.*\]/s);
      let suggestionsTexts = [];
      if (match) {
        suggestionsTexts = JSON.parse(match[0]);
      } else {
        suggestionsTexts = JSON.parse(responseText);
      }
      
      return suggestionsTexts.map((text, idx) => ({
        type: 'ai-generated',
        label: idx === 0 ? '✨ IA Resposta 1' : '✨ IA Resposta 2',
        text: text
      }));
    } catch (e) {
      console.error(e);
      // Fallback on error
      return this.getGhostWriterSuggestions(conversation, contact);
    }
  },

  /* ── Pipeline Intelligence ── */
  getStageRecommendation(deal, contact) {
    const recommendations = [];

    if (deal.stage === 'new' && contact.conversations >= 2) {
      recommendations.push({
        action: 'move',
        to: 'contacted',
        reason: 'Já houve contato ativo com o lead',
        confidence: 85
      });
    }

    if (deal.stage === 'contacted' && contact.dna.interest >= 70) {
      recommendations.push({
        action: 'move',
        to: 'qualified',
        reason: 'Alto nível de interesse detectado pela IA',
        confidence: 72
      });
    }

    if (deal.stage === 'qualified' && contact.pulseScore >= 75) {
      recommendations.push({
        action: 'move',
        to: 'proposal',
        reason: 'Relacionamento maduro para proposta',
        confidence: 68
      });
    }

    if (contact.pulseScore <= 30 && deal.stage !== 'closed' && deal.stage !== 'new') {
      recommendations.push({
        action: 'alert',
        reason: 'Risco de perda — relacionamento esfriando',
        confidence: 80
      });
    }

    if (deal.daysInStage >= 7 && deal.stage !== 'closed') {
      recommendations.push({
        action: 'alert',
        reason: `Deal parado há ${deal.daysInStage} dias neste estágio`,
        confidence: 75
      });
    }

    return recommendations;
  },

  /* ── Relationship Pulse ── */
  calculatePulse(contact) {
    const base = contact.pulseScore;
    const daysSinceContact = Math.floor(
      (new Date('2026-06-15T21:00:00') - new Date(contact.lastContact)) / (1000 * 60 * 60 * 24)
    );

    let adjusted = base;
    if (daysSinceContact <= 1) adjusted += 5;
    else if (daysSinceContact <= 3) adjusted += 0;
    else if (daysSinceContact <= 7) adjusted -= 10;
    else adjusted -= 20;

    adjusted = Math.max(0, Math.min(100, adjusted));

    let status, color, animation;
    if (adjusted >= 80) { status = 'Excelente'; color = 'green'; animation = 'fast'; }
    else if (adjusted >= 60) { status = 'Saudável'; color = 'green'; animation = 'normal'; }
    else if (adjusted >= 40) { status = 'Atenção'; color = 'yellow'; animation = 'slow'; }
    else if (adjusted >= 20) { status = 'Esfriando'; color = 'orange'; animation = 'very-slow'; }
    else { status = 'Crítico'; color = 'red'; animation = 'flat'; }

    return { score: adjusted, status, color, animation, daysSinceContact };
  },

  /* ── AI Insights ── */
  generateInsights() {
    return [
      {
        id: 'i1', type: 'opportunity', priority: 'high',
        title: 'Oportunidade de Upsell',
        description: 'Camila Ferreira (Bella Estética) está com satisfação máxima e indicando novos clientes. Momento ideal para propor upgrade de plano.',
        action: 'Enviar proposta de upgrade',
        contactId: 'c3'
      },
      {
        id: 'i2', type: 'risk', priority: 'high',
        title: 'Lead Esfriando',
        description: 'Lucas Mendes não responde há 2 dias e o Pulse Score caiu para 38. Risco de perda iminente.',
        action: 'Enviar follow-up urgente',
        contactId: 'c4'
      },
      {
        id: 'i3', type: 'trend', priority: 'medium',
        title: 'Instagram superando WhatsApp',
        description: 'Leads do Instagram converteram 23% mais que WhatsApp este mês. Considere aumentar investimento em conteúdo Instagram.',
        action: 'Ajustar estratégia de canais'
      },
      {
        id: 'i4', type: 'opportunity', priority: 'medium',
        title: 'Parceria com Influencer',
        description: 'Juliana Vieira (120k seguidores) quer fazer unboxing nos Stories. Potencial de alcance: 85k+ pessoas.',
        action: 'Aceitar parceria',
        contactId: 'c7'
      },
      {
        id: 'i5', type: 'pattern', priority: 'low',
        title: 'Pico de engajamento às 19h',
        description: 'Análise do heatmap mostra que o melhor horário para contato é entre 19h-20h em dias úteis.',
        action: 'Agendar campanhas para este horário'
      },
      {
        id: 'i6', type: 'reactivation', priority: 'medium',
        title: 'Reativar lead perdido',
        description: 'Thiago Barbosa saiu por preço há 18 dias. Enviar promoção de reativação com 15% de desconto.',
        action: 'Enviar promoção',
        contactId: 'c8'
      }
    ];
  },

  /* ── Neural Map Data ── */
  generateNeuralMapData() {
    const contacts = NexaData.contacts;
    const nodes = contacts.map((c, i) => ({
      id: c.id,
      label: c.name.split(' ')[0],
      x: 0, y: 0, // will be positioned by the renderer
      radius: 8 + (c.score / 10),
      color: c.platform === 'instagram' ? '#f472b6' : '#00d4aa',
      score: c.score,
      platform: c.platform,
      connections: []
    }));

    // Create connections based on tags and behavior similarities
    const links = [];
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const a = contacts[i], b = contacts[j];
        let strength = 0;

        // Same tags
        const commonTags = a.tags.filter(t => b.tags.includes(t));
        strength += commonTags.length * 20;

        // Similar DNA profiles
        const dnaDiff = Math.abs(a.dna.interest - b.dna.interest) +
                       Math.abs(a.dna.emotion - b.dna.emotion);
        if (dnaDiff < 30) strength += 30;

        // Same platform
        if (a.platform === b.platform) strength += 10;

        // Same status
        if (a.status === b.status) strength += 15;

        if (strength > 20) {
          links.push({
            source: a.id,
            target: b.id,
            strength: Math.min(100, strength)
          });
        }
      }
    }

    return { nodes, links };
  }
};
