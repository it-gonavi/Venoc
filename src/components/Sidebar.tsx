'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, History, FileText, ChevronLeft, ChevronRight, Activity, AlertTriangle, Zap,  } from 'lucide-react';
import AppLogo from './ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


const navGroups = [
  {
    label: 'OPERACIONES',
    items: [
      {
        href: '/',
        icon: Map,
        label: 'Mapa NOC',
        badge: null,
        badgeVariant: '',
      },
      {
        href: '/incident-history',
        icon: History,
        label: 'Historial',
        badge: null,
        badgeVariant: '',
      },
      {
        href: '/report-submission',
        icon: FileText,
        label: 'Reportar',
        badge: null,
        badgeVariant: '',
      },
    ],
  },
  {
    label: 'MONITOREO',
    items: [
      {
        href: '#',
        icon: Activity,
        label: 'Estado del Sistema',
        badge: 'LIVE',
        badgeVariant: 'live',
      },
      {
        href: '#',
        icon: AlertTriangle,
        label: 'Alertas Activas',
        badge: '7',
        badgeVariant: 'alert',
      },
      {
        href: '#',
        icon: Zap,
        label: 'Feed de Fuentes',
        badge: null,
        badgeVariant: '',
      },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className="relative flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out z-20 shrink-0"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-semibold text-sm text-foreground truncate tracking-wide">
              GeoNOC
            </span>
          )}
        </div>
      </div>

      {/* Live indicator */}
      {!collapsed && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-baja opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-baja" />
          </span>
          <span className="text-xs text-muted-foreground font-mono-data">
            Sistema Activo
          </span>
          <span className="ml-auto text-xs font-mono-data text-primary">
            VET
          </span>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {navGroups?.map((group) => (
          <div key={`group-${group?.label}`} className="mb-4">
            {!collapsed && (
              <p className="px-4 pb-1 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                {group?.label}
              </p>
            )}
            {group?.items?.map((item) => {
              const Icon = item?.icon;
              const isActive =
                item?.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item?.href) && item?.href !== '#';

              return (
                <div key={`nav-${item?.href}-${item?.label}`} className="relative group px-2 mb-0.5">
                  <Link
                    href={item?.href}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate flex-1">
                        {item?.label}
                      </span>
                    )}
                    {!collapsed && item?.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono-data ${
                          item?.badgeVariant === 'live' ?'bg-severity-baja/20 text-severity-baja' :'bg-severity-critica/20 text-severity-critica'
                        }`}
                      >
                        {item?.badge}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                      <div className="bg-secondary border border-border text-foreground text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                        {item?.label}
                        {item?.badge && (
                          <span className="ml-1 text-severity-critica">
                            ({item?.badge})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <div className="flex items-center gap-2 w-full">
              <ChevronLeft size={16} />
              <span className="text-xs">Colapsar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}