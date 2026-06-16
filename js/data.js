/* ═══════════════════════════════════════════════════════════════
   NexaCore CRM — Mock Data Layer
   Realistic data for all CRM features
   ═══════════════════════════════════════════════════════════════ */

const NexaData = {

  /* ── Contacts ── */
  contacts: [
    {
      id: 'c1', name: 'Mariana Oliveira', avatar: null, initials: 'MO',
      email: 'mariana@oliveira.com', phone: '+55 11 98765-4321',
      platform: 'instagram', handle: '@mariana.olivr',
      status: 'lead', tags: ['premium', 'interessada'],
      score: 87, pulseScore: 92,
      lastContact: '2026-06-15T14:30:00', lastMessage: 'Adorei a proposta! Podemos conversar mais?',
      city: 'São Paulo', company: 'Studio MO',
      dna: { frequency: 85, emotion: 78, response: 92, interest: 88, loyalty: 70, influence: 65 },
      notes: 'Muito engajada, responde rápido. Interesse em pacote premium.',
      createdAt: '2026-05-01T10:00:00',
      conversations: 14, totalSpent: 0, predictedValue: 4500
    },
    {
      id: 'c2', name: 'Rafael Santos', avatar: null, initials: 'RS',
      email: 'rafael.santos@gmail.com', phone: '+55 21 99876-5432',
      platform: 'whatsapp', handle: '+55 21 99876-5432',
      status: 'qualified', tags: ['vip', 'recorrente'],
      score: 94, pulseScore: 88,
      lastContact: '2026-06-15T16:45:00', lastMessage: 'Pode enviar o orçamento atualizado?',
      city: 'Rio de Janeiro', company: 'RS Digital',
      dna: { frequency: 90, emotion: 82, response: 95, interest: 92, loyalty: 88, influence: 78 },
      notes: 'Cliente recorrente, alto ticket. Sempre paga em dia.',
      createdAt: '2026-03-15T08:00:00',
      conversations: 38, totalSpent: 12500, predictedValue: 8000
    },
    {
      id: 'c3', name: 'Camila Ferreira', avatar: null, initials: 'CF',
      email: 'camila.f@hotmail.com', phone: '+55 31 97654-3210',
      platform: 'instagram', handle: '@camilaferreira',
      status: 'customer', tags: ['fiel', 'indicadora'],
      score: 96, pulseScore: 95,
      lastContact: '2026-06-14T20:15:00', lastMessage: 'Indiquei vocês para minha amiga! 💜',
      city: 'Belo Horizonte', company: 'Bella Estética',
      dna: { frequency: 92, emotion: 95, response: 88, interest: 85, loyalty: 96, influence: 90 },
      notes: 'Melhor cliente. Já indicou 5 novos clientes. Tratar como VIP máxima.',
      createdAt: '2026-01-10T14:00:00',
      conversations: 67, totalSpent: 28900, predictedValue: 5500
    },
    {
      id: 'c4', name: 'Lucas Mendes', avatar: null, initials: 'LM',
      email: 'lucas.m@empresa.com', phone: '+55 41 96543-2109',
      platform: 'whatsapp', handle: '+55 41 96543-2109',
      status: 'lead', tags: ['novo', 'indeciso'],
      score: 45, pulseScore: 38,
      lastContact: '2026-06-13T11:00:00', lastMessage: 'Vou pensar e volto a falar',
      city: 'Curitiba', company: 'Mendes & Cia',
      dna: { frequency: 30, emotion: 45, response: 55, interest: 40, loyalty: 20, influence: 35 },
      notes: 'Lead frio, precisa de nurturing. Demonstrou interesse inicial mas esfriou.',
      createdAt: '2026-06-01T09:00:00',
      conversations: 4, totalSpent: 0, predictedValue: 1200
    },
    {
      id: 'c5', name: 'Ana Paula Costa', avatar: null, initials: 'AC',
      email: 'anapaula@costa.com', phone: '+55 51 95432-1098',
      platform: 'instagram', handle: '@anapaulacosta',
      status: 'negotiation', tags: ['alta-prioridade', 'corporativo'],
      score: 78, pulseScore: 72,
      lastContact: '2026-06-15T09:20:00', lastMessage: 'Fechamos se conseguir 10% de desconto',
      city: 'Porto Alegre', company: 'Costa Group',
      dna: { frequency: 65, emotion: 60, response: 80, interest: 85, loyalty: 50, influence: 72 },
      notes: 'Negociando desconto corporativo. Potencial grande mas quer preço.',
      createdAt: '2026-05-20T16:00:00',
      conversations: 22, totalSpent: 0, predictedValue: 15000
    },
    {
      id: 'c6', name: 'Pedro Almeida', avatar: null, initials: 'PA',
      email: 'pedro@almeida.tech', phone: '+55 11 94321-0987',
      platform: 'whatsapp', handle: '+55 11 94321-0987',
      status: 'customer', tags: ['tech', 'mensal'],
      score: 82, pulseScore: 85,
      lastContact: '2026-06-15T13:10:00', lastMessage: 'Renovação feita! Valeu pela agilidade 🤙',
      city: 'São Paulo', company: 'AlmeidaTech',
      dna: { frequency: 75, emotion: 70, response: 90, interest: 78, loyalty: 82, influence: 60 },
      notes: 'Cliente tech, gosta de praticidade. Plano mensal renovado automaticamente.',
      createdAt: '2026-02-20T11:00:00',
      conversations: 28, totalSpent: 9600, predictedValue: 3200
    },
    {
      id: 'c7', name: 'Juliana Vieira', avatar: null, initials: 'JV',
      email: 'ju.vieira@gmail.com', phone: '+55 85 93210-9876',
      platform: 'instagram', handle: '@juvieira.oficial',
      status: 'qualified', tags: ['influencer', 'parceria'],
      score: 71, pulseScore: 68,
      lastContact: '2026-06-14T17:30:00', lastMessage: 'Posso fazer um unboxing no Stories? 📦',
      city: 'Fortaleza', company: 'JV Content',
      dna: { frequency: 60, emotion: 88, response: 72, interest: 75, loyalty: 45, influence: 95 },
      notes: 'Influencer com 120k seguidores. Potencial de parceria para divulgação.',
      createdAt: '2026-05-25T15:00:00',
      conversations: 12, totalSpent: 2400, predictedValue: 6000
    },
    {
      id: 'c8', name: 'Thiago Barbosa', avatar: null, initials: 'TB',
      email: 'thiago.b@outlook.com', phone: '+55 61 92109-8765',
      platform: 'whatsapp', handle: '+55 61 92109-8765',
      status: 'lost', tags: ['perdido', 'preço'],
      score: 22, pulseScore: 15,
      lastContact: '2026-05-28T10:45:00', lastMessage: 'Encontrei uma opção mais barata, obrigado',
      city: 'Brasília', company: 'Freelancer',
      dna: { frequency: 15, emotion: 35, response: 40, interest: 20, loyalty: 10, influence: 25 },
      notes: 'Perdido por preço. Considerar reativação com promoção.',
      createdAt: '2026-04-10T13:00:00',
      conversations: 8, totalSpent: 0, predictedValue: 0
    },
    {
      id: 'c9', name: 'Fernanda Lima', avatar: null, initials: 'FL',
      email: 'fernanda@lima.co', phone: '+55 71 91098-7654',
      platform: 'instagram', handle: '@fernandalima.co',
      status: 'customer', tags: ['premium', 'anual'],
      score: 91, pulseScore: 89,
      lastContact: '2026-06-15T11:55:00', lastMessage: 'Melhor investimento que fiz! Obrigada equipe!',
      city: 'Salvador', company: 'Lima Consultoria',
      dna: { frequency: 88, emotion: 92, response: 85, interest: 90, loyalty: 92, influence: 80 },
      notes: 'Plano anual premium. Extremamente satisfeita, candidata a case de sucesso.',
      createdAt: '2026-01-05T10:00:00',
      conversations: 45, totalSpent: 36000, predictedValue: 12000
    },
    {
      id: 'c10', name: 'Bruno Carvalho', avatar: null, initials: 'BC',
      email: 'bruno.c@carvalho.net', phone: '+55 27 90987-6543',
      platform: 'whatsapp', handle: '+55 27 90987-6543',
      status: 'lead', tags: ['orgânico', 'curioso'],
      score: 55, pulseScore: 50,
      lastContact: '2026-06-15T08:30:00', lastMessage: 'Vi o anúncio no Instagram, como funciona?',
      city: 'Vitória', company: 'BC Imports',
      dna: { frequency: 40, emotion: 55, response: 65, interest: 70, loyalty: 25, influence: 45 },
      notes: 'Lead orgânico do Instagram. Fase de descoberta.',
      createdAt: '2026-06-14T08:00:00',
      conversations: 2, totalSpent: 0, predictedValue: 3500
    }
  ],

  /* ── Conversations ── */
  conversations: [
    {
      id: 'conv1', contactId: 'c1', platform: 'instagram', unread: 2,
      lastActivity: '2026-06-15T14:30:00',
      sentiment: 'positive', sentimentScore: 82,
      messages: [
        { id: 'm1', from: 'contact', text: 'Oi! Vi o post de vocês sobre o plano premium 😍', time: '2026-06-15T14:00:00', sentiment: 'excited' },
        { id: 'm2', from: 'agent', text: 'Oi Mariana! Que bom que gostou! O plano premium inclui atendimento prioritário, relatórios avançados e consultoria mensal. Quer saber mais detalhes?', time: '2026-06-15T14:05:00' },
        { id: 'm3', from: 'contact', text: 'Sim! Quanto custa? E vocês fazem personalização?', time: '2026-06-15T14:12:00', sentiment: 'interested' },
        { id: 'm4', from: 'agent', text: 'Claro! O plano premium é R$ 1.500/mês com personalização total. Posso te enviar uma proposta detalhada?', time: '2026-06-15T14:15:00' },
        { id: 'm5', from: 'contact', text: 'Adorei a proposta! Podemos conversar mais?', time: '2026-06-15T14:30:00', sentiment: 'positive' }
      ]
    },
    {
      id: 'conv2', contactId: 'c2', platform: 'whatsapp', unread: 1,
      lastActivity: '2026-06-15T16:45:00',
      sentiment: 'neutral', sentimentScore: 65,
      messages: [
        { id: 'm6', from: 'contact', text: 'Boa tarde! Preciso renovar meu plano', time: '2026-06-15T16:00:00', sentiment: 'neutral' },
        { id: 'm7', from: 'agent', text: 'Boa tarde Rafael! Claro, seu plano atual vence dia 20. Quer manter as mesmas condições ou gostaria de um upgrade?', time: '2026-06-15T16:10:00' },
        { id: 'm8', from: 'contact', text: 'Pode enviar o orçamento atualizado?', time: '2026-06-15T16:45:00', sentiment: 'neutral' }
      ]
    },
    {
      id: 'conv3', contactId: 'c3', platform: 'instagram', unread: 0,
      lastActivity: '2026-06-14T20:15:00',
      sentiment: 'very_positive', sentimentScore: 96,
      messages: [
        { id: 'm9', from: 'contact', text: 'Gente, preciso contar uma coisa! 🤩', time: '2026-06-14T20:00:00', sentiment: 'excited' },
        { id: 'm10', from: 'agent', text: 'Conta tudo Camila! 😊', time: '2026-06-14T20:02:00' },
        { id: 'm11', from: 'contact', text: 'Indiquei vocês para minha amiga! Ela é dona de uma clínica e precisa muito do serviço de vocês 💜', time: '2026-06-14T20:15:00', sentiment: 'very_positive' },
        { id: 'm12', from: 'agent', text: 'Camila, você é incrível! Muito obrigada pela indicação! Vou cuidar da sua amiga com o mesmo carinho 💜', time: '2026-06-14T20:20:00' }
      ]
    },
    {
      id: 'conv4', contactId: 'c5', platform: 'instagram', unread: 1,
      lastActivity: '2026-06-15T09:20:00',
      sentiment: 'negotiating', sentimentScore: 55,
      messages: [
        { id: 'm13', from: 'contact', text: 'Bom dia! Analisei a proposta com meu sócio', time: '2026-06-15T09:00:00', sentiment: 'neutral' },
        { id: 'm14', from: 'agent', text: 'Bom dia Ana Paula! E o que acharam?', time: '2026-06-15T09:05:00' },
        { id: 'm15', from: 'contact', text: 'Gostamos muito, mas o valor ficou um pouco acima do orçamento', time: '2026-06-15T09:10:00', sentiment: 'hesitant' },
        { id: 'm16', from: 'contact', text: 'Fechamos se conseguir 10% de desconto', time: '2026-06-15T09:20:00', sentiment: 'negotiating' }
      ]
    },
    {
      id: 'conv5', contactId: 'c10', platform: 'whatsapp', unread: 1,
      lastActivity: '2026-06-15T08:30:00',
      sentiment: 'curious', sentimentScore: 60,
      messages: [
        { id: 'm17', from: 'contact', text: 'Vi o anúncio no Instagram, como funciona?', time: '2026-06-15T08:30:00', sentiment: 'curious' }
      ]
    },
    {
      id: 'conv6', contactId: 'c6', platform: 'whatsapp', unread: 0,
      lastActivity: '2026-06-15T13:10:00',
      sentiment: 'positive', sentimentScore: 85,
      messages: [
        { id: 'm18', from: 'agent', text: 'Pedro, sua renovação está pronta! Mesmo valor, mesmas condições. Só preciso da confirmação.', time: '2026-06-15T12:50:00' },
        { id: 'm19', from: 'contact', text: 'Renovação feita! Valeu pela agilidade 🤙', time: '2026-06-15T13:10:00', sentiment: 'satisfied' }
      ]
    },
    {
      id: 'conv7', contactId: 'c7', platform: 'instagram', unread: 0,
      lastActivity: '2026-06-14T17:30:00',
      sentiment: 'positive', sentimentScore: 78,
      messages: [
        { id: 'm20', from: 'contact', text: 'Oi NexaCore! Amei o produto que recebi 🎁', time: '2026-06-14T17:00:00', sentiment: 'excited' },
        { id: 'm21', from: 'agent', text: 'Que maravilha Juliana! Ficamos felizes! ❤️', time: '2026-06-14T17:10:00' },
        { id: 'm22', from: 'contact', text: 'Posso fazer um unboxing no Stories? 📦', time: '2026-06-14T17:30:00', sentiment: 'excited' }
      ]
    },
    {
      id: 'conv8', contactId: 'c9', platform: 'instagram', unread: 0,
      lastActivity: '2026-06-15T11:55:00',
      sentiment: 'very_positive', sentimentScore: 95,
      messages: [
        { id: 'm23', from: 'contact', text: 'Acabei de ver o relatório mensal... UAU! 🚀', time: '2026-06-15T11:40:00', sentiment: 'amazed' },
        { id: 'm24', from: 'agent', text: 'Fernanda!! Seus resultados estão incríveis! Crescimento de 43% esse mês!', time: '2026-06-15T11:45:00' },
        { id: 'm25', from: 'contact', text: 'Melhor investimento que fiz! Obrigada equipe!', time: '2026-06-15T11:55:00', sentiment: 'grateful' }
      ]
    }
  ],

  /* ── Pipeline Stages ── */
  pipelineStages: [
    { id: 'new', label: 'Novo Lead', color: 'blue', icon: '🆕' },
    { id: 'contacted', label: 'Contatado', color: 'purple', icon: '📨' },
    { id: 'qualified', label: 'Qualificado', color: 'orange', icon: '⭐' },
    { id: 'proposal', label: 'Proposta', color: 'yellow', icon: '📝' },
    { id: 'negotiation', label: 'Negociação', color: 'pink', icon: '🤝' },
    { id: 'closed', label: 'Fechado', color: 'green', icon: '✅' }
  ],

  /* ── Pipeline Deals ── */
  deals: [
    { id: 'd1', contactId: 'c10', stage: 'new', value: 3500, probability: 20, title: 'BC Imports — Plano Starter', aiReason: 'Lead orgânico recente, ainda em fase de descoberta', daysInStage: 1, platform: 'whatsapp' },
    { id: 'd2', contactId: 'c4', stage: 'contacted', value: 1200, probability: 15, title: 'Mendes & Cia — Consultoria', aiReason: 'Lead esfriando — última resposta há 2 dias', daysInStage: 3, platform: 'whatsapp' },
    { id: 'd3', contactId: 'c1', stage: 'qualified', value: 4500, probability: 65, title: 'Studio MO — Pacote Premium', aiReason: 'Sentimento positivo alto, engajamento crescente', daysInStage: 5, platform: 'instagram' },
    { id: 'd4', contactId: 'c7', stage: 'qualified', value: 6000, probability: 45, title: 'JV Content — Parceria Influencer', aiReason: 'Influencer interessada, alto potencial de divulgação', daysInStage: 3, platform: 'instagram' },
    { id: 'd5', contactId: 'c2', stage: 'proposal', value: 8000, probability: 75, title: 'RS Digital — Renovação Anual', aiReason: 'Cliente recorrente com histórico positivo de pagamento', daysInStage: 2, platform: 'whatsapp' },
    { id: 'd6', contactId: 'c5', stage: 'negotiation', value: 15000, probability: 60, title: 'Costa Group — Pacote Corporativo', aiReason: 'Negociando desconto de 10%, probabilidade alta se aceitar', daysInStage: 4, platform: 'instagram' },
    { id: 'd7', contactId: 'c6', stage: 'closed', value: 3200, probability: 100, title: 'AlmeidaTech — Renovação Mensal', aiReason: 'Renovação automática confirmada pelo cliente', daysInStage: 0, platform: 'whatsapp' },
    { id: 'd8', contactId: 'c9', stage: 'closed', value: 12000, probability: 100, title: 'Lima Consultoria — Plano Anual Premium', aiReason: 'Cliente fidelíssima, NPS máximo', daysInStage: 0, platform: 'instagram' },
    { id: 'd9', contactId: 'c3', stage: 'closed', value: 5500, probability: 100, title: 'Bella Estética — Upsell Premium', aiReason: 'Upgrade espontâneo, cliente indicou 5 novos leads', daysInStage: 0, platform: 'instagram' }
  ],

  /* ── Activity Feed ── */
  activities: [
    { id: 'a1', type: 'message', text: 'Mariana Oliveira enviou mensagem no Instagram', time: '2026-06-15T14:30:00', icon: '💬', color: 'pink' },
    { id: 'a2', type: 'deal', text: 'AlmeidaTech renovação movida para "Fechado"', time: '2026-06-15T13:10:00', icon: '🎉', color: 'green' },
    { id: 'a3', type: 'ai', text: 'IA detectou lead esfriando: Lucas Mendes', time: '2026-06-15T12:00:00', icon: '🤖', color: 'purple' },
    { id: 'a4', type: 'message', text: 'Fernanda Lima elogiou resultados no Instagram', time: '2026-06-15T11:55:00', icon: '⭐', color: 'yellow' },
    { id: 'a5', type: 'lead', text: 'Novo lead: Bruno Carvalho via WhatsApp', time: '2026-06-15T08:30:00', icon: '🆕', color: 'blue' },
    { id: 'a6', type: 'ai', text: 'IA sugere follow-up com Ana Paula Costa', time: '2026-06-15T08:00:00', icon: '🎯', color: 'orange' },
    { id: 'a7', type: 'message', text: 'Camila Ferreira indicou novo cliente!', time: '2026-06-14T20:15:00', icon: '💜', color: 'pink' },
    { id: 'a8', type: 'deal', text: 'Costa Group entrou em fase de negociação', time: '2026-06-14T18:00:00', icon: '🤝', color: 'orange' }
  ],

  /* ── KPI Data ── */
  kpis: {
    totalLeads: { value: 247, trend: 12.5, period: 'vs. mês passado' },
    conversions: { value: 38, trend: 8.3, period: 'vs. mês passado' },
    revenue: { value: 89700, trend: 15.2, period: 'vs. mês passado' },
    engagementScore: { value: 78, trend: 5.1, period: 'vs. mês passado' },
    activeConversations: { value: 64, trend: -2.1, period: 'vs. semana passada' },
    responseTime: { value: '4.2min', trend: -18.0, period: 'melhoria' }
  },

  /* ── Engagement Heatmap Data (hour x day) ── */
  heatmapData: [
    // [day (0=Mon), hour, intensity (0-100)]
    [0,8,20],[0,9,45],[0,10,65],[0,11,55],[0,12,30],[0,13,40],[0,14,70],[0,15,60],[0,16,50],[0,17,35],[0,18,55],[0,19,75],[0,20,60],[0,21,40],
    [1,8,15],[1,9,50],[1,10,70],[1,11,60],[1,12,25],[1,13,45],[1,14,80],[1,15,65],[1,16,55],[1,17,40],[1,18,60],[1,19,85],[1,20,70],[1,21,45],
    [2,8,25],[2,9,55],[2,10,60],[2,11,50],[2,12,35],[2,13,50],[2,14,75],[2,15,70],[2,16,60],[2,17,45],[2,18,65],[2,19,80],[2,20,55],[2,21,35],
    [3,8,30],[3,9,60],[3,10,75],[3,11,65],[3,12,40],[3,13,55],[3,14,85],[3,15,75],[3,16,65],[3,17,50],[3,18,70],[3,19,90],[3,20,65],[3,21,40],
    [4,8,35],[4,9,65],[4,10,80],[4,11,70],[4,12,45],[4,13,60],[4,14,90],[4,15,80],[4,16,70],[4,17,55],[4,18,75],[4,19,95],[4,20,70],[4,21,45],
    [5,8,10],[5,9,25],[5,10,40],[5,11,35],[5,12,20],[5,13,30],[5,14,45],[5,15,40],[5,16,35],[5,17,25],[5,18,50],[5,19,65],[5,20,80],[5,21,60],
    [6,8,5],[6,9,15],[6,10,25],[6,11,20],[6,12,10],[6,13,20],[6,14,30],[6,15,25],[6,16,20],[6,17,15],[6,18,35],[6,19,50],[6,20,65],[6,21,45]
  ],

  /* ── Analytics Chart Data ── */
  analytics: {
    revenueByMonth: [
      { month: 'Jan', instagram: 12000, whatsapp: 8500 },
      { month: 'Fev', instagram: 14500, whatsapp: 9200 },
      { month: 'Mar', instagram: 13800, whatsapp: 11000 },
      { month: 'Abr', instagram: 16200, whatsapp: 12400 },
      { month: 'Mai', instagram: 18500, whatsapp: 14100 },
      { month: 'Jun', instagram: 21000, whatsapp: 15800 }
    ],
    conversationsByDay: [
      { day: 'Seg', count: 45 }, { day: 'Ter', count: 52 }, { day: 'Qua', count: 48 },
      { day: 'Qui', count: 61 }, { day: 'Sex', count: 58 }, { day: 'Sab', count: 32 }, { day: 'Dom', count: 18 }
    ],
    sentimentDistribution: {
      positive: 58, neutral: 28, negative: 8, excited: 6
    },
    platformSplit: {
      instagram: 58, whatsapp: 42
    },
    topMetrics: {
      avgResponseTime: '4.2 min',
      customerSatisfaction: 94,
      conversionRate: 15.4,
      churnRate: 3.2
    }
  },

  /* ── Ghost Writer Suggestions ── */
  ghostWriterResponses: {
    greeting: [
      'Oi! Tudo bem? Que bom te ver por aqui! 😊 Como posso ajudar?',
      'Olá! Bem-vindo(a) à NexaCore! Estamos aqui para transformar seus resultados. Como posso te ajudar hoje?',
      'E aí! 👋 Vi que você se interessou pelos nossos serviços. Vamos conversar?'
    ],
    pricing: [
      'Nossos planos são super flexíveis! O Starter começa em R$ 997/mês e o Premium em R$ 2.497/mês. Qual se encaixa melhor no seu momento?',
      'Ótima pergunta! Temos opções para cada momento do seu negócio. Posso entender melhor suas necessidades para indicar o plano ideal?',
      'Investimento a partir de R$ 997/mês com retorno médio de 340%. Quer ver cases de clientes parecidos com o seu?'
    ],
    followUp: [
      'Oi! Passando para saber se teve alguma dúvida sobre nossa conversa. Estou à disposição! 😊',
      'E aí, conseguiu analisar a proposta? Qualquer ajuste que precise, é só falar!',
      'Bom dia! Só passando para lembrar que a condição especial é válida até sexta. Quer garantir?'
    ],
    objection: [
      'Entendo perfeitamente! O que posso fazer é ajustar o pacote para caber no seu orçamento sem perder os benefícios principais. Que tal?',
      'Compreendo! Muitos clientes pensaram o mesmo antes de ver os resultados. Posso te mostrar o ROI de clientes com perfil parecido?',
      'Sem problemas! Que tal começar com nosso plano Starter e ir evoluindo conforme os resultados aparecem?'
    ],
    closing: [
      'Perfeito! Vou preparar tudo para começar amanhã. Só preciso confirmar: prefere pagamento via Pix ou cartão?',
      'Ótima decisão! 🎉 Bem-vindo(a) à família NexaCore! Vou te enviar o acesso em instantes.',
      'Fechado! Vou te adicionar ao nosso grupo VIP de clientes. Prepare-se para resultados incríveis! 🚀'
    ]
  },

  /* ── Settings ── */
  settings: {
    brandVoice: {
      tone: 'friendly-professional',
      emojiUsage: 'moderate',
      language: 'pt-br',
      signOff: 'Equipe NexaCore',
      responseStyle: 'consultive'
    },
    automations: [
      { id: 'auto1', name: 'Boas-vindas automática', trigger: 'novo_lead', action: 'enviar_mensagem', active: true, platform: 'both' },
      { id: 'auto2', name: 'Follow-up 48h', trigger: 'sem_resposta_48h', action: 'enviar_followup', active: true, platform: 'both' },
      { id: 'auto3', name: 'Alerta lead esfriando', trigger: 'pulse_score_baixo', action: 'notificar_equipe', active: true, platform: 'both' },
      { id: 'auto4', name: 'Mover pipeline automático', trigger: 'conversa_qualificada', action: 'mover_estagio', active: false, platform: 'both' }
    ],
    team: [
      { id: 't1', name: 'Admin NexaCore', role: 'admin', email: 'admin@nexacore.com', avatar: null, initials: 'AN', active: true },
      { id: 't2', name: 'Maria Silva', role: 'agent', email: 'maria@nexacore.com', avatar: null, initials: 'MS', active: true },
      { id: 't3', name: 'João Pedro', role: 'agent', email: 'joao@nexacore.com', avatar: null, initials: 'JP', active: false }
    ]
  }
};

/* ── Helper Functions ── */
NexaData.getContact = function(id) {
  return this.contacts.find(c => c.id === id);
};

NexaData.getConversation = function(id) {
  return this.conversations.find(c => c.id === id);
};

NexaData.getConversationByContact = function(contactId) {
  return this.conversations.find(c => c.contactId === contactId);
};

NexaData.getDealsForStage = function(stageId) {
  return this.deals.filter(d => d.stage === stageId);
};

NexaData.getTotalPipelineValue = function() {
  return this.deals.reduce((sum, d) => sum + d.value, 0);
};

NexaData.getUnreadCount = function() {
  return this.conversations.reduce((sum, c) => sum + c.unread, 0);
};

NexaData.formatCurrency = function(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

NexaData.formatNumber = function(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
};

NexaData.timeAgo = function(dateStr) {
  const now = new Date('2026-06-15T21:00:00');
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
};

NexaData.formatTime = function(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};
