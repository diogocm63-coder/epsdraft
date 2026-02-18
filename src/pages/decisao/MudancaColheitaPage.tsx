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

// Optimal: theoretical calculation based on aging profiles
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

// Predicted: simulates real stock availability (may differ from optimal due to stock constraints)
// In a real system this would come from stock data; here we simulate small deviations
const getAvailableVintagePrevista = (
  refDate: Date,
  cubaMeses: number,
  barricaMeses: number,
  garrafaMeses: number,
  productIndex: number
): number | null => {
  // Simulate: some products have stock delays (1-2 months later) or early depletion
  const seed = (productIndex * 7 + refDate.getMonth() * 3) % 10;
  let desvioMeses = 0;
  if (seed <= 2) desvioMeses = 1;  // stock delay → old vintage stays 1 month longer
  else if (seed === 3) desvioMeses = -1; // stock depleted early → new vintage forced earlier
  // else desvioMeses = 0 → matches optimal

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

                        // Compare mode: color based on otima vs prevista
                        let compareBg = '';
                        let compareText = '';
                        if (viewMode === 'compara') {
                          const vOtima = row.monthsOtima[m];
                          const vPrevista = row.monthsPrevista[m];
                          if (vOtima === vPrevista) {
                            // Green: match
                            compareBg = 'bg-green-100';
                            compareText = 'text-green-800';
                          } else if (vOtima !== null && vPrevista !== null && vOtima > vPrevista) {
                            // Yellow: theoretical vintage is newer (ahead), real still on old → delay
                            compareBg = 'bg-yellow-100';
                            compareText = 'text-yellow-800';
                          } else {
                            // Red: theoretical vintage is older than real → rupture
                            compareBg = 'bg-red-100';
                            compareText = 'text-red-800 font-bold';
                          }
                        }

                        const displayValue = viewMode === 'compara'
                          ? `${row.monthsOtima[m] ?? '—'} / ${row.monthsPrevista[m] ?? '—'}`
                          : (vintage ?? '—');

                        return (
                          <TableCell
                            key={m}
                            className={`text-center py-1.5 font-mono text-[11px] ${
                              viewMode === 'compara'
                                ? `${compareBg} ${compareText}`
                                : isChange
                                  ? 'bg-eps-primary/15 font-bold text-eps-primary border-l-2 border-eps-primary'
                                  : ''
                            }`}
                          >
                            {displayValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
          {viewMode !== 'compara' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-eps-primary/15 border-l-2 border-eps-primary"></span>
                Mês de mudança de colheita
              </span>
              <span>Cada célula mostra o ano da colheita disponível para venda nesse mês</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-green-100 border border-green-300"></span>
                Real = Teórico
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-yellow-100 border border-yellow-300"></span>
                Teórica antes da Real (atraso)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-3 rounded bg-red-100 border border-red-300"></span>
                Teórica depois da Real (rotura)
              </span>
              <span>Formato: Ótima / Prevista</span>
            </>
          )}
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default MudancaColheitaPage;
