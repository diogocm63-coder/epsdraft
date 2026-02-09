// Castas (grape varieties) data for wine production

export const castasRegioes = [
  'Douro',
  'Alentejo', 
  'Dão',
  'Bairrada',
  'Vinho Verde',
  'Lisboa',
  'Tejo',
  'Setúbal'
] as const;

export type CastaRegiao = typeof castasRegioes[number];

export const castasTintas = [
  'Touriga Nacional',
  'Touriga Franca',
  'Tinta Roriz',
  'Tinta Barroca',
  'Castelão',
  'Trincadeira',
  'Alicante Bouschet',
  'Baga',
  'Jaen'
] as const;

export const castasBrancas = [
  'Arinto',
  'Encruzado',
  'Fernão Pires',
  'Loureiro',
  'Alvarinho',
  'Antão Vaz',
  'Roupeiro',
  'Síria',
  'Verdelho'
] as const;

export type CastaTinta = typeof castasTintas[number];
export type CastaBranca = typeof castasBrancas[number];

// Mapping of regions to their typical grape varieties
export const regiaoToCastas: Record<CastaRegiao, { tintas: CastaTinta[]; brancas: CastaBranca[] }> = {
  'Douro': {
    tintas: ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz', 'Tinta Barroca'],
    brancas: ['Arinto', 'Verdelho', 'Fernão Pires']
  },
  'Alentejo': {
    tintas: ['Trincadeira', 'Castelão', 'Alicante Bouschet', 'Touriga Nacional'],
    brancas: ['Antão Vaz', 'Roupeiro', 'Arinto']
  },
  'Dão': {
    tintas: ['Touriga Nacional', 'Jaen', 'Tinta Roriz'],
    brancas: ['Encruzado', 'Arinto', 'Síria']
  },
  'Bairrada': {
    tintas: ['Baga', 'Touriga Nacional', 'Castelão'],
    brancas: ['Arinto', 'Fernão Pires', 'Síria']
  },
  'Vinho Verde': {
    tintas: ['Touriga Nacional', 'Castelão'],
    brancas: ['Alvarinho', 'Loureiro', 'Arinto', 'Fernão Pires']
  },
  'Lisboa': {
    tintas: ['Castelão', 'Touriga Nacional', 'Trincadeira'],
    brancas: ['Arinto', 'Fernão Pires', 'Síria']
  },
  'Tejo': {
    tintas: ['Castelão', 'Trincadeira', 'Touriga Nacional'],
    brancas: ['Fernão Pires', 'Arinto', 'Verdelho']
  },
  'Setúbal': {
    tintas: ['Castelão', 'Trincadeira', 'Touriga Nacional'],
    brancas: ['Fernão Pires', 'Arinto', 'Síria']
  }
};

// Generate harvest forecast data
export const generateHarvestData = () => {
  const data: Record<CastaRegiao, { tintas: Record<CastaTinta, number>; brancas: Record<CastaBranca, number> }> = {} as any;
  
  castasRegioes.forEach(regiao => {
    const regionCastas = regiaoToCastas[regiao];
    
    data[regiao] = {
      tintas: {} as Record<CastaTinta, number>,
      brancas: {} as Record<CastaBranca, number>
    };
    
    // Generate random kg values for tintas
    regionCastas.tintas.forEach(casta => {
      data[regiao].tintas[casta] = Math.floor(Math.random() * 25000) + 5000;
    });
    
    // Generate random kg values for brancas
    regionCastas.brancas.forEach(casta => {
      data[regiao].brancas[casta] = Math.floor(Math.random() * 20000) + 3000;
    });
  });
  
  return data;
};
