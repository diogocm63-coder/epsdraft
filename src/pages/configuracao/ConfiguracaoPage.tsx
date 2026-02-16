import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  RefreshCw,
  Sprout,
  Link,
  Calendar,
  Filter,
} from "lucide-react";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Settings } from "lucide-react";
import { enologicoProducts } from "@/data/enologicoData";
import { produtoMercadoAssociations, masterMercados } from "@/data/portfolioData";
import { wineProducts, wineTipos, wineCategorias, wineRegioes } from "@/data/wineData";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const configItems = [
  { id: "procura", label: "Procura", icon: Search, path: "/configuracao/planeamento-portfolio?tab=procura" },
  { id: "produtizacao", label: "Produtização", icon: Package, path: "/configuracao/planeamento-portfolio?tab=produtizacao" },
  { id: "transformacao", label: "Transformação", icon: RefreshCw, path: "/configuracao/transformacao-adegas" },
  { id: "agricultura", label: "Agricultura", icon: Sprout, path: "/configuracao/agricultura" },
];

const relationItems = [
  { id: "planeamento-portfolio", label: "Planeamento de Portfólio", path: "/configuracao/planeamento-portfolio?tab=portfolio" },
  { id: "planeamento-enologico", label: "Planeamento Enológico", path: "/configuracao/planeamento-enologico" },
  { id: "sourcing-materia-prima", label: "Sourcing de Matéria-Prima", path: "/configuracao/sourcing-materia-prima" },
];

const LOGISTICA_MESES = 1; // default logistics time in months
const LOTEAMENTO_MESES = 1; // blending period

// Calculate timeline dates working backwards from sale year
// Harvest ends November. From harvest end: +Cuba +Barrica +Loteamento(1m) +Garrafa +Logistics = ready for sale
const calcTimeline = (anoVenda: number, cubaMeses: number, barricaMeses: number, garrafaMeses: number) => {
  const totalMesesAposVendima = cubaMeses + barricaMeses + LOTEAMENTO_MESES + garrafaMeses + LOGISTICA_MESES;

  // Sale date is January of anoVenda. Work backwards from there to find harvest.
  // harvestEnd (Nov) + totalMeses = sale ready date
  // So harvest November year X, then X + totalMeses months later = ready
  // We need: harvestMonth(Nov=11) + totalMeses <= anoVenda * 12 + 1 (Jan of sale year)
  // harvestYear*12 + 11 + totalMeses <= anoVenda*12 + 1
  // harvestYear <= anoVenda - (11 + totalMeses - 1) / 12

  const harvestDate = new Date(anoVenda, 0, 1); // Jan of sale year
  harvestDate.setMonth(harvestDate.getMonth() - totalMesesAposVendima);
  // Harvest must be in or before November of that year
  const anoVendima = harvestDate.getMonth() <= 10 ? harvestDate.getFullYear() : harvestDate.getFullYear();

  // Build dates forward from harvest end (November of vendima year)
  const vendima = new Date(anoVendima, 10, 30); // Nov 30
  const fimCuba = new Date(vendima);
  fimCuba.setMonth(fimCuba.getMonth() + cubaMeses);
  const fimBarrica = new Date(fimCuba);
  fimBarrica.setMonth(fimBarrica.getMonth() + barricaMeses);
  const fimLoteamento = new Date(fimBarrica);
  fimLoteamento.setMonth(fimLoteamento.getMonth() + LOTEAMENTO_MESES);
  const engarrafamento = new Date(fimLoteamento); // bottling = end of loteamento
  const fimGarrafa = new Date(engarrafamento);
  fimGarrafa.setMonth(fimGarrafa.getMonth() + garrafaMeses);
  const rotulagem = new Date(fimGarrafa); // labeling after bottle aging
  const disponivel = new Date(rotulagem);
  disponivel.setMonth(disponivel.getMonth() + LOGISTICA_MESES);

  return {
    anoVendima: vendima.getFullYear(),
    mesVendima: formatDate(vendima),
    inicioBarrica: formatDate(fimCuba),
    engarrafamento: formatDate(engarrafamento),
    rotulagem: formatDate(rotulagem),
    disponivel: formatDate(disponivel),
    totalMeses: totalMesesAposVendima,
  };
};

const formatDate = (d: Date) => {
  const m = d.toLocaleString("pt-PT", { month: "short" });
  return `${m.charAt(0).toUpperCase() + m.slice(1)} ${d.getFullYear()}`;
};

// For "Ano de Orçamento" view: determine which harvest year is at each stage during budget year
const getVintageAtStage = (
  budgetYear: number,
  cubaMeses: number,
  barricaMeses: number,
  garrafaMeses: number
) => {
  const byStart = new Date(budgetYear, 0, 1);
  const byEnd = new Date(budgetYear, 11, 31);
  const results: Record<string, number[]> = {
    vendima: [],
    cuba: [],
    barrica: [],
    garrafa: [],
    acabado: [],
  };

  // Check vintages from budgetYear back to budgetYear-10
  for (let v = budgetYear; v >= budgetYear - 10; v--) {
    const harvest = new Date(v, 9, 1); // Oct 1 (start of harvest)
    const harvestEnd = new Date(v, 10, 30); // Nov 30
    const fimCuba = new Date(harvestEnd);
    fimCuba.setMonth(fimCuba.getMonth() + cubaMeses);
    const fimBarrica = new Date(fimCuba);
    fimBarrica.setMonth(fimBarrica.getMonth() + barricaMeses);
    const fimLoteamento = new Date(fimBarrica);
    fimLoteamento.setMonth(fimLoteamento.getMonth() + LOTEAMENTO_MESES);
    const fimGarrafa = new Date(fimLoteamento);
    fimGarrafa.setMonth(fimGarrafa.getMonth() + garrafaMeses);
    const disponivel = new Date(fimGarrafa);
    disponivel.setMonth(disponivel.getMonth() + LOGISTICA_MESES);

    // Check if each stage overlaps with the budget year [byStart, byEnd]
    const overlaps = (stageStart: Date, stageEnd: Date) =>
      stageStart <= byEnd && stageEnd >= byStart;

    if (overlaps(harvest, harvestEnd)) {
      results.vendima.push(v);
    }
    if (overlaps(harvestEnd, fimCuba)) {
      results.cuba.push(v);
    }
    if (barricaMeses > 0 && overlaps(fimCuba, fimBarrica)) {
      results.barrica.push(v);
    }
    if (overlaps(fimLoteamento, fimGarrafa)) {
      results.garrafa.push(v);
    }
    if (overlaps(disponivel, new Date(disponivel.getFullYear() + 2, 0, 1))) {
      results.acabado.push(v);
    }
  }

  return results;
};

type ViewMode = "evolucao" | "orcamento";

const ConfiguracaoPage = () => {
  const navigate = useNavigate();
  const [activeConfigItem, setActiveConfigItem] = useState<string>("procura");
  const [anoVenda, setAnoVenda] = useState<number>(2027);
  const [viewMode, setViewMode] = useState<ViewMode>("evolucao");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [filterRegiao, setFilterRegiao] = useState<string>("all");
  const [filterMercado, setFilterMercado] = useState<string>("all");

  const gridData = useMemo(() => {
    return enologicoProducts
      .filter((p) => {
        if (filterTipo !== "all" && p.tipo !== filterTipo) return false;
        if (filterCategoria !== "all" && p.categoria !== filterCategoria) return false;
        if (filterRegiao !== "all" && p.regiao !== filterRegiao) return false;
        if (filterMercado !== "all") {
          const assoc = produtoMercadoAssociations.find((a) => a.produto === p.produto);
          if (!assoc || !assoc.mercados.some((m) => m.mercado === filterMercado)) return false;
        }
        return true;
      })
      .map((p) => {
        const timeline = calcTimeline(anoVenda, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa);
        const assoc = produtoMercadoAssociations.find((a) => a.produto === p.produto);
        const mercados = assoc?.mercados.map((m) => m.mercado) || [];
        const stages = viewMode === "orcamento"
          ? getVintageAtStage(anoVenda, p.estagioCuba, p.estagioBarrica, p.estagioGarrafa)
          : null;
        return { ...p, ...timeline, mercados, stages };
      });
  }, [anoVenda, filterTipo, filterCategoria, filterRegiao, filterMercado, viewMode]);

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem={activeConfigItem}
        onConfigItemChange={setActiveConfigItem}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Configuração" icon={<Settings className="w-4 h-4" />} />
        <main className="flex-1 flex flex-col p-6 overflow-y-auto gap-6">
          {/* Top cards row */}
          <div className="flex items-center justify-center gap-3">
            {configItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeConfigItem === item.id;
              const relation = index < relationItems.length ? relationItems[index] : null;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveConfigItem(item.id);
                      navigate(item.path);
                    }}
                    className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 w-48 ${
                      isActive
                        ? "bg-eps-primary text-white border-eps-primary shadow-lg"
                        : "bg-white text-foreground border-border hover:border-eps-primary/30 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? "bg-white/20" : "bg-eps-background group-hover:bg-eps-light"
                      }`}
                    >
                      <Icon className={`w-7 h-7 ${isActive ? "text-white" : "text-eps-primary"}`} />
                    </div>
                    <span className="font-semibold text-lg">{item.label}</span>
                  </button>
                  {relation && (
                    <button
                      onClick={() => navigate(relation.path)}
                      title={relation.label}
                      className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border border-eps-primary/20 bg-white hover:bg-eps-primary hover:border-eps-primary transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <Link className="w-5 h-5 text-eps-primary group-hover:text-white transition-colors" />
                      <span className="text-[9px] text-eps-primary group-hover:text-white font-medium leading-tight text-center max-w-[60px]">
                        {relation.label}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Planning Grid */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-eps-primary" />
              <h2 className="text-lg font-bold text-eps-primary">Planeamento Temporal de Produtos</h2>
              <div className="ml-auto flex gap-1 bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("evolucao")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === "evolucao"
                      ? "bg-eps-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Evolução de Estágios
                </button>
                <button
                  onClick={() => setViewMode("orcamento")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === "orcamento"
                      ? "bg-eps-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Ano de Orçamento
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-4">
              {viewMode === "evolucao"
                ? "Com base no ano de venda, calcula retroativamente: Vendima → Barrica → Engarrafamento → Rotulagem → Disponível. Fórmula: Vendima (Nov) + Cuba + Barrica + Loteamento (1m) + Garrafa + Logística (1m)."
                : `Para o ano de orçamento ${anoVenda}, mostra qual a colheita (ano de vindima) que está em cada fase do processo produtivo.`}
            </p>

            {/* Filters row */}
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {viewMode === "evolucao" ? "Ano de Venda" : "Ano de Orçamento"}
                </label>
                <Input
                  type="number"
                  value={anoVenda}
                  onChange={(e) => setAnoVenda(Number(e.target.value))}
                  className="w-24 h-8 text-sm"
                  min={2024}
                  max={2040}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {wineTipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Categoria</label>
                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {wineCategorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Região</label>
                <Select value={filterRegiao} onValueChange={setFilterRegiao}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {wineRegioes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Mercado</label>
                <Select value={filterMercado} onValueChange={setFilterMercado}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {masterMercados.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="h-8 text-xs">
                {gridData.length} produtos
              </Badge>
            </div>

            {/* Data grid */}
            <ScrollArea className="rounded-md border" style={{ maxHeight: "520px" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold sticky left-0 bg-muted/50 z-10 min-w-[200px]">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Categoria</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Região</TableHead>
                    {viewMode === "evolucao" ? (
                      <>
                        <TableHead className="text-xs font-semibold text-center whitespace-nowrap">Cuba (m)</TableHead>
                        <TableHead className="text-xs font-semibold text-center whitespace-nowrap">Barrica (m)</TableHead>
                        <TableHead className="text-xs font-semibold text-center whitespace-nowrap">Garrafa (m)</TableHead>
                        <TableHead className="text-xs font-semibold text-center whitespace-nowrap">Total (m)</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-eps-primary/5 whitespace-nowrap">🍇 Vendima</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-eps-primary/5 whitespace-nowrap">🪵 Barrica</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-eps-primary/5 whitespace-nowrap">🍾 Engarrafar</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-eps-primary/5 whitespace-nowrap">🏷️ Rotular</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-eps-primary/5 whitespace-nowrap">📦 Disponível</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-xs font-semibold text-center bg-purple-50 whitespace-nowrap">🍇 Vindima</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-amber-50 whitespace-nowrap">🫙 Cuba</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-orange-50 whitespace-nowrap">🪵 Barrica</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-blue-50 whitespace-nowrap">🍾 Garrafa</TableHead>
                        <TableHead className="text-xs font-semibold text-center bg-green-50 whitespace-nowrap">✅ Acabado</TableHead>
                      </>
                    )}
                    <TableHead className="text-xs font-semibold min-w-[140px]">Mercados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gridData.map((row, idx) => (
                    <TableRow key={idx} className="text-xs">
                      <TableCell className="font-medium sticky left-0 bg-white z-10">{row.produto}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[10px] ${
                          row.tipo === 'Tinto' ? 'border-red-300 text-red-700' :
                          row.tipo === 'Branco' ? 'border-yellow-300 text-yellow-700' :
                          'border-pink-300 text-pink-600'
                        }`}>{row.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.categoria}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.regiao}</TableCell>
                      {viewMode === "evolucao" ? (
                        <>
                          <TableCell className="text-center">{row.estagioCuba}</TableCell>
                          <TableCell className="text-center">{row.estagioBarrica}</TableCell>
                          <TableCell className="text-center">{row.estagioGarrafa}</TableCell>
                          <TableCell className="text-center font-semibold text-eps-primary">{row.totalMeses}</TableCell>
                          <TableCell className="text-center bg-eps-primary/5 font-medium">Nov {row.anoVendima}</TableCell>
                          <TableCell className="text-center bg-eps-primary/5">{row.inicioBarrica}</TableCell>
                          <TableCell className="text-center bg-eps-primary/5">{row.engarrafamento}</TableCell>
                          <TableCell className="text-center bg-eps-primary/5">{row.rotulagem}</TableCell>
                          <TableCell className="text-center bg-eps-primary/5 font-medium text-green-700">{row.disponivel}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-center bg-purple-50 font-medium">{row.stages?.vendima.length ? row.stages.vendima.join(", ") : "—"}</TableCell>
                          <TableCell className="text-center bg-amber-50 font-medium">{row.stages?.cuba.length ? row.stages.cuba.join(", ") : "—"}</TableCell>
                          <TableCell className="text-center bg-orange-50 font-medium">{row.stages?.barrica.length ? row.stages.barrica.join(", ") : "—"}</TableCell>
                          <TableCell className="text-center bg-blue-50 font-medium">{row.stages?.garrafa.length ? row.stages.garrafa.join(", ") : "—"}</TableCell>
                          <TableCell className="text-center bg-green-50 font-semibold text-green-700">{row.stages?.acabado.length ? row.stages.acabado.join(", ") : "—"}</TableCell>
                        </>
                      )}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {row.mercados.length > 0 ? row.mercados.map((m) => (
                            <Badge key={m} variant="secondary" className="text-[9px] px-1.5 py-0">{m}</Badge>
                          )) : <span className="text-muted-foreground text-[10px]">—</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracaoPage;
