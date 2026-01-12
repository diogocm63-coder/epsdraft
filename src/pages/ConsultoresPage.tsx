import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, GroupedBarChart } from '@/components/dashboard/Charts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, consultores, stockData, reservasData, vendasData, clientes } from '@/data/mockData';
import { Store, Package, ShoppingCart, TrendingUp, MapPin, Scale } from 'lucide-react';
import logoAgripro from '@/assets/logo-agripro.png';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConsultoresPage = () => {
  const { filters } = useFilters();

  // Filtrar lojas por zona e concelho
  const filteredLojas = lojas.filter(l => 
    (filters.zona === "Portugal" || l.distrito === filters.zona) &&
    (filters.concelho === "Todos" || l.concelho === filters.concelho)
  );

  const lojasFiltradas = filteredLojas.map(l => l.nome);
  const mesesCompletos = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Totais em quantidades com todos os filtros
  const totalStock = stockData.filter(s => 
    lojasFiltradas.includes(s.loja) &&
    (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || s.produto === filters.produto) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === s.loja)?.distrito || ''))
  ).reduce((a, s) => a + s.quantidade, 0);

  const filteredReservasData = reservasData.filter(r => 
    lojasFiltradas.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
    r.ano === filters.ano
  );

  const totalReservas = filteredReservasData.reduce((a, r) => a + r.quantidade, 0);

  const filteredVendasData = vendasData.filter(r => 
    lojasFiltradas.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
    r.ano === filters.ano
  );

  const totalVendas = filteredVendasData.reduce((a, r) => a + r.quantidade, 0);

  // Clientes filtrados
  const clientesFiltrados = clientes.filter(c => 
    (filters.zona === "Portugal" || c.distrito === filters.zona)
  );

  // Evolução mensal filtrada
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const evolucaoMensal = mesesNomes.map((mes, idx) => {
    const mesCompleto = mesesCompletos[idx];
    const reservasMes = reservasData.filter(r => 
      lojasFiltradas.includes(r.loja) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.mes === mesCompleto &&
      r.ano === filters.ano
    ).reduce((acc, r) => acc + r.quantidade * 12.5, 0);
    
    const vendasMes = vendasData.filter(r => 
      lojasFiltradas.includes(r.loja) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.mes === mesCompleto &&
      r.ano === filters.ano
    ).reduce((acc, r) => acc + r.quantidade * 14.8, 0);
    
    return {
      name: mes,
      value: Math.floor(reservasMes) || Math.floor(100000 + Math.sin(idx * 0.8) * 80000),
      value2: Math.floor(vendasMes) || Math.floor(120000 + Math.sin(idx * 0.8) * 100000)
    };
  });

  // Custos Previstos vs Reais (filtrado por cliente/cultura)
  const culturas = [...new Set(clientesFiltrados.map(c => c.tipo))];
  const custosPorCultura = culturas.length > 0 
    ? culturas.map(cultura => ({
        name: cultura,
        value: Math.floor(2 + Math.random() * 4),
        value2: Math.floor(2 + Math.random() * 5)
      }))
    : ['Vinha', 'Pêra'].map(cultura => ({
        name: cultura,
        value: Math.floor(2 + Math.random() * 4),
        value2: Math.floor(2 + Math.random() * 5)
      }));

  // Stock por Loja (filtrado)
  const stockPorLoja = filteredLojas.slice(0, 12).map(l => {
    const consultor = consultores.find(c => c.distritos.includes(l.distrito));
    const stockLoja = stockData.filter(s => 
      s.loja === l.nome &&
      (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || s.produto === filters.produto)
    ).reduce((a, s) => a + s.quantidade, 0);
    return {
      loja: l.nome,
      consultor: consultor?.nome.split(' ')[0] || '-',
      stock: stockLoja
    };
  });

  // Resumo por Cliente (filtrado)
  const resumoClientes = clientesFiltrados.slice(0, 3).map(c => {
    const reservasCliente = filteredReservasData.filter(r => r.cliente === c.nome).reduce((a, r) => a + r.quantidade, 0);
    return {
      nome: c.nome,
      cultura: c.tipo,
      reservas: reservasCliente || Math.floor(8000 + Math.random() * 5000),
      hectares: Math.floor(100 + Math.random() * 400),
      kg: Math.floor(10000 + Math.random() * 30000)
    };
  });

  // Totais calculados
  const totalHectares = resumoClientes.reduce((a, c) => a + c.hectares, 0) || 34086;
  const totalKg = Math.floor(resumoClientes.reduce((a, c) => a + c.kg, 0) / 1000) || 791;

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
          <div className="flex items-center gap-3">
            <img src={logoAgripro} alt="Agripro" className="h-6 object-contain" />
            <div>
              <h1 className="text-base font-bold text-foreground">Consultores</h1>
              <p className="text-xs text-muted-foreground">Análise de performance e gestão</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 bg-card border-b">
          <FilterBar showConsultor showProduto showConcelho />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 h-full">
            {/* Left Column - KPIs */}
            <div className="col-span-2 grid grid-cols-2 gap-1 content-start">
              <KPICard 
                title="Lojas" 
                value={filteredLojas.length} 
                icon={Store}
                variant="blue"
              />
              <KPICard 
                title="Stock" 
                value={`${(totalStock/1000).toFixed(0)}K`} 
                icon={Package}
                variant="green"
              />
              <KPICard 
                title="Reservas" 
                value={`${(totalReservas/1000).toFixed(0)}K`} 
                icon={ShoppingCart}
                variant="blue"
              />
              <KPICard 
                title="Reservas €" 
                value={`${((totalReservas * 12.5)/1000).toFixed(0)}K`} 
                icon={ShoppingCart}
                variant="blue"
              />
              <KPICard 
                title="Vendas" 
                value={`${(totalVendas/1000).toFixed(0)}K`} 
                icon={TrendingUp}
                variant="green"
              />
              <KPICard 
                title="Vendas €" 
                value={`${((totalVendas * 14.8)/1000).toFixed(0)}K`} 
                icon={TrendingUp}
                variant="green"
              />
              <KPICard 
                title="Hectares" 
                value={`${(totalHectares/1000).toFixed(0)}K`} 
                icon={MapPin}
                variant="blue"
              />
              <KPICard 
                title="Kg" 
                value={`${totalKg}t`} 
                icon={Scale}
                variant="dark"
              />
            </div>

            {/* Center Column - Charts */}
            <div className="col-span-6 flex flex-col gap-2 h-full">
              {/* Reservas vs Vendas */}
              <div className="bg-card rounded-lg border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Reservas vs Vendas (Evolução)</h3>
                <div className="flex-1 min-h-0">
                  <AreaChartComponent data={evolucaoMensal} height="100%" />
                </div>
              </div>

              {/* Custos Previstos vs Reais */}
              <div className="bg-card rounded-lg border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Custos: Previstos vs Reais (€/kg)</h3>
                <div className="flex-1 min-h-0">
                  <GroupedBarChart data={custosPorCultura} height="100%" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-2 h-full">
              {/* Stock por Loja */}
              <div className="bg-card rounded-lg border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Stock por Loja</h3>
                <ScrollArea className="flex-1">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-muted-foreground border-b">
                        <th className="text-left py-1">Loja</th>
                        <th className="text-left py-1">Consultor</th>
                        <th className="text-right py-1">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockPorLoja.slice(0, 8).map((row, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-1 text-foreground">{row.loja}</td>
                          <td className="py-1 text-primary">{row.consultor}</td>
                          <td className="py-1 text-right text-foreground">{row.stock.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Resumo por Cliente */}
              <div className="bg-card rounded-lg border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Resumo por Cliente</h3>
                <div className="space-y-1 flex-1 overflow-auto">
                  {resumoClientes.map((cliente, idx) => (
                    <div key={idx} className="bg-muted/30 rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-[10px] text-foreground">{cliente.nome}</span>
                        <span className="text-[9px] text-muted-foreground">{cliente.cultura}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                          <div className="text-[8px] text-muted-foreground">Reservas</div>
                          <div className="font-semibold text-[10px] text-primary">{(cliente.reservas/1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-muted-foreground">Hectares</div>
                          <div className="font-semibold text-[10px] text-foreground">{cliente.hectares}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-muted-foreground">Kg</div>
                          <div className="font-semibold text-[10px] text-foreground">{(cliente.kg/1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConsultoresPage;
