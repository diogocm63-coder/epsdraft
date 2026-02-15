import { useState, useMemo } from "react";
import { Plus, X, ArrowRightLeft, Package, Globe, Store, Truck, Users, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { wineProducts, wineRegioes, wineTipos, wineCategorias } from "@/data/wineData";
import { enologicoProducts } from "@/data/enologicoData";
import {
  portfolioMercados, masterMercados, masterCanais,
  masterTipoDistribuicao, masterConsumidores,
} from "@/data/portfolioData";

/* ── Types ── */
interface ProdutoMercadoLink {
  id: string;
  produto: string;
  vinho: string; // tipo de vinho (Tinto, Branco, Rosé)
  regiao: string;
  marca: string;
  mercado: string;
  canais: string[];
  tipoDistribuicao: string[];
  perfilConsumidores: string[];
}

/* ── Build initial data from existing associations ── */
const buildInitialLinks = (): ProdutoMercadoLink[] => {
  const links: ProdutoMercadoLink[] = [];
  let id = 0;
  portfolioMercados.forEach(m => {
    m.marcasEspecificas.forEach(prodName => {
      const wp = wineProducts.find(p => p.produto === prodName);
      if (wp) {
        links.push({
          id: `link-${id++}`,
          produto: prodName,
          vinho: wp.tipo,
          regiao: wp.regiao,
          marca: "V&W",
          mercado: m.mercado,
          canais: [...m.canais],
          tipoDistribuicao: [...m.tipoDistribuicao],
          perfilConsumidores: [...m.tipoConsumidores],
        });
      }
    });
  });
  return links;
};

const tipoBg: Record<string, string> = {
  Tinto: "bg-red-50 text-red-700",
  Branco: "bg-amber-50 text-amber-700",
  Rosé: "bg-pink-50 text-pink-700",
};

export const PortfolioView = () => {
  const [links, setLinks] = useState<ProdutoMercadoLink[]>(buildInitialLinks);
  const [search, setSearch] = useState("");
  const [filterRegiao, setFilterRegiao] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterMercado, setFilterMercado] = useState("all");
  const [filterCategoria, setFilterCategoria] = useState("all");

  // Dialogs
  const [addProdutoDialogOpen, setAddProdutoDialogOpen] = useState(false);
  const [addMercadoDialogOpen, setAddMercadoDialogOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<string | null>(null);
  const [selectedMercado, setSelectedMercado] = useState<string | null>(null);

  const mercados = useMemo(() => [...new Set(links.map(l => l.mercado))].sort(), [links]);
  const regioes = useMemo(() => [...new Set(links.map(l => l.regiao))].sort(), [links]);

  const filtered = useMemo(() => links.filter(l => {
    if (filterRegiao !== "all" && l.regiao !== filterRegiao) return false;
    if (filterTipo !== "all" && l.vinho !== filterTipo) return false;
    if (filterMercado !== "all" && l.mercado !== filterMercado) return false;
    if (filterCategoria !== "all") {
      const wp = wineProducts.find(p => p.produto === l.produto);
      if (wp && wp.categoria !== filterCategoria) return false;
    }
    if (search) {
      const s = search.toLowerCase();
      return l.produto.toLowerCase().includes(s) || l.marca.toLowerCase().includes(s) || l.mercado.toLowerCase().includes(s);
    }
    return true;
  }), [links, filterRegiao, filterTipo, filterMercado, filterCategoria, search]);

  const removeLink = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));

  const removeTag = (linkId: string, field: 'canais' | 'tipoDistribuicao' | 'perfilConsumidores', value: string) => {
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, [field]: l[field].filter(v => v !== value) } : l));
  };

  /* ── Add markets to a product ── */
  const openAddMercadoForProduto = (produto: string) => {
    setSelectedProduto(produto);
    setAddMercadoDialogOpen(true);
  };

  const addMercadosToProduto = (mercadoNames: string[], canais: string[], distrib: string[], consumidores: string[]) => {
    if (!selectedProduto) return;
    const wp = wineProducts.find(p => p.produto === selectedProduto);
    if (!wp) return;
    const newLinks = mercadoNames
      .filter(m => !links.some(l => l.produto === selectedProduto && l.mercado === m))
      .map((m, i) => ({
        id: `link-${Date.now()}-${i}`,
        produto: selectedProduto,
        vinho: wp.tipo,
        regiao: wp.regiao,
        marca: "V&W",
        mercado: m,
        canais: [...canais],
        tipoDistribuicao: [...distrib],
        perfilConsumidores: [...consumidores],
      }));
    setLinks(prev => [...prev, ...newLinks]);
    setAddMercadoDialogOpen(false);
    setSelectedProduto(null);
  };

  /* ── Add products to a market ── */
  const openAddProdutoForMercado = (mercado: string) => {
    setSelectedMercado(mercado);
    setAddProdutoDialogOpen(true);
  };

  const addProdutosToMercado = (produtoNames: string[]) => {
    if (!selectedMercado) return;
    const mData = portfolioMercados.find(m => m.mercado === selectedMercado);
    const newLinks = produtoNames
      .filter(p => !links.some(l => l.mercado === selectedMercado && l.produto === p))
      .map((p, i) => {
        const wp = wineProducts.find(w => w.produto === p);
        return {
          id: `link-${Date.now()}-${i}`,
          produto: p,
          vinho: wp?.tipo || "Tinto",
          regiao: wp?.regiao || "Douro",
          marca: "V&W",
          mercado: selectedMercado,
          canais: mData ? [...mData.canais] : [],
          tipoDistribuicao: mData ? [...mData.tipoDistribuicao] : [],
          perfilConsumidores: mData ? [...mData.tipoConsumidores] : [],
        };
      });
    setLinks(prev => [...prev, ...newLinks]);
    setAddProdutoDialogOpen(false);
    setSelectedMercado(null);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input placeholder="Pesquisar produto, marca, mercado..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-[220px] text-xs h-8" />
        <FilterSelect label="Região" value={filterRegiao} onChange={setFilterRegiao} options={regioes} />
        <FilterSelect label="Cor" value={filterTipo} onChange={setFilterTipo} options={wineTipos} />
        <FilterSelect label="Categoria" value={filterCategoria} onChange={setFilterCategoria} options={wineCategorias} />
        <FilterSelect label="Mercado" value={filterMercado} onChange={setFilterMercado} options={masterMercados} />

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => { setSelectedMercado(null); setAddProdutoDialogOpen(true); }}>
            <Globe className="w-3.5 h-3.5" /> Mercado → Produtos
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setSelectedProduto(null); setAddMercadoDialogOpen(true); }}>
            <Package className="w-3.5 h-3.5" /> Produto → Mercados
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold min-w-[180px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[70px]">Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Região</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Marca</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[90px]">Mercado</TableHead>
                <TableHead className="text-xs font-semibold min-w-[130px]">Canais</TableHead>
                <TableHead className="text-xs font-semibold min-w-[130px]">Tipo Distribuição</TableHead>
                <TableHead className="text-xs font-semibold min-w-[130px]">Perfil Consumidores</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-xs text-muted-foreground py-8">Nenhuma associação encontrada.</TableCell></TableRow>
              )}
              {filtered.map(l => (
                <TableRow key={l.id} className="text-xs border-b border-border/50 hover:bg-muted/30">
                  <TableCell className="py-1.5 font-medium">{l.produto}</TableCell>
                  <TableCell className="py-1.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tipoBg[l.vinho] || 'bg-muted text-muted-foreground'}`}>{l.vinho}</span>
                  </TableCell>
                  <TableCell className="py-1.5 text-center text-[11px]">{l.regiao}</TableCell>
                  <TableCell className="py-1.5 text-center text-[11px]">{l.marca}</TableCell>
                  <TableCell className="py-1.5 text-center">
                    <span className="bg-eps-primary/10 text-eps-primary px-1.5 py-0.5 rounded text-[10px] font-medium">{l.mercado}</span>
                  </TableCell>
                  <TableCell className="py-1.5">
                    <TagList items={l.canais} color="bg-blue-50 text-blue-700" onRemove={v => removeTag(l.id, 'canais', v)} />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <TagList items={l.tipoDistribuicao} color="bg-indigo-50 text-indigo-700" onRemove={v => removeTag(l.id, 'tipoDistribuicao', v)} />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <TagList items={l.perfilConsumidores} color="bg-violet-50 text-violet-700" onRemove={v => removeTag(l.id, 'perfilConsumidores', v)} />
                  </TableCell>
                  <TableCell className="py-1.5 text-center">
                    <button onClick={() => removeLink(l.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground">{links.length} associação(ões) produto-mercado</div>

      {/* Dialog: Produto → Mercados */}
      <AddMercadoDialog
        open={addMercadoDialogOpen}
        onOpenChange={v => { if (!v) { setAddMercadoDialogOpen(false); setSelectedProduto(null); } }}
        existingLinks={links}
        preSelectedProduto={selectedProduto}
        onSave={addMercadosToProduto}
      />

      {/* Dialog: Mercado → Produtos */}
      <AddProdutoDialog
        open={addProdutoDialogOpen}
        onOpenChange={v => { if (!v) { setAddProdutoDialogOpen(false); setSelectedMercado(null); } }}
        existingLinks={links}
        preSelectedMercado={selectedMercado}
        onSave={addProdutosToMercado}
        onSelectMercado={setSelectedMercado}
      />
    </>
  );
};

/* ── Helpers ── */
const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="flex items-center gap-2">
    <label className="text-xs font-medium text-muted-foreground">{label}:</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="text-xs border rounded-md px-2 py-1.5 bg-white h-8">
      <option value="all">Todos</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const TagList = ({ items, color, onRemove }: { items: string[]; color: string; onRemove: (v: string) => void }) => (
  <div className="flex flex-wrap gap-0.5">
    {items.slice(0, 2).map(item => (
      <Badge key={item} variant="secondary" className={`text-[9px] gap-0.5 pr-1 ${color}`}>
        {item}
        <button onClick={(e) => { e.stopPropagation(); onRemove(item); }} className="hover:text-destructive ml-0.5"><X className="w-2 h-2" /></button>
      </Badge>
    ))}
    {items.length > 2 && <span className="text-[9px] text-muted-foreground">+{items.length - 2}</span>}
  </div>
);

/* ── Dialog: Produto → Adicionar Mercados ── */
const AddMercadoDialog = ({ open, onOpenChange, existingLinks, preSelectedProduto, onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingLinks: ProdutoMercadoLink[];
  preSelectedProduto: string | null;
  onSave: (mercados: string[], canais: string[], distrib: string[], consumidores: string[]) => void;
}) => {
  const [produto, setProduto] = useState(preSelectedProduto || "");
  const [searchProd, setSearchProd] = useState("");
  const [checkedMercados, setCheckedMercados] = useState<Set<string>>(new Set());
  const [checkedCanais, setCheckedCanais] = useState<Set<string>>(new Set());
  const [checkedDistrib, setCheckedDistrib] = useState<Set<string>>(new Set());
  const [checkedConsumidores, setCheckedConsumidores] = useState<Set<string>>(new Set());

  const reset = () => {
    setProduto(preSelectedProduto || "");
    setSearchProd("");
    setCheckedMercados(new Set());
    setCheckedCanais(new Set());
    setCheckedDistrib(new Set());
    setCheckedConsumidores(new Set());
  };

  const handleOpen = (v: boolean) => { if (v) reset(); onOpenChange(v); };

  const existingMercados = produto ? new Set(existingLinks.filter(l => l.produto === produto).map(l => l.mercado)) : new Set<string>();

  const filteredProds = wineProducts.filter(p => p.produto.toLowerCase().includes(searchProd.toLowerCase()));

  const toggleSet = <T,>(set: Set<T>, val: T): Set<T> => { const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); return n; };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2"><Package className="w-4 h-4" /> Produto → Adicionar Mercados</DialogTitle>
          <DialogDescription className="text-xs">Selecione um produto e os mercados a associar.</DialogDescription>
        </DialogHeader>

        {/* Step 1: Select product */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Produto</label>
          {produto ? (
            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
              <span className="text-xs font-medium flex-1">{produto}</span>
              <button onClick={() => setProduto("")} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ) : (
            <>
              <Input placeholder="Pesquisar produto..." value={searchProd} onChange={e => setSearchProd(e.target.value)} className="text-xs h-8 mb-2" />
              <ScrollArea className="max-h-[150px] border rounded-md">
                <div className="p-1 space-y-0.5">
                  {filteredProds.map(p => (
                    <button key={p.produto} onClick={() => setProduto(p.produto)}
                      className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-muted/50 flex items-center gap-2">
                      <span className="flex-1 font-medium">{p.produto}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${tipoBg[p.tipo] || ''}`}>{p.tipo}</span>
                      <span className="text-[9px] text-muted-foreground">{p.regiao}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {produto && (
          <>
            {/* Step 2: Select markets */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Mercados</label>
              <div className="grid grid-cols-4 gap-1">
                {masterMercados.map(m => {
                  const already = existingMercados.has(m);
                  return (
                    <label key={m} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${already ? 'opacity-40' : 'hover:bg-muted/50 cursor-pointer'}`}>
                      <Checkbox checked={checkedMercados.has(m)} disabled={already} onCheckedChange={() => setCheckedMercados(prev => toggleSet(prev, m))} />
                      <span>{m}</span>
                      {already && <span className="text-[8px] text-muted-foreground">(já)</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Canais, Distribuição, Consumidores */}
            <div className="grid grid-cols-3 gap-4">
              <MultiCheckSection label="Canais" icon={<Store className="w-3 h-3" />} items={masterCanais.slice(0, 10)} checked={checkedCanais} onToggle={v => setCheckedCanais(prev => toggleSet(prev, v))} />
              <MultiCheckSection label="Tipo Distribuição" icon={<Truck className="w-3 h-3" />} items={masterTipoDistribuicao} checked={checkedDistrib} onToggle={v => setCheckedDistrib(prev => toggleSet(prev, v))} />
              <MultiCheckSection label="Consumidores" icon={<Users className="w-3 h-3" />} items={masterConsumidores.slice(0, 10)} checked={checkedConsumidores} onToggle={v => setCheckedConsumidores(prev => toggleSet(prev, v))} />
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => handleOpen(false)} className="text-xs">Cancelar</Button>
          <Button size="sm" onClick={() => onSave(Array.from(checkedMercados), Array.from(checkedCanais), Array.from(checkedDistrib), Array.from(checkedConsumidores))} className="text-xs" disabled={!produto || checkedMercados.size === 0}>
            Adicionar ({checkedMercados.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Dialog: Mercado → Adicionar Produtos ── */
const AddProdutoDialog = ({ open, onOpenChange, existingLinks, preSelectedMercado, onSave, onSelectMercado }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingLinks: ProdutoMercadoLink[];
  preSelectedMercado: string | null;
  onSave: (produtos: string[]) => void;
  onSelectMercado: (m: string) => void;
}) => {
  const [mercado, setMercado] = useState(preSelectedMercado || "");
  const [searchProd, setSearchProd] = useState("");
  const [checkedProdutos, setCheckedProdutos] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState("all");

  const reset = () => {
    setMercado(preSelectedMercado || "");
    setSearchProd("");
    setCheckedProdutos(new Set());
    setFilterCat("all");
  };

  const handleOpen = (v: boolean) => { if (v) reset(); onOpenChange(v); };

  const selectMercado = (m: string) => { setMercado(m); onSelectMercado(m); };

  const existingProdutos = mercado ? new Set(existingLinks.filter(l => l.mercado === mercado).map(l => l.produto)) : new Set<string>();

  const filteredProds = wineProducts.filter(p =>
    (filterCat === "all" || p.categoria === filterCat) &&
    p.produto.toLowerCase().includes(searchProd.toLowerCase())
  );

  const toggleSet = <T,>(set: Set<T>, val: T): Set<T> => { const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); return n; };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> Mercado → Adicionar Produtos</DialogTitle>
          <DialogDescription className="text-xs">Selecione um mercado e os produtos a associar.</DialogDescription>
        </DialogHeader>

        {/* Step 1: Select market */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Mercado</label>
          {mercado ? (
            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
              <span className="text-xs font-medium flex-1">{mercado}</span>
              <button onClick={() => { setMercado(""); onSelectMercado(""); }} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1">
              {masterMercados.map(m => (
                <button key={m} onClick={() => selectMercado(m)}
                  className="text-left px-3 py-2 rounded text-xs hover:bg-muted/50 border">
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {mercado && (
          <div>
            <div className="flex gap-2 mb-2">
              <Input placeholder="Pesquisar produto..." value={searchProd} onChange={e => setSearchProd(e.target.value)} className="text-xs h-8 flex-1" />
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-xs border rounded-md px-2 py-1 bg-white">
                <option value="all">Todas</option>
                {wineCategorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <ScrollArea className="max-h-[300px] border rounded-md">
              <div className="p-1 space-y-0.5">
                {filteredProds.map(p => {
                  const already = existingProdutos.has(p.produto);
                  return (
                    <label key={p.produto} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${already ? 'opacity-40' : 'hover:bg-muted/50 cursor-pointer'}`}>
                      <Checkbox checked={checkedProdutos.has(p.produto)} disabled={already} onCheckedChange={() => setCheckedProdutos(prev => toggleSet(prev, p.produto))} />
                      <span className="flex-1">{p.produto}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${tipoBg[p.tipo] || ''}`}>{p.tipo}</span>
                      <span className="text-[9px] text-muted-foreground">{p.regiao}</span>
                      {already && <span className="text-[8px] text-muted-foreground">(já)</span>}
                    </label>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => handleOpen(false)} className="text-xs">Cancelar</Button>
          <Button size="sm" onClick={() => onSave(Array.from(checkedProdutos))} className="text-xs" disabled={!mercado || checkedProdutos.size === 0}>
            Adicionar ({checkedProdutos.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Multi-check section ── */
const MultiCheckSection = ({ label, icon, items, checked, onToggle }: {
  label: string; icon: React.ReactNode; items: string[]; checked: Set<string>; onToggle: (v: string) => void;
}) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">{icon} {label}</label>
    <ScrollArea className="max-h-[120px]">
      <div className="space-y-0.5">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2 px-1 py-1 rounded text-[10px] hover:bg-muted/50 cursor-pointer">
            <Checkbox checked={checked.has(item)} onCheckedChange={() => onToggle(item)} className="h-3 w-3" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </ScrollArea>
  </div>
);
