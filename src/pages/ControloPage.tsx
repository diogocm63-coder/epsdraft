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
  Legend,
  ComposedChart,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  controloProdutoTableData,
  controloVolumeValorMargemData,
  controloCanalData,
  controloMercadoData,
  controloCustosData,
  controloEficienciaData,
  controloExpansaoData,
  controloRiscosMercadoData,
  controloCustosDistribuicaoData,
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', { 
    style: 'decimal', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(value) + ' €';
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-PT').format(value);
};

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
          {/* Tabela de Produtos (31 produtos) */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Rentabilidade por Produto ({controloProdutoTableData.length} produtos)</h3>
            <ScrollArea className="h-[180px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Produto</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Rent. %</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Custos %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controloProdutoTableData.map((row, idx) => (
                    <TableRow key={idx} className="text-xs">
                      <TableCell className="py-1.5 truncate max-w-[120px]" title={row.produto}>{row.produto}</TableCell>
                      <TableCell className="py-1.5 text-right text-green-600 font-medium">{row.rentabilidade}%</TableCell>
                      <TableCell className="py-1.5 text-right text-red-500">{row.custos}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Desempenho vs Meta */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Desempenho vs Meta</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={controloCanalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="meta" fill="#8B1538" radius={[2, 2, 0, 0]} name="Meta" />
                <Bar dataKey="atual" fill="#C9A227" radius={[2, 2, 0, 0]} name="Atual" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Penetração & Competitividade */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Penetração & Competitividade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={controloMercadoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="penetracao" fill="#8B1538" radius={[2, 2, 0, 0]} name="Penetração" />
                <Bar dataKey="competitividade" fill="#C9A227" radius={[2, 2, 0, 0]} name="Competitividade" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third Row - New Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Volume vs Valor e Margem Contributiva */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Volume vs Valor e Margem Contributiva</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={controloVolumeValorMargemData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Volume') return formatNumber(value) + ' un';
                    if (name === 'Valor') return formatCurrency(value);
                    return value + '%';
                  }}
                />
                <Bar yAxisId="left" dataKey="volume" fill="#8B1538" radius={[2, 2, 0, 0]} name="Volume" />
                <Bar yAxisId="left" dataKey="valor" fill="#C9A227" radius={[2, 2, 0, 0]} name="Valor" />
                <Line yAxisId="right" type="monotone" dataKey="margem" stroke="#4CAF50" strokeWidth={2} dot={{ fill: "#4CAF50", r: 4 }} name="Margem %" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Custos de Distribuição */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Custos de Distribuição</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={controloCustosDistribuicaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}K€`} />
                <Tooltip formatter={(value: number) => `${value}K €`} />
                <Bar dataKey="logistica" stackId="a" fill="#8B1538" name="Logística" />
                <Bar dataKey="marketing" stackId="a" fill="#C9A227" name="Marketing" />
                <Bar dataKey="operacional" stackId="a" fill="#D4A5A5" name="Operacional" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Riscos de Mercado */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Riscos de Mercado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={controloRiscosMercadoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K€`} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Risco') return value + '%';
                    return formatCurrency(value);
                  }}
                />
                <Bar yAxisId="right" dataKey="exposicao" fill="#D4A5A5" radius={[2, 2, 0, 0]} name="Exposição" />
                <Line yAxisId="left" type="monotone" dataKey="risco" stroke="#8B1538" strokeWidth={2} dot={{ fill: "#8B1538", r: 4 }} name="Risco" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - More Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Custos Diretos vs Indiretos */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Custos Diretos vs Indiretos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={controloCustosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="diretos" fill="#8B1538" fillOpacity={0.6} stroke="#8B1538" name="Diretos" />
                <Area type="monotone" dataKey="indiretos" fill="#D4A5A5" fillOpacity={0.6} stroke="#D4A5A5" name="Indiretos" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Eficiência & Potencial */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Eficiência & Potencial</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={controloEficienciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="eficiencia" stroke="#8B1538" strokeWidth={2} dot={{ fill: "#8B1538", r: 4 }} name="Eficiência" />
                <Line type="monotone" dataKey="potencial" stroke="#C9A227" strokeWidth={2} dot={{ fill: "#C9A227", r: 4 }} name="Potencial" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Oportunidades de Expansão */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Oportunidades de Expansão</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={controloExpansaoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {controloExpansaoData.map((entry, index) => (
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
