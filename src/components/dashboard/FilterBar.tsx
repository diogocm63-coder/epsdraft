import { useFilters } from '@/contexts/FilterContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { anos, meses, tiposProduto, distritos, lojas, fertilizantes, pesticidas, consultores } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface FilterBarProps {
  showConsultor?: boolean;
  showConcelho?: boolean;
}

export const FilterBar = ({ showConsultor = false, showConcelho = false }: FilterBarProps) => {
  const { filters, setFilters, resetFilters } = useFilters();

  const concelhos = filters.zona === "Portugal" 
    ? ["Todos", ...lojas.map(l => l.concelho).sort()]
    : ["Todos", ...lojas.filter(l => l.distrito === filters.zona).map(l => l.concelho).sort()];

  const produtos = filters.tipoProduto === "Todos" 
    ? ["Todos"]
    : filters.tipoProduto === "Fertilizantes"
      ? ["Todos", ...fertilizantes]
      : ["Todos", ...pesticidas];

  return (
    <div className="filter-bar">
      <Select 
        value={filters.ano.toString()} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, ano: parseInt(v) }))}
      >
        <SelectTrigger className="w-[100px]">
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
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos os meses</SelectItem>
          {meses.map(mes => (
            <SelectItem key={mes} value={mes}>{mes}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.tipoProduto} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, tipoProduto: v, produto: "Todos" }))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Tipo Produto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos os tipos</SelectItem>
          {tiposProduto.map(tipo => (
            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.produto} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, produto: v }))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Produto" />
        </SelectTrigger>
        <SelectContent>
          {produtos.map(produto => (
            <SelectItem key={produto} value={produto}>{produto}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.zona} 
        onValueChange={(v) => setFilters(prev => ({ ...prev, zona: v, concelho: "Todos" }))}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Zona" />
        </SelectTrigger>
        <SelectContent>
          {distritos.map(distrito => (
            <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showConcelho && (
        <Select 
          value={filters.concelho} 
          onValueChange={(v) => setFilters(prev => ({ ...prev, concelho: v }))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Concelho" />
          </SelectTrigger>
          <SelectContent>
            {concelhos.map(concelho => (
              <SelectItem key={concelho} value={concelho}>{concelho}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showConsultor && (
        <Select 
          value={filters.consultor} 
          onValueChange={(v) => setFilters(prev => ({ ...prev, consultor: v }))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Consultor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {consultores.map(c => (
              <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button variant="outline" size="icon" onClick={resetFilters} title="Limpar filtros">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};
