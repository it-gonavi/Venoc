import React from 'react';
import AppLayout from '@/components/AppLayout';
import NocMapDashboard from './components/NocMapDashboard';

export default function NocMapPage() {
  return (
    <AppLayout fullscreen>
      <NocMapDashboard />
    </AppLayout>
  );
}