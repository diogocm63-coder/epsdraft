import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { OperacoesSummary } from '@/components/operacoes/OperacoesSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  gerarTop5AtividadesCusto, 
  gerarCustoTotalPorProduto,
  gerarCustoTotalPorHa
} from '@/data/operacoesData';

const AnaliseCustosPage = () => {
  const top5Atividades = gerarTop5AtividadesCusto();
  const custoPorProduto = gerarCustoTotalPorProduto();
  const custoPorHa = gerarCustoTotalPorHa();

  const custoTotalData = [{ mes: '2025-03', custo: 3260 }];

  return (
    <OperacoesLayout title="Análise de Custos">
      <div className="flex flex-col h-full gap-2">
        <OperacoesSummary />

        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Custo Total */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Custo Total</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoTotalData} margin={{ top: 25, right: 30, left: 30, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                  <Bar dataKey="custo" fill="#9CA349" barSize={80} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custo" position="top" fontSize={10} formatter={(v: number) => `${v.toLocaleString('pt-PT')} €`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Atividades Maior Custo */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Top 5 Atividades Maior Custo</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top5Atividades} layout="vertical" margin={{ top: 10, right: 80, left: 40, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} hide />
                  <YAxis dataKey="atividade" type="category" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                  <Bar dataKey="custo" fill="#8B1538" barSize={25} radius={[0, 2, 2, 0]}>
                    <LabelList dataKey="custo" position="right" fontSize={10} formatter={(v: number) => `${v.toLocaleString('pt-PT')} €`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo Total por Produto */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Custo Total por Produto</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoPorProduto} margin={{ top: 25, right: 30, left: 30, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="produto" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                  <Bar dataKey="custo" fill="#9CA349" barSize={80} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custo" position="top" fontSize={10} formatter={(v: number) => `${v.toLocaleString('pt-PT')} €`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo Total por ha */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-2">Custo Total por ha</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoPorHa} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="local" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)} K€`} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo/ha']} />
                  <Bar dataKey="custo" fill="#8B1538" barSize={50} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custo" position="top" fontSize={9} formatter={(v: number) => `${v.toLocaleString('pt-PT')} €`} />
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

export default AnaliseCustosPage;
