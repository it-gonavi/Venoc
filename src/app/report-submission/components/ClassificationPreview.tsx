'use client';
import React from 'react';
import { Brain, Loader2, CheckCircle, MapPin, Layers, BarChart2, Hash,  } from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Categoria } from '@/components/ui/CategoryBadge';
import type { Severidad, TipoGeometria } from '@/lib/mockData';

export interface ClassificationResult {
  categoria: Categoria;
  sub_categoria: string;
  severidad: Severidad;
  entidad_geografica: string;
  tipo_geometria: TipoGeometria;
  confianza: number;
  lat: number;
  lng: number;
  tokens_procesados: number;
}

interface Props {
  result: ClassificationResult | null;
  isLoading: boolean;
}

export default function ClassificationPreview({ result, isLoading }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Brain size={14} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Clasificación IA
        </span>
        <span className="ml-auto text-[10px] font-mono-data text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
          Gemini 2.5 Flash
        </span>
      </div>

      <div className="p-4">
        {/* Idle state */}
        {!isLoading && !result && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain size={20} className="text-primary/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Esperando reporte
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                Envía un reporte para ver la clasificación automática aquí
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center fade-in">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Loader2 size={20} className="text-primary animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-severity-baja animate-ping" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Analizando texto...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Identificando categoría, severidad y ubicación
              </p>
            </div>
            <div className="w-full space-y-2">
              {['Procesando NLP', 'Extrayendo entidades', 'Geolocalizando'].map(
                (step, i) => (
                  <div
                    key={`step-${i}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <Loader2 size={10} className="animate-spin text-primary/60 shrink-0" />
                    <span>{step}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Result state */}
        {!isLoading && result && (
          <div className="space-y-4 fade-in">
            {/* Success header */}
            <div className="flex items-center gap-2 p-2.5 bg-severity-baja/10 border border-severity-baja/20 rounded-lg">
              <CheckCircle size={14} className="text-severity-baja shrink-0" />
              <span className="text-xs text-severity-baja font-medium">
                Clasificación completada con {result.confianza}% de confianza
              </span>
            </div>

            {/* Confidence bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground">Confianza del modelo</span>
                <span className="text-[11px] font-mono-data font-semibold text-foreground">
                  {result.confianza}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.confianza >= 90
                      ? 'bg-severity-baja'
                      : result.confianza >= 75
                      ? 'bg-severity-media' :'bg-severity-alta'
                  }`}
                  style={{ width: `${result.confianza}%` }}
                />
              </div>
            </div>

            {/* Classification fields */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Layers size={11} />
                  <span>Categoría</span>
                </div>
                <CategoryBadge categoria={result.categoria} size="sm" />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Hash size={11} />
                  <span>Sub-categoría</span>
                </div>
                <span className="text-xs text-foreground font-medium text-right">
                  {result.sub_categoria}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <BarChart2 size={11} />
                  <span>Severidad</span>
                </div>
                <SeverityBadge severidad={result.severidad} size="sm" />
              </div>

              <div className="border-t border-border/50 pt-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <MapPin size={11} />
                    <span>Entidad</span>
                  </div>
                  <span className="text-xs text-foreground text-right max-w-[160px]">
                    {result.entidad_geografica}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Geometría</span>
                  <span className="text-xs font-mono-data text-primary">
                    {result.tipo_geometria}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Coordenadas</span>
                  <span className="text-[11px] font-mono-data text-muted-foreground">
                    {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">
                  Tokens procesados
                </span>
                <span className="text-[10px] font-mono-data text-muted-foreground/60">
                  {result.tokens_procesados}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}