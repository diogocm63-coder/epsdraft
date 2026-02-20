import { Eye } from 'lucide-react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { useState, useMemo, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, ChevronRight, ChevronDown, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { wineProducts, wineRegioes } from '@/data/wineData';

interface StockMasterRow {
  regiao: string;
  submarca: string;
  categoria: string;
  tipo: string;
  stockAtualERP: number;
  stockDtAntes: number;
  tmsfMarcas: number;
  stock: number;
  prevUvas: number;
  yoy2024: number;
  yoy2025: number;
  budget2026: number;
  dtUvas: number;
  vinifDouro: number;
  vinifAlentejo: number;
  vinifDao: number;
  vinifVinhoVerde: number;
  vinifLisboa: number;
  vinifPortugal: number;
  totalVinif: number;
  transfVinhos2024: number;
  necIdeCompra2025: number;
  transfVinhos2025: number;
  retifGrau: number;
  totalCompras: number;
  nec2024: number;
  stockNova: number;
  excessoStock: number;
  inicioVenda: string;
  fimVenda: string;
  isTotal?: boolean;
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const REGIAO_TO_VINIF_KEY: Record<string, keyof StockMasterRow> = {
  'Douro': 'vinifDouro',
  'Alentejo': 'vinifAlentejo',
  'Dão': 'vinifDao',
  'Vinho Verde': 'vinifVinhoVerde',
  'Lisboa': 'vinifLisboa',
  'Portugal': 'vinifPortugal',
};

const generateData = (): StockMasterRow[] => {
  const rows: StockMasterRow[] = [];

  wineProducts.forEach((prod, idx) => {
    const seed = idx * 7 + 13;
    const base = Math.floor(seededRandom(seed) * 45000) + 1000;
    const prev = Math.floor(base * (0.8 + seededRandom(seed + 1) * 0.4));
    const tmsf = seededRandom(seed + 7) > 0.7 ? Math.floor(seededRandom(seed + 8) * 20000) * (seededRandom(seed + 9) > 0.5 ? 1 : -1) : 0;

    // Vinification: product vinifies in its own region
    const vinifValue = Math.floor(seededRandom(seed + 12) * 10000) + 500;
    const vinifDouro = prod.regiao === 'Douro' ? vinifValue : 0;
    const vinifAlentejo = prod.regiao === 'Alentejo' ? vinifValue : 0;
    const vinifDao = prod.regiao === 'Dão' ? vinifValue : 0;
    const vinifVinhoVerde = prod.regiao === 'Vinho Verde' ? vinifValue : 0;
    const vinifLisboa = prod.regiao === 'Lisboa' ? vinifValue : 0;
    const vinifPortugal = prod.regiao === 'Portugal' ? vinifValue : 0;
    const totalVinif = vinifDouro + vinifAlentejo + vinifDao + vinifVinhoVerde + vinifLisboa + vinifPortugal;

    rows.push({
      regiao: prod.regiao, submarca: prod.produto, categoria: prod.categoria, tipo: prod.tipo,
      stockAtualERP: base, stockDtAntes: Math.floor(base * 0.95), tmsfMarcas: tmsf, stock: base + tmsf,
      prevUvas: prev,
      yoy2024: Math.floor(prev * (0.9 + seededRandom(seed + 2) * 0.2)),
      yoy2025: Math.floor(prev * (0.85 + seededRandom(seed + 3) * 0.3)),
      budget2026: Math.floor(prev * (0.9 + seededRandom(seed + 4) * 0.2)),
      dtUvas: seededRandom(seed + 10) > 0.6 ? Math.floor(seededRandom(seed + 11) * 15000) : 0,
      vinifDouro, vinifAlentejo, vinifDao, vinifVinhoVerde, vinifLisboa, vinifPortugal,
      totalVinif,
      transfVinhos2024: seededRandom(seed + 15) > 0.8 ? Math.floor(seededRandom(seed + 16) * 40000) * -1 : 0,
      necIdeCompra2025: 0,
      transfVinhos2025: seededRandom(seed + 17) > 0.8 ? Math.floor(seededRandom(seed + 18) * 10000) * -1 : 0,
      retifGrau: 0, totalCompras: Math.floor(seededRandom(seed + 6) * 5000),
      nec2024: Math.floor(base * 0.6 + seededRandom(seed + 19) * base * 0.4),
      stockNova: Math.floor(seededRandom(seed + 20) * 200000),
      excessoStock: seededRandom(seed + 21) > 0.7 ? Math.floor(seededRandom(seed + 22) * 5000) : 0,
      inicioVenda: `${15 + Math.floor(seededRandom(seed + 23) * 15)}-${['03', '10', '12'][Math.floor(seededRandom(seed + 24) * 3)]}-202${5 + Math.floor(seededRandom(seed + 25) * 2)}`,
      fimVenda: `${15 + Math.floor(seededRandom(seed + 26) * 15)}-${['03', '10', '12'][Math.floor(seededRandom(seed + 27) * 3)]}-202${5 + Math.floor(seededRandom(seed + 28) * 2)}`,
    });
  });

  const allRows = [...rows];
  const sumFields = ['stockAtualERP','stockDtAntes','tmsfMarcas','stock','prevUvas','yoy2024','yoy2025','budget2026','dtUvas','vinifDouro','vinifAlentejo','vinifDao','vinifVinhoVerde','vinifLisboa','vinifPortugal','totalVinif','transfVinhos2024','necIdeCompra2025','transfVinhos2025','retifGrau','totalCompras','nec2024','stockNova','excessoStock'] as const;

  wineRegioes.forEach(regiao => {
    const regionRows = rows.filter(r => r.regiao === regiao);
    if (regionRows.length === 0) return;
    const sumRow: any = { regiao, submarca: `${regiao} Total`, categoria: '', tipo: '', inicioVenda: '', fimVenda: '', isTotal: true };
    sumFields.forEach(f => { sumRow[f] = regionRows.reduce((s, r) => s + (r as any)[f], 0); });
    allRows.push(sumRow as StockMasterRow);
  });

  const sorted: StockMasterRow[] = [];
  wineRegioes.forEach(regiao => {
    const total = allRows.find(r => r.regiao === regiao && r.isTotal);
    const prods = allRows.filter(r => r.regiao === regiao && !r.isTotal);
    if (total) sorted.push(total);
    sorted.push(...prods);
  });
  return sorted;
};

const allData = generateData();
const formatNum = (n: number) => n === 0 ? '' : n.toLocaleString('pt-PT');

// Column group definitions
const COL_GROUPS = [
  { id: 'stockERP', label: 'Stock ERP', cols: ['stockDtAntes', 'tmsfMarcas', 'stock'] },
  { id: 'previsao', label: 'Previsão', cols: ['prevUvas'] },
  { id: 'vendas', label: 'Vendas', cols: ['yoy2024', 'yoy2025', 'budget2026'] },
  { id: 'vinificacao', label: 'Vinificação', cols: ['dtUvas', 'vinifDouro', 'vinifAlentejo', 'vinifDao', 'vinifVinhoVerde', 'vinifLisboa', 'vinifPortugal', 'totalVinif'] },
  { id: 'compras', label: 'Compras/Transf.', cols: ['transfVinhos2024', 'necIdeCompra2025', 'transfVinhos2025', 'retifGrau', 'totalCompras'] },
  { id: 'resultado', label: 'Resultado', cols: ['nec2024', 'stockNova', 'excessoStock', 'inicioVenda', 'fimVenda'] },
] as const;

type ColGroupId = typeof COL_GROUPS[number]['id'];

const COL_HEADERS: Record<string, { label: string; sub?: string; align: string; minW: string; special?: string }> = {
  stockDtAntes: { label: 'STOCK Dt', sub: '08/07/2025', align: 'right', minW: '80px' },
  tmsfMarcas: { label: 'Tmsf°', sub: 'Marcas', align: 'right', minW: '70px' },
  stock: { label: 'Stock', align: 'right', minW: '70px' },
  prevUvas: { label: 'UVAS', align: 'right', minW: '70px', special: 'previsao' },
  yoy2024: { label: 'YOY 2024', align: 'right', minW: '70px' },
  yoy2025: { label: 'YOY 2025', align: 'right', minW: '70px' },
  budget2026: { label: 'Budget', sub: '2026', align: 'right', minW: '75px', special: 'budget' },
  dtUvas: { label: 'DT.UVAS', align: 'right', minW: '65px' },
  vinifDouro: { label: 'Douro', align: 'right', minW: '55px' },
  vinifAlentejo: { label: 'Alentejo', align: 'right', minW: '60px' },
  vinifDao: { label: 'Dão', align: 'right', minW: '50px' },
  vinifVinhoVerde: { label: 'V.Verde', align: 'right', minW: '55px' },
  vinifLisboa: { label: 'Lisboa', align: 'right', minW: '55px' },
  vinifPortugal: { label: 'Portugal', align: 'right', minW: '60px' },
  totalVinif: { label: 'TOTAL', align: 'right', minW: '65px' },
  transfVinhos2024: { label: 'TRANSF°', sub: 'Vinhos 2024', align: 'right', minW: '75px' },
  necIdeCompra2025: { label: 'NEC.IDE', sub: 'COMPRA 2025', align: 'right', minW: '80px' },
  transfVinhos2025: { label: 'TRANSF°', sub: 'Vinhos 2025', align: 'right', minW: '75px' },
  retifGrau: { label: 'Retif.', sub: 'Grau', align: 'right', minW: '55px' },
  totalCompras: { label: 'TOTAL', align: 'right', minW: '65px' },
  nec2024: { label: 'Nec 2024', align: 'right', minW: '70px' },
  stockNova: { label: 'Stock Nova', align: 'right', minW: '80px' },
  excessoStock: { label: 'EXCESSO', sub: 'DE STOCK', align: 'right', minW: '75px', special: 'accent' },
  inicioVenda: { label: 'INICIO', sub: 'VENDA', align: 'center', minW: '85px', special: 'accent' },
  fimVenda: { label: 'FIM VEND°', align: 'center', minW: '85px', special: 'accent' },
};

export default function VisaoIntegradaPage() {
  const [filterRegiao, setFilterRegiao] = useState('Todas');
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  const [filterTipo, setFilterTipo] = useState('Todos');

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set(wineRegioes));
  const [expandedCols, setExpandedCols] = useState<Set<ColGroupId>>(() => new Set(COL_GROUPS.map(g => g.id)));

  const toggleRow = useCallback((regiao: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(regiao) ? next.delete(regiao) : next.add(regiao);
      return next;
    });
  }, []);

  const expandAllRows = useCallback(() => setExpandedRows(new Set(wineRegioes)), []);
  const collapseAllRows = useCallback(() => setExpandedRows(new Set()), []);

  const toggleCol = useCallback((id: ColGroupId) => {
    setExpandedCols(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const expandAllCols = useCallback(() => setExpandedCols(new Set(COL_GROUPS.map(g => g.id))), []);
  const collapseAllCols = useCallback(() => setExpandedCols(new Set()), []);

  const filteredData = useMemo(() => {
    return allData.filter(r => {
      if (filterRegiao !== 'Todas' && r.regiao !== filterRegiao) return false;
      if (r.isTotal) {
        if (filterCategoria !== 'Todas' || filterTipo !== 'Todos') {
          return allData.some(p => !p.isTotal && p.regiao === r.regiao &&
            (filterCategoria === 'Todas' || p.categoria === filterCategoria) &&
            (filterTipo === 'Todos' || p.tipo === filterTipo));
        }
        return true;
      }
      if (filterCategoria !== 'Todas' && r.categoria !== filterCategoria) return false;
      if (filterTipo !== 'Todos' && r.tipo !== filterTipo) return false;
      return true;
    });
  }, [filterRegiao, filterCategoria, filterTipo]);

  const visibleRows = useMemo(() => {
    return filteredData.filter(r => r.isTotal || expandedRows.has(r.regiao));
  }, [filteredData, expandedRows]);

  const visibleColGroups = useMemo(() => {
    return COL_GROUPS.map(g => ({
      ...g,
      visibleCols: expandedCols.has(g.id) ? g.cols : ([] as string[]),
    }));
  }, [expandedCols]);

  const activeFilters = [filterRegiao !== 'Todas', filterCategoria !== 'Todas', filterTipo !== 'Todos'].filter(Boolean).length;
  const resetFilters = () => { setFilterRegiao('Todas'); setFilterCategoria('Todas'); setFilterTipo('Todos'); };

  const allRowsExpanded = expandedRows.size === wineRegioes.length;
  const allColsExpanded = expandedCols.size === COL_GROUPS.length;

  return (
    <DecisaoLayout title="EPS Vinhos" icon={<Eye className="w-4 h-4" />}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Visão Integrada — Stock Master</h2>
          <div className="text-xs text-muted-foreground">Data: 30/06/2025</div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap bg-card p-3 rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros</span>
            {activeFilters > 0 && (
              <Badge variant="default" className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">{activeFilters}</Badge>
            )}
          </div>
          <Select value={filterRegiao} onValueChange={setFilterRegiao}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as Regiões</SelectItem>
              {wineRegioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas Categorias</SelectItem>
              {['Regional', 'Reserva', 'Premium', 'Mesa'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos Tipos</SelectItem>
              {['Tinto', 'Branco', 'Rosé'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1" />

          <div className="flex items-center gap-1 border-l pl-3 border-border">
            <span className="text-[10px] text-muted-foreground mr-1">Linhas:</span>
            <Button variant="outline" size="sm" onClick={allRowsExpanded ? collapseAllRows : expandAllRows} className="h-6 px-2 text-[10px] gap-1">
              {allRowsExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {allRowsExpanded ? 'Fechar' : 'Abrir'}
            </Button>
          </div>
          <div className="flex items-center gap-1 border-l pl-3 border-border">
            <span className="text-[10px] text-muted-foreground mr-1">Colunas:</span>
            <Button variant="outline" size="sm" onClick={allColsExpanded ? collapseAllCols : expandAllCols} className="h-6 px-2 text-[10px] gap-1">
              {allColsExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {allColsExpanded ? 'Fechar' : 'Abrir'}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground h-8 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" /> Limpar
          </Button>
        </div>

        {/* Grid */}
        <div className="border rounded-lg overflow-hidden">
          <ScrollArea className="w-full" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-muted/80">
                    <th colSpan={2} className="border border-border px-2 py-1.5 text-left font-semibold bg-muted min-w-[280px]"></th>
                    {visibleColGroups.map(g => {
                      const isExpanded = expandedCols.has(g.id);
                      const colSpan = isExpanded ? g.cols.length : 1;
                      const specialBg = g.id === 'previsao' ? 'bg-destructive/10 text-destructive' :
                                        g.id === 'resultado' ? 'bg-accent/50' : 'bg-muted';
                      return (
                        <th key={g.id} colSpan={colSpan} className={`border border-border px-1 py-1 text-center font-semibold ${specialBg}`}>
                          <button
                            onClick={() => toggleCol(g.id)}
                            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <span className="text-[10px]">{g.label}</span>
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                  <tr className="bg-muted/50 text-[10px]">
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-0 bg-muted/50 z-10 min-w-[80px]">Região</th>
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-[80px] bg-muted/50 z-10 min-w-[200px]">Submarca</th>
                    {visibleColGroups.map(g => {
                      if (!expandedCols.has(g.id)) {
                        return (
                          <th key={g.id} className="border border-border px-2 py-1 text-center font-medium min-w-[40px] bg-muted/30">
                            <span className="text-[9px] text-muted-foreground">···</span>
                          </th>
                        );
                      }
                      return g.cols.map(col => {
                        const h = COL_HEADERS[col];
                        const specialClass = h.special === 'previsao' ? 'font-bold text-destructive bg-destructive/10' :
                                            h.special === 'budget' ? 'bg-accent/30' :
                                            h.special === 'accent' ? 'bg-accent/30' : '';
                        return (
                          <th key={col} className={`border border-border px-2 py-1 text-${h.align} font-medium ${specialClass}`} style={{ minWidth: h.minW }}>
                            {h.label}{h.sub && <><br />{h.sub}</>}
                          </th>
                        );
                      });
                    })}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, idx) => {
                    const isTotalRow = row.isTotal;
                    const isRowExpanded = expandedRows.has(row.regiao);
                    const bgClass = isTotalRow ? 'bg-primary/10 font-bold' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';
                    const stickyBg = isTotalRow ? 'bg-primary/10' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';

                    return (
                      <tr key={`${row.regiao}-${row.submarca}-${idx}`} className={`${bgClass} hover:bg-accent/30 transition-colors`}>
                        <td className={`border border-border px-2 py-1 font-medium sticky left-0 z-10 ${stickyBg}`}>
                          {isTotalRow ? (
                            <button onClick={() => toggleRow(row.regiao)} className="flex items-center gap-1 hover:opacity-70 w-full">
                              {isRowExpanded ? <ChevronDown className="h-3 w-3 flex-shrink-0" /> : <ChevronRight className="h-3 w-3 flex-shrink-0" />}
                              <span>{row.regiao}</span>
                            </button>
                          ) : (
                            <span className="pl-4">{row.regiao}</span>
                          )}
                        </td>
                        <td className={`border border-border px-2 py-1 sticky left-[80px] z-10 ${stickyBg} ${isTotalRow ? 'font-bold' : ''}`}>
                          {row.submarca}
                        </td>
                        {visibleColGroups.map(g => {
                          if (!expandedCols.has(g.id)) {
                            return (
                              <td key={g.id} className="border border-border px-1 py-1 text-center bg-muted/10">
                                <span className="text-[9px] text-muted-foreground">···</span>
                              </td>
                            );
                          }
                          return g.cols.map(col => {
                            const h = COL_HEADERS[col];
                            const val = (row as any)[col];
                            const isDate = col === 'inicioVenda' || col === 'fimVenda';
                            const isNeg = typeof val === 'number' && val < 0;
                            const isExcesso = col === 'excessoStock' && val > 0;
                            const specialClass = h.special === 'budget' ? 'bg-accent/10' :
                                                h.special === 'accent' ? 'bg-accent/10' : '';
                            const textClass = isNeg || isExcesso ? 'text-destructive font-medium' : '';
                            const fontClass = col === 'stock' || col === 'totalVinif' || col === 'totalCompras' ? 'font-semibold' : '';

                            return (
                              <td key={col} className={`border border-border px-2 py-1 text-${h.align} ${specialClass} ${textClass} ${fontClass} ${isDate ? 'text-[10px]' : ''}`}>
                                {isDate ? (val || '') : formatNum(val)}
                              </td>
                            );
                          });
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </div>
      </div>
    </DecisaoLayout>
  );
}
