import EPSLayout from "@/components/layout/EPSLayout";
import { Package, Truck, Globe, BarChart3, DollarSign, TrendingUp, Rocket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { controloProdutoData as produtoData, controloCanalData as canalData, controloMercadoData as mercadoData, controloCustosData as custosData, controloEficienciaData as eficienciaData, controloExpansaoData as expansaoData } from "@/data/wineData";
const IndicatorSection = ({
  icon,
  title,
  indicators
}: {
  icon: React.ReactNode;
  title: string;
  indicators: {
    icon: React.ReactNode;
    label: string;
  }[];
}) => <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <BarChart3 className="w-4 h-4 text-eps-primary" />
      <span className="text-xs font-medium text-eps-primary">INDICADORES</span>
    </div>
    <div className="space-y-1">
      {indicators.map((ind, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
          {ind.icon}
          <span>{ind.label}</span>
        </div>)}
    </div>
  </div>;
const ControloPage = () => {
  return <EPSLayout title="Controlo" icon="C">
      
    </EPSLayout>;
};
export default ControloPage;