import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { MiniBarChart, MiniLineChart, MiniPieChart } from '@/components/dashboard/MiniChart';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, stockData, reservasData, vendasData, clientes } from '@/data/mockData';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import logoAgriloja from '@/assets/logo-agriloja.png';

const LojasPage = () => {
  const { filters } = useFilters();

  // Filtrar loja específica ou todas da zona
  const filteredLojas = filters.concelho !== "Todos"
    ? lojas.filter(l => l.concelho === filters.concelho)
    : filters.zona === "Portugal" 
      ? lojas 
      : lojas.filter(l => l.distrito === filters.zona);

  const lojaNames = filteredLojas.map(l => l.nome);

  // Filtrar stock
  const filteredStock = stockData.filter(s => 
    lojaNames.includes(s.loja) &&
    (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || s.produto === filters.produto)
  );

  // Filtrar reservas e vendas
  const filteredReservas = reservasData.filter(r => 
    lojaNames.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    r.ano === filters.ano
  );

  const filteredVendas = vendasData.filter(r => 
    lojaNames.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    r.ano === filters.ano
  );

  const totalStock = filteredStock.reduce((a, s) => a + s.quantidade, 0);
  const totalReservas = filteredReservas.reduce((a, r) => a + r.quantidade, 0);
  const totalVendas = filteredVendas.reduce((a, r) => a + r.quantidade, 0);

  // Clientes únicos
  const clientesUnicos = [...new Set(filteredReservas.map(r => r.cliente))];

  // Inventário por tipo
  const inventarioPorTipo = [
    { name: 'Fertilizantes', value: filteredStock.filter(s => s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
    { name: 'Pesticidas', value: filteredStock.filter(s => s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
  ];

  // Clientes com reservas
  const clientesReservas = clientesUnicos.slice(0, 5).map(cliente => ({
    nome: cliente.substring(0, 20),
    cultura: clientes.find(c => c.nome === cliente)?.tipo || '-',
    reservas: filteredReservas.filter(r => r.cliente === cliente).reduce((a, r) => a + r.quantidade, 0)
  }));

  // Reservas vs Vendas por produto
  const topProdutos = [...new Set(filteredReservas.map(r => r.produto))].slice(0, 5);
  const reservasVsVendasProduto = topProdutos.map(p => ({
    name: p.substring(0, 10),
    value: filteredReservas.filter(r => r.produto === p).reduce((a, r) => a + r.quantidade, 0),
    value2: filteredVendas.filter(r => r.produto === p).reduce((a, r) => a + r.quantidade, 0)
  }));

  // Evolução mensal
  const evolucaoMensal = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((mes, idx) => {
    const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'][idx];
    return {
      name: mes,
      value: reservasData.filter(r => lojaNames.includes(r.loja) && r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0),
      value2: vendasData.filter(r => lojaNames.includes(r.loja) && r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0)
    };
  });

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="page-header" style={{ borderLeft: '4px solid hsl(145, 70%, 40%)' }}>
          <div className="flex items-center gap-4">
            <img src={logoAgriloja} alt="Agriloja" className="h-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Lojas</h1>
              <p className="text-sm text-muted-foreground">
                {filters.concelho !== "Todos" ? filters.concelho : filters.zona !== "Portugal" ? filters.zona : "Rede Nacional"}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pt-4">
          <FilterBar showConcelho />
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-3 gap-4 overflow-hidden">
          {/* KPI Cards - Row 1 */}
          <StatCard 
            title="Inventário Total" 
            value={totalStock.toLocaleString()} 
            subtitle="Unidades em stock"
            icon={Package}
            variant="primary"
          />
          <StatCard 
            title="Clientes Ativos" 
            value={clientesUnicos.length} 
            subtitle="Com reservas"
            icon={Users}
            variant="secondary"
          />
          <StatCard 
            title="Reservas" 
            value={totalReservas.toLocaleString()} 
            subtitle="Unidades"
            icon={ShoppingCart}
            variant="accent"
          />
          <StatCard 
            title="Vendas" 
            value={totalVendas.toLocaleString()} 
            subtitle="Unidades"
            icon={TrendingUp}
            trend={{ value: Math.round((totalVendas/totalReservas)*100 - 100) || 0, positive: totalVendas >= totalReservas * 0.8 }}
            variant="primary"
          />

          {/* Row 2 */}
          <div className="dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Inventário por Tipo</h3>
            <MiniPieChart data={inventarioPorTipo} height={130} />
          </div>
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Clientes</h3>
            <DataTable 
              columns={[
                { key: 'nome', header: 'Cliente' },
                { key: 'cultura', header: 'Cultura' },
                { key: 'reservas', header: 'Reservas', align: 'right' }
              ]}
              data={clientesReservas}
              maxHeight="130px"
            />
          </div>
          <div className="dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Reservas vs Vendas</h3>
            <MiniBarChart data={reservasVsVendasProduto} height={130} showLegend />
          </div>

          {/* Row 3 */}
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Evolução Mensal (Qtd)</h3>
            <MiniLineChart data={evolucaoMensal} height={120} />
          </div>
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Resumo de Reservas</h3>
            <div className="grid grid-cols-2 gap-4 h-full items-center">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalReservas.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Reservas</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{totalVendas.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Vendas</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg col-span-2">
                <div className="text-xl font-bold" style={{ color: totalVendas >= totalReservas * 0.8 ? 'hsl(122, 39%, 49%)' : 'hsl(0, 72%, 51%)' }}>
                  {((totalVendas / totalReservas) * 100 || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Taxa de Conversão</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LojasPage;
