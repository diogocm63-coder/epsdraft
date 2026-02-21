import { useState, useMemo, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, ArrowRight, Settings2, TrendingUp } from 'lucide-react';
import { wineProducts, wineCategorias, wineTipos, wineRegioes } from '@/data/wineData';

// Seasonal distribution weights by month (index 0=Jan) for each wine color
const SEASONAL_WEIGHTS: Record<string, number[]> = {
  'Branco': [5, 5, 7, 8, 10, 13, 15, 14, 9, 6, 4, 4],
  'Tinto':  [9, 8, 8, 7, 7, 6, 6, 6, 9, 12, 11, 11],
  'Rosé':   [5, 5, 8, 10, 13, 14, 15, 13, 8, 4, 3, 2],
};

const computeAvgSaleDays = (tipo: string): number => {
  const weights = SEASONAL_WEIGHTS[tipo] || SEASONAL_WEIGHTS['Tinto'];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let weightedSum = 0;
  weights.forEach((w, i) => { weightedSum += w * (i * 30 + 15); });
  return Math.round(weightedSum / totalWeight);
};

// Production phase durations (internal cycle)
interface PhaseConfig {
  colheita: number;
  vinificacao: number;
  estagio: number;
  engarrafamento: number;
}

// External payment terms
interface PrazosExternos {
  pagamentoUvasProprias: number;
  pagamentoUvasCompradas: number;
  pagamentoVinho: number;
  pagamentoSecos: number; // packaging/labeling aligned with bottling
  prazoRecebimento: number;
}

// Cost structure as % of sales revenue
interface CustoCategoria {
  custoUvas: number;
  custoVinificacao: number;
  custoEstagio: number;
  custoEngarrafSecos: number;
  custoDistribuicao: number;
  pesoVendas: number; // % of total sales this category represents
}

// Sales mix by wine type
const DEFAULT_MIX_TIPO: Record<string, number> = {
  'Tinto': 55,
  'Branco': 30,
  'Rosé': 15,
};

// Overhead / transversal costs as % of sales (not included in production costs)
interface CustosTransversais {
  gastosGeraisFabrico: number;
  gastosAdministrativos: number;
  gastosComerciais: number;
  marketing: number;
  amortizacoes: number;
  gastosFinanceiros: number;
  outros: number;
}

const DEFAULT_CUSTOS_TRANSVERSAIS: CustosTransversais = {
  gastosGeraisFabrico: 5,
  gastosAdministrativos: 4,
  gastosComerciais: 3,
  marketing: 2,
  amortizacoes: 3,
  gastosFinanceiros: 2,
  outros: 1,
};

const DEFAULT_PHASE_CONFIG: Record<string, PhaseConfig> = {
  'Mesa':     { colheita: 15, vinificacao: 30, estagio: 60,  engarrafamento: 15 },
  'Regional': { colheita: 15, vinificacao: 45, estagio: 180, engarrafamento: 15 },
  'Reserva':  { colheita: 15, vinificacao: 60, estagio: 365, engarrafamento: 15 },
  'Premium':  { colheita: 15, vinificacao: 90, estagio: 730, engarrafamento: 15 },
};

const DEFAULT_PRAZOS_EXTERNOS: Record<string, PrazosExternos> = {
  'Mesa':     { pagamentoUvasProprias: 0, pagamentoUvasCompradas: 30, pagamentoVinho: 60, pagamentoSecos: 30, prazoRecebimento: 60 },
  'Regional': { pagamentoUvasProprias: 0, pagamentoUvasCompradas: 30, pagamentoVinho: 60, pagamentoSecos: 30, prazoRecebimento: 60 },
  'Reserva':  { pagamentoUvasProprias: 0, pagamentoUvasCompradas: 45, pagamentoVinho: 90, pagamentoSecos: 30, prazoRecebimento: 90 },
  'Premium':  { pagamentoUvasProprias: 0, pagamentoUvasCompradas: 45, pagamentoVinho: 90, pagamentoSecos: 30, prazoRecebimento: 90 },
};

const DEFAULT_CUSTOS: Record<string, CustoCategoria> = {
  'Mesa':     { custoUvas: 25, custoVinificacao: 10, custoEstagio: 3,  custoEngarrafSecos: 12, custoDistribuicao: 15, pesoVendas: 20 },
  'Regional': { custoUvas: 22, custoVinificacao: 12, custoEstagio: 5,  custoEngarrafSecos: 10, custoDistribuicao: 12, pesoVendas: 35 },
  'Reserva':  { custoUvas: 20, custoVinificacao: 15, custoEstagio: 8,  custoEngarrafSecos: 8,  custoDistribuicao: 10, pesoVendas: 30 },
  'Premium':  { custoUvas: 18, custoVinificacao: 18, custoEstagio: 12, custoEngarrafSecos: 7,  custoDistribuicao: 8,  pesoVendas: 15 },
};

const COMPRA_VINHO_ANTES_ENGARRAF = 30;

interface ProductFinancialRow {
  produto: string;
  regiao: string;
  categoria: string;
  tipo: string;
  colheita: number;
  vinificacao: number;
  estagio: number;
  engarrafamento: number;
  vendaMedia: number;
  prazoRecebimento: number;
  pagamentoUvas: number;
  pagamentoSecos: number;
  totalCiclo: number;
  diasFinanciamento: number;
  seasonalLabel: string;
}

const PHASES_DISPLAY = [
  { key: 'colheita', label: 'Colheita', color: 'bg-green-600' },
  { key: 'vinificacao', label: 'Vinificação', color: 'bg-purple-500' },
  { key: 'estagio', label: 'Estágio', color: 'bg-amber-600' },
  { key: 'engarrafamento', label: 'Engarraf.', color: 'bg-sky-600' },
  { key: 'vendaMedia', label: 'Venda Média', color: 'bg-emerald-500' },
  { key: 'prazoRecebimento', label: 'Recebimento', color: 'bg-orange-500' },
] as const;

// ========== Prazos Dialog ==========
function PrazosDialog({ 
  phaseConfigs, prazosExternos, custos, custosTransversais,
  onUpdatePhases, onUpdatePrazos, onUpdateCustos, onUpdateCustosTransversais
}: {
  phaseConfigs: Record<string, PhaseConfig>;
  prazosExternos: Record<string, PrazosExternos>;
  custos: Record<string, CustoCategoria>;
  custosTransversais: CustosTransversais;
  onUpdatePhases: (v: Record<string, PhaseConfig>) => void;
  onUpdatePrazos: (v: Record<string, PrazosExternos>) => void;
  onUpdateCustos: (v: Record<string, CustoCategoria>) => void;
  onUpdateCustosTransversais: (v: CustosTransversais) => void;
}) {
  const [localPhases, setLocalPhases] = useState(() => JSON.parse(JSON.stringify(phaseConfigs)));
  const [localPrazos, setLocalPrazos] = useState(() => JSON.parse(JSON.stringify(prazosExternos)));
  const [localCustos, setLocalCustos] = useState(() => JSON.parse(JSON.stringify(custos)));
  const [localTransversais, setLocalTransversais] = useState(() => ({ ...custosTransversais }));

  const handlePhaseChange = (cat: string, field: keyof PhaseConfig, val: string) => {
    setLocalPhases((prev: Record<string, PhaseConfig>) => ({ ...prev, [cat]: { ...prev[cat], [field]: parseInt(val) || 0 } }));
  };
  const handlePrazoChange = (cat: string, field: keyof PrazosExternos, val: string) => {
    setLocalPrazos((prev: Record<string, PrazosExternos>) => ({ ...prev, [cat]: { ...prev[cat], [field]: parseInt(val) || 0 } }));
  };
  const handleCustoChange = (cat: string, field: keyof CustoCategoria, val: string) => {
    setLocalCustos((prev: Record<string, CustoCategoria>) => ({ ...prev, [cat]: { ...prev[cat], [field]: parseFloat(val) || 0 } }));
  };
  const handleTransversalChange = (field: keyof CustosTransversais, val: string) => {
    setLocalTransversais((prev: CustosTransversais) => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const applyAll = () => {
    onUpdatePhases(localPhases);
    onUpdatePrazos(localPrazos);
    onUpdateCustos(localCustos);
    onUpdateCustosTransversais(localTransversais);
  };

  const phaseFields: { key: keyof PhaseConfig; label: string }[] = [
    { key: 'colheita', label: 'Colheita' },
    { key: 'vinificacao', label: 'Vinificação' },
    { key: 'estagio', label: 'Estágio' },
    { key: 'engarrafamento', label: 'Engarraf.' },
  ];

  const prazoFields: { key: keyof PrazosExternos; label: string }[] = [
    { key: 'pagamentoUvasProprias', label: 'Pgto Uvas Próprias' },
    { key: 'pagamentoUvasCompradas', label: 'Pgto Uvas Compradas' },
    { key: 'pagamentoVinho', label: 'Pgto Vinho (granel)' },
    { key: 'pagamentoSecos', label: 'Pgto Secos (embal./rótul.)' },
    { key: 'prazoRecebimento', label: 'Prazo Recebimento' },
  ];

  const custoFields: { key: keyof CustoCategoria; label: string; suffix: string }[] = [
    { key: 'custoUvas', label: 'Uvas', suffix: '%' },
    { key: 'custoVinificacao', label: 'Vinificação', suffix: '%' },
    { key: 'custoEstagio', label: 'Estágio', suffix: '%' },
    { key: 'custoEngarrafSecos', label: 'Engarraf./Secos', suffix: '%' },
    { key: 'custoDistribuicao', label: 'Distribuição', suffix: '%' },
    { key: 'pesoVendas', label: 'Peso Vendas', suffix: '%' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Editar Prazos & Custos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Configurar Prazos e Estrutura de Custos por Categoria</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="ciclo" className="mt-2">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="ciclo" className="text-xs">Ciclo Produtivo</TabsTrigger>
            <TabsTrigger value="prazos" className="text-xs">Prazos Externos</TabsTrigger>
            <TabsTrigger value="custos" className="text-xs">Custos Produção</TabsTrigger>
            <TabsTrigger value="transversais" className="text-xs">Custos Transversais</TabsTrigger>
          </TabsList>

          <TabsContent value="ciclo" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="text-[11px]">
                  <TableHead className="font-semibold">Categoria</TableHead>
                  {phaseFields.map(f => <TableHead key={f.key} className="text-center font-medium text-[10px]">{f.label}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {wineCategorias.map(cat => (
                  <TableRow key={cat} className="text-xs">
                    <TableCell className="font-medium">{cat}</TableCell>
                    {phaseFields.map(f => (
                      <TableCell key={f.key} className="text-center p-1">
                        <Input type="number" value={localPhases[cat]?.[f.key] ?? 0}
                          onChange={e => handlePhaseChange(cat, f.key, e.target.value)}
                          className="w-16 h-7 text-xs text-center mx-auto" min={0} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="prazos" className="mt-3">
            <p className="text-[10px] text-muted-foreground mb-2">Prazos de pagamento e recebimento externos ao ciclo produtivo.</p>
            <Table>
              <TableHeader>
                <TableRow className="text-[11px]">
                  <TableHead className="font-semibold">Categoria</TableHead>
                  {prazoFields.map(f => <TableHead key={f.key} className="text-center font-medium text-[10px]">{f.label}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {wineCategorias.map(cat => (
                  <TableRow key={cat} className="text-xs">
                    <TableCell className="font-medium">{cat}</TableCell>
                    {prazoFields.map(f => (
                      <TableCell key={f.key} className="text-center p-1">
                        <Input type="number" value={localPrazos[cat]?.[f.key] ?? 0}
                          onChange={e => handlePrazoChange(cat, f.key, e.target.value)}
                          className="w-16 h-7 text-xs text-center mx-auto" min={0} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="custos" className="mt-3">
            <p className="text-[10px] text-muted-foreground mb-2">Estrutura de custos como % das vendas e peso de cada categoria no total de vendas (para cálculo da TIR ponderada).</p>
            <Table>
              <TableHeader>
                <TableRow className="text-[11px]">
                  <TableHead className="font-semibold">Categoria</TableHead>
                  {custoFields.map(f => <TableHead key={f.key} className="text-center font-medium text-[10px]">{f.label}</TableHead>)}
                  <TableHead className="text-center font-medium text-[10px]">Total Custos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wineCategorias.map(cat => {
                  const c = localCustos[cat] as CustoCategoria;
                  const totalCusto = (c?.custoUvas || 0) + (c?.custoVinificacao || 0) + (c?.custoEstagio || 0) + (c?.custoEngarrafSecos || 0) + (c?.custoDistribuicao || 0);
                  return (
                    <TableRow key={cat} className="text-xs">
                      <TableCell className="font-medium">{cat}</TableCell>
                      {custoFields.map(f => (
                        <TableCell key={f.key} className="text-center p-1">
                          <Input type="number" value={localCustos[cat]?.[f.key] ?? 0}
                            onChange={e => handleCustoChange(cat, f.key, e.target.value)}
                            className="w-16 h-7 text-xs text-center mx-auto" min={0} step={0.5} />
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold text-[10px]">
                        <span className={totalCusto > 80 ? 'text-destructive' : totalCusto > 60 ? 'text-amber-600' : 'text-emerald-600'}>
                          {totalCusto.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="transversais" className="mt-3">
            <p className="text-[10px] text-muted-foreground mb-2">
              Custos transversais como % das vendas — não incluídos nos custos de produção directos. Inclui gastos gerais de fabrico, administrativos, comerciais, etc.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {([
                { key: 'gastosGeraisFabrico' as keyof CustosTransversais, label: 'Gastos Gerais de Fabrico' },
                { key: 'gastosAdministrativos' as keyof CustosTransversais, label: 'Gastos Administrativos' },
                { key: 'gastosComerciais' as keyof CustosTransversais, label: 'Gastos Comerciais' },
                { key: 'marketing' as keyof CustosTransversais, label: 'Marketing & Comunicação' },
                { key: 'amortizacoes' as keyof CustosTransversais, label: 'Amortizações & Depreciações' },
                { key: 'gastosFinanceiros' as keyof CustosTransversais, label: 'Gastos Financeiros' },
                { key: 'outros' as keyof CustosTransversais, label: 'Outros Custos Indirectos' },
              ]).map(f => (
                <div key={f.key} className="flex items-center justify-between gap-2 py-1">
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <div className="flex items-center gap-1">
                    <Input type="number" value={localTransversais[f.key] ?? 0}
                      onChange={e => handleTransversalChange(f.key, e.target.value)}
                      className="w-16 h-7 text-xs text-center" min={0} step={0.5} />
                    <span className="text-[10px] text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
              <div className="col-span-2 flex items-center justify-between pt-2 border-t">
                <span className="text-xs font-semibold">Total Custos Transversais</span>
                {(() => {
                  const total = Object.values(localTransversais).reduce((a, b) => a + b, 0);
                  return <span className={`text-sm font-bold ${total > 25 ? 'text-destructive' : 'text-foreground'}`}>{total.toFixed(1)}%</span>;
                })()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={applyAll} className="text-xs">Aplicar Alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========== TIR Calculation ==========
// Simplified IRR: given cash outflows (costs) and inflow (revenue=100%) over cycle days,
// compute an annualized return rate using the formula: IRR ≈ (Revenue/Cost)^(365/days) - 1
function computeTIR(totalCustoPct: number, diasFinanciamento: number): number {
  if (totalCustoPct <= 0 || diasFinanciamento <= 0) return 0;
  const costRatio = totalCustoPct / 100;
  const marginRatio = (1 - costRatio) / costRatio; // profit / investment
  const annualized = Math.pow(1 + marginRatio, 365 / diasFinanciamento) - 1;
  return annualized * 100; // as percentage
}

// ========== Main Component ==========
interface ImpactoFinanceiroViewProps {
  filterTipo: string;
  filterCategoria: string;
  filterRegiao: string;
}

export function ImpactoFinanceiroView({ filterTipo, filterCategoria, filterRegiao }: ImpactoFinanceiroViewProps) {
  const [phaseConfigs, setPhaseConfigs] = useState<Record<string, PhaseConfig>>(
    () => JSON.parse(JSON.stringify(DEFAULT_PHASE_CONFIG))
  );
  const [prazosExternos, setPrazosExternos] = useState<Record<string, PrazosExternos>>(
    () => JSON.parse(JSON.stringify(DEFAULT_PRAZOS_EXTERNOS))
  );
  const [custos, setCustos] = useState<Record<string, CustoCategoria>>(
    () => JSON.parse(JSON.stringify(DEFAULT_CUSTOS))
  );
  const [mixTipo, setMixTipo] = useState<Record<string, number>>(
    () => ({ ...DEFAULT_MIX_TIPO })
  );
  const [custosTransversais, setCustosTransversais] = useState<CustosTransversais>(
    () => ({ ...DEFAULT_CUSTOS_TRANSVERSAIS })
  );

  const totalTransversais = useMemo(() => 
    Object.values(custosTransversais).reduce((a, b) => a + b, 0),
    [custosTransversais]
  );

  const buildData = useCallback((): ProductFinancialRow[] => {
    return wineProducts.map(p => {
      const config = phaseConfigs[p.categoria] || phaseConfigs['Regional'];
      const prazos = prazosExternos[p.categoria] || prazosExternos['Regional'];
      const vendaMedia = computeAvgSaleDays(p.tipo);

      const colheitaEnd = config.colheita;
      const vinificacaoEnd = colheitaEnd + config.vinificacao;
      const estagioEnd = vinificacaoEnd + config.estagio;
      const engarrafamentoEnd = estagioEnd + config.engarrafamento;
      const vendaEnd = engarrafamentoEnd + vendaMedia;
      const recebimentoEnd = vendaEnd + prazos.prazoRecebimento;

      // Financing gap: from first payment (grapes) to last receipt
      const firstPaymentDay = prazos.pagamentoUvasCompradas || prazos.pagamentoUvasProprias || 30;
      const diasFinanciamento = recebimentoEnd - firstPaymentDay;

      const weights = SEASONAL_WEIGHTS[p.tipo] || SEASONAL_WEIGHTS['Tinto'];
      const peakMonth = weights.indexOf(Math.max(...weights));
      const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

      return {
        produto: p.produto, regiao: p.regiao, categoria: p.categoria, tipo: p.tipo,
        colheita: config.colheita, vinificacao: config.vinificacao,
        estagio: config.estagio, engarrafamento: config.engarrafamento,
        vendaMedia, prazoRecebimento: prazos.prazoRecebimento,
        pagamentoUvas: firstPaymentDay,
        pagamentoSecos: prazos.pagamentoSecos,
        totalCiclo: recebimentoEnd, diasFinanciamento,
        seasonalLabel: `Pico: ${months[peakMonth]}`,
      };
    });
  }, [phaseConfigs, prazosExternos]);

  const allData = useMemo(() => buildData(), [buildData]);

  const data = useMemo(() => {
    return allData.filter(r => {
      if (filterTipo !== 'all' && r.tipo !== filterTipo) return false;
      if (filterCategoria !== 'all' && r.categoria !== filterCategoria) return false;
      if (filterRegiao !== 'all' && r.regiao !== filterRegiao) return false;
      return true;
    });
  }, [allData, filterTipo, filterCategoria, filterRegiao]);

  const maxCiclo = useMemo(() => Math.max(...allData.map(r => r.totalCiclo)), [allData]);

  // TIR by category
  const tirByCategory = useMemo(() => {
    return wineCategorias.map(cat => {
      const catData = allData.filter(r => r.categoria === cat);
      if (catData.length === 0) return null;
      const c = custos[cat];
      const totalCusto = (c?.custoUvas || 0) + (c?.custoVinificacao || 0) + (c?.custoEstagio || 0) + (c?.custoEngarrafSecos || 0) + (c?.custoDistribuicao || 0);
      const avgFinanciamento = Math.round(catData.reduce((s, r) => s + r.diasFinanciamento, 0) / catData.length);
      const avgCiclo = Math.round(catData.reduce((s, r) => s + r.totalCiclo, 0) / catData.length);
      const tir = computeTIR(totalCusto, avgFinanciamento);
      const margem = 100 - totalCusto;
      return { cat, avgFinanciamento, avgCiclo, totalCusto, margem, tir, peso: c?.pesoVendas || 0 };
    }).filter(Boolean) as { cat: string; avgFinanciamento: number; avgCiclo: number; totalCusto: number; margem: number; tir: number; peso: number }[];
  }, [allData, custos]);

  // TIR by wine type
  const tirByTipo = useMemo(() => {
    return wineTipos.map(tipo => {
      const tipoData = allData.filter(r => r.tipo === tipo);
      if (tipoData.length === 0) return null;
      const avgFinanciamento = Math.round(tipoData.reduce((s, r) => s + r.diasFinanciamento, 0) / tipoData.length);
      const avgCiclo = Math.round(tipoData.reduce((s, r) => s + r.totalCiclo, 0) / tipoData.length);
      // Average cost across categories for this type
      const categories = [...new Set(tipoData.map(r => r.categoria))];
      let totalCusto = 0;
      let catCount = 0;
      categories.forEach(cat => {
        const c = custos[cat];
        if (c) {
          totalCusto += (c.custoUvas || 0) + (c.custoVinificacao || 0) + (c.custoEstagio || 0) + (c.custoEngarrafSecos || 0) + (c.custoDistribuicao || 0);
          catCount++;
        }
      });
      totalCusto = catCount > 0 ? totalCusto / catCount : 65;
      const margem = 100 - totalCusto;
      const tir = computeTIR(totalCusto, avgFinanciamento);
      const peso = mixTipo[tipo] || 0;
      return { tipo, avgFinanciamento, avgCiclo, totalCusto, margem, tir, peso };
    }).filter(Boolean) as { tipo: string; avgFinanciamento: number; avgCiclo: number; totalCusto: number; margem: number; tir: number; peso: number }[];
  }, [allData, custos, mixTipo]);

  const tirGlobal = useMemo(() => {
    const totalPeso = tirByTipo.reduce((s, t) => s + t.peso, 0);
    if (totalPeso === 0) return 0;
    return tirByTipo.reduce((s, t) => s + t.tir * (t.peso / totalPeso), 0);
  }, [tirByTipo]);

  const tirPonderada = useMemo(() => {
    const totalPeso = tirByCategory.reduce((s, t) => s + t.peso, 0);
    if (totalPeso === 0) return 0;
    return tirByCategory.reduce((s, t) => s + t.tir * (t.peso / totalPeso), 0);
  }, [tirByCategory]);

  return (
    <div className="space-y-4">
      {/* Description + editable button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Ciclo de caixa por produto: dias entre pagamento das uvas e recebimento das faturas. 
          Prazos externos (pagamentos/recebimentos) editáveis. TIR ponderada pelo peso de cada categoria nas vendas.
        </p>
        <PrazosDialog
          phaseConfigs={phaseConfigs}
          prazosExternos={prazosExternos}
          custos={custos}
          custosTransversais={custosTransversais}
          onUpdatePhases={setPhaseConfigs}
          onUpdatePrazos={setPrazosExternos}
          onUpdateCustos={setCustos}
          onUpdateCustosTransversais={setCustosTransversais}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {PHASES_DISPLAY.map(p => (
          <div key={p.key} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${p.color}`} />
            <span className="text-[9px] text-muted-foreground">{p.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>🍷 Tinto: pico Out</span>
          <span>🥂 Branco: pico Jul</span>
          <span>🌸 Rosé: pico Jul</span>
        </div>
      </div>

      {/* Data grid */}
      <ScrollArea className="rounded-md border" style={{ maxHeight: '480px' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-[10px]">
              <TableHead className="font-semibold sticky left-0 bg-muted/50 z-10 min-w-[180px]">Produto</TableHead>
              <TableHead className="text-center font-medium">Tipo</TableHead>
              <TableHead className="text-center font-medium">Cat.</TableHead>
              {PHASES_DISPLAY.map(p => (
                <TableHead key={p.key} className="text-center font-medium min-w-[55px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-2 h-2 rounded-sm ${p.color}`} />
                    <span className="text-[9px]">{p.label}</span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center font-medium min-w-[45px]"><span className="text-[9px]">Pgto Uvas</span></TableHead>
              <TableHead className="text-center font-medium min-w-[45px]"><span className="text-[9px]">Pgto Secos</span></TableHead>
              <TableHead className="text-center font-semibold min-w-[60px] bg-primary/10">
                <div className="flex flex-col items-center"><Clock className="h-3 w-3 mb-0.5" /><span className="text-[9px]">Ciclo</span></div>
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[60px] bg-destructive/10 text-destructive">
                <span className="text-[9px]">Dias Financ.</span>
              </TableHead>
              <TableHead className="text-center font-medium min-w-[50px]"><span className="text-[9px]">Sazonal.</span></TableHead>
              <TableHead className="font-medium min-w-[140px]"><span className="text-[9px]">Timeline</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => {
              const bgClass = idx % 2 === 0 ? 'bg-white' : 'bg-muted/20';
              const segments = [
                { days: row.colheita, color: 'bg-green-600' },
                { days: row.vinificacao, color: 'bg-purple-500' },
                { days: row.estagio, color: 'bg-amber-600' },
                { days: row.engarrafamento, color: 'bg-sky-600' },
                { days: row.vendaMedia, color: 'bg-emerald-500' },
                { days: row.prazoRecebimento, color: 'bg-orange-500' },
              ];
              return (
                <TableRow key={row.produto} className={`${bgClass} text-xs hover:bg-accent/30`}>
                  <TableCell className="font-medium sticky left-0 z-10 bg-inherit text-[10px]">{row.produto}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${
                      row.tipo === 'Tinto' ? 'border-red-300 text-red-700' :
                      row.tipo === 'Branco' ? 'border-yellow-300 text-yellow-700' :
                      'border-pink-300 text-pink-600'
                    }`}>{row.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-[10px] text-muted-foreground">{row.categoria}</TableCell>
                  {PHASES_DISPLAY.map(p => (
                    <TableCell key={p.key} className="text-center tabular-nums text-[10px]">
                      {(row as any)[p.key]}d
                    </TableCell>
                  ))}
                  <TableCell className="text-center tabular-nums text-[10px] text-destructive font-medium">{row.pagamentoUvas}d</TableCell>
                  <TableCell className="text-center tabular-nums text-[10px] text-muted-foreground">{row.pagamentoSecos}d</TableCell>
                  <TableCell className="text-center font-semibold bg-primary/5 tabular-nums">{row.totalCiclo}d</TableCell>
                  <TableCell className={`text-center font-bold tabular-nums ${
                    row.diasFinanciamento > 700 ? 'text-destructive bg-destructive/5' :
                    row.diasFinanciamento > 500 ? 'text-amber-600 bg-amber-50' :
                    'text-emerald-600 bg-emerald-50'
                  }`}>{row.diasFinanciamento}d</TableCell>
                  <TableCell className="text-center text-[9px] text-muted-foreground">{row.seasonalLabel}</TableCell>
                  <TableCell className="p-1">
                    <div className="flex h-4 rounded overflow-hidden" style={{ width: '100%' }}>
                      {segments.map((seg, i) => (
                        <div key={i} className={`${seg.color} opacity-80`} style={{ width: `${(seg.days / maxCiclo) * 100}%` }} title={`${seg.days} dias`} />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Summary: TIR by category + weighted TIR + Cash Livre */}
      <div className="p-3 bg-muted/40 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Resumo por Categoria & TIR
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Custos Transv.:</span>
              <Badge variant="outline" className="text-[10px]">{totalTransversais.toFixed(1)}%</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">TIR Ponderada:</span>
              <Badge className={`text-xs ${tirPonderada > 20 ? 'bg-emerald-600' : tirPonderada > 10 ? 'bg-amber-500' : 'bg-destructive'}`}>
                {tirPonderada.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {tirByCategory.map(t => {
            const anos = (t.avgCiclo / 365).toFixed(1);
            const prazos = prazosExternos[t.cat];
            const cashLivre = 100 - t.totalCusto - totalTransversais;
            return (
              <div key={t.cat} className="bg-white rounded-md p-2.5 border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">{t.cat}</span>
                  <Badge variant="outline" className="text-[9px] px-1">{t.peso}% vendas</Badge>
                </div>
                <div className="text-lg font-bold mt-1">{t.avgFinanciamento}d</div>
                <div className="text-[9px] text-muted-foreground">financiamento médio</div>
                <div className="text-[10px] mt-1">
                  Ciclo: <span className="font-semibold">{t.avgCiclo}d</span> ({anos} anos)
                </div>
                <div className="text-[10px]">
                  Custos Prod: <span className="font-semibold">{t.totalCusto.toFixed(1)}%</span> · Transv: <span className="font-semibold">{totalTransversais.toFixed(1)}%</span>
                </div>
                <div className="text-[10px]">
                  Receb: <span className="font-semibold">{prazos?.prazoRecebimento}d</span> · Pgto Uvas: <span className="font-semibold">{prazos?.pagamentoUvasCompradas}d</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">TIR:</span>
                    <span className={`text-xs font-bold ${t.tir > 20 ? 'text-emerald-600' : t.tir > 10 ? 'text-amber-600' : 'text-destructive'}`}>
                      {t.tir.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">Cash Livre:</span>
                    <span className={`text-xs font-bold ${cashLivre > 15 ? 'text-emerald-600' : cashLivre > 5 ? 'text-amber-600' : 'text-destructive'}`}>
                      {cashLivre.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mix by wine type + Global TIR */}
      <div className="p-3 bg-muted/40 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Mix de Vendas por Tipo & TIR Global
          </h4>
          <div className="flex items-center gap-4">
            {(() => {
              const avgCustoProd = tirByTipo.length > 0 
                ? tirByTipo.reduce((s, t) => s + t.totalCusto * t.peso, 0) / Math.max(tirByTipo.reduce((s, t) => s + t.peso, 0), 1)
                : 0;
              const cashLivreGlobal = 100 - avgCustoProd - totalTransversais;
              return (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">Cash Livre Global:</span>
                    <Badge className={`text-sm font-bold ${cashLivreGlobal > 15 ? 'bg-emerald-600' : cashLivreGlobal > 5 ? 'bg-amber-500' : 'bg-destructive'}`}>
                      {cashLivreGlobal.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">TIR Global:</span>
                    <Badge className={`text-sm font-bold ${tirGlobal > 20 ? 'bg-emerald-600' : tirGlobal > 10 ? 'bg-amber-500' : 'bg-destructive'}`}>
                      {tirGlobal.toFixed(1)}%
                    </Badge>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tirByTipo.map(t => {
            const tipoColor = t.tipo === 'Tinto' ? 'border-red-300' : t.tipo === 'Branco' ? 'border-yellow-300' : 'border-pink-300';
            const anos = (t.avgCiclo / 365).toFixed(1);
            return (
              <div key={t.tipo} className={`bg-white rounded-md p-3 border-2 ${tipoColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`text-[10px] ${
                    t.tipo === 'Tinto' ? 'border-red-300 text-red-700' :
                    t.tipo === 'Branco' ? 'border-yellow-300 text-yellow-700' :
                    'border-pink-300 text-pink-600'
                  }`}>{t.tipo}</Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">Mix:</span>
                    <Input
                      type="number"
                      value={mixTipo[t.tipo] || 0}
                      onChange={(e) => setMixTipo(prev => ({ ...prev, [t.tipo]: parseFloat(e.target.value) || 0 }))}
                      className="w-14 h-6 text-[10px] text-center"
                      min={0} max={100} step={1}
                    />
                    <span className="text-[9px] text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="text-lg font-bold">{t.avgFinanciamento}d</div>
                <div className="text-[9px] text-muted-foreground">financiamento médio</div>
                <div className="text-[10px] mt-1">
                  Ciclo: <span className="font-semibold">{t.avgCiclo}d</span> ({anos} anos)
                </div>
                <div className="text-[10px]">
                  Margem: <span className="font-semibold">{t.margem.toFixed(1)}%</span> · Custos: <span className="font-semibold">{t.totalCusto.toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">TIR:</span>
                    <span className={`text-sm font-bold ${t.tir > 20 ? 'text-emerald-600' : t.tir > 10 ? 'text-amber-600' : 'text-destructive'}`}>
                      {t.tir.toFixed(1)}%
                    </span>
                  </div>
                  {(() => {
                    const cl = 100 - t.totalCusto - totalTransversais;
                    return (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-muted-foreground">Cash Livre:</span>
                        <span className={`text-xs font-bold ${cl > 15 ? 'text-emerald-600' : cl > 5 ? 'text-amber-600' : 'text-destructive'}`}>
                          {cl.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        {/* Mix total validation */}
        {(() => {
          const totalMix = Object.values(mixTipo).reduce((a, b) => a + b, 0);
          return totalMix !== 100 ? (
            <p className="text-[10px] text-destructive mt-2">⚠ Mix total: {totalMix.toFixed(0)}% (deve ser 100%)</p>
          ) : null;
        })()}
      </div>
    </div>
  );
}
