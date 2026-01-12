import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <OperacoesLayout title="A T I V I D A D E S">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Horas Trabalhadas por Tipo de Atividade */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas por Tipo de Atividade</h3>
            <div className="h-48">
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

          {/* Horas Trabalhadas por Local */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-[#8B1538] font-semibold text-sm mb-3">Horas Trabalhadas por Local</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horasPorLocal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="local" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString('pt-PT')}`, 'Horas']} />
                  <Bar dataKey="horas" fill="#8B1538" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => v.toLocaleString('pt-PT') }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabela de Atividades */}
        <div className="bg-white rounded-lg border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Atividade</TableHead>
                <TableHead className="text-xs text-right">Março</TableHead>
                <TableHead className="text-xs text-right font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atividadesDetalhe.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs">{item.atividade}</TableCell>
                  <TableCell className="text-xs text-right">{item.marco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                  <TableCell className="text-xs text-right font-bold">{item.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="text-xs font-bold">Total</TableCell>
                <TableCell className="text-xs text-right font-bold">{totalMarco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
                <TableCell className="text-xs text-right font-bold">{totalMarco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default GestaoAtividadesPage;
