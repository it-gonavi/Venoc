import React from 'react';
import { Zap, Droplets, Wifi, Fuel, Car, Shield, Cloud } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export type Categoria =
  | 'electrico' |'hidrico' |'conectividad' |'combustible' |'vialidad' |'seguridad' |'meteorologico';

const config: Record<
  Categoria,
  { label: string; Icon: React.ElementType; color: string; bg: string }
> = {
  electrico: {
    label: 'Eléctrico',
    Icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
  },
  hidrico: {
    label: 'Hídrico',
    Icon: Droplets,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10 border-sky-400/30',
  },
  conectividad: {
    label: 'Conectividad',
    Icon: Wifi,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/30',
  },
  combustible: {
    label: 'Combustible',
    Icon: Fuel,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/30',
  },
  vialidad: {
    label: 'Vialidad',
    Icon: Car,
    color: 'text-slate-400',
    bg: 'bg-slate-400/10 border-slate-400/30',
  },
  seguridad: {
    label: 'Seguridad',
    Icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
  },
  meteorologico: {
    label: 'Meteorológico',
    Icon: Cloud,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
  },
};

interface CategoryBadgeProps {
  categoria: Categoria;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({
  categoria,
  showLabel = true,
  size = 'md',
}: CategoryBadgeProps) {
  const { label, Icon, color, bg } = config[categoria];
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded font-medium ${bg} ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      }`}
    >
      <Icon size={size === 'sm' ? 10 : 12} className={color} />
      {showLabel && <span className={color}>{label}</span>}
    </span>
  );
}