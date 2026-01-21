import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown, ArrowUp, Minus, Plus, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { artigosFamiliaData, artigosData } from '@/data/wineData';

const ArtigosPage = () => {
  const [year, setYear] = useState('2025');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'Tintos Premium': true,
    'Brancos Reserva': true,
    'Tintos Regional': true,
  });

  const toggleRow = (cat: string) => {
    setExpandedRows(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return '';
    return new Intl.NumberFormat('pt-PT', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' €';
  };

  // Calculate totals
  const totalAno = artigosData.reduce((acc, cat) => acc + cat.ano, 0);
  const totalAno1 = artigosData.reduce((acc, cat) => acc + cat.ano1, 0);
  const totalCx9l = artigosData.reduce((acc, cat) => acc + cat.cx9l, 0);
  const totalCx9l1 = artigosData.reduce((acc, cat) => acc + cat.cx9l1, 0);

  // Data for pie chart - aggregate by wine type
  const tipoVinhoData = [
    { name: 'Tinto', value: 3250, color: '#8B1538' },
    { name: 'Branco', value: 1720, color: '#C9A227' },
    { name: 'Rosé', value: 380, color: '#D4A5A5' },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Vendas por Artigos</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mês</span>
                  <Select defaultValue="tudo">
                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="tudo">Tudo</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ano</span>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Distribuição de Vendas por Família</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={artigosFamiliaData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}K €`} />
                    <YAxis type="category" dataKey="familia" tick={{ fontSize: 9 }} width={90} />
                    <Tooltip formatter={(value: number) => `${value}K €`} />
                    <Bar dataKey="valor" fill="#8B1538" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Tipo de Vinho</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={tipoVinhoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {tipoVinhoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}K €`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {tipoVinhoData.map((tipo) => (
                      <div key={tipo.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: tipo.color }}></span>
                          <span className="text-xs">{tipo.name}</span>
                        </div>
                        <span className="text-xs font-medium">{tipo.value.toLocaleString('pt-PT')}K €</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Total</span>
                        <span className="text-xs font-bold">{tipoVinhoData.reduce((acc, t) => acc + t.value, 0).toLocaleString('pt-PT')}K €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
              <ScrollArea className="h-[400px]">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Categoria</th>
                      <th className="text-right py-2 px-2 font-medium">Ano-1 (€)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano (€)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano vs Ano-1</th>
                      <th className="text-right py-2 px-2 font-medium">Ano-1 (Cx9L)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano (Cx9L)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano vs Ano-1</th>
                      <th className="text-right py-2 px-2 font-medium">Ano-1 (€/Cx9L)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano (€/Cx9L)</th>
                      <th className="text-right py-2 px-2 font-medium">Ano vs Ano-1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artigosData.map((cat) => (
                      <>
                        <tr key={cat.categoria} className="border-b bg-gray-50 font-medium">
                          <td className="py-2 px-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleRow(cat.categoria)}>
                            {expandedRows[cat.categoria] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            {cat.categoria}
                          </td>
                          <td className="text-right px-2 font-bold">{formatCurrency(cat.ano1)}</td>
                          <td className="text-right px-2 font-bold">{formatCurrency(cat.ano)}</td>
                          <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {cat.vsAno1}</td>
                          <td className="text-right px-2 font-bold">{cat.cx9l1.toLocaleString('pt-PT')}</td>
                          <td className="text-right px-2 font-bold">{cat.cx9l.toLocaleString('pt-PT')}</td>
                          <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {cat.vsAno1_2}</td>
                          <td className="text-right px-2 font-bold">{formatCurrency(cat.euroCx1)}</td>
                          <td className="text-right px-2 font-bold">{formatCurrency(cat.euroCx)}</td>
                          <td className="text-right px-2 text-green-600">{cat.vsAno1_3}</td>
                        </tr>
                        {expandedRows[cat.categoria] && cat.children?.map((child) => (
                          <tr key={child.nome} className="border-b">
                            <td className="py-1.5 px-3 pl-8">{child.nome}</td>
                            <td className="text-right px-2">{formatCurrency(child.ano1)}</td>
                            <td className="text-right px-2">{formatCurrency(child.ano)}</td>
                            <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {child.vsAno1}</td>
                            <td className="text-right px-2">{child.cx9l1.toLocaleString('pt-PT')}</td>
                            <td className="text-right px-2">{child.cx9l.toLocaleString('pt-PT')}</td>
                            <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {child.vsAno1_2}</td>
                            <td className="text-right px-2">{formatCurrency(child.euroCx1)}</td>
                            <td className="text-right px-2">{formatCurrency(child.euroCx)}</td>
                            <td className="text-right px-2 text-green-600">{child.vsAno1_3}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                    <tr className="font-bold border-t-2">
                      <td className="py-2 px-3">Total</td>
                      <td className="text-right px-2">{formatCurrency(totalAno1)}</td>
                      <td className="text-right px-2">{formatCurrency(totalAno)}</td>
                      <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> +11,5%</td>
                      <td className="text-right px-2">{totalCx9l1.toLocaleString('pt-PT')}</td>
                      <td className="text-right px-2">{totalCx9l.toLocaleString('pt-PT')}</td>
                      <td className="text-right px-2 text-green-600"><ArrowUp className="w-3 h-3 inline" /> +11,5%</td>
                      <td className="text-right px-2">67,70 €</td>
                      <td className="text-right px-2">67,75 €</td>
                      <td className="text-right px-2 text-green-600">+0,1%</td>
                    </tr>
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ArtigosPage;
