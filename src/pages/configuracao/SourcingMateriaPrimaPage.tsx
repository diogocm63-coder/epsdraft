import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Sprout } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { sourcingProducts, type SourcingProduct } from "@/data/sourcingData";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const categorias = ["Regional", "Reserva", "Premium"] as const;
const tipos = ["Tinto", "Branco", "Rosé"] as const;

const tipoBgColor: Record<string, string> = {
  Tinto: "bg-red-900/10 text-red-800",
  Branco: "bg-amber-100/50 text-amber-800",
  Rosé: "bg-pink-100/50 text-pink-700",
};

const categoriaBadge: Record<string, string> = {
  Regional: "bg-muted text-muted-foreground",
  Reserva: "bg-eps-primary/10 text-eps-primary",
  Premium: "bg-eps-gold/20 text-amber-800",
};

const fmt = (n: number) => n.toLocaleString("pt-PT");

const SourcingMateriaPrimaPage = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = sourcingProducts.filter(p => {
    if (filterCategoria !== "all" && p.categoria !== filterCategoria) return false;
    if (filterTipo !== "all" && p.tipo !== filterTipo) return false;
    return true;
  });

  const byRegion = filtered.reduce<Record<string, SourcingProduct[]>>((acc, p) => {
    (acc[p.regiao] ||= []).push(p);
    return acc;
  }, {});

  const regions = Object.keys(byRegion).sort();

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
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Categoria:</label>
              <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}
                className="text-xs border rounded-md px-2 py-1.5 bg-white">
                <option value="all">Todas</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Tipo:</label>
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
                className="text-xs border rounded-md px-2 py-1.5 bg-white">
                <option value="all">Todos</option>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={expandAll} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
              <button onClick={() => setExpandedRows(new Set())} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
            </div>
          </div>

          {/* Matrix */}
          <div className="bg-white rounded-lg border shadow-sm">
            <ScrollArea className="max-h-[calc(100vh-180px)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold w-8"></TableHead>
                    <TableHead className="text-xs font-semibold min-w-[220px]">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Categoria</TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Necessidade</span><span className="text-[10px] text-muted-foreground font-normal">(L)</span></div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Prod. Própria</span><span className="text-[10px] text-muted-foreground font-normal">(L)</span></div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Compra Vinho</span><span className="text-[10px] text-muted-foreground font-normal">(L)</span></div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Rácio Própria</span><span className="text-[10px] text-muted-foreground font-normal">(%)</span></div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Rácio Compra</span><span className="text-[10px] text-muted-foreground font-normal">(%)</span></div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center"><span>Conversão</span><span className="text-[10px] text-muted-foreground font-normal">(L/Kg)</span></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map(regiao => (
                    <RegionGroup key={regiao} regiao={regiao} products={byRegion[regiao]}
                      expandedRows={expandedRows} onToggle={toggleRow} />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-6 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border"></span> Prod. Própria</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border"></span> Compra Vinho</span>
            <span className="ml-4">Quinta → Parcela → Talhão → Casta | Rácios de conversão Kg→L por tipo de vinho</span>
          </div>
        </main>
      </div>
    </div>
  );
};

interface RegionGroupProps {
  regiao: string;
  products: SourcingProduct[];
  expandedRows: Set<string>;
  onToggle: (id: string) => void;
}

const RegionGroup = ({ regiao, products, expandedRows, onToggle }: RegionGroupProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={10} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {regiao}
            <span className="text-[10px] font-normal text-muted-foreground">({products.length} produtos)</span>
          </div>
        </TableCell>
      </TableRow>
      {!collapsed && products.map(p => (
        <ProductRow key={p.produto} product={p} expandedRows={expandedRows} onToggle={onToggle} />
      ))}
    </>
  );
};

interface ProductRowProps {
  product: SourcingProduct;
  expandedRows: Set<string>;
  onToggle: (id: string) => void;
}

const ProductRow = ({ product: p, expandedRows, onToggle }: ProductRowProps) => {
  const isExpanded = expandedRows.has(p.produto);
  const avgRatio = p.tipo === 'Tinto' ? 0.74 : p.tipo === 'Rosé' ? 0.72 : 0.70;

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
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tipoBgColor[p.tipo]}`}>{p.tipo}</span>
        </TableCell>
        <TableCell className="text-center py-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoriaBadge[p.categoria]}`}>{p.categoria}</span>
        </TableCell>
        <TableCell className="text-center py-1.5 font-mono font-semibold">{fmt(p.necessidadeLitros)}</TableCell>
        <TableCell className="text-center py-1.5 font-mono">
          <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px]">{fmt(p.producaoPropria)}</span>
        </TableCell>
        <TableCell className="text-center py-1.5 font-mono">
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{fmt(p.compraVinho)}</span>
        </TableCell>
        <TableCell className="text-center py-1.5">
          <div className="flex items-center justify-center gap-1">
            <div className="w-12 bg-muted rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${p.ratioProducaoPropria}%` }} />
            </div>
            <span className="text-[10px] font-medium text-green-700">{p.ratioProducaoPropria}%</span>
          </div>
        </TableCell>
        <TableCell className="text-center py-1.5">
          <div className="flex items-center justify-center gap-1">
            <div className="w-12 bg-muted rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${p.ratioCompraVinho}%` }} />
            </div>
            <span className="text-[10px] font-medium text-blue-700">{p.ratioCompraVinho}%</span>
          </div>
        </TableCell>
        <TableCell className="text-center py-1.5 font-mono text-[10px]">{avgRatio}</TableCell>
      </TableRow>

      {/* Expanded: Quintas → Parcelas → Talhões */}
      {isExpanded && p.quintas.map(q => {
        const quintaKey = `${p.produto}::${q.quinta}`;
        const quintaExpanded = expandedRows.has(quintaKey);
        return (
          <TableRow key={quintaKey} className="bg-muted/20">
            <TableCell colSpan={10} className="py-0 px-0">
              <div className="ml-8">
                {/* Quinta */}
                <button onClick={() => onToggle(quintaKey)}
                  className="flex items-center gap-2 py-1.5 px-2 text-[11px] font-medium text-foreground hover:text-eps-primary w-full text-left">
                  {quintaExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Quinta</span>
                  {q.quinta}
                </button>

                {quintaExpanded && q.parcelas.map(par => {
                  const parKey = `${p.produto}::${q.quinta}::${par.parcela}`;
                  const parExpanded = expandedRows.has(parKey);
                  return (
                    <div key={parKey} className="ml-6">
                      <button onClick={() => onToggle(parKey)}
                        className="flex items-center gap-2 py-1 px-2 text-[11px] text-foreground hover:text-eps-primary w-full text-left">
                        {parExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">Parcela</span>
                        {par.parcela}
                      </button>

                      {parExpanded && (
                        <div className="ml-6 mb-2">
                          <table className="w-full text-[10px]">
                            <thead>
                              <tr className="text-muted-foreground border-b border-border/30">
                                <th className="text-left py-1 px-2 font-medium">Talhão</th>
                                <th className="text-left py-1 px-2 font-medium">Casta</th>
                                <th className="text-right py-1 px-2 font-medium">Área (ha)</th>
                                <th className="text-right py-1 px-2 font-medium">Rend. (Kg/ha)</th>
                                <th className="text-right py-1 px-2 font-medium">Produção (Kg)</th>
                                <th className="text-center py-1 px-2 font-medium">Rácio (L/Kg)</th>
                                <th className="text-right py-1 px-2 font-medium">Litros Est.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {par.talhoes.map(t => (
                                <tr key={t.talhao} className="border-b border-border/20 hover:bg-muted/30">
                                  <td className="py-1 px-2">
                                    <span className="bg-violet-50 text-violet-700 px-1 py-0.5 rounded">{t.talhao}</span>
                                  </td>
                                  <td className="py-1 px-2 font-medium">{t.casta}</td>
                                  <td className="py-1 px-2 text-right font-mono">{t.area}</td>
                                  <td className="py-1 px-2 text-right font-mono">{fmt(t.rendimento)}</td>
                                  <td className="py-1 px-2 text-right font-mono">{fmt(t.producaoEstimada)}</td>
                                  <td className="py-1 px-2 text-center font-mono">{t.ratioConversao}</td>
                                  <td className="py-1 px-2 text-right font-mono font-medium text-eps-primary">{fmt(t.litrosEstimados)}</td>
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

export default SourcingMateriaPrimaPage;
