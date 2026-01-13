import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOperacoesFilters } from "@/contexts/OperacoesFilterContext";
import { consultoresOp, organizacoes, espacos, locais, atividades, tiposProdutoOp, produtos, variedades } from "@/data/operacoesData";
import { anos, meses } from "@/data/mockData";

interface OperacoesFilterSidebarProps {
  showAtividade?: boolean;
  showTipoProduto?: boolean;
}

export const OperacoesFilterSidebar = ({ 
  showAtividade = false, 
  showTipoProduto = false 
}: OperacoesFilterSidebarProps) => {
  const { filters, setFilters } = useOperacoesFilters();

  return (
    <div className="w-44 bg-white border-r flex-shrink-0 p-4 overflow-y-auto">
      <h2 className="text-[#8B1538] font-bold text-sm tracking-widest mb-4">OPERAÇÕES</h2>
      
      <div className="space-y-3">
        <div>
          <span className="text-[#8B1538] text-xs font-medium">Filtros:</span>
        </div>

        {/* Ano */}
        <div>
          <label className="text-[#8B1538] text-xs">Ano</label>
          <Select 
            value={String(filters.ano)} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, ano: Number(v) }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anos.map(ano => (
                <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mês */}
        <div>
          <label className="text-[#8B1538] text-xs">Mês</label>
          <Select 
            value={filters.mes} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, mes: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tudo">Tudo</SelectItem>
              {meses.filter(m => m !== "Todos").map(mes => (
                <SelectItem key={mes} value={mes}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Consultor */}
        <div>
          <label className="text-[#8B1538] text-xs">Consultor</label>
          <Select 
            value={filters.consultor} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, consultor: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {consultoresOp.map(cons => (
                <SelectItem key={cons} value={cons}>{cons}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organização */}
        <div>
          <label className="text-[#8B1538] text-xs">Organização</label>
          <Select 
            value={filters.organizacao} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, organizacao: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizacoes.map(org => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Zona */}
        <div>
          <label className="text-[#8B1538] text-xs">Zona</label>
          <Select 
            value={filters.espaco} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, espaco: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {espacos.map(esp => (
                <SelectItem key={esp} value={esp}>{esp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Talhão */}
        <div>
          <label className="text-[#8B1538] text-xs">Talhão</label>
          <Select 
            value={filters.local} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, local: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locais.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Produto */}
        <div>
          <label className="text-[#8B1538] text-xs">Produto</label>
          <Select 
            value={filters.produto} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, produto: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {produtos.map(prod => (
                <SelectItem key={prod} value={prod}>{prod}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Variedade */}
        <div>
          <label className="text-[#8B1538] text-xs">Variedade</label>
          <Select 
            value={filters.variedade} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, variedade: v }))}
          >
            <SelectTrigger className="h-7 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variedades.map(vari => (
                <SelectItem key={vari} value={vari}>{vari}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Atividade */}
        {showAtividade && (
          <div>
            <label className="text-[#8B1538] text-xs">Atividade</label>
            <Select 
              value={filters.atividade} 
              onValueChange={(v) => setFilters(prev => ({ ...prev, atividade: v }))}
            >
              <SelectTrigger className="h-7 text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {atividades.map(at => (
                  <SelectItem key={at} value={at}>{at}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tipo Produto */}
        {showTipoProduto && (
          <div>
            <label className="text-[#8B1538] text-xs">Tipo Produto</label>
            <div className="mt-1 space-y-1">
              {tiposProdutoOp.map(tipo => (
                <label key={tipo} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="tipoProduto"
                    checked={filters.tipoProduto === tipo}
                    onChange={() => setFilters(prev => ({ ...prev, tipoProduto: tipo }))}
                    className="h-3 w-3 accent-[#8B1538]"
                  />
                  {tipo}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
