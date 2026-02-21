import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Mock cost centers with absolute costs (€)
const allCostCenters = [
  { id: "cc01", name: "CC01 - Vinha Douro", group: "Agricultura", cost: 850000 },
  { id: "cc02", name: "CC02 - Vinha Alentejo", group: "Agricultura", cost: 620000 },
  { id: "cc03", name: "CC03 - Vinha Dão", group: "Agricultura", cost: 430000 },
  { id: "cc04", name: "CC04 - Adega Principal", group: "Vinificação", cost: 780000 },
  { id: "cc05", name: "CC05 - Adega Secundária", group: "Vinificação", cost: 340000 },
  { id: "cc06", name: "CC06 - Cave Barrica", group: "Estágio", cost: 290000 },
  { id: "cc07", name: "CC07 - Cave Cuba", group: "Estágio", cost: 210000 },
  { id: "cc08", name: "CC08 - Linha Engarrafamento 1", group: "Engarrafamento", cost: 520000 },
  { id: "cc09", name: "CC09 - Linha Engarrafamento 2", group: "Engarrafamento", cost: 380000 },
  { id: "cc10", name: "CC10 - Armazém Secos", group: "Engarrafamento", cost: 150000 },
  { id: "cc11", name: "CC11 - Logística Norte", group: "Distribuição", cost: 410000 },
  { id: "cc12", name: "CC12 - Logística Sul", group: "Distribuição", cost: 350000 },
  { id: "cc13", name: "CC13 - Armazém Central", group: "Distribuição", cost: 280000 },
  { id: "cc14", name: "CC14 - Administração Geral", group: "Transversal", cost: 520000 },
  { id: "cc15", name: "CC15 - Dept. Comercial", group: "Transversal", cost: 380000 },
  { id: "cc16", name: "CC16 - Marketing", group: "Transversal", cost: 250000 },
  { id: "cc17", name: "CC17 - Financeiro", group: "Transversal", cost: 180000 },
  { id: "cc18", name: "CC18 - Recursos Humanos", group: "Transversal", cost: 160000 },
  { id: "cc19", name: "CC19 - Manutenção", group: "Transversal", cost: 290000 },
  { id: "cc20", name: "CC20 - Qualidade", group: "Transversal", cost: 210000 },
];

export interface CostCenterAllocation {
  centerId: string;
  pct: number;
}

// Distribution of a single CC across multiple areas
export interface CCAreaDistribution {
  ccId: string;
  areas: Record<string, number>; // areaId -> % (must sum 100)
}

interface CostCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaLabel: string;
  areaIcon: React.ElementType;
  allocations: CostCenterAllocation[];
  onAllocationsChange: (allocations: CostCenterAllocation[]) => void;
}

const formatCost = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M €`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K €`;
  return `${val.toFixed(0)} €`;
};

export const CostCenterDialog = ({
  open, onOpenChange, areaLabel, areaIcon: Icon, allocations, onAllocationsChange
}: CostCenterDialogProps) => {
  const [search, setSearch] = useState("");
  const selectedIds = allocations.map(a => a.centerId);

  // Total cost allocated to THIS area (sum of each CC's cost * its %)
  const totalCostArea = allocations.reduce((s, a) => {
    const cc = allCostCenters.find(c => c.id === a.centerId);
    return s + (cc ? cc.cost * a.pct / 100 : 0);
  }, 0);

  const toggleCenter = (id: string) => {
    if (selectedIds.includes(id)) {
      onAllocationsChange(allocations.filter(a => a.centerId !== id));
    } else {
      onAllocationsChange([...allocations, { centerId: id, pct: 0 }]);
    }
  };

  const updatePct = (id: string, val: number) => {
    onAllocationsChange(allocations.map(a => a.centerId === id ? { ...a, pct: Math.min(100, Math.max(0, val)) } : a));
  };

  const groups = useMemo(() => {
    const map = new Map<string, typeof allCostCenters>();
    allCostCenters.forEach(cc => {
      if (!map.has(cc.group)) map.set(cc.group, []);
      map.get(cc.group)!.push(cc);
    });
    return map;
  }, []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    const map = new Map<string, typeof allCostCenters>();
    groups.forEach((centers, group) => {
      const filtered = centers.filter(cc => cc.name.toLowerCase().includes(q) || cc.group.toLowerCase().includes(q));
      if (filtered.length > 0) map.set(group, filtered);
    });
    return map;
  }, [groups, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-eps-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-eps-primary" />
            </div>
            Centros de Custo — {areaLabel}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Selecione os centros de custo e defina a % do custo de cada CC alocada a esta área.
            Cada CC deve ter 100% distribuído globalmente (soma de todas as áreas).
          </DialogDescription>
        </DialogHeader>

        {/* Area total cost banner */}
        <div className="flex items-center justify-between p-2 rounded-md text-xs bg-muted/50">
          <span className="text-muted-foreground">Custo total alocado a <strong>{areaLabel}</strong>:</span>
          <span className="font-bold text-foreground">{formatCost(totalCostArea)}</span>
        </div>

        <Input
          placeholder="Pesquisar centros de custo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-xs"
        />

        <ScrollArea className="max-h-[400px] pr-2">
          <div className="space-y-4">
            {Array.from(filteredGroups.entries()).map(([group, centers]) => (
              <div key={group}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group}</p>
                <div className="space-y-1.5">
                  {centers.map(cc => {
                    const isSelected = selectedIds.includes(cc.id);
                    const alloc = allocations.find(a => a.centerId === cc.id);
                    const allocatedCost = cc.cost * (alloc?.pct ?? 0) / 100;
                    return (
                      <div key={cc.id} className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${isSelected ? 'border-eps-primary/30 bg-eps-primary/5' : 'border-transparent hover:bg-muted/50'}`}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleCenter(cc.id)}
                          id={cc.id}
                        />
                        <Label htmlFor={cc.id} className="flex-1 text-xs cursor-pointer">
                          <span>{cc.name}</span>
                          <span className="ml-2 text-[10px] text-muted-foreground">{formatCost(cc.cost)}</span>
                        </Label>
                        {isSelected && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">{formatCost(allocatedCost)}</span>
                            <Input
                              type="number"
                              value={alloc?.pct ?? 0}
                              onChange={e => updatePct(cc.id, parseFloat(e.target.value) || 0)}
                              className="w-16 h-6 text-xs text-center"
                              min={0} max={100} step={5}
                            />
                            <span className="text-[10px] text-muted-foreground">%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { allCostCenters };
