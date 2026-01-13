// Mock data for Operações pages

export const organizacoes = ["Vine & Wine", "AgroCorp", "FarmTech"];
export const espacos = ["Tudo", "Espaço A", "Espaço B", "Espaço C"];
export const locais = ["Tudo", "Tejo", "Lagar", "Arripiado", "Vinha do Tejo"];
export const atividades = ["Tudo", "Poda", "Fert", "Colheita", "Rega"];
export const tiposProdutoOp = ["(Vazio)", "Fertilisers", "Fertilizers", "Fuels", "Pesticides", "Plants"];

export interface HorasTrabalhadasData {
  total: number;
  horasUteis: number;
  horasPausa: number;
  percentUteis: number;
  percentPausa: number;
}

export interface CustosData {
  total: number;
  pessoal: number;
  produtos: number;
  percentPessoal: number;
  percentProdutos: number;
}

export interface TipoAtividadeData {
  name: string;
  value: number;
  color: string;
}

export interface CustoMensalData {
  mes: string;
  valor: number;
  valorHa: number;
}

export interface CustoPorAtividadeData {
  atividade: string;
  custoTotal: number;
  orcamento: number;
}

export interface CustoPorLocalData {
  local: string;
  custoTotal: number;
  orcamento: number;
}

export interface AtividadeDetalheData {
  atividade: string;
  marco: number;
  total: number;
}

export interface HorasPorDiaData {
  dia: string;
  horas: number;
}

export interface OrcamentoRow {
  local: string;
  janeiro: number;
  fevereiro: number;
  marco: number;
  abril: number;
  maio: number;
  junho: number;
  julho: number;
  agosto: number;
  setembro: number;
  outubro: number;
  novembro: number;
  dezembro: number;
  total: number;
}

// Generate mock data
export const gerarHorasTrabalhadas = (): HorasTrabalhadasData => ({
  total: 4912,
  horasUteis: 4778,
  horasPausa: 134,
  percentUteis: 97,
  percentPausa: 3,
});

export const gerarCustos = (): CustosData => ({
  total: 3260,
  pessoal: 1380,
  produtos: 1880,
  percentPessoal: 42,
  percentProdutos: 58,
});

export const gerarTipoAtividade = (): TipoAtividadeData[] => [
  { name: "cultural operations", value: 88, color: "#8B1538" },
  { name: "fertilisation", value: 12, color: "#C4A962" },
];

export const gerarCustosMensais = (): CustoMensalData[] => [
  { mes: "Janeiro", valor: 0, valorHa: 0 },
  { mes: "Fevereiro", valor: 0, valorHa: 0 },
  { mes: "Março", valor: 3300, valorHa: 126.78 },
  { mes: "Abril", valor: 0, valorHa: 0 },
  { mes: "Maio", valor: 0, valorHa: 0 },
  { mes: "Junho", valor: 0, valorHa: 0 },
  { mes: "Julho", valor: 0, valorHa: 0 },
  { mes: "Agosto", valor: 0, valorHa: 0 },
  { mes: "Setembro", valor: 0, valorHa: 0 },
  { mes: "Outubro", valor: 0, valorHa: 0 },
  { mes: "Novembro", valor: 0, valorHa: 0 },
  { mes: "Dezembro", valor: 0, valorHa: 0 },
];

export const gerarCustosPorAtividade = (): CustoPorAtividadeData[] => [
  { atividade: "Poda", custoTotal: 2000, orcamento: 0 },
  { atividade: "Fert", custoTotal: 1300, orcamento: 900 },
];

export const gerarCustosPorLocal = (): CustoPorLocalData[] => [
  { local: "Tejo", custoTotal: 3100, orcamento: 900 },
  { local: "Arripiado", custoTotal: 100, orcamento: 0 },
  { local: "Lagar", custoTotal: 100, orcamento: 0 },
];

export const gerarTop5AtividadesCusto = (): { atividade: string; custo: number }[] => [
  { atividade: "Poda", custo: 1958 },
  { atividade: "Fert", custo: 1302 },
];

export const gerarCustoTotalPorProduto = (): { produto: string; custo: number }[] => [
  { produto: "Plants", custo: 1885 },
];

export const gerarCustoTotalPorHa = (): { local: string; custo: number }[] => [
  { local: "Tejo", custo: 4299 },
  { local: "Lagar", custo: 53 },
  { local: "Arripiado", custo: 5 },
];

export const gerarHorasPorAtividade = (): { atividade: string; horas: number }[] => [
  { atividade: "Poda", horas: 4307 },
  { atividade: "Fert", horas: 605 },
];

export const gerarHorasPorLocal = (): { local: string; horas: number }[] => [
  { local: "Vinha do Tejo", horas: 4886 },
  { local: "(Vazio)", horas: 26 },
];

export const gerarHorasPorDiaSemana = (): HorasPorDiaData[] => [
  { dia: "Dom", horas: 1 },
  { dia: "Seg", horas: 916 },
  { dia: "Ter", horas: 3692 },
  { dia: "Qua", horas: 291 },
  { dia: "Qui", horas: 12 },
  { dia: "Sex", horas: 0 },
  { dia: "Sáb", horas: 0 },
];

export const gerarHorasPorHa = (): { local: string; horas: number }[] => [
  { local: "Tejo", horas: 6810 },
  { local: "Lagar", horas: 5 },
  { local: "Arripiado", horas: 1 },
];

export const gerarAtividadesDetalhe = (): AtividadeDetalheData[] => [
  { atividade: "Task 1 - Fert #2", marco: 150, total: 150 },
  { atividade: "Task 1 - Poda #1", marco: 24, total: 24 },
  { atividade: "Task 1 - Poda #11", marco: 48, total: 48 },
  { atividade: "Task 1 - Poda #6", marco: 23, total: 23 },
  { atividade: "Task 1 - Poda #9", marco: 576, total: 576 },
  { atividade: "Task 2 - Fert #2", marco: 1152, total: 1152 },
  { atividade: "Task 2 - Poda #9", marco: 1206.75, total: 1206.75 },
  { atividade: "Task 3 - Poda #1", marco: 80, total: 80 },
];

export const gerarHorasTrabalhadasHa = (): { mes: string; valor: number }[] => [{ mes: "Março", valor: 191 }];

export const gerarHorasTrabalhadasHaPorAtividade = (): { atividade: string; horas: number }[] => [
  { atividade: "Poda", horas: 168 },
  { atividade: "Fert", horas: 24 },
];

export const gerarCustoHa = (): { mes: string; valor: number }[] => [{ mes: "Março", valor: 127 }];

export const gerarCustoHaPorAtividade = (): {
  atividade: string;
  custoProdutos: number;
  custoTrabalhadores: number;
}[] => [
  { atividade: "Poda", custoProdutos: 42, custoTrabalhadores: 34 },
  { atividade: "Fert", custoProdutos: 31, custoTrabalhadores: 20 },
];

export const gerarControloOrcamentalCustoTotal = (): {
  mes: string;
  custoTotal: number;
  custoOrcamentado: number;
}[] => [
  { mes: "Fevereiro", custoTotal: 146, custoOrcamentado: 0 },
  { mes: "Março", custoTotal: 3260, custoOrcamentado: 350 },
  { mes: "Abril", custoTotal: 0, custoOrcamentado: 362 },
];

export const gerarControloOrcamentalHoras = (): {
  atividade: string;
  totalHoras: number;
  horasOrcamentadas: number;
}[] => [
  { atividade: "Poda", totalHoras: 4307, horasOrcamentadas: 0 },
  { atividade: "Fert", totalHoras: 605, horasOrcamentadas: 34 },
];

export const gerarControloOrcamentalCustoHa = (): { mes: string; custoHa: number; orcamentoHa: number }[] => [
  { mes: "Fevereiro", custoHa: 6, orcamentoHa: 0 },
  { mes: "Março", custoHa: 127, orcamentoHa: 14 },
  { mes: "Abril", custoHa: 0, orcamentoHa: 14 },
];

export const gerarCustoPorProduto = (): { produto: string; custoProduto: number; orcamento: number }[] => [
  { produto: "Plants", custoProduto: 1885, orcamento: 0 },
  { produto: "Fertilizers", custoProduto: 0, orcamento: 450 },
];

export const gerarOrcamentoHoras = (): OrcamentoRow[] => [
  {
    local: "12",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "another test - bank",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "Local - Pedro Test",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "Local A Teste",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "Local B",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "Local B Teste",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
  {
    local: "newloc",
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  },
];

export const areaHa = 25.7;
export const percentExecucao = 2;
export const areaTotalHa = 26;
