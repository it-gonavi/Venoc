'use client';
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Categoria } from '@/components/ui/CategoryBadge';
import type { Severidad } from '@/lib/mockData';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  categoryFilter: Categoria | 'all';
  onCategoryFilter: (v: Categoria | 'all') => void;
  severityFilter: Severidad | 'all';
  onSeverityFilter: (v: Severidad | 'all') => void;
}

const CATEGORIES: { value: Categoria | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'hidrico', label: 'Hídrico' },
  { value: 'conectividad', label: 'Conectividad' },
  { value: 'combustible', label: 'Combustible' },
  { value: 'vialidad', label: 'Vialidad' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'meteorologico', label: 'Meteorológico' },
];

const SEVERITIES: { value: Severidad | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas las severidades' },
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

export default function IncidentTableFilters({
  search,
  onSearch,
  categoryFilter,
  onCategoryFilter,
  severityFilter,
  onSeverityFilter,
}: Props) {
  const hasActiveFilters =
    search || categoryFilter !== 'all' || severityFilter !== 'all';

  const clearAll = () => {
    onSearch('');
    onCategoryFilter('all');
    onSeverityFilter('all');
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 shrink-0 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por texto, entidad, ID..."
          className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="relative">
        <Filter
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value as Categoria | 'all')}
          className="bg-secondary border border-border rounded-lg pl-7 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer transition-all"
        >
          {CATEGORIES.map((c) => (
            <option key={`cat-opt-${c.value}`} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Severity filter */}
      <select
        value={severityFilter}
        onChange={(e) => onSeverityFilter(e.target.value as Severidad | 'all')}
        className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer transition-all"
      >
        {SEVERITIES.map((s) => (
          <option key={`sev-opt-${s.value}`} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border hover:text-foreground hover:bg-secondary transition-all"
        >
          <X size={12} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}