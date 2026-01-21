import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowUp, Minus, Plus, Map, Layers, Grid, Search, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clientesCanalData, clientesTopData, vendasCanalData } from '@/data/wineData';

const canalChartData = [
  { canal: 'Horeca', valor: 2150000 },
  { canal: 'Retalho', valor: 1680000 },
  { canal: 'Exportação', valor: 1250000 },
  { canal: 'E-commerce', valor: 420000 },
];

const ClientesPage = () => {
  const [year, setYear] = useState('2025');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'canal-0': true,
    'subcanal-0-0': true,
    'subcanal-0-1': true,
  });

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' €';
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Vendas por Clientes</h1>
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

            {/* Top Row - 3 columns */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Vendas por Canal */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Vendas por Canal</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={canalChartData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000000}M €`} />
                    <YAxis type="category" dataKey="canal" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="valor" fill="#8B1538" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Clientes */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Top Clientes</h3>
                <div className="space-y-3">
                  {clientesTopData.map((cliente, idx) => (
                    <div key={cliente.cliente} className="flex justify-between items-center text-sm">
                      <span>{idx + 1}. {cliente.cliente}</span>
                      <span className="font-medium">{cliente.valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg border p-4 relative">
                <h3 className="text-sm font-medium mb-2">Vendas por Região</h3>
                <div className="absolute top-12 left-4 flex flex-col gap-2">
                  <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                    <Map className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                    <User className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[180px] bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-xs">Mapa de Portugal</div>
                    <div className="text-[10px] mt-1">Douro • Alentejo • Dão • Vinho Verde</div>
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground mt-2 text-right">Regiões Vitivinícolas</div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
              <ScrollArea className="h-[300px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Canal</th>
                      <th className="text-right py-2 px-3 font-medium">Ano-1</th>
                      <th className="text-right py-2 px-3 font-medium">Ano</th>
                      <th className="text-right py-2 px-3 font-medium">Ano vs Ano-1</th>
                      <th className="text-right py-2 px-3 font-medium">%Vendas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesCanalData.map((canal, cIdx) => (
                      <>
                        <tr key={`canal-${cIdx}`} className="border-b bg-gray-50 font-medium">
                          <td className="py-2 px-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleRow(`canal-${cIdx}`)}>
                            {expandedRows[`canal-${cIdx}`] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            {canal.canal}
                          </td>
                          <td className="text-right px-3 font-bold">{canal.ano1}</td>
                          <td className="text-right px-3 font-bold">{canal.ano}</td>
                          <td className="text-right px-3 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {canal.vsAno1}</td>
                          <td className="text-right px-3">38,9%</td>
                        </tr>
                        {expandedRows[`canal-${cIdx}`] && canal.children?.map((sub, sIdx) => (
                          <>
                            <tr key={`sub-${cIdx}-${sIdx}`} className="border-b">
                              <td className="py-2 px-3 pl-6 flex items-center gap-1 cursor-pointer" onClick={() => toggleRow(`subcanal-${cIdx}-${sIdx}`)}>
                                {expandedRows[`subcanal-${cIdx}-${sIdx}`] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {sub.subcanal}
                              </td>
                              <td className="text-right px-3 font-bold">{sub.ano1}</td>
                              <td className="text-right px-3 font-bold">{sub.ano}</td>
                              <td className="text-right px-3 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {sub.vsAno1}</td>
                              <td className="text-right px-3">25,0%</td>
                            </tr>
                            {expandedRows[`subcanal-${cIdx}-${sIdx}`] && sub.clientes?.map((cliente, clIdx) => (
                              <tr key={`cliente-${cIdx}-${sIdx}-${clIdx}`} className="border-b">
                                <td className="py-1.5 px-3 pl-10 flex items-center gap-1">
                                  <Plus className="w-3 h-3" />
                                  {cliente.nome}
                                </td>
                                <td className="text-right px-3">{cliente.ano1}</td>
                                <td className="text-right px-3">{cliente.ano}</td>
                                <td className="text-right px-3 text-green-600"><ArrowUp className="w-3 h-3 inline" /> {cliente.vsAno1}</td>
                                <td className="text-right px-3">3,7%</td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </>
                    ))}
                    <tr className="font-bold border-t-2">
                      <td className="py-2 px-3">Total</td>
                      <td className="text-right px-3">5.080.000 €</td>
                      <td className="text-right px-3">5.500.000 €</td>
                      <td className="text-right px-3 text-green-600"><ArrowUp className="w-3 h-3 inline" /> +8,3%</td>
                      <td className="text-right px-3">100%</td>
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

export default ClientesPage;
