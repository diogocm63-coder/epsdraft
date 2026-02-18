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

  // Compara view: stock decreases with sales; colors = green/yellow/red
  const comparaData = useMemo(() => {
    return filtered.map((p, pIdx) => {
      const initialStock = getBaseVolume(p.produto, pIdx);
      // Monthly sales rate (simulated: ~8-15% of initial stock per month)
      const salesSeed = (p.produto.length * 13 + pIdx * 7) % 8;
      const monthlySalesRate = 0.08 + salesSeed * 0.01;
      const monthlySales = Math.round(initialStock * monthlySalesRate);

      // Get optimal vintages per month to find the change point
      const vintagesOptimal: (number | null)[] = [];
      for (let m = 0; m < 12; m++) {
        const ref = new Date(ano, m, 15);
        vintagesOptimal.push(getAvailableVintageOptimal(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa));
      }

      // Find the month where vintage changes (mudança)
      let changeMonth = -1;
      for (let m = 1; m < 12; m++) {
        if (vintagesOptimal[m] !== null && vintagesOptimal[m - 1] !== null && vintagesOptimal[m] !== vintagesOptimal[m - 1]) {
          changeMonth = m;
          break;
        }
      }

      const oldVintage = vintagesOptimal[0];
      const newVintage = changeMonth >= 0 ? vintagesOptimal[changeMonth] : null;

      // Actual row: old vintage stock decreasing with sales
      const rowsActual: number[] = new Array(12).fill(0);
      // Nova row: new vintage stock from changeMonth, also decreasing
      const rowsNova: number[] = new Array(12).fill(0);
      // Color per month: 'green' | 'yellow' | 'red'
      const cellColors: ('green' | 'yellow' | 'red')[] = new Array(12).fill('green');

      let actualStock = initialStock;
      let novaStock = 0;
      const novaInitialStock = Math.round(initialStock * (0.7 + (pIdx % 4) * 0.1));

      // Simulate some products running out early (yellow/red scenarios)
      // Products with index % 5 === 0: run out of actual before nova arrives (red gap)
      // Products with index % 5 === 1: overlap period (yellow)
      const forceRedGap = pIdx % 5 === 0 && changeMonth > 2;
      const forceYellowOverlap = pIdx % 5 === 1 && changeMonth > 1;

      // For red gap: actual runs out 1-2 months before changeMonth
      const actualDepleteMonth = forceRedGap ? changeMonth - 2 : changeMonth;
      // For yellow overlap: nova arrives 1 month early
      const novaStartMonth = forceYellowOverlap && changeMonth > 0 ? changeMonth - 1 : changeMonth;

      for (let m = 0; m < 12; m++) {
        // Update actual stock (old vintage)
        if (changeMonth < 0) {
          // No change this year
          rowsActual[m] = Math.max(0, actualStock);
          actualStock -= monthlySales;
          if (actualStock < 0) actualStock = 0;
          cellColors[m] = rowsActual[m] > 0 ? 'green' : 'red';
        } else {
          // Actual vintage sells until it depletes or changeMonth
          if (m < (forceRedGap ? actualDepleteMonth : 12)) {
            rowsActual[m] = Math.max(0, actualStock);
            actualStock -= monthlySales;
            if (actualStock < 0) actualStock = 0;
          } else {
            rowsActual[m] = 0;
          }

          // Nova vintage available from novaStartMonth
          if (m >= novaStartMonth && novaStartMonth >= 0) {
            if (m === novaStartMonth) novaStock = novaInitialStock;
            rowsNova[m] = Math.max(0, novaStock);
            novaStock -= monthlySales;
            if (novaStock < 0) novaStock = 0;
          }

          // Determine color
          const hasActual = rowsActual[m] > 0;
          const hasNova = rowsNova[m] > 0;
          if (hasActual && hasNova) {
            cellColors[m] = 'yellow'; // both vintages in stock (overlap)
          } else if (hasActual || hasNova) {
            cellColors[m] = 'green'; // one vintage in stock
          } else {
            cellColors[m] = 'red'; // no stock at all
          }
        }
      }

      return {
        ...p,
        rowsActual,
        rowsNova,
        cellColors,
        actualYear: oldVintage,
        novaYear: newVintage,
        changeMonth: changeMonth >= 0 ? changeMonth : -1,
      };
    });
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
                    <TableHead className="text-xs font-semibold sticky left-0 bg-muted/50 z-10 min-w-[180px]">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Cat.</TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[60px]">Cenário</TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[50px]">Colheita</TableHead>
                    {mesesNomes.map(m => (
                      <TableHead key={m} className="text-xs font-semibold text-center min-w-[70px]">{m}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparaData.map((row, idx) => {
                    return (
                      <>
                        {/* Actual row */}
                        <TableRow key={`${idx}-actual`} className="text-xs border-b-0">
                          <TableCell rowSpan={2} className="font-medium sticky left-0 bg-white z-10 py-1.5 border-b">
                            {row.produto}
                          </TableCell>
                          <TableCell rowSpan={2} className="text-center py-1.5 border-b">
                            <Badge variant="outline" className={`text-[10px] ${
                              row.tipo === 'Tinto' ? 'border-red-300 text-red-700' :
                              row.tipo === 'Branco' ? 'border-yellow-300 text-yellow-700' :
                              'border-pink-300 text-pink-600'
                            }`}>{row.tipo}</Badge>
                          </TableCell>
                          <TableCell rowSpan={2} className="text-center py-1.5 text-muted-foreground border-b">
                            {row.categoria}
                          </TableCell>
                          <TableCell className="text-center py-1 text-[10px] font-medium text-muted-foreground">Actual</TableCell>
                          <TableCell className="text-center py-1 font-mono text-[11px] font-bold text-eps-primary">
                            {row.actualYear ?? '—'}
                          </TableCell>
                          {row.rowsActual.map((vol, m) => {
                            const color = row.cellColors[m];
                            const bgClass = color === 'red' ? 'bg-red-100' :
                                            color === 'yellow' ? 'bg-yellow-50' :
                                            vol > 0 ? 'bg-green-50' : '';
                            const textClass = color === 'red' ? 'text-red-700' :
                                              color === 'yellow' ? 'text-yellow-700' :
                                              vol === 0 ? 'text-muted-foreground' : 'text-green-800';
                            return (
                              <TableCell
                                key={m}
                                className={`text-center py-1 font-mono text-[11px] font-bold ${bgClass} ${textClass}`}
                              >
                                {vol > 0 ? formatLitros(vol) : '—'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        {/* Nova row */}
                        <TableRow key={`${idx}-nova`} className="text-xs">
                          <TableCell className="text-center py-1 text-[10px] font-medium text-muted-foreground">Nova</TableCell>
                          <TableCell className="text-center py-1 font-mono text-[11px] font-bold text-eps-primary">
                            {row.novaYear ?? '—'}
                          </TableCell>
                          {row.rowsNova.map((vol, m) => {
                            const color = row.cellColors[m];
                            const bgClass = color === 'red' ? 'bg-red-100' :
                                            color === 'yellow' ? 'bg-yellow-50' :
                                            vol > 0 ? 'bg-green-50' : '';
                            const textClass = color === 'red' ? 'text-red-700' :
                                              color === 'yellow' ? 'text-yellow-700' :
                                              vol === 0 ? 'text-muted-foreground' : 'text-green-800';
                            return (
                              <TableCell
                                key={m}
                                className={`text-center py-1 font-mono text-[11px] font-bold ${bgClass} ${textClass}`}
                              >
                                {vol > 0 ? formatLitros(vol) : '—'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </>
                    );
                  })}
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
                <span className="w-4 h-3 rounded bg-green-100 border border-green-300"></span>
                Stock disponível (uma colheita)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-yellow-50 border border-yellow-300"></span>
                Sobreposição de colheitas (duas em stock)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-red-100 border border-red-300"></span>
                Sem stock (rutura)
              </span>
              <span>Stock em Litros (decresce com vendas previstas)</span>
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
