import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  gerarHorasPorAtividade, 
  gerarHorasPorDiaSemana,
  gerarHorasPorHa,
  areaTotalHa
} from '@/data/operacoesData';

const MaoDeObraPage = () => {
  const horasPorAtividade = gerarHorasPorAtividade();
  const horasPorDia = gerarHorasPorDiaSemana();
  const horasPorHa = gerarHorasPorHa();

  const totalHorasData = [{ mes: '2025-03', horas: 4912 }];

  return (
    <OperacoesLayout title="L A B O R A Ç Ã O">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Total de Horas Trabalhadas */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Total de Horas Trabalhadas</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalHorasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => v.toLocaleString('pt-PT') }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas por Dia da Semana */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas por Dia da Semana</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorDia} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas por Atividade */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas por Atividade</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorAtividade} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#9CA349" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => v.toLocaleString('pt-PT') }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total de Horas por ha */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[#8B1538] font-semibold text-sm">Total de Horas por ha</h3>
            <div className="text-right">
              <span className="text-gray-500 text-xs">Área Total (ha)</span>
              <div className="font-bold">{areaTotalHa}</div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorHa} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="local" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas/ha']} />
                <Bar dataKey="horas" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => v.toLocaleString('pt-PT') }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default MaoDeObraPage;
