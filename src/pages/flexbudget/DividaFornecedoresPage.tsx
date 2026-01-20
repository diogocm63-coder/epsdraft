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
} from 'recharts';

const mediaDiasData = [
  { status: 'Vencida', dias: 524 },
];

const idadeDividaData = [
  { idade: '<30 dias', valor: 0, color: '#8B1538' },
  { idade: '30-60 dias', valor: 0, color: '#A52952' },
  { idade: '60-90 dias', valor: 0, color: '#C9A227' },
  { idade: '90-180 dias', valor: 0, color: '#D4B84A' },
  { idade: '180-270 dias', valor: 0, color: '#D4A5A5' },
  { idade: '270-360 dias', valor: 60701, color: '#E8C8C8' },
  { idade: '>360', valor: 0, color: '#8B1538' },
];

const fornecedorData = [
  { fornecedor: 'Adega Costa Atlântica, Lda', naoVencidas: null, vencidas: 12860, mais360: 12860 },
  { fornecedor: 'Anselmo Mendes Vinhos, Lda', naoVencidas: null, vencidas: 6353, mais360: 6353 },
  { fornecedor: 'Baron Philippe de Rothschild S.A.', naoVencidas: null, vencidas: 3504, mais360: 3504 },
  { fornecedor: 'Bodegas De Lo Gerederos Del Marques De Riscal, S.L.U.', naoVencidas: null, vencidas: 13841, mais360: 13841 },
  { fornecedor: 'Bodegas Emilio Moro, S.L.', naoVencidas: null, vencidas: 9890, mais360: 9890 },
  { fornecedor: 'Caves Transmontanas, Lda', naoVencidas: null, vencidas: 14253, mais360: 14253 },
];

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function DividaFornecedoresPage() {
  const totalVencidas = fornecedorData.reduce((acc, item) => acc + item.vencidas, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-light text-gray-700 mb-6">Análise de Dívidas a Fornecedores</h1>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Média de Dias das Dividas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={mediaDiasData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 600]} />
                      <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={60} />
                      <Tooltip />
                      <Bar dataKey="dias" fill="#8B1538" label={{ position: 'right', fontSize: 11 }} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-xs text-gray-500 mt-2">Dias</p>
                </CardContent>
              </Card>

              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Idade da Divida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#8B1538'}}></span>&lt;30 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#A52952'}}></span>30-60 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#C9A227'}}></span>60-90 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#D4B84A'}}></span>90-180 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#D4A5A5'}}></span>180-270 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#E8C8C8'}}></span>270-360 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{backgroundColor: '#8B1538'}}></span>&gt;360 dias</span>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={idadeDividaData}>
                      <XAxis dataKey="idade" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor">
                        {idadeDividaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <Card className="bg-white border shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2 font-medium text-gray-600">Fornecedor</th>
                        <th className="text-right p-2 font-medium text-gray-600">Não Vencidas</th>
                        <th className="text-right p-2 font-medium text-gray-600">Vencidas</th>
                        <th className="text-right p-2 font-medium text-gray-600">&lt;30</th>
                        <th className="text-right p-2 font-medium text-gray-600">30-60</th>
                        <th className="text-right p-2 font-medium text-gray-600">60-90</th>
                        <th className="text-right p-2 font-medium text-gray-600">90-180</th>
                        <th className="text-right p-2 font-medium text-gray-600">180-270</th>
                        <th className="text-right p-2 font-medium text-gray-600">270-360</th>
                        <th className="text-right p-2 font-medium text-gray-600">&gt;360</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fornecedorData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-gray-700">{item.fornecedor}</td>
                          <td className="p-2 text-right text-gray-600">{formatCurrency(item.naoVencidas)}</td>
                          <td className="p-2 text-right text-gray-700 font-medium">{formatCurrency(item.vencidas)}</td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-600"></td>
                          <td className="p-2 text-right text-gray-700 font-medium">{formatCurrency(item.mais360)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVencidas)}</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVencidas)}</td>
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
