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
import { orcamentoMarcaData } from '@/data/wineData';
import { LoadBudgetButton } from '@/components/flexbudget/LoadBudgetButton';

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' €';
};

export default function OrcamentoMarcaPage() {
  const [selectedYear] = useState('2025');
  const [produtorData, setProdutorData] = useState(orcamentoMarcaData);
  const [selectedCanal] = useState('horeca');
  const [selectedSubCanal, setSelectedSubCanal] = useState('restaurantes');

  const toggleExpand = (id: string) => {
    setProdutorData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const totalOrcamento = produtorData.reduce((acc, item) => acc + item.orcamento, 0);
  const totalVendas = produtorData.reduce((acc, item) => acc + (item.vendas || 0), 0);
  const totalAtivacoes = produtorData.reduce((acc, item) => acc + (item.ativacoes || 0), 0);
  const totalNet2 = produtorData.reduce((acc, item) => acc + (item.net2 || 0), 0);

  const renderProdutorRow = (item: typeof orcamentoMarcaData[0]) => {
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
        {hasChildren && item.isExpanded && item.children!.map(child => renderProdutorRow(child as any))}
      </>
    );
  };

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
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KPI Cards + Action Button */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investimento Ano-1</p>
                  <p className="text-2xl font-semibold text-gray-800">425.000 €</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orçamento</p>
                  <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalOrcamento)}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Orç Investimento vs Orçamento Vendas</p>
                  <p className="text-2xl font-semibold text-gray-800">+14,1%</p>
                </CardContent>
              </Card>
              <LoadBudgetButton className="h-auto py-4" />
            </div>

            {/* Main Table */}
            <Card className="bg-white border shadow-sm mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2 font-medium text-gray-600 w-72">Marca/Vinho</th>
                        <th className="text-right p-2 font-medium text-gray-600">Investimentos Ano-1</th>
                        <th className="text-right p-2 font-medium text-gray-600">Orçamento</th>
                        <th className="text-right p-2 font-medium text-gray-600">Orçamento vs Investimento Ano-1</th>
                        <th className="text-right p-2 font-medium text-gray-600">Vendas</th>
                        <th className="text-right p-2 font-medium text-gray-600">Ativações</th>
                        <th className="text-right p-2 font-medium text-gray-600">Net</th>
                        <th className="text-right p-2 font-medium text-gray-600">% Vendas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtorData.map(item => renderProdutorRow(item))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2 pl-3 text-gray-800">Total</td>
                        <td className="p-2 text-right text-gray-800">425.000 €</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalOrcamento)}</td>
                        <td className="p-2 text-right text-gray-800">+14,1%</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalVendas)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalAtivacoes)}</td>
                        <td className="p-2 text-right text-gray-800">{formatCurrency(totalNet2)}</td>
                        <td className="p-2 text-right text-gray-800">3,7%</td>
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
                        <SelectItem value="horeca">Horeca</SelectItem>
                        <SelectItem value="retalho">Retalho</SelectItem>
                        <SelectItem value="exportacao">Exportação</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Sub-Canal</h3>
                    <RadioGroup value={selectedSubCanal} onValueChange={setSelectedSubCanal}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restaurantes" id="restaurantes" />
                        <Label htmlFor="restaurantes">Restaurantes Premium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hoteis" id="hoteis" />
                        <Label htmlFor="hoteis">Hotéis 5 Estrelas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bares" id="bares" />
                        <Label htmlFor="bares">Bares Enotecas</Label>
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
                      <Save className="w-3 h-3 mr-1" /> Guardar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset
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
                          <th className="text-left p-2 font-medium text-gray-600">Marca/Vinho V&W</th>
                          <th className="text-right p-2 font-medium text-gray-600">Orçamento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produtorData.map((item) => (
                          <tr key={item.id} className="border-b font-medium">
                            <td className="p-2 text-gray-700">{item.produtor}</td>
                            <td className="p-2 text-right text-gray-700">{formatCurrency(item.orcamento)}</td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-100">
                          <td className="p-2 text-gray-800">Total</td>
                          <td className="p-2 text-right text-gray-800">{formatCurrency(totalOrcamento)}</td>
                        </tr>
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
