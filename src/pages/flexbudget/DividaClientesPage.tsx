import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator, Plus, Minus } from 'lucide-react';
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
import { dividaClientesCanalData, dividasIdadeClientesData } from '@/data/wineData';

const mediaDiasData = [
  { status: 'Vencida', dias: 85 },
];

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function DividaClientesPage() {
  const [canalData, setCanalData] = useState(dividaClientesCanalData);

  const toggleExpand = (id: string, data: typeof dividaClientesCanalData): typeof dividaClientesCanalData => {
    return data.map(item => {
      if (item.id === id) {
        return { ...item, isExpanded: !item.isExpanded };
      }
      if (item.children) {
        return { ...item, children: toggleExpand(id, item.children as any) as any };
      }
      return item;
    });
  };

  const handleToggle = (id: string) => {
    setCanalData(prev => toggleExpand(id, prev));
  };

  const renderRow = (item: typeof dividaClientesCanalData[0]): JSX.Element[] => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = item.level === 0 ? 'pl-2' : item.level === 1 ? 'pl-6' : 'pl-10';

    const rows: JSX.Element[] = [
      <tr key={item.id} className={`border-b hover:bg-gray-50 ${item.level === 0 ? 'font-medium' : ''}`}>
        <td className={`p-2 ${paddingLeft}`}>
          <div className="flex items-center gap-1">
            {hasChildren && (
              <button onClick={() => handleToggle(item.id)} className="w-4 h-4 flex items-center justify-center">
                {item.isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            <span className="text-gray-700">{item.canal}</span>
          </div>
        </td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.naoVencidas)}</td>
        <td className="p-2 text-right text-gray-700 font-medium">{formatCurrency(item.vencidas)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.menos30)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.de30a60)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.de60a90)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.de90a180)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.de180a270)}</td>
        <td className="p-2 text-right text-gray-600">{formatCurrency(item.de270a360)}</td>
        <td className="p-2 text-right text-gray-700 font-medium">{formatCurrency(item.mais360)}</td>
      </tr>,
    ];

    if (hasChildren && item.isExpanded) {
      item.children!.forEach(child => {
        rows.push(...renderRow(child as any));
      });
    }

    return rows;
  };

  const totalVencidas = canalData.reduce((acc, item) => acc + item.vencidas, 0);
  const totalMais360 = canalData.reduce((acc, item) => acc + item.mais360, 0);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-light text-gray-700 mb-6">Análise de Dívidas de Clientes</h1>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Média de Dias das Dívidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={mediaDiasData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 120]} />
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
                  <CardTitle className="text-sm font-medium text-gray-700">Idade da Dívida</CardTitle>
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
                    <BarChart data={dividasIdadeClientesData}>
                      <XAxis dataKey="idade" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}K €`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="valor">
                        {dividasIdadeClientesData.map((entry, index) => (
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
                        <th className="text-left p-2 font-medium text-gray-600 w-48">Canal</th>
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
                      {canalData.flatMap(item => renderRow(item))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 pl-2 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800">77.000 €</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVencidas)}</td>
                        <td className="p-2 text-right text-gray-800">22.000 €</td>
                        <td className="p-2 text-right text-gray-800">23.000 €</td>
                        <td className="p-2 text-right text-gray-800">24.000 €</td>
                        <td className="p-2 text-right text-gray-800">33.000 €</td>
                        <td className="p-2 text-right text-gray-800">22.000 €</td>
                        <td className="p-2 text-right text-gray-800">16.000 €</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalMais360)}</td>
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
