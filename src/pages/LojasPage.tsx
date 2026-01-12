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
    : filters.zona === "Portugal" 
      ? lojas 
      : lojas.filter(l => l.distrito === filters.zona);

  const lojaNames = filteredLojas.map(l => l.nome);

  // Totais
  const totalStock = stockData.filter(s => lojaNames.includes(s.loja)).reduce((a, s) => a + s.quantidade, 0);
  const totalReservas = reservasData.filter(r => lojaNames.includes(r.loja) && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0);
  const totalVendas = vendasData.filter(r => lojaNames.includes(r.loja) && r.ano === filters.ano).reduce((a, r) => a + r.quantidade, 0);
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

  // Inventário por Tipo
  const inventarioPorTipo = [
    { name: 'Fertilizantes', value: stockData.filter(s => lojaNames.includes(s.loja) && s.tipoProduto === 'Fertilizantes').reduce((a, s) => a + s.quantidade, 0) },
    { name: 'Pesticidas', value: stockData.filter(s => lojaNames.includes(s.loja) && s.tipoProduto === 'Pesticidas').reduce((a, s) => a + s.quantidade, 0) }
  ];

  // Clientes com status
  const clientesData = clientes.slice(0, 5).map(c => {
    const reservas = Math.floor(5000 + Math.random() * 15000);
    const vendas = Math.floor(reservas * (0.7 + Math.random() * 0.3));
    return {
      nome: c.nome,
      status: Math.random() > 0.3 ? 'ativo' : 'pendente',
      reservas,
      vendas,
      taxa: Math.floor((vendas / reservas) * 100)
    };
  });

  // Inventário por Produto
  const produtosInventario = [
    ...fertilizantes.slice(0, 3).map(p => ({ nome: p, tipo: 'Fertilizante', stock: `${Math.floor(1000 + Math.random() * 5000)} kg` })),
    ...pesticidas.slice(0, 3).map(p => ({ nome: p, tipo: 'Pesticida', stock: `${Math.floor(100 + Math.random() * 1500)} L` }))
  ];

  // Reservas Ativas
  const reservasAtivas = clientes.slice(0, 4).map(c => ({
    nome: c.nome,
    produtos: Math.floor(2 + Math.random() * 5),
    data: `${Math.floor(10 + Math.random() * 20)} Jan`,
    valor: Math.floor(2000 + Math.random() * 8000)
  }));

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
          <FilterBar showConcelho />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column - KPIs & Inventário */}
            <div className="col-span-3 flex flex-col gap-4">
              {/* KPIs Row */}
              <div className="grid grid-cols-2 gap-3">
                <KPICard 
                  title="Inventário Total" 
                  value={`€${Math.floor(totalStock * 1.5 / 1000)}K`} 
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
                  value={`€${Math.floor(totalReservas * 20 / 1000)}K`} 
                  icon={ShoppingCart}
                  trend={{ value: 6.8, positive: true }}
                  variant="blue"
                />
                <KPICard 
                  title="Vendas" 
                  value={`€${Math.floor(totalVendas * 28 / 1000)}K`} 
                  icon={TrendingUp}
                  trend={{ value: 12.3, positive: true }}
                  variant="blue"
                />
              </div>

              {/* Inventário por Tipo */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Inventário por Tipo</h3>
                <DonutChart data={inventarioPorTipo} height={220} />
              </div>
            </div>

            {/* Center Column */}
            <div className="col-span-5 flex flex-col gap-4">
              {/* Reservas vs Vendas */}
              <div className="bg-card rounded-xl border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Reservas vs Vendas (Evolução)</h3>
                <AreaChartComponent data={evolucaoMensal} height={180} />
              </div>

              {/* Clientes */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Clientes</h3>
                <ScrollArea className="h-[180px]">
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
                          <td className="py-2 text-right text-foreground">€{cliente.reservas.toLocaleString()}</td>
                          <td className="py-2 text-right text-foreground">€{cliente.vendas.toLocaleString()}</td>
                          <td className="py-2 text-right text-secondary font-medium">{cliente.taxa}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-4">
              {/* Inventário por Produto */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Inventário por Produto</h3>
                <ScrollArea className="h-[180px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b">
                        <th className="text-left py-2">Produto</th>
                        <th className="text-left py-2">Tipo</th>
                        <th className="text-right py-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtosInventario.map((produto, idx) => (
                        <tr key={idx} className="border-b border-muted/30">
                          <td className="py-2 text-foreground">{produto.nome.substring(0, 15)}...</td>
                          <td className="py-2">
                            <Badge 
                              variant="outline"
                              className={`text-[10px] ${produto.tipo === 'Fertilizante' ? 'border-primary text-primary' : 'border-secondary text-secondary'}`}
                            >
                              {produto.tipo}
                            </Badge>
                          </td>
                          <td className="py-2 text-right text-foreground">{produto.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Reservas Ativas */}
              <div className="bg-card rounded-xl border p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Reservas Ativas</h3>
                <div className="space-y-2">
                  {reservasAtivas.map((reserva, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-muted/30 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-foreground">{reserva.nome.substring(0, 20)}</div>
                        <div className="text-xs text-muted-foreground">{reserva.produtos} produtos</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{reserva.data}</div>
                        <div className="text-sm font-semibold text-primary">€{reserva.valor.toLocaleString()}</div>
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

export default LojasPage;
