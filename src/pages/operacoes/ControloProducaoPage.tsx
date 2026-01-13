import { OperacoesLayout } from '@/components/operacoes/OperacoesLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dados dummy para Controlo da Produção
const producaoData = [
  {
    talhao: "Talhão 1",
    produto: "Vinho",
    variedade: "Castelão",
    areaHa: 12.5,
    producaoEsperadaKg: 87500,
    producaoEsperadaKgHa: 7000,
    custoTotal: 45000,
    custoAtual: 38000,
  },
  {
    talhao: "Talhão 2",
    produto: "Vinho",
    variedade: "Fernão Pires",
    areaHa: 8.3,
    producaoEsperadaKg: 58100,
    producaoEsperadaKgHa: 7000,
    custoTotal: 32000,
    custoAtual: 28500,
  },
  {
    talhao: "Talhão 3",
    produto: "Vinho",
    variedade: "Touriga Nacional",
    areaHa: 15.2,
    producaoEsperadaKg: 91200,
    producaoEsperadaKgHa: 6000,
    custoTotal: 58000,
    custoAtual: 52000,
  },
  {
    talhao: "Talhão 4",
    produto: "Vinho",
    variedade: "Arinto",
    areaHa: 6.8,
    producaoEsperadaKg: 47600,
    producaoEsperadaKgHa: 7000,
    custoTotal: 28000,
    custoAtual: 24000,
  },
  {
    talhao: "Talhão 5",
    produto: "Pera",
    variedade: "Rocha",
    areaHa: 10.0,
    producaoEsperadaKg: 250000,
    producaoEsperadaKgHa: 25000,
    custoTotal: 65000,
    custoAtual: 58000,
  },
  {
    talhao: "Talhão 6",
    produto: "Pera",
    variedade: "Rocha",
    areaHa: 7.5,
    producaoEsperadaKg: 187500,
    producaoEsperadaKgHa: 25000,
    custoTotal: 48000,
    custoAtual: 42000,
  },
  {
    talhao: "Talhão 7",
    produto: "Vinho",
    variedade: "Trincadeira",
    areaHa: 9.4,
    producaoEsperadaKg: 56400,
    producaoEsperadaKgHa: 6000,
    custoTotal: 38000,
    custoAtual: 35000,
  },
  {
    talhao: "Talhão 8",
    produto: "Pera",
    variedade: "Passe Crassane",
    areaHa: 5.2,
    producaoEsperadaKg: 114400,
    producaoEsperadaKgHa: 22000,
    custoTotal: 32000,
    custoAtual: 28000,
  },
];

// Calcular métricas derivadas
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
    custoHaAtual,
  };
};

const dadosComMetricas = producaoData.map(calcularMetricas);

// Totais
const totais = {
  areaTotal: producaoData.reduce((sum, item) => sum + item.areaHa, 0),
  producaoTotal: producaoData.reduce((sum, item) => sum + item.producaoEsperadaKg, 0),
  custoTotalPrevisto: producaoData.reduce((sum, item) => sum + item.custoTotal, 0),
  custoTotalAtual: producaoData.reduce((sum, item) => sum + item.custoAtual, 0),
};

const ControloProducaoPage = () => {
  return (
    <OperacoesLayout title="CONTROLO DA PRODUÇÃO">
      <div className="h-full flex flex-col gap-3 overflow-hidden">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          <Card className="bg-white">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs text-muted-foreground">Área Total</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="text-xl font-bold text-[#8B1538]">{totais.areaTotal.toFixed(1)} ha</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs text-muted-foreground">Produção Esperada</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="text-xl font-bold text-[#8B1538]">{(totais.producaoTotal / 1000).toFixed(0)} ton</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs text-muted-foreground">Custo Previsto</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="text-xl font-bold text-[#8B1538]">{(totais.custoTotalPrevisto / 1000).toFixed(0)}k €</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs text-muted-foreground">Custo Atual</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="text-xl font-bold text-[#8B1538]">{(totais.custoTotalAtual / 1000).toFixed(0)}k €</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Principal */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="py-2 px-3 flex-shrink-0">
            <CardTitle className="text-sm">Produção por Talhão</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto px-3 pb-3">
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
                {dadosComMetricas.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-medium">{item.talhao}</TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant="outline" 
                        className={item.produto === "Vinho" ? "bg-[#722F37]/10 text-[#722F37] border-[#722F37]/30" : "bg-[#8DB600]/10 text-[#5a7a00] border-[#8DB600]/30"}
                      >
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </OperacoesLayout>
  );
};

export default ControloProducaoPage;
