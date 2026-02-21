import { useState, useMemo, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, ArrowRight, Settings2 } from 'lucide-react';
import { wineProducts, wineCategorias, wineTipos, wineRegioes } from '@/data/wineData';

// Seasonal distribution weights by month (index 0=Jan) for each wine color
// White wines peak in summer, Reds peak in autumn/winter, Rosé peaks spring/summer
const SEASONAL_WEIGHTS: Record<string, number[]> = {
  'Branco': [5, 5, 7, 8, 10, 13, 15, 14, 9, 6, 4, 4],   // summer-heavy
  'Tinto':  [9, 8, 8, 7, 7, 6, 6, 6, 9, 12, 11, 11],     // autumn/winter-heavy
  'Rosé':   [5, 5, 8, 10, 13, 14, 15, 13, 8, 4, 3, 2],    // spring/summer-heavy
};

// Compute average sale days based on seasonal distribution
// Products sell across 365 days but distribution varies: weighted average of "days from availability to sale"
const computeAvgSaleDays = (tipo: string): number => {
  const weights = SEASONAL_WEIGHTS[tipo] || SEASONAL_WEIGHTS['Tinto'];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  // Average sale point is the weighted midpoint across 12 months
  // Each month spans ~30 days, weighted center of gravity
  let weightedSum = 0;
  weights.forEach((w, i) => {
    weightedSum += w * (i * 30 + 15); // midpoint of each month
  });
  return Math.round(weightedSum / totalWeight);
};

// Phase durations by category (in days) - default values
interface PhaseConfig {
  colheita: number;
  pagamentoUvas: number;
  vinificacao: number;
  estagio: number;
  engarrafamento: number;
  prazoRecebimento: number;
}

const DEFAULT_PHASE_CONFIG: Record<string, PhaseConfig> = {
  'Mesa':     { colheita: 15, pagamentoUvas: 30, vinificacao: 30, estagio: 60,  engarrafamento: 15, prazoRecebimento: 60 },
  'Regional': { colheita: 15, pagamentoUvas: 30, vinificacao: 45, estagio: 180, engarrafamento: 15, prazoRecebimento: 60 },
  'Reserva':  { colheita: 15, pagamentoUvas: 30, vinificacao: 60, estagio: 365, engarrafamento: 15, prazoRecebimento: 90 },
  'Premium':  { colheita: 15, pagamentoUvas: 30, vinificacao: 90, estagio: 730, engarrafamento: 15, prazoRecebimento: 90 },
};

const COMPRA_VINHO_ANTES_ENGARRAF = 30;

interface ProductFinancialRow {
  produto: string;
  regiao: string;
  categoria: string;
  tipo: string;
  colheita: number;
  pagamentoUvas: number;
  vinificacao: number;
  estagio: number;
  compraVinhoPossivel: number;
  engarrafamento: number;
  vendaMedia: number;
  prazoRecebimento: number;
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

// Editable payment terms dialog
function PrazosDialog({ configs, onUpdate }: {
  configs: Record<string, PhaseConfig>;
  onUpdate: (newConfigs: Record<string, PhaseConfig>) => void;
}) {
  const [local, setLocal] = useState<Record<string, PhaseConfig>>(() => JSON.parse(JSON.stringify(configs)));

  const handleChange = (cat: string, field: keyof PhaseConfig, val: string) => {
    const num = parseInt(val) || 0;
    setLocal(prev => ({
      ...prev,
      [cat]: { ...prev[cat], [field]: num },
    }));
  };

  const fields: { key: keyof PhaseConfig; label: string }[] = [
    { key: 'colheita', label: 'Colheita (dias)' },
    { key: 'pagamentoUvas', label: 'Pgto Uvas (dias)' },
    { key: 'vinificacao', label: 'Vinificação (dias)' },
    { key: 'estagio', label: 'Estágio (dias)' },
    { key: 'engarrafamento', label: 'Engarraf. (dias)' },
    { key: 'prazoRecebimento', label: 'Recebimento (dias)' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Editar Prazos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Configurar Prazos por Categoria</DialogTitle>
        </DialogHeader>
        <div className="mt-3">
          <Table>
            <TableHeader>
              <TableRow className="text-[11px]">
                <TableHead className="font-semibold">Categoria</TableHead>
                {fields.map(f => <TableHead key={f.key} className="text-center font-medium text-[10px]">{f.label}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {wineCategorias.map(cat => (
                <TableRow key={cat} className="text-xs">
                  <TableCell className="font-medium">{cat}</TableCell>
                  {fields.map(f => (
                    <TableCell key={f.key} className="text-center p-1">
                      <Input
                        type="number"
                        value={local[cat]?.[f.key] ?? 0}
                        onChange={e => handleChange(cat, f.key, e.target.value)}
                        className="w-16 h-7 text-xs text-center mx-auto"
                        min={0}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={() => onUpdate(local)} className="text-xs">
              Aplicar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ImpactoFinanceiroViewProps {
  filterTipo: string;
  filterCategoria: string;
  filterRegiao: string;
}

export function ImpactoFinanceiroView({ filterTipo, filterCategoria, filterRegiao }: ImpactoFinanceiroViewProps) {
  const [phaseConfigs, setPhaseConfigs] = useState<Record<string, PhaseConfig>>(
    () => JSON.parse(JSON.stringify(DEFAULT_PHASE_CONFIG))
  );

  const buildData = useCallback((): ProductFinancialRow[] => {
    return wineProducts.map(p => {
      const config = phaseConfigs[p.categoria] || phaseConfigs['Regional'];
      const vendaMedia = computeAvgSaleDays(p.tipo);

      const colheitaEnd = config.colheita;
      const pagamentoUvasDay = config.pagamentoUvas;
      const vinificacaoEnd = colheitaEnd + config.vinificacao;
      const estagioEnd = vinificacaoEnd + config.estagio;
      const compraVinhoPossivel = Math.max(0, COMPRA_VINHO_ANTES_ENGARRAF);
      const engarrafamentoEnd = estagioEnd + config.engarrafamento;
      const vendaEnd = engarrafamentoEnd + vendaMedia;
      const recebimentoEnd = vendaEnd + config.prazoRecebimento;
      const diasFinanciamento = recebimentoEnd - pagamentoUvasDay;

      // Seasonal peak label
      const weights = SEASONAL_WEIGHTS[p.tipo] || SEASONAL_WEIGHTS['Tinto'];
      const peakMonth = weights.indexOf(Math.max(...weights));
      const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const seasonalLabel = `Pico: ${months[peakMonth]}`;

      return {
        produto: p.produto, regiao: p.regiao, categoria: p.categoria, tipo: p.tipo,
        colheita: config.colheita, pagamentoUvas: config.pagamentoUvas,
        vinificacao: config.vinificacao, estagio: config.estagio,
        compraVinhoPossivel, engarrafamento: config.engarrafamento,
        vendaMedia, prazoRecebimento: config.prazoRecebimento,
        totalCiclo: recebimentoEnd, diasFinanciamento, seasonalLabel,
      };
    });
  }, [phaseConfigs]);

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

  return (
    <div className="space-y-4">
      {/* Description + editable button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Ciclo de caixa por produto: dias entre pagamento das uvas e recebimento das faturas. 
          Prazo de venda médio = 365 dias com distribuição sazonal por cor (brancos: verão, tintos: outono/inverno). 
          Compra de vinho possível até 30 dias antes do engarrafamento.
        </p>
        <PrazosDialog configs={phaseConfigs} onUpdate={setPhaseConfigs} />
      </div>

      {/* Legend + seasonal info */}
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
      <ScrollArea className="rounded-md border" style={{ maxHeight: '520px' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-[10px]">
              <TableHead className="font-semibold sticky left-0 bg-muted/50 z-10 min-w-[200px]">Produto</TableHead>
              <TableHead className="text-center font-medium">Tipo</TableHead>
              <TableHead className="text-center font-medium">Cat.</TableHead>
              {PHASES_DISPLAY.map(p => (
                <TableHead key={p.key} className="text-center font-medium min-w-[60px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-2 h-2 rounded-sm ${p.color}`} />
                    <span className="text-[9px]">{p.label}</span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center font-medium min-w-[50px]">
                <span className="text-[9px]">Pgto Uvas</span>
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[70px] bg-primary/10">
                <div className="flex flex-col items-center">
                  <Clock className="h-3 w-3 mb-0.5" />
                  <span className="text-[9px]">Ciclo</span>
                </div>
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[70px] bg-destructive/10 text-destructive">
                <span className="text-[9px]">Dias Financ.</span>
              </TableHead>
              <TableHead className="text-center font-medium min-w-[60px]">
                <span className="text-[9px]">Sazonalidade</span>
              </TableHead>
              <TableHead className="font-medium min-w-[160px]">
                <span className="text-[9px]">Timeline</span>
              </TableHead>
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
                  <TableCell className="font-medium sticky left-0 z-10 bg-inherit">{row.produto}</TableCell>
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
                  <TableCell className="text-center tabular-nums text-[10px] text-destructive font-medium">
                    {row.pagamentoUvas}d
                  </TableCell>
                  <TableCell className="text-center font-semibold bg-primary/5 tabular-nums">
                    {row.totalCiclo}d
                  </TableCell>
                  <TableCell className={`text-center font-bold tabular-nums ${
                    row.diasFinanciamento > 700 ? 'text-destructive bg-destructive/5' :
                    row.diasFinanciamento > 500 ? 'text-amber-600 bg-amber-50' :
                    'text-emerald-600 bg-emerald-50'
                  }`}>
                    {row.diasFinanciamento}d
                  </TableCell>
                  <TableCell className="text-center text-[9px] text-muted-foreground">
                    {row.seasonalLabel}
                  </TableCell>
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

      {/* Summary by category */}
      <div className="p-3 bg-muted/40 rounded-lg border">
        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
          <ArrowRight className="h-3 w-3" /> Resumo por Categoria
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {wineCategorias.map(cat => {
            const catData = allData.filter(r => r.categoria === cat);
            if (catData.length === 0) return null;
            const avgFinanciamento = Math.round(catData.reduce((s, r) => s + r.diasFinanciamento, 0) / catData.length);
            const avgCiclo = Math.round(catData.reduce((s, r) => s + r.totalCiclo, 0) / catData.length);
            const anos = (avgCiclo / 365).toFixed(1);
            const config = phaseConfigs[cat];

            return (
              <div key={cat} className="bg-white rounded-md p-2.5 border">
                <div className="text-[10px] font-semibold text-muted-foreground">{cat}</div>
                <div className="text-lg font-bold mt-1">{avgFinanciamento}d</div>
                <div className="text-[9px] text-muted-foreground">financiamento médio</div>
                <div className="text-[10px] mt-1">
                  Ciclo: <span className="font-semibold">{avgCiclo}d</span> ({anos} anos)
                </div>
                <div className="text-[10px]">
                  Estágio: <span className="font-semibold">{config.estagio}d</span> · Receb: <span className="font-semibold">{config.prazoRecebimento}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
