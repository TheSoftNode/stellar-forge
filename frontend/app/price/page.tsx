'use client';

import { useState } from 'react';
import { PriceChart } from '@/components/price/price-chart';
import { PriceMetrics } from '@/components/price/price-metrics';
import { PriceTimeframeSelector } from '@/components/price/price-timeframe-selector';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, LineChart, Activity } from 'lucide-react';

export default function PricePage() {
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-teal-500" />
              <span>StellarForge Price Tracker</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Real-time price data and market analytics for Stellar ecosystem
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Chart Type Toggle */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setChartType('area')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <LineChart className="h-4 w-4" />
              </button>
            </div>

            {/* Timeframe Selector */}
            <PriceTimeframeSelector
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>
        </div>

        {/* Price Metrics */}
        <PriceMetrics />

        {/* Price Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PriceChart timeframe={timeframe} chartType={chartType} />
          </div>

          {/* Price Info Sidebar */}
          <div className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Market Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Network</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Stellar Network</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                    <span className="text-sm font-medium text-green-500">Live</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Update</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Just now</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Data Source</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Multi-source</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Price Sources</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Stellar DEX', status: 'active', price: '$0.095420' },
                      { name: 'SorobanDEX', status: 'active', price: '$0.095418' },
                      { name: 'Aqua Network', status: 'active', price: '$0.095422' }
                    ].map((source, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            source.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                          }`}></div>
                          <span className="text-slate-600 dark:text-slate-400">{source.name}</span>
                        </div>
                        <span className="font-mono text-slate-900 dark:text-white">{source.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white">
                  <BarChart3 className="h-4 w-4 text-teal-500" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Active Traders (24h)', value: '1,247', change: '+12%' },
                    { label: 'Transactions (24h)', value: '8,934', change: '+8.5%' },
                    { label: 'Avg Trade Size', value: '$94.72', change: '+2.1%' },
                    { label: 'Holders', value: '23,456', change: '+0.8%' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{stat.value}</div>
                        <div className="text-xs text-green-500">{stat.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}