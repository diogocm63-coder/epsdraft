import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, GroupedBarChart } from '@/components/dashboard/Charts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilteredData } from '@/hooks/useFilteredData';
import { Store, Package, ShoppingCart, TrendingUp, MapPin, Scale } from 'lucide-react';
import logoAgripro from '@/assets/logo-agripro.png';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConsultoresPage = () => {
  const {
    filteredLojas,
    totalStock,
    totalReservas,
    totalVendas,
    evolucaoMensal,
    stockPorLoja,
    resumoClientes,
    custosPorCultura
  } = useFilteredData();

  const totalHectares = 34086;
  const totalKg = 791;

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
                title="Encomendas" 
                value={`${(totalReservas/1000).toFixed(0)}K`} 
                icon={ShoppingCart}
                variant="blue"
              />
              <KPICard 
                title="Encomendas €" 
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
              {/* Encomendas vs Vendas */}
              <div className="bg-card rounded-lg border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Encomendas vs Vendas (Evolução)</h3>
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
                  {resumoClientes.slice(0, 3).map((cliente, idx) => (
                    <div key={idx} className="bg-muted/30 rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-[10px] text-foreground">{cliente.nome}</span>
                        <span className="text-[9px] text-muted-foreground">{cliente.cultura}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                          <div className="text-[8px] text-muted-foreground">Encomendas</div>
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

              {/* Resumo de Conversão */}
              <div className="bg-card rounded-lg border p-2 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Resumo de Conversão</h3>
                <div className="grid grid-cols-4 gap-1 w-full">
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-[10px] font-bold text-primary">{totalReservas.toLocaleString()}</div>
                    <div className="text-[8px] text-muted-foreground">Encomendas</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-[10px] font-bold text-secondary">{totalVendas.toLocaleString()}</div>
                    <div className="text-[8px] text-muted-foreground">Vendas</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-[10px] font-bold" style={{ color: totalVendas >= totalReservas * 0.8 ? 'hsl(122, 39%, 49%)' : 'hsl(0, 72%, 51%)' }}>
                      {((totalVendas / totalReservas) * 100 || 0).toFixed(0)}%
                    </div>
                    <div className="text-[8px] text-muted-foreground">Taxa</div>
                  </div>
                  <div className="text-center p-1 bg-muted/30 rounded">
                    <div className="text-[10px] font-bold text-foreground">{Math.floor(totalReservas * 0.12)}</div>
                    <div className="text-[8px] text-muted-foreground">Rec. Técnicas</div>
                  </div>
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
