import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function NetWorthChart({ trajectory = [], currentState }) {
  const chartData = trajectory.length
    ? trajectory
    : currentState
      ? [{ month: 1, netWorth: currentState.netWorth }]
      : [];

  const formatMoney = (value = 0) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const latestValue = chartData.length
    ? chartData[chartData.length - 1].netWorth
    : currentState?.netWorth || 0;

  return (
    <div className="net-worth-chart">
      <div className="chart-header">
        <div>
          <span>NET WORTH TRAJECTORY</span>
          <h3>{formatMoney(latestValue)}</h3>
        </div>

        <span className="chart-period">LIVE SIMULATION</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              stroke="rgba(155, 207, 75, 0.10)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickFormatter={(month) => `M${month}`}
              tick={{ fill: "#c9c6b5", fontSize: 11 }}
              axisLine={{ stroke: "rgba(155, 207, 75, 0.18)" }}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) => `₹${Math.round(value / 1000)}K`}
              tick={{ fill: "#c9c6b5", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [formatMoney(value), "Net Worth"]}
              labelFormatter={(month) => `Month ${month}`}
              contentStyle={{
                background: "#06261a",
                border: "1px solid rgba(155, 207, 75, 0.18)",
                borderRadius: "4px",
                color: "#f2eddc",
              }}
              labelStyle={{ color: "#9bcf4b" }}
            />

            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="#9bcf4b"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#9bcf4b",
                stroke: "#031b13",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default NetWorthChart;
