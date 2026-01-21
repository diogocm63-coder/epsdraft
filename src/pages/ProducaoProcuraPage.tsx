import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Brain, TrendingUp, Leaf, Target, AlertTriangle, Zap, Table2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Line, ComposedChart, LineChart } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

// KPI data
const kpiData = {
  aiInsights: { value: 14, status: "A atualizar clusters" },
  greeneries: { value: 700, change: 12 },
  demand: { value: "8.2K", change: 8 },
  capacity: { value: 304, stress: 6.6 }
};

// Seasonal Demand Patterns data by wine type
const seasonalDemandData = [
  { month: "Jan", tinto: 55, branco: 40, rose: 25 },
  { month: "Fev", tinto: 52, branco: 38, rose: 28 },
  { month: "Mar", tinto: 58, branco: 45, rose: 35 },
  { month: "Abr", tinto: 62, branco: 52, rose: 45 },
  { month: "Mai", tinto: 65, branco: 58, rose: 55 },
  { month: "Jun", tinto: 60, branco: 68, rose: 70 },
  { month: "Jul", tinto: 55, branco: 80, rose: 85 },
  { month: "Ago", tinto: 58, branco: 85, rose: 90 },
  { month: "Set", tinto: 72, branco: 75, rose: 65 },
  { month: "Out", tinto: 80, branco: 60, rose: 45 },
  { month: "Nov", tinto: 85, branco: 48, rose: 32 },
  { month: "Dez", tinto: 95, branco: 55, rose: 38 }
];

// AI Insights alerts
const aiAlerts = [
  { type: "warning", title: "Alerta de Rendimento", desc: "Produção de Tinto pode ficar 12% abaixo em Dezembro..." },
  { type: "trend", title: "Aumento de Procura", desc: "Vinhos Branco Premium com aumento de 23% no mercado..." },
  { type: "optimize", title: "Otimização", desc: "Eficiência da linha de engarrafamento de Rosé pode melhorar 8%..." }
];

// Wine Sales Forecast data - months
const wineSalesData = [
  { month: "Jan", yieldEstimate: 145, tinto: 85, branco: 45, rose: 15 },
  { month: "Fev", yieldEstimate: 155, tinto: 88, branco: 48, rose: 19 },
  { month: "Mar", yieldEstimate: 175, tinto: 95, branco: 58, rose: 22 },
  { month: "Abr", yieldEstimate: 195, tinto: 102, branco: 65, rose: 28 },
  { month: "Mai", yieldEstimate: 220, tinto: 108, branco: 78, rose: 34 },
  { month: "Jun", yieldEstimate: 265, tinto: 105, branco: 110, rose: 50 },
  { month: "Jul", yieldEstimate: 310, tinto: 98, branco: 135, rose: 77 },
  { month: "Ago", yieldEstimate: 335, tinto: 102, branco: 145, rose: 88 },
  { month: "Set", yieldEstimate: 290, tinto: 125, branco: 110, rose: 55 },
  { month: "Out", yieldEstimate: 245, tinto: 140, branco: 75, rose: 30 },
  { month: "Nov", yieldEstimate: 220, tinto: 148, branco: 52, rose: 20 },
  { month: "Dez", yieldEstimate: 285, tinto: 175, branco: 75, rose: 35 }
];

// Harvest Prediction Model data
const harvestPredictionData = [
  { name: "Qualidade Uva", status: "Bom", value: 85, color: "#4ECDC4" },
  { name: "Rendimento Previsto", status: "Excelente", value: 92, color: "#4ECDC4" },
  { name: "Maturação", status: "Normal", value: 78, color: "#C9A227" },
  { name: "Risco Climático", status: "Baixo", value: 25, color: "#4ECDC4" },
  { name: "Stock Disponível", status: "Adequado", value: 68, color: "#C9A227" }
];

// Production Capacity data - months
const productionCapacityData = [
  { period: "Jan", current: 165, capacity: 210 },
  { period: "Fev", current: 140, capacity: 210 },
  { period: "Mar", current: 155, capacity: 210 },
  { period: "Abr", current: 175, capacity: 210 },
  { period: "Mai", current: 185, capacity: 210 },
  { period: "Jun", current: 200, capacity: 210 },
  { period: "Jul", current: 195, capacity: 210 },
  { period: "Ago", current: 190, capacity: 210 },
  { period: "Set", current: 205, capacity: 210 },
  { period: "Out", current: 180, capacity: 210 },
  { period: "Nov", current: 170, capacity: 210 },
  { period: "Dez", current: 185, capacity: 210 }
];

// Forecast Accuracy data - months
const forecastAccuracyData = [
  { month: "Jan", demand: 300, marketDemand: 320 },
  { month: "Fev", demand: 320, marketDemand: 340 },
  { month: "Mar", demand: 350, marketDemand: 380 },
  { month: "Abr", demand: 380, marketDemand: 400 },
  { month: "Mai", demand: 420, marketDemand: 450 },
  { month: "Jun", demand: 480, marketDemand: 510 },
  { month: "Jul", demand: 520, marketDemand: 550 },
  { month: "Ago", demand: 540, marketDemand: 565 },
  { month: "Set", demand: 490, marketDemand: 520 },
  { month: "Out", demand: 450, marketDemand: 475 },
  { month: "Nov", demand: 410, marketDemand: 435 },
  { month: "Dez", demand: 480, marketDemand: 510 }
];

// Production Planning data - all 12 months
const productionPlanningData = [
  { task: "Vindima Douro", status: "Concluído", jan: 100, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0, jul: 0, ago: 0, set: 100, out: 80, nov: 0, dez: 0 },
  { task: "Fermentação", status: "Concluído", jan: 50, fev: 100, mar: 50, abr: 0, mai: 0, jun: 0, jul: 0, ago: 0, set: 30, out: 100, nov: 80, dez: 0 },
  { task: "Estágio Barrica", status: "Em Progresso", jan: 0, fev: 30, mar: 70, abr: 100, mai: 80, jun: 50, jul: 30, ago: 20, set: 0, out: 0, nov: 50, dez: 80 },
  { task: "Engarrafamento", status: "Em Progresso", jan: 0, fev: 0, mar: 20, abr: 60, mai: 100, jun: 80, jul: 50, ago: 30, set: 0, out: 0, nov: 0, dez: 40 },
  { task: "Rotulagem", status: "Pendente", jan: 0, fev: 0, mar: 0, abr: 30, mai: 70, jun: 100, jul: 80, ago: 50, set: 0, out: 0, nov: 0, dez: 20 },
  { task: "Expedição", status: "Pendente", jan: 0, fev: 0, mar: 0, abr: 0, mai: 40, jun: 100, jul: 100, ago: 80, set: 0, out: 0, nov: 0, dez: 50 }
];

// Extended Product forecast table data
const productForecastData = [
  { produto: "V&W Douro Tinto", tipo: "Tinto", previsaoVendas: 12500, previsaoCapacidade: 14000, ocupacao: 89 },
  { produto: "V&W Alentejo Tinto", tipo: "Tinto", previsaoVendas: 9800, previsaoCapacidade: 11000, ocupacao: 89 },
  { produto: "V&W Douro Branco", tipo: "Branco", previsaoVendas: 8200, previsaoCapacidade: 9500, ocupacao: 86 },
  { produto: "V&W Alvarinho", tipo: "Branco", previsaoVendas: 7500, previsaoCapacidade: 8000, ocupacao: 94 },
  { produto: "V&W Douro Rosé", tipo: "Rosé", previsaoVendas: 4200, previsaoCapacidade: 5000, ocupacao: 84 },
  { produto: "V&W Reserva Tinto", tipo: "Tinto", previsaoVendas: 6800, previsaoCapacidade: 7200, ocupacao: 94 },
  { produto: "V&W Reserva Branco", tipo: "Branco", previsaoVendas: 5400, previsaoCapacidade: 6000, ocupacao: 90 },
  { produto: "V&W Premium", tipo: "Tinto", previsaoVendas: 3200, previsaoCapacidade: 3500, ocupacao: 91 },
  { produto: "V&W Grande Reserva", tipo: "Tinto", previsaoVendas: 2100, previsaoCapacidade: 2500, ocupacao: 84 },
  { produto: "V&W Moscatel", tipo: "Branco", previsaoVendas: 4800, previsaoCapacidade: 5200, ocupacao: 92 },
  { produto: "V&W Espumante", tipo: "Branco", previsaoVendas: 3600, previsaoCapacidade: 4000, ocupacao: 90 },
  { produto: "V&W Rosé Premium", tipo: "Rosé", previsaoVendas: 2800, previsaoCapacidade: 3200, ocupacao: 88 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído": return "bg-green-500";
    case "Em Progresso": return "bg-amber-500";
    case "Em Risco": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

const getTypeColor = (tipo: string) => {
  switch (tipo) {
    case "Tinto": return "text-eps-primary";
    case "Branco": return "text-amber-600";
    case "Rosé": return "text-pink-500";
    default: return "text-gray-600";
  }
};

const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const ProducaoProcuraPage = () => {
  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EPSHeader title="Produção e Procura" icon="P" />
        
        <main className="flex-1 p-2 overflow-hidden">
          <div className="flex flex-col gap-2 h-full">
            {/* Top KPI Row - Matching Image Exactly */}
            <div className="flex justify-center gap-4 py-1">
              {/* AI Insights */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-2 flex items-center gap-3 shadow-sm">
                <Brain className="w-5 h-5 text-eps-primary" />
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">AI Insights</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{kpiData.aiInsights.value}</span>
                    <span className="text-[9px] text-gray-400">{kpiData.aiInsights.status}</span>
                  </div>
                </div>
              </div>

              {/* Estufas */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-2 flex items-center gap-3 shadow-sm">
                <Leaf className="w-5 h-5 text-eps-gold" />
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Estufas</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{kpiData.greeneries.value}</span>
                    <span className="text-[9px] text-red-500 font-medium">▼{kpiData.greeneries.change}%</span>
                  </div>
                </div>
              </div>

              {/* Procura */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-2 flex items-center gap-3 shadow-sm">
                <TrendingUp className="w-5 h-5 text-eps-primary" />
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Procura</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{kpiData.demand.value}</span>
                    <span className="text-[9px] text-green-500 font-medium">▲{kpiData.demand.change}%</span>
                  </div>
                </div>
              </div>

              {/* Capacidade */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-2 flex items-center gap-3 shadow-sm">
                <Zap className="w-5 h-5 text-eps-gold" />
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Capacidade</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{kpiData.capacity.value}</span>
                    <span className="text-[9px] text-gray-400">{kpiData.capacity.stress}% Stress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1: 4 Charts */}
            <div className="grid grid-cols-12 gap-2 h-[38%]">
              {/* Padrões Sazonais de Procura */}
              <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-eps-gold" />
                  <h3 className="text-[10px] font-semibold text-gray-700">Padrões Sazonais de Procura</h3>
                </div>
                <div className="flex gap-2 mb-1 text-[8px]">
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-eps-primary rounded"></span>Tinto</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-[#C9A227] rounded"></span>Branco</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-pink-400 rounded"></span>Rosé</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalDemandData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" tick={{ fontSize: 7 }} interval={1} />
                      <YAxis tick={{ fontSize: 7 }} width={22} />
                      <Tooltip contentStyle={{ fontSize: 9 }} />
                      <Line type="monotone" dataKey="tinto" stroke="#8B1538" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="branco" stroke="#C9A227" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="rose" stroke="#F472B6" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Previsão de Vendas de Vinho */}
              <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Leaf className="w-3 h-3 text-eps-gold" />
                  <h3 className="text-[10px] font-semibold text-gray-700">Previsão de Vendas de Vinho</h3>
                </div>
                <div className="flex gap-2 mb-1 text-[7px]">
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-eps-primary rounded"></span>Rendimento</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded"></span>Tinto</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-eps-gold rounded"></span>Branco</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-pink-400 rounded"></span>Rosé</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={wineSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" tick={{ fontSize: 7 }} interval={1} />
                      <YAxis tick={{ fontSize: 7 }} width={22} />
                      <Tooltip contentStyle={{ fontSize: 9 }} />
                      <Area type="monotone" dataKey="yieldEstimate" fill="#8B1538" fillOpacity={0.15} stroke="#8B1538" strokeWidth={1.5} />
                      <Line type="monotone" dataKey="tinto" stroke="#4ECDC4" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="branco" stroke="#C9A227" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="rose" stroke="#F472B6" strokeWidth={1.5} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Capacidade de Produção */}
              <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-eps-gold" />
                  <h3 className="text-[10px] font-semibold text-gray-700">Capacidade de Produção</h3>
                </div>
                <div className="flex gap-2 text-[8px] mb-1">
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded"></span>Atual</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-eps-gold rounded"></span>Capacidade</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionCapacityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="period" tick={{ fontSize: 6 }} interval={0} />
                      <YAxis tick={{ fontSize: 7 }} width={22} />
                      <Tooltip contentStyle={{ fontSize: 9 }} />
                      <Bar dataKey="current" fill="#4ECDC4" radius={[1, 1, 0, 0]} />
                      <Bar dataKey="capacity" fill="#C9A227" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Precisão de Previsão */}
              <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3 text-[#4ECDC4]" />
                  <h3 className="text-[10px] font-semibold text-gray-700">Precisão de Previsão</h3>
                </div>
                <div className="flex gap-2 text-[8px] mb-1">
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded"></span>Procura</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-eps-gold rounded"></span>Mercado</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" tick={{ fontSize: 6 }} interval={0} />
                      <YAxis tick={{ fontSize: 7 }} width={22} />
                      <Tooltip contentStyle={{ fontSize: 9 }} />
                      <Line type="monotone" dataKey="demand" stroke="#4ECDC4" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="marketDemand" stroke="#C9A227" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: AI Insights | Previsão por Produto | Planeamento + Modelo */}
            <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
              {/* AI Insights - Small Left */}
              <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Brain className="w-3 h-3 text-eps-primary" />
                  <h3 className="text-[10px] font-semibold text-gray-700">AI Insights</h3>
                </div>
                <div className="flex-1 space-y-1.5 overflow-auto">
                  {aiAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-1.5 p-1.5 bg-gray-50 rounded">
                      <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${alert.type === 'warning' ? 'text-amber-500' : alert.type === 'trend' ? 'text-green-500' : 'text-blue-500'}`} />
                      <div>
                        <div className="text-[8px] font-medium text-gray-700">{alert.title}</div>
                        <div className="text-[7px] text-gray-500 leading-tight">{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previsão por Produto - Center Large */}
              <div className="col-span-5 bg-white rounded-lg border border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Table2 className="w-3 h-3 text-eps-primary" />
                  <h3 className="text-[10px] font-semibold text-gray-700">Previsão por Produto</h3>
                </div>
                <ScrollArea className="flex-1">
                  <table className="w-full text-[8px]">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-gray-500 border-b">
                        <th className="text-left py-1 font-medium">Produto</th>
                        <th className="text-center py-1 font-medium">Tipo</th>
                        <th className="text-right py-1 font-medium">Prev. Vendas (L)</th>
                        <th className="text-right py-1 font-medium">Prev. Capacidade (L)</th>
                        <th className="text-center py-1 font-medium">Ocupação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productForecastData.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-1 text-gray-700 font-medium">{row.produto}</td>
                          <td className={`py-1 text-center font-medium ${getTypeColor(row.tipo)}`}>{row.tipo}</td>
                          <td className="py-1 text-right text-gray-700">{row.previsaoVendas.toLocaleString()}</td>
                          <td className="py-1 text-right text-gray-700">{row.previsaoCapacidade.toLocaleString()}</td>
                          <td className="py-1 text-center">
                            <span className={`px-1 py-0.5 rounded text-white text-[7px] ${row.ocupacao >= 90 ? 'bg-amber-500' : 'bg-green-500'}`}>
                              {row.ocupacao}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              {/* Right Column: Planeamento + Modelo - Equal Height */}
              <div className="col-span-5 grid grid-rows-2 gap-2">
                {/* Planeamento de Produção */}
                <div className="bg-white rounded-lg border border-gray-200 p-2 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-eps-primary" />
                      <h3 className="text-[10px] font-semibold text-gray-700">Planeamento de Produção</h3>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 w-full">
                    <div className="min-w-[600px]">
                      <table className="w-full text-[7px]">
                        <thead className="sticky top-0 bg-white">
                          <tr className="text-gray-500 border-b">
                            <th className="text-left py-1 font-medium w-24">Tarefa</th>
                            <th className="text-left py-1 font-medium w-16">Estado</th>
                            {months.map(m => (
                              <th key={m} className="text-center py-1 font-medium w-8 capitalize">{m}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {productionPlanningData.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-1 text-gray-700">{row.task}</td>
                              <td className="py-1">
                                <span className={`text-[6px] px-1 py-0.5 rounded text-white ${getStatusColor(row.status)}`}>
                                  {row.status}
                                </span>
                              </td>
                              {months.map(m => {
                                const val = row[m as keyof typeof row] as number;
                                return (
                                  <td key={m} className="py-1 px-0.5">
                                    {val > 0 ? (
                                      <div 
                                        className={`h-2 rounded ${val === 100 ? 'bg-[#4ECDC4]' : val >= 50 ? 'bg-[#C9A227]' : 'bg-[#8B1538]'}`} 
                                        style={{ width: `${Math.max(val, 20)}%` }}
                                      />
                                    ) : (
                                      <span className="text-gray-300">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>

                {/* Modelo de Previsão de Colheita - Same Height */}
                <div className="bg-white rounded-lg border border-gray-200 p-2 flex flex-col min-h-0">
                  <h3 className="text-[10px] font-semibold text-gray-700 mb-1.5">Modelo de Previsão de Colheita</h3>
                  <div className="flex-1 flex flex-col justify-around">
                    {harvestPredictionData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[8px] text-gray-600 w-24 truncate">{item.name}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className={`text-[8px] font-medium w-8 text-right ${item.value >= 70 ? 'text-green-600' : item.value >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {item.value}%
                        </span>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded ${item.value >= 70 ? 'bg-green-100 text-green-700' : item.value >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProducaoProcuraPage;
