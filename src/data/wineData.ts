// Centralized wine product data based on V&W product list
// This file provides mock data for all EPS and Flexbudget pages

// Wine Products from the V&W catalog
export const wineProducts = [
  // Regional Line
  { regiao: 'Douro', tipo: 'Tinto', produto: 'V&W Douro Tinto', categoria: 'Regional' },
  { regiao: 'Douro', tipo: 'Branco', produto: 'V&W Douro Branco', categoria: 'Regional' },
  { regiao: 'Douro', tipo: 'Rosé', produto: 'V&W Douro Rosé', categoria: 'Regional' },
  { regiao: 'Alentejo', tipo: 'Tinto', produto: 'V&W Alentejo Tinto', categoria: 'Regional' },
  { regiao: 'Alentejo', tipo: 'Branco', produto: 'V&W Alentejo Branco', categoria: 'Regional' },
  { regiao: 'Alentejo', tipo: 'Rosé', produto: 'V&W Alentejo Rosé', categoria: 'Regional' },
  { regiao: 'Dão', tipo: 'Tinto', produto: 'V&W Dão Tinto', categoria: 'Regional' },
  { regiao: 'Dão', tipo: 'Branco', produto: 'V&W Dão Branco', categoria: 'Regional' },
  { regiao: 'Vinho Verde', tipo: 'Branco', produto: 'V&W Alvarinho/Loureiro', categoria: 'Regional' },
  { regiao: 'Vinho Verde', tipo: 'Rosé', produto: 'V&W Verde Rosé', categoria: 'Regional' },
  { regiao: 'Lisboa', tipo: 'Tinto', produto: 'V&W Lisboa Tinto', categoria: 'Regional' },
  { regiao: 'Lisboa', tipo: 'Branco', produto: 'V&W Lisboa Branco', categoria: 'Regional' },
  // Reserva Line
  { regiao: 'Douro', tipo: 'Tinto', produto: 'V&W Douro Reserva Tinto', categoria: 'Reserva' },
  { regiao: 'Douro', tipo: 'Branco', produto: 'V&W Douro Reserva Branco', categoria: 'Reserva' },
  { regiao: 'Alentejo', tipo: 'Tinto', produto: 'V&W Alentejo Reserva Tinto', categoria: 'Reserva' },
  { regiao: 'Alentejo', tipo: 'Branco', produto: 'V&W Alentejo Reserva Branco', categoria: 'Reserva' },
  { regiao: 'Alentejo', tipo: 'Rosé', produto: 'V&W Rosé Selection', categoria: 'Reserva' },
  { regiao: 'Dão', tipo: 'Tinto', produto: 'V&W Dão Reserva Tinto', categoria: 'Reserva' },
  { regiao: 'Dão', tipo: 'Branco', produto: 'V&W Dão Reserva (Encruzado)', categoria: 'Reserva' },
  { regiao: 'Vinho Verde', tipo: 'Branco', produto: 'V&W Alvarinho Reserva', categoria: 'Reserva' },
  { regiao: 'Lisboa', tipo: 'Tinto', produto: 'V&W Lisboa Reserva Tinto', categoria: 'Reserva' },
  { regiao: 'Lisboa', tipo: 'Branco', produto: 'V&W Lisboa Reserva Branco', categoria: 'Reserva' },
  // Premium Line
  { regiao: 'Douro', tipo: 'Tinto', produto: 'V&W Heritage (Grande Reserva)', categoria: 'Premium' },
  { regiao: 'Douro', tipo: 'Branco', produto: 'V&W Terroir Branco Premium', categoria: 'Premium' },
  { regiao: 'Douro', tipo: 'Rosé', produto: 'V&W Rosé Millésime', categoria: 'Premium' },
  { regiao: 'Alentejo', tipo: 'Tinto', produto: 'V&W Signature Edition', categoria: 'Premium' },
  { regiao: 'Alentejo', tipo: 'Branco', produto: 'V&W Alentejo Private Select', categoria: 'Premium' },
  { regiao: 'Dão', tipo: 'Tinto', produto: 'V&W Nobre Tinto', categoria: 'Premium' },
  { regiao: 'Dão', tipo: 'Branco', produto: 'V&W Encruzado Premium', categoria: 'Premium' },
  { regiao: 'Vinho Verde', tipo: 'Branco', produto: 'V&W Monovarietal Premium', categoria: 'Premium' },
  { regiao: 'Lisboa', tipo: 'Tinto', produto: 'V&W Atlantic Gold Premium', categoria: 'Premium' },
];

// Wine regions
export const wineRegioes = ['Douro', 'Alentejo', 'Dão', 'Vinho Verde', 'Lisboa'];

// Wine types
export const wineTipos = ['Tinto', 'Branco', 'Rosé'];

// Wine categories
export const wineCategorias = ['Regional', 'Reserva', 'Premium'];

// ========== EXECUTIVO PAGE DATA ==========
export const executivoMonthlyData = [
  { month: 'Jan', real: 185000, orcamento: 175000, preditivo: 180000, producaoReal: 180, producaoOrc: 170, producaoPred: 175 },
  { month: 'Fev', real: 210000, orcamento: 200000, preditivo: 205000, producaoReal: 195, producaoOrc: 185, producaoPred: 190 },
  { month: 'Mar', real: 245000, orcamento: 230000, preditivo: 235000, producaoReal: 220, producaoOrc: 210, producaoPred: 215 },
  { month: 'Abr', real: 265000, orcamento: 255000, preditivo: 260000, producaoReal: 240, producaoOrc: 230, producaoPred: 235 },
  { month: 'Mai', real: 290000, orcamento: 280000, preditivo: 285000, producaoReal: 260, producaoOrc: 250, producaoPred: 255 },
  { month: 'Jun', real: 320000, orcamento: 310000, preditivo: 315000, producaoReal: 285, producaoOrc: 275, producaoPred: 280 },
  { month: 'Jul', real: 380000, orcamento: 360000, preditivo: 370000, producaoReal: 340, producaoOrc: 320, producaoPred: 330 },
  { month: 'Ago', real: 420000, orcamento: 400000, preditivo: 410000, producaoReal: 380, producaoOrc: 360, producaoPred: 370 },
  { month: 'Set', real: 480000, orcamento: 450000, preditivo: 465000, producaoReal: 420, producaoOrc: 400, producaoPred: 410 },
  { month: 'Out', real: 520000, orcamento: 490000, preditivo: 505000, producaoReal: 460, producaoOrc: 440, producaoPred: 450 },
  { month: 'Nov', real: 450000, orcamento: 430000, preditivo: 440000, producaoReal: 400, producaoOrc: 385, producaoPred: 392 },
  { month: 'Dez', real: 560000, orcamento: 530000, preditivo: 545000, producaoReal: 490, producaoOrc: 470, producaoPred: 480 },
];

export const executivoPerformanceData = [
  { month: 'Jan', eficiencia: 88, utilizacao: 84, produtividade: 86 },
  { month: 'Fev', eficiencia: 89, utilizacao: 85, produtividade: 87 },
  { month: 'Mar', eficiencia: 91, utilizacao: 88, produtividade: 89 },
  { month: 'Abr', eficiencia: 90, utilizacao: 87, produtividade: 88 },
  { month: 'Mai', eficiencia: 92, utilizacao: 89, produtividade: 90 },
  { month: 'Jun', eficiencia: 93, utilizacao: 90, produtividade: 91 },
  { month: 'Jul', eficiencia: 95, utilizacao: 92, produtividade: 93 },
  { month: 'Ago', eficiencia: 94, utilizacao: 91, produtividade: 92 },
  { month: 'Set', eficiencia: 96, utilizacao: 93, produtividade: 94 },
  { month: 'Out', eficiencia: 95, utilizacao: 92, produtividade: 93 },
  { month: 'Nov', eficiencia: 93, utilizacao: 90, produtividade: 91 },
  { month: 'Dez', eficiencia: 97, utilizacao: 94, produtividade: 95 },
];

export const executivoKpisFinanceiros = [
  { label: 'RECEITA VENDAS', value: '4.325.000€', real: 'Real: 24,5%', orc: 'Orç: 22,8%', type: 'REAL', change: 7.2, positive: true },
  { label: 'EBITDA', value: '865.000€', real: 'Real: 20,0%', orc: 'Orç: 18,5%', type: 'REAL', change: 8.1, positive: true },
  { label: 'MARGEM BRUTA', value: '58.4%', real: 'Real: 58,4%', orc: 'Orç: 55,0%', type: 'REAL', change: 3.4, positive: true },
  { label: 'CASH FLOW', value: '720.000€', real: 'Real: 16,6%', orc: 'Orç: 15,0%', type: 'REAL', change: 1.6, positive: true },
];

export const executivoKpisOperacionais = [
  { label: 'PRODUÇÃO (Litros)', value: '2.8M L', real: 'Real: 2,8M', orc: 'Orç: 2,6M', type: 'REAL', change: 7.7, positive: true },
  { label: 'EFICIÊNCIA ENGARRAFAMENTO', value: '94.2%', real: 'Real: 94,2%', orc: 'Orç: 92,0%', type: 'REAL', change: 2.2, positive: true },
  { label: 'TAXA OCUPAÇÃO ADEGA', value: '87.5%', real: 'Real: 87,5%', orc: 'Orç: 85,0%', type: 'REAL', change: 2.5, positive: true },
];

export const executivoAlertas = [
  { type: 'high', title: 'Stock crítico detetado em', detail: '"V&W Douro Reserva Tinto"', level: 'Alto' },
  { type: 'high', title: 'Aumento de procura previsto para', detail: '"V&W Alvarinho Reserva" (+35%)', level: 'Alto' },
  { type: 'high', title: 'Desvio de produção identificado em', detail: '"Linha de Engarrafamento #2"', level: 'Alto' },
  { type: 'medium', title: 'Tendência de subida identificada em', detail: '"Vendas Mercado Exportação"', level: 'Médio' },
  { type: 'medium', title: 'Correlação moderada detetada entre', detail: '"Temperatura Adega e Qualidade"', level: 'Médio' },
  { type: 'low', title: 'Indicador estável com desvio mínimo', detail: '"Custos de Produção"', level: 'Baixo' },
];

// ========== CONTROLO PAGE DATA ==========
export const controloProdutoData = [
  { name: 'V&W Douro Reserva', rentabilidade: 95, custos: 42 },
  { name: 'V&W Signature Edition', rentabilidade: 88, custos: 48 },
  { name: 'V&W Heritage', rentabilidade: 82, custos: 55 },
  { name: 'V&W Alvarinho Reserva', rentabilidade: 78, custos: 38 },
  { name: 'V&W Alentejo Tinto', rentabilidade: 72, custos: 35 },
  { name: 'V&W Dão Branco', rentabilidade: 68, custos: 32 },
];

export const controloCanalData = [
  { name: 'Horeca', meta: 850, atual: 820 },
  { name: 'Retalho', meta: 650, atual: 590 },
  { name: 'Exportação', meta: 450, atual: 480 },
  { name: 'E-commerce', meta: 250, atual: 285 },
];

export const controloMercadoData = [
  { name: 'Portugal', penetracao: 78, competitividade: 65 },
  { name: 'Brasil', penetracao: 45, competitividade: 52 },
  { name: 'Angola', penetracao: 38, competitividade: 42 },
  { name: 'Alemanha', penetracao: 28, competitividade: 35 },
];

export const controloCustosData = [
  { name: 'V&W Douro', diretos: 42, indiretos: 18 },
  { name: 'V&W Alentejo', diretos: 38, indiretos: 16 },
  { name: 'V&W Dão', diretos: 35, indiretos: 15 },
  { name: 'V&W Lisboa', diretos: 32, indiretos: 14 },
];

export const controloEficienciaData = [
  { name: 'Horeca', eficiencia: 94, potencial: 12 },
  { name: 'Retalho', eficiencia: 82, potencial: 8 },
  { name: 'Exportação', eficiencia: 88, potencial: 18 },
  { name: 'E-commerce', eficiencia: 76, potencial: 25 },
];

export const controloExpansaoData = [
  { name: 'Premium', value: 35, color: '#8B1538' },
  { name: 'Reserva', value: 30, color: '#B91C47' },
  { name: 'Regional', value: 25, color: '#D4A5A5' },
  { name: 'Exportação', value: 10, color: '#C9A227' },
];

// ========== DECISAO PAGE DATA ==========
export const decisaoCashFlowData = [
  { month: 'Jan', value: 145000, cumulative: 145000 },
  { month: 'Fev', value: 168000, cumulative: 313000 },
  { month: 'Mar', value: 195000, cumulative: 508000 },
  { month: 'Abr', value: 220000, cumulative: 728000 },
  { month: 'Mai', value: 285000, cumulative: 1013000 },
  { month: 'Jun', value: 320000, cumulative: 1333000 },
  { month: 'Jul', value: 380000, cumulative: 1713000 },
  { month: 'Ago', value: 420000, cumulative: 2133000 },
  { month: 'Set', value: 485000, cumulative: 2618000 },
  { month: 'Out', value: 520000, cumulative: 3138000 },
];

export const decisaoCashFlowItems = [
  { name: 'Tintos Premium', inventario: 285.50, otimizacao: 342.80, color: '#8B1538' },
  { name: 'Brancos Reserva', inventario: 195.25, otimizacao: 228.40, color: '#B91C47' },
  { name: 'Rosés Selection', inventario: 85.80, otimizacao: null, color: '#D4A5A5' },
  { name: 'Espumantes', inventario: 125.40, otimizacao: 156.20, color: '#C9A227' },
  { name: 'Total', inventario: 691.95, otimizacao: null, color: '#4A5568' },
];

export const decisaoCashFlowRight = [
  { name: 'V&W Douro Reserva', inventario: '45.200', kpn: 3, margem: '28,5%' },
  { name: 'V&W Heritage', inventario: '38.500', kpn: 2, margem: '32,4%' },
  { name: 'V&W Signature Edition', inventario: '28.800', kpn: 2, margem: '35,2%' },
  { name: 'V&W Alvarinho Reserva', inventario: '22.400', kpn: 1, margem: '24,8%' },
  { name: 'V&W Dão Reserva', inventario: '18.600', kpn: 1, margem: '26,3%' },
  { name: 'Otimização Total', inventario: '153.500', kpn: 9, margem: '29,4%' },
];

export const decisaoCenarios = [
  { name: 'Aumentar Tintos Premium', cenarios: 85000, margem: '32,5%' },
  { name: 'Expandir Exportação', cenarios: 125000, margem: '28,4%' },
  { name: 'Nova Linha Espumantes', cenarios: 95000, margem: '34,2%' },
  { name: 'Reduzir Stock Regional', cenarios: 45000, margem: '22,8%' },
];

export const decisaoKpis = [
  { value: '153.500', label: 'Garrafas em Stock', change: 8.5, color: 'text-green-600' },
  { value: '2.850', label: 'Hectolitros', change: 5.2, color: 'text-green-600' },
  { value: '4.32M €', label: 'Valor Stock', change: 12.3, color: 'text-green-600' },
  { value: '98.5%', label: 'Taxa Qualidade', change: 0.8, color: 'text-green-600' },
  { value: '29.4%', label: 'Margem Média', change: 2.1, color: 'text-green-600' },
];

// ========== PRODUCAO PROCURA PAGE DATA ==========
export const producaoKpiData = {
  aiInsights: { value: 18, status: 'Modelo a otimizar previsões' },
  greeneries: { value: 2850, change: 8, status: 'Hectolitros em Produção' },
  demand: { value: '12.5K', change: 15, price: '€8.45/L' },
  aqInsights: { value: '28.5K', time: '720 HL' },
  accuracy: { value: '97%', change: 3 },
  capacity: { value: 850, stress: 4.2 },
};

export const producaoSeasonalDemandData = [
  { month: 'Jan', value: 45 },
  { month: 'Fev', value: 48 },
  { month: 'Mar', value: 55 },
  { month: 'Abr', value: 62 },
  { month: 'Mai', value: 68 },
  { month: 'Jun', value: 75 },
  { month: 'Jul', value: 88 },
  { month: 'Ago', value: 95 },
  { month: 'Set', value: 100 },
  { month: 'Out', value: 85 },
  { month: 'Nov', value: 72 },
  { month: 'Dez', value: 92 },
];

export const producaoAiAlerts = [
  { type: 'warning', title: 'Alerta de Rendimento', desc: 'Produção de V&W Douro pode aumentar 15% na vindima...' },
  { type: 'trend', title: 'Aumento de Procura', desc: 'Vinhos Premium com aumento de 28% no mercado exportação...' },
  { type: 'optimize', title: 'Otimização', desc: 'Eficiência da linha de engarrafamento pode melhorar 6%...' },
];

export const producaoWineSalesData = [
  { quarter: 'Q1', yieldEstimate: 180, general: 150, cabernet: 120 },
  { quarter: 'Q2', yieldEstimate: 220, general: 185, cabernet: 145 },
  { quarter: 'Q3', yieldEstimate: 380, general: 320, cabernet: 260 },
  { quarter: 'Q4', yieldEstimate: 420, general: 360, cabernet: 295 },
  { quarter: "Q1'", yieldEstimate: 195, general: 165, cabernet: 130 },
  { quarter: "Q2'", yieldEstimate: 245, general: 205, cabernet: 165 },
  { quarter: "Q3'", yieldEstimate: 410, general: 345, cabernet: 280 },
  { quarter: "Q4'", yieldEstimate: 455, general: 390, cabernet: 320 },
];

export const producaoHarvestPredictionData = [
  { name: 'Qualidade Uva Douro', green: 75, yellow: 18, red: 7 },
  { name: 'Rendimento Alentejo', green: 68, yellow: 22, red: 10 },
  { name: 'Maturação Vinho Verde', green: 82, yellow: 12, red: 6 },
  { name: 'Stock Barricas', green: 55, yellow: 30, red: 15 },
  { name: 'Condições Climáticas', green: 70, yellow: 20, red: 10 },
];

export const producaoCapacityData = [
  { period: 'Q1', current: 165, capacity: 210 },
  { period: 'Vindima', current: 195, capacity: 210 },
  { period: 'Q2', current: 145, capacity: 210 },
  { period: 'Estágio', current: 180, capacity: 210 },
  { period: 'Q3', current: 200, capacity: 210 },
  { period: 'Engarraf.', current: 175, capacity: 210 },
  { period: 'Q4', current: 155, capacity: 210 },
];

export const producaoForecastAccuracyData = [
  { quarter: 'Q1', demand: 280, marketDemand: 300 },
  { quarter: 'Q2', demand: 320, marketDemand: 345 },
  { quarter: 'Q3', demand: 450, marketDemand: 475 },
  { quarter: 'Q4', demand: 520, marketDemand: 540 },
  { quarter: "Q1'", demand: 295, marketDemand: 315 },
  { quarter: "Q2'", demand: 345, marketDemand: 365 },
  { quarter: "Q3'", demand: 480, marketDemand: 500 },
  { quarter: "Q4'", demand: 550, marketDemand: 570 },
];

export const producaoPlanningData = [
  { task: 'Vindima Douro', status: 'Concluído', q1: 100, q2: 0, q3: 0, q4: 0 },
  { task: 'Fermentação Tintos', status: 'Concluído', q1: 50, q2: 100, q3: 0, q4: 0 },
  { task: 'Estágio em Barrica', status: 'Em Progresso', q1: 0, q2: 60, q3: 100, q4: 0 },
  { task: 'Engarrafamento Premium', status: 'Em Progresso', q1: 0, q2: 0, q3: 80, q4: 100 },
  { task: 'Rotulagem Reservas', status: 'Pendente', q1: 0, q2: 0, q3: 40, q4: 0 },
  { task: 'Expedição Exportação', status: 'Pendente', q1: 0, q2: 0, q3: 0, q4: 30 },
  { task: 'Limpeza Adegas', status: 'Pendente', q1: 0, q2: 0, q3: 0, q4: 0 },
  { task: 'Controlo Qualidade', status: 'Em Risco', q1: 0, q2: 0, q3: 0, q4: 100 },
  { task: 'Manutenção Equipamentos', status: 'Pendente', q1: 0, q2: 0, q3: 0, q4: 0 },
];

// ========== FLEXBUDGET PAGE DATA ==========
export const flexbudgetChartData = [
  { name: 'Janeiro', vendas: 285000, investimento: 42000 },
  { name: 'Fevereiro', vendas: 320000, investimento: 38000 },
  { name: 'Março', vendas: 395000, investimento: 45000 },
  { name: 'Abril', vendas: 340000, investimento: 35000 },
  { name: 'Maio', vendas: 420000, investimento: 48000 },
  { name: 'Junho', vendas: 485000, investimento: 52000 },
  { name: 'Julho', vendas: 560000, investimento: 58000 },
  { name: 'Agosto', vendas: 620000, investimento: 62000 },
  { name: 'Setembro', vendas: 710000, investimento: 68000 },
  { name: 'Outubro', vendas: 580000, investimento: 55000 },
  { name: 'Novembro', vendas: 490000, investimento: 48000 },
];

export const flexbudgetProdutorData = [
  {
    nome: 'V&W Quinta do Douro',
    janeiro: 285000,
    fevereiro: 320000,
    marco: 395000,
    novembro: 490000,
    total: 1490000,
    vendas: { janeiro: 285000, fevereiro: 320000, marco: 395000, novembro: 490000, total: 1490000 },
    investimento: { janeiro: -42000, fevereiro: -38000, marco: -45000, novembro: -48000, total: -173000 },
  },
  {
    nome: 'V&W Herdade Alentejana',
    janeiro: 195000,
    fevereiro: 218000,
    marco: 265000,
    novembro: 328000,
    total: 1006000,
    vendas: { janeiro: 195000, fevereiro: 218000, marco: 265000, novembro: 328000, total: 1006000 },
    investimento: { janeiro: -28000, fevereiro: -25000, marco: -32000, novembro: -35000, total: -120000 },
  },
  {
    nome: 'V&W Caves do Dão',
    janeiro: 142000,
    fevereiro: 168000,
    marco: 195000,
    novembro: 245000,
    total: 750000,
    vendas: { janeiro: 142000, fevereiro: 168000, marco: 195000, novembro: 245000, total: 750000 },
    investimento: { janeiro: -18000, fevereiro: -15000, marco: -22000, novembro: -25000, total: -80000 },
  },
];

export const flexbudgetHierarchicalData = [
  {
    tipo: 'Vendas',
    expanded: true,
    adega: { real: 1490000, orcamento: '1.350.000 €', desvio: '+10,4%' },
    anselmo: { real: 1006000, orcamento: '950.000 €' },
    baron: { real: 750000, orcamento: '720.000 €' },
    children: [
      {
        tipo: 'Horeca',
        expanded: true,
        adega: { real: 595000, orcamento: '540.000 €', desvio: '+10,2%' },
        anselmo: { real: 402000, orcamento: '380.000 €' },
        baron: { real: 300000, orcamento: '288.000 €' },
        children: [
          { tipo: 'Restaurantes Premium', adega: { real: 357000, orcamento: '324.000 €', desvio: '+10,2%' }, anselmo: { real: 241000, orcamento: '228.000 €' }, baron: { real: 180000, orcamento: '172.800 €' } },
          { tipo: 'Hotéis 5 Estrelas', adega: { real: 238000, orcamento: '216.000 €', desvio: '+10,2%' }, anselmo: { real: 161000, orcamento: '152.000 €' }, baron: { real: 120000, orcamento: '115.200 €' } },
        ]
      },
      {
        tipo: 'Retalho',
        expanded: true,
        adega: { real: 447000, orcamento: '405.000 €', desvio: '+10,4%' },
        anselmo: { real: 302000, orcamento: '285.000 €' },
        baron: { real: 225000, orcamento: '216.000 €' },
        children: [
          { tipo: 'Supermercados', adega: { real: 268000, orcamento: '243.000 €', desvio: '+10,3%' }, anselmo: { real: 181000, orcamento: '171.000 €' }, baron: { real: 135000, orcamento: '129.600 €' } },
          { tipo: 'Lojas Especializadas', adega: { real: 179000, orcamento: '162.000 €', desvio: '+10,5%' }, anselmo: { real: 121000, orcamento: '114.000 €' }, baron: { real: 90000, orcamento: '86.400 €' } },
        ]
      },
    ]
  },
  {
    tipo: 'Investimento',
    expanded: true,
    adega: { real: -173000, orcamento: '-180.000 €', desvio: '-3,9%' },
    anselmo: { real: -120000, orcamento: '-125.000 €', desvio: '-4,0%' },
    baron: { real: -80000, orcamento: '-85.000 €', desvio: '-5,9%' },
    children: [
      {
        tipo: 'Marketing',
        adega: { real: -52000, orcamento: '-54.000 €' },
        anselmo: { real: -36000, orcamento: '-37.500 €' },
        baron: { real: -24000, orcamento: '-25.500 €' },
      },
      {
        tipo: 'Promoções',
        expanded: true,
        adega: { real: -86000, orcamento: '-90.000 €' },
        anselmo: { real: -60000, orcamento: '-62.500 €' },
        baron: { real: -40000, orcamento: '-42.500 €' },
        children: [
          { tipo: 'Degustações', adega: { real: -52000, orcamento: '-54.000 €' }, anselmo: { real: -36000, orcamento: '-37.500 €' }, baron: { real: -24000, orcamento: '-25.500 €' } },
          { tipo: 'Eventos', adega: { real: -34000, orcamento: '-36.000 €' }, anselmo: { real: -24000, orcamento: '-25.000 €' }, baron: { real: -16000, orcamento: '-17.000 €' } },
        ]
      },
    ]
  },
];

export const flexbudgetPfvSummaryData = [
  {
    nome: 'V&W Quinta do Douro',
    vendas: 595000,
    investimento: -86000,
    vendas2: 595000,
    investimento2: -86000,
  },
  {
    nome: 'V&W Herdade Alentejana',
    vendas: 402000,
    investimento: -60000,
    vendas2: 402000,
    investimento2: -60000,
  },
  {
    nome: 'V&W Caves do Dão',
    vendas: 300000,
    investimento: -40000,
    vendas2: 300000,
    investimento2: -40000,
  },
];

// ========== VISAO GERAL VENDAS DATA ==========
export const vendasChartData = [
  { name: '2024-10', vendas: 385000, orcamento: 360000 },
  { name: '2024-11', vendas: 420000, orcamento: 400000 },
  { name: '2024-12', vendas: 560000, orcamento: 520000 },
  { name: '2025-01', vendas: 285000, orcamento: 280000 },
  { name: '2025-02', vendas: 320000, orcamento: 310000 },
  { name: '2025-03', vendas: 395000, orcamento: 380000 },
  { name: '2025-04', vendas: 340000, orcamento: 330000 },
  { name: '2025-05', vendas: 420000, orcamento: 410000 },
  { name: '2025-06', vendas: 485000, orcamento: 470000 },
  { name: '2025-07', vendas: 560000, orcamento: 540000 },
  { name: '2025-08', vendas: 620000, orcamento: 600000 },
  { name: '2025-09', vendas: 710000, orcamento: 680000 },
];

export const vendasMonthlyData = [
  { mes: 'Janeiro', vendas: '285.000 €', orcamento: '280.000 €', desvio: '+1,8%' },
  { mes: 'Fevereiro', vendas: '320.000 €', orcamento: '310.000 €', desvio: '+3,2%' },
  { mes: 'Março', vendas: '395.000 €', orcamento: '380.000 €', desvio: '+3,9%' },
  { mes: 'Abril', vendas: '340.000 €', orcamento: '330.000 €', desvio: '+3,0%' },
  { mes: 'Maio', vendas: '420.000 €', orcamento: '410.000 €', desvio: '+2,4%' },
  { mes: 'Junho', vendas: '485.000 €', orcamento: '470.000 €', desvio: '+3,2%' },
  { mes: 'Julho', vendas: '560.000 €', orcamento: '540.000 €', desvio: '+3,7%' },
  { mes: 'Agosto', vendas: '620.000 €', orcamento: '600.000 €', desvio: '+3,3%' },
  { mes: 'Setembro', vendas: '710.000 €', orcamento: '680.000 €', desvio: '+4,4%' },
  { mes: 'Outubro', vendas: '580.000 €', orcamento: '560.000 €', desvio: '+3,6%' },
  { mes: 'Novembro', vendas: '490.000 €', orcamento: '480.000 €', desvio: '+2,1%' },
  { mes: 'Dezembro', vendas: '685.000 €', orcamento: '660.000 €', desvio: '+3,8%' },
];

export const vendasFamiliaData = [
  { familia: 'Tintos Premium', valor: 1850000 },
  { familia: 'Brancos Reserva', valor: 1420000 },
  { familia: 'Tintos Regional', valor: 980000 },
  { familia: 'Rosés Selection', valor: 580000 },
  { familia: 'Espumantes', valor: 420000 },
];

export const vendasCanalData = [
  { canal: 'Horeca', valor: '2.150.000 €' },
  { canal: 'Retalho', valor: '1.680.000 €' },
  { canal: 'Exportação', valor: '1.250.000 €' },
  { canal: 'E-commerce', valor: '420.000 €' },
];

export const vendasTopClientesData = [
  { cliente: 'Makro Portugal', valor: '485.000 €' },
  { cliente: 'El Corte Inglés', valor: '392.000 €' },
  { cliente: 'Garrafeira Nacional', valor: '328.000 €' },
  { cliente: 'Wine & Soul Distribuição', valor: '285.000 €' },
  { cliente: 'Continente Gourmet', valor: '245.000 €' },
];

// ========== HISTORICO VENDAS DATA ==========
export const historicoChartData = [
  { name: 'Janeiro', valor: 285000 },
  { name: 'Fevereiro', valor: 320000 },
  { name: 'Março', valor: 395000 },
  { name: 'Abril', valor: 340000 },
  { name: 'Maio', valor: 420000 },
  { name: 'Junho', valor: 485000 },
  { name: 'Julho', valor: 560000 },
  { name: 'Agosto', valor: 620000 },
  { name: 'Setembro', valor: 710000 },
  { name: 'Outubro', valor: 580000 },
  { name: 'Novembro', valor: 490000 },
  { name: 'Dezembro', valor: 685000 },
];

export const historicoTableData = [
  { mes: 'Janeiro', ano2024: '265.000 €', ano2025: '285.000 €', desvio: '+7,5%' },
  { mes: 'Fevereiro', ano2024: '298.000 €', ano2025: '320.000 €', desvio: '+7,4%' },
  { mes: 'Março', ano2024: '368.000 €', ano2025: '395.000 €', desvio: '+7,3%' },
  { mes: 'Abril', ano2024: '315.000 €', ano2025: '340.000 €', desvio: '+7,9%' },
  { mes: 'Maio', ano2024: '390.000 €', ano2025: '420.000 €', desvio: '+7,7%' },
  { mes: 'Junho', ano2024: '452.000 €', ano2025: '485.000 €', desvio: '+7,3%' },
];

// ========== ARTIGOS DATA ==========
export const artigosFamiliaData = [
  { familia: 'Tintos Premium', valor: 1850 },
  { familia: 'Brancos Reserva', valor: 1420 },
  { familia: 'Tintos Regional', valor: 980 },
  { familia: 'Rosés Selection', valor: 580 },
];

export const artigosData = [
  {
    categoria: 'Tintos Premium',
    expanded: true,
    ano1: 1650000,
    ano: 1850000,
    vsAno1: '+12,1%',
    cx9l1: 18350,
    cx9l: 20560,
    vsAno1_2: '+12,0%',
    euroCx1: 89.92,
    euroCx: 89.98,
    vsAno1_3: '+0,1%',
    children: [
      { nome: 'V&W Heritage (Grande Reserva)', ano1: 485000, ano: 545000, vsAno1: '+12,4%', cx9l1: 4850, cx9l: 5450, vsAno1_2: '+12,4%', euroCx1: 100.00, euroCx: 100.00, vsAno1_3: '0%' },
      { nome: 'V&W Signature Edition', ano1: 420000, ano: 472000, vsAno1: '+12,4%', cx9l1: 4670, cx9l: 5245, vsAno1_2: '+12,3%', euroCx1: 89.94, euroCx: 90.00, vsAno1_3: '+0,1%' },
      { nome: 'V&W Douro Reserva Tinto', ano1: 380000, ano: 425000, vsAno1: '+11,8%', cx9l1: 4750, cx9l: 5310, vsAno1_2: '+11,8%', euroCx1: 80.00, euroCx: 80.04, vsAno1_3: '+0,1%' },
      { nome: 'V&W Nobre Tinto', ano1: 365000, ano: 408000, vsAno1: '+11,8%', cx9l1: 4080, cx9l: 4555, vsAno1_2: '+11,6%', euroCx1: 89.46, euroCx: 89.57, vsAno1_3: '+0,1%' },
    ],
  },
  {
    categoria: 'Brancos Reserva',
    expanded: true,
    ano1: 1280000,
    ano: 1420000,
    vsAno1: '+10,9%',
    cx9l1: 16000,
    cx9l: 17750,
    vsAno1_2: '+10,9%',
    euroCx1: 80.00,
    euroCx: 80.00,
    vsAno1_3: '0%',
    children: [
      { nome: 'V&W Alvarinho Reserva', ano1: 385000, ano: 428000, vsAno1: '+11,2%', cx9l1: 4280, cx9l: 4755, vsAno1_2: '+11,1%', euroCx1: 89.95, euroCx: 90.01, vsAno1_3: '+0,1%' },
      { nome: 'V&W Terroir Branco Premium', ano1: 345000, ano: 382000, vsAno1: '+10,7%', cx9l1: 3840, cx9l: 4245, vsAno1_2: '+10,5%', euroCx1: 89.84, euroCx: 89.99, vsAno1_3: '+0,2%' },
      { nome: 'V&W Encruzado Premium', ano1: 310000, ano: 345000, vsAno1: '+11,3%', cx9l1: 3875, cx9l: 4310, vsAno1_2: '+11,2%', euroCx1: 80.00, euroCx: 80.05, vsAno1_3: '+0,1%' },
      { nome: 'V&W Dão Reserva (Encruzado)', ano1: 240000, ano: 265000, vsAno1: '+10,4%', cx9l1: 4005, cx9l: 4440, vsAno1_2: '+10,9%', euroCx1: 59.93, euroCx: 59.68, vsAno1_3: '-0,4%' },
    ],
  },
  {
    categoria: 'Tintos Regional',
    expanded: true,
    ano1: 880000,
    ano: 980000,
    vsAno1: '+11,4%',
    cx9l1: 22000,
    cx9l: 24500,
    vsAno1_2: '+11,4%',
    euroCx1: 40.00,
    euroCx: 40.00,
    vsAno1_3: '0%',
    children: [
      { nome: 'V&W Douro Tinto', ano1: 285000, ano: 318000, vsAno1: '+11,6%', cx9l1: 7125, cx9l: 7950, vsAno1_2: '+11,6%', euroCx1: 40.00, euroCx: 40.00, vsAno1_3: '0%' },
      { nome: 'V&W Alentejo Tinto', ano1: 265000, ano: 295000, vsAno1: '+11,3%', cx9l1: 6625, cx9l: 7375, vsAno1_2: '+11,3%', euroCx1: 40.00, euroCx: 40.00, vsAno1_3: '0%' },
      { nome: 'V&W Dão Tinto', ano1: 185000, ano: 207000, vsAno1: '+11,9%', cx9l1: 4625, cx9l: 5175, vsAno1_2: '+11,9%', euroCx1: 40.00, euroCx: 40.00, vsAno1_3: '0%' },
      { nome: 'V&W Lisboa Tinto', ano1: 145000, ano: 160000, vsAno1: '+10,3%', cx9l1: 3625, cx9l: 4000, vsAno1_2: '+10,3%', euroCx1: 40.00, euroCx: 40.00, vsAno1_3: '0%' },
    ],
  },
];

// ========== CLIENTES DATA ==========
export const clientesCanalData = [
  {
    canal: 'Horeca',
    expanded: true,
    ano1: '1.980.000 €',
    ano: '2.150.000 €',
    vsAno1: '+8,6%',
    children: [
      {
        subcanal: 'Restaurantes Premium',
        expanded: true,
        ano1: '1.250.000 €',
        ano: '1.380.000 €',
        vsAno1: '+10,4%',
        clientes: [
          { nome: 'Belcanto', ano1: '185.000 €', ano: '205.000 €', vsAno1: '+10,8%' },
          { nome: 'Alma', ano1: '165.000 €', ano: '182.000 €', vsAno1: '+10,3%' },
          { nome: 'Ocean', ano1: '142.000 €', ano: '158.000 €', vsAno1: '+11,3%' },
          { nome: 'Vila Joya', ano1: '128.000 €', ano: '142.000 €', vsAno1: '+10,9%' },
        ],
      },
      {
        subcanal: 'Hotéis 5 Estrelas',
        expanded: true,
        ano1: '730.000 €',
        ano: '770.000 €',
        vsAno1: '+5,5%',
        clientes: [
          { nome: 'Four Seasons Ritz', ano1: '145.000 €', ano: '158.000 €', vsAno1: '+9,0%' },
          { nome: 'Pestana Palace', ano1: '125.000 €', ano: '132.000 €', vsAno1: '+5,6%' },
          { nome: 'Yeatman', ano1: '118.000 €', ano: '128.000 €', vsAno1: '+8,5%' },
        ],
      },
    ],
  },
];

export const clientesTopData = [
  { cliente: 'Makro Portugal', valor: '485.000 €' },
  { cliente: 'El Corte Inglés', valor: '392.000 €' },
  { cliente: 'Garrafeira Nacional', valor: '328.000 €' },
  { cliente: 'Wine & Soul Distribuição', valor: '285.000 €' },
  { cliente: 'Continente Gourmet', valor: '245.000 €' },
];

// ========== VOLUMES DATA ==========
export const volumesCanais = ['Horeca', 'Retalho', 'Exportação', 'E-commerce'];
export const volumesArtigos = [
  'V&W Heritage (Grande Reserva)',
  'V&W Signature Edition',
  'V&W Douro Reserva Tinto',
  'V&W Alvarinho Reserva',
  'V&W Terroir Branco Premium',
  'V&W Encruzado Premium',
  'V&W Nobre Tinto',
  'V&W Dão Reserva (Encruzado)',
  'V&W Douro Tinto',
  'V&W Alentejo Tinto',
  'V&W Dão Tinto',
  'V&W Lisboa Tinto',
  'V&W Rosé Millésime',
];

export const volumesProdutosData = [
  'V&W Heritage (Grande Reserva)',
  'V&W Signature Edition',
  'V&W Douro Reserva Tinto',
  'V&W Alvarinho Reserva',
  'V&W Terroir Branco Premium',
  'V&W Encruzado Premium',
  'V&W Nobre Tinto',
  'V&W Dão Reserva (Encruzado)',
  'V&W Douro Tinto',
];

// ========== PRICING DATA ==========
export const pricingCanais = ['Horeca', 'Retalho', 'Exportação', 'E-commerce'];
export const pricingCategorias = [
  'Tintos Premium',
  'Brancos Reserva',
  'Tintos Regional',
  'Brancos Regional',
  'Rosés Selection',
  'Espumantes',
];

export const pricingProdutosData = [
  'V&W Heritage (Grande Reserva)',
  'V&W Signature Edition',
  'V&W Douro Reserva Tinto',
  'V&W Alvarinho Reserva',
  'V&W Terroir Branco Premium',
  'V&W Encruzado Premium',
  'V&W Nobre Tinto',
  'V&W Dão Reserva (Encruzado)',
  'V&W Douro Tinto',
];

// ========== AJUSTE CLIENTE DATA ==========
export const ajusteClienteCategorias = [
  'Tintos Premium',
  'Brancos Reserva',
  'Tintos Regional',
  'Brancos Regional',
  'Rosés Selection',
  'Espumantes',
];

export const ajusteClienteClientes = [
  'Makro Portugal',
  'El Corte Inglés',
  'Garrafeira Nacional',
  'Wine & Soul Distribuição',
  'Continente Gourmet',
  'Sonae MC',
  'Auchan Portugal',
];

export const ajusteClienteProdutosData = [
  'V&W Heritage (Grande Reserva)',
  'V&W Signature Edition',
  'V&W Douro Reserva Tinto',
  'V&W Alvarinho Reserva',
  'V&W Terroir Branco Premium',
  'V&W Encruzado Premium',
  'V&W Nobre Tinto',
  'V&W Dão Reserva (Encruzado)',
  'V&W Douro Tinto',
];

// ========== INVESTIMENTOS DATA ==========
export const investimentosEvolucaoData = [
  { mes: '2024-07', valor: 35000 },
  { mes: '2024-08', valor: 42000 },
  { mes: '2024-09', valor: 48000 },
  { mes: '2024-10', valor: 55000 },
  { mes: '2024-11', valor: 62000 },
  { mes: '2024-12', valor: 75000 },
  { mes: '2025-01', valor: 42000 },
  { mes: '2025-02', valor: 38000 },
  { mes: '2025-03', valor: 45000 },
  { mes: '2025-04', valor: 35000 },
  { mes: '2025-05', valor: 48000 },
  { mes: '2025-06', valor: 52000 },
];

export const investimentosMaterialData = [
  { name: 'Degustações', value: 185000, color: '#8B1538' },
  { name: 'Eventos Vínicos', value: 142000, color: '#C9A227' },
  { name: 'Material POS', value: 85000, color: '#D4A5A5' },
];

export const investimentosTopMarcasData = [
  { marca: 'V&W Premium Collection', valor: 245000 },
  { marca: 'V&W Reserva Selection', valor: 185000 },
  { marca: 'V&W Regional Wines', valor: 125000 },
];

export const investimentosProdutorData = [
  { produtor: 'V&W Quinta do Douro', valor: 285000 },
  { produtor: 'V&W Herdade Alentejana', valor: 195000 },
  { produtor: 'V&W Caves do Dão', valor: 142000 },
];

export const investimentosUnidadeData = [
  { unidade: 'Norte', valor: 285000 },
  { unidade: 'Centro', valor: 195000 },
  { unidade: 'Sul', valor: 142000 },
];

export const investimentosClienteData = [
  { cliente: 'Makro Portugal', percentage: 45 },
  { cliente: 'El Corte Inglés', percentage: 30 },
  { cliente: 'Garrafeira Nacional', percentage: 25 },
];

// ========== ATIVACOES DATA ==========
export const ativacoesTipoPedidoData = [
  { name: 'Degustações Premium', value: 85000, color: '#8B1538' },
  { name: 'Eventos Vínicos', value: 62000, color: '#C9A227' },
  { name: 'Promoções Horeca', value: 45000, color: '#D4A5A5' },
  { name: 'Material POS', value: 28000, color: '#E8C8C8' },
];

export const ativacoesEvolucaoData = [
  { mes: 'Julho', valor: 58000 },
  { mes: 'Agosto', valor: 65000 },
  { mes: 'Setembro', valor: 72000 },
  { mes: 'Outubro', valor: 68000 },
  { mes: 'Novembro', valor: 75000 },
];

export const ativacoesMaterialData = [
  { material: 'Degustação V&W Heritage', novembro: 18500, total: 18500 },
  { material: 'Degustação V&W Signature', novembro: 15200, total: 15200 },
  { material: 'Evento Vindima Douro', novembro: 12800, total: 12800 },
  { material: 'Promoção Horeca Premium', novembro: 9500, total: 9500 },
  { material: 'Material POS Garrafeiras', novembro: 6200, total: 6200 },
  { material: 'Feira Vinhos Lisboa', novembro: 5800, total: 5800 },
  { material: 'Patrocínio Festival Vinho', novembro: 4500, total: 4500 },
  { material: 'Newsletter Digital', novembro: 1500, total: 1500 },
  { material: 'Publicidade Redes Sociais', novembro: 1000, total: 1000 },
];

// ========== ORCAMENTO CANAL DATA ==========
export const orcamentoCanalData = [
  {
    id: '1',
    canal: 'Horeca',
    investimentoAno1: 285000,
    orcamento: 320000,
    orcVsInv: '+12,3%',
    vendas: 2150000,
    ativacoes: -86000,
    net2: 2064000,
    percVendas: '4,0%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '1.1', canal: 'Restaurantes Premium', investimentoAno1: 145000, orcamento: 165000, orcVsInv: '+13,8%', vendas: 1380000, ativacoes: -52000, net2: 1328000, percVendas: '3,8%', level: 1 },
      { id: '1.2', canal: 'Hotéis 5 Estrelas', investimentoAno1: 85000, orcamento: 95000, orcVsInv: '+11,8%', vendas: 520000, ativacoes: -25000, net2: 495000, percVendas: '4,8%', level: 1 },
      { id: '1.3', canal: 'Bares Enotecas', investimentoAno1: 55000, orcamento: 60000, orcVsInv: '+9,1%', vendas: 250000, ativacoes: -9000, net2: 241000, percVendas: '3,6%', level: 1 },
    ],
  },
  {
    id: '2',
    canal: 'Retalho',
    investimentoAno1: 195000,
    orcamento: 215000,
    orcVsInv: '+10,3%',
    vendas: 1680000,
    ativacoes: -65000,
    net2: 1615000,
    percVendas: '3,9%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', canal: 'Supermercados', investimentoAno1: 95000, orcamento: 105000, orcVsInv: '+10,5%', vendas: 850000, ativacoes: -35000, net2: 815000, percVendas: '4,1%', level: 1 },
      { id: '2.2', canal: 'Garrafeiras', investimentoAno1: 65000, orcamento: 72000, orcVsInv: '+10,8%', vendas: 520000, ativacoes: -22000, net2: 498000, percVendas: '4,2%', level: 1 },
      { id: '2.3', canal: 'Lojas Gourmet', investimentoAno1: 35000, orcamento: 38000, orcVsInv: '+8,6%', vendas: 310000, ativacoes: -8000, net2: 302000, percVendas: '2,6%', level: 1 },
    ],
  },
  {
    id: '3',
    canal: 'Exportação',
    investimentoAno1: 125000,
    orcamento: 145000,
    orcVsInv: '+16,0%',
    vendas: 1250000,
    ativacoes: -48000,
    net2: 1202000,
    percVendas: '3,8%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '3.1', canal: 'Europa', investimentoAno1: 65000, orcamento: 75000, orcVsInv: '+15,4%', vendas: 680000, ativacoes: -28000, net2: 652000, percVendas: '4,1%', level: 1 },
      { id: '3.2', canal: 'Brasil', investimentoAno1: 35000, orcamento: 42000, orcVsInv: '+20,0%', vendas: 350000, ativacoes: -12000, net2: 338000, percVendas: '3,4%', level: 1 },
      { id: '3.3', canal: 'Angola', investimentoAno1: 25000, orcamento: 28000, orcVsInv: '+12,0%', vendas: 220000, ativacoes: -8000, net2: 212000, percVendas: '3,6%', level: 1 },
    ],
  },
];

// ========== ORCAMENTO MARCA DATA ==========
export const orcamentoMarcaData = [
  {
    id: '1',
    produtor: 'V&W Premium Collection',
    investimentoAno1: 185000,
    orcamento: 215000,
    orcVsInv: '+16,2%',
    vendas: 1850000,
    ativacoes: -68000,
    net2: 1782000,
    percVendas: '3,7%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '1.1', produtor: 'V&W Heritage (Grande Reserva)', investimentoAno1: 65000, orcamento: 78000, orcVsInv: '+20,0%', vendas: 545000, ativacoes: -22000, net2: 523000, percVendas: '4,0%', level: 1 },
      { id: '1.2', produtor: 'V&W Signature Edition', investimentoAno1: 55000, orcamento: 65000, orcVsInv: '+18,2%', vendas: 472000, ativacoes: -18000, net2: 454000, percVendas: '3,8%', level: 1 },
      { id: '1.3', produtor: 'V&W Nobre Tinto', investimentoAno1: 35000, orcamento: 40000, orcVsInv: '+14,3%', vendas: 408000, ativacoes: -15000, net2: 393000, percVendas: '3,7%', level: 1 },
      { id: '1.4', produtor: 'V&W Atlantic Gold Premium', investimentoAno1: 30000, orcamento: 32000, orcVsInv: '+6,7%', vendas: 425000, ativacoes: -13000, net2: 412000, percVendas: '3,1%', level: 1 },
    ],
  },
  {
    id: '2',
    produtor: 'V&W Reserva Selection',
    investimentoAno1: 145000,
    orcamento: 165000,
    orcVsInv: '+13,8%',
    vendas: 1420000,
    ativacoes: -52000,
    net2: 1368000,
    percVendas: '3,7%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', produtor: 'V&W Douro Reserva Tinto', investimentoAno1: 42000, orcamento: 48000, orcVsInv: '+14,3%', vendas: 425000, ativacoes: -16000, net2: 409000, percVendas: '3,8%', level: 1 },
      { id: '2.2', produtor: 'V&W Alvarinho Reserva', investimentoAno1: 38000, orcamento: 44000, orcVsInv: '+15,8%', vendas: 428000, ativacoes: -14000, net2: 414000, percVendas: '3,3%', level: 1 },
      { id: '2.3', produtor: 'V&W Dão Reserva (Encruzado)', investimentoAno1: 32000, orcamento: 36000, orcVsInv: '+12,5%', vendas: 345000, ativacoes: -12000, net2: 333000, percVendas: '3,5%', level: 1 },
      { id: '2.4', produtor: 'V&W Terroir Branco Premium', investimentoAno1: 33000, orcamento: 37000, orcVsInv: '+12,1%', vendas: 222000, ativacoes: -10000, net2: 212000, percVendas: '4,5%', level: 1 },
    ],
  },
  {
    id: '3',
    produtor: 'V&W Regional Wines',
    investimentoAno1: 95000,
    orcamento: 105000,
    orcVsInv: '+10,5%',
    vendas: 980000,
    ativacoes: -35000,
    net2: 945000,
    percVendas: '3,6%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '3.1', produtor: 'V&W Douro Tinto', investimentoAno1: 28000, orcamento: 32000, orcVsInv: '+14,3%', vendas: 318000, ativacoes: -11000, net2: 307000, percVendas: '3,5%', level: 1 },
      { id: '3.2', produtor: 'V&W Alentejo Tinto', investimentoAno1: 25000, orcamento: 28000, orcVsInv: '+12,0%', vendas: 295000, ativacoes: -10000, net2: 285000, percVendas: '3,4%', level: 1 },
      { id: '3.3', produtor: 'V&W Dão Tinto', investimentoAno1: 22000, orcamento: 24000, orcVsInv: '+9,1%', vendas: 207000, ativacoes: -8000, net2: 199000, percVendas: '3,9%', level: 1 },
      { id: '3.4', produtor: 'V&W Lisboa Tinto', investimentoAno1: 20000, orcamento: 21000, orcVsInv: '+5,0%', vendas: 160000, ativacoes: -6000, net2: 154000, percVendas: '3,8%', level: 1 },
    ],
  },
];

// ========== DIVIDAS DATA ==========
export const dividasClientesBarData = [
  { status: 'Não Vencida', valor: 85000 },
  { status: 'Vencida', valor: 168000 },
];

export const dividasFornecedoresBarData = [
  { status: 'Não Vencida', valor: 42000 },
  { status: 'Vencida', valor: 95000 },
];

export const dividasIdadeClientesData = [
  { idade: '<30 dias', valor: 28000, color: '#8B1538' },
  { idade: '30-60 dias', valor: 22000, color: '#A52952' },
  { idade: '60-90 dias', valor: 18000, color: '#C9A227' },
  { idade: '90-180 dias', valor: 35000, color: '#D4B84A' },
  { idade: '180-270 dias', valor: 28000, color: '#D4A5A5' },
  { idade: '270-360 dias', valor: 22000, color: '#E8C8C8' },
  { idade: '>360 dias', valor: 15000, color: '#8B1538' },
];

export const dividasIdadeFornecedoresData = [
  { idade: '<30 dias', valor: 15000, color: '#8B1538' },
  { idade: '30-60 dias', valor: 12000, color: '#A52952' },
  { idade: '60-90 dias', valor: 18000, color: '#C9A227' },
  { idade: '90-180 dias', valor: 22000, color: '#D4B84A' },
  { idade: '180-270 dias', valor: 15000, color: '#D4A5A5' },
  { idade: '270-360 dias', valor: 8000, color: '#E8C8C8' },
  { idade: '>360 dias', valor: 5000, color: '#8B1538' },
];

export const dividaClientesCanalData = [
  {
    id: '1',
    canal: 'Horeca',
    naoVencidas: 42000,
    vencidas: 85000,
    menos30: 12000,
    de30a60: 15000,
    de60a90: 12000,
    de90a180: 18000,
    de180a270: 12000,
    de270a360: 10000,
    mais360: 6000,
    level: 0,
    isExpanded: true,
    children: [
      {
        id: '1.1',
        canal: 'Restaurantes Premium',
        naoVencidas: 25000,
        vencidas: 52000,
        menos30: 8000,
        de30a60: 10000,
        de60a90: 8000,
        de90a180: 12000,
        de180a270: 8000,
        de270a360: 4000,
        mais360: 2000,
        level: 1,
        isExpanded: true,
        children: [
          { id: '1.1.1', canal: 'Belcanto', naoVencidas: 8000, vencidas: 15000, menos30: 3000, de30a60: 4000, de60a90: 2000, de90a180: 3000, de180a270: 2000, de270a360: 1000, mais360: 0, level: 2 },
          { id: '1.1.2', canal: 'Alma', naoVencidas: 6000, vencidas: 12000, menos30: 2000, de30a60: 3000, de60a90: 2000, de90a180: 2000, de180a270: 2000, de270a360: 1000, mais360: 0, level: 2 },
          { id: '1.1.3', canal: 'Ocean', naoVencidas: 5000, vencidas: 10000, menos30: 1500, de30a60: 2000, de60a90: 2000, de90a180: 2500, de180a270: 1000, de270a360: 1000, mais360: 0, level: 2 },
        ],
      },
    ],
  },
  {
    id: '2',
    canal: 'Retalho',
    naoVencidas: 35000,
    vencidas: 65000,
    menos30: 10000,
    de30a60: 8000,
    de60a90: 12000,
    de90a180: 15000,
    de180a270: 10000,
    de270a360: 6000,
    mais360: 4000,
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', canal: 'Garrafeira Nacional', naoVencidas: 15000, vencidas: 28000, menos30: 5000, de30a60: 4000, de60a90: 6000, de90a180: 8000, de180a270: 3000, de270a360: 2000, mais360: 0, level: 1 },
      { id: '2.2', canal: 'Continente Gourmet', naoVencidas: 12000, vencidas: 22000, menos30: 3000, de30a60: 2000, de60a90: 4000, de90a180: 5000, de180a270: 5000, de270a360: 2000, mais360: 1000, level: 1 },
    ],
  },
];

export const dividaFornecedoresData = [
  { fornecedor: 'Tanoaria Portuguesa, Lda', naoVencidas: 15000, vencidas: 28000, mais360: 8000 },
  { fornecedor: 'Cork Supply Portugal', naoVencidas: 12000, vencidas: 22000, mais360: 6000 },
  { fornecedor: 'Vidreira Nacional', naoVencidas: 8000, vencidas: 18000, mais360: 4000 },
  { fornecedor: 'Rótulos Premium, S.A.', naoVencidas: 5000, vencidas: 12000, mais360: 2000 },
  { fornecedor: 'Logística Vinhos Express', naoVencidas: 2000, vencidas: 8000, mais360: 1500 },
  { fornecedor: 'Equipamentos Enológicos', naoVencidas: 0, vencidas: 7000, mais360: 2000 },
];

// ========== DEMONSTRACAO RESULTADOS DATA ==========
export const demonstracaoRubricaData = [
  { rubrica: 'Vendas de Vinhos', ano: 5890000, ano1: 5420000, highlight: false },
  { rubrica: 'Vendas Mercado Exportação', ano: 1250000, ano1: 1080000, highlight: false },
  { rubrica: 'Serviços de Enoturismo', ano: 185000, ano1: 165000, highlight: false },
  { rubrica: 'Custo das Mercadorias Vendidas', ano: -2420000, ano1: -2280000, highlight: false },
  { rubrica: 'Custo de Produção (Uvas e Vinificação)', ano: -1850000, ano1: -1720000, highlight: false },
  { rubrica: 'Fornecimentos e Serviços Externos', ano: -485000, ano1: -445000, highlight: false },
  { rubrica: 'Gastos com Pessoal Adega', ano: -620000, ano1: -580000, highlight: false },
  { rubrica: 'Gastos com Pessoal Comercial', ano: -380000, ano1: -350000, highlight: false },
  { rubrica: 'Imparidade de Stocks de Vinho', ano: -45000, ano1: -38000, highlight: false },
  { rubrica: 'Provisões para Garantias', ano: -12000, ano1: -10000, highlight: false },
  { rubrica: 'Outros Rendimentos (Subsídios)', ano: 85000, ano1: 72000, highlight: false },
  { rubrica: 'Outros Gastos Operacionais', ano: -68000, ano1: -62000, highlight: false },
  { rubrica: 'Resultado antes de depreciações (EBITDA)', ano: 1530000, ano1: 1252000, highlight: true },
  { rubrica: 'Depreciações (Equipamentos Adega)', ano: -185000, ano1: -175000, highlight: false },
  { rubrica: 'Depreciações (Barricas e Cubas)', ano: -95000, ano1: -88000, highlight: false },
  { rubrica: 'Resultado Operacional (EBIT)', ano: 1250000, ano1: 989000, highlight: true },
  { rubrica: 'Juros e Rendimentos Financeiros', ano: 18000, ano1: 15000, highlight: false },
  { rubrica: 'Juros e Gastos Financeiros', ano: -125000, ano1: -118000, highlight: false },
  { rubrica: 'Resultado antes de Impostos', ano: 1143000, ano1: 886000, highlight: true },
  { rubrica: 'Imposto sobre o Rendimento (21%)', ano: -240000, ano1: -186000, highlight: false },
  { rubrica: 'Resultado Líquido do Período', ano: 903000, ano1: 700000, highlight: true },
];

export const demonstracaoChartData = [
  { name: 'Receita Total', valor: 7325000 },
  { name: 'Margem Bruta', valor: 3055000 },
  { name: 'EBITDA', valor: 1530000 },
  { name: 'EBIT', valor: 1250000 },
  { name: 'Resultado Líquido', valor: 903000 },
];

// ========== ANALISE CONTAS DATA ==========
export const analiseContasRubricaData = [
  { rubrica: 'Vendas de Vinhos Tintos', ano: 3250000, ano1: 2980000, variacao: '+9,1%', expanded: true, children: [
    { rubrica: 'Tintos Premium', ano: 1850000, ano1: 1650000, variacao: '+12,1%' },
    { rubrica: 'Tintos Regional', ano: 980000, ano1: 880000, variacao: '+11,4%' },
    { rubrica: 'Tintos Reserva', ano: 420000, ano1: 450000, variacao: '-6,7%' },
  ]},
  { rubrica: 'Vendas de Vinhos Brancos', ano: 1890000, ano1: 1720000, variacao: '+9,9%', expanded: true, children: [
    { rubrica: 'Brancos Reserva', ano: 1420000, ano1: 1280000, variacao: '+10,9%' },
    { rubrica: 'Brancos Regional', ano: 470000, ano1: 440000, variacao: '+6,8%' },
  ]},
  { rubrica: 'Vendas de Rosés', ano: 580000, ano1: 520000, variacao: '+11,5%' },
  { rubrica: 'Vendas de Espumantes', ano: 420000, ano1: 380000, variacao: '+10,5%' },
  { rubrica: 'Exportação', ano: 1250000, ano1: 1080000, variacao: '+15,7%' },
];

export const analiseContasChartData = [
  { name: 'Tintos', valor: 3250000 },
  { name: 'Brancos', valor: 1890000 },
  { name: 'Exportação', valor: 1250000 },
  { name: 'Rosés', valor: 580000 },
  { name: 'Espumantes', valor: 420000 },
];
