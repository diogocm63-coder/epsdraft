import EPSLayout from "@/components/layout/EPSLayout";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import {
  executivoMonthlyData as monthlyData,
  executivoPerformanceData as performanceData,
  executivoKpisFinanceiros as kpisFinanceiros,
  executivoKpisOperacionais as kpisOperacionais,
  executivoAlertas as alertas,
} from "@/data/wineData";

const KPICard = ({ kpi }: { kpi: typeof kpisFinanceiros[0] }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="text-xs text-gray-500 font-medium mb-1">{kpi.label}</div>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-2xl font-bold text-gray-800">{kpi.value}</span>
      <span className="text-xs text-gray-400">{kpi.real}</span>
    </div>
    <div className="text-xs text-gray-400 mb-2">{kpi.orc}</div>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{kpi.type}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded ${
        kpi.positive 
          ? "bg-green-100 text-green-700" 
          : "bg-red-100 text-red-700"
      }`}>
        {kpi.positive ? "▲" : "▼"}{Math.abs(kpi.change)}%
      </span>
    </div>
  </div>
);

const AlertCard = ({ alert }: { alert: typeof alertas[0] }) => {
  const levelColors = {
    Alto: "bg-red-500",
    Médio: "bg-yellow-500",
    Baixo: "bg-green-500",
  };
  const iconColors = {
    high: "text-red-500 bg-red-50",
    medium: "text-yellow-500 bg-yellow-50",
    low: "text-green-500 bg-green-50",
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColors[alert.type]}`}>
        {alert.type === "low" ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-600">{alert.title}</p>
        <p className="text-xs font-medium text-eps-primary">{alert.detail}</p>
      </div>
      <span className={`text-xs text-white px-2 py-1 rounded ${levelColors[alert.level as keyof typeof levelColors]}`}>
        {alert.level}
      </span>
    </div>
  );
};

const ExecutivoPage = () => {
  return (
    <EPSLayout title="Dashboard Executivo" icon="E">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-100px)]">
        {/* Left Column - KPIs */}
        <div className="col-span-2 space-y-4 overflow-auto">
          <div className="text-xs font-semibold text-gray-600 mb-2">KPIS FINANCEIROS</div>
          {kpisFinanceiros.map((kpi, idx) => (
            <KPICard key={idx} kpi={kpi} />
          ))}
          
          <div className="text-xs font-semibold text-gray-600 mt-6 mb-2">KPIS OPERACIONAIS</div>
          {kpisOperacionais.map((kpi, idx) => (
            <KPICard key={idx} kpi={kpi} />
          ))}
        </div>

        {/* Center Column - Charts */}
        <div className="col-span-7 space-y-4">
          {/* Real vs Orçamento vs Preditivo */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[48%]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Real vs Orçamento vs Preditivo</h3>
                <p className="text-xs text-gray-500">Receita Vendas e Produção</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#8B1538' }}></span> Real</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#C9A227' }}></span> Orçamento</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#5B8C5A' }}></span> Preditivo</span>
                <span className="ml-2 border-l border-gray-300 pl-2 flex items-center gap-1"><span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#8B1538' }}></span> Prod. Real</span>
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#C9A227' }}></span> Prod. Orç.</span>
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#5B8C5A' }}></span> Prod. Pred.</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}k€`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}kL`} domain={[0, 600]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'producaoReal') return [`${value} kL`, 'Produção Real'];
                    if (name === 'producaoOrc') return [`${value} kL`, 'Produção Orçamento'];
                    if (name === 'producaoPred') return [`${value} kL`, 'Produção Preditivo'];
                    return [`${(value/1000).toFixed(0)}k€`, name === 'real' ? 'Real' : name === 'orcamento' ? 'Orçamento' : 'Preditivo'];
                  }}
                />
                <Bar yAxisId="left" dataKey="real" fill="#8B1538" radius={[2, 2, 0, 0]} name="real" />
                <Bar yAxisId="left" dataKey="orcamento" fill="#C9A227" radius={[2, 2, 0, 0]} name="orcamento" />
                <Bar yAxisId="left" dataKey="preditivo" fill="#5B8C5A" radius={[2, 2, 0, 0]} name="preditivo" />
                <Line yAxisId="right" type="monotone" dataKey="producaoReal" stroke="#8B1538" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#8B1538", r: 4 }} name="producaoReal" />
                <Line yAxisId="right" type="monotone" dataKey="producaoOrc" stroke="#C9A227" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#C9A227", r: 4 }} name="producaoOrc" />
                <Line yAxisId="right" type="monotone" dataKey="producaoPred" stroke="#5B8C5A" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#5B8C5A", r: 4 }} name="producaoPred" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Desempenho Operacional */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[48%]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Desempenho Operacional</h3>
                <p className="text-xs text-gray-500">Eficiência, Utilização e Produtividade</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#8B1538' }}></span> Eficiência</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#2E5A88' }}></span> Utilização</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#C9A227' }}></span> Produtividade</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Area type="monotone" dataKey="eficiencia" fill="#8B1538" fillOpacity={0.3} stroke="#8B1538" strokeWidth={2} />
                <Area type="monotone" dataKey="utilizacao" fill="#2E5A88" fillOpacity={0.3} stroke="#2E5A88" strokeWidth={2} />
                <Area type="monotone" dataKey="produtividade" fill="#C9A227" fillOpacity={0.3} stroke="#C9A227" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Alerts */}
        <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-4 overflow-auto">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Alertas Inteligentes</h3>
            <p className="text-xs text-gray-500">Motor Correlacional - Desvios Críticos</p>
          </div>
          <div className="space-y-1">
            {alertas.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </EPSLayout>
  );
};

export default ExecutivoPage;
