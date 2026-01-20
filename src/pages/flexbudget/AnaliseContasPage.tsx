import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';
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

interface RubricaItem {
  id: string;
  rubrica: string;
  ano: number;
  ano1: number;
  variacao: number;
  children?: RubricaItem[];
  isExpanded?: boolean;
  level: number;
}

const initialRubricaData: RubricaItem[] = [
  {
    id: '1',
    rubrica: 'Vendas e serviços prestados',
    ano: 22605,
    ano1: 5737,
    variacao: 294,
    level: 0,
    isExpanded: true,
    children: [
      { id: '1.1', rubrica: '71 - Vendas', ano: 22062, ano1: 4281, variacao: 415, level: 1 },
      { id: '1.2', rubrica: '72 - Prestações de Serviços', ano: 543, ano1: 1456, variacao: -63, level: 1 },
    ],
  },
  {
    id: '2',
    rubrica: 'Variação nos inventários da produção',
    ano: 0,
    ano1: 4,
    variacao: -100,
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', rubrica: '73 - Proveitos Suplementares', ano: 0, ano1: 4, variacao: -100, level: 1 },
    ],
  },
  {
    id: '3',
    rubrica: 'Custo das mercadorias vendidas e das matérias consumidas',
    ano: -1259,
    ano1: 0,
    variacao: 0,
    level: 0,
    isExpanded: true,
    children: [
      { id: '3.1', rubrica: '61 - Custo das Merc. Vend. e Mat. Cons.', ano: -1259, ano1: 0, variacao: 0, level: 1 },
    ],
  },
  {
    id: '4',
    rubrica: 'Fornecimentos e serviços externos',
    ano: -560,
    ano1: -1046,
    variacao: -46,
    level: 0,
    isExpanded: true,
    children: [
      { id: '4.1', rubrica: '62 - Fornecimentos e Serviços Externos', ano: -560, ano1: -1046, variacao: -46, level: 1 },
    ],
  },
  {
    id: '5',
    rubrica: 'Gastos com o pessoal',
    ano: -10000,
    ano1: -2500,
    variacao: 300,
    level: 0,
    isExpanded: true,
    children: [
      { id: '5.1', rubrica: '64 - Custos com o Pessoal', ano: -10000, ano1: -2500, variacao: 300, level: 1 },
    ],
  },
  {
    id: '6',
    rubrica: 'Imposto sobre o rendimento do período',
    ano: -2157,
    ano1: -439,
    variacao: 391,
    level: 0,
    isExpanded: true,
    children: [
      { id: '6.1', rubrica: '86 - Imposto s/Rendimento do Exercício', ano: -2157, ano1: -439, variacao: 391, level: 1 },
    ],
  },
];

const chartData = [
  { name: 'Resultado Bruto', valor: 21346 },
  { name: 'EBITDA', valor: 10786 },
  { name: 'EBIT', valor: 10786 },
  { name: 'Antes Imposto', valor: 10786 },
  { name: 'Resultado Líquido', valor: 8629 },
];

const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return value < 0 ? `-${formatted} €` : `${formatted} €`;
};

export default function AnaliseContasPage() {
  const [selectedYear] = useState('2022');
  const [rubricaData, setRubricaData] = useState(initialRubricaData);

  const toggleExpand = (id: string) => {
    setRubricaData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const renderRow = (item: RubricaItem): JSX.Element[] => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = item.level === 0 ? 'pl-2' : 'pl-8';

    const rows: JSX.Element[] = [
      <tr key={item.id} className={`border-b hover:bg-gray-50 ${item.level === 0 ? 'font-medium' : ''}`}>
        <td className={`p-2 ${paddingLeft}`}>
          <div className="flex items-center gap-1">
            {hasChildren && (
              <button onClick={() => toggleExpand(item.id)} className="w-4 h-4 flex items-center justify-center">
                {item.isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            <span className="text-gray-700">{item.rubrica}</span>
          </div>
        </td>
        <td className="p-2 text-right text-gray-700">{formatCurrency(item.ano)}</td>
        <td className="p-2 text-right text-gray-600">
          <div className="flex items-center justify-end gap-1">
            {formatCurrency(item.ano1)}
            {item.variacao > 0 ? (
              <ArrowUp className="w-3 h-3 text-green-600" />
            ) : item.variacao < 0 ? (
              <ArrowDown className="w-3 h-3 text-red-600" />
            ) : null}
          </div>
        </td>
        <td className="p-2 text-right">
          <span className={item.variacao >= 0 ? 'text-green-600' : 'text-red-600'}>
            {item.variacao}%
          </span>
        </td>
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Análise de Contas</h1>
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
                          <th className="text-right p-2 font-medium text-gray-600">Ano vs Ano-1</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rubricaData.flatMap(item => renderRow(item))}
                        <tr className="bg-gray-100 font-semibold">
                          <td className="p-2 text-gray-800">Total</td>
                          <td className="p-2 text-right text-gray-800">8.629 €</td>
                          <td className="p-2 text-right text-gray-800">
                            <div className="flex items-center justify-end gap-1">
                              1.756 €
                              <ArrowUp className="w-3 h-3 text-green-600" />
                            </div>
                          </td>
                          <td className="p-2 text-right text-green-600">391%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Valor por Rubricas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000} K €`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar 
                        dataKey="valor" 
                        fill="#4a5568" 
                        label={{ 
                          position: 'right', 
                          fontSize: 11, 
                          formatter: (v: number) => new Intl.NumberFormat('pt-PT').format(v) + ' €' 
                        }} 
                      />
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
