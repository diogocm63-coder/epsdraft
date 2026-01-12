import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: 'border-l-4 border-l-muted-foreground',
    primary: 'border-l-4 border-l-primary',
    secondary: 'border-l-4 border-l-secondary',
    accent: 'border-l-4 border-l-accent',
  };

  return (
    <div className={`stat-card ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="stat-label">{title}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      {trend && (
        <span className={trend.positive ? 'kpi-positive text-sm' : 'kpi-negative text-sm'}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  );
};
