import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Mock cost centers
const allCostCenters = [
  { id: "cc01", name: "CC01 - Vinha Douro", group: "Agricultura" },
  { id: "cc02", name: "CC02 - Vinha Alentejo", group: "Agricultura" },
  { id: "cc03", name: "CC03 - Vinha Dão", group: "Agricultura" },
  { id: "cc04", name: "CC04 - Adega Principal", group: "Vinificação" },
  { id: "cc05", name: "CC05 - Adega Secundária", group: "Vinificação" },
  { id: "cc06", name: "CC06 - Cave Barrica", group: "Estágio" },
  { id: "cc07", name: "CC07 - Cave Cuba", group: "Estágio" },
  { id: "cc08", name: "CC08 - Linha Engarrafamento 1", group: "Engarrafamento" },
  { id: "cc09", name: "CC09 - Linha Engarrafamento 2", group: "Engarrafamento" },
  { id: "cc10", name: "CC10 - Armazém Secos", group: "Engarrafamento" },
  { id: "cc11", name: "CC11 - Logística Norte", group: "Distribuição" },
  { id: "cc12", name: "CC12 - Logística Sul", group: "Distribuição" },
  { id: "cc13", name: "CC13 - Armazém Central", group: "Distribuição" },
  { id: "cc14", name: "CC14 - Administração Geral", group: "Transversal" },
  { id: "cc15", name: "CC15 - Dept. Comercial", group: "Transversal" },
  { id: "cc16", name: "CC16 - Marketing", group: "Transversal" },
  { id: "cc17", name: "CC17 - Financeiro", group: "Transversal" },
  { id: "cc18", name: "CC18 - Recursos Humanos", group: "Transversal" },
  { id: "cc19", name: "CC19 - Manutenção", group: "Transversal" },
  { id: "cc20", name: "CC20 - Qualidade", group: "Transversal" },
];

export interface CostCenterAllocation {
  centerId: string;
  pct: number;
}

interface CostCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaLabel: string;
  areaIcon: React.ElementType;
  allocations: CostCenterAllocation[];
  onAllocationsChange: (allocations: CostCenterAllocation[]) => void;
}

export const CostCenterDialog = ({
  open, onOpenChange, areaLabel, areaIcon: Icon, allocations, onAllocationsChange
}: CostCenterDialogProps) => {
  const selectedIds = allocations.map(a => a.centerId);
  const totalPct = allocations.reduce((s, a) => s + a.pct, 0);
  const isValid = Math.abs(totalPct - 100) < 0.5;

  const toggleCenter = (id: string) => {
    if (selectedIds.includes(id)) {
      onAllocationsChange(allocations.filter(a => a.centerId !== id));
    } else {
      onAllocationsChange([...allocations, { centerId: id, pct: 0 }]);
    }
  };

  const updatePct = (id: string, val: number) => {
    onAllocationsChange(allocations.map(a => a.centerId === id ? { ...a, pct: val } : a));
  };

  const groups = useMemo(() => {
    const map = new Map<string, typeof allCostCenters>();
    allCostCenters.forEach(cc => {
      if (!map.has(cc.group)) map.set(cc.group, []);
      map.get(cc.group)!.push(cc);
    });
    return map;
  }, []);

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
            Selecione os centros de custo e distribua 100% do custo.
          </DialogDescription>
        </DialogHeader>

        {/* Validation banner */}
        <div className={`flex items-center gap-2 p-2 rounded-md text-xs ${isValid ? 'bg-emerald-50 text-emerald-700' : 'bg-destructive/10 text-destructive'}`}>
          {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>Total distribuído: <strong>{totalPct.toFixed(1)}%</strong> {isValid ? '✓' : '(deve somar 100%)'}</span>
        </div>

        <ScrollArea className="max-h-[400px] pr-2">
          <div className="space-y-4">
            {Array.from(groups.entries()).map(([group, centers]) => (
              <div key={group}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group}</p>
                <div className="space-y-1.5">
                  {centers.map(cc => {
                    const isSelected = selectedIds.includes(cc.id);
                    const alloc = allocations.find(a => a.centerId === cc.id);
                    return (
                      <div key={cc.id} className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${isSelected ? 'border-eps-primary/30 bg-eps-primary/5' : 'border-transparent hover:bg-muted/50'}`}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleCenter(cc.id)}
                          id={cc.id}
                        />
                        <Label htmlFor={cc.id} className="flex-1 text-xs cursor-pointer">{cc.name}</Label>
                        {isSelected && (
                          <div className="flex items-center gap-1">
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
