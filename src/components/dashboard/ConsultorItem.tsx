interface ConsultorItemProps {
  nome: string;
  zona: string;
  lojas: number;
  color: string;
}

const colors = ['#1e4d8c', '#4caf50', '#3b9ddd', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ConsultorItem = ({ nome, zona, lojas, color }: ConsultorItemProps) => {
  const initial = nome.charAt(0).toUpperCase();
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: color }}
        >
          {initial}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{nome}</div>
          <div className="text-xs text-muted-foreground">{zona}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-foreground">{lojas}</div>
        <div className="text-xs text-muted-foreground">lojas</div>
      </div>
    </div>
  );
};

export const getConsultorColor = (index: number) => colors[index % colors.length];
