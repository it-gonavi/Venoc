'use client';
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { MOCK_INCIDENTS } from '@/lib/mockData';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';

const recent = MOCK_INCIDENTS.slice(0, 5);

export default function RecentSubmissions() {
  const formatRelative = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'ahora';
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Últimos Reportes
          </span>
        </div>
        <span className="text-[10px] font-mono-data text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
          {recent.length} recientes
        </span>
      </div>

      <div className="divide-y divide-border/50">
        {recent.map((inc) => (
          <div
            key={`recent-${inc.id}`}
            className="px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <CategoryBadge categoria={inc.categoria} showLabel={false} size="sm" />
                <SeverityBadge severidad={inc.severidad} size="sm" />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-mono-data text-muted-foreground/60">
                  {formatRelative(inc.created_at)}
                </span>
                <ChevronRight
                  size={11}
                  className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {inc.texto_original}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-mono-data text-muted-foreground/50">
                {inc.id.toUpperCase()}
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="text-[10px] text-muted-foreground/50 truncate">
                {inc.entidad_geografica}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-border">
        <a
          href="/incident-history"
          className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
        >
          Ver historial completo
          <ChevronRight size={11} />
        </a>
      </div>
    </div>
  );
}