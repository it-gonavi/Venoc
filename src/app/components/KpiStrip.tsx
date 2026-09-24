'use client';
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  MapPin,
  Zap,
} from 'lucide-react';
import { MOCK_INCIDENTS } from '@/lib/mockData';
import Icon from '@/components/ui/AppIcon';


export default function KpiStrip() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      return now?.toLocaleTimeString('es-VE', {
        timeZone: 'America/Caracas',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    };
    setLastUpdated(fmt());
    const interval = setInterval(() => setLastUpdated(fmt()), 10000);
    return () => clearInterval(interval);
  }, []);

  const totalActive = MOCK_INCIDENTS?.length;
  const criticalCount = MOCK_INCIDENTS?.filter((i) => i?.severidad === 'critica')?.length;
  const topCategory = 'Eléctrico';
  const last24h = 47;

  const kpis = [
    {
      id: 'kpi-active',
      label: 'Incidentes Activos',
      value: totalActive,
      unit: '',
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
      trend: '+3 vs ayer',
      trendUp: false,
    },
    {
      id: 'kpi-critical',
      label: 'Nivel CRÍTICO',
      value: criticalCount,
      unit: '',
      icon: AlertTriangle,
      color: 'text-severity-critica',
      bg: 'bg-severity-critica/10 border-severity-critica/20',
      trend: 'Requiere atención',
      trendUp: false,
      pulse: true,
    },
    {
      id: 'kpi-category',
      label: 'Categoría Principal',
      value: topCategory,
      unit: '',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20',
      trend: '4 incidentes activos',
      trendUp: null,
    },
    {
      id: 'kpi-24h',
      label: 'Últimas 24h',
      value: last24h,
      unit: 'reportes',
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
      trend: '+12% vs ayer',
      trendUp: false,
    },
    {
      id: 'kpi-zones',
      label: 'Zonas Afectadas',
      value: 9,
      unit: 'estados',
      icon: MapPin,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10 border-violet-400/20',
      trend: 'Nacional',
      trendUp: null,
    },
  ];

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm shrink-0 overflow-x-auto scrollbar-thin">
      {kpis?.map((kpi) => {
        const Icon = kpi?.icon;
        return (
          <div
            key={kpi?.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${kpi?.bg} shrink-0 min-w-[160px] ${
              kpi?.pulse ? 'pulse-critical' : ''
            }`}
          >
            <div className={`p-1.5 rounded-md bg-background/40`}>
              <Icon size={16} className={kpi?.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                {kpi?.label}
              </p>
              <p className={`text-lg font-bold font-mono-data leading-tight ${kpi?.color}`}>
                {kpi?.value}
                {kpi?.unit && (
                  <span className="text-xs font-normal ml-1 text-muted-foreground">
                    {kpi?.unit}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{kpi?.trend}</p>
            </div>
          </div>
        );
      })}

      <div className="ml-auto shrink-0 flex items-center gap-2 text-[10px] text-muted-foreground font-mono-data">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-baja opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-severity-baja" />
        </span>
        <span>Actualizado {lastUpdated}</span>
      </div>
    </div>
  );
}