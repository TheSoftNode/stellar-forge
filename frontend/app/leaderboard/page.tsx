'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Clock,
  Target,
  Crown,
  Star,
  Filter,
  Search,
  ArrowUpRight,
  Copy
} from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage, formatTimeAgo, truncateAddress } from '@/lib/utils';

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<'rewards' | 'sessions' | 'success_rate' | 'recent_activity'>('rewards');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      address: 'GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890',
      alias: 'KaleKing',
      totalRewards: 45678.90,
      sessionsCompleted: 234,
      successRate: 0.96,
      avgSessionTime: 2.8,
      lastActivity: '2m ago',
      recentGrowth: 15.3,
      badge: 'legendary',
      isVerified: true
    },
    {
      rank: 2,
      address: 'GDEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG123',
      alias: 'FarmMaster',
      totalRewards: 38456.23,
      sessionsCompleted: 198,
      successRate: 0.94,
      avgSessionTime: 3.1,
      lastActivity: '8m ago',
      recentGrowth: 12.7,
      badge: 'epic',
      isVerified: true
    },
    {
      rank: 3,
      address: 'GHIJ789KLM012NOP345QRS678TUV901WXY234ZAB567CDE890FGH123IJK456',
      alias: 'GreenThumb',
      totalRewards: 34892.17,
      sessionsCompleted: 187,
      successRate: 0.92,
      avgSessionTime: 2.5,
      lastActivity: '15m ago',
      recentGrowth: 8.9,
      badge: 'epic',
      isVerified: false
    },
    {
      rank: 4,
      address: 'JKLM012NOP345QRS678TUV901WXY234ZAB567CDE890FGH123IJK456LMN789',
      alias: null,
      totalRewards: 31205.44,
      sessionsCompleted: 156,
      successRate: 0.89,
      avgSessionTime: 3.3,
      lastActivity: '1h ago',
      recentGrowth: 6.4,
      badge: 'rare',
      isVerified: false
    },
    {
      rank: 5,
      address: 'MNOP345QRS678TUV901WXY234ZAB567CDE890FGH123IJK456LMN789OPQ012',
      alias: 'StellarFarmer',
      totalRewards: 28903.77,
      sessionsCompleted: 143,
      successRate: 0.91,
      avgSessionTime: 2.9,
      lastActivity: '2h ago',
      recentGrowth: 11.2,
      badge: 'rare',
      isVerified: true
    },
    // Add more farmers...
    ...Array.from({ length: 15 }, (_, i) => ({
      rank: i + 6,
      address: `GXYZ${String(i + 100).padStart(3, '0')}...ABC${String(i + 200).padStart(3, '0')}`,
      alias: Math.random() > 0.6 ? `Farmer${i + 6}` : null,
      totalRewards: Math.random() * 25000 + 5000,
      sessionsCompleted: Math.floor(Math.random() * 120) + 30,
      successRate: Math.random() * 0.3 + 0.7,
      avgSessionTime: Math.random() * 2 + 2,
      lastActivity: `${Math.floor(Math.random() * 12) + 1}h ago`,
      recentGrowth: Math.random() * 20 - 5,
      badge: ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)] as 'common' | 'rare' | 'epic',
      isVerified: Math.random() > 0.7
    }))
  ];

  const topStats = [
    {
      title: 'Top Farmer',
      value: formatLargeNumber(leaderboardData[0].totalRewards) + ' KALE',
      subtitle: leaderboardData[0].alias || truncateAddress(leaderboardData[0].address),
      icon: Crown,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Farmers',
      value: formatLargeNumber(leaderboardData.length),
      subtitle: '+12 this week',
      icon: Users,
      color: 'text-kale-teal'
    },
    {
      title: 'Avg Success Rate',
      value: formatPercentage(0.89 * 100, 1, false),
      subtitle: '+2.3% vs last week',
      icon: Target,
      color: 'text-kale-green'
    },
    {
      title: 'Total Rewards Paid',
      value: formatLargeNumber(567890) + ' KALE',
      subtitle: formatCurrency(567890 * 0.095420, 'USD', 0),
      icon: Award,
      color: 'text-kale-pink'
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-kale-slate">#{rank}</span>;
    }
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const filteredData = leaderboardData.filter(farmer => {
    if (!searchTerm) return true;
    return (
      farmer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Farmer Leaderboard</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Top performing farmers ranked by rewards, success rate, and activity
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Timeframe Selector */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-kale-light-slate rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-kale-light-slate rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
            >
              <option value="rewards">Total Rewards</option>
              <option value="sessions">Sessions Completed</option>
              <option value="success_rate">Success Rate</option>
              <option value="recent_activity">Recent Activity</option>
            </select>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {topStats.map((stat, index) => {
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-kale-slate" />
                <input
                  type="text"
                  placeholder="Search by address or alias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-kale-light-slate rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kale-green focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-kale-slate">
                <Filter className="h-4 w-4" />
                <span>Showing {filteredData.length} farmers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-kale-light-slate">
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Farmer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Total Rewards</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Sessions</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Success Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Avg Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Growth</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-kale-slate">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((farmer, index) => (
                    <tr 
                      key={farmer.address} 
                      className="border-b border-kale-light-slate hover:bg-kale-light-slate/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(farmer.rank)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {farmer.alias ? (
                                <span className="font-medium text-kale-black">{farmer.alias}</span>
                              ) : (
                                <span className="font-mono text-sm text-kale-black">
                                  {truncateAddress(farmer.address)}
                                </span>
                              )}
                              
                              {farmer.isVerified && (
                                <Star className="h-3 w-3 text-kale-green" />
                              )}
                              
                              <button
                                onClick={() => copyAddress(farmer.address)}
                                className="p-1 hover:bg-kale-light-slate rounded"
                              >
                                <Copy className="h-3 w-3 text-kale-slate hover:text-kale-black" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(farmer.badge)}`}>
                                {farmer.badge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-semibold text-kale-black">
                            {formatLargeNumber(farmer.totalRewards)} KALE
                          </span>
                          <div className="text-xs text-kale-slate">
                            {formatCurrency(farmer.totalRewards * 0.095420, 'USD', 0)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-kale-black font-medium">
                          {farmer.sessionsCompleted}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-kale-green font-medium">
                          {formatPercentage(farmer.successRate * 100, 1, false)}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-kale-black">
                          {farmer.avgSessionTime.toFixed(1)}h
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className={`flex items-center space-x-1 ${
                          farmer.recentGrowth >= 0 ? 'text-kale-green' : 'text-red-500'
                        }`}>
                          {farmer.recentGrowth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 rotate-180" />
                          )}
                          <span className="font-medium">
                            {formatPercentage(Math.abs(farmer.recentGrowth), 1)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-kale-slate text-sm">
                          {farmer.lastActivity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="h-4 w-4 text-kale-green" />
                <span>Performance Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Top Performers</h4>
                  <p className="text-sm text-green-700">
                    Top 10 farmers have maintained 90%+ success rates
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Activity Trend</h4>
                  <p className="text-sm text-blue-700">
                    12% increase in active farmers this week
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Reward Growth</h4>
                  <p className="text-sm text-yellow-700">
                    Average rewards per session up 8.5%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Clock className="h-4 w-4 text-kale-teal" />
                <span>Badge Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                    <span className="text-sm text-kale-black">Legendary</span>
                  </div>
                  <span className="text-sm font-medium text-kale-black">3 farmers</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                    <span className="text-sm text-kale-black">Epic</span>
                  </div>
                  <span className="text-sm font-medium text-kale-black">8 farmers</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                    <span className="text-sm text-kale-black">Rare</span>
                  </div>
                  <span className="text-sm font-medium text-kale-black">24 farmers</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-kale-black">Common</span>
                  </div>
                  <span className="text-sm font-medium text-kale-black">165 farmers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
