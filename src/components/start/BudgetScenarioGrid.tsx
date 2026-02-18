import { useState } from 'react';
import { Plus, Copy, FilePlus, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const ORIGENS = ['Selout', 'Selin', 'Rotalagem', 'Engarrafamento', 'Transformação', 'Vendima'] as const;
type Origem = typeof ORIGENS[number];
type Tipo = 'Modelo' | 'Real' | 'Orçamento' | 'Cenário';

const TIPOS: Tipo[] = ['Modelo', 'Real', 'Orçamento', 'Cenário'];

interface OrigemConfig {
  origem: string;
  tipo: Tipo;
  ano: number;
}

interface BudgetEntry {
  id: number;
  cenario: string;
  ano: number;
  closed: boolean;
  origens: Record<Origem, OrigemConfig>;
}

const tipoBadgeClass = (tipo: Tipo): string => {
  switch (tipo) {
    case 'Modelo': return 'bg-chart-3/15 text-chart-3 border-chart-3/30';
    case 'Real': return 'bg-secondary/15 text-secondary border-secondary/30';
    case 'Orçamento': return 'bg-eps-gold/15 text-eps-gold border-eps-gold/30';
    case 'Cenário': return 'bg-eps-primary/15 text-eps-primary border-eps-primary/30';
    default: return '';
  }
};

// Mock data
const initialEntries: BudgetEntry[] = [
  {
    id: 1, cenario: 'Cenário Base', ano: 2026, closed: false,
    origens: {
      Selout: { origem: 'Selout', tipo: 'Real', ano: 2025 },
      Selin: { origem: 'Selin', tipo: 'Cenário', ano: 2026 },
      Rotalagem: { origem: 'Selin', tipo: 'Cenário', ano: 2026 },
      Engarrafamento: { origem: 'sel1', tipo: 'Cenário', ano: 2026 },
      Transformação: { origem: 'ENG', tipo: 'Cenário', ano: 2026 },
      Vendima: { origem: 'Vendima', tipo: 'Real', ano: 2025 },
    },
  },
  {
    id: 2, cenario: 'Orçamento 2026', ano: 2026, closed: false,
    origens: {
      Selout: { origem: 'Selout', tipo: 'Orçamento', ano: 2026 },
      Selin: { origem: 'Selin', tipo: 'Orçamento', ano: 2026 },
      Rotalagem: { origem: 'Rotalagem', tipo: 'Orçamento', ano: 2026 },
      Engarrafamento: { origem: 'ENG', tipo: 'Orçamento', ano: 2026 },
      Transformação: { origem: 'Transf', tipo: 'Orçamento', ano: 2026 },
      Vendima: { origem: 'Vendima', tipo: 'Modelo', ano: 2026 },
    },
  },
  {
    id: 3, cenario: 'Cenário Otimista', ano: 2026, closed: false,
    origens: {
      Selout: { origem: 'Selout', tipo: 'Cenário', ano: 2026 },
      Selin: { origem: 'Selin', tipo: 'Cenário', ano: 2026 },
      Rotalagem: { origem: 'Rotalagem', tipo: 'Modelo', ano: 2026 },
      Engarrafamento: { origem: 'ENG', tipo: 'Cenário', ano: 2026 },
      Transformação: { origem: 'Transf', tipo: 'Cenário', ano: 2026 },
      Vendima: { origem: 'Vendima', tipo: 'Cenário', ano: 2026 },
    },
  },
  {
    id: 4, cenario: 'Real 2025', ano: 2025, closed: true,
    origens: {
      Selout: { origem: 'Selout', tipo: 'Real', ano: 2025 },
      Selin: { origem: 'Selin', tipo: 'Real', ano: 2025 },
      Rotalagem: { origem: 'Rotalagem', tipo: 'Real', ano: 2025 },
      Engarrafamento: { origem: 'ENG', tipo: 'Real', ano: 2025 },
      Transformação: { origem: 'Transf', tipo: 'Real', ano: 2025 },
      Vendima: { origem: 'Vendima', tipo: 'Real', ano: 2025 },
    },
  },
];

export const BudgetScenarioGrid = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>(initialEntries);
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterAno, setFilterAno] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAno, setNewAno] = useState(2026);
  const [addMode, setAddMode] = useState<'zero' | 'copy'>('zero');
  const [copyFromId, setCopyFromId] = useState<number | null>(null);

  const anos = [...new Set(entries.map(e => e.ano))].sort((a, b) => b - a);

  const filtered = entries.filter(e => {
    if (filterAno !== 'all' && e.ano !== Number(filterAno)) return false;
    if (filterStatus === 'open' && e.closed) return false;
    if (filterStatus === 'closed' && !e.closed) return false;
    if (filterTipo !== 'all') {
      const hasType = Object.values(e.origens).some(o => o.tipo === filterTipo);
      if (!hasType) return false;
    }
    return true;
  });

  const handleClose = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, closed: !e.closed } : e));
  };

  const handleRemove = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const maxId = Math.max(...entries.map(e => e.id), 0);
    let newEntry: BudgetEntry;

    if (addMode === 'copy' && copyFromId) {
      const source = entries.find(e => e.id === copyFromId);
      if (!source) return;
      newEntry = {
        id: maxId + 1,
        cenario: newName,
        ano: newAno,
        closed: false,
        origens: { ...source.origens },
      };
    } else {
      const emptyOrigem: OrigemConfig = { origem: '—', tipo: 'Modelo', ano: newAno };
      newEntry = {
        id: maxId + 1,
        cenario: newName,
        ano: newAno,
        closed: false,
        origens: Object.fromEntries(ORIGENS.map(o => [o, { ...emptyOrigem }])) as Record<Origem, OrigemConfig>,
      };
    }

    setEntries(prev => [newEntry, ...prev]);
    setShowAddDialog(false);
    setNewName('');
    setAddMode('zero');
    setCopyFromId(null);
  };

  return (
    <div className="w-full max-w-7xl mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Orçamentos & Cenários</h3>
          <Badge variant="outline" className="text-[10px]">{filtered.length} de {entries.length}</Badge>
        </div>
        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-3.5 h-3.5" /> Novo Fluxo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterAno} onValueChange={setFilterAno}>
          <SelectTrigger className="w-24 h-7 text-xs"><SelectValue placeholder="Ano" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {anos.map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Tipos</SelectItem>
            {TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Abertos</SelectItem>
            <SelectItem value="closed">Fechados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="bg-card rounded-lg border shadow-sm">
        <ScrollArea className="max-h-[300px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-[10px] font-semibold min-w-[140px] sticky left-0 bg-muted/50 z-10">Cenário</TableHead>
                <TableHead className="text-[10px] font-semibold text-center w-14">Ano</TableHead>
                <TableHead className="text-[10px] font-semibold text-center w-16">Estado</TableHead>
                {ORIGENS.map(o => (
                  <TableHead key={o} className="text-center p-0" colSpan={3}>
                    <div className="text-[10px] font-bold text-eps-primary border-b border-border py-1">{o}</div>
                    <div className="flex">
                      <span className="flex-1 text-[9px] text-muted-foreground py-0.5">Origem</span>
                      <span className="flex-1 text-[9px] text-muted-foreground py-0.5">Tipo</span>
                      <span className="flex-1 text-[9px] text-muted-foreground py-0.5">Ano</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-16 text-center text-[10px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(entry => (
                <TableRow key={entry.id} className={`text-xs ${entry.closed ? 'opacity-50' : ''}`}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10 py-1.5 text-[11px]">
                    {entry.cenario}
                  </TableCell>
                  <TableCell className="text-center py-1.5 font-mono text-[11px] font-bold text-eps-primary">
                    {entry.ano}
                  </TableCell>
                  <TableCell className="text-center py-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[9px] ${entry.closed ? 'border-muted-foreground/30 text-muted-foreground' : 'border-secondary/40 text-secondary'}`}
                    >
                      {entry.closed ? 'Fechado' : 'Aberto'}
                    </Badge>
                  </TableCell>
                  {ORIGENS.map(o => {
                    const cfg = entry.origens[o];
                    return [
                      <TableCell key={`${o}-orig`} className="text-center py-1.5 text-[10px] text-muted-foreground">
                        {cfg.origem}
                      </TableCell>,
                      <TableCell key={`${o}-tipo`} className="text-center py-1.5">
                        <Badge variant="outline" className={`text-[9px] ${tipoBadgeClass(cfg.tipo)}`}>
                          {cfg.tipo}
                        </Badge>
                      </TableCell>,
                      <TableCell key={`${o}-ano`} className="text-center py-1.5 font-mono text-[10px]">
                        {cfg.ano}
                      </TableCell>,
                    ];
                  })}
                  <TableCell className="text-center py-1.5">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        title={entry.closed ? 'Reabrir' : 'Fechar'}
                        onClick={() => handleClose(entry.id)}
                      >
                        <X className={`w-3 h-3 ${entry.closed ? 'text-secondary' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3 + ORIGENS.length * 3 + 1} className="text-center py-6 text-muted-foreground text-xs">
                    Sem resultados para os filtros selecionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Novo Fluxo de Orçamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={addMode === 'zero' ? 'default' : 'outline'}
                className="flex-1 h-8 text-xs gap-1"
                onClick={() => setAddMode('zero')}
              >
                <FilePlus className="w-3.5 h-3.5" /> De Raiz
              </Button>
              <Button
                size="sm"
                variant={addMode === 'copy' ? 'default' : 'outline'}
                className="flex-1 h-8 text-xs gap-1"
                onClick={() => setAddMode('copy')}
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Existente
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Nome do Cenário</label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Cenário Pessimista" className="h-8 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Ano</label>
              <Input type="number" value={newAno} onChange={e => setNewAno(Number(e.target.value))} className="h-8 text-sm w-28" min={2024} max={2040} />
            </div>

            {addMode === 'copy' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Copiar de</label>
                <Select value={copyFromId ? String(copyFromId) : ''} onValueChange={v => setCopyFromId(Number(v))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecionar cenário..." /></SelectTrigger>
                  <SelectContent>
                    {entries.map(e => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.cenario} ({e.ano})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAddDialog(false)} className="h-8 text-xs">Cancelar</Button>
            <Button size="sm" onClick={handleAdd} className="h-8 text-xs" disabled={!newName.trim() || (addMode === 'copy' && !copyFromId)}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
