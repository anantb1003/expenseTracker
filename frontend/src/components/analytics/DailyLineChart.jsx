import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { formatAmount } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-bold">{label}</p>
        <p className="text-emerald-400 mt-0.5">Daily Spend: {formatAmount(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const DailyLineChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No daily spend data available
      </div>
    );
  }

  // Format date ticks to display day number e.g. "01", "02"
  const formattedData = data.map((d) => ({
    ...d,
    dayLabel: d.date ? d.date.split('-')[2] : '',
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="dayLabel"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 3, fill: '#10B981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyLineChart;
