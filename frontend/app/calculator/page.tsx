'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  Info,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';

export default function ROICalculatorPage() {
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const [sessionDuration, setSessionDuration] = useState<number>(2.5);
  const [gasPrice, setGasPrice] = useState<number>(0.1);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');

  // Mock current market data
  const marketData = {
    currentPrice: 0.095420,
    emissionRate: 425,
    difficulty: 0.75,
    successRate: 0.89,
    networkFee: 0.1
  };

  // Calculate ROI based on inputs
  const calculateROI = () => {
    const baseReward = (stakeAmount * 0.08 * (sessionDuration / 2.5)); // Base 8% for 2.5h session
    const difficultyMultiplier = Math.max(0.5, 1 - marketData.difficulty * 0.3);
    const expectedReward = baseReward * difficultyMultiplier * marketData.successRate;
    
    const rewardValue = expectedReward * marketData.currentPrice;
    const totalCosts = gasPrice + (stakeAmount * marketData.currentPrice * 0.001); // 0.1% opportunity cost
    const netProfit = rewardValue - totalCosts;
    const roi = (netProfit / (stakeAmount * marketData.currentPrice)) * 100;
    
    return {
      expectedReward,
      rewardValue,
      totalCosts,
      netProfit,
      roi,
      breakEvenPrice: totalCosts / expectedReward,
      timeToBreakEven: sessionDuration
    };
  };

  const results = calculateROI();

  const riskFactors = [
    {
      factor: 'Price Volatility',
      risk: 'Medium',
      impact: 'High',
      description: 'KALE price fluctuations affect reward value',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      factor: 'Network Difficulty',
      risk: 'Low',
      impact: 'Medium',
      description: 'Current difficulty is stable',
      color: 'text-kale-green bg-green-100'
    },
    {
      factor: 'Emission Rate Changes',
      risk: 'Medium',
      impact: 'High',
      description: 'Emission rate may decrease',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      factor: 'Session Success',
      risk: 'Low',
      impact: 'Low',
      description: 'High historical success rate',
      color: 'text-kale-green bg-green-100'
    }
  ];

  const scenarios = [
    {
      name: 'Conservative',
      multiplier: 0.7,
      description: 'Lower rewards, higher success rate'
    },
    {
      name: 'Expected',
      multiplier: 1.0,
      description: 'Current market conditions'
    },
    {
      name: 'Optimistic',
      multiplier: 1.4,
      description: 'Favorable conditions, higher rewards'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-kale-green" />
              <span>ROI Calculator</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Calculate expected returns and analyze farming profitability
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-kale-slate">
              KALE Price: <span className="font-semibold text-kale-black">
                {formatCurrency(marketData.currentPrice, 'USD', 4, 6)}
              </span>
            </div>
            <div className="text-sm text-kale-slate">
              Emission: <span className="font-semibold text-kale-black">
                {marketData.emissionRate} KALE/min
              </span>
            </div>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Settings className="h-4 w-4 text-kale-teal" />
                  <span>Parameters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stake Amount */}
                <div>
                  <label className="block text-sm font-medium text-kale-black mb-2">
                    Stake Amount (KALE)
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
                    min="1"
                    step="100"
                  />
                  <p className="text-xs text-kale-slate mt-1">
                    Value: {formatCurrency(stakeAmount * marketData.currentPrice, 'USD')}
                  </p>
                </div>

                {/* Session Duration */}
                <div>
                  <label className="block text-sm font-medium text-kale-black mb-2">
                    Session Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
                    min="0.5"
                    max="24"
                    step="0.5"
                  />
                  <p className="text-xs text-kale-slate mt-1">
                    Recommended: 2-4 hours for optimal returns
                  </p>
                </div>

                {/* Gas Price */}
                <div>
                  <label className="block text-sm font-medium text-kale-black mb-2">
                    Transaction Costs (XLM)
                  </label>
                  <input
                    type="number"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
                    min="0.01"
                    step="0.01"
                  />
                  <p className="text-xs text-kale-slate mt-1">
                    Includes plant and harvest transaction fees
                  </p>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className="block text-sm font-medium text-kale-black mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
                  >
                    <option value="low">Low - Conservative</option>
                    <option value="medium">Medium - Balanced</option>
                    <option value="high">High - Aggressive</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Market Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <BarChart3 className="h-4 w-4 text-kale-pink" />
                  <span>Market Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Difficulty</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatPercentage(marketData.difficulty * 100, 1, false)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Success Rate</span>
                    <span className="text-sm font-medium text-kale-green">
                      {formatPercentage(marketData.successRate * 100, 1, false)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Network Fee</span>
                    <span className="text-sm font-medium text-kale-black">
                      {marketData.networkFee} XLM
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="xl:col-span-2 space-y-6">
            {/* ROI Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-kale-green" />
                  <span>Projected Returns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <Target className="h-8 w-8 text-kale-green mx-auto mb-2" />
                    <div className="text-2xl font-bold text-kale-black">
                      {formatLargeNumber(results.expectedReward)} KALE
                    </div>
                    <div className="text-sm text-kale-slate">Expected Reward</div>
                    <div className="text-xs text-kale-slate mt-1">
                      {formatCurrency(results.rewardValue, 'USD')}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <DollarSign className="h-8 w-8 text-kale-pink mx-auto mb-2" />
                    <div className="text-2xl font-bold text-kale-black">
                      {formatCurrency(results.netProfit, 'USD')}
                    </div>
                    <div className="text-sm text-kale-slate">Net Profit</div>
                    <div className="text-xs text-kale-slate mt-1">
                      After all costs
                    </div>
                  </div>

                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <Zap className="h-8 w-8 text-kale-teal mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${
                      results.roi >= 0 ? 'text-kale-green' : 'text-red-500'
                    }`}>
                      {formatPercentage(results.roi, 2)}
                    </div>
                    <div className="text-sm text-kale-slate">ROI</div>
                    <div className="text-xs text-kale-slate mt-1">
                      Per session
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-kale-light-slate">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Break-even Price:</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatCurrency(results.breakEvenPrice, 'USD', 4, 6)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Total Investment:</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatCurrency(stakeAmount * marketData.currentPrice, 'USD')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Total Costs:</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatCurrency(results.totalCosts, 'USD')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Session Duration:</span>
                    <span className="text-sm font-medium text-kale-black">
                      {sessionDuration}h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-kale-teal" />
                  <span>Scenario Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map((scenario, index) => {
                    const scenarioReward = results.expectedReward * scenario.multiplier;
                    const scenarioValue = scenarioReward * marketData.currentPrice;
                    const scenarioProfit = scenarioValue - results.totalCosts;
                    const scenarioROI = (scenarioProfit / (stakeAmount * marketData.currentPrice)) * 100;

                    return (
                      <div key={index} className={`p-4 rounded-lg border-2 ${
                        scenario.name === 'Expected' 
                          ? 'border-kale-green bg-green-50' 
                          : 'border-kale-light-slate bg-white'
                      }`}>
                        <h4 className="font-semibold text-kale-black mb-2">{scenario.name}</h4>
                        <p className="text-xs text-kale-slate mb-3">{scenario.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-kale-slate">Reward:</span>
                            <span className="text-sm font-medium text-kale-black">
                              {formatLargeNumber(scenarioReward)} KALE
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-kale-slate">Profit:</span>
                            <span className={`text-sm font-medium ${
                              scenarioProfit >= 0 ? 'text-kale-green' : 'text-red-500'
                            }`}>
                              {formatCurrency(scenarioProfit, 'USD')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-kale-slate">ROI:</span>
                            <span className={`text-sm font-bold ${
                              scenarioROI >= 0 ? 'text-kale-green' : 'text-red-500'
                            }`}>
                              {formatPercentage(scenarioROI, 1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="p-4 border border-kale-light-slate rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-kale-black">{risk.factor}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${risk.color}`}>
                          {risk.risk}
                        </span>
                      </div>
                      <p className="text-sm text-kale-slate mb-2">{risk.description}</p>
                      <div className="text-xs text-kale-slate">
                        Impact: <span className="font-medium">{risk.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Disclaimer</h4>
                      <p className="text-sm text-blue-800">
                        These calculations are estimates based on current market conditions. 
                        Actual results may vary due to network changes, price volatility, and other factors. 
                        Please assess your risk tolerance before farming.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
