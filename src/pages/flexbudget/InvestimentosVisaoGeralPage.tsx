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

const evolucaoData = [
  { mes: '2024-07', valor: 0 },
  { mes: '2024-08', valor: 0 },
  { mes: '2024-09', valor: 0 },
  { mes: '2024-10', valor: 0 },
  { mes: '2024-11', valor: 1 },
  { mes: '2024-12', valor: 1 },
  { mes: '2025-01', valor: 0 },
  { mes: '2025-02', valor: 0 },
  { mes: '2025-03', valor: 0 },
  { mes: '2025-04', valor: 0 },
  { mes: '2025-05', valor: 0 },
  { mes: '2025-06', valor: 0 },
];

const materialData = [
  { name: 'Rotulos', value: 4900, color: '#4a5568' },
  { name: 'e-Card (Newsletter)', value: 24, color: '#718096' },
  { name: 'Banner (SWF)', value: 6, color: '#a0aec0' },
];

const topMarcasData = [
  { marca: '(Vazio)', valor: 4930 },
];

const produtorData = [
  { produtor: 'Commop', valor: 4624 },
  { produtor: '(Vazio)', valor: 303 },
  { produtor: 'Auchan Portugal', valor: 3 },
];

const unidadeData = [
  { unidade: '(Vazio)', valor: 4000 },
];

const clienteData = [
  { cliente: 'Teste Ines', percentage: 60 },
  { cliente: 'Teste COMMOP', percentage: 30 },
  { cliente: 'Lda', percentage: 10 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function InvestimentosVisaoGeralPage() {
  const [selectedYear] = useState('2024');

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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano-1</p>
                  <p className="text-2xl font-semibold text-gray-800">18.502</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano</p>
                  <p className="text-2xl font-semibold text-gray-800">4.930 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Mês</p>
                  <p className="text-2xl font-semibold text-gray-800">4.930 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">1.317.593 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento vs Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">0,32%</p>
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
                    <AreaChart data={evolucaoData}>
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area type="monotone" dataKey="valor" stroke="#4a5568" fill="#4a5568" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição de Investimentos por Material</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={materialData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={({ value }) => formatCurrency(value)}
                        labelLine={true}
                      >
                        {materialData.map((entry, index) => (
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
                    {clienteData.map((cliente, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center text-white text-xs font-medium"
                        style={{
                          backgroundColor: index === 0 ? '#4a5568' : index === 1 ? '#718096' : '#a0aec0',
                          gridColumn: index === 2 ? 'span 2' : 'span 1',
                        }}
                      >
                        {cliente.cliente}
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
                  <CardTitle className="text-sm font-medium text-gray-700">Top Marcas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topMarcasData}>
                      <XAxis dataKey="marca" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v} €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#4a5568" label={{ position: 'top', fontSize: 10, formatter: (v: number) => formatCurrency(v) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição de Investimentos por Produtor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={produtorData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v} €`} />
                      <YAxis type="category" dataKey="produtor" tick={{ fontSize: 10 }} width={80} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#4a5568" label={{ position: 'right', fontSize: 10, formatter: (v: number) => formatCurrency(v) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Distribuição de Investimentos por Unidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={unidadeData}>
                      <XAxis dataKey="unidade" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor" fill="#4a5568" />
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
