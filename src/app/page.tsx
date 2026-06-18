"use client";

import { useState } from "react";
import DataIngestion from "@/components/DataIngestion";
import BudgetSimulation from "@/components/BudgetSimulation";
import ForecastDashboard from "@/components/ForecastDashboard";
import AIInsights from "@/components/AIInsights";

export type HistoricalData = {
  google: { spend: number; revenue: number; roas: number };
  meta: { spend: number; revenue: number; roas: number };
  ms: { spend: number; revenue: number; roas: number };
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("data");
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [forecastResults, setForecastResults] = useState<any>(null);

  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '3rem', textAlign: 'center' }} className="animate-fade-in">
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span className="text-gradient">AIgnition</span> Forecasting Utility
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
            Probabilistic Revenue & ROAS Prediction for Digital Agencies
          </p>
        </header>

        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button 
            className={activeTab === 'data' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => setActiveTab('data')}
          >
            1. Data Ingestion
          </button>
          <button 
            className={activeTab === 'budget' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => setActiveTab('budget')}
            disabled={!historicalData}
            style={{ opacity: !historicalData && activeTab !== 'budget' ? 0.5 : 1 }}
          >
            2. Budget Simulation
          </button>
          <button 
            className={activeTab === 'forecast' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => setActiveTab('forecast')}
            disabled={!forecastResults}
            style={{ opacity: !forecastResults && activeTab !== 'forecast' ? 0.5 : 1 }}
          >
            3. View Forecast
          </button>
        </nav>

        <div className="glass-panel animate-fade-in" style={{ minHeight: '500px' }}>
          {activeTab === 'data' && (
            <DataIngestion 
              onComplete={(data) => {
                setHistoricalData(data);
                setActiveTab('budget');
              }} 
            />
          )}
          {activeTab === 'budget' && historicalData && (
            <BudgetSimulation 
              historicalData={historicalData}
              onComplete={(results) => {
                setForecastResults(results);
                setActiveTab('forecast');
              }} 
            />
          )}
          {activeTab === 'forecast' && forecastResults && (
            <div className="grid-layout">
              <div style={{ gridColumn: '1 / -1' }}>
                 <ForecastDashboard results={forecastResults} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                 <AIInsights forecast={forecastResults} />
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
