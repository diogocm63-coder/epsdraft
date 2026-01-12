import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <OperacoesLayout title="C U S T O">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Custo Total */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Custo Total</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoTotalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                <Bar dataKey="custo" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => `${v.toLocaleString('pt-PT')} €` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Atividades Maior Custo */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Top 5 Atividades Maior Custo</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Atividades} layout="vertical" margin={{ top: 5, right: 80, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="atividade" type="category" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                <Bar dataKey="custo" fill="#8B1538" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 10, formatter: (v: number) => `${v.toLocaleString('pt-PT')} €` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo Total por Produto */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Custo Total por Produto</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoPorProduto} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo']} />
                <Bar dataKey="custo" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => `${v.toLocaleString('pt-PT')} €` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo Total por ha */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Custo Total por ha</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoPorHa} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="local" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')} €`, 'Custo/ha']} />
                <Bar dataKey="custo" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => `${v.toLocaleString('pt-PT')} €` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default AnaliseCustosPage;
