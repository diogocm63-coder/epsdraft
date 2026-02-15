import { wineProducts } from './wineData';
import { regiaoToCastas } from './castaData';

// ============ Shared types ============

export interface SourcingCastaRacio {
  casta: string;
  percentagem: number; // % of blend
  ratioConversao: number; // Kg → L
}

// ============ DOC (Premium + Reserva) ============

export interface SourcingTalhao {
  talhao: string;
  casta: string;
  ratioConversao: number;
}

export interface SourcingParcela {
  parcela: string;
  talhoes: SourcingTalhao[];
}

export interface SourcingQuinta {
  quinta: string;
  parcelas: SourcingParcela[];
}

export interface SourcingDOCProduct {
  produto: string;
  regiao: string;
  tipo: string;
  categoria: string;
  pctUvaPropria: number;    // %
  pctUvaComprada: number;   // %
  pctVinho: number;         // %
  ratioConversao: number;   // Kg → L
  quintas: SourcingQuinta[];
}

// ============ Regional ============

export interface SourcingRegionalProduct {
  produto: string;
  regiao: string;
  tipo: string;
  pctUvaPropria: number;
  pctUvaComprada: number;
  pctVinho: number;
  ratioConversao: number;
  castas: SourcingCastaRacio[];
}

// ============ Mesa ============

export interface SourcingMesaProduct {
  produto: string;
  tipo: string;
  pctUvaPropria: number;
  pctUvaComprada: number;
  pctVinho: number;
  ratioConversao: number;
  castas: SourcingCastaRacio[];
}

// ============ Data generation ============

const quintaNames: Record<string, string[]> = {
  'Douro': ['Quinta do Vale Meão', 'Quinta da Pacheca', 'Quinta do Crasto'],
  'Alentejo': ['Herdade do Esporão', 'Herdade da Malhadinha', 'Monte da Ravasqueira'],
  'Dão': ['Quinta dos Roques', 'Quinta da Pellada', 'Quinta de Cabriz'],
  'Vinho Verde': ['Quinta de Soalheiro', 'Quinta da Aveleda', 'Paço de Teixeiró'],
  'Lisboa': ['Quinta de Chocapalha', 'Quinta do Monte d\'Oiro', 'Casal Sta. Maria'],
};

const parcelaNames = ['Parcela Norte', 'Parcela Sul', 'Parcela Encosta'];
const talhaoNames = ['Talhão A', 'Talhão B', 'Talhão C'];

const getRatio = (tipo: string) => tipo === 'Tinto' ? 0.74 : tipo === 'Rosé' ? 0.72 : 0.70;

const generateQuintas = (regiao: string, tipo: string): SourcingQuinta[] => {
  const regionQuintas = quintaNames[regiao] || ['Quinta Principal'];
  const regionCastas = regiaoToCastas[regiao as keyof typeof regiaoToCastas];
  if (!regionCastas) return [];
  const castas = tipo === 'Tinto' || tipo === 'Rosé' ? regionCastas.tintas : regionCastas.brancas;
  const ratio = getRatio(tipo);

  return regionQuintas.slice(0, 2).map((quintaName, qi) => ({
    quinta: quintaName,
    parcelas: parcelaNames.slice(0, qi === 0 ? 2 : 1).map(parcelaName => ({
      parcela: parcelaName,
      talhoes: talhaoNames.slice(0, Math.min(castas.length, 3)).map((talhaoName, ti) => ({
        talhao: talhaoName,
        casta: castas[ti % castas.length],
        ratioConversao: ratio,
      })),
    })),
  }));
};

const generateCastas = (regiao: string, tipo: string): SourcingCastaRacio[] => {
  const regionCastas = regiaoToCastas[regiao as keyof typeof regiaoToCastas];
  if (!regionCastas) return [];
  const castas = tipo === 'Tinto' || tipo === 'Rosé' ? regionCastas.tintas : regionCastas.brancas;
  const ratio = getRatio(tipo);
  const weights = castas.map((_, i) => Math.max(40 - i * 12, 5) + Math.random() * 8);
  const totalW = weights.reduce((a, b) => a + b, 0);

  return castas.map((casta, i) => ({
    casta,
    percentagem: Math.round((weights[i] / totalW) * 100),
    ratioConversao: ratio,
  }));
};

const genRacios = (categoria: string) => {
  let uvaPropria: number, uvaComprada: number, vinho: number;
  if (categoria === 'Premium') {
    uvaPropria = 70 + Math.round(Math.random() * 15);
    uvaComprada = Math.round(Math.random() * 10);
    vinho = 100 - uvaPropria - uvaComprada;
  } else if (categoria === 'Reserva') {
    uvaPropria = 50 + Math.round(Math.random() * 15);
    uvaComprada = 10 + Math.round(Math.random() * 10);
    vinho = 100 - uvaPropria - uvaComprada;
  } else if (categoria === 'Regional') {
    uvaPropria = 30 + Math.round(Math.random() * 15);
    uvaComprada = 15 + Math.round(Math.random() * 15);
    vinho = 100 - uvaPropria - uvaComprada;
  } else {
    // Mesa
    uvaPropria = 10 + Math.round(Math.random() * 10);
    uvaComprada = 20 + Math.round(Math.random() * 15);
    vinho = 100 - uvaPropria - uvaComprada;
  }
  return { uvaPropria, uvaComprada, vinho };
};

// DOC = Premium + Reserva
export const sourcingDOCProducts: SourcingDOCProduct[] = wineProducts
  .filter(p => p.categoria === 'Premium' || p.categoria === 'Reserva')
  .map(p => {
    const r = genRacios(p.categoria);
    return {
      produto: p.produto,
      regiao: p.regiao,
      tipo: p.tipo,
      categoria: p.categoria,
      pctUvaPropria: r.uvaPropria,
      pctUvaComprada: r.uvaComprada,
      pctVinho: r.vinho,
      ratioConversao: getRatio(p.tipo),
      quintas: generateQuintas(p.regiao, p.tipo),
    };
  });

// Regional
export const sourcingRegionalProducts: SourcingRegionalProduct[] = wineProducts
  .filter(p => p.categoria === 'Regional')
  .map(p => {
    const r = genRacios('Regional');
    return {
      produto: p.produto,
      regiao: p.regiao,
      tipo: p.tipo,
      pctUvaPropria: r.uvaPropria,
      pctUvaComprada: r.uvaComprada,
      pctVinho: r.vinho,
      ratioConversao: getRatio(p.tipo),
      castas: generateCastas(p.regiao, p.tipo),
    };
  });

// Mesa
const mesaProducts = [
  { produto: 'V&W Mesa Tinto', tipo: 'Tinto' },
  { produto: 'V&W Mesa Branco', tipo: 'Branco' },
  { produto: 'V&W Mesa Rosé', tipo: 'Rosé' },
];

export const sourcingMesaProducts: SourcingMesaProduct[] = mesaProducts.map(p => {
  const r = genRacios('Mesa');
  const allCastas = p.tipo === 'Tinto' || p.tipo === 'Rosé'
    ? ['Touriga Nacional', 'Castelão', 'Trincadeira', 'Tinta Roriz', 'Baga']
    : ['Fernão Pires', 'Arinto', 'Antão Vaz', 'Loureiro', 'Síria'];
  const ratio = getRatio(p.tipo);
  const weights = allCastas.map((_, i) => Math.max(35 - i * 8, 5) + Math.random() * 6);
  const totalW = weights.reduce((a, b) => a + b, 0);

  return {
    produto: p.produto,
    tipo: p.tipo,
    pctUvaPropria: r.uvaPropria,
    pctUvaComprada: r.uvaComprada,
    pctVinho: r.vinho,
    ratioConversao: ratio,
    castas: allCastas.map((casta, i) => ({
      casta,
      percentagem: Math.round((weights[i] / totalW) * 100),
      ratioConversao: ratio,
    })),
  };
});
