import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Grape, FlaskConical, Wine, Package, Truck, 
  Factory, Briefcase, Megaphone, TrendingDown, Landmark, HelpCircle, ShoppingCart,
  Settings, ArrowRight, Percent, MousePointerClick
} from "lucide-react";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostCenterDialog, type CostCenterAllocation, allCostCenters } from "@/components/configuracao/CostCenterDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ========== Types ==========
type VolumeUnit = "cx9L" | "L" | "Kg";

interface AreaProducao {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  costPct: number;
  volumeUnit: VolumeUnit;
  volumeLabel: string;
  defaultVolume: number;
}

const unitLabels: Record<VolumeUnit, string> = { cx9L: "Cx 9L", L: "Litros", Kg: "Kg" };

const areasProducao: AreaProducao[] = [
  { id: "agricultura", label: "Agricultura / Viticultura", icon: Grape, description: "Custos de vinha, cultivo, colheita", costPct: 22, volumeUnit: "Kg", volumeLabel: "Produção (Kg)", defaultVolume: 2500000 },
  { id: "vinificacao", label: "Vinificação", icon: FlaskConical, description: "Transformação de uva em vinho", costPct: 14, volumeUnit: "Kg", volumeLabel: "Uva entrada (Kg)", defaultVolume: 2500000 },
  { id: "estagio", label: "Estágio / Envelhecimento", icon: Wine, description: "Cuba, barrica e garrafa", costPct: 7, volumeUnit: "L", volumeLabel: "Vinho em estágio (L)", defaultVolume: 1850000 },
  { id: "engarrafamento", label: "Engarrafamento & Secos", icon: Package, description: "Embalagem, rotulagem, materiais secos", costPct: 10, volumeUnit: "L", volumeLabel: "Engarrafado (L)", defaultVolume: 1750000 },
  { id: "distribuicao", label: "Distribuição & Logística", icon: Truck, description: "Transporte, armazenamento, expedição", costPct: 12, volumeUnit: "cx9L", volumeLabel: "Expedição (Cx 9L)", defaultVolume: 194000 },
];

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

// All areas combined for the matrix
const allAreas = [
  ...areasProducao.map(a => ({ id: a.id, label: a.label, icon: a.icon, type: "producao" as const })),
  ...defaultTransversais.map(t => ({ id: t.id, label: t.label, icon: t.icon, type: "transversal" as const })),
];

type DistributionMatrix = Record<string, Record<string, number>>;

const buildDefaultDistribution = (): DistributionMatrix => {
  const matrix: DistributionMatrix = {};
  defaultTransversais.forEach(t => {
    matrix[t.id] = {};
    areasProducao.forEach(a => {
      matrix[t.id][a.id] = Math.round(100 / areasProducao.length);
    });
    const sum = Object.values(matrix[t.id]).reduce((s, v) => s + v, 0);
    matrix[t.id][areasProducao[areasProducao.length - 1].id] += (100 - sum);
  });
  return matrix;
};

// CC → Area distribution matrix: each CC distributes 100% across areas
type CCDistMatrix = Record<string, Record<string, number>>; // ccId -> areaId -> %

const buildDefaultCCDist = (): CCDistMatrix => {
  const matrix: CCDistMatrix = {};
  allCostCenters.forEach(cc => {
    matrix[cc.id] = {};
    // Default: assign 100% to the matching group area
    const groupMap: Record<string, string> = {
      "Agricultura": "agricultura",
      "Vinificação": "vinificacao",
      "Estágio": "estagio",
      "Engarrafamento": "engarrafamento",
      "Distribuição": "distribuicao",
    };
    const defaultArea = groupMap[cc.group];
    allAreas.forEach(a => {
      matrix[cc.id][a.id] = a.id === defaultArea ? 100 : 0;
    });
    // Transversal CCs: split evenly across production areas
    if (!defaultArea) {
      areasProducao.forEach(a => {
        matrix[cc.id][a.id] = Math.round(100 / areasProducao.length);
      });
      const sum = areasProducao.reduce((s, a) => s + (matrix[cc.id][a.id] || 0), 0);
      matrix[cc.id][areasProducao[areasProducao.length - 1].id] += (100 - sum);
    }
  });
  return matrix;
};

const formatVolume = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toFixed(0);
};

const formatCurrency = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M €`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K €`;
  return `${val.toFixed(0)} €`;
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
  const [volumes, setVolumes] = useState<Record<string, number>>(
    () => Object.fromEntries(areasProducao.map(a => [a.id, a.defaultVolume]))
  );
  const [ccDistMatrix, setCcDistMatrix] = useState<CCDistMatrix>(buildDefaultCCDist);

  // Cost center allocations per area (for dialog)
  const [ccAllocations, setCcAllocations] = useState<Record<string, CostCenterAllocation[]>>({});
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  const totalProducao = Object.values(producaoCosts).reduce((s, v) => s + v, 0);
  const totalTransversais = Object.values(transversaisCosts).reduce((s, v) => s + v, 0);
  const cashLivre = 100 - totalProducao - totalTransversais;

  const handleDistChange = (transId: string, areaId: string, val: string) => {
    setDistribution(prev => ({
      ...prev,
      [transId]: { ...prev[transId], [areaId]: parseFloat(val) || 0 }
    }));
  };

  const handleCCDistChange = (ccId: string, areaId: string, val: string) => {
    setCcDistMatrix(prev => ({
      ...prev,
      [ccId]: { ...prev[ccId], [areaId]: parseFloat(val) || 0 }
    }));
  };

  // Cost allocated to each area from CC distribution
  const costByAreaFromCC = useMemo(() => {
    const result: Record<string, number> = {};
    areasProducao.forEach(a => { result[a.id] = 0; });
    defaultTransversais.forEach(t => { result[t.id] = 0; });
    
    allCostCenters.forEach(cc => {
      const dist = ccDistMatrix[cc.id] || {};
      Object.entries(dist).forEach(([areaId, pct]) => {
        if (result[areaId] !== undefined) {
          result[areaId] += cc.cost * pct / 100;
        }
      });
    });
    return result;
  }, [ccDistMatrix]);

  const totalByArea = areasProducao.map(area => {
    const direct = producaoCosts[area.id] || 0;
    const allocated = defaultTransversais.reduce((sum, t) => {
      const tCost = transversaisCosts[t.id] || 0;
      const pct = distribution[t.id]?.[area.id] || 0;
      return sum + (tCost * pct / 100);
    }, 0);
    const ccCost = costByAreaFromCC[area.id] || 0;
    return { ...area, direct, allocated: +allocated.toFixed(2), total: +(direct + allocated).toFixed(2), ccCost };
  });

  const getCcCount = (areaId: string) => (ccAllocations[areaId] || []).length;
  const getCcValid = (areaId: string) => {
    const allocs = ccAllocations[areaId] || [];
    if (allocs.length === 0) return null;
    const total = allocs.reduce((s, a) => s + a.pct, 0);
    return Math.abs(total - 100) < 0.5;
  };

  const openDialog = dialogOpen
    ? [...areasProducao.map(a => ({ id: a.id, label: a.label, icon: a.icon })),
       ...defaultTransversais.map(t => ({ id: t.id, label: t.label, icon: t.icon }))
      ].find(x => x.id === dialogOpen)
    : null;

  // Only production areas for the CC matrix columns
  const productionAreaIds = areasProducao.map(a => a.id);

  return (
    <TooltipProvider>
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
                <TabsTrigger value="distribuicao" className="text-xs">Distribuição Transversais</TabsTrigger>
                <TabsTrigger value="ccmatrix" className="text-xs">Matriz CC → Áreas</TabsTrigger>
                <TabsTrigger value="volumes" className="text-xs">Custos & Volumes</TabsTrigger>
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
                    <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" /> Clique para associar centros de custo
                    </span>
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {areasProducao.map(area => {
                      const Icon = area.icon;
                      const ccCount = getCcCount(area.id);
                      const ccValid = getCcValid(area.id);
                      const ccCost = costByAreaFromCC[area.id] || 0;
                      return (
                        <Card
                          key={area.id}
                          className="hover:shadow-md transition-shadow cursor-pointer group"
                          onClick={() => setDialogOpen(area.id)}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-eps-primary/10 flex items-center justify-center group-hover:bg-eps-primary/20 transition-colors">
                              <Icon className="w-6 h-6 text-eps-primary" />
                            </div>
                            <span className="text-xs font-semibold">{area.label}</span>
                            <span className="text-[10px] text-muted-foreground leading-tight">{area.description}</span>
                            <div className="flex items-center gap-1 mt-1" onClick={e => e.stopPropagation()}>
                              <Input
                                type="number"
                                value={producaoCosts[area.id]}
                                onChange={e => setProducaoCosts(prev => ({ ...prev, [area.id]: parseFloat(e.target.value) || 0 }))}
                                className="w-16 h-7 text-xs text-center"
                                min={0} step={0.5}
                              />
                              <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                            {/* CC cost from matrix */}
                            {ccCost > 0 && (
                              <Badge variant="secondary" className="text-[9px]">
                                {formatCurrency(ccCost)}
                              </Badge>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant={ccValid === true ? "default" : ccValid === false ? "destructive" : "outline"}
                                  className="text-[9px] mt-1"
                                >
                                  {ccCount} CC {ccValid === true ? '✓' : ccValid === false ? '≠100%' : '—'}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                {ccCount === 0
                                  ? "Sem centros de custo associados"
                                  : `${ccCount} centro(s) de custo — ${ccValid ? '100% distribuído' : 'distribuição incompleta'}`}
                              </TooltipContent>
                            </Tooltip>
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
                    <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" /> Clique para associar centros de custo
                    </span>
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {defaultTransversais.map(area => {
                      const Icon = area.icon;
                      const ccCount = getCcCount(area.id);
                      const ccValid = getCcValid(area.id);
                      return (
                        <Card
                          key={area.id}
                          className="hover:shadow-md transition-shadow border-amber-100 cursor-pointer group"
                          onClick={() => setDialogOpen(area.id)}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                              <Icon className="w-5 h-5 text-amber-700" />
                            </div>
                            <span className="text-xs font-semibold">{area.label}</span>
                            <span className="text-[10px] text-muted-foreground leading-tight">{area.description}</span>
                            <div className="flex items-center gap-1 mt-1" onClick={e => e.stopPropagation()}>
                              <Input
                                type="number"
                                value={transversaisCosts[area.id]}
                                onChange={e => setTransversaisCosts(prev => ({ ...prev, [area.id]: parseFloat(e.target.value) || 0 }))}
                                className="w-16 h-7 text-xs text-center"
                                min={0} step={0.5}
                              />
                              <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant={ccValid === true ? "default" : ccValid === false ? "destructive" : "outline"}
                                  className="text-[9px] mt-1"
                                >
                                  {ccCount} CC {ccValid === true ? '✓' : ccValid === false ? '≠100%' : '—'}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                {ccCount === 0
                                  ? "Sem centros de custo associados"
                                  : `${ccCount} centro(s) de custo — ${ccValid ? '100% distribuído' : 'distribuição incompleta'}`}
                              </TooltipContent>
                            </Tooltip>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* ============= TAB 2: Distribution Matrix (transversais) ============= */}
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

              {/* ============= TAB 3: CC → Áreas Matrix ============= */}
              <TabsContent value="ccmatrix" className="space-y-6">
                <p className="text-xs text-muted-foreground">
                  Para cada centro de custo, distribua 100% do seu custo pelas áreas de produção. O custo de cada área = soma dos custos dos CCs alocados.
                </p>

                <ScrollArea className="rounded-md border" style={{ maxHeight: "600px" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold min-w-[220px] sticky left-0 bg-muted/50 z-10">Centro de Custo</TableHead>
                        <TableHead className="text-xs font-semibold text-center min-w-[90px]">Custo Total</TableHead>
                        {areasProducao.map(a => {
                          const Icon = a.icon;
                          return (
                            <TableHead key={a.id} className="text-center min-w-[80px]">
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
                      {allCostCenters.map(cc => {
                        const rowSum = areasProducao.reduce((s, a) => s + (ccDistMatrix[cc.id]?.[a.id] || 0), 0);
                        const isValid = Math.abs(rowSum - 100) < 0.5;
                        return (
                          <TableRow key={cc.id} className={`text-xs ${!isValid ? 'bg-destructive/5' : ''}`}>
                            <TableCell className="sticky left-0 bg-background z-10">
                              <div>
                                <span className="font-medium">{cc.name}</span>
                                <span className="block text-[10px] text-muted-foreground">{cc.group}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-[10px]">{formatCurrency(cc.cost)}</Badge>
                            </TableCell>
                            {areasProducao.map(a => (
                              <TableCell key={a.id} className="text-center p-1">
                                <Input
                                  type="number"
                                  value={ccDistMatrix[cc.id]?.[a.id] ?? 0}
                                  onChange={e => handleCCDistChange(cc.id, a.id, e.target.value)}
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
                      {/* Totals row */}
                      <TableRow className="bg-muted/30 font-semibold text-xs border-t-2">
                        <TableCell className="sticky left-0 bg-muted/30 z-10">
                          <span className="font-bold">Total Alocado por Área</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="text-[10px]">
                            {formatCurrency(allCostCenters.reduce((s, cc) => s + cc.cost, 0))}
                          </Badge>
                        </TableCell>
                        {areasProducao.map(a => {
                          const areaCost = costByAreaFromCC[a.id] || 0;
                          return (
                            <TableCell key={a.id} className="text-center">
                              <span className="font-bold text-eps-primary">{formatCurrency(areaCost)}</span>
                            </TableCell>
                          );
                        })}
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              {/* ============= TAB 4: Custos & Volumes ============= */}
              <TabsContent value="volumes" className="space-y-6">
                <p className="text-xs text-muted-foreground">
                  Custos totais por área com rácios €/unidade. Cada área utiliza a unidade de medida relevante para calcular o custo unitário.
                </p>

                {/* Production areas */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-eps-primary" />
                    Áreas de Produção
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {totalByArea.map(area => {
                      const Icon = area.icon;
                      const areaData = areasProducao.find(a => a.id === area.id)!;
                      const vol = volumes[area.id] || 0;
                      const ccCost = costByAreaFromCC[area.id] || 0;
                      const costPerUnit = vol > 0 ? ccCost / vol : 0;
                      return (
                        <Card key={area.id} className="border-eps-primary/20 hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-eps-primary/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-eps-primary" />
                            </div>
                            <span className="text-xs font-semibold">{area.label}</span>

                            <Badge variant="outline" className="text-[9px]">
                              {unitLabels[areaData.volumeUnit]}
                            </Badge>

                            {/* Volume input */}
                            <div className="w-full space-y-1" onClick={e => e.stopPropagation()}>
                              <label className="text-[10px] text-muted-foreground">{areaData.volumeLabel}</label>
                              <Input
                                type="number"
                                value={vol}
                                onChange={e => setVolumes(prev => ({ ...prev, [area.id]: parseFloat(e.target.value) || 0 }))}
                                className="h-7 text-xs text-center"
                                min={0} step={1000}
                              />
                              <p className="text-[10px] text-muted-foreground">{formatVolume(vol)} {unitLabels[areaData.volumeUnit]}</p>
                            </div>

                            {/* Cost summary */}
                            <div className="w-full border-t pt-2 mt-1 space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Custo %</span>
                                <span className="font-semibold">{area.total}%</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Custo CC</span>
                                <span className="font-medium text-eps-primary">{formatCurrency(ccCost)}</span>
                              </div>
                              {/* Cost per unit ratio */}
                              <div className="flex justify-between text-[10px] bg-eps-primary/5 rounded p-1">
                                <span className="text-muted-foreground font-medium">€/{unitLabels[areaData.volumeUnit]}</span>
                                <span className="font-bold text-eps-primary">{costPerUnit.toFixed(2)} €</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Transversal areas: Comercial & Marketing */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
                    <Percent className="h-3 w-3 text-amber-600" />
                    Áreas Transversais — Custos & Volumes
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    {defaultTransversais.map(trans => {
                      const Icon = trans.icon;
                      const ccCost = costByAreaFromCC[trans.id] || 0;
                      const costPct = transversaisCosts[trans.id] || 0;
                      // Transversal areas use Cx 9L as reference volume (total distribution volume)
                      const refVolume = volumes["distribuicao"] || 194000;
                      const costPerCx = refVolume > 0 ? ccCost / refVolume : 0;
                      return (
                        <Card key={trans.id} className="border-amber-200/50 hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-amber-700" />
                            </div>
                            <span className="text-xs font-semibold">{trans.label}</span>
                            <Badge variant="outline" className="text-[9px] border-amber-300">
                              % Vendas
                            </Badge>

                            <div className="w-full border-t pt-2 mt-1 space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Custo %</span>
                                <span className="font-semibold text-amber-700">{costPct.toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Custo CC</span>
                                <span className="font-medium text-amber-700">{formatCurrency(ccCost)}</span>
                              </div>
                              {ccCost > 0 && (
                                <div className="flex justify-between text-[10px] bg-amber-50 rounded p-1">
                                  <span className="text-muted-foreground font-medium">€/Cx 9L</span>
                                  <span className="font-bold text-amber-700">{costPerCx.toFixed(2)} €</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Global summary */}
                <Card className="border-sky-200 bg-sky-50/30">
                  <CardContent className="p-4">
                    <h4 className="text-xs font-semibold mb-3">Resumo Global de Volumes & Rácios</h4>
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {totalByArea.map(area => {
                        const areaData = areasProducao.find(a => a.id === area.id)!;
                        const vol = volumes[area.id] || 0;
                        const ccCost = costByAreaFromCC[area.id] || 0;
                        const costPerUnit = vol > 0 ? ccCost / vol : 0;
                        return (
                          <div key={area.id} className="text-center space-y-1">
                            <p className="text-[10px] text-muted-foreground font-medium">{area.label.split(' ')[0]}</p>
                            <p className="text-sm font-bold text-foreground">
                              {formatVolume(vol)} <span className="text-[10px] font-normal text-muted-foreground">{unitLabels[areaData.volumeUnit]}</span>
                            </p>
                            <p className="text-xs font-semibold text-eps-primary">
                              {costPerUnit.toFixed(2)} €/{unitLabels[areaData.volumeUnit]}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{formatCurrency(ccCost)}</p>
                          </div>
                        );
                      })}
                    </div>
                    {/* Transversal summary */}
                    <div className="border-t pt-3">
                      <p className="text-[10px] text-muted-foreground font-medium mb-2">Custos Transversais</p>
                      <div className="grid grid-cols-7 gap-3">
                        {defaultTransversais.map(trans => {
                          const ccCost = costByAreaFromCC[trans.id] || 0;
                          return (
                            <div key={trans.id} className="text-center space-y-1">
                              <p className="text-[10px] text-muted-foreground font-medium">{trans.label.split(' ')[0]}</p>
                              <p className="text-xs font-semibold text-amber-700">{transversaisCosts[trans.id]}%</p>
                              {ccCost > 0 && (
                                <p className="text-[10px] text-muted-foreground">{formatCurrency(ccCost)}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* Cost Center Dialog */}
        {openDialog && (
          <CostCenterDialog
            open={!!dialogOpen}
            onOpenChange={(v) => { if (!v) setDialogOpen(null); }}
            areaLabel={openDialog.label}
            areaIcon={openDialog.icon}
            allocations={ccAllocations[openDialog.id] || []}
            onAllocationsChange={(allocs) => setCcAllocations(prev => ({ ...prev, [openDialog.id]: allocs }))}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default ConfiguracaoFinanceiraPage;
