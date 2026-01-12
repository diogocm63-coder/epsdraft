import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { MiniBarChart, MiniPieChart } from '@/components/dashboard/MiniChart';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, consultores, stockData, reservasData, vendasData } from '@/data/mockData';
import { Store, Users, Package, TrendingUp, Boxes, ShoppingCart } from 'lucide-react';
import logoAgris from '@/assets/logo-grupo-agris.png';

const GestaoPage = () => {
  const { filters } = useFilters();

  // Filtrar dados baseado nos filtros
  const filteredLojas = filters.zona === "Portugal" 
    ? lojas 
    : lojas.filter(l => l.distrito === filters.zona);

  const filteredConsultores = filters.consultor === "Todos"
    ? consultores
    : consultores.filter(c => c.nome === filters.consultor);

  const totalStock = stockData
    .filter(s => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === s.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto)
    )
    .reduce((acc, s) => acc + s.quantidade, 0);

  const totalReservas = reservasData
    .filter(r => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.mes === "Todos" || r.mes === filters.mes) &&
      r.ano === filters.ano
    )
    .reduce((acc, r) => acc + r.quantidade, 0);

  const totalVendas = vendasData
    .filter(r => 
      (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
      (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
      (filters.mes === "Todos" || r.mes === filters.mes) &&
      r.ano === filters.ano
    )
    .reduce((acc, r) => acc + r.quantidade, 0);

  // Dados para tabelas
  const lojasTableData = filteredLojas.slice(0, 10).map(l => ({
    loja: l.nome,
    distrito: l.distrito,
    stock: stockData.filter(s => s.loja === l.nome).reduce((a, s) => a + s.quantidade, 0).toLocaleString()
  }));

  const consultoresTableData = filteredConsultores.map(c => ({
    nome: c.nome,
    zona: c.zona,
    lojas: lojas.filter(l => c.distritos.includes(l.distrito)).length
  }));

  // Dados para gráficos
  const stockPorTipo = [
    { name: 'Fertilizantes', value: stockData.filter(s => s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
    { name: 'Pesticidas', value: stockData.filter(s => s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
  ];

  const vendasPorMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((mes, idx) => {
    const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'][idx];
    return {
      name: mes,
      value: reservasData.filter(r => r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0),
      value2: vendasData.filter(r => r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0)
    };
  });

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-4">
            <img src={logoAgris} alt="Grupo Agris" className="h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Visão 360º</h1>
              <p className="text-sm text-muted-foreground">Dashboard de Gestão</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pt-4">
          <FilterBar showConsultor />
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-3 gap-4 overflow-hidden">
          {/* KPI Cards - Row 1 */}
          <StatCard 
            title="Total Lojas" 
            value={filteredLojas.length} 
            subtitle="Rede nacional"
            icon={Store}
            variant="primary"
          />
          <StatCard 
            title="Consultores" 
            value={filteredConsultores.length} 
            subtitle="Equipa comercial"
            icon={Users}
            variant="secondary"
          />
          <StatCard 
            title="Stock Total" 
            value={totalStock.toLocaleString()} 
            subtitle="Unidades"
            icon={Boxes}
            variant="accent"
          />
          <StatCard 
            title="Reservas" 
            value={totalReservas.toLocaleString()} 
            subtitle={`${filters.ano}`}
            icon={ShoppingCart}
            trend={{ value: 12, positive: true }}
            variant="primary"
          />

          {/* Tables - Row 2 */}
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Lojas por Zona</h3>
            <DataTable 
              columns={[
                { key: 'loja', header: 'Loja' },
                { key: 'distrito', header: 'Distrito' },
                { key: 'stock', header: 'Stock', align: 'right' }
              ]}
              data={lojasTableData}
              maxHeight="140px"
            />
          </div>
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Consultores</h3>
            <DataTable 
              columns={[
                { key: 'nome', header: 'Nome' },
                { key: 'zona', header: 'Zona' },
                { key: 'lojas', header: 'Lojas', align: 'right' }
              ]}
              data={consultoresTableData}
              maxHeight="140px"
            />
          </div>

          {/* Charts - Row 3 */}
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Reservas vs Vendas (Mensal)</h3>
            <MiniBarChart data={vendasPorMes} height={120} showLegend />
          </div>
          <div className="dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Stock por Tipo</h3>
            <MiniPieChart data={stockPorTipo} height={120} />
          </div>
          <div className="dashboard-card flex flex-col justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{((totalVendas / totalReservas) * 100 || 0).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground mt-1">Taxa de Conversão</div>
              <div className="text-xs text-muted-foreground">Vendas / Reservas</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestaoPage;
