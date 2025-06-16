import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface QuestionItem {
  type: string;
  point: number;
  correct_answer: string[];
  your_answer: string[];
  correct: boolean;
}

interface ResultStatsChartProps {
  details: QuestionItem[];
  calculatePartialPoint: (item: QuestionItem) => number;
}

export default function ResultStatsChart({
  details,
  calculatePartialPoint,
}: ResultStatsChartProps) {
  const typeStats: Record<string, { type: string; total: number; earned: number }> = {};

  details.forEach((item) => {
    const score = calculatePartialPoint(item);
    if (!typeStats[item.type]) {
      typeStats[item.type] = { type: item.type, total: 0, earned: 0 };
    }
    typeStats[item.type].total += item.point;
    typeStats[item.type].earned += score;
  });

  const chartData = Object.values(typeStats).map((stat) => ({
    type: stat.type,
    percent: +((stat.earned / stat.total) * 100).toFixed(1),
  }));

  const totalEarned = details.reduce(
    (sum, item) => sum + calculatePartialPoint(item),
    0
  );
  const totalPossible = details.reduce((sum, item) => sum + item.point, 0);

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-800">
        Total Score: {totalEarned} / {totalPossible}
      </h2>

      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis type="category" dataKey="type" />
            <Tooltip formatter={(value: any) => `${value}% correct`} />
            <Bar dataKey="percent" fill="#3b82f6">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
