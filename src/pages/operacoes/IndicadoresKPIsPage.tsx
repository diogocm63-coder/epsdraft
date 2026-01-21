import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { OperacoesSummary } from '@/components/operacoes/OperacoesSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  gerarHorasTrabalhadasHa,
  gerarHorasTrabalhadasHaPorAtividade,
  gerarCustoHa,
  gerarCustoHaPorAtividade
} from '@/data/operacoesData';

const IndicadoresKPIsPage = () => {
  const horasHa = gerarHorasTrabalhadasHa();
  const horasHaPorAtividade = gerarHorasTrabalhadasHaPorAtividade();
  const custoHa = gerarCustoHa();
  const custoHaPorAtividade = gerarCustoHaPorAtividade();

  return (
    <OperacoesLayout title="Indicadores KPIs">
      <div className="flex flex-col h-full gap-2">
        <OperacoesSummary showDashboardLabel={false} />
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">D E S E M P E N H O</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-400 text-[10px]">Área (ha)</span>
              <div className="font-bold text-sm">25,7</div>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px]">% Execução</span>
              <div className="font-bold text-sm">2%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Horas Trabalhadas/ha */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Horas Trabalhadas/ha</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horasHa} margin={{ top: 25, right: 30, left: 30, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v}`, 'Horas/ha']} />
                  <Bar dataKey="valor" fill="#9CA349" barSize={80} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="valor" position="top" fontSize={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horas Trabalhadas/ha por Tipo de Atividade */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Horas Trabalhadas/ha por Tipo de Atividade</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horasHaPorAtividade} margin={{ top: 25, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="atividade" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v}`, 'Horas/ha']} />
                  <Bar dataKey="horas" fill="#8B1538" barSize={60} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="horas" position="top" fontSize={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo/ha */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Custo/ha</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoHa} margin={{ top: 25, right: 30, left: 30, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v} €`, 'Custo/ha']} />
                  <Bar dataKey="valor" fill="#9CA349" barSize={80} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="valor" position="top" fontSize={10} formatter={(v: number) => `${v} €`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo/ha por Tipo de Atividade */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-1">Custo/ha por Tipo de Atividade</h3>
            <div className="flex items-center gap-3 mb-1 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Produtos/ha</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-gold" /> Custo Trabalhadores/ha</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoHaPorAtividade} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="atividade" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v} €`, '']} />
                  <Bar dataKey="custoProdutos" fill="#8B1538" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoProdutos" position="top" fontSize={9} formatter={(v: number) => `${v} €`} />
                  </Bar>
                  <Bar dataKey="custoTrabalhadores" fill="#C9A227" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoTrabalhadores" position="top" fontSize={9} formatter={(v: number) => `${v} €`} />
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

export default IndicadoresKPIsPage;
