import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Brain, TrendingUp, Leaf, Target, AlertTriangle, Zap, Table2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Line, ComposedChart, LineChart, Legend } from "recharts";

// KPI data
const kpiData = {
  aiInsights: {
    value: 14,
    status: "A atualizar clusters"
  },
  greeneries: {
    value: 700,
    change: 12,
    status: "Processo Otimizado"
  },
  demand: {
    value: "8.2K",
    change: 8,
    price: "$6.66"
  },
  accuracy: {
    value: "96%",
    change: 4
  },
  capacity: {
    value: 304,
    stress: 6.6
  }
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

// AI Insights alerts - corrected for wine types
const aiAlerts = [
  {
    type: "warning",
    title: "Alerta de Rendimento",
    desc: "Produção de Tinto pode ficar 12% abaixo em Dezembro..."
  },
  {
    type: "trend",
    title: "Aumento de Procura",
    desc: "Vinhos Branco Premium com aumento de 23% no mercado..."
  },
  {
    type: "optimize",
    title: "Otimização",
    desc: "Eficiência da linha de engarrafamento de Rosé pode melhorar 8%..."
  }
];

// Wine Sales Forecast data - months instead of quarters
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

// Harvest Prediction Model data - improved
const harvestPredictionData = [
  { name: "Qualidade Uva", status: "Bom", value: 85, color: "#4ECDC4" },
  { name: "Rendimento Previsto", status: "Excelente", value: 92, color: "#4ECDC4" },
  { name: "Maturação", status: "Normal", value: 78, color: "#C9A227" },
  { name: "Risco Climático", status: "Baixo", value: 25, color: "#4ECDC4" },
  { name: "Stock Disponível", status: "Adequado", value: 68, color: "#C9A227" }
];

// Production Capacity data - months instead of quarters
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

// Production Planning data - months
const productionPlanningData = [
  { task: "Vindima Douro", status: "Concluído", jan: 100, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0 },
  { task: "Fermentação", status: "Concluído", jan: 50, fev: 100, mar: 50, abr: 0, mai: 0, jun: 0 },
  { task: "Estágio Barrica", status: "Em Progresso", jan: 0, fev: 30, mar: 70, abr: 100, mai: 80, jun: 50 },
  { task: "Engarrafamento", status: "Em Progresso", jan: 0, fev: 0, mar: 20, abr: 60, mai: 100, jun: 80 },
  { task: "Rotulagem", status: "Pendente", jan: 0, fev: 0, mar: 0, abr: 30, mai: 70, jun: 100 },
  { task: "Expedição", status: "Pendente", jan: 0, fev: 0, mar: 0, abr: 0, mai: 40, jun: 100 }
];

// Product forecast table data
const productForecastData = [
  { produto: "V&W Douro Tinto", tipo: "Tinto", previsaoVendas: 12500, previsaoCapacidade: 14000, ocupacao: 89 },
  { produto: "V&W Alentejo Tinto", tipo: "Tinto", previsaoVendas: 9800, previsaoCapacidade: 11000, ocupacao: 89 },
  { produto: "V&W Douro Branco", tipo: "Branco", previsaoVendas: 8200, previsaoCapacidade: 9500, ocupacao: 86 },
  { produto: "V&W Alvarinho", tipo: "Branco", previsaoVendas: 7500, previsaoCapacidade: 8000, ocupacao: 94 },
  { produto: "V&W Douro Rosé", tipo: "Rosé", previsaoVendas: 4200, previsaoCapacidade: 5000, ocupacao: 84 },
  { produto: "V&W Reserva Tinto", tipo: "Tinto", previsaoVendas: 6800, previsaoCapacidade: 7200, ocupacao: 94 },
  { produto: "V&W Reserva Branco", tipo: "Branco", previsaoVendas: 5400, previsaoCapacidade: 6000, ocupacao: 90 },
  { produto: "V&W Premium", tipo: "Tinto", previsaoVendas: 3200, previsaoCapacidade: 3500, ocupacao: 91 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-green-500";
    case "Em Progresso":
      return "bg-amber-500";
    case "Em Risco":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const getTypeColor = (tipo: string) => {
  switch (tipo) {
    case "Tinto":
      return "text-eps-primary";
    case "Branco":
      return "text-amber-600";
    case "Rosé":
      return "text-pink-500";
    default:
      return "text-gray-600";
  }
};

const ProducaoProcuraPage = () => {
  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EPSHeader title="Produção e Procura" icon="P" />
        
        <main className="flex-1 p-3 overflow-hidden">
          <div className="flex flex-col gap-2 h-full">
            {/* Top KPI Row - Compact and Centered */}
            <div className="flex justify-center gap-2">
              {/* AI Insights KPI */}
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 flex items-center gap-3 min-w-[160px]">
                <Brain className="w-5 h-5 text-eps-primary" />
                <div>
                  <div className="text-[8px] text-gray-500 uppercase leading-tight">AI Insights</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold leading-tight">{kpiData.aiInsights.value}</span>
                    <span className="text-[7px] text-gray-400">{kpiData.aiInsights.status}</span>
                  </div>
                </div>
              </div>

              {/* Greeneries KPI */}
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 flex items-center gap-3 min-w-[160px]">
                <Leaf className="w-5 h-5 text-eps-gold" />
                <div>
                  <div className="text-[8px] text-gray-500 uppercase leading-tight">Estufas</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold leading-tight">{kpiData.greeneries.value}</span>
                    <span className="text-[8px] text-red-500">▼{kpiData.greeneries.change}%</span>
                  </div>
                </div>
              </div>

              {/* Demand KPI */}
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 flex items-center gap-3 min-w-[160px]">
                <TrendingUp className="w-5 h-5 text-eps-primary" />
                <div>
                  <div className="text-[8px] text-gray-500 uppercase leading-tight">Procura</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold leading-tight">{kpiData.demand.value}</span>
                    <span className="text-[8px] text-green-500">▲{kpiData.demand.change}%</span>
                  </div>
                </div>
              </div>

              {/* Accuracy KPI */}
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 flex items-center gap-3 min-w-[160px]">
                <Target className="w-5 h-5 text-eps-primary" />
                <div>
                  <div className="text-[8px] text-gray-500 uppercase leading-tight">Precisão</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold leading-tight">{kpiData.accuracy.value}</span>
                    <span className="text-[8px] text-green-500">▲{kpiData.accuracy.change}%</span>
                  </div>
                </div>
              </div>

              {/* Capacity KPI */}
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 flex items-center gap-3 min-w-[160px]">
                <Zap className="w-5 h-5 text-eps-gold" />
                <div>
                  <div className="text-[8px] text-gray-500 uppercase leading-tight">Capacidade</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold leading-tight">{kpiData.capacity.value}</span>
                    <span className="text-[7px] text-gray-400">{kpiData.capacity.stress}% Stress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Row */}
            <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
              {/* Left Column */}
              <div className="col-span-2 flex flex-col gap-2">
                {/* Seasonal Demand Patterns - by Type */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-4 h-4 text-eps-gold" />
                    <h3 className="text-[11px] font-semibold text-gray-700">Padrões Sazonais de Procura</h3>
                  </div>
                  <div className="flex gap-3 mb-1.5 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded"></span>Tinto</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>Branco</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-400 rounded"></span>Rosé</span>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={seasonalDemandData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" tick={{ fontSize: 8 }} axisLine={true} tickLine={true} />
                        <YAxis tick={{ fontSize: 8 }} axisLine={true} tickLine={true} width={25} />
                        <Tooltip contentStyle={{ fontSize: 10 }} />
                        <Line type="monotone" dataKey="tinto" stroke="#8B1538" strokeWidth={2} dot={false} name="Tinto" />
                        <Line type="monotone" dataKey="branco" stroke="#C9A227" strokeWidth={2} dot={false} name="Branco" />
                        <Line type="monotone" dataKey="rose" stroke="#F472B6" strokeWidth={2} dot={false} name="Rosé" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-eps-primary" />
                      <h3 className="text-[11px] font-semibold text-gray-700">AI Insights</h3>
                    </div>
                    <span className="text-[8px] text-gray-400">Atualizado há 2h</span>
                  </div>
                  <div className="space-y-1.5 flex-1 overflow-auto">
                    {aiAlerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${alert.type === 'warning' ? 'text-amber-500' : alert.type === 'trend' ? 'text-green-500' : 'text-blue-500'}`} />
                        <div>
                          <div className="text-[9px] font-medium text-gray-700">{alert.title}</div>
                          <div className="text-[8px] text-gray-500 leading-tight">{alert.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Column - Main Charts */}
              <div className="col-span-6 flex flex-col gap-2">
                {/* Wine Sales Forecast */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex-[1.2] flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-eps-gold" />
                      <h3 className="text-xs font-semibold text-gray-800">Previsão de Vendas de Vinho</h3>
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase">Machine Learning Analytics</span>
                  </div>
                  <div className="flex gap-4 mb-1.5 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded"></span>Estimativa de Rendimento</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Tinto</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Branco</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-400 rounded"></span>Rosé</span>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={wineSalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="yieldEstimate" fill="#8B1538" fillOpacity={0.2} stroke="#8B1538" strokeWidth={2} name="Estimativa de Rendimento" />
                        <Line type="monotone" dataKey="tinto" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 2.5 }} name="Tinto" />
                        <Line type="monotone" dataKey="branco" stroke="#C9A227" strokeWidth={2} dot={{ r: 2.5 }} name="Branco" />
                        <Line type="monotone" dataKey="rose" stroke="#F472B6" strokeWidth={2} dot={{ r: 2.5 }} name="Rosé" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Product Forecast Table */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Table2 className="w-4 h-4 text-eps-primary" />
                    <h3 className="text-[11px] font-semibold text-gray-800">Previsão por Produto</h3>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-[9px]">
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
                              <span className={`px-1.5 py-0.5 rounded text-white text-[8px] ${row.ocupacao >= 90 ? 'bg-amber-500' : 'bg-green-500'}`}>
                                {row.ocupacao}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-4 flex flex-col gap-2">
                {/* Harvest Prediction Model - Improved */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5">
                  <h3 className="text-[11px] font-semibold text-gray-800 mb-2">Modelo de Previsão de Colheita</h3>
                  <div className="space-y-2">
                    {harvestPredictionData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-600 w-28 truncate">{item.name}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className={`text-[9px] font-medium w-10 text-right ${item.value >= 70 ? 'text-green-600' : item.value >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {item.value}%
                        </span>
                        <span className={`text-[8px] px-2 py-0.5 rounded ${item.value >= 70 ? 'bg-green-100 text-green-700' : item.value >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Capacity & Forecast Row */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {/* Production Capacity */}
                  <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-4 h-4 text-eps-gold" />
                      <h3 className="text-[10px] font-semibold text-gray-800">Capacidade de Produção</h3>
                    </div>
                    <div className="flex gap-3 text-[8px] mb-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Atual</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Capacidade</span>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionCapacityData.slice(0, 6)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                          <XAxis dataKey="period" tick={{ fontSize: 7 }} />
                          <YAxis tick={{ fontSize: 7 }} width={20} />
                          <Tooltip contentStyle={{ fontSize: 9 }} />
                          <Bar dataKey="current" fill="#4ECDC4" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="capacity" fill="#C9A227" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Forecast Accuracy */}
                  <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="w-4 h-4 text-[#4ECDC4]" />
                      <h3 className="text-[10px] font-semibold text-gray-800">Precisão de Previsão</h3>
                    </div>
                    <div className="flex gap-3 text-[8px] mb-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Procura</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Mercado</span>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastAccuracyData.slice(0, 6)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                          <XAxis dataKey="month" tick={{ fontSize: 7 }} />
                          <YAxis tick={{ fontSize: 7 }} width={25} />
                          <Tooltip contentStyle={{ fontSize: 9 }} />
                          <Line type="monotone" dataKey="demand" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="marketDemand" stroke="#C9A227" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Production Planning */}
                <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-eps-primary" />
                      <h3 className="text-[10px] font-semibold text-gray-800">Planeamento de Produção</h3>
                    </div>
                    <span className="text-[8px] text-eps-gold font-medium">Calendário</span>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-[8px]">
                      <thead className="sticky top-0 bg-white">
                        <tr className="text-gray-500 border-b">
                          <th className="text-left py-1 font-medium">Tarefa</th>
                          <th className="text-left py-1 font-medium">Estado</th>
                          <th className="text-center py-1 font-medium">Jan</th>
                          <th className="text-center py-1 font-medium">Fev</th>
                          <th className="text-center py-1 font-medium">Mar</th>
                          <th className="text-center py-1 font-medium">Abr</th>
                          <th className="text-center py-1 font-medium">Mai</th>
                          <th className="text-center py-1 font-medium">Jun</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productionPlanningData.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-1 text-gray-700">{row.task}</td>
                            <td className="py-1">
                              <span className={`text-[7px] px-1.5 py-0.5 rounded text-white ${getStatusColor(row.status)}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-1 px-0.5">
                              {row.jan > 0 ? <div className="h-2 bg-[#4ECDC4] rounded" style={{ width: `${row.jan}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="py-1 px-0.5">
                              {row.fev > 0 ? <div className="h-2 bg-[#4ECDC4] rounded" style={{ width: `${row.fev}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="py-1 px-0.5">
                              {row.mar > 0 ? <div className="h-2 bg-[#C9A227] rounded" style={{ width: `${row.mar}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="py-1 px-0.5">
                              {row.abr > 0 ? <div className="h-2 bg-[#C9A227] rounded" style={{ width: `${row.abr}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="py-1 px-0.5">
                              {row.mai > 0 ? <div className="h-2 bg-[#8B1538] rounded" style={{ width: `${row.mai}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="py-1 px-0.5">
                              {row.jun > 0 ? <div className="h-2 bg-[#8B1538] rounded" style={{ width: `${row.jun}%` }}></div> : <span className="text-gray-300">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
