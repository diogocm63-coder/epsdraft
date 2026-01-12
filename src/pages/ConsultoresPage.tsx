import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, GroupedBarChart } from '@/components/dashboard/Charts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, consultores, stockData, reservasData, vendasData, clientes } from '@/data/mockData';
import { Store, Package, ShoppingCart, Euro, MapPin, Scale } from 'lucide-react';
import logoAgripro from '@/assets/logo-agripro.png';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConsultoresPage = () => {
  const { filters } = useFilters();

  // Filtrar lojas por zona
  const filteredLojas = filters.zona === "Portugal" 
    ? lojas 
    : lojas.filter(l => l.distrito === filters.zona);

  // Totais
  const totalStock = stockData.filter(s => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === s.loja)?.distrito === filters.zona)
  ).reduce((a, s) => a + s.quantidade, 0);

  const totalReservas = reservasData.filter(r => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
    r.ano === filters.ano
  ).reduce((a, r) => a + r.quantidade, 0);

  const totalVendas = vendasData.filter(r => 
    (filters.zona === "Portugal" || lojas.find(l => l.nome === r.loja)?.distrito === filters.zona) &&
    r.ano === filters.ano
  ).reduce((a, r) => a + r.quantidade, 0);

  // Evolução mensal
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const evolucaoMensal = mesesNomes.map((mes, idx) => {
    const base = 150000 + Math.sin(idx * 0.8) * 100000 + Math.random() * 50000;
    return {
      name: mes,
      value: Math.floor(base * 0.8),
      value2: Math.floor(base)
    };
  });

  // Custos Previstos vs Reais
  const custosMensais = mesesNomes.map(mes => ({
    name: mes,
    value: Math.floor(60000 + Math.random() * 60000),
    value2: Math.floor(70000 + Math.random() * 70000)
  }));

  // Stock por Loja
  const stockPorLoja = filteredLojas.slice(0, 10).map(l => {
    const consultor = consultores.find(c => c.distritos.includes(l.distrito));
    return {
      loja: l.nome,
      consultor: consultor?.nome.split(' ')[0] || '-',
      stock: Math.floor(10000 + Math.random() * 40000)
    };
  });

  // Resumo por Cliente
  const resumoClientes = clientes.slice(0, 3).map(c => ({
    nome: c.nome,
    reservas: Math.floor(8000 + Math.random() * 5000),
    hectares: Math.floor(100 + Math.random() * 400),
    kg: Math.floor(10000 + Math.random() * 30000)
  }));

  const totalHectares = 34086;
  const totalKg = 791;

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <img src={logoAgripro} alt="Agripro" className="h-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Consultores</h1>
              <p className="text-sm text-muted-foreground">Análise de performance e gestão</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-card border-b">
          <FilterBar showConsultor />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column - KPIs */}
            <div className="col-span-2 flex flex-col gap-3">
              <KPICard 
                title="Lojas na Zona" 
                value={filteredLojas.length} 
                icon={Store}
                variant="blue"
              />
              <KPICard 
                title="Stock Total" 
                value={`€${Math.floor(totalStock * 1.2 / 1000)}K`} 
                icon={Package}
                variant="green"
              />
              <KPICard 
                title="Reservas" 
                value={`€${Math.floor(totalReservas * 12 / 1000)}K`} 
                icon={ShoppingCart}
                trend={{ value: 4.2, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Vendas" 
                value={`€${Math.floor(totalVendas * 12 / 1000)}K`} 
                icon={Euro}
                trend={{ value: 8.5, positive: true }}
                variant="blue"
              />
              <KPICard 
                title="Hectares" 
                value={totalHectares.toLocaleString()} 
                icon={MapPin}
                variant="blue"
              />
              <KPICard 
                title="Kg Totais" 
                value={`${totalKg}t`} 
                icon={Scale}
                variant="dark"
              />
            </div>

            {/* Center Column - Charts */}
            <div className="col-span-6 flex flex-col gap-4">
              {/* Reservas vs Vendas */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-4">Reservas vs Vendas (Evolução)</h3>
                <AreaChartComponent data={evolucaoMensal} height={170} />
              </div>

              {/* Custos Previstos vs Reais */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-4">Custos: Previstos vs Reais</h3>
                <GroupedBarChart data={custosMensais} height={170} />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-4">
              {/* Stock por Loja */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Stock por Loja</h3>
                <ScrollArea className="h-[180px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b">
                        <th className="text-left py-2">Loja</th>
                        <th className="text-left py-2">Consultor</th>
                        <th className="text-right py-2">Stock (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockPorLoja.map((row, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-2 text-foreground">{row.loja}</td>
                          <td className="py-2 text-primary">{row.consultor}</td>
                          <td className="py-2 text-right text-foreground">{row.stock.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Resumo por Cliente */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Resumo por Cliente</h3>
                <div className="space-y-3">
                  {resumoClientes.map((cliente, idx) => (
                    <div key={idx} className="bg-muted/30 rounded-lg p-3">
                      <div className="font-medium text-sm text-foreground mb-2">{cliente.nome}</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Reservas</div>
                          <div className="font-semibold text-primary">€{cliente.reservas.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Hectares</div>
                          <div className="font-semibold text-foreground">{cliente.hectares}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Kg</div>
                          <div className="font-semibold text-foreground">{cliente.kg.toLocaleString()}</div>
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
