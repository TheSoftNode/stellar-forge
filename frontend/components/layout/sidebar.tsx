'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import {
  BarChart3,
  Sprout,
  TrendingUp,
  Users,
  Calculator,
  Trophy,
  Settings,
  Activity,
  Zap,
  Bell,
  Globe
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    color: 'text-teal-500',
    description: 'Dashboard overview'
  },
  {
    name: 'Price Tracker',
    href: '/price',
    icon: TrendingUp,
    color: 'text-pink-500',
    description: 'Live asset prices'
  },
  {
    name: 'Farming Analytics',
    href: '/farming',
    icon: Sprout,
    color: 'text-green-500',
    description: 'Network farming stats'
  },
  {
    name: 'ROI Calculator',
    href: '/calculator',
    icon: Calculator,
    color: 'text-slate-600',
    description: 'Calculate profitability'
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    color: 'text-teal-500',
    description: 'Top farmers ranking'
  },
  {
    name: 'My Farm',
    href: '/my-farm',
    icon: Users,
    color: 'text-slate-500',
    description: 'Personal farming data'
  },
  {
    name: 'Network Health',
    href: '/network',
    icon: Activity,
    color: 'text-pink-500',
    description: 'Ecosystem health metrics'
  },
];

const secondaryNavigation = [
  { name: 'Alerts', href: '/alerts', icon: Bell, color: 'text-slate-500' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'text-slate-500' },
];

export function Sidebar({ className, collapsed = false, onToggleCollapse, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-colors', className)}>
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-slate-700">
        {(!collapsed || isMobile) && <Logo />}
        {collapsed && !isMobile && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        )}
        
        {/* Mobile Close Button */}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
          >
            <Globe className="w-5 h-5 text-slate-500" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Globe className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* Live Status */}
      {(!collapsed || isMobile) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 dark:text-slate-200 font-medium">Live</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
              <Globe className="w-3 h-3" />
              <span className="text-xs">Stellar Network</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Live Status */}
      {collapsed && !isMobile && (
        <div className="px-3 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                title={collapsed && !isMobile ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'transition-colors',
                    collapsed && !isMobile ? 'h-5 w-5' : 'mr-3 h-5 w-5',
                    isActive 
                      ? 'text-white' 
                      : `${item.color} dark:text-slate-400`
                  )}
                />
                {(!collapsed || isMobile) && (
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span 
                      className={cn(
                        'text-xs transition-colors',
                        isActive 
                          ? 'text-teal-100' 
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      )}
                    >
                      {item.description}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                )}
                title={collapsed && !isMobile ? item.name : undefined}
              >
                <Icon className={cn(
                  'transition-colors',
                  collapsed && !isMobile ? 'h-4 w-4' : 'mr-3 h-4 w-4'
                )} />
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      {(!collapsed || isMobile) && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Network Status</span>
              <span className="text-green-500 font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Farmers</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium">287</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API Status</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Footer */}
      {collapsed && !isMobile && (
        <div className="px-3 py-4 border-t border-gray-200 dark:border-slate-700 flex flex-col items-center space-y-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <Zap className="w-3 h-3 text-green-500" />
        </div>
      )}
    </div>
  );
}