import EPSLayout from "@/components/layout/EPSLayout";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
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
  AreaChart,
  Area,
  Legend,
} from "recharts";

const monthlyData = [
  { month: "Jan", real: 210000, orcamento: 195000, preditivo: 205000 },
  { month: "Fev", real: 285000, orcamento: 280000, preditivo: 275000 },
  { month: "Mar", real: 260000, orcamento: 285000, preditivo: 270000 },
  { month: "Abr", real: 300000, orcamento: 295000, preditivo: 290000 },
  { month: "Mai", real: 285000, orcamento: 310000, preditivo: 295000 },
  { month: "Jun", real: 295000, orcamento: 305000, preditivo: 300000 },
  { month: "Jul", real: 310000, orcamento: 320000, preditivo: 315000 },
  { month: "Ago", real: 305000, orcamento: 315000, preditivo: 310000 },
  { month: "Set", real: 340000, orcamento: 325000, preditivo: 335000 },
  { month: "Out", real: 355000, orcamento: 340000, preditivo: 350000 },
  { month: "Nov", real: 330000, orcamento: 350000, preditivo: 340000 },
  { month: "Dez", real: 365000, orcamento: 360000, preditivo: 355000 },
];

const performanceData = [
  { month: "Jan", eficiencia: 86, utilizacao: 82, produtividade: 84 },
  { month: "Fev", eficiencia: 88, utilizacao: 85, produtividade: 86 },
  { month: "Mar", eficiencia: 84, utilizacao: 80, produtividade: 82 },
  { month: "Abr", eficiencia: 89, utilizacao: 86, produtividade: 87 },
  { month: "Mai", eficiencia: 87, utilizacao: 84, produtividade: 85 },
  { month: "Jun", eficiencia: 90, utilizacao: 87, produtividade: 88 },
  { month: "Jul", eficiencia: 88, utilizacao: 85, produtividade: 86 },
  { month: "Ago", eficiencia: 91, utilizacao: 88, produtividade: 89 },
  { month: "Set", eficiencia: 89, utilizacao: 86, produtividade: 87 },
  { month: "Out", eficiencia: 92, utilizacao: 89, produtividade: 90 },
  { month: "Nov", eficiencia: 90, utilizacao: 87, produtividade: 88 },
  { month: "Dez", eficiencia: 93, utilizacao: 90, produtividade: 91 },
];

const kpisFinanceiros = [
  { label: "RECEITA", value: "67.260€", real: "Real: 23,17%", orc: "Orç: 66,30%", type: "REAL", change: 4.6, positive: true },
  { label: "EBITDA", value: "62.930€", real: "Real: 7.516€", orc: "Orç: 21,1%", type: "ORÇAMENTO", change: -4.6, positive: false },
  { label: "MARGEM EBITDA", value: "64.4%", real: "Real: 5,970%", orc: "Orç: 11,81%", type: "ORÇAMENTO", change: 9.9, positive: true },
  { label: "CASH FLOW", value: "40.800€", real: "Real: 5,915€", orc: "Orç: 86,25%", type: "ORÇAMENTO", change: -3.8, positive: false },
];

const kpisOperacionais = [
  { label: "MARGEM OPERACIONAL", value: "13.3%", real: "Real: 8,77%", orc: "Orç: 16,26%", type: "ORÇAMENTO", change: 4.4, positive: true },
  { label: "EFICIÊNCIA PRODUTIVA", value: "94.9%", real: "Real: 91,78%", orc: "Orç: 96,0%", type: "ORÇAMENTO", change: -1.1, positive: false },
  { label: "TAXA UTILIZAÇÃO", value: "87.2%", real: "Real: 85,4%", orc: "Orç: 90,0%", type: "REAL", change: -2.8, positive: false },
];

const alertas = [
  { type: "high", title: "Correlação elevada detetada entre", detail: "\"Dias de Fornecimento e Receitas\"", level: "Alto" },
  { type: "high", title: "Correlação elevada detetada entre", detail: "\"Volume de Produção e Margem\"", level: "Alto" },
  { type: "high", title: "Desvio significativo identificado em", detail: "\"Variância de Receitas vs Orçamento\"", level: "Alto" },
  { type: "medium", title: "Tendência de queda identificada em", detail: "\"Eficiência Operacional\"", level: "Médio" },
  { type: "medium", title: "Correlação moderada detetada entre", detail: "\"Custos Energia e Produtividade\"", level: "Médio" },
  { type: "low", title: "Indicador estável com desvio mínimo", detail: "\"Cash Flow Operacional\"", level: "Baixo" },
];

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
                <p className="text-xs text-gray-500">Comparação visual para identificar tendências e desvios</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-primary"></span> Real</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-gold"></span> Orçamento</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-gold opacity-60"></span> Preditivo</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}k€`} />
                <Tooltip formatter={(value: number) => `${(value/1000).toFixed(0)}k€`} />
                <Bar dataKey="real" fill="#8B1538" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="preditivo" stroke="#C9A227" strokeWidth={2} dot={{ fill: "#C9A227", r: 4 }} />
              </BarChart>
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
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-primary"></span> Eficiência</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-gold"></span> Utilização</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-eps-light"></span> Produtividade</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Area type="monotone" dataKey="eficiencia" fill="#8B1538" fillOpacity={0.3} stroke="#8B1538" strokeWidth={2} />
                <Area type="monotone" dataKey="utilizacao" fill="#C9A227" fillOpacity={0.3} stroke="#C9A227" strokeWidth={2} />
                <Area type="monotone" dataKey="produtividade" fill="#D4A5A5" fillOpacity={0.3} stroke="#D4A5A5" strokeWidth={2} />
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
