import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { ClipboardList, Plus, Minus, Settings2, TrendingUp, BarChart3 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { wineProducts, wineRegioes, wineTipos } from '@/data/wineData';

const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

const allRegioes = [...wineRegioes, 'Portugal'];

const formatNumber = (num: number) => num.toLocaleString('pt-PT', { maximumFractionDigits: 0 });

// ── Deterministic seed-based random for stable mock data ──
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ── Generate Stock Iniciais data (litros) ──
const generateStockData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, number>>> = {};
  let seed = 42;

  allRegioes.forEach(regiao => {
    data[regiao] = {};
    wineTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });
  });

  wineProducts.forEach(product => {
    const isDOC = product.categoria === 'Reserva' || product.categoria === 'Premium';
    const targetCategoria: StockCategoria = isDOC ? 'DOC' : 'Regional';
    const baseLitros = product.categoria === 'Premium'
      ? Math.floor(seededRandom(seed++) * 15000) + 5000
      : product.categoria === 'Reserva'
        ? Math.floor(seededRandom(seed++) * 25000) + 10000
        : Math.floor(seededRandom(seed++) * 50000) + 20000;

    if (data[product.regiao]?.[product.tipo]) {
      data[product.regiao][product.tipo][targetCategoria] += baseLitros;
    }
  });

  // Mesa products
  data['Portugal']['Tinto']['Mesa'] = Math.floor(seededRandom(seed++) * 80000) + 30000;
  data['Portugal']['Branco']['Mesa'] = Math.floor(seededRandom(seed++) * 80000) + 30000;
  data['Portugal']['Rosé']['Mesa'] = Math.floor(seededRandom(seed++) * 50000) + 15000;

  return data;
};

// ── Generate Plano de Engarrafamento data (litros) ──
const generateEngarrafamentoData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, number>>> = {};
  let seed = 200;

  allRegioes.forEach(regiao => {
    data[regiao] = {};
    wineTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });
  });

  wineProducts.forEach(product => {
    const isDOC = product.categoria === 'Reserva' || product.categoria === 'Premium';
    const targetCategoria: StockCategoria = isDOC ? 'DOC' : 'Regional';
    const baseLitros = product.categoria === 'Premium'
      ? Math.floor(seededRandom(seed++) * 30000) + 15000
      : product.categoria === 'Reserva'
        ? Math.floor(seededRandom(seed++) * 60000) + 30000
        : Math.floor(seededRandom(seed++) * 100000) + 50000;

    if (data[product.regiao]?.[product.tipo]) {
      data[product.regiao][product.tipo][targetCategoria] += baseLitros;
    }
  });

  data['Portugal']['Tinto']['Mesa'] = Math.floor(seededRandom(seed++) * 150000) + 80000;
  data['Portugal']['Branco']['Mesa'] = Math.floor(seededRandom(seed++) * 150000) + 80000;
  data['Portugal']['Rosé']['Mesa'] = Math.floor(seededRandom(seed++) * 100000) + 40000;

  return data;
};

// ── Generate Previsão de Vendima data (already in litros, using 0.74/0.70 ratios) ──
const generateVendimaData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, number>>> = {};
  let seed = 100;

  allRegioes.forEach(regiao => {
    data[regiao] = {};
    wineTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });
  });

  const vendimaTipos = ['Tinto', 'Branco'];
  vendimaTipos.forEach(tipo => {
    const ratio = tipo === 'Tinto' ? 0.74 : 0.70;
    allRegioes.forEach(regiao => {
      const categorias = regiao === 'Portugal' ? ['Mesa'] : ['Regional', 'DOC'];
      categorias.forEach(categoria => {
        const numCastas = Math.floor(seededRandom(seed++) * 2) + 1;
        let total = 0;
        for (let i = 0; i < numCastas; i++) {
          const baseKg = categoria === 'DOC'
            ? Math.floor(seededRandom(seed++) * 15000) + 5000
            : categoria === 'Mesa'
              ? Math.floor(seededRandom(seed++) * 30000) + 10000
              : Math.floor(seededRandom(seed++) * 25000) + 8000;
          total += Math.round(baseKg * ratio);
        }
        data[regiao][tipo][categoria as StockCategoria] = total;
      });
    });
  });

  return data;
};

const stockData = generateStockData();
const engarrafamentoData = generateEngarrafamentoData();
const vendimaData = generateVendimaData();

// ── Get all unique products per region/tipo/categoria ──
const getProductsForCell = (regiao: string, tipo: string, categoria: StockCategoria): string[] => {
  if (regiao === 'Portugal' && categoria === 'Mesa') {
    return [`V&W Mesa ${tipo}`];
  }
  return wineProducts
    .filter(p => {
      const cat: StockCategoria = (p.categoria === 'Reserva' || p.categoria === 'Premium') ? 'DOC' : 'Regional';
      return p.regiao === regiao && p.tipo === tipo && cat === categoria;
    })
    .map(p => p.produto);
};

// ── Build flat product list for the split table ──
const buildProductList = () => {
  const products: { produto: string; regiao: string; tipo: string; categoria: StockCategoria }[] = [];
  allRegioes.forEach(regiao => {
    wineTipos.forEach(tipo => {
      stockCategorias.forEach(categoria => {
        const prods = getProductsForCell(regiao, tipo, categoria);
        prods.forEach(produto => {
          products.push({ produto, regiao, tipo, categoria });
        });
      });
    });
  });
  return products;
};

const allProducts = buildProductList();

// ── Castas used in vendima ──
const castasPorTipo: Record<string, string[]> = {
  'Tinto': ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz', 'Castelão', 'Tinta Barroca', 'Trincadeira'],
  'Branco': ['Arinto', 'Fernão Pires', 'Loureiro', 'Alvarinho', 'Encruzado', 'Antão Vaz', 'Verdelho'],
};

// ── Uva/Vinho Split Dialog ──
const SplitDialog = ({
  splits,
  onSave,
}: {
  splits: Record<string, number>; // produto -> % uva (0-100)
  onSave: (s: Record<string, number>) => void;
}) => {
  const [editSplits, setEditSplits] = useState<Record<string, number>>(() => ({ ...splits }));

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Repartição Uva / Vinho por Produto</DialogTitle>
        <p className="text-sm text-gray-500">% Uva (o restante é atribuído a Vinho)</p>
      </DialogHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-bold">Produto</TableHead>
              <TableHead className="text-xs font-bold text-center w-[100px]">% Uva</TableHead>
              <TableHead className="text-xs font-bold text-center w-[100px]">% Vinho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map(p => (
              <TableRow key={p.produto}>
                <TableCell className="text-xs">{p.produto.replace('V&W ', '')}</TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editSplits[p.produto] ?? 80}
                    onChange={(e) => {
                      const v = Math.min(100, Math.max(0, Number(e.target.value)));
                      setEditSplits(prev => ({ ...prev, [p.produto]: v }));
                    }}
                    className="h-7 text-xs text-center w-16 mx-auto"
                  />
                </TableCell>
                <TableCell className="text-xs text-center font-medium text-gray-500">
                  {100 - (editSplits[p.produto] ?? 80)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="outline" size="sm">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editSplits)} className="bg-eps-primary hover:bg-eps-primary/90">
            Guardar
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ── Casta-Produto Allocation Dialog ──
const CastaProductDialog = ({
  allocations,
  onSave,
}: {
  allocations: Record<string, Record<string, number>>; // produto -> casta -> %
  onSave: (a: Record<string, Record<string, number>>) => void;
}) => {
  const [editAlloc, setEditAlloc] = useState<Record<string, Record<string, number>>>(() =>
    JSON.parse(JSON.stringify(allocations))
  );

  // Group products by tipo for cleaner display
  const tintoProducts = allProducts.filter(p => p.tipo === 'Tinto');
  const brancoProducts = allProducts.filter(p => p.tipo === 'Branco');

  const updateValue = (produto: string, casta: string, value: string) => {
    const num = Math.min(100, Math.max(0, Number(value)));
    setEditAlloc(prev => ({
      ...prev,
      [produto]: { ...(prev[produto] || {}), [casta]: num }
    }));
  };

  const renderSection = (title: string, products: typeof allProducts, castas: string[]) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold mb-2 text-gray-700">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-[10px] font-bold sticky left-0 bg-muted/50 z-10 min-w-[160px]">Produto</TableHead>
              {castas.map(c => (
                <TableHead key={c} className="text-[10px] font-medium text-center min-w-[70px]">{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.produto}>
                <TableCell className="text-[10px] font-medium sticky left-0 bg-white z-10">
                  {p.produto.replace('V&W ', '')}
                </TableCell>
                {castas.map(casta => (
                  <TableCell key={casta} className="p-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editAlloc[p.produto]?.[casta] ?? 100}
                      onChange={(e) => updateValue(p.produto, casta, e.target.value)}
                      className="h-6 text-[10px] text-center w-14 mx-auto"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <DialogContent className="max-w-6xl max-h-[85vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Alocação Casta → Produto (%)</DialogTitle>
        <p className="text-sm text-gray-500">Define a % máxima de cada casta alocada a cada produto (por defeito 100%)</p>
      </DialogHeader>
      <div className="mt-4">
        {renderSection('Tintos', tintoProducts, castasPorTipo['Tinto'])}
        {renderSection('Brancos', brancoProducts, castasPorTipo['Branco'])}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="outline" size="sm">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editAlloc)} className="bg-eps-primary hover:bg-eps-primary/90">
            Guardar Alocações
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ── Variação Previsão de Vendima Dialog (by product) ──
const VariacaoVendimaDialog = () => {
  const [variacoes, setVariacoes] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {};
    allProducts.forEach(p => { v[p.produto] = 0; });
    return v;
  });

  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Variação das Previsões de Vendima
        </DialogTitle>
        <p className="text-sm text-gray-500">Ajuste percentual (%) por produto sobre a previsão de vendima</p>
      </DialogHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-bold">Produto</TableHead>
              <TableHead className="text-xs font-bold">Região</TableHead>
              <TableHead className="text-xs font-bold">Tipo</TableHead>
              <TableHead className="text-xs font-bold text-center w-[100px]">Variação (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map(p => (
              <TableRow key={p.produto}>
                <TableCell className="text-xs">{p.produto.replace('V&W ', '')}</TableCell>
                <TableCell className="text-xs text-gray-500">{p.regiao}</TableCell>
                <TableCell className="text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    p.tipo === 'Tinto' ? 'bg-red-100 text-red-700' :
                    p.tipo === 'Branco' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>{p.tipo}</span>
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={variacoes[p.produto] ?? 0}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVariacoes(prev => ({ ...prev, [p.produto]: v }));
                    }}
                    className={`h-7 text-xs text-center w-20 mx-auto ${
                      (variacoes[p.produto] ?? 0) > 0 ? 'border-green-400 bg-green-50' :
                      (variacoes[p.produto] ?? 0) < 0 ? 'border-red-400 bg-red-50' : ''
                    }`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="outline" size="sm">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button size="sm" className="bg-eps-primary hover:bg-eps-primary/90">
            Aplicar Variações
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ── Variação Plano de Engarrafamento Dialog (by product, casta x região) ──
const VariacaoEngarrafamentoDialog = () => {
  const [variacoes, setVariacoes] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {};
    allProducts.forEach(p => { v[p.produto] = 0; });
    return v;
  });

  // Group products by região
  const produtosPorRegiao: Record<string, typeof allProducts> = {};
  allProducts.forEach(p => {
    if (!produtosPorRegiao[p.regiao]) produtosPorRegiao[p.regiao] = [];
    produtosPorRegiao[p.regiao].push(p);
  });

  return (
    <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Variação do Plano de Engarrafamento
        </DialogTitle>
        <p className="text-sm text-gray-500">Ajuste percentual (%) por produto, organizado por casta e região</p>
      </DialogHeader>
      <div className="mt-4 space-y-6">
        {Object.entries(produtosPorRegiao).map(([regiao, produtos]) => (
          <div key={regiao}>
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-eps-primary"></span>
              {regiao}
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] font-bold min-w-[180px]">Produto</TableHead>
                  <TableHead className="text-[10px] font-bold">Tipo</TableHead>
                  <TableHead className="text-[10px] font-bold">Categoria</TableHead>
                  <TableHead className="text-[10px] font-bold text-center w-[90px]">Variação (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map(p => (
                  <TableRow key={p.produto}>
                    <TableCell className="text-[11px]">{p.produto.replace('V&W ', '')}</TableCell>
                    <TableCell className="text-[11px]">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        p.tipo === 'Tinto' ? 'bg-red-100 text-red-700' :
                        p.tipo === 'Branco' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-pink-100 text-pink-700'
                      }`}>{p.tipo}</span>
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500">{p.categoria}</TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={variacoes[p.produto] ?? 0}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setVariacoes(prev => ({ ...prev, [p.produto]: v }));
                        }}
                        className={`h-6 text-[10px] text-center w-16 mx-auto ${
                          (variacoes[p.produto] ?? 0) > 0 ? 'border-green-400 bg-green-50' :
                          (variacoes[p.produto] ?? 0) < 0 ? 'border-red-400 bg-red-50' : ''
                        }`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="outline" size="sm">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button size="sm" className="bg-eps-primary hover:bg-eps-primary/90">
            Aplicar Variações
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};


type MeasureUnit = 'L' | 'Kg' | '€';

// Default conversion ratios
const defaultKgPerLitro: Record<string, number> = {
  'Tinto': 1 / 0.74,
  'Branco': 1 / 0.70,
  'Rosé': 1 / 0.72,
};
const defaultEuroPerLitro = 0.50;

const AvaliacaoNecessidadesPage = () => {
  const [selectedUnit, setSelectedUnit] = useState<MeasureUnit>('L');
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [expandedTipos, setExpandedTipos] = useState<Record<string, boolean>>(() => {
    const t: Record<string, boolean> = {};
    wineTipos.forEach(tipo => { t[tipo] = true; });
    return t;
  });
  const toggleTipo = (tipo: string) => {
    setExpandedTipos(prev => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  // Default 80% uva for all products
  const [splits, setSplits] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {};
    allProducts.forEach(p => { s[p.produto] = 80; });
    return s;
  });

  // Default 100% allocation for all casta-product combos
  const [castaAllocations, setCastaAllocations] = useState<Record<string, Record<string, number>>>(() => {
    const a: Record<string, Record<string, number>> = {};
    allProducts.forEach(p => {
      a[p.produto] = {};
      const castas = castasPorTipo[p.tipo] || [];
      castas.forEach(c => { a[p.produto][c] = 100; });
    });
    return a;
  });

  const toggleRegion = (regiao: string) => {
    setExpandedRegions(prev => ({ ...prev, [regiao]: !prev[regiao] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    allRegioes.forEach(r => { allExpanded[r] = true; });
    setExpandedRegions(allExpanded);
  };

  const collapseAll = () => setExpandedRegions({});

  // ── Calculate all values ──
  const calculated = useMemo(() => {
    type CellData = {
      engarrafamento: number;
      stock: number;
      vendima: number;
      comprasMP: number;
      compraUva: number;
      compraVinho: number;
    };
    const result: Record<string, Record<string, CellData>> = {};
    const rowTotals: Record<string, CellData> = {};
    const colTotals: Record<string, Record<StockCategoria, CellData>> = {};

    wineTipos.forEach(tipo => {
      colTotals[tipo] = {} as any;
      stockCategorias.forEach(cat => {
        colTotals[tipo][cat] = { engarrafamento: 0, stock: 0, vendima: 0, comprasMP: 0, compraUva: 0, compraVinho: 0 };
      });
    });

    allRegioes.forEach(regiao => {
      result[regiao] = {};
      rowTotals[regiao] = { engarrafamento: 0, stock: 0, vendima: 0, comprasMP: 0, compraUva: 0, compraVinho: 0 };

      wineTipos.forEach(tipo => {
        stockCategorias.forEach(categoria => {
          const engarrafamento = engarrafamentoData[regiao]?.[tipo]?.[categoria] || 0;
          const stock = stockData[regiao]?.[tipo]?.[categoria] || 0;
          const vendima = vendimaData[regiao]?.[tipo]?.[categoria] || 0;
          const comprasMP = Math.max(0, engarrafamento - stock - vendima);

          // Average split for products in this cell
          const prods = getProductsForCell(regiao, tipo, categoria);
          const avgUvaPct = prods.length > 0
            ? prods.reduce((s, p) => s + (splits[p] ?? 80), 0) / prods.length
            : 80;

          const compraUva = Math.round(comprasMP * (avgUvaPct / 100));
          const compraVinho = comprasMP - compraUva;

          const key = `${tipo}_${categoria}`;
          result[regiao][key] = { engarrafamento, stock, vendima, comprasMP, compraUva, compraVinho };

          const keys: (keyof CellData)[] = ['engarrafamento', 'stock', 'vendima', 'comprasMP', 'compraUva', 'compraVinho'];
          keys.forEach(k => {
            rowTotals[regiao][k] += result[regiao][key][k];
            colTotals[tipo][categoria][k] += result[regiao][key][k];
          });
        });
      });
    });

    const grandTotal = Object.values(rowTotals).reduce(
      (acc, v) => ({
        engarrafamento: acc.engarrafamento + v.engarrafamento,
        stock: acc.stock + v.stock,
        vendima: acc.vendima + v.vendima,
        comprasMP: acc.comprasMP + v.comprasMP,
        compraUva: acc.compraUva + v.compraUva,
        compraVinho: acc.compraVinho + v.compraVinho,
      }),
      { engarrafamento: 0, stock: 0, vendima: 0, comprasMP: 0, compraUva: 0, compraVinho: 0 }
    );

    return { result, rowTotals, colTotals, grandTotal };
  }, [splits]);

  const fields = [
    { key: 'engarrafamento', label: 'Pl. Engarraf.', color: 'bg-indigo-50' },
    { key: 'stock', label: 'Stock Ini.', color: 'bg-blue-50' },
    { key: 'vendima', label: 'Prev. Vend.', color: 'bg-green-50' },
    { key: 'comprasMP', label: 'Compras MP', color: 'bg-orange-50 font-semibold' },
    { key: 'compraUva', label: 'Compra Uva', color: 'bg-purple-50' },
    { key: 'compraVinho', label: 'Compra Vinho', color: 'bg-pink-50' },
  ] as const;

  const unitLabel = selectedUnit === 'L' ? 'L' : selectedUnit === 'Kg' ? 'Kg' : '€';

  // Convert a value from litros to the selected unit
  const convertValue = (valueLitros: number, tipo: string): number => {
    if (selectedUnit === 'L') return valueLitros;
    if (selectedUnit === 'Kg') return Math.round(valueLitros * (defaultKgPerLitro[tipo] || 1.35));
    return Math.round(valueLitros * defaultEuroPerLitro);
  };

  // Convert aggregated values (use average ratio for mixed tipos)
  const convertTotal = (valueLitros: number): number => {
    if (selectedUnit === 'L') return valueLitros;
    if (selectedUnit === 'Kg') return Math.round(valueLitros * 1.35);
    return Math.round(valueLitros * defaultEuroPerLitro);
  };

  const formatDisplay = (value: number) => {
    if (selectedUnit === '€') return `${formatNumber(value)} €`;
    return formatNumber(value);
  };

  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-eps-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-eps-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Avaliação de Necessidades</h1>
              <p className="text-sm text-gray-500">Stock Ini. + Prev. Vendima = Necessidades = Compra Uva + Compra Vinho ({unitLabel})</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Unit Toggle */}
              <div className="flex items-center border rounded-md overflow-hidden h-7">
                {(['L', 'Kg', '€'] as MeasureUnit[]).map(unit => (
                  <button
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    className={`px-3 text-xs font-medium h-full transition-colors ${
                      selectedUnit === unit
                        ? 'bg-eps-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    } ${unit !== '€' ? 'border-r' : ''}`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
              <span className="text-gray-300">|</span>
              {/* Split Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Settings2 className="w-3 h-3 mr-1" />
                    Repartição Uva/Vinho
                  </Button>
                </DialogTrigger>
                <SplitDialog splits={splits} onSave={setSplits} />
              </Dialog>
              {/* Casta Allocation Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Settings2 className="w-3 h-3 mr-1" />
                    Alocação Castas
                  </Button>
                </DialogTrigger>
                <CastaProductDialog allocations={castaAllocations} onSave={setCastaAllocations} />
              </Dialog>
              {/* Variação Vendima Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Var. Vendima
                  </Button>
                </DialogTrigger>
                <VariacaoVendimaDialog />
              </Dialog>
              {/* Variação Engarrafamento Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Var. Engarrafamento
                  </Button>
                </DialogTrigger>
                <VariacaoEngarrafamentoDialog />
              </Dialog>
              <span className="text-gray-300">|</span>
              <Button variant="outline" size="sm" onClick={expandAll} className="text-xs h-7">
                <Plus className="w-3 h-3 mr-1" />
                Expandir
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs h-7">
                <Minus className="w-3 h-3 mr-1" />
                Colapsar
              </Button>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Necessidades Totais</span>
              <div className="text-lg font-bold text-eps-primary">{formatDisplay(convertTotal(calculated.grandTotal.necessidades))}</div>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                {/* Wine type header */}
                <TableRow className="bg-muted/50 border-b-2">
                  <TableHead rowSpan={expandedTipos['Tinto'] || expandedTipos['Branco'] || expandedTipos['Rosé'] ? 3 : 2} className="text-xs font-bold border-r-2 sticky left-0 bg-muted/50 z-10 min-w-[130px]">
                    Região
                  </TableHead>
                  {wineTipos.map((tipo, idx) => {
                    const isExp = expandedTipos[tipo];
                    return (
                      <TableHead
                        key={tipo}
                        colSpan={isExp ? 3 * fields.length : 1}
                        className={`text-center text-xs font-bold cursor-pointer ${
                          tipo === 'Tinto' ? 'bg-red-100 text-red-800' :
                          tipo === 'Branco' ? 'bg-yellow-50 text-yellow-800' :
                          'bg-pink-100 text-pink-800'
                        } ${idx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                        onClick={() => toggleTipo(tipo)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isExp ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span>{tipo}</span>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead rowSpan={expandedTipos['Tinto'] || expandedTipos['Branco'] || expandedTipos['Rosé'] ? 3 : 2} className="text-center text-xs font-bold bg-gray-200 border-l-2 min-w-[80px]">
                    Total
                  </TableHead>
                </TableRow>
                {/* Categoria header */}
                <TableRow className="bg-muted/30">
                  {wineTipos.map((tipo, tipoIdx) =>
                    expandedTipos[tipo] ? (
                      stockCategorias.map((cat, catIdx) => (
                        <TableHead
                          key={`${tipo}_${cat}`}
                          colSpan={fields.length}
                          className={`text-center text-[10px] font-medium ${
                            cat === 'Mesa' ? 'bg-amber-50 text-amber-700' : ''
                          } ${catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : 'border-r'}`}
                        >
                          {cat}
                        </TableHead>
                      ))
                    ) : (
                      <TableHead
                        key={`${tipo}_collapsed`}
                        className={`text-center text-[10px] font-medium ${tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        Necessid.
                      </TableHead>
                    )
                  )}
                </TableRow>
                {/* Field sub-headers - only for expanded tipos */}
                {wineTipos.some(t => expandedTipos[t]) && (
                  <TableRow className="bg-muted/20">
                    {wineTipos.map((tipo, tipoIdx) =>
                      expandedTipos[tipo] ? (
                        stockCategorias.map((cat, catIdx) =>
                          fields.map((field, fIdx) => (
                            <TableHead
                              key={`${tipo}_${cat}_${field.key}`}
                              className={`text-center text-[9px] font-medium min-w-[65px] ${field.color} ${
                                fIdx === fields.length - 1 && catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                              }`}
                            >
                              {field.label}
                            </TableHead>
                          ))
                        )
                      ) : null
                    )}
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {allRegioes.map((regiao) => {
                  const isPortugal = regiao === 'Portugal';
                  const isExpanded = expandedRegions[regiao] || false;

                  return (
                    <TableRow
                      key={regiao}
                      className={`font-medium border-t cursor-pointer hover:bg-muted/50 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}
                      onClick={() => toggleRegion(regiao)}
                    >
                      <TableCell className={`text-xs font-bold border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost" size="sm"
                            className="h-5 w-5 p-0 hover:bg-gray-200"
                            onClick={(e) => { e.stopPropagation(); toggleRegion(regiao); }}
                          >
                            {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </Button>
                          <span>{regiao}</span>
                        </div>
                      </TableCell>
                      {wineTipos.map((tipo, tipoIdx) =>
                        expandedTipos[tipo] ? (
                          stockCategorias.map((cat, catIdx) => {
                            const cellData = calculated.result[regiao]?.[`${tipo}_${cat}`];
                            return fields.map((field, fIdx) => (
                              <TableCell
                                key={`${tipo}_${cat}_${field.key}`}
                                className={`text-right text-[10px] ${field.color} ${
                                  fIdx === fields.length - 1 && catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                                }`}
                              >
                                {cellData && cellData[field.key] > 0 ? formatDisplay(convertValue(cellData[field.key], tipo)) : '-'}
                              </TableCell>
                            ));
                          })
                        ) : (
                          <TableCell
                            key={`${tipo}_collapsed`}
                            className={`text-right text-[10px] font-semibold ${tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                          >
                            {formatDisplay(convertValue(
                              stockCategorias.reduce((sum, cat) => {
                                const cd = calculated.result[regiao]?.[`${tipo}_${cat}`];
                                return sum + (cd?.necessidades || 0);
                              }, 0), tipo
                            ))}
                          </TableCell>
                        )
                      )}
                      <TableCell className="text-right text-[10px] font-bold bg-gray-100 border-l-2">
                        {formatDisplay(convertTotal(calculated.rowTotals[regiao].necessidades))}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Grand total row */}
                <TableRow className="bg-eps-primary/10 font-bold border-t-4">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-eps-primary/10 z-10">TOTAL</TableCell>
                  {wineTipos.map((tipo, tipoIdx) =>
                    expandedTipos[tipo] ? (
                      stockCategorias.map((cat, catIdx) => {
                        const ct = calculated.colTotals[tipo]?.[cat];
                        return fields.map((field, fIdx) => (
                          <TableCell
                            key={`total_${tipo}_${cat}_${field.key}`}
                            className={`text-right text-[10px] font-bold ${field.color} ${
                              fIdx === fields.length - 1 && catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                            }`}
                          >
                            {ct && ct[field.key] > 0 ? formatDisplay(convertValue(ct[field.key], tipo)) : '-'}
                          </TableCell>
                        ));
                      })
                    ) : (
                      <TableCell
                        key={`total_${tipo}_collapsed`}
                        className={`text-right text-[10px] font-bold ${tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        {formatDisplay(convertValue(
                          stockCategorias.reduce((sum, cat) => {
                            const ct = calculated.colTotals[tipo]?.[cat];
                            return sum + (ct?.necessidades || 0);
                          }, 0), tipo
                        ))}
                      </TableCell>
                    )
                  )}
                  <TableCell className="text-right text-[10px] font-bold bg-eps-primary/20 border-l-2 text-eps-primary">
                    {formatDisplay(convertTotal(calculated.grandTotal.necessidades))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          {fields.map(f => (
            <div key={f.key} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${f.color} border border-gray-300`}></div>
              <span>{f.label}</span>
            </div>
          ))}
          <span className="text-gray-400">|</span>
          <span className="text-gray-400 italic">Valores em Litros (L) — Fórmula: Stock Ini. + Prev. Vendima = Necessidades = Compra Uva + Compra Vinho</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default AvaliacaoNecessidadesPage;
