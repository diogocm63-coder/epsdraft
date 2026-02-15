import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Briefcase, Ship, ShieldCheck, Users, Tag } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { portfolioMercados, type PortfolioMercado } from "@/data/portfolioData";
import { AssociationButtons } from "@/components/portfolio/AssociationDialogs";

const regiaoColor: Record<string, string> = {
  Europa: "bg-blue-50 text-blue-800",
  América: "bg-emerald-50 text-emerald-800",
  África: "bg-amber-50 text-amber-800",
  Ásia: "bg-rose-50 text-rose-800",
};

const categoriaBadge: Record<string, string> = {
  Regional: "bg-muted text-muted-foreground",
  Reserva: "bg-eps-primary/10 text-eps-primary",
  Premium: "bg-eps-gold/20 text-amber-800",
};

const PlaneamentoPortfolioPage = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterRegiao, setFilterRegiao] = useState("all");
  const [mercadosState, setMercadosState] = useState<PortfolioMercado[]>(portfolioMercados);

  const toggle = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateMercado = (mercado: string, patch: Partial<PortfolioMercado>) => {
    setMercadosState(prev => prev.map(m => m.mercado === mercado ? { ...m, ...patch } : m));
  };

  const regioes = [...new Set(mercadosState.map(m => m.regiao))].sort();
  const filtered = mercadosState.filter(m => filterRegiao === "all" || m.regiao === filterRegiao);

  const byRegiao = filtered.reduce<Record<string, PortfolioMercado[]>>((acc, m) => {
    (acc[m.regiao] ||= []).push(m);
    return acc;
  }, {});

  const expandAll = () => {
    const ids = new Set<string>();
    filtered.forEach(m => ids.add(m.mercado));
    setExpandedRows(ids);
  };

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="portfolio"
        onConfigItemChange={() => {}}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Planeamento de Portfólio" icon={<Briefcase className="w-4 h-4" />} />
        <main className="flex-1 p-4 overflow-auto">
          {/* Filters */}
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

          {/* Matrix */}
          <div className="bg-white rounded-lg border shadow-sm">
            <ScrollArea className="max-h-[calc(100vh-180px)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold w-8" />
                    <TableHead className="text-xs font-semibold min-w-[120px]">Mercado</TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Certificações</div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[140px]">Regras Específicas</TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <div className="flex items-center justify-center gap-1"><Ship className="w-3 h-3" /> Transporte</div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-1"><Users className="w-3 h-3" /> Consumidores</div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[160px]">Mix Marcas (%)</TableHead>
                    <TableHead className="text-xs font-semibold text-center min-w-[140px]">
                      <div className="flex items-center justify-center gap-1"><Tag className="w-3 h-3" /> Marcas Específicas</div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(byRegiao).sort().map(regiao => (
                    <RegiaoGroup key={regiao} regiao={regiao} mercados={byRegiao[regiao]}
                      expandedRows={expandedRows} onToggle={toggle} onUpdateMercado={updateMercado} />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-6 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${categoriaBadge.Regional}`}>Regional</span></span>
            <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${categoriaBadge.Reserva}`}>Reserva</span></span>
            <span className="flex items-center gap-1"><span className={`px-1.5 py-0.5 rounded ${categoriaBadge.Premium}`}>Premium</span></span>
            <span className="ml-4">Expandir mercado para ver canais, detalhes e botões de associação</span>
          </div>
        </main>
      </div>
    </div>
  );
};

const RegiaoGroup = ({ regiao, mercados, expandedRows, onToggle, onUpdateMercado }: {
  regiao: string; mercados: PortfolioMercado[]; expandedRows: Set<string>; onToggle: (id: string) => void;
  onUpdateMercado: (mercado: string, patch: Partial<PortfolioMercado>) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <TableRow className="bg-eps-primary/5 cursor-pointer hover:bg-eps-primary/10" onClick={() => setCollapsed(!collapsed)}>
        <TableCell colSpan={9} className="py-2">
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

const MercadoRow = ({ mercado: m, isExpanded, onToggle, onUpdateMercado }: {
  mercado: PortfolioMercado; isExpanded: boolean; onToggle: (id: string) => void;
  onUpdateMercado: (mercado: string, patch: Partial<PortfolioMercado>) => void;
}) => (
  <>
    <TableRow className="text-xs border-b border-border/50">
      <TableCell className="py-1.5 px-2">
        <button onClick={() => onToggle(m.mercado)} className="text-muted-foreground hover:text-eps-primary">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </TableCell>
      <TableCell className="py-1.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{m.mercado}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${regiaoColor[m.regiao] || 'bg-muted'}`}>{m.regiao}</span>
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <div className="flex flex-wrap gap-1 justify-center">
          {m.certificacoes.map(c => (
            <span key={c} className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[9px]">{c}</span>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <div className="flex flex-wrap gap-1 justify-center">
          {m.regrasEspecificas.slice(0, 2).map(r => (
            <span key={r} className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[9px]">{r}</span>
          ))}
          {m.regrasEspecificas.length > 2 && (
            <span className="text-[9px] text-muted-foreground">+{m.regrasEspecificas.length - 2}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <span className="font-mono text-[11px] font-medium">{m.tempoTransporte}</span>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <div className="flex flex-wrap gap-1 justify-center">
          {m.tipoConsumidores.slice(0, 2).map(t => (
            <span key={t} className="bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded text-[9px]">{t}</span>
          ))}
          {m.tipoConsumidores.length > 2 && (
            <span className="text-[9px] text-muted-foreground">+{m.tipoConsumidores.length - 2}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <div className="flex items-center justify-center gap-1">
          <div className="flex w-20 h-2 rounded-full overflow-hidden bg-muted">
            {m.mixMarcas.map(mix => {
              const color = mix.categoria === 'Premium' ? 'bg-amber-500' : mix.categoria === 'Reserva' ? 'bg-eps-primary' : 'bg-gray-400';
              return <div key={mix.categoria} className={`h-full ${color}`} style={{ width: `${mix.percentagem}%` }} />;
            })}
          </div>
          <div className="flex gap-1 text-[9px]">
            {m.mixMarcas.map(mix => (
              <span key={mix.categoria} className="font-mono">{mix.percentagem}%</span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5">
        <div className="flex flex-wrap gap-1 justify-center">
          {m.marcasEspecificas.slice(0, 2).map(b => (
            <span key={b} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] truncate max-w-[100px]">{b}</span>
          ))}
          {m.marcasEspecificas.length > 2 && (
            <span className="text-[9px] text-muted-foreground">+{m.marcasEspecificas.length - 2}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center py-1.5 font-mono font-semibold text-[11px]">{m.volumeAnual}</TableCell>
    </TableRow>

    {/* Expanded detail with association buttons */}
    {isExpanded && (
      <TableRow className="bg-muted/20">
        <TableCell colSpan={9} className="py-3 px-6">
          {/* Association buttons */}
          <div className="mb-4 pb-3 border-b border-border/50">
            <AssociationButtons
              mercado={m.mercado}
              certificacoes={m.certificacoes}
              regras={m.regrasEspecificas}
              marcas={m.marcasEspecificas}
              onUpdateCertificacoes={items => onUpdateMercado(m.mercado, { certificacoes: items })}
              onUpdateRegras={items => onUpdateMercado(m.mercado, { regrasEspecificas: items })}
              onUpdateMarcas={items => onUpdateMercado(m.mercado, { marcasEspecificas: items })}
              onUpdateProdutos={items => onUpdateMercado(m.mercado, { marcasEspecificas: items })}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 text-[11px]">
            <div>
              <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Regras & Certificações</h4>
              <div className="space-y-1">
                {m.regrasEspecificas.map(r => (
                  <div key={r} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" /> Consumidores & Canais</h4>
              <div className="space-y-1 mb-2">
                {m.tipoConsumidores.map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-violet-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {m.canais.map(c => (
                  <span key={c} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px]">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3" /> Marcas Específicas</h4>
              <div className="space-y-1">
                {m.marcasEspecificas.map(b => (
                  <div key={b} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <h5 className="font-medium text-muted-foreground mb-1">Mix por Categoria</h5>
                {m.mixMarcas.map(mix => (
                  <div key={mix.categoria} className="flex items-center gap-2 mb-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${categoriaBadge[mix.categoria]}`}>{mix.categoria}</span>
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${mix.categoria === 'Premium' ? 'bg-amber-500' : mix.categoria === 'Reserva' ? 'bg-eps-primary' : 'bg-gray-400'}`}
                        style={{ width: `${mix.percentagem}%` }} />
                    </div>
                    <span className="font-mono text-[10px] w-8 text-right">{mix.percentagem}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )}
  </>
);

export default PlaneamentoPortfolioPage;
