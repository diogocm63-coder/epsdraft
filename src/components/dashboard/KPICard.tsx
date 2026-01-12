import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'blue' | 'green' | 'dark';
}

export const KPICard = ({ title, value, icon: Icon, trend, variant = 'blue' }: KPICardProps) => {
  const iconBgStyles = {
    blue: 'bg-primary text-primary-foreground',
    green: 'bg-secondary text-secondary-foreground',
    dark: 'bg-agris-dark text-primary-foreground',
  };

  return (
    <div className="bg-card rounded-xl border p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive 
              ? 'bg-secondary/10 text-secondary' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {trend.positive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{title}</div>
      </div>
    </div>
  );
};
