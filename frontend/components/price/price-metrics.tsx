'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Clock, DollarSign } from 'lucide-react';
import { cn, formatCurrency, formatPercentage, formatLargeNumber } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceMetrics {
  current_price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  all_time_high: number;
  all_time_low: number;
  circulating_supply: number;
}

interface PriceMetricsProps {
  className?: string;
}

export function PriceMetrics({ className }: PriceMetricsProps) {
  const [metrics, setMetrics] = useState<PriceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: PriceMetrics = {
      current_price: 0.095420,
      change_24h: 2.47,
      volume_24h: 847392.52,
      market_cap: 4821036.84,
      high_24h: 0.097834,
      low_24h: 0.092156,
      all_time_high: 0.124567,
      all_time_low: 0.045233,
      circulating_supply: 50520000
    };

    // Simulate loading delay
    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !metrics) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Current Price',
      value: formatCurrency(metrics.current_price, 'USD', 4, 6),
      change: metrics.change_24h,
      icon: DollarSign,
      color: 'text-teal-500',
      bgColor: 'bg-slate-100 dark:bg-slate-700'
    },
    {
      title: '24h Volume',
      value: formatCurrency(metrics.volume_24h, 'USD', 0),
      change: null,
      icon: BarChart3,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
      title: 'Market Cap',
      value: formatCurrency(metrics.market_cap, 'USD', 0),
      change: null,
      icon: TrendingUp,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: '24h High/Low',
      value: formatCurrency(metrics.high_24h, 'USD', 4, 6),
      subtitle: formatCurrency(metrics.low_24h, 'USD', 4, 6),
      change: null,
      icon: Activity,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                {metric.change !== null && (
                  <div className={cn(
                    "flex items-center space-x-1 text-sm font-medium",
                    metric.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{formatPercentage(Math.abs(metric.change))}</span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{metric.title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                {metric.subtitle && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Low: {metric.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Clock className="h-4 w-4 text-kale-slate" />
              <span>All Time High</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-kale-black">
                {formatCurrency(metrics.all_time_high, 'USD', 4, 6)}
              </p>
              <p className="text-sm text-kale-slate">
                {formatPercentage((metrics.current_price - metrics.all_time_high) / metrics.all_time_high * 100)} from ATH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Clock className="h-4 w-4 text-kale-slate" />
              <span>All Time Low</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-kale-black">
                {formatCurrency(metrics.all_time_low, 'USD', 4, 6)}
              </p>
              <p className="text-sm text-kale-slate">
                {formatPercentage((metrics.current_price - metrics.all_time_low) / metrics.all_time_low * 100)} from ATL
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="h-4 w-4 text-kale-slate" />
              <span>Supply Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-kale-slate">Circulating Supply</p>
                <p className="text-lg font-semibold text-kale-black">
                  {formatLargeNumber(metrics.circulating_supply)} KALE
                </p>
              </div>
              <div className="pt-2 border-t border-kale-light-slate">
                <p className="text-xs text-kale-slate">
                  Market Cap / Supply = {formatCurrency(metrics.market_cap / metrics.circulating_supply, 'USD', 4, 6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}