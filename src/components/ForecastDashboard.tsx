"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function ForecastDashboard({ results }: { results: any }) {
  if (!results) return null;

  const summary = results.summary;
  const channelData = results.channels;
  const seriesData = results.series;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Forecast Results</h2>
      
      <div className="grid-layout" style={{ marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ borderLeft: "4px solid var(--accent-success)" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Expected Total Revenue</p>
          <h3 style={{ fontSize: "2.5rem" }}>${summary.expected_revenue.toLocaleString()}</h3>
          <p style={{ color: "var(--accent-success)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Range: ${summary.lower_bound_revenue.toLocaleString()} - ${summary.upper_bound_revenue.toLocaleString()}
          </p>
        </div>
        
        <div className="glass-panel" style={{ borderLeft: "4px solid var(--accent-primary)" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Blended Expected ROAS</p>
          <h3 style={{ fontSize: "2.5rem" }}>{summary.expected_roas}x</h3>
          <p style={{ color: "var(--accent-primary)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Range: {summary.lower_bound_roas}x - {summary.upper_bound_roas}x
          </p>
        </div>
      </div>

      <div className="grid-layout" style={{ marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ height: "400px", padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Probabilistic Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={seriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBounds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              <Legend />
              <Area type="monotone" dataKey="upperBound" stroke="none" fillOpacity={1} fill="url(#colorBounds)" name="Upper Bound (95%)" />
              <Area type="monotone" dataKey="lowerBound" stroke="none" fillOpacity={1} fill="url(#colorBounds)" name="Lower Bound (5%)" />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Expected Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ height: "400px", padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Channel Contribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={channelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--accent-success)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--accent-warning)" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="expected_revenue" name="Expected Rev ($)" fill="var(--accent-success)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="expected_roas" name="Expected ROAS (x)" fill="var(--accent-warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {results.campaigns && (
        <div className="glass-panel" style={{ height: "400px", padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Campaign-Type Contribution (Simulated)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={results.campaigns} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={120} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
              <Legend />
              <Bar dataKey="expected_revenue" name="Expected Revenue ($)" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="budget" name="Assigned Budget ($)" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
