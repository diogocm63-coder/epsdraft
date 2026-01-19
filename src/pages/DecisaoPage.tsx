import EPSLayout from "@/components/layout/EPSLayout";
import { ShoppingCart, Package, Settings, Wine, Grape, Droplets } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { useState } from "react";

const cashFlowData = [
  { month: "Jan", value: 180, cumulative: 180 },
  { month: "Fev", value: 320, cumulative: 500 },
  { month: "Mar", value: 580, cumulative: 1080 },
  { month: "Abr", value: 920, cumulative: 2000 },
  { month: "Mai", value: 1450, cumulative: 3450 },
  { month: "Jun", value: 2100, cumulative: 5550 },
  { month: "Jul", value: 3200, cumulative: 8750 },
  { month: "Ago", value: 3850, cumulative: 12600 },
  { month: "Set", value: 4200, cumulative: 16800 },
  { month: "Out", value: 4650, cumulative: 21450 },
];

const cashFlowItems = [
  { name: "Vinho Tinto", inventario: 17.86, otimizacao: 124.95, color: "#8B1538" },
  { name: "Espumante", inventario: 15.55, otimizacao: 116.50, color: "#B91C47" },
  { name: "Reserva", inventario: 3.406, otimizacao: null, color: "#D4A5A5" },
  { name: "Colheita", inventario: 8.005, otimizacao: 38.05, color: "#C9A227" },
  { name: "Total", inventario: 10.870, otimizacao: null, color: "#4A5568" },
];

const cashFlowRight = [
  { name: "Dose de 10/71", inventario: 6.593, kpn: -2, margem: "5,74%" },
  { name: "Rostos 3.202", inventario: "$0050", kpn: -1, margem: "$3.55" },
  { name: "Ractou 9.2091", inventario: "18.800", kpn: -2, margem: "$2.2%" },
  { name: "Insalor 3/2018", inventario: "$138", kpn: 3, margem: "$3.2%" },
  { name: "Batikot 3.209", inventario: "-", kpn: -1, margem: "$3.2%" },
  { name: "Optianização", inventario: "18.050", kpn: 1, margem: "10.86" },
];

const cenarios = [
  { name: "Autan Euói", cenarios: 2.038, margem: "$3.3%" },
  { name: "Noseado delginço", cenarios: 1.900, margem: "$2.4%" },
  { name: "Novélaclon Jánlife", cenarios: 4.906, margem: "$6.2%" },
  { name: "Doeadodit riuola", cenarios: 4.950, margem: "$0.5%" },
];

const kpis = [
  { value: "09.120", label: "Economias Ligadas", change: -6.3, color: "text-red-600" },
  { value: "1.470", label: "Toneladas", change: 4.3, color: "text-green-600" },
  { value: "$0560", label: "Mutao", change: -1.3, color: "text-red-600" },
  { value: "1", label: "Kotao", change: -2.80, color: "text-red-600" },
  { value: "$5.640", label: "Korojen", change: 37, color: "text-green-600" },
];

const ActionButton = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
      active 
        ? "bg-eps-light border-eps-primary" 
        : "bg-white border-gray-200 hover:border-eps-primary hover:bg-eps-background"
    }`}
  >
    {icon}
    <span className={`mt-2 text-sm font-medium ${active ? "text-eps-primary" : "text-gray-700"}`}>
      {label}
    </span>
  </button>
);

const DecisaoPage = () => {
  const [activeAction, setActiveAction] = useState<string>("vender");

  return (
    <EPSLayout title="Decisão" icon="D">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-100px)]">
        {/* Action Buttons Row */}
        <div className="col-span-12 grid grid-cols-3 gap-4">
          <ActionButton
            icon={<ShoppingCart className="w-8 h-8 text-eps-primary" />}
            label="COMPRAR A GRANEL"
            active={activeAction === "comprar"}
            onClick={() => setActiveAction("comprar")}
          />
          <ActionButton
            icon={<Package className="w-8 h-8 text-eps-primary" />}
            label="VENDER A GRANEL"
            active={activeAction === "vender"}
            onClick={() => setActiveAction("vender")}
          />
          <ActionButton
            icon={<Settings className="w-8 h-8 text-eps-primary" />}
            label="AJUSTAR PRODUÇÃO"
            active={activeAction === "ajustar"}
            onClick={() => setActiveAction("ajustar")}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 grid grid-cols-12 gap-4">
          {/* Left Sidebar - Cash Flow */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Cash Flow</h3>
            <div className="space-y-3">
              {cashFlowItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.name === "Vinho Tinto" && <Wine className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Espumante" && <Grape className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Reserva" && <Droplets className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Colheita" && <Wine className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Total" && <Package className="w-3 h-3" style={{ color: item.color }} />}
                    <span className={item.name === "Total" ? "font-semibold" : ""}>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.inventario}</div>
                    <div className="text-gray-400">{item.otimizacao ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Portfolio Impact */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">▼ Impacto Portfólio</h4>
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-16 bg-gradient-to-t from-eps-primary to-eps-light rounded"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-12 bg-gradient-to-t from-eps-primary to-eps-light rounded"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-t from-eps-gold to-yellow-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Main Chart */}
          <div className="col-span-7 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">CASH FLOW IMPACTO SIMULADOR</h3>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Comprar a Granel</span>
                  <span>BoS</span>
                  <span>Alinto</span>
                  <span>CompatR</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-500 px-2 py-1 border rounded">◇ Série</button>
                <button className="text-xs text-white bg-eps-primary px-3 py-1 rounded font-medium">HERDADO</button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B1538" radius={[2, 2, 0, 0]} />
                <Area type="monotone" dataKey="value" fill="#D4A5A5" fillOpacity={0.3} stroke="none" />
                <Line type="monotone" dataKey="cumulative" stroke="#C9A227" strokeWidth={2} dot={{ fill: "#C9A227", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* KPIs Row */}
            <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl font-bold text-gray-800">{kpi.value}</div>
                  <div className="text-xs text-gray-500">{kpi.label}</div>
                  <div className={`text-xs font-medium ${kpi.color}`}>
                    {kpi.change > 0 ? "+" : ""}{kpi.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-4">
            {/* Cash Flow Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Cash Flow</h3>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Inventário</span>
                  <span>KPN</span>
                  <span>Margem</span>
                </div>
              </div>
              <div className="space-y-2">
                {cashFlowRight.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? "bg-eps-primary" : "bg-eps-gold"}`}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 text-right">{item.inventario}</span>
                      <span className={`w-8 text-center ${item.kpn > 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.kpn}
                      </span>
                      <span className="w-12 text-right">{item.margem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cenários */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Cenários</h3>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Cenários</span>
                  <span>Margem</span>
                </div>
              </div>
              <div className="space-y-2">
                {cenarios.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="w-12 text-right">{item.cenarios}</span>
                      <span className="w-12 text-right">{item.margem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EPSLayout>
  );
};

export default DecisaoPage;
