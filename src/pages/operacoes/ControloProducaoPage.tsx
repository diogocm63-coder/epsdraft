import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import { OperacoesSummary } from '@/components/operacoes/OperacoesSummary';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dados dummy para Controlo da Produção
const producaoData = [{
  talhao: "Talhão 1",
  produto: "Vinho",
  variedade: "Castelão",
  areaHa: 12.5,
  producaoEsperadaKg: 87500,
  producaoEsperadaKgHa: 7000,
  custoTotal: 45000,
  custoAtual: 38000
}, {
  talhao: "Talhão 2",
  produto: "Vinho",
  variedade: "Fernão Pires",
  areaHa: 8.3,
  producaoEsperadaKg: 58100,
  producaoEsperadaKgHa: 7000,
  custoTotal: 32000,
  custoAtual: 28500
}, {
  talhao: "Talhão 3",
  produto: "Vinho",
  variedade: "Touriga Nacional",
  areaHa: 15.2,
  producaoEsperadaKg: 91200,
  producaoEsperadaKgHa: 6000,
  custoTotal: 58000,
  custoAtual: 52000
}, {
  talhao: "Talhão 4",
  produto: "Vinho",
  variedade: "Arinto",
  areaHa: 6.8,
  producaoEsperadaKg: 47600,
  producaoEsperadaKgHa: 7000,
  custoTotal: 28000,
  custoAtual: 24000
}, {
  talhao: "Talhão 5",
  produto: "Pera",
  variedade: "Rocha",
  areaHa: 10.0,
  producaoEsperadaKg: 250000,
  producaoEsperadaKgHa: 25000,
  custoTotal: 65000,
  custoAtual: 58000
}, {
  talhao: "Talhão 6",
  produto: "Pera",
  variedade: "Rocha",
  areaHa: 7.5,
  producaoEsperadaKg: 187500,
  producaoEsperadaKgHa: 25000,
  custoTotal: 48000,
  custoAtual: 42000
}, {
  talhao: "Talhão 7",
  produto: "Vinho",
  variedade: "Trincadeira",
  areaHa: 9.4,
  producaoEsperadaKg: 56400,
  producaoEsperadaKgHa: 6000,
  custoTotal: 38000,
  custoAtual: 35000
}, {
  talhao: "Talhão 8",
  produto: "Pera",
  variedade: "Passe Crassane",
  areaHa: 5.2,
  producaoEsperadaKg: 114400,
  producaoEsperadaKgHa: 22000,
  custoTotal: 32000,
  custoAtual: 28000
}];
const calcularMetricas = (item: typeof producaoData[0]) => {
  const custoKgPrevisto = item.custoTotal / item.producaoEsperadaKg;
  const custoKgAtual = item.custoAtual / item.producaoEsperadaKg;
  const custoHaPrevisto = item.custoTotal / item.areaHa;
  const custoHaAtual = item.custoAtual / item.areaHa;
  return {
    ...item,
    custoKgPrevisto,
    custoKgAtual,
    custoHaPrevisto,
    custoHaAtual
  };
};
const dadosComMetricas = producaoData.map(calcularMetricas);
const ControloProducaoPage = () => {
  return <OperacoesLayout title="Controlo da Produção">
      <div className="flex flex-col h-full gap-2">
        <OperacoesSummary showDashboardLabel={false} />
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <h2 className="text-eps-primary font-bold text-sm tracking-[0.3em]">CONTROLO DA PRODUÇÃO</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-400 text-[10px]">Área (ha)</span>
              <div className="font-bold text-sm">25,7</div>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px]">% Execução</span>
              <div className="font-bold text-sm">2%</div>
            </div>
          </div>
        </div>

        {/* Tabela Principal */}
        <div className="bg-white border border-gray-200 flex-1 overflow-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Talhão</TableHead>
                <TableHead className="text-xs font-semibold">Produto</TableHead>
                <TableHead className="text-xs font-semibold">Variedade</TableHead>
                <TableHead className="text-xs font-semibold text-right">Área (ha)</TableHead>
                <TableHead className="text-xs font-semibold text-right">Prod. Esp. (Kg)</TableHead>
                <TableHead className="text-xs font-semibold text-right">Prod. Esp. (Kg/ha)</TableHead>
                <TableHead className="text-xs font-semibold text-right">Custo/Kg Prev.</TableHead>
                <TableHead className="text-xs font-semibold text-right">Custo/Kg Atual</TableHead>
                <TableHead className="text-xs font-semibold text-right">Custo/ha Prev.</TableHead>
                <TableHead className="text-xs font-semibold text-right">Custo/ha Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosComMetricas.map((item, index) => <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-medium">{item.talhao}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="outline" className={item.produto === "Vinho" ? "bg-eps-primary/10 text-eps-primary border-eps-primary/30" : "bg-eps-gold/10 text-eps-gold border-eps-gold/30"}>
                      {item.produto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{item.variedade}</TableCell>
                  <TableCell className="text-xs text-right">{item.areaHa.toFixed(1)}</TableCell>
                  <TableCell className="text-xs text-right">{item.producaoEsperadaKg.toLocaleString('pt-PT')}</TableCell>
                  <TableCell className="text-xs text-right">{item.producaoEsperadaKgHa.toLocaleString('pt-PT')}</TableCell>
                  <TableCell className="text-xs text-right">{item.custoKgPrevisto.toFixed(2)} €</TableCell>
                  <TableCell className="text-xs text-right">
                    <span className={item.custoKgAtual > item.custoKgPrevisto ? "text-red-600" : "text-green-600"}>
                      {item.custoKgAtual.toFixed(2)} €
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right">{item.custoHaPrevisto.toFixed(0)} €</TableCell>
                  <TableCell className="text-xs text-right">
                    <span className={item.custoHaAtual > item.custoHaPrevisto ? "text-red-600" : "text-green-600"}>
                      {item.custoHaAtual.toFixed(0)} €
                    </span>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </div>
    </OperacoesLayout>;
};
export default ControloProducaoPage;