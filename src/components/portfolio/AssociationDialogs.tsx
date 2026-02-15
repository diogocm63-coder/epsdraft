import { useState } from "react";
import { ShieldCheck, FileText, Tag, Plus, Package } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { wineProducts } from "@/data/wineData";
import { masterCertificacoes, masterRegras, masterMarcas } from "@/data/portfolioData";

/* ── Shared multi-select dialog ─────────────────────────────── */
interface ChecklistDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  masterList: string[];
  selected: string[];
  onSave: (items: string[]) => void;
  allowNew?: boolean;
}

export const ChecklistDialog = ({
  open, onOpenChange, title, description, icon, masterList, selected, onSave, allowNew,
}: ChecklistDialogProps) => {
  const [checked, setChecked] = useState<Set<string>>(new Set(selected));
  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState("");

  const handleOpen = (v: boolean) => {
    if (v) { setChecked(new Set(selected)); setSearch(""); setNewItem(""); }
    onOpenChange(v);
  };

  const toggle = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const addNew = () => {
    const trimmed = newItem.trim();
    if (trimmed && !checked.has(trimmed)) {
      setChecked(prev => new Set(prev).add(trimmed));
      setNewItem("");
    }
  };

  const filtered = masterList.filter(i =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            {icon} {title}
          </DialogTitle>
          <DialogDescription className="text-xs">{description}</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Pesquisar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-xs h-8"
        />

        <ScrollArea className="max-h-[280px] pr-2">
          <div className="space-y-1">
            {filtered.map(item => (
              <label key={item} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-xs">
                <Checkbox
                  checked={checked.has(item)}
                  onCheckedChange={() => toggle(item)}
                />
                <span>{item}</span>
                {selected.includes(item) && (
                  <Badge variant="secondary" className="text-[8px] ml-auto px-1 py-0">atual</Badge>
                )}
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center">Sem resultados</p>
            )}
          </div>
        </ScrollArea>

        {allowNew && (
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar novo..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addNew()}
              className="text-xs h-8 flex-1"
            />
            <Button size="sm" variant="outline" onClick={addNew} className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Adicionar
            </Button>
          </div>
        )}

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

/* ── Product-specific dialog (with category & details) ─────── */
interface ProdutoDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mercado: string;
  selectedMarcas: string[];
  onSave: (marcas: string[]) => void;
}

export const ProdutoEspecificoDialog = ({
  open, onOpenChange, mercado, selectedMarcas, onSave,
}: ProdutoDialogProps) => {
  const [checked, setChecked] = useState<Set<string>>(new Set(selectedMarcas));
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const handleOpen = (v: boolean) => {
    if (v) { setChecked(new Set(selectedMarcas)); setSearch(""); setFilterCat("all"); }
    onOpenChange(v);
  };

  const toggle = (p: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  const filtered = wineProducts.filter(p =>
    (filterCat === "all" || p.categoria === filterCat) &&
    p.produto.toLowerCase().includes(search.toLowerCase())
  );

  const catColor: Record<string, string> = {
    Regional: "bg-muted text-muted-foreground",
    Reserva: "bg-eps-primary/10 text-eps-primary",
    Premium: "bg-amber-100 text-amber-800",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4" /> Produtos Específicos — {mercado}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Selecione os produtos do catálogo e defina detalhes por mercado
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Pesquisar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs h-8 flex-1"
          />
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="text-xs border rounded-md px-2 py-1 bg-white"
          >
            <option value="all">Todas</option>
            <option value="Regional">Regional</option>
            <option value="Reserva">Reserva</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <ScrollArea className="max-h-[320px] pr-2">
          <div className="space-y-0.5">
            {filtered.map(p => (
              <label key={p.produto} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-xs">
                <Checkbox
                  checked={checked.has(p.produto)}
                  onCheckedChange={() => toggle(p.produto)}
                />
                <span className="flex-1">{p.produto}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${catColor[p.categoria] || ''}`}>
                  {p.categoria}
                </span>
                <span className="text-[9px] text-muted-foreground">{p.regiao}</span>
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

/* ── Action buttons row ────────────────────────────────────── */
interface AssociationButtonsProps {
  mercado: string;
  certificacoes: string[];
  regras: string[];
  marcas: string[];
  onUpdateCertificacoes: (items: string[]) => void;
  onUpdateRegras: (items: string[]) => void;
  onUpdateMarcas: (items: string[]) => void;
  onUpdateProdutos: (items: string[]) => void;
}

export const AssociationButtons = ({
  mercado, certificacoes, regras, marcas,
  onUpdateCertificacoes, onUpdateRegras, onUpdateMarcas, onUpdateProdutos,
}: AssociationButtonsProps) => {
  const [openCert, setOpenCert] = useState(false);
  const [openRegras, setOpenRegras] = useState(false);
  const [openMarcas, setOpenMarcas] = useState(false);
  const [openNovas, setOpenNovas] = useState(false);
  const [openProduto, setOpenProduto] = useState(false);

  const btnClass = "h-6 px-2 text-[10px] gap-1";

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" className={btnClass} onClick={() => setOpenCert(true)}>
          <ShieldCheck className="w-3 h-3" /> Certificações
        </Button>
        <Button variant="outline" size="sm" className={btnClass} onClick={() => setOpenRegras(true)}>
          <FileText className="w-3 h-3" /> Regras
        </Button>
        <Button variant="outline" size="sm" className={btnClass} onClick={() => setOpenMarcas(true)}>
          <Tag className="w-3 h-3" /> Marcas Existentes
        </Button>
        <Button variant="outline" size="sm" className={btnClass} onClick={() => setOpenNovas(true)}>
          <Plus className="w-3 h-3" /> Marcas Novas
        </Button>
        <Button variant="default" size="sm" className={`${btnClass} bg-eps-primary hover:bg-eps-primary/90`} onClick={() => setOpenProduto(true)}>
          <Package className="w-3 h-3" /> Produto Específico
        </Button>
      </div>

      <ChecklistDialog
        open={openCert} onOpenChange={setOpenCert}
        title={`Certificações — ${mercado}`}
        description="Selecione as certificações obrigatórias para este mercado"
        icon={<ShieldCheck className="w-4 h-4" />}
        masterList={masterCertificacoes}
        selected={certificacoes}
        onSave={onUpdateCertificacoes}
      />
      <ChecklistDialog
        open={openRegras} onOpenChange={setOpenRegras}
        title={`Regras Específicas — ${mercado}`}
        description="Selecione as regras aplicáveis a este mercado"
        icon={<FileText className="w-4 h-4" />}
        masterList={masterRegras}
        selected={regras}
        onSave={onUpdateRegras}
      />
      <ChecklistDialog
        open={openMarcas} onOpenChange={setOpenMarcas}
        title={`Marcas Existentes — ${mercado}`}
        description="Associe marcas do catálogo existente"
        icon={<Tag className="w-4 h-4" />}
        masterList={masterMarcas}
        selected={marcas}
        onSave={onUpdateMarcas}
      />
      <ChecklistDialog
        open={openNovas} onOpenChange={setOpenNovas}
        title={`Marcas Novas — ${mercado}`}
        description="Adicione novas marcas para este mercado"
        icon={<Plus className="w-4 h-4" />}
        masterList={marcas}
        selected={marcas}
        onSave={onUpdateMarcas}
        allowNew
      />
      <ProdutoEspecificoDialog
        open={openProduto} onOpenChange={setOpenProduto}
        mercado={mercado}
        selectedMarcas={marcas}
        onSave={onUpdateProdutos}
      />
    </>
  );
};
