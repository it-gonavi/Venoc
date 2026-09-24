'use client';
import React from 'react';
import type { Incidente } from '@/lib/mockData';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import GeometryBadge from '@/components/ui/GeometryBadge';
import { X, MapPin, Clock, Hash, FileText, Radio, Tag, ExternalLink,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface Props {
  incident: Incidente;
  onClose: () => void;
}

export default function IncidentDetailPanel({ incident, onClose }: Props) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min} VET`;
  };

  return (
    <div className="w-80 h-full border-l border-border bg-card flex flex-col shrink-0 slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <p className="text-[10px] font-mono-data text-muted-foreground uppercase tracking-wider">
            Detalle del Incidente
          </p>
          <p className="text-xs font-mono-data text-primary mt-0.5">
            {incident.id.toUpperCase()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          aria-label="Cerrar panel de detalle"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Severity + Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severidad={incident.severidad} pulse={incident.severidad === 'critica'} />
          <CategoryBadge categoria={incident.categoria} />
        </div>

        {/* Original text */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText size={12} className="text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Texto Original
            </p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-3">
            <p className="text-xs text-foreground leading-relaxed">
              {incident.texto_original}
            </p>
          </div>
        </div>

        {/* Classification */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag size={12} className="text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Clasificación IA
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Categoría', value: incident.categoria },
              { label: 'Sub-categoría', value: incident.sub_categoria },
            ].map((row) => (
              <div key={`detail-${row.label}`} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <span className="text-xs text-foreground font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={12} className="text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Geolocalización
            </p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Entidad</span>
              <span className="text-xs text-foreground font-medium text-right max-w-[160px]">
                {incident.entidad_geografica}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Geometría</span>
              <GeometryBadge tipo={incident.tipo_geometria} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Coordenadas</span>
              <span className="text-[11px] font-mono-data text-primary">
                {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">SRS</span>
              <span className="text-[11px] font-mono-data text-muted-foreground">
                EPSG:4326
              </span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Hash size={12} className="text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Metadatos
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Fuente', value: incident.fuente, icon: Radio },
              { label: 'Ingresado', value: formatDate(incident.created_at), icon: Clock },
              { label: 'ID Registro', value: incident.id.toUpperCase(), icon: Hash },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={`meta-${row.label}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon size={11} />
                    <span className="text-xs">{row.label}</span>
                  </div>
                  <span className="text-[11px] font-mono-data text-foreground text-right max-w-[160px] truncate">
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-3 flex gap-2 shrink-0">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 border border-primary/30 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-all">
          <MapPin size={12} />
          Ver en Mapa
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-secondary border border-border text-muted-foreground text-xs font-medium rounded-lg hover:text-foreground hover:bg-secondary/80 transition-all">
          <ExternalLink size={12} />
          Fuente Original
        </button>
      </div>
    </div>
  );
}