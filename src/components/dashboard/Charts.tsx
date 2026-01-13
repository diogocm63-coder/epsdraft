import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
  value4?: number;
}

interface ChartProps {
  data: ChartData[];
  height?: number | string;
  showGrid?: boolean;
}

const COLORS = {
  primary: '#1e4d8c',
  secondary: '#4caf50',
  accent: '#3b9ddd',
  muted: '#94a3b8',
  tertiary: '#f59e0b',
  quaternary: '#8b5cf6'
};

export const AreaChartComponent = ({ data, height = 250, showGrid = true }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px'
          }} 
        />
        <defs>
          <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorRecTecnicas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.tertiary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.tertiary} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPrevisao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.quaternary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.quaternary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={COLORS.primary} 
          strokeWidth={2}
          fill="url(#colorVendas)" 
          name="Vendas"
          dot={{ fill: COLORS.primary, strokeWidth: 0, r: 3 }}
        />
        <Area 
          type="monotone" 
          dataKey="value2" 
          stroke={COLORS.secondary} 
          strokeWidth={2}
          fill="url(#colorReservas)" 
          name="Encomendas"
          dot={{ fill: COLORS.secondary, strokeWidth: 0, r: 3 }}
        />
        <Area 
          type="monotone" 
          dataKey="value3" 
          stroke={COLORS.tertiary} 
          strokeWidth={2}
          fill="url(#colorRecTecnicas)" 
          name="Rec. Técnicas"
          dot={{ fill: COLORS.tertiary, strokeWidth: 0, r: 3 }}
        />
        <Area 
          type="monotone" 
          dataKey="value4" 
          stroke={COLORS.quaternary} 
          strokeWidth={2}
          fill="url(#colorPrevisao)" 
          name="Previsão Vendas"
          dot={{ fill: COLORS.quaternary, strokeWidth: 0, r: 3 }}
        />
        <Legend 
          iconType="circle" 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const HorizontalBarChart = ({ data, height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={55} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px'
          }} 
        />
        <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} name="Vendas" />
        {data[0]?.value2 !== undefined && (
          <Bar dataKey="value2" fill={COLORS.secondary} radius={[0, 4, 4, 0]} name="Reservas" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const GroupedBarChart = ({ data, height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}K` : v} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px'
          }} 
        />
        <Bar dataKey="value" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Previsto" />
        <Bar dataKey="value2" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Real" />
        <Legend 
          iconType="square" 
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DonutChart = ({ data, height = 280 }: ChartProps) => {
  const DONUT_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          iconType="square" 
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value, entry: any) => {
            const total = data.reduce((a, b) => a + b.value, 0);
            const percent = ((entry.payload.value / total) * 100).toFixed(0);
            return `${value} ${percent}%`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
