"use client";

import { useState } from "react";
import { HistoricalData } from "../app/page";

export default function BudgetSimulation({ 
  historicalData, 
  onComplete 
}: { 
  historicalData: HistoricalData;
  onComplete: (results: any) => void;
}) {
  const [period, setPeriod] = useState<30 | 60 | 90>(30);
  const [budgets, setBudgets] = useState({
    google: historicalData.google.spend > 0 ? Math.round(historicalData.google.spend) : 50000,
    meta: historicalData.meta.spend > 0 ? Math.round(historicalData.meta.spend) : 30000,
    ms: historicalData.ms.spend > 0 ? Math.round(historicalData.ms.spend) : 10000,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgets,
          period,
          historicalData // We send the dynamically parsed ROAS baseline to the backend!
        })
      });

      if (!response.ok) throw new Error("Failed to forecast");
      const data = await response.json();
      
      setIsSimulating(false);
      onComplete(data);
    } catch (error) {
      console.error(error);
      setIsSimulating(false);
      alert("Error generating forecast. Check console for details.");
    }
  };

  const totalBudget = budgets.google + budgets.meta + budgets.ms;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Step 2: Budget Simulation</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Enter your proposed media budgets for the upcoming planning period to forecast Revenue and ROAS ranges.
        Your historical baseline efficiency has been successfully loaded.
      </p>

      <div className="grid-layout" style={{ marginBottom: "2rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Planning Period</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(Number(e.target.value) as 30|60|90)}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid-layout" style={{ marginBottom: "2rem", gap: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.8rem", color: "var(--accent-success)" }}>
            Baseline ROAS: {historicalData.google.roas.toFixed(2)}x
          </div>
          <h3 style={{ marginBottom: "1rem", color: "var(--accent-primary)" }}>Google Ads</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>$</span>
            <input 
              type="number" 
              value={budgets.google}
              onChange={(e) => setBudgets({...budgets, google: Number(e.target.value)})}
              style={{ width: "100%", fontSize: "1.25rem" }}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.8rem", color: "var(--accent-success)" }}>
            Baseline ROAS: {historicalData.meta.roas.toFixed(2)}x
          </div>
          <h3 style={{ marginBottom: "1rem", color: "var(--accent-secondary)" }}>Meta Ads</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>$</span>
            <input 
              type="number" 
              value={budgets.meta}
              onChange={(e) => setBudgets({...budgets, meta: Number(e.target.value)})}
              style={{ width: "100%", fontSize: "1.25rem" }}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.8rem", color: "var(--accent-success)" }}>
            Baseline ROAS: {historicalData.ms.roas.toFixed(2)}x
          </div>
          <h3 style={{ marginBottom: "1rem", color: "var(--accent-warning)" }}>MS Ads</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>$</span>
            <input 
              type="number" 
              value={budgets.ms}
              onChange={(e) => setBudgets({...budgets, ms: Number(e.target.value)})}
              style={{ width: "100%", fontSize: "1.25rem" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
        <div>
          <span style={{ color: "var(--text-secondary)", display: "block" }}>Total Proposed Budget</span>
          <span style={{ fontSize: "2rem", fontWeight: 700 }}>${totalBudget.toLocaleString()}</span>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={handleSimulate}
          disabled={isSimulating}
        >
          {isSimulating ? "Running Probabilistic Models..." : "Generate Forecast"}
        </button>
      </div>
    </div>
  );
}
