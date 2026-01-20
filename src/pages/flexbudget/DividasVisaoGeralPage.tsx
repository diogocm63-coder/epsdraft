import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

const clientesBarData = [
  { status: 'Não Vencida', valor: 0 },
  { status: 'Vencida', valor: 253480 },
];

const fornecedoresBarData = [
  { status: 'Não Vencida', valor: 0 },
  { status: 'Vencida', valor: 60700 },
];

const idadeClientesData = [
  { idade: '<30 dias', valor: 0, color: '#4a5568' },
  { idade: '30-60 dias', valor: 0, color: '#718096' },
  { idade: '60-90 dias', valor: 0, color: '#a0aec0' },
  { idade: '90-180 dias', valor: 0, color: '#63b3ed' },
  { idade: '180-270 dias', valor: 0, color: '#ecc94b' },
  { idade: '270-360 dias', valor: 0, color: '#48bb78' },
  { idade: '>360 dias', valor: 253480, color: '#4a5568' },
];

const idadeFornecedoresData = [
  { idade: '<30 dias', valor: 0, color: '#4a5568' },
  { idade: '30-60 dias', valor: 0, color: '#718096' },
  { idade: '60-90 dias', valor: 0, color: '#a0aec0' },
  { idade: '90-180 dias', valor: 0, color: '#63b3ed' },
  { idade: '180-270 dias', valor: 0, color: '#ecc94b' },
  { idade: '270-360 dias', valor: 0, color: '#48bb78' },
  { idade: '>360 dias', valor: 60700, color: '#4a5568' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

const formatCurrencyK = (value: number) => {
  return (value / 1000).toFixed(2).replace('.', ',') + ' K€';
};

export default function DividasVisaoGeralPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-light text-gray-700 mb-6">Relatório de Dívidas</h1>

            {/* KPI Cards */}
            <div className="flex justify-center gap-8 mb-8">
              <Card className="bg-white border shadow-sm w-64">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Dívida Total de Clientes</p>
                  <p className="text-3xl font-bold text-gray-800">253.477 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm w-64">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Dívida Total a Fornecedores</p>
                  <p className="text-3xl font-bold text-gray-800">60.701 €</p>
                </CardContent>
              </Card>
            </div>

            {/* Value Bar Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Valor das Dívidas de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={clientesBarData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value) => formatCurrencyK(Number(value))} />
                      <Bar dataKey="valor" fill="#4a5568" label={{ position: 'right', fontSize: 11, formatter: (v: number) => formatCurrencyK(v) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Valor das Dívidas a Fornecedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={fornecedoresBarData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value) => formatCurrencyK(Number(value))} />
                      <Bar dataKey="valor" fill="#4a5568" label={{ position: 'right', fontSize: 11, formatter: (v: number) => formatCurrencyK(v) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Age Bar Charts */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Idade da Dívida de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-700"></span>&lt;30 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"></span>30-60 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300"></span>60-90 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span>90-180 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>180-270 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400"></span>270-360 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800"></span>&gt;360 dias</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={idadeClientesData}>
                      <XAxis dataKey="idade" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor">
                        {idadeClientesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Idade da Dívida a Fornecedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-700"></span>&lt;30 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"></span>30-60 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300"></span>60-90 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span>90-180 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>180-270 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400"></span>270-360 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800"></span>&gt;360 dias</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={idadeFornecedoresData}>
                      <XAxis dataKey="idade" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor">
                        {idadeFornecedoresData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
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
