import { useFilters } from '@/contexts/FilterContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { anos, meses, tiposProduto, distritos, lojas, fertilizantes, pesticidas, consultores } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  showConsultor?: boolean;
  showConcelho?: boolean;
}

export const FilterBar = ({ showConsultor = false, showConcelho = false }: FilterBarProps) => {
  const { filters, setFilters, resetFilters } = useFilters();

  const activeFiltersCount = [
    filters.ano !== 2025,
    filters.mes !== "Todos",
    filters.tipoProduto !== "Todos",
    filters.zona !== "Portugal",
    filters.produto !== "Todos",
    filters.consultor !== "Todos"
  ].filter(Boolean).length;

  const concelhos = filters.zona === "Portugal" 
    ? ["Todos", ...lojas.map(l => l.concelho).sort()]
    : ["Todos", ...lojas.filter(l => l.distrito === filters.zona).map(l => l.concelho).sort()];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filtros</span>
        {activeFiltersCount > 0 && (
          <Badge variant="default" className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </div>

      <Select 
        value={filters.ano.toString()} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, ano: parseInt(v) }))}
      >
        <SelectTrigger className="w-[90px] h-9 bg-card">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {anos.map(ano => (
            <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.mes} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, mes: v }))}
      >
        <SelectTrigger className="w-[120px] h-9 bg-card">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Mês</SelectItem>
          {meses.map(mes => (
            <SelectItem key={mes} value={mes}>{mes}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.tipoProduto} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, tipoProduto: v, produto: "Todos" }))}
      >
        <SelectTrigger className="w-[130px] h-9 bg-card">
          <SelectValue placeholder="Tipo Produto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Tipo Produto</SelectItem>
          {tiposProduto.map(tipo => (
            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.zona} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, zona: v, concelho: "Todos" }))}
      >
        <SelectTrigger className="w-[130px] h-9 bg-card">
          <SelectValue placeholder="Distrito" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Portugal">Distrito</SelectItem>
          {distritos.filter(d => d !== "Portugal").map(distrito => (
            <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showConcelho && (
        <Select 
          value={filters.concelho} 
          onValueChange={(v) => setFilters(prev => ({ ...prev, concelho: v }))}
        >
          <SelectTrigger className="w-[140px] h-9 bg-card">
            <SelectValue placeholder="Concelho/Loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Concelho/Loja</SelectItem>
            {concelhos.filter(c => c !== "Todos").map(concelho => (
              <SelectItem key={concelho} value={concelho}>{concelho}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex-1" />

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={resetFilters} 
        className="text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Limpar
      </Button>

      {showConsultor && (
        <Select 
          value={filters.consultor} 
          onValueChange={(v) => setFilters(prev => ({ ...prev, consultor: v }))}
        >
          <SelectTrigger className="w-[180px] h-9 bg-card">
            <SelectValue placeholder="Todos os consultores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os consultores</SelectItem>
            {consultores.map(c => (
              <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
