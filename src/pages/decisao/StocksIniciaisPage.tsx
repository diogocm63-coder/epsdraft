import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { wineProducts, wineRegioes, wineTipos } from '@/data/wineData';

// Classification rules:
// - Regional (do Ano): categoria 'Regional' in wineProducts
// - DOC: categoria 'Reserva' or 'Premium' in wineProducts
// - Mesa: special category, no region (unique products)

const stockCategorias = ['Regional', 'DOC'] as const;
type StockCategoria = typeof stockCategorias[number];

// Mesa products (no region, separate line/column)
const mesaProducts = [
  { tipo: 'Tinto', produto: 'V&W Mesa Tinto', litros: Math.floor(Math.random() * 80000) + 30000 },
  { tipo: 'Branco', produto: 'V&W Mesa Branco', litros: Math.floor(Math.random() * 80000) + 30000 },
  { tipo: 'Rosé', produto: 'V&W Mesa Rosé', litros: Math.floor(Math.random() * 50000) + 15000 },
];

// Generate stock data organized by region > type > category (Regional/DOC)
const generateStockData = () => {
  const stockData: Record<string, Record<string, Record<StockCategoria, { produto: string; litros: number }[]>>> = {};
  
  wineRegioes.forEach(regiao => {
    stockData[regiao] = {};
    wineTipos.forEach(tipo => {
      stockData[regiao][tipo] = {
        'Regional': [],
        'DOC': []
      };
    });
  });
  
  // Map original categories to new classification
  wineProducts.forEach(product => {
    const isRegional = product.categoria === 'Regional'; // Do Ano
    const isDOC = product.categoria === 'Reserva' || product.categoria === 'Premium';
    
    const baseLitros = product.categoria === 'Premium' 
      ? Math.floor(Math.random() * 15000) + 5000
      : product.categoria === 'Reserva'
        ? Math.floor(Math.random() * 25000) + 10000
        : Math.floor(Math.random() * 50000) + 20000;
    
    if (stockData[product.regiao] && stockData[product.regiao][product.tipo]) {
      const targetCategoria: StockCategoria = isDOC ? 'DOC' : 'Regional';
      stockData[product.regiao][product.tipo][targetCategoria].push({
        produto: product.produto,
        litros: baseLitros
      });
    }
  });
  
  return stockData;
};

const stockData = generateStockData();

// Calculate totals
const calculateTotals = () => {
  const totals: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  const columnTotals: Record<string, Record<StockCategoria, number>> = {};
  
  // Initialize column totals for regular wines
  wineTipos.forEach(tipo => {
    columnTotals[tipo] = {
      'Regional': 0,
      'DOC': 0
    };
  });
  
  wineRegioes.forEach(regiao => {
    totals[regiao] = {};
    rowTotals[regiao] = 0;
    
    wineTipos.forEach(tipo => {
      stockCategorias.forEach(categoria => {
        const produtos = stockData[regiao]?.[tipo]?.[categoria] || [];
        const sum = produtos.reduce((acc, p) => acc + p.litros, 0);
        totals[regiao][`${tipo}_${categoria}`] = sum;
        rowTotals[regiao] += sum;
        columnTotals[tipo][categoria] += sum;
      });
    });
  });
  
  return { totals, rowTotals, columnTotals };
};

const { totals, rowTotals, columnTotals } = calculateTotals();

// Mesa totals
const mesaTotals = {
  byTipo: mesaProducts.reduce((acc, p) => {
    acc[p.tipo] = p.litros;
    return acc;
  }, {} as Record<string, number>),
  total: mesaProducts.reduce((acc, p) => acc + p.litros, 0)
};

// Calculate grand total (all regions + mesa)
const regionsTotal = Object.values(rowTotals).reduce((acc, val) => acc + val, 0);
const grandTotal = regionsTotal + mesaTotals.total;

// Get column totals per tipo (including mesa)
const getTipoTotal = (tipo: string) => {
  const regionTotal = Object.values(columnTotals[tipo] || {}).reduce((acc, val) => acc + val, 0);
  const mesaTotal = mesaTotals.byTipo[tipo] || 0;
  return regionTotal + mesaTotal;
};

const formatNumber = (num: number) => {
  return num.toLocaleString('pt-PT');
};

const StocksIniciaisPage = () => {
  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-eps-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-eps-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Stocks Iniciais</h1>
              <p className="text-sm text-gray-500">Matriz de stocks por região e tipo de vinho (em Litros)</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-gray-400">Total Geral</span>
              <div className="text-lg font-bold text-eps-primary">{formatNumber(grandTotal)} L</div>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                {/* First header row - Wine Types (Colors) */}
                <TableRow className="bg-muted/50 border-b-2">
                  <TableHead rowSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-muted/50 z-10 min-w-[120px]">
                    Região
                  </TableHead>
                  <TableHead rowSpan={2} className="text-xs font-bold border-r min-w-[180px]">
                    Produto
                  </TableHead>
                  {wineTipos.map((tipo, idx) => (
                    <TableHead 
                      key={tipo} 
                      colSpan={2} 
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-100 text-red-800' :
                        tipo === 'Branco' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-pink-100 text-pink-800'
                      } ${idx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {tipo}
                    </TableHead>
                  ))}
                  {/* Mesa column header */}
                  <TableHead 
                    rowSpan={2} 
                    className="text-center text-xs font-bold bg-amber-100 text-amber-800 border-l-2 min-w-[80px]"
                  >
                    Mesa
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center text-xs font-bold bg-gray-200 border-l-2 min-w-[100px]">
                    Total Linha
                  </TableHead>
                </TableRow>
                {/* Second header row - Categories (Regional = do Ano, DOC = Reserva/Premium) */}
                <TableRow className="bg-muted/30">
                  {wineTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableHead 
                        key={`${tipo}_${categoria}`} 
                        className={`text-center text-[10px] font-medium ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                        }`}
                      >
                        {categoria}
                      </TableHead>
                    ))
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {wineRegioes.map((regiao) => {
                  // Get all products for this region
                  const regionProducts: { tipo: string; categoria: StockCategoria; produto: string; litros: number }[] = [];
                  
                  wineTipos.forEach(tipo => {
                    stockCategorias.forEach(categoria => {
                      const produtos = stockData[regiao]?.[tipo]?.[categoria] || [];
                      produtos.forEach(p => {
                        regionProducts.push({ tipo, categoria, produto: p.produto, litros: p.litros });
                      });
                    });
                  });

                  // If no products, show summary row only
                  if (regionProducts.length === 0) {
                    return (
                      <TableRow key={regiao} className="bg-gray-50 font-medium">
                        <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-gray-50 z-10">
                          {regiao}
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-400">-</TableCell>
                        {wineTipos.map((tipo, tipoIdx) => (
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell 
                              key={`${tipo}_${categoria}`} 
                              className={`text-right text-xs ${
                                catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                              }`}
                            >
                              -
                            </TableCell>
                          ))
                        ))}
                        <TableCell className="text-right text-xs bg-amber-50/50 border-l-2">-</TableCell>
                        <TableCell className="text-right text-xs font-bold bg-gray-100 border-l-2">
                          {formatNumber(rowTotals[regiao])}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  // Get max products count for rowspan
                  const maxProducts = Math.max(1, regionProducts.length);
                  
                  return (
                    <>
                      {/* Product detail rows */}
                      {regionProducts.map((product, productIdx) => (
                        <TableRow 
                          key={`${regiao}_${product.produto}`} 
                          className={`hover:bg-muted/30 ${productIdx === 0 ? 'border-t' : ''}`}
                        >
                          {productIdx === 0 && (
                            <TableCell 
                              rowSpan={maxProducts + 1} 
                              className="text-xs font-bold border-r-2 sticky left-0 bg-white z-10 align-top pt-3"
                            >
                              {regiao}
                            </TableCell>
                          )}
                          <TableCell className="text-xs py-1">{product.produto.replace('V&W ', '')}</TableCell>
                          {wineTipos.map((tipo, tipoIdx) => (
                            stockCategorias.map((categoria, catIdx) => (
                              <TableCell 
                                key={`${tipo}_${categoria}`} 
                                className={`text-right text-xs py-1 ${
                                  catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                                } ${
                                  product.tipo === tipo && product.categoria === categoria 
                                    ? tipo === 'Tinto' ? 'bg-red-50 font-medium' :
                                      tipo === 'Branco' ? 'bg-yellow-50/50 font-medium' :
                                      'bg-pink-50 font-medium'
                                    : ''
                                }`}
                              >
                                {product.tipo === tipo && product.categoria === categoria 
                                  ? formatNumber(product.litros)
                                  : '-'
                                }
                              </TableCell>
                            ))
                          ))}
                          {/* Mesa column - empty for region products */}
                          <TableCell className="text-right text-xs py-1 bg-amber-50/30 border-l-2">-</TableCell>
                          <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                            {formatNumber(product.litros)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Region subtotal row */}
                      <TableRow className="bg-gray-100 font-medium border-b-2">
                        <TableCell className="text-xs font-bold text-right italic">Subtotal</TableCell>
                        {wineTipos.map((tipo, tipoIdx) => (
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell 
                              key={`${tipo}_${categoria}_subtotal`} 
                              className={`text-right text-xs font-semibold ${
                                catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                              }`}
                            >
                              {totals[regiao][`${tipo}_${categoria}`] > 0 
                                ? formatNumber(totals[regiao][`${tipo}_${categoria}`])
                                : '-'
                              }
                            </TableCell>
                          ))
                        ))}
                        <TableCell className="text-right text-xs bg-amber-50/50 border-l-2">-</TableCell>
                        <TableCell className="text-right text-xs font-bold bg-gray-200 border-l-2">
                          {formatNumber(rowTotals[regiao])}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}

                {/* MESA row - special line with no region */}
                <TableRow className="bg-amber-50 border-t-4 border-amber-300">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-amber-50 z-10">
                    MESA
                  </TableCell>
                  <TableCell className="text-xs italic text-amber-700">Sem Região</TableCell>
                  {wineTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableCell 
                        key={`mesa_${tipo}_${categoria}`} 
                        className={`text-right text-xs ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                        }`}
                      >
                        -
                      </TableCell>
                    ))
                  ))}
                  {/* Mesa total - aggregates all mesa wines */}
                  <TableCell className="text-right text-xs font-bold bg-amber-100 border-l-2 text-amber-800">
                    {formatNumber(mesaTotals.total)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold bg-gray-200 border-l-2">
                    {formatNumber(mesaTotals.total)}
                  </TableCell>
                </TableRow>

                {/* Mesa products detail */}
                {mesaProducts.map((product) => (
                  <TableRow key={product.produto} className="bg-amber-50/50 hover:bg-amber-100/50">
                    <TableCell className="text-xs border-r-2 sticky left-0 bg-amber-50/50 z-10"></TableCell>
                    <TableCell className="text-xs py-1 pl-4">{product.produto.replace('V&W ', '')}</TableCell>
                    {wineTipos.map((tipo, tipoIdx) => (
                      stockCategorias.map((categoria, catIdx) => (
                        <TableCell 
                          key={`mesa_detail_${tipo}_${categoria}`} 
                          className={`text-right text-xs py-1 ${
                            catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                          }`}
                        >
                          -
                        </TableCell>
                      ))
                    ))}
                    <TableCell className={`text-right text-xs py-1 font-medium border-l-2 ${
                      product.tipo === 'Tinto' ? 'bg-red-50' :
                      product.tipo === 'Branco' ? 'bg-yellow-50/50' :
                      'bg-pink-50'
                    }`}>
                      {formatNumber(product.litros)}
                    </TableCell>
                    <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                      {formatNumber(product.litros)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Grand total row */}
                <TableRow className="bg-eps-primary/10 font-bold border-t-4">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-eps-primary/10 z-10">
                    TOTAL
                  </TableCell>
                  <TableCell className="text-xs"></TableCell>
                  {wineTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableCell 
                        key={`${tipo}_${categoria}_total`} 
                        className={`text-right text-xs font-bold ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                        }`}
                      >
                        {formatNumber(columnTotals[tipo][categoria])}
                      </TableCell>
                    ))
                  ))}
                  <TableCell className="text-right text-xs font-bold bg-amber-100 border-l-2 text-amber-800">
                    {formatNumber(mesaTotals.total)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold bg-eps-primary/20 border-l-2 text-eps-primary">
                    {formatNumber(grandTotal)}
                  </TableCell>
                </TableRow>

                {/* Type totals row */}
                <TableRow className="bg-gray-200 font-bold">
                  <TableCell colSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-gray-200 z-10">
                    Total por Tipo
                  </TableCell>
                  {wineTipos.map((tipo, tipoIdx) => (
                    <TableCell 
                      key={`${tipo}_total`} 
                      colSpan={2}
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-200 text-red-800' :
                        tipo === 'Branco' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-pink-200 text-pink-800'
                      } ${tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {formatNumber(getTipoTotal(tipo))} L
                    </TableCell>
                  ))}
                  <TableCell className="bg-amber-200 text-amber-800 text-center text-xs font-bold border-l-2">
                    {formatNumber(mesaTotals.total)} L
                  </TableCell>
                  <TableCell className="bg-gray-300 border-l-2"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
            <span>Tinto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-50 border border-yellow-300"></div>
            <span>Branco</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-pink-100 border border-pink-300"></div>
            <span>Rosé</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div>
            <span>Mesa (sem região)</span>
          </div>
          <span className="ml-4 text-gray-400">|</span>
          <span className="text-gray-400">Regional = Vinhos do Ano | DOC = Reserva + Premium</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default StocksIniciaisPage;
