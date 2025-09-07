'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceChart } from '@/components/price/price-chart';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Sprout,
  Calculator,
  AlertTriangle,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatLargeNumber } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { priceAPI, farmingAPI } from '@/lib/api';

export default function DashboardOverview() {
  // Fetch real data from API
  const { data: currentPrice, isLoading: priceLoading } = useQuery({
    queryKey: ['current-price'],
    queryFn: () => priceAPI.getCurrent(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: priceStats, isLoading: statsLoading } = useQuery({
    queryKey: ['price-statistics'],
    queryFn: () => priceAPI.getStatistics(24),
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: farmingStats, isLoading: farmingLoading } = useQuery({
    queryKey: ['farming-stats'],
    queryFn: () => farmingAPI.getStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: networkHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['network-health'],
    queryFn: () => farmingAPI.getNetworkHealth(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Loading state
  const isLoading = priceLoading || statsLoading || farmingLoading || healthLoading;

  // Default values for loading state
  const price = currentPrice?.price ?? 0;
  const priceChange = priceStats?.price_24h_change_percent ?? 0;
  const activeFarmers = farmingStats?.active_farmers ?? 0;
  const totalStaked = farmingStats?.total_staked ?? 0;
  const networkHealthScore = networkHealth?.overall_health_score ?? 0;
  const emissionRate = farmingStats?.current_emission_rate ?? 0;
  const farmingDifficulty = farmingStats?.farming_difficulty ?? 0;

  const quickStats = [
    {
      title: 'KALE Price',
      value: isLoading ? '...' : formatCurrency(price, 'USD', 4, 6),
      change: isLoading ? '...' : `${priceChange > 0 ? '+' : ''}${formatPercentage(priceChange, 1)}`,
      isPositive: priceChange >= 0,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Active Farmers',
      value: isLoading ? '...' : formatLargeNumber(activeFarmers),
      change: '+12.3%', // This would need historical data to calculate
      isPositive: true,
      icon: Users,
      color: 'text-teal-500'
    },
    {
      title: 'Total Staked',
      value: isLoading ? '...' : formatLargeNumber(totalStaked) + ' KALE',
      change: '+5.8%', // This would need historical data to calculate
      isPositive: true,
      icon: Sprout,
      color: 'text-green-500'
    },
    {
      title: 'Network Health',
      value: isLoading ? '...' : formatPercentage(networkHealthScore * 100, 1, false),
      change: '+0.5%', // This would need historical data to calculate
      isPositive: true,
      icon: Activity,
      color: 'text-pink-500'
    }
  ];

  const alerts = [
    {
      type: 'opportunity',
      title: 'Optimal Farming Conditions',
      message: isLoading ? 'Loading...' : `Current emission rate: ${emissionRate} KALE/min`,
      time: '5m ago',
      color: 'text-green-500'
    },
    {
      type: 'market',
      title: 'Price Movement Alert',
      message: isLoading ? 'Loading...' : `KALE showing ${priceChange >= 0 ? 'bullish' : 'bearish'} momentum (${formatPercentage(priceChange, 1)} in 24h)`,
      time: '12m ago',
      color: 'text-pink-500'
    },
    {
      type: 'network',
      title: 'Network Health',
      message: isLoading ? 'Loading...' : `Network health score: ${formatPercentage(networkHealthScore * 100, 1)}`,
      time: '1h ago',
      color: 'text-yellow-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to StellarForge Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Monitor prices, track farming opportunities, and maximize your Stellar rewards
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Live Data</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
              <Globe className="w-3 h-3" />
              <span>Stellar Network</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                        {stat.value}
                      </p>
                      <div className={`flex items-center space-x-1 mt-2 text-sm ${
                        stat.isPositive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <TrendingUp className={`h-3 w-3 ${!stat.isPositive && 'rotate-180'}`} />
                        <span>{stat.change}</span>
                        <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">vs 24h</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Price Chart - Takes 2 columns */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <PriceChart timeframe="24h" chartType="area" />
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">ROI Calculator</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">Calculate farming returns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Sprout className="h-6 w-6 sm:h-8 sm:w-8 text-teal-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Start Farming</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">Begin earning rewards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Analytics</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">Deep farming insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Market Status */}
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Market Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Price</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {isLoading ? '...' : formatCurrency(price, 'USD', 4, 6)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">24h High</span>
                    <span className="text-sm font-medium text-green-500">
                      {isLoading ? '...' : formatCurrency(priceStats?.price_24h_high ?? 0, 'USD', 4, 6)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">24h Low</span>
                    <span className="text-sm font-medium text-red-500">
                      {isLoading ? '...' : formatCurrency(priceStats?.price_24h_low ?? 0, 'USD', 4, 6)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">24h Change</span>
                    <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {isLoading ? '...' : `${priceChange >= 0 ? '+' : ''}${formatPercentage(priceChange, 2)}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Alerts */}
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Live Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          alert.type === 'opportunity' ? 'bg-green-500' :
                          alert.type === 'market' ? 'bg-pink-500' :
                          'bg-yellow-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{alert.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{alert.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Stats */}
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white">
                  <Zap className="h-4 w-4 text-teal-500" />
                  <span>Network Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Emission Rate</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {isLoading ? '...' : `${emissionRate} KALE/min`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Difficulty</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {isLoading ? '...' : formatPercentage(farmingDifficulty * 100, 1, false)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Farmers</span>
                    <span className="text-sm font-medium text-green-500">
                      {isLoading ? '...' : formatLargeNumber(activeFarmers)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Recent Harvests</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {isLoading ? '...' : farmingStats?.recent_harvests ?? 0}
                    </span>
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
