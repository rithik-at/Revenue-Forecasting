# AIgnition 3.0: Architecture Overview

## 1. Frontend Stack
*   **Framework**: Next.js 14 (App Router) with React.
*   **Styling**: Vanilla CSS (`globals.css`) with custom CSS variables for a modern, glassmorphic UI design.
*   **Visualization**: Recharts (for dynamic Area and Bar charts to display probabilistic forecasts and campaign-type contributions).
*   **Data Parsing**: PapaParse (for client-side ingestion and validation of `.csv` data, ensuring data security by not passing raw PII to the backend).

## 2. Backend Stack
*   **Framework**: Next.js API Routes (`/api/forecast`, `/api/insights`).
*   **Execution Environment**: Node.js utilizing `child_process` to interface with the mathematical engine.
*   **Forecasting Engine**: Python 3.
    *   *Why Python?* Python is the industry standard for data science. Isolating the mathematical simulation in `forecast.py` allows us to easily scale to more complex Pandas/NumPy structures or Scikit-Learn models in the future without blocking the Node event loop.

## 3. Forecasting Pipeline
1.  **Client-Side Ingestion**: The user uploads a `.csv`. The frontend parses it, validates campaign consistency, and extracts the historic baseline ROAS for each channel.
2.  **API Transport**: The frontend sends the user's proposed budgets and the historical baselines to the `/api/forecast` endpoint via a POST request.
3.  **Python Engine Execution**: The Node server executes `forecast.py`, passing the parameters as arguments.
4.  **Probabilistic Calculation**: The Python engine applies diminishing return penalties to the baselines based on budget scale, calculates expected revenue, simulates campaign-type splits, and generates 90% confidence lower/upper bounds.
5.  **Data Hydration**: The JSON results are returned to the frontend to hydrate the interactive `ForecastDashboard`.

## 4. LLM Integration Workflow
1.  **Trigger**: Once the forecast is generated and rendered, the frontend immediately triggers a call to `/api/insights`, passing the entire generated forecast object.
2.  **Analysis Layer**: The API route processes the numerical data. It ranks channels by expected ROAS, calculates total spend thresholds, and flags variance risks.
3.  **AI Generation**: (Currently configured via a dynamic logical rule engine to simulate LLM causal inference safely). The system dynamically injects the context and math into structured causal insight components:
    *   **Forecast Explanation**: Explains why the blended ROAS looks the way it does.
    *   **Risk Identification**: Flags if too much budget is in the worst channel.
    *   **Strategic Opportunity**: Recommends reallocation rules.
4.  **UI Delivery**: The insights are streamed back to the client via a loading-state component.
