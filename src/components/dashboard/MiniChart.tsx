import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface MiniBarChartProps {
  data: { name: string; value: number; value2?: number }[];
  height?: number;
  showLegend?: boolean;
}

const COLORS = ['hsl(214, 65%, 33%)', 'hsl(122, 39%, 49%)', 'hsl(200, 70%, 50%)', 'hsl(45, 90%, 55%)'];

export const MiniBarChart = ({ data, height = 150, showLegend = false }: MiniBarChartProps) => {
  const hasValue2 = data.some(d => d.value2 !== undefined);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} width={40} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }} 
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px' }} />}
        <Bar dataKey="value" fill={COLORS[0]} radius={[2, 2, 0, 0]} name="Reservas" />
        {hasValue2 && <Bar dataKey="value2" fill={COLORS[1]} radius={[2, 2, 0, 0]} name="Vendas" />}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MiniPieChart = ({ data, height = 150 }: MiniBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const MiniLineChart = ({ data, height = 150 }: MiniBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} width={40} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }} 
        />
        <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} name="Reservas" />
        <Line type="monotone" dataKey="value2" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 3 }} name="Vendas" />
        <Legend wrapperStyle={{ fontSize: '10px' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
