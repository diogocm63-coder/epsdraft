import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      {/* Horas Trabalhadas */}
      <div className="bg-white rounded-lg border p-3">
        <h3 className="text-[#8B1538] font-bold text-sm tracking-wide text-center mb-2">
          HORAS TRABALHADAS
        </h3>
        <div className="text-2xl font-bold text-center mb-2">
          {horasData.total.toLocaleString('pt-PT')}
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538]">HORAS ÚTEIS</span>
            <span className="font-bold">{horasData.horasUteis.toLocaleString('pt-PT')}</span>
            <span className="bg-[#8B1538] text-white px-1 rounded text-[10px]">{horasData.percentUteis}%</span>
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538]">HORAS DE PAUSA</span>
            <span className="font-bold">{horasData.horasPausa}</span>
            <span className="bg-gray-200 text-gray-700 px-1 rounded text-[10px]">{horasData.percentPausa}%</span>
          </div>
        </div>
      </div>

      {/* Tipo de Atividade - Donut */}
      <div className="bg-white rounded-lg border p-3">
        <h3 className="text-gray-400 text-xs text-center mb-1">TIPO DE ATIVIDADE</h3>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tipoAtividade}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={35}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {tipoAtividade.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-3 text-[9px] mt-1">
          {tipoAtividade.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custos */}
      <div className="bg-white rounded-lg border p-3">
        <h3 className="text-[#8B1538] font-bold text-sm tracking-wide text-center mb-2">
          CUSTOS
        </h3>
        <div className="text-2xl font-bold text-center mb-2">
          {custosData.total.toLocaleString('pt-PT')} €
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538]">PESSOAL</span>
            <span className="font-bold">{(custosData.pessoal / 1000).toFixed(2)} K€</span>
            <span className="bg-[#8B1538] text-white px-1 rounded text-[10px]">{custosData.percentPessoal}%</span>
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <div className="flex items-center gap-1">
            <span className="text-[#8B1538]">PRODUTOS</span>
            <span className="font-bold">{(custosData.produtos / 1000).toFixed(2)} K€</span>
            <span className="bg-gray-200 text-gray-700 px-1 rounded text-[10px]">{custosData.percentProdutos}%</span>
          </div>
        </div>
      </div>

      {/* Tipo de Atividade - Stacked Bar */}
      <div className="bg-white rounded-lg border p-3">
        <h3 className="text-gray-400 text-xs text-center mb-1">TIPO DE ATIVIDADE</h3>
        <div className="flex items-center justify-center h-16 gap-1">
          <div className="flex flex-col items-center">
            <div className="flex">
              <div className="w-8 h-12 bg-[#8B1538] flex items-end justify-center text-white text-[8px] pb-1">2 K€</div>
              <div className="w-6 h-8 bg-[#C4A962] flex items-end justify-center text-white text-[8px] pb-1 self-end">1 K€</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 text-[9px] mt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#8B1538]" />
            <span>cultural operations</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#C4A962]" />
            <span>fertilisation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
