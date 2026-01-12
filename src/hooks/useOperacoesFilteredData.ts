import { useMemo } from 'react';
import { useOperacoesFilters } from '@/contexts/OperacoesFilterContext';
import { 
  gerarHorasTrabalhadas,
  gerarCustos,
  gerarTipoAtividade,
  gerarCustosMensais,
  gerarCustosPorAtividade,
  gerarCustosPorLocal,
  gerarTop5AtividadesCusto,
  gerarCustoTotalPorProduto,
  gerarCustoTotalPorHa,
  gerarHorasPorAtividade,
  gerarHorasPorLocal,
  gerarHorasPorDiaSemana,
  gerarHorasPorHa,
  gerarAtividadesDetalhe,
  gerarHorasTrabalhadasHa,
  gerarHorasTrabalhadasHaPorAtividade,
  gerarCustoHa,
  gerarCustoHaPorAtividade,
  gerarControloOrcamentalCustoTotal,
  gerarControloOrcamentalHoras,
  gerarControloOrcamentalCustoHa,
  gerarCustoPorProduto,
  gerarOrcamentoHoras,
  areaHa,
  percentExecucao,
  areaTotalHa,
  locais
} from '@/data/operacoesData';

// Multiplicadores para simular variação baseada em filtros
const getMultiplier = (filters: any) => {
  let mult = 1;
  
  // Variação por organização
  if (filters.organizacao === "AgroCorp") mult *= 1.2;
  if (filters.organizacao === "FarmTech") mult *= 0.8;
  
  // Variação por espaço
  if (filters.espaco !== "Tudo") mult *= 0.6;
  
  // Variação por local
  if (filters.local !== "Tudo") mult *= 0.4;
  
  // Variação por atividade
  if (filters.atividade !== "Tudo") mult *= 0.5;
  
  return mult;
};

export const useOperacoesFilteredData = () => {
  const { filters } = useOperacoesFilters();

  const multiplier = useMemo(() => getMultiplier(filters), [filters]);

  // Horas trabalhadas com filtros aplicados
  const horasTrabalhadas = useMemo(() => {
    const base = gerarHorasTrabalhadas();
    return {
      ...base,
      total: Math.floor(base.total * multiplier),
      horasUteis: Math.floor(base.horasUteis * multiplier),
      horasPausa: Math.floor(base.horasPausa * multiplier),
    };
  }, [multiplier]);

  // Custos com filtros aplicados
  const custos = useMemo(() => {
    const base = gerarCustos();
    return {
      ...base,
      total: Math.floor(base.total * multiplier),
      pessoal: Math.floor(base.pessoal * multiplier),
      produtos: Math.floor(base.produtos * multiplier),
    };
  }, [multiplier]);

  // Tipo de atividade filtrado
  const tipoAtividade = useMemo(() => {
    const base = gerarTipoAtividade();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.name.toLowerCase().includes(filters.atividade.toLowerCase()));
    }
    return base;
  }, [filters.atividade]);

  // Custos mensais
  const custosMensais = useMemo(() => {
    const base = gerarCustosMensais();
    const mesesFiltrados = filters.mes !== "Tudo" 
      ? base.filter(m => m.mes === filters.mes)
      : base;
    return mesesFiltrados.map(m => ({
      ...m,
      valor: Math.floor(m.valor * multiplier),
      valorHa: parseFloat((m.valorHa * multiplier).toFixed(2))
    }));
  }, [filters.mes, multiplier]);

  // Custos por atividade
  const custosPorAtividade = useMemo(() => {
    const base = gerarCustosPorAtividade();
    if (filters.atividade !== "Tudo") {
      const filtered = base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()));
      return filtered.map(a => ({
        ...a,
        custoTotal: Math.floor(a.custoTotal * multiplier),
        orcamento: Math.floor(a.orcamento * multiplier)
      }));
    }
    return base.map(a => ({
      ...a,
      custoTotal: Math.floor(a.custoTotal * multiplier),
      orcamento: Math.floor(a.orcamento * multiplier)
    }));
  }, [filters.atividade, multiplier]);

  // Custos por local
  const custosPorLocal = useMemo(() => {
    const base = gerarCustosPorLocal();
    if (filters.local !== "Tudo") {
      const filtered = base.filter(l => l.local === filters.local);
      return filtered.map(l => ({
        ...l,
        custoTotal: Math.floor(l.custoTotal * multiplier),
        orcamento: Math.floor(l.orcamento * multiplier)
      }));
    }
    return base.map(l => ({
      ...l,
      custoTotal: Math.floor(l.custoTotal * multiplier),
      orcamento: Math.floor(l.orcamento * multiplier)
    }));
  }, [filters.local, multiplier]);

  // Top 5 atividades por custo
  const top5AtividadesCusto = useMemo(() => {
    const base = gerarTop5AtividadesCusto();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ ...a, custo: Math.floor(a.custo * multiplier) }));
    }
    return base.map(a => ({ ...a, custo: Math.floor(a.custo * multiplier) }));
  }, [filters.atividade, multiplier]);

  // Custo por produto
  const custoTotalPorProduto = useMemo(() => {
    const base = gerarCustoTotalPorProduto();
    if (filters.tipoProduto !== "Fertilizers") {
      return base.filter(p => p.produto.toLowerCase().includes(filters.tipoProduto.toLowerCase()))
        .map(p => ({ ...p, custo: Math.floor(p.custo * multiplier) }));
    }
    return base.map(p => ({ ...p, custo: Math.floor(p.custo * multiplier) }));
  }, [filters.tipoProduto, multiplier]);

  // Custo por ha
  const custoTotalPorHa = useMemo(() => {
    const base = gerarCustoTotalPorHa();
    if (filters.local !== "Tudo") {
      return base.filter(l => l.local === filters.local)
        .map(l => ({ ...l, custo: Math.floor(l.custo * multiplier) }));
    }
    return base.map(l => ({ ...l, custo: Math.floor(l.custo * multiplier) }));
  }, [filters.local, multiplier]);

  // Horas por atividade
  const horasPorAtividade = useMemo(() => {
    const base = gerarHorasPorAtividade();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ ...a, horas: Math.floor(a.horas * multiplier) }));
    }
    return base.map(a => ({ ...a, horas: Math.floor(a.horas * multiplier) }));
  }, [filters.atividade, multiplier]);

  // Horas por local
  const horasPorLocal = useMemo(() => {
    const base = gerarHorasPorLocal();
    if (filters.local !== "Tudo") {
      return base.filter(l => l.local === filters.local || l.local.includes(filters.local))
        .map(l => ({ ...l, horas: Math.floor(l.horas * multiplier) }));
    }
    return base.map(l => ({ ...l, horas: Math.floor(l.horas * multiplier) }));
  }, [filters.local, multiplier]);

  // Horas por dia da semana
  const horasPorDiaSemana = useMemo(() => {
    const base = gerarHorasPorDiaSemana();
    return base.map(d => ({ ...d, horas: Math.floor(d.horas * multiplier) }));
  }, [multiplier]);

  // Horas por ha
  const horasPorHa = useMemo(() => {
    const base = gerarHorasPorHa();
    if (filters.local !== "Tudo") {
      return base.filter(l => l.local === filters.local)
        .map(l => ({ ...l, horas: Math.floor(l.horas * multiplier) }));
    }
    return base.map(l => ({ ...l, horas: Math.floor(l.horas * multiplier) }));
  }, [filters.local, multiplier]);

  // Atividades detalhe
  const atividadesDetalhe = useMemo(() => {
    const base = gerarAtividadesDetalhe();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ ...a, marco: a.marco * multiplier, total: a.total * multiplier }));
    }
    return base.map(a => ({ ...a, marco: a.marco * multiplier, total: a.total * multiplier }));
  }, [filters.atividade, multiplier]);

  // Horas trabalhadas por ha
  const horasTrabalhadasHa = useMemo(() => {
    const base = gerarHorasTrabalhadasHa();
    if (filters.mes !== "Tudo") {
      return base.filter(m => m.mes === filters.mes)
        .map(m => ({ ...m, valor: Math.floor(m.valor * multiplier) }));
    }
    return base.map(m => ({ ...m, valor: Math.floor(m.valor * multiplier) }));
  }, [filters.mes, multiplier]);

  // Horas trabalhadas por ha por atividade
  const horasTrabalhadasHaPorAtividade = useMemo(() => {
    const base = gerarHorasTrabalhadasHaPorAtividade();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ ...a, horas: Math.floor(a.horas * multiplier) }));
    }
    return base.map(a => ({ ...a, horas: Math.floor(a.horas * multiplier) }));
  }, [filters.atividade, multiplier]);

  // Custo por ha
  const custoHa = useMemo(() => {
    const base = gerarCustoHa();
    if (filters.mes !== "Tudo") {
      return base.filter(m => m.mes === filters.mes)
        .map(m => ({ ...m, valor: Math.floor(m.valor * multiplier) }));
    }
    return base.map(m => ({ ...m, valor: Math.floor(m.valor * multiplier) }));
  }, [filters.mes, multiplier]);

  // Custo por ha por atividade
  const custoHaPorAtividade = useMemo(() => {
    const base = gerarCustoHaPorAtividade();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ 
          ...a, 
          custoProdutos: Math.floor(a.custoProdutos * multiplier),
          custoTrabalhadores: Math.floor(a.custoTrabalhadores * multiplier)
        }));
    }
    return base.map(a => ({ 
      ...a, 
      custoProdutos: Math.floor(a.custoProdutos * multiplier),
      custoTrabalhadores: Math.floor(a.custoTrabalhadores * multiplier)
    }));
  }, [filters.atividade, multiplier]);

  // Controlo orçamental - custo total
  const controloOrcamentalCustoTotal = useMemo(() => {
    const base = gerarControloOrcamentalCustoTotal();
    if (filters.mes !== "Tudo") {
      return base.filter(m => m.mes === filters.mes)
        .map(m => ({ 
          ...m, 
          custoTotal: Math.floor(m.custoTotal * multiplier),
          custoOrcamentado: Math.floor(m.custoOrcamentado * multiplier)
        }));
    }
    return base.map(m => ({ 
      ...m, 
      custoTotal: Math.floor(m.custoTotal * multiplier),
      custoOrcamentado: Math.floor(m.custoOrcamentado * multiplier)
    }));
  }, [filters.mes, multiplier]);

  // Controlo orçamental - horas
  const controloOrcamentalHoras = useMemo(() => {
    const base = gerarControloOrcamentalHoras();
    if (filters.atividade !== "Tudo") {
      return base.filter(a => a.atividade.toLowerCase().includes(filters.atividade.toLowerCase()))
        .map(a => ({ 
          ...a, 
          totalHoras: Math.floor(a.totalHoras * multiplier),
          horasOrcamentadas: Math.floor(a.horasOrcamentadas * multiplier)
        }));
    }
    return base.map(a => ({ 
      ...a, 
      totalHoras: Math.floor(a.totalHoras * multiplier),
      horasOrcamentadas: Math.floor(a.horasOrcamentadas * multiplier)
    }));
  }, [filters.atividade, multiplier]);

  // Controlo orçamental - custo/ha
  const controloOrcamentalCustoHa = useMemo(() => {
    const base = gerarControloOrcamentalCustoHa();
    if (filters.mes !== "Tudo") {
      return base.filter(m => m.mes === filters.mes)
        .map(m => ({ 
          ...m, 
          custoHa: Math.floor(m.custoHa * multiplier),
          orcamentoHa: Math.floor(m.orcamentoHa * multiplier)
        }));
    }
    return base.map(m => ({ 
      ...m, 
      custoHa: Math.floor(m.custoHa * multiplier),
      orcamentoHa: Math.floor(m.orcamentoHa * multiplier)
    }));
  }, [filters.mes, multiplier]);

  // Custo por produto
  const custoPorProduto = useMemo(() => {
    const base = gerarCustoPorProduto();
    if (filters.tipoProduto !== "Fertilizers") {
      return base.filter(p => p.produto.toLowerCase().includes(filters.tipoProduto.toLowerCase()))
        .map(p => ({ 
          ...p, 
          custoProduto: Math.floor(p.custoProduto * multiplier),
          orcamento: Math.floor(p.orcamento * multiplier)
        }));
    }
    return base.map(p => ({ 
      ...p, 
      custoProduto: Math.floor(p.custoProduto * multiplier),
      orcamento: Math.floor(p.orcamento * multiplier)
    }));
  }, [filters.tipoProduto, multiplier]);

  // Orçamento de horas
  const orcamentoHoras = useMemo(() => {
    const base = gerarOrcamentoHoras();
    if (filters.local !== "Tudo") {
      return base.filter(l => l.local.includes(filters.local));
    }
    return base;
  }, [filters.local]);

  // Área filtrada
  const areaFiltrada = useMemo(() => {
    return parseFloat((areaHa * multiplier).toFixed(1));
  }, [multiplier]);

  // Percentagem de execução filtrada
  const percentExecucaoFiltrada = useMemo(() => {
    return Math.min(100, Math.floor(percentExecucao * (1 + (1 - multiplier))));
  }, [multiplier]);

  return {
    filters,
    horasTrabalhadas,
    custos,
    tipoAtividade,
    custosMensais,
    custosPorAtividade,
    custosPorLocal,
    top5AtividadesCusto,
    custoTotalPorProduto,
    custoTotalPorHa,
    horasPorAtividade,
    horasPorLocal,
    horasPorDiaSemana,
    horasPorHa,
    atividadesDetalhe,
    horasTrabalhadasHa,
    horasTrabalhadasHaPorAtividade,
    custoHa,
    custoHaPorAtividade,
    controloOrcamentalCustoTotal,
    controloOrcamentalHoras,
    controloOrcamentalCustoHa,
    custoPorProduto,
    orcamentoHoras,
    areaFiltrada,
    percentExecucaoFiltrada,
    areaTotalHa
  };
};
