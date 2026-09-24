'use client';
import React from 'react';
import type { Incidente } from '@/lib/mockData';

interface Props {
  incidents: Incidente[];
}

export default function IncidentTableStats({ incidents }: Props) {
  const critical = incidents.filter((i) => i.severidad === 'critica').length;
  const high = incidents.filter((i) => i.severidad === 'alta').length;
  const medium = incidents.filter((i) => i.severidad === 'media').length;
  const low = incidents.filter((i) => i.severidad === 'baja').length;

  const stats = [
    { id: 'stat-total', label: 'Total', value: incidents.length, color: 'text-foreground', bg: 'bg-secondary' },
    { id: 'stat-critica', label: 'Crítica', value: critical, color: 'text-severity-critica', bg: 'bg-severity-critica/10' },
    { id: 'stat-alta', label: 'Alta', value: high, color: 'text-severity-alta', bg: 'bg-severity-alta/10' },
    { id: 'stat-media', label: 'Media', value: medium, color: 'text-severity-media', bg: 'bg-severity-media/10' },
    { id: 'stat-baja', label: 'Baja', value: low, color: 'text-severity-baja', bg: 'bg-severity-baja/10' },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {stats.map((s) => (
        <div
          key={s.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${s.bg}`}
        >
          <span className={`text-xl font-bold font-mono-data leading-none ${s.color}`}>
            {s.value}
          </span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}