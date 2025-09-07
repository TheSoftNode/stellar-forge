'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
  change_24h: number;
}

interface PriceChartProps {
  className?: string;
  timeframe?: '1h' | '24h' | '7d' | '30d';
  chartType?: 'line' | 'area';
}

export function PriceChart({ className, timeframe = '24h', chartType = 'area' }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);

  // Mock data generation for demo
  useEffect(() => {
    const generateMockData = () => {
      const now = Date.now();
      const data: PriceData[] = [];
      const basePrice = 0.095420;
      let currentMockPrice = basePrice;

      const intervals = {
        '1h': { points: 60, interval: 60 * 1000 }, // 1 minute intervals
        '24h': { points: 24, interval: 60 * 60 * 1000 }, // 1 hour intervals  
        '7d': { points: 7, interval: 24 * 60 * 60 * 1000 }, // 1 day intervals
        '30d': { points: 30, interval: 24 * 60 * 60 * 1000 } // 1 day intervals
      };

      const config = intervals[timeframe];

      for (let i = 0; i < config.points; i++) {
        const timestamp = new Date(now - (config.points - i) * config.interval).toISOString();
        
        // Add some realistic price movement
        const volatility = 0.02; // 2% volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        currentMockPrice *= (1 + randomChange);
        
        // Ensure price stays within reasonable bounds
        currentMockPrice = Math.max(0.08, Math.min(0.12, currentMockPrice));

        data.push({
          timestamp,
          price: currentMockPrice,
          volume: Math.random() * 100000 + 10000,
          change_24h: ((currentMockPrice - basePrice) / basePrice) * 100
        });
      }

      return data;
    };

    const mockData = generateMockData();
    setPriceData(mockData);
    
    if (mockData.length > 0) {
      const latest = mockData[mockData.length - 1];
      setCurrentPrice(latest.price);
      setChange24h(latest.change_24h);
    }
    
    setLoading(false);
  }, [timeframe]);

  const formatXAxisLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '1h':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      case '24h':
        return date.toLocaleTimeString('en-US', { hour: '2-digit' });
      case '7d':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleTimeString('en-US', { hour: '2-digit' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Price: {formatCurrency(data.price, 'USD', 4, 6)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Volume: {formatCurrency(data.volume, 'USD', 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartColor = change24h >= 0 ? '#10b981' : '#ef4444';

  if (loading) {
    return (
      <Card className={cn("w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700", className)}>
        <CardHeader>
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
              <DollarSign className="h-5 w-5 text-teal-500" />
              <span>Stellar Price</span>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(currentPrice, 'USD', 4, 6)}
              </span>
              <div className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium",
                change24h >= 0 
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}>
                {change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{formatPercentage(Math.abs(change24h))}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-kale-slate">
              <Activity className="h-4 w-4" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxisLabel}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tickFormatter={(value) => formatCurrency(value, 'USD', 4, 4)}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={chartColor}
                  strokeWidth={2}
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            ) : (
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxisLabel}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tickFormatter={(value) => formatCurrency(value, 'USD', 4, 4)}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: chartColor, strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}