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

const rubricaData = [
  { rubrica: 'Vendas e serviços prestados', ano: 22605.06, ano1: 5737.24, highlight: false },
  { rubrica: 'Subsídios à exploração', ano: null, ano1: null, highlight: false },
  { rubrica: 'Ganhos/perdas imputados de subsidiárias, associadas e empreendimentos conjuntos', ano: null, ano1: null, highlight: false },
  { rubrica: 'Variação nos inventários da produção', ano: null, ano1: 4.00, highlight: false },
  { rubrica: 'Trabalhos para a própria entidade', ano: null, ano1: null, highlight: false },
  { rubrica: 'Custo das mercadorias vendidas e das matérias consumidas', ano: -1259.04, ano1: null, highlight: false },
  { rubrica: 'Fornecimentos e serviços externos', ano: -560.00, ano1: -1045.70, highlight: false },
  { rubrica: 'Gastos com o pessoal', ano: -10000.00, ano1: -2500.00, highlight: false },
  { rubrica: 'Imparidade de inventários (perdas/reversões)', ano: null, ano1: null, highlight: false },
  { rubrica: 'Imparidade de dívidas a receber (perdas/reversões)', ano: null, ano1: null, highlight: false },
  { rubrica: 'Provisões (aumentos/reduções)', ano: null, ano1: null, highlight: false },
  { rubrica: 'Imparidade de investimentos não depreciáveis/amortizáveis (perdas/reversões)', ano: null, ano1: null, highlight: false },
  { rubrica: 'Aumentos/reduções de justo valor', ano: null, ano1: null, highlight: false },
  { rubrica: 'Outros rendimentos', ano: null, ano1: null, highlight: false },
  { rubrica: 'Outros gastos', ano: null, ano1: null, highlight: false },
  { rubrica: 'Resultado antes de depreciações, gastos de financiamento e impostos', ano: 10786.02, ano1: 2195.54, highlight: true },
  { rubrica: 'Gastos/reversões de depreciação e de amortização', ano: null, ano1: null, highlight: false },
  { rubrica: 'Imparidade de investimentos depreciáveis/amortizáveis (perdas/reversões)', ano: null, ano1: null, highlight: false },
  { rubrica: 'Resultado operacional (antes de gastos de financiamento e impostos)', ano: 10786.02, ano1: 2195.54, highlight: true },
  { rubrica: 'Juros e rendimentos similares obtidos', ano: null, ano1: null, highlight: false },
  { rubrica: 'Juros e gastos similares suportados', ano: null, ano1: null, highlight: false },
  { rubrica: 'Resultado antes de impostos', ano: 10786.02, ano1: 2195.54, highlight: true },
  { rubrica: 'Imposto sobre o rendimento do período', ano: -2157.20, ano1: -439.10, highlight: false },
  { rubrica: 'Resultado líquido do período', ano: 8628.82, ano1: 1756.44, highlight: true },
];

const chartData = [
  { name: 'Resultado Bruto', valor: 21346 },
  { name: 'EBITDA', valor: 10786 },
  { name: 'EBIT', valor: 10786 },
  { name: 'Antes Imposto', valor: 10786 },
  { name: 'Resultado Líquido', valor: 8629 },
];

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' €';
};

export default function DemonstracaoResultadosPage() {
  const [selectedYear] = useState('2022');

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
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Resultado Bruto</p>
                  <p className="text-2xl font-bold text-gray-800">21.346 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">EBITDA</p>
                  <p className="text-2xl font-bold text-gray-800">10.786 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">EBIT</p>
                  <p className="text-2xl font-bold text-gray-800">10.786 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Antes Imposto</p>
                  <p className="text-2xl font-bold text-gray-800">10.786 €</p>
                </CardContent>
              </Card>
              <Card className="bg-eps-primary border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-white/80 mb-1">Lucro</p>
                  <p className="text-2xl font-bold text-white">8.629 €</p>
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
                        {rubricaData.map((item, index) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar 
                        dataKey="valor" 
                        fill="#8B1538" 
                        label={{ 
                          position: 'right', 
                          fontSize: 11, 
                          formatter: (v: number) => new Intl.NumberFormat('pt-PT').format(v) + ' €' 
                        }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>40,4%</span>
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
