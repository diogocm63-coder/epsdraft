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
import { ativacoesTipoPedidoData, ativacoesEvolucaoData, ativacoesMaterialData } from '@/data/wineData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function AtivacoesPage() {
  const [selectedYear] = useState('2025');
  const [selectedMonth] = useState('Tudo');

  const totalGeral = ativacoesMaterialData.reduce((acc, item) => acc + item.total, 0);

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
                      <SelectItem value="Julho">Julho</SelectItem>
                      <SelectItem value="Agosto">Agosto</SelectItem>
                      <SelectItem value="Setembro">Setembro</SelectItem>
                      <SelectItem value="Outubro">Outubro</SelectItem>
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
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Investimento por Tipo de Ativação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={ativacoesTipoPedidoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ value }) => `${(value / 1000).toFixed(0)} K€`}
                        labelLine={true}
                      >
                        {ativacoesTipoPedidoData.map((entry, index) => (
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
                  <CardTitle className="text-sm font-medium text-gray-700">Evolução de Ativações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ScatterChart>
                      <XAxis dataKey="mes" type="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K €`} domain={[0, 100000]} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Scatter data={ativacoesEvolucaoData} dataKey="valor" fill="#8B1538" />
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
                        <th className="text-center p-3 font-medium text-gray-600">2025</th>
                        <th className="text-right p-3 font-medium text-gray-600">Total</th>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-600">Tipo de Ativação (Vinhos V&W)</th>
                        <th className="text-center p-3 font-medium text-gray-600">Novembro</th>
                        <th className="text-right p-3 font-medium text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ativacoesMaterialData.map((item, index) => (
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
