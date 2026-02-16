import { wineProducts } from './wineData';
import { regiaoToCastas, type CastaTinta, type CastaBranca } from './castaData';

export interface EnologicoProduct {
  produto: string;
  regiao: string;
  tipo: string;
  categoria: string;
  // Aging in months
  estagioBarrica: number;
  estagioCuba: number;
  estagioGarrafa: number;
  // Castas (grape varieties used)
  castas: string[];
  // Percentages per casta
  castasPercentagem: number[];
}

// Generate realistic aging and casta data per product
const getAgingProfile = (categoria: string, tipo: string): { barrica: number; cuba: number; garrafa: number } => {
  if (categoria === 'Premium') {
    return tipo === 'Tinto'
      ? { barrica: 18, cuba: 6, garrafa: 12 }
      : tipo === 'Rosé'
        ? { barrica: 0, cuba: 4, garrafa: 6 }
        : { barrica: 8, cuba: 4, garrafa: 6 };
  }
  if (categoria === 'Reserva') {
    return tipo === 'Tinto'
      ? { barrica: 12, cuba: 4, garrafa: 6 }
      : tipo === 'Rosé'
        ? { barrica: 0, cuba: 3, garrafa: 3 }
        : { barrica: 6, cuba: 3, garrafa: 4 };
  }
  if (categoria === 'Mesa') {
    // Mesa: no barrica, short cuba only, minimal garrafa
    return tipo === 'Tinto'
      ? { barrica: 0, cuba: 3, garrafa: 1 }
      : tipo === 'Rosé'
        ? { barrica: 0, cuba: 1, garrafa: 1 }
        : { barrica: 0, cuba: 2, garrafa: 1 };
  }
  // Regional: no barrica
  return tipo === 'Tinto'
    ? { barrica: 0, cuba: 6, garrafa: 3 }
    : tipo === 'Rosé'
      ? { barrica: 0, cuba: 2, garrafa: 2 }
      : { barrica: 0, cuba: 4, garrafa: 2 };
};

const getCastasForProduct = (regiao: string, tipo: string, categoria: string): { castas: string[]; percentagens: number[] } => {
  const regionKey = regiao as keyof typeof regiaoToCastas;
  const regionCastas = regiaoToCastas[regionKey];
  if (!regionCastas) return { castas: ['Blend Regional'], percentagens: [100] };

  const pool: string[] = tipo === 'Tinto' || tipo === 'Rosé'
    ? [...regionCastas.tintas]
    : [...regionCastas.brancas];

  // Premium = fewer, more focused castas; Regional = broader blends
  const count = categoria === 'Premium' ? Math.min(2, pool.length) : categoria === 'Reserva' ? Math.min(3, pool.length) : Math.min(pool.length, 4);
  const selected = pool.slice(0, count);

  // Distribute percentages
  if (selected.length === 1) return { castas: selected, percentagens: [100] };
  if (selected.length === 2) return { castas: selected, percentagens: [60, 40] };
  if (selected.length === 3) return { castas: selected, percentagens: [50, 30, 20] };
  return { castas: selected, percentagens: [40, 25, 20, 15] };
};

export const enologicoProducts: EnologicoProduct[] = wineProducts.map(p => {
  const aging = getAgingProfile(p.categoria, p.tipo);
  const { castas, percentagens } = getCastasForProduct(p.regiao, p.tipo, p.categoria);
  return {
    produto: p.produto,
    regiao: p.regiao,
    tipo: p.tipo,
    categoria: p.categoria,
    estagioBarrica: aging.barrica,
    estagioCuba: aging.cuba,
    estagioGarrafa: aging.garrafa,
    castas,
    castasPercentagem: percentagens,
  };
});
