import { useState } from "react";
import EPSLayout from "@/components/layout/EPSLayout";
import { adegasData, Adega } from "@/data/adegasData";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Factory, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatLitros = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k L`;
  return `${val} L`;
};

const regioes = ["Todas", ...Array.from(new Set(adegasData.map((a) => a.regiao)))];

const TransformacaoAdegasPage = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [regiaoFilter, setRegiaoFilter] = useState("Todas");

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const filtered =
    regiaoFilter === "Todas"
      ? adegasData
      : adegasData.filter((a) => a.regiao === regiaoFilter);

  return (
    <EPSLayout title="Transformação — Adegas" icon={<Factory className="w-5 h-5" />}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-eps-primary/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-eps-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Transformação — Adegas</h1>
              <p className="text-xs text-muted-foreground">
                Capacidade, armazenagem e quintas associadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={regiaoFilter} onValueChange={setRegiaoFilter}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regioes.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2.5 font-semibold w-8"></th>
                <th className="px-3 py-2.5 font-semibold">Região</th>
                <th className="px-3 py-2.5 font-semibold">Adega</th>
                <th className="px-3 py-2.5 font-semibold text-right">Capacidade Total</th>
                <th className="px-3 py-2.5 font-semibold text-center" colSpan={3}>
                  Armazenagem
                </th>
                <th className="px-3 py-2.5 font-semibold text-center" colSpan={3}>
                  Transformação
                </th>
                <th className="px-3 py-2.5 font-semibold text-center">Quintas</th>
              </tr>
              <tr className="bg-muted/30 text-muted-foreground">
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1 text-center text-[10px]">Tinto</th>
                <th className="px-3 py-1 text-center text-[10px]">Branco</th>
                <th className="px-3 py-1 text-center text-[10px]">Rosé</th>
                <th className="px-3 py-1 text-center text-[10px]">Tinto</th>
                <th className="px-3 py-1 text-center text-[10px]">Branco</th>
                <th className="px-3 py-1 text-center text-[10px]">Rosé</th>
                <th className="px-3 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((adega) => {
                const isExpanded = expandedIds.includes(adega.id);
                const proprias = adega.quintas.filter((q) => q.tipo === "Própria");
                const fornecedores = adega.quintas.filter((q) => q.tipo === "Fornecedor");

                return (
                  <>
                    <tr
                      key={adega.id}
                      className="border-t border-border hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(adega.id)}
                    >
                      <td className="px-3 py-2.5">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant="outline" className="text-[10px]">
                          {adega.regiao}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 font-medium">{adega.nome}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-eps-primary">
                        {formatLitros(adega.capacidadeTotal)}
                      </td>
                      {/* Armazenagem */}
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.armazenagem.tinto)}</td>
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.armazenagem.branco)}</td>
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.armazenagem.rose)}</td>
                      {/* Transformação */}
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.transformacao.tinto)}</td>
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.transformacao.branco)}</td>
                      <td className="px-3 py-2.5 text-center">{formatLitros(adega.transformacao.rose)}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="text-eps-primary font-medium">{proprias.length}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-amber-600 font-medium">{fornecedores.length}</span>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${adega.id}-details`} className="bg-muted/10">
                        <td colSpan={11} className="px-6 py-3">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Quintas Próprias */}
                            <div>
                              <h4 className="text-[11px] font-semibold text-eps-primary mb-2 uppercase tracking-wider">
                                Quintas Próprias
                              </h4>
                              {proprias.length > 0 ? (
                                <ul className="space-y-1">
                                  {proprias.map((q) => (
                                    <li
                                      key={q.nome}
                                      className="flex items-center gap-2 text-[11px]"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-eps-primary" />
                                      <span>{q.nome}</span>
                                      <Badge variant="secondary" className="text-[9px] ml-auto">
                                        {q.regiao}
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[11px] text-muted-foreground italic">Nenhuma</p>
                              )}
                            </div>
                            {/* Quintas de Fornecedores */}
                            <div>
                              <h4 className="text-[11px] font-semibold text-amber-600 mb-2 uppercase tracking-wider">
                                Quintas de Fornecedores
                              </h4>
                              {fornecedores.length > 0 ? (
                                <ul className="space-y-1">
                                  {fornecedores.map((q) => (
                                    <li
                                      key={q.nome}
                                      className="flex items-center gap-2 text-[11px]"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      <span>{q.nome}</span>
                                      <Badge variant="secondary" className="text-[9px] ml-auto">
                                        {q.regiao}
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[11px] text-muted-foreground italic">Nenhuma</p>
                              )}
                            </div>
                          </div>

                          {/* Utilização bars */}
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-muted-foreground">Utilização Armazenagem</span>
                              <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-eps-primary rounded-full"
                                  style={{
                                    width: `${Math.min(100, (adega.armazenagem.total / adega.capacidadeTotal) * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {((adega.armazenagem.total / adega.capacidadeTotal) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground">Utilização Transformação</span>
                              <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full"
                                  style={{
                                    width: `${Math.min(100, (adega.transformacao.total / adega.capacidadeTotal) * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {((adega.transformacao.total / adega.capacidadeTotal) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EPSLayout>
  );
};

export default TransformacaoAdegasPage;
