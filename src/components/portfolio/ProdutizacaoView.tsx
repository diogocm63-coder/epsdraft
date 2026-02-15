import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wineProducts } from "@/data/wineData";

export interface ProdutizacaoItem {
  id: string;
  produto: string;
  capacidade: string;
  vinho: string;
  marca: string;
  rotuloEspecifico: string;
}

// Derive initial data from existing wine products
const buildInitialItems = (): ProdutizacaoItem[] =>
  wineProducts.map((p, i) => ({
    id: `prod-${i}`,
    produto: p.produto,
    capacidade: "750ml",
    vinho: p.tipo,
    marca: "V&W",
    rotuloEspecifico: "",
  }));

const capacidadeOptions = ["187ml", "250ml", "375ml", "500ml", "750ml", "1L", "1.5L", "3L", "5L", "Bag-in-Box 3L", "Bag-in-Box 5L"];
const vinhoOptions = ["Tinto", "Branco", "Rosé", "Espumante", "Porto", "Moscatel", "Licoroso"];

interface ProdutizacaoViewProps {
  associations?: unknown;
  onUpdateAssociations?: unknown;
}

export const ProdutizacaoView = (_props: ProdutizacaoViewProps) => {
  const [items, setItems] = useState<ProdutizacaoItem[]>(buildInitialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProdutizacaoItem | null>(null);
  const [search, setSearch] = useState("");

  const openNew = () => {
    setEditItem({ id: `prod-${Date.now()}`, produto: "", capacidade: "750ml", vinho: "Tinto", marca: "V&W", rotuloEspecifico: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: ProdutizacaoItem) => {
    setEditItem({ ...item });
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

  const remove = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const filtered = items.filter(p =>
    p.produto.toLowerCase().includes(search.toLowerCase()) ||
    p.vinho.toLowerCase().includes(search.toLowerCase()) ||
    p.marca.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Input
          placeholder="Pesquisar produto, vinho ou marca..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs text-xs h-8"
        />
        <Button size="sm" className="h-8 text-xs gap-1.5 ml-auto" onClick={openNew}>
          <Plus className="w-3.5 h-3.5" /> Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold min-w-[220px]">Produto</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[100px]">Capacidade</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[100px]">Vinho</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[120px]">Marca</TableHead>
                <TableHead className="text-xs font-semibold min-w-[180px]">Rótulo Específico</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map(item => (
                <TableRow key={item.id} className="text-xs border-b border-border/50 hover:bg-muted/30">
                  <TableCell className="py-2 font-medium">{item.produto}</TableCell>
                  <TableCell className="py-2 text-center">
                    <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">{item.capacidade}</span>
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      item.vinho === 'Tinto' ? 'bg-red-50 text-red-700' :
                      item.vinho === 'Branco' ? 'bg-amber-50 text-amber-700' :
                      item.vinho === 'Rosé' ? 'bg-pink-50 text-pink-700' :
                      'bg-muted text-muted-foreground'
                    }`}>{item.vinho}</span>
                  </TableCell>
                  <TableCell className="py-2 text-center text-[11px]">{item.marca}</TableCell>
                  <TableCell className="py-2 text-[11px] text-muted-foreground italic">
                    {item.rotuloEspecifico || "—"}
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-eps-primary">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => remove(item.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="mt-3 text-[10px] text-muted-foreground">
        {items.length} produto(s) configurado(s)
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) { setDialogOpen(false); setEditItem(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editItem && items.find(p => p.id === editItem.id) ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription className="text-xs">Preencha os campos do produto</DialogDescription>
          </DialogHeader>
          {editItem && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Produto *</label>
                <Input value={editItem.produto} onChange={e => setEditItem({ ...editItem, produto: e.target.value })} className="text-xs h-8" placeholder="Nome do produto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Capacidade</label>
                  <select value={editItem.capacidade} onChange={e => setEditItem({ ...editItem, capacidade: e.target.value })}
                    className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
                    {capacidadeOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Vinho</label>
                  <select value={editItem.vinho} onChange={e => setEditItem({ ...editItem, vinho: e.target.value })}
                    className="w-full text-xs border rounded-md px-2 py-1.5 bg-white h-8">
                    {vinhoOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Marca</label>
                <Input value={editItem.marca} onChange={e => setEditItem({ ...editItem, marca: e.target.value })} className="text-xs h-8" placeholder="Marca" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Rótulo Específico</label>
                <Input value={editItem.rotuloEspecifico} onChange={e => setEditItem({ ...editItem, rotuloEspecifico: e.target.value })} className="text-xs h-8" placeholder="Ex: Edição Limitada 2024" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => { setDialogOpen(false); setEditItem(null); }} className="text-xs">Cancelar</Button>
            <Button size="sm" onClick={save} className="text-xs gap-1">
              <Check className="w-3 h-3" /> Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
