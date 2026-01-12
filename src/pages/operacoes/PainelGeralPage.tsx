import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  gerarCustosMensais, 
  gerarCustosPorAtividade, 
  gerarCustosPorLocal,
  areaTotalHa
} from '@/data/operacoesData';

const PainelGeralPage = () => {
  const custosMensais = gerarCustosMensais();
  const custosPorAtividade = gerarCustosPorAtividade();
  const custosPorLocal = gerarCustosPorLocal();

  // Data for the scatter-like chart (single point)
  const custosMensaisFiltered = custosMensais.filter(d => d.valor > 0);

  return (
    <OperacoesLayout title="D A S H B O A R D">
      <div className="grid grid-cols-2 gap-3 h-full">
        {/* Distribuição Custos Mensal - €  */}
        <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-0.5">Distribuição Custos Mensal</h3>
          <p className="text-[#8B1538] text-[10px] mb-2">Valores em milhares de €</p>
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
              <h3 className="text-[#8B1538] font-semibold text-xs mb-0.5">Distribuição Custos Mensal</h3>
              <p className="text-[#8B1538] text-[10px]">Valores em €/ha</p>
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
          <h3 className="text-[#8B1538] font-semibold text-xs mb-0.5">Custos por Tipo de Atividade</h3>
          <p className="text-[#8B1538] text-[10px] mb-1">Valores em milhares de €</p>
          <div className="flex items-center gap-3 mb-2 text-[9px]">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8B1538]" /> Custo Total</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#d4d4d4]" /> Orçamento</div>
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
          <h3 className="text-[#8B1538] font-semibold text-xs mb-0.5">Custos por Local</h3>
          <p className="text-[#8B1538] text-[10px] mb-1">Valores em milhares de €</p>
          <div className="flex items-center gap-3 mb-2 text-[9px]">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8B1538]" /> Custo Total</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#d4d4d4]" /> Orçamento</div>
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
    </OperacoesLayout>
  );
};

export default PainelGeralPage;
