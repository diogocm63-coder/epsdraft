import { useState } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Grape, Plus, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { wineRegioes } from '@/data/wineData';

// Only Tinto and Branco for harvest (Rosé is made from red grapes)
const vendimaTipos = ['Tinto', 'Branco'] as const;

// Classification categories (same as Stocks Iniciais)
const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

// All regions including Portugal for Mesa
const allRegioes = [...wineRegioes, 'Portugal'];

// Castas data by type
const castasPorTipo: Record<string, Record<StockCategoria, string[]>> = {
  'Tinto': {
    'Regional': ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz', 'Castelão'],
    'DOC': ['Touriga Nacional', 'Tinta Barroca', 'Trincadeira'],
    'Mesa': ['Castelão', 'Trincadeira']
  },
  'Branco': {
    'Regional': ['Arinto', 'Fernão Pires', 'Loureiro', 'Alvarinho'],
    'DOC': ['Encruzado', 'Antão Vaz', 'Verdelho'],
    'Mesa': ['Fernão Pires', 'Síria']
  },
};

// Generate harvest data by region, type, category, and casta
const generateHarvestData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, { casta: string; kg: number }[]>>> = {};
  
  allRegioes.forEach(regiao => {
    data[regiao] = {};
    vendimaTipos.forEach(tipo => {
      data[regiao][tipo] = {
        'Regional': [],
        'DOC': [],
        'Mesa': []
      };
      
      // Only Portugal has Mesa wines
      const categorias = regiao === 'Portugal' ? ['Mesa'] : ['Regional', 'DOC'];
      
      categorias.forEach(categoria => {
        const castas = castasPorTipo[tipo][categoria as StockCategoria] || [];
        // Select 1-3 random castas for this region/type/category
        const numCastas = Math.floor(Math.random() * 2) + 1;
        const selectedCastas = castas.slice(0, numCastas);
        
        selectedCastas.forEach(casta => {
          const baseKg = categoria === 'DOC' 
            ? Math.floor(Math.random() * 15000) + 5000
            : categoria === 'Mesa'
              ? Math.floor(Math.random() * 30000) + 10000
              : Math.floor(Math.random() * 25000) + 8000;
          
          data[regiao][tipo][categoria as StockCategoria].push({
            casta,
            kg: baseKg
          });
        });
      });
    });
  });
  
  return data;
};

const harvestData = generateHarvestData();

// Calculate totals
const calculateTotals = () => {
  const totals: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  const columnTotals: Record<string, Record<StockCategoria, number>> = {};
  
  // Initialize column totals
  vendimaTipos.forEach(tipo => {
    columnTotals[tipo] = {
      'Regional': 0,
      'DOC': 0,
      'Mesa': 0
    };
  });
  
  allRegioes.forEach(regiao => {
    totals[regiao] = {};
    rowTotals[regiao] = 0;
    
    vendimaTipos.forEach(tipo => {
      stockCategorias.forEach(categoria => {
        const castas = harvestData[regiao]?.[tipo]?.[categoria] || [];
        const sum = castas.reduce((acc, c) => acc + c.kg, 0);
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

const PrevisaoVendimaPage = () => {
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
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Grape className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Previsão de Vendima</h1>
              <p className="text-sm text-gray-500">Matriz de previsão por região, tipo e casta (em Kg)</p>
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
              <span className="text-xs text-gray-400">Previsão Total</span>
              <div className="text-lg font-bold text-purple-600">{formatNumber(grandTotal)} Kg</div>
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
                    Casta
                  </TableHead>
                  {vendimaTipos.map((tipo, idx) => (
                    <TableHead 
                      key={tipo} 
                      colSpan={3} 
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-50 text-yellow-800'
                      } ${idx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
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
                  {vendimaTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableHead 
                        key={`${tipo}_${categoria}`} 
                        className={`text-center text-[10px] font-medium ${
                          categoria === 'Mesa' ? 'bg-amber-50 text-amber-700' : ''
                        } ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''
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
                  // Get all castas for this region
                  const regionCastas: { tipo: string; categoria: StockCategoria; casta: string; kg: number }[] = [];
                  
                  vendimaTipos.forEach(tipo => {
                    stockCategorias.forEach(categoria => {
                      const castas = harvestData[regiao]?.[tipo]?.[categoria] || [];
                      castas.forEach(c => {
                        regionCastas.push({ tipo, categoria, casta: c.casta, kg: c.kg });
                      });
                    });
                  });

                  const isPortugal = regiao === 'Portugal';
                  const isExpanded = expandedRegions[regiao] || false;
                  const hasProducts = regionCastas.length > 0;

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
                                ({regionCastas.length} castas)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-500">
                          {isExpanded ? '' : 'Subtotal'}
                        </TableCell>
                        {vendimaTipos.map((tipo, tipoIdx) => (
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell 
                              key={`${tipo}_${categoria}`} 
                              className={`text-right text-xs font-semibold ${
                                categoria === 'Mesa' ? 'bg-amber-50/50' : ''
                              } ${
                                catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''
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

                      {/* Casta detail rows - only show when expanded */}
                      {isExpanded && regionCastas.map((item, idx) => (
                        <TableRow 
                          key={`${regiao}_${item.casta}_${idx}`} 
                          className={`hover:bg-muted/30 ${isPortugal ? 'bg-amber-50/30' : ''}`}
                        >
                          <TableCell className={`text-xs border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50/30' : 'bg-white'}`}>
                          </TableCell>
                          <TableCell className="text-xs py-1 pl-4">{item.casta}</TableCell>
                          {vendimaTipos.map((tipo, tipoIdx) => (
                            stockCategorias.map((categoria, catIdx) => {
                              const isMatch = item.tipo === tipo && item.categoria === categoria;
                              const isMesaColumn = categoria === 'Mesa';
                              
                              return (
                                <TableCell 
                                  key={`${tipo}_${categoria}`} 
                                  className={`text-right text-xs py-1 ${
                                    catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''
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
                                  {isMatch ? formatNumber(item.kg) : '-'}
                                </TableCell>
                              );
                            })
                          ))}
                          <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                            {formatNumber(item.kg)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}

                {/* Grand total row */}
                <TableRow className="bg-purple-100/50 font-bold border-t-4">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-purple-100/50 z-10">
                    TOTAL
                  </TableCell>
                  <TableCell className="text-xs"></TableCell>
                  {vendimaTipos.map((tipo, tipoIdx) => (
                    stockCategorias.map((categoria, catIdx) => (
                      <TableCell 
                        key={`${tipo}_${categoria}_total`} 
                        className={`text-right text-xs font-bold ${
                          categoria === 'Mesa' ? 'bg-amber-100/50' : ''
                        } ${
                          catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''
                        }`}
                      >
                        {formatNumber(columnTotals[tipo][categoria])}
                      </TableCell>
                    ))
                  ))}
                  <TableCell className="text-right text-xs font-bold bg-purple-200/50 border-l-2 text-purple-700">
                    {formatNumber(grandTotal)}
                  </TableCell>
                </TableRow>

                {/* Type totals row */}
                <TableRow className="bg-gray-200 font-bold">
                  <TableCell colSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-gray-200 z-10">
                    Total por Tipo
                  </TableCell>
                  {vendimaTipos.map((tipo, tipoIdx) => (
                    <TableCell 
                      key={`${tipo}_total`} 
                      colSpan={3}
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      } ${tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {formatNumber(getTipoTotal(tipo))} Kg
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
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">Previsão de Vendima em Kg | Regional = Vinhos do Ano | DOC = Reserva + Premium | Mesa = Portugal</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default PrevisaoVendimaPage;
