import { useState } from "react";
import { ChevronDown, ChevronRight, ShieldCheck, Ship, Users, Tag, Store, Truck, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { type PortfolioMercado } from "@/data/portfolioData";
import {
  masterCertificacoes, masterRegras, masterCanais,
  masterConsumidores, masterTipoDistribuicao, masterTransporte,
} from "@/data/portfolioData";

const regiaoColor: Record<string, string> = {
  Europa: "bg-blue-50 text-blue-800",
  América: "bg-emerald-50 text-emerald-800",
  África: "bg-amber-50 text-amber-800",
  Ásia: "bg-rose-50 text-rose-800",
};

interface ProcuraViewProps {
  mercadosState: PortfolioMercado[];
  onUpdateMercado: (mercado: string, patch: Partial<PortfolioMercado>) => void;
}

/* ── Editable list component ── */
const EditableList = ({ title, icon, items, color, masterList, onUpdate }: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: string;
  masterList: string[];
  onUpdate: (items: string[]) => void;
}) => {
  const [newVal, setNewVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const safeItems = Array.isArray(items) ? items : [];

  const suggestions = masterList.filter(
    s => !safeItems.includes(s) && s.toLowerCase().includes(newVal.toLowerCase())
  ).slice(0, 5);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !safeItems.includes(trimmed)) {
      onUpdate([...safeItems, trimmed]);
    }
    setNewVal("");
    setShowSuggestions(false);
  };

  const removeItem = (item: string) => {
    onUpdate(safeItems.filter(i => i !== item));
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
        {icon} {title}
      </h4>
      <div className="flex flex-wrap gap-1">
        {safeItems.map(item => (
          <Badge key={item} variant="secondary" className={`text-[9px] gap-1 pr-1 ${color}`}>
            {item}
            <button onClick={() => removeItem(item)} className="hover:text-destructive ml-0.5">
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
        {safeItems.length === 0 && (
          <span className="text-[9px] text-muted-foreground italic">Sem itens</span>
        )}
      </div>
      <div className="relative">
        <div className="flex gap-1">
          <Input
            placeholder="Adicionar..."
            value={newVal}
            onChange={e => { setNewVal(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => { if (e.key === "Enter" && newVal.trim()) addItem(newVal); }}
            className="text-[10px] h-6 flex-1"
          />
          <button
            onClick={() => newVal.trim() && addItem(newVal)}
            className="text-[10px] text-eps-primary hover:text-eps-primary/80 px-1"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        {showSuggestions && newVal && suggestions.length > 0 && (
          <div className="absolute z-20 top-7 left-0 right-0 bg-white border rounded-md shadow-md max-h-32 overflow-auto">
            {suggestions.map(s => (
              <button key={s} onClick={() => addItem(s)}
                className="w-full text-left text-[10px] px-2 py-1.5 hover:bg-muted/50 truncate">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProcuraView = ({ mercadosState, onUpdateMercado }: ProcuraViewProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterRegiao, setFilterRegiao] = useState("all");

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const regioes = [...new Set(mercadosState.map(m => m.regiao))].sort();
  const filtered = mercadosState.filter(m => filterRegiao === "all" || m.regiao === filterRegiao);

  const byRegiao = filtered.reduce<Record<string, PortfolioMercado[]>>((acc, m) => {
    (acc[m.regiao] ||= []).push(m);
    return acc;
  }, {});

  const expandAll = () => {
    setExpandedRows(new Set(filtered.map(m => m.mercado)));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
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
                <TableHead className="text-xs font-semibold min-w-[120px]">Mercado</TableHead>
                <TableHead className="text-xs font-semibold text-center">Certificações</TableHead>
                <TableHead className="text-xs font-semibold text-center">Regras</TableHead>
                <TableHead className="text-xs font-semibold text-center">Transporte</TableHead>
                <TableHead className="text-xs font-semibold text-center">Canais</TableHead>
                <TableHead className="text-xs font-semibold text-center">Consumidores</TableHead>
                <TableHead className="text-xs font-semibold text-center">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(byRegiao).sort().map(regiao => (
                <RegiaoGroup key={regiao} regiao={regiao} mercados={byRegiao[regiao]}
                  expandedRows={expandedRows} onToggle={toggle} onUpdateMercado={onUpdateMercado} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
};

/* ── Region group ── */
const RegiaoGroup = ({ regiao, mercados, expandedRows, onToggle, onUpdateMercado }: {
  regiao: string; mercados: PortfolioMercado[]; expandedRows: Set<string>; onToggle: (id: string) => void;
  onUpdateMercado: (mercado: string, patch: Partial<PortfolioMercado>) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={8} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {regiao}
            <span className="text-[10px] font-normal text-muted-foreground">({mercados.length} mercados)</span>
          </div>
        </TableCell>
      </TableRow>
      {!collapsed && mercados.map(m => (
        <MercadoRow key={m.mercado} mercado={m} isExpanded={expandedRows.has(m.mercado)} onToggle={onToggle} onUpdateMercado={onUpdateMercado} />
      ))}
    </>
  );
};

/* ── Market row ── */
const MercadoRow = ({ mercado: m, isExpanded, onToggle, onUpdateMercado }: {
  mercado: PortfolioMercado; isExpanded: boolean; onToggle: (id: string) => void;
  onUpdateMercado: (mercado: string, patch: Partial<PortfolioMercado>) => void;
}) => (
  <>
    <TableRow className="text-xs border-b border-border/50 cursor-pointer hover:bg-muted/30" onClick={() => onToggle(m.mercado)}>
      <TableCell className="py-1.5 px-2">
        <span className="text-muted-foreground">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </span>
      </TableCell>
      <TableCell className="py-1.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{m.mercado}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${regiaoColor[m.regiao] || 'bg-muted'}`}>{m.regiao}</span>
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{m.certificacoes.length}</span>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{m.regrasEspecificas.length}</span>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="text-[10px] font-mono">{m.tempoTransporte[0] || '—'}</span>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{m.canais.length}</span>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{m.tipoConsumidores.length}</span>
      </TableCell>
      <TableCell className="text-center py-1.5 font-mono font-semibold text-[11px]">{m.volumeAnual}</TableCell>
    </TableRow>

    {isExpanded && (
      <TableRow className="bg-muted/20">
        <TableCell colSpan={8} className="py-4 px-6">
          <div className="grid grid-cols-3 gap-6">
            <EditableList
              title="Certificações"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              items={m.certificacoes}
              color="bg-orange-50 text-orange-700"
              masterList={masterCertificacoes}
              onUpdate={items => onUpdateMercado(m.mercado, { certificacoes: items })}
            />
            <EditableList
              title="Regras Específicas"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              items={m.regrasEspecificas}
              color="bg-red-50 text-red-700"
              masterList={masterRegras}
              onUpdate={items => onUpdateMercado(m.mercado, { regrasEspecificas: items })}
            />
            <EditableList
              title="Transporte"
              icon={<Truck className="w-3.5 h-3.5" />}
              items={m.tempoTransporte}
              color="bg-sky-50 text-sky-700"
              masterList={masterTransporte}
              onUpdate={items => onUpdateMercado(m.mercado, { tempoTransporte: items })}
            />
            <EditableList
              title="Canais de Distribuição"
              icon={<Store className="w-3.5 h-3.5" />}
              items={m.canais}
              color="bg-blue-50 text-blue-700"
              masterList={masterCanais}
              onUpdate={items => onUpdateMercado(m.mercado, { canais: items })}
            />
            <EditableList
              title="Tipo de Distribuição"
              icon={<Ship className="w-3.5 h-3.5" />}
              items={m.tipoDistribuicao}
              color="bg-indigo-50 text-indigo-700"
              masterList={masterTipoDistribuicao}
              onUpdate={items => onUpdateMercado(m.mercado, { tipoDistribuicao: items })}
            />
            <EditableList
              title="Perfil de Consumidores"
              icon={<Users className="w-3.5 h-3.5" />}
              items={m.tipoConsumidores}
              color="bg-violet-50 text-violet-700"
              masterList={masterConsumidores}
              onUpdate={items => onUpdateMercado(m.mercado, { tipoConsumidores: items })}
            />
          </div>
        </TableCell>
      </TableRow>
    )}
  </>
);
