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
  group: string; // Group sahəsi əlavə olundu
}

interface ResultStatsChartProps {
  details: QuestionItem[];
  calculatePartialPoint: (item: QuestionItem) => number;
}

export default function ResultStatsChart({
  details,
  calculatePartialPoint,
}: ResultStatsChartProps) {
  // Group-a görə statistikalar
  const groupStats: Record<string, { group: string; total: number; earned: number }> = {};

  details.forEach((item) => {
    const score = calculatePartialPoint(item);
    const group = item.group || 'Other'; // fallback əgər group gəlməsə

    if (!groupStats[group]) {
      groupStats[group] = { group, total: 0, earned: 0 };
    }
    groupStats[group].total += item.point;
    groupStats[group].earned += score;
  });

  const chartData = Object.values(groupStats).map((stat) => ({
    group: stat.group,
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
            <YAxis type="category" dataKey="group" />
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
