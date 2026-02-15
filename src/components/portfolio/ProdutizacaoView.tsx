import { useState } from "react";
import { ChevronDown, ChevronRight, Ship, Globe, Store, Plus, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type ProdutoMercadoAssoc, masterMercados, masterCanais } from "@/data/portfolioData";

const catBadge: Record<string, string> = {
  Regional: "bg-muted text-muted-foreground",
  Reserva: "bg-eps-primary/10 text-eps-primary",
  Premium: "bg-eps-gold/20 text-amber-800",
};

interface ProdutizacaoViewProps {
  associations: ProdutoMercadoAssoc[];
  onUpdateAssociations: (updated: ProdutoMercadoAssoc[]) => void;
}

export const ProdutizacaoView = ({ associations, onUpdateAssociations }: ProdutizacaoViewProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState("all");
  const [filterRegiao, setFilterRegiao] = useState("all");

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = associations.filter(p =>
    (filterCat === "all" || p.categoria === filterCat) &&
    (filterRegiao === "all" || p.regiao === filterRegiao)
  );

  const regioes = [...new Set(associations.map(p => p.regiao))].sort();

  const byCat = filtered.reduce<Record<string, ProdutoMercadoAssoc[]>>((acc, p) => {
    (acc[p.categoria] ||= []).push(p);
    return acc;
  }, {});

  const catOrder = ['Premium', 'Reserva', 'Regional'];

  const expandAll = () => {
    setExpandedRows(new Set(filtered.map(p => p.produto)));
  };

  const updateProduto = (produto: string, mercados: ProdutoMercadoAssoc['mercados']) => {
    onUpdateAssociations(associations.map(p =>
      p.produto === produto ? { ...p, mercados } : p
    ));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Categoria:</label>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white">
            <option value="all">Todas</option>
            <option value="Premium">Premium</option>
            <option value="Reserva">Reserva</option>
            <option value="Regional">Regional</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Região:</label>
          <select value={filterRegiao} onChange={e => setFilterRegiao(e.target.value)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white">
            <option value="all">Todas</option>
            {regioes.map(r => <option key={r} value={r}>{r}</option>)}
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
                <TableHead className="text-xs font-semibold text-center">Categoria</TableHead>
                <TableHead className="text-xs font-semibold text-center">Região Origem</TableHead>
                <TableHead className="text-xs font-semibold text-center min-w-[200px]">
                  <div className="flex items-center justify-center gap-1"><Globe className="w-3 h-3" /> Mercados</div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-center min-w-[200px]">
                  <div className="flex items-center justify-center gap-1"><Store className="w-3 h-3" /> Canais</div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  <div className="flex items-center justify-center gap-1"><Ship className="w-3 h-3" /> Transporte</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catOrder.filter(c => byCat[c]).map(cat => (
                <CategoriaGroup key={cat} categoria={cat} produtos={byCat[cat]}
                  expandedRows={expandedRows} onToggle={toggle} onUpdateProduto={updateProduto} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="mt-3 flex items-center gap-6 text-[10px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${catBadge.Regional}`}>Regional</span></span>
        <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${catBadge.Reserva}`}>Reserva</span></span>
        <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${catBadge.Premium}`}>Premium</span></span>
        <span className="ml-4">Expandir produto para gerir mercados e canais</span>
      </div>
    </>
  );
};

/* ── Category group ── */
const CategoriaGroup = ({ categoria, produtos, expandedRows, onToggle, onUpdateProduto }: {
  categoria: string; produtos: ProdutoMercadoAssoc[]; expandedRows: Set<string>;
  onToggle: (id: string) => void;
  onUpdateProduto: (produto: string, mercados: ProdutoMercadoAssoc['mercados']) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={7} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {categoria}
            <span className="text-[10px] font-normal text-muted-foreground">({produtos.length} produtos)</span>
          </div>
        </TableCell>
      </TableRow>
      {!collapsed && produtos.map(p => (
        <ProdutoRow key={p.produto} produto={p} isExpanded={expandedRows.has(p.produto)}
          onToggle={onToggle} onUpdateProduto={onUpdateProduto} />
      ))}
    </>
  );
};

/* ── Product row ── */
const ProdutoRow = ({ produto: p, isExpanded, onToggle, onUpdateProduto }: {
  produto: ProdutoMercadoAssoc; isExpanded: boolean; onToggle: (id: string) => void;
  onUpdateProduto: (produto: string, mercados: ProdutoMercadoAssoc['mercados']) => void;
}) => {
  const [openMercados, setOpenMercados] = useState(false);
  const [openCanais, setOpenCanais] = useState<string | null>(null);

  const allCanais = p.mercados.flatMap(m => m.canais);
  const uniqueCanais = [...new Set(allCanais)];

  return (
    <>
      <TableRow className="text-xs border-b border-border/50">
        <TableCell className="py-1.5 px-2">
          <button onClick={() => onToggle(p.produto)} className="text-muted-foreground hover:text-eps-primary">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        </TableCell>
        <TableCell className="py-1.5 font-medium">{p.produto}</TableCell>
        <TableCell className="text-center py-1.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${catBadge[p.categoria]}`}>{p.categoria}</span>
        </TableCell>
        <TableCell className="text-center py-1.5 text-[11px]">{p.regiao}</TableCell>
        <TableCell className="text-center py-1.5">
          <div className="flex flex-wrap gap-1 justify-center">
            {p.mercados.length === 0 && <span className="text-[9px] text-muted-foreground italic">Sem mercados</span>}
            {p.mercados.slice(0, 3).map(m => (
              <span key={m.mercado} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px]">{m.mercado}</span>
            ))}
            {p.mercados.length > 3 && (
              <span className="text-[9px] text-muted-foreground">+{p.mercados.length - 3}</span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center py-1.5">
          <div className="flex flex-wrap gap-1 justify-center">
            {uniqueCanais.length === 0 && <span className="text-[9px] text-muted-foreground italic">—</span>}
            {uniqueCanais.slice(0, 3).map(c => (
              <span key={c} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px]">{c}</span>
            ))}
            {uniqueCanais.length > 3 && (
              <span className="text-[9px] text-muted-foreground">+{uniqueCanais.length - 3}</span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center py-1.5">
          {p.mercados.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {p.mercados.map(m => (
                <span key={m.mercado} className="font-mono text-[9px] text-muted-foreground">{m.tempoTransporte}</span>
              ))}
            </div>
          ) : <span className="text-[9px] text-muted-foreground">—</span>}
        </TableCell>
      </TableRow>

      {/* Expanded: market-channel detail + association buttons */}
      {isExpanded && (
        <TableRow className="bg-muted/20">
          <TableCell colSpan={7} className="py-3 px-6">
            <div className="flex gap-2 mb-3">
              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={() => setOpenMercados(true)}>
                <Globe className="w-3 h-3" /> Associar Mercados
              </Button>
            </div>

            {p.mercados.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Nenhum mercado associado. Clique em "Associar Mercados" para começar.</p>
            ) : (
              <div className="space-y-2">
                {p.mercados.map(m => (
                  <div key={m.mercado} className="flex items-center gap-3 bg-white rounded-md border px-3 py-2">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Globe className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium">{m.mercado}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <Ship className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-[10px]">{m.tempoTransporte}</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {m.canais.map(c => (
                        <span key={c} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px]">{c}</span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px]"
                      onClick={() => setOpenCanais(m.mercado)}>
                      <Store className="w-3 h-3 mr-0.5" /> Canais
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Market association dialog */}
            <MercadoAssocDialog
              open={openMercados}
              onOpenChange={setOpenMercados}
              produto={p.produto}
              currentMercados={p.mercados.map(m => m.mercado)}
              onSave={(selected) => {
                const existing = new Map(p.mercados.map(m => [m.mercado, m]));
                const updated = selected.map(mk => existing.get(mk) || {
                  mercado: mk,
                  canais: [],
                  tempoTransporte: getDefaultTransporte(mk),
                });
                onUpdateProduto(p.produto, updated);
              }}
            />

            {/* Canal association dialog per market */}
            {openCanais && (
              <CanalAssocDialog
                open={!!openCanais}
                onOpenChange={() => setOpenCanais(null)}
                mercado={openCanais}
                produto={p.produto}
                currentCanais={p.mercados.find(m => m.mercado === openCanais)?.canais || []}
                onSave={(canais) => {
                  const updated = p.mercados.map(m =>
                    m.mercado === openCanais ? { ...m, canais } : m
                  );
                  onUpdateProduto(p.produto, updated);
                }}
              />
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

function getDefaultTransporte(mercado: string): string {
  const map: Record<string, string> = {
    Portugal: '1-3 dias', Brasil: '18-22 dias', Angola: '12-15 dias',
    Alemanha: '3-5 dias', EUA: '20-25 dias', 'Reino Unido': '4-6 dias',
    Suíça: '3-4 dias', China: '30-35 dias',
  };
  return map[mercado] || '—';
}

/* ── Market association dialog ── */
const MercadoAssocDialog = ({ open, onOpenChange, produto, currentMercados, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void; produto: string;
  currentMercados: string[]; onSave: (mercados: string[]) => void;
}) => {
  const [checked, setChecked] = useState<Set<string>>(new Set(currentMercados));
  const [search, setSearch] = useState("");

  const handleOpen = (v: boolean) => {
    if (v) { setChecked(new Set(currentMercados)); setSearch(""); }
    onOpenChange(v);
  };

  const toggle = (m: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  const filtered = masterMercados.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> Mercados — {produto}</DialogTitle>
          <DialogDescription className="text-xs">Selecione os mercados onde este produto atua</DialogDescription>
        </DialogHeader>
        <Input placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="text-xs h-8" />
        <ScrollArea className="max-h-[240px] pr-2">
          <div className="space-y-1">
            {filtered.map(m => (
              <label key={m} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-xs">
                <Checkbox checked={checked.has(m)} onCheckedChange={() => toggle(m)} />
                <span>{m}</span>
                {currentMercados.includes(m) && <Badge variant="secondary" className="text-[8px] ml-auto px-1 py-0">atual</Badge>}
              </label>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => handleOpen(false)} className="text-xs">Cancelar</Button>
          <Button size="sm" onClick={() => { onSave(Array.from(checked)); handleOpen(false); }} className="text-xs">
            Guardar ({checked.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Canal association dialog ── */
const CanalAssocDialog = ({ open, onOpenChange, mercado, produto, currentCanais, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void; mercado: string; produto: string;
  currentCanais: string[]; onSave: (canais: string[]) => void;
}) => {
  const [checked, setChecked] = useState<Set<string>>(new Set(currentCanais));
  const [search, setSearch] = useState("");

  const handleOpen = (v: boolean) => {
    if (v) { setChecked(new Set(currentCanais)); setSearch(""); }
    onOpenChange(v);
  };

  const toggle = (c: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };

  const filtered = masterCanais.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2"><Store className="w-4 h-4" /> Canais — {mercado} ({produto})</DialogTitle>
          <DialogDescription className="text-xs">Selecione os canais de distribuição neste mercado</DialogDescription>
        </DialogHeader>
        <Input placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="text-xs h-8" />
        <ScrollArea className="max-h-[240px] pr-2">
          <div className="space-y-1">
            {filtered.map(c => (
              <label key={c} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-xs">
                <Checkbox checked={checked.has(c)} onCheckedChange={() => toggle(c)} />
                <span>{c}</span>
                {currentCanais.includes(c) && <Badge variant="secondary" className="text-[8px] ml-auto px-1 py-0">atual</Badge>}
              </label>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => handleOpen(false)} className="text-xs">Cancelar</Button>
          <Button size="sm" onClick={() => { onSave(Array.from(checked)); handleOpen(false); }} className="text-xs">
            Guardar ({checked.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
