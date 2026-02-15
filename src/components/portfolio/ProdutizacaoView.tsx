import { useState } from "react";
import { Plus, Pencil, Trash2, Check, ChevronDown, ChevronRight, Wine } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { enologicoProducts, type EnologicoProduct } from "@/data/enologicoData";
import { wineRegioes, wineTipos, wineCategorias } from "@/data/wineData";
import { regiaoToCastas } from "@/data/castaData";

export interface ProdutizacaoItem {
  id: string;
  produto: string;
  capacidade: string;
  marca: string;
  rotuloEspecifico: string;
  embalagensCaixa: number;
  // Enológico fields
  regiao: string;
  tipo: string;
  categoria: string;
  estagioBarrica: number;
  estagioCuba: number;
  estagioGarrafa: number;
  castas: string[];
  castasPercentagem: number[];
}

const buildInitialItems = (): ProdutizacaoItem[] =>
  enologicoProducts.map((p, i) => ({
    id: `prod-${i}`,
    produto: p.produto,
    capacidade: "750ml",
    marca: "V&W",
    rotuloEspecifico: "",
    embalagensCaixa: 6,
    regiao: p.regiao,
    tipo: p.tipo,
    categoria: p.categoria,
    estagioBarrica: p.estagioBarrica,
    estagioCuba: p.estagioCuba,
    estagioGarrafa: p.estagioGarrafa,
    castas: [...p.castas],
    castasPercentagem: [...p.castasPercentagem],
  }));

const capacidadeOptions = ["187ml", "250ml", "375ml", "500ml", "750ml", "1L", "1.5L", "3L", "5L", "Bag-in-Box 3L", "Bag-in-Box 5L"];

const tipoBg: Record<string, string> = {
  Tinto: "bg-red-50 text-red-700",
  Branco: "bg-amber-50 text-amber-700",
  Rosé: "bg-pink-50 text-pink-700",
};
const catBadge: Record<string, string> = {
  Regional: "bg-muted text-muted-foreground",
  Reserva: "bg-eps-primary/10 text-eps-primary",
  Premium: "bg-eps-gold/20 text-amber-800",
};

interface ProdutizacaoViewProps {
  associations?: unknown;
  onUpdateAssociations?: unknown;
}

export const ProdutizacaoView = (_props: ProdutizacaoViewProps) => {
  const [items, setItems] = useState<ProdutizacaoItem[]>(buildInitialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProdutizacaoItem | null>(null);
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterRegiao, setFilterRegiao] = useState("all");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");

  const toggle = (id: string) => {
    setExpandedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const openNew = () => {
    setEditItem({
      id: `prod-${Date.now()}`, produto: "", capacidade: "750ml", marca: "V&W", rotuloEspecifico: "",
      embalagensCaixa: 6,
      regiao: "Douro", tipo: "Tinto", categoria: "Regional",
      estagioBarrica: 0, estagioCuba: 4, estagioGarrafa: 2,
      castas: [], castasPercentagem: [],
    });
    setDialogOpen(true);
  };

  const openEdit = (item: ProdutizacaoItem) => {
    setEditItem({ ...item, castas: [...item.castas], castasPercentagem: [...item.castasPercentagem] });
    setDialogOpen(true);
  };

  const save = () => {
    if (!editItem || !editItem.produto.trim()) return;
    setItems(prev => {
      const exists = prev.find(p => p.id === editItem.id);
      if (exists) return prev.map(p => p.id === editItem.id ? editItem : p);
      return [...prev, editItem];
    });
    setDialogOpen(false);
    setEditItem(null);
  };

  const remove = (id: string) => setItems(prev => prev.filter(p => p.id !== id));

  const filtered = items.filter(p => {
    if (filterRegiao !== "all" && p.regiao !== filterRegiao) return false;
    if (filterCategoria !== "all" && p.categoria !== filterCategoria) return false;
    if (filterTipo !== "all" && p.tipo !== filterTipo) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.produto.toLowerCase().includes(s) || p.marca.toLowerCase().includes(s);
    }
    return true;
  });

  const regioes = [...new Set(items.map(p => p.regiao))].sort();

  return (
    <>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input placeholder="Pesquisar produto, marca..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-[200px] text-xs h-8" />
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Região:</label>
          <select value={filterRegiao} onChange={e => setFilterRegiao(e.target.value)} className="text-xs border rounded-md px-2 py-1.5 bg-white h-8">
            <option value="all">Todas</option>
            {regioes.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Categoria:</label>
          <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="text-xs border rounded-md px-2 py-1.5 bg-white h-8">
            <option value="all">Todas</option>
            {wineCategorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Cor:</label>
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="text-xs border rounded-md px-2 py-1.5 bg-white h-8">
            <option value="all">Todas</option>
            {wineTipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5 ml-auto" onClick={openNew}>
          <Plus className="w-3.5 h-3.5" /> Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-8" />
                <TableHead className="text-xs font-semibold min-w-[200px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Capacidade</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[70px]">Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[100px]">Marca</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Região</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Categoria</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[55px]">
                  <div className="flex flex-col items-center"><span>Barrica</span><span className="text-[9px] text-muted-foreground font-normal">(meses)</span></div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-center w-[55px]">
                  <div className="flex flex-col items-center"><span>Cuba</span><span className="text-[9px] text-muted-foreground font-normal">(meses)</span></div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-center w-[55px]">
                  <div className="flex flex-col items-center"><span>Garrafa</span><span className="text-[9px] text-muted-foreground font-normal">(meses)</span></div>
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[140px]">Castas</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[60px]">
                  <div className="flex flex-col items-center"><span>Emb.</span><span className="text-[9px] text-muted-foreground font-normal">/Cx</span></div>
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[130px]">Rótulo Específico</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[60px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={14} className="text-center text-xs text-muted-foreground py-8">Nenhum produto encontrado.</TableCell></TableRow>
              )}
              {filtered.map(item => {
                const isExpanded = expandedRows.has(item.id);
                const total = item.estagioBarrica + item.estagioCuba + item.estagioGarrafa;
                return (
                  <TableRow key={item.id} className="text-xs border-b border-border/50 hover:bg-muted/30">
                    <TableCell className="py-1.5 px-2">
                      <button onClick={() => toggle(item.id)} className="text-muted-foreground hover:text-eps-primary">
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </TableCell>
                    <TableCell className="py-1.5 font-medium">
                      <div>
                        {item.produto}
                        {isExpanded && item.castas.length > 0 && (
                          <div className="mt-2 ml-2 space-y-1">
                            {item.castas.map((c, i) => (
                              <div key={c} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <div className="w-16 bg-muted rounded-full h-1.5">
                                  <div className="h-1.5 rounded-full bg-eps-primary/60" style={{ width: `${item.castasPercentagem[i]}%` }} />
                                </div>
                                <span>{c}</span>
                                <span className="text-eps-primary font-medium">{item.castasPercentagem[i]}%</span>
                              </div>
                            ))}
                            <div className="text-[9px] text-muted-foreground mt-1">Total estágio: {total} meses</div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-center">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{item.capacidade}</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tipoBg[item.tipo] || 'bg-muted text-muted-foreground'}`}>{item.tipo}</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-center text-[11px]">{item.marca}</TableCell>
                    <TableCell className="py-1.5 text-center text-[11px]">{item.regiao}</TableCell>
                    <TableCell className="py-1.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${catBadge[item.categoria] || ''}`}>{item.categoria}</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-center font-mono">
                      {item.estagioBarrica > 0
                        ? <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">{item.estagioBarrica}</span>
                        : <span className="text-muted-foreground/40">—</span>}
                    </TableCell>
                    <TableCell className="py-1.5 text-center font-mono">
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{item.estagioCuba}</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-center font-mono">
                      <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px]">{item.estagioGarrafa}</span>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex flex-wrap gap-0.5">
                        {item.castas.slice(0, 3).map((c, i) => (
                          <span key={c} className="text-[9px] bg-muted px-1 py-0.5 rounded">{c} {item.castasPercentagem[i]}%</span>
                        ))}
                        {item.castas.length > 3 && <span className="text-[9px] text-muted-foreground">+{item.castas.length - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-center">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{item.embalagensCaixa}</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-[11px] text-muted-foreground italic">{item.rotuloEspecifico || "—"}</TableCell>
                    <TableCell className="py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-eps-primary"><Pencil className="w-3 h-3" /></button>
                        <button onClick={() => remove(item.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="mt-3 text-[10px] text-muted-foreground">{items.length} produto(s) configurado(s)</div>

      {/* Create/Edit Dialog */}
      {editItem && (
        <ProductDialog
          open={dialogOpen}
          onOpenChange={v => { if (!v) { setDialogOpen(false); setEditItem(null); } }}
          item={editItem}
          isNew={!items.find(p => p.id === editItem.id)}
          onChange={setEditItem}
          onSave={save}
        />
      )}
    </>
  );
};

/* ── Product Dialog ── */
const ProductDialog = ({ open, onOpenChange, item, isNew, onChange, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  item: ProdutizacaoItem; isNew: boolean;
  onChange: (item: ProdutizacaoItem) => void; onSave: () => void;
}) => {
  const [selectedExisting, setSelectedExisting] = useState<string>("");
  const [enolSearch, setEnolSearch] = useState("");

  const applyExisting = (prod: EnologicoProduct) => {
    onChange({
      ...item,
      produto: prod.produto,
      regiao: prod.regiao,
      tipo: prod.tipo,
      categoria: prod.categoria,
      estagioBarrica: prod.estagioBarrica,
      estagioCuba: prod.estagioCuba,
      estagioGarrafa: prod.estagioGarrafa,
      castas: [...prod.castas],
      castasPercentagem: [...prod.castasPercentagem],
    });
    setSelectedExisting(prod.produto);
  };

  const getCastasPool = () => {
    const regionKey = item.regiao as keyof typeof regiaoToCastas;
    const data = regiaoToCastas[regionKey];
    if (!data) return [];
    return item.tipo === 'Tinto' || item.tipo === 'Rosé' ? [...data.tintas] : [...data.brancas];
  };

  const addCasta = (c: string) => {
    if (item.castas.includes(c)) return;
    const newCastas = [...item.castas, c];
    const pct = redistributePercentages(newCastas.length);
    onChange({ ...item, castas: newCastas, castasPercentagem: pct });
  };

  const removeCasta = (idx: number) => {
    const newCastas = item.castas.filter((_, i) => i !== idx);
    const pct = redistributePercentages(newCastas.length);
    onChange({ ...item, castas: newCastas, castasPercentagem: pct });
  };

  const filteredEnol = enologicoProducts.filter(p =>
    p.produto.toLowerCase().includes(enolSearch.toLowerCase()) ||
    p.regiao.toLowerCase().includes(enolSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Wine className="w-4 h-4" /> {isNew ? "Novo Produto" : "Editar Produto"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isNew ? "Escolha um vinho granel existente ou defina um novo com todas as características enológicas." : "Edite as características do produto."}
          </DialogDescription>
        </DialogHeader>

        {isNew && (
          <Tabs defaultValue="existente" className="w-full">
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="existente" className="text-xs flex-1">Vinho Existente</TabsTrigger>
              <TabsTrigger value="novo" className="text-xs flex-1">Definir Novo</TabsTrigger>
            </TabsList>

            <TabsContent value="existente">
              <Input placeholder="Pesquisar vinho granel..." value={enolSearch} onChange={e => setEnolSearch(e.target.value)} className="text-xs h-8 mb-2" />
              <ScrollArea className="max-h-[200px] border rounded-md">
                <div className="space-y-0.5 p-1">
                  {filteredEnol.map(p => (
                    <button key={p.produto} onClick={() => applyExisting(p)}
                      className={`w-full text-left px-3 py-2 rounded text-xs flex items-center gap-3 transition-colors ${selectedExisting === p.produto ? 'bg-eps-primary/10 border border-eps-primary/30' : 'hover:bg-muted/50'}`}>
                      <div className="flex-1">
                        <span className="font-medium">{p.produto}</span>
                        <span className="text-muted-foreground ml-2">{p.regiao} · {p.tipo} · {p.categoria}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        B{p.estagioBarrica} C{p.estagioCuba} G{p.estagioGarrafa}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{p.castas.slice(0, 2).join(', ')}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="novo">
              <EnologicoFields item={item} onChange={onChange} getCastasPool={getCastasPool} addCasta={addCasta} removeCasta={removeCasta} />
            </TabsContent>
          </Tabs>
        )}

        {!isNew && (
          <EnologicoFields item={item} onChange={onChange} getCastasPool={getCastasPool} addCasta={addCasta} removeCasta={removeCasta} />
        )}

        {/* Product-specific fields */}
        <div className="border-t pt-3 mt-2 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Dados do Produto</div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Produto *</label>
              <Input value={item.produto} onChange={e => onChange({ ...item, produto: e.target.value })} className="text-xs h-8" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Capacidade</label>
              <select value={item.capacidade} onChange={e => onChange({ ...item, capacidade: e.target.value })} className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
                {capacidadeOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Marca</label>
              <Input value={item.marca} onChange={e => onChange({ ...item, marca: e.target.value })} className="text-xs h-8" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Emb./Caixa</label>
              <Input type="number" min={1} value={item.embalagensCaixa} onChange={e => onChange({ ...item, embalagensCaixa: Number(e.target.value) })} className="text-xs h-8" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Rótulo Específico</label>
            <Input value={item.rotuloEspecifico} onChange={e => onChange({ ...item, rotuloEspecifico: e.target.value })} className="text-xs h-8" placeholder="Ex: Edição Limitada 2024" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">Cancelar</Button>
          <Button size="sm" onClick={onSave} className="text-xs gap-1" disabled={!item.produto.trim()}>
            <Check className="w-3 h-3" /> Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Enológico characteristic fields ── */
const EnologicoFields = ({ item, onChange, getCastasPool, addCasta, removeCasta }: {
  item: ProdutizacaoItem;
  onChange: (item: ProdutizacaoItem) => void;
  getCastasPool: () => string[];
  addCasta: (c: string) => void;
  removeCasta: (idx: number) => void;
}) => (
  <div className="space-y-3">
    <div className="text-xs font-semibold text-muted-foreground">Características Enológicas</div>
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Região</label>
        <select value={item.regiao} onChange={e => onChange({ ...item, regiao: e.target.value, castas: [], castasPercentagem: [] })} className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
          {wineRegioes.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo</label>
        <select value={item.tipo} onChange={e => onChange({ ...item, tipo: e.target.value, castas: [], castasPercentagem: [] })} className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
          {wineTipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoria</label>
        <select value={item.categoria} onChange={e => onChange({ ...item, categoria: e.target.value })} className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
          {wineCategorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Barrica (meses)</label>
        <Input type="number" min={0} value={item.estagioBarrica} onChange={e => onChange({ ...item, estagioBarrica: Number(e.target.value) })} className="text-xs h-8" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Cuba (meses)</label>
        <Input type="number" min={0} value={item.estagioCuba} onChange={e => onChange({ ...item, estagioCuba: Number(e.target.value) })} className="text-xs h-8" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Garrafa (meses)</label>
        <Input type="number" min={0} value={item.estagioGarrafa} onChange={e => onChange({ ...item, estagioGarrafa: Number(e.target.value) })} className="text-xs h-8" />
      </div>
    </div>
    {/* Castas */}
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Castas</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {item.castas.map((c, i) => (
          <span key={c} className="bg-muted px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            {c} <span className="text-eps-primary font-medium">{item.castasPercentagem[i]}%</span>
            <button onClick={() => removeCasta(i)} className="ml-0.5 text-muted-foreground hover:text-red-600">×</button>
          </span>
        ))}
        {item.castas.length === 0 && <span className="text-[10px] text-muted-foreground italic">Nenhuma casta selecionada</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {getCastasPool().filter(c => !item.castas.includes(c)).map(c => (
          <button key={c} onClick={() => addCasta(c)} className="text-[10px] bg-eps-primary/5 text-eps-primary px-1.5 py-0.5 rounded hover:bg-eps-primary/15 transition-colors">
            + {c}
          </button>
        ))}
      </div>
    </div>
  </div>
);

function redistributePercentages(count: number): number[] {
  if (count === 0) return [];
  if (count === 1) return [100];
  if (count === 2) return [60, 40];
  if (count === 3) return [50, 30, 20];
  if (count === 4) return [40, 25, 20, 15];
  const base = Math.floor(100 / count);
  const remainder = 100 - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}
