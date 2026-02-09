import { useState } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Package, Plus, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { wineProducts, wineRegioes, wineTipos } from '@/data/wineData';

// Classification rules:
// - Regional (do Ano): categoria 'Regional' in wineProducts
// - DOC: categoria 'Reserva' or 'Premium' in wineProducts
// - Mesa: special category under each wine type

const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

// All regions including Portugal for Mesa wines
const allRegioes = [...wineRegioes, 'Portugal'];

// Mesa products (Portugal region)
const mesaProducts = [
  { tipo: 'Tinto', produto: 'V&W Mesa Tinto', litros: Math.floor(Math.random() * 80000) + 30000 },
  { tipo: 'Branco', produto: 'V&W Mesa Branco', litros: Math.floor(Math.random() * 80000) + 30000 },
  { tipo: 'Rosé', produto: 'V&W Mesa Rosé', litros: Math.floor(Math.random() * 50000) + 15000 },
];

// Generate stock data organized by region > type > category (Regional/DOC/Mesa)
const generateStockData = () => {
  const stockData: Record<string, Record<string, Record<StockCategoria, { produto: string; litros: number }[]>>> = {};
  
  allRegioes.forEach(regiao => {
    stockData[regiao] = {};
    wineTipos.forEach(tipo => {
      stockData[regiao][tipo] = {
        'Regional': [],
        'DOC': [],
        'Mesa': []
      };
    });
  });
  
  // Map original categories to new classification
  wineProducts.forEach(product => {
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
  
  // Add Mesa products to Portugal
  mesaProducts.forEach(product => {
    stockData['Portugal'][product.tipo]['Mesa'].push({
      produto: product.produto,
      litros: product.litros
    });
  });
  
  return stockData;
};

const stockData = generateStockData();

// Calculate totals
const calculateTotals = () => {
  const totals: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  const columnTotals: Record<string, Record<StockCategoria, number>> = {};
  
  // Initialize column totals
  wineTipos.forEach(tipo => {
    columnTotals[tipo] = {
      'Regional': 0,
      'DOC': 0,
      'Mesa': 0
    };
  });
  
  allRegioes.forEach(regiao => {
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

// Calculate grand total
const grandTotal = Object.values(rowTotals).reduce((acc, val) => acc + val, 0);

// Get column totals per tipo
const getTipoTotal = (tipo: string) => {
  return Object.values(columnTotals[tipo]).reduce((acc, val) => acc + val, 0);
};

const formatNumber = (num: number) => {
  return num.toLocaleString('pt-PT');
};

const StocksIniciaisPage = () => {
  // State to track which regions are expanded
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  const toggleRegion = (regiao: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regiao]: !prev[regiao]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    allRegioes.forEach(r => { allExpanded[r] = true; });
    setExpandedRegions(allExpanded);
  };

  const collapseAll = () => {
    setExpandedRegions({});
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={expandAll} className="text-xs h-7">
                <Plus className="w-3 h-3 mr-1" />
                Expandir Tudo
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs h-7">
                <Minus className="w-3 h-3 mr-1" />
                Colapsar Tudo
              </Button>
            </div>
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
                  <TableHead rowSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-muted/50 z-10 min-w-[140px]">
                    Região
                  </TableHead>
                  <TableHead rowSpan={2} className="text-xs font-bold border-r min-w-[180px]">
                    Produto
                  </TableHead>
                  {wineTipos.map((tipo, idx) => (
                    <TableHead 
                      key={tipo} 
                      colSpan={3} 
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-100 text-red-800' :
                        tipo === 'Branco' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-pink-100 text-pink-800'
                      } ${idx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {tipo}
                    </TableHead>
                  ))}
                  <TableHead rowSpan={2} className="text-center text-xs font-bold bg-gray-200 border-l-2 min-w-[100px]">
                    Total Linha
                  </TableHead>
                </TableRow>
                {/* Second header row - Categories (Regional, DOC, Mesa) */}
                <TableRow className="bg-muted/30">
                  {wineTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableHead 
                        key={`${tipo}_${categoria}`} 
                        className={`text-center text-[10px] font-medium ${
                          categoria === 'Mesa' ? 'bg-amber-50 text-amber-700' : ''
                        } ${
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
                {allRegioes.map((regiao) => {
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

                  const isPortugal = regiao === 'Portugal';
                  const isExpanded = expandedRegions[regiao] || false;
                  const hasProducts = regionProducts.length > 0;

                  return (
                    <>
                      {/* Region header/summary row */}
                      <TableRow 
                        key={regiao} 
                        className={`font-medium border-t cursor-pointer hover:bg-muted/50 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}
                        onClick={() => hasProducts && toggleRegion(regiao)}
                      >
                        <TableCell className={`text-xs font-bold border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            {hasProducts && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 w-5 p-0 hover:bg-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRegion(regiao);
                                }}
                              >
                                {isExpanded ? (
                                  <Minus className="w-3 h-3" />
                                ) : (
                                  <Plus className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                            <span>{regiao}</span>
                            {hasProducts && (
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({regionProducts.length})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-500">
                          {isExpanded ? '' : 'Subtotal'}
                        </TableCell>
                        {wineTipos.map((tipo, tipoIdx) => (
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell 
                              key={`${tipo}_${categoria}`} 
                              className={`text-right text-xs font-semibold ${
                                categoria === 'Mesa' ? 'bg-amber-50/50' : ''
                              } ${
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
                        <TableCell className="text-right text-xs font-bold bg-gray-100 border-l-2">
                          {formatNumber(rowTotals[regiao])}
                        </TableCell>
                      </TableRow>

                      {/* Product detail rows - only show when expanded */}
                      {isExpanded && regionProducts.map((product) => (
                        <TableRow 
                          key={`${regiao}_${product.produto}`} 
                          className={`hover:bg-muted/30 ${isPortugal ? 'bg-amber-50/30' : ''}`}
                        >
                          <TableCell className={`text-xs border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50/30' : 'bg-white'}`}>
                          </TableCell>
                          <TableCell className="text-xs py-1 pl-4">{product.produto.replace('V&W ', '')}</TableCell>
                          {wineTipos.map((tipo, tipoIdx) => (
                            stockCategorias.map((categoria, catIdx) => {
                              const isMatch = product.tipo === tipo && product.categoria === categoria;
                              const isMesaColumn = categoria === 'Mesa';
                              
                              return (
                                <TableCell 
                                  key={`${tipo}_${categoria}`} 
                                  className={`text-right text-xs py-1 ${
                                    catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                                  } ${
                                    isMatch 
                                      ? isMesaColumn 
                                        ? 'bg-amber-100 font-medium'
                                        : tipo === 'Tinto' ? 'bg-red-50 font-medium' 
                                        : tipo === 'Branco' ? 'bg-yellow-50/50 font-medium' 
                                        : 'bg-pink-50 font-medium'
                                      : isMesaColumn ? 'bg-amber-50/30' : ''
                                  }`}
                                >
                                  {isMatch ? formatNumber(product.litros) : '-'}
                                </TableCell>
                              );
                            })
                          ))}
                          <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                            {formatNumber(product.litros)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}

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
                          categoria === 'Mesa' ? 'bg-amber-100/50' : ''
                        } ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''
                        }`}
                      >
                        {formatNumber(columnTotals[tipo][categoria])}
                      </TableCell>
                    ))
                  ))}
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
                      colSpan={3}
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-200 text-red-800' :
                        tipo === 'Branco' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-pink-200 text-pink-800'
                      } ${tipoIdx < wineTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {formatNumber(getTipoTotal(tipo))} L
                    </TableCell>
                  ))}
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
          <span className="text-gray-400">Regional = Vinhos do Ano | DOC = Reserva + Premium | Mesa = Portugal</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default StocksIniciaisPage;
