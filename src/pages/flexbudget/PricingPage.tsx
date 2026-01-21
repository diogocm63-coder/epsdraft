import { EPSHeader } from '@/components/layout/EPSHeader';
import { FlexbudgetSidebar } from '@/components/layout/FlexbudgetSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Calculator, ChevronRight, Save, X, Undo, Redo, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { pricingCanais, pricingCategorias, pricingProdutosData } from '@/data/wineData';

const PricingPage = () => {
  const [year, setYear] = useState('2025');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-eps-background">
        <FlexbudgetSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EPSHeader title="Flexbudget" icon={<Calculator className="w-4 h-4" />} />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-light text-foreground">Definição de Pricing</h1>
              <div className="flex items-center gap-4">
                <Button className="bg-eps-primary hover:bg-eps-primary/90 text-white">
                  Carregar Budget a partir das Vendas
                </Button>
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
              {/* Canal */}
              <div className="col-span-2 bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Canal</h3>
                <div className="space-y-1">
                  {pricingCanais.map((canal) => (
                    <div key={canal} className="flex items-center gap-2 text-sm py-1">
                      <ChevronRight className="w-3 h-3" />
                      {canal}
                    </div>
                  ))}
                </div>
              </div>

              {/* Categoria */}
              <div className="col-span-3 bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Categoria</h3>
                <ScrollArea className="h-[180px]">
                  <div className="space-y-1">
                    {pricingCategorias.map((cat) => (
                      <div key={cat} className="flex items-center gap-2 text-sm py-1">
                        <ChevronRight className="w-3 h-3" />
                        <Checkbox id={cat} />
                        <label htmlFor={cat}>{cat}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* KPI Cards */}
              <div className="col-span-7 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Vendas Ano-1</div>
                  <div className="text-2xl font-bold">4.250.000 €</div>
                </div>
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Orçamento</div>
                  <div className="text-2xl font-bold">4.850.000 €</div>
                </div>
                <div className="bg-white rounded-lg border p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Orçamento vs Vendas Ano-1</div>
                  <div className="text-2xl font-bold text-green-600">+14,1%</div>
                </div>
                <div className="col-span-3 bg-white rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground mb-2">Categorias &nbsp; Total</div>
                  <div className="text-sm font-medium">Vinhos V&W - Todas as Categorias</div>
                </div>
              </div>
            </div>

            {/* Toolbar and Grid */}
            <div className="bg-white rounded-lg border">
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
              
              <ScrollArea className="h-[300px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b bg-gray-100">
                      <th className="text-left py-2 px-3 font-medium" colSpan={2}>Total</th>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3"></th>
                      <th className="text-center py-2 px-3 font-medium">Preço/Cx9L</th>
                      <th className="text-center py-2 px-3 font-medium">Total</th>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-3">
                        <Minus className="w-3 h-3" />
                      </td>
                      <td className="text-center py-2 px-3">Média: 72,50 €</td>
                      <td className="text-center py-2 px-3">4.850.000 €</td>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingProdutosData.map((produto) => (
                      <tr key={produto} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 pl-6">{produto}</td>
                        <td className="text-center py-2 px-3">
                          <input 
                            type="text" 
                            className="w-20 text-center border rounded px-2 py-1 text-sm"
                            defaultValue=""
                            placeholder="€/Cx9L"
                          />
                        </td>
                        <td className="text-center py-2 px-3">0,00 €</td>
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

export default PricingPage;
