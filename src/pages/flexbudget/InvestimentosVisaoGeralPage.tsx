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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  investimentosEvolucaoData,
  investimentosMaterialData,
  investimentosTopMarcasData,
  investimentosProdutorData,
  investimentosUnidadeData,
  investimentosClienteData,
} from '@/data/wineData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function InvestimentosVisaoGeralPage() {
  const [selectedYear] = useState('2025');

  const totalInvestimento = investimentosEvolucaoData.reduce((acc, item) => acc + item.valor, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Visão Geral de Investimentos</h1>
              <Select defaultValue={selectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano-1</p>
                  <p className="text-2xl font-semibold text-gray-800">485.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano</p>
                  <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalInvestimento)}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Mês</p>
                  <p className="text-2xl font-semibold text-gray-800">52.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">680.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento vs Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">77,2%</p>
                </CardContent>
              </Card>
            </div>

            {/* First Row Charts */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Evolução de Investimentos nos Últimos 12 Meses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={investimentosEvolucaoData}>
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area type="monotone" dataKey="valor" stroke="#8B1538" fill="#8B1538" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição de Investimentos por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={investimentosMaterialData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={({ value }) => formatCurrency(value)}
                        labelLine={true}
                      >
                        {investimentosMaterialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição de Investimentos por Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 h-[180px]">
                    {investimentosClienteData.map((cliente, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center text-white text-xs font-medium"
                        style={{
                          backgroundColor: index === 0 ? '#8B1538' : index === 1 ? '#C9A227' : '#D4A5A5',
                          gridColumn: index === 2 ? 'span 2' : 'span 1',
                        }}
                      >
                        {cliente.cliente} ({cliente.percentage}%)
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row Charts */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Top Marcas V&W</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={investimentosTopMarcasData}>
                      <XAxis dataKey="marca" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#8B1538" label={{ position: 'top', fontSize: 9, formatter: (v: number) => `${(v/1000).toFixed(0)}K` }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição por Produtor/Adega</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={investimentosProdutorData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}K €`} />
                      <YAxis type="category" dataKey="produtor" tick={{ fontSize: 9 }} width={100} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#8B1538" label={{ position: 'right', fontSize: 9, formatter: (v: number) => `${(v/1000).toFixed(0)}K` }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição por Região</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={investimentosUnidadeData}>
                      <XAxis dataKey="unidade" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#8B1538" />
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
