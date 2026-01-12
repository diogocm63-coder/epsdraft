import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    <OperacoesLayout title="D E S E M P E N H O">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Horas Trabalhadas/ha */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas/ha</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasHa} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}`, 'Horas/ha']} />
                <Bar dataKey="valor" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas/ha por Tipo de Atividade */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas/ha por Tipo de Atividade</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasHaPorAtividade} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}`, 'Horas/ha']} />
                <Bar dataKey="horas" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo/ha */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Custo/ha</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoHa} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v} €`, 'Custo/ha']} />
                <Bar dataKey="valor" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => `${v} €` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custo/ha por Tipo de Atividade */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Custo/ha por Tipo de Atividade</h3>
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8B1538]" /> Custo Produtos/ha</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#C4A962]" /> Custo Trabalhadores/ha</div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={custoHaPorAtividade} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v} €`, '']} />
                <Bar dataKey="custoProdutos" fill="#8B1538" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custoTrabalhadores" fill="#C4A962" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default IndicadoresKPIsPage;
