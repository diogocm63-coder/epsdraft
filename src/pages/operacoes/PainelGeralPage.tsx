import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  return (
    <OperacoesLayout title="D A S H B O A R D">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Distribuição Custos Mensal - €  */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Distribuição Custos Mensal</h3>
          <p className="text-[#8B1538] text-xs mb-3">Valores em milhares de €</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custosMensais.filter(d => d.valor > 0)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000} K€`} />
                <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, 'Valor']} />
                <Bar dataKey="valor" fill="#8B1538" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição Custos Mensal - €/ha */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Distribuição Custos Mensal</h3>
              <p className="text-[#8B1538] text-xs">Valores em €/ha</p>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-xs">Área (ha)</span>
              <div className="font-bold text-lg">{areaTotalHa}</div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custosMensais} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 8 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(2)} €`, '€/ha']} />
                <Bar dataKey="valorHa" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custos por Tipo de Atividade */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Custos por Tipo de Atividade</h3>
          <p className="text-[#8B1538] text-xs mb-3">Valores em milhares de €</p>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Total</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> Orçamento</div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custosPorAtividade} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, '']} />
                <Bar dataKey="custoTotal" fill="#8B1538" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orcamento" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custos por Local */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-1">Custos por Local</h3>
          <p className="text-[#8B1538] text-xs mb-3">Valores em milhares de €</p>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Total</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /> Orçamento</div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custosPorLocal} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="local" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(1)} K€`, '']} />
                <Bar dataKey="custoTotal" fill="#8B1538" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orcamento" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default PainelGeralPage;
