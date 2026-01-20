import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data
const chartData = [
  { name: '2024-10', vendas: 15000, orcamento: 18000 },
  { name: '2024-11', vendas: 22000, orcamento: 20000 },
  { name: '2024-12', vendas: 28000, orcamento: 25000 },
  { name: '2025-01', vendas: 18000, orcamento: 22000 },
  { name: '2025-02', vendas: 24000, orcamento: 26000 },
  { name: '2025-03', vendas: 32000, orcamento: 30000 },
  { name: '2025-04', vendas: 28000, orcamento: 28000 },
  { name: '2025-05', vendas: 35000, orcamento: 32000 },
  { name: '2025-06', vendas: 42000, orcamento: 38000 },
  { name: '2025-07', vendas: 38000, orcamento: 40000 },
  { name: '2025-08', vendas: 45000, orcamento: 42000 },
  { name: '2025-09', vendas: 48000, orcamento: 45000 },
];

const monthlyData = [
  { mes: 'Janeiro', vendas: '8.234,50 €', orcamento: '9.000,00 €', desvio: '-8,5%' },
  { mes: 'Fevereiro', vendas: '7.890,00 €', orcamento: '8.500,00 €', desvio: '-7,2%' },
  { mes: 'Março', vendas: '12.456,75 €', orcamento: '11.000,00 €', desvio: '+13,2%' },
  { mes: 'Abril', vendas: '9.123,00 €', orcamento: '9.500,00 €', desvio: '-4,0%' },
  { mes: 'Maio', vendas: '11.567,25 €', orcamento: '10.000,00 €', desvio: '+15,7%' },
  { mes: 'Junho', vendas: '13.789,50 €', orcamento: '12.500,00 €', desvio: '+10,3%' },
  { mes: 'Julho', vendas: '10.234,00 €', orcamento: '11.000,00 €', desvio: '-7,0%' },
  { mes: 'Agosto', vendas: '8.567,75 €', orcamento: '9.000,00 €', desvio: '-4,8%' },
  { mes: 'Setembro', vendas: '14.890,00 €', orcamento: '13.000,00 €', desvio: '+14,5%' },
  { mes: 'Outubro', vendas: '16.123,25 €', orcamento: '15.000,00 €', desvio: '+7,5%' },
  { mes: 'Novembro', vendas: '12.456,50 €', orcamento: '12.000,00 €', desvio: '+3,8%' },
  { mes: 'Dezembro', vendas: '18.789,00 €', orcamento: '17.500,00 €', desvio: '+7,4%' },
];

const vendasFamiliaData = [
  { familia: 'Vinhos Tintos', valor: 45000 },
  { familia: 'Vinhos Brancos', valor: 32000 },
  { familia: 'Espumantes', valor: 18000 },
  { familia: 'Rosés', valor: 12000 },
  { familia: 'Fortificados', valor: 8000 },
];

const canalData = [
  { canal: 'Retalho', valor: '42.500 €' },
  { canal: 'Horeca', valor: '28.350 €' },
  { canal: 'Distribuição', valor: '18.920 €' },
  { canal: 'E-commerce', valor: '12.180 €' },
];

const topClientesData = [
  { cliente: 'Supermercado Central', valor: '15.670 €' },
  { cliente: 'Restaurante Gourmet', valor: '12.340 €' },
  { cliente: 'Loja de Vinhos Premium', valor: '9.870 €' },
  { cliente: 'Hotel Lisboa', valor: '8.540 €' },
  { cliente: 'Cave do Vinho', valor: '7.230 €' },
];

const VisaoGeralVendasPage = () => {
  const [year, setYear] = useState('2025');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Visão Geral das Vendas</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mês</span>
                  <Select defaultValue="tudo">
                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tudo">Tudo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ano</span>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas Ano-1</div>
                <div className="text-2xl font-bold">57.950 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas Ano</div>
                <div className="text-2xl font-bold">144.121 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas Mês</div>
                <div className="text-2xl font-bold">18.789 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Orçamento Ano</div>
                <div className="text-2xl font-bold">148.000 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas vs Orçamento</div>
                <div className="text-2xl font-bold text-red-600">-2,6%</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Main Chart */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Evolução de Vendas nos Últimos 12 Meses</h3>
                <div className="flex items-center gap-4 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded-full"></span> Vendas</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Orçamento</span>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="vendas" stroke="hsl(345, 70%, 32%)" fill="hsl(345, 70%, 32%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="orcamento" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Distribuição por Família */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Distribuição de Vendas por Família</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={vendasFamiliaData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="familia" tick={{ fontSize: 9 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="hsl(345, 70%, 32%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Vendas por Cidade */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Cidade</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Lisboa</span><span className="font-medium">32.450 €</span></div>
                  <div className="flex justify-between"><span>Porto</span><span className="font-medium">28.120 €</span></div>
                  <div className="flex justify-between"><span>Coimbra</span><span className="font-medium">18.340 €</span></div>
                  <div className="flex justify-between"><span>Braga</span><span className="font-medium">14.890 €</span></div>
                  <div className="flex justify-between"><span>Faro</span><span className="font-medium">12.560 €</span></div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Monthly Table */}
              <div className="bg-white rounded-lg border p-4">
                <ScrollArea className="h-[180px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-2">Mês</th>
                        <th className="text-right py-2">Vendas</th>
                        <th className="text-right py-2">Valor Orçamento</th>
                        <th className="text-right py-2">Vendas vs Orçamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((row) => (
                        <tr key={row.mes} className="border-b">
                          <td className="py-1.5">{row.mes}</td>
                          <td className="text-right">{row.vendas}</td>
                          <td className="text-right">{row.orcamento}</td>
                          <td className={`text-right ${row.desvio.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>{row.desvio}</td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t-2">
                        <td className="py-2">Total</td>
                        <td className="text-right">144.121,50 €</td>
                        <td className="text-right">148.000,00 €</td>
                        <td className="text-right text-red-600">-2,6%</td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Vendas por Canal */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Canal</h3>
                <div className="space-y-3">
                  {canalData.map((item) => (
                    <div key={item.canal} className="flex justify-between items-center">
                      <span className="text-sm">{item.canal}</span>
                      <span className="font-medium">{item.valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Clientes */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Top Clientes</h3>
                <div className="space-y-3">
                  {topClientesData.map((item, idx) => (
                    <div key={item.cliente} className="flex justify-between items-center">
                      <span className="text-sm">{idx + 1}. {item.cliente}</span>
                      <span className="font-medium">{item.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VisaoGeralVendasPage;
