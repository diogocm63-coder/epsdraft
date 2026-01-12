import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <OperacoesLayout title="P E R F O R M A N C E" showAtividade>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Custo Total */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Custo Total</h3>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Total</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> Custo Orçamentado</div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoTotal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, '']} />
                <Bar dataKey="custoTotal" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9, formatter: (v: number) => v > 0 ? `${v.toLocaleString('pt-PT')} €` : '' }} />
                <Bar dataKey="custoOrcamentado" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas por Tipo de Atividade */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Horas Trabalhadas por Tipo de Atividade</h3>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Total Horas</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> Horas Orçamentadas</div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorAtividade} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, '']} />
                <Bar dataKey="totalHoras" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9, formatter: (v: number) => v.toLocaleString('pt-PT') }} />
                <Bar dataKey="horasOrcamentadas" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo/ha */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Custo/ha</h3>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Total/ha</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> Orçamento/ha</div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoHa} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v} €`, '']} />
                <Bar dataKey="custoHa" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9, formatter: (v: number) => v > 0 ? `${v} €` : '' }} />
                <Bar dataKey="orcamentoHa" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo por Produto */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Custo por Produto</h3>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Produto</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#9CA349]" /> Orçamento</div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoPorProduto} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, '']} />
                <Bar dataKey="custoProduto" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9, formatter: (v: number) => v > 0 ? `${v.toLocaleString('pt-PT')} €` : '' }} />
                <Bar dataKey="orcamento" fill="#9CA349" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default ControloOrcamentalPage;
