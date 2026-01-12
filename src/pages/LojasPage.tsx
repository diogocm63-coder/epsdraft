import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { AreaChartComponent, DonutChart } from '@/components/dashboard/Charts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFilters } from '@/contexts/FilterContext';
import { lojas, stockData, reservasData, vendasData, clientes, fertilizantes, pesticidas } from '@/data/mockData';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import logoAgriloja from '@/assets/logo-agriloja.png';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LojasPage = () => {
  const { filters, setFilters } = useFilters();

  // Filtrar loja específica
  const filteredLojas = filters.concelho !== "Todos"
    ? lojas.filter(l => l.concelho === filters.concelho)
    : lojas;

  const lojaNames = filteredLojas.map(l => l.nome);

  // Totais em quantidades
  const totalStock = stockData.filter(s => 
    lojaNames.includes(s.loja) &&
    (filters.tipoProduto === "Todos" || s.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || s.produto === filters.produto)
  ).reduce((a, s) => a + s.quantidade, 0);
  
  const totalReservas = reservasData.filter(r => 
    lojaNames.includes(r.loja) && 
    r.ano === filters.ano &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto)
  ).reduce((a, r) => a + r.quantidade, 0);
  
  const totalVendas = vendasData.filter(r => 
    lojaNames.includes(r.loja) && 
    r.ano === filters.ano &&
    (filters.tipoProduto === "Todos" || r.tipoProduto === filters.tipoProduto) &&
    (filters.produto === "Todos" || r.produto === filters.produto)
  ).reduce((a, r) => a + r.quantidade, 0);
  
  const clientesUnicos = [...new Set(reservasData.filter(r => lojaNames.includes(r.loja)).map(r => r.cliente))];

  // Evolução mensal
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const evolucaoMensal = mesesNomes.map((mes, idx) => {
    const base = 100000 + Math.sin(idx * 0.6) * 80000 + Math.random() * 40000;
    return {
      name: mes,
      value: Math.floor(base),
      value2: Math.floor(base * 0.7)
    };
  });

  // Inventário por Tipo (quantidades)
  const inventarioPorTipo = [
    { name: 'Fertilizantes', value: stockData.filter(s => lojaNames.includes(s.loja) && s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
    { name: 'Pesticidas', value: stockData.filter(s => lojaNames.includes(s.loja) && s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
  ];

  // Clientes com status
  const clientesData = clientes.slice(0, 8).map(c => {
    const reservas = Math.floor(500 + Math.random() * 1500);
    const vendas = Math.floor(reservas * (0.7 + Math.random() * 0.3));
    return {
      nome: c.nome,
      status: Math.random() > 0.3 ? 'ativo' : 'pendente',
      reservas,
      vendas,
      taxa: Math.floor((vendas / reservas) * 100)
    };
  });

  // Inventário por Produto (quantidades)
  const produtosInventario = [
    ...fertilizantes.slice(0, 5).map(p => ({ 
      nome: p, 
      tipo: 'Fertilizante', 
      stock: Math.floor(1000 + Math.random() * 5000)
    })),
    ...pesticidas.slice(0, 5).map(p => ({ 
      nome: p, 
      tipo: 'Pesticida', 
      stock: Math.floor(100 + Math.random() * 1500)
    }))
  ];

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <img src={logoAgriloja} alt="Agriloja" className="h-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Lojas</h1>
              <p className="text-sm text-muted-foreground">Gestão de inventário e vendas</p>
            </div>
          </div>
          <Select 
            value={filters.concelho !== "Todos" ? filters.concelho : "todas"}
            onValueChange={(v) => setFilters(prev => ({ ...prev, concelho: v === "todas" ? "Todos" : v }))}
          >
            <SelectTrigger className="w-[180px] h-9 bg-card">
              <SelectValue placeholder="Todas as lojas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as lojas</SelectItem>
              {lojas.map(l => (
                <SelectItem key={l.nome} value={l.concelho}>{l.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-card border-b">
          <FilterBar showConcelho showProduto />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column - KPIs & Inventário por Tipo */}
            <div className="col-span-3 flex flex-col gap-4 h-full">
              {/* KPIs Row */}
              <div className="grid grid-cols-2 gap-3">
                <KPICard 
                  title="Inventário" 
                  value={`${totalStock.toLocaleString()} un`} 
                  icon={Package}
                  variant="blue"
                />
                <KPICard 
                  title="Clientes" 
                  value={clientesUnicos.length > 100 ? 402 : clientesUnicos.length * 10} 
                  icon={Users}
                  variant="green"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <KPICard 
                  title="Reservas" 
                  value={`${totalReservas.toLocaleString()} un`} 
                  icon={ShoppingCart}
                  trend={{ value: 6.8, positive: true }}
                  variant="blue"
                />
                <KPICard 
                  title="Vendas" 
                  value={`${totalVendas.toLocaleString()} un`} 
                  icon={TrendingUp}
                  trend={{ value: 12.3, positive: true }}
                  variant="green"
                />
              </div>

              {/* Inventário por Tipo - Centrado */}
              <div className="bg-card rounded-xl border p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-foreground mb-2">Inventário por Tipo</h3>
                <div className="flex-1 flex items-center justify-center">
                  <DonutChart data={inventarioPorTipo} height="100%" />
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="col-span-5 flex flex-col gap-4 h-full">
              {/* Reservas vs Vendas - Maior */}
              <div className="bg-card rounded-xl border p-4 flex-[1.5] flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-foreground mb-2">Reservas vs Vendas (Evolução)</h3>
                <div className="flex-1 min-h-0">
                  <AreaChartComponent data={evolucaoMensal} height="100%" />
                </div>
              </div>

              {/* Clientes */}
              <div className="bg-card rounded-xl border p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-foreground mb-3">Clientes</h3>
                <ScrollArea className="flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b">
                        <th className="text-left py-2">Cliente</th>
                        <th className="text-right py-2">Reservas</th>
                        <th className="text-right py-2">Vendas</th>
                        <th className="text-right py-2">Taxa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesData.map((cliente, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{cliente.nome.substring(0, 18)}...</span>
                              <Badge 
                                variant={cliente.status === 'ativo' ? 'default' : 'secondary'}
                                className={`text-[10px] px-1.5 ${cliente.status === 'ativo' ? 'bg-secondary text-secondary-foreground' : 'bg-amber-500 text-white'}`}
                              >
                                {cliente.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-2 text-right text-foreground">{cliente.reservas.toLocaleString()} un</td>
                          <td className="py-2 text-right text-foreground">{cliente.vendas.toLocaleString()} un</td>
                          <td className="py-2 text-right text-secondary font-medium">{cliente.taxa}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-4 h-full">
              {/* Inventário por Produto */}
              <div className="bg-card rounded-xl border p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-foreground mb-3">Inventário por Produto</h3>
                <ScrollArea className="flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b">
                        <th className="text-left py-2">Produto</th>
                        <th className="text-left py-2">Tipo</th>
                        <th className="text-right py-2">Stock (un)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtosInventario.map((produto, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-2 text-foreground">{produto.nome.substring(0, 18)}...</td>
                          <td className="py-2">
                            <Badge 
                              variant="outline"
                              className={`text-[10px] ${produto.tipo === 'Fertilizante' ? 'border-primary text-primary' : 'border-secondary text-secondary'}`}
                            >
                              {produto.tipo}
                            </Badge>
                          </td>
                          <td className="py-2 text-right text-foreground">{produto.stock.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Resumo */}
              <div className="bg-card rounded-xl border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Resumo de Conversão</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-primary">{totalReservas.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Reservas (un)</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-secondary">{totalVendas.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Vendas (un)</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg mt-3">
                  <div className="text-2xl font-bold" style={{ color: totalVendas >= totalReservas * 0.8 ? 'hsl(122, 39%, 49%)' : 'hsl(0, 72%, 51%)' }}>
                    {((totalVendas / totalReservas) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Taxa de Conversão</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LojasPage;
