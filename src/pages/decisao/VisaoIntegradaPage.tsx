import { Eye } from 'lucide-react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { wineProducts, wineRegioes } from '@/data/wineData';

interface StockMasterRow {
  regiao: string;
  submarca: string;
  categoria: string;
  tipo: string;
  stockAtualERP: number;
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

// Seed-based pseudo-random for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateData = (): StockMasterRow[] => {
  const rows: StockMasterRow[] = [];
  
  wineProducts.forEach((prod, idx) => {
    const seed = idx * 7 + 13;
    const base = Math.floor(seededRandom(seed) * 45000) + 1000;
    const prev = Math.floor(base * (0.8 + seededRandom(seed + 1) * 0.4));
    const yoy24 = Math.floor(prev * (0.9 + seededRandom(seed + 2) * 0.2));
    const yoy25 = Math.floor(prev * (0.85 + seededRandom(seed + 3) * 0.3));
    const budget = Math.floor(prev * (0.9 + seededRandom(seed + 4) * 0.2));
    const vinifTotal = Math.floor(seededRandom(seed + 5) * 25000);
    const compraTotal = Math.floor(seededRandom(seed + 6) * 5000);
    const tmsf = seededRandom(seed + 7) > 0.7 ? Math.floor(seededRandom(seed + 8) * 20000) * (seededRandom(seed + 9) > 0.5 ? 1 : -1) : 0;
    
    rows.push({
      regiao: prod.regiao,
      submarca: prod.produto,
      categoria: prod.categoria,
      tipo: prod.tipo,
      stockAtualERP: base,
      stockDtAntes: Math.floor(base * 0.95),
      tmsfMarcas: tmsf,
      stock: base + tmsf,
      prevUvas: prev,
      yoy2024: yoy24,
      yoy2025: yoy25,
      budget2026: budget,
      dtUvas: seededRandom(seed + 10) > 0.6 ? Math.floor(seededRandom(seed + 11) * 15000) : 0,
      lx: prod.regiao === 'Lisboa' ? Math.floor(seededRandom(seed + 12) * 8000) : 0,
      alen: prod.regiao === 'Alentejo' ? Math.floor(seededRandom(seed + 13) * 10000) : 0,
      bair: 0,
      beir: 0,
      douro: prod.regiao === 'Douro' ? Math.floor(seededRandom(seed + 14) * 8000) : 0,
      setubal: 0,
      mosc: 0,
      totalVinif: vinifTotal,
      transfVinhos2024: seededRandom(seed + 15) > 0.8 ? Math.floor(seededRandom(seed + 16) * 40000) * -1 : 0,
      necIdeCompra2025: 0,
      transfVinhos2025: seededRandom(seed + 17) > 0.8 ? Math.floor(seededRandom(seed + 18) * 10000) * -1 : 0,
      retifGrau: 0,
      totalCompras: compraTotal,
      nec2024: Math.floor(base * 0.6 + seededRandom(seed + 19) * base * 0.4),
      stockNova: Math.floor(seededRandom(seed + 20) * 200000),
      excessoStock: seededRandom(seed + 21) > 0.7 ? Math.floor(seededRandom(seed + 22) * 5000) : 0,
      inicioVenda: `${15 + Math.floor(seededRandom(seed + 23) * 15)}-${['03', '10', '12'][Math.floor(seededRandom(seed + 24) * 3)]}-202${5 + Math.floor(seededRandom(seed + 25) * 2)}`,
      fimVenda: `${15 + Math.floor(seededRandom(seed + 26) * 15)}-${['03', '10', '12'][Math.floor(seededRandom(seed + 27) * 3)]}-202${5 + Math.floor(seededRandom(seed + 28) * 2)}`,
    });
  });

  // Generate totals per region
  const allRows = [...rows];
  wineRegioes.forEach(regiao => {
    const regionRows = rows.filter(r => r.regiao === regiao);
    if (regionRows.length === 0) return;
    
    const sumRow: StockMasterRow = {
      regiao,
      submarca: `${regiao} Total`,
      categoria: '',
      tipo: '',
      stockAtualERP: regionRows.reduce((s, r) => s + r.stockAtualERP, 0),
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
    allRows.push(sumRow);
  });

  // Sort: group by region, products first then total
  const sorted: StockMasterRow[] = [];
  wineRegioes.forEach(regiao => {
    const prods = allRows.filter(r => r.regiao === regiao && !r.isTotal);
    const total = allRows.find(r => r.regiao === regiao && r.isTotal);
    sorted.push(...prods);
    if (total) sorted.push(total);
  });

  return sorted;
};

const allData = generateData();

const formatNum = (n: number) => {
  if (n === 0) return '';
  return n.toLocaleString('pt-PT');
};

export default function VisaoIntegradaPage() {
  const [filterRegiao, setFilterRegiao] = useState('Todas');
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  const [filterTipo, setFilterTipo] = useState('Todos');

  const filteredData = useMemo(() => {
    return allData.filter(r => {
      if (filterRegiao !== 'Todas' && r.regiao !== filterRegiao) return false;
      if (r.isTotal) {
        // Show total only if its region's products pass filters
        if (filterCategoria !== 'Todas' || filterTipo !== 'Todos') {
          const hasProducts = allData.some(p => !p.isTotal && p.regiao === r.regiao &&
            (filterCategoria === 'Todas' || p.categoria === filterCategoria) &&
            (filterTipo === 'Todos' || p.tipo === filterTipo));
          return hasProducts;
        }
        return true;
      }
      if (filterCategoria !== 'Todas' && r.categoria !== filterCategoria) return false;
      if (filterTipo !== 'Todos' && r.tipo !== filterTipo) return false;
      return true;
    });
  }, [filterRegiao, filterCategoria, filterTipo]);

  const activeFilters = [filterRegiao !== 'Todas', filterCategoria !== 'Todas', filterTipo !== 'Todos'].filter(Boolean).length;

  const resetFilters = () => {
    setFilterRegiao('Todas');
    setFilterCategoria('Todas');
    setFilterTipo('Todos');
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
              {wineRegioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas Categorias</SelectItem>
              {['Regional', 'Reserva', 'Premium', 'Mesa'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos Tipos</SelectItem>
              {['Tinto', 'Branco', 'Rosé'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                <thead>
                  <tr className="bg-muted/80">
                    <th colSpan={2} className="border border-border px-2 py-1.5 text-left font-semibold bg-muted"></th>
                    <th colSpan={3} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">STOCK ATUAL - ERP</th>
                    <th className="border border-border px-2 py-1.5 text-center font-semibold bg-muted"></th>
                    <th className="border border-border px-2 py-1.5 text-center font-bold text-destructive bg-destructive/10">PREVISÃO</th>
                    <th colSpan={4} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">VENDAS</th>
                    <th colSpan={8} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">VINIFICAÇÃO</th>
                    <th colSpan={5} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted">COMPRAS / TRANSF./VENDAS</th>
                    <th colSpan={2} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted"></th>
                    <th colSpan={3} className="border border-border px-2 py-1.5 text-center font-semibold bg-accent/50"></th>
                  </tr>
                  <tr className="bg-muted/50 text-[10px]">
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-0 bg-muted/50 z-10 min-w-[80px]">Região</th>
                    <th className="border border-border px-2 py-1 text-left font-semibold sticky left-[80px] bg-muted/50 z-10 min-w-[200px]">Submarca</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[80px]">STOCK Dt<br/>08/07/2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">Tmsf°<br/>Marcas</th>
                    <th className="border border-border px-2 py-1 text-right font-semibold min-w-[70px]">Stock</th>
                    <th className="border border-border px-2 py-1 text-right font-bold text-destructive bg-destructive/10 min-w-[70px]">UVAS</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">YOY 2024</th>
                    <th className="border border-border px-2 py-1 text-right font-medium min-w-[70px]">YOY 2025</th>
                    <th className="border border-border px-2 py-1 text-right font-medium bg-accent/30 min-w-[75px]">Budget<br/>2026</th>
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
                    <th className="border border-border px-2 py-1 text-right font-medium bg-accent/30 min-w-[75px]">EXCESSO<br/>DE STOCK</th>
                    <th className="border border-border px-2 py-1 text-center font-medium bg-accent/30 min-w-[85px]">INICIO<br/>VENDA</th>
                    <th className="border border-border px-2 py-1 text-center font-medium bg-accent/30 min-w-[85px]">FIM VEND°</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => {
                    const isTotalRow = row.isTotal;
                    const bgClass = isTotalRow ? 'bg-primary/10 font-bold' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';
                    const stickyBg = isTotalRow ? 'bg-primary/10' : idx % 2 === 0 ? 'bg-card' : 'bg-muted/20';
                    
                    return (
                      <tr key={idx} className={`${bgClass} hover:bg-accent/30 transition-colors`}>
                        <td className={`border border-border px-2 py-1 font-medium sticky left-0 z-10 ${stickyBg}`}>{row.regiao}</td>
                        <td className={`border border-border px-2 py-1 sticky left-[80px] z-10 ${stickyBg} ${isTotalRow ? 'font-bold' : ''}`}>{row.submarca}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.stockAtualERP)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${row.tmsfMarcas < 0 ? 'text-destructive font-medium' : ''}`}>{formatNum(row.tmsfMarcas)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.stock)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.prevUvas)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.yoy2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.yoy2025)}</td>
                        <td className="border border-border px-2 py-1 text-right bg-accent/10">{formatNum(row.budget2026)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.dtUvas)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.lx)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.alen)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.bair)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.beir)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.douro)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.setubal)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.mosc)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.totalVinif)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${row.transfVinhos2024 < 0 ? 'text-destructive font-medium' : ''}`}>{formatNum(row.transfVinhos2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.necIdeCompra2025)}</td>
                        <td className={`border border-border px-2 py-1 text-right ${row.transfVinhos2025 < 0 ? 'text-destructive font-medium' : ''}`}>{formatNum(row.transfVinhos2025)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.retifGrau)}</td>
                        <td className="border border-border px-2 py-1 text-right font-semibold">{formatNum(row.totalCompras)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.nec2024)}</td>
                        <td className="border border-border px-2 py-1 text-right">{formatNum(row.stockNova)}</td>
                        <td className={`border border-border px-2 py-1 text-right bg-accent/10 ${row.excessoStock > 0 ? 'text-destructive font-medium' : ''}`}>{formatNum(row.excessoStock)}</td>
                        <td className="border border-border px-2 py-1 text-center text-[10px] bg-accent/10">{row.inicioVenda}</td>
                        <td className="border border-border px-2 py-1 text-center text-[10px] bg-accent/10">{row.fimVenda}</td>
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
