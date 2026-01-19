import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, HorizontalBarChart, DonutChart } from '@/components/dashboard/Charts';
import { ConsultorItem, getConsultorColor } from '@/components/dashboard/ConsultorItem';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilteredData } from '@/hooks/useFilteredData';
import { Store, Users, MapPin, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import logoAgris from '@/assets/logo-grupo-agris.png';
const GestaoPage = () => {
  const {
    filteredLojas,
    filteredConsultores,
    totalStock,
    totalReservas,
    totalVendas,
    clientesUnicos,
    evolucaoMensal,
    stockPorTipo,
    topLojas,
    consultoresComLojas
  } = useFilteredData();
  const totalClientes = clientesUnicos.length > 0 ? clientesUnicos.length : 156;
  return <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header - compact */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
          <div className="flex items-center gap-3">
            <img src={logoAgris} alt="Grupo Agris" className="h-8 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Geral</h1>
              <p className="text-xs text-muted-foreground">Dashboard de gestão geral</p>
            </div>
          </div>
        </div>

        {/* Filters - compact */}
        <div className="px-4 py-2 bg-card border-b">
          <FilterBar showConsultor showProduto showConcelho showCliente />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid grid-cols-12 gap-3 h-full">
            {/* Left Column - KPIs in 2 columns */}
            <div className="col-span-2 grid grid-cols-2 gap-2 content-start">
              <KPICard title="Total Lojas" value={filteredLojas.length} icon={Store} trend={{
              value: 5.2,
              positive: true
            }} variant="blue" />
              <KPICard title="Consultores" value={filteredConsultores.length} icon={Users} variant="green" />
              <KPICard title="Clientes" value={totalClientes} icon={MapPin} trend={{
              value: 8.7,
              positive: true
            }} variant="blue" />
              <KPICard title="Stock" value={`${totalStock.toLocaleString()} un`} icon={Package} variant="dark" />
              <KPICard title="Encomendas" value={`${totalReservas.toLocaleString()} un`} icon={ShoppingCart} trend={{
              value: 2.3,
              positive: true
            }} variant="blue" />
              <KPICard title="Encomendas €" value={`${(totalReservas * 12.5 / 1000).toFixed(0)}k €`} icon={ShoppingCart} variant="blue" />
              <KPICard title="Vendas" value={`${totalVendas.toLocaleString()} un`} icon={TrendingUp} trend={{
              value: 12.4,
              positive: true
            }} variant="green" />
              <KPICard title="Vendas €" value={`${(totalVendas * 12.5 / 1000).toFixed(0)}k €`} icon={TrendingUp} variant="green" />
            </div>

            {/* Center Column - Charts */}
            <div className="col-span-7 flex flex-col gap-3 h-full">
              {/* Vendas vs Reservas Chart */}
              <div className="bg-card rounded-lg border p-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Vendas vs Encomendas (Mensal)</h3>
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
            <div className="col-span-3 flex flex-col gap-2 h-full">
              {/* Resumo de Conversão */}
              <div className="bg-card rounded-lg border p-2 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Resumo de Conversão</h3>
                <div className="grid grid-cols-4 gap-1 w-full">
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-xs font-bold text-primary">{totalReservas.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground">Encomendas</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-xs font-bold text-secondary">{totalVendas.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground">Vendas</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-xs font-bold" style={{ color: totalVendas >= totalReservas * 0.8 ? 'hsl(122, 39%, 49%)' : 'hsl(0, 72%, 51%)' }}>
                      {((totalVendas / totalReservas) * 100 || 0).toFixed(0)}%
                    </div>
                    <div className="text-[9px] text-muted-foreground">Taxa</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-xs font-bold text-foreground">{Math.floor(totalReservas * 0.12)}</div>
                    <div className="text-[9px] text-muted-foreground">Rec. Técnicas</div>
                  </div>
                </div>
              </div>
              {/* Consultores por Região */}
              <div className="bg-card rounded-lg border p-3 flex-1 overflow-auto min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Consultores por Região</h3>
                <div className="space-y-0.5">
                  {consultoresComLojas.map((c, idx) => <ConsultorItem key={c.id} nome={c.nome} zona={c.zona} lojas={c.lojasAtribuidas} color={getConsultorColor(idx)} />)}
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
    </DashboardLayout>;
};
export default GestaoPage;