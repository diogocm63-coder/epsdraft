import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Grape, FlaskConical, Wine, Package, Truck, 
  Factory, Briefcase, Megaphone, TrendingDown, Landmark, HelpCircle, ShoppingCart,
  Settings, ArrowRight, Percent
} from "lucide-react";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ========== Value Chain Areas (Production) ==========
interface AreaProducao {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  costPct: number;
}

const areasProducao: AreaProducao[] = [
  { id: "agricultura", label: "Agricultura / Viticultura", icon: Grape, description: "Custos de vinha, cultivo, colheita", costPct: 22 },
  { id: "vinificacao", label: "Vinificação", icon: FlaskConical, description: "Transformação de uva em vinho", costPct: 14 },
  { id: "estagio", label: "Estágio / Envelhecimento", icon: Wine, description: "Cuba, barrica e garrafa", costPct: 7 },
  { id: "engarrafamento", label: "Engarrafamento & Secos", icon: Package, description: "Embalagem, rotulagem, materiais secos", costPct: 10 },
  { id: "distribuicao", label: "Distribuição & Logística", icon: Truck, description: "Transporte, armazenamento, expedição", costPct: 12 },
];

// ========== Transversal Areas (Overhead) ==========
interface AreaTransversal {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  costPct: number;
}

const defaultTransversais: AreaTransversal[] = [
  { id: "ggf", label: "Gastos Gerais de Fabrico", icon: Factory, description: "Custos indirectos de produção", costPct: 5 },
  { id: "admin", label: "Gastos Administrativos", icon: Briefcase, description: "Gestão, contabilidade, RH", costPct: 4 },
  { id: "comercial", label: "Gastos Comerciais", icon: ShoppingCart, description: "Equipa comercial, comissões", costPct: 3 },
  { id: "marketing", label: "Marketing & Comunicação", icon: Megaphone, description: "Promoção, branding, eventos", costPct: 2 },
  { id: "amortizacoes", label: "Amortizações & Depreciações", icon: TrendingDown, description: "Activos fixos, equipamentos", costPct: 3 },
  { id: "financeiros", label: "Gastos Financeiros", icon: Landmark, description: "Juros, seguros, garantias", costPct: 2 },
  { id: "outros", label: "Outros Custos Indirectos", icon: HelpCircle, description: "Diversos não classificados", costPct: 1 },
];

// Distribution matrix: transversal area -> value chain area -> %
type DistributionMatrix = Record<string, Record<string, number>>;

const buildDefaultDistribution = (): DistributionMatrix => {
  const matrix: DistributionMatrix = {};
  defaultTransversais.forEach(t => {
    matrix[t.id] = {};
    areasProducao.forEach(a => {
      // Default even distribution
      matrix[t.id][a.id] = Math.round(100 / areasProducao.length);
    });
    // Adjust last to reach 100
    const sum = Object.values(matrix[t.id]).reduce((s, v) => s + v, 0);
    matrix[t.id][areasProducao[areasProducao.length - 1].id] += (100 - sum);
  });
  return matrix;
};

const ConfiguracaoFinanceiraPage = () => {
  const navigate = useNavigate();
  const [producaoCosts, setProducaoCosts] = useState<Record<string, number>>(
    () => Object.fromEntries(areasProducao.map(a => [a.id, a.costPct]))
  );
  const [transversaisCosts, setTransversaisCosts] = useState<Record<string, number>>(
    () => Object.fromEntries(defaultTransversais.map(t => [t.id, t.costPct]))
  );
  const [distribution, setDistribution] = useState<DistributionMatrix>(buildDefaultDistribution);

  const totalProducao = Object.values(producaoCosts).reduce((s, v) => s + v, 0);
  const totalTransversais = Object.values(transversaisCosts).reduce((s, v) => s + v, 0);
  const cashLivre = 100 - totalProducao - totalTransversais;

  const handleDistChange = (transId: string, areaId: string, val: string) => {
    setDistribution(prev => ({
      ...prev,
      [transId]: { ...prev[transId], [areaId]: parseFloat(val) || 0 }
    }));
  };

  // Calculate total cost per value chain area (direct + allocated transversal)
  const totalByArea = areasProducao.map(area => {
    const direct = producaoCosts[area.id] || 0;
    const allocated = defaultTransversais.reduce((sum, t) => {
      const tCost = transversaisCosts[t.id] || 0;
      const pct = distribution[t.id]?.[area.id] || 0;
      return sum + (tCost * pct / 100);
    }, 0);
    return { ...area, direct, allocated: +allocated.toFixed(2), total: +(direct + allocated).toFixed(2) };
  });

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="financeira"
        onConfigItemChange={() => {}}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Configuração Financeira" icon={<Settings className="w-4 h-4" />} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="areas" className="space-y-6">
            <TabsList className="h-9">
              <TabsTrigger value="areas" className="text-xs">Áreas & Centros de Custo</TabsTrigger>
              <TabsTrigger value="distribuicao" className="text-xs">Distribuição de Custos Transversais</TabsTrigger>
            </TabsList>

            {/* ============= TAB 1: Areas ============= */}
            <TabsContent value="areas" className="space-y-6">
              {/* Summary banner */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Custos Produção</p>
                    <p className="text-2xl font-bold text-emerald-700">{totalProducao.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Custos Transversais</p>
                    <p className="text-2xl font-bold text-amber-700">{totalTransversais.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="border-sky-200 bg-sky-50/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Cash Livre % Vendas</p>
                    <p className={`text-2xl font-bold ${cashLivre >= 20 ? 'text-sky-700' : cashLivre >= 10 ? 'text-amber-700' : 'text-destructive'}`}>
                      {cashLivre.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Value Chain Areas */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-eps-primary" />
                  Áreas da Cadeia de Valor (Custos Directos)
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {areasProducao.map(area => {
                    const Icon = area.icon;
                    return (
                      <Card key={area.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-eps-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-eps-primary" />
                          </div>
                          <span className="text-xs font-semibold">{area.label}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight">{area.description}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Input
                              type="number"
                              value={producaoCosts[area.id]}
                              onChange={e => setProducaoCosts(prev => ({ ...prev, [area.id]: parseFloat(e.target.value) || 0 }))}
                              className="w-16 h-7 text-xs text-center"
                              min={0} step={0.5}
                            />
                            <span className="text-[10px] text-muted-foreground">%</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Transversal Areas */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-amber-600" />
                  Áreas Transversais (Custos Indirectos % Vendas)
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {defaultTransversais.map(area => {
                    const Icon = area.icon;
                    return (
                      <Card key={area.id} className="hover:shadow-md transition-shadow border-amber-100">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-amber-700" />
                          </div>
                          <span className="text-xs font-semibold">{area.label}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight">{area.description}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Input
                              type="number"
                              value={transversaisCosts[area.id]}
                              onChange={e => setTransversaisCosts(prev => ({ ...prev, [area.id]: parseFloat(e.target.value) || 0 }))}
                              className="w-16 h-7 text-xs text-center"
                              min={0} step={0.5}
                            />
                            <span className="text-[10px] text-muted-foreground">%</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* ============= TAB 2: Distribution Matrix ============= */}
            <TabsContent value="distribuicao" className="space-y-6">
              <p className="text-xs text-muted-foreground">
                Defina como cada custo transversal é distribuído pelas áreas da cadeia de valor (em %). O total de cada linha deve somar 100%.
              </p>

              <ScrollArea className="rounded-md border" style={{ maxHeight: "500px" }}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold min-w-[200px]">Custo Transversal</TableHead>
                      <TableHead className="text-xs font-semibold text-center">% Vendas</TableHead>
                      {areasProducao.map(a => {
                        const Icon = a.icon;
                        return (
                          <TableHead key={a.id} className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Icon className="w-4 h-4 text-eps-primary" />
                              <span className="text-[10px] font-medium leading-tight">{a.label.split(' ')[0]}</span>
                            </div>
                          </TableHead>
                        );
                      })}
                      <TableHead className="text-xs font-semibold text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaultTransversais.map(t => {
                      const Icon = t.icon;
                      const rowSum = areasProducao.reduce((s, a) => s + (distribution[t.id]?.[a.id] || 0), 0);
                      const isValid = Math.abs(rowSum - 100) < 0.5;
                      return (
                        <TableRow key={t.id} className="text-xs">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-amber-700" />
                              </div>
                              <span className="font-medium">{t.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-[10px]">{transversaisCosts[t.id]}%</Badge>
                          </TableCell>
                          {areasProducao.map(a => (
                            <TableCell key={a.id} className="text-center p-1">
                              <Input
                                type="number"
                                value={distribution[t.id]?.[a.id] ?? 0}
                                onChange={e => handleDistChange(t.id, a.id, e.target.value)}
                                className="w-14 h-7 text-xs text-center mx-auto"
                                min={0} max={100} step={5}
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <span className={`text-xs font-semibold ${isValid ? 'text-emerald-600' : 'text-destructive'}`}>
                              {rowSum.toFixed(0)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Result: Total cost per value chain area */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Custo Total por Área (Directo + Alocado)</h3>
                <div className="grid grid-cols-5 gap-3">
                  {totalByArea.map(area => {
                    const Icon = area.icon;
                    return (
                      <Card key={area.id} className="border-eps-primary/20">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
                          <div className="w-10 h-10 rounded-full bg-eps-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-eps-primary" />
                          </div>
                          <span className="text-xs font-semibold">{area.label.split(' ')[0]}</span>
                          <div className="text-[10px] text-muted-foreground space-y-0.5">
                            <div>Directo: <span className="font-medium text-foreground">{area.direct}%</span></div>
                            <div>Alocado: <span className="font-medium text-amber-600">{area.allocated}%</span></div>
                          </div>
                          <Badge className="mt-1 text-xs">{area.total}%</Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracaoFinanceiraPage;
