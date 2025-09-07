'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react';
import { formatPercentage, formatLargeNumber } from '@/lib/utils';

export default function NetworkHealthPage() {
  // Mock network health data
  const networkHealth = {
    overallScore: 0.92,
    status: 'healthy',
    participationRate: 0.34,
    stakingRatio: 0.67,
    emissionEfficiency: 0.89,
    networkLoad: 0.45,
    avgBlockTime: 5.2,
    validators: 23,
    totalTransactions: 892456,
    activeNodes: 67
  };

  const healthMetrics = [
    {
      title: 'Overall Health',
      value: formatPercentage(networkHealth.overallScore * 100, 1, false),
      status: 'excellent',
      description: 'Network operating optimally',
      icon: Activity,
      color: 'text-kale-green',
      trend: '+2.1%'
    },
    {
      title: 'Participation Rate',
      value: formatPercentage(networkHealth.participationRate * 100, 1, false),
      status: 'moderate',
      description: 'Could be improved with more farmers',
      icon: Users,
      color: 'text-yellow-600',
      trend: '+1.3%'
    },
    {
      title: 'Staking Ratio',
      value: formatPercentage(networkHealth.stakingRatio * 100, 1, false),
      status: 'good',
      description: 'Healthy stake distribution',
      icon: Shield,
      color: 'text-kale-teal',
      trend: '+0.8%'
    },
    {
      title: 'Network Load',
      value: formatPercentage(networkHealth.networkLoad * 100, 1, false),
      status: 'optimal',
      description: 'Low congestion, fast processing',
      icon: Cpu,
      color: 'text-kale-green',
      trend: '-5.2%'
    }
  ];

  const systemComponents = [
    {
      name: 'Stellar Network',
      status: 'operational',
      uptime: 99.98,
      lastCheck: '30s ago',
      description: 'Core blockchain infrastructure'
    },
    {
      name: 'KALE Smart Contracts',
      status: 'operational',
      uptime: 99.95,
      lastCheck: '1m ago',
      description: 'Farming and reward contracts'
    },
    {
      name: 'Price Oracle',
      status: 'operational',
      uptime: 99.87,
      lastCheck: '45s ago',
      description: 'Real-time price data feeds'
    },
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: 99.92,
      lastCheck: '15s ago',
      description: 'API and data access layer'
    },
    {
      name: 'Monitoring System',
      status: 'operational',
      uptime: 99.99,
      lastCheck: '10s ago',
      description: 'Network health monitoring'
    },
    {
      name: 'Backup Services',
      status: 'degraded',
      uptime: 98.45,
      lastCheck: '2m ago',
      description: 'Data backup and recovery'
    }
  ];

  const performanceMetrics = [
    { label: 'Avg Block Time', value: `${networkHealth.avgBlockTime}s`, target: '5.0s', status: 'good' },
    { label: 'TPS Current', value: '1,247', target: '2,000', status: 'good' },
    { label: 'TPS Peak (24h)', value: '1,892', target: '2,000', status: 'good' },
    { label: 'Memory Usage', value: '67%', target: '<80%', status: 'good' },
    { label: 'Storage Usage', value: '34%', target: '<70%', status: 'excellent' },
    { label: 'Network Latency', value: '12ms', target: '<50ms', status: 'excellent' }
  ];

  const recentEvents = [
    {
      type: 'maintenance',
      title: 'Scheduled Maintenance Completed',
      description: 'Routine network optimization performed successfully',
      time: '2h ago',
      severity: 'info'
    },
    {
      type: 'alert',
      title: 'High Transaction Volume',
      description: 'Network experiencing increased activity',
      time: '4h ago',
      severity: 'warning'
    },
    {
      type: 'update',
      title: 'Emission Rate Adjustment',
      description: 'Farming emission rate decreased to 425 KALE/min',
      time: '6h ago',
      severity: 'info'
    },
    {
      type: 'incident',
      title: 'Brief API Latency Spike',
      description: 'API response times elevated for 5 minutes - resolved',
      time: '8h ago',
      severity: 'resolved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'excellent':
      case 'healthy': 
        return 'text-kale-green bg-green-100';
      case 'degraded':
      case 'moderate':
      case 'good': 
        return 'text-yellow-600 bg-yellow-100';
      case 'outage':
      case 'poor':
      case 'critical': 
        return 'text-red-600 bg-red-100';
      default: 
        return 'text-kale-slate bg-kale-light-slate';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'excellent':
      case 'healthy': 
        return <CheckCircle className="h-4 w-4 text-kale-green" />;
      case 'degraded':
      case 'moderate':
      case 'good': 
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'outage':
      case 'poor':
      case 'critical': 
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: 
        return <Activity className="h-4 w-4 text-kale-slate" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'resolved': return 'text-kale-green bg-green-100';
      default: return 'text-kale-slate bg-kale-light-slate';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Activity className="h-6 w-6 text-kale-green" />
              <span>Network Health</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Monitor network status, performance metrics, and system health
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusColor(networkHealth.status)}`}>
              {getStatusIcon(networkHealth.status)}
              <span className="text-sm font-medium capitalize">{networkHealth.status}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-kale-slate">
              <Globe className="h-4 w-4" />
              <span>Stellar Testnet</span>
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {healthMetrics.map((metric, index) => {
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
                      <p className="text-sm text-kale-slate mt-1">{metric.description}</p>
                      <div className="flex items-center space-x-1 mt-2 text-sm text-kale-green">
                        <TrendingUp className="h-3 w-3" />
                        <span>{metric.trend}</span>
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
          {/* System Status */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-kale-teal" />
                  <span>System Components</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemComponents.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(component.status)}
                        <div>
                          <h4 className="font-medium text-kale-black">{component.name}</h4>
                          <p className="text-sm text-kale-slate">{component.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                            {component.status}
                          </span>
                        </div>
                        <p className="text-sm text-kale-slate mt-1">
                          {formatPercentage(component.uptime, 2, false)} uptime
                        </p>
                        <p className="text-xs text-kale-slate">
                          Checked {component.lastCheck}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-kale-pink" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-kale-light-slate rounded-lg">
                      <div>
                        <p className="text-sm text-kale-slate">{metric.label}</p>
                        <p className="font-semibold text-kale-black">{metric.value}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                        <p className="text-xs text-kale-slate mt-1">
                          Target: {metric.target}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Zap className="h-4 w-4 text-kale-teal" />
                  <span>Network Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Active Validators</span>
                    <span className="text-sm font-medium text-kale-black">
                      {networkHealth.validators}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Active Nodes</span>
                    <span className="text-sm font-medium text-kale-black">
                      {networkHealth.activeNodes}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Total Transactions</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(networkHealth.totalTransactions)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Network Version</span>
                    <span className="text-sm font-medium text-kale-black">v1.2.3</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">Last Block</span>
                    <span className="text-sm font-medium text-kale-black">
                      #{formatLargeNumber(234567)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Clock className="h-4 w-4 text-kale-pink" />
                  <span>Recent Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="p-3 border border-kale-light-slate rounded-lg">
                      <div className="flex items-start space-x-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-kale-black">{event.title}</h4>
                          <p className="text-sm text-kale-slate mt-1">{event.description}</p>
                          <p className="text-xs text-kale-slate mt-1">{event.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Activity className="h-4 w-4 text-kale-green" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full px-4 py-2 bg-kale-green text-white rounded-lg hover:bg-kale-dark-green transition-colors text-sm">
                  View Detailed Metrics
                </button>
                
                <button className="w-full px-4 py-2 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors text-sm">
                  Export Health Report
                </button>
                
                <button className="w-full px-4 py-2 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors text-sm">
                  Subscribe to Alerts
                </button>
              </CardContent>
            </Card>

            {/* Health Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Shield className="h-4 w-4 text-kale-teal" />
                  <span>Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-kale-green">
                    {formatPercentage(networkHealth.overallScore * 100, 0, false)}
                  </div>
                  <p className="text-sm text-kale-slate">Overall Health Score</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-kale-slate">Uptime</span>
                    <span className="font-medium text-kale-black">25%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-kale-slate">Performance</span>
                    <span className="font-medium text-kale-black">30%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-kale-slate">Security</span>
                    <span className="font-medium text-kale-black">20%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-kale-slate">Network Activity</span>
                    <span className="font-medium text-kale-black">15%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-kale-slate">API Responsiveness</span>
                    <span className="font-medium text-kale-black">10%</span>
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
