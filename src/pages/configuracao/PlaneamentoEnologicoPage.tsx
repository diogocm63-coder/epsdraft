import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ChevronDown, ChevronRight, Wine } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { enologicoProducts, type EnologicoProduct } from "@/data/enologicoData";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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

const PlaneamentoEnologicoPage = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");

  const toggleRow = (produto: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(produto) ? next.delete(produto) : next.add(produto);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedRows(new Set(filtered.map(p => p.produto)));
  };
  const collapseAll = () => setExpandedRows(new Set());

  const filtered = enologicoProducts.filter(p => {
    if (filterCategoria !== "all" && p.categoria !== filterCategoria) return false;
    if (filterTipo !== "all" && p.tipo !== filterTipo) return false;
    return true;
  });

  // Group by region
  const byRegion = filtered.reduce<Record<string, EnologicoProduct[]>>((acc, p) => {
    (acc[p.regiao] ||= []).push(p);
    return acc;
  }, {});

  const regions = Object.keys(byRegion).sort();

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="produtizacao"
        onConfigItemChange={() => {}}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Planeamento Enológico" icon={<Wine className="w-4 h-4" />} />

        <main className="flex-1 p-4 overflow-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Categoria:</label>
              <select
                value={filterCategoria}
                onChange={e => setFilterCategoria(e.target.value)}
                className="text-xs border rounded-md px-2 py-1.5 bg-white"
              >
                <option value="all">Todas</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Tipo:</label>
              <select
                value={filterTipo}
                onChange={e => setFilterTipo(e.target.value)}
                className="text-xs border rounded-md px-2 py-1.5 bg-white"
              >
                <option value="all">Todos</option>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={expandAll} className="text-xs text-eps-primary hover:underline">Expandir Tudo</button>
              <button onClick={collapseAll} className="text-xs text-muted-foreground hover:underline">Colapsar</button>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <ScrollArea className="max-h-[calc(100vh-180px)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold w-8"></TableHead>
                    <TableHead className="text-xs font-semibold min-w-[220px]">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Região</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Categoria</TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center">
                        <span>Barrica</span>
                        <span className="text-[10px] text-muted-foreground font-normal">(meses)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center">
                        <span>Cuba</span>
                        <span className="text-[10px] text-muted-foreground font-normal">(meses)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center">
                        <span>Garrafa</span>
                        <span className="text-[10px] text-muted-foreground font-normal">(meses)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex flex-col items-center">
                        <span>Total</span>
                        <span className="text-[10px] text-muted-foreground font-normal">(meses)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold min-w-[200px]">Castas Principais</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map(regiao => (
                    <RegionGroup
                      key={regiao}
                      regiao={regiao}
                      products={byRegion[regiao]}
                      expandedRows={expandedRows}
                      onToggle={toggleRow}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-6 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-900/10 border"></span> Tinto</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100/50 border"></span> Branco</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-pink-100/50 border"></span> Rosé</span>
            <span className="ml-4">Barrica = Estágio em madeira | Cuba = Estágio inox/cimento | Garrafa = Envelhecimento em garrafa</span>
          </div>
        </main>
      </div>
    </div>
  );
};

interface RegionGroupProps {
  regiao: string;
  products: EnologicoProduct[];
  expandedRows: Set<string>;
  onToggle: (produto: string) => void;
}

const RegionGroup = ({ regiao, products, expandedRows, onToggle }: RegionGroupProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Region header row */}
      <TableRow
        className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10"
        onClick={() => setCollapsed(!collapsed)}
      >
        <TableCell colSpan={10} className="py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eps-primary">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {regiao}
            <span className="text-[10px] font-normal text-muted-foreground">({products.length} produtos)</span>
          </div>
        </TableCell>
      </TableRow>

      {!collapsed && products.map(p => {
        const isExpanded = expandedRows.has(p.produto);
        const totalMeses = p.estagioBarrica + p.estagioCuba + p.estagioGarrafa;
        return (
          <TableRow key={p.produto} className="text-xs border-b border-border/50">
            <TableCell className="py-1.5 px-2">
              <button onClick={() => onToggle(p.produto)} className="text-muted-foreground hover:text-eps-primary">
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </TableCell>
            <TableCell className="py-1.5 font-medium">
              <div>
                {p.produto}
                {isExpanded && (
                  <div className="mt-2 ml-2 space-y-1">
                    {p.castas.map((c, i) => (
                      <div key={c} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-eps-primary/60"
                            style={{ width: `${p.castasPercentagem[i]}%` }}
                          />
                        </div>
                        <span>{c}</span>
                        <span className="text-eps-primary font-medium">{p.castasPercentagem[i]}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center py-1.5">{p.regiao}</TableCell>
            <TableCell className="text-center py-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tipoBgColor[p.tipo]}`}>
                {p.tipo}
              </span>
            </TableCell>
            <TableCell className="text-center py-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoriaBadge[p.categoria]}`}>
                {p.categoria}
              </span>
            </TableCell>
            <TableCell className="text-center py-1.5 font-mono">
              {p.estagioBarrica > 0 ? (
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">{p.estagioBarrica}</span>
              ) : (
                <span className="text-muted-foreground/40">—</span>
              )}
            </TableCell>
            <TableCell className="text-center py-1.5 font-mono">
              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{p.estagioCuba}</span>
            </TableCell>
            <TableCell className="text-center py-1.5 font-mono">
              <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px]">{p.estagioGarrafa}</span>
            </TableCell>
            <TableCell className="text-center py-1.5 font-mono font-semibold">
              {totalMeses}
            </TableCell>
            <TableCell className="py-1.5">
              <div className="flex flex-wrap gap-1">
                {p.castas.map((c, i) => (
                  <span key={c} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    {c} <span className="text-eps-primary font-medium">{p.castasPercentagem[i]}%</span>
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default PlaneamentoEnologicoPage;
