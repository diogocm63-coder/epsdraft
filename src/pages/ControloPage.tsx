import EPSLayout from "@/components/layout/EPSLayout";
import { Package, Truck, Globe, BarChart3, DollarSign, TrendingUp, Rocket } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  controloProdutoData as produtoData,
  controloCanalData as canalData,
  controloMercadoData as mercadoData,
  controloCustosData as custosData,
  controloEficienciaData as eficienciaData,
  controloExpansaoData as expansaoData,
} from "@/data/wineData";

const IndicatorSection = ({ 
  icon, 
  title, 
  indicators 
}: { 
  icon: React.ReactNode; 
  title: string; 
  indicators: { icon: React.ReactNode; label: string }[] 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <BarChart3 className="w-4 h-4 text-eps-primary" />
      <span className="text-xs font-medium text-eps-primary">INDICADORES</span>
    </div>
    <div className="space-y-1">
      {indicators.map((ind, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
          {ind.icon}
          <span>{ind.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const ControloPage = () => {
  return (
    <EPSLayout title="Controlo" icon="C">
      <div className="space-y-4 h-[calc(100vh-100px)] overflow-auto">
        {/* Top Row - Indicator Sections */}
        <div className="grid grid-cols-3 gap-4">
          <IndicatorSection
            icon={<Package className="w-5 h-5 text-eps-primary" />}
            title="POR PRODUTO"
            indicators={[
              { icon: <TrendingUp className="w-3 h-3" />, label: "Rentabilidade individual" },
              { icon: <DollarSign className="w-3 h-3" />, label: "Custos diretos e indiretos" },
              { icon: <BarChart3 className="w-3 h-3" />, label: "Margem contributiva" },
              { icon: <TrendingUp className="w-3 h-3" />, label: "Volume vs. valor" },
            ]}
          />
          <IndicatorSection
            icon={<Truck className="w-5 h-5 text-eps-primary" />}
            title="POR CANAL"
            indicators={[
              { icon: <TrendingUp className="w-3 h-3" />, label: "Desempenho por canal" },
              { icon: <DollarSign className="w-3 h-3" />, label: "Custos de distribuição" },
              { icon: <BarChart3 className="w-3 h-3" />, label: "Eficiência comercial" },
              { icon: <Rocket className="w-3 h-3" />, label: "Potencial de crescimento" },
            ]}
          />
          <IndicatorSection
            icon={<Globe className="w-5 h-5 text-eps-primary" />}
            title="POR MERCADO"
            indicators={[
              { icon: <TrendingUp className="w-3 h-3" />, label: "Penetração geográfica" },
              { icon: <BarChart3 className="w-3 h-3" />, label: "Competitividade regional" },
              { icon: <Rocket className="w-3 h-3" />, label: "Oportunidades de expansão" },
              { icon: <DollarSign className="w-3 h-3" />, label: "Riscos de mercado" },
            ]}
          />
        </div>

        {/* Middle Row - Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Rentabilidade por Produto */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Rentabilidade por Produto</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={produtoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={50} />
                <Tooltip />
                <Bar dataKey="rentabilidade" fill="#8B1538" radius={[0, 2, 2, 0]} />
                <Bar dataKey="custos" fill="#C9A227" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Desempenho vs Meta */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Desempenho vs Meta</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={canalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="meta" fill="#8B1538" radius={[2, 2, 0, 0]} />
                <Bar dataKey="atual" fill="#C9A227" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Penetração & Competitividade */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Penetração & Competitividade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mercadoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="penetracao" fill="#8B1538" radius={[2, 2, 0, 0]} />
                <Bar dataKey="competitividade" fill="#C9A227" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - More Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Custos Diretos vs Indiretos */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Custos Diretos vs Indiretos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={custosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="diretos" fill="#8B1538" fillOpacity={0.6} stroke="#8B1538" />
                <Area type="monotone" dataKey="indiretos" fill="#D4A5A5" fillOpacity={0.6} stroke="#D4A5A5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Eficiência & Potencial */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Eficiência & Potencial</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={eficienciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="eficiencia" stroke="#8B1538" strokeWidth={2} dot={{ fill: "#8B1538", r: 4 }} />
                <Line type="monotone" dataKey="potencial" stroke="#C9A227" strokeWidth={2} dot={{ fill: "#C9A227", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Oportunidades de Expansão */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Oportunidades de Expansão</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expansaoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {expansaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </EPSLayout>
  );
};

export default ControloPage;
