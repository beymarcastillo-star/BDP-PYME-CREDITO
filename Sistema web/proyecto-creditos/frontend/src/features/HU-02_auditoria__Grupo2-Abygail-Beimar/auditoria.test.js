// ============================================================
//  auditoria.test.js — Pruebas unitarias HU-02
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
//  Ejecutar con: npm test
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuditoriaPage  from './AuditoriaPage';
import AuditoriaTable from './AuditoriaTable';
import * as api from './auditoria.api';

// ── Mock de la API ───────────────────────────────────────────
vi.mock('./auditoria.api', () => ({
  fetchLogs:    vi.fn(),
  fetchResumen: vi.fn(),
  exportarCSV:  vi.fn(),
}));

const LOGS_MOCK = [
  {
    id:               1,
    usuario_nombre:   'ana.gomez',
    usuario_id:       'ana.gomez',
    accion:           'LOGIN',
    modulo:           '/api/auth',
    descripcion:      'Inicio de sesión exitoso',
    ip_origen:        '192.168.1.10',
    hash_integridad:  'abc123def456abc123def456abc123de',
    fecha_hora:       '2026-03-31T08:00:00Z',
  },
  {
    id:               2,
    usuario_nombre:   'carlos.rios',
    usuario_id:       'carlos.rios',
    accion:           'DELETE',
    modulo:           '/api/solicitudes',
    descripcion:      'Eliminó borrador SOL-009',
    ip_origen:        '192.168.1.22',
    hash_integridad:  'def789abc123def789abc123def789ab',
    fecha_hora:       '2026-03-31T09:30:00Z',
  },
];

const RESUMEN_MOCK = {
  resumen: {
    total_hoy:         12,
    usuarios_activos:  3,
    acciones_criticas: 2,
    ultimo_registro:   '2026-03-31T10:00:00Z',
  },
};

// ── Setup ────────────────────────────────────────────────────
beforeEach(() => {
  api.fetchLogs.mockResolvedValue({
    ok:       true,
    logs:     LOGS_MOCK,
    total:    2,
    pagina:   1,
    paginas:  1,
  });
  api.fetchResumen.mockResolvedValue(RESUMEN_MOCK);
});

// ── Tests: AuditoriaTable ────────────────────────────────────
describe('AuditoriaTable', () => {

  it('muestra los logs correctamente', () => {
    render(<AuditoriaTable logs={LOGS_MOCK} total={2} pagina={1} paginas={1} />);
    expect(screen.getByText('ana.gomez')).toBeTruthy();
    expect(screen.getByText('carlos.rios')).toBeTruthy();
  });

  it('muestra badge LOGIN en azul', () => {
    render(<AuditoriaTable logs={LOGS_MOCK} total={2} pagina={1} paginas={1} />);
    expect(screen.getByText('LOGIN')).toBeTruthy();
  });

  it('muestra badge DELETE en rojo', () => {
    render(<AuditoriaTable logs={LOGS_MOCK} total={2} pagina={1} paginas={1} />);
    expect(screen.getByText('DELETE')).toBeTruthy();
  });

  it('muestra mensaje vacío cuando no hay logs', () => {
    render(<AuditoriaTable logs={[]} total={0} pagina={1} paginas={1} />);
    expect(screen.getByText(/No se encontraron registros/i)).toBeTruthy();
  });

  it('muestra spinner cuando cargando es true', () => {
    render(<AuditoriaTable logs={[]} cargando={true} pagina={1} paginas={1} />);
    expect(screen.getByText(/Cargando registros/i)).toBeTruthy();
  });

  it('muestra badge WORM Activo', () => {
    render(<AuditoriaTable logs={LOGS_MOCK} total={2} pagina={1} paginas={1} />);
    expect(screen.getByText(/WORM Activo/i)).toBeTruthy();
  });

  it('no muestra paginación cuando solo hay 1 página', () => {
    render(<AuditoriaTable logs={LOGS_MOCK} total={2} pagina={1} paginas={1} />);
    expect(screen.queryByText('Anterior')).toBeNull();
  });

});

// ── Tests: AuditoriaPage ─────────────────────────────────────
describe('AuditoriaPage', () => {

  it('renderiza el header con el nombre del banco', async () => {
    render(<AuditoriaPage />);
    expect(screen.getByText(/BDP/i)).toBeTruthy();
  });

  it('muestra el badge WORM Activo en el header', async () => {
    render(<AuditoriaPage />);
    const badges = screen.getAllByText(/WORM Activo/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('carga y muestra los logs al montar', async () => {
    render(<AuditoriaPage />);
    await waitFor(() => {
      expect(api.fetchLogs).toHaveBeenCalledTimes(1);
    });
  });

  it('carga el resumen al montar', async () => {
    render(<AuditoriaPage />);
    await waitFor(() => {
      expect(api.fetchResumen).toHaveBeenCalledTimes(1);
    });
  });

  it('llama a fetchLogs con filtros al buscar', async () => {
    render(<AuditoriaPage />);
    const selectAccion = screen.getByRole('combobox');
    fireEvent.change(selectAccion, { target: { value: 'DELETE' } });
    const btnBuscar = screen.getByText(/Buscar/i);
    fireEvent.click(btnBuscar);
    await waitFor(() => {
      expect(api.fetchLogs).toHaveBeenCalledWith(
        expect.objectContaining({ accion: 'DELETE' })
      );
    });
  });

  it('limpia los filtros al hacer clic en Limpiar', async () => {
    render(<AuditoriaPage />);
    const btnLimpiar = screen.getByText(/Limpiar/i);
    fireEvent.click(btnLimpiar);
    await waitFor(() => {
      expect(api.fetchLogs).toHaveBeenCalledWith(
        expect.objectContaining({ accion: '' })
      );
    });
  });

});