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
        {/* Header Compacto */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
          <div className="flex items-center gap-3">
            <img src={logoAgriloja} alt="Agriloja" className="h-6 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Lojas</h1>
              <p className="text-xs text-muted-foreground">Gestão de inventário e vendas</p>
            </div>
          </div>
          <Select 
            value={filters.concelho !== "Todos" ? filters.concelho : "todas"}
            onValueChange={(v) => setFilters(prev => ({ ...prev, concelho: v === "todas" ? "Todos" : v }))}
          >
            <SelectTrigger className="w-[160px] h-8 bg-card text-sm">
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

        {/* Filters Compacto */}
        <div className="px-4 py-2 bg-card border-b">
          <FilterBar showProduto hideDistrito />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 h-full">
            {/* Left Column - KPIs em grid 2x3 + Inventário por Tipo */}
            <div className="col-span-2 flex flex-col gap-2 h-full">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                      <Package className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{totalStock.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Inventário</div>
                </div>
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                      <Users className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{clientesUnicos.length > 100 ? 402 : clientesUnicos.length * 10}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Clientes</div>
                </div>
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                      <ShoppingCart className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{totalReservas.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Reservas (un)</div>
                </div>
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                      <ShoppingCart className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{(totalReservas * 12.5 / 1000).toFixed(0)}k€</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Reservas (€)</div>
                </div>
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{totalVendas.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Vendas (un)</div>
                </div>
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{(totalVendas * 14.8 / 1000).toFixed(0)}k€</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Vendas (€)</div>
                </div>
              </div>

              {/* Inventário por Tipo */}
              <div className="bg-card rounded-xl border p-2 h-[120px] flex flex-col">
                <h3 className="text-xs font-semibold text-foreground mb-1">Inventário por Tipo</h3>
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <DonutChart data={inventarioPorTipo} height="100%" />
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="col-span-6 flex flex-col gap-2 h-full">
              {/* Reservas vs Vendas */}
              <div className="bg-card rounded-xl border p-2 flex-[1.2] flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Reservas vs Vendas (Evolução)</h3>
                <div className="flex-1 min-h-0">
                  <AreaChartComponent data={evolucaoMensal} height="100%" />
                </div>
              </div>

              {/* Clientes */}
              <div className="bg-card rounded-xl border p-2 flex-1 flex flex-col min-h-0 overflow-hidden">
                <h3 className="text-xs font-semibold text-foreground mb-1">Clientes</h3>
                <div className="flex-1 min-h-0 overflow-auto">
                  <table className="w-full text-[10px]">
                    <thead className="sticky top-0 bg-card">
                      <tr className="text-muted-foreground border-b">
                        <th className="text-left py-1">Cliente</th>
                        <th className="text-right py-1">Reservas</th>
                        <th className="text-right py-1">Vendas</th>
                        <th className="text-right py-1">Taxa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesData.map((cliente, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-1">
                            <div className="flex items-center gap-1">
                              <span className="text-foreground">{cliente.nome.substring(0, 12)}...</span>
                              <Badge 
                                variant={cliente.status === 'ativo' ? 'default' : 'secondary'}
                                className={`text-[8px] px-1 py-0 ${cliente.status === 'ativo' ? 'bg-secondary text-secondary-foreground' : 'bg-amber-500 text-white'}`}
                              >
                                {cliente.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-1 text-right text-foreground">{cliente.reservas.toLocaleString()}</td>
                          <td className="py-1 text-right text-foreground">{cliente.vendas.toLocaleString()}</td>
                          <td className="py-1 text-right text-secondary font-medium">{cliente.taxa}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-2 h-full">
              {/* Inventário por Produto */}
              <div className="bg-card rounded-xl border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Inventário por Produto</h3>
                <ScrollArea className="flex-1">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-muted-foreground border-b">
                        <th className="text-left py-0.5">Produto</th>
                        <th className="text-left py-0.5">Tipo</th>
                        <th className="text-right py-0.5">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtosInventario.slice(0, 4).map((produto, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-0.5 text-foreground">{produto.nome.substring(0, 12)}...</td>
                          <td className="py-0.5">
                            <Badge 
                              variant="outline"
                              className={`text-[8px] px-1 py-0 ${produto.tipo === 'Fertilizante' ? 'border-primary text-primary' : 'border-secondary text-secondary'}`}
                            >
                              {produto.tipo}
                            </Badge>
                          </td>
                          <td className="py-0.5 text-right text-foreground">{produto.stock.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Resumo por Cliente */}
              <div className="bg-card rounded-xl border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Resumo por Cliente</h3>
                <ScrollArea className="flex-1">
                  <div className="space-y-1.5">
                    {clientes.slice(0, 3).map((cliente, idx) => {
                      const reservas = Math.floor(5000 + Math.random() * 3000);
                      const vendas = Math.floor(reservas * (0.7 + Math.random() * 0.25));
                      return (
                        <div key={idx} className="bg-muted/30 rounded p-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-[10px] text-foreground">{cliente.nome.substring(0, 18)}</span>
                            <span className="text-[9px] text-muted-foreground">{cliente.tipo}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-center mt-1">
                            <div>
                              <div className="text-[8px] text-muted-foreground">Reservas</div>
                              <div className="font-semibold text-[10px] text-primary">{reservas.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-muted-foreground">Vendas</div>
                              <div className="font-semibold text-[10px] text-secondary">{vendas.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-muted-foreground">Taxa</div>
                              <div className="font-semibold text-[10px] text-foreground">{Math.floor((vendas / reservas) * 100)}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Resumo de Conversão */}
              <div className="bg-card rounded-xl border p-2 flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-foreground mb-1">Resumo de Conversão</h3>
                <div className="flex-1 flex items-center">
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    <div className="text-center p-1.5 bg-muted/30 rounded">
                      <div className="text-xs font-bold text-primary">{totalReservas.toLocaleString()}</div>
                      <div className="text-[8px] text-muted-foreground">Reservas</div>
                    </div>
                    <div className="text-center p-1.5 bg-muted/30 rounded">
                      <div className="text-xs font-bold text-secondary">{totalVendas.toLocaleString()}</div>
                      <div className="text-[8px] text-muted-foreground">Vendas</div>
                    </div>
                    <div className="text-center p-1.5 bg-muted/30 rounded">
                      <div className="text-xs font-bold" style={{ color: totalVendas >= totalReservas * 0.8 ? 'hsl(122, 39%, 49%)' : 'hsl(0, 72%, 51%)' }}>
                        {((totalVendas / totalReservas) * 100 || 0).toFixed(0)}%
                      </div>
                      <div className="text-[8px] text-muted-foreground">Taxa</div>
                    </div>
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

export default LojasPage;
