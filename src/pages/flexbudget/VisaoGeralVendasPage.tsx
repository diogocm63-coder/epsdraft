import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  vendasChartData,
  vendasMonthlyData,
  vendasFamiliaData,
  vendasCanalData,
  vendasTopClientesData,
} from '@/data/wineData';

const VisaoGeralVendasPage = () => {
  const [year, setYear] = useState('2025');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' €';
  };

  // Calculate totals from wine data
  const totalVendasAno = vendasChartData.reduce((acc, item) => acc + item.vendas, 0);
  const totalOrcamentoAno = vendasChartData.reduce((acc, item) => acc + item.orcamento, 0);
  const vendasVsOrcamento = ((totalVendasAno - totalOrcamentoAno) / totalOrcamentoAno * 100).toFixed(1);

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
                <div className="text-2xl font-bold">5.250.000 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas Ano</div>
                <div className="text-2xl font-bold">{formatCurrency(totalVendasAno)}</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas Mês</div>
                <div className="text-2xl font-bold">710.000 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Orçamento Ano</div>
                <div className="text-2xl font-bold">{formatCurrency(totalOrcamentoAno)}</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Vendas vs Orçamento</div>
                <div className="text-2xl font-bold text-green-600">+{vendasVsOrcamento}%</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Main Chart */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Evolução de Vendas nos Últimos 12 Meses</h3>
                <div className="flex items-center gap-4 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded-full"></span> Vendas</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#2E5A88] rounded-full"></span> Orçamento</span>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={vendasChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="vendas" stroke="#8B1538" fill="#8B1538" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="orcamento" stroke="#2E5A88" fill="#2E5A88" fillOpacity={0.2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Distribuição por Família */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Distribuição de Vendas por Família</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={vendasFamiliaData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                    <YAxis type="category" dataKey="familia" tick={{ fontSize: 9 }} width={80} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="valor" fill="#8B1538" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Vendas por Cidade */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Região</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Lisboa</span><span className="font-medium">1.850.000 €</span></div>
                  <div className="flex justify-between"><span>Porto</span><span className="font-medium">1.420.000 €</span></div>
                  <div className="flex justify-between"><span>Algarve</span><span className="font-medium">680.000 €</span></div>
                  <div className="flex justify-between"><span>Coimbra</span><span className="font-medium">520.000 €</span></div>
                  <div className="flex justify-between"><span>Braga</span><span className="font-medium">380.000 €</span></div>
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
                      {vendasMonthlyData.map((row) => (
                        <tr key={row.mes} className="border-b">
                          <td className="py-1.5">{row.mes}</td>
                          <td className="text-right">{row.vendas}</td>
                          <td className="text-right">{row.orcamento}</td>
                          <td className={`text-right ${row.desvio.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>{row.desvio}</td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t-2">
                        <td className="py-2">Total</td>
                        <td className="text-right">{formatCurrency(totalVendasAno)}</td>
                        <td className="text-right">{formatCurrency(totalOrcamentoAno)}</td>
                        <td className="text-right text-green-600">+{vendasVsOrcamento}%</td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Vendas por Canal */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Canal</h3>
                <div className="space-y-3">
                  {vendasCanalData.map((item) => (
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
                  {vendasTopClientesData.map((item, idx) => (
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
