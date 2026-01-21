import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { OperacoesSummary } from '@/components/operacoes/OperacoesSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  gerarControloOrcamentalCustoTotal,
  gerarControloOrcamentalHoras,
  gerarControloOrcamentalCustoHa,
  gerarCustoPorProduto
} from '@/data/operacoesData';

const ControloOrcamentalPage = () => {
  const custoTotal = gerarControloOrcamentalCustoTotal();
  const horasPorAtividade = gerarControloOrcamentalHoras();
  const custoHa = gerarControloOrcamentalCustoHa();
  const custoPorProduto = gerarCustoPorProduto();

  return (
    <OperacoesLayout title="Controlo Orçamental" showAtividade>
      <div className="flex flex-col h-full gap-2">
        <OperacoesSummary showDashboardLabel={false} />
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">P E R F O R M A N C E</h2>
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
          {/* Custo Total */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-1">Custo Total</h3>
            <div className="flex items-center gap-3 mb-1 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Total</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Custo Orçamentado</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoTotal} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, '']} />
                  <Bar dataKey="custoTotal" fill="#8B1538" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoTotal" position="top" fontSize={8} formatter={(v: number) => v > 0 ? `${v.toLocaleString('pt-PT')} €` : ''} />
                  </Bar>
                  <Bar dataKey="custoOrcamentado" fill="#d4d4d4" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoOrcamentado" position="top" fontSize={8} formatter={(v: number) => v > 0 ? `${v} €` : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horas Trabalhadas por Tipo de Atividade */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-1">Horas Trabalhadas por Tipo de Atividade</h3>
            <div className="flex items-center gap-3 mb-1 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Total Horas</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Horas Orçamentadas</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horasPorAtividade} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="atividade" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, '']} />
                  <Bar dataKey="totalHoras" fill="#8B1538" barSize={40} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="totalHoras" position="top" fontSize={9} formatter={(v: number) => v.toLocaleString('pt-PT')} />
                  </Bar>
                  <Bar dataKey="horasOrcamentadas" fill="#d4d4d4" barSize={40} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="horasOrcamentadas" position="top" fontSize={9} formatter={(v: number) => v > 0 ? v : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo/ha */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-1">Custo/ha</h3>
            <div className="flex items-center gap-3 mb-1 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Total/ha</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Orçamento/ha</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoHa} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v} €`, '']} />
                  <Bar dataKey="custoHa" fill="#8B1538" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoHa" position="top" fontSize={8} formatter={(v: number) => v > 0 ? `${v} €` : ''} />
                  </Bar>
                  <Bar dataKey="orcamentoHa" fill="#d4d4d4" barSize={30} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="orcamentoHa" position="top" fontSize={8} formatter={(v: number) => v > 0 ? v : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custo por Produto */}
          <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
            <h3 className="text-eps-primary font-semibold text-xs mb-1">Custo por Produto</h3>
            <div className="flex items-center gap-3 mb-1 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-primary" /> Custo Produto</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-eps-gold" /> Orçamento</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custoPorProduto} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="produto" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, '']} />
                  <Bar dataKey="custoProduto" fill="#8B1538" barSize={40} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="custoProduto" position="top" fontSize={9} formatter={(v: number) => v > 0 ? `${v.toLocaleString('pt-PT')} €` : ''} />
                  </Bar>
                  <Bar dataKey="orcamento" fill="#9CA349" barSize={40} radius={[2, 2, 0, 0]}>
                    <LabelList dataKey="orcamento" position="top" fontSize={9} formatter={(v: number) => v > 0 ? `${v} €` : ''} />
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

export default ControloOrcamentalPage;
