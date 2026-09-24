'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Send, Loader2, MapPin, AlertCircle } from 'lucide-react';
import type { ClassificationResult } from './ClassificationPreview';

interface FormValues {
  texto: string;
  fuente: string;
  lat: string;
  lng: string;
  entidad_hint: string;
}

const FUENTES = [
  'Twitter/X',
  'Instagram',
  'Telegram',
  'WhatsApp',
  'Facebook',
  'Manual',
  'Otra',
];

const EXAMPLE_TEXTS = [
  'Sin electricidad en Petare desde las 8am. Ya van 6 horas sin luz. Corpoelec no responde.',
  'Derrumbe en la autopista Caracas-La Guaira a la altura del distribuidor Catia. Tráfico paralizado.',
  'Maracay sin agua desde hace 4 días. Los camiones cisterna cobran Bs. 50 por pipa.',
  'Internet caído en toda Maturín. Movistar, Digitel y CANTV sin servicio desde las 11pm.',
];

interface Props {
  onClassificationStart: () => void;
  onClassificationComplete: (result: ClassificationResult) => void;
}

// Mock AI classification — Backend: Replace with POST /api/ingest using Gemini 2.5 Flash
const mockClassify = async (texto: string): Promise<ClassificationResult> => {
  await new Promise((r) => setTimeout(r, 2200));

  const lower = texto.toLowerCase();
  const isElectric = lower.includes('luz') || lower.includes('electricidad') || lower.includes('corpoelec');
  const isVial = lower.includes('autopista') || lower.includes('derrumbe') || lower.includes('carretera');
  const isHidrico = lower.includes('agua') || lower.includes('cisterna') || lower.includes('hidro');
  const isConnectivity = lower.includes('internet') || lower.includes('cantv') || lower.includes('movistar');

  if (isElectric) {
    return {
      categoria: 'electrico',
      sub_categoria: 'Falla de Distribución',
      severidad: 'alta',
      entidad_geografica: 'Petare, Miranda',
      tipo_geometria: 'Polygon',
      confianza: 94,
      lat: 10.4783,
      lng: -66.8023,
      tokens_procesados: 47,
    };
  }
  if (isVial) {
    return {
      categoria: 'vialidad',
      sub_categoria: 'Derrumbe en Autopista',
      severidad: 'critica',
      entidad_geografica: 'Autopista Caracas-La Guaira',
      tipo_geometria: 'LineString',
      confianza: 97,
      lat: 10.5234,
      lng: -66.9312,
      tokens_procesados: 52,
    };
  }
  if (isHidrico) {
    return {
      categoria: 'hidrico',
      sub_categoria: 'Corte de Agua Prolongado',
      severidad: 'alta',
      entidad_geografica: 'Maracay, Aragua',
      tipo_geometria: 'Polygon',
      confianza: 91,
      lat: 10.2469,
      lng: -67.5958,
      tokens_procesados: 44,
    };
  }
  if (isConnectivity) {
    return {
      categoria: 'conectividad',
      sub_categoria: 'Caída Multi-Operador',
      severidad: 'alta',
      entidad_geografica: 'Maturín, Monagas',
      tipo_geometria: 'Polygon',
      confianza: 88,
      lat: 9.7489,
      lng: -63.1836,
      tokens_procesados: 39,
    };
  }

  return {
    categoria: 'seguridad',
    sub_categoria: 'Incidente Urbano',
    severidad: 'media',
    entidad_geografica: 'Venezuela (Ubicación no determinada)',
    tipo_geometria: 'Point',
    confianza: 62,
    lat: 10.488,
    lng: -66.9036,
    tokens_procesados: 31,
  };
};

export default function ReportForm({ onClassificationStart, onClassificationComplete }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      texto: '',
      fuente: 'Twitter/X',
      lat: '',
      lng: '',
      entidad_hint: '',
    },
  });

  const textoValue = watch('texto');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    onClassificationStart();
    try {
      // Backend: POST /api/ingest with { texto: data.texto, fuente: data.fuente }
      // The route handler calls Gemini 2.5 Flash for classification, then inserts to Supabase
      const result = await mockClassify(data.texto);
      onClassificationComplete(result);
      toast.success('Incidente clasificado e ingresado al sistema', {
        description: `Categoría: ${result.categoria} · Severidad: ${result.severidad.toUpperCase()}`,
      });
    } catch {
      toast.error('Error al procesar el reporte', {
        description: 'Verifica la conexión e intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Texto Original */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
            1
          </span>
          Texto del Reporte
        </h2>

        <div>
          <label
            htmlFor="texto"
            className="block text-xs font-medium text-muted-foreground mb-1"
          >
            Texto original del post / reporte
            <span className="text-severity-critica ml-1">*</span>
          </label>
          <p className="text-[11px] text-muted-foreground/70 mb-2">
            Pega el texto exacto de la publicación en redes sociales o ingresa la descripción del incidente
          </p>
          <div className="relative">
            <textarea
              id="texto"
              rows={5}
              placeholder="Ej: Sin luz en todo el municipio Chacao desde las 6pm, no hay información del corte..."
              className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none ${
                errors.texto ? 'border-severity-critica' : 'border-border'
              }`}
              {...register('texto', {
                required: 'El texto del reporte es obligatorio',
                minLength: {
                  value: 20,
                  message: 'El texto debe tener al menos 20 caracteres para una clasificación precisa',
                },
                onChange: (e) => setCharCount(e.target.value.length),
              })}
            />
            <span className="absolute bottom-2 right-2 text-[10px] font-mono-data text-muted-foreground/50">
              {charCount} caracteres
            </span>
          </div>
          {errors.texto && (
            <p className="mt-1 text-xs text-severity-critica flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.texto.message}
            </p>
          )}
        </div>

        {/* Example texts */}
        <div className="mt-3">
          <p className="text-[11px] text-muted-foreground mb-2">Ejemplos rápidos:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_TEXTS.map((ex, i) => (
              <button
                key={`ex-${i}`}
                type="button"
                onClick={() => {
                  setValue('texto', ex);
                  setCharCount(ex.length);
                }}
                className="text-[10px] px-2 py-1 bg-secondary/80 border border-border rounded text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all truncate max-w-[200px]"
              >
                {ex.substring(0, 40)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fuente y Metadatos */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
            2
          </span>
          Fuente y Metadatos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fuente */}
          <div>
            <label
              htmlFor="fuente"
              className="block text-xs font-medium text-muted-foreground mb-1"
            >
              Fuente del reporte
              <span className="text-severity-critica ml-1">*</span>
            </label>
            <p className="text-[11px] text-muted-foreground/70 mb-2">
              Plataforma donde se publicó el reporte original
            </p>
            <select
              id="fuente"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              {...register('fuente', { required: true })}
            >
              {FUENTES.map((f) => (
                <option key={`fuente-opt-${f}`} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Entidad hint */}
          <div>
            <label
              htmlFor="entidad_hint"
              className="block text-xs font-medium text-muted-foreground mb-1"
            >
              Entidad geográfica (opcional)
            </label>
            <p className="text-[11px] text-muted-foreground/70 mb-2">
              Ayuda a la IA si la ubicación no es explícita en el texto
            </p>
            <input
              id="entidad_hint"
              type="text"
              placeholder="Ej: Municipio Baruta, Caracas"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              {...register('entidad_hint')}
            />
          </div>
        </div>
      </div>

      {/* Coordenadas opcionales */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center font-bold">
            3
          </span>
          Coordenadas GPS
          <span className="text-[10px] text-muted-foreground font-normal bg-secondary px-1.5 py-0.5 rounded ml-1">
            Opcional
          </span>
        </h2>
        <p className="text-[11px] text-muted-foreground/70 mb-4 ml-7">
          Si conoces las coordenadas exactas, ingresarlas mejora la precisión del punto en el mapa
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lat"
              className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"
            >
              <MapPin size={11} />
              Latitud (WGS 84)
            </label>
            <input
              id="lat"
              type="text"
              placeholder="Ej: 10.4880"
              className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-sm font-mono-data text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                errors.lat ? 'border-severity-critica' : 'border-border'
              }`}
              {...register('lat', {
                pattern: {
                  value: /^-?([0-9]{1,2})(\.([0-9]{1,6}))?$/,
                  message: 'Latitud inválida (ej: 10.4880)',
                },
              })}
            />
            {errors.lat && (
              <p className="mt-1 text-xs text-severity-critica flex items-center gap-1">
                <AlertCircle size={11} />
                {errors.lat.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lng"
              className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1"
            >
              <MapPin size={11} />
              Longitud (WGS 84)
            </label>
            <input
              id="lng"
              type="text"
              placeholder="Ej: -66.9036"
              className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-sm font-mono-data text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                errors.lng ? 'border-severity-critica' : 'border-border'
              }`}
              {...register('lng', {
                pattern: {
                  value: /^-?([0-9]{1,3})(\.([0-9]{1,6}))?$/,
                  message: 'Longitud inválida (ej: -66.9036)',
                },
              })}
            />
            {errors.lng && (
              <p className="mt-1 text-xs text-severity-critica flex items-center gap-1">
                <AlertCircle size={11} />
                {errors.lng.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => {
            reset();
            setCharCount(0);
          }}
          className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          Limpiar formulario
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 min-w-[180px] justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Clasificando con IA...
            </>
          ) : (
            <>
              <Send size={15} />
              Enviar y Clasificar
            </>
          )}
        </button>
      </div>
    </form>
  );
}