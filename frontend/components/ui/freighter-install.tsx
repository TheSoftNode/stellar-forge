'use client';

import { ExternalLink, Download, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FreighterInstallGuide() {
  const openFreighterInstall = () => {
    window.open('https://freighter.app/', '_blank');
  };

  return (
    <Card className="max-w-md mx-auto bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
          <Shield className="h-5 w-5 text-teal-500" />
          <span>Connect Your Stellar Wallet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          To access farming features and track your rewards, you'll need a Stellar wallet. 
          We recommend Freighter - the most popular and secure Stellar wallet.
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Secure & Open Source</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Non-custodial wallet with full source code transparency</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Easy Integration</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Seamlessly connect to StellarForge Analytics</p>
            </div>
          </div>
        </div>

        <button
          onClick={openFreighterInstall}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="font-medium">Install Freighter Wallet</span>
          <ExternalLink className="h-3 w-3" />
        </button>

        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have Freighter? Refresh the page and click "Connect Wallet"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
