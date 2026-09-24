import type { Categoria } from '@/components/ui/CategoryBadge';

export type Severidad = 'critica' | 'alta' | 'media' | 'baja';
export type TipoGeometria = 'Point' | 'LineString' | 'Polygon';
export type Fuente = 'Twitter/X' | 'Instagram' | 'Telegram' | 'WhatsApp' | 'Manual';

export interface Incidente {
  id: string;
  texto_original: string;
  categoria: Categoria;
  sub_categoria: string;
  severidad: Severidad;
  entidad_geografica: string;
  tipo_geometria: TipoGeometria;
  lat: number;
  lng: number;
  fuente: Fuente;
  created_at: string;
}

// Stable mock incidents — Venezuela infrastructure context
export const MOCK_INCIDENTS: Incidente[] = [
  {
    id: 'inc-001',
    texto_original:
      'Sin luz en todo el municipio Chacao desde las 6pm, no hay información del corte. Vecinos reportan que el transformador de la Av. Libertador explotó.',
    categoria: 'electrico',
    sub_categoria: 'Falla de Transformador',
    severidad: 'critica',
    entidad_geografica: 'Municipio Chacao, Caracas',
    tipo_geometria: 'Polygon',
    lat: 10.4958,
    lng: -66.8467,
    fuente: 'Twitter/X',
    created_at: '2026-09-24T14:52:00-04:00',
  },
  {
    id: 'inc-002',
    texto_original:
      'Autopista Regional del Centro completamente cerrada a la altura del peaje de La Victoria. Accidente múltiple con volcamiento de gandola.',
    categoria: 'vialidad',
    sub_categoria: 'Accidente Vial Mayor',
    severidad: 'alta',
    entidad_geografica: 'Autopista Regional del Centro, La Victoria',
    tipo_geometria: 'LineString',
    lat: 10.2283,
    lng: -67.3312,
    fuente: 'Telegram',
    created_at: '2026-09-24T14:38:00-04:00',
  },
  {
    id: 'inc-003',
    texto_original:
      'Maracaibo sin agua potable en los sectores norte y sur. Llevan 72 horas sin servicio. Las pipas no dan abasto.',
    categoria: 'hidrico',
    sub_categoria: 'Corte de Agua Prolongado',
    severidad: 'alta',
    entidad_geografica: 'Maracaibo Norte-Sur, Zulia',
    tipo_geometria: 'Polygon',
    lat: 10.6544,
    lng: -71.6124,
    fuente: 'Instagram',
    created_at: '2026-09-24T13:15:00-04:00',
  },
  {
    id: 'inc-004',
    texto_original:
      'CANTV caída total en Barquisimeto desde hace 3 horas. Internet y telefonía fija sin servicio en todo el estado Lara.',
    categoria: 'conectividad',
    sub_categoria: 'Caída de Red Nacional',
    severidad: 'critica',
    entidad_geografica: 'Barquisimeto, Lara',
    tipo_geometria: 'Polygon',
    lat: 10.0647,
    lng: -69.3571,
    fuente: 'Twitter/X',
    created_at: '2026-09-24T12:44:00-04:00',
  },
  {
    id: 'inc-005',
    texto_original:
      'Colas de más de 4 horas en las estaciones de servicio de Valencia. Solo hay gasolina en Maturín dicen los choferes.',
    categoria: 'combustible',
    sub_categoria: 'Escasez de Gasolina',
    severidad: 'media',
    entidad_geografica: 'Valencia, Carabobo',
    tipo_geometria: 'Point',
    lat: 10.1579,
    lng: -68.0,
    fuente: 'WhatsApp',
    created_at: '2026-09-24T11:30:00-04:00',
  },
  {
    id: 'inc-006',
    texto_original:
      'Balacera en la Cota 905 Caracas. Zona en conflicto activo, varios heridos reportados por vecinos.',
    categoria: 'seguridad',
    sub_categoria: 'Conflicto Armado Urbano',
    severidad: 'critica',
    entidad_geografica: 'Cota 905, Caracas',
    tipo_geometria: 'Point',
    lat: 10.4722,
    lng: -66.9561,
    fuente: 'Telegram',
    created_at: '2026-09-24T10:58:00-04:00',
  },
  {
    id: 'inc-007',
    texto_original:
      'Vaguada sobre los Andes venezolanos generando lluvias intensas. Derrumbes en la carretera Trasandina a la altura de Mérida.',
    categoria: 'meteorologico',
    sub_categoria: 'Derrumbe por Vaguada',
    severidad: 'alta',
    entidad_geografica: 'Carretera Trasandina, Mérida',
    tipo_geometria: 'LineString',
    lat: 8.5897,
    lng: -71.1441,
    fuente: 'Instagram',
    created_at: '2026-09-24T09:22:00-04:00',
  },
  {
    id: 'inc-008',
    texto_original:
      'Falla eléctrica menor en sector Los Palos Grandes, Caracas. Aprox 200 viviendas afectadas. Corpoelec ya fue notificado.',
    categoria: 'electrico',
    sub_categoria: 'Falla de Distribución Local',
    severidad: 'baja',
    entidad_geografica: 'Los Palos Grandes, Caracas',
    tipo_geometria: 'Point',
    lat: 10.5012,
    lng: -66.8621,
    fuente: 'Manual',
    created_at: '2026-09-24T08:45:00-04:00',
  },
  {
    id: 'inc-009',
    texto_original:
      'Fuga de agua en la Av. Libertador a la altura de El Rosal. El agua lleva horas corriendo y nadie de Hidrocapital aparece.',
    categoria: 'hidrico',
    sub_categoria: 'Fuga de Tubería Principal',
    severidad: 'media',
    entidad_geografica: 'El Rosal, Caracas',
    tipo_geometria: 'Point',
    lat: 10.4891,
    lng: -66.8712,
    fuente: 'Twitter/X',
    created_at: '2026-09-24T07:30:00-04:00',
  },
  {
    id: 'inc-010',
    texto_original:
      'Movistar y Digitel sin señal en Puerto Ordaz. Zona industrial completamente incomunicada. Reportan falla en torre repetidora.',
    categoria: 'conectividad',
    sub_categoria: 'Falla de Torre Repetidora',
    severidad: 'media',
    entidad_geografica: 'Puerto Ordaz, Bolívar',
    tipo_geometria: 'Point',
    lat: 8.2921,
    lng: -62.7272,
    fuente: 'Instagram',
    created_at: '2026-09-24T06:15:00-04:00',
  },
  {
    id: 'inc-011',
    texto_original:
      'Represa Guri reporta nivel crítico. Fuentes internas de Corpoelec confirman que el embalse está al 23% de su capacidad.',
    categoria: 'electrico',
    sub_categoria: 'Nivel Crítico de Embalse',
    severidad: 'critica',
    entidad_geografica: 'Represa Guri, Bolívar',
    tipo_geometria: 'Point',
    lat: 7.7667,
    lng: -62.9833,
    fuente: 'Telegram',
    created_at: '2026-09-24T05:00:00-04:00',
  },
  {
    id: 'inc-012',
    texto_original:
      'Pequeño incendio en subestación eléctrica de San Cristóbal controlado por bomberos. Servicio eléctrico restablecido al 70%.',
    categoria: 'electrico',
    sub_categoria: 'Incendio en Subestación',
    severidad: 'alta',
    entidad_geografica: 'San Cristóbal, Táchira',
    tipo_geometria: 'Point',
    lat: 7.7669,
    lng: -72.2247,
    fuente: 'Twitter/X',
    created_at: '2026-09-24T03:40:00-04:00',
  },
];

export const CATEGORY_STATS = [
  { categoria: 'Eléctrico', count: 4, color: '#fbbf24' },
  { categoria: 'Hídrico', count: 2, color: '#38bdf8' },
  { categoria: 'Conectividad', count: 2, color: '#a78bfa' },
  { categoria: 'Combustible', count: 1, color: '#fb923c' },
  { categoria: 'Vialidad', count: 1, color: '#6b7280' },
  { categoria: 'Seguridad', count: 1, color: '#f87171' },
  { categoria: 'Meteorológico', count: 1, color: '#34d399' },
];

export const HOURLY_TREND = [
  { hora: '00:00', incidentes: 3 },
  { hora: '01:00', incidentes: 1 },
  { hora: '02:00', incidentes: 2 },
  { hora: '03:00', incidentes: 4 },
  { hora: '04:00', incidentes: 2 },
  { hora: '05:00', incidentes: 3 },
  { hora: '06:00', incidentes: 5 },
  { hora: '07:00', incidentes: 7 },
  { hora: '08:00', incidentes: 9 },
  { hora: '09:00', incidentes: 6 },
  { hora: '10:00', incidentes: 11 },
  { hora: '11:00', incidentes: 8 },
  { hora: '12:00', incidentes: 13 },
  { hora: '13:00', incidentes: 10 },
  { hora: '14:00', incidentes: 15 },
  { hora: '15:00', incidentes: 12 },
];