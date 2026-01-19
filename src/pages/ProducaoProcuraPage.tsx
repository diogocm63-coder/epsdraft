import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Brain, TrendingUp, Leaf, Target, AlertTriangle, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  LineChart,
} from "recharts";

// KPI data
const kpiData = {
  aiInsights: { value: 14, status: "A atualizar clusters" },
  greeneries: { value: 700, change: 12, status: "Processo Otimizado" },
  demand: { value: "8.2K", change: 8, price: "$6.66" },
  aqInsights: { value: "12.5K", time: "505 min" },
  accuracy: { value: "96%", change: 4 },
  capacity: { value: 304, stress: 6.6 },
};

// Seasonal Demand Patterns data
const seasonalDemandData = [
  { month: "Fev", value: 60 },
  { month: "Abr", value: 75 },
  { month: "Jun", value: 85 },
  { month: "Jul", value: 95 },
  { month: "Ago", value: 80 },
  { month: "Out", value: 70 },
  { month: "Dez", value: 60 },
];

// AI Insights alerts
const aiAlerts = [
  { type: "warning", title: "Alerta de Rendimento", desc: "Produção de Cabernet pode ficar 12% abaixo no Q4..." },
  { type: "trend", title: "Aumento de Procura", desc: "Vinhos premium com aumento de 23% no mercado..." },
  { type: "optimize", title: "Otimização", desc: "Eficiência da linha de engarrafamento pode melhorar 8%..." },
];

// Wine Sales Forecast data
const wineSalesData = [
  { quarter: "Q1", yieldEstimate: 45, general: 35, cabernet: 25 },
  { quarter: "Q2", yieldEstimate: 55, general: 48, cabernet: 35 },
  { quarter: "Q3", yieldEstimate: 85, general: 70, cabernet: 55 },
  { quarter: "Q4", yieldEstimate: 95, general: 85, cabernet: 70 },
  { quarter: "Q1'", yieldEstimate: 115, general: 100, cabernet: 85 },
  { quarter: "Q2'", yieldEstimate: 145, general: 125, cabernet: 105 },
  { quarter: "Q3'", yieldEstimate: 165, general: 145, cabernet: 125 },
  { quarter: "Q4'", yieldEstimate: 175, general: 160, cabernet: 140 },
];

// Harvest Prediction Model data
const harvestPredictionData = [
  { name: "Estimativa de Risco", green: 25, yellow: 30, red: 45 },
  { name: "Capacidade de Rendimento", green: 55, yellow: 25, red: 20 },
  { name: "Resiliência", green: 70, yellow: 20, red: 10 },
  { name: "Deficiência de Inventário", green: 45, yellow: 35, red: 20 },
  { name: "Controlo de Pragas", green: 60, yellow: 25, red: 15 },
];

// Production Capacity data
const productionCapacityData = [
  { period: "Q1", current: 165, capacity: 210 },
  { period: "Wun", current: 140, capacity: 210 },
  { period: "Q2", current: 155, capacity: 210 },
  { period: "Diario MTI", current: 200, capacity: 210 },
  { period: "Q3", current: 175, capacity: 210 },
  { period: "NAP", current: 195, capacity: 210 },
  { period: "Q4", current: 165, capacity: 210 },
];

// Forecast Accuracy data
const forecastAccuracyData = [
  { quarter: "Q1", demand: 300, marketDemand: 320 },
  { quarter: "Q2", demand: 350, marketDemand: 380 },
  { quarter: "Q3", demand: 380, marketDemand: 400 },
  { quarter: "Q4", demand: 420, marketDemand: 450 },
  { quarter: "Q1'", demand: 460, marketDemand: 480 },
  { quarter: "Q2'", demand: 480, marketDemand: 520 },
  { quarter: "Q3'", demand: 520, marketDemand: 560 },
  { quarter: "Q4'", demand: 540, marketDemand: 580 },
];

// Production Planning data
const productionPlanningData = [
  { task: "Estabilização Completa", status: "Concluído", q1: 100, q2: 0, q3: 0, q4: 0 },
  { task: "Análise de Procura", status: "Concluído", q1: 50, q2: 100, q3: 0, q4: 0 },
  { task: "Melhoria da Vinha", status: "Em Progresso", q1: 0, q2: 60, q3: 100, q4: 0 },
  { task: "Colheita 2YC", status: "Em Progresso", q1: 0, q2: 0, q3: 80, q4: 100 },
  { task: "Estabilização", status: "Pendente", q1: 0, q2: 0, q3: 40, q4: 0 },
  { task: "Mercado Estrangulado", status: "Pendente", q1: 0, q2: 0, q3: 0, q4: 30 },
  { task: "Limpeza de Terreno", status: "Pendente", q1: 0, q2: 0, q3: 0, q4: 0 },
  { task: "Índice de Risco", status: "Em Risco", q1: 0, q2: 0, q3: 0, q4: 100 },
  { task: "Enxertia", status: "Pendente", q1: 0, q2: 0, q3: 0, q4: 0 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído": return "bg-green-500";
    case "Em Progresso": return "bg-amber-500";
    case "Em Risco": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

const ProducaoProcuraPage = () => {
  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EPSHeader title="Produção e Procura" icon="P" />
        
        <main className="flex-1 p-3 overflow-auto">
          <div className="grid grid-cols-12 gap-2 h-full">
            {/* Top KPI Row */}
            <div className="col-span-12 grid grid-cols-6 gap-2">
              {/* AI Insights KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <Brain className="w-5 h-5 text-eps-primary" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">AI Insights</div>
                  <div className="text-xl font-bold">{kpiData.aiInsights.value}</div>
                  <div className="text-[9px] text-gray-400">{kpiData.aiInsights.status}</div>
                </div>
                <div className="w-16 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalDemandData.slice(0, 4)}>
                      <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Greeneries KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <Leaf className="w-5 h-5 text-eps-gold" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Estufas</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{kpiData.greeneries.value}</span>
                    <span className="text-[10px] text-red-500">▼ {kpiData.greeneries.change}%</span>
                  </div>
                  <div className="text-[9px] text-gray-400">{kpiData.greeneries.status}</div>
                </div>
              </div>

              {/* Demand KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-eps-primary" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Procura</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{kpiData.demand.value}</span>
                    <span className="text-[10px] text-green-500">▲ {kpiData.demand.change}%</span>
                  </div>
                  <div className="text-[9px] text-gray-400">Ordem de Venda @ {kpiData.demand.price}</div>
                </div>
              </div>

              {/* AQ Insights KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">AQ Insights</div>
                  <div className="text-xl font-bold">{kpiData.aqInsights.value}</div>
                  <div className="text-[9px] text-gray-400">Cluster de Dados {kpiData.aqInsights.time}</div>
                </div>
                <div className="w-16 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalDemandData}>
                      <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Accuracy KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <Target className="w-5 h-5 text-eps-primary" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Precisão</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{kpiData.accuracy.value}</span>
                    <span className="text-[10px] text-green-500">▲ {kpiData.accuracy.change}%</span>
                  </div>
                  <div className="text-[9px] text-gray-400">Precisão de Previsão</div>
                </div>
              </div>

              {/* Capacity KPI */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                <Zap className="w-5 h-5 text-eps-gold" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Capacidade</div>
                  <div className="text-xl font-bold">{kpiData.capacity.value}</div>
                  <div className="text-[9px] text-gray-400">{kpiData.capacity.stress}% Stress Atual</div>
                </div>
                <div className="w-16 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalDemandData.slice(0, 4)}>
                      <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Left Column - Seasonal & AI Insights */}
            <div className="col-span-2 space-y-2">
              {/* Seasonal Demand Patterns */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-eps-gold" />
                  <h3 className="text-xs font-semibold text-gray-700">Padrões Sazonais de Procura</h3>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={seasonalDemandData}>
                    <Area type="monotone" dataKey="value" fill="#C9A227" fillOpacity={0.3} stroke="#C9A227" strokeWidth={2} />
                    <XAxis dataKey="month" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-eps-primary" />
                    <h3 className="text-xs font-semibold text-gray-700">AI Insights</h3>
                  </div>
                  <span className="text-[9px] text-gray-400">Atualizado há 2h</span>
                </div>
                <div className="space-y-2">
                  {aiAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <AlertTriangle className={`w-3 h-3 mt-0.5 ${alert.type === 'warning' ? 'text-amber-500' : alert.type === 'trend' ? 'text-green-500' : 'text-blue-500'}`} />
                      <div>
                        <div className="text-[10px] font-medium text-gray-700">{alert.title}</div>
                        <div className="text-[9px] text-gray-500">{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column - Main Chart */}
            <div className="col-span-6">
              <div className="bg-white rounded-lg border border-gray-200 p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-eps-gold" />
                    <h3 className="text-sm font-semibold text-gray-800">Previsão de Vendas de Vinho</h3>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase">Machine Learning Analytics</span>
                </div>
                <div className="flex gap-4 mb-2 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-primary rounded"></span>Estimativa de Rendimento</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Geral</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Cabernet</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={wineSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="yieldEstimate" fill="#8B1538" fillOpacity={0.2} stroke="#8B1538" strokeWidth={2} />
                      <Line type="monotone" dataKey="general" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="cabernet" stroke="#C9A227" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column - Harvest Prediction */}
            <div className="col-span-4 space-y-2">
              {/* Harvest Prediction Model */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h3 className="text-xs font-semibold text-gray-800 mb-2">Modelo de Previsão de Colheita</h3>
                {/* Progress bars */}
                <div className="space-y-1.5 mb-3">
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>Capacidade de Produção</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4ECDC4] rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>Logística de Processos</span>
                      <span>72%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4ECDC4] rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>Excesso de Inventário</span>
                      <span>45%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4ECDC4] rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
                {/* Stacked bar chart */}
                <div className="space-y-1">
                  {harvestPredictionData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[8px] text-gray-600 w-28 truncate">{item.name}</span>
                      <div className="flex-1 flex h-3 rounded overflow-hidden">
                        <div className="bg-[#4ECDC4]" style={{ width: `${item.green}%` }}></div>
                        <div className="bg-[#C9A227]" style={{ width: `${item.yellow}%` }}></div>
                        <div className="bg-[#8B1538]" style={{ width: `${item.red}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="col-span-12 grid grid-cols-3 gap-2">
              {/* Production Capacity */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-eps-gold" />
                    <h3 className="text-xs font-semibold text-gray-800">Capacidade de Produção</h3>
                  </div>
                  <div className="flex gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Atual</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Capacidade</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={productionCapacityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="period" tick={{ fontSize: 8 }} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#4ECDC4" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="capacity" fill="#C9A227" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-2">
                  <span className="bg-[#8B1538] text-white text-[9px] px-3 py-1 rounded-full">Défice Projetado</span>
                </div>
              </div>

              {/* Forecast Accuracy */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#4ECDC4]" />
                    <h3 className="text-xs font-semibold text-gray-800">Precisão de Previsão</h3>
                  </div>
                  <div className="flex gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Procura</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-eps-gold rounded"></span>Procura de Mercado</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={forecastAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 8 }} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="demand" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="marketDemand" stroke="#C9A227" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Production Planning */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-eps-primary" />
                    <h3 className="text-xs font-semibold text-gray-800">Planeamento de Produção</h3>
                  </div>
                  <span className="text-[9px] text-eps-gold font-medium">Calendário de Engarrafamento</span>
                </div>
                <div className="overflow-auto max-h-[140px]">
                  <table className="w-full text-[9px]">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-gray-500 border-b">
                        <th className="text-left py-1 font-medium">Tarefa</th>
                        <th className="text-left py-1 font-medium">Estado</th>
                        <th className="text-center py-1 font-medium">Q1</th>
                        <th className="text-center py-1 font-medium">Q2</th>
                        <th className="text-center py-1 font-medium">Q3</th>
                        <th className="text-center py-1 font-medium">Q4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionPlanningData.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-1 text-gray-700">{row.task}</td>
                          <td className="py-1">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded text-white ${getStatusColor(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-1">
                            {row.q1 > 0 && <div className="w-full h-2 bg-[#4ECDC4] rounded" style={{ width: `${row.q1}%` }}></div>}
                            {row.q1 === 0 && <span className="text-gray-400">0</span>}
                          </td>
                          <td className="py-1">
                            {row.q2 > 0 && <div className="w-full h-2 bg-[#C9A227] rounded" style={{ width: `${row.q2}%` }}></div>}
                            {row.q2 === 0 && <span className="text-gray-400">0</span>}
                          </td>
                          <td className="py-1">
                            {row.q3 > 0 && <div className="w-full h-2 bg-[#C9A227] rounded" style={{ width: `${row.q3}%` }}></div>}
                            {row.q3 === 0 && <span className="text-gray-400">0</span>}
                          </td>
                          <td className="py-1">
                            {row.q4 > 0 && <div className="w-full h-2 bg-[#8B1538] rounded" style={{ width: `${row.q4}%` }}></div>}
                            {row.q4 === 0 && <span className="text-gray-400">0</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
