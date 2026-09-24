'use client';
import React, { useState, useMemo } from 'react';
import { MOCK_INCIDENTS } from '@/lib/mockData';
import type { Incidente, Severidad } from '@/lib/mockData';
import type { Categoria } from '@/components/ui/CategoryBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import GeometryBadge from '@/components/ui/GeometryBadge';
import IncidentDetailPanel from './IncidentDetailPanel';
import IncidentTableFilters from './IncidentTableFilters';
import IncidentTableStats from './IncidentTableStats';
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MapPin,
  Clock,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type SortKey = keyof Incidente | null;
type SortDir = 'asc' | 'desc';

const PAGE_SIZES = [10, 20, 50];

export default function IncidentHistoryScreen() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Categoria | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<Severidad | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIncident, setSelectedIncident] = useState<Incidente | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let data = [...MOCK_INCIDENTS];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.texto_original.toLowerCase().includes(q) ||
          i.entidad_geografica.toLowerCase().includes(q) ||
          i.sub_categoria.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') {
      data = data.filter((i) => i.categoria === categoryFilter);
    }
    if (severityFilter !== 'all') {
      data = data.filter((i) => i.severidad === severityFilter);
    }
    if (sortKey) {
      data.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  }, [search, categoryFilter, severityFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((i) => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-muted-foreground/40" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Historial de Incidentes</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filtered.length} registros encontrados · Actualizado en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-severity-critica/10 border border-severity-critica/30 rounded-lg text-severity-critica text-xs font-medium fade-in">
                  <span>{selectedIds.size} seleccionados</span>
                  <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                    <Trash2 size={12} />
                    Eliminar
                  </button>
                </div>
              )}
              {/* Backend: Export to CSV — connect to /api/incidents/export */}
              <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-150 active:scale-95">
                <Download size={14} />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          <IncidentTableStats incidents={filtered} />
        </div>

        {/* Filters */}
        <IncidentTableFilters
          search={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          categoryFilter={categoryFilter}
          onCategoryFilter={(v) => { setCategoryFilter(v); setPage(1); }}
          severityFilter={severityFilter}
          onSeverityFilter={(v) => { setSeverityFilter(v); setPage(1); }}
        />

        {/* Table */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              <tr className="border-b border-border">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-border bg-secondary accent-primary cursor-pointer"
                  />
                </th>
                {(
                  [
                    { key: 'id' as SortKey, label: 'ID', w: 'w-24' },
                    { key: 'texto_original' as SortKey, label: 'Texto Original', w: 'min-w-[220px]' },
                    { key: 'categoria' as SortKey, label: 'Categoría', w: 'w-32' },
                    { key: 'sub_categoria' as SortKey, label: 'Sub-categoría', w: 'w-40' },
                    { key: 'severidad' as SortKey, label: 'Severidad', w: 'w-28' },
                    { key: 'entidad_geografica' as SortKey, label: 'Entidad Geográfica', w: 'min-w-[180px]' },
                    { key: 'tipo_geometria' as SortKey, label: 'Geometría', w: 'w-24' },
                    { key: 'fuente' as SortKey, label: 'Fuente', w: 'w-28' },
                    { key: 'created_at' as SortKey, label: 'Fecha/Hora', w: 'w-36' },
                  ] as const
                ).map(({ key, label, w }) => (
                  <th
                    key={`th-${key}`}
                    className={`${w} px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none`}
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </div>
                  </th>
                ))}
                <th className="w-20 px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={32} className="text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No se encontraron incidentes
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        Ajusta los filtros o el término de búsqueda para ver resultados
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((inc, idx) => (
                  <tr
                    key={`row-${inc.id}`}
                    className={`border-b border-border/50 row-hover-highlight transition-colors cursor-pointer ${
                      selectedIncident?.id === inc.id ? 'bg-primary/5' : ''
                    } ${idx % 2 === 0 ? '' : 'bg-secondary/10'}`}
                    onClick={() =>
                      setSelectedIncident(
                        selectedIncident?.id === inc.id ? null : inc
                      )
                    }
                  >
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(inc.id)}
                        onChange={() => toggleSelect(inc.id)}
                        className="w-3.5 h-3.5 rounded border-border bg-secondary accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-mono-data text-muted-foreground">
                        {inc.id.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 max-w-[220px]">
                      <p
                        className="text-xs text-foreground truncate"
                        title={inc.texto_original}
                      >
                        {inc.texto_original}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <CategoryBadge categoria={inc.categoria} size="sm" />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-muted-foreground">
                        {inc.sub_categoria}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <SeverityBadge
                        severidad={inc.severidad}
                        size="sm"
                        pulse={inc.severidad === 'critica'}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} className="shrink-0 text-muted-foreground/50" />
                        <span className="truncate max-w-[160px]" title={inc.entidad_geografica}>
                          {inc.entidad_geografica}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <GeometryBadge tipo={inc.tipo_geometria} />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-mono-data text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                        {inc.fuente}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-mono-data text-muted-foreground">
                        <Clock size={10} />
                        {formatDate(inc.created_at)}
                      </div>
                    </td>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-all"
                          title="Ver detalle del incidente"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-severity-critica transition-all"
                          title="Eliminar incidente — esta acción no se puede deshacer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card/80 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Filas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {PAGE_SIZES.map((s) => (
                <option key={`ps-${s}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filtered.length)} de {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-mono-data transition-all ${
                    page === pageNum
                      ? 'bg-primary text-white font-semibold' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedIncident && (
        <IncidentDetailPanel
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}