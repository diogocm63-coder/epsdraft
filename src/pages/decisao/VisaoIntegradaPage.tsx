import { Eye } from 'lucide-react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Types
interface StockMasterRow {
  regiao: string;
  submarca: string;
  stockAtualSAP: number;
  stockDtAntes: number;
  tmsfMarcas: number;
  stock: number;
  prevUvas: number;
  yoy2024: number;
  yoy2025: number;
  budget2026: number;
  dtUvas: number;
  lx: number;
  alen: number;
  bair: number;
  beir: number;
  douro: number;
  setubal: number;
  mosc: number;
  totalVinif: number;
  transfVinhos2024: number;
  necIdeCompra2025: number;
  transfVinhos2025: number;
  retifGrau: number;
  totalCompras: number;
  nec2024: number;
  stockNova: number;
  excessoStock: number;
  inicioVenda: string;
  fimVenda: string;
  isTotal?: boolean;
}

const regioes = ['AGD', 'Alent', 'Bair', 'Bair-Esp', 'Dão', 'Douro', 'LX', 'Setubal', 'Verde'];

const generateData = (): StockMasterRow[] => {
  const rows: StockMasterRow[] = [];
  
  const products: Record<string, string[]> = {
    'AGD': ['Agte Alianca Velha', 'Agte Alianca XO 10', 'Agte Alianca XO 20', 'Agte Alianca XO 40', 'Agte Alianca XO 50', 'Agte Antiqua', 'Agte Antiquissima'],
    'Alent': ['T Terrugem T', 'Alabastro T', 'Monte Das Anforas T', 'Alabastro Reserva T', 'Dom Martinho T', 'Quinta da Terrugem T', 'Quinta do Carmo T', 'Quinta do Carmo Res T', 'Alabastro B', 'Dom Martinho B', 'Quinta do Carmo B', 'Quinta do Carmo Res B', 'Quinta do Carmo R', 'Reg Alentejano Branco', 'Reg Alentejano Tinto', 'Reg Alentejano Rosé', 'Mosto Amuado Rosé'],
    'Bair': ['Alianca Bairrada Reserva T', 'Bacalhoa Var T Baga', 'Bacalhoa Var B Bical', 'Alianca Bairrada Reserva B', 'Alianca Esp Bairrada Baga B'],
    'Douro': ['Foral de Meda T', 'Foral de Meda Reserva T', 'Quinta da Gaivosa T', 'Quinta da Gaivosa Res T', 'Foral de Meda B'],
    'Dão': ['Aliança Dão Reserva T', 'Murganheira Reserva T', 'Aliança Dão B'],
    'Verde': ['Casal Mendes B', 'Casal Mendes Rosé', 'Gazela B'],
  };

  Object.entries(products).forEach(([regiao, prods]) => {
    prods.forEach(prod => {
      const base = Math.floor(Math.random() * 50000) + 500;
      const prev = Math.floor(base * (0.8 + Math.random() * 0.4));
      const yoy24 = Math.floor(prev * (0.9 + Math.random() * 0.2));
      const yoy25 = Math.floor(prev * (0.85 + Math.random() * 0.3));
      const budget = Math.floor(prev * (0.9 + Math.random() * 0.2));
      const vinifTotal = Math.floor(Math.random() * 30000);
      const compraTotal = Math.floor(Math.random() * 5000);
      
      rows.push({
        regiao,
        submarca: prod,
        stockAtualSAP: base,
        stockDtAntes: Math.floor(base * 0.95),
        tmsfMarcas: Math.random() > 0.7 ? Math.floor(Math.random() * 20000) * (Math.random() > 0.5 ? 1 : -1) : 0,
        stock: base,
        prevUvas: prev,
        yoy2024: yoy24,
        yoy2025: yoy25,
        budget2026: budget,
        dtUvas: Math.random() > 0.6 ? Math.floor(Math.random() * 15000) : 0,
        lx: 0,
        alen: regiao === 'Alent' ? Math.floor(Math.random() * 10000) : 0,
        bair: regiao === 'Bair' ? Math.floor(Math.random() * 5000) : 0,
        beir: 0,
        douro: regiao === 'Douro' ? Math.floor(Math.random() * 8000) : 0,
        setubal: 0,
        mosc: 0,
        totalVinif: vinifTotal,
        transfVinhos2024: Math.random() > 0.8 ? Math.floor(Math.random() * 40000) * -1 : 0,
        necIdeCompra2025: 0,
        transfVinhos2025: Math.random() > 0.8 ? Math.floor(Math.random() * 10000) * -1 : 0,
        retifGrau: 0,
        totalCompras: compraTotal,
        nec2024: Math.floor(base * 0.6 + Math.random() * base * 0.4),
        stockNova: Math.floor(Math.random() * 300000),
        excessoStock: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : 0,
        inicioVenda: `${15 + Math.floor(Math.random() * 15)}-${['03', '10', '12'][Math.floor(Math.random() * 3)]}-202${5 + Math.floor(Math.random() * 2)}`,
        fimVenda: `${15 + Math.floor(Math.random() * 15)}-${['03', '10', '12'][Math.floor(Math.random() * 3)]}-202${5 + Math.floor(Math.random() * 2)}`,
      });
    });

    // Total row per region
    const regionRows = rows.filter(r => r.regiao === regiao && !r.isTotal);
    const sumRow: StockMasterRow = {
      regiao: regiao,
      submarca: `${regiao === 'AGD' ? 'Aguardentes' : regiao === 'Alent' ? 'Alentejo' : regiao === 'Bair' ? 'Bairrada' : regiao === 'Douro' ? 'Douro' : regiao === 'Dão' ? 'Dão' : regiao === 'Verde' ? 'Vinhos Verdes' : regiao} Total`,
      stockAtualSAP: regionRows.reduce((s, r) => s + r.stockAtualSAP, 0),
      stockDtAntes: regionRows.reduce((s, r) => s + r.stockDtAntes, 0),
      tmsfMarcas: regionRows.reduce((s, r) => s + r.tmsfMarcas, 0),
      stock: regionRows.reduce((s, r) => s + r.stock, 0),
      prevUvas: regionRows.reduce((s, r) => s + r.prevUvas, 0),
      yoy2024: regionRows.reduce((s, r) => s + r.yoy2024, 0),
      yoy2025: regionRows.reduce((s, r) => s + r.yoy2025, 0),
      budget2026: regionRows.reduce((s, r) => s + r.budget2026, 0),
      dtUvas: regionRows.reduce((s, r) => s + r.dtUvas, 0),
      lx: regionRows.reduce((s, r) => s + r.lx, 0),
      alen: regionRows.reduce((s, r) => s + r.alen, 0),
      bair: regionRows.reduce((s, r) => s + r.bair, 0),
      beir: regionRows.reduce((s, r) => s + r.beir, 0),
      douro: regionRows.reduce((s, r) => s + r.douro, 0),
      setubal: regionRows.reduce((s, r) => s + r.setubal, 0),
      mosc: regionRows.reduce((s, r) => s + r.mosc, 0),
      totalVinif: regionRows.reduce((s, r) => s + r.totalVinif, 0),
      transfVinhos2024: regionRows.reduce((s, r) => s + r.transfVinhos2024, 0),
      necIdeCompra2025: regionRows.reduce((s, r) => s + r.necIdeCompra2025, 0),
      transfVinhos2025: regionRows.reduce((s, r) => s + r.transfVinhos2025, 0),
      retifGrau: regionRows.reduce((s, r) => s + r.retifGrau, 0),
      totalCompras: regionRows.reduce((s, r) => s + r.totalCompras, 0),
      nec2024: regionRows.reduce((s, r) => s + r.nec2024, 0),
      stockNova: regionRows.reduce((s, r) => s + r.stockNova, 0),
      excessoStock: regionRows.reduce((s, r) => s + r.excessoStock, 0),
      inicioVenda: '',
      fimVenda: '',
      isTotal: true,
    };
    rows.push(sumRow);
  });

  return rows;
};

const allData = generateData();

const formatNum = (n: number) => {
  if (n === 0) return '';
  return n.toLocaleString('pt-PT');
};

export default function VisaoIntegradaPage() {
  const [filterRegiao, setFilterRegiao] = useState('Todas');
  const [filterAno, setFilterAno] = useState('2025');

  const filteredData = useMemo(() => {
    if (filterRegiao === 'Todas') return allData;
    return allData.filter(r => r.regiao === filterRegiao);
  }, [filterRegiao]);

  const activeFilters = [filterRegiao !== 'Todas', filterAno !== '2025'].filter(Boolean).length;

  const resetFilters = () => {
    setFilterRegiao('Todas');
    setFilterAno('2025');
  };

  const cellClass = (val: number, isNeg?: boolean) => {
    if (val < 0) return 'text-red-600 font-medium';
    return '';
  };

  return (
    <DecisaoLayout title="EPS Vinhos" icon={<Eye className="w-4 h-4" />}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Visão Integrada — Stock Master</h2>
          <div className="text-xs text-muted-foreground">Data: 30/06/2025</div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap bg-card p-3 rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros</span>
            {activeFilters > 0 && (
              <Badge variant="default" className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilters}
              </Badge>
            )}
          </div>

          <Select value={filterRegiao} onValueChange={setFilterRegiao}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Região" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as Regiões</SelectItem>
              {regioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterAno} onValueChange={setFilterAno}>
            <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue placeholder="Ano" /></SelectTrigger>
            <SelectContent>
              {['2024', '2025', '2026'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground h-8 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" /> Limpar
          </Button>
        </div>

        {/* Grid */}
        <div className="border rounded-lg overflow-hidden">
          <ScrollArea className="w-full" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse min-w-[2200px]">
                {/* Group Headers */}
                <thead>
                  <tr className="bg-muted/80">
                    <th colSpan={2} className="border border-border px-2 py-1.5 text-left font-semibold bg-muted"></th>
                    <th colSpan={3} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">
                      STOCK ATUAL - SAP
                    </th>
                    <th className="border border-border px-2 py-1.5 text-center font-semibold bg-muted"></th>
                    <th className="border border-border px-2 py-1.5 text-center font-bold text-red-700 bg-red-50">PREVISÃO</th>
                    <th colSpan={4} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">VENDAS</th>
                    <th colSpan={8} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">VINIFICAÇÃO</th>
                    <th colSpan={5} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">COMPRAS / TRANSF./VENDAS</th>
                    <th colSpan={2} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted"></th>
                    <th colSpan={3} className="border border-border px-2 py-1.5 text-center font-semibold bg-green-100 text-green-800"></th>
                  </tr>
                  <tr className="bg-muted/50 text-[10px]">
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-0 bg-muted/50 z-10 min-w-[60px]">Região</th>
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-[60px] bg-muted/50 z-10 min-w-[160px]">Submarca</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[80px]">STOCK Dt<br/>08/07/2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">Tmsf°<br/>Marcas</th>
                    <th className="border border-border px-2 py-1 text-right font-semibold min-w-[70px]">Stock</th>
                    <th className="border border-border px-2 py-1 text-right font-bold text-red-700 bg-red-50 min-w-[70px]">UVAS</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">YOY 2024</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">YOY 2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium bg-yellow-50 min-w-[75px]">Budget<br/>2026</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[65px]">DT.UVAS</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">LX</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">Alen</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">Bair</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">Beir</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">Douro</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[55px]">Setubal</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[45px]">Mosc</th>
                    <th className="border border-border px-2 py-1 text-right font-semibold min-w-[65px]">TOTAL</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[75px]">TRANSF°<br/>Vinhos 2024</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[80px]">NEC.IDE<br/>COMPRA 2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[75px]">TRANSF°<br/>Vinhos 2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[55px]">Retif.<br/>Grau</th>
                    <th className="border border-border px-2 py-1 text-right font-semibold min-w-[65px]">TOTAL</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">Nec 2024</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[80px]">Stock Nova</th>
                    <th className="border border-border px-2 py-1 text-right font-medium bg-green-50 min-w-[75px]">EXCESSO<br/>DE STOCK</th>
                    <th className="border border-border px-2 py-1 text-center font-medium bg-green-50 min-w-[85px]">INICIO<br/>VENDA</th>
                    <th className="border border-border px-2 py-1 text-center font-medium bg-green-50 min-w-[85px]">FIM VEND°</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => {
                    const isTotalRow = row.isTotal;
                    const bgClass = isTotalRow ? 'bg-green-100 font-bold' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';
                    
                    return (
                      <tr key={idx} className={`${bgClass} hover:bg-accent/30 transition-colors`}>
                        <td className={`border border-border px-2 py-1 font-medium sticky left-0 z-10 ${isTotalRow ? 'bg-green-100' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}>{row.regiao}</td>
                        <td className={`border border-border px-2 py-1 sticky left-[60px] z-10 ${isTotalRow ? 'bg-green-100 font-bold' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'} ${row.submarca.includes('Tinto') ? 'text-red-600 font-bold bg-red-50' : ''}`}>{row.submarca}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.stockAtualSAP)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${cellClass(row.tmsfMarcas)}`}>{formatNum(row.tmsfMarcas)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.stock)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.prevUvas)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.yoy2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.yoy2025)}</td>
                        <td className="border border-border px-2 py-1 text-right bg-yellow-50/50">{formatNum(row.budget2026)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.dtUvas)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.lx)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.alen)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.bair)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.beir)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.douro)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.setubal)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.mosc)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.totalVinif)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${cellClass(row.transfVinhos2024)}`}>{formatNum(row.transfVinhos2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.necIdeCompra2025)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${cellClass(row.transfVinhos2025)}`}>{formatNum(row.transfVinhos2025)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.retifGrau)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.totalCompras)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.nec2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.stockNova)}</td>
                        <td className={`border border-border px-2 py-1 text-right bg-green-50/50 ${row.excessoStock > 0 ? 'text-red-600 font-medium' : ''}`}>{formatNum(row.excessoStock)}</td>
                        <td className="border border-border px-2 py-1 text-center text-[10px] bg-green-50/50">{row.inicioVenda}</td>
                        <td className="border border-border px-2 py-1 text-center text-[10px] bg-green-50/50">{row.fimVenda}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </div>
      </div>
    </DecisaoLayout>
  );
}
