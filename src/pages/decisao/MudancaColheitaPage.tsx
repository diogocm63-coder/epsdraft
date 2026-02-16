import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Calendar } from 'lucide-react';
import { enologicoProducts } from '@/data/enologicoData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

// For a given product and a reference date, find which harvest year is "disponível"
const getAvailableVintage = (
  refDate: Date,
  cubaMeses: number,
  barricaMeses: number,
  garrafaMeses: number
): number | null => {
  // Check vintages going back from refDate year
  const refYear = refDate.getFullYear();
  for (let v = refYear; v >= refYear - 12; v--) {
    const harvestEnd = new Date(v, 10, 30); // Nov 30
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

    if (refDate >= disponivel) {
      return v;
    }
  }
  return null;
};

const MudancaColheitaPage = () => {
  const [ano, setAno] = useState(2027);
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterRegiao, setFilterRegiao] = useState('all');

  const filtered = useMemo(() =>
    enologicoProducts.filter(p => {
      if (filterTipo !== 'all' && p.tipo !== filterTipo) return false;
      if (filterCategoria !== 'all' && p.categoria !== filterCategoria) return false;
      if (filterRegiao !== 'all' && p.regiao !== filterRegiao) return false;
      return true;
    }),
    [filterTipo, filterCategoria, filterRegiao]
  );

  // Build grid: for each product, for each month, which vintage is available
  const gridData = useMemo(() => {
    return filtered.map(p => {
      const months: (number | null)[] = [];
      for (let m = 0; m < 12; m++) {
        const ref = new Date(ano, m, 15); // mid-month
        months.push(getAvailableVintage(ref, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa));
      }
      return { ...p, months };
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
        </div>

        {/* Grid */}
        <div className="bg-white rounded-lg border shadow-sm">
          <ScrollArea className="max-h-[calc(100vh-220px)]">
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
                  // Find the month where vintage changes
                  const changeMonths = new Set<number>();
                  for (let m = 1; m < 12; m++) {
                    if (row.months[m] !== row.months[m - 1]) {
                      changeMonths.add(m);
                    }
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
                      {row.months.map((vintage, m) => {
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
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-eps-primary/15 border-l-2 border-eps-primary"></span>
            Mês de mudança de colheita
          </span>
          <span>Cada célula mostra o ano da colheita disponível para venda nesse mês</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default MudancaColheitaPage;
