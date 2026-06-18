"use client";

import { useState, useEffect } from "react";

export default function AIInsights({ forecast }: { forecast?: any }) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!forecast) return;
    
    let isMounted = true;
    setLoading(true);

    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ forecast })
        });
        const data = await res.json();
        if (isMounted && data.insights) {
          setInsights(data.insights);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchInsights();

    return () => { isMounted = false; };
  }, [forecast]);

  if (!forecast) return null;

  return (
    <div className="glass-panel" style={{ marginTop: "2rem", padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ✨
        </div>
        <h2 style={{ fontSize: "1.5rem" }}>AI-Assisted Causal Insights</h2>
      </div>
      
      {loading ? (
        <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-secondary)" }}>
          <div className="pulse-animation" style={{ fontSize: "1.1rem" }}>
            ✨ Analyzing probabilistic models & generating strategic insights...
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {insights.map((insight: any) => (
            <div key={insight.id} style={{ 
              background: "var(--bg-secondary)", 
              padding: "1.5rem", 
              borderRadius: "var(--radius-md)", 
              borderLeft: `4px solid ${
                insight.type === 'warning' ? 'var(--accent-primary)' : 
                insight.type === 'risk' ? 'var(--accent-warning)' : 
                'var(--accent-success)'
              }` 
            }}>
              <h4 style={{ 
                color: insight.type === 'warning' ? 'var(--accent-primary)' : 
                       insight.type === 'risk' ? 'var(--accent-warning)' : 
                       'var(--accent-success)', 
                marginBottom: "0.5rem" 
              }}>
                {insight.title}
              </h4>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse-anim 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </div>
  );
}
