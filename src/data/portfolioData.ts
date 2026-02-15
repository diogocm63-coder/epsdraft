import { wineProducts, wineCategorias } from './wineData';

export interface PortfolioMercado {
  mercado: string;
  regiao: string;
  certificacoes: string[];
  regrasEspecificas: string[];
  tempoTransporte: string;
  tipoConsumidores: string[];
  mixMarcas: PortfolioMarcaMix[];
  marcasEspecificas: string[];
  canais: string[];
  volumeAnual: string;
}

export interface PortfolioMarcaMix {
  categoria: string;
  percentagem: number;
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

export const portfolioMercados: PortfolioMercado[] = [
  {
    mercado: 'Portugal',
    regiao: 'Europa',
    certificacoes: ['IVV', 'HACCP'],
    regrasEspecificas: ['Rotulagem PT obrigatória', 'Selo IVV'],
    tempoTransporte: '1-3 dias',
    tipoConsumidores: ['Horeca', 'Retalho', 'Consumidor Final'],
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
    tempoTransporte: '18-22 dias',
    tipoConsumidores: ['Importadores', 'Horeca Premium', 'Wine Clubs'],
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
    tempoTransporte: '12-15 dias',
    tipoConsumidores: ['Distribuição', 'Horeca', 'Retalho Moderno'],
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
    tempoTransporte: '3-5 dias',
    tipoConsumidores: ['Fachhandel', 'Horeca', 'Online Retail'],
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
    tempoTransporte: '20-25 dias',
    tipoConsumidores: ['Importadores', 'Wine Shops', 'Fine Dining'],
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
    tempoTransporte: '4-6 dias',
    tipoConsumidores: ['Supermarkets', 'Wine Merchants', 'On-Trade'],
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
    tempoTransporte: '3-4 dias',
    tipoConsumidores: ['Gastronomie', 'Detailhandel', 'Private Clients'],
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
    tempoTransporte: '30-35 dias',
    tipoConsumidores: ['Importadores', 'E-commerce (Tmall/JD)', 'Banqueting'],
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
