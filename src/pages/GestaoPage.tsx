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

  // Mapear meses para o filtro
  const mesesMap: { [key: string]: string } = {
    'Janeiro': 'Jan', 'Fevereiro': 'Fev', 'Março': 'Mar', 'Abril': 'Abr',
    'Maio': 'Mai', 'Junho': 'Jun', 'Julho': 'Jul', 'Agosto': 'Ago',
    'Setembro': 'Set', 'Outubro': 'Out', 'Novembro': 'Nov', 'Dezembro': 'Dez'
  };

  // Filtrar lojas por zona e concelho
  const filteredLojas = lojas.filter(l => 
    (filters.zona === "Portugal" || l.distrito === filters.zona) &&
    (filters.concelho === "Todos" || l.concelho === filters.concelho)
  );

  // Filtrar consultores
  const filteredConsultores = filters.consultor === "Todos"
    ? consultores
    : consultores.filter(c => c.nome === filters.consultor);

  // Lojas dentro da zona/concelho filtrada
  const lojasFiltradas = filteredLojas.map(l => l.nome);

  // Aplicar todos os filtros aos dados de stock
  const totalStock = stockData
    .filter(s => 
      lojasFiltradas.includes(s.loja) &&
      (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || s.produto === filters.produto) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === s.loja)?.distrito || ''))
    )
    .reduce((acc, s) => acc + s.quantidade, 0);

  // Filtrar reservas com todos os filtros
  const filteredReservasData = reservasData.filter(r => 
    lojasFiltradas.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
    r.ano === filters.ano
  );

  const totalReservas = filteredReservasData.reduce((acc, r) => acc + r.quantidade, 0);

  // Filtrar vendas com todos os filtros
  const filteredVendasData = vendasData.filter(r => 
    lojasFiltradas.includes(r.loja) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
    r.ano === filters.ano
  );

  const totalVendas = filteredVendasData.reduce((acc, r) => acc + r.quantidade, 0);

  // Clientes únicos filtrados
  const totalClientes = [...new Set(filteredReservasData.map(r => r.cliente))].length || 156;

  // Dados para gráficos - Evolução Mensal filtrada
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mesesCompletos = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const evolucaoMensal = mesesNomes.map((mes, idx) => {
    const mesCompleto = mesesCompletos[idx];
    const vendasMes = vendasData.filter(r => 
      lojasFiltradas.includes(r.loja) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.mes === mesCompleto &&
      r.ano === filters.ano
    ).reduce((acc, r) => acc + r.quantidade * 14.8, 0);
    
    const reservasMes = reservasData.filter(r => 
      lojasFiltradas.includes(r.loja) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.produto === "Todos" || r.produto === filters.produto) &&
      (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === r.loja)?.distrito || '')) &&
      r.mes === mesCompleto &&
      r.ano === filters.ano
    ).reduce((acc, r) => acc + r.quantidade * 12.5, 0);
    
    return {
      name: mes,
      value: Math.floor(vendasMes) || Math.floor(200000 + Math.random() * 400000),
      value2: Math.floor(reservasMes) || Math.floor(150000 + Math.random() * 300000)
    };
  });

  // Distribuição de Produtos (filtrada)
  const stockFiltrado = stockData.filter(s => 
    lojasFiltradas.includes(s.loja) &&
    (filters.consultor === "Todos" || consultores.find(c => c.nome === filters.consultor)?.distritos.includes(lojas.find(l => l.nome === s.loja)?.distrito || ''))
  );
  
  const stockPorTipo = filters.tipoProduto === "Todos" 
    ? [
        { name: 'Fertilizantes', value: stockFiltrado.filter(s => s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
        { name: 'Pesticidas', value: stockFiltrado.filter(s => s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
      ]
    : [
        { name: filters.tipoProduto, value: stockFiltrado.filter(s => s.tipoProduto === filters.tipoProduto).reduce((a, s) => a + s.quantidade, 0) }
      ];

  // Top 8 Lojas por Vendas (filtrado)
  const topLojas = filteredLojas.slice(0, 8).map(l => {
    const vendasLoja = filteredVendasData.filter(v => v.loja === l.nome).reduce((a, v) => a + v.quantidade * 14.8, 0);
    const reservasLoja = filteredReservasData.filter(r => r.loja === l.nome).reduce((a, r) => a + r.quantidade * 12.5, 0);
    return {
      name: l.nome.length > 12 ? l.nome.substring(0, 12) + '...' : l.nome,
      value: Math.floor(vendasLoja) || Math.floor(50000 + Math.random() * 150000),
      value2: Math.floor(reservasLoja) || Math.floor(40000 + Math.random() * 100000)
    };
  }).sort((a, b) => b.value - a.value);

  // Consultores filtrados por zona
  const consultoresFiltrados = filters.zona === "Portugal"
    ? consultores
    : consultores.filter(c => c.distritos.some(d => filteredLojas.some(l => l.distrito === d)));

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header - compact */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
          <div className="flex items-center gap-3">
            <img src={logoAgris} alt="Grupo Agris" className="h-8 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Visão 360º</h1>
              <p className="text-xs text-muted-foreground">Dashboard de gestão geral</p>
            </div>
          </div>
        </div>

        {/* Filters - compact */}
        <div className="px-4 py-2 bg-card border-b">
          <FilterBar showConsultor showProduto showConcelho />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid grid-cols-12 gap-3 h-full">
            {/* Left Column - KPIs in 2 columns */}
            <div className="col-span-2 grid grid-cols-2 gap-2 content-start">
              <KPICard 
                title="Total Lojas" 
                value={filteredLojas.length} 
                icon={Store}
                trend={{ value: 5.2, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Consultores" 
                value={filteredConsultores.length} 
                icon={Users}
                variant="green"
              />
              <KPICard 
                title="Clientes" 
                value={totalClientes} 
                icon={MapPin}
                trend={{ value: 8.7, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Stock" 
                value={`${totalStock.toLocaleString()} un`} 
                icon={Package}
                variant="dark"
              />
              <KPICard 
                title="Reservas" 
                value={`${totalReservas.toLocaleString()} un`} 
                icon={ShoppingCart}
                trend={{ value: 2.3, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Reservas €" 
                value={`${(totalReservas * 12.5 / 1000).toFixed(0)}k €`} 
                icon={ShoppingCart}
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
                title="Vendas €" 
                value={`${(totalVendas * 12.5 / 1000).toFixed(0)}k €`} 
                icon={TrendingUp}
                variant="green"
              />
            </div>

            {/* Center Column - Charts */}
            <div className="col-span-7 flex flex-col gap-3 h-full">
              {/* Vendas vs Reservas Chart */}
              <div className="bg-card rounded-lg border p-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Vendas vs Reservas (Mensal)</h3>
                <div className="flex-1 min-h-0">
                  <AreaChartComponent data={evolucaoMensal} height="100%" />
                </div>
              </div>

              {/* Top Lojas Chart */}
              <div className="bg-card rounded-lg border p-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Top 8 Lojas por Vendas</h3>
                <div className="flex-1 min-h-0">
                  <HorizontalBarChart data={topLojas} height="100%" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-3 flex flex-col gap-3 h-full">
              {/* Consultores por Região */}
              <div className="bg-card rounded-lg border p-3 flex-1 overflow-auto min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Consultores por Região</h3>
                <div className="space-y-0.5">
                  {consultoresFiltrados.map((c, idx) => (
                    <ConsultorItem 
                      key={c.id}
                      nome={c.nome}
                      zona={c.zona}
                      lojas={filteredLojas.filter(l => c.distritos.includes(l.distrito)).length}
                      color={getConsultorColor(idx)}
                    />
                  ))}
                </div>
              </div>

              {/* Distribuição de Produtos */}
              <div className="bg-card rounded-lg border p-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Distribuição de Produtos</h3>
                <div className="flex-1 w-full min-h-0">
                  <DonutChart data={stockPorTipo} height="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestaoPage;
