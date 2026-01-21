import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Summary KPI data
const summaryData = {
  horasTrabalhadas: {
    total: 4912,
    horasUteis: { valor: 4778, percent: 97 },
    horasPausa: { valor: 134, percent: 3 }
  },
  custos: {
    total: 3260,
    pessoal: { valor: 1.38, percent: 42 },
    produtos: { valor: 1.88, percent: 58 }
  },
  areaHa: 25.7,
  execucao: 2
};

// Activity type distribution for pie chart
const tipoAtividadePie = [
  { name: 'Operações culturais', value: 88, color: '#8B1538' },
  { name: 'Fertilização', value: 12, color: '#d4d4d4' }
];

// Activity type distribution for bar chart
const tipoAtividadeBar = [
  { name: 'Op. Culturais', opCulturais: 85, fertilizacao: 15 },
];

interface OperacoesSummaryProps {
  showDashboardLabel?: boolean;
}

export const OperacoesSummary = ({ showDashboardLabel = true }: OperacoesSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-3">
        {/* Horas Trabalhadas */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Horas Trabalhadas</h4>
              <div className="text-2xl font-bold text-gray-900">{summaryData.horasTrabalhadas.total.toLocaleString()}</div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[9px] text-gray-500 uppercase">Horas Úteis</span>
                <span className="text-[10px] font-semibold">{summaryData.horasTrabalhadas.horasUteis.valor.toLocaleString()}</span>
                <span className="text-[9px] bg-eps-primary text-white px-1.5 py-0.5 rounded">{summaryData.horasTrabalhadas.horasUteis.percent}%</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[9px] text-gray-500 uppercase">Horas de Pausa</span>
                <span className="text-[10px] font-semibold">{summaryData.horasTrabalhadas.horasPausa.valor}</span>
                <span className="text-[9px] bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded">{summaryData.horasTrabalhadas.horasPausa.percent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Atividade - Pie Chart */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 text-center">Tipo de Atividade</h4>
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipoAtividadePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={35}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {tipoAtividadePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-eps-primary">{tipoAtividadePie[0].value}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-1 text-[8px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-eps-primary"></span>Operações culturais</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>Fertilização</span>
          </div>
        </div>

        {/* Custos */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Custos</h4>
              <div className="text-2xl font-bold text-gray-900">{summaryData.custos.total.toLocaleString()} €</div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[9px] text-gray-500 uppercase">Pessoal</span>
                <span className="text-[10px] font-semibold">{summaryData.custos.pessoal.valor} K€</span>
                <span className="text-[9px] bg-eps-primary text-white px-1.5 py-0.5 rounded">{summaryData.custos.pessoal.percent}%</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[9px] text-gray-500 uppercase">Produtos</span>
                <span className="text-[10px] font-semibold">{summaryData.custos.produtos.valor} K€</span>
                <span className="text-[9px] bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded">{summaryData.custos.produtos.percent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Atividade - Bar Chart */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 text-center">Tipo de Atividade</h4>
          <div className="h-14 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tipoAtividadeBar} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="opCulturais" stackId="a" fill="#8B1538" radius={[4, 0, 0, 4]} />
                <Bar dataKey="fertilizacao" stackId="a" fill="#d4d4d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-1 text-[8px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-eps-primary"></span>Operações culturais</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>Fertilização</span>
          </div>
        </div>
      </div>

      {/* Dashboard Label and Metrics */}
      {showDashboardLabel && (
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">D A S H B O A R D</h2>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-gray-500">Área (ha): <span className="font-bold text-gray-900">{summaryData.areaHa}</span></span>
            <span className="text-gray-500">% Execução: <span className="font-bold text-gray-900">{summaryData.execucao}%</span></span>
          </div>
        </div>
      )}
    </div>
  );
};
