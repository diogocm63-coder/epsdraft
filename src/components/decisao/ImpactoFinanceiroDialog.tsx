import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, ArrowRight } from 'lucide-react';
import { wineProducts, wineCategorias } from '@/data/wineData';

// Phase durations by category (in days)
const PHASE_CONFIG: Record<string, {
  label: string;
  colheita: number;       // Harvest/grape reception
  pagamentoUvas: number;  // Days to pay grapes (from harvest)
  vinificacao: number;    // Vinification
  estagio: number;        // Aging
  engarrafamento: number; // Bottling
  vendaOtima: number;     // Optimal sale window (365 = 1 year)
  prazoRecebimento: number; // Invoice collection days
}> = {
  'Mesa': {
    label: 'Mesa', colheita: 15, pagamentoUvas: 30,
    vinificacao: 30, estagio: 60, engarrafamento: 15,
    vendaOtima: 365, prazoRecebimento: 60,
  },
  'Regional': {
    label: 'Regional', colheita: 15, pagamentoUvas: 30,
    vinificacao: 45, estagio: 180, engarrafamento: 15,
    vendaOtima: 365, prazoRecebimento: 60,
  },
  'Reserva': {
    label: 'Reserva', colheita: 15, pagamentoUvas: 30,
    vinificacao: 60, estagio: 365, engarrafamento: 15,
    vendaOtima: 365, prazoRecebimento: 90,
  },
  'Premium': {
    label: 'Premium', colheita: 15, pagamentoUvas: 30,
    vinificacao: 90, estagio: 730, engarrafamento: 15,
    vendaOtima: 365, prazoRecebimento: 90,
  },
};

// Wine can be purchased up to 1 month (30 days) before bottling
const COMPRA_VINHO_ANTES_ENGARRAF = 30;

interface ProductFinancialRow {
  produto: string;
  regiao: string;
  categoria: string;
  tipo: string;
  colheita: number;
  pagamentoUvas: number;
  vinificacao: number;
  estagio: number;
  compraVinhoPossivel: number; // day when wine purchase is possible (before bottling)
  engarrafamento: number;
  vendaOtima: number;
  prazoRecebimento: number;
  totalCiclo: number;
  diasFinanciamento: number; // days between grape payment and invoice receipt
}

function buildFinancialData(): ProductFinancialRow[] {
  return wineProducts.map(p => {
    const config = PHASE_CONFIG[p.categoria] || PHASE_CONFIG['Regional'];
    
    // Timeline accumulation (days from harvest start)
    const colheitaEnd = config.colheita;
    const pagamentoUvasDay = config.pagamentoUvas; // payment happens X days after harvest
    const vinificacaoEnd = colheitaEnd + config.vinificacao;
    const estagioEnd = vinificacaoEnd + config.estagio;
    const compraVinhoPossivel = estagioEnd + config.engarrafamento - COMPRA_VINHO_ANTES_ENGARRAF;
    const engarrafamentoEnd = estagioEnd + config.engarrafamento;
    const vendaOtimaEnd = engarrafamentoEnd + config.vendaOtima;
    const recebimentoEnd = vendaOtimaEnd + config.prazoRecebimento;
    
    // Financial gap: from grape payment to invoice receipt
    const diasFinanciamento = recebimentoEnd - pagamentoUvasDay;

    return {
      produto: p.produto,
      regiao: p.regiao,
      categoria: p.categoria,
      tipo: p.tipo,
      colheita: config.colheita,
      pagamentoUvas: config.pagamentoUvas,
      vinificacao: config.vinificacao,
      estagio: config.estagio,
      compraVinhoPossivel: Math.max(0, COMPRA_VINHO_ANTES_ENGARRAF),
      engarrafamento: config.engarrafamento,
      vendaOtima: config.vendaOtima,
      prazoRecebimento: config.prazoRecebimento,
      totalCiclo: recebimentoEnd,
      diasFinanciamento,
    };
  });
}

const PHASES = [
  { key: 'colheita', label: 'Colheita', color: 'bg-green-600' },
  { key: 'pagamentoUvas', label: 'Pgto Uvas', color: 'bg-red-500' },
  { key: 'vinificacao', label: 'Vinificação', color: 'bg-purple-500' },
  { key: 'estagio', label: 'Estágio', color: 'bg-amber-600' },
  { key: 'compraVinhoPossivel', label: 'Compra Vinho', color: 'bg-blue-400' },
  { key: 'engarrafamento', label: 'Engarraf.', color: 'bg-sky-600' },
  { key: 'vendaOtima', label: 'Venda Ótima', color: 'bg-emerald-500' },
  { key: 'prazoRecebimento', label: 'Recebimento', color: 'bg-orange-500' },
] as const;

export function ImpactoFinanceiroDialog() {
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  const allData = useMemo(() => buildFinancialData(), []);

  const data = useMemo(() => {
    if (filterCategoria === 'Todas') return allData;
    return allData.filter(r => r.categoria === filterCategoria);
  }, [allData, filterCategoria]);

  const maxCiclo = useMemo(() => Math.max(...allData.map(r => r.totalCiclo)), [allData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <DollarSign className="h-3.5 w-3.5" />
          Impacto Financeiro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-primary" />
            Impacto Financeiro — Ciclo de Caixa por Produto
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Dias entre o pagamento das uvas e o recebimento das faturas. Venda ótima = 1 ano. Compra de vinho possível até 30 dias antes do engarrafamento.
          </p>
        </DialogHeader>

        <div className="flex items-center gap-3 mt-2">
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas Categorias</SelectItem>
              {wineCategorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Legend */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {PHASES.map(p => (
              <div key={p.key} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm ${p.color}`} />
                <span className="text-[9px] text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[60vh] mt-2">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-muted/60">
                <th className="border border-border px-2 py-1.5 text-left font-semibold min-w-[200px] sticky left-0 bg-muted/60 z-10">Produto</th>
                <th className="border border-border px-2 py-1 text-center font-medium min-w-[50px]">Cat.</th>
                {PHASES.map(p => (
                  <th key={p.key} className="border border-border px-1.5 py-1 text-center font-medium min-w-[60px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-2 h-2 rounded-sm ${p.color}`} />
                      <span className="text-[9px]">{p.label}</span>
                    </div>
                  </th>
                ))}
                <th className="border border-border px-2 py-1 text-center font-semibold min-w-[70px] bg-primary/10">
                  <div className="flex flex-col items-center">
                    <Clock className="h-3 w-3 mb-0.5" />
                    <span className="text-[9px]">Ciclo Total</span>
                  </div>
                </th>
                <th className="border border-border px-2 py-1 text-center font-semibold min-w-[80px] bg-destructive/10 text-destructive">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px]">Dias</span>
                    <span className="text-[9px]">Financiamento</span>
                  </div>
                </th>
                <th className="border border-border px-2 py-1 text-left font-medium min-w-[180px]">
                  <span className="text-[9px]">Timeline Visual</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const bgClass = idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';
                
                // Timeline bar segments
                const segments = [
                  { days: row.colheita, color: 'bg-green-600' },
                  { days: row.vinificacao, color: 'bg-purple-500' },
                  { days: row.estagio, color: 'bg-amber-600' },
                  { days: row.engarrafamento, color: 'bg-sky-600' },
                  { days: row.vendaOtima, color: 'bg-emerald-500' },
                  { days: row.prazoRecebimento, color: 'bg-orange-500' },
                ];

                return (
                  <tr key={row.produto} className={`${bgClass} hover:bg-accent/30 transition-colors`}>
                    <td className={`border border-border px-2 py-1 font-medium sticky left-0 z-10 ${bgClass}`}>
                      {row.produto}
                    </td>
                    <td className="border border-border px-1 py-1 text-center">
                      <Badge variant="outline" className="text-[8px] px-1 py-0">
                        {row.categoria}
                      </Badge>
                    </td>
                    {PHASES.map(p => (
                      <td key={p.key} className="border border-border px-1 py-1 text-center tabular-nums">
                        {(row as any)[p.key]}d
                      </td>
                    ))}
                    <td className="border border-border px-2 py-1 text-center font-semibold bg-primary/5 tabular-nums">
                      {row.totalCiclo}d
                    </td>
                    <td className={`border border-border px-2 py-1 text-center font-bold tabular-nums ${row.diasFinanciamento > 700 ? 'text-destructive bg-destructive/5' : row.diasFinanciamento > 500 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      {row.diasFinanciamento}d
                    </td>
                    <td className="border border-border px-1 py-1">
                      <div className="flex h-4 rounded overflow-hidden" style={{ width: '100%' }}>
                        {segments.map((seg, i) => (
                          <div
                            key={i}
                            className={`${seg.color} opacity-80`}
                            style={{ width: `${(seg.days / maxCiclo) * 100}%` }}
                            title={`${seg.days} dias`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary by category */}
          <div className="mt-4 p-3 bg-muted/40 rounded-lg border">
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" /> Resumo por Categoria
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {wineCategorias.map(cat => {
                const config = PHASE_CONFIG[cat];
                if (!config) return null;
                const rows = allData.filter(r => r.categoria === cat);
                const avgFinanciamento = rows.length > 0
                  ? Math.round(rows.reduce((s, r) => s + r.diasFinanciamento, 0) / rows.length)
                  : 0;
                const totalCiclo = rows.length > 0 ? rows[0].totalCiclo : 0;
                const anos = (totalCiclo / 365).toFixed(1);

                return (
                  <div key={cat} className="bg-card rounded-md p-2.5 border">
                    <div className="text-[10px] font-semibold text-muted-foreground">{cat}</div>
                    <div className="text-lg font-bold mt-1">{avgFinanciamento}d</div>
                    <div className="text-[9px] text-muted-foreground">financiamento médio</div>
                    <div className="text-[10px] mt-1">
                      Ciclo: <span className="font-semibold">{totalCiclo}d</span> ({anos} anos)
                    </div>
                    <div className="text-[10px]">
                      Estágio: <span className="font-semibold">{config.estagio}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
