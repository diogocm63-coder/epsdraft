import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { 
  gerarHorasTrabalhadas, 
  gerarCustos, 
  gerarTipoAtividade 
} from '@/data/operacoesData';

interface OperacoesHeaderProps {
  horasData?: ReturnType<typeof gerarHorasTrabalhadas>;
  custosData?: ReturnType<typeof gerarCustos>;
}

export const OperacoesHeader = ({ 
  horasData = gerarHorasTrabalhadas(),
  custosData = gerarCustos()
}: OperacoesHeaderProps) => {
  const tipoAtividade = gerarTipoAtividade();
  
  const tipoAtividadeCusto = [
    { name: 'cultural operations', value: 2000 },
    { name: 'fertilisation', value: 1000 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-2 flex-shrink-0">
      {/* Horas Trabalhadas */}
      <div className="bg-white border border-gray-200 p-2">
        <h3 className="text-[#8B1538] font-bold text-xs tracking-wider text-center mb-1">
          HORAS TRABALHADAS
        </h3>
        <div className="text-xl font-bold text-center text-gray-800 mb-1">
          {horasData.total.toLocaleString('pt-PT')}
        </div>
        <div className="space-y-0.5 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538] font-medium">HORAS ÚTEIS</span>
            <span className="font-bold ml-auto">{horasData.horasUteis.toLocaleString('pt-PT')}</span>
            <span className="bg-[#8B1538] text-white px-1 py-0.5 text-[9px] min-w-[32px] text-center">{horasData.percentUteis}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538] font-medium">HORAS DE PAUSA</span>
            <span className="font-bold ml-auto">{horasData.horasPausa}</span>
            <span className="bg-[#d4d4d4] text-gray-700 px-1 py-0.5 text-[9px] min-w-[32px] text-center">{horasData.percentPausa}%</span>
          </div>
        </div>
      </div>

      {/* Tipo de Atividade - Donut */}
      <div className="bg-white border border-gray-200 p-2">
        <h3 className="text-gray-400 text-[10px] text-center mb-0.5 tracking-wider">TIPO DE ATIVIDADE</h3>
        <div className="h-16 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tipoAtividade}
                cx="50%"
                cy="50%"
                innerRadius={18}
                outerRadius={28}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {tipoAtividade.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-semibold text-gray-600">{tipoAtividade[0].value}%</span>
          </div>
        </div>
        <div className="flex justify-center gap-2 text-[8px]">
          {tipoAtividade.map((item, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custos */}
      <div className="bg-white border border-gray-200 p-2">
        <h3 className="text-[#8B1538] font-bold text-xs tracking-wider text-center mb-1">
          CUSTOS
        </h3>
        <div className="text-xl font-bold text-center text-gray-800 mb-1">
          {custosData.total.toLocaleString('pt-PT')} €
        </div>
        <div className="space-y-0.5 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538] font-medium">PESSOAL</span>
            <span className="font-bold ml-auto">{(custosData.pessoal / 1000).toFixed(2)} K€</span>
            <span className="bg-[#8B1538] text-white px-1 py-0.5 text-[9px] min-w-[32px] text-center">{custosData.percentPessoal}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538] font-medium">PRODUTOS</span>
            <span className="font-bold ml-auto">{(custosData.produtos / 1000).toFixed(2)} K€</span>
            <span className="bg-[#d4d4d4] text-gray-700 px-1 py-0.5 text-[9px] min-w-[32px] text-center">{custosData.percentProdutos}%</span>
          </div>
        </div>
      </div>

      {/* Tipo de Atividade - Stacked Bars */}
      <div className="bg-white border border-gray-200 p-2">
        <h3 className="text-gray-400 text-[10px] text-center mb-0.5 tracking-wider">TIPO DE ATIVIDADE</h3>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tipoAtividadeCusto} layout="horizontal" margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <Bar dataKey="value" fill="#8B1538">
                {tipoAtividadeCusto.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#8B1538' : '#C4A962'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-2 text-[8px]">
          <div className="flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B1538]" />
            <span className="text-gray-500">cultural operations</span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4A962]" />
            <span className="text-gray-500">fertilisation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
