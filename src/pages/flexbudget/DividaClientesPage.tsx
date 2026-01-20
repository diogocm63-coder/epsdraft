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

const mediaDiasData = [
  { status: 'Vencida', dias: 522 },
];

const idadeDividaData = [
  { idade: '<30 dias', valor: 0, color: '#4a5568' },
  { idade: '30-60 dias', valor: 0, color: '#718096' },
  { idade: '60-90 dias', valor: 0, color: '#a0aec0' },
  { idade: '90-180 dias', valor: 0, color: '#63b3ed' },
  { idade: '180-270 dias', valor: 0, color: '#ecc94b' },
  { idade: '270-360 dias', valor: 0, color: '#48bb78' },
  { idade: '>360', valor: 253477, color: '#4a5568' },
];

interface CanalItem {
  id: string;
  canal: string;
  naoVencidas: number | null;
  vencidas: number;
  menos30: number | null;
  de30a60: number | null;
  de60a90: number | null;
  de90a180: number | null;
  de180a270: number | null;
  de270a360: number | null;
  mais360: number;
  children?: CanalItem[];
  isExpanded?: boolean;
  level: number;
}

const initialCanalData: CanalItem[] = [
  {
    id: '1',
    canal: '',
    naoVencidas: null,
    vencidas: 253477,
    menos30: null,
    de30a60: null,
    de60a90: null,
    de90a180: null,
    de180a270: null,
    de270a360: null,
    mais360: 253477,
    level: 0,
    isExpanded: true,
    children: [
      {
        id: '1.1',
        canal: '',
        naoVencidas: null,
        vencidas: 135396,
        menos30: null,
        de30a60: null,
        de60a90: null,
        de90a180: null,
        de180a270: null,
        de270a360: null,
        mais360: 135396,
        level: 1,
        isExpanded: true,
        children: [
          { id: '1.1.1', canal: 'Bares', naoVencidas: null, vencidas: 11057, menos30: null, de30a60: null, de60a90: null, de90a180: null, de180a270: null, de270a360: null, mais360: 11057, level: 2 },
          { id: '1.1.2', canal: 'Soft Discount', naoVencidas: null, vencidas: 65544, menos30: null, de30a60: null, de60a90: null, de90a180: null, de180a270: null, de270a360: null, mais360: 65544, level: 2 },
          { id: '1.1.3', canal: 'Supermercados', naoVencidas: null, vencidas: 1582, menos30: null, de30a60: null, de60a90: null, de90a180: null, de180a270: null, de270a360: null, mais360: 1582, level: 2 },
          { id: '1.1.4', canal: 'Trader', naoVencidas: null, vencidas: 39898, menos30: null, de30a60: null, de60a90: null, de90a180: null, de180a270: null, de270a360: null, mais360: 39898, level: 2 },
        ],
      },
    ],
  },
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
  const [canalData, setCanalData] = useState(initialCanalData);

  const toggleExpand = (id: string, data: CanalItem[]): CanalItem[] => {
    return data.map(item => {
      if (item.id === id) {
        return { ...item, isExpanded: !item.isExpanded };
      }
      if (item.children) {
        return { ...item, children: toggleExpand(id, item.children) };
      }
      return item;
    });
  };

  const handleToggle = (id: string) => {
    setCanalData(prev => toggleExpand(id, prev));
  };

  const renderRow = (item: CanalItem): JSX.Element[] => {
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
        rows.push(...renderRow(child));
      });
    }

    return rows;
  };

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
                  <CardTitle className="text-sm font-medium text-gray-700">Média de Dias das Dividas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={mediaDiasData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 600]} />
                      <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={60} />
                      <Tooltip />
                      <Bar dataKey="dias" fill="#4a5568" label={{ position: 'right', fontSize: 11 }} />
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
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-700"></span>&lt;30 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"></span>30-60 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300"></span>60-90 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span>90-180 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>180-270 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400"></span>270-360 dias</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800"></span>&gt;360 dias</span>
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
                        <th className="text-left p-2 font-medium text-gray-600 w-48">Canal</th>
                        <th className="text-right p-2 font-medium text-gray-600">Não Vencidas</th>
                        <th className="text-right p-2 font-medium text-gray-600">Vencidas</th>
                        <th className="text-right p-2 font-medium text-gray-600">&lt;30</th>
                        <th className="text-right p-2 font-medium text-gray-600">30-60</th>
                        <th className="text-right p-2 font-medium text-gray-600">60-90</th>
                        <th className="text-right p-2 font-medium text-gray-600">90-180</th>
                        <th className="text-right p-2 font-medium text-gray-600">180-270</th>
                        <th className="text-right p-2 font-medium text-gray-600">270-360</th>
                        <th className="text-right p-2 font-medium text-gray-600">&lt;360</th>
                      </tr>
                    </thead>
                    <tbody>
                      {canalData.flatMap(item => renderRow(item))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 pl-2 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">253.477 €</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">253.477 €</td>
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
