import { EPSHeader } from '@/components/layout/EPSHeader';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ChevronDown, Minus, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for charts
const chartData = [
  { name: 'Janeiro', vendas: 12000, investimento: 8000 },
  { name: 'Fevereiro', vendas: 15000, investimento: 7500 },
  { name: 'Março', vendas: 22000, investimento: 9000 },
  { name: 'Novembro', vendas: 18000, investimento: 6000 },
];

// Mock data for producer tables
const produtorData = [
  {
    nome: 'PROD - Adega Costa Atlântica Lda',
    janeiro: 673.54,
    fevereiro: 517.44,
    marco: 1099.06,
    novembro: -2750.00,
    total: -459.96,
    vendas: { janeiro: 673.54, fevereiro: 517.44, marco: 1099.06, novembro: 0, total: 2290.04 },
    investimento: { janeiro: 0, fevereiro: 0, marco: 0, novembro: -2750.00, total: -2750.00 },
  },
  {
    nome: 'PROD - Anselmo Mendes Vinhos Lda',
    janeiro: 21438.80,
    fevereiro: 3094.60,
    marco: 16976.71,
    novembro: -17.00,
    total: 41493.11,
    vendas: { janeiro: 21438.80, fevereiro: 3094.60, marco: 16976.71, novembro: 0, total: 41510.11 },
    investimento: { janeiro: 0, fevereiro: 0, marco: 0, novembro: -17.00, total: -17.00 },
  },
  {
    nome: 'PROD - Baron Philippe de Rothschild SA',
    janeiro: 300.00,
    fevereiro: 10392.35,
    marco: -15224.50,
    novembro: -4532.15,
    total: -9064.30,
    vendas: { janeiro: 300.00, fevereiro: 10392.35, marco: 0, novembro: 0, total: 10692.35 },
    investimento: { janeiro: 0, fevereiro: 0, marco: -15224.50, novembro: -4532.15, total: -19756.65 },
  },
];

// Hierarchical data
const hierarchicalData = [
  {
    tipo: 'Vendas',
    expanded: true,
    adega: { real: 1764.66, orcamento: 'Infinity', desvio: 41584.11 },
    anselmo: { real: 'Infinity', orcamento: 10692.35 },
    baron: { real: 'Infinity', orcamento: 10692.35 },
    children: [
      {
        tipo: 'PFV - B2B',
        expanded: true,
        adega: { real: 462.10, orcamento: 'Infinity', desvio: 12082.20 },
        anselmo: { real: 'Infinity', orcamento: 5108.80 },
        baron: { real: 'Infinity', orcamento: 5108.80 },
        children: [
          { tipo: 'PFV - B2B - PRODUTORES', adega: { real: 462.10, orcamento: 'Infinity', desvio: 12082.20 }, anselmo: { real: 'Infinity', orcamento: 5108.80 }, baron: { real: 'Infinity', orcamento: 5108.80 } },
        ]
      },
      {
        tipo: 'PFV - ON TRADE',
        expanded: true,
        adega: { real: 1302.56, orcamento: 'Infinity', desvio: 29501.91 },
        anselmo: { real: 'Infinity', orcamento: 5583.55 },
        baron: { real: 'Infinity', orcamento: 5583.55 },
        children: [
          { tipo: 'PFV - ON TRADE - BARES', adega: { real: 172.48, orcamento: 'Infinity', desvio: 6078.00 }, anselmo: { real: 'Infinity', orcamento: 1756.36 }, baron: { real: 'Infinity', orcamento: 1756.36 } },
          { tipo: 'PFV - ON TRADE - CASH&CARRYs', adega: { real: 1130.08, orcamento: 'Infinity', desvio: 23423.91 }, anselmo: { real: 'Infinity', orcamento: 3827.19 }, baron: { real: 'Infinity', orcamento: 3827.19 } },
        ]
      },
    ]
  },
  {
    tipo: 'Investimento',
    expanded: true,
    adega: { real: -114398.58, orcamento: '-100,00%', desvio: -17.00 },
    anselmo: { real: -39130.87, orcamento: '-99,96%', desvio: -1450.00 },
    baron: { real: -136063.84, orcamento: '', desvio: '' },
    children: [
      {
        tipo: 'PFV - B2B',
        adega: { real: -14962.59, orcamento: '-100,00%' },
        anselmo: { real: -299.25, orcamento: '-100,00%' },
        baron: { real: -60.00, orcamento: '' },
      },
      {
        tipo: 'PFV - MARKETING',
        expanded: true,
        adega: { real: -2742.86, orcamento: '-100,00%' },
        anselmo: { real: -828.57, orcamento: '-100,00%' },
        baron: { real: -1083.57, orcamento: '' },
        children: [
          { tipo: 'PFV - MARKETING - COMUNICAÇÃO', adega: { real: -2400.00, orcamento: '-100,00%' }, anselmo: { real: -600.00, orcamento: '-100,00%' }, baron: { real: -855.00, orcamento: '' } },
          { tipo: 'PFV - MARKETING - EVENTOS', adega: { real: -342.86, orcamento: '-100,00%' }, anselmo: { real: -228.57, orcamento: '-100,00%' }, baron: { real: -228.57, orcamento: '' } },
        ]
      },
      {
        tipo: 'PFV - ON TRADE',
        expanded: true,
        adega: { real: -96693.13, orcamento: '-100,00%' },
        anselmo: { real: -38003.05, orcamento: '-99,96%' },
        baron: { real: -134920.27, orcamento: '' },
        children: [
          { tipo: 'PFV - ON TRADE - BARES', adega: { real: -13849.34, orcamento: '-100,00%' }, anselmo: { real: -500.00, orcamento: '-100,00%' }, baron: { real: -33333.33, orcamento: '' } },
          { tipo: 'PFV - ON TRADE - CASH&CARRYs', adega: { real: -14065.83, orcamento: '-100,00%' }, anselmo: { real: -28803.05, orcamento: '-99,94%' }, baron: { real: -764.94, orcamento: '' } },
        ]
      },
    ]
  },
];

// PFV Summary data
const pfvSummaryData = [
  {
    nome: 'PROD - Adega Costa Atlântica Lda',
    vendas: 525.38,
    investimento: -2287.90,
    vendas2: 462.10,
    investimento2: -2750.00,
  },
  {
    nome: 'PROD - Anselmo Mendes Vinhos Lda',
    vendas: -74.00,
    investimento: 12082.20,
    vendas2: -74.00,
    investimento2: 12082.20,
  },
  {
    nome: 'PROD - Baron Philippe de Rothschild SA',
    vendas: 0,
    investimento: -8665.70,
    vendas2: 5108.80,
    investimento2: -13774.50,
  },
];

const formatCurrency = (value: number | string) => {
  if (typeof value === 'string') return value;
  if (value === 0) return '0,00 €';
  const formatted = new Intl.NumberFormat('pt-PT', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(Math.abs(value));
  return value < 0 ? `-${formatted} €` : `${formatted} €`;
};

const FlexbudgetPage = () => {
  const [year, setYear] = useState('2024');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'Vendas': true,
    'PFV - B2B': true,
    'PFV - ON TRADE': true,
    'Investimento': true,
    'PFV - MARKETING': true,
  });

  const toggleRow = (tipo: string) => {
    setExpandedRows(prev => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            {/* Header with Year Selector */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-eps-primary">Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ano</span>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-24 bg-white border-eps-border">
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

            {/* KPI Cards Row */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Vendas</div>
                <div className="text-2xl font-bold text-foreground">57.950</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Orçamento de Vendas</div>
                <div className="text-2xl font-bold text-foreground">(Vazio)</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Investimentos</div>
                <div className="text-2xl font-bold text-foreground">18.502 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Orçamento de Investimentos</div>
                <div className="text-2xl font-bold text-foreground">1.518.993 €</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Retorno sobre o Investimento (ROI)</div>
                <div className="text-2xl font-bold text-foreground">213%</div>
              </div>
            </div>

            {/* Chart and Table Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Area Chart */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Vendas vs Investimento</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-eps-primary"></div>
                    <span className="text-xs text-muted-foreground">Vendas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-xs text-muted-foreground">Investimento</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="hsl(345, 70%, 32%)" 
                      fill="hsl(345, 70%, 32%)" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="investimento" 
                      stroke="#9ca3af" 
                      fill="#9ca3af" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Producer Table */}
              <div className="bg-white rounded-lg border p-4">
                <ScrollArea className="h-[230px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-muted-foreground">Produtor</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Janeiro</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Fevereiro</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Março</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Novembro</th>
                        <th className="text-right py-2 font-medium text-muted-foreground bg-blue-50">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtorData.map((prod, idx) => (
                        <>
                          <tr key={`prod-${idx}`} className="border-b bg-gray-50 font-medium">
                            <td className="py-1.5 flex items-center gap-1">
                              <Minus className="w-3 h-3 text-muted-foreground" />
                              {prod.nome}
                            </td>
                            <td className="text-right py-1.5">{formatCurrency(prod.janeiro)}</td>
                            <td className="text-right py-1.5">{formatCurrency(prod.fevereiro)}</td>
                            <td className="text-right py-1.5">{formatCurrency(prod.marco)}</td>
                            <td className="text-right py-1.5 text-destructive">{formatCurrency(prod.novembro)}</td>
                            <td className={`text-right py-1.5 bg-blue-50 ${prod.total < 0 ? 'text-destructive' : ''}`}>{formatCurrency(prod.total)}</td>
                          </tr>
                          <tr key={`vendas-${idx}`} className="border-b">
                            <td className="py-1 pl-6">Vendas</td>
                            <td className="text-right py-1">{formatCurrency(prod.vendas.janeiro)}</td>
                            <td className="text-right py-1">{formatCurrency(prod.vendas.fevereiro)}</td>
                            <td className="text-right py-1">{formatCurrency(prod.vendas.marco)}</td>
                            <td className="text-right py-1"></td>
                            <td className="text-right py-1 bg-blue-50">{formatCurrency(prod.vendas.total)}</td>
                          </tr>
                          <tr key={`inv-${idx}`} className="border-b">
                            <td className="py-1 pl-6">Investimento</td>
                            <td className="text-right py-1"></td>
                            <td className="text-right py-1"></td>
                            <td className="text-right py-1"></td>
                            <td className="text-right py-1 text-destructive">{formatCurrency(prod.investimento.novembro)}</td>
                            <td className="text-right py-1 bg-blue-50 text-destructive">{formatCurrency(prod.investimento.total)}</td>
                          </tr>
                        </>
                      ))}
                      <tr className="border-t-2 font-bold">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">22.112,34 €</td>
                        <td className="text-right py-2">3.912,04 €</td>
                        <td className="text-right py-2">28.468,12 €</td>
                        <td className="text-right py-2 text-destructive">-17.991,50 €</td>
                        <td className="text-right py-2 bg-blue-50">36.501,00 €</td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>

            {/* Bottom Tables Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hierarchical Table */}
              <div className="bg-white rounded-lg border p-4">
                <ScrollArea className="h-[280px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-muted-foreground">Produtor<br/>Tipo</th>
                        <th className="text-right py-2 font-medium text-muted-foreground" colSpan={2}>PROD - Adega Costa Atlântica Lda<br/><span className="font-normal">Real &nbsp; Orçamento &nbsp; Desvio</span></th>
                        <th className="text-right py-2 font-medium text-muted-foreground" colSpan={2}>PROD - Anselmo Mendes Vinhos Lda<br/><span className="font-normal">Real &nbsp; Orçamento &nbsp; Desvio</span></th>
                        <th className="text-right py-2 font-medium text-muted-foreground" colSpan={2}>PROD - Baron Philippe de...<br/><span className="font-normal">Real &nbsp; Orçamento</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {hierarchicalData.map((row, idx) => (
                        <>
                          <tr key={`row-${idx}`} className={`border-b ${row.tipo === 'Vendas' ? 'bg-blue-50' : 'bg-gray-50'} font-medium`}>
                            <td className="py-1.5 flex items-center gap-1 cursor-pointer" onClick={() => toggleRow(row.tipo)}>
                              {expandedRows[row.tipo] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              {row.tipo}
                            </td>
                            <td className="text-right py-1.5">{formatCurrency(row.adega.real)}</td>
                            <td className="text-right py-1.5">{row.adega.orcamento}</td>
                            <td className="text-right py-1.5">{formatCurrency(row.anselmo.real)}</td>
                            <td className="text-right py-1.5">{row.anselmo.orcamento}</td>
                            <td className="text-right py-1.5">{typeof row.baron.real === 'number' ? formatCurrency(row.baron.real) : row.baron.real}</td>
                            <td className="text-right py-1.5">{row.baron.orcamento}</td>
                          </tr>
                          {expandedRows[row.tipo] && row.children?.map((child, cidx) => (
                            <>
                              <tr key={`child-${idx}-${cidx}`} className="border-b">
                                <td className="py-1 pl-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleRow(child.tipo)}>
                                  {child.children ? (expandedRows[child.tipo] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />) : <span className="w-3"></span>}
                                  {child.tipo}
                                </td>
                                <td className="text-right py-1">{formatCurrency(child.adega.real)}</td>
                                <td className="text-right py-1">{child.adega.orcamento}</td>
                                <td className="text-right py-1">{typeof child.anselmo?.real === 'number' ? formatCurrency(child.anselmo.real) : child.anselmo?.real}</td>
                                <td className="text-right py-1">{child.anselmo?.orcamento}</td>
                                <td className="text-right py-1">{typeof child.baron?.real === 'number' ? formatCurrency(child.baron.real) : child.baron?.real}</td>
                                <td className="text-right py-1">{child.baron?.orcamento}</td>
                              </tr>
                              {expandedRows[child.tipo] && child.children?.map((subChild, scidx) => (
                                <tr key={`subchild-${idx}-${cidx}-${scidx}`} className="border-b text-muted-foreground">
                                  <td className="py-1 pl-8">{subChild.tipo}</td>
                                  <td className="text-right py-1">{formatCurrency(subChild.adega.real)}</td>
                                  <td className="text-right py-1">{subChild.adega.orcamento}</td>
                                  <td className="text-right py-1">{typeof subChild.anselmo?.real === 'number' ? formatCurrency(subChild.anselmo.real) : subChild.anselmo?.real}</td>
                                  <td className="text-right py-1">{subChild.anselmo?.orcamento}</td>
                                  <td className="text-right py-1">{typeof subChild.baron?.real === 'number' ? formatCurrency(subChild.baron.real) : subChild.baron?.real}</td>
                                  <td className="text-right py-1">{subChild.baron?.orcamento}</td>
                                </tr>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                      <tr className="border-t-2 font-bold">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">1.764,66 €</td>
                        <td className="text-right py-2 text-destructive">-114.398,58</td>
                        <td className="text-right py-2 text-destructive">-101,54%</td>
                        <td className="text-right py-2">41.567,11 €</td>
                        <td className="text-right py-2 text-destructive">-39.130,87</td>
                        <td className="text-right py-2 text-destructive">-206,23%</td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* PFV Summary Table */}
              <div className="bg-white rounded-lg border p-4">
                <ScrollArea className="h-[280px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-muted-foreground">Produtor</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">PFV - B2B</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">PFV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pfvSummaryData.map((prod, idx) => (
                        <>
                          <tr key={`pfv-${idx}`} className="border-b bg-gray-50 font-medium">
                            <td className="py-1.5 flex items-center gap-1">
                              <Minus className="w-3 h-3 text-muted-foreground" />
                              {prod.nome}
                            </td>
                            <td className="text-right py-1.5">{formatCurrency(prod.vendas)}</td>
                            <td className={`text-right py-1.5 ${prod.investimento < 0 ? 'text-destructive' : ''}`}>{formatCurrency(prod.investimento)}</td>
                          </tr>
                          <tr key={`pfv-vendas-${idx}`} className="border-b">
                            <td className="py-1 pl-6">Vendas</td>
                            <td className="text-right py-1">{formatCurrency(prod.vendas2)}</td>
                            <td className="text-right py-1">{formatCurrency(prod.vendas2)}</td>
                          </tr>
                          <tr key={`pfv-inv-${idx}`} className="border-b">
                            <td className="py-1 pl-6">Investimento</td>
                            <td className="text-right py-1"></td>
                            <td className={`text-right py-1 ${prod.investimento2 < 0 ? 'text-destructive' : ''}`}>{formatCurrency(prod.investimento2)}</td>
                          </tr>
                        </>
                      ))}
                      <tr className="border-t-2 font-bold">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">451,38 €</td>
                        <td className="text-right py-2">1.128,60 €</td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FlexbudgetPage;
