import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

const chartData = [
  { name: 'Janeiro', valor: 15907 },
  { name: 'Fevereiro', valor: 3933 },
  { name: 'Março', valor: 38109 },
];

const tableData = [
  { mes: 'Janeiro', ano2024: '15.907,46 €', ano2025: '', desvio: '-100,00%' },
  { mes: 'Fevereiro', ano2024: '3.933,25 €', ano2025: '', desvio: '-100,00%' },
  { mes: 'Março', ano2024: '38.109,52 €', ano2025: '', desvio: '-100,00%' },
];

const HistoricoVendasPage = () => {
  const [year, setYear] = useState('2024');
  const [mes, setMes] = useState('tudo');

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
                <div className="text-5xl font-bold mb-2">0%</div>
                <div className="text-sm text-muted-foreground">Taxa de Crescimento Anual</div>
              </div>

              {/* Chart */}
              <div className="col-span-2 bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Evolução de Vendas</h3>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-500 rounded-full"></span> Ano ● 2024</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000} K €`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-PT')} €`} />
                    <Area 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#6b7280" 
                      fill="#6b7280" 
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
                  {tableData.map((row) => (
                    <tr key={row.mes} className="border-b">
                      <td className="py-2">{row.mes}</td>
                      <td className="text-right font-medium">{row.ano2024}</td>
                      <td className="text-right text-red-600 flex items-center justify-end gap-1">
                        <ArrowDown className="w-3 h-3" /> {row.desvio}
                      </td>
                      <td className="text-right">{row.ano2025}</td>
                      <td className="text-right text-red-600 flex items-center justify-end gap-1">
                        <ArrowDown className="w-3 h-3" /> {row.desvio}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2">
                    <td className="py-2">Total</td>
                    <td className="text-right">57.950,23 €</td>
                    <td className="text-right text-red-600 flex items-center justify-end gap-1">
                      <ArrowDown className="w-3 h-3" /> -100,00%
                    </td>
                    <td className="text-right"></td>
                    <td className="text-right text-red-600 flex items-center justify-end gap-1">
                      <ArrowDown className="w-3 h-3" /> -100,00%
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
