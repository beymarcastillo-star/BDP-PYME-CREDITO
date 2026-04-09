// ============================================================
//  AuditoriaTable.jsx — Tabla de Logs de Auditoría
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

import { useState } from 'react';

// Configuración de badges por tipo de acción
const BADGE_CONFIG = {
  LOGIN:  { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', label: 'LOGIN'  },
  LOGOUT: { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE', label: 'LOGOUT' },
  INSERT: { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0', label: 'INSERT' },
  UPDATE: { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A', label: 'UPDATE' },
  DELETE: { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA', label: 'DELETE' },
  EXPORT: { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE', label: 'EXPORT' },
  VIEW:   { bg: '#F0F9FF', color: '#075985', border: '#BAE6FD', label: 'VIEW'   },
  ERROR:  { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3', label: 'ERROR'  },
};

const BadgeAccion = ({ accion }) => {
  const cfg = BADGE_CONFIG[accion] || BADGE_CONFIG.VIEW;
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '4px',
      padding:       '3px 10px',
      borderRadius:  '20px',
      fontSize:      '11px',
      fontWeight:    '600',
      letterSpacing: '0.04em',
      background:    cfg.bg,
      color:         cfg.color,
      border:        `1px solid ${cfg.border}`,
      whiteSpace:    'nowrap',
    }}>
      {cfg.label}
    </span>
  );
};

// Formato de fecha legible
const formatFecha = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-BO', {
    year:   'numeric', month:  '2-digit', day:    '2-digit',
    hour:   '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
};

// Hash truncado con tooltip
const HashCell = ({ hash }) => {
  const [hover, setHover] = useState(false);
  if (!hash) return <span style={{ color: '#94A3B8' }}>—</span>;
  return (
    <span
      style={{
        fontFamily:  "'JetBrains Mono', 'Roboto Mono', monospace",
        fontSize:    '11px',
        color:       hover ? '#7B2FBE' : '#64748B',
        cursor:      'pointer',
        transition:  'color 0.2s',
        letterSpacing: '0.02em',
      }}
      title={hash}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hash.substring(0, 12)}…
    </span>
  );
};

// ============================================================
//  Componente principal: AuditoriaTable
// ============================================================
const AuditoriaTable = ({ logs = [], total = 0, pagina = 1, paginas = 1, onCambiarPagina, cargando = false }) => {

  const styles = {
    wrapper: {
      background:   '#FFFFFF',
      borderRadius: '12px',
      border:       '1px solid #E2E8F0',
      overflow:     'hidden',
      boxShadow:    '0 1px 3px rgba(0,0,0,0.05)',
    },
    tableHeader: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '16px 24px',
      borderBottom:   '1px solid #E2E8F0',
      background:     '#FAFAFA',
    },
    titleRow: {
      display:    'flex',
      alignItems: 'center',
      gap:        '10px',
    },
    title: {
      fontSize:   '15px',
      fontWeight: '600',
      color:      '#1A1A2E',
      margin:     0,
    },
    badge: {
      background:   '#F0E6FF',
      color:        '#7B2FBE',
      border:       '1px solid #DDD6FE',
      borderRadius: '20px',
      padding:      '2px 10px',
      fontSize:     '12px',
      fontWeight:   '600',
    },
    wormBadge: {
      display:      'flex',
      alignItems:   'center',
      gap:          '6px',
      background:   '#DCFCE7',
      color:        '#15803D',
      border:       '1px solid #BBF7D0',
      borderRadius: '20px',
      padding:      '4px 12px',
      fontSize:     '12px',
      fontWeight:   '600',
    },
    dot: {
      width:        '7px',
      height:       '7px',
      borderRadius: '50%',
      background:   '#16A34A',
      animation:    'pulse-green 2s infinite',
    },
    table: {
      width:          '100%',
      borderCollapse: 'collapse',
      fontSize:       '13px',
    },
    th: {
      padding:       '12px 16px',
      textAlign:     'left',
      fontSize:      '11px',
      fontWeight:    '600',
      color:         '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      background:    '#F8FAFC',
      borderBottom:  '1px solid #E2E8F0',
      whiteSpace:    'nowrap',
    },
    tdMono: {
      fontFamily:    "'JetBrains Mono','Roboto Mono',monospace",
      fontSize:      '12px',
      color:         '#475569',
      padding:       '14px 16px',
      borderBottom:  '1px solid #F1F5F9',
      whiteSpace:    'nowrap',
    },
    td: {
      padding:      '14px 16px',
      color:        '#334155',
      borderBottom: '1px solid #F1F5F9',
    },
    tdFecha: {
      fontFamily:    "'JetBrains Mono','Roboto Mono',monospace",
      fontSize:      '12px',
      color:         '#475569',
      padding:       '14px 16px',
      borderBottom:  '1px solid #F1F5F9',
      whiteSpace:    'nowrap',
    },
    trHover: {
      transition: 'background 0.15s',
    },
    emptyState: {
      textAlign: 'center',
      padding:   '60px 20px',
      color:     '#94A3B8',
    },
    paginacion: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '14px 24px',
      borderTop:      '1px solid #E2E8F0',
      background:     '#FAFAFA',
    },
    btnPag: {
      padding:      '6px 14px',
      borderRadius: '8px',
      border:       '1px solid #E2E8F0',
      background:   '#FFFFFF',
      color:        '#334155',
      fontSize:     '13px',
      cursor:       'pointer',
      fontWeight:   '500',
      transition:   'all 0.15s',
    },
    btnPagActivo: {
      background: '#7B2FBE',
      color:      '#FFFFFF',
      border:     '1px solid #7B2FBE',
    },
  };

  if (cargando) {
    return (
      <div style={{ ...styles.wrapper, padding: '60px', textAlign: 'center' }}>
        <div style={{ color: '#7B2FBE', fontSize: '14px' }}>⏳ Cargando registros...</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Cabecera de la tabla */}
      <div style={styles.tableHeader}>
        <div style={styles.titleRow}>
          <h3 style={styles.title}>Registro de Eventos</h3>
          <span style={styles.badge}>{total.toLocaleString('es-BO')} registros</span>
        </div>
        <div style={styles.wormBadge}>
          <span style={styles.dot} />
          🔐 WORM Activo
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['#ID', 'Timestamp', 'Usuario', 'IP', 'Acción', 'Módulo', 'Descripción', 'Hash'].map(col => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} style={styles.emptyState}>
                  No se encontraron registros con los filtros aplicados.
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={log.id}
                  style={{
                    background:  i % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                    transition:  'background 0.15s',
                    cursor:      'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F0FF'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FAFBFC'}
                >
                  <td style={styles.tdMono}>{log.id}</td>
                  <td style={styles.tdFecha}>{formatFecha(log.fecha_hora)}</td>
                  <td style={{ ...styles.td, fontWeight: '500', color: '#1A1A2E' }}>
                    {log.usuario_nombre}
                  </td>
                  <td style={styles.tdMono}>{log.ip_origen || '—'}</td>
                  <td style={styles.td}><BadgeAccion accion={log.accion} /></td>
                  <td style={{ ...styles.td, color: '#7B2FBE', fontWeight: '500' }}>
                    {log.modulo}
                  </td>
                  <td style={{ ...styles.td, maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.descripcion}
                  </td>
                  <td style={styles.td}><HashCell hash={log.hash_integridad} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {paginas > 1 && (
        <div style={styles.paginacion}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>
            Página {pagina} de {paginas}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              style={styles.btnPag}
              disabled={pagina <= 1}
              onClick={() => onCambiarPagina(pagina - 1)}
            >
              ← Anterior
            </button>
            {Array.from({ length: Math.min(5, paginas) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  style={{ ...styles.btnPag, ...(p === pagina ? styles.btnPagActivo : {}) }}
                  onClick={() => onCambiarPagina(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              style={styles.btnPag}
              disabled={pagina >= paginas}
              onClick={() => onCambiarPagina(pagina + 1)}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AuditoriaTable;