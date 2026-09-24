import React from 'react';

type Severidad = 'critica' | 'alta' | 'media' | 'baja';

const labels: Record<Severidad, string> = {
  critica: 'CRÍTICA',
  alta: 'ALTA',
  media: 'MEDIA',
  baja: 'BAJA',
};

interface SeverityBadgeProps {
  severidad: Severidad;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export default function SeverityBadge({
  severidad,
  size = 'md',
  pulse = false,
}: SeverityBadgeProps) {
  const base = `inline-flex items-center gap-1 font-mono-data font-semibold rounded uppercase tracking-wider ${
    size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
  } severity-badge-${severidad} ${pulse && severidad === 'critica' ? 'pulse-critical' : ''}`;

  return <span className={base}>{labels[severidad]}</span>;
}