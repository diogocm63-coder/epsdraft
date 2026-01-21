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
import { Check } from "lucide-react";

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
    sourceKey: 'historico',
    badge: 'Histórico',
    badgeColor: 'bg-[#8B1538]',
    title: 'Previsão Total Anual',
    value: '892K€',
    change: '+5.2% vs ano anterior',
    changeColor: 'text-[#8B1538]',
    positive: true
  },
  { 
    sourceKey: 'ia',
    badge: 'IA Preditiva',
    badgeColor: 'bg-[#3B82F6]',
    title: 'Previsão Total Anual',
    value: '945K€',
    change: '+12% confiança alta',
    changeColor: 'text-[#3B82F6]',
    positive: true
  },
  { 
    sourceKey: 'clientes',
    badge: 'Orç. Clientes',
    badgeColor: 'bg-[#22C55E]',
    title: 'Previsão Total Anual',
    value: '918K€',
    change: '+8% compromisso',
    changeColor: 'text-[#22C55E]',
    positive: true
  },
  { 
    sourceKey: 'orcamento',
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
    sourceKey: 'historico',
    badge: 'Histórico',
    badgeColor: 'bg-[#8B1538]',
    title: 'Stock Total Anual',
    value: '180K un',
    change: '+3.8% vs ano anterior',
    changeColor: 'text-[#8B1538]',
    positive: true
  },
  { 
    sourceKey: 'ia',
    badge: 'IA Preditiva',
    badgeColor: 'bg-[#3B82F6]',
    title: 'Stock Total Anual',
    value: '198K un',
    change: '+10% confiança alta',
    changeColor: 'text-[#3B82F6]',
    positive: true
  },
  { 
    sourceKey: 'clientes',
    badge: 'Orç. Clientes',
    badgeColor: 'bg-[#22C55E]',
    title: 'Stock Total Anual',
    value: '188K un',
    change: '+6% compromisso',
    changeColor: 'text-[#22C55E]',
    positive: true
  },
  { 
    sourceKey: 'orcamento',
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
  selected,
  onClick,
}: { 
  badge: string;
  badgeColor: string;
  title: string;
  value: string;
  change: string;
  changeColor: string;
  positive: boolean;
  selected?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`bg-white rounded-lg border-2 p-2 flex gap-2 text-left transition-all w-full ${
      selected ? 'border-eps-primary shadow-md ring-1 ring-eps-primary/20' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
      {positive ? (
        <TrendingUp className="w-4 h-4 text-eps-primary" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-[#F59E0B]" />
      )}
    </div>
    <div className="flex-1 min-w-0 relative">
      {selected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-eps-primary rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
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
  </button>
);

// Comparison Chart Component
const ComparisonChart = ({ 
  data, 
  title, 
  subtitle,
  unit = 'K€',
  selectedSource,
  onSourceClick
}: { 
  data: typeof previsaoVendasData;
  title: string;
  subtitle: string;
  unit?: string;
  selectedSource: string | null;
  onSourceClick: (source: string) => void;
}) => {
  const sources = [
    { key: 'historico', label: 'Histórico', color: '#8B1538' },
    { key: 'ia', label: 'IA', color: '#3B82F6' },
    { key: 'clientes', label: 'Clientes', color: '#22C55E' },
    { key: 'orcamento', label: 'Orçamento', color: '#F59E0B' },
  ];

  const getOpacity = (sourceKey: string) => {
    if (!selectedSource) return 1;
    return selectedSource === sourceKey ? 1 : 0.15;
  };

  const getStrokeWidth = (sourceKey: string) => {
    if (!selectedSource) return 2;
    return selectedSource === sourceKey ? 3 : 1;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
          <p className="text-[9px] text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          {sources.map((source) => (
            <button
              key={source.key}
              onClick={() => onSourceClick(source.key)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                selectedSource === source.key 
                  ? 'bg-gray-100 ring-1 ring-gray-300' 
                  : 'hover:bg-gray-50'
              } ${!selectedSource || selectedSource === source.key ? 'opacity-100' : 'opacity-40'}`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: source.color }}
              />
              <span>{source.label}</span>
            </button>
          ))}
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
              strokeWidth={getStrokeWidth('historico')} 
              strokeOpacity={getOpacity('historico')}
              dot={{ fill: '#8B1538', r: selectedSource === 'historico' ? 3 : 2, fillOpacity: getOpacity('historico') }} 
            />
            <Line 
              type="monotone" 
              dataKey="ia" 
              stroke="#3B82F6" 
              strokeWidth={getStrokeWidth('ia')} 
              strokeOpacity={getOpacity('ia')}
              dot={{ fill: '#3B82F6', r: selectedSource === 'ia' ? 3 : 2, fillOpacity: getOpacity('ia') }} 
            />
            <Line 
              type="monotone" 
              dataKey="clientes" 
              stroke="#22C55E" 
              strokeWidth={getStrokeWidth('clientes')} 
              strokeOpacity={getOpacity('clientes')}
              dot={{ fill: '#22C55E', r: selectedSource === 'clientes' ? 3 : 2, fillOpacity: getOpacity('clientes') }} 
            />
            <Line 
              type="monotone" 
              dataKey="orcamento" 
              stroke="#F59E0B" 
              strokeWidth={getStrokeWidth('orcamento')} 
              strokeOpacity={getOpacity('orcamento')}
              strokeDasharray="5 5"
              dot={{ fill: '#F59E0B', r: selectedSource === 'orcamento' ? 3 : 2, fillOpacity: getOpacity('orcamento') }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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
  const [selectedSource, setSelectedSource] = useState<string | null>('historico');
  const [growthVariation, setGrowthVariation] = useState<number[]>([50]); // 0% default
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const handleSourceClick = (source: string) => {
    setSelectedSource(prev => prev === source ? null : source);
    setIsConfirmed(false);
  };

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
        <div className="grid grid-cols-[1fr_1fr_180px] gap-2">
          {/* Vendas KPIs */}
          <div className="grid grid-cols-4 gap-2">
            {vendasKpis.map((kpi, idx) => (
              <KPICard 
                key={idx} 
                {...kpi} 
                selected={selectedSource === kpi.sourceKey}
                onClick={() => handleSourceClick(kpi.sourceKey)}
              />
            ))}
          </div>
          
          {/* Stock KPIs */}
          <div className="grid grid-cols-4 gap-2">
            {stockKpis.map((kpi, idx) => (
              <KPICard 
                key={idx} 
                {...kpi} 
                selected={selectedSource === kpi.sourceKey}
                onClick={() => handleSourceClick(kpi.sourceKey)}
              />
            ))}
          </div>

          {/* Empty space for alignment */}
          <div />
        </div>

        {/* Middle Section: Charts + Alerts + Simulator */}
        <div className="flex-1 grid grid-rows-[1fr_auto] gap-2 min-h-0">
          {/* Row 1: Charts + Alerts */}
          <div className="grid grid-cols-[1fr_1fr_180px] gap-2 min-h-0">
            {/* Vendas Chart */}
            <ComparisonChart 
              data={previsaoVendasData}
              title="Comparação de Previsões"
              subtitle="Valores em milhares de € • Período: 2025"
              selectedSource={selectedSource}
              onSourceClick={handleSourceClick}
            />
            
            {/* Stock Chart */}
            <ComparisonChart 
              data={previsaoStockData}
              title="Comparação de Previsão de Stock"
              subtitle="Valores em milhares de unidades • Período: 2025"
              unit="K"
              selectedSource={selectedSource}
              onSourceClick={handleSourceClick}
            />

            {/* Alerts Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 overflow-auto flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <h3 className="text-xs font-semibold text-gray-800">Alertas Inteligentes</h3>
              </div>
              <div className="space-y-1.5 flex-1">
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

          {/* Row 2: Simulator - centered */}
          <div className="flex justify-center min-h-0">
            <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col min-h-0 w-full max-w-4xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Simulador de Impacto</h3>
                  <p className="text-[10px] text-gray-500">Selecione a fonte e ajuste a variação</p>
                </div>
                <div className="flex items-center gap-2 text-eps-primary text-xs font-medium">
                  <LayoutGrid className="w-3 h-3" />
                  <span>What-If Analysis</span>
                </div>
              </div>

              {/* Source Selection - full width row */}
              <div className="grid grid-cols-4 gap-3 mb-2">
                <SimulatorSourceCard 
                  color="#8B1538"
                  label="Histórico"
                  value="892K€"
                  selected={selectedSource === 'historico'}
                  onClick={() => handleSourceClick('historico')}
                />
                <SimulatorSourceCard 
                  color="#3B82F6"
                  label="IA Preditiva"
                  value="945K€"
                  selected={selectedSource === 'ia'}
                  onClick={() => handleSourceClick('ia')}
                />
                <SimulatorSourceCard 
                  color="#22C55E"
                  label="Orç. Clientes"
                  value="918K€"
                  selected={selectedSource === 'clientes'}
                  onClick={() => handleSourceClick('clientes')}
                />
                <SimulatorSourceCard 
                  color="#F59E0B"
                  label="Orçamento"
                  value="780K€"
                  selected={selectedSource === 'orcamento'}
                  onClick={() => handleSourceClick('orcamento')}
                />
              </div>

            {/* Growth Variation Slider - full width */}
            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Variação de Crescimento</span>
                <span className={`text-base font-bold ${variationPercent >= 0 ? 'text-eps-primary' : 'text-red-600'}`}>
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
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>-20%</span>
                <span>0%</span>
                <span>+30%</span>
              </div>
            </div>

              {/* Results - two columns */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-rose-50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-500 mb-0.5">Previsão Ajustada</div>
                  <div className="text-lg font-bold text-gray-900">{selectedSource ? `${previsaoAjustada}K€` : '---'}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-[10px] text-green-700 mb-0.5">
                    <LayoutGrid className="w-3 h-3" />
                    <span>Impacto Cash-Flow</span>
                  </div>
                  <div className="text-lg font-bold text-green-700">{selectedSource ? impactoCashFlow : '---'}</div>
                </div>
              </div>

              {/* Confirm Button - at bottom */}
              {isConfirmed ? (
                <div className="w-full bg-green-100 border border-green-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 mt-auto">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Previsão Confirmada</span>
                </div>
              ) : (
                <Button 
                  className="w-full bg-eps-primary hover:bg-eps-primary/90 text-white py-2 text-sm mt-auto"
                  onClick={() => setIsConfirmed(true)}
                >
                  Confirmar Previsão →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </EPSLayout>
  );
};

export default DecisaoPage;
