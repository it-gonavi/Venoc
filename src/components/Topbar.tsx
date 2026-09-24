'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Search, Radio, RefreshCw, User } from 'lucide-react';

export default function Topbar() {
  const [currentTime, setCurrentTime] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      return now?.toLocaleString('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    };
    setCurrentTime(fmt());
    const interval = setInterval(() => setCurrentTime(fmt()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card shrink-0 z-10">
      {/* Left: Status indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Radio size={14} className="text-severity-baja animate-pulse" />
          <span className="text-xs font-mono-data text-muted-foreground hidden sm:block">
            REALTIME ACTIVO
          </span>
        </div>
        <div className="w-px h-4 bg-border hidden sm:block" />
        <span className="text-xs font-mono-data text-muted-foreground hidden md:block">
          {currentTime} VET
        </span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm mx-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar incidentes... (Ctrl+K)"
            className="w-full bg-secondary border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 relative"
          aria-label="Notificaciones"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-severity-critica" />
        </button>
        <button
          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
          aria-label="Actualizar datos"
        >
          <RefreshCw size={16} />
        </button>
        <div className="w-px h-5 bg-border" />
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-all duration-150">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-foreground leading-none">
              Operador NOC
            </p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Turno Noche
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}