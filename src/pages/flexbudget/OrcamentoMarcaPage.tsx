import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { Calculator, Plus, Minus, Save, RotateCcw, Undo, Redo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProdutorItem {
  id: string;
  produtor: string;
  investimentoAno1: number | null;
  orcamento: number;
  orcVsInv: string | null;
  vendas: number | null;
  ativacoes: number | null;
  net2: number | null;
  percVendas: string | null;
  children?: ProdutorItem[];
  isExpanded?: boolean;
  level: number;
}

const initialProdutorData: ProdutorItem[] = [
  {
    id: '1',
    produtor: 'PROD - Baron Philippe de Rothschild SA',
    investimentoAno1: null,
    orcamento: 765,
    orcVsInv: null,
    vendas: 21226,
    ativacoes: -1450,
    net2: 19776,
    percVendas: '6,83%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '1.1', produtor: 'Chateau CLERC MILON Rouge', investimentoAno1: null, orcamento: 297, orcVsInv: null, vendas: 21226, ativacoes: -1450, net2: 19776, percVendas: '6,83%', level: 1 },
      { id: '1.2', produtor: 'Chateau D\'ARMAILHAC Rouge', investimentoAno1: null, orcamento: 468, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
    ],
  },
  {
    id: '2',
    produtor: 'PROD - Anselmo Mendes Vinhos Lda',
    investimentoAno1: null,
    orcamento: 28803,
    orcVsInv: null,
    vendas: null,
    ativacoes: -17,
    net2: -17,
    percVendas: null,
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', produtor: 'ANSELMO MENDES 3 Rios Escolha', investimentoAno1: null, orcamento: 26724, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '2.2', produtor: 'ANSELMO MENDES Alvarinho Private', investimentoAno1: null, orcamento: 2079, orcVsInv: null, vendas: null, ativacoes: -17, net2: -17, percVendas: null, level: 1 },
    ],
  },
  {
    id: '3',
    produtor: 'PROD - Adega Costa Atlântica Lda',
    investimentoAno1: null,
    orcamento: 14066,
    orcVsInv: null,
    vendas: null,
    ativacoes: null,
    net2: null,
    percVendas: null,
    level: 0,
    isExpanded: true,
    children: [
      { id: '3.1', produtor: 'VICENTINO Alvarinho', investimentoAno1: null, orcamento: 728, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.2', produtor: 'VICENTINO Arinto Branco', investimentoAno1: null, orcamento: 13338, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.3', produtor: 'VICENTINO Reserva Touriga Nacional Tinto', investimentoAno1: null, orcamento: 0, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
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

export default function OrcamentoMarcaPage() {
  const [selectedYear] = useState('2024');
  const [produtorData, setProdutorData] = useState(initialProdutorData);
  const [selectedCanal] = useState('ON TRADE');
  const [selectedSubCanal, setSelectedSubCanal] = useState('cash');

  const toggleExpand = (id: string) => {
    setProdutorData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const totalOrcamento = 43634;
  const totalVendas = 21226;
  const totalAtivacoes = -1467;
  const totalNet2 = 19759;

  const renderProdutorRow = (item: ProdutorItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = item.level === 0 ? 'pl-3' : 'pl-8';

    return (
      <>
        <tr key={item.id} className={`border-b hover:bg-gray-50 ${item.level === 0 ? 'font-medium' : ''}`}>
          <td className={`p-2 ${paddingLeft}`}>
            <div className="flex items-center gap-1">
              {hasChildren && (
                <button onClick={() => toggleExpand(item.id)} className="w-4 h-4 flex items-center justify-center">
                  {item.isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              )}
              {!hasChildren && <span className="w-4" />}
              <span className="text-gray-700">{item.produtor}</span>
            </div>
          </td>
          <td className="p-2 text-right text-gray-600">{formatCurrency(item.investimentoAno1)}</td>
          <td className="p-2 text-right text-gray-700">{formatCurrency(item.orcamento)}</td>
          <td className="p-2 text-right text-gray-600">{item.orcVsInv || ''}</td>
          <td className="p-2 text-right text-gray-700">{formatCurrency(item.vendas)}</td>
          <td className="p-2 text-right text-gray-700">{formatCurrency(item.ativacoes)}</td>
          <td className="p-2 text-right text-gray-700">{formatCurrency(item.net2)}</td>
          <td className="p-2 text-right text-gray-700">{item.percVendas || ''}</td>
        </tr>
        {hasChildren && item.isExpanded && item.children!.map(child => renderProdutorRow(child))}
      </>
    );
  };

  const budgetTableData = [
    { item: 'PROD - Baron Philippe de Rothschild SA', orcamento: 765, isParent: true },
    { item: 'Chateau CLERC MILON Rouge', orcamento: 297, isParent: false },
    { item: 'Chateau D\'ARMAILHAC Rouge', orcamento: 468, isParent: false },
    { item: 'PROD - Anselmo Mendes Vinhos Lda', orcamento: 28803, isParent: true },
    { item: 'ANSELMO MENDES 3 Rios Escolha', orcamento: 26724, isParent: false },
    { item: 'ANSELMO MENDES Alvarinho Private', orcamento: 2079, isParent: false },
    { item: 'PROD - Adega Costa Atlântica Lda', orcamento: 14066, isParent: true },
    { item: 'VICENTINO Alvarinho', orcamento: 728, isParent: false },
    { item: 'VICENTINO Arinto Branco', orcamento: 13338, isParent: false },
    { item: 'VICENTINO Reserva Touriga Nacional Tinto', orcamento: 0, isParent: false },
    { item: 'Total', orcamento: 43634, isParent: true },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Orçamento de Investimentos por Marca</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ano</span>
                <Select defaultValue={selectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KPI Cards + Action Button */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano-1</p>
                  <p className="text-2xl font-semibold text-gray-800">(Vazio)</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">43.634 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orç Investimento vs Orçamento Vendas</p>
                  <p className="text-2xl font-semibold text-gray-800">(Vazio)</p>
                </CardContent>
              </Card>
              <Button className="bg-eps-primary hover:bg-eps-primary/90 text-white h-auto py-4">
                Carregar Budget a partir das Vendas
              </Button>
            </div>

            {/* Main Table */}
            <Card className="bg-white border shadow-sm mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2 font-medium text-gray-600 w-72">Produtor</th>
                        <th className="text-right p-2 font-medium text-gray-600">Investimentos Ano-1</th>
                        <th className="text-right p-2 font-medium text-gray-600">Orçamento</th>
                        <th className="text-right p-2 font-medium text-gray-600">Orçamento vs Investimento Ano-1</th>
                        <th className="text-right p-2 font-medium text-gray-600">Vendas</th>
                        <th className="text-right p-2 font-medium text-gray-600">Ativações</th>
                        <th className="text-right p-2 font-medium text-gray-600">2 Net</th>
                        <th className="text-right p-2 font-medium text-gray-600">% Vendas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtorData.map(item => renderProdutorRow(item))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 pl-3 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalOrcamento)}</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVendas)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalAtivacoes)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalNet2)}</td>
                        <td className="p-2 text-right text-gray-800">6,91%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Filters */}
              <div className="space-y-4">
                <Card className="bg-white border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Canal</h3>
                    <Select defaultValue={selectedCanal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ON TRADE">PFV - ON TRADE</SelectItem>
                        <SelectItem value="B2B">PFV - B2B</SelectItem>
                        <SelectItem value="MARKETING">PFV - MARKETING</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Sub-Canal</h3>
                    <RadioGroup value={selectedSubCanal} onValueChange={setSelectedSubCanal}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bares" id="bares" />
                        <Label htmlFor="bares">PFV - ON TRADE - BARES</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">PFV - ON TRADE - CASH&CARRYs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="catering" id="catering" />
                        <Label htmlFor="catering">PFV - ON TRADE - CATERING</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distribuidores" id="distribuidores" />
                        <Label htmlFor="distribuidores">PFV - ON TRADE - DISTRIBUIDORES</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hoteis" id="hoteis" />
                        <Label htmlFor="hoteis">PFV - ON TRADE - HOTEIS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restaurantes" id="restaurantes" />
                        <Label htmlFor="restaurantes">PFV - ON TRADE - RESTAURANTES</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Edit Table */}
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-3 border-b bg-gray-50">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Save className="w-3 h-3 mr-1" /> Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset Changes
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Undo className="w-3 h-3 mr-1" /> Undo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Redo className="w-3 h-3 mr-1" /> Redo
                    </Button>
                  </div>
                  <div className="overflow-y-auto max-h-80">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-2 font-medium text-gray-600"></th>
                          <th className="text-right p-2 font-medium text-gray-600">Orçamento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetTableData.map((item, index) => (
                          <tr key={index} className={`border-b ${item.isParent ? 'font-medium' : ''}`}>
                            <td className={`p-2 text-gray-700 ${item.isParent ? '' : 'pl-6'}`}>{item.item}</td>
                            <td className="p-2 text-right text-gray-700">{formatCurrency(item.orcamento)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
