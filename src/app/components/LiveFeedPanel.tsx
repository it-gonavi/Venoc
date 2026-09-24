'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Radio, ChevronRight, X, Clock, ExternalLink } from 'lucide-react';
import { MOCK_INCIDENTS } from '@/lib/mockData';
import type { Incidente } from '@/lib/mockData';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';

export default function LiveFeedPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [feed, setFeed] = useState<Incidente[]>(MOCK_INCIDENTS.slice(0, 8));
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate realtime new incident arriving
  // Backend: Replace with Supabase Realtime subscription:
  // supabase.channel('incidentes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidentes' }, payload => { ... })
  useEffect(() => {
    const interval = setInterval(() => {
      const newInc: Incidente = {
        ...MOCK_INCIDENTS[Math.floor(MOCK_INCIDENTS.length * 0.3)],
        id: `inc-live-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setFeed((prev) => [newInc, ...prev.slice(0, 9)]);
      setNewIds((prev) => new Set([...prev, newInc.id]));
      setTimeout(() => {
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(newInc.id);
          return next;
        });
      }, 3000);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const formatRelative = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'ahora mismo';
    if (diff < 60) return `hace ${diff}m`;
    const h = Math.floor(diff / 60);
    return `hace ${h}h`;
  };

  return (
    <div
      className={`flex flex-col h-full border-l border-border bg-card/80 backdrop-blur-sm transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-10' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-severity-baja animate-pulse" />
            <span className="text-xs font-semibold text-foreground">Feed en Vivo</span>
            <span className="text-[10px] font-mono-data bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {feed.length}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-auto"
          aria-label={collapsed ? 'Expandir feed' : 'Colapsar feed'}
        >
          {collapsed ? <ChevronRight size={14} /> : <X size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div
          ref={feedRef}
          className="flex-1 overflow-y-auto scrollbar-thin py-1"
        >
          {feed.map((inc, idx) => {
            const isNew = newIds.has(inc.id);
            return (
              <div
                key={`feed-${inc.id}`}
                className={`px-3 py-2.5 border-b border-border/50 transition-all duration-300 hover:bg-secondary/40 cursor-pointer ${
                  isNew ? 'fade-in bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <SeverityBadge severidad={inc.severidad} size="sm" />
                    {isNew && (
                      <span className="text-[9px] font-bold text-severity-baja bg-severity-baja/10 px-1 rounded">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono-data">
                    <Clock size={9} />
                    <span>{formatRelative(inc.created_at)}</span>
                  </div>
                </div>

                <CategoryBadge categoria={inc.categoria} size="sm" />

                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {inc.texto_original}
                </p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/70 truncate max-w-[160px]">
                    📍 {inc.entidad_geografica}
                  </span>
                  <button className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-0.5 transition-colors">
                    <ExternalLink size={9} />
                  </button>
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[9px] font-mono-data text-muted-foreground/50 bg-secondary/50 px-1 rounded">
                    {inc.fuente}
                  </span>
                  <span className="text-[9px] font-mono-data text-muted-foreground/40">
                    {inc.id.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {collapsed && (
        <div className="flex-1 flex flex-col items-center py-3 gap-2">
          {feed.slice(0, 6).map((inc) => {
            const dotColor =
              inc.severidad === 'critica' ?'bg-severity-critica'
                : inc.severidad === 'alta' ?'bg-severity-alta'
                : inc.severidad === 'media' ?'bg-severity-media' :'bg-severity-baja';
            return (
              <div
                key={`dot-${inc.id}`}
                className={`w-2 h-2 rounded-full ${dotColor} ${
                  inc.severidad === 'critica' ? 'pulse-dot' : ''
                }`}
                title={inc.entidad_geografica}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}