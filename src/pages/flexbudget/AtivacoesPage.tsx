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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const tipoPedidoData = [
  { name: 'Endo Marketi...', value: 10000, color: '#8B1538' },
  { name: 'Desconto', value: 6000, color: '#C9A227' },
  { name: 'Promo', value: 2000, color: '#D4A5A5' },
  { name: 'Outro', value: 1000, color: '#E8C8C8' },
];

const evolucaoData = [
  { mes: 'Novembro', valor: 15000 },
];

const materialData = [
  { material: 'Cartaz A3', novembro: 35, total: 35 },
  { material: 'Lona Pequena (1,5m x 0,5m)', novembro: 17, total: 17 },
  { material: 'PFV - Amostras de Produto', novembro: 1500, total: 1500 },
  { material: 'PFV - Feiras de Vinho', novembro: 1000, total: 1000 },
  { material: 'PFV - Goodwill Fee', novembro: 6000, total: 6000 },
  { material: 'PFV - Institucional', novembro: 150, total: 150 },
  { material: 'PFV - Material POS', novembro: 300, total: 300 },
  { material: 'PFV - Patrocínios', novembro: 0, total: 0 },
  { material: 'PFV - Plataformas Digitais', novembro: 0, total: 0 },
  { material: 'PFV - Promocionais', novembro: 6500, total: 6500 },
  { material: 'PFV - Promotores', novembro: 2000, total: 2000 },
  { material: 'PFV - Publicidade', novembro: 1000, total: 1000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function AtivacoesPage() {
  const [selectedYear] = useState('2024');
  const [selectedMonth] = useState('Tudo');

  const totalGeral = materialData.reduce((acc, item) => acc + item.total, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Ativações de Investimentos</h1>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Mês</span>
                  <Select defaultValue={selectedMonth}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tudo">Tudo</SelectItem>
                      <SelectItem value="Janeiro">Janeiro</SelectItem>
                      <SelectItem value="Novembro">Novembro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ano</span>
                  <Select defaultValue={selectedYear}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Investimento por Tipo de Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={tipoPedidoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ value }) => `${(value / 1000).toFixed(0)} K€`}
                        labelLine={true}
                      >
                        {tipoPedidoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Evolução de Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ScatterChart>
                      <XAxis dataKey="mes" type="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}.000 €`} domain={[0, 25000]} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Scatter data={evolucaoData} dataKey="valor" fill="#8B1538" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Materials Table */}
            <Card className="bg-white border shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-600">Ano</th>
                        <th className="text-center p-3 font-medium text-gray-600">2024</th>
                        <th className="text-right p-3 font-medium text-gray-600">Total</th>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-600">Material</th>
                        <th className="text-center p-3 font-medium text-gray-600">Janeiro ... Novembro</th>
                        <th className="text-right p-3 font-medium text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-gray-700">{item.material}</td>
                          <td className="p-3 text-right text-gray-700">
                            {item.novembro > 0 ? formatCurrency(item.novembro) : ''}
                          </td>
                          <td className="p-3 text-right font-medium text-gray-800">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-3 text-gray-800">Total</td>
                        <td className="p-3 text-right text-gray-800">{formatCurrency(totalGeral)}</td>
                        <td className="p-3 text-right text-gray-800">{formatCurrency(totalGeral)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
