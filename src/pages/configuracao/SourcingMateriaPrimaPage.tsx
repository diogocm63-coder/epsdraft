import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Sprout } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  sourcingDOCProducts, sourcingRegionalProducts, sourcingMesaProducts,
  type SourcingDOCProduct, type SourcingRegionalProduct, type SourcingMesaProduct,
  type SourcingCastaRacio,
} from "@/data/sourcingData";

const tipoBgColor: Record<string, string> = {
  Tinto: "bg-red-900/10 text-red-800",
  Branco: "bg-amber-100/50 text-amber-800",
  Rosé: "bg-pink-100/50 text-pink-700",
};
const categoriaBadge: Record<string, string> = {
  Reserva: "bg-eps-primary/10 text-eps-primary",
  Premium: "bg-eps-gold/20 text-amber-800",
};

// Stacked bar for 3-part ratio
const RacioBar = ({ uva, comprada, vinho }: { uva: number; comprada: number; vinho: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex w-20 h-2 rounded-full overflow-hidden bg-muted">
      <div className="h-full bg-green-500" style={{ width: `${uva}%` }} />
      <div className="h-full bg-amber-400" style={{ width: `${comprada}%` }} />
      <div className="h-full bg-blue-500" style={{ width: `${vinho}%` }} />
    </div>
  </div>
);

const SourcingMateriaPrimaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="agricultura"
        onConfigItemChange={() => {}}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Sourcing de Matéria-Prima" icon={<Sprout className="w-4 h-4" />} />
        <main className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="doc" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="doc" className="text-xs">DOC <span className="ml-1 text-[10px] text-muted-foreground">(Premium + Reserva)</span></TabsTrigger>
              <TabsTrigger value="regional" className="text-xs">Regional</TabsTrigger>
              <TabsTrigger value="mesa" className="text-xs">Mesa</TabsTrigger>
            </TabsList>
            <TabsContent value="doc"><DOCTab /></TabsContent>
            <TabsContent value="regional"><RegionalTab /></TabsContent>
            <TabsContent value="mesa"><MesaTab /></TabsContent>
          </Tabs>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-6 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> % Uva Própria</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400" /> % Uva Comprada</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> % Vinho</span>
            <span className="ml-4">DOC: Quinta→Parcela→Talhão→Casta | Regional: Região+Castas | Mesa: Castas</span>
          </div>
        </main>
      </div>
    </div>
  );
};

// ============ DOC TAB ============

const DOCTab = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterTipo, setFilterTipo] = useState("all");

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = sourcingDOCProducts.filter(p => filterTipo === "all" || p.tipo === filterTipo);
  const byRegion = filtered.reduce<Record<string, SourcingDOCProduct[]>>((acc, p) => {
    (acc[p.regiao] ||= []).push(p);
    return acc;
  }, {});

  const expandAll = () => {
    const ids = new Set<string>();
    filtered.forEach(p => {
      ids.add(p.produto);
      p.quintas.forEach(q => {
        ids.add(`${p.produto}::${q.quinta}`);
        q.parcelas.forEach(par => ids.add(`${p.produto}::${q.quinta}::${par.parcela}`));
      });
    });
    setExpandedRows(ids);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Tipo:</label>
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white">
            <option value="all">Todos</option>
            <option value="Tinto">Tinto</option><option value="Branco">Branco</option><option value="Rosé">Rosé</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={expandAll} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
          <button onClick={() => setExpandedRows(new Set())} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-8" />
                <TableHead className="text-xs font-semibold min-w-[200px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-center">Categoria</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Própria</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Comprada</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center">Rácio Kg/L</TableHead>
                <TableHead className="text-xs font-semibold text-center">Composição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(byRegion).sort().map(regiao => (
                <DOCRegionGroup key={regiao} regiao={regiao} products={byRegion[regiao]}
                  expandedRows={expandedRows} onToggle={toggle} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
};

const DOCRegionGroup = ({ regiao, products, expandedRows, onToggle }: {
  regiao: string; products: SourcingDOCProduct[]; expandedRows: Set<string>; onToggle: (id: string) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={9} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {regiao} <span className="text-[10px] font-normal text-muted-foreground">({products.length})</span>
          </div>
        </TableCell>
      </TableRow>
      {!collapsed && products.map(p => (
        <DOCProductRows key={p.produto} p={p} expandedRows={expandedRows} onToggle={onToggle} />
      ))}
    </>
  );
};

const DOCProductRows = ({ p, expandedRows, onToggle }: {
  p: SourcingDOCProduct; expandedRows: Set<string>; onToggle: (id: string) => void;
}) => {
  const isExpanded = expandedRows.has(p.produto);
  return (
    <>
      <TableRow className="text-xs border-b border-border/50">
        <TableCell className="py-1.5 px-2">
          <button onClick={() => onToggle(p.produto)} className="text-muted-foreground hover:text-eps-primary">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        </TableCell>
        <TableCell className="py-1.5 font-medium">{p.produto}</TableCell>
        <TableCell className="text-center py-1.5"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tipoBgColor[p.tipo]}`}>{p.tipo}</span></TableCell>
        <TableCell className="text-center py-1.5"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoriaBadge[p.categoria]}`}>{p.categoria}</span></TableCell>
        <TableCell className="text-center py-1.5 font-mono text-green-700 font-semibold">{p.pctUvaPropria}%</TableCell>
        <TableCell className="text-center py-1.5 font-mono text-amber-700 font-semibold">{p.pctUvaComprada}%</TableCell>
        <TableCell className="text-center py-1.5 font-mono text-blue-700 font-semibold">{p.pctVinho}%</TableCell>
        <TableCell className="text-center py-1.5 font-mono text-[11px]">{p.ratioConversao}</TableCell>
        <TableCell className="text-center py-1.5"><RacioBar uva={p.pctUvaPropria} comprada={p.pctUvaComprada} vinho={p.pctVinho} /></TableCell>
      </TableRow>

      {isExpanded && p.quintas.map(q => {
        const qk = `${p.produto}::${q.quinta}`;
        const qExp = expandedRows.has(qk);
        return (
          <TableRow key={qk} className="bg-muted/20">
            <TableCell colSpan={9} className="py-0 px-0">
              <div className="ml-8">
                <button onClick={() => onToggle(qk)}
                  className="flex items-center gap-2 py-1.5 px-2 text-[11px] font-medium hover:text-eps-primary w-full text-left">
                  {qExp ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Quinta</span>
                  {q.quinta}
                </button>
                {qExp && q.parcelas.map(par => {
                  const pk = `${p.produto}::${q.quinta}::${par.parcela}`;
                  const pExp = expandedRows.has(pk);
                  return (
                    <div key={pk} className="ml-6">
                      <button onClick={() => onToggle(pk)}
                        className="flex items-center gap-2 py-1 px-2 text-[11px] hover:text-eps-primary w-full text-left">
                        {pExp ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">Parcela</span>
                        {par.parcela}
                      </button>
                      {pExp && (
                        <div className="ml-6 mb-2">
                          <table className="w-full text-[10px]">
                            <thead>
                              <tr className="text-muted-foreground border-b border-border/30">
                                <th className="text-left py-1 px-2 font-medium">Talhão</th>
                                <th className="text-left py-1 px-2 font-medium">Casta</th>
                                <th className="text-center py-1 px-2 font-medium">Rácio Kg/L</th>
                              </tr>
                            </thead>
                            <tbody>
                              {par.talhoes.map(t => (
                                <tr key={t.talhao} className="border-b border-border/20 hover:bg-muted/30">
                                  <td className="py-1 px-2"><span className="bg-violet-50 text-violet-700 px-1 py-0.5 rounded">{t.talhao}</span></td>
                                  <td className="py-1 px-2 font-medium">{t.casta}</td>
                                  <td className="py-1 px-2 text-center font-mono">{t.ratioConversao}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

// ============ REGIONAL TAB ============

const RegionalTab = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterTipo, setFilterTipo] = useState("all");

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = sourcingRegionalProducts.filter(p => filterTipo === "all" || p.tipo === filterTipo);
  const byRegion = filtered.reduce<Record<string, SourcingRegionalProduct[]>>((acc, p) => {
    (acc[p.regiao] ||= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Tipo:</label>
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white">
            <option value="all">Todos</option>
            <option value="Tinto">Tinto</option><option value="Branco">Branco</option><option value="Rosé">Rosé</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => {
            const ids = new Set<string>();
            filtered.forEach(p => ids.add(p.produto));
            setExpandedRows(ids);
          }} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
          <button onClick={() => setExpandedRows(new Set())} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-8" />
                <TableHead className="text-xs font-semibold min-w-[200px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-center">Região</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Própria</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Comprada</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center">Rácio Kg/L</TableHead>
                <TableHead className="text-xs font-semibold text-center">Composição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(byRegion).sort().map(regiao => {
                const prods = byRegion[regiao];
                return (
                  <RegionalRegionGroup key={regiao} regiao={regiao} products={prods}
                    expandedRows={expandedRows} onToggle={toggle} />
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
};

const RegionalRegionGroup = ({ regiao, products, expandedRows, onToggle }: {
  regiao: string; products: SourcingRegionalProduct[]; expandedRows: Set<string>; onToggle: (id: string) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={9} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {regiao} <span className="text-[10px] font-normal text-muted-foreground">({products.length})</span>
          </div>
        </TableCell>
      </TableRow>
      {!collapsed && products.map(p => {
        const isExp = expandedRows.has(p.produto);
        return (
          <>
            <TableRow key={p.produto} className="text-xs border-b border-border/50">
              <TableCell className="py-1.5 px-2">
                <button onClick={() => onToggle(p.produto)} className="text-muted-foreground hover:text-eps-primary">
                  {isExp ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </TableCell>
              <TableCell className="py-1.5 font-medium">{p.produto}</TableCell>
              <TableCell className="text-center py-1.5"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tipoBgColor[p.tipo]}`}>{p.tipo}</span></TableCell>
              <TableCell className="text-center py-1.5 text-[10px] font-medium">{p.regiao}</TableCell>
              <TableCell className="text-center py-1.5 font-mono text-green-700 font-semibold">{p.pctUvaPropria}%</TableCell>
              <TableCell className="text-center py-1.5 font-mono text-amber-700 font-semibold">{p.pctUvaComprada}%</TableCell>
              <TableCell className="text-center py-1.5 font-mono text-blue-700 font-semibold">{p.pctVinho}%</TableCell>
              <TableCell className="text-center py-1.5 font-mono text-[11px]">{p.ratioConversao}</TableCell>
              <TableCell className="text-center py-1.5"><RacioBar uva={p.pctUvaPropria} comprada={p.pctUvaComprada} vinho={p.pctVinho} /></TableCell>
            </TableRow>
            {isExp && (
              <TableRow className="bg-muted/20">
                <TableCell colSpan={9} className="py-0 px-0">
                  <div className="ml-10 mb-2">
                    <CastaTable castas={p.castas} />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        );
      })}
    </>
  );
};

// ============ MESA TAB ============

const MesaTab = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-3">
        <p className="text-xs text-muted-foreground">Vinhos de mesa — composição por castas, sem identificação de origem</p>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => {
            const ids = new Set<string>();
            sourcingMesaProducts.forEach(p => ids.add(p.produto));
            setExpandedRows(ids);
          }} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
          <button onClick={() => setExpandedRows(new Set())} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-8" />
                <TableHead className="text-xs font-semibold min-w-[200px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Própria</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Uva Comprada</TableHead>
                <TableHead className="text-xs font-semibold text-center">% Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center">Rácio Kg/L</TableHead>
                <TableHead className="text-xs font-semibold text-center">Composição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourcingMesaProducts.map(p => {
                const isExp = expandedRows.has(p.produto);
                return (
                  <>
                    <TableRow key={p.produto} className="text-xs border-b border-border/50">
                      <TableCell className="py-1.5 px-2">
                        <button onClick={() => toggle(p.produto)} className="text-muted-foreground hover:text-eps-primary">
                          {isExp ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </TableCell>
                      <TableCell className="py-1.5 font-medium">{p.produto}</TableCell>
                      <TableCell className="text-center py-1.5"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tipoBgColor[p.tipo]}`}>{p.tipo}</span></TableCell>
                      <TableCell className="text-center py-1.5 font-mono text-green-700 font-semibold">{p.pctUvaPropria}%</TableCell>
                      <TableCell className="text-center py-1.5 font-mono text-amber-700 font-semibold">{p.pctUvaComprada}%</TableCell>
                      <TableCell className="text-center py-1.5 font-mono text-blue-700 font-semibold">{p.pctVinho}%</TableCell>
                      <TableCell className="text-center py-1.5 font-mono text-[11px]">{p.ratioConversao}</TableCell>
                      <TableCell className="text-center py-1.5"><RacioBar uva={p.pctUvaPropria} comprada={p.pctUvaComprada} vinho={p.pctVinho} /></TableCell>
                    </TableRow>
                    {isExp && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={8} className="py-0 px-0">
                          <div className="ml-10 mb-2">
                            <CastaTable castas={p.castas} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
};

// ============ Shared Casta Table ============

const CastaTable = ({ castas }: { castas: SourcingCastaRacio[] }) => (
  <table className="w-full text-[10px] mt-1">
    <thead>
      <tr className="text-muted-foreground border-b border-border/30">
        <th className="text-left py-1 px-2 font-medium">Casta</th>
        <th className="text-center py-1 px-2 font-medium">% Blend</th>
        <th className="text-center py-1 px-2 font-medium">Rácio Kg/L</th>
      </tr>
    </thead>
    <tbody>
      {castas.map(c => (
        <tr key={c.casta} className="border-b border-border/20 hover:bg-muted/30">
          <td className="py-1 px-2 font-medium">{c.casta}</td>
          <td className="py-1 px-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-10 bg-muted rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-eps-primary/60" style={{ width: `${c.percentagem}%` }} />
              </div>
              <span>{c.percentagem}%</span>
            </div>
          </td>
          <td className="py-1 px-2 text-center font-mono">{c.ratioConversao}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SourcingMateriaPrimaPage;
