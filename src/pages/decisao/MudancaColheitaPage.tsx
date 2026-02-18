import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Calendar } from 'lucide-react';
import { enologicoProducts } from '@/data/enologicoData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { wineTipos, wineCategorias, wineRegioes } from '@/data/wineData';

const LOGISTICA_MESES = 1;
const LOTEAMENTO_MESES = 1;

const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

type ViewMode = 'otima' | 'prevista' | 'compara';

// Simulated base volume per product (litros)
const getBaseVolume = (produto: string, idx: number): number => {
  const seed = (produto.length * 31 + idx * 17) % 100;
  return 5000 + seed * 200;
};

const formatLitros = (v: number): string => {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return v.toLocaleString('pt-PT');
};

// Optimal vintage calculation
const getAvailableVintageOptimal = (
  refDate: Date,
  cubaMeses: number,
  barricaMeses: number,
  garrafaMeses: number
): number | null => {
  const refYear = refDate.getFullYear();
  for (let v = refYear; v >= refYear - 12; v--) {
    const harvestEnd = new Date(v, 10, 30);
    const fimCuba = new Date(harvestEnd);
    fimCuba.setMonth(fimCuba.getMonth() + cubaMeses);
    const fimBarrica = new Date(fimCuba);
    fimBarrica.setMonth(fimBarrica.getMonth() + barricaMeses);
    const fimLoteamento = new Date(fimBarrica);
    fimLoteamento.setMonth(fimLoteamento.getMonth() + LOTEAMENTO_MESES);
    const fimGarrafa = new Date(fimLoteamento);
    fimGarrafa.setMonth(fimGarrafa.getMonth() + garrafaMeses);
    const disponivel = new Date(fimGarrafa);
    disponivel.setMonth(disponivel.getMonth() + LOGISTICA_MESES);
    if (refDate >= disponivel) return v;
  }
  return null;
};

// Predicted vintage (simulated stock deviations)
const getAvailableVintagePrevista = (
  refDate: Date,
  cubaMeses: number,
  barricaMeses: number,
  garrafaMeses: number,
  productIndex: number
): number | null => {
  const seed = (productIndex * 7 + refDate.getMonth() * 3) % 10;
  let desvioMeses = 0;
  if (seed <= 2) desvioMeses = 1;
  else if (seed === 3) desvioMeses = -1;

  const adjustedRef = new Date(refDate);
  adjustedRef.setMonth(adjustedRef.getMonth() - desvioMeses);
  return getAvailableVintageOptimal(adjustedRef, cubaMeses, barricaMeses, garrafaMeses);
};

const MudancaColheitaPage = () => {
  const [ano, setAno] = useState(2027);
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterRegiao, setFilterRegiao] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('otima');

  const filtered = useMemo(() =>
    enologicoProducts.filter(p => {
      if (filterTipo !== 'all' && p.tipo !== filterTipo) return false;
      if (filterCategoria !== 'all' && p.categoria !== filterCategoria) return false;
      if (filterRegiao !== 'all' && p.regiao !== filterRegiao) return false;
      return true;
    }),
    [filterTipo, filterCategoria, filterRegiao]
  );

  // Per-product grid (for Ótima / Prevista modes)
  const gridData = useMemo(() => {
    return filtered.map((p, pIdx) => {
      const monthsOtima: (number | null)[] = [];
      const monthsPrevista: (number | null)[] = [];
      for (let m = 0; m < 12; m++) {
        const ref = new Date(ano, m, 15);
        monthsOtima.push(getAvailableVintageOptimal(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa));
        monthsPrevista.push(getAvailableVintagePrevista(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa, pIdx));
      }
      return { ...p, monthsOtima, monthsPrevista };
    });
  }, [filtered, ano]);

  // Compara view: aggregate litros by vintage year × month
  const comparaData = useMemo(() => {
    // Collect all vintages that appear
    const vintageSet = new Set<number>();
    const otimaByVintageMonth: Record<number, number[]> = {};
    const previstaByVintageMonth: Record<number, number[]> = {};

    filtered.forEach((p, pIdx) => {
      const vol = getBaseVolume(p.produto, pIdx);
      for (let m = 0; m < 12; m++) {
        const ref = new Date(ano, m, 15);
        const vOtima = getAvailableVintageOptimal(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa);
        const vPrevista = getAvailableVintagePrevista(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa, pIdx);

        if (vOtima !== null) {
          vintageSet.add(vOtima);
          if (!otimaByVintageMonth[vOtima]) otimaByVintageMonth[vOtima] = new Array(12).fill(0);
          otimaByVintageMonth[vOtima][m] += vol;
        }
        if (vPrevista !== null) {
          vintageSet.add(vPrevista);
          if (!previstaByVintageMonth[vPrevista]) previstaByVintageMonth[vPrevista] = new Array(12).fill(0);
          previstaByVintageMonth[vPrevista][m] += vol;
        }
      }
    });

    const vintages = Array.from(vintageSet).sort((a, b) => b - a);
    return vintages.map(v => ({
      vintage: v,
      otima: otimaByVintageMonth[v] || new Array(12).fill(0),
      prevista: previstaByVintageMonth[v] || new Array(12).fill(0),
    }));
  }, [filtered, ano]);

  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-eps-primary" />
          <h2 className="text-lg font-bold text-eps-primary">Mudança de Colheita</h2>
          <p className="text-xs text-muted-foreground ml-2">
            Identifica qual a colheita disponível para venda em cada mês do ano
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Ano</label>
            <Input type="number" value={ano} onChange={e => setAno(Number(e.target.value))} className="w-24 h-8 text-sm" min={2024} max={2040} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Tipo</label>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {wineTipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Categoria</label>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {wineCategorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Região</label>
            <Select value={filterRegiao} onValueChange={setFilterRegiao}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {wineRegioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="h-8 text-xs">{filtered.length} produtos</Badge>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 ml-auto">
            <Button
              size="sm"
              variant={viewMode === 'otima' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setViewMode('otima')}
            >
              Mudança Ótima
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'prevista' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setViewMode('prevista')}
            >
              Mudança Prevista
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'compara' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setViewMode('compara')}
            >
              Compara
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-lg border shadow-sm">
          <ScrollArea className="max-h-[calc(100vh-260px)]">
            {viewMode === 'compara' ? (
              /* === COMPARA VIEW: vintage years in rows, litros per month === */
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold sticky left-0 bg-muted/50 z-10 min-w-[100px]">Colheita</TableHead>
                    {mesesNomes.map(m => (
                      <TableHead key={m} className="text-xs font-semibold text-center min-w-[80px]">{m}</TableHead>
                    ))}
                    <TableHead className="text-xs font-semibold text-center min-w-[90px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparaData.map(row => {
                    const totalOtima = row.otima.reduce((s, v) => s + v, 0);
                    const totalPrevista = row.prevista.reduce((s, v) => s + v, 0);

                    return (
                      <TableRow key={row.vintage} className="text-xs">
                        <TableCell className="font-bold sticky left-0 bg-white z-10 py-1.5 text-eps-primary">
                          {row.vintage}
                        </TableCell>
                        {row.otima.map((volOtima, m) => {
                          const volPrevista = row.prevista[m];
                          const diff = volPrevista - volOtima;

                          // Color: green if equal, yellow if prevista < otima (delay/less stock), red if prevista > otima (rupture risk)
                          let cellBg = '';
                          let cellText = '';
                          if (volOtima === 0 && volPrevista === 0) {
                            cellBg = '';
                            cellText = 'text-muted-foreground';
                          } else if (Math.abs(diff) < 100) {
                            // Equal (within tolerance)
                            cellBg = 'bg-green-50';
                            cellText = 'text-green-800';
                          } else if (diff < 0) {
                            // Prevista less than Ótima → delay / shortage
                            cellBg = 'bg-yellow-50';
                            cellText = 'text-yellow-800';
                          } else {
                            // Prevista more than Ótima → vintage forced early / rupture on other
                            cellBg = 'bg-red-100';
                            cellText = 'text-red-800 font-bold';
                          }

                          return (
                            <TableCell key={m} className={`text-center py-1 font-mono text-[10px] ${cellBg} ${cellText}`}>
                              <div>{formatLitros(volOtima)} L</div>
                              {diff !== 0 && (
                                <div className={`text-[9px] ${diff > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                  {diff > 0 ? '+' : ''}{formatLitros(diff)} L
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center py-1.5 font-mono text-[11px] font-bold">
                          <div>{formatLitros(totalOtima)} L</div>
                          {totalPrevista !== totalOtima && (
                            <div className={`text-[9px] ${totalPrevista > totalOtima ? 'text-red-600' : 'text-yellow-600'}`}>
                              {totalPrevista > totalOtima ? '+' : ''}{formatLitros(totalPrevista - totalOtima)} L
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Totals row */}
                  <TableRow className="text-xs bg-muted/30 font-bold border-t-2">
                    <TableCell className="sticky left-0 bg-muted/30 z-10 py-1.5 font-bold">Total</TableCell>
                    {mesesNomes.map((_, m) => {
                      const totOtima = comparaData.reduce((s, r) => s + r.otima[m], 0);
                      const totPrevista = comparaData.reduce((s, r) => s + r.prevista[m], 0);
                      const diff = totPrevista - totOtima;
                      return (
                        <TableCell key={m} className="text-center py-1 font-mono text-[10px]">
                          <div>{formatLitros(totOtima)} L</div>
                          {Math.abs(diff) >= 100 && (
                            <div className={`text-[9px] ${diff > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                              {diff > 0 ? '+' : ''}{formatLitros(diff)} L
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center py-1.5 font-mono text-[11px] font-bold">
                      {formatLitros(comparaData.reduce((s, r) => s + r.otima.reduce((a, b) => a + b, 0), 0))} L
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              /* === ÓTIMA / PREVISTA VIEW: products in rows === */
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold sticky left-0 bg-muted/50 z-10 min-w-[200px]">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Cat.</TableHead>
                    {mesesNomes.map(m => (
                      <TableHead key={m} className="text-xs font-semibold text-center min-w-[60px]">{m}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gridData.map((row, idx) => {
                    const months = viewMode === 'prevista' ? row.monthsPrevista : row.monthsOtima;
                    const changeMonths = new Set<number>();
                    for (let m = 1; m < 12; m++) {
                      if (months[m] !== months[m - 1]) changeMonths.add(m);
                    }

                    return (
                      <TableRow key={idx} className="text-xs">
                        <TableCell className="font-medium sticky left-0 bg-white z-10 py-1.5">{row.produto}</TableCell>
                        <TableCell className="text-center py-1.5">
                          <Badge variant="outline" className={`text-[10px] ${
                            row.tipo === 'Tinto' ? 'border-red-300 text-red-700' :
                            row.tipo === 'Branco' ? 'border-yellow-300 text-yellow-700' :
                            'border-pink-300 text-pink-600'
                          }`}>{row.tipo}</Badge>
                        </TableCell>
                        <TableCell className="text-center py-1.5 text-muted-foreground">{row.categoria}</TableCell>
                        {months.map((vintage, m) => {
                          const isChange = changeMonths.has(m);
                          return (
                            <TableCell
                              key={m}
                              className={`text-center py-1.5 font-mono text-[11px] ${
                                isChange
                                  ? 'bg-eps-primary/15 font-bold text-eps-primary border-l-2 border-eps-primary'
                                  : ''
                              }`}
                            >
                              {vintage ?? '—'}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
          {viewMode === 'compara' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-green-50 border border-green-300"></span>
                Real = Teórico
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-yellow-50 border border-yellow-300"></span>
                Prevista &lt; Ótima (atraso)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-red-100 border border-red-300"></span>
                Prevista &gt; Ótima (rotura)
              </span>
              <span>Valores em Litros · Diferença mostrada abaixo</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-eps-primary/15 border-l-2 border-eps-primary"></span>
                Mês de mudança de colheita
              </span>
              <span>Cada célula mostra o ano da colheita disponível para venda nesse mês</span>
            </>
          )}
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default MudancaColheitaPage;
