import { wineProducts, wineRegioes } from './wineData';
import { regiaoToCastas } from './castaData';

export interface SourcingQuinta {
  quinta: string;
  parcelas: SourcingParcela[];
}

export interface SourcingParcela {
  parcela: string;
  talhoes: SourcingTalhao[];
}

export interface SourcingTalhao {
  talhao: string;
  casta: string;
  area: number; // hectares
  rendimento: number; // kg/ha
  producaoEstimada: number; // kg
  ratioConversao: number; // L/kg
  litrosEstimados: number;
}

export interface SourcingProduct {
  produto: string;
  regiao: string;
  tipo: string;
  categoria: string;
  necessidadeLitros: number;
  producaoPropria: number; // litros
  compraVinho: number; // litros
  ratioProducaoPropria: number; // %
  ratioCompraVinho: number; // %
  quintas: SourcingQuinta[];
}

const quintaNames: Record<string, string[]> = {
  'Douro': ['Quinta do Vale Meão', 'Quinta da Pacheca', 'Quinta do Crasto'],
  'Alentejo': ['Herdade do Esporão', 'Herdade da Malhadinha', 'Monte da Ravasqueira'],
  'Dão': ['Quinta dos Roques', 'Quinta da Pellada', 'Quinta de Cabriz'],
  'Vinho Verde': ['Quinta de Soalheiro', 'Quinta da Aveleda', 'Paço de Teixeiró'],
  'Lisboa': ['Quinta de Chocapalha', 'Quinta do Monte d\'Oiro', 'Casal Sta. Maria'],
};

const parcelaNames = ['Parcela Norte', 'Parcela Sul', 'Parcela Encosta', 'Parcela Ribeira', 'Parcela Topo'];
const talhaoNames = ['Talhão A', 'Talhão B', 'Talhão C', 'Talhão D'];

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
            const ratioConversao = tipo === 'Tinto' ? 0.74 : tipo === 'Rosé' ? 0.72 : 0.70;
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

export const sourcingProducts: SourcingProduct[] = wineProducts.map(p => {
  const baseNecessidade = p.categoria === 'Premium' ? 8000 + Math.random() * 4000
    : p.categoria === 'Reserva' ? 15000 + Math.random() * 10000
    : 25000 + Math.random() * 20000;

  const necessidade = Math.round(baseNecessidade);
  const ratioPropria = p.categoria === 'Premium' ? 0.85 + Math.random() * 0.1
    : p.categoria === 'Reserva' ? 0.65 + Math.random() * 0.15
    : 0.45 + Math.random() * 0.2;

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
