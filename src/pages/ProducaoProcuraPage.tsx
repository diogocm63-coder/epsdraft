import EPSLayout from "@/components/layout/EPSLayout";
import { Leaf, Brain, Target, TrendingUp, AlertTriangle, MapPin } from "lucide-react";
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
} from "recharts";

// Wine Sales Forecast data
const wineSalesData = [
  { quarter: "Q1", cabernet: 40, gemal: 35, pinot: 25, groenerSauvigny: 15 },
  { quarter: "Q2", cabernet: 55, gemal: 45, pinot: 35, groenerSauvigny: 22 },
  { quarter: "Q3", cabernet: 95, gemal: 70, pinot: 50, groenerSauvigny: 30 },
  { quarter: "Q4", cabernet: 130, gemal: 85, pinot: 55, groenerSauvigny: 35 },
  { quarter: "Q5", cabernet: 145, gemal: 95, pinot: 65, groenerSauvigny: 40 },
  { quarter: "Q6", cabernet: 135, gemal: 90, pinot: 60, groenerSauvigny: 38 },
  { quarter: "Q7", cabernet: 150, gemal: 100, pinot: 70, groenerSauvigny: 42 },
  { quarter: "Q8", cabernet: 140, gemal: 92, pinot: 62, groenerSauvigny: 40 },
];

// Left side charts data
const wineSalesForecastLeft = [
  { name: "Jan", cabernet: 120, chardonnay: 80, cabernetFranc: 40 },
  { name: "Fev", cabernet: 150, chardonnay: 100, cabernetFranc: 55 },
  { name: "Mar", cabernet: 100, chardonnay: 85, cabernetFranc: 35 },
  { name: "Abr", cabernet: 180, chardonnay: 120, cabernetFranc: 70 },
];

const iahInsightsData = [
  { name: "0.1", price: 150, volume: 280 },
  { name: "0.2", price: 220, volume: 320 },
  { name: "0.3", price: 180, volume: 250 },
  { name: "0.4", price: 280, volume: 380 },
  { name: "0.5", price: 200, volume: 300 },
  { name: "0.6", price: 320, volume: 420 },
  { name: "0.7", price: 250, volume: 350 },
  { name: "0.8", price: 380, volume: 480 },
];

const seasonalDemandData = [
  { name: "Q1", value: 120 },
  { name: "Q2", value: 180 },
  { name: "Q3", value: 250 },
  { name: "Q4", value: 150 },
];

const demandPatternsData = [
  { name: "0.4", domestic: 80, charAbroad: 120, usa: 60 },
  { name: "0.5", domestic: 100, charAbroad: 140, usa: 80 },
  { name: "0.6", domestic: 120, charAbroad: 180, usa: 100 },
  { name: "0.7", domestic: 90, charAbroad: 150, usa: 75 },
];

// Production Capacity data
const productionCapacityData = [
  { quarter: "Q1", cabete: 80, tillery: 60, capacity: 95 },
  { quarter: "Urz1", cabete: 120, tillery: 90, capacity: 140 },
  { quarter: "Wen", cabete: 95, tillery: 75, capacity: 110 },
  { quarter: "M", cabete: 140, tillery: 100, capacity: 160 },
  { quarter: "Q,AI", cabete: 110, tillery: 85, capacity: 130 },
  { quarter: "DSIN", cabete: 170, tillery: 120, capacity: 190 },
  { quarter: "Q96", cabete: 130, tillery: 95, capacity: 150 },
  { quarter: "1.100", cabete: 85, tillery: 65, capacity: 100 },
  { quarter: "Op", cabete: 90, tillery: 70, capacity: 105 },
];

// Forecast Accuracy data
const forecastAccuracyData = [
  { quarter: "Q1", deviation: 25, marketDemand: 380 },
  { quarter: "Q2", deviation: 45, marketDemand: 320 },
  { quarter: "Q3", deviation: 30, marketDemand: 280 },
  { quarter: "Q4", deviation: 55, marketDemand: 250 },
  { quarter: "Q5", deviation: 35, marketDemand: 220 },
  { quarter: "Q6", deviation: 48, marketDemand: 180 },
  { quarter: "Q7", deviation: 28, marketDemand: 150 },
];

// Production Planning data
const productionPlanningData = [
  { label: "Wride Staticore", q1: 35, q2: 45, q3: 30, q4: 40 },
  { label: "Demand Headed", q1: 50, q2: 60, q3: 40, q4: 55 },
  { label: "Manescat Uplift", q1: 25, q2: 35, q3: 45, q4: 30 },
  { label: "30.6 Ecoket", q1: 40, q2: 30, q3: 50, q4: 35 },
  { label: "Shndedion", q1: 60, q2: 45, q3: 35, q4: 50 },
  { label: "Market Sadoinel", q1: 30, q2: 40, q3: 55, q4: 45 },
  { label: "Forecast Dreoy", q1: 45, q2: 55, q3: 40, q4: 60 },
  { label: "Risk Index", q1: 20, q2: 30, q3: 25, q4: 35 },
  { label: "Cokion", q1: 55, q2: 40, q3: 60, q4: 45 },
];

const ProducaoProcuraPage = () => {
  return (
    <EPSLayout title="Produção e Procura" icon="P">
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-100px)]">
        {/* Left Column - Small Charts */}
        <div className="col-span-2 space-y-2 overflow-auto">
          {/* Wine Sales Forecast */}
          <div className="bg-[#1a1a2e] rounded-lg p-2 border border-gray-700">
            <h3 className="text-[10px] text-gray-300 font-medium mb-1">Wine Sales Forecast</h3>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={wineSalesForecastLeft}>
                <Area type="monotone" dataKey="cabernet" stackId="1" fill="#8B1538" stroke="#8B1538" />
                <Area type="monotone" dataKey="chardonnay" stackId="1" fill="#C9A227" stroke="#C9A227" />
                <Area type="monotone" dataKey="cabernetFranc" stackId="1" fill="#4ECDC4" stroke="#4ECDC4" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 bg-[#8B1538] rounded"></span>Cabernet</span>
              <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>Chardonnay</span>
            </div>
          </div>

          {/* IAH Insights */}
          <div className="bg-[#1a1a2e] rounded-lg p-2 border border-gray-700">
            <h3 className="text-[10px] text-gray-300 font-medium mb-1">IAh Insights</h3>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={iahInsightsData}>
                <Area type="monotone" dataKey="price" fill="#8B1538" fillOpacity={0.6} stroke="#8B1538" />
                <Area type="monotone" dataKey="volume" fill="#C9A227" fillOpacity={0.4} stroke="#C9A227" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonal Demand Patterns */}
          <div className="bg-[#1a1a2e] rounded-lg p-2 border border-gray-700">
            <h3 className="text-[10px] text-gray-300 font-medium mb-1">Seasonal Demand Patterns</h3>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={seasonalDemandData}>
                <Area type="monotone" dataKey="value" fill="#4ECDC4" fillOpacity={0.6} stroke="#4ECDC4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Warehouse/Demand Patterns */}
          <div className="bg-[#1a1a2e] rounded-lg p-2 border border-gray-700">
            <h3 className="text-[10px] text-gray-300 font-medium mb-1">Warehouse/Demand Patterns</h3>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={demandPatternsData}>
                <Area type="monotone" dataKey="domestic" stackId="1" fill="#8B1538" stroke="#8B1538" />
                <Area type="monotone" dataKey="charAbroad" stackId="1" fill="#C9A227" stroke="#C9A227" />
                <Area type="monotone" dataKey="usa" stackId="1" fill="#4ECDC4" stroke="#4ECDC4" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 bg-[#8B1538] rounded"></span>Domestic</span>
              <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>CharAbroad</span>
            </div>
          </div>
        </div>

        {/* Center Column - Main Charts */}
        <div className="col-span-7 flex flex-col gap-3">
          {/* Wine Sales Forecast - Main */}
          <div className="bg-[#1a1a2e] rounded-lg border border-gray-700 p-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#C9A227]" />
                <h3 className="text-sm font-semibold text-white">Wine Sales Forecast</h3>
              </div>
              <span className="text-xs text-gray-400">MACHINE LEAK ANALYTICS</span>
            </div>
            <div className="flex gap-4 mb-2 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Yield Estimate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#8B1538] rounded"></span>Cabernet</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Pnre</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>Gemal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f5e6d3] rounded"></span>Groner Sauvigny</span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={wineSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="cabernet" fill="#8B1538" fillOpacity={0.7} stroke="#8B1538" strokeWidth={2} />
                  <Area type="monotone" dataKey="gemal" fill="#C9A227" fillOpacity={0.5} stroke="#C9A227" strokeWidth={2} />
                  <Line type="monotone" dataKey="pinot" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: "#4ECDC4", r: 3 }} />
                  <Line type="monotone" dataKey="groenerSauvigny" stroke="#f5e6d3" strokeWidth={2} dot={{ fill: "#f5e6d3", r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            {/* Risk Estimate Legend */}
            <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-400">
              <span>RISK Estimate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-gray-400"></span>Yiet Genollo</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-gray-400"></span>Aediony</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-gray-400"></span>Dsankey Det/hony</span>
            </div>
          </div>

          {/* Bottom Charts Row */}
          <div className="flex gap-3 h-[35%]">
            {/* Production Capacity */}
            <div className="flex-1 bg-[#1a1a2e] rounded-lg border border-gray-700 p-3 flex flex-col">
              <h3 className="text-xs font-semibold text-white mb-2">Production Capacity</h3>
              <div className="flex gap-2 mb-2 text-[9px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>Cabete</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Tillery</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f5e6d3] rounded"></span>Capacity</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={productionCapacityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 8, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 8, fill: "#888" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} />
                    <Bar dataKey="cabete" fill="#C9A227" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="tillery" fill="#4ECDC4" radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="capacity" stroke="#f5e6d3" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {/* Projected Shortfall Button */}
              <div className="flex justify-center mt-2">
                <button className="bg-[#8B1538] text-white text-[10px] px-4 py-1 rounded-full">
                  Projected Shortfall
                </button>
              </div>
            </div>

            {/* Forecast Accuracy */}
            <div className="flex-1 bg-[#1a1a2e] rounded-lg border border-gray-700 p-3 flex flex-col">
              <h3 className="text-xs font-semibold text-white mb-2">Forecasted Accuracy</h3>
              <div className="flex gap-2 mb-2 text-[9px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#C9A227] rounded"></span>Deviation</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Market Demand</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 8, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 8, fill: "#888" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} />
                    <Bar dataKey="deviation" fill="#C9A227" radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="marketDemand" stroke="#4ECDC4" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-3">
          {/* KPI Row */}
          <div className="bg-[#1a1a2e] rounded-lg border border-gray-700 p-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-[#252540] rounded">
                <div className="text-lg font-bold text-[#C9A227]">304</div>
                <div className="text-[8px] text-gray-400">O.A.% Cortece</div>
                <div className="text-[8px] text-gray-400">AK Vinfily</div>
              </div>
              <div className="text-center p-2 bg-[#252540] rounded">
                <div className="text-lg font-bold text-white">1€0</div>
                <div className="text-[8px] text-gray-400">Accuracy</div>
              </div>
              <div className="text-center p-2 bg-[#252540] rounded">
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 bg-[#C9A227]" style={{ height: `${10 + i * 4}px` }}></div>
                  ))}
                </div>
                <div className="text-[8px] text-gray-400">AllCoires</div>
              </div>
            </div>
          </div>

          {/* Harvest Prediction Model */}
          <div className="bg-[#1a1a2e] rounded-lg border border-gray-700 p-3 flex-1 flex flex-col">
            <h3 className="text-xs font-semibold text-white mb-2">Harvest Prediction Model</h3>
            <div className="flex gap-2 mb-2 text-[9px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ECDC4] rounded"></span>Production Capacity</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded"></span>Pracior Useporine</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#8B1538] rounded"></span>Ficcos Hiono</span>
            </div>
            {/* Map placeholder */}
            <div className="flex-1 bg-[#252540] rounded-lg flex items-center justify-center relative overflow-hidden">
              <MapPin className="w-8 h-8 text-[#C9A227] opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#4ECDC4]/20 via-transparent to-[#8B1538]/20"></div>
            </div>
          </div>

          {/* Production Planning */}
          <div className="bg-[#1a1a2e] rounded-lg border border-gray-700 p-3 flex-1 flex flex-col">
            <h3 className="text-xs font-semibold text-white mb-1">Production Planning</h3>
            <div className="text-[9px] text-[#C9A227] mb-2">■ BOTTLING SCHEDULE</div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[8px]">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left py-0.5"></th>
                    <th className="text-center py-0.5">TAGU MON</th>
                  </tr>
                </thead>
                <tbody>
                  {productionPlanningData.map((row, idx) => (
                    <tr key={idx} className="text-gray-300">
                      <td className="py-0.5 pr-2">{row.label}</td>
                      <td className="py-0.5">
                        <div className="flex gap-0.5">
                          <div className="h-2 bg-[#C9A227]" style={{ width: `${row.q1}%` }}></div>
                          <div className="h-2 bg-[#4ECDC4]" style={{ width: `${row.q2}%` }}></div>
                          <div className="h-2 bg-[#8B1538]" style={{ width: `${row.q3}%` }}></div>
                          <div className="h-2 bg-gray-500" style={{ width: `${row.q4}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </EPSLayout>
  );
};

export default ProducaoProcuraPage;
