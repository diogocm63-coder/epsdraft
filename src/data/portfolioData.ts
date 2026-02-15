import { wineProducts, wineCategorias } from './wineData';

export interface PortfolioMercado {
  mercado: string;
  regiao: string;
  certificacoes: string[];
  regrasEspecificas: string[];
  tempoTransporte: string[];
  tipoConsumidores: string[];
  tipoDistribuicao: string[];
  mixMarcas: PortfolioMarcaMix[];
  marcasEspecificas: string[];
  canais: string[];
  volumeAnual: string;
}

export interface PortfolioMarcaMix {
  categoria: string;
  percentagem: number;
}

// Product-Market association for Produtização view
export interface ProdutoMercadoAssoc {
  produto: string;
  categoria: string;
  regiao: string;
  mercados: { mercado: string; canais: string[]; tempoTransporte: string }[];
}

// Master lists for selection popups
export const masterCertificacoes = [
  'IVV', 'HACCP', 'IFS Food', 'BRC', 'ISO 22000', 'EU Organic',
  'ANVISA', 'MAPA Import License', 'IANORQ', 'TTB/COLA', 'FDA',
  'State Permits', 'HMRC Approval', 'WOWGR', 'AWRS', 'OFAG',
  'Swiss Customs', 'CIQ', 'CFDA', 'AQSIQ', 'SAQ (Canadá)',
  'LCBO', 'JAS (Japão)', 'KFDA (Coreia)',
];

export const masterRegras = [
  'Rotulagem PT obrigatória', 'Selo IVV', 'Rotulagem DE/EN',
  'Pfand (depósito)', 'Alérgenos obrigatórios', 'Limite SO₂',
  'Registo ANVISA', 'Etiqueta em Português-BR', 'Teor alcoólico visível',
  'Licença de importação', 'Rotulagem em Português',
  'Government Warning obrigatório', 'Sulfite Declaration', '3-Tier System',
  'Label approval TTB', 'Duty Stamps', 'Rotulagem EN',
  'Post-Brexit customs', 'Allergen labelling',
  'Rotulagem multilíngue (DE/FR/IT)', 'Certificado de origem',
  'Limites pesticidas CH', 'Etiqueta chinesa obrigatória',
  'Registo sanitário', 'Back label em Mandarim', 'Anti-dumping compliance',
  'Contra-rótulo obrigatório', 'Declaração de importador',
];

export const masterMarcas = wineProducts.map(p => p.produto);

export const masterCanais = [
  'Horeca', 'Retalho', 'E-commerce', 'Importadores', 'Wine Shops',
  'Fine Dining', 'Supermarkets', 'Wine Merchants', 'On-Trade',
  'Fachhandel', 'Online', 'Distribuição', 'Gastronomie', 'Detailhandel',
  'Horeca Premium', 'Wine Clubs', 'Retalho Moderno', 'Banqueting',
];

export const masterConsumidores = [
  'Consumidor Final', 'Horeca', 'Retalho', 'Importadores',
  'Horeca Premium', 'Wine Clubs', 'Online Retail', 'Fachhandel',
  'Wine Shops', 'Fine Dining', 'Supermarkets', 'Wine Merchants',
  'On-Trade', 'Gastronomie', 'Detailhandel', 'Private Clients',
  'E-commerce (Tmall/JD)', 'Banqueting', 'Retalho Moderno',
];

export const masterTipoDistribuicao = [
  'Distribuição Directa', 'Importador Exclusivo', 'Multi-Importador',
  'Agente Local', 'Joint Venture', 'Filial Própria', 'Marketplace',
  'Distribuidor Regional', 'Grossista', 'Cash & Carry',
];

export const masterTransporte = [
  '1-3 dias', '3-4 dias', '3-5 dias', '4-6 dias', '12-15 dias',
  '18-22 dias', '20-25 dias', '30-35 dias',
  'Via marítima', 'Via terrestre', 'Via aérea',
  'Contentor 20ft', 'Contentor 40ft', 'Groupage', 'FCL', 'LCL',
  'Temperatura controlada', 'Seguro obrigatório',
];

export const masterMercados = [
  'Portugal', 'Brasil', 'Angola', 'Alemanha', 'EUA', 'Reino Unido', 'Suíça', 'China',
];

// Generate product-market associations from existing data
const mercadoTransporte: Record<string, string> = {
  Portugal: '1-3 dias', Brasil: '18-22 dias', Angola: '12-15 dias',
  Alemanha: '3-5 dias', EUA: '20-25 dias', 'Reino Unido': '4-6 dias',
  Suíça: '3-4 dias', China: '30-35 dias',
};

const mercadoCanais: Record<string, string[]> = {
  Portugal: ['Horeca', 'Retalho', 'E-commerce'],
  Brasil: ['Importadores', 'Horeca'],
  Angola: ['Distribuição', 'Horeca'],
  Alemanha: ['Fachhandel', 'Online', 'Horeca'],
  EUA: ['Importadores', 'Wine Shops', 'Fine Dining'],
  'Reino Unido': ['Supermarkets', 'Wine Merchants', 'On-Trade'],
  Suíça: ['Gastronomie', 'Detailhandel'],
  China: ['Importadores', 'E-commerce', 'Banqueting'],
};

// Map products to markets based on marcasEspecificas in portfolioMercados (defined below)
const productToMarketsMap: Record<string, string[]> = {
  'V&W Douro Tinto': ['Portugal', 'Angola'],
  'V&W Alentejo Tinto': ['Angola'],
  'V&W Alentejo Reserva Tinto': ['Portugal', 'Reino Unido'],
  'V&W Heritage (Grande Reserva)': ['Portugal', 'Alemanha', 'Suíça', 'China'],
  'V&W Douro Reserva Tinto': ['Brasil', 'Angola', 'Alemanha', 'Reino Unido'],
  'V&W Signature Edition': ['Brasil', 'EUA', 'China'],
  'V&W Alvarinho Reserva': ['Brasil', 'Reino Unido'],
  'V&W Encruzado Premium': ['Alemanha', 'Suíça'],
  'V&W Terroir Branco Premium': ['EUA'],
  'V&W Nobre Tinto': ['Suíça'],
  'V&W Rosé Millésime': ['China'],
};

export const produtoMercadoAssociations: ProdutoMercadoAssoc[] = wineProducts.map(p => {
  const markets = productToMarketsMap[p.produto] || [];
  return {
    produto: p.produto,
    categoria: p.categoria,
    regiao: p.regiao,
    mercados: markets.map(m => ({
      mercado: m,
      canais: mercadoCanais[m] || [],
      tempoTransporte: mercadoTransporte[m] || '—',
    })),
  };
});

export const portfolioMercados: PortfolioMercado[] = [
  {
    mercado: 'Portugal',
    regiao: 'Europa',
    certificacoes: ['IVV', 'HACCP'],
    regrasEspecificas: ['Rotulagem PT obrigatória', 'Selo IVV'],
    tempoTransporte: ['1-3 dias', 'Via terrestre'],
    tipoConsumidores: ['Horeca', 'Retalho', 'Consumidor Final'],
    tipoDistribuicao: ['Distribuição Directa', 'Grossista'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 45 },
      { categoria: 'Reserva', percentagem: 35 },
      { categoria: 'Premium', percentagem: 20 },
    ],
    marcasEspecificas: ['V&W Douro Tinto', 'V&W Alentejo Reserva Tinto', 'V&W Heritage (Grande Reserva)'],
    canais: ['Horeca', 'Retalho', 'E-commerce'],
    volumeAnual: '2.150.000 €',
  },
  {
    mercado: 'Brasil',
    regiao: 'América',
    certificacoes: ['ANVISA', 'MAPA Import License'],
    regrasEspecificas: ['Registo ANVISA', 'Etiqueta em Português-BR', 'Teor alcoólico visível'],
    tempoTransporte: ['18-22 dias', 'Via marítima', 'Contentor 40ft'],
    tipoConsumidores: ['Importadores', 'Horeca Premium', 'Wine Clubs'],
    tipoDistribuicao: ['Importador Exclusivo', 'Agente Local'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 30 },
      { categoria: 'Reserva', percentagem: 45 },
      { categoria: 'Premium', percentagem: 25 },
    ],
    marcasEspecificas: ['V&W Douro Reserva Tinto', 'V&W Signature Edition', 'V&W Alvarinho Reserva'],
    canais: ['Importadores', 'Horeca'],
    volumeAnual: '680.000 €',
  },
  {
    mercado: 'Angola',
    regiao: 'África',
    certificacoes: ['IANORQ'],
    regrasEspecificas: ['Licença de importação', 'Rotulagem em Português'],
    tempoTransporte: ['12-15 dias', 'Via marítima'],
    tipoConsumidores: ['Distribuição', 'Horeca', 'Retalho Moderno'],
    tipoDistribuicao: ['Importador Exclusivo', 'Distribuidor Regional'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 60 },
      { categoria: 'Reserva', percentagem: 30 },
      { categoria: 'Premium', percentagem: 10 },
    ],
    marcasEspecificas: ['V&W Douro Tinto', 'V&W Alentejo Tinto', 'V&W Douro Reserva Tinto'],
    canais: ['Distribuição', 'Horeca'],
    volumeAnual: '420.000 €',
  },
  {
    mercado: 'Alemanha',
    regiao: 'Europa',
    certificacoes: ['EU Organic', 'HACCP', 'IFS Food'],
    regrasEspecificas: ['Rotulagem DE/EN', 'Pfand (depósito)', 'Alérgenos obrigatórios', 'Limite SO₂'],
    tempoTransporte: ['3-5 dias', 'Via terrestre'],
    tipoConsumidores: ['Fachhandel', 'Horeca', 'Online Retail'],
    tipoDistribuicao: ['Multi-Importador', 'Distribuidor Regional'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 25 },
      { categoria: 'Reserva', percentagem: 40 },
      { categoria: 'Premium', percentagem: 35 },
    ],
    marcasEspecificas: ['V&W Heritage (Grande Reserva)', 'V&W Douro Reserva Tinto', 'V&W Encruzado Premium'],
    canais: ['Fachhandel', 'Online', 'Horeca'],
    volumeAnual: '520.000 €',
  },
  {
    mercado: 'EUA',
    regiao: 'América',
    certificacoes: ['TTB/COLA', 'FDA', 'State Permits'],
    regrasEspecificas: ['Government Warning obrigatório', 'Sulfite Declaration', '3-Tier System', 'Label approval TTB'],
    tempoTransporte: ['20-25 dias', 'Via marítima', 'Contentor 40ft'],
    tipoConsumidores: ['Importadores', 'Wine Shops', 'Fine Dining'],
    tipoDistribuicao: ['Importador Exclusivo', 'Agente Local'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 15 },
      { categoria: 'Reserva', percentagem: 40 },
      { categoria: 'Premium', percentagem: 45 },
    ],
    marcasEspecificas: ['V&W Signature Edition', 'V&W Heritage (Grande Reserva)', 'V&W Terroir Branco Premium'],
    canais: ['Importadores', 'Wine Shops', 'Fine Dining'],
    volumeAnual: '380.000 €',
  },
  {
    mercado: 'Reino Unido',
    regiao: 'Europa',
    certificacoes: ['HMRC Approval', 'WOWGR', 'AWRS'],
    regrasEspecificas: ['Duty Stamps', 'Rotulagem EN', 'Post-Brexit customs', 'Allergen labelling'],
    tempoTransporte: ['4-6 dias', 'Via terrestre', 'Via marítima'],
    tipoConsumidores: ['Supermarkets', 'Wine Merchants', 'On-Trade'],
    tipoDistribuicao: ['Multi-Importador', 'Grossista'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 35 },
      { categoria: 'Reserva', percentagem: 40 },
      { categoria: 'Premium', percentagem: 25 },
    ],
    marcasEspecificas: ['V&W Douro Reserva Tinto', 'V&W Alentejo Reserva Tinto', 'V&W Alvarinho Reserva'],
    canais: ['Supermarkets', 'Wine Merchants', 'On-Trade'],
    volumeAnual: '450.000 €',
  },
  {
    mercado: 'Suíça',
    regiao: 'Europa',
    certificacoes: ['OFAG', 'Swiss Customs'],
    regrasEspecificas: ['Rotulagem multilíngue (DE/FR/IT)', 'Certificado de origem', 'Limites pesticidas CH'],
    tempoTransporte: ['3-4 dias', 'Via terrestre'],
    tipoConsumidores: ['Gastronomie', 'Detailhandel', 'Private Clients'],
    tipoDistribuicao: ['Importador Exclusivo', 'Distribuição Directa'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 20 },
      { categoria: 'Reserva', percentagem: 35 },
      { categoria: 'Premium', percentagem: 45 },
    ],
    marcasEspecificas: ['V&W Heritage (Grande Reserva)', 'V&W Nobre Tinto', 'V&W Encruzado Premium'],
    canais: ['Gastronomie', 'Detailhandel'],
    volumeAnual: '310.000 €',
  },
  {
    mercado: 'China',
    regiao: 'Ásia',
    certificacoes: ['CIQ', 'CFDA', 'AQSIQ'],
    regrasEspecificas: ['Etiqueta chinesa obrigatória', 'Registo sanitário', 'Back label em Mandarim', 'Anti-dumping compliance'],
    tempoTransporte: ['30-35 dias', 'Via marítima', 'Temperatura controlada'],
    tipoConsumidores: ['Importadores', 'E-commerce (Tmall/JD)', 'Banqueting'],
    tipoDistribuicao: ['Joint Venture', 'Marketplace', 'Importador Exclusivo'],
    mixMarcas: [
      { categoria: 'Regional', percentagem: 10 },
      { categoria: 'Reserva', percentagem: 35 },
      { categoria: 'Premium', percentagem: 55 },
    ],
    marcasEspecificas: ['V&W Signature Edition', 'V&W Heritage (Grande Reserva)', 'V&W Rosé Millésime'],
    canais: ['Importadores', 'E-commerce', 'Banqueting'],
    volumeAnual: '280.000 €',
  },
];
