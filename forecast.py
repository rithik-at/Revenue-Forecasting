import sys
import json

def simulate_probabilistic_forecast(google_budget, meta_budget, ms_budget, days, google_roas_base, meta_roas_base, ms_roas_base):
    """
    Probabilistic forecasting model that uses historical dataset baselines
    to predict expected revenue and ROAS.
    """
    total_budget = google_budget + meta_budget + ms_budget
    
    # Diminishing returns penalty (the more budget, the slightly less efficient)
    penalty = (total_budget / 100000) * 0.1
    
    expected_google_rev = google_budget * max(1.0, (google_roas_base - penalty))
    expected_meta_rev = meta_budget * max(1.0, (meta_roas_base - penalty * 1.5))
    expected_ms_rev = ms_budget * max(1.0, (ms_roas_base - penalty * 0.8))
    
    total_expected_rev = expected_google_rev + expected_meta_rev + expected_ms_rev
    expected_roas = total_expected_rev / total_budget if total_budget > 0 else 0
    
    # Add probabilistic bounds (e.g., 90% confidence interval)
    variance = 0.15 # 15% variance
    
    # Generate time series data for the dashboard charts (mocking the curve)
    series_data = []
    points = 7
    step = max(1, days // points)
    
    # Simple linear cumulative growth for the chart
    for i in range(1, points + 1):
        day_num = i * step
        if i == points:
            day_num = days
            
        progress = day_num / days
        
        current_rev = total_expected_rev * progress
        
        # Add some random noise to the curve for realism
        import random
        noise = random.uniform(0.95, 1.05)
        current_rev = current_rev * noise
        
        series_data.append({
            "day": f"Day {day_num}",
            "revenue": round(current_rev, 2),
            "lowerBound": round(current_rev * (1 - variance), 2),
            "upperBound": round(current_rev * (1 + variance), 2)
        })
    
    # Simulated Campaign-Type Revenue Contribution
    campaign_types = [
        { "name": "Google Search", "channel": "Google Ads", "budget": google_budget * 0.6, "expected_revenue": expected_google_rev * 0.55 },
        { "name": "Google PMax", "channel": "Google Ads", "budget": google_budget * 0.4, "expected_revenue": expected_google_rev * 0.45 },
        { "name": "Meta Prospecting", "channel": "Meta Ads", "budget": meta_budget * 0.7, "expected_revenue": expected_meta_rev * 0.65 },
        { "name": "Meta Retargeting", "channel": "Meta Ads", "budget": meta_budget * 0.3, "expected_revenue": expected_meta_rev * 0.35 },
        { "name": "MS Search", "channel": "MS Ads", "budget": ms_budget * 0.8, "expected_revenue": expected_ms_rev * 0.85 },
        { "name": "MS Audience", "channel": "MS Ads", "budget": ms_budget * 0.2, "expected_revenue": expected_ms_rev * 0.15 }
    ]

    # Round the campaign values
    for camp in campaign_types:
        camp["budget"] = round(camp["budget"], 2)
        camp["expected_revenue"] = round(camp["expected_revenue"], 2)

    forecast_results = {
        "summary": {
            "expected_revenue": round(total_expected_rev, 2),
            "lower_bound_revenue": round(total_expected_rev * (1 - variance), 2),
            "upper_bound_revenue": round(total_expected_rev * (1 + variance), 2),
            "expected_roas": round(expected_roas, 2),
            "lower_bound_roas": round(expected_roas * (1 - variance), 2),
            "upper_bound_roas": round(expected_roas * (1 + variance), 2)
        },
        "channels": [
            {
                "name": "Google Ads",
                "budget": google_budget,
                "expected_revenue": round(expected_google_rev, 2),
                "expected_roas": round(expected_google_rev / google_budget, 2) if google_budget > 0 else 0
            },
            {
                "name": "Meta Ads",
                "budget": meta_budget,
                "expected_revenue": round(expected_meta_rev, 2),
                "expected_roas": round(expected_meta_rev / meta_budget, 2) if meta_budget > 0 else 0
            },
            {
                "name": "MS Ads",
                "budget": ms_budget,
                "expected_revenue": round(expected_ms_rev, 2),
                "expected_roas": round(expected_ms_rev / ms_budget, 2) if ms_budget > 0 else 0
            }
        ],
        "campaigns": campaign_types,
        "series": series_data
    }
    
    return forecast_results

if __name__ == "__main__":
    if len(sys.argv) > 7:
        google = float(sys.argv[1])
        meta = float(sys.argv[2])
        ms = float(sys.argv[3])
        days = int(sys.argv[4])
        google_base = float(sys.argv[5])
        meta_base = float(sys.argv[6])
        ms_base = float(sys.argv[7])
        
        results = simulate_probabilistic_forecast(google, meta, ms, days, google_base, meta_base, ms_base)
        print(json.dumps(results))
    else:
        # Default test run
        print(json.dumps(simulate_probabilistic_forecast(50000, 30000, 10000, 30, 3.5, 2.8, 4.1), indent=2))
