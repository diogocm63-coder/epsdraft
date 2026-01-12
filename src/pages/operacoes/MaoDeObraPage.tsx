import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
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
      <div className="grid grid-cols-2 gap-3 h-full">
        {/* Total de Horas Trabalhadas */}
        <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-2">Total de Horas Trabalhadas</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalHorasData} margin={{ top: 25, right: 30, left: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#9CA349" barSize={80} radius={[2, 2, 0, 0]}>
                  <LabelList dataKey="horas" position="top" fontSize={10} formatter={(v: number) => v.toLocaleString('pt-PT')} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas por Dia da Semana */}
        <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-2">Horas Trabalhadas por Dia da Semana</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorDia} margin={{ top: 25, right: 15, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="dia" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#8B1538" barSize={30} radius={[2, 2, 0, 0]}>
                  <LabelList dataKey="horas" position="top" fontSize={8} formatter={(v: number) => v > 0 ? v.toLocaleString('pt-PT') : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horas Trabalhadas por Atividade */}
        <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-2">Horas Trabalhadas por Atividade</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorAtividade} margin={{ top: 25, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="atividade" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                <Bar dataKey="horas" fill="#9CA349" barSize={60} radius={[2, 2, 0, 0]}>
                  <LabelList dataKey="horas" position="top" fontSize={10} formatter={(v: number) => v.toLocaleString('pt-PT')} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total de Horas por ha */}
        <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#8B1538] font-semibold text-xs">Total de Horas por ha</h3>
            <div className="text-right">
              <span className="text-gray-400 text-[10px]">Área Total (ha)</span>
              <div className="font-bold text-sm">{areaTotalHa}</div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horasPorHa} margin={{ top: 25, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="local" tick={{ fontSize: 10 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas/ha']} />
                <Bar dataKey="horas" fill="#8B1538" barSize={50} radius={[2, 2, 0, 0]}>
                  <LabelList dataKey="horas" position="top" fontSize={9} formatter={(v: number) => v.toLocaleString('pt-PT')} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default MaoDeObraPage;
