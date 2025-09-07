'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sprout,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Target,
  Zap,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';

export default function FarmingAnalyticsPage() {
  // Mock farming data - will be replaced with real API calls
  const farmingStats = {
    total_farmers: 287,
    active_sessions: 143,
    total_staked: 1250000,
    emission_rate: 425,
    avg_session_duration: 2.4,
    farming_difficulty: 0.75,
    success_rate: 0.89,
    network_participation: 0.34,
    recent_harvests: 89,
    pending_rewards: 45600
  };

  const keyMetrics = [
    {
      title: 'Active Farmers',
      value: formatLargeNumber(farmingStats.total_farmers),
      change: '+12.3%',
      changeType: 'increase',
      icon: Users,
      color: 'text-kale-teal'
    },
    {
      title: 'Active Sessions',
      value: formatLargeNumber(farmingStats.active_sessions),
      change: '+8.7%',
      changeType: 'increase',
      icon: Activity,
      color: 'text-kale-green'
    },
    {
      title: 'Total Staked',
      value: formatLargeNumber(farmingStats.total_staked) + ' KALE',
      change: '+5.2%',
      changeType: 'increase',
      icon: Sprout,
      color: 'text-kale-pink'
    },
    {
      title: 'Success Rate',
      value: formatPercentage(farmingStats.success_rate * 100, 1, false),
      change: '+2.1%',
      changeType: 'increase',
      icon: Target,
      color: 'text-kale-green'
    }
  ];

  const networkMetrics = [
    {
      label: 'Emission Rate',
      value: `${farmingStats.emission_rate} KALE/min`,
      status: 'optimal',
      trend: 'decrease',
      description: 'Current network emission rate'
    },
    {
      label: 'Farming Difficulty',
      value: formatPercentage(farmingStats.farming_difficulty * 100, 1, false),
      status: 'moderate',
      trend: 'increase',
      description: 'Network farming difficulty'
    },
    {
      label: 'Network Participation',
      value: formatPercentage(farmingStats.network_participation * 100, 1, false),
      status: 'low',
      trend: 'stable',
      description: 'Active participation rate'
    },
    {
      label: 'Avg Session Duration',
      value: `${farmingStats.avg_session_duration}h`,
      status: 'optimal',
      trend: 'increase',
      description: 'Average farming session time'
    }
  ];

  const recentActivity = [
    { type: 'harvest', farmer: 'GABC...XYZ1', amount: 234.56, time: '2m ago' },
    { type: 'plant', farmer: 'GDEF...ABC2', amount: 500.00, time: '5m ago' },
    { type: 'harvest', farmer: 'GHIJ...DEF3', amount: 178.90, time: '8m ago' },
    { type: 'plant', farmer: 'GKLM...GHI4', amount: 750.00, time: '12m ago' },
    { type: 'harvest', farmer: 'GNOP...JKL5', amount: 445.23, time: '15m ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-kale-green bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-kale-slate bg-kale-light-slate';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increase': return <ArrowUpRight className="h-3 w-3 text-kale-green" />;
      case 'decrease': return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-kale-slate" />;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-3 w-3" />;
      case 'decrease': return <ArrowDownRight className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-kale-green" />
              <span>Farming Analytics</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Monitor network farming activity, participation rates, and ecosystem health
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kale-green rounded-full animate-pulse"></div>
              <span className="text-kale-dark-slate font-medium">Live Data</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="hover:shadow-card-hover transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-kale-slate">{metric.title}</p>
                      <p className="text-2xl font-bold text-kale-black mt-1">
                        {metric.value}
                      </p>
                      <div className={`flex items-center space-x-1 mt-2 text-sm ${
                        metric.changeType === 'increase' ? 'text-kale-green' : 
                        metric.changeType === 'decrease' ? 'text-red-500' : 'text-kale-slate'
                      }`}>
                        {getChangeIcon(metric.changeType)}
                        <span>{metric.change}</span>
                        <span className="text-kale-slate">vs 24h</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-kale-light-slate">
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Network Health Metrics */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-kale-teal" />
                  <span>Network Health Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {networkMetrics.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-kale-slate">{metric.label}</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                            {metric.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-kale-black">{metric.value}</div>
                      <p className="text-xs text-kale-slate">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-kale-pink" />
                  <span>Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <Clock className="h-8 w-8 text-kale-teal mx-auto mb-2" />
                    <div className="text-2xl font-bold text-kale-black">{farmingStats.avg_session_duration}h</div>
                    <div className="text-sm text-kale-slate">Avg Session Duration</div>
                  </div>
                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <Target className="h-8 w-8 text-kale-green mx-auto mb-2" />
                    <div className="text-2xl font-bold text-kale-black">
                      {formatPercentage(farmingStats.success_rate * 100, 1, false)}
                    </div>
                    <div className="text-sm text-kale-slate">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-kale-light-slate rounded-lg">
                    <Users className="h-8 w-8 text-kale-pink mx-auto mb-2" />
                    <div className="text-2xl font-bold text-kale-black">
                      {formatLargeNumber(farmingStats.recent_harvests)}
                    </div>
                    <div className="text-sm text-kale-slate">Recent Harvests (24h)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Activity className="h-4 w-4 text-kale-green" />
                  <span>Live Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-kale-light-slate rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'harvest' ? 'bg-kale-green' : 'bg-kale-teal'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-kale-black capitalize">
                            {activity.type}
                          </span>
                          <span className="text-xs text-kale-slate">{activity.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-kale-slate font-mono">{activity.farmer}</span>
                          <span className="text-sm font-medium text-kale-black">
                            {formatLargeNumber(activity.amount)} KALE
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <AlertCircle className="h-4 w-4 text-kale-pink" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Pending Rewards</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(farmingStats.pending_rewards)} KALE
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Network Load</span>
                    <span className="text-sm font-medium text-kale-green">Optimal</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Avg Reward/Session</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(234.56)} KALE
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Next Emission Decay</span>
                    <span className="text-sm font-medium text-kale-black">12h 34m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Network Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-kale-green rounded-full" />
                      <span className="text-sm font-medium text-kale-green">Optimal Farming</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Current conditions are favorable for farming sessions
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm font-medium text-yellow-600">Emission Update</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Emission rate will decrease in 12 hours
                    </p>
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
