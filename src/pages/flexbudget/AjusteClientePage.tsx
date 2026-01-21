import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ChevronRight, Save, X, Undo, Redo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ajusteClienteCategorias, ajusteClienteClientes, ajusteClienteProdutosData } from '@/data/wineData';

const AjusteClientePage = () => {
  const [year, setYear] = useState('2025');
  const [cliente, setCliente] = useState('Makro Portugal');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Ajuste por Cliente</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Cliente</span>
                  <Select value={cliente} onValueChange={setCliente}>
                    <SelectTrigger className="w-48 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ajusteClienteClientes.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
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
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* Categoria */}
              <div className="col-span-3 bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Categoria</h3>
                <ScrollArea className="h-[180px]">
                  <div className="space-y-1">
                    {ajusteClienteCategorias.map((cat) => (
                      <div key={cat} className="flex items-center gap-2 text-sm py-1">
                        <ChevronRight className="w-3 h-3" />
                        <Checkbox id={`cat-${cat}`} />
                        <label htmlFor={`cat-${cat}`}>{cat}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* KPI Cards */}
              <div className="col-span-6 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Vendas Ano-1</div>
                  <div className="text-2xl font-bold">485.000 €</div>
                </div>
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Orçamento</div>
                  <div className="text-2xl font-bold">540.000 €</div>
                </div>
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Orçamento vs Vendas Ano-1</div>
                  <div className="text-2xl font-bold text-green-600">+11,3%</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="col-span-3 flex items-start justify-end">
                <Button className="bg-eps-primary hover:bg-eps-primary/90 text-white">
                  Carregar Budget a partir das Vendas
                </Button>
              </div>
            </div>

            {/* Category Summary Table */}
            <div className="bg-white rounded-lg border p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Categoria</th>
                    <th className="text-right py-2 px-3 font-medium">Vendas Ano-1</th>
                    <th className="text-right py-2 px-3 font-medium">Orçamento Ano-1</th>
                    <th className="text-right py-2 px-3 font-medium">Volume</th>
                    <th className="text-right py-2 px-3 font-medium">Orçamento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3">Tintos Premium</td>
                    <td className="text-right py-2 px-3">185.000 €</td>
                    <td className="text-right py-2 px-3">175.000 €</td>
                    <td className="text-right py-2 px-3">2.050</td>
                    <td className="text-right py-2 px-3">205.000 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">Brancos Reserva</td>
                    <td className="text-right py-2 px-3">142.000 €</td>
                    <td className="text-right py-2 px-3">135.000 €</td>
                    <td className="text-right py-2 px-3">1.775</td>
                    <td className="text-right py-2 px-3">158.000 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">Tintos Regional</td>
                    <td className="text-right py-2 px-3">98.000 €</td>
                    <td className="text-right py-2 px-3">92.000 €</td>
                    <td className="text-right py-2 px-3">2.450</td>
                    <td className="text-right py-2 px-3">108.000 €</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2 px-3">Total</td>
                    <td className="text-right py-2 px-3">485.000 €</td>
                    <td className="text-right py-2 px-3">460.000 €</td>
                    <td className="text-right py-2 px-3">6.275</td>
                    <td className="text-right py-2 px-3">540.000 €</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Client Grid */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-2 border-b bg-gray-50">
                <span className="font-medium text-sm">Cliente: {cliente}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <Save className="w-3 h-3" /> Guardar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <X className="w-3 h-3" /> Cancelar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <Undo className="w-3 h-3" /> Undo
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <Redo className="w-3 h-3" /> Redo
                </Button>
              </div>
              
              <ScrollArea className="h-[250px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b bg-gray-100">
                      <th className="text-left py-2 px-3 font-medium"></th>
                      <th className="text-center py-2 px-3 font-medium">Qtd (Cx9L)</th>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3">
                        <Checkbox />
                      </td>
                      <td className="text-center py-2 px-3 font-medium">Total: 6.275</td>
                    </tr>
                  </thead>
                  <tbody>
                    {ajusteClienteProdutosData.map((produto) => (
                      <tr key={produto} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 pl-6">{produto}</td>
                        <td className="text-center py-2 px-3">
                          <input 
                            type="text" 
                            className="w-20 text-center border rounded px-2 py-1 text-sm"
                            defaultValue=""
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
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

export default AjusteClientePage;
