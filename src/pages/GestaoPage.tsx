import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, HorizontalBarChart, DonutChart } from '@/components/dashboard/Charts';
import { ConsultorItem, getConsultorColor } from '@/components/dashboard/ConsultorItem';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, consultores, stockData, reservasData, vendasData } from '@/data/mockData';
import { Store, Users, MapPin, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import logoAgris from '@/assets/logo-grupo-agris.png';

const GestaoPage = () => {
  const { filters } = useFilters();

  // Filtrar dados
  const filteredLojas = filters.zona === "Portugal" 
    ? lojas 
    : lojas.filter(l => l.distrito === filters.zona);

  const filteredConsultores = filters.consultor === "Todos"
    ? consultores
    : consultores.filter(c => c.nome === filters.consultor);

  const totalStock = stockData
    .filter(s => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === s.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || s.produto === filters.produto)
    )
    .reduce((acc, s) => acc + s.quantidade, 0);

  const totalReservas = reservasData
    .filter(r => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.mes === "Todos" || r.mes === filters.mes) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.ano === filters.ano
    )
    .reduce((acc, r) => acc + r.quantidade, 0);

  const totalVendas = vendasData
    .filter(r => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.mes === "Todos" || r.mes === filters.mes) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.ano === filters.ano
    )
    .reduce((acc, r) => acc + r.quantidade, 0);

  // Dados para gráficos - Mensal com todos os meses
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const evolucaoMensal = mesesNomes.map((mes, idx) => {
    const baseVendas = 200000 + Math.random() * 400000;
    const baseReservas = baseVendas * (0.6 + Math.random() * 0.4);
    return {
      name: mes,
      value: Math.floor(baseVendas),
      value2: Math.floor(baseReservas)
    };
  });

  // Distribuição de Produtos
  const stockPorTipo = [
    { name: 'Fertilizantes', value: stockData.filter(s => s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
    { name: 'Pesticidas', value: stockData.filter(s => s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
  ];

  // Top 8 Lojas por Vendas
  const topLojas = lojas.slice(0, 8).map(l => ({
    name: l.nome.length > 12 ? l.nome.substring(0, 12) + '...' : l.nome,
    value: Math.floor(50000 + Math.random() * 150000),
    value2: Math.floor(40000 + Math.random() * 100000)
  })).sort((a, b) => b.value - a.value);

  // Clientes total
  const totalClientes = 156;

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <img src={logoAgris} alt="Grupo Agris" className="h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Visão 360º</h1>
              <p className="text-sm text-muted-foreground">Dashboard de gestão geral</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-card border-b">
          <FilterBar showConsultor showProduto />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column - KPIs */}
            <div className="col-span-2 flex flex-col gap-3">
              <KPICard 
                title="Total Lojas" 
                value={filteredLojas.length} 
                icon={Store}
                trend={{ value: 5.2, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Consultores Ativos" 
                value={filteredConsultores.length} 
                icon={Users}
                variant="green"
              />
              <KPICard 
                title="Total Clientes" 
                value={totalClientes} 
                icon={MapPin}
                trend={{ value: 8.7, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Reservas" 
                value={`${totalReservas.toLocaleString()} un`} 
                icon={ShoppingCart}
                trend={{ value: 2.3, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Vendas" 
                value={`${totalVendas.toLocaleString()} un`} 
                icon={TrendingUp}
                trend={{ value: 12.4, positive: true }}
                variant="green"
              />
              <KPICard 
                title="Stock Total" 
                value={`${totalStock.toLocaleString()} un`} 
                icon={Package}
                variant="dark"
              />
            </div>

            {/* Center Column - Charts */}
            <div className="col-span-7 flex flex-col gap-4 h-full">
              {/* Vendas vs Reservas Chart */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Vendas vs Reservas (Mensal)</h3>
                <AreaChartComponent data={evolucaoMensal} height={180} />
              </div>

              {/* Top Lojas Chart */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Top 8 Lojas por Vendas</h3>
                <HorizontalBarChart data={topLojas} height={180} />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-3 flex flex-col gap-4 h-full">
              {/* Consultores por Região - altura reduzida */}
              <div className="bg-card rounded-xl border p-4 overflow-auto" style={{ maxHeight: '160px' }}>
                <h3 className="text-sm font-semibold text-foreground mb-2">Consultores por Região</h3>
                <div className="space-y-1">
                  {consultores.map((c, idx) => (
                    <ConsultorItem 
                      key={c.id}
                      nome={c.nome}
                      zona={c.zona}
                      lojas={lojas.filter(l => c.distritos.includes(l.distrito)).length}
                      color={getConsultorColor(idx)}
                    />
                  ))}
                </div>
              </div>

              {/* Distribuição de Produtos - altura aumentada */}
              <div className="bg-card rounded-xl border p-4 flex-1 flex flex-col items-center justify-center">
                <h3 className="text-sm font-semibold text-foreground mb-2 self-start">Distribuição de Produtos</h3>
                <DonutChart data={stockPorTipo} height={220} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestaoPage;
