'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Settings, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn, formatCurrency, formatTimeAgo } from '@/lib/utils';
import { WalletConnect } from '@/components/ui/wallet-connect';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ className, onMenuClick, onToggleSidebar, sidebarCollapsed = false }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data - in real app, this would come from API/state
  const notifications = [
    {
      id: 1,
      title: 'Harvest Ready',
      message: 'Your farming session is ready to harvest',
      time: '5m ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'Price Alert',
      message: 'KALE price increased by 15%',
      time: '12m ago',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: 'Network Update',
      message: 'Emission rate decreased to 425/min',
      time: '1h ago',
      type: 'warning',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={cn(
      'bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4 transition-colors',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left Section - Menu & Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
          )}

          {/* Desktop Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <PanelLeftClose className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
          )}

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm 
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Current Price Display - Hidden on small screens */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">STELLAR</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(0.095420, 'USD', 4, 6)}
            </span>
            <span className="text-xs text-green-500">+2.5%</span>
          </div>


          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-teal-500 hover:text-teal-600">
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b border-gray-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer',
                        notification.unread ? 'bg-blue-50 dark:bg-slate-700/50' : ''
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5',
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            'bg-teal-500'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{notification.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                  <button className="w-full text-sm text-teal-500 hover:text-teal-600 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          <WalletConnect showFullAddress={false} />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Demo Farmer</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">GABC123...XYZ789</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}