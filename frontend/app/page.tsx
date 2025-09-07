'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  const handleGetStarted = () => {
    setShowSplash(false);
    // Redirect to dashboard after user clicks get started
    router.push('/dashboard');
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onGetStarted={handleGetStarted} />;
  }

  // This will briefly show while redirecting, but user won't see it
  return null;
}
