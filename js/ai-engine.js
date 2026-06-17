const NexaAI = {

  sentimentKeywords: {
    very_positive: ['incrível','maravilhoso','perfeito','amei','melhor','excelente','uau','wow','fantástico','sensacional','obrigada','obrigado','💜','❤️','🤩','🚀','😍','⭐'],
    positive: ['adorei','bom','gostei','legal','ótimo','bacana','top','valeu','parabéns','show','massa','demais','😊','👍','🤙','😄'],
    neutral: ['ok','certo','entendi','tá','sim','talvez','pode ser','vou ver','depois','volto','pensar'],
    negative: ['ruim','péssimo','horrível','caro','demora','nunca','problema','difícil','complicado','insatisfeito','decepcionado','😡','😤','😞'],
    very_negative: ['cancelar','encerrar','processar','denunciar','absurdo','vergonha','roubo','fraude','lixo','terrível']
  },

  negationWords: ['não','nunca','jamais','nem','tampouco','de jeito nenhum','de forma alguma'],
  intensityWords: { 'muito': 2, 'extremamente': 3, 'bastante': 1.5, 'pouco': 0.5, 'um pouco': 0.5, 'super': 2, 'bem': 1.3 },

  analyzeSentiment(text) {
    if (!text) return { label: 'Neutro', score: 50, emoji: '😐', color: 'blue', confidence: 0, details: [] };
    const lower = text.toLowerCase();
    let score = 50;
    const details = [];

    const words = lower.split(/\s+/);
    let negationActive = false;
    let negationRange = 3;

    for (let i = 0; i < words.length; i++) {
      if (this.negationWords.includes(words[i])) {
        negationActive = true;
        negationRange = 3;
        continue;
      }

      if (negationActive) negationRange--;

      for (const [sentiment, keywords] of Object.entries(this.sentimentKeywords)) {
        for (const keyword of keywords) {
          if (words[i].includes(keyword)) {
            let impact = 0;
            switch(sentiment) {
              case 'very_positive': impact = 15; break;
              case 'positive': impact = 8; break;
              case 'negative': impact = -10; break;
              case 'very_negative': impact = -20; break;
            }

            if (negationActive && (sentiment === 'positive' || sentiment === 'very_positive')) {
              impact = -Math.abs(impact);
              details.push({ word: keyword, impact: -Math.abs(impact), note: 'negado' });
            } else {
              details.push({ word: keyword, impact, note: negationActive ? 'negado' : 'direto' });
            }

            score += impact;
          }
        }
      }

      if (negationActive && negationRange <= 0) negationActive = false;
    }

    if (text.includes('!') || text.includes('?')) {
      const exclams = (text.match(/!/g) || []).length;
      const questions = (text.match(/\?/g) || []).length;
      score += exclams * 2;
      details.push({ word: '!!!', impact: exclams * 2, note: 'intensidade' });
      if (questions > 1) {
        score -= 5;
        details.push({ word: '???', impact: -5, note: 'confusão' });
      }
    }

    const emojiPositive = text.match(/[😍🤩❤️💜🚀⭐😊👍🤙😄💪🔥✨🙌🥳]/g);
    const emojiNegative = text.match(/[😡😤😞💔👎😢😭😠]/g);
    if (emojiPositive) { score += emojiPositive.length * 5; details.push({ word: 'emojis+', impact: emojiPositive.length * 5, note: 'emojis positivos' }); }
    if (emojiNegative) { score -= emojiNegative.length * 5; details.push({ word: 'emojis-', impact: emojiNegative.length * -5, note: 'emojis negativos' }); }

    score = Math.max(0, Math.min(100, score));
    const confidence = Math.min(100, details.length * 15 + 20);

    let label, emoji, color;
    if (score >= 80) { label = 'Muito Positivo'; emoji = '🤩'; color = 'green'; }
    else if (score >= 60) { label = 'Positivo'; emoji = '😊'; color = 'green'; }
    else if (score >= 40) { label = 'Neutro'; emoji = '😐'; color = 'blue'; }
    else if (score >= 20) { label = 'Negativo'; emoji = '😟'; color = 'orange'; }
    else { label = 'Muito Negativo'; emoji = '😡'; color = 'red'; }

    return { label, score, emoji, color, confidence, details };
  },

  extractTopics(text) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const topics = [];

    const topicPatterns = [
      { pattern: /preço|valor|custa|quanto|investimento|orçamento/, topic: '💰 Preço', weight: 1 },
      { pattern: /prazo|entrega|quando|tempo|agendar|disponibilidade/, topic: '⏱ Prazo', weight: 1 },
      { pattern: /qualidade|garantia|confiança|segurança|suporte/, topic: '🛡 Qualidade', weight: 1 },
      { pattern: /personaliz|sob medida|exclusiv|customiz/, topic: '🎨 Personalização', weight: 1 },
      { pattern: /contrato|assinatura|plano|mensal|anual|recorrência/, topic: '📋 Contrato', weight: 1 },
      { pattern: /reclamaç|problema|erro|falha|bug|defeito/, topic: '🔧 Suporte', weight: 1 },
      { pattern: /parceria|colab|indicaç|afiliado|comissão/, topic: '🤝 Parceria', weight: 1 },
      { pattern: /demo|testar|experiment|amostra|gratuito|trial/, topic: '🧪 Trial', weight: 1 },
      { pattern: /cancel|desist|devoluç|reembolso|sair/, topic: '🚫 Cancelamento', weight: 1 },
      { pattern: /tutorial|aprender|como usar|guia|manual/, topic: '📚 Onboarding', weight: 1 },
    ];

    for (const t of topicPatterns) {
      if (t.pattern.test(lower)) topics.push(t.topic);
    }

    return [...new Set(topics)];
  },

  analyzeConversationTrend(messages) {
    if (!messages || messages.length < 3) return { trend: 'insuficiente', delta: 0, trajectory: [] };

    const contactMsgs = messages.filter(m => m.from === 'contact');
    if (contactMsgs.length < 3) return { trend: 'insuficiente', delta: 0, trajectory: [] };

    const sentiments = contactMsgs.map(m => this.analyzeSentiment(m.text));
    const trajectory = sentiments.map(s => s.score);

    const firstHalf = trajectory.slice(0, Math.floor(trajectory.length / 2));
    const secondHalf = trajectory.slice(Math.floor(trajectory.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const delta = Math.round(avgSecond - avgFirst);

    let trend;
    if (delta > 10) trend = '📈 melhora';
    else if (delta < -10) trend = '📉 piora';
    else trend = '➡️ estável';

    const consistency = Math.round(100 - trajectory.reduce((sum, s) => sum + Math.abs(s - avgFirst), 0) / trajectory.length);
    const lastSentiment = sentiments[sentiments.length - 1];

    return { trend, delta, trajectory, consistency: Math.min(100, consistency), lastSentiment };
  },

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

    if (/amei|adorei|incrível|perfeito|😍|🤩|❤️|💜|ótimo|maravilh/.test(allText)) emotions.felicidade += 30;
    if (/bom|legal|gostei|bacana|😊/.test(allText)) emotions.felicidade += 15;

    if (/caro|demora|problema|difícil|😤|😡/.test(allText)) emotions.frustração += 30;
    if (/não consigo|complicado|chateado|insatisfeito/.test(allText)) emotions.frustração += 15;

    if (/quero|como funciona|quanto custa|detalhes|saber mais|interessad/.test(allText)) emotions.interesse += 30;
    if (/proposta|orçamento|plano|pacote|catálogo/.test(allText)) emotions.interesse += 15;

    if (/urgente|rápido|agora|hoje|amanhã|prazo|preciso/.test(allText)) emotions.urgência += 35;
    if (/logo|breve|quando|corre|correndo/.test(allText)) emotions.urgência += 10;

    if (/confi|indiquei|recomend|sempre|melhor investimento|parceria/.test(allText)) emotions.confiança += 30;
    if (/valeu|obrigad|top|show|obrigado/.test(allText)) emotions.confiança += 15;

    if (/pensar|depois|talvez|vou ver|não sei|analisar/.test(allText)) emotions.indecisão += 35;
    if (/mas|porém|entretanto|desconto|comparar/.test(allText)) emotions.indecisão += 10;

    const negations = allText.match(/não (gostei|quero|vou|sei|tenho|pode|acredito|é bom)/g);
    if (negations) {
      emotions.felicidade -= negations.length * 10;
      emotions.interesse -= negations.length * 8;
      emotions.frustração += negations.length * 12;
    }

    for (const key in emotions) {
      emotions[key] = Math.min(100, Math.max(0, emotions[key]));
    }

    return emotions;
  },

  predictRevenue(contact, deal) {
    const factors = [];
    let probability = deal ? deal.probability : 30;
    let predictedValue = contact.predictedValue || 0;

    if (contact.pulseScore >= 80) {
      factors.push({ label: 'Relacionamento forte', impact: '+15%', positive: true });
      probability += 15;
    } else if (contact.pulseScore <= 40) {
      factors.push({ label: 'Relacionamento esfriando', impact: '-10%', positive: false });
      probability -= 10;
    }

    if (contact.conversations >= 20) {
      factors.push({ label: 'Alto engajamento', impact: '+10%', positive: true });
      probability += 10;
    } else if (contact.conversations >= 10) {
      factors.push({ label: 'Engajamento moderado', impact: '+5%', positive: true });
      probability += 5;
    }

    const dna = contact.dna || {};
    if (dna.emotion >= 75) {
      factors.push({ label: 'Sentimento muito positivo', impact: '+12%', positive: true });
      probability += 12;
    } else if (dna.emotion <= 40) {
      factors.push({ label: 'Sentimento baixo', impact: '-8%', positive: false });
      probability -= 8;
    }

    if (dna.interest >= 80) {
      factors.push({ label: 'Interesse elevado', impact: '+10%', positive: true });
      probability += 10;
    } else if (dna.interest <= 30) {
      factors.push({ label: 'Baixo interesse', impact: '-10%', positive: false });
      probability -= 10;
    }

    if (contact.totalSpent > 0) {
      factors.push({ label: 'Histórico de compras', impact: '+20%', positive: true });
      probability += 20;
    }

    if (dna.influence >= 80) {
      factors.push({ label: 'Alto potencial de indicação', impact: '+8%', positive: true });
      probability += 8;
    }

    if (contact.tags && contact.tags.includes('urgente')) {
      factors.push({ label: 'Lead urgente', impact: '+12%', positive: true });
      probability += 12;
    }

    probability = Math.max(5, Math.min(98, probability));

    let leadQuality;
    if (probability >= 80) leadQuality = '🔥 Quentíssimo';
    else if (probability >= 65) leadQuality = '🔥 Quente';
    else if (probability >= 45) leadQuality = '💡 Morno';
    else if (probability >= 25) leadQuality = '❄️ Frio';
    else leadQuality = '🧊 Congelado';

    const confidence = probability >= 70 ? 'Alta' : probability >= 40 ? 'Média' : 'Baixa';
    const confidenceColor = probability >= 70 ? 'green' : probability >= 40 ? 'yellow' : 'red';

    const daysUntilConversion = this._estimateDaysToClose(probability, contact);

    return {
      probability,
      predictedValue,
      confidence,
      confidenceColor,
      leadQuality,
      factors,
      estimatedClose: this._getEstimatedCloseDate(probability),
      daysUntilConversion,
      monthlyRecurring: contact.totalSpent > 0 ? Math.round(contact.totalSpent / 6) : 0,
      retentionRisk: this._calculateRetentionRisk(contact)
    };
  },

  _estimateDaysToClose(probability, contact) {
    const base = 30 - (probability * 0.3);
    const recencyPenalty = contact.lastContact ? Math.floor((new Date() - new Date(contact.lastContact)) / (1000 * 60 * 60 * 24)) * 0.5 : 0;
    return Math.max(1, Math.round(base + recencyPenalty));
  },

  _calculateRetentionRisk(contact) {
    if (!contact.lastContact) return { risk: 'Médio', score: 50, reason: 'Sem histórico suficiente' };
    const daysSince = Math.floor((new Date() - new Date(contact.lastContact)) / (1000 * 60 * 60 * 24));
    const risk = contact.pulseScore <= 30 || daysSince > 14 ? 'Alto' : daysSince > 7 ? 'Médio' : 'Baixo';
    const score = Math.min(100, Math.max(0, 100 - (contact.pulseScore || 50) + daysSince * 2));
    let reason;
    if (risk === 'Alto') reason = `Sem contato há ${daysSince} dias e pulse score baixo`;
    else if (risk === 'Médio') reason = `Último contato há ${daysSince} dias`;
    else reason = 'Relacionamento saudável';
    return { risk, score: Math.round(score), reason };
  },

  _getEstimatedCloseDate(probability) {
    if (probability >= 80) return '1-3 dias';
    if (probability >= 60) return '1-2 semanas';
    if (probability >= 40) return '2-4 semanas';
    if (probability >= 20) return '1-2 meses';
    return '3+ meses';
  },

  generateDNAProfile(contact) {
    const dna = contact.dna || { frequency: 50, emotion: 50, response: 50, interest: 50, loyalty: 50, influence: 50 };
    const dimensions = [
      { label: 'Frequência', value: dna.frequency, color: '#6c5ce7', insight: dna.frequency >= 70 ? 'Contata com frequência' : dna.frequency <= 30 ? 'Contato esporádico' : 'Padrão regular' },
      { label: 'Emoção', value: dna.emotion, color: '#f472b6', insight: dna.emotion >= 70 ? 'Tom emocional positivo' : dna.emotion <= 30 ? 'Tom reservado' : 'Tom equilibrado' },
      { label: 'Resposta', value: dna.response, color: '#00d4aa', insight: dna.response >= 70 ? 'Responde rapidamente' : dna.response <= 30 ? 'Resposta lenta' : 'Resposta no prazo' },
      { label: 'Interesse', value: dna.interest, color: '#60a5fa', insight: dna.interest >= 70 ? 'Alta intenção de compra' : dna.interest <= 30 ? 'Baixo interesse' : 'Interesse moderado' },
      { label: 'Lealdade', value: dna.loyalty, color: '#fbbf24', insight: dna.loyalty >= 70 ? 'Cliente fiel e recorrente' : dna.loyalty <= 30 ? 'Propenso a churn' : 'Lealdade em construção' },
      { label: 'Influência', value: dna.influence, color: '#fb923c', insight: dna.influence >= 70 ? 'Alto potencial de indicação' : dna.influence <= 30 ? 'Baixa rede de contatos' : 'Influência moderada' }
    ];

    const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length);

    let archetype, strengths, weaknesses, recommendation;
    if (dna.loyalty >= 80 && dna.influence >= 70) {
      archetype = '🌟 Embaixador';
      strengths = ['Lealdade excepcional', 'Alta influência social'];
      weaknesses = ['Pode exigir atenção exclusiva'];
      recommendation = 'Ofereça programa de indicações e benefícios VIP. Peça depoimentos.';
    } else if (dna.frequency >= 80 && dna.emotion >= 70) {
      archetype = '💎 VIP Engajado';
      strengths = ['Engajamento constante', 'Conexão emocional forte'];
      weaknesses = ['Sensível a mudanças de preço'];
      recommendation = 'Mantenha contato próximo. Ofereça lançamentos em primeira mão.';
    } else if (dna.interest >= 80 && dna.response >= 70) {
      archetype = '🎯 Lead Quente';
      strengths = ['Alta intenção de compra', 'Responde rápido'];
      weaknesses = ['Pode comparar concorrentes'];
      recommendation = 'Acelere o follow-up. Envie proposta personalizada urgente.';
    } else if (dna.influence >= 80) {
      archetype = '📢 Influenciador';
      strengths = ['Rede ampla', 'Potencial viral'];
      weaknesses = ['Pode ser exigente com prazos'];
      recommendation = 'Ofereça parceria. Convide para eventos exclusivos.';
    } else if (dna.loyalty >= 70) {
      archetype = '🤝 Fiel';
      strengths = ['Retenção garantida', 'Baixo custo de manutenção'];
      weaknesses = ['Resistente a upgrades'];
      recommendation = 'Faça upsell gradual. Reconheça a lealdade com benefícios.';
    } else if (dna.interest >= 60) {
      archetype = '🔍 Explorador';
      strengths = ['Curioso e aberto', 'Potencial de crescimento'];
      weaknesses = ['Pode demorar a decidir'];
      recommendation = 'Eduque com conteúdo. Ofereça trial/demo gratuito.';
    } else if (dna.frequency <= 30) {
      archetype = '❄️ Inativo';
      strengths = ['Já conhece a marca'];
      weaknesses = ['Risco alto de churn', 'Baixo engajamento'];
      recommendation = 'Campanha de reativação. Ofereça incentivo para retorno.';
    } else {
      archetype = '📊 Padrão';
      strengths = ['Perfil equilibrado'];
      weaknesses = ['Sem diferencial claro'];
      recommendation = 'Monitore engajamento. Personalize abordagem conforme respostas.';
    }

    return { dimensions, overallScore, archetype, strengths, weaknesses, recommendation };
  },

  getGhostWriterSuggestions(conversation, contact) {
    const suggestions = [];
    const msgs = conversation.messages || [];
    const lastMsg = msgs[msgs.length - 1];
    const hour = new Date().getHours();

    let timeGreeting = 'Oi';
    if (hour < 12) timeGreeting = 'Bom dia';
    else if (hour < 18) timeGreeting = 'Boa tarde';
    else timeGreeting = 'Boa noite';

    const firstName = (contact.name || '').split(' ')[0] || '';

    if (!lastMsg || lastMsg.from === 'agent') {
      suggestions.push({
        type: 'follow_up',
        label: '📲 Follow-up',
        text: `${timeGreeting} ${firstName}! Tudo bem? Só passando pra saber se ficou alguma dúvida sobre o que conversamos.`
      });
      suggestions.push({
        type: 'value_add',
        label: '📊 Conteúdo',
        text: `${firstName}, encontrei um conteúdo que pode te ajudar. Posso enviar?`
      });
      return suggestions;
    }

    const text = lastMsg.text.toLowerCase();

    if (/quanto|preço|valor|custa|investimento|plano/.test(text)) {
      suggestions.push({
        type: 'pricing', label: '💰 Preço',
        text: `Os planos começam a partir de R$ 997/mês. ${firstName}, quer que eu detalhe o que cada plano inclui?`
      });
      suggestions.push({
        type: 'pricing_alt', label: '⚖️ Comparativo',
        text: `${firstName}, temos opções flexíveis. Posso montar uma comparação personalizada pra você?`
      });
    }

    if (/oi|olá|bom dia|boa tarde|boa noite|eae|e aí|hey|hello/.test(text)) {
      suggestions.push({
        type: 'greeting', label: '👋 Saudação',
        text: `${timeGreeting} ${firstName}! Tudo bem? Como posso te ajudar hoje?`
      });
    }

    if (/caro|desconto|barato|orçamento|acima|não cabe|muito caro|pesado/.test(text)) {
      suggestions.push({
        type: 'objection', label: '🛡️ Objeção',
        text: `${firstName}, entendo perfeitamente! Podemos ajustar o pacote pra algo que encaixe melhor no seu momento. Me conta qual seria o valor ideal pra você?`
      });
      suggestions.push({
        type: 'objection_value', label: '📈 ROI',
        text: `${firstName}, entendi. Deixa eu te mostrar o retorno que outros clientes tiveram — o investimento se paga em média em 3 meses.`
      });
    }

    if (/fechar|fechamos|quero|vamos|bora|aceito|contratar|sim|topo/.test(text)) {
      suggestions.push({
        type: 'closing', label: '🎯 Fechamento',
        text: `Perfeito ${firstName}! 🚀 Vou preparar tudo aqui e já te envio o contrato. Bem-vindo(a) ao time!`
      });
      suggestions.push({
        type: 'closing_next', label: '📋 Próximos passos',
        text: `${firstName}, que ótimo! Os próximos passos: 1) envio o contrato 2) você assina online 3) ativamos em até 24h. Pode ser?`
      });
    }

    if (/não quero|não tenho interesse|já tenho|obrigado/.test(text)) {
      suggestions.push({
        type: 'not_interested', label: '🔄 Reengajamento',
        text: `${firstName}, sem problema! Posso deixar nosso material com você pra quando precisar. Combinado?`
      });
    }

    if (/como funciona|explica|o que é|como faz|tutorial/.test(text)) {
      suggestions.push({
        type: 'explain', label: '📖 Explicativo',
        text: `${firstName}, vou te explicar rapidinho! Funciona assim: [explica em 2-3 frases]. Quer que eu te mostre na prática?`
      });
    }

    if (/problema|erro|bug|não funciona|quebrado|parou/.test(text)) {
      suggestions.push({
        type: 'support', label: '🔧 Suporte',
        text: `${firstName}, sinto muito por isso! Deixa eu ver o que aconteceu. Pode me contar mais detalhes? Já vou abrir um chamado.`
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'smart', label: '🤖 Resposta IA',
        text: `${timeGreeting} ${firstName}! Obrigado pela mensagem. Pode me contar mais sobre o que você precisa? Assim consigo te ajudar melhor 💜`
      });
    }

    if (suggestions.length < 2) {
      suggestions.push({
        type: 'custom', label: '✨ Personalizada',
        text: `${firstName}, me conta mais sobre o que você está buscando? Quero entender como posso te ajudar melhor 😊`
      });
    }

    return suggestions.slice(0, 3);
  },

  async fetchNvidiaCompletion(messages, systemPrompt = '') {
    const apiKey = localStorage.getItem('nvidiaApiKey');
    if (!apiKey) {
      throw new Error('NVIDIA API Key not found. Configure in Settings.');
    }

    const payload = {
      model: 'meta/llama3-70b-instruct',
      messages: [],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 512,
      stream: false
    };

    if (systemPrompt) {
      payload.messages.push({ role: 'system', content: systemPrompt });
    }

    payload.messages.push(...messages);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
    if (!localStorage.getItem('nvidiaApiKey')) {
      return new Promise(resolve => setTimeout(() => resolve(this.getGhostWriterSuggestions(conversation, contact)), 1000));
    }

    const brandVoice = (NexaData.settings && NexaData.settings.brandVoice)
      ? NexaData.settings.brandVoice.voiceDescription
      : 'Seja educado e prestativo.';

    const sentiment = this.analyzeSentiment(
      (conversation.messages || []).filter(m => m.from === 'contact').slice(-1)[0]?.text || ''
    );

    const systemPrompt = `Você é um assistente Ghost Writer especializado em atendimento e vendas no CRM NexaCore.
Sua identidade e tom de voz: ${brandVoice}
Cliente: ${contact.name}
Plataforma: ${contact.platform}
Sentimento atual da conversa: ${sentiment.label} (score: ${sentiment.score})
Sugira 2 opções curtas (1-2 frases). Formato JSON: ["Opção 1", "Opção 2"]`;

    const recentMessages = conversation.messages.slice(-5).map(m => ({
      role: m.sender === 'agent' ? 'assistant' : 'user',
      content: m.text
    }));

    try {
      const responseText = await this.fetchNvidiaCompletion(recentMessages, systemPrompt);
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
      return this.getGhostWriterSuggestions(conversation, contact);
    }
  },

  getStageRecommendation(deal, contact) {
    const recommendations = [];

    if (deal.stage === 'new' && contact.conversations >= 2) {
      recommendations.push({
        action: 'move', to: 'contacted',
        reason: 'Já houve contato ativo com o lead',
        confidence: 85
      });
    }

    if (deal.stage === 'contacted' && (contact.dna || {}).interest >= 70) {
      recommendations.push({
        action: 'move', to: 'qualified',
        reason: 'Alto nível de interesse detectado pela IA',
        confidence: 72
      });
    }

    if (deal.stage === 'qualified' && contact.pulseScore >= 75) {
      recommendations.push({
        action: 'move', to: 'proposal',
        reason: 'Relacionamento maduro para proposta',
        confidence: 68
      });
    }

    if (deal.stage === 'proposal' && ((contact.dna || {}).interest >= 85 || contact.daysInStage >= 5)) {
      recommendations.push({
        action: 'move', to: 'negotiation',
        reason: contact.daysInStage >= 5 ? 'Proposta enviada há tempo suficiente' : 'Lead altamente interessado',
        confidence: contact.daysInStage >= 5 ? 60 : 75
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
        reason: `Deal parado há ${deal.daysInStage} dias em "${deal.stage}"`,
        confidence: 75
      });
    }

    if (deal.daysInStage >= 14 && deal.stage !== 'closed') {
      recommendations.push({
        action: 'alert',
        reason: `⚠️ Deal estagnado! ${deal.daysInStage} dias sem avanço. Sugiro revisar abordagem.`,
        confidence: 90
      });
    }

    if (contact.conversations === 0 && deal.stage !== 'new') {
      recommendations.push({
        action: 'move', to: 'new',
        reason: 'Nenhuma conversa registrada — lead precisa ser reabordado',
        confidence: 70
      });
    }

    return recommendations;
  },

  calculatePulse(contact) {
    const base = contact.pulseScore || 50;
    const lastContact = contact.lastContact ? new Date(contact.lastContact) : null;
    const daysSinceContact = lastContact
      ? Math.floor((new Date() - lastContact) / (1000 * 60 * 60 * 24))
      : 99;

    let adjusted = base;
    if (daysSinceContact <= 1) adjusted += 5;
    else if (daysSinceContact <= 3) adjusted += 0;
    else if (daysSinceContact <= 7) adjusted -= 10;
    else if (daysSinceContact <= 14) adjusted -= 20;
    else adjusted -= 30;

    if (contact.conversations >= 20) adjusted += 5;
    if (contact.conversations >= 50) adjusted += 8;

    const responseRate = contact.responseRate || 50;
    if (responseRate >= 80) adjusted += 5;
    else if (responseRate <= 30) adjusted -= 5;

    adjusted = Math.max(0, Math.min(100, adjusted));

    let status, color, animation, nextMilestone;
    if (adjusted >= 80) { status = 'Excelente'; color = 'green'; animation = 'fast'; nextMilestone = 'Mantenha o nível'; }
    else if (adjusted >= 60) { status = 'Saudável'; color = 'green'; animation = 'normal'; nextMilestone = 'Falta 1 interação para Excelente'; }
    else if (adjusted >= 40) { status = 'Atenção'; color = 'yellow'; animation = 'slow'; nextMilestone = 'Reativar contato para evitar queda'; }
    else if (adjusted >= 20) { status = 'Esfriando'; color = 'orange'; animation = 'very-slow'; nextMilestone = 'Risco de perda — agir urgente'; }
    else { status = 'Crítico'; color = 'red'; animation = 'flat'; nextMilestone = 'Campanha de reativação necessária'; }

    return { score: adjusted, status, color, animation, daysSinceContact, nextMilestone, responseRate };
  },

  generateInsights() {
    const insights = [];
    const contacts = NexaData.contacts || [];

    if (contacts.length === 0) return insights;

    const leadsByCity = {};
    for (const c of contacts) {
      if (c.city && c.city !== 'Montana') {
        leadsByCity[c.city] = (leadsByCity[c.city] || 0) + 1;
      }
    }
    const topCity = Object.entries(leadsByCity).sort((a, b) => b[1] - a[1])[0];
    if (topCity) {
      insights.push({
        type: 'concentration',
        icon: '📍',
        title: 'Concentração Geográfica',
        text: `${topCity[0]} tem ${topCity[1]} leads — maior concentração.`,
        severity: 'info'
      });
    }

    const highScore = contacts.filter(c => c.score >= 70);
    if (highScore.length > 0) {
      insights.push({
        type: 'opportunity',
        icon: '🎯',
        title: 'Leads Prioritários',
        text: `${highScore.length} leads com score ≥ 70 prontos para abordagem.`,
        severity: 'positive'
      });
    }

    const inactive = contacts.filter(c => {
      const dna = c.dna || {};
      return dna.frequency <= 30;
    });
    if (inactive.length > 0) {
      insights.push({
        type: 'warning',
        icon: '❄️',
        title: 'Leads Inativos',
        text: `${inactive.length} leads classificados como Inativos (baixa frequência). Campanha de reativação recomendada.`,
        severity: 'warning'
      });
    }

    const tagCounts = {};
    for (const c of contacts) {
      for (const tag of (c.tags || [])) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTag) {
      insights.push({
        type: 'pattern',
        icon: '🏷️',
        title: 'Segmento Principal',
        text: `Maioria dos leads é do segmento "${topTag[0]}" (${topTag[1]} contatos).`,
        severity: 'info'
      });
    }

    const totalPredicted = contacts.reduce((s, c) => s + (c.predictedValue || 0), 0);
    insights.push({
      type: 'revenue',
      icon: '💰',
      title: 'Receita Projetada',
      text: `Receita total projetada: R$ ${(totalPredicted / 1000).toFixed(1)}k com base nos leads atuais.`,
      severity: 'positive'
    });

    return insights;
  },

  generateNeuralMapData() {
    const contacts = NexaData.contacts || [];
    if (contacts.length === 0) return { nodes: [], links: [] };

    const nodes = contacts.map((c, i) => ({
      id: c.id,
      label: c.name.split(' ').slice(0, 2).join(' '),
      x: 0, y: 0,
      radius: 10 + (c.score / 10),
      color: c.platform === 'instagram' ? '#f472b6' : '#00d4aa',
      score: c.score,
      platform: c.platform,
      city: c.city,
      tags: c.tags || [],
      connections: []
    }));

    const links = [];
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const a = contacts[i], b = contacts[j];
        let strength = 0;

        const commonTags = (a.tags || []).filter(t => (b.tags || []).includes(t));
        strength += commonTags.length * 20;

        if (a.dna && b.dna) {
          const dnaDiff = Math.abs(a.dna.interest - b.dna.interest) +
                         Math.abs(a.dna.emotion - b.dna.emotion) +
                         Math.abs(a.dna.loyalty - b.dna.loyalty);
          if (dnaDiff < 40) strength += 25;
        }

        if (a.city && b.city && a.city === b.city) strength += 20;
        if (a.platform === b.platform) strength += 10;
        if (a.status === b.status) strength += 15;

        if (strength > 15) {
          links.push({
            source: a.id,
            target: b.id,
            strength: Math.min(100, Math.round(strength))
          });
        }
      }
    }

    return { nodes, links };
  },

  predictBestContactTime(contact) {
    const msgs = Array.isArray(contact.lastMessage) ? contact.lastMessage : [];
    if (!msgs || msgs.length === 0) {
      return {
        bestHour: 10,
        bestPeriod: 'Manhã (10h)',
        confidence: 30,
        note: 'Sem dados suficientes. Horário sugerido: 10h.'
      };
    }

    const hourCounts = {};
    for (const m of msgs) {
      const h = new Date(m.time || m.timestamp || Date.now()).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    }

    let bestHour = 10;
    let maxCount = 0;
    for (const [h, c] of Object.entries(hourCounts)) {
      if (c > maxCount) { maxCount = c; bestHour = parseInt(h); }
    }

    let bestPeriod;
    if (bestHour < 12) bestPeriod = `Manhã (${bestHour}h)`;
    else if (bestHour < 18) bestPeriod = `Tarde (${bestHour}h)`;
    else bestPeriod = `Noite (${bestHour}h)`;

    const totalMsgs = msgs.length;
    const confidence = Math.min(90, 30 + totalMsgs * 10);

    return { bestHour, bestPeriod, confidence, note: totalMsgs < 5 ? 'Poucos dados. Horário estimado.' : `Com base em ${totalMsgs} interações.` };
  },

  generateFullProfile(contact) {
    const dna = this.generateDNAProfile(contact);
    const pulse = this.calculatePulse(contact);
    const moments = this.predictBestContactTime(contact);

    let persona;
    const scores = dna.dimensions.map(d => d.value);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highTraits = dna.dimensions.filter(d => d.value >= 70).map(d => d.label);
    const lowTraits = dna.dimensions.filter(d => d.value <= 30).map(d => d.label);

    if (dna.archetype.includes('Embaixador')) persona = 'Cliente ideal — leal e influente. Invista no relacionamento.';
    else if (dna.archetype.includes('VIP')) persona = 'Altamente engajado. Responda rápido e ofereça exclusividade.';
    else if (dna.archetype.includes('Lead Quente')) persona = 'Pronto para comprar. Não deixe esfriar.';
    else if (dna.archetype.includes('Influenciador')) persona = 'Rede valiosa. Considere parceria.';
    else if (dna.archetype.includes('Fiel')) persona = 'Cliente estável. Busque upsell gradual.';
    else if (dna.archetype.includes('Explorador')) persona = 'Ainda pesquisando. Eduque com conteúdo.';
    else if (dna.archetype.includes('Inativo')) persona = 'Risco de churn. Campanha de reativação urgente.';
    else persona = 'Perfil mediano. Monitore e personalize a abordagem.';

    return {
      dna,
      pulse,
      bestTime: moments,
      persona,
      summary: `${contact.name} é um perfil ${dna.archetype}. ${persona}`,
      scores: Object.fromEntries(dna.dimensions.map(d => [d.label, d.value])),
      highTraits,
      lowTraits,
      avgScore: Math.round(avg)
    };
  }
};
