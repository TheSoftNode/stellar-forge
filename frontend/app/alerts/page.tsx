'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Settings,
  Plus,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sprout,
  Activity,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatLargeNumber } from '@/lib/utils';

export default function AlertsPage() {
  const [alertFilter, setAlertFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Mock alerts data
  const alerts = [
    {
      id: 1,
      type: 'price',
      severity: 'high',
      title: 'KALE Price Alert',
      message: 'KALE price dropped below $0.75 threshold',
      description: 'Price fell from $0.82 to $0.73 (-10.98%) in the last hour',
      timestamp: '2m ago',
      isRead: false,
      isActive: true,
      conditions: { operator: 'below', value: 0.75, current: 0.73 },
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      id: 2,
      type: 'farming',
      severity: 'medium',
      title: 'Farm Efficiency Warning',
      message: 'Your farm efficiency dropped to 78%',
      description: 'Consider optimizing your farming strategy or checking network conditions',
      timestamp: '15m ago',
      isRead: false,
      isActive: true,
      conditions: { operator: 'below', value: 80, current: 78 },
      icon: Sprout,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'reward',
      severity: 'low',
      title: 'Reward Claim Available',
      message: 'You have 142.5 KALE ready to claim',
      description: 'Don\'t forget to claim your farming rewards to continue earning',
      timestamp: '1h ago',
      isRead: true,
      isActive: true,
      conditions: { operator: 'above', value: 100, current: 142.5 },
      icon: DollarSign,
      color: 'text-kale-green'
    },
    {
      id: 4,
      type: 'network',
      severity: 'high',
      title: 'Network Congestion Alert',
      message: 'Network experiencing high transaction volume',
      description: 'Transaction times may be slower than usual. Consider waiting for optimal timing.',
      timestamp: '2h ago',
      isRead: true,
      isActive: true,
      conditions: { operator: 'above', value: 1800, current: 2156 },
      icon: Activity,
      color: 'text-red-600'
    },
    {
      id: 5,
      type: 'price',
      severity: 'low',
      title: 'Price Target Achieved',
      message: 'KALE reached your target price of $0.90',
      description: 'Price increased from $0.87 to $0.91 (+4.6%) in the last 2 hours',
      timestamp: '4h ago',
      isRead: true,
      isActive: false,
      conditions: { operator: 'above', value: 0.90, current: 0.91 },
      icon: TrendingUp,
      color: 'text-kale-green'
    },
    {
      id: 6,
      type: 'farming',
      severity: 'medium',
      title: 'Staking Period Ending',
      message: 'Your 30-day staking period ends in 3 days',
      description: 'Plan whether to restake your tokens or withdraw your position',
      timestamp: '6h ago',
      isRead: true,
      isActive: true,
      conditions: { operator: 'below', value: 5, current: 3 },
      icon: Calendar,
      color: 'text-yellow-600'
    }
  ];

  const alertSettings = [
    {
      category: 'Price Alerts',
      description: 'Get notified about KALE price movements',
      enabled: true,
      rules: [
        { name: 'Price drops below', value: '$0.75', enabled: true },
        { name: 'Price rises above', value: '$1.00', enabled: true },
        { name: 'Daily change exceeds', value: '10%', enabled: false }
      ]
    },
    {
      category: 'Farming Alerts',
      description: 'Monitor your farming performance and rewards',
      enabled: true,
      rules: [
        { name: 'Efficiency drops below', value: '80%', enabled: true },
        { name: 'Rewards exceed', value: '100 KALE', enabled: true },
        { name: 'Staking period ending', value: '7 days', enabled: true }
      ]
    },
    {
      category: 'Network Alerts',
      description: 'Stay informed about network status and health',
      enabled: false,
      rules: [
        { name: 'High transaction volume', value: '> 1800 TPS', enabled: false },
        { name: 'Network downtime', value: 'Any outage', enabled: true },
        { name: 'Maintenance scheduled', value: '24h notice', enabled: true }
      ]
    }
  ];

  const alertStats = {
    total: alerts.length,
    unread: alerts.filter(alert => !alert.isRead).length,
    active: alerts.filter(alert => alert.isActive).length,
    thisWeek: 12
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-kale-light-slate text-kale-slate border-kale-light-slate';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'price': return 'text-kale-pink';
      case 'farming': return 'text-kale-green';
      case 'reward': return 'text-kale-teal';
      case 'network': return 'text-kale-purple';
      default: return 'text-kale-slate';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = alertFilter === 'all' || 
                         (alertFilter === 'unread' && !alert.isRead) ||
                         (alertFilter === 'active' && alert.isActive) ||
                         alert.type === alertFilter;
    
    const matchesSearch = searchTerm === '' || 
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Bell className="h-6 w-6 text-kale-teal" />
              <span>Alerts & Notifications</span>
              {alertStats.unread > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {alertStats.unread}
                </span>
              )}
            </h1>
            <p className="text-kale-slate mt-1">
              Stay informed about price movements, farming updates, and network status
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-kale-light-slate hover:bg-kale-slate hover:text-white rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-kale-teal text-white rounded-lg hover:bg-kale-dark-teal transition-colors">
              <Plus className="h-4 w-4" />
              <span>New Alert</span>
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kale-slate">Total Alerts</p>
                  <p className="text-2xl font-bold text-kale-black">{alertStats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-kale-light-slate">
                  <Bell className="h-6 w-6 text-kale-teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kale-slate">Unread</p>
                  <p className="text-2xl font-bold text-kale-black">{alertStats.unread}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100">
                  <BellRing className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kale-slate">Active Rules</p>
                  <p className="text-2xl font-bold text-kale-black">{alertStats.active}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-kale-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kale-slate">This Week</p>
                  <p className="text-2xl font-bold text-kale-black">{alertStats.thisWeek}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Alerts List */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-kale-slate" />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-kale-slate" />
                    <select
                      value={alertFilter}
                      onChange={(e) => setAlertFilter(e.target.value)}
                      className="px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal"
                    >
                      <option value="all">All Alerts</option>
                      <option value="unread">Unread</option>
                      <option value="active">Active</option>
                      <option value="price">Price</option>
                      <option value="farming">Farming</option>
                      <option value="network">Network</option>
                      <option value="reward">Rewards</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Alerts</span>
                  <span className="text-sm font-normal text-kale-slate">
                    {filteredAlerts.length} of {alerts.length} alerts
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-kale-light-slate mx-auto mb-4" />
                      <p className="text-kale-slate">No alerts match your current filter</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const Icon = alert.icon;
                      return (
                        <div
                          key={alert.id}
                          className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                            alert.isRead 
                              ? 'border-kale-light-slate bg-white' 
                              : 'border-kale-teal bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg bg-kale-light-slate`}>
                              <Icon className={`h-5 w-5 ${alert.color}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-kale-black">{alert.title}</h4>
                                    {!alert.isRead && (
                                      <div className="w-2 h-2 bg-kale-teal rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-kale-black mt-1">{alert.message}</p>
                                  <p className="text-sm text-kale-slate mt-1">{alert.description}</p>
                                  
                                  <div className="flex items-center space-x-4 mt-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                      {getSeverityIcon(alert.severity)}
                                      <span className="ml-1 capitalize">{alert.severity}</span>
                                    </span>
                                    
                                    <div className="flex items-center space-x-1 text-xs text-kale-slate">
                                      <Clock className="h-3 w-3" />
                                      <span>{alert.timestamp}</span>
                                    </div>
                                    
                                    <span className={`text-xs font-medium capitalize ${getTypeColor(alert.type)}`}>
                                      {alert.type}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button className="p-1 hover:bg-kale-light-slate rounded transition-colors">
                                    <Edit className="h-4 w-4 text-kale-slate" />
                                  </button>
                                  <button className="p-1 hover:bg-kale-light-slate rounded transition-colors">
                                    {alert.isActive ? (
                                      <Eye className="h-4 w-4 text-kale-slate" />
                                    ) : (
                                      <EyeOff className="h-4 w-4 text-kale-slate" />
                                    )}
                                  </button>
                                  <button className="p-1 hover:bg-red-100 rounded transition-colors">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alert Settings */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Settings className="h-4 w-4 text-kale-teal" />
                    <span>Alert Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alertSettings.map((setting, index) => (
                      <div key={index} className="p-3 border border-kale-light-slate rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-kale-black">{setting.category}</h4>
                            <p className="text-sm text-kale-slate">{setting.description}</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={setting.enabled}
                              className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {setting.rules.map((rule, ruleIndex) => (
                            <div key={ruleIndex} className="flex items-center justify-between text-sm">
                              <span className="text-kale-slate">{rule.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-kale-black">{rule.value}</span>
                                <input
                                  type="checkbox"
                                  checked={rule.enabled}
                                  className="h-3 w-3 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
                                  readOnly
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Bell className="h-4 w-4 text-kale-pink" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full px-4 py-2 bg-kale-teal text-white rounded-lg hover:bg-kale-dark-teal transition-colors text-sm">
                  Mark All as Read
                </button>
                
                <button className="w-full px-4 py-2 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors text-sm">
                  Export Alert History
                </button>
                
                <button className="w-full px-4 py-2 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors text-sm">
                  Configure Notifications
                </button>
                
                <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                  Clear All Alerts
                </button>
              </CardContent>
            </Card>

            {/* Alert Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Info className="h-4 w-4 text-kale-green" />
                  <span>Alert Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-kale-pink" />
                      <span className="text-sm text-kale-slate">Price Alerts</span>
                    </div>
                    <span className="text-sm font-medium text-kale-black">
                      {alerts.filter(a => a.type === 'price').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sprout className="h-4 w-4 text-kale-green" />
                      <span className="text-sm text-kale-slate">Farming Alerts</span>
                    </div>
                    <span className="text-sm font-medium text-kale-black">
                      {alerts.filter(a => a.type === 'farming').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-kale-purple" />
                      <span className="text-sm text-kale-slate">Network Alerts</span>
                    </div>
                    <span className="text-sm font-medium text-kale-black">
                      {alerts.filter(a => a.type === 'network').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-kale-teal" />
                      <span className="text-sm text-kale-slate">Reward Alerts</span>
                    </div>
                    <span className="text-sm font-medium text-kale-black">
                      {alerts.filter(a => a.type === 'reward').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Clock className="h-4 w-4 text-kale-slate" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-kale-slate">Last 24 hours</p>
                    <p className="font-medium text-kale-black">8 new alerts</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-kale-slate">Most common type</p>
                    <p className="font-medium text-kale-black">Price alerts (45%)</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-kale-slate">Response time</p>
                    <p className="font-medium text-kale-black">~2.3 minutes</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-kale-slate">Next scheduled check</p>
                    <p className="font-medium text-kale-black">In 5 minutes</p>
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
