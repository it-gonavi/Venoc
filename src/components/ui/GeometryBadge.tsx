import React from 'react';
import { MapPin, Minus, Hexagon } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type TipoGeometria = 'Point' | 'LineString' | 'Polygon';

const config: Record<TipoGeometria, { Icon: React.ElementType; label: string; color: string }> = {
  Point: { Icon: MapPin, label: 'Punto', color: 'text-sky-400' },
  LineString: { Icon: Minus, label: 'Línea', color: 'text-orange-400' },
  Polygon: { Icon: Hexagon, label: 'Polígono', color: 'text-violet-400' },
};

export default function GeometryBadge({ tipo }: { tipo: TipoGeometria }) {
  const { Icon, label, color } = config[tipo];
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${color}`}>
      <Icon size={12} />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}