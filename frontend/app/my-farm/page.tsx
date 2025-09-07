'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users,
  Sprout,
  Clock,
  Target,
  TrendingUp,
  Wallet,
  Activity,
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  Play,
  Square,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage, formatTimeAgo } from '@/lib/utils';

export default function MyFarmPage() {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  // Mock user data - in real app would come from wallet connection
  const userData = {
    address: 'GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890',
    balance: 2456.78,
    totalRewards: 1234.56,
    sessionsCompleted: 23,
    successRate: 0.87,
    averageSessionTime: 2.7,
    rank: 42,
    totalFarmers: 287,
    nextRewardEstimate: 89.23,
    isCurrentlyFarming: true,
    currentSessionStart: '2024-01-15T14:30:00Z'
  };

  const farmingStats = [
    {
      title: 'Total Rewards',
      value: formatLargeNumber(userData.totalRewards) + ' KALE',
      subtitle: formatCurrency(userData.totalRewards * 0.095420, 'USD'),
      icon: Award,
      color: 'text-kale-green',
      change: '+12.5%'
    },
    {
      title: 'Success Rate',
      value: formatPercentage(userData.successRate * 100, 1, false),
      subtitle: `${userData.sessionsCompleted} sessions`,
      icon: Target,
      color: 'text-kale-teal',
      change: '+3.2%'
    },
    {
      title: 'Leaderboard Rank',
      value: `#${userData.rank}`,
      subtitle: `Top ${Math.round((userData.rank / userData.totalFarmers) * 100)}%`,
      icon: TrendingUp,
      color: 'text-kale-pink',
      change: '+5'
    },
    {
      title: 'Avg Session Time',
      value: `${userData.averageSessionTime}h`,
      subtitle: 'Optimal range: 2-4h',
      icon: Clock,
      color: 'text-kale-dark-blue',
      change: '+0.3h'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T12:30:00Z',
      duration: 2.5,
      reward: 89.23,
      status: 'completed' as const,
      stakeAmount: 1000,
      efficiency: 0.92
    },
    {
      id: 2,
      startTime: '2024-01-14T15:00:00Z',
      endTime: '2024-01-14T17:45:00Z',
      duration: 2.75,
      reward: 95.67,
      status: 'completed' as const,
      stakeAmount: 1000,
      efficiency: 0.89
    },
    {
      id: 3,
      startTime: '2024-01-13T09:30:00Z',
      endTime: null,
      duration: 1.2,
      reward: 0,
      status: 'failed' as const,
      stakeAmount: 1000,
      efficiency: 0
    },
    {
      id: 4,
      startTime: '2024-01-12T16:15:00Z',
      endTime: '2024-01-12T19:00:00Z',
      duration: 2.75,
      reward: 92.45,
      status: 'completed' as const,
      stakeAmount: 1000,
      efficiency: 0.91
    },
    {
      id: 5,
      startTime: '2024-01-11T11:00:00Z',
      endTime: '2024-01-11T13:30:00Z',
      duration: 2.5,
      reward: 87.89,
      status: 'completed' as const,
      stakeAmount: 1000,
      efficiency: 0.88
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-kale-green" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'active': return <Play className="h-4 w-4 text-kale-teal animate-pulse" />;
      default: return <Square className="h-4 w-4 text-kale-slate" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-kale-green bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'active': return 'text-kale-teal bg-blue-100';
      default: return 'text-kale-slate bg-kale-light-slate';
    }
  };

  const getCurrentSessionDuration = () => {
    if (!userData.isCurrentlyFarming || !userData.currentSessionStart) return 0;
    const start = new Date(userData.currentSessionStart);
    const now = new Date();
    return (now.getTime() - start.getTime()) / (1000 * 60 * 60); // Hours
  };

  const currentSessionDuration = getCurrentSessionDuration();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Users className="h-6 w-6 text-kale-teal" />
              <span>My Farm</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Track your farming sessions, rewards, and performance metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Wallet Info */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-kale-light-slate rounded-lg">
              <Wallet className="h-4 w-4 text-kale-slate" />
              <span className="text-sm text-kale-slate">Balance:</span>
              <span className="text-sm font-medium text-kale-black">
                {formatLargeNumber(userData.balance)} KALE
              </span>
            </div>
            
            {/* Current Status */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              userData.isCurrentlyFarming ? 'bg-green-100 text-green-700' : 'bg-kale-light-slate text-kale-slate'
            }`}>
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">
                {userData.isCurrentlyFarming ? 'Farming Active' : 'Not Farming'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Session Status */}
        {userData.isCurrentlyFarming && (
          <Card className="border-l-4 border-l-kale-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Play className="h-4 w-4 text-kale-green animate-pulse" />
                <span>Active Farming Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-kale-slate">Duration</p>
                  <p className="text-xl font-bold text-kale-black">
                    {currentSessionDuration.toFixed(1)}h
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-kale-slate">Estimated Reward</p>
                  <p className="text-xl font-bold text-kale-green">
                    {formatLargeNumber(userData.nextRewardEstimate)} KALE
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-kale-slate">Started</p>
                  <p className="text-lg font-medium text-kale-black">
                    {formatTimeAgo(userData.currentSessionStart)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Harvest Now
                  </button>
                  <button className="px-4 py-2 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors">
                    Session Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {farmingStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-card-hover transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-kale-slate">{stat.title}</p>
                      <p className="text-2xl font-bold text-kale-black mt-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-kale-slate mt-1">{stat.subtitle}</p>
                      <div className="flex items-center space-x-1 mt-2 text-sm text-kale-green">
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.change}</span>
                        <span className="text-kale-slate">vs last week</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-kale-light-slate">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Session History */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-kale-green" />
                  <span>Recent Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div 
                      key={session.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSession === session.id 
                          ? 'border-kale-green bg-green-50' 
                          : 'border-kale-light-slate hover:border-kale-green hover:bg-kale-light-slate/50'
                      }`}
                      onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(session.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-kale-black">
                                Session #{session.id}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                {session.status}
                              </span>
                            </div>
                            <p className="text-sm text-kale-slate">
                              {new Date(session.startTime).toLocaleDateString()} • {session.duration}h
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-kale-black">
                            {session.status === 'completed' ? '+' : ''}{formatLargeNumber(session.reward)} KALE
                          </p>
                          <p className="text-sm text-kale-slate">
                            {formatCurrency(session.reward * 0.095420, 'USD')}
                          </p>
                        </div>
                      </div>
                      
                      {selectedSession === session.id && (
                        <div className="mt-4 pt-4 border-t border-kale-light-slate">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-kale-slate">Stake Amount</p>
                              <p className="font-medium text-kale-black">
                                {formatLargeNumber(session.stakeAmount)} KALE
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-kale-slate">Efficiency</p>
                              <p className="font-medium text-kale-black">
                                {formatPercentage(session.efficiency * 100, 1, false)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-kale-slate">Start Time</p>
                              <p className="font-medium text-kale-black">
                                {new Date(session.startTime).toLocaleTimeString()}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-kale-slate">End Time</p>
                              <p className="font-medium text-kale-black">
                                {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Sprout className="h-4 w-4 text-kale-green" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!userData.isCurrentlyFarming ? (
                  <button className="w-full px-4 py-3 bg-kale-green text-white rounded-lg hover:bg-kale-dark-green transition-colors font-medium">
                    Start New Session
                  </button>
                ) : (
                  <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                    Harvest Current Session
                  </button>
                )}
                
                <button className="w-full px-4 py-3 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors">
                  View All Sessions
                </button>
                
                <button className="w-full px-4 py-3 border border-kale-light-slate text-kale-black rounded-lg hover:bg-kale-light-slate transition-colors">
                  Export History
                </button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <BarChart3 className="h-4 w-4 text-kale-teal" />
                  <span>Performance Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-kale-green" />
                      <span className="text-sm font-medium text-green-800">Strong Performance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your success rate is above network average
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Optimal Timing</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your session duration is in the optimal range
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Growth Opportunity</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Consider increasing stake for higher rewards
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Award className="h-4 w-4 text-kale-pink" />
                  <span>Rewards Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">This Week</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(234.56)} KALE
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">This Month</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(1098.45)} KALE
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kale-slate">All Time</span>
                    <span className="text-sm font-medium text-kale-black">
                      {formatLargeNumber(userData.totalRewards)} KALE
                    </span>
                  </div>

                  <div className="pt-3 border-t border-kale-light-slate">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-kale-slate">Total Value</span>
                      <span className="text-sm font-bold text-kale-green">
                        {formatCurrency(userData.totalRewards * 0.095420, 'USD')}
                      </span>
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
