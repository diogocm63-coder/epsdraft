import { OperacoesLayout } from "@/components/operacoes/OperacoesLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Undo, Redo } from "lucide-react";
import { gerarOrcamentoHoras, areaHa } from "@/data/operacoesData";
const OrcamentacaoProdutosPage = () => {
  const orcamentoData = gerarOrcamentoHoras();
  const mesesAbrev = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const custoOrcamentado = [50, 230, 170, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const custoRealAno1 = [45, 220, 160, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const totalOrcamentado = custoOrcamentado.reduce((a, b) => a + b, 0);
  const totalRealAno1 = custoRealAno1.reduce((a, b) => a + b, 0);
  const mesToProp = {
    Janeiro: "janeiro",
    Fevereiro: "fevereiro",
    Março: "marco",
    Abril: "abril",
    Maio: "maio",
    Junho: "junho",
    Julho: "julho",
    Agosto: "agosto",
    Setembro: "setembro",
    Outubro: "outubro",
    Novembro: "novembro",
    Dezembro: "dezembro",
  };
  const totalQuantidades = mesesAbrev.reduce((acc, mes) => {
    acc[mes] = orcamentoData.reduce((sum, row) => sum + row[mesToProp[mes]], 0);
    return acc;
  }, {});
  const grandTotalQuantidades = orcamentoData.reduce((sum, row) => sum + row.total, 0);
  const custoPorQtdData = orcamentoData
    .map((row) => ({
      local: row.local,
      janeiro: Math.floor(Math.random() * 20) + 5,
      fevereiro: Math.floor(Math.random() * 20) + 5,
      marco: Math.floor(Math.random() * 20) + 5,
      abril: Math.floor(Math.random() * 20) + 5,
      maio: Math.floor(Math.random() * 20) + 5,
      junho: Math.floor(Math.random() * 20) + 5,
      julho: Math.floor(Math.random() * 20) + 5,
      agosto: Math.floor(Math.random() * 20) + 5,
      setembro: Math.floor(Math.random() * 20) + 5,
      outubro: Math.floor(Math.random() * 20) + 5,
      novembro: Math.floor(Math.random() * 20) + 5,
      dezembro: Math.floor(Math.random() * 20) + 5,
      total: 0,
    }))
    .map((row) => {
      row.total = Object.keys(mesToProp).reduce((sum, mes) => sum + row[mesToProp[mes]], 0);
      return row;
    });
  const totalCustoPorQtd = mesesAbrev.reduce((acc, mes) => {
    acc[mes] = custoPorQtdData.reduce((sum, row) => sum + row[mesToProp[mes]], 0);
    return acc;
  }, {});
  const grandTotalCustoPorQtd = custoPorQtdData.reduce((sum, row) => sum + row.total, 0);
  return (
    <OperacoesLayout
      title="O R Ç A M E N T O ( P R O D U T O S )"
      showAtividade
      showTipoProduto
      showAreaExecucao={false}
    >
      <div className="flex flex-col gap-2 h-full overflow-hidden">
        {/* Area Info */}
        <div className="flex justify-end flex-shrink-0">
          <div className="border border-gray-300 rounded px-3 py-1 text-xs bg-white">
            <span className="text-gray-600">Área (ha):</span>
            <span className="font-bold ml-2">{areaHa}</span>
          </div>
        </div>
        {/* Summary Table */}
        <div className="bg-white border border-gray-200 overflow-hidden flex-shrink-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[9px] w-28 py-1"></TableHead>
                {mesesAbrev.map((mes) => (
                  <TableHead key={mes} className="text-[8px] text-center px-1 py-1">
                    {mes}
                  </TableHead>
                ))}
                <TableHead className="text-[9px] text-center font-bold py-1">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-[9px] py-0.5">Custo Real Ano-1</TableCell>
                {custoRealAno1.map((val, i) => (
                  <TableCell key={i} className="text-[9px] text-center py-0.5">
                    {val > 0 ? `${val.toFixed(2).replace(".", ",")} €` : ""}
                  </TableCell>
                ))}
                <TableCell className="text-[9px] text-center py-0.5">
                  {totalRealAno1.toFixed(2).replace(".", ",")} €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[9px] py-0.5">Custo Orçamentado</TableCell>
                {custoOrcamentado.map((val, i) => (
                  <TableCell key={i} className="text-[9px] text-center py-0.5">
                    {val > 0 ? `${val.toFixed(2).replace(".", ",")} €` : ""}
                  </TableCell>
                ))}
                <TableCell className="text-[9px] text-center font-bold py-0.5">
                  {totalOrcamentado.toFixed(2).replace(".", ",")} €
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {/* Activity Selection */}
        <div className="text-center py-1 bg-muted/50 rounded text-xs flex-shrink-0 border">
          <span>Selecione um espaço para orçamentar | </span>
          <span className="font-semibold">Atividade: Fert</span>
        </div>
        {/* Orçamento de Quantidades */}
        <div className="bg-white border border-gray-200 p-2 flex flex-col min-h-0 flex-1">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-1">Orçamento de Quantidades</h3>
          <div className="flex gap-1 mb-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Save className="h-2.5 w-2.5 mr-0.5" /> Guardar Alterações
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <RotateCcw className="h-2.5 w-2.5 mr-0.5" /> Repor Alterações
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Undo className="h-2.5 w-2.5 mr-0.5" /> Desfazer
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Redo className="h-2.5 w-2.5 mr-0.5" /> Refazer
            </Button>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-[8px] w-6 py-0.5"></TableHead>
                  <TableHead className="text-[8px] w-28 py-0.5"></TableHead>
                  {mesesAbrev.map((mes) => (
                    <TableHead key={mes} className="text-[8px] text-center px-0.5 py-0.5 min-w-[45px]">
                      {mes}
                    </TableHead>
                  ))}
                  <TableHead className="text-[8px] text-center font-bold py-0.5">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/20">
                  <TableCell className="text-[8px] py-0.5">☐</TableCell>
                  <TableCell className="text-[8px] py-0.5"></TableCell>
                  {mesesAbrev.map((mes, i) => (
                    <TableCell key={i} className="text-[8px] text-center font-bold py-0.5">
                      {totalQuantidades[mes]}
                    </TableCell>
                  ))}
                  <TableCell className="text-[8px] text-center font-bold py-0.5">{grandTotalQuantidades}</TableCell>
                </TableRow>
                {orcamentoData.slice(0, 5).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-[8px] py-0.5"></TableCell>
                    <TableCell className="text-[8px] py-0.5">{row.local}</TableCell>
                    {mesesAbrev.map((mes, i) => (
                      <TableCell key={i} className="text-[8px] text-center py-0.5">
                        {row[mesToProp[mes]]}
                      </TableCell>
                    ))}
                    <TableCell className="text-[8px] text-center font-bold py-0.5">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Orçamento de €/Qtd */}
        <div className="bg-white border border-gray-200 p-2 flex flex-col min-h-0 flex-1">
          <h3 className="text-[#8B1538] font-semibold text-xs mb-1">Orçamento de €/Qtd</h3>
          <div className="flex gap-1 mb-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Save className="h-2.5 w-2.5 mr-0.5" /> Guardar Alterações
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <RotateCcw className="h-2.5 w-2.5 mr-0.5" /> Repor Alterações
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Undo className="h-2.5 w-2.5 mr-0.5" /> Desfazer
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-5 px-2">
              <Redo className="h-2.5 w-2.5 mr-0.5" /> Refazer
            </Button>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-[8px] w-6 py-0.5"></TableHead>
                  <TableHead className="text-[8px] w-28 py-0.5"></TableHead>
                  {mesesAbrev.map((mes) => (
                    <TableHead key={mes} className="text-[8px] text-center px-0.5 py-0.5 min-w-[45px]">
                      {mes}
                    </TableHead>
                  ))}
                  <TableHead className="text-[8px] text-center font-bold py-0.5">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custoPorQtdData.slice(0, 5).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-[8px] py-0.5">☐</TableCell>
                    <TableCell className="text-[8px] py-0.5">{row.local}</TableCell>
                    {mesesAbrev.map((mes, i) => (
                      <TableCell key={i} className="text-[8px] text-center py-0.5">
                        {row[mesToProp[mes]]}
                      </TableCell>
                    ))}
                    <TableCell className="text-[8px] text-center font-bold py-0.5">{row.total}</TableCell>
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
export default OrcamentacaoProdutosPage;
