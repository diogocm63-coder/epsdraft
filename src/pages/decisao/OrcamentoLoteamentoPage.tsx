import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { ClipboardList, Plus, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { wineProducts, wineRegioes, wineTipos } from '@/data/wineData';

const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

const allRegioes = [...wineRegioes, 'Portugal'];

const formatNumber = (num: number) => num.toLocaleString('pt-PT', { maximumFractionDigits: 0 });

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ── Generate Previsão de Vendima data (litros) ──
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

// ── Generate Compras de Uva data (litros) ──
const generateCompraUvaData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, number>>> = {};
  let seed = 300;
  allRegioes.forEach(regiao => {
    data[regiao] = {};
    wineTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });
  });
  wineProducts.forEach(product => {
    const isDOC = product.categoria === 'Reserva' || product.categoria === 'Premium';
    const targetCategoria: StockCategoria = isDOC ? 'DOC' : 'Regional';
    const baseLitros = Math.floor(seededRandom(seed++) * 20000) + 5000;
    if (data[product.regiao]?.[product.tipo]) {
      data[product.regiao][product.tipo][targetCategoria] += baseLitros;
    }
  });
  data['Portugal']['Tinto']['Mesa'] = Math.floor(seededRandom(seed++) * 40000) + 10000;
  data['Portugal']['Branco']['Mesa'] = Math.floor(seededRandom(seed++) * 40000) + 10000;
  data['Portugal']['Rosé']['Mesa'] = Math.floor(seededRandom(seed++) * 20000) + 5000;
  return data;
};

// ── Generate Compras de Vinho data (litros) ──
const generateCompraVinhoData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, number>>> = {};
  let seed = 400;
  allRegioes.forEach(regiao => {
    data[regiao] = {};
    wineTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });
  });
  wineProducts.forEach(product => {
    const isDOC = product.categoria === 'Reserva' || product.categoria === 'Premium';
    const targetCategoria: StockCategoria = isDOC ? 'DOC' : 'Regional';
    const baseLitros = Math.floor(seededRandom(seed++) * 8000) + 2000;
    if (data[product.regiao]?.[product.tipo]) {
      data[product.regiao][product.tipo][targetCategoria] += baseLitros;
    }
  });
  data['Portugal']['Tinto']['Mesa'] = Math.floor(seededRandom(seed++) * 15000) + 5000;
  data['Portugal']['Branco']['Mesa'] = Math.floor(seededRandom(seed++) * 15000) + 5000;
  data['Portugal']['Rosé']['Mesa'] = Math.floor(seededRandom(seed++) * 10000) + 3000;
  return data;
};

const vendimaData = generateVendimaData();
const compraUvaData = generateCompraUvaData();
const compraVinhoData = generateCompraVinhoData();

type MeasureUnit = 'L' | 'Kg' | '€';

const defaultKgPerLitro: Record<string, number> = {
  'Tinto': 1 / 0.74,
  'Branco': 1 / 0.70,
  'Rosé': 1 / 0.72,
};
const defaultEuroPerLitro = 0.50;

const OrcamentoLoteamentoPage = () => {
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

  const toggleRegion = (regiao: string) => {
    setExpandedRegions(prev => ({ ...prev, [regiao]: !prev[regiao] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    allRegioes.forEach(r => { allExpanded[r] = true; });
    setExpandedRegions(allExpanded);
  };

  const collapseAll = () => setExpandedRegions({});

  const calculated = useMemo(() => {
    type CellData = {
      prevVendima: number;
      compraUva: number;
      totalTransformado: number;
      compraVinho: number;
      totalLoteamento: number;
    };
    const result: Record<string, Record<string, CellData>> = {};
    const rowTotals: Record<string, CellData> = {};
    const colTotals: Record<string, Record<StockCategoria, CellData>> = {};

    wineTipos.forEach(tipo => {
      colTotals[tipo] = {} as any;
      stockCategorias.forEach(cat => {
        colTotals[tipo][cat] = { prevVendima: 0, compraUva: 0, totalTransformado: 0, compraVinho: 0, totalLoteamento: 0 };
      });
    });

    allRegioes.forEach(regiao => {
      result[regiao] = {};
      rowTotals[regiao] = { prevVendima: 0, compraUva: 0, totalTransformado: 0, compraVinho: 0, totalLoteamento: 0 };

      wineTipos.forEach(tipo => {
        stockCategorias.forEach(categoria => {
          const prevVendima = vendimaData[regiao]?.[tipo]?.[categoria] || 0;
          const compraUva = compraUvaData[regiao]?.[tipo]?.[categoria] || 0;
          const totalTransformado = prevVendima + compraUva;
          const compraVinho = compraVinhoData[regiao]?.[tipo]?.[categoria] || 0;
          const totalLoteamento = totalTransformado + compraVinho;

          const key = `${tipo}_${categoria}`;
          result[regiao][key] = { prevVendima, compraUva, totalTransformado, compraVinho, totalLoteamento };

          const keys: (keyof CellData)[] = ['prevVendima', 'compraUva', 'totalTransformado', 'compraVinho', 'totalLoteamento'];
          keys.forEach(k => {
            rowTotals[regiao][k] += result[regiao][key][k];
            colTotals[tipo][categoria][k] += result[regiao][key][k];
          });
        });
      });
    });

    const grandTotal = Object.values(rowTotals).reduce(
      (acc, v) => ({
        prevVendima: acc.prevVendima + v.prevVendima,
        compraUva: acc.compraUva + v.compraUva,
        totalTransformado: acc.totalTransformado + v.totalTransformado,
        compraVinho: acc.compraVinho + v.compraVinho,
        totalLoteamento: acc.totalLoteamento + v.totalLoteamento,
      }),
      { prevVendima: 0, compraUva: 0, totalTransformado: 0, compraVinho: 0, totalLoteamento: 0 }
    );

    return { result, rowTotals, colTotals, grandTotal };
  }, []);

  const fields = [
    { key: 'prevVendima', label: 'Prev. Vendima', color: 'bg-green-50' },
    { key: 'compraUva', label: 'Compra Uva', color: 'bg-purple-50' },
    { key: 'totalTransformado', label: 'Total Transf.', color: 'bg-amber-50 font-semibold' },
    { key: 'compraVinho', label: 'Compra Vinho', color: 'bg-pink-50' },
    { key: 'totalLoteamento', label: 'Total Loteam.', color: 'bg-orange-50 font-bold' },
  ] as const;

  const unitLabel = selectedUnit === 'L' ? 'L' : selectedUnit === 'Kg' ? 'Kg' : '€';

  const convertValue = (valueLitros: number, tipo: string): number => {
    if (selectedUnit === 'L') return valueLitros;
    if (selectedUnit === 'Kg') return Math.round(valueLitros * (defaultKgPerLitro[tipo] || 1.35));
    return Math.round(valueLitros * defaultEuroPerLitro);
  };

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
              <h1 className="text-xl font-bold text-gray-800">Orçamento de Loteamento</h1>
              <p className="text-sm text-gray-500">Total Loteamento = Total Transformado (Prev. Vendima + Compra Uva) + Compra Vinho ({unitLabel})</p>
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
              <span className="text-xs text-gray-400">Total Loteamento</span>
              <div className="text-lg font-bold text-eps-primary">{formatDisplay(convertTotal(calculated.grandTotal.totalLoteamento))}</div>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
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
                        Total Lot.
                      </TableHead>
                    )
                  )}
                </TableRow>
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
                            {expandedRegions[regiao] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
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
                                {cellData && cellData[field.key as keyof typeof cellData] > 0 ? formatDisplay(convertValue(cellData[field.key as keyof typeof cellData], tipo)) : '-'}
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
                                return sum + (cd?.totalLoteamento || 0);
                              }, 0), tipo
                            ))}
                          </TableCell>
                        )
                      )}
                      <TableCell className="text-right text-[10px] font-bold bg-gray-100 border-l-2">
                        {formatDisplay(convertTotal(calculated.rowTotals[regiao].totalLoteamento))}
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
                            {ct && ct[field.key as keyof typeof ct] > 0 ? formatDisplay(convertValue(ct[field.key as keyof typeof ct], tipo)) : '-'}
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
                            return sum + (ct?.totalLoteamento || 0);
                          }, 0), tipo
                        ))}
                      </TableCell>
                    )
                  )}
                  <TableCell className="text-right text-[10px] font-bold bg-eps-primary/20 border-l-2 text-eps-primary">
                    {formatDisplay(convertTotal(calculated.grandTotal.totalLoteamento))}
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
          <span className="text-gray-400 italic">Fórmula: Total Loteamento = (Prev. Vendima + Compra Uva) + Compra Vinho</span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default OrcamentoLoteamentoPage;
