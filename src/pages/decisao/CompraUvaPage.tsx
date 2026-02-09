import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Grape, Plus, Minus, Settings2, Euro } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { wineRegioes } from '@/data/wineData';

// Same structure as Previsão de Vendima
const vendimaTipos = ['Tinto', 'Branco'] as const;
type VendimaTipo = typeof vendimaTipos[number];

const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

const allRegioes = [...wineRegioes, 'Portugal'];

type Medida = 'kg' | 'litros' | 'euros';

const medidaLabels: Record<Medida, string> = {
  kg: 'Kg',
  litros: 'Litros',
  euros: '€ (Preço)',
};

// Castas data (same as PrevisaoVendima)
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

// Default Kg→Litros conversion ratios (same as PrevisaoVendima)
const defaultRaciosKgL: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>> = {} as any;
allRegioes.forEach(regiao => {
  defaultRaciosKgL[regiao] = {
    'Tinto': { 'Regional': 0.74, 'DOC': 0.74, 'Mesa': 0.74 },
    'Branco': { 'Regional': 0.70, 'DOC': 0.70, 'Mesa': 0.70 }
  };
});

// Default Kg→Euro price ratios
const defaultRaciosKgEuro: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>> = {} as any;
allRegioes.forEach(regiao => {
  defaultRaciosKgEuro[regiao] = {
    'Tinto': { 'Regional': 0.50, 'DOC': 0.50, 'Mesa': 0.50 },
    'Branco': { 'Regional': 0.50, 'DOC': 0.50, 'Mesa': 0.50 }
  };
});

// Seeded random for stable mock data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate purchase data (Kg) per region/type/category/casta
const generatePurchaseData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, { casta: string; kg: number }[]>>> = {};
  let seed = 500;

  allRegioes.forEach(regiao => {
    data[regiao] = {};
    vendimaTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': [], 'DOC': [], 'Mesa': [] };

      const categorias = regiao === 'Portugal' ? ['Mesa'] : ['Regional', 'DOC'];
      categorias.forEach(categoria => {
        const castas = castasPorTipo[tipo][categoria as StockCategoria] || [];
        const numCastas = Math.floor(seededRandom(seed++) * 2) + 1;
        const selectedCastas = castas.slice(0, numCastas);

        selectedCastas.forEach(casta => {
          const baseKg = categoria === 'DOC'
            ? Math.floor(seededRandom(seed++) * 12000) + 3000
            : categoria === 'Mesa'
              ? Math.floor(seededRandom(seed++) * 25000) + 8000
              : Math.floor(seededRandom(seed++) * 20000) + 5000;

          data[regiao][tipo][categoria as StockCategoria].push({ casta, kg: baseKg });
        });
      });
    });
  });

  return data;
};

const purchaseData = generatePurchaseData();

const formatNumber = (num: number) => num.toLocaleString('pt-PT');
const formatCurrency = (num: number) => num.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Rácios Kg→Litros Dialog (shared structure with PrevisaoVendima) ───
const RaciosKgLDialog = ({
  racios,
  onSave
}: {
  racios: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>>;
  onSave: (r: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>>) => void;
}) => {
  const [editRacios, setEditRacios] = useState(() => JSON.parse(JSON.stringify(racios)));

  const updateRacio = (regiao: string, tipo: VendimaTipo, categoria: StockCategoria, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 1) {
      setEditRacios((prev: typeof racios) => ({
        ...prev,
        [regiao]: { ...prev[regiao], [tipo]: { ...prev[regiao][tipo], [categoria]: num } }
      }));
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Rácios de Conversão Kg → Litros</DialogTitle>
        <p className="text-sm text-gray-500">Mesma tabela usada na Previsão de Vendima</p>
      </DialogHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-bold border-r-2 min-w-[120px]">Região</TableHead>
              {vendimaTipos.map((tipo, tipoIdx) =>
                stockCategorias.map((categoria, catIdx) => (
                  <TableHead
                    key={`${tipo}_${categoria}`}
                    className={`text-center text-[10px] font-medium min-w-[70px] ${
                      tipo === 'Tinto' ? 'bg-red-50' : 'bg-yellow-50/50'
                    } ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                  >
                    <div>{tipo}</div>
                    <div className="font-normal">{categoria}</div>
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRegioes.map(regiao => (
              <TableRow key={regiao}>
                <TableCell className="text-xs font-semibold border-r-2">{regiao}</TableCell>
                {vendimaTipos.map((tipo, tipoIdx) =>
                  stockCategorias.map((categoria, catIdx) => (
                    <TableCell
                      key={`${tipo}_${categoria}`}
                      className={`p-1 ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      <Input
                        type="number" step="0.01" min="0" max="1"
                        value={editRacios[regiao][tipo][categoria]}
                        onChange={(e) => updateRacio(regiao, tipo, categoria, e.target.value)}
                        className="h-7 text-xs text-center w-16 mx-auto"
                      />
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild><Button variant="outline" size="sm">Cancelar</Button></DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editRacios)} className="bg-purple-600 hover:bg-purple-700">Guardar Rácios</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ─── Rácios Kg→Euro Dialog ───
const RaciosKgEuroDialog = ({
  racios,
  onSave
}: {
  racios: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>>;
  onSave: (r: Record<string, Record<VendimaTipo, Record<StockCategoria, number>>>) => void;
}) => {
  const [editRacios, setEditRacios] = useState(() => JSON.parse(JSON.stringify(racios)));

  const updateRacio = (regiao: string, tipo: VendimaTipo, categoria: StockCategoria, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setEditRacios((prev: typeof racios) => ({
        ...prev,
        [regiao]: { ...prev[regiao], [tipo]: { ...prev[regiao][tipo], [categoria]: num } }
      }));
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <Euro className="w-5 h-5 text-green-600" />
          Rácios de Preço Kg → Euro
        </DialogTitle>
        <p className="text-sm text-gray-500">Preço por Kg de uva, por região, tipo e classificação (defeito: 0,50 €/Kg)</p>
      </DialogHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-bold border-r-2 min-w-[120px]">Região</TableHead>
              {vendimaTipos.map((tipo, tipoIdx) =>
                stockCategorias.map((categoria, catIdx) => (
                  <TableHead
                    key={`${tipo}_${categoria}`}
                    className={`text-center text-[10px] font-medium min-w-[70px] ${
                      tipo === 'Tinto' ? 'bg-red-50' : 'bg-yellow-50/50'
                    } ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                  >
                    <div>{tipo}</div>
                    <div className="font-normal">{categoria}</div>
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRegioes.map(regiao => (
              <TableRow key={regiao}>
                <TableCell className="text-xs font-semibold border-r-2">{regiao}</TableCell>
                {vendimaTipos.map((tipo, tipoIdx) =>
                  stockCategorias.map((categoria, catIdx) => (
                    <TableCell
                      key={`${tipo}_${categoria}`}
                      className={`p-1 ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      <Input
                        type="number" step="0.01" min="0"
                        value={editRacios[regiao][tipo][categoria]}
                        onChange={(e) => updateRacio(regiao, tipo, categoria, e.target.value)}
                        className="h-7 text-xs text-center w-16 mx-auto"
                      />
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild><Button variant="outline" size="sm">Cancelar</Button></DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editRacios)} className="bg-green-600 hover:bg-green-700">Guardar Preços</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ─── Main Page Component ───
const CompraUvaPage = () => {
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [medida, setMedida] = useState<Medida>('kg');
  const [raciosKgL, setRaciosKgL] = useState(() => JSON.parse(JSON.stringify(defaultRaciosKgL)));
  const [raciosKgEuro, setRaciosKgEuro] = useState(() => JSON.parse(JSON.stringify(defaultRaciosKgEuro)));

  const toggleRegion = (regiao: string) => {
    setExpandedRegions(prev => ({ ...prev, [regiao]: !prev[regiao] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    allRegioes.forEach(r => { all[r] = true; });
    setExpandedRegions(all);
  };

  const collapseAll = () => setExpandedRegions({});

  // Convert kg to the selected measure
  const convertValue = (kg: number, regiao: string, tipo: string, categoria: StockCategoria): number => {
    if (medida === 'kg') return kg;
    if (medida === 'litros') {
      const ratio = raciosKgL[regiao]?.[tipo]?.[categoria] ?? (tipo === 'Tinto' ? 0.74 : 0.70);
      return Math.round(kg * ratio);
    }
    // euros
    const pricePerKg = raciosKgEuro[regiao]?.[tipo]?.[categoria] ?? 0.50;
    return kg * pricePerKg;
  };

  const { totals, rowTotals, columnTotals, grandTotal } = useMemo(() => {
    const totals: Record<string, Record<string, number>> = {};
    const rowTotals: Record<string, number> = {};
    const columnTotals: Record<string, Record<StockCategoria, number>> = {};

    vendimaTipos.forEach(tipo => {
      columnTotals[tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });

    allRegioes.forEach(regiao => {
      totals[regiao] = {};
      rowTotals[regiao] = 0;

      vendimaTipos.forEach(tipo => {
        stockCategorias.forEach(categoria => {
          const castas = purchaseData[regiao]?.[tipo]?.[categoria] || [];
          const sum = castas.reduce((acc, c) => acc + convertValue(c.kg, regiao, tipo, categoria), 0);
          totals[regiao][`${tipo}_${categoria}`] = sum;
          rowTotals[regiao] += sum;
          columnTotals[tipo][categoria] += sum;
        });
      });
    });

    const grandTotal = Object.values(rowTotals).reduce((acc, val) => acc + val, 0);
    return { totals, rowTotals, columnTotals, grandTotal };
  }, [medida, raciosKgL, raciosKgEuro]);

  const getTipoTotal = (tipo: string) => {
    return Object.values(columnTotals[tipo]).reduce((acc, val) => acc + val, 0);
  };

  const unitLabel = medida === 'kg' ? 'Kg' : medida === 'litros' ? 'L' : '€';
  const isEuros = medida === 'euros';
  const fmt = (v: number) => isEuros ? formatCurrency(v) : formatNumber(v);

  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Grape className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Compra de Uva</h1>
              <p className="text-sm text-gray-500">
                Quadro de compras por região, tipo e casta (em {unitLabel})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Medida selector */}
              {(['kg', 'litros', 'euros'] as Medida[]).map(m => (
                <Button
                  key={m}
                  variant={medida === m ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMedida(m)}
                  className={`text-xs h-7 ${medida === m ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {medidaLabels[m]}
                </Button>
              ))}
              <span className="text-gray-300">|</span>
              {/* Rácios Kg→L */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Settings2 className="w-3 h-3 mr-1" />
                    Rácios Kg/L
                  </Button>
                </DialogTrigger>
                <RaciosKgLDialog racios={raciosKgL} onSave={setRaciosKgL} />
              </Dialog>
              {/* Rácios Kg→Euro */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7 border-green-300 text-green-700 hover:bg-green-50">
                    <Euro className="w-3 h-3 mr-1" />
                    Rácios Kg/€
                  </Button>
                </DialogTrigger>
                <RaciosKgEuroDialog racios={raciosKgEuro} onSave={setRaciosKgEuro} />
              </Dialog>
              <span className="text-gray-300">|</span>
              <Button variant="outline" size="sm" onClick={expandAll} className="text-xs h-7">
                <Plus className="w-3 h-3 mr-1" /> Expandir
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs h-7">
                <Minus className="w-3 h-3 mr-1" /> Colapsar
              </Button>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Total Compras</span>
              <div className="text-lg font-bold text-green-600">{fmt(grandTotal)} {unitLabel}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
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
                        tipo === 'Tinto' ? 'bg-red-100 text-red-800' : 'bg-yellow-50 text-yellow-800'
                      } ${idx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {tipo}
                    </TableHead>
                  ))}
                  <TableHead rowSpan={2} className="text-center text-xs font-bold bg-gray-200 border-l-2 min-w-[100px]">
                    Total Linha
                  </TableHead>
                </TableRow>
                <TableRow className="bg-muted/30">
                  {vendimaTipos.map((tipo, tipoIdx) =>
                    stockCategorias.map((categoria, catIdx) => (
                      <TableHead
                        key={`${tipo}_${categoria}`}
                        className={`text-center text-[10px] font-medium ${
                          categoria === 'Mesa' ? 'bg-amber-50 text-amber-700' : ''
                        } ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        {categoria}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRegioes.map((regiao) => {
                  const regionCastas: { tipo: string; categoria: StockCategoria; casta: string; kg: number }[] = [];
                  vendimaTipos.forEach(tipo => {
                    stockCategorias.forEach(categoria => {
                      const castas = purchaseData[regiao]?.[tipo]?.[categoria] || [];
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
                      {/* Region row */}
                      <TableRow
                        key={regiao}
                        className={`font-medium border-t cursor-pointer hover:bg-muted/50 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}
                        onClick={() => hasProducts && toggleRegion(regiao)}
                      >
                        <TableCell className={`text-xs font-bold border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            {hasProducts && (
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-gray-200"
                                onClick={(e) => { e.stopPropagation(); toggleRegion(regiao); }}>
                                {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              </Button>
                            )}
                            <span>{regiao}</span>
                            {hasProducts && (
                              <span className="text-[10px] text-gray-400 font-normal">({regionCastas.length} castas)</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-500">
                          {isExpanded ? '' : 'Subtotal'}
                        </TableCell>
                        {vendimaTipos.map((tipo, tipoIdx) =>
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell
                              key={`${tipo}_${categoria}`}
                              className={`text-right text-xs font-semibold ${
                                categoria === 'Mesa' ? 'bg-amber-50/50' : ''
                              } ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                            >
                              {totals[regiao][`${tipo}_${categoria}`] > 0
                                ? fmt(totals[regiao][`${tipo}_${categoria}`]) : '-'}
                            </TableCell>
                          ))
                        )}
                        <TableCell className="text-right text-xs font-bold bg-gray-100 border-l-2">
                          {fmt(rowTotals[regiao])}
                        </TableCell>
                      </TableRow>

                      {/* Casta detail rows */}
                      {isExpanded && regionCastas.map((item, idx) => (
                        <TableRow
                          key={`${regiao}_${item.casta}_${idx}`}
                          className={`hover:bg-muted/30 ${isPortugal ? 'bg-amber-50/30' : ''}`}
                        >
                          <TableCell className={`text-xs border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50/30' : 'bg-white'}`} />
                          <TableCell className="text-xs py-1 pl-4">{item.casta}</TableCell>
                          {vendimaTipos.map((tipo, tipoIdx) =>
                            stockCategorias.map((categoria, catIdx) => {
                              const isMatch = item.tipo === tipo && item.categoria === categoria;
                              const isMesaColumn = categoria === 'Mesa';
                              const displayValue = isMatch ? convertValue(item.kg, regiao, tipo, categoria) : 0;

                              return (
                                <TableCell
                                  key={`${tipo}_${categoria}`}
                                  className={`text-right text-xs py-1 ${
                                    catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''
                                  } ${isMatch
                                      ? isMesaColumn ? 'bg-amber-100 font-medium'
                                        : tipo === 'Tinto' ? 'bg-red-50 font-medium'
                                        : 'bg-yellow-50/50 font-medium'
                                      : isMesaColumn ? 'bg-amber-50/30' : ''}`}
                                >
                                  {isMatch ? fmt(displayValue) : '-'}
                                </TableCell>
                              );
                            })
                          )}
                          <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                            {fmt(convertValue(item.kg, regiao, item.tipo, item.categoria))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}

                {/* Grand total row */}
                <TableRow className="bg-green-100/50 font-bold border-t-4">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-green-100/50 z-10">TOTAL</TableCell>
                  <TableCell className="text-xs"></TableCell>
                  {vendimaTipos.map((tipo, tipoIdx) =>
                    stockCategorias.map((categoria, catIdx) => (
                      <TableCell
                        key={`${tipo}_${categoria}_total`}
                        className={`text-right text-xs font-bold ${
                          categoria === 'Mesa' ? 'bg-amber-100/50' : ''
                        } ${catIdx === stockCategorias.length - 1 && tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        {fmt(columnTotals[tipo][categoria])}
                      </TableCell>
                    ))
                  )}
                  <TableCell className="text-right text-xs font-bold bg-green-200/50 border-l-2 text-green-700">
                    {fmt(grandTotal)}
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
                        tipo === 'Tinto' ? 'bg-red-200 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      } ${tipoIdx < vendimaTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {fmt(getTipoTotal(tipo))} {unitLabel}
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
            <span>Tinto (rácio L: 0.74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-50 border border-yellow-300"></div>
            <span>Branco (rácio L: 0.70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
            <span>Preço defeito: 0,50 €/Kg</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">
            A mostrar valores em {medidaLabels[medida]} | Regional = Vinhos do Ano | DOC = Reserva + Premium | Mesa = Portugal
          </span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default CompraUvaPage;
