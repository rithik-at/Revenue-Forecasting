import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { budgets, period, historicalData } = body;
    
    const googleBudget = budgets?.google || 0;
    const metaBudget = budgets?.meta || 0;
    const msBudget = budgets?.ms || 0;
    const days = period || 30;

    // Extract historical ROAS, fallback to 1.0 only if missing so it doesn't inflate forecast
    const googleBase = historicalData?.google?.roas !== undefined ? historicalData.google.roas : 1.0;
    const metaBase = historicalData?.meta?.roas !== undefined ? historicalData.meta.roas : 1.0;
    const msBase = historicalData?.ms?.roas !== undefined ? historicalData.ms.roas : 1.0;
    
    // Path to the python script
    const scriptPath = path.join(process.cwd(), 'forecast.py');
    
    // Execute the python script passing budgets and historical baselines
    const command = `python ${scriptPath} ${googleBudget} ${metaBudget} ${msBudget} ${days} ${googleBase} ${metaBase} ${msBase}`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.warn('Python Script Warning:', stderr);
    }
    
    const results = JSON.parse(stdout.trim());
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Forecasting API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}
