// Mock data for Operações pages
export const consultoresOp = [
  "Tudo",
  "António Silva",
  "Maria Santos",
  "João Ferreira",
  "Ana Costa",
  "Pedro Rodrigues",
  "Carla Martins",
];
export const organizacoes = [
  "Quinta do Vale Meão",
  "Quinta da Leda",
  "Quinta do Crasto",
  "Quinta dos Murças",
  "Quinta da Romaneira",
  "Casa Ferreirinha",
  "Quinta do Noval",
  "Quinta da Roêda",
  "Pomares do Oeste",
  "Frutas do Cadaval",
  "Quinta das Pêras",
  "Herdade do Alentejo",
  "Monte da Raposinha",
  "Quinta da Bacalhôa",
  "Pomares do Sul",
  "Quinta dos Açores",
  "Pomares da Ilha",
  "Quinta de Aveiro",
  "Frutas de Aveiro",
  "Herdade de Beja",
  "Pomares do Alentejo Sul",
  "Quinta de Guimarães",
  "Pomares de Braga",
  "Quinta do Fundão",
  "Pêras do Centro",
  "Quinta de Coimbra",
  "Frutas de Montemor",
  "Quinta da Madeira",
  "Pomares do Funchal",
  "Herdade de Portalegre",
  "Pomares de Portalegre",
  "Quinta de Ponte de Lima",
  "Frutas do Norte",
];
export const espacos = ["Tudo", "Norte", "Centro", "Lisboa", "Sul", "Ilhas"];
export const locais = [
  "Tudo",
  "Talhão 1",
  "Talhão 2",
  "Talhão 3",
  "Talhão 4",
  "Talhão 5",
  "Talhão 6",
  "Talhão 7",
  "Talhão 8",
];
export const atividades = [
  "Tudo",
  "Plantação",
  "Sementeira",
  "Adubação",
  "Fertilização",
  "Poda",
  "Rega",
  "Irrigação",
  "Controlo de Pragas",
  "Tratamento Fitossanitário",
  "Colheita",
  "Aragem",
  "Gradagem",
  "Aplicação de Herbicidas",
  "Poda em Verde",
  "Desfolha",
  "Vindima",
  "Poda Seca",
  "Enxertia",
  "Mondagem",
  "Escavação",
];
export const tiposProdutoOp = ["(Vazio)", "Fertilizantes", "Combustíveis", "Pesticidas", "Plantas"];
export const produtos = ["Tudo", "Uva Tinta", "Uva Branca", "Azeite", "Oliva"];
export const variedades = ["Tudo", "Touriga Nacional", "Aragonez", "Syrah", "Alvarinho", "Arinto"];
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
  { name: "operações culturais", value: 88, color: "#8B1538" },
  { name: "fertilização", value: 12, color: "#C4A962" },
];
export const gerarCustosMensais = (): CustoMensalData[] => [
  { mes: "Janeiro", valor: 1200, valorHa: 46.69 },
  { mes: "Fevereiro", valor: 1500, valorHa: 58.37 },
  { mes: "Março", valor: 3300, valorHa: 126.78 },
  { mes: "Abril", valor: 2800, valorHa: 108.95 },
  { mes: "Maio", valor: 2500, valorHa: 97.28 },
  { mes: "Junho", valor: 2200, valorHa: 85.6 },
  { mes: "Julho", valor: 3000, valorHa: 116.73 },
  { mes: "Agosto", valor: 2700, valorHa: 105.06 },
  { mes: "Setembro", valor: 3200, valorHa: 124.51 },
  { mes: "Outubro", valor: 2900, valorHa: 112.84 },
  { mes: "Novembro", valor: 1800, valorHa: 70.04 },
  { mes: "Dezembro", valor: 1400, valorHa: 54.47 },
];
export const gerarCustosPorAtividade = (): CustoPorAtividadeData[] => [
  { atividade: "Plantação", custoTotal: 1500, orcamento: 1200 },
  { atividade: "Sementeira", custoTotal: 800, orcamento: 700 },
  { atividade: "Adubação", custoTotal: 1200, orcamento: 1000 },
  { atividade: "Fertilização", custoTotal: 1300, orcamento: 900 },
  { atividade: "Poda", custoTotal: 2000, orcamento: 0 },
  { atividade: "Rega", custoTotal: 900, orcamento: 800 },
  { atividade: "Irrigação", custoTotal: 1100, orcamento: 950 },
  { atividade: "Controlo de Pragas", custoTotal: 1400, orcamento: 1300 },
  { atividade: "Tratamento Fitossanitário", custoTotal: 1600, orcamento: 1500 },
  { atividade: "Colheita", custoTotal: 2500, orcamento: 2200 },
];
export const gerarCustosPorLocal = (): CustoPorLocalData[] => [
  { local: "Talhão 1", custoTotal: 3100, orcamento: 900 },
  { local: "Talhão 2", custoTotal: 2800, orcamento: 800 },
  { local: "Talhão 3", custoTotal: 2500, orcamento: 700 },
  { local: "Talhão 4", custoTotal: 2200, orcamento: 600 },
  { local: "Talhão 5", custoTotal: 1900, orcamento: 500 },
  { local: "Talhão 6", custoTotal: 1600, orcamento: 400 },
  { local: "Talhão 7", custoTotal: 1300, orcamento: 300 },
  { local: "Talhão 8", custoTotal: 1000, orcamento: 200 },
];
export const gerarTop5AtividadesCusto = (): { atividade: string; custo: number }[] => [
  { atividade: "Colheita", custo: 2500 },
  { atividade: "Poda", custo: 1958 },
  { atividade: "Tratamento Fitossanitário", custo: 1600 },
  { atividade: "Plantação", custo: 1500 },
  { atividade: "Fert", custo: 1302 },
];
export const gerarCustoTotalPorProduto = (): { produto: string; custo: number }[] => [
  { produto: "Plantas", custo: 1885 },
  { produto: "Fertilizantes", custo: 1200 },
  { produto: "Pesticidas", custo: 1400 },
];
export const gerarCustoTotalPorHa = (): { local: string; custo: number }[] => [
  { local: "Talhão 1", custo: 4299 },
  { local: "Talhão 2", custo: 3899 },
  { local: "Talhão 3", custo: 3499 },
  { local: "Talhão 4", custo: 3099 },
  { local: "Talhão 5", custo: 2699 },
  { local: "Talhão 6", custo: 2299 },
  { local: "Talhão 7", custo: 1899 },
  { local: "Talhão 8", custo: 1499 },
];
export const gerarHorasPorAtividade = (): { atividade: string; horas: number }[] => [
  { atividade: "Plantação", horas: 800 },
  { atividade: "Sementeira", horas: 500 },
  { atividade: "Adubação", horas: 600 },
  { atividade: "Fertilização", horas: 605 },
  { atividade: "Poda", horas: 4307 },
  { atividade: "Rega", horas: 700 },
  { atividade: "Irrigação", horas: 650 },
  { atividade: "Controlo de Pragas", horas: 900 },
  { atividade: "Tratamento Fitossanitário", horas: 850 },
  { atividade: "Colheita", horas: 1200 },
];
export const gerarHorasPorLocal = (): { local: string; horas: number }[] => [
  { local: "Talhão 1", horas: 4886 },
  { local: "Talhão 2", horas: 4500 },
  { local: "Talhão 3", horas: 4200 },
  { local: "Talhão 4", horas: 3900 },
  { local: "Talhão 5", horas: 3600 },
  { local: "Talhão 6", horas: 3300 },
  { local: "Talhão 7", horas: 3000 },
  { local: "Talhão 8", horas: 2700 },
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
  { local: "Talhão 1", horas: 6810 },
  { local: "Talhão 2", horas: 6410 },
  { local: "Talhão 3", horas: 6010 },
  { local: "Talhão 4", horas: 5610 },
  { local: "Talhão 5", horas: 5210 },
  { local: "Talhão 6", horas: 4810 },
  { local: "Talhão 7", horas: 4410 },
  { local: "Talhão 8", horas: 4010 },
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
  { atividade: "Task 1 - Plantação #1", marco: 200, total: 200 },
  { atividade: "Task 2 - Colheita #3", marco: 300, total: 300 },
];
export const gerarHorasTrabalhadasHa = (): { mes: string; valor: number }[] => [
  { mes: "Janeiro", valor: 50 },
  { mes: "Fevereiro", valor: 60 },
  { mes: "Março", valor: 191 },
  { mes: "Abril", valor: 80 },
  { mes: "Maio", valor: 70 },
  { mes: "Junho", valor: 90 },
  { mes: "Julho", valor: 100 },
  { mes: "Agosto", valor: 85 },
  { mes: "Setembro", valor: 110 },
  { mes: "Outubro", valor: 95 },
  { mes: "Novembro", valor: 65 },
  { mes: "Dezembro", valor: 55 },
];
export const gerarHorasTrabalhadasHaPorAtividade = (): { atividade: string; horas: number }[] => [
  { atividade: "Plantação", horas: 100 },
  { atividade: "Sementeira", horas: 80 },
  { atividade: "Adubação", horas: 90 },
  { atividade: "Poda", horas: 168 },
  { atividade: "Fert", horas: 24 },
  { atividade: "Colheita", horas: 120 },
];
export const gerarCustoHa = (): { mes: string; valor: number }[] => [
  { mes: "Janeiro", valor: 47 },
  { mes: "Fevereiro", valor: 58 },
  { mes: "Março", valor: 127 },
  { mes: "Abril", valor: 109 },
  { mes: "Maio", valor: 97 },
  { mes: "Junho", valor: 86 },
  { mes: "Julho", valor: 117 },
  { mes: "Agosto", valor: 105 },
  { mes: "Setembro", valor: 125 },
  { mes: "Outubro", valor: 113 },
  { mes: "Novembro", valor: 70 },
  { mes: "Dezembro", valor: 54 },
];
export const gerarCustoHaPorAtividade = (): {
  atividade: string;
  custoProdutos: number;
  custoTrabalhadores: number;
}[] => [
  { atividade: "Plantação", custoProdutos: 50, custoTrabalhadores: 40 },
  { atividade: "Sementeira", custoProdutos: 30, custoTrabalhadores: 25 },
  { atividade: "Adubação", custoProdutos: 45, custoTrabalhadores: 35 },
  { atividade: "Poda", custoProdutos: 42, custoTrabalhadores: 34 },
  { atividade: "Fert", custoProdutos: 31, custoTrabalhadores: 20 },
  { atividade: "Colheita", custoProdutos: 60, custoTrabalhadores: 50 },
];
export const gerarControloOrcamentalCustoTotal = (): {
  mes: string;
  custoTotal: number;
  custoOrcamentado: number;
}[] => [
  { mes: "Janeiro", custoTotal: 1200, custoOrcamentado: 1100 },
  { mes: "Fevereiro", custoTotal: 146, custoOrcamentado: 0 },
  { mes: "Março", custoTotal: 3260, custoOrcamentado: 350 },
  { mes: "Abril", custoTotal: 2800, custoOrcamentado: 362 },
  { mes: "Maio", custoTotal: 2500, custoOrcamentado: 2400 },
  { mes: "Junho", custoTotal: 2200, custoOrcamentado: 2100 },
  { mes: "Julho", custoTotal: 3000, custoOrcamentado: 2900 },
  { mes: "Agosto", custoTotal: 2700, custoOrcamentado: 2600 },
  { mes: "Setembro", custoTotal: 3200, custoOrcamentado: 3100 },
  { mes: "Outubro", custoTotal: 2900, custoOrcamentado: 2800 },
  { mes: "Novembro", custoTotal: 1800, custoOrcamentado: 1700 },
  { mes: "Dezembro", custoTotal: 1400, custoOrcamentado: 1300 },
];
export const gerarControloOrcamentalHoras = (): {
  atividade: string;
  totalHoras: number;
  horasOrcamentadas: number;
}[] => [
  { atividade: "Plantação", totalHoras: 800, horasOrcamentadas: 750 },
  { atividade: "Sementeira", totalHoras: 500, horasOrcamentadas: 480 },
  { atividade: "Adubação", totalHoras: 600, horasOrcamentadas: 550 },
  { atividade: "Poda", totalHoras: 4307, horasOrcamentadas: 0 },
  { atividade: "Fert", totalHoras: 605, horasOrcamentadas: 34 },
  { atividade: "Colheita", totalHoras: 1200, horasOrcamentadas: 1100 },
];
export const gerarControloOrcamentalCustoHa = (): { mes: string; custoHa: number; orcamentoHa: number }[] => [
  { mes: "Janeiro", custoHa: 47, orcamentoHa: 43 },
  { mes: "Fevereiro", custoHa: 6, orcamentoHa: 0 },
  { mes: "Março", custoHa: 127, orcamentoHa: 14 },
  { mes: "Abril", custoHa: 109, orcamentoHa: 14 },
  { mes: "Maio", custoHa: 97, orcamentoHa: 93 },
  { mes: "Junho", custoHa: 86, orcamentoHa: 82 },
  { mes: "Julho", custoHa: 117, orcamentoHa: 113 },
  { mes: "Agosto", custoHa: 105, orcamentoHa: 101 },
  { mes: "Setembro", custoHa: 125, orcamentoHa: 121 },
  { mes: "Outubro", custoHa: 113, orcamentoHa: 109 },
  { mes: "Novembro", custoHa: 70, orcamentoHa: 66 },
  { mes: "Dezembro", custoHa: 54, orcamentoHa: 51 },
];
export const gerarCustoPorProduto = (): { produto: string; custoProduto: number; orcamento: number }[] => [
  { produto: "Plantas", custoProduto: 1885, orcamento: 0 },
  { produto: "Fertilizantes", custoProduto: 0, orcamento: 450 },
  { produto: "Pesticidas", custoProduto: 1400, orcamento: 1300 },
];
export const gerarOrcamentoHoras = (): OrcamentoRow[] => [
  {
    local: "Talhão 1",
    janeiro: 100,
    fevereiro: 120,
    marco: 150,
    abril: 130,
    maio: 140,
    junho: 110,
    julho: 160,
    agosto: 150,
    setembro: 170,
    outubro: 140,
    novembro: 120,
    dezembro: 100,
    total: 1590,
  },
  {
    local: "Talhão 2",
    janeiro: 50,
    fevereiro: 60,
    marco: 70,
    abril: 80,
    maio: 90,
    junho: 100,
    julho: 110,
    agosto: 120,
    setembro: 130,
    outubro: 140,
    novembro: 150,
    dezembro: 160,
    total: 1260,
  },
  {
    local: "Talhão 3",
    janeiro: 200,
    fevereiro: 180,
    marco: 160,
    abril: 140,
    maio: 120,
    junho: 100,
    julho: 80,
    agosto: 60,
    setembro: 40,
    outubro: 20,
    novembro: 10,
    dezembro: 5,
    total: 1115,
  },
  {
    local: "Talhão 4",
    janeiro: 150,
    fevereiro: 140,
    marco: 130,
    abril: 120,
    maio: 110,
    junho: 100,
    julho: 90,
    agosto: 80,
    setembro: 70,
    outubro: 60,
    novembro: 50,
    dezembro: 40,
    total: 1140,
  },
  {
    local: "Talhão 5",
    janeiro: 300,
    fevereiro: 250,
    marco: 200,
    abril: 150,
    maio: 100,
    junho: 50,
    julho: 300,
    agosto: 250,
    setembro: 200,
    outubro: 150,
    novembro: 100,
    dezembro: 50,
    total: 2150,
  },
  {
    local: "Talhão 6",
    janeiro: 250,
    fevereiro: 200,
    marco: 150,
    abril: 100,
    maio: 50,
    junho: 300,
    julho: 250,
    agosto: 200,
    setembro: 150,
    outubro: 100,
    novembro: 50,
    dezembro: 300,
    total: 2100,
  },
  {
    local: "Talhão 7",
    janeiro: 400,
    fevereiro: 350,
    marco: 300,
    abril: 250,
    maio: 200,
    junho: 150,
    julho: 100,
    agosto: 50,
    setembro: 400,
    outubro: 350,
    novembro: 300,
    dezembro: 250,
    total: 3100,
  },
  {
    local: "Talhão 8",
    janeiro: 350,
    fevereiro: 300,
    marco: 250,
    abril: 200,
    maio: 150,
    junho: 100,
    julho: 50,
    agosto: 400,
    setembro: 350,
    outubro: 300,
    novembro: 250,
    dezembro: 200,
    total: 3050,
  },
];
export const areaHa = 25.7;
export const percentExecucao = 2;
export const areaTotalHa = 26;
