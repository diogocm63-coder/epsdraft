import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { analiseContasRubricaData, analiseContasChartData } from '@/data/wineData';

const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return value < 0 ? `-${formatted} €` : `${formatted} €`;
};

export default function AnaliseContasPage() {
  const [selectedYear] = useState('2025');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'Vendas de Vinhos Tintos': true,
    'Vendas de Vinhos Brancos': true,
  });

  const toggleExpand = (rubrica: string) => {
    setExpandedRows(prev => ({ ...prev, [rubrica]: !prev[rubrica] }));
  };

  const renderRow = (item: typeof analiseContasRubricaData[0], level = 0): JSX.Element[] => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level === 0 ? 'pl-2' : 'pl-8';
    const isPositive = item.variacao.startsWith('+');

    const rows: JSX.Element[] = [
      <tr key={item.rubrica} className={`border-b hover:bg-gray-50 ${level === 0 ? 'font-medium' : ''}`}>
        <td className={`p-2 ${paddingLeft}`}>
          <div className="flex items-center gap-1">
            {hasChildren && (
              <button onClick={() => toggleExpand(item.rubrica)} className="w-4 h-4 flex items-center justify-center">
                {expandedRows[item.rubrica] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            <span className="text-gray-700">{item.rubrica}</span>
          </div>
        </td>
        <td className="p-2 text-right text-gray-700">{formatCurrency(item.ano)}</td>
        <td className="p-2 text-right text-gray-600">
          <div className="flex items-center justify-end gap-1">
            {formatCurrency(item.ano1)}
            {isPositive ? (
              <ArrowUp className="w-3 h-3 text-green-600" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-600" />
            )}
          </div>
        </td>
        <td className="p-2 text-right">
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {item.variacao}
          </span>
        </td>
      </tr>,
    ];

    if (hasChildren && expandedRows[item.rubrica]) {
      item.children!.forEach(child => {
        rows.push(...renderRow(child as any, level + 1));
      });
    }

    return rows;
  };

  const totalAno = analiseContasRubricaData.reduce((acc, item) => acc + item.ano, 0);
  const totalAno1 = analiseContasRubricaData.reduce((acc, item) => acc + item.ano1, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Análise de Contas - Vendas V&W</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ano</span>
                <Select defaultValue={selectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6">
              {/* Table */}
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-y-auto max-h-[500px]">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium text-gray-600">Rubrica</th>
                          <th className="text-right p-2 font-medium text-gray-600">Ano</th>
                          <th className="text-right p-2 font-medium text-gray-600">Ano-1</th>
                          <th className="text-right p-2 font-medium text-gray-600">Ano vs Ano-1</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analiseContasRubricaData.flatMap(item => renderRow(item))}
                        <tr className="bg-gray-100 font-semibold">
                          <td className="p-2 text-gray-800">Total Vendas</td>
                          <td className="p-2 text-right text-gray-800">{formatCurrency(totalAno)}</td>
                          <td className="p-2 text-right text-gray-800">
                            <div className="flex items-center justify-end gap-1">
                              {formatCurrency(totalAno1)}
                              <ArrowUp className="w-3 h-3 text-green-600" />
                            </div>
                          </td>
                          <td className="p-2 text-right text-green-600">+10,5%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Vendas por Categoria de Vinho</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analiseContasChartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000000}M €`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar 
                        dataKey="valor" 
                        fill="#8B1538" 
                        label={{ 
                          position: 'right', 
                          fontSize: 11, 
                          formatter: (v: number) => `${(v/1000000).toFixed(2)}M €` 
                        }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
