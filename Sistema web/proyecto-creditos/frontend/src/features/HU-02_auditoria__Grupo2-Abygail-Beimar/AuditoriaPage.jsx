// ============================================================
//  AuditoriaPage.jsx — Página Principal de Auditoría WORM
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import AuditoriaTable from './AuditoriaTable';
import { fetchLogs, fetchResumen, exportarCSV } from './auditoria.api';

// ── Paleta de colores ────────────────────────────────────────
const C = {
  morado:         '#7B2FBE',
  moradoOscuro:   '#5B21B6',
  magenta:        '#C11262',
  azulMedianoche: '#1A1A2E',
  fondo:          '#F8FAFC',
  superficie:     '#FFFFFF',
  bordeGris:      '#E2E8F0',
  textoSecundario:'#64748B',
  textoPizarra:   '#334155',
};

// ── Datos de demostración ────────────────────────────────────
const DATOS_DEMO = [
  { id: 1,  fecha_hora: new Date().toISOString(), usuario_nombre: 'admin.garcia',    ip_origen: '192.168.1.10', accion: 'LOGIN',  modulo: 'Autenticación',    descripcion: 'Inicio de sesión exitoso',                     hash_integridad: 'a3f8c2d1e4b5f6a7b8c9d0e1f2a3b4c5' },
  { id: 2,  fecha_hora: new Date().toISOString(), usuario_nombre: 'analista.perez',  ip_origen: '192.168.1.11', accion: 'VIEW',   modulo: 'Créditos PYME',    descripcion: 'Consulta listado de solicitudes',               hash_integridad: 'b4c9d2e5f6a7b8c9d0e1f2a3b4c5d6e7' },
  { id: 3,  fecha_hora: new Date().toISOString(), usuario_nombre: 'analista.perez',  ip_origen: '192.168.1.11', accion: 'INSERT', modulo: 'Créditos PYME',    descripcion: 'Nueva solicitud crédito #CR-2024-001',          hash_integridad: 'c5d0e3f6a7b8c9d0e1f2a3b4c5d6e7f8' },
  { id: 4,  fecha_hora: new Date().toISOString(), usuario_nombre: 'gerente.lopez',   ip_origen: '192.168.1.12', accion: 'UPDATE', modulo: 'Hato Ganadero',    descripcion: 'Actualización valoración ganado #HG-045',       hash_integridad: 'd6e1f4a7b8c9d0e1f2a3b4c5d6e7f8a9' },
  { id: 5,  fecha_hora: new Date().toISOString(), usuario_nombre: 'admin.garcia',    ip_origen: '192.168.1.10', accion: 'EXPORT', modulo: 'Reportes',         descripcion: 'Exportación reporte mensual PDF',               hash_integridad: 'e7f2a5b8c9d0e1f2a3b4c5d6e7f8a9b0' },
  { id: 6,  fecha_hora: new Date().toISOString(), usuario_nombre: 'auditor.lopez',   ip_origen: '192.168.1.15', accion: 'VIEW',   modulo: 'Auditoría',        descripcion: 'Consulta log de auditoría',                     hash_integridad: 'f8a3b6c9d0e1f2a3b4c5d6e7f8a9b0c1' },
  { id: 7,  fecha_hora: new Date().toISOString(), usuario_nombre: 'analista.rios',   ip_origen: '192.168.1.13', accion: 'DELETE', modulo: 'Documentos',       descripcion: 'Intento eliminación doc #DOC-089 — BLOQUEADO',  hash_integridad: 'a9b4c7d0e1f2a3b4c5d6e7f8a9b0c1d2' },
  { id: 8,  fecha_hora: new Date().toISOString(), usuario_nombre: 'sistema',         ip_origen: '127.0.0.1',    accion: 'ERROR',  modulo: 'CORE Bancario',    descripcion: 'Timeout conexión CORE bancario',                hash_integridad: 'b0c5d8e1f2a3b4c5d6e7f8a9b0c1d2e3' },
  { id: 9,  fecha_hora: new Date().toISOString(), usuario_nombre: 'gerente.lopez',   ip_origen: '192.168.1.12', accion: 'LOGIN',  modulo: 'Autenticación',    descripcion: 'Inicio de sesión exitoso',                     hash_integridad: 'c1d6e9f2a3b4c5d6e7f8a9b0c1d2e3f4' },
  { id: 10, fecha_hora: new Date().toISOString(), usuario_nombre: 'analista.mamani', ip_origen: '192.168.1.14', accion: 'INSERT', modulo: 'Simulación Agríc.', descripcion: 'Nueva simulación agrícola campaña 2024',       hash_integridad: 'd2e7f0a3b4c5d6e7f8a9b0c1d2e3f4a5' },
];

const RESUMEN_DEMO = {
  total_hoy:         10,
  usuarios_activos:  5,
  acciones_criticas: 2,
  ultimo_registro:   new Date().toISOString(),
};

// ── Tarjetas de resumen ──────────────────────────────────────
const TARJETAS = [
  { key: 'total_hoy',         label: 'REGISTROS HOY',     icono: '👁',  color: C.morado,  bgIcon: 'rgba(123,47,190,0.1)' },
  { key: 'usuarios_activos',  label: 'USUARIOS ACTIVOS',  icono: '👥',  color: '#0369A1', bgIcon: 'rgba(3,105,161,0.1)' },
  { key: 'acciones_criticas', label: 'ACCIONES CRÍTICAS', icono: '⚡',  color: C.magenta, bgIcon: 'rgba(193,18,98,0.1)', alerta: true },
  { key: 'ultimo_registro',   label: 'ÚLTIMO REGISTRO',   icono: '🕐',  color: '#059669', bgIcon: 'rgba(5,150,105,0.1)', esFecha: true },
];

const formatTiempoRelativo = (iso) => {
  if (!iso) return '—';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
  return `hace ${Math.floor(diff / 3600)}h`;
};

// ── Componente Tarjeta ───────────────────────────────────────
const TarjetaResumen = ({ cfg, valor, cargando }) => {
  const [hover, setHover] = useState(false);
  const display = cfg.esFecha
    ? formatTiempoRelativo(valor)
    : (parseInt(valor) || 0).toLocaleString('es-BO');

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:    'rgba(255,255,255,0.75)',
        backdropFilter:'blur(10px)',
        borderRadius:  '12px',
        border:        `1px solid ${hover ? cfg.color + '40' : C.bordeGris}`,
        padding:       '20px 24px',
        transition:    'all 0.2s ease',
        boxShadow:     hover ? `0 8px 24px ${cfg.color}20` : '0 1px 3px rgba(0,0,0,0.06)',
        cursor:        'default',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg, ${C.morado}, ${C.magenta})`, borderRadius:'12px 12px 0 0' }} />
      <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'38px', height:'38px', borderRadius:'10px', background:cfg.bgIcon, fontSize:'18px', marginBottom:'14px' }}>
        {cfg.icono}
      </div>
      <div style={{ fontSize:'11px', fontWeight:'600', color:C.textoSecundario, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'6px' }}>
        {cfg.label}
      </div>
      <div style={{ fontSize:'32px', fontWeight:'700', color: cfg.alerta && parseInt(valor) > 0 ? C.magenta : C.azulMedianoche, lineHeight:'1' }}>
        {cargando ? '…' : display}
      </div>
      {!cfg.esFecha && !cargando && (
        <div style={{ marginTop:'8px', fontSize:'12px', color:'#10B981', fontWeight:'500' }}>↑ en tiempo real</div>
      )}
    </div>
  );
};

// ============================================================
//  Página Principal
// ============================================================
const AuditoriaPage = () => {
  const [logs,         setLogs        ] = useState([]);
  const [resumen,      setResumen     ] = useState({});
  const [cargando,     setCargando    ] = useState(false);
  const [cargandoRes,  setCargandoRes ] = useState(true);
  const [error,        setError       ] = useState(null);
  const [esDemo,       setEsDemo      ] = useState(false);
  const [pagina,       setPagina      ] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total,        setTotal       ] = useState(0);
  const [exportando,   setExportando  ] = useState(false);

  const [filtros,     setFiltros    ] = useState({ fecha_desde:'', fecha_hasta:'', accion:'', usuario_id:'' });
  const [filtrosTemp, setFiltrosTemp] = useState({ fecha_desde:'', fecha_hasta:'', accion:'', usuario_id:'' });

  const cargarResumen = useCallback(async () => {
    try {
      setCargandoRes(true);
      const data = await fetchResumen();
      setResumen(data.resumen || {});
      setEsDemo(false);
    } catch {
      setResumen(RESUMEN_DEMO);
      setEsDemo(true);
    } finally {
      setCargandoRes(false);
    }
  }, []);

  const cargarLogs = useCallback(async (filtrosActivos, pag = 1) => {
    try {
      setCargando(true);
      setError(null);
      const data = await fetchLogs({ ...filtrosActivos, pagina: pag, por_pagina: 20 });
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setTotalPaginas(data.paginas || 1);
      setPagina(pag);
      setEsDemo(false);
    } catch {
      setLogs(DATOS_DEMO);
      setTotal(DATOS_DEMO.length);
      setTotalPaginas(1);
      setPagina(1);
      setEsDemo(true);
      setError(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
    cargarLogs(filtros, 1);
    const interval = setInterval(() => {
      cargarResumen();
      cargarLogs(filtros, pagina);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros({ ...filtrosTemp });
    cargarLogs(filtrosTemp, 1);
  };

  const handleLimpiar = () => {
    const vacio = { fecha_desde:'', fecha_hasta:'', accion:'', usuario_id:'' };
    setFiltros(vacio);
    setFiltrosTemp(vacio);
    cargarLogs(vacio, 1);
  };

  const handleExportar = async () => {
    setExportando(true);
    try { await exportarCSV(filtros); }
    catch { alert('Exportación no disponible sin conexión al servidor.'); }
    finally { setExportando(false); }
  };

  const hoy = new Date().toLocaleDateString('es-BO', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div style={{ minHeight:'100vh', background:C.fondo, fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ position:'sticky', top:0, zIndex:100, background:C.superficie, borderBottom:`1px solid ${C.bordeGris}`, padding:'0 32px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>

        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <span style={{ fontSize:'18px', fontWeight:'700', color:C.azulMedianoche }}>
            🏦 <span style={{ color:C.morado }}>BDP</span> S.A.M.
          </span>
          <div style={{ width:'1px', height:'28px', background:C.bordeGris }} />
          {/* Breadcrumb */}
          <nav style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
            <span style={{ color:C.textoSecundario, cursor:'pointer', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = C.morado}
              onMouseLeave={e => e.target.style.color = C.textoSecundario}>
              Sistema
            </span>
            <span style={{ color:C.bordeGris, fontSize:'16px' }}>›</span>
            <span style={{ color:C.textoPizarra, cursor:'pointer', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = C.morado}
              onMouseLeave={e => e.target.style.color = C.textoPizarra}>
              Administración
            </span>
            <span style={{ color:C.bordeGris, fontSize:'16px' }}>›</span>
            <span style={{ color:C.morado, fontWeight:'600' }}>Auditoría</span>
          </nav>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <span style={{ fontSize:'12px', color:C.textoSecundario }}>📅 {hoy}</span>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'#DCFCE7', color:'#15803D', border:'1px solid #BBF7D0', borderRadius:'20px', padding:'5px 14px', fontSize:'12px', fontWeight:'600' }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#16A34A', animation:'pulse-worm 2s infinite', display:'inline-block' }} />
            🔐 WORM Activo
          </div>
          <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:C.morado, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700' }}>AL</div>
          <span style={{ fontSize:'13px', color:C.textoSecundario }}>auditor.lopez</span>
        </div>
      </header>

      <main style={{ maxWidth:'1280px', margin:'0 auto', padding:'32px 32px' }}>

        {/* ── TÍTULO ── */}
        <div style={{ marginBottom:'24px' }}>
          <h1 style={{ fontSize:'22px', fontWeight:'700', color:C.azulMedianoche, margin:'0 0 4px 0' }}>Registro de Auditoría</h1>
          <p style={{ fontSize:'13px', color:C.textoSecundario, margin:0 }}>
            Monitoreo de acciones del sistema · Protección WORM activa · Todos los registros son inmutables
          </p>
        </div>

        {/* ── TARJETAS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px', marginBottom:'28px' }}>
          {TARJETAS.map(cfg => (
            <TarjetaResumen key={cfg.key} cfg={cfg} valor={resumen[cfg.key]} cargando={cargandoRes} />
          ))}
        </div>

        {/* ── FILTROS ── */}
        <div style={{ background:`linear-gradient(135deg, #F8FAFC, rgba(123,47,190,0.02))`, borderBottom:`1px solid ${C.bordeGris}`, padding:'20px 0', marginBottom:'24px' }}>
          <form onSubmit={handleBuscar} style={{ display:'flex', alignItems:'flex-end', gap:'14px', flexWrap:'wrap' }}>
            {[
              { label:'📅 Desde', key:'fecha_desde', type:'date' },
              { label:'📅 Hasta', key:'fecha_hasta', type:'date' },
            ].map(f => (
              <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:'5px', flex:'1', minWidth:'160px' }}>
                <label style={{ fontSize:'11px', fontWeight:'600', color:C.textoSecundario, textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</label>
                <input type={f.type} style={{ padding:'9px 12px', borderRadius:'8px', border:`1px solid #D1D5DB`, background:C.superficie, color:C.azulMedianoche, fontSize:'13px', outline:'none', fontFamily:'inherit' }}
                  value={filtrosTemp[f.key]}
                  onChange={e => setFiltrosTemp(p => ({ ...p, [f.key]: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = C.morado; e.target.style.boxShadow = `0 0 0 3px ${C.morado}18`; }}
                  onBlur={e  => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }} />
              </div>
            ))}

            <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:'1', minWidth:'160px' }}>
              <label style={{ fontSize:'11px', fontWeight:'600', color:C.textoSecundario, textTransform:'uppercase', letterSpacing:'0.06em' }}>⚡ Tipo de acción</label>
              <select style={{ padding:'9px 12px', borderRadius:'8px', border:`1px solid #D1D5DB`, background:C.superficie, color:C.azulMedianoche, fontSize:'13px', outline:'none', fontFamily:'inherit' }}
                value={filtrosTemp.accion}
                onChange={e => setFiltrosTemp(p => ({ ...p, accion: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = C.morado; e.target.style.boxShadow = `0 0 0 3px ${C.morado}18`; }}
                onBlur={e  => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}>
                <option value="">Todas las acciones</option>
                {['LOGIN','LOGOUT','INSERT','UPDATE','DELETE','EXPORT','VIEW','ERROR'].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:'1', minWidth:'160px' }}>
              <label style={{ fontSize:'11px', fontWeight:'600', color:C.textoSecundario, textTransform:'uppercase', letterSpacing:'0.06em' }}>👤 Usuario</label>
              <input type="text" placeholder="Buscar usuario..." style={{ padding:'9px 12px', borderRadius:'8px', border:`1px solid #D1D5DB`, background:C.superficie, color:C.azulMedianoche, fontSize:'13px', outline:'none', fontFamily:'inherit' }}
                value={filtrosTemp.usuario_id}
                onChange={e => setFiltrosTemp(p => ({ ...p, usuario_id: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = C.morado; e.target.style.boxShadow = `0 0 0 3px ${C.morado}18`; }}
                onBlur={e  => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }} />
            </div>

            <button type="submit" disabled={cargando}
              style={{ padding:'10px 24px', borderRadius:'8px', border:'none', background:C.morado, color:'#fff', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', boxShadow:`0 2px 8px ${C.morado}40`, whiteSpace:'nowrap', alignSelf:'flex-end' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.moradoOscuro; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.morado; e.currentTarget.style.transform = 'none'; }}>
              {cargando ? '⏳ Buscando...' : '🔍 Buscar'}
            </button>

            <button type="button" onClick={handleLimpiar}
              style={{ padding:'10px 18px', borderRadius:'8px', border:`1px solid #CBD5E1`, background:'transparent', color:C.textoSecundario, fontSize:'13px', fontWeight:'500', cursor:'pointer', whiteSpace:'nowrap', alignSelf:'flex-end' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.magenta; e.currentTarget.style.color = C.magenta; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = C.textoSecundario; }}>
              ✕ Limpiar
            </button>

            <button type="button" disabled={exportando} onClick={handleExportar}
              style={{ padding:'10px 18px', borderRadius:'8px', border:`1px solid ${C.bordeGris}`, background:C.superficie, color:C.textoPizarra, fontSize:'13px', fontWeight:'500', cursor:'pointer', whiteSpace:'nowrap', alignSelf:'flex-end' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.morado; e.currentTarget.style.color = C.morado; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bordeGris; e.currentTarget.style.color = C.textoPizarra; }}>
              {exportando ? '⏳ Exportando...' : '⬇ Exportar CSV'}
            </button>
          </form>
        </div>

        {/* ── AVISO DEMO ── */}
        {esDemo && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'#FFF8E1', border:'1px solid #FFD54F', borderRadius:'10px', padding:'12px 20px', color:'#92400E', fontSize:'13px', marginBottom:'20px' }}>
            <span style={{ fontSize:'18px' }}>🔌</span>
            <span><strong>Modo demostración</strong> — Backend no disponible. Se muestran datos de ejemplo para visualización.</span>
          </div>
        )}

        {error && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'16px 20px', color:'#991B1B', fontSize:'14px', marginBottom:'20px' }}>
            ⚠️ {error}
          </div>
        )}

        <AuditoriaTable logs={logs} total={total} pagina={pagina} paginas={totalPaginas} cargando={cargando} onCambiarPagina={(p) => cargarLogs(filtros, p)} />

      </main>

      <style>{`
        @keyframes pulse-worm {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(22,163,74,0); }
        }
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
      `}</style>
    </div>
  );
};

export default AuditoriaPage;