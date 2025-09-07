'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Smartphone,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Wallet,
  HelpCircle,
  ExternalLink,
  Mail,
  Phone,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    price: true,
    farming: true,
    network: false,
    marketing: false
  });

  // Mock user data
  const userProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-8 (Pacific)',
    language: 'English',
    currency: 'USD',
    joinedDate: '2024-01-15',
    walletAddress: 'GBDGY...X7Z3K',
    apiKey: 'kale_live_sk_1234567890abcdef...',
    twoFactorEnabled: true
  };

  const securitySettings = {
    twoFactor: true,
    loginNotifications: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    apiAccess: true
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API & Data', icon: Database },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(userProfile.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={userProfile.name}
                className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Email Address</label>
              <input
                type="email"
                defaultValue={userProfile.email}
                className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue={userProfile.phone}
                className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Timezone</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="UTC-8">UTC-8 (Pacific)</option>
                <option value="UTC-5">UTC-5 (Eastern)</option>
                <option value="UTC+0">UTC+0 (GMT)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-kale-teal" />
              <div>
                <p className="font-medium text-kale-black">Stellar Wallet</p>
                <p className="text-sm text-kale-slate">Connected via Freighter</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
              <button className="text-red-600 hover:text-red-700 text-sm">Disconnect</button>
            </div>
          </div>
          
          <div className="p-4 bg-kale-light-slate rounded-lg">
            <p className="text-sm text-kale-slate mb-2">Wallet Address</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 font-mono text-sm">{userProfile.walletAddress}</code>
              <button
                onClick={handleCopyApiKey}
                className="p-2 hover:bg-kale-slate hover:text-white rounded transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-kale-teal text-white rounded-lg hover:bg-kale-dark-teal transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-kale-green" />
              <div>
                <p className="font-medium text-kale-black">Two-Factor Authentication</p>
                <p className="text-sm text-kale-slate">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Enabled</span>
              <button className="text-kale-teal hover:text-kale-dark-teal text-sm">Configure</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-kale-purple" />
              <div>
                <p className="font-medium text-kale-black">Login Notifications</p>
                <p className="text-sm text-kale-slate">Get notified of new login attempts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.loginNotifications}
              className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              readOnly
            />
          </div>

          <div className="p-4 border border-kale-light-slate rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-kale-pink" />
                <div>
                  <p className="font-medium text-kale-black">Password</p>
                  <p className="text-sm text-kale-slate">Change your account password</p>
                </div>
              </div>
              <button className="text-kale-teal hover:text-kale-dark-teal text-sm">Change Password</button>
            </div>
            <p className="text-xs text-kale-slate">Last changed: 2 months ago</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Session Timeout</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="15">15 minutes</option>
                <option value="30" selected>30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Active Sessions</p>
                <p className="text-sm text-yellow-700 mt-1">You have 2 active sessions. Sign out from unused devices for better security.</p>
                <button className="text-yellow-800 hover:text-yellow-900 text-sm mt-2 underline">
                  Manage Sessions
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-kale-purple" />
                <div>
                  <p className="font-medium text-kale-black">Email Notifications</p>
                  <p className="text-sm text-kale-slate">Receive notifications via email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationToggle('email')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-kale-green" />
                <div>
                  <p className="font-medium text-kale-black">Push Notifications</p>
                  <p className="text-sm text-kale-slate">Browser and mobile push notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationToggle('push')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-kale-pink" />
                <div>
                  <p className="font-medium text-kale-black">SMS Notifications</p>
                  <p className="text-sm text-kale-slate">Receive critical alerts via SMS</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationToggle('sms')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Price Alerts</p>
                <p className="text-sm text-kale-slate">KALE price movements and threshold alerts</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.price}
                onChange={() => handleNotificationToggle('price')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Farming Updates</p>
                <p className="text-sm text-kale-slate">Rewards, efficiency changes, and farming alerts</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.farming}
                onChange={() => handleNotificationToggle('farming')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Network Status</p>
                <p className="text-sm text-kale-slate">Network health and maintenance notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.network}
                onChange={() => handleNotificationToggle('network')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Marketing & Updates</p>
                <p className="text-sm text-kale-slate">Product updates, news, and promotional content</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={() => handleNotificationToggle('marketing')}
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setTheme('light')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'light' ? 'border-kale-teal bg-blue-50' : 'border-kale-light-slate hover:border-kale-slate'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-kale-black">Light</span>
              </div>
              <div className="bg-white border rounded p-2 text-xs">
                <div className="bg-kale-light-slate h-2 rounded mb-1"></div>
                <div className="bg-kale-light-slate h-1 rounded mb-1 w-3/4"></div>
                <div className="bg-kale-teal h-1 rounded w-1/2"></div>
              </div>
            </div>

            <div
              onClick={() => setTheme('dark')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'dark' ? 'border-kale-teal bg-blue-50' : 'border-kale-light-slate hover:border-kale-slate'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Moon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-kale-black">Dark</span>
              </div>
              <div className="bg-gray-800 border rounded p-2 text-xs">
                <div className="bg-gray-600 h-2 rounded mb-1"></div>
                <div className="bg-gray-600 h-1 rounded mb-1 w-3/4"></div>
                <div className="bg-kale-teal h-1 rounded w-1/2"></div>
              </div>
            </div>

            <div
              onClick={() => setTheme('system')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'system' ? 'border-kale-teal bg-blue-50' : 'border-kale-light-slate hover:border-kale-slate'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Monitor className="h-5 w-5 text-kale-slate" />
                <span className="font-medium text-kale-black">System</span>
              </div>
              <div className="bg-gradient-to-r from-white to-gray-800 border rounded p-2 text-xs">
                <div className="bg-kale-light-slate h-2 rounded mb-1"></div>
                <div className="bg-kale-light-slate h-1 rounded mb-1 w-3/4"></div>
                <div className="bg-kale-teal h-1 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Language</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Currency</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BTC">BTC (₿)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
            <div>
              <p className="font-medium text-kale-black">Compact View</p>
              <p className="text-sm text-kale-slate">Show more information in less space</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
            <div>
              <p className="font-medium text-kale-black">Show Tooltips</p>
              <p className="text-sm text-kale-slate">Display helpful tooltips throughout the app</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-kale-light-slate rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-kale-black">API Key</p>
                <p className="text-sm text-kale-slate">Use this key to access the KALE Tracker API</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-kale-light-slate rounded transition-colors"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleCopyApiKey}
                  className="p-2 hover:bg-kale-light-slate rounded transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-kale-green" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="bg-kale-light-slate rounded p-3">
              <code className="text-sm font-mono">
                {showApiKey ? userProfile.apiKey : '••••••••••••••••••••••••••••••••'}
              </code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-kale-light-slate rounded-lg hover:bg-kale-light-slate transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate Key</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-kale-light-slate rounded-lg hover:bg-kale-light-slate transition-colors">
              <ExternalLink className="h-4 w-4" />
              <span>API Documentation</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-kale-teal text-white rounded-lg hover:bg-kale-dark-teal transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-kale-light-slate rounded-lg hover:bg-kale-light-slate transition-colors">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
            </button>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Danger Zone</p>
                <p className="text-sm text-red-700 mt-1">These actions cannot be undone. Please be careful.</p>
                <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm mt-3">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Default Time Range</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="1h">1 Hour</option>
                <option value="24h" selected>24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-kale-slate mb-2">Auto-refresh Interval</label>
              <select className="w-full px-3 py-2 border border-kale-light-slate rounded-lg focus:outline-none focus:ring-2 focus:ring-kale-teal">
                <option value="10">10 seconds</option>
                <option value="30" selected>30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="0">Manual only</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Sound Effects</p>
                <p className="text-sm text-kale-slate">Play sounds for notifications and alerts</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Analytics Tracking</p>
                <p className="text-sm text-kale-slate">Help improve the app by sharing usage data</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-kale-light-slate rounded-lg">
              <div>
                <p className="font-medium text-kale-black">Beta Features</p>
                <p className="text-sm text-kale-slate">Get early access to new features</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-kale-teal focus:ring-kale-teal border-kale-light-slate rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support & Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-kale-light-slate rounded-lg hover:bg-kale-light-slate transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span>Help Center</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-kale-light-slate rounded-lg hover:bg-kale-light-slate transition-colors">
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Need Help?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Check out our documentation or contact our support team for assistance.
                </p>
                <div className="flex space-x-3 mt-3">
                  <button className="text-blue-800 hover:text-blue-900 text-sm underline">
                    View Documentation
                  </button>
                  <button className="text-blue-800 hover:text-blue-900 text-sm underline">
                    Join Discord
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'api':
        return renderApiTab();
      case 'preferences':
        return renderPreferencesTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kale-black flex items-center space-x-2">
              <Settings className="h-6 w-6 text-kale-purple" />
              <span>Settings</span>
            </h1>
            <p className="text-kale-slate mt-1">
              Manage your account preferences and application settings
            </p>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-kale-teal text-white'
                            : 'text-kale-slate hover:bg-kale-light-slate hover:text-kale-black'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
