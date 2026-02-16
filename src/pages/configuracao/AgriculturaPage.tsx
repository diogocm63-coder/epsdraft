import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, ChevronDown, ChevronRight, MapPin, Grape } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { sourcingDOCProducts } from "@/data/sourcingData";

// Extract all unique values for filters
interface FlatRow {
  regiao: string;
  quinta: string;
  parcela: string;
  talhao: string;
  casta: string;
  ratioConversao: number;
  produto: string;
  tipo: string;
  categoria: string;
}

const buildFlatData = (): FlatRow[] => {
  const rows: FlatRow[] = [];
  sourcingDOCProducts.forEach(p => {
    p.quintas.forEach(q => {
      q.parcelas.forEach(par => {
        par.talhoes.forEach(t => {
          rows.push({
            regiao: p.regiao,
            quinta: q.quinta,
            parcela: par.parcela,
            talhao: t.talhao,
            casta: t.casta,
            ratioConversao: t.ratioConversao,
            produto: p.produto,
            tipo: p.tipo,
            categoria: p.categoria,
          });
        });
      });
    });
  });
  return rows;
};

const allData = buildFlatData();

const unique = (arr: string[]) => [...new Set(arr)].sort();

const AgriculturaPage = () => {
  const navigate = useNavigate();
  const [filterRegiao, setFilterRegiao] = useState("all");
  const [filterQuinta, setFilterQuinta] = useState("all");
  const [filterParcela, setFilterParcela] = useState("all");
  const [filterTalhao, setFilterTalhao] = useState("all");
  const [filterCasta, setFilterCasta] = useState("all");
  const [expandedRegioes, setExpandedRegioes] = useState<Set<string>>(new Set());
  const [expandedQuintas, setExpandedQuintas] = useState<Set<string>>(new Set());
  const [expandedParcelas, setExpandedParcelas] = useState<Set<string>>(new Set());

  // Cascading filters
  const regioes = unique(allData.map(r => r.regiao));

  const filteredByRegiao = filterRegiao === "all" ? allData : allData.filter(r => r.regiao === filterRegiao);
  const quintas = unique(filteredByRegiao.map(r => r.quinta));

  const filteredByQuinta = filterQuinta === "all" ? filteredByRegiao : filteredByRegiao.filter(r => r.quinta === filterQuinta);
  const parcelas = unique(filteredByQuinta.map(r => r.parcela));

  const filteredByParcela = filterParcela === "all" ? filteredByQuinta : filteredByQuinta.filter(r => r.parcela === filterParcela);
  const talhoes = unique(filteredByParcela.map(r => r.talhao));

  const filteredByTalhao = filterTalhao === "all" ? filteredByParcela : filteredByParcela.filter(r => r.talhao === filterTalhao);
  const castas = unique(filteredByTalhao.map(r => r.casta));

  const filtered = filterCasta === "all" ? filteredByTalhao : filteredByTalhao.filter(r => r.casta === filterCasta);

  // Group hierarchically: Região -> Quinta -> Parcela -> Talhão
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, Record<string, FlatRow[]>>> = {};
    filtered.forEach(r => {
      if (!map[r.regiao]) map[r.regiao] = {};
      if (!map[r.regiao][r.quinta]) map[r.regiao][r.quinta] = {};
      if (!map[r.regiao][r.quinta][r.parcela]) map[r.regiao][r.quinta][r.parcela] = [];
      map[r.regiao][r.quinta][r.parcela].push(r);
    });
    return map;
  }, [filtered]);

  const toggle = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    setFn(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const rSet = new Set<string>();
    const qSet = new Set<string>();
    const pSet = new Set<string>();
    Object.keys(grouped).forEach(regiao => {
      rSet.add(regiao);
      Object.keys(grouped[regiao]).forEach(quinta => {
        qSet.add(`${regiao}::${quinta}`);
        Object.keys(grouped[regiao][quinta]).forEach(parcela => {
          pSet.add(`${regiao}::${quinta}::${parcela}`);
        });
      });
    });
    setExpandedRegioes(rSet);
    setExpandedQuintas(qSet);
    setExpandedParcelas(pSet);
  };

  const collapseAll = () => {
    setExpandedRegioes(new Set());
    setExpandedQuintas(new Set());
    setExpandedParcelas(new Set());
  };

  const resetFilters = () => {
    setFilterRegiao("all");
    setFilterQuinta("all");
    setFilterParcela("all");
    setFilterTalhao("all");
    setFilterCasta("all");
  };

  const totalTalhoes = filtered.length;
  const totalQuintas = unique(filtered.map(r => r.quinta)).length;
  const totalParcelas = unique(filtered.map(r => `${r.quinta}::${r.parcela}`)).length;

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="agricultura"
        onConfigItemChange={() => {}}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Agricultura" icon={<Sprout className="w-4 h-4" />} />
        <main className="flex-1 p-4 overflow-auto">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <FilterSelect label="Região" value={filterRegiao} options={regioes} onChange={v => { setFilterRegiao(v); setFilterQuinta("all"); setFilterParcela("all"); setFilterTalhao("all"); setFilterCasta("all"); }} />
            <FilterSelect label="Quinta" value={filterQuinta} options={quintas} onChange={v => { setFilterQuinta(v); setFilterParcela("all"); setFilterTalhao("all"); setFilterCasta("all"); }} />
            <FilterSelect label="Parcela" value={filterParcela} options={parcelas} onChange={v => { setFilterParcela(v); setFilterTalhao("all"); setFilterCasta("all"); }} />
            <FilterSelect label="Talhão" value={filterTalhao} options={talhoes} onChange={v => { setFilterTalhao(v); setFilterCasta("all"); }} />
            <FilterSelect label="Casta" value={filterCasta} options={castas} onChange={v => setFilterCasta(v)} />
            <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-eps-primary hover:underline ml-1">Limpar</button>
            <div className="flex gap-2 ml-auto">
              <button onClick={expandAll} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
              <button onClick={collapseAll} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-4 mb-4">
            <SummaryBadge label="Regiões" value={Object.keys(grouped).length} />
            <SummaryBadge label="Quintas" value={totalQuintas} />
            <SummaryBadge label="Parcelas" value={totalParcelas} />
            <SummaryBadge label="Talhões" value={totalTalhoes} />
            <SummaryBadge label="Castas" value={unique(filtered.map(r => r.casta)).length} />
          </div>

          {/* Hierarchical Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <ScrollArea className="max-h-[calc(100vh-260px)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold w-8" />
                    <TableHead className="text-xs font-semibold min-w-[250px]">Nome</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Casta</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Rácio Kg/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(grouped).sort().map(regiao => {
                    const isRegiaoExp = expandedRegioes.has(regiao);
                    const quintasInRegiao = grouped[regiao];
                    const countInRegiao = Object.values(quintasInRegiao).flatMap(q => Object.values(q).flat()).length;

                    return (
                      <>
                        {/* Região row */}
                        <TableRow key={regiao} className="bg-eps-primary/8 cursor-pointer hover:bg-eps-primary/12"
                          onClick={() => toggle(expandedRegioes, setExpandedRegioes, regiao)}>
                          <TableCell className="py-2 px-2">
                            {isRegiaoExp ? <ChevronDown className="w-3.5 h-3.5 text-eps-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-eps-primary" />}
                          </TableCell>
                          <TableCell colSpan={5} className="py-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-eps-primary" />
                              <span className="text-xs font-semibold text-eps-primary">{regiao}</span>
                              <span className="text-[10px] text-muted-foreground">({countInRegiao} talhões)</span>
                            </div>
                          </TableCell>
                        </TableRow>

                        {isRegiaoExp && Object.keys(quintasInRegiao).sort().map(quinta => {
                          const qKey = `${regiao}::${quinta}`;
                          const isQuintaExp = expandedQuintas.has(qKey);
                          const parcelasInQuinta = quintasInRegiao[quinta];
                          const countInQuinta = Object.values(parcelasInQuinta).flat().length;

                          return (
                            <>
                              {/* Quinta row */}
                              <TableRow key={qKey} className="bg-amber-50/50 cursor-pointer hover:bg-amber-50"
                                onClick={() => toggle(expandedQuintas, setExpandedQuintas, qKey)}>
                                <TableCell className="py-1.5 px-2" />
                                <TableCell colSpan={5} className="py-1.5">
                                  <div className="flex items-center gap-2 ml-4">
                                    {isQuintaExp ? <ChevronDown className="w-3 h-3 text-amber-700" /> : <ChevronRight className="w-3 h-3 text-amber-700" />}
                                    <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-medium">Quinta</span>
                                    <span className="text-[11px] font-medium">{quinta}</span>
                                    <span className="text-[10px] text-muted-foreground">({countInQuinta})</span>
                                  </div>
                                </TableCell>
                              </TableRow>

                              {isQuintaExp && Object.keys(parcelasInQuinta).sort().map(parcela => {
                                const pKey = `${regiao}::${quinta}::${parcela}`;
                                const isParcelaExp = expandedParcelas.has(pKey);
                                const talhaoRows = parcelasInQuinta[parcela];

                                return (
                                  <>
                                    {/* Parcela row */}
                                    <TableRow key={pKey} className="bg-emerald-50/30 cursor-pointer hover:bg-emerald-50/60"
                                      onClick={() => toggle(expandedParcelas, setExpandedParcelas, pKey)}>
                                      <TableCell className="py-1.5 px-2" />
                                      <TableCell colSpan={5} className="py-1.5">
                                        <div className="flex items-center gap-2 ml-10">
                                          {isParcelaExp ? <ChevronDown className="w-2.5 h-2.5 text-emerald-700" /> : <ChevronRight className="w-2.5 h-2.5 text-emerald-700" />}
                                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Parcela</span>
                                          <span className="text-[11px] font-medium">{parcela}</span>
                                          <span className="text-[10px] text-muted-foreground">({talhaoRows.length})</span>
                                        </div>
                                      </TableCell>
                                    </TableRow>

                                    {isParcelaExp && talhaoRows.map((row, idx) => (
                                      <TableRow key={`${pKey}::${row.talhao}::${idx}`} className="text-xs border-b border-border/30 hover:bg-muted/20">
                                        <TableCell className="py-1 px-2" />
                                        <TableCell className="py-1">
                                          <div className="flex items-center gap-2 ml-16">
                                            <span className="bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Talhão</span>
                                            <span className="text-[11px]">{row.talhao}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center py-1">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                            row.tipo === 'Tinto' ? 'bg-red-900/10 text-red-800' :
                                            row.tipo === 'Rosé' ? 'bg-pink-100/50 text-pink-700' :
                                            'bg-amber-100/50 text-amber-800'
                                          }`}>{row.tipo}</span>
                                        </TableCell>
                                        <TableCell className="text-center py-1">
                                          <div className="flex items-center justify-center gap-1">
                                            <Grape className="w-3 h-3 text-purple-500" />
                                            <span className="text-[11px] font-medium">{row.casta}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center py-1 font-mono text-[11px]">{row.ratioConversao}</TableCell>
                                      </TableRow>
                                    ))}
                                  </>
                                );
                              })}
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable filter select
const FilterSelect = ({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}:</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-xs border rounded-md px-2 py-1.5 bg-white min-w-[120px]">
      <option value="all">Todos</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// Summary badge
const SummaryBadge = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white border rounded-lg px-3 py-2 text-center min-w-[80px]">
    <div className="text-lg font-bold text-eps-primary">{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

export default AgriculturaPage;
