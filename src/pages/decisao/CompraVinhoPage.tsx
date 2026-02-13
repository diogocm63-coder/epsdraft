import { useState, useMemo } from 'react';
import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Wine, Plus, Minus, Euro, Users, Trash2, CalendarDays, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { wineRegioes, wineTipos } from '@/data/wineData';

const vinhoTipos = wineTipos as readonly string[];

const stockCategorias = ['Regional', 'DOC', 'Mesa'] as const;
type StockCategoria = typeof stockCategorias[number];

const allRegioes = [...wineRegioes, 'Portugal'];

type Medida = 'litros' | 'euros';

const medidaLabels: Record<Medida, string> = {
  litros: 'Litros',
  euros: '€ (Preço)',
};

// Default Lt→Euro price ratios (€/L)
const defaultRaciosLtEuro: Record<string, Record<string, Record<StockCategoria, number>>> = {} as any;
allRegioes.forEach(regiao => {
  defaultRaciosLtEuro[regiao] = {};
  vinhoTipos.forEach(tipo => {
    defaultRaciosLtEuro[regiao][tipo] = { 'Regional': 0.50, 'DOC': 0.50, 'Mesa': 0.50 };
  });
});

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const fornecedoresPorTipo: Record<string, Record<StockCategoria, string[]>> = {
  'Tinto': {
    'Regional': ['Adega Cooperativa do Dão', 'Caves do Monte'],
    'DOC': ['Quinta do Noval', 'Caves da Raposeira'],
    'Mesa': ['Vinícola do Sul']
  },
  'Branco': {
    'Regional': ['Quinta da Aveleda', 'Adega de Monção'],
    'DOC': ['Casa de Saima', 'Quinta dos Roques'],
    'Mesa': ['Cooperativa do Ribatejo']
  },
  'Rosé': {
    'Regional': ['Herdade do Esporão'],
    'DOC': ['Quinta do Ameal'],
    'Mesa': ['Adega de Palmela']
  },
};

const generatePurchaseData = () => {
  const data: Record<string, Record<string, Record<StockCategoria, { fornecedor: string; litros: number }[]>>> = {};
  let seed = 700;

  allRegioes.forEach(regiao => {
    data[regiao] = {};
    vinhoTipos.forEach(tipo => {
      data[regiao][tipo] = { 'Regional': [], 'DOC': [], 'Mesa': [] };
      const categorias = regiao === 'Portugal' ? ['Mesa'] : ['Regional', 'DOC'];
      categorias.forEach(categoria => {
        const fornecedores = fornecedoresPorTipo[tipo]?.[categoria as StockCategoria] || [];
        const numItems = Math.min(fornecedores.length, Math.floor(seededRandom(seed++) * 2) + 1);
        const selected = fornecedores.slice(0, numItems);
        selected.forEach(fornecedor => {
          const baseLitros = categoria === 'DOC'
            ? Math.floor(seededRandom(seed++) * 10000) + 2000
            : categoria === 'Mesa'
              ? Math.floor(seededRandom(seed++) * 20000) + 5000
              : Math.floor(seededRandom(seed++) * 15000) + 3000;
          data[regiao][tipo][categoria as StockCategoria].push({ fornecedor, litros: baseLitros });
        });
      });
    });
  });
  return data;
};

const purchaseData = generatePurchaseData();

const formatNumber = (num: number) => num.toLocaleString('pt-PT');
const formatCurrency = (num: number) => num.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Rácios Lt→Euro Dialog ───
const RaciosLtEuroDialog = ({
  racios,
  onSave
}: {
  racios: Record<string, Record<string, Record<StockCategoria, number>>>;
  onSave: (r: Record<string, Record<string, Record<StockCategoria, number>>>) => void;
}) => {
  const [editRacios, setEditRacios] = useState(() => JSON.parse(JSON.stringify(racios)));

  const updateRacio = (regiao: string, tipo: string, categoria: StockCategoria, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setEditRacios((prev: typeof racios) => ({
        ...prev,
        [regiao]: { ...prev[regiao], [tipo]: { ...prev[regiao][tipo], [categoria]: num } }
      }));
    }
  };

  return (
    <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <Euro className="w-5 h-5 text-green-600" />
          Rácios de Preço Litro → Euro
        </DialogTitle>
        <p className="text-sm text-gray-500">Preço por Litro de vinho, por região, tipo e classificação (defeito: 0,50 €/L)</p>
      </DialogHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-bold border-r-2 min-w-[120px]">Região</TableHead>
              {vinhoTipos.map((tipo, tipoIdx) =>
                stockCategorias.map((categoria, catIdx) => (
                  <TableHead
                    key={`${tipo}_${categoria}`}
                    className={`text-center text-[10px] font-medium min-w-[60px] ${
                      tipo === 'Tinto' ? 'bg-red-50' : tipo === 'Branco' ? 'bg-yellow-50/50' : 'bg-pink-50'
                    } ${catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
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
                {vinhoTipos.map((tipo, tipoIdx) =>
                  stockCategorias.map((categoria, catIdx) => (
                    <TableCell
                      key={`${tipo}_${categoria}`}
                      className={`p-1 ${catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      <Input
                        type="number" step="0.01" min="0"
                        value={editRacios[regiao][tipo][categoria]}
                        onChange={(e) => updateRacio(regiao, tipo, categoria, e.target.value)}
                        className="h-7 text-xs text-center w-14 mx-auto"
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

// ─── Fornecedores Types ───
interface FornecedorEntry {
  nome: string;
  qtdLitros: number;
}

type FornecedoresData = Record<string, Record<string, Record<StockCategoria, FornecedorEntry[]>>>;

// ─── Fornecedores Dialog ───
const FornecedoresDialog = ({
  fornecedores,
  onSave,
  plannedTotals,
}: {
  fornecedores: FornecedoresData;
  onSave: (f: FornecedoresData) => void;
  plannedTotals: Record<string, Record<string, Record<StockCategoria, number>>>;
}) => {
  const [editData, setEditData] = useState<FornecedoresData>(() => JSON.parse(JSON.stringify(fornecedores)));
  const [selectedRegiao, setSelectedRegiao] = useState<string>(allRegioes[0]);
  const [selectedTipo, setSelectedTipo] = useState<string>('Tinto');

  const addFornecedor = (regiao: string, tipo: string, categoria: StockCategoria) => {
    setEditData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[regiao]) updated[regiao] = {};
      if (!updated[regiao][tipo]) updated[regiao][tipo] = { 'Regional': [], 'DOC': [], 'Mesa': [] };
      updated[regiao][tipo][categoria].push({ nome: '', qtdLitros: 0 });
      return updated;
    });
  };

  const removeFornecedor = (regiao: string, tipo: string, categoria: StockCategoria, idx: number) => {
    setEditData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[regiao][tipo][categoria].splice(idx, 1);
      return updated;
    });
  };

  const updateFornecedor = (regiao: string, tipo: string, categoria: StockCategoria, idx: number, field: 'nome' | 'qtdLitros', value: string) => {
    setEditData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (field === 'nome') {
        updated[regiao][tipo][categoria][idx].nome = value;
      } else {
        updated[regiao][tipo][categoria][idx].qtdLitros = Math.max(0, Number(value) || 0);
      }
      return updated;
    });
  };

  const getEntries = (regiao: string, tipo: string, categoria: StockCategoria): FornecedorEntry[] => {
    return editData[regiao]?.[tipo]?.[categoria] || [];
  };

  const totalFornecedores = () => {
    let count = 0;
    Object.values(editData).forEach(tipos => {
      Object.values(tipos).forEach(cats => {
        Object.values(cats).forEach(entries => {
          count += (entries as FornecedorEntry[]).filter(e => e.nome.trim() !== '').length;
        });
      });
    });
    return count;
  };

  const categorias = selectedRegiao === 'Portugal' ? ['Mesa' as StockCategoria] : ['Regional' as StockCategoria, 'DOC' as StockCategoria];

  return (
    <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Fornecedores de Vinho
        </DialogTitle>
        <p className="text-sm text-gray-500">
          Identifique os fornecedores e quantidades previstas (Litros) por região, tipo e categoria
          {totalFornecedores() > 0 && <span className="ml-2 text-purple-600 font-medium">({totalFornecedores()} fornecedores registados)</span>}
        </p>
      </DialogHeader>

      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Região:</span>
          <div className="flex flex-wrap gap-1">
            {allRegioes.map(r => (
              <Button
                key={r}
                variant={selectedRegiao === r ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegiao(r)}
                className={`text-[10px] h-6 px-2 ${selectedRegiao === r ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Tipo:</span>
          {vinhoTipos.map(t => (
            <Button
              key={t}
              variant={selectedTipo === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTipo(t)}
              className={`text-[10px] h-6 px-2 ${selectedTipo === t
                ? t === 'Tinto' ? 'bg-red-600 hover:bg-red-700' : t === 'Branco' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700'
                : ''}`}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {categorias.map(categoria => {
          const entries = getEntries(selectedRegiao, selectedTipo, categoria);
          const planned = plannedTotals[selectedRegiao]?.[selectedTipo]?.[categoria] ?? 0;
          const assigned = entries.reduce((acc, e) => acc + e.qtdLitros, 0);
          const unbudgeted = planned - assigned;

          return (
            <div key={categoria} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    categoria === 'Regional' ? 'bg-blue-500' : categoria === 'DOC' ? 'bg-purple-500' : 'bg-amber-500'
                  }`}></span>
                  {selectedRegiao} — {selectedTipo} — {categoria}
                  <span className="text-[10px] font-normal text-gray-400">({entries.length} fornecedores)</span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addFornecedor(selectedRegiao, selectedTipo, categoria)}
                  className="text-[10px] h-6 px-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar Fornecedor
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-3 p-2 rounded bg-muted/40 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Necessidade:</span>
                  <span className="font-bold">{formatNumber(planned)} L</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Orçamentado:</span>
                  <span className="font-bold text-green-600">{formatNumber(assigned)} L</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Não Orçamentado:</span>
                  <span className={`font-bold ${unbudgeted > 0 ? 'text-red-600' : unbudgeted === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {formatNumber(unbudgeted)} L
                  </span>
                </div>
                {planned > 0 && (
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${assigned >= planned ? 'bg-green-500' : 'bg-orange-400'}`}
                        style={{ width: `${Math.min(100, planned > 0 ? (assigned / planned) * 100 : 0)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{Math.round(planned > 0 ? (assigned / planned) * 100 : 0)}%</span>
                  </div>
                )}
              </div>

              {entries.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2 text-center">
                  Nenhum fornecedor registado. Clique em "Adicionar Fornecedor" para começar.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-[10px] font-bold min-w-[200px]">Nome do Fornecedor</TableHead>
                      <TableHead className="text-[10px] font-bold text-center w-[120px]">Qtd. Prevista (L)</TableHead>
                      <TableHead className="text-[10px] font-bold text-center w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="p-1">
                          <Input
                            type="text"
                            placeholder="Nome do fornecedor..."
                            value={entry.nome}
                            onChange={(e) => updateFornecedor(selectedRegiao, selectedTipo, categoria, idx, 'nome', e.target.value)}
                            className="h-7 text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={entry.qtdLitros || ''}
                            onChange={(e) => updateFornecedor(selectedRegiao, selectedTipo, categoria, idx, 'qtdLitros', e.target.value)}
                            className="h-7 text-xs text-center w-24 mx-auto"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFornecedor(selectedRegiao, selectedTipo, categoria, idx)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/30">
                      <TableCell className="text-[10px] font-bold text-right pr-4">Subtotal</TableCell>
                      <TableCell className="text-[10px] font-bold text-center">
                        {formatNumber(assigned)} L
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild><Button variant="outline" size="sm">Cancelar</Button></DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editData)} className="bg-purple-600 hover:bg-purple-700">
            Guardar Fornecedores
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ─── Mensualizar Dialog ───
const getMesesLabels = () => {
  const now = new Date();
  const meses: { label: string; key: string }[] = [];
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    meses.push({
      label: `${mesesNomes[d.getMonth()]} ${d.getFullYear()}`,
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    });
  }
  return meses;
};

type MensualizarData = Record<string, Record<string, Record<StockCategoria, Record<string, number>>>>;

const MensualizarDialog = ({
  mensualizarData,
  onSave,
  plannedTotals,
}: {
  mensualizarData: MensualizarData;
  onSave: (d: MensualizarData) => void;
  plannedTotals: Record<string, Record<string, Record<StockCategoria, number>>>;
}) => {
  const [editData, setEditData] = useState<MensualizarData>(() => JSON.parse(JSON.stringify(mensualizarData)));
  const [selectedRegiao, setSelectedRegiao] = useState<string>(allRegioes[0]);
  const [selectedTipo, setSelectedTipo] = useState<string>('Tinto');

  const meses = useMemo(() => getMesesLabels(), []);

  const getCompra = (regiao: string, tipo: string, categoria: StockCategoria, mesKey: string): number => {
    return editData[regiao]?.[tipo]?.[categoria]?.[mesKey] ?? 0;
  };

  const updateCompra = (regiao: string, tipo: string, categoria: StockCategoria, mesKey: string, value: string) => {
    const num = Math.max(0, Number(value) || 0);
    setEditData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[regiao]) updated[regiao] = {};
      if (!updated[regiao][tipo]) updated[regiao][tipo] = {};
      if (!updated[regiao][tipo][categoria]) updated[regiao][tipo][categoria] = {};
      updated[regiao][tipo][categoria][mesKey] = num;
      return updated;
    });
  };

  // Stock previsto sem compra: distribui necessidade anual linearmente e subtrai acumulado
  const getStockRows = (regiao: string, tipo: string, categoria: StockCategoria) => {
    const totalAnual = plannedTotals[regiao]?.[tipo]?.[categoria] ?? 0;
    const consumoMensal = totalAnual / 12;
    // Stock inicial = total anual (assume stock cobre o ano sem compras)
    let stockSemCompra = totalAnual;
    let stockComCompra = totalAnual;

    const rows = {
      stockSemCompra: [] as number[],
      compra: [] as number[],
      soma: [] as number[],
    };

    meses.forEach(mes => {
      stockSemCompra -= consumoMensal;
      rows.stockSemCompra.push(Math.round(stockSemCompra));

      const compra = getCompra(regiao, tipo, categoria, mes.key);
      rows.compra.push(compra);

      stockComCompra = stockComCompra - consumoMensal + compra;
      rows.soma.push(Math.round(stockComCompra));
    });

    return rows;
  };

  const categorias = selectedRegiao === 'Portugal' ? ['Mesa' as StockCategoria] : ['Regional' as StockCategoria, 'DOC' as StockCategoria];

  return (
    <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Mensualizar Compra de Vinho
        </DialogTitle>
        <p className="text-sm text-gray-500">
          Distribua as compras ao longo dos próximos 12 meses. Identifique quando o stock fica negativo.
        </p>
      </DialogHeader>

      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Região:</span>
          <div className="flex flex-wrap gap-1">
            {allRegioes.map(r => (
              <Button
                key={r}
                variant={selectedRegiao === r ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegiao(r)}
                className={`text-[10px] h-6 px-2 ${selectedRegiao === r ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Tipo:</span>
          {vinhoTipos.map(t => (
            <Button
              key={t}
              variant={selectedTipo === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTipo(t)}
              className={`text-[10px] h-6 px-2 ${selectedTipo === t
                ? t === 'Tinto' ? 'bg-red-600 hover:bg-red-700' : t === 'Branco' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700'
                : ''}`}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-6">
        {categorias.map(categoria => {
          const rows = getStockRows(selectedRegiao, selectedTipo, categoria);
          const firstNegativeIdx = rows.stockSemCompra.findIndex(v => v < 0);
          const totalAnual = plannedTotals[selectedRegiao]?.[selectedTipo]?.[categoria] ?? 0;
          const totalCompras = rows.compra.reduce((a, b) => a + b, 0);

          return (
            <div key={categoria} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    categoria === 'Regional' ? 'bg-blue-500' : categoria === 'DOC' ? 'bg-purple-500' : 'bg-amber-500'
                  }`} />
                  {selectedRegiao} — {selectedTipo} — {categoria}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">Necessidade anual: <strong>{formatNumber(totalAnual)} L</strong></span>
                  <span className="text-gray-500">Total compras planeadas: <strong className="text-blue-600">{formatNumber(totalCompras)} L</strong></span>
                  {firstNegativeIdx >= 0 && (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Stock negativo a partir de {meses[firstNegativeIdx].label}
                    </span>
                  )}
                </div>
              </div>

              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-[10px] font-bold min-w-[180px] border-r-2 sticky left-0 bg-muted/50 z-10">Linha</TableHead>
                      {meses.map(m => (
                        <TableHead key={m.key} className="text-[10px] font-medium text-center min-w-[80px]">
                          {m.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Row 1: Stock previsto sem compra */}
                    <TableRow className="bg-gray-50">
                      <TableCell className="text-[10px] font-semibold border-r-2 sticky left-0 bg-gray-50 z-10">
                        Stock previsto s/ compra
                      </TableCell>
                      {rows.stockSemCompra.map((val, i) => (
                        <TableCell
                          key={meses[i].key}
                          className={`text-right text-[10px] font-medium ${val < 0 ? 'bg-red-100 text-red-700 font-bold' : ''}`}
                        >
                          {formatNumber(val)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Row 2: Compra de vinho (input) */}
                    <TableRow className="bg-blue-50/30">
                      <TableCell className="text-[10px] font-semibold border-r-2 sticky left-0 bg-blue-50/30 z-10 text-blue-700">
                        Compra de Vinho (L)
                      </TableCell>
                      {meses.map(m => (
                        <TableCell key={m.key} className="p-1">
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={getCompra(selectedRegiao, selectedTipo, categoria, m.key) || ''}
                            onChange={(e) => updateCompra(selectedRegiao, selectedTipo, categoria, m.key, e.target.value)}
                            className="h-6 text-[10px] text-center w-16 mx-auto"
                          />
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Row 3: Soma (stock + compra) */}
                    <TableRow className="bg-muted/30 border-t-2">
                      <TableCell className="text-[10px] font-bold border-r-2 sticky left-0 bg-muted/30 z-10">
                        Stock c/ compra
                      </TableCell>
                      {rows.soma.map((val, i) => (
                        <TableCell
                          key={meses[i].key}
                          className={`text-right text-[10px] font-bold ${val < 0 ? 'bg-red-200 text-red-800' : 'text-green-700'}`}
                        >
                          {formatNumber(val)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild><Button variant="outline" size="sm">Cancelar</Button></DialogClose>
        <DialogClose asChild>
          <Button size="sm" onClick={() => onSave(editData)} className="bg-blue-600 hover:bg-blue-700">
            Guardar Calendarização
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

// ─── Main Page Component ───
const CompraVinhoPage = () => {
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [medida, setMedida] = useState<Medida>('litros');
  const [raciosLtEuro, setRaciosLtEuro] = useState(() => JSON.parse(JSON.stringify(defaultRaciosLtEuro)));
  const [fornecedores, setFornecedores] = useState<FornecedoresData>({});
  const [mensualizarData, setMensualizarData] = useState<MensualizarData>({});

  const toggleRegion = (regiao: string) => {
    setExpandedRegions(prev => ({ ...prev, [regiao]: !prev[regiao] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    allRegioes.forEach(r => { all[r] = true; });
    setExpandedRegions(all);
  };

  const collapseAll = () => setExpandedRegions({});

  const plannedLitrosTotals = useMemo(() => {
    const result: Record<string, Record<string, Record<StockCategoria, number>>> = {};
    allRegioes.forEach(regiao => {
      result[regiao] = {};
      vinhoTipos.forEach(tipo => {
        result[regiao][tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
        stockCategorias.forEach(categoria => {
          const items = purchaseData[regiao]?.[tipo]?.[categoria] || [];
          result[regiao][tipo][categoria] = items.reduce((acc, c) => acc + c.litros, 0);
        });
      });
    });
    return result;
  }, []);

  const convertValue = (litros: number, regiao: string, tipo: string, categoria: StockCategoria): number => {
    if (medida === 'litros') return litros;
    const pricePerL = raciosLtEuro[regiao]?.[tipo]?.[categoria] ?? 0.50;
    return litros * pricePerL;
  };

  const { totals, rowTotals, columnTotals, grandTotal } = useMemo(() => {
    const totals: Record<string, Record<string, number>> = {};
    const rowTotals: Record<string, number> = {};
    const columnTotals: Record<string, Record<StockCategoria, number>> = {};

    vinhoTipos.forEach(tipo => {
      columnTotals[tipo] = { 'Regional': 0, 'DOC': 0, 'Mesa': 0 };
    });

    allRegioes.forEach(regiao => {
      totals[regiao] = {};
      rowTotals[regiao] = 0;

      vinhoTipos.forEach(tipo => {
        stockCategorias.forEach(categoria => {
          const items = purchaseData[regiao]?.[tipo]?.[categoria] || [];
          const sum = items.reduce((acc, c) => acc + convertValue(c.litros, regiao, tipo, categoria), 0);
          totals[regiao][`${tipo}_${categoria}`] = sum;
          rowTotals[regiao] += sum;
          columnTotals[tipo][categoria] += sum;
        });
      });
    });

    const grandTotal = Object.values(rowTotals).reduce((acc, val) => acc + val, 0);
    return { totals, rowTotals, columnTotals, grandTotal };
  }, [medida, raciosLtEuro]);

  const getTipoTotal = (tipo: string) => {
    return Object.values(columnTotals[tipo]).reduce((acc, val) => acc + val, 0);
  };

  const unitLabel = medida === 'litros' ? 'L' : '€';
  const isEuros = medida === 'euros';
  const fmt = (v: number) => isEuros ? formatCurrency(v) : formatNumber(v);

  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Wine className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Compra de Vinho</h1>
              <p className="text-sm text-gray-500">
                Quadro de compras de vinho por região e tipo (em {unitLabel})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {(['litros', 'euros'] as Medida[]).map(m => (
                <Button
                  key={m}
                  variant={medida === m ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMedida(m)}
                  className={`text-xs h-7 ${medida === m ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  {medidaLabels[m]}
                </Button>
              ))}
              <span className="text-gray-300">|</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7 border-green-300 text-green-700 hover:bg-green-50">
                    <Euro className="w-3 h-3 mr-1" />
                    Rácios Lt/€
                  </Button>
                </DialogTrigger>
                <RaciosLtEuroDialog racios={raciosLtEuro} onSave={setRaciosLtEuro} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7 border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Users className="w-3 h-3 mr-1" />
                    Fornecedores
                  </Button>
                </DialogTrigger>
                <FornecedoresDialog fornecedores={fornecedores} onSave={setFornecedores} plannedTotals={plannedLitrosTotals} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7 border-blue-300 text-blue-600 hover:bg-blue-50">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    Mensualizar
                  </Button>
                </DialogTrigger>
                <MensualizarDialog mensualizarData={mensualizarData} onSave={setMensualizarData} plannedTotals={plannedLitrosTotals} />
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
              <div className="text-lg font-bold text-purple-600">{fmt(grandTotal)} {unitLabel}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b-2">
                  <TableHead rowSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-muted/50 z-10 min-w-[140px]">
                    Região
                  </TableHead>
                  <TableHead rowSpan={2} className="text-xs font-bold border-r min-w-[180px]">
                    Fornecedor
                  </TableHead>
                  {vinhoTipos.map((tipo, idx) => (
                    <TableHead
                      key={tipo}
                      colSpan={3}
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-100 text-red-800' : tipo === 'Branco' ? 'bg-yellow-50 text-yellow-800' : 'bg-pink-100 text-pink-800'
                      } ${idx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
                    >
                      {tipo}
                    </TableHead>
                  ))}
                  <TableHead rowSpan={2} className="text-center text-xs font-bold bg-gray-200 border-l-2 min-w-[100px]">
                    Total Linha
                  </TableHead>
                </TableRow>
                <TableRow className="bg-muted/30">
                  {vinhoTipos.map((tipo, tipoIdx) =>
                    stockCategorias.map((categoria, catIdx) => (
                      <TableHead
                        key={`${tipo}_${categoria}`}
                        className={`text-center text-[10px] font-medium ${
                          categoria === 'Mesa' ? 'bg-amber-50 text-amber-700' : ''
                        } ${catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        {categoria}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRegioes.map((regiao) => {
                  const regionItems: { tipo: string; categoria: StockCategoria; fornecedor: string; litros: number }[] = [];
                  vinhoTipos.forEach(tipo => {
                    stockCategorias.forEach(categoria => {
                      const items = purchaseData[regiao]?.[tipo]?.[categoria] || [];
                      items.forEach(c => {
                        regionItems.push({ tipo, categoria, fornecedor: c.fornecedor, litros: c.litros });
                      });
                    });
                  });

                  const isPortugal = regiao === 'Portugal';
                  const isExpanded = expandedRegions[regiao] || false;
                  const hasProducts = regionItems.length > 0;

                  return (
                    <>
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
                              <span className="text-[10px] text-gray-400 font-normal">({regionItems.length} fornecedores)</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs italic text-gray-500">
                          {isExpanded ? '' : 'Subtotal'}
                        </TableCell>
                        {vinhoTipos.map((tipo, tipoIdx) =>
                          stockCategorias.map((categoria, catIdx) => (
                            <TableCell
                              key={`${tipo}_${categoria}`}
                              className={`text-right text-xs font-semibold ${
                                categoria === 'Mesa' ? 'bg-amber-50/50' : ''
                              } ${catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
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

                      {isExpanded && regionItems.map((item, idx) => (
                        <TableRow
                          key={`${regiao}_${item.fornecedor}_${idx}`}
                          className={`hover:bg-muted/30 ${isPortugal ? 'bg-amber-50/30' : ''}`}
                        >
                          <TableCell className={`text-xs border-r-2 sticky left-0 z-10 ${isPortugal ? 'bg-amber-50/30' : 'bg-white'}`} />
                          <TableCell className="text-xs py-1 pl-4">{item.fornecedor}</TableCell>
                          {vinhoTipos.map((tipo, tipoIdx) =>
                            stockCategorias.map((categoria, catIdx) => {
                              const isMatch = item.tipo === tipo && item.categoria === categoria;
                              const isMesaColumn = categoria === 'Mesa';
                              const displayValue = isMatch ? convertValue(item.litros, regiao, tipo, categoria) : 0;

                              return (
                                <TableCell
                                  key={`${tipo}_${categoria}`}
                                  className={`text-right text-xs py-1 ${
                                    catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''
                                  } ${isMatch
                                      ? isMesaColumn ? 'bg-amber-100 font-medium'
                                        : tipo === 'Tinto' ? 'bg-red-50 font-medium'
                                        : tipo === 'Branco' ? 'bg-yellow-50/50 font-medium'
                                        : 'bg-pink-50 font-medium'
                                      : isMesaColumn ? 'bg-amber-50/30' : ''}`}
                                >
                                  {isMatch ? fmt(displayValue) : '-'}
                                </TableCell>
                              );
                            })
                          )}
                          <TableCell className="text-right text-xs py-1 bg-gray-50 border-l-2 font-medium">
                            {fmt(convertValue(item.litros, regiao, item.tipo, item.categoria))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}

                <TableRow className="bg-purple-100/50 font-bold border-t-4">
                  <TableCell className="text-xs font-bold border-r-2 sticky left-0 bg-purple-100/50 z-10">TOTAL</TableCell>
                  <TableCell className="text-xs"></TableCell>
                  {vinhoTipos.map((tipo, tipoIdx) =>
                    stockCategorias.map((categoria, catIdx) => (
                      <TableCell
                        key={`${tipo}_${categoria}_total`}
                        className={`text-right text-xs font-bold ${
                          categoria === 'Mesa' ? 'bg-amber-100/50' : ''
                        } ${catIdx === stockCategorias.length - 1 && tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
                      >
                        {fmt(columnTotals[tipo][categoria])}
                      </TableCell>
                    ))
                  )}
                  <TableCell className="text-right text-xs font-bold bg-purple-200/50 border-l-2 text-purple-700">
                    {fmt(grandTotal)}
                  </TableCell>
                </TableRow>

                <TableRow className="bg-gray-200 font-bold">
                  <TableCell colSpan={2} className="text-xs font-bold border-r-2 sticky left-0 bg-gray-200 z-10">
                    Total por Tipo
                  </TableCell>
                  {vinhoTipos.map((tipo, tipoIdx) => (
                    <TableCell
                      key={`${tipo}_total`}
                      colSpan={3}
                      className={`text-center text-xs font-bold ${
                        tipo === 'Tinto' ? 'bg-red-200 text-red-800' : tipo === 'Branco' ? 'bg-yellow-100 text-yellow-800' : 'bg-pink-200 text-pink-800'
                      } ${tipoIdx < vinhoTipos.length - 1 ? 'border-r-2' : ''}`}
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
            <span>Preço defeito: 0,50 €/L</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">
            A mostrar valores em {medidaLabels[medida]} | Unidade base: Litros
          </span>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default CompraVinhoPage;
