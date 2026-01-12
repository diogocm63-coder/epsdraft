import { useMemo } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { 
  lojas, 
  consultores, 
  clientes, 
  stockData, 
  reservasData, 
  vendasData,
  fertilizantes,
  pesticidas,
  meses
} from '@/data/mockData';

export const useFilteredData = () => {
  const { filters } = useFilters();

  // Filtered lojas based on zona (distrito) and concelho
  const filteredLojas = useMemo(() => {
    return lojas.filter(l => {
      const zonaMatch = filters.zona === "Portugal" || l.distrito === filters.zona;
      const concelhoMatch = filters.concelho === "Todos" || l.concelho === filters.concelho;
      return zonaMatch && concelhoMatch;
    });
  }, [filters.zona, filters.concelho]);

  const lojaNames = useMemo(() => filteredLojas.map(l => l.nome), [filteredLojas]);

  // Filtered consultores
  const filteredConsultores = useMemo(() => {
    if (filters.consultor === "Todos") {
      if (filters.zona === "Portugal") return consultores;
      return consultores.filter(c => c.distritos.some(d => d === filters.zona));
    }
    return consultores.filter(c => c.nome === filters.consultor);
  }, [filters.consultor, filters.zona]);

  // Filtered clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter(c => {
      const zonaMatch = filters.zona === "Portugal" || c.distrito === filters.zona;
      return zonaMatch;
    });
  }, [filters.zona]);

  // Filtered stock
  const filteredStock = useMemo(() => {
    return stockData.filter(s => {
      const lojaMatch = lojaNames.length === 0 || lojaNames.includes(s.loja);
      const tipoProdutoMatch = filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto;
      const produtoMatch = filters.produto === "Todos" || s.produto === filters.produto;
      return lojaMatch && tipoProdutoMatch && produtoMatch;
    });
  }, [lojaNames, filters.tipoProduto, filters.produto]);

  // Filtered reservas
  const filteredReservas = useMemo(() => {
    return reservasData.filter(r => {
      const lojaMatch = lojaNames.length === 0 || lojaNames.includes(r.loja);
      const tipoProdutoMatch = filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto;
      const produtoMatch = filters.produto === "Todos" || r.produto === filters.produto;
      const mesMatch = filters.mes === "Todos" || r.mes === filters.mes;
      const anoMatch = r.ano === filters.ano;
      const consultorMatch = filters.consultor === "Todos" || 
        consultores.find(c => c.nome === filters.consultor)?.distritos.includes(
          lojas.find(l => l.nome === r.loja)?.distrito || ''
        );
      return lojaMatch && tipoProdutoMatch && produtoMatch && mesMatch && anoMatch && consultorMatch;
    });
  }, [lojaNames, filters.tipoProduto, filters.produto, filters.mes, filters.ano, filters.consultor]);

  // Filtered vendas
  const filteredVendas = useMemo(() => {
    return vendasData.filter(r => {
      const lojaMatch = lojaNames.length === 0 || lojaNames.includes(r.loja);
      const tipoProdutoMatch = filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto;
      const produtoMatch = filters.produto === "Todos" || r.produto === filters.produto;
      const mesMatch = filters.mes === "Todos" || r.mes === filters.mes;
      const anoMatch = r.ano === filters.ano;
      const consultorMatch = filters.consultor === "Todos" || 
        consultores.find(c => c.nome === filters.consultor)?.distritos.includes(
          lojas.find(l => l.nome === r.loja)?.distrito || ''
        );
      return lojaMatch && tipoProdutoMatch && produtoMatch && mesMatch && anoMatch && consultorMatch;
    });
  }, [lojaNames, filters.tipoProduto, filters.produto, filters.mes, filters.ano, filters.consultor]);

  // Totais
  const totalStock = useMemo(() => 
    filteredStock.reduce((acc, s) => acc + s.quantidade, 0), [filteredStock]);
  
  const totalReservas = useMemo(() => 
    filteredReservas.reduce((acc, r) => acc + r.quantidade, 0), [filteredReservas]);
  
  const totalVendas = useMemo(() => 
    filteredVendas.reduce((acc, r) => acc + r.quantidade, 0), [filteredVendas]);

  // Clientes únicos nas reservas filtradas
  const clientesUnicos = useMemo(() => 
    [...new Set(filteredReservas.map(r => r.cliente))], [filteredReservas]);

  // Evolução mensal baseada nos dados filtrados
  const evolucaoMensal = useMemo(() => {
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesesCompletos = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return mesesNomes.map((mes, idx) => {
      const mesCompleto = mesesCompletos[idx];
      const vendasMes = filteredVendas.filter(v => v.mes === mesCompleto).reduce((a, v) => a + v.quantidade, 0);
      const reservasMes = filteredReservas.filter(r => r.mes === mesCompleto).reduce((a, r) => a + r.quantidade, 0);
      
      // Multiplicar por valor médio para obter €
      return {
        name: mes,
        value: vendasMes * 12.5, // vendas em €
        value2: reservasMes * 12.5 // reservas em €
      };
    });
  }, [filteredVendas, filteredReservas]);

  // Stock por tipo de produto
  const stockPorTipo = useMemo(() => [
    { 
      name: 'Fertilizantes', 
      value: filteredStock.filter(s => s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) 
    },
    { 
      name: 'Pesticidas', 
      value: filteredStock.filter(s => s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) 
    }
  ], [filteredStock]);

  // Top lojas por vendas
  const topLojas = useMemo(() => {
    const vendasPorLoja = filteredLojas.map(l => {
      const vendas = filteredVendas.filter(v => v.loja === l.nome).reduce((a, v) => a + v.quantidade, 0);
      const reservas = filteredReservas.filter(r => r.loja === l.nome).reduce((a, r) => a + r.quantidade, 0);
      return {
        name: l.nome.length > 12 ? l.nome.substring(0, 12) + '...' : l.nome,
        fullName: l.nome,
        value: vendas * 12.5,
        value2: reservas * 12.5
      };
    });
    return vendasPorLoja.sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredLojas, filteredVendas, filteredReservas]);

  // Stock por loja
  const stockPorLoja = useMemo(() => {
    return filteredLojas.slice(0, 12).map(l => {
      const consultor = consultores.find(c => c.distritos.includes(l.distrito));
      const stockLoja = filteredStock.filter(s => s.loja === l.nome).reduce((a, s) => a + s.quantidade, 0);
      return {
        loja: l.nome,
        consultor: consultor?.nome.split(' ')[0] || '-',
        stock: stockLoja
      };
    });
  }, [filteredLojas, filteredStock]);

  // Resumo por cliente
  const resumoClientes = useMemo(() => {
    return filteredClientes.slice(0, 5).map(c => {
      const reservasCliente = filteredReservas.filter(r => r.cliente === c.nome).reduce((a, r) => a + r.quantidade, 0);
      const vendasCliente = filteredVendas.filter(v => v.cliente === c.nome).reduce((a, v) => a + v.quantidade, 0);
      return {
        nome: c.nome,
        cultura: c.tipo,
        reservas: reservasCliente || Math.floor(5000 + Math.random() * 3000),
        vendas: vendasCliente || Math.floor(4000 + Math.random() * 2000),
        hectares: Math.floor(100 + Math.random() * 400),
        kg: Math.floor(10000 + Math.random() * 30000)
      };
    });
  }, [filteredClientes, filteredReservas, filteredVendas]);

  // Clientes com dados de reservas e vendas
  const clientesData = useMemo(() => {
    return filteredClientes.slice(0, 8).map(c => {
      const reservas = filteredReservas.filter(r => r.cliente === c.nome).reduce((a, r) => a + r.quantidade, 0) || Math.floor(500 + Math.random() * 1500);
      const vendas = filteredVendas.filter(v => v.cliente === c.nome).reduce((a, v) => a + v.quantidade, 0) || Math.floor(reservas * (0.7 + Math.random() * 0.3));
      return {
        nome: c.nome,
        status: Math.random() > 0.3 ? 'ativo' : 'pendente',
        reservas,
        vendas,
        taxa: reservas > 0 ? Math.floor((vendas / reservas) * 100) : 0
      };
    });
  }, [filteredClientes, filteredReservas, filteredVendas]);

  // Inventário por produto
  const produtosInventario = useMemo(() => {
    const produtos = filters.tipoProduto === "Todos" 
      ? [...fertilizantes.slice(0, 5), ...pesticidas.slice(0, 5)]
      : filters.tipoProduto === "Fertilizantes" 
        ? fertilizantes.slice(0, 10)
        : pesticidas.slice(0, 10);
    
    return produtos.map(p => {
      const tipo = fertilizantes.includes(p) ? 'Fertilizante' : 'Pesticida';
      const stockProduto = filteredStock.filter(s => s.produto === p).reduce((a, s) => a + s.quantidade, 0);
      return {
        nome: p,
        tipo,
        stock: stockProduto || Math.floor(100 + Math.random() * 5000)
      };
    });
  }, [filters.tipoProduto, filteredStock]);

  // Consultores com lojas atribuídas
  const consultoresComLojas = useMemo(() => {
    return filteredConsultores.map((c, idx) => ({
      ...c,
      lojasAtribuidas: filteredLojas.filter(l => c.distritos.includes(l.distrito)).length
    }));
  }, [filteredConsultores, filteredLojas]);

  // Custos previstos vs reais
  const custosPorCultura = useMemo(() => {
    const culturas = [...new Set(filteredClientes.map(c => c.tipo))];
    return culturas.map(cultura => ({
      name: cultura,
      value: Math.floor(2 + Math.random() * 4), // Custo previsto €/kg
      value2: Math.floor(2 + Math.random() * 5) // Custo real €/kg
    }));
  }, [filteredClientes]);

  return {
    filters,
    filteredLojas,
    filteredConsultores,
    filteredClientes,
    filteredStock,
    filteredReservas,
    filteredVendas,
    totalStock,
    totalReservas,
    totalVendas,
    clientesUnicos,
    evolucaoMensal,
    stockPorTipo,
    topLojas,
    stockPorLoja,
    resumoClientes,
    clientesData,
    produtosInventario,
    consultoresComLojas,
    custosPorCultura
  };
};
