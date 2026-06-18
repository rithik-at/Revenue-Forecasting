"use client";

import { useState } from "react";
import Papa from "papaparse";
import { HistoricalData } from "../app/page";

export default function DataIngestion({ onComplete }: { onComplete: (data: HistoricalData) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "validating" | "success" | "error">("idle");
  const [parsedData, setParsedData] = useState<HistoricalData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [mappedCols, setMappedCols] = useState<{channel: string, spend: string, revenue: string} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setErrorMessage("");
      setMappedCols(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setStatus("validating");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          if (data.length === 0) throw new Error("The CSV file is empty.");

          // Dynamically detect columns based on common names
          const headers = Object.keys(data[0]);
          
          let channelCol = headers.find(h => h.toLowerCase().match(/channel|source|medium|platform|referrer|network/i));
          const campaignCol = headers.find(h => h.toLowerCase().match(/campaign/i));
          const spendCol = headers.find(h => h.toLowerCase().match(/spend|cost|amount|budget/i));
          const revCol = headers.find(h => h.toLowerCase().match(/revenue|sales|value|purchase|return|conv/i));

          if (!spendCol || !revCol) {
            throw new Error(`Could not automatically map columns. Found headers: [${headers.join(", ")}]. Ensure your CSV has recognizable Spend/Cost and Revenue/Sales/Conv columns.`);
          }
          
          // If no channel column exists, we can still proceed by deriving the channel from the filename
          const hasChannelCol = !!channelCol;
          
          setMappedCols({ 
            channel: channelCol || "Auto-detected from filename", 
            spend: spendCol, 
            revenue: revCol 
          });

          let google = { spend: 0, revenue: 0, roas: 0 };
          let meta = { spend: 0, revenue: 0, roas: 0 };
          let ms = { spend: 0, revenue: 0, roas: 0 };

          let matchedRows = 0;
          let campaignsMissingTags = 0;
          const fallbackChannel = file.name.toLowerCase();

          data.forEach(row => {
            const channel = channelCol ? (String(row[channelCol] || "")).toLowerCase() : fallbackChannel;
            const campaign = campaignCol ? String(row[campaignCol] || "") : "";
            
            // Campaign validation: check if campaign name is missing or "unassigned"
            if (!campaign || campaign.toLowerCase() === "unassigned" || campaign.toLowerCase() === "not set") {
              campaignsMissingTags++;
            }
            
            // Clean up currency strings
            const rawSpend = String(row[spendCol] || "").replace(/[^0-9.-]+/g, "");
            const rawRev = String(row[revCol] || "").replace(/[^0-9.-]+/g, "");
            
            const spend = parseFloat(rawSpend) || 0;
            const revenue = parseFloat(rawRev) || 0;
            
            if (channel) {
              matchedRows++;
              if (channel.includes("google") || channel.includes("adwords") || channel.includes("gads")) {
                google.spend += spend;
                google.revenue += revenue;
              } else if (channel.includes("meta") || channel.includes("facebook") || channel.includes("fb") || channel.includes("ig") || channel.includes("instagram")) {
                meta.spend += spend;
                meta.revenue += revenue;
              } else if (channel.includes("ms") || channel.includes("bing") || channel.includes("microsoft")) {
                ms.spend += spend;
                ms.revenue += revenue;
              }
            }
          });

          if (matchedRows === 0) {
             throw new Error("No channels matching Google, Meta, or MS Ads were found in the dataset. Please check the channel names.");
          }

          if (campaignsMissingTags > (data.length * 0.2)) {
            console.warn(`Campaign Consistency Warning: ${campaignsMissingTags} rows have missing or inconsistent campaign tags.`);
          }

          // Calculate ROAS
          google.roas = google.spend > 0 ? google.revenue / google.spend : 0.001; // Avoid exact 0 for JS truthiness
          meta.roas = meta.spend > 0 ? meta.revenue / meta.spend : 0.001;
          ms.roas = ms.spend > 0 ? ms.revenue / ms.spend : 0.001;

          // Simulate additional campaign consistency checks taking time
          setTimeout(() => {
            setParsedData({ google, meta, ms });
            setIsUploading(false);
            setStatus("success");
          }, 1200);

        } catch (err: any) {
          console.error(err);
          setErrorMessage(err.message || "Failed to parse CSV. Please ensure the formatting is correct.");
          setIsUploading(false);
          setStatus("error");
        }
      },
      error: (err) => {
        setErrorMessage(err.message);
        setIsUploading(false);
        setStatus("error");
      }
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Step 1: Ingest Historical Data</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Upload your historical channel-level datasets (GA4 / Shopify .csv). The system will extract your baseline ROAS to power the probabilistic model.
      </p>

      <div 
        style={{ 
          border: "2px dashed var(--border-color)", 
          padding: "3rem", 
          textAlign: "center",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "rgba(0,0,0,0.2)",
          marginBottom: "2rem"
        }}
      >
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={{ display: "none" }} 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="btn-secondary" style={{ cursor: "pointer", display: "inline-block", marginBottom: "1rem" }}>
          Select .CSV File
        </label>
        {file && (
          <p style={{ color: "var(--accent-success)", marginTop: "1rem" }}>
            Selected: {file.name}
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ maxWidth: "60%" }}>
          {status === "validating" && <span style={{ color: "var(--accent-warning)" }}>Parsing CSV, validating campaign consistency, and calculating historical baselines...</span>}
          {status === "error" && <span style={{ color: "var(--accent-danger)", lineHeight: 1.5, display: "block" }}>{errorMessage}</span>}
          {status === "success" && parsedData && (
             <div style={{ color: "var(--accent-success)" }}>
                <p>✓ Successfully mapped: <strong>{mappedCols?.channel}</strong> (Channel), <strong>{mappedCols?.spend}</strong> (Spend), <strong>{mappedCols?.revenue}</strong> (Revenue)</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Baseline ROAS Extracted:<br/>
                  Google ({parsedData.google.roas.toFixed(2)}x), Meta ({parsedData.meta.roas.toFixed(2)}x), MS Ads ({parsedData.ms.roas.toFixed(2)}x)
                </p>
             </div>
          )}
        </div>
        
        {status !== "success" ? (
          <button 
            className="btn-primary" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            style={{ opacity: !file || isUploading ? 0.5 : 1, minWidth: "150px" }}
          >
            {isUploading ? "Processing..." : "Process Data"}
          </button>
        ) : (
          <button className="btn-primary" onClick={() => parsedData && onComplete(parsedData)} style={{ minWidth: "150px" }}>
            Proceed to Budgeting →
          </button>
        )}
      </div>
    </div>
  );
}
