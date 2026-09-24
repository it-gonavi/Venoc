'use client';
import React, { useMemo, useState } from 'react';
import {
  Map,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map';
import { MOCK_INCIDENTS } from '@/lib/mockData';
import type { Severidad } from '@/lib/mockData';
import type { Categoria } from '@/components/ui/CategoryBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import GeometryBadge from '@/components/ui/GeometryBadge';
import { MapPin, Clock, Zap, Droplets, Wifi, Fuel, Car, ShieldAlert, CloudRain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import venezuelaStatesRaw from '@/lib/venezuela-states.geo.json';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

// Real Venezuela state boundaries (geoBoundaries VEN ADM1, CC-BY).
// Cast at the import boundary: JSON imports widen string literals, but the
// file is a valid FeatureCollection of Polygon/MultiPolygon features.
type VenezuelaStateProps = { shapeName: string; shapeISO?: string };
const VENEZUELA_STATES = venezuelaStatesRaw as unknown as FeatureCollection<
  Polygon | MultiPolygon,
  VenezuelaStateProps
>;

const SEVERITY_COLORS: Record<Severidad, string> = {
  critica: '#ef4444',
  alta: '#f97316',
  media: '#f59e0b',
  baja: '#22c55e',
};

const SEVERITY_ORDER: Severidad[] = ['critica', 'alta', 'media', 'baja'];

// Icon per incident category (identifies each incident on the map)
const CATEGORY_ICONS: Record<Categoria, LucideIcon> = {
  electrico: Zap,
  hidrico: Droplets,
  conectividad: Wifi,
  combustible: Fuel,
  vialidad: Car,
  seguridad: ShieldAlert,
  meteorologico: CloudRain,
};

const CATEGORY_FILTERS: { key: Categoria | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'electrico', label: 'Eléctrico' },
  { key: 'hidrico', label: 'Hídrico' },
  { key: 'conectividad', label: 'Conectividad' },
  { key: 'combustible', label: 'Combustible' },
  { key: 'vialidad', label: 'Vialidad' },
  { key: 'seguridad', label: 'Seguridad' },
  { key: 'meteorologico', label: 'Meteorológico' },
];

// Map incident IDs to Venezuelan state names (ISO 3166-2:VE codes used in Mapbox boundaries)
const INCIDENT_STATE_MAP: Record<string, string> = {
  'inc-001': 'Distrito Capital',
  'inc-002': 'Aragua',
  'inc-003': 'Zulia',
  'inc-004': 'Lara',
  'inc-005': 'Carabobo',
  'inc-006': 'Distrito Capital',
  'inc-007': 'Mérida',
  'inc-008': 'Miranda',
  'inc-009': 'Distrito Capital',
  'inc-010': 'Bolívar',
  'inc-011': 'Bolívar',
  'inc-012': 'Táchira',
};


export default function MapCanvas() {
  const [activeFilter, setActiveFilter] = useState<Categoria | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<Set<Severidad>>(
    new Set(['critica', 'alta', 'media', 'baja'])
  );

  const filteredIncidents = useMemo(
    () =>
      MOCK_INCIDENTS.filter((inc) => {
        const catMatch = activeFilter === 'all' || inc.categoria === activeFilter;
        const sevMatch = severityFilter.has(inc.severidad);
        return catMatch && sevMatch;
      }),
    [activeFilter, severityFilter]
  );

  // Build map: stateName -> worst severity
  const stateIncidentSeverity = useMemo(() => {
    const map: Record<string, Severidad> = {};
    filteredIncidents.forEach((inc) => {
      const stateName = INCIDENT_STATE_MAP[inc.id];
      if (!stateName) return;
      const current = map[stateName];
      if (!current) {
        map[stateName] = inc.severidad;
      } else {
        const currentIdx = SEVERITY_ORDER.indexOf(current);
        const newIdx = SEVERITY_ORDER.indexOf(inc.severidad);
        if (newIdx < currentIdx) map[stateName] = inc.severidad;
      }
    });
    return map;
  }, [filteredIncidents]);

  // Highlighted states GeoJSON (real boundaries; fill/stroke only for affected states)
  const highlightedStatesGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: VENEZUELA_STATES.features.map((f) => {
        const sev = stateIncidentSeverity[f.properties.shapeName];
        return {
          ...f,
          properties: {
            ...f.properties,
            severity: sev || null,
            fillColor: sev ? SEVERITY_COLORS[sev] : '#000000',
            fillOpacity: sev ? 0.45 : 0,
            strokeColor: sev ? SEVERITY_COLORS[sev] : '#000000',
            strokeWidth: sev ? 1.5 : 0,
          },
        };
      }),
    }),
    [stateIncidentSeverity]
  );

  const toggleSeverity = (sev: Severidad) => {
    setSeverityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) {
        if (next.size > 1) next.delete(sev);
      } else {
        next.add(sev);
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-full bg-[#0a1628] flex flex-col">
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1f3c]/80 border-b border-blue-900/40 flex-wrap z-10 relative">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-blue-600 text-white' :'bg-[#1e3a5f]/60 text-blue-300 hover:bg-blue-800/50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          {SEVERITY_ORDER.map((sev) => (
            <button
              key={sev}
              onClick={() => toggleSeverity(sev)}
              className={`px-2 py-0.5 rounded text-xs font-medium border transition-all ${
                severityFilter.has(sev) ? 'opacity-100' : 'opacity-30'
              }`}
              style={{ borderColor: SEVERITY_COLORS[sev], color: SEVERITY_COLORS[sev] }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <Map
            theme="dark"
            center={[-66.0, 7.5]}
            zoom={5.2}
            minZoom={4}
            maxZoom={12}
            className="h-full w-full"
          >
            {/* Venezuela states fill + outline */}
            <MapGeoJSON
              data={highlightedStatesGeoJSON}
              fillPaint={{
                'fill-color': ['get', 'fillColor'],
                'fill-opacity': ['get', 'fillOpacity'],
              }}
              linePaint={{
                'line-color': ['get', 'strokeColor'],
                'line-width': ['get', 'strokeWidth'],
                'line-opacity': 0.9,
              }}
            />

            {/* Incident markers: category icon inside a severity-colored badge */}
            {filteredIncidents.map((inc) => {
              const Icon = CATEGORY_ICONS[inc.categoria];
              return (
                <MapMarker key={inc.id} longitude={inc.lng} latitude={inc.lat}>
                  <MarkerContent>
                    <div
                      aria-label={`${inc.entidad_geografica} — ${inc.severidad}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
                        inc.severidad === 'critica' ? 'pulse-critical' : ''
                      }`}
                      style={{ backgroundColor: SEVERITY_COLORS[inc.severidad] }}
                    >
                      <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                  </MarkerContent>
                  <MarkerPopup className="w-72 !bg-[#0d1f3c] !border-blue-800/60">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-white leading-tight">
                          {inc.entidad_geografica}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <SeverityBadge severidad={inc.severidad} />
                        <CategoryBadge categoria={inc.categoria} />
                        <GeometryBadge tipo={inc.tipo_geometria} />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                        {inc.texto_original}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(inc.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="mx-1">·</span>
                        <span>{inc.fuente}</span>
                      </div>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              );
            })}
          </Map>
        </div>

        {/* Data attribution */}
        <div className="pointer-events-none absolute bottom-2 left-2 z-10 text-[9px] text-slate-600">
          Límites: geoBoundaries.org (CC-BY)
        </div>
      </div>
    </div>
  );
}