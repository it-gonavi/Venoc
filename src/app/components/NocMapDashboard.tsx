import React from 'react';
import KpiStrip from './KpiStrip';
import MapCanvas from './MapCanvas';
import LiveFeedPanel from './LiveFeedPanel';

export default function NocMapDashboard() {
  return (
    <div className="flex flex-col h-full bg-background noc-grid-bg">
      {/* KPI Strip */}
      <KpiStrip />

      {/* Map + Feed */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Map */}
        <div className="flex-1 relative">
          <MapCanvas />
        </div>
        {/* Live Feed Sidebar */}
        <LiveFeedPanel />
      </div>
    </div>
  );
}