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

interface CanalItem {
  id: string;
  canal: string;
  investimentoAno1: number | null;
  orcamento: number;
  orcVsInv: string | null;
  vendas: number | null;
  ativacoes: number | null;
  net2: number | null;
  percVendas: string | null;
  children?: CanalItem[];
  isExpanded?: boolean;
  level: number;
}

const initialCanalData: CanalItem[] = [
  {
    id: '1',
    canal: 'PFV - B2B',
    investimentoAno1: null,
    orcamento: 60,
    orcVsInv: null,
    vendas: 13089,
    ativacoes: null,
    net2: 13089,
    percVendas: null,
    level: 0,
    isExpanded: true,
    children: [
      { id: '1.1', canal: 'PFV - B2B - PRODUTORES', investimentoAno1: null, orcamento: 60, orcVsInv: null, vendas: 13089, ativacoes: null, net2: 13089, percVendas: null, level: 1 },
    ],
  },
  {
    id: '2',
    canal: 'PFV - MARKETING',
    investimentoAno1: null,
    orcamento: 914,
    orcVsInv: null,
    vendas: null,
    ativacoes: null,
    net2: null,
    percVendas: null,
    level: 0,
    isExpanded: true,
    children: [
      { id: '2.1', canal: 'PFV - MARKETING - COMUNICAÇÃO', investimentoAno1: null, orcamento: 800, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '2.2', canal: 'PFV - MARKETING - EVENTOS|', investimentoAno1: null, orcamento: 114, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
    ],
  },
  {
    id: '3',
    canal: 'PFV - ON TRADE',
    investimentoAno1: null,
    orcamento: 133930,
    orcVsInv: null,
    vendas: 21226,
    ativacoes: -1450,
    net2: 19776,
    percVendas: '6,83%',
    level: 0,
    isExpanded: true,
    children: [
      { id: '3.1', canal: 'PFV - ON TRADE - BARES', investimentoAno1: null, orcamento: 33333, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.2', canal: 'PFV - ON TRADE - CASH&CARRYs', investimentoAno1: null, orcamento: 297, orcVsInv: null, vendas: 21226, ativacoes: -1450, net2: 19776, percVendas: '6,83%', level: 1 },
      { id: '3.3', canal: 'PFV - ON TRADE - CATERING', investimentoAno1: null, orcamento: 33333, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.4', canal: 'PFV - ON TRADE - DISTRIBUIDORES', investimentoAno1: null, orcamento: 300, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.5', canal: 'PFV - ON TRADE - HOTEIS', investimentoAno1: null, orcamento: 33333, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
      { id: '3.6', canal: 'PFV - ON TRADE - RESTAURANTES', investimentoAno1: null, orcamento: 33333, orcVsInv: null, vendas: null, ativacoes: null, net2: null, percVendas: null, level: 1 },
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

export default function OrcamentoCanalPage() {
  const [selectedYear] = useState('2024');
  const [canalData, setCanalData] = useState(initialCanalData);
  const [selectedProdutor] = useState('Baron Philippe de Rothschild SA');
  const [selectedMarca, setSelectedMarca] = useState('milon');

  const toggleExpand = (id: string) => {
    setCanalData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const totalOrcamento = 134905;
  const totalVendas = 34316;
  const totalAtivacoes = -1450;
  const totalNet2 = 32866;

  const renderCanalRow = (item: CanalItem, isChild = false) => {
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
              <span className="text-gray-700">{item.canal}</span>
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
        {hasChildren && item.isExpanded && item.children!.map(child => renderCanalRow(child, true))}
      </>
    );
  };

  const budgetTableData = [
    { canal: 'PFV - B2B', orcamento: 60, isParent: true },
    { canal: 'PFV - B2B - PRODUTORES', orcamento: 60, isParent: false },
    { canal: 'PFV - MARKETING', orcamento: 914, isParent: true },
    { canal: 'PFV - MARKETING - COMUNICAÇÃO', orcamento: 800, isParent: false },
    { canal: 'PFV - MARKETING - EVENTOS|', orcamento: 114, isParent: false },
    { canal: 'PFV - ON TRADE', orcamento: 133930, isParent: true },
    { canal: 'PFV - ON TRADE - BARES', orcamento: 33333, isParent: false },
    { canal: 'PFV - ON TRADE - CASH&CARRYs', orcamento: 297, isParent: false },
    { canal: 'PFV - ON TRADE - CATERING', orcamento: 33333, isParent: false },
    { canal: 'PFV - ON TRADE - DISTRIBUIDORES', orcamento: 300, isParent: false },
    { canal: 'PFV - ON TRADE - HOTEIS', orcamento: 33333, isParent: false },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-100">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light text-gray-700">Orçamento de Investimentos por Canal</h1>
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
                  <p className="text-2xl font-semibold text-gray-800">134.905 €</p>
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
                        <th className="text-left p-2 font-medium text-gray-600 w-64">Canal</th>
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
                      {canalData.map(item => renderCanalRow(item))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 pl-3 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalOrcamento)}</td>
                        <td className="p-2 text-right text-gray-800"></td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVendas)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalAtivacoes)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalNet2)}</td>
                        <td className="p-2 text-right text-gray-800">4,23%</td>
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
                    <h3 className="font-medium text-gray-700 mb-3">Produtores</h3>
                    <Select defaultValue={selectedProdutor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baron Philippe de Rothschild SA">PROD - Baron Philippe de Rothschild SA</SelectItem>
                        <SelectItem value="Anselmo Mendes">PROD - Anselmo Mendes Vinhos Lda</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Marcas</h3>
                    <RadioGroup value={selectedMarca} onValueChange={setSelectedMarca}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="milon" id="milon" />
                        <Label htmlFor="milon">Chateau CLERC MILON Rouge</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="armailhac" id="armailhac" />
                        <Label htmlFor="armailhac">Chateau D'ARMAILHAC Rouge</Label>
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
                  <div className="overflow-y-auto max-h-64">
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
                            <td className={`p-2 text-gray-700 ${item.isParent ? '' : 'pl-6'}`}>{item.canal}</td>
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
