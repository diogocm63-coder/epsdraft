import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { MiniBarChart, MiniLineChart } from '@/components/dashboard/MiniChart';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, consultores, stockData, reservasData, vendasData, custosData, clientes } from '@/data/mockData';
import { Store, Package, TrendingUp, DollarSign, Users, MapPin } from 'lucide-react';
import logoAgripro from '@/assets/logo-agripro.png';

const ConsultoresPage = () => {
  const { filters } = useFilters();

  // Filtrar lojas por zona
  const filteredLojas = filters.zona === "Portugal" 
    ? lojas 
    : lojas.filter(l => l.distrito === filters.zona);

  // Filtrar stock
  const filteredStock = stockData.filter(s => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === s.loja)?.distrito === filters.zona) &&
    (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || s.produto === filters.produto)
  );

  // Filtrar reservas
  const filteredReservas = reservasData.filter(r => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    r.ano === filters.ano
  );

  const filteredVendas = vendasData.filter(r => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.mes === "Todos" || r.mes === filters.mes) &&
    r.ano === filters.ano
  );

  const totalStock = filteredStock.reduce((a, s) => a + s.quantidade, 0);
  const totalReservas = filteredReservas.reduce((a, r) => a + r.quantidade, 0);
  const totalVendas = filteredVendas.reduce((a, r) => a + r.quantidade, 0);

  // Stock por loja
  const stockPorLoja = filteredLojas.slice(0, 6).map(l => ({
    name: l.nome.substring(0, 8),
    value: filteredStock.filter(s => s.loja === l.nome).reduce((a, s) => a + s.quantidade, 0)
  }));

  // Reservas por cliente
  const reservasPorCliente = clientes.slice(0, 5).map(c => ({
    cliente: c.nome.substring(0, 20),
    tipo: c.tipo,
    reservas: filteredReservas.filter(r => r.cliente === c.nome).reduce((a, r) => a + r.quantidade, 0)
  }));

  // Reservas vs Vendas evolução
  const evolucaoMensal = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((mes, idx) => {
    const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'][idx];
    return {
      name: mes,
      value: reservasData.filter(r => r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0),
      value2: vendasData.filter(r => r.mes === mesNome && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0)
    };
  });

  // Custos por cliente
  const custosCliente = custosData
    .filter(c => c.ano === filters.ano)
    .slice(0, 5)
    .map(c => ({
      cliente: c.cliente.substring(0, 18),
      cultura: c.tipoCultura,
      previsto: `${c.custoPrevisto}€/kg`,
      real: `${c.custoReal}€/kg`,
      diff: c.custoReal - c.custoPrevisto > 0 ? `+${c.custoReal - c.custoPrevisto}€` : `${c.custoReal - c.custoPrevisto}€`
    }));

  // Totais custos
  const totalCustoPrevisto = custosData.filter(c => c.ano === filters.ano).reduce((a, c) => a + c.custoPrevisto, 0);
  const totalCustoReal = custosData.filter(c => c.ano === filters.ano).reduce((a, c) => a + c.custoReal, 0);

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="page-header" style={{ borderLeft: '4px solid hsl(80, 45%, 45%)' }}>
          <div className="flex items-center gap-4">
            <img src={logoAgripro} alt="Agripro" className="h-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Consultores</h1>
              <p className="text-sm text-muted-foreground">Gestão de Zonas e Clientes</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pt-4">
          <FilterBar />
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-3 gap-4 overflow-hidden">
          {/* KPI Cards - Row 1 */}
          <StatCard 
            title="Lojas na Zona" 
            value={filteredLojas.length} 
            subtitle="Zona de influência"
            icon={Store}
            variant="primary"
          />
          <StatCard 
            title="Stock Total" 
            value={totalStock.toLocaleString()} 
            subtitle="Unidades"
            icon={Package}
            variant="secondary"
          />
          <StatCard 
            title="Reservas" 
            value={totalReservas.toLocaleString()} 
            subtitle="Unidades"
            icon={TrendingUp}
            variant="accent"
          />
          <StatCard 
            title="Vendas" 
            value={totalVendas.toLocaleString()} 
            subtitle="Unidades"
            icon={DollarSign}
            trend={{ value: ((totalVendas/totalReservas)*100 - 100).toFixed(0) as unknown as number, positive: totalVendas >= totalReservas * 0.8 }}
            variant="primary"
          />

          {/* Row 2 */}
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Stock por Loja</h3>
            <MiniBarChart data={stockPorLoja} height={120} />
          </div>
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Reservas por Cliente</h3>
            <DataTable 
              columns={[
                { key: 'cliente', header: 'Cliente' },
                { key: 'tipo', header: 'Cultura' },
                { key: 'reservas', header: 'Qtd', align: 'right' }
              ]}
              data={reservasPorCliente}
              maxHeight="120px"
            />
          </div>

          {/* Row 3 */}
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Reservas vs Vendas (Evolução)</h3>
            <MiniLineChart data={evolucaoMensal} height={120} />
          </div>
          <div className="col-span-2 dashboard-card">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Custos por Cliente (€/kg)</h3>
            <div className="flex gap-4 mb-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Total Previsto: </span>
                <span className="font-semibold">{(totalCustoPrevisto / custosData.filter(c => c.ano === filters.ano).length).toFixed(0)}€/kg</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Total Real: </span>
                <span className="font-semibold">{(totalCustoReal / custosData.filter(c => c.ano === filters.ano).length).toFixed(0)}€/kg</span>
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'cliente', header: 'Cliente' },
                { key: 'cultura', header: 'Cultura' },
                { key: 'previsto', header: 'Previsto', align: 'right' },
                { key: 'real', header: 'Real', align: 'right' },
                { key: 'diff', header: 'Dif.', align: 'right' }
              ]}
              data={custosCliente}
              maxHeight="90px"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConsultoresPage;
