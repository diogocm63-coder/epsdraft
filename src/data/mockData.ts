// Lojas reais do Excel
// Lojas reais do Excel
export const lojas = [
  { nome: "ÁGUEDA", distrito: "Aveiro", concelho: "Águeda" },
  { nome: "ALMEIRIM", distrito: "Santarém", concelho: "Almeirim" },
  { nome: "ANADIA", distrito: "Aveiro", concelho: "Anadia" },
  { nome: "AVEIRO", distrito: "Aveiro", concelho: "Aveiro" },
  { nome: "BEJA", distrito: "Beja", concelho: "Beja" },
  { nome: "BRAGANÇA", distrito: "Bragança", concelho: "Bragança" },
  { nome: "CADAVAL", distrito: "Lisboa", concelho: "Cadaval" },
  { nome: "CALDAS DA RAINHA", distrito: "Leiria", concelho: "Caldas da Rainha" },
  { nome: "CARTAXO", distrito: "Santarém", concelho: "Cartaxo" },
  { nome: "CASTELO BRANCO", distrito: "Castelo Branco", concelho: "Castelo Branco" },
  { nome: "CHAVES", distrito: "Vila Real", concelho: "Chaves" },
  { nome: "ÉVORA", distrito: "Évora", concelho: "Évora" },
  { nome: "FUNCHAL", distrito: "Madeira", concelho: "Funchal" },
  { nome: "FUNDÃO", distrito: "Castelo Branco", concelho: "Fundão" },
  { nome: "GUIMARÃES", distrito: "Braga", concelho: "Guimarães" },
  { nome: "LAGOA", distrito: "Faro", concelho: "Lagoa" },
  { nome: "LAGOS", distrito: "Faro", concelho: "Lagos" },
  { nome: "LEIRIA", distrito: "Leiria", concelho: "Leiria" },
  { nome: "LOURINHÃ", distrito: "Lisboa", concelho: "Lourinhã" },
  { nome: "MAFRA", distrito: "Lisboa", concelho: "Mafra" },
  { nome: "MONTEMOR-O-VELHO", distrito: "Coimbra", concelho: "Montemor-o-Velho" },
  { nome: "OLIVEIRA DO BAIRRO", distrito: "Aveiro", concelho: "Oliveira do Bairro" },
  { nome: "OLIVEIRA DO HOSPITAL", distrito: "Coimbra", concelho: "Oliveira do Hospital" },
  { nome: "PENICHE", distrito: "Leiria", concelho: "Peniche" },
  { nome: "POMBAL", distrito: "Leiria", concelho: "Pombal" },
  { nome: "PONTA DELGADA", distrito: "Açores", concelho: "Ponta Delgada" },
  { nome: "PONTE DE LIMA", distrito: "Viana do Castelo", concelho: "Ponte de Lima" },
  { nome: "PORTALEGRE", distrito: "Portalegre", concelho: "Portalegre" },
  { nome: "PORTIMÃO", distrito: "Faro", concelho: "Portimão" },
  { nome: "RIBEIRA GRANDE", distrito: "Açores", concelho: "Ribeira Grande" },
  { nome: "SANTIAGO DO CACÉM", distrito: "Setúbal", concelho: "Santiago do Cacém" },
  { nome: "SETÚBAL", distrito: "Setúbal", concelho: "Setúbal" },
  { nome: "TOMAR", distrito: "Santarém", concelho: "Tomar" },
  { nome: "TONDELA", distrito: "Viseu", concelho: "Tondela" },
  { nome: "TORRES NOVAS", distrito: "Santarém", concelho: "Torres Novas" },
  { nome: "TORRES VEDRAS", distrito: "Lisboa", concelho: "Torres Vedras" },
  { nome: "VISEU", distrito: "Viseu", concelho: "Viseu" },
];

// Produtos reais (seleção representativa)
export const fertilizantes = [
  "6-18-34 1S 0,005B 0,3Zn",
  "Melius® 0-20-10",
  "10-10-29,5 6S",
  "10-10-10",
  "12-24-12",
  "13-12-19-7S-0,2B",
  "15-15-15 9S",
  "17-17-17",
  "22-11-22",
  "AGROVEG 10-25-10",
  "AGROVEG 18",
  "AGROVEG 20-10-5",
  "Basacote Plus 6M",
  "Basfoliar Fruit",
  "HUMIC ACID",
  "ORGANIC GROW",
  "NITRO PLUS 27",
];

export const pesticidas = [
  "DECIS EXPERT",
  "KARATE ZEON",
  "CONFIDOR",
  "MOVENTO",
  "ENVIDOR",
  "AFFIRM",
  "STEWARD",
  "CORAGEN",
  "VOLIAM",
  "THIOPRON 825",
  "THIOVIT JET",
  "TOPAZE",
  "SWITCH",
  "SCORE",
  "SCALA",
];

export const tiposProduto = ["Fertilizantes", "Pesticidas"];

// Clientes dummy (quintas de vinhos e pêras)
export const clientes = [
  { nome: "Quinta do Vale Meão", tipo: "Vinha", distrito: "Bragança" },
  { nome: "Quinta da Leda", tipo: "Vinha", distrito: "Vila Real" },
  { nome: "Quinta do Crasto", tipo: "Vinha", distrito: "Vila Real" },
  { nome: "Quinta dos Murças", tipo: "Vinha", distrito: "Viseu" },
  { nome: "Quinta da Romaneira", tipo: "Vinha", distrito: "Bragança" },
  { nome: "Casa Ferreirinha", tipo: "Vinha", distrito: "Vila Real" },
  { nome: "Quinta do Noval", tipo: "Vinha", distrito: "Vila Real" },
  { nome: "Quinta da Roêda", tipo: "Pêra", distrito: "Leiria" },
  { nome: "Pomares do Oeste", tipo: "Pêra", distrito: "Lisboa" },
  { nome: "Frutas do Cadaval", tipo: "Pêra", distrito: "Lisboa" },
  { nome: "Quinta das Pêras", tipo: "Pêra", distrito: "Santarém" },
  { nome: "Herdade do Alentejo", tipo: "Vinha", distrito: "Évora" },
  { nome: "Monte da Raposinha", tipo: "Vinha", distrito: "Setúbal" },
  { nome: "Quinta da Bacalhôa", tipo: "Vinha", distrito: "Setúbal" },
  { nome: "Pomares do Sul", tipo: "Pêra", distrito: "Faro" },
  // Adicionados para distritos em falta
  { nome: "Quinta dos Açores", tipo: "Vinha", distrito: "Açores" },
  { nome: "Pomares da Ilha", tipo: "Pêra", distrito: "Açores" },
  { nome: "Quinta de Aveiro", tipo: "Vinha", distrito: "Aveiro" },
  { nome: "Frutas de Aveiro", tipo: "Pêra", distrito: "Aveiro" },
  { nome: "Herdade de Beja", tipo: "Vinha", distrito: "Beja" },
  { nome: "Pomares do Alentejo Sul", tipo: "Pêra", distrito: "Beja" },
  { nome: "Quinta de Guimarães", tipo: "Vinha", distrito: "Braga" },
  { nome: "Pomares de Braga", tipo: "Pêra", distrito: "Braga" },
  { nome: "Quinta do Fundão", tipo: "Vinha", distrito: "Castelo Branco" },
  { nome: "Pêras do Centro", tipo: "Pêra", distrito: "Castelo Branco" },
  { nome: "Quinta de Coimbra", tipo: "Vinha", distrito: "Coimbra" },
  { nome: "Frutas de Montemor", tipo: "Pêra", distrito: "Coimbra" },
  { nome: "Quinta da Madeira", tipo: "Vinha", distrito: "Madeira" },
  { nome: "Pomares do Funchal", tipo: "Pêra", distrito: "Madeira" },
  { nome: "Herdade de Portalegre", tipo: "Vinha", distrito: "Portalegre" },
  { nome: "Pomares de Portalegre", tipo: "Pêra", distrito: "Portalegre" },
  { nome: "Quinta de Ponte de Lima", tipo: "Vinha", distrito: "Viana do Castelo" },
  { nome: "Frutas do Norte", tipo: "Pêra", distrito: "Viana do Castelo" },
];

// Consultores dummy
export const consultores = [
  { id: 1, nome: "António Silva", zona: "Norte", distritos: ["Bragança", "Vila Real", "Braga", "Viana do Castelo"] },
  { id: 2, nome: "Maria Santos", zona: "Centro", distritos: ["Aveiro", "Coimbra", "Leiria", "Viseu"] },
  { id: 3, nome: "João Ferreira", zona: "Lisboa", distritos: ["Lisboa", "Santarém"] },
  { id: 4, nome: "Ana Costa", zona: "Sul", distritos: ["Setúbal", "Évora", "Beja", "Faro", "Portalegre"] },
  { id: 5, nome: "Pedro Rodrigues", zona: "Ilhas", distritos: ["Açores", "Madeira"] },
  { id: 6, nome: "Carla Martins", zona: "Centro", distritos: ["Castelo Branco"] },
];

export const distritos = ["Portugal", ...Array.from(new Set(lojas.map((l) => l.distrito))).sort()];

export const anos = [2023, 2024, 2025, 2026];
export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Gerar dados de stock por loja e produto
export const gerarStockPorLoja = () => {
  const data: { loja: string; produto: string; tipoProduto: string; quantidade: number }[] = [];
  lojas.forEach((loja) => {
    fertilizantes.slice(0, 8).forEach((produto) => {
      data.push({
        loja: loja.nome,
        produto,
        tipoProduto: "Fertilizantes",
        quantidade: Math.floor(Math.random() * 500) + 50,
      });
    });
    pesticidas.slice(0, 6).forEach((produto) => {
      data.push({
        loja: loja.nome,
        produto,
        tipoProduto: "Pesticidas",
        quantidade: Math.floor(Math.random() * 200) + 20,
      });
    });
  });
  return data;
};

// Gerar reservas
export const gerarReservas = () => {
  const data: {
    loja: string;
    cliente: string;
    produto: string;
    tipoProduto: string;
    quantidade: number;
    mes: string;
    ano: number;
  }[] = [];

  lojas.forEach((loja) => {
    const distritoLoja = lojas.find((l) => l.nome === loja.nome)?.distrito;
    const clientesFiltrados = clientes.filter((c) => c.distrito === distritoLoja).slice(0, 3);

    clientesFiltrados.forEach((cliente) => {
      const produtos = [...fertilizantes.slice(0, 4), ...pesticidas.slice(0, 2)];
      produtos.forEach((produto) => {
        anos.forEach((ano) => {
          meses.forEach((mes) => {
            data.push({
              loja: loja.nome,
              cliente: cliente.nome,
              produto,
              tipoProduto: fertilizantes.includes(produto) ? "Fertilizantes" : "Pesticidas",
              quantidade: Math.floor(Math.random() * 100) + 10,
              mes,
              ano,
            });
          });
        });
      });
    });
  });
  return data;
};

// Gerar vendas (baseadas em reservas com variação)
export const gerarVendas = (reservas: ReturnType<typeof gerarReservas>) => {
  return reservas.map((r) => ({
    ...r,
    quantidade: Math.floor(r.quantidade * (0.7 + Math.random() * 0.5)),
  }));
};

// Gerar custos por cliente/produto
export const gerarCustos = () => {
  const data: {
    cliente: string;
    tipoCultura: string;
    custoPrevisto: number;
    custoReal: number;
    ano: number;
  }[] = [];

  clientes.forEach((cliente) => {
    anos.forEach((ano) => {
      const custoPrevisto = Math.floor(Math.random() * 50) + 20;
      data.push({
        cliente: cliente.nome,
        tipoCultura: cliente.tipo,
        custoPrevisto,
        custoReal: custoPrevisto + Math.floor((Math.random() - 0.3) * 15),
        ano,
      });
    });
  });
  return data;
};

export const stockData = gerarStockPorLoja();
export const reservasData = gerarReservas();
export const vendasData = gerarVendas(reservasData);
export const custosData = gerarCustos();
