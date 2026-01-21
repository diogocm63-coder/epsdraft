import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Cell } from 'recharts';
import { 
  gerarCustosMensais, 
  gerarCustosPorAtividade, 
  gerarCustosPorLocal,
  areaTotalHa
} from '@/data/operacoesData';

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

const PainelGeralPage = () => {
  const custosMensais = gerarCustosMensais();
  const custosPorAtividade = gerarCustosPorAtividade();
  const custosPorLocal = gerarCustosPorLocal();

  const custosMensaisFiltered = custosMensais.filter(d => d.valor > 0);

  return (
    <OperacoesLayout title="Painel Geral">
      <div className="flex flex-col h-full gap-2">
        {/* Summary Row - Above Dashboard */}
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
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">D A S H B O A R D</h2>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-gray-500">Área (ha): <span className="font-bold text-gray-900">{summaryData.areaHa}</span></span>
            <span className="text-gray-500">% Execução: <span className="font-bold text-gray-900">{summaryData.execucao}%</span></span>
          </div>
        </div>

        {/* Dashboard Charts Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Distribuição Custos Mensal - €  */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-0.5">Distribuição Custos Mensal</h3>
            <p className="text-eps-primary text-[10px] mb-2">Valores em milhares de €</p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custosMensaisFiltered} margin={{ top: 25, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis 
                    tick={{ fontSize: 9 }} 
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={false}
                    tickFormatter={(v) => `${(v/1000).toFixed(0)} K€`}
                    domain={[3000, 4000]}
                  />
                  <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, 'Valor']} />
                  <Bar dataKey="valor" fill="#8B1538" barSize={8} radius={[2, 2, 2, 2]}>
                    <LabelList dataKey="valor" position="top" fontSize={9} formatter={(v: number) => `${(v/1000).toFixed(1)} K€`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição Custos Mensal - €/ha */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-eps-primary font-semibold text-xs mb-0.5">Distribuição Custos Mensal</h3>
                <p className="text-eps-primary text-[10px]">Valores em €/ha</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-[10px]">Área (ha)</span>
                <div className="font-bold text-sm">{areaTotalHa}</div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custosMensais} margin={{ top: 25, right: 10, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fontSize: 7 }} 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end"
                    height={40}
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toFixed(2)} €`, '€/ha']} />
                  <Bar dataKey="valorHa" fill="#8B1538" barSize={20} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="valorHa" position="top" fontSize={8} formatter={(v: number) => v > 0 ? `${v.toFixed(2)} €` : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custos por Tipo de Atividade */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-0.5">Custos por Tipo de Atividade</h3>
            <p className="text-eps-primary text-[10px] mb-1">Valores em milhares de €</p>
            <div className="flex items-center gap-3 mb-2 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Total</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Orçamento</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custosPorAtividade} margin={{ top: 25, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="atividade" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, '']} />
                  <Bar dataKey="custoTotal" fill="#8B1538" barSize={35} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoTotal" position="top" fontSize={9} formatter={(v: number) => `${(v/1000).toFixed(1)} K€`} />
                  </Bar>
                  <Bar dataKey="orcamento" fill="#d4d4d4" barSize={35} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="orcamento" position="top" fontSize={9} formatter={(v: number) => v > 0 ? `${(v/1000).toFixed(1)} K€` : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custos por Local */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-0.5">Custos por Local</h3>
            <p className="text-eps-primary text-[10px] mb-1">Valores em milhares de €</p>
            <div className="flex items-center gap-3 mb-2 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Total</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Orçamento</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custosPorLocal} margin={{ top: 25, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="local" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, '']} />
                  <Bar dataKey="custoTotal" fill="#8B1538" barSize={35} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoTotal" position="top" fontSize={9} formatter={(v: number) => `${(v/1000).toFixed(1)} K€`} />
                  </Bar>
                  <Bar dataKey="orcamento" fill="#d4d4d4" barSize={35} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="orcamento" position="top" fontSize={9} formatter={(v: number) => v > 0 ? `${(v/1000).toFixed(1)} K€` : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default PainelGeralPage;
