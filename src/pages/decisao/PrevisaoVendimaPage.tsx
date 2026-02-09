import { useState } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Grape, Plus, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  castasRegioes, 
  castasTintas, 
  castasBrancas, 
  regiaoToCastas,
  generateHarvestData,
  type CastaRegiao,
  type CastaTinta,
  type CastaBranca
} from '@/data/castaData';

// Generate harvest data
const harvestData = generateHarvestData();

// Calculate totals
const calculateTotals = () => {
  const rowTotals: Record<CastaRegiao, { tintas: number; brancas: number; total: number }> = {} as any;
  const castaTintaTotals: Record<CastaTinta, number> = {} as any;
  const castaBrancaTotals: Record<CastaBranca, number> = {} as any;
  
  // Initialize casta totals
  castasTintas.forEach(casta => { castaTintaTotals[casta] = 0; });
  castasBrancas.forEach(casta => { castaBrancaTotals[casta] = 0; });
  
  let grandTotalTintas = 0;
  let grandTotalBrancas = 0;
  
  castasRegioes.forEach(regiao => {
    let regionTintaTotal = 0;
    let regionBrancaTotal = 0;
    
    // Sum tintas for region
    Object.entries(harvestData[regiao].tintas).forEach(([casta, kg]) => {
      regionTintaTotal += kg;
      castaTintaTotals[casta as CastaTinta] += kg;
    });
    
    // Sum brancas for region
    Object.entries(harvestData[regiao].brancas).forEach(([casta, kg]) => {
      regionBrancaTotal += kg;
      castaBrancaTotals[casta as CastaBranca] += kg;
    });
    
    rowTotals[regiao] = {
      tintas: regionTintaTotal,
      brancas: regionBrancaTotal,
      total: regionTintaTotal + regionBrancaTotal
    };
    
    grandTotalTintas += regionTintaTotal;
    grandTotalBrancas += regionBrancaTotal;
  });
  
  return { 
    rowTotals, 
    castaTintaTotals, 
    castaBrancaTotals,
    grandTotalTintas,
    grandTotalBrancas,
    grandTotal: grandTotalTintas + grandTotalBrancas
  };
};

const { rowTotals, castaTintaTotals, castaBrancaTotals, grandTotalTintas, grandTotalBrancas, grandTotal } = calculateTotals();

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
    castasRegioes.forEach(r => { allExpanded[r] = true; });
    setExpandedRegions(allExpanded);
  };

  const collapseAll = () => {
    setExpandedRegions({});
  };

  // Get all castas for a region with their values
  const getRegionCastas = (regiao: CastaRegiao) => {
    const castas: { casta: string; tipo: 'tinta' | 'branca'; kg: number }[] = [];
    
    Object.entries(harvestData[regiao].tintas).forEach(([casta, kg]) => {
      castas.push({ casta, tipo: 'tinta', kg });
    });
    
    Object.entries(harvestData[regiao].brancas).forEach(([casta, kg]) => {
      castas.push({ casta, tipo: 'branca', kg });
    });
    
    return castas;
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
              <p className="text-sm text-gray-500">Matriz de previsão por região e casta (em Kg)</p>
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
                {/* First header row - Grape Types */}
                <TableRow className="bg-muted/50 border-b-2">
                  <TableHead rowSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-muted/50 z-10 min-w-[140px]">
                    Região
                  </TableHead>
                  <TableHead rowSpan={2} className="text-xs font-bold border-r min-w-[160px]">
                    Casta
                  </TableHead>
                  <TableHead 
                    colSpan={castasTintas.length} 
                    className="text-center text-xs font-bold bg-red-100 text-red-800 border-r-2"
                  >
                    Castas Tintas
                  </TableHead>
                  <TableHead 
                    colSpan={castasBrancas.length} 
                    className="text-center text-xs font-bold bg-amber-50 text-amber-800 border-r-2"
                  >
                    Castas Brancas
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center text-xs font-bold bg-gray-200 min-w-[100px]">
                    Total Linha
                  </TableHead>
                </TableRow>
                {/* Second header row - Individual Castas */}
                <TableRow className="bg-muted/30">
                  {castasTintas.map((casta, idx) => (
                    <TableHead 
                      key={casta} 
                      className={`text-center text-[9px] font-medium min-w-[70px] bg-red-50/50 ${
                        idx === castasTintas.length - 1 ? 'border-r-2' : ''
                      }`}
                    >
                      <div className="truncate" title={casta}>
                        {casta.split(' ').map(w => w.substring(0, 4)).join(' ')}
                      </div>
                    </TableHead>
                  ))}
                  {castasBrancas.map((casta, idx) => (
                    <TableHead 
                      key={casta} 
                      className={`text-center text-[9px] font-medium min-w-[70px] bg-amber-50/30 ${
                        idx === castasBrancas.length - 1 ? 'border-r-2' : ''
                      }`}
                    >
                      <div className="truncate" title={casta}>
                        {casta.split(' ').map(w => w.substring(0, 4)).join(' ')}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {castasRegioes.map((regiao) => {
                  const regionCastas = getRegionCastas(regiao);
                  const isExpanded = expandedRegions[regiao] || false;
                  const hasProducts = regionCastas.length > 0;

                  return (
                    <>
                      {/* Region header/summary row */}
                      <TableRow 
                        key={regiao} 
                        className="font-medium border-t cursor-pointer hover:bg-muted/50 bg-gray-50"
                        onClick={() => hasProducts && toggleRegion(regiao)}
                      >
                        <TableCell className="text-xs font-bold border-r-2 sticky left-0 z-10 bg-gray-50">
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
                                ({regionCastas.length})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-500">
                          {isExpanded ? '' : 'Subtotal'}
                        </TableCell>
                        {/* Tinta columns - subtotals */}
                        {castasTintas.map((casta, idx) => {
                          const value = harvestData[regiao].tintas[casta] || 0;
                          return (
                            <TableCell 
                              key={casta} 
                              className={`text-right text-xs font-semibold bg-red-50/30 ${
                                idx === castasTintas.length - 1 ? 'border-r-2' : ''
                              }`}
                            >
                              {value > 0 ? formatNumber(value) : '-'}
                            </TableCell>
                          );
                        })}
                        {/* Branca columns - subtotals */}
                        {castasBrancas.map((casta, idx) => {
                          const value = harvestData[regiao].brancas[casta] || 0;
                          return (
                            <TableCell 
                              key={casta} 
                              className={`text-right text-xs font-semibold bg-amber-50/30 ${
                                idx === castasBrancas.length - 1 ? 'border-r-2' : ''
                              }`}
                            >
                              {value > 0 ? formatNumber(value) : '-'}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right text-xs font-bold bg-gray-100">
                          {formatNumber(rowTotals[regiao].total)}
                        </TableCell>
                      </TableRow>

                      {/* Casta detail rows - only show when expanded */}
                      {isExpanded && regionCastas.map((item) => (
                        <TableRow 
                          key={`${regiao}_${item.casta}`} 
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-xs border-r-2 sticky left-0 z-10 bg-white">
                          </TableCell>
                          <TableCell className="text-xs py-1 pl-4">{item.casta}</TableCell>
                          {/* Tinta columns */}
                          {castasTintas.map((casta, idx) => {
                            const isMatch = item.tipo === 'tinta' && item.casta === casta;
                            return (
                              <TableCell 
                                key={casta} 
                                className={`text-right text-xs py-1 ${
                                  idx === castasTintas.length - 1 ? 'border-r-2' : ''
                                } ${isMatch ? 'bg-red-100 font-medium' : ''}`}
                              >
                                {isMatch ? formatNumber(item.kg) : '-'}
                              </TableCell>
                            );
                          })}
                          {/* Branca columns */}
                          {castasBrancas.map((casta, idx) => {
                            const isMatch = item.tipo === 'branca' && item.casta === casta;
                            return (
                              <TableCell 
                                key={casta} 
                                className={`text-right text-xs py-1 ${
                                  idx === castasBrancas.length - 1 ? 'border-r-2' : ''
                                } ${isMatch ? 'bg-amber-100 font-medium' : ''}`}
                              >
                                {isMatch ? formatNumber(item.kg) : '-'}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right text-xs py-1 bg-gray-50 font-medium">
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
                  {castasTintas.map((casta, idx) => (
                    <TableCell 
                      key={casta} 
                      className={`text-right text-xs font-bold bg-red-100/50 ${
                        idx === castasTintas.length - 1 ? 'border-r-2' : ''
                      }`}
                    >
                      {castaTintaTotals[casta] > 0 ? formatNumber(castaTintaTotals[casta]) : '-'}
                    </TableCell>
                  ))}
                  {castasBrancas.map((casta, idx) => (
                    <TableCell 
                      key={casta} 
                      className={`text-right text-xs font-bold bg-amber-100/50 ${
                        idx === castasBrancas.length - 1 ? 'border-r-2' : ''
                      }`}
                    >
                      {castaBrancaTotals[casta] > 0 ? formatNumber(castaBrancaTotals[casta]) : '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right text-xs font-bold bg-purple-200/50 text-purple-700">
                    {formatNumber(grandTotal)}
                  </TableCell>
                </TableRow>

                {/* Type totals row */}
                <TableRow className="bg-gray-200 font-bold">
                  <TableCell colSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-gray-200 z-10">
                    Total por Tipo
                  </TableCell>
                  <TableCell 
                    colSpan={castasTintas.length}
                    className="text-center text-xs font-bold bg-red-200 text-red-800 border-r-2"
                  >
                    {formatNumber(grandTotalTintas)} Kg
                  </TableCell>
                  <TableCell 
                    colSpan={castasBrancas.length}
                    className="text-center text-xs font-bold bg-amber-100 text-amber-800 border-r-2"
                  >
                    {formatNumber(grandTotalBrancas)} Kg
                  </TableCell>
                  <TableCell className="bg-gray-300"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
            <span>Castas Tintas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></div>
            <span>Castas Brancas</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">Valores em Kg previstos para a vindima</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default PrevisaoVendimaPage;
