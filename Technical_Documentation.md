# AIgnition 3.0: Technical Documentation

## 1. Forecasting Methodology
Our solution employs a **Probabilistic Causal Forecasting Model** designed specifically for digital agency workflows. Unlike traditional deterministic models that produce a single revenue number, our model calculates expected revenue while generating 90% confidence bounds based on historical variance. 

### Model Selection
We opted for a **Marginal Efficiency Decay Model** rather than a standard linear regression or time-series (e.g., ARIMA/Prophet). 
*   **Why?** In media buying, scaling budget linearly does *not* scale revenue linearly. Our model dynamically penalizes the baseline ROAS as budgets increase to simulate the diminishing returns often observed when scaling Google Ads, Meta Ads, or MS Ads.

## 2. Data Preprocessing Logic
The pipeline begins by ingesting flat `.csv` exports from analytics platforms (GA4 / Shopify).
1.  **Column Mapping**: The system dynamically scans for `Channel/Source`, `Spend`, and `Revenue` headers to minimize manual data formatting.
2.  **Campaign Consistency Check**: It validates the `Campaign` column. If a significant percentage of rows have missing or "unassigned" campaign tags, the system flags an anomaly.
3.  **Baseline Extraction**: We aggregate historical spend and revenue by channel to compute the exact historic baseline ROAS. This acts as the anchor for the probabilistic model.

## 3. Assumptions & Limitations
### Assumptions
*   **Stationarity of Conversion Rates**: We assume the underlying market demand and website conversion rates remain relatively stable compared to the historical training period.
*   **Fixed Channel Splits**: For our campaign-type breakdown (e.g., PMax vs Search), we assume a standard distribution of budget based on typical ecommerce ad-account structures.

### Limitations
*   **Attribution Blindspots**: We rely entirely on the provided `.csv` attribution. The model does not currently perform cross-channel fractional attribution (MMM), meaning it treats each channel's reported revenue as absolute.
*   **Granular Seasonality**: Currently, the aggregate forecasting window handles macroeconomic scaling, but does not yet account for micro-seasonality (e.g., Black Friday weekend spikes) within the 30/60/90 day periods.

## 4. AI Integration Strategy
Instead of blindly generating text, our application utilizes an **AI-Assisted Causal Inference Layer**.
*   **Data Injection**: The exact outputs from the Python forecasting engine (budgets, ROAS, revenue bounds, and channel constraints) are passed to the AI inference engine.
*   **Operational Reasoning**: The AI simulates an expert media buyer's reasoning by analyzing the data array. It looks for scale penalties, budget misallocations, and conversion variances.
*   **Actionable Insights**: It then outputs structured, actionable business recommendations (e.g., "Shift 15% budget from Meta to MS Ads to optimize blended ROAS").
