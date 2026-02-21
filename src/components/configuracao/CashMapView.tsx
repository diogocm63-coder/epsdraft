import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const WINE_TYPES = [
  { value: "todos", label: "Todos" },
  { value: "tinto", label: "Tinto" },
  { value: "branco", label: "Branco" },
  { value: "rose", label: "Rosé" },
];

const CLASSIFICACOES = [
  { value: "todas", label: "Todas" },
  { value: "dop", label: "DOP" },
  { value: "regional", label: "Regional" },
  { value: "mesa", label: "Mesa" },
];

// Classification weight factors (share of total business)
const classificacaoWeights: Record<string, number> = {
  dop: 0.50,
  regional: 0.35,
  mesa: 0.15,
};

const REGIOES = [
  { value: "todas", label: "Todas" },
  { value: "douro", label: "Douro" },
  { value: "alentejo", label: "Alentejo" },
  { value: "dao", label: "Dão" },
  { value: "vinhoverde", label: "Vinho Verde" },
  { value: "lisboa", label: "Lisboa" },
];

// Region weight factors (share of total business)
const regionWeights: Record<string, number> = {
  douro: 0.35,
  alentejo: 0.25,
  dao: 0.15,
  vinhoverde: 0.13,
  lisboa: 0.12,
};

// Seasonal sales distribution by wine type (% per month)
const salesSeasonality: Record<string, number[]> = {
  tinto:  [6, 5, 7, 7, 8, 8, 7, 6, 9, 12, 14, 11],
  branco: [5, 5, 7, 8, 10, 14, 16, 14, 9, 5, 4, 3],
  rose:   [4, 4, 6, 9, 12, 16, 18, 15, 8, 4, 2, 2],
};

// Annual base values (€) — these could come from props/context
const baseValues = {
  tinto:  { vendas: 8500000, uva: 1200000, vinho: 600000, secos: 420000, marketing: 340000, vinha: 900000, custosFixos: 1800000 },
  branco: { vendas: 4200000, uva: 650000,  vinho: 320000, secos: 250000, marketing: 220000, vinha: 480000, custosFixos: 950000 },
  rose:   { vendas: 1800000, uva: 280000,  vinho: 140000, secos: 110000, marketing: 150000, vinha: 200000, custosFixos: 420000 },
};

// Vineyard campaign: costs concentrated Mar-Oct
const vinhaCampaign = [2, 4, 10, 12, 14, 14, 12, 12, 10, 6, 2, 2]; // % per month

// Fixed costs: evenly distributed
const fixedCostDist = Array(12).fill(100 / 12);

// Grape (uva): concentrated Sep-Oct (harvest)
const uvaDist = [0, 0, 0, 0, 0, 0, 2, 5, 35, 40, 15, 3];

// Wine purchase: Jan-Mar, Oct-Dec
const vinhoDist = [15, 15, 10, 5, 3, 2, 2, 3, 5, 15, 15, 10];

// Secos (bottling): spread across year with slight peaks
const secosDist = [7, 7, 8, 8, 9, 9, 10, 10, 9, 8, 8, 7]; // ~€0.60/L

// Marketing follows sales pattern
const marketingFollowsSales = true;

interface CashRow {
  mes: string;
  vendas: number;
  custosFixos: number;
  vinho: number;
  uva: number;
  secos: number;
  marketing: number;
  vinha: number;
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  saldoAcumulado: number;
}

const formatCurrency = (val: number): string => {
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M €`;
  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(0)}K €`;
  return `${val.toFixed(0)} €`;
};

const formatK = (val: number): string => `${(val / 1000).toFixed(0)}K`;

export const CashMapView = () => {
  const [wineType, setWineType] = useState("todos");
  const [regiao, setRegiao] = useState("todas");
  const [classificacao, setClassificacao] = useState("todas");

  const regionFactor = regiao === "todas" ? 1 : (regionWeights[regiao] || 0.15);
  const classificacaoFactor = classificacao === "todas" ? 1 : (classificacaoWeights[classificacao] || 0.15);

  const cashData = useMemo(() => {
    const types = wineType === "todos" ? ["tinto", "branco", "rose"] : [wineType];
    
    let saldoAcum = 0;
    const rows: CashRow[] = MESES.map((mes, i) => {
      let vendas = 0, custosFixos = 0, vinho = 0, uva = 0, secos = 0, marketing = 0, vinha = 0;

      types.forEach(t => {
        const base = baseValues[t as keyof typeof baseValues];
        const salesPct = salesSeasonality[t as keyof typeof salesSeasonality][i] / 100;
        
        const factor = regionFactor * classificacaoFactor;
        vendas += base.vendas * salesPct * factor;
        custosFixos += base.custosFixos * (fixedCostDist[i] / 100) * factor;
        vinho += base.vinho * (vinhoDist[i] / 100) * factor;
        uva += base.uva * (uvaDist[i] / 100) * factor;
        secos += base.secos * (secosDist[i] / 100) * factor;
        marketing += (marketingFollowsSales ? base.marketing * salesPct : base.marketing / 12) * factor;
        vinha += base.vinha * (vinhaCampaign[i] / 100) * factor;
      });

      const totalEntradas = vendas;
      const totalSaidas = custosFixos + vinho + uva + secos + marketing + vinha;
      const saldo = totalEntradas - totalSaidas;
      saldoAcum += saldo;

      return { mes, vendas, custosFixos, vinho, uva, secos, marketing, vinha, totalEntradas, totalSaidas, saldo, saldoAcumulado: saldoAcum };
    });

    return rows;
  }, [wineType, regionFactor, classificacaoFactor]);

  const chartData = cashData.map(row => ({
    mes: row.mes,
    Vendas: Math.round(row.vendas),
    "Custos Fixos": -Math.round(row.custosFixos),
    Uva: -Math.round(row.uva),
    Vinho: -Math.round(row.vinho),
    Secos: -Math.round(row.secos),
    Marketing: -Math.round(row.marketing),
    Vinha: -Math.round(row.vinha),
    Saldo: Math.round(row.saldo),
  }));

  // Waterfall data: each bar starts where the previous ended
  const waterfallData = useMemo(() => {
    return cashData.map((row, i) => {
      const prev = i > 0 ? cashData[i - 1].saldoAcumulado : 0;
      const isPositive = row.saldo >= 0;
      return {
        mes: row.mes,
        base: isPositive ? Math.round(prev) : Math.round(prev + row.saldo),
        value: Math.round(Math.abs(row.saldo)),
        saldo: Math.round(row.saldo),
        acumulado: Math.round(row.saldoAcumulado),
        isPositive,
      };
    });
  }, [cashData]);

  const totalVendas = cashData.reduce((s, r) => s + r.vendas, 0);
  const totalSaidas = cashData.reduce((s, r) => s + r.totalSaidas, 0);
  const saldoFinal = cashData[cashData.length - 1]?.saldoAcumulado || 0;

  const categoryColors: Record<string, string> = {
    Vendas: "#16a34a",
    "Custos Fixos": "#dc2626",
    Uva: "#b45309",
    Vinho: "#7c3aed",
    Secos: "#0891b2",
    Marketing: "#db2777",
    Vinha: "#65a30d",
  };

  return (
    <div className="space-y-6">
      {/* Filter & summary */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Tipo:</span>
            <Select value={wineType} onValueChange={setWineType}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WINE_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Região:</span>
            <Select value={regiao} onValueChange={setRegiao}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIOES.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Classificação:</span>
            <Select value={classificacao} onValueChange={setClassificacao}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFICACOES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-3 flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] text-muted-foreground">Total Entradas</p>
                <p className="text-sm font-bold text-emerald-700">{formatCurrency(totalVendas)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-3 flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-[10px] text-muted-foreground">Total Saídas</p>
                <p className="text-sm font-bold text-red-700">{formatCurrency(totalSaidas)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`border-sky-200 ${saldoFinal >= 0 ? 'bg-sky-50/50' : 'bg-red-50/50'}`}>
            <CardContent className="p-3 flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${saldoFinal >= 0 ? 'text-sky-600' : 'text-red-600'}`} />
              <div>
                <p className="text-[10px] text-muted-foreground">Saldo Acumulado</p>
                <p className={`text-sm font-bold ${saldoFinal >= 0 ? 'text-sky-700' : 'text-red-700'}`}>{formatCurrency(saldoFinal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart with two views */}
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="stacked">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-foreground">Fluxo de Cash Mensal</p>
              <TabsList className="h-7">
                <TabsTrigger value="stacked" className="text-[10px] px-2 h-6">Categorias</TabsTrigger>
                <TabsTrigger value="waterfall" className="text-[10px] px-2 h-6">Waterfall</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="stacked" className="mt-0">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} stackOffset="sign">
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={formatK} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(Math.abs(value)), name]}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                  <Bar dataKey="Vendas" stackId="stack" fill={categoryColors.Vendas} />
                  <Bar dataKey="Custos Fixos" stackId="stack" fill={categoryColors["Custos Fixos"]} />
                  <Bar dataKey="Uva" stackId="stack" fill={categoryColors.Uva} />
                  <Bar dataKey="Vinho" stackId="stack" fill={categoryColors.Vinho} />
                  <Bar dataKey="Secos" stackId="stack" fill={categoryColors.Secos} />
                  <Bar dataKey="Marketing" stackId="stack" fill={categoryColors.Marketing} />
                  <Bar dataKey="Vinha" stackId="stack" fill={categoryColors.Vinha} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="waterfall" className="mt-0">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={waterfallData}>
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={formatK} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-background border rounded-lg px-3 py-2 shadow-xl text-xs space-y-1">
                          <p className="font-semibold">{d.mes}</p>
                          <p className={d.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                            Saldo: {formatCurrency(d.saldo)}
                          </p>
                          <p className="text-sky-700 font-medium">Acumulado: {formatCurrency(d.acumulado)}</p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                  {/* Invisible base bar */}
                  <Bar dataKey="base" stackId="waterfall" fill="transparent" />
                  {/* Visible value bar with color per saldo */}
                  <Bar dataKey="value" stackId="waterfall" radius={[3, 3, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={index} fill={entry.isPositive ? "#16a34a" : "#dc2626"} />
                    ))}
                  </Bar>
                  {/* Accumulated line */}
                  <Line
                    type="monotone"
                    dataKey="acumulado"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#0284c7", stroke: "#fff", strokeWidth: 2 }}
                    name="Acumulado"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Table */}
      <ScrollArea className="rounded-md border" style={{ maxHeight: "450px" }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold min-w-[60px]">Mês</TableHead>
              <TableHead className="text-xs font-semibold text-right text-emerald-700">Vendas</TableHead>
              <TableHead className="text-xs font-semibold text-right text-red-700">Custos Fixos</TableHead>
              <TableHead className="text-xs font-semibold text-right text-amber-700">Uva</TableHead>
              <TableHead className="text-xs font-semibold text-right text-violet-700">Vinho</TableHead>
              <TableHead className="text-xs font-semibold text-right text-cyan-700">Secos</TableHead>
              <TableHead className="text-xs font-semibold text-right text-pink-700">Marketing</TableHead>
              <TableHead className="text-xs font-semibold text-right text-lime-700">Vinha</TableHead>
              <TableHead className="text-xs font-semibold text-right">Saldo</TableHead>
              <TableHead className="text-xs font-semibold text-right">Acumulado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashData.map((row, i) => (
              <TableRow key={row.mes} className="text-xs">
                <TableCell className="font-medium">{row.mes}</TableCell>
                <TableCell className="text-right text-emerald-700 font-medium">{formatCurrency(row.vendas)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(row.custosFixos)}</TableCell>
                <TableCell className="text-right text-amber-700">{formatCurrency(row.uva)}</TableCell>
                <TableCell className="text-right text-violet-700">{formatCurrency(row.vinho)}</TableCell>
                <TableCell className="text-right text-cyan-700">{formatCurrency(row.secos)}</TableCell>
                <TableCell className="text-right text-pink-700">{formatCurrency(row.marketing)}</TableCell>
                <TableCell className="text-right text-lime-700">{formatCurrency(row.vinha)}</TableCell>
                <TableCell className={`text-right font-semibold ${row.saldo >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {formatCurrency(row.saldo)}
                </TableCell>
                <TableCell className={`text-right font-bold ${row.saldoAcumulado >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
                  {formatCurrency(row.saldoAcumulado)}
                </TableCell>
              </TableRow>
            ))}
            {/* Totals */}
            <TableRow className="bg-muted/30 font-semibold text-xs border-t-2">
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right text-emerald-700 font-bold">{formatCurrency(totalVendas)}</TableCell>
              <TableCell className="text-right text-red-600 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.custosFixos, 0))}</TableCell>
              <TableCell className="text-right text-amber-700 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.uva, 0))}</TableCell>
              <TableCell className="text-right text-violet-700 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.vinho, 0))}</TableCell>
              <TableCell className="text-right text-cyan-700 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.secos, 0))}</TableCell>
              <TableCell className="text-right text-pink-700 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.marketing, 0))}</TableCell>
              <TableCell className="text-right text-lime-700 font-bold">{formatCurrency(cashData.reduce((s, r) => s + r.vinha, 0))}</TableCell>
              <TableCell className={`text-right font-bold ${saldoFinal >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(totalVendas - totalSaidas)}
              </TableCell>
              <TableCell className={`text-right font-bold ${saldoFinal >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
                {formatCurrency(saldoFinal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Notes */}
      <div className="text-[10px] text-muted-foreground space-y-1">
        <p>• <strong>Secos:</strong> Custo de engarrafamento estimado a ~€0,60/litro (rótulos, rolhas, garrafas, cápsulas)</p>
        <p>• <strong>Uva:</strong> Compra concentrada Set–Out (vindima)</p>
        <p>• <strong>Vinha:</strong> Custos de campanha concentrados Mar–Out</p>
        <p>• <strong>Marketing:</strong> Segue a sazonalidade das vendas</p>
      </div>
    </div>
  );
};
