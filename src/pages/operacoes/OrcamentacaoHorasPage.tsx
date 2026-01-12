import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Undo, Redo } from 'lucide-react';
import { gerarOrcamentoHoras, areaHa } from '@/data/operacoesData';
import { meses } from '@/data/mockData';

const OrcamentacaoHorasPage = () => {
  const orcamentoData = gerarOrcamentoHoras();
  const mesesAbrev = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Summary data
  const custoRealAno = 0;
  const totalHorasAno = 0;
  const custoOrcamentado = [96, 120, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const totalOrcamentado = custoOrcamentado.reduce((a, b) => a + b, 0);

  return (
    <OperacoesLayout 
      title="O R Ç A M E N T O ( H O R A S )" 
      showAtividade 
      showAreaExecucao={false}
    >
      <div className="space-y-4 h-full overflow-auto">
        {/* Area Info */}
        <div className="flex justify-end">
          <div className="border rounded px-4 py-2 bg-white">
            <span className="text-gray-600 text-sm">Área (ha):</span>
            <span className="font-bold ml-2">{areaHa}</span>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs w-40"></TableHead>
                {mesesAbrev.map(mes => (
                  <TableHead key={mes} className="text-xs text-center px-2">{mes}</TableHead>
                ))}
                <TableHead className="text-xs text-center font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-xs">Custo Real Ano-1</TableCell>
                {mesesAbrev.map((_, i) => (
                  <TableCell key={i} className="text-xs text-center"></TableCell>
                ))}
                <TableCell className="text-xs text-center"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs">Total Horas Ano-1</TableCell>
                {mesesAbrev.map((_, i) => (
                  <TableCell key={i} className="text-xs text-center"></TableCell>
                ))}
                <TableCell className="text-xs text-center"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs">Custo Orçamentado</TableCell>
                {custoOrcamentado.map((val, i) => (
                  <TableCell key={i} className="text-xs text-center">{val > 0 ? `${val} €` : ''}</TableCell>
                ))}
                <TableCell className="text-xs text-center font-bold">{totalOrcamentado} €</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Activity Selection */}
        <div className="text-center py-2 bg-muted rounded-lg">
          <span className="text-sm">Selecione um espaço para orçamentar | </span>
          <span className="font-semibold">Atividade: Fert</span>
        </div>

        {/* Orçamento de Horas */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-2">Orçamento de Horas</h3>
          <div className="flex gap-2 mb-3">
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Save className="h-3 w-3 mr-1" /> Save Changes
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <RotateCcw className="h-3 w-3 mr-1" /> Reset Changes
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Undo className="h-3 w-3 mr-1" /> Undo
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Redo className="h-3 w-3 mr-1" /> Redo
            </Button>
          </div>
          <div className="overflow-x-auto max-h-48">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs w-8"></TableHead>
                  <TableHead className="text-xs w-40"></TableHead>
                  {mesesAbrev.map(mes => (
                    <TableHead key={mes} className="text-xs text-center px-1 min-w-[60px]">{mes}</TableHead>
                  ))}
                  <TableHead className="text-xs text-center font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/30">
                  <TableCell className="text-xs">☐</TableCell>
                  <TableCell className="text-xs"></TableCell>
                  {mesesAbrev.map((_, i) => (
                    <TableCell key={i} className="text-xs text-center font-bold">0</TableCell>
                  ))}
                  <TableCell className="text-xs text-center font-bold">0</TableCell>
                </TableRow>
                {orcamentoData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs"></TableCell>
                    <TableCell className="text-xs">{row.local}</TableCell>
                    {mesesAbrev.map((_, i) => (
                      <TableCell key={i} className="text-xs text-center"></TableCell>
                    ))}
                    <TableCell className="text-xs text-center font-bold">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Orçamento €/hora */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-[#8B1538] font-semibold text-sm mb-2">Orçamento €/hora</h3>
          <div className="flex gap-2 mb-3">
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Save className="h-3 w-3 mr-1" /> Save Changes
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <RotateCcw className="h-3 w-3 mr-1" /> Reset Changes
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Undo className="h-3 w-3 mr-1" /> Undo
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Redo className="h-3 w-3 mr-1" /> Redo
            </Button>
          </div>
          <div className="overflow-x-auto max-h-48">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs w-8"></TableHead>
                  <TableHead className="text-xs w-40"></TableHead>
                  {mesesAbrev.map(mes => (
                    <TableHead key={mes} className="text-xs text-center px-1 min-w-[60px]">{mes}</TableHead>
                  ))}
                  <TableHead className="text-xs text-center font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentoData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs">☐</TableCell>
                    <TableCell className="text-xs">{row.local}</TableCell>
                    {mesesAbrev.map((_, i) => (
                      <TableCell key={i} className="text-xs text-center"></TableCell>
                    ))}
                    <TableCell className="text-xs text-center font-bold"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </OperacoesLayout>
  );
};

export default OrcamentacaoHorasPage;
