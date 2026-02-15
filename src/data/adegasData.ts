export interface QuintaAssociada {
  nome: string;
  tipo: 'Própria' | 'Fornecedor';
  regiao: string;
}

export interface CapacidadeAdega {
  tinto: number;   // L
  branco: number;  // L
  rose: number;    // L
  total: number;   // L
}

export interface Adega {
  id: string;
  nome: string;
  regiao: string;
  capacidadeTotal: number;        // L
  armazenagem: CapacidadeAdega;
  transformacao: CapacidadeAdega;
  quintas: QuintaAssociada[];
}

export const adegasData: Adega[] = [
  {
    id: 'adg-1',
    nome: 'Adega do Vale Meão',
    regiao: 'Douro',
    capacidadeTotal: 2500000,
    armazenagem: { tinto: 1200000, branco: 400000, rose: 150000, total: 1750000 },
    transformacao: { tinto: 800000, branco: 300000, rose: 100000, total: 1200000 },
    quintas: [
      { nome: 'Quinta do Vale Meão', tipo: 'Própria', regiao: 'Douro' },
      { nome: 'Quinta da Pacheca', tipo: 'Própria', regiao: 'Douro' },
      { nome: 'Quinta do Crasto', tipo: 'Fornecedor', regiao: 'Douro' },
    ],
  },
  {
    id: 'adg-2',
    nome: 'Adega da Pacheca',
    regiao: 'Douro',
    capacidadeTotal: 1800000,
    armazenagem: { tinto: 900000, branco: 350000, rose: 100000, total: 1350000 },
    transformacao: { tinto: 600000, branco: 200000, rose: 80000, total: 880000 },
    quintas: [
      { nome: 'Quinta da Pacheca', tipo: 'Própria', regiao: 'Douro' },
      { nome: 'Quinta de S. Luiz', tipo: 'Fornecedor', regiao: 'Douro' },
    ],
  },
  {
    id: 'adg-3',
    nome: 'Herdade do Esporão',
    regiao: 'Alentejo',
    capacidadeTotal: 3200000,
    armazenagem: { tinto: 1500000, branco: 600000, rose: 200000, total: 2300000 },
    transformacao: { tinto: 1000000, branco: 400000, rose: 150000, total: 1550000 },
    quintas: [
      { nome: 'Herdade do Esporão', tipo: 'Própria', regiao: 'Alentejo' },
      { nome: 'Herdade da Malhadinha', tipo: 'Fornecedor', regiao: 'Alentejo' },
      { nome: 'Monte da Ravasqueira', tipo: 'Fornecedor', regiao: 'Alentejo' },
    ],
  },
  {
    id: 'adg-4',
    nome: 'Adega de Borba',
    regiao: 'Alentejo',
    capacidadeTotal: 2000000,
    armazenagem: { tinto: 1000000, branco: 400000, rose: 100000, total: 1500000 },
    transformacao: { tinto: 700000, branco: 250000, rose: 80000, total: 1030000 },
    quintas: [
      { nome: 'Quinta da Terrugem', tipo: 'Própria', regiao: 'Alentejo' },
      { nome: 'Herdade do Rocim', tipo: 'Fornecedor', regiao: 'Alentejo' },
    ],
  },
  {
    id: 'adg-5',
    nome: 'Quinta dos Roques',
    regiao: 'Dão',
    capacidadeTotal: 1200000,
    armazenagem: { tinto: 500000, branco: 300000, rose: 80000, total: 880000 },
    transformacao: { tinto: 400000, branco: 200000, rose: 60000, total: 660000 },
    quintas: [
      { nome: 'Quinta dos Roques', tipo: 'Própria', regiao: 'Dão' },
      { nome: 'Quinta da Pellada', tipo: 'Própria', regiao: 'Dão' },
    ],
  },
  {
    id: 'adg-6',
    nome: 'Adega de Cabriz',
    regiao: 'Dão',
    capacidadeTotal: 1500000,
    armazenagem: { tinto: 600000, branco: 350000, rose: 100000, total: 1050000 },
    transformacao: { tinto: 500000, branco: 250000, rose: 80000, total: 830000 },
    quintas: [
      { nome: 'Quinta de Cabriz', tipo: 'Própria', regiao: 'Dão' },
      { nome: 'Quinta do Encontro', tipo: 'Fornecedor', regiao: 'Dão' },
    ],
  },
  {
    id: 'adg-7',
    nome: 'Quinta de Soalheiro',
    regiao: 'Vinho Verde',
    capacidadeTotal: 900000,
    armazenagem: { tinto: 100000, branco: 500000, rose: 80000, total: 680000 },
    transformacao: { tinto: 80000, branco: 400000, rose: 60000, total: 540000 },
    quintas: [
      { nome: 'Quinta de Soalheiro', tipo: 'Própria', regiao: 'Vinho Verde' },
      { nome: 'Quinta da Aveleda', tipo: 'Fornecedor', regiao: 'Vinho Verde' },
    ],
  },
  {
    id: 'adg-8',
    nome: 'Quinta de Chocapalha',
    regiao: 'Lisboa',
    capacidadeTotal: 1100000,
    armazenagem: { tinto: 450000, branco: 300000, rose: 100000, total: 850000 },
    transformacao: { tinto: 350000, branco: 250000, rose: 80000, total: 680000 },
    quintas: [
      { nome: 'Quinta de Chocapalha', tipo: 'Própria', regiao: 'Lisboa' },
      { nome: "Quinta do Monte d'Oiro", tipo: 'Fornecedor', regiao: 'Lisboa' },
      { nome: 'Casal Sta. Maria', tipo: 'Fornecedor', regiao: 'Lisboa' },
    ],
  },
];
