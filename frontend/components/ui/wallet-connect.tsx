'use client';

import { useState } from 'react';
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import { cn } from '@/lib/utils';

interface WalletConnectProps {
  className?: string;
  showFullAddress?: boolean;
}

export function WalletConnect({ className, showFullAddress = false }: WalletConnectProps) {
  const { 
    walletInfo, 
    isConnected, 
    isConnecting, 
    error, 
    connect, 
    disconnect, 
    isFreighterAvailable,
    formatPublicKey 
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [debugInfo, setDebugInfo] = useState(false);

  const handleCopyAddress = async () => {
    if (walletInfo?.publicKey) {
      await navigator.clipboard.writeText(walletInfo.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openFreighterInstall = () => {
    window.open('https://freighter.app/', '_blank');
  };

  const handleConnect = async () => {
    console.log('Connect clicked, Freighter available:', isFreighterAvailable);
    console.log('window.freighterApi:', !!(window as any).freighterApi);
    console.log('window.freighter:', !!(window as any).freighter);
    
    if (!isFreighterAvailable) {
      setError('Freighter not detected. Please make sure it\'s installed and refresh the page.');
      return;
    }
    
    await connect();
  };

  const [localError, setError] = useState<string | null>(null);

  if (!isConnected) {
    return (
      <div className={cn('relative', className)}>
        {!isFreighterAvailable ? (
          // Freighter not installed or not detected
          <div className="flex items-center space-x-2">
            <button
              onClick={openFreighterInstall}
              className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              title="Install Freighter Wallet"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Install Freighter</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            
            {/* Debug toggle */}
            <button
              onClick={() => setDebugInfo(!debugInfo)}
              className="text-xs text-slate-500 hover:text-slate-700 p-1"
              title="Debug info"
            >
              ?
            </button>
          </div>
        ) : (
          // Connect button
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center space-x-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-sm font-medium">
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </span>
          </button>
        )}

        {/* Debug info */}
        {debugInfo && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg z-50 text-xs">
            <div>Freighter Available: {isFreighterAvailable ? 'Yes' : 'No'}</div>
            <div>window.freighterApi: {typeof window !== 'undefined' && !!(window as any).freighterApi ? 'Yes' : 'No'}</div>
            <div>window.freighter: {typeof window !== 'undefined' && !!(window as any).freighter ? 'Yes' : 'No'}</div>
          </div>
        )}

        {/* Error message */}
        {(error || localError) && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg z-50 min-w-max max-w-sm">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error || localError}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          {showFullAddress && walletInfo ? 
            formatPublicKey(walletInfo.publicKey) : 
            'Connected'
          }
        </span>
        {walletInfo?.balance && (
          <span className="hidden lg:inline text-xs bg-green-400 text-green-900 px-2 py-1 rounded">
            {walletInfo.balance} XLM
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Stellar Wallet</h3>
              <div className="flex items-center space-x-1 text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">Connected</span>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="p-4 space-y-4">
            {/* Public Key */}
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Public Key
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <code className="flex-1 text-sm font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded truncate">
                  {walletInfo?.publicKey}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Network */}
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Network
              </label>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  {walletInfo?.network || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Balance */}
            {walletInfo?.balance && (
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  XLM Balance
                </label>
                <div className="mt-1">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {walletInfo.balance} XLM
                  </span>
                </div>
              </div>
            )}

            {/* Network Warning */}
            {walletInfo?.network && walletInfo.network !== 'PUBLIC' && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    You're connected to {walletInfo.network} network
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
