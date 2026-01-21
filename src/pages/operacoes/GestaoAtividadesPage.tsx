import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { OperacoesSummary } from '@/components/operacoes/OperacoesSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  gerarHorasPorAtividade, 
  gerarHorasPorLocal,
  gerarAtividadesDetalhe
} from '@/data/operacoesData';

const GestaoAtividadesPage = () => {
  const horasPorAtividade = gerarHorasPorAtividade();
  const horasPorLocal = gerarHorasPorLocal();
  const atividadesDetalhe = gerarAtividadesDetalhe();

  const totalMarco = atividadesDetalhe.reduce((acc, curr) => acc + curr.marco, 0);

  return (
    <OperacoesLayout title="Gestão de Atividades">
      <div className="flex flex-col h-full gap-2">
        <OperacoesSummary showDashboardLabel={false} />
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">A T I V I D A D E S</h2>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Horas Trabalhadas por Tipo de Atividade */}
            <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
              <h3 className="text-eps-primary font-semibold text-xs mb-2">Horas Trabalhadas por Tipo de Atividade</h3>
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

            {/* Horas Trabalhadas por Local */}
            <div className="bg-white border border-gray-200 p-3 flex flex-col min-h-0">
              <h3 className="text-eps-primary font-semibold text-xs mb-2">Horas Trabalhadas por Local</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={horasPorLocal} margin={{ top: 25, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="local" tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                    <Bar dataKey="horas" fill="#8B1538" barSize={50} radius={[2, 2, 0, 0]}>
                      <LabelList dataKey="horas" position="top" fontSize={9} formatter={(v: number) => v.toLocaleString('pt-PT')} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de Atividades */}
          <div className="bg-white border border-gray-200 p-3 flex-shrink-0 max-h-[35%] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-[10px] py-1">Atividade</TableHead>
                  <TableHead className="text-[10px] py-1 text-right">Março</TableHead>
                  <TableHead className="text-[10px] py-1 text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atividadesDetalhe.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-[10px] py-0.5">{item.atividade}</TableCell>
                    <TableCell className="text-[10px] py-0.5 text-right">{item.marco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                    <TableCell className="text-[10px] py-0.5 text-right font-bold">{item.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="text-[10px] py-1 font-bold">Total</TableCell>
                  <TableCell className="text-[10px] py-1 text-right font-bold">{totalMarco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                  <TableCell className="text-[10px] py-1 text-right font-bold">{totalMarco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default GestaoAtividadesPage;
