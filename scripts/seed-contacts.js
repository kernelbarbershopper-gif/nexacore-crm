const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.lllrvopolytzyllnuvse',
  password: 'NexaCore2026!CRM',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000
});

const contacts = [
  {
    name: 'Snug & Thistle Boutique',
    email: null,
    phone: null,
    initials: 'SB',
    platform: 'instagram',
    handle: '@thesnugandthistle',
    status: 'lead',
    tags: ['boutique', 'moda-feminina', 'mentoria', 'billings'],
    score: 70,
    city: 'Billings',
    company: 'Snug & Thistle Boutique',
    notes: 'Boutique feminina com programa Youth Fashion Board. Faz evento "Shop & Top" com wine bar ao lado. Aberta em 03/jun/2026. Proprietária: Wendy Samson.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 5000
  },
  {
    name: 'Heelside Boards',
    email: null,
    phone: null,
    initials: 'HB',
    platform: 'instagram',
    handle: '@heelsideboards',
    status: 'lead',
    tags: ['esportes-aquaticos', 'wakeboard', 'kitesurf', 'missoula'],
    score: 75,
    city: 'Missoula',
    company: 'Heelside Boards',
    notes: 'Loja de esportes aquáticos. Única em MT a vender Cabrinha Kites e Ronix Wake. Soft opening 23/jun, Grand opening 26/jun/2026. Proprietário: Scott Elliott. Paxson Plaza, Missoula.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 8000
  },
  {
    name: "Grannie's Fabric & Crafts",
    email: null,
    phone: null,
    initials: 'GF',
    platform: 'instagram',
    handle: '@granniesfabric',
    status: 'lead',
    tags: ['artesanato', 'tecidos', 'DIY', 'butte'],
    score: 50,
    city: 'Butte',
    company: "Grannie's Fabric & Crafts",
    notes: 'Loja de tecidos e artesanato em Uptown Butte. Tecidos orgânicos,印花 indianos, kits DIY. Aberta em 02/jun/2026. End: 9 S Montana St, Butte, MT.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 3000
  },
  {
    name: 'Bricks & Minifigs Missoula',
    email: null,
    phone: null,
    initials: 'BM',
    platform: 'instagram',
    handle: '@bricksandminifigs_missoula',
    status: 'lead',
    tags: ['LEGO', 'brinquedos', 'missoula'],
    score: 65,
    city: 'Missoula',
    company: 'Bricks & Minifigs',
    notes: 'Loja oficial LEGO: compra, venda e troca. Grand opening 30/mai/2026. End: 1525 S Russell St, Missoula, MT 59801.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 4000
  },
  {
    name: 'Chick-fil-A Butte',
    email: null,
    phone: null,
    initials: 'CF',
    platform: 'instagram',
    handle: '@chickfila',
    status: 'lead',
    tags: ['fast-food', 'butte', 'rede-nacional'],
    score: 85,
    city: 'Butte',
    company: 'Chick-fil-A',
    notes: 'Nova unidade em Butte. Cornerstone Plaza, Harrison Ave. 110 empregos. Doação de $25.000 ao Montana Food Bank. Aberta 11/jun/2026. Owner: Calder Prevatt.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 15000
  },
  {
    name: 'Pine & Pour',
    email: null,
    phone: '406-407-2882',
    initials: 'PP',
    platform: 'instagram',
    handle: '@pineandpour',
    status: 'lead',
    tags: ['cafe', 'presentes', 'noxon'],
    score: 60,
    city: 'Noxon',
    company: 'Pine & Pour',
    notes: 'Café e loja de presentes. Aberto 7-14h, drive-up. Bebidas com nomes de lugares locais. Vende arte de artistas locais. End: 1402 Highway 200, Noxon, MT. Proprietária: Annie Manning.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 2500
  },
  {
    name: 'Northern Lights Design',
    email: 'sales@northernlightsdesign.com',
    phone: '406-314-8713',
    initials: 'ND',
    platform: 'instagram',
    handle: '@northernlightsdesign',
    status: 'lead',
    tags: ['design-interiores', 'pisos', 'kalispell'],
    score: 70,
    city: 'Kalispell',
    company: 'Northern Lights Design',
    notes: 'Showroom novo de pisos, azulejos, pedras e bancadas. Grand opening 11/mai/2026. End: 141 Alden Loop, Kalispell, MT 59901. Proprietário: Will Dillard.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 10000
  },
  {
    name: 'Flat Creek Mercantile',
    email: null,
    phone: null,
    initials: 'FM',
    platform: 'instagram',
    handle: '@flatcreekmercantile',
    status: 'lead',
    tags: ['conveniencia', 'posto-gasolina', 'wolf-creek'],
    score: 55,
    city: 'Wolf Creek',
    company: 'Flat Creek Mercantile',
    notes: 'Posto de gasolina + conveniência 4.000 sq ft em Bowman\'s Corner. Aberto nov/2025, grand opening oficial 04/jun/2026. Vai adicionar cozinha e café. Proprietários: Dan/Tina Freeman + Christi/Jason Levine.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 6000
  },
  {
    name: 'Front & Main Boutique',
    email: null,
    phone: null,
    initials: 'FM',
    platform: 'instagram',
    handle: '@frontandmainboutique',
    status: 'lead',
    tags: ['boutique', 'moda', 'conrad'],
    score: 55,
    city: 'Conrad',
    company: 'Front & Main Boutique',
    notes: 'Boutique no histórico prédio Kronebusch Electric, atrás do Main Drive-In. Roupas, presentes. Faz lives de compras no Facebook. Aberta mar/2026. Proprietária: Heather Carpenter.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 3000
  },
  {
    name: 'GRAE + CO',
    email: null,
    phone: '406-868-8578',
    initials: 'GC',
    platform: 'instagram',
    handle: '@graeandco',
    status: 'lead',
    tags: ['boutique', 'moda-masculina', 'moda-feminina', 'great-falls'],
    score: 65,
    city: 'Great Falls',
    company: 'GRAE + CO',
    notes: 'Boutique moderna com marcas de LA e NY + velas e joias locais. Faz private shopping parties 2x/mês. End: 427 Central Ave, Great Falls, MT 59401. Proprietária: Erica Ferrin.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 5000
  },
  {
    name: 'The Montana Shepherd',
    email: null,
    phone: null,
    initials: 'MS',
    platform: 'instagram',
    handle: '@themontanashepherd',
    status: 'lead',
    tags: ['skincare', 'artesanal', 'natural', 'online'],
    score: 60,
    city: 'Montana',
    company: 'The Montana Shepherd',
    notes: 'Skincare e sabonetes artesanais feitos em MT. Fundado em 2025. Ingredientes 100% limpos. A fundadora vinha da indústria biofarmacêutica. Proprietária: Hillary.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 3500
  },
  {
    name: 'Moka Boutique',
    email: null,
    phone: '406-582-0079',
    initials: 'MB',
    platform: 'instagram',
    handle: '@mokamontana',
    status: 'lead',
    tags: ['boutique', 'moda-feminina', 'bozeman'],
    score: 75,
    city: 'Bozeman',
    company: 'Moka Boutique',
    notes: '25+ anos em Bozeman. Nova sede no Copper Black Building. Marcas: Free People, Roxy, Billabong, Volcom. End: 122 East Main St, Bozeman, MT 59741. Grand opening weekend 24-26/abr/2026.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 7000
  },
  {
    name: '406 Worx Store',
    email: null,
    phone: null,
    initials: '4W',
    platform: 'instagram',
    handle: '@406worx',
    status: 'lead',
    tags: ['artesanato', 'presentes', 'decoracao', 'kalispell'],
    score: 50,
    city: 'Kalispell',
    company: '406 Worx Store',
    notes: 'Roupas personalizadas, presentes artesanais, decoração rústica. Foco em artesãos locais. End: 20 N Main St, Suite 131, Kalispell Center Mall, Kalispell, MT 59901.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 3000
  },
  {
    name: 'Stacks Clothing Co.',
    email: null,
    phone: '406-502-1686',
    initials: 'SC',
    platform: 'instagram',
    handle: '@stacksclothingcompany',
    status: 'lead',
    tags: ['moda-western', 'boutique', 'east-helena'],
    score: 70,
    city: 'East Helena',
    company: 'Stacks Clothing Co.',
    notes: 'Eleita "Best Clothing Store in Helena". Moda western autêntica. End: 7 W Main St, East Helena, MT 59635. Proprietário: Lanny Wock. Patrocina o Days of \'76 Rodeo.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 5000
  },
  {
    name: 'Rustic Mug Boutique',
    email: null,
    phone: '406-622-6495',
    initials: 'RM',
    platform: 'instagram',
    handle: '@rusticmugmt',
    status: 'lead',
    tags: ['boutique', 'presentes', 'fort-benton'],
    score: 55,
    city: 'Fort Benton',
    company: 'Rustic Mug Boutique',
    notes: 'Dupla mãe-filha (Karla e Leslie). Fica de frente para o Rio Missouri. End: 1714 Front St, Fort Benton, MT.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 3000
  },
  {
    name: 'Montana Girls Cowgirl Feathers',
    email: 'mtgirlscowgirlfeathers@gmail.com',
    phone: '406-249-3559',
    initials: 'MF',
    platform: 'instagram',
    handle: '@mtgirlscowgirl_feathers',
    status: 'lead',
    tags: ['acessorios', 'penas', 'eventos', 'kalispell'],
    score: 50,
    city: 'Kalispell',
    company: 'Montana Girls Cowgirl Feathers',
    notes: 'Acessórios de penas para cabelo, chapéus, brincos. Dupla mãe-filha. Atendem festivais, rodeios, despedidas. Fundada primavera 2024.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 2000
  },
  {
    name: 'Rowdy Rambler Boutique',
    email: 'rowdyramblerboutique@gmail.com',
    phone: null,
    initials: 'RR',
    platform: 'instagram',
    handle: '@rowdyramblerboutique',
    status: 'lead',
    tags: ['boutique', 'moda-feminina', 'online'],
    score: 45,
    city: 'Montana',
    company: 'Rowdy Rambler Boutique',
    notes: 'Jovem empreendedora que começou aos 18 anos. Loja online de roupas femininas. Também no TikTok.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 1500
  },
  {
    name: "J'z Fashion Threadz",
    email: null,
    phone: '406-433-5050',
    initials: 'JF',
    platform: 'instagram',
    handle: '@jzfashionthreadz',
    status: 'lead',
    tags: ['moda-feminina', 'sidney'],
    score: 45,
    city: 'Sidney',
    company: "J'z Fashion Threadz",
    notes: 'Loja de roupas femininas em Sidney, MT. Shopify + loja física. End: 113 E Main St, Sidney, MT 59270.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 2500
  },
  {
    name: 'IND HEMP, LLC',
    email: null,
    phone: '406-622-5680',
    initials: 'IH',
    platform: 'instagram',
    handle: '@indhempllc',
    status: 'lead',
    tags: ['hemp', 'produtos-naturais', 'fort-benton'],
    score: 50,
    city: 'Fort Benton',
    company: 'IND HEMP, LLC',
    notes: 'Produtos de cânhamo (hemp). End: 1210 22nd St, Fort Benton, MT 59442.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 4000
  },
  {
    name: 'Yellowstone Outfitters',
    email: 'info@yellowstoneoutfitters.com',
    phone: '406-586-7890',
    initials: 'YO',
    platform: 'instagram',
    handle: '@yellowstoneoutfitters',
    status: 'lead',
    tags: ['turismo', 'guias', 'pesca', 'west-yellowstone'],
    score: 80,
    city: 'West Yellowstone',
    company: 'Yellowstone Outfitters',
    notes: 'Guias de pesca e turismo no Parque Yellowstone. Aberto maio/2026. Foco em fly fishing. Proprietário: Mike Reynolds.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 12000
  },
  {
    name: 'Big Sky Brewing Co.',
    email: 'taproom@bigskybrewing.com',
    phone: '406-549-2777',
    initials: 'BS',
    platform: 'instagram',
    handle: '@bigskybrewing',
    status: 'lead',
    tags: ['cervejaria', 'taproom', 'eventos', 'missoula'],
    score: 85,
    city: 'Missoula',
    company: 'Big Sky Brewing Co.',
    notes: 'Nova taproom aberta jun/2026 em Missoula. Cervejas artesanais + música ao vivo. Capacidade 200 pessoas. Eventos corporativos.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 15000
  },
  {
    name: 'Montana Made Marketplace',
    email: 'hello@montanamade.com',
    phone: null,
    initials: 'MM',
    platform: 'instagram',
    handle: '@montanamademarketplace',
    status: 'lead',
    tags: ['marketplace', 'artesanato', 'ecommerce', 'helena'],
    score: 70,
    city: 'Helena',
    company: 'Montana Made Marketplace',
    notes: 'Marketplace online de artesãos de MT. Lançou plataforma abr/2026. 50+ vendedores locais. Modelo comissão 15%.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 8000
  },
  {
    name: 'Glacier Peaks Roofing',
    email: 'estimates@glacierpeaks.com',
    phone: '406-755-1234',
    initials: 'GP',
    platform: 'whatsapp',
    handle: '+14067551234',
    status: 'lead',
    tags: ['telhados', 'construcao', 'kalispell', 'servicos'],
    score: 75,
    city: 'Kalispell',
    company: 'Glacier Peaks Roofing',
    notes: 'Empresa de telhados residencial/comercial. Nova frota 2026. Certificados GAF Master Elite. 5 anos garantia mão de obra.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 10000
  },
  {
    name: 'Bozeman Wellness Studio',
    email: 'zen@bozemanwellness.com',
    phone: '406-522-9876',
    initials: 'BW',
    platform: 'instagram',
    handle: '@bozemanwellnessstudio',
    status: 'lead',
    tags: ['wellness', 'yoga', 'spa', 'bozeman'],
    score: 65,
    city: 'Bozeman',
    company: 'Bozeman Wellness Studio',
    notes: 'Studio yoga/pilates + spa. Aberto fev/2026. Aulas pré-natal, reabilitação. Membros: 120+. Proprietária: Sarah Chen.',
    conversations: 0,
    total_spent: 0,
    predicted_value: 6000
  }
];

async function run() {
  await client.connect();

  const insertedContacts = [];

  for (const c of contacts) {
    const dna = {
      frequency: Math.floor(Math.random() * 60) + 20,
      emotion: Math.floor(Math.random() * 60) + 20,
      response: Math.floor(Math.random() * 60) + 20,
      interest: Math.floor(Math.random() * 60) + 20,
      loyalty: Math.floor(Math.random() * 60) + 20,
      influence: Math.floor(Math.random() * 60) + 20
    };

    const sql = `
      INSERT INTO contacts (name, email, phone, initials, platform, handle, status, tags, score, city, company, dna, notes, conversations, total_spent, predicted_value, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now())
      ON CONFLICT DO NOTHING
      RETURNING id, name;
    `;

    try {
      const res = await client.query(sql, [
        c.name, c.email, c.phone, c.initials, c.platform, c.handle,
        c.status, c.tags, c.score, c.city, c.company, JSON.stringify(dna),
        c.notes, c.conversations, c.total_spent, c.predicted_value
      ]);
      if (res.rows.length > 0) {
        console.log(`✓ ${res.rows[0].name}`);
        insertedContacts.push({ ...res.rows[0], platform: c.platform, predicted_value: c.predicted_value, score: c.score });
      } else {
        const existing = await client.query('SELECT id, name FROM contacts WHERE handle = $1', [c.handle]);
        if (existing.rows.length > 0) {
          insertedContacts.push({ ...existing.rows[0], platform: c.platform, predicted_value: c.predicted_value, score: c.score });
        }
      }
    } catch (err) {
      console.error(`✗ ${c.name}: ${err.message}`);
    }
  }

  const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'];
  const sentiments = ['positive', 'neutral', 'neutral', 'negative', 'positive'];
  const greetings = ['Oi', 'Bom dia', 'Boa tarde', 'Olá', 'Hey'];
  const responses = [
    'Olá! Obrigado pelo contato. Como posso ajudar?',
    'Que bom falar com você! Posso tirar suas dúvidas.',
    'Perfeito, vou verificar isso para você.',
    'Entendi! Vou preparar uma proposta personalizada.',
    'Fico feliz com o interesse! Vou enviar mais detalhes.'
  ];
  const customerMessages = [
    'Quero saber mais sobre os planos',
    'Qual o valor do investimento?',
    'Vocês atendem minha região?',
    'Preciso de algo personalizado',
    'Tem como agendar uma demo?',
    'Pode mandar o catálogo?',
    'Quais formas de pagamento?',
    'Vocês têm suporte em português?',
    'Gostei muito do que vi!',
    'Estou comparando com outras opções'
  ];

  let dealCount = 0;
  let convCount = 0;

  for (const contact of insertedContacts) {
    const stageIdx = Math.min(stages.length - 1, Math.floor(contact.predicted_value / 3000));
    const stage = stages[stageIdx] || 'new';
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const numMessages = Math.floor(Math.random() * 4) + 1;
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
      messages.push({ id: `m${i}`, sender: 'contact', from: 'contact', text: customerMessages[Math.floor(Math.random() * customerMessages.length)], time: `${(8 + i * 2).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` });
      messages.push({ id: `m${i}r`, sender: 'agent', from: 'agent', text: responses[Math.floor(Math.random() * responses.length)], time: `${(9 + i * 2).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` });
    }

    const lastCustomerMsg = messages.filter(m => m.sender === 'contact').pop();
    const lastActivity = new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString();

    try {
      const dealRes = await client.query(`
        INSERT INTO deals (contact_id, stage, value, probability, title, platform, days_in_stage)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
        RETURNING id;
      `, [contact.id, stage, contact.predicted_value, Math.min(95, contact.score), `${contact.name} — Oportunidade`, contact.platform, Math.floor(Math.random() * 10)]);
      if (dealRes.rows.length > 0) dealCount++;

      const unread = Math.random() > 0.7 ? 1 : 0;
      const convRes = await client.query(`
        INSERT INTO conversations (contact_id, platform, unread, last_activity, sentiment, sentiment_score, messages)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
        RETURNING id;
      `, [contact.id, contact.platform, unread, lastActivity, sentiment, contact.score, JSON.stringify(messages)]);
      if (convRes.rows.length > 0) convCount++;

      try {
        await client.query(`
          INSERT INTO activities (type, text, time)
          VALUES ($1, $2, $3)
        `, [contact.platform, `Interação com ${contact.name}`, lastActivity]);
      } catch (_) {}
    } catch (err) {
      console.error(`✗ Deal/Conv ${contact.name}: ${err.message}`);
    }
  }

  await client.end();
  console.log(`\n→ ${insertedContacts.length} contatos, ${dealCount} deals, ${convCount} conversas inseridos.`);
}

run();
