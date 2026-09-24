import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  fullscreen?: boolean;
}

export default function AppLayout({ children, fullscreen = false }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main
          className={`flex-1 overflow-hidden ${
            fullscreen ? '' : 'overflow-y-auto scrollbar-thin'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}