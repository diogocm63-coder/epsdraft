import EPSLayout from "@/components/layout/EPSLayout";
import { TrendingUp, TrendingDown, AlertTriangle, Info, LayoutGrid } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Data for Previsão de Vendas chart
const previsaoVendasData = [
  { month: 'Jan', historico: 45, ia: 48, clientes: 46, orcamento: 44 },
  { month: 'Fev', historico: 52, ia: 56, clientes: 54, orcamento: 50 },
  { month: 'Mar', historico: 58, ia: 62, clientes: 60, orcamento: 55 },
  { month: 'Abr', historico: 65, ia: 68, clientes: 66, orcamento: 58 },
  { month: 'Mai', historico: 62, ia: 65, clientes: 63, orcamento: 60 },
  { month: 'Jun', historico: 68, ia: 72, clientes: 70, orcamento: 64 },
  { month: 'Jul', historico: 75, ia: 80, clientes: 78, orcamento: 70 },
  { month: 'Ago', historico: 78, ia: 85, clientes: 82, orcamento: 74 },
  { month: 'Set', historico: 82, ia: 88, clientes: 85, orcamento: 76 },
  { month: 'Out', historico: 85, ia: 92, clientes: 88, orcamento: 78 },
  { month: 'Nov', historico: 90, ia: 96, clientes: 92, orcamento: 82 },
  { month: 'Dez', historico: 95, ia: 100, clientes: 98, orcamento: 85 },
];

// Data for Stock chart (different values)
const previsaoStockData = [
  { month: 'Jan', historico: 28, ia: 32, clientes: 30, orcamento: 25 },
  { month: 'Fev', historico: 30, ia: 35, clientes: 32, orcamento: 26 },
  { month: 'Mar', historico: 32, ia: 38, clientes: 35, orcamento: 28 },
  { month: 'Abr', historico: 35, ia: 42, clientes: 38, orcamento: 30 },
  { month: 'Mai', historico: 38, ia: 45, clientes: 42, orcamento: 32 },
  { month: 'Jun', historico: 42, ia: 50, clientes: 48, orcamento: 35 },
  { month: 'Jul', historico: 48, ia: 55, clientes: 52, orcamento: 38 },
  { month: 'Ago', historico: 52, ia: 60, clientes: 58, orcamento: 42 },
  { month: 'Set', historico: 58, ia: 65, clientes: 62, orcamento: 48 },
  { month: 'Out', historico: 62, ia: 70, clientes: 68, orcamento: 52 },
  { month: 'Nov', historico: 68, ia: 75, clientes: 72, orcamento: 58 },
  { month: 'Dez', historico: 72, ia: 80, clientes: 78, orcamento: 62 },
];

// KPI data for Vendas
const vendasKpis = [
  { 
    badge: 'Histórico',
    badgeColor: 'bg-[#8B1538]',
    title: 'Previsão Total Anual',
    value: '892K€',
    change: '+5.2% vs ano anterior',
    changeColor: 'text-[#8B1538]',
    positive: true
  },
  { 
    badge: 'IA Preditiva',
    badgeColor: 'bg-[#3B82F6]',
    title: 'Previsão Total Anual',
    value: '945K€',
    change: '+12% confiança alta',
    changeColor: 'text-[#3B82F6]',
    positive: true
  },
  { 
    badge: 'Orç. Clientes',
    badgeColor: 'bg-[#22C55E]',
    title: 'Previsão Total Anual',
    value: '918K€',
    change: '+8% compromisso',
    changeColor: 'text-[#22C55E]',
    positive: true
  },
  { 
    badge: 'Orçamento',
    badgeColor: 'bg-[#F59E0B]',
    title: 'Meta Orçamental',
    value: '780K€',
    change: '↓ Base fiscal 2025',
    changeColor: 'text-[#F59E0B]',
    positive: false
  },
];

// KPI data for Stock
const stockKpis = [
  { 
    badge: 'Histórico',
    badgeColor: 'bg-[#8B1538]',
    title: 'Stock Total Anual',
    value: '180K un',
    change: '+3.8% vs ano anterior',
    changeColor: 'text-[#8B1538]',
    positive: true
  },
  { 
    badge: 'IA Preditiva',
    badgeColor: 'bg-[#3B82F6]',
    title: 'Stock Total Anual',
    value: '198K un',
    change: '+10% confiança alta',
    changeColor: 'text-[#3B82F6]',
    positive: true
  },
  { 
    badge: 'Orç. Clientes',
    badgeColor: 'bg-[#22C55E]',
    title: 'Stock Total Anual',
    value: '188K un',
    change: '+6% compromisso',
    changeColor: 'text-[#22C55E]',
    positive: true
  },
  { 
    badge: 'Orçamento',
    badgeColor: 'bg-[#F59E0B]',
    title: 'Meta Stock',
    value: '175K un',
    change: '↓ Base fiscal 2025',
    changeColor: 'text-[#F59E0B]',
    positive: false
  },
];

// Alerts data
const alertasData = [
  { 
    type: 'warning',
    icon: AlertTriangle,
    title: 'Desvio Significativo - Março',
    description: 'IA prevê -12% vs Orçamento Clientes',
    bgColor: 'bg-amber-50',
    borderColor: 'border-l-amber-400',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-700'
  },
  { 
    type: 'success',
    icon: TrendingUp,
    title: 'Tendência Positiva - Q3',
    description: 'Todas as fontes convergem em +15%',
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-400',
    iconColor: 'text-green-500',
    titleColor: 'text-green-700'
  },
  { 
    type: 'danger',
    icon: TrendingDown,
    title: 'Risco de Subprodução',
    description: 'Histórico abaixo do orçamento em 8%',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-400',
    iconColor: 'text-red-500',
    titleColor: 'text-red-700'
  },
  { 
    type: 'info',
    icon: Info,
    title: 'Sazonalidade Detectada',
    description: 'Pico esperado em Nov-Dez',
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-blue-400',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-700'
  },
];

// Compact KPI Card Component
const KPICard = ({ 
  badge, 
  badgeColor, 
  title, 
  value, 
  change, 
  changeColor,
  positive,
}: { 
  badge: string;
  badgeColor: string;
  title: string;
  value: string;
  change: string;
  changeColor: string;
  positive: boolean;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-2 flex gap-2">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
      {positive ? (
        <TrendingUp className="w-4 h-4 text-eps-primary" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-[#F59E0B]" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${badgeColor}`}>
        {badge}
      </span>
      <div className="text-[10px] text-gray-500 mt-0.5">{title}</div>
      <div className="text-lg font-bold text-gray-900 leading-tight">{value}</div>
      <div className={`text-[10px] font-medium ${changeColor} flex items-center gap-0.5`}>
        {positive && <span>↑</span>}
        {change}
      </div>
    </div>
  </div>
);

// Comparison Chart Component
const ComparisonChart = ({ 
  data, 
  title, 
  subtitle,
  unit = 'K€'
}: { 
  data: typeof previsaoVendasData;
  title: string;
  subtitle: string;
  unit?: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-2 h-full flex flex-col">
    <div className="flex items-center justify-between mb-1">
      <div>
        <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
        <p className="text-[9px] text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#8B1538]" />
          <span>Histórico</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <span>IA</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>Clientes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Orçamento</span>
        </div>
      </div>
    </div>
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 8 }} />
          <YAxis tick={{ fontSize: 8 }} tickFormatter={(value) => `${value}${unit}`} />
          <Tooltip 
            formatter={(value: number) => [`${value}${unit}`, '']}
            contentStyle={{ fontSize: 10 }}
          />
          <Line 
            type="monotone" 
            dataKey="historico" 
            stroke="#8B1538" 
            strokeWidth={2} 
            dot={{ fill: '#8B1538', r: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="ia" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={{ fill: '#3B82F6', r: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="clientes" 
            stroke="#22C55E" 
            strokeWidth={2} 
            dot={{ fill: '#22C55E', r: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="orcamento" 
            stroke="#F59E0B" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={{ fill: '#F59E0B', r: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Simulator Source Card
const SimulatorSourceCard = ({ 
  color, 
  label, 
  value, 
  selected, 
  onClick 
}: { 
  color: string;
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`bg-white rounded-lg border-2 p-3 text-center transition-all flex-1 ${
      selected ? 'border-eps-primary shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className={`w-2 h-2 rounded-full mx-auto mb-1`} style={{ backgroundColor: color }} />
    <div className="text-[10px] text-gray-500">{label}</div>
    <div className="text-sm font-bold text-gray-900">{value}</div>
  </button>
);

const DecisaoPage = () => {
  const [selectedSource, setSelectedSource] = useState<string>('historico');
  const [growthVariation, setGrowthVariation] = useState<number[]>([50]); // 0% default

  const variationPercent = useMemo(() => {
    const value = growthVariation[0];
    return Math.round((value / 100) * 50 - 20);
  }, [growthVariation]);

  const baseValues = {
    historico: 892,
    ia: 945,
    clientes: 918,
    orcamento: 780
  };

  const selectedBaseValue = baseValues[selectedSource as keyof typeof baseValues] || 892;
  
  const previsaoAjustada = useMemo(() => {
    return Math.round(selectedBaseValue * (1 + variationPercent / 100));
  }, [selectedBaseValue, variationPercent]);

  const impactoCashFlow = useMemo(() => {
    const diff = previsaoAjustada - selectedBaseValue;
    return diff >= 0 ? `+${diff}K€` : `${diff}K€`;
  }, [previsaoAjustada, selectedBaseValue]);

  return (
    <EPSLayout title="Decisão" icon="D">
      <div className="h-[calc(100vh-80px)] flex flex-col gap-2 overflow-hidden">
        {/* Top Section: KPIs Row */}
        <div className="grid grid-cols-[1fr_1fr_220px] gap-2">
          {/* Vendas KPIs */}
          <div className="grid grid-cols-4 gap-2">
            {vendasKpis.map((kpi, idx) => (
              <KPICard key={idx} {...kpi} />
            ))}
          </div>
          
          {/* Stock KPIs */}
          <div className="grid grid-cols-4 gap-2">
            {stockKpis.map((kpi, idx) => (
              <KPICard key={idx} {...kpi} />
            ))}
          </div>

          {/* Alerts Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-800">Alertas Inteligentes</h3>
            </div>
          </div>
        </div>

        {/* Middle Section: Charts + Alerts - reduced height */}
        <div className="grid grid-cols-[1fr_1fr_220px] gap-2 h-[140px]">
          {/* Vendas Chart */}
          <ComparisonChart 
            data={previsaoVendasData}
            title="Comparação de Previsões"
            subtitle="Valores em milhares de € • Período: 2025"
          />
          
          {/* Stock Chart */}
          <ComparisonChart 
            data={previsaoStockData}
            title="Comparação de Previsão de Stock"
            subtitle="Valores em milhares de unidades • Período: 2025"
            unit="K"
          />

          {/* Alerts Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-2 overflow-auto">
            <div className="space-y-1.5">
              {alertasData.map((alerta, idx) => {
                const IconComponent = alerta.icon;
                return (
                  <div 
                    key={idx}
                    className={`${alerta.bgColor} ${alerta.borderColor} border-l-3 rounded-r-lg p-1.5 flex items-start gap-1.5`}
                  >
                    <IconComponent className={`w-3 h-3 ${alerta.iconColor} flex-shrink-0 mt-0.5`} />
                    <div>
                      <div className={`text-[10px] font-semibold ${alerta.titleColor}`}>{alerta.title}</div>
                      <div className="text-[9px] text-gray-600">{alerta.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Simulator - expanded layout */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Simulador de Impacto</h3>
              <p className="text-xs text-gray-500">Selecione a fonte e ajuste a variação</p>
            </div>
            <div className="flex items-center gap-2 text-eps-primary text-sm font-medium">
              <LayoutGrid className="w-4 h-4" />
              <span>What-If Analysis</span>
            </div>
          </div>

          {/* Source Selection - full width row */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <SimulatorSourceCard 
              color="#8B1538"
              label="Histórico"
              value="892K€"
              selected={selectedSource === 'historico'}
              onClick={() => setSelectedSource('historico')}
            />
            <SimulatorSourceCard 
              color="#3B82F6"
              label="IA Preditiva"
              value="945K€"
              selected={selectedSource === 'ia'}
              onClick={() => setSelectedSource('ia')}
            />
            <SimulatorSourceCard 
              color="#22C55E"
              label="Orç. Clientes"
              value="918K€"
              selected={selectedSource === 'clientes'}
              onClick={() => setSelectedSource('clientes')}
            />
            <SimulatorSourceCard 
              color="#F59E0B"
              label="Orçamento"
              value="780K€"
              selected={selectedSource === 'orcamento'}
              onClick={() => setSelectedSource('orcamento')}
            />
          </div>

          {/* Growth Variation Slider - full width */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Variação de Crescimento</span>
              <span className={`text-xl font-bold ${variationPercent >= 0 ? 'text-eps-primary' : 'text-red-600'}`}>
                {variationPercent >= 0 ? '+' : ''}{variationPercent}%
              </span>
            </div>
            <Slider
              value={growthVariation}
              onValueChange={setGrowthVariation}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>

          {/* Results - two columns */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-rose-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Previsão Ajustada</div>
              <div className="text-2xl font-bold text-gray-900">{selectedSource ? `${previsaoAjustada}K€` : '---'}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
                <LayoutGrid className="w-4 h-4" />
                <span>Impacto Cash-Flow</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{selectedSource ? impactoCashFlow : '---'}</div>
            </div>
          </div>

          {/* Confirm Button - at bottom */}
          <Button className="w-full bg-eps-primary hover:bg-eps-primary/90 text-white py-3 text-base mt-auto">
            Confirmar Previsão →
          </Button>
        </div>
      </div>
    </EPSLayout>
  );
};

export default DecisaoPage;
