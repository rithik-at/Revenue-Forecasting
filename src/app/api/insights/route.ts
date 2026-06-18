import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { forecast } = body;
    
    // Simulate LLM processing time for reasoning
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!forecast || !forecast.channels) {
      return NextResponse.json({ insights: [] });
    }

    // Extract data for reasoning
    const channels = forecast.channels;
    const totalBudget = channels.reduce((sum: number, c: any) => sum + c.budget, 0);
    
    // Find best and worst performing channels
    const sortedByRoas = [...channels].sort((a: any, b: any) => b.expected_roas - a.expected_roas);
    const bestChannel = sortedByRoas[0];
    const worstChannel = sortedByRoas[sortedByRoas.length - 1];

    // 1. Forecast Explanation Reasoning
    const isHighSpend = totalBudget > 75000;
    const explanationText = isHighSpend
      ? `The proposed total budget of $${totalBudget.toLocaleString()} represents a significant scale. Based on historical marginal efficiency curves, scaling spend rapidly typically results in a minor deterioration in ROAS due to diminishing returns. The probabilistic model accounts for this penalty across all channels, projecting a blended ROAS of ${forecast.summary.expected_roas}x.`
      : `The proposed budgets align closely with optimal historical bounds. The blended ROAS is expected to remain highly stable at ${forecast.summary.expected_roas}x, driven primarily by baseline efficiencies. The probabilistic model confirms a low variance in expected returns.`;

    // 2. Dynamic Risk Reasoning
    // Find if the worst performing channel has a significant budget allocation
    const riskText = worstChannel.budget > totalBudget * 0.3
      ? `Risk Identified: ${worstChannel.name} has the lowest expected ROAS (${worstChannel.expected_roas}x) but commands a large portion ($${worstChannel.budget.toLocaleString()}) of the budget. \n\nRecommendation: Consider implementing day-parting rules or reducing weekend budget allocation on ${worstChannel.name} to tighten the probabilistic forecast bounds and reduce downside risk.`
      : `Risk Identified: Natural variance in conversion cycles may affect the lower bound revenue projection of $${forecast.summary.lower_bound_revenue?.toLocaleString()}. \n\nRecommendation: Ensure conversion tracking and attribution are tightly configured across ${bestChannel.name} to prevent budget from inadvertently shifting to underperforming campaigns during the period.`;

    // 3. Dynamic Opportunity Reasoning
    const opportunityText = bestChannel.budget < totalBudget * 0.5
      ? `${bestChannel.name} maintains a strong expected ROAS of ${bestChannel.expected_roas}x based on the historical baseline dataset, but is currently under-allocated at $${bestChannel.budget.toLocaleString()}. \n\nAction: Reallocating 10-15% of budget from ${worstChannel.name} to ${bestChannel.name} could significantly improve blended expected ROAS and increase total revenue without increasing overall ad spend.`
      : `Your budget is optimally allocated towards your strongest performing channel (${bestChannel.name} at ${bestChannel.expected_roas}x ROAS). \n\nAction: Continue monitoring ad frequency and audience saturation to maintain these high returns, and consider scaling ${sortedByRoas[1].name} if efficiency on ${bestChannel.name} begins to plateau.`;

    const mockInsights = [
      {
        id: "insight-1",
        type: "warning",
        title: "Forecast Explanation: Scale vs Efficiency",
        description: explanationText
      },
      {
        id: "insight-2",
        type: "risk",
        title: "Operational Risks & Anomalies",
        description: riskText
      },
      {
        id: "insight-3",
        type: "opportunity",
        title: "Strategic Action Recommendation",
        description: opportunityText
      }
    ];

    return NextResponse.json({ insights: mockInsights });
    
  } catch (error) {
    console.error('Insights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}
