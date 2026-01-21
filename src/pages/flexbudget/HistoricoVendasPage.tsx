import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown, ArrowUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { historicoChartData, historicoTableData } from '@/data/wineData';

const HistoricoVendasPage = () => {
  const [year, setYear] = useState('2024');
  const [mes, setMes] = useState('tudo');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' €';
  };

  // Calculate growth rate
  const totalAno2024 = historicoTableData.reduce((acc, item) => {
    const value = parseInt(item.ano2024.replace(/[^\d]/g, ''));
    return acc + value;
  }, 0);
  
  const totalAno2025 = historicoTableData.reduce((acc, item) => {
    const value = parseInt(item.ano2025.replace(/[^\d]/g, ''));
    return acc + value;
  }, 0);
  
  const growthRate = ((totalAno2025 - totalAno2024) / totalAno2024 * 100).toFixed(1);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Histórico de Vendas</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mês</span>
                  <Select value={mes} onValueChange={setMes}>
                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tudo">Tudo</SelectItem>
                      <SelectItem value="jan">Janeiro</SelectItem>
                      <SelectItem value="fev">Fevereiro</SelectItem>
                      <SelectItem value="mar">Março</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ano</span>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-40 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">Múltiplas seleções</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* KPI Card */}
              <div className="bg-white rounded-lg border p-6 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-green-600">+{growthRate}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Crescimento Anual</div>
              </div>

              {/* Chart */}
              <div className="col-span-2 bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Evolução de Vendas</h3>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded-full"></span> Ano 2025</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={historicoChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000} K €`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#8B1538" 
                      fill="#8B1538" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Ano<br/><span className="font-normal text-muted-foreground">Nome do Mês</span></th>
                    <th className="text-right py-2 font-medium">2024<br/><span className="font-normal">€</span></th>
                    <th className="text-right py-2 font-medium">vs Ano-1</th>
                    <th className="text-right py-2 font-medium">2025<br/><span className="font-normal">€</span></th>
                    <th className="text-right py-2 font-medium">vs Ano-1</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoTableData.map((row) => (
                    <tr key={row.mes} className="border-b">
                      <td className="py-2">{row.mes}</td>
                      <td className="text-right font-medium">{row.ano2024}</td>
                      <td className="text-right text-green-600 flex items-center justify-end gap-1">
                        <ArrowUp className="w-3 h-3" /> {row.desvio}
                      </td>
                      <td className="text-right">{row.ano2025}</td>
                      <td className="text-right text-green-600 flex items-center justify-end gap-1">
                        <ArrowUp className="w-3 h-3" /> {row.desvio}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2">
                    <td className="py-2">Total</td>
                    <td className="text-right">{formatCurrency(totalAno2024)}</td>
                    <td className="text-right text-green-600 flex items-center justify-end gap-1">
                      <ArrowUp className="w-3 h-3" /> +{growthRate}%
                    </td>
                    <td className="text-right">{formatCurrency(totalAno2025)}</td>
                    <td className="text-right text-green-600 flex items-center justify-end gap-1">
                      <ArrowUp className="w-3 h-3" /> +{growthRate}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HistoricoVendasPage;
