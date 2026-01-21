import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator } from 'lucide-react';
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
import { demonstracaoRubricaData, demonstracaoChartData } from '@/data/wineData';

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function DemonstracaoResultadosPage() {
  const [selectedYear] = useState('2025');

  const ebitda = demonstracaoRubricaData.find(r => r.rubrica.includes('EBITDA'))?.ano || 0;
  const ebit = demonstracaoRubricaData.find(r => r.rubrica.includes('EBIT'))?.ano || 0;
  const resultadoLiquido = demonstracaoRubricaData.find(r => r.rubrica.includes('Resultado Líquido'))?.ano || 0;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Relatório de Demonstração de Resultados</h1>
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

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-800">7.325.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Margem Bruta</p>
                  <p className="text-2xl font-bold text-gray-800">3.055.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">EBITDA</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(ebitda)}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">EBIT</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(ebit)}</p>
                </CardContent>
              </Card>
              <Card className="bg-eps-primary border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-white/80 mb-1">Resultado Líquido</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(resultadoLiquido)}</p>
                </CardContent>
              </Card>
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
                        </tr>
                      </thead>
                      <tbody>
                        {demonstracaoRubricaData.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b ${item.highlight ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                          >
                            <td className={`p-2 text-gray-700 ${item.highlight ? 'font-medium' : ''}`}>
                              {item.rubrica}
                            </td>
                            <td className="p-2 text-right text-gray-700">{formatCurrency(item.ano)}</td>
                            <td className="p-2 text-right text-gray-600">{formatCurrency(item.ano1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Resultados V&W Vinhos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={demonstracaoChartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000000}M €`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
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
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>Margem Líquida: 12,3%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
