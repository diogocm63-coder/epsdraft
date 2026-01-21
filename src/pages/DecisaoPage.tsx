import EPSLayout from "@/components/layout/EPSLayout";
import { ShoppingCart, Package, Settings, Wine, Grape, Droplets, Check, AlertTriangle, TrendingUp, TrendingDown, Bell } from "lucide-react";
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
  Cell,
} from "recharts";
import { useState, useMemo } from "react";

import {
  decisaoCashFlowData as baseCashFlowData,
  decisaoCashFlowItems as baseCashFlowItems,
  decisaoCashFlowRight as cashFlowRight,
  decisaoCenarios as cenarios,
  decisaoKpis as baseKpis,
} from "@/data/wineData";

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
    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
      active 
        ? "bg-eps-light border-eps-primary" 
        : "bg-white border-gray-200 hover:border-eps-primary hover:bg-eps-background"
    }`}
  >
    {icon}
    <span className={`mt-1 text-xs font-medium ${active ? "text-eps-primary" : "text-gray-700"}`}>
      {label}
    </span>
  </button>
);

// Alertas inteligentes data
const alertasInteligentes = [
  { type: 'critical', title: 'Stock crítico', detail: 'V&W Douro Reserva abaixo do mínimo', icon: AlertTriangle },
  { type: 'warning', title: 'Procura elevada', detail: 'Previsão +35% V&W Alvarinho', icon: TrendingUp },
  { type: 'info', title: 'Oportunidade', detail: 'Mercado exportação em alta', icon: TrendingUp },
  { type: 'warning', title: 'Margem reduzida', detail: 'V&W Lisboa com margem -5%', icon: TrendingDown },
];

const DecisaoPage = () => {
  const [activeAction, setActiveAction] = useState<string>("vender");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [previsaoConfirmada, setPrevisaoConfirmada] = useState(false);

  // Calculate dynamic data based on selected month and action
  const { cashFlowData, cashFlowItems, kpis } = useMemo(() => {
    const multiplier = activeAction === "comprar" ? 1.15 : activeAction === "ajustar" ? 0.95 : 1;
    
    const updatedCashFlowData = baseCashFlowData.map((item, idx) => ({
      ...item,
      value: Math.round(item.value * multiplier),
      cumulative: Math.round(item.cumulative * multiplier),
      isSelected: item.month === selectedMonth,
    }));

    const updatedCashFlowItems = baseCashFlowItems.map(item => ({
      ...item,
      inventario: Number((item.inventario * multiplier).toFixed(2)),
      otimizacao: item.otimizacao ? Number((item.otimizacao * multiplier).toFixed(2)) : null,
    }));

    const updatedKpis = baseKpis.map(kpi => ({
      ...kpi,
      change: Number((kpi.change * multiplier).toFixed(1)),
    }));

    return { cashFlowData: updatedCashFlowData, cashFlowItems: updatedCashFlowItems, kpis: updatedKpis };
  }, [activeAction, selectedMonth]);

  const handleChartClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.month) {
      const month = data.activePayload[0].payload.month;
      setSelectedMonth(selectedMonth === month ? null : month);
    }
  };

  const handleConfirmarPrevisao = () => {
    setPrevisaoConfirmada(!previsaoConfirmada);
  };

  return (
    <EPSLayout title="Decisão" icon="D">
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-100px)]">
        {/* Action Buttons Row */}
        <div className="col-span-12 grid grid-cols-3 gap-3">
          <ActionButton
            icon={<ShoppingCart className="w-6 h-6 text-eps-primary" />}
            label="COMPRAR A GRANEL"
            active={activeAction === "comprar"}
            onClick={() => setActiveAction("comprar")}
          />
          <ActionButton
            icon={<Package className="w-6 h-6 text-eps-primary" />}
            label="VENDER A GRANEL"
            active={activeAction === "vender"}
            onClick={() => setActiveAction("vender")}
          />
          <ActionButton
            icon={<Settings className="w-6 h-6 text-eps-primary" />}
            label="AJUSTAR PRODUÇÃO"
            active={activeAction === "ajustar"}
            onClick={() => setActiveAction("ajustar")}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 grid grid-cols-12 gap-3">
          {/* Left Sidebar - Cash Flow */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-xs font-semibold text-gray-800 mb-3">Cash Flow</h3>
            <div className="space-y-2">
              {cashFlowItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between text-xs p-1.5 rounded cursor-pointer transition-all ${
                    selectedMonth ? 'opacity-70' : ''
                  } hover:bg-gray-50`}
                  onClick={() => setSelectedMonth(null)}
                >
                  <div className="flex items-center gap-1.5">
                    {item.name === "Tintos Premium" && <Wine className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Brancos Reserva" && <Grape className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Rosés Selection" && <Droplets className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Espumantes" && <Wine className="w-3 h-3" style={{ color: item.color }} />}
                    {item.name === "Total" && <Package className="w-3 h-3" style={{ color: item.color }} />}
                    <span className={`text-[10px] ${item.name === "Total" ? "font-semibold" : ""}`}>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[10px]">{item.inventario}</div>
                    <div className="text-gray-400 text-[9px]">{item.otimizacao ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Portfolio Impact */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-[10px] font-semibold text-gray-600 mb-2">▼ Impacto Portfólio</h4>
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-12 bg-gradient-to-t from-eps-primary to-eps-light rounded transition-all ${activeAction === 'comprar' ? 'h-16' : ''}`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-10 bg-gradient-to-t from-eps-primary to-eps-light rounded transition-all ${activeAction === 'vender' ? 'h-8' : ''}`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 bg-gradient-to-t from-eps-gold to-yellow-200 rounded transition-all ${activeAction === 'ajustar' ? 'h-10' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Main Chart (reduced width) */}
          <div className="col-span-6 bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">CASH FLOW IMPACTO SIMULADOR</h3>
                <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                  <span className={activeAction === 'comprar' ? 'text-eps-primary font-medium' : ''}>Comprar a Granel</span>
                  <span>BoS</span>
                  <span>Alinto</span>
                  <span>CompatR</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] text-gray-500 px-2 py-1 border rounded">◇ Série</button>
                <button 
                  onClick={handleConfirmarPrevisao}
                  className={`text-[10px] px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-all ${
                    previsaoConfirmada 
                      ? 'bg-green-600 text-white' 
                      : 'bg-eps-primary text-white hover:bg-eps-primary/90'
                  }`}
                >
                  {previsaoConfirmada && <Check className="w-3 h-3" />}
                  {previsaoConfirmada ? 'CONFIRMADO' : 'CONFIRMAR PREVISÃO'}
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={cashFlowData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: number) => [value.toLocaleString('pt-PT') + ' €', '']}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {cashFlowData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isSelected ? '#C9A227' : '#8B1538'} 
                      opacity={selectedMonth && !entry.isSelected ? 0.4 : 1}
                    />
                  ))}
                </Bar>
                <Area type="monotone" dataKey="value" fill="#D4A5A5" fillOpacity={0.3} stroke="none" />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#C9A227" 
                  strokeWidth={2} 
                  dot={{ fill: "#C9A227", r: 3 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* KPIs Row */}
            <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-gray-100">
              {kpis.map((kpi, idx) => (
                <div 
                  key={idx} 
                  className={`text-center p-1.5 rounded cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedMonth ? 'ring-1 ring-eps-primary/20' : ''
                  }`}
                  onClick={() => setSelectedMonth(null)}
                >
                  <div className="text-base font-bold text-gray-800">{kpi.value}</div>
                  <div className="text-[9px] text-gray-500">{kpi.label}</div>
                  <div className={`text-[10px] font-medium ${kpi.color}`}>
                    {kpi.change > 0 ? "+" : ""}{kpi.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (increased width) */}
          <div className="col-span-4 space-y-3">
            {/* Alertas Inteligentes */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-eps-primary" />
                <h3 className="text-xs font-semibold text-gray-800">Alertas Inteligentes</h3>
              </div>
              <div className="space-y-1.5">
                {alertasInteligentes.map((alerta, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2 text-[10px] p-2 rounded cursor-pointer transition-all hover:bg-gray-50 ${
                      alerta.type === 'critical' ? 'bg-red-50 border-l-2 border-red-500' :
                      alerta.type === 'warning' ? 'bg-amber-50 border-l-2 border-amber-500' :
                      'bg-blue-50 border-l-2 border-blue-500'
                    }`}
                  >
                    <alerta.icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
                      alerta.type === 'critical' ? 'text-red-600' :
                      alerta.type === 'warning' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <div className="font-medium">{alerta.title}</div>
                      <div className="text-gray-500">{alerta.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-800">Cash Flow</h3>
                <div className="flex gap-2 text-[9px] text-gray-500">
                  <span>Inventário</span>
                  <span>KPN</span>
                  <span>Margem</span>
                </div>
              </div>
              <div className="space-y-1">
                {cashFlowRight.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between text-[10px] py-1 px-1.5 rounded border-b border-gray-50 last:border-0 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedMonth ? 'opacity-80' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${idx % 2 === 0 ? "bg-eps-primary" : "bg-eps-gold"}`}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-right">{item.inventario}</span>
                      <span className={`w-6 text-center ${item.kpn > 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.kpn}
                      </span>
                      <span className="w-10 text-right">{item.margem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cenários */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-800">Cenários</h3>
                <div className="flex gap-2 text-[9px] text-gray-500">
                  <span>Cenários</span>
                  <span>Margem</span>
                </div>
              </div>
              <div className="space-y-1">
                {cenarios.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between text-[10px] py-1 px-1.5 rounded border-b border-gray-50 last:border-0 cursor-pointer transition-all hover:bg-gray-50"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="w-10 text-right">{item.cenarios.toLocaleString('pt-PT')}</span>
                      <span className="w-10 text-right">{item.margem}</span>
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
