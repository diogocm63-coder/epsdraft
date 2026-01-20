import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ArrowDown, Minus, Plus, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

const familiaData = [
  { familia: 'Vinhos Tintos', valor: 45 },
  { familia: 'Vinhos Brancos', valor: 32 },
  { familia: 'Espumantes', valor: 18 },
  { familia: 'Rosés', valor: 12 },
];

const artigosData = [
  {
    categoria: 'Aparelhagem e Máq. Eletrónicas',
    expanded: true,
    ano1: 123,
    ano: 0,
    vsAno1: '-100%',
    cx9l1: 7,
    cx9l: 0,
    vsAno1_2: '-100%',
    euroCx1: 17.51,
    euroCx: 0,
    vsAno1_3: '-100%',
    children: [
      { nome: 'Aparelhagem e Máq. Eletrónicas', ano1: -120, ano: 0, vsAno1: '-100%', cx9l1: -1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 120.00, euroCx: 0, vsAno1_3: '-100%' },
      { nome: 'Técnico de Assemblagem de Hardware', ano1: 243, ano: 0, vsAno1: '-100%', cx9l1: 8, cx9l: 0, vsAno1_2: '-100%', euroCx1: 30.32, euroCx: 0, vsAno1_3: '-100%' },
    ],
  },
  {
    categoria: 'Acessórios',
    expanded: true,
    ano1: 10,
    ano: 0,
    vsAno1: '-100%',
    cx9l1: 2,
    cx9l: 0,
    vsAno1_2: '-100%',
    euroCx1: 5.24,
    euroCx: 0,
    vsAno1_3: '-100%',
    children: [
      { nome: 'Cabo Paralelo', ano1: 10, ano: 0, vsAno1: '-100%', cx9l1: 1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 9.98, euroCx: 0, vsAno1_3: '-100%' },
      { nome: 'Tapete de Rato 2.ª Geração', ano1: 1, ano: 0, vsAno1: '-100%', cx9l1: 1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 0.50, euroCx: 0, vsAno1_3: '-100%' },
    ],
  },
  {
    categoria: 'Bebidas Alcoólicas',
    expanded: true,
    ano1: 474,
    ano: 0,
    vsAno1: '-100%',
    cx9l1: 7,
    cx9l: 0,
    vsAno1_2: '-100%',
    euroCx1: 67.73,
    euroCx: 0,
    vsAno1_3: '-100%',
    children: [
      { nome: 'Garrafa Bagaceira Regional - Caves Altas', ano1: 39, ano: 0, vsAno1: '-100%', cx9l1: 2, cx9l: 0, vsAno1_2: '-100%', euroCx1: 19.26, euroCx: 0, vsAno1_3: '-100%' },
      { nome: 'Grarrafa de Whisky 15 anos B&A', ano1: 194, ano: 0, vsAno1: '-100%', cx9l1: 1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 194.40, euroCx: 0, vsAno1_3: '-100%' },
      { nome: 'Vinho do Porto Vintage/1994 - Gold Grapes', ano1: 241, ano: 0, vsAno1: '-100%', cx9l1: 4, cx9l: 0, vsAno1_2: '-100%', euroCx1: 60.30, euroCx: 0, vsAno1_3: '-100%' },
    ],
  },
  {
    categoria: 'CD Rom',
    expanded: true,
    ano1: -176,
    ano: 0,
    vsAno1: '-100%',
    cx9l1: 0,
    cx9l: 0,
    vsAno1_2: '-Infinity',
    euroCx1: 0,
    euroCx: 0,
    vsAno1_3: '-Infinity',
    children: [
      { nome: 'Ddram2 1024Mb 533Mhz PC2 4200', ano1: 126, ano: 0, vsAno1: '-100%', cx9l1: 1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 126.42, euroCx: 0, vsAno1_3: '-100%' },
      { nome: 'Gravador DVD Usb 2.0 Super Multi Drive', ano1: -303, ano: 0, vsAno1: '-100%', cx9l1: -1, cx9l: 0, vsAno1_2: '-100%', euroCx1: 302.82, euroCx: 0, vsAno1_3: '-100%' },
    ],
  },
];

const ArtigosPage = () => {
  const [year, setYear] = useState('2025');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'Aparelhagem e Máq. Eletrónicas': true,
    'Acessórios': true,
    'Bebidas Alcoólicas': true,
    'CD Rom': true,
  });

  const toggleRow = (cat: string) => {
    setExpandedRows(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return '';
    return `${value.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
  };

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
                  <BarChart data={familiaData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="familia" tick={{ fontSize: 9 }} width={90} />
                    <Bar dataKey="valor" fill="hsl(345, 70%, 32%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="flex gap-8 mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Lock className="w-3 h-3" /> Categoria
                    </div>
                    <div className="text-sm">Mota eletrica</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Lock className="w-3 h-3" /> Produtos
                    </div>
                    <div className="text-sm">&nbsp;</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Vendas</div>
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
                          <td className="text-right px-2"></td>
                          <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {cat.vsAno1}</td>
                          <td className="text-right px-2 font-bold">{cat.cx9l1}</td>
                          <td className="text-right px-2"></td>
                          <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {cat.vsAno1_2}</td>
                          <td className="text-right px-2 font-bold">{formatCurrency(cat.euroCx1)}</td>
                          <td className="text-right px-2"></td>
                          <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {cat.vsAno1_3}</td>
                        </tr>
                        {expandedRows[cat.categoria] && cat.children?.map((child) => (
                          <tr key={child.nome} className="border-b">
                            <td className="py-1.5 px-3 pl-8">{child.nome}</td>
                            <td className="text-right px-2">{formatCurrency(child.ano1)}</td>
                            <td className="text-right px-2"></td>
                            <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {child.vsAno1}</td>
                            <td className="text-right px-2">{child.cx9l1}</td>
                            <td className="text-right px-2"></td>
                            <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {child.vsAno1_2}</td>
                            <td className="text-right px-2">{formatCurrency(child.euroCx1)}</td>
                            <td className="text-right px-2"></td>
                            <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> {child.vsAno1_3}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                    <tr className="font-bold border-t-2">
                      <td className="py-2 px-3">Total</td>
                      <td className="text-right px-2">57.950 €</td>
                      <td className="text-right px-2"></td>
                      <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> -100%</td>
                      <td className="text-right px-2">159</td>
                      <td className="text-right px-2"></td>
                      <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> -100%</td>
                      <td className="text-right px-2">364,47 €</td>
                      <td className="text-right px-2"></td>
                      <td className="text-right px-2 text-red-600"><ArrowDown className="w-3 h-3 inline" /> -100%</td>
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
