import { wineProducts } from './wineData';
import { regiaoToCastas } from './castaData';

// === DOC Products (Premium + Reserva): Full detail Quinta → Parcela → Talhão → Casta ===

export interface SourcingTalhao {
  talhao: string;
  casta: string;
  area: number;
  rendimento: number;
  producaoEstimada: number;
  ratioConversao: number;
  litrosEstimados: number;
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
  necessidadeLitros: number;
  producaoPropria: number;
  compraVinho: number;
  ratioProducaoPropria: number;
  ratioCompraVinho: number;
  quintas: SourcingQuinta[];
}

// === Regional Products: Região + Castas ===

export interface SourcingCastaDetalhe {
  casta: string;
  percentagem: number;
  litros: number;
  kg: number;
  ratioConversao: number;
}

export interface SourcingRegionalProduct {
  produto: string;
  regiao: string;
  tipo: string;
  necessidadeLitros: number;
  producaoPropria: number;
  compraVinho: number;
  ratioProducaoPropria: number;
  ratioCompraVinho: number;
  castas: SourcingCastaDetalhe[];
}

// === Mesa Products: Only Castas ===

export interface SourcingMesaProduct {
  produto: string;
  tipo: string;
  necessidadeLitros: number;
  castas: SourcingCastaDetalhe[];
}

// ============ Data generation ============

const quintaNames: Record<string, string[]> = {
  'Douro': ['Quinta do Vale Meão', 'Quinta da Pacheca', 'Quinta do Crasto'],
  'Alentejo': ['Herdade do Esporão', 'Herdade da Malhadinha', 'Monte da Ravasqueira'],
  'Dão': ['Quinta dos Roques', 'Quinta da Pellada', 'Quinta de Cabriz'],
  'Vinho Verde': ['Quinta de Soalheiro', 'Quinta da Aveleda', 'Paço de Teixeiró'],
  'Lisboa': ['Quinta de Chocapalha', 'Quinta do Monte d\'Oiro', 'Casal Sta. Maria'],
};

const parcelaNames = ['Parcela Norte', 'Parcela Sul', 'Parcela Encosta', 'Parcela Ribeira'];
const talhaoNames = ['Talhão A', 'Talhão B', 'Talhão C', 'Talhão D'];

const getRatio = (tipo: string) => tipo === 'Tinto' ? 0.74 : tipo === 'Rosé' ? 0.72 : 0.70;

const generateQuintas = (regiao: string, tipo: string, totalLitros: number): SourcingQuinta[] => {
  const regionQuintas = quintaNames[regiao] || ['Quinta Principal'];
  const regionCastas = regiaoToCastas[regiao as keyof typeof regiaoToCastas];
  if (!regionCastas) return [];

  const castas = tipo === 'Tinto' || tipo === 'Rosé' ? regionCastas.tintas : regionCastas.brancas;
  const numQuintas = Math.min(regionQuintas.length, 2);
  const litrosPerQuinta = totalLitros / numQuintas;

  return regionQuintas.slice(0, numQuintas).map((quintaName, qi) => {
    const numParcelas = qi === 0 ? 2 : 1;
    return {
      quinta: quintaName,
      parcelas: parcelaNames.slice(0, numParcelas).map((parcelaName, pi) => {
        const numTalhoes = pi === 0 ? Math.min(castas.length, 3) : Math.min(castas.length, 2);
        const litrosPerTalhao = litrosPerQuinta / numParcelas / numTalhoes;
        return {
          parcela: parcelaName,
          talhoes: talhaoNames.slice(0, numTalhoes).map((talhaoName, ti) => {
            const casta = castas[ti % castas.length];
            const ratioConversao = getRatio(tipo);
            const producaoKg = Math.round(litrosPerTalhao / ratioConversao);
            const area = +(producaoKg / (6000 + Math.random() * 4000)).toFixed(1);
            const rendimento = Math.round(producaoKg / area);
            return {
              talhao: talhaoName,
              casta,
              area,
              rendimento,
              producaoEstimada: producaoKg,
              ratioConversao,
              litrosEstimados: Math.round(producaoKg * ratioConversao),
            };
          }),
        };
      }),
    };
  });
};

const generateCastas = (regiao: string, tipo: string, litros: number): SourcingCastaDetalhe[] => {
  const regionCastas = regiaoToCastas[regiao as keyof typeof regiaoToCastas];
  if (!regionCastas) return [];
  const castas = tipo === 'Tinto' || tipo === 'Rosé' ? regionCastas.tintas : regionCastas.brancas;
  const ratio = getRatio(tipo);

  // distribute percentages
  const weights = castas.map((_, i) => Math.max(40 - i * 12, 5) + Math.random() * 8);
  const totalW = weights.reduce((a, b) => a + b, 0);

  return castas.map((casta, i) => {
    const pct = Math.round((weights[i] / totalW) * 100);
    const l = Math.round(litros * pct / 100);
    return {
      casta,
      percentagem: pct,
      litros: l,
      kg: Math.round(l / ratio),
      ratioConversao: ratio,
    };
  });
};

// DOC = Premium + Reserva
export const sourcingDOCProducts: SourcingDOCProduct[] = wineProducts
  .filter(p => p.categoria === 'Premium' || p.categoria === 'Reserva')
  .map(p => {
    const baseNecessidade = p.categoria === 'Premium' ? 8000 + Math.random() * 4000 : 15000 + Math.random() * 10000;
    const necessidade = Math.round(baseNecessidade);
    const ratioPropria = p.categoria === 'Premium' ? 0.85 + Math.random() * 0.1 : 0.65 + Math.random() * 0.15;
    const producaoPropria = Math.round(necessidade * ratioPropria);
    const compraVinho = necessidade - producaoPropria;

    return {
      produto: p.produto,
      regiao: p.regiao,
      tipo: p.tipo,
      categoria: p.categoria,
      necessidadeLitros: necessidade,
      producaoPropria,
      compraVinho,
      ratioProducaoPropria: Math.round(ratioPropria * 100),
      ratioCompraVinho: Math.round((1 - ratioPropria) * 100),
      quintas: generateQuintas(p.regiao, p.tipo, producaoPropria),
    };
  });

// Regional
export const sourcingRegionalProducts: SourcingRegionalProduct[] = wineProducts
  .filter(p => p.categoria === 'Regional')
  .map(p => {
    const necessidade = Math.round(25000 + Math.random() * 20000);
    const ratioPropria = 0.45 + Math.random() * 0.2;
    const producaoPropria = Math.round(necessidade * ratioPropria);
    const compraVinho = necessidade - producaoPropria;

    return {
      produto: p.produto,
      regiao: p.regiao,
      tipo: p.tipo,
      necessidadeLitros: necessidade,
      producaoPropria,
      compraVinho,
      ratioProducaoPropria: Math.round(ratioPropria * 100),
      ratioCompraVinho: Math.round((1 - ratioPropria) * 100),
      castas: generateCastas(p.regiao, p.tipo, producaoPropria),
    };
  });

// Mesa - generic blends, no region, just castas
const mesaProducts = [
  { produto: 'V&W Mesa Tinto', tipo: 'Tinto' },
  { produto: 'V&W Mesa Branco', tipo: 'Branco' },
  { produto: 'V&W Mesa Rosé', tipo: 'Rosé' },
];

export const sourcingMesaProducts: SourcingMesaProduct[] = mesaProducts.map(p => {
  const necessidade = Math.round(40000 + Math.random() * 30000);
  const ratio = getRatio(p.tipo);
  // Mesa uses a mix of castas from multiple regions
  const allCastas = p.tipo === 'Tinto' || p.tipo === 'Rosé'
    ? ['Touriga Nacional', 'Castelão', 'Trincadeira', 'Tinta Roriz', 'Baga']
    : ['Fernão Pires', 'Arinto', 'Antão Vaz', 'Loureiro', 'Síria'];

  const weights = allCastas.map((_, i) => Math.max(35 - i * 8, 5) + Math.random() * 6);
  const totalW = weights.reduce((a, b) => a + b, 0);

  return {
    produto: p.produto,
    tipo: p.tipo,
    necessidadeLitros: necessidade,
    castas: allCastas.map((casta, i) => {
      const pct = Math.round((weights[i] / totalW) * 100);
      const l = Math.round(necessidade * pct / 100);
      return {
        casta,
        percentagem: pct,
        litros: l,
        kg: Math.round(l / ratio),
        ratioConversao: ratio,
      };
    }),
  };
});
