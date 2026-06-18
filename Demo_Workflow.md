# AIgnition 3.0: Demo Workflow

This document serves as the presentation script and workflow to effectively demonstrate the prototype to the hackathon judges.

## Prerequisites
*   Ensure you have the test data `.csv` file ready on your local machine (from `AIgnition_dataset`).
*   Ensure the Next.js server is running (`npm run dev`).

## Step 1: The Introduction (1 min)
*   **The Hook**: "Today, digital marketing agencies forecast using broken spreadsheets, disconnected platforms, and static data. We built an AIgnition utility that changes this."
*   **The Solution**: "This is a Probabilistic Revenue Forecasting Utility. It ingests historical baseline data, dynamically simulates campaign-level budgets, and uses AI causal inference to explain the forecast and mitigate operational risk."

## Step 2: Data Ingestion & Validation (1.5 mins)
*   **Action**: Click "Select .CSV File" and upload your GA4/Shopify dataset.
*   **Talking Points**:
    *   *Show the validation state*: "Notice the system doesn't just ingest data; it automatically maps columns and runs a **Campaign Consistency Check**. If a marketer forgot to tag campaigns, the system warns us."
    *   *Show the success state*: "It has successfully extracted the historic baseline ROAS for Google, Meta, and MS Ads. These aren't arbitrary numbers; they are mathematically anchored to the client's actual history."

## Step 3: Budget Simulation (1.5 mins)
*   **Action**: Proceed to the "Budget Simulation" tab.
*   **Talking Points**:
    *   "Here, the agency can propose budgets for the next 30, 60, or 90 days."
    *   "Notice how the baseline ROAS is displayed as a reference. Let's drastically increase the Google Ads budget to show what happens."
*   **Action**: Increase Google Ads budget significantly (e.g., to $100,000) and click "Generate Forecast".

## Step 4: Forecast Output & Campaign Splits (2 mins)
*   **Action**: Review the "Forecast Results" dashboard.
*   **Talking Points**:
    *   *Probabilistic Revenue Chart*: "We don't give a single, dangerous deterministic number. We generate a probabilistic forecast with a 90% confidence interval to show the upper and lower bounds of expected revenue."
    *   *Channel Contribution*: "You can see the expected ROAS per channel."
    *   *Campaign-Type Simulated Contribution*: "Scroll down. We break the channel data into specific campaign-type simulations (like Google PMax vs Google Search). This ensures granular planning."

## Step 5: AI-Assisted Causal Insights (2 mins)
*   **Action**: Scroll down to the "AI-Assisted Causal Insights" panel. Wait for the pulse animation to finish.
*   **Talking Points**:
    *   "This is the most powerful part of the utility. The AI analyzes the mathematical forecast."
    *   *Forecast Explanation*: "Notice how the AI explains *why* the ROAS is lower—because we scaled the Google budget too fast, and the model applied a diminishing returns penalty."
    *   *Strategic Opportunity*: "The AI also automatically identified that MS Ads has the highest ROAS margin but the lowest budget, and mathematically recommends shifting 10-15% of the budget to maximize blended ROAS without spending an extra dollar."

## Step 6: Conclusion (1 min)
*   "This prototype proves that forecasting doesn't just have to be predictive; it can be prescriptive. Thank you."
