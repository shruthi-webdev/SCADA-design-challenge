import React, { useState } from 'react';
import './TableView.css';

/* ─── Device Data ─── */
interface DeviceRow {
    id: string;
    system: 'Water' | 'AC';
    type: string;
    name: string;
    status: 'online' | 'warning' | 'offline' | 'idle';
    bold?: boolean;
}

const deviceData: DeviceRow[] = [
    { id: 'BTA2', system: 'Water', type: 'heat-exchanger', name: 'Heat exchange tank', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'valve-3way', name: 'Three way valve', status: 'warning' },
    { id: 'BTA2', system: 'Water', type: 'valve-2way', name: 'Two way valve', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'heat-exchanger', name: 'Heat exchange tank', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'heat-exchanger', name: 'Heat exchange tank', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'separator', name: 'Hydraulic separator', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'heat-exchanger', name: 'Heat exchange tank', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'pump', name: 'Pump', status: 'online', bold: true },
    { id: 'BTA2', system: 'Water', type: 'pump', name: 'Heat pump', status: 'online' },
    { id: 'BTA2', system: 'Water', type: 'pump-system', name: 'Primary pump system', status: 'online', bold: true },
    { id: 'BTA2', system: 'Water', type: 'pump-system', name: 'Secondary pump system', status: 'warning', bold: true },
    { id: 'BTA2', system: 'AC', type: 'filter', name: 'Filter', status: 'online' },
    { id: 'BTA2', system: 'AC', type: 'fan', name: 'Fan', status: 'warning' },
    { id: 'BTA2', system: 'AC', type: 'switch', name: 'Switch', status: 'idle' },
    { id: 'BTA2', system: 'AC', type: 'wheel', name: 'Enthalpy wheel', status: 'online' },
    { id: 'BTA2', system: 'AC', type: 'filter', name: 'Filter', status: 'online' },
    { id: 'BTA2', system: 'AC', type: 'fan', name: 'Fan', status: 'offline' },
    { id: 'BTA2', system: 'AC', type: 'switch', name: 'Switch', status: 'online' },
    { id: 'BTA2', system: 'AC', type: 'switch', name: 'Switch', status: 'online' },
];

/* ─── Device type icons ─── */
const typeIcons: Record<string, React.ReactNode> = {
    'heat-exchanger': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>,
    'valve-3way': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
    'valve-2way': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" /></svg>,
    'separator': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>,
    'pump': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>,
    'pump-system': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z" /></svg>,
    'filter': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>,
    'fan': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 6.5 23 6.5s-2.5 5.5-5.5 5.5S12 12 12 12zm-6.5 0C2.5 12 0 17.5 0 17.5s5.5 0 5.5 0S8.5 12 5.5 12zM12 12c3 0 5.5-2.5 5.5-5.5S17.5 1 17.5 1s-5.5 2.5-5.5 5.5S12 12 12 12zm0 0c-3 0-5.5 2.5-5.5 5.5S6.5 23 6.5 23s5.5-2.5 5.5-5.5S12 12 12 12z" /></svg>,
    'switch': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" /></svg>,
    'wheel': <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>,
};

/* ─── Chevron for checkmark ─── */
const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
);

/* ═══════════════════════════════════════════════════════
   Table View Component
   ═══════════════════════════════════════════════════════ */

const TableView: React.FC = () => {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([7, 9, 10]));
    const [activeStructure, setActiveStructure] = useState<'table'>('table');
    const [filter, setFilter] = useState<'all' | 'Water' | 'AC'>('all');
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'rooms' | 'devices'>('rooms');

    const filteredDevices = deviceData.filter(d => {
        if (filter !== 'all' && d.system !== filter) return false;
        if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const toggleRow = (idx: number) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedRows.size === filteredDevices.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredDevices.map((_, i) => i)));
        }
    };

    return (
        <div className="table-view">
            {/* ── Structure Panel ── */}
            <div className="table-structure-panel">
                <div className="table-structure-title">Structure</div>
                <button className="table-structure-item" onClick={() => { }}>
                    <span className="table-structure-number">1</span>
                    Filter and search
                </button>
                <button className={`table-structure-item ${activeStructure === 'table' ? 'active' : ''}`} onClick={() => setActiveStructure('table')}>
                    <span className="table-structure-number">2</span>
                    Table
                </button>
                <button className="table-structure-item" onClick={() => { }}>
                    <span className="table-structure-number">3</span>
                    Content area
                </button>
            </div>

            {/* ── Main Table ── */}
            <div className="table-main">
                <div className="table-toolbar">
                    <input
                        className="table-search-input"
                        type="text"
                        placeholder="Placeholder"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="table-toolbar-btn" title="Filter">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>
                    </button>

                    <div className="table-filter-pills">
                        <button className={`table-filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                            All
                        </button>
                        <button className={`table-filter-pill ${filter === 'Water' ? 'active' : ''}`} onClick={() => setFilter('Water')}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" /></svg>
                            Water
                        </button>
                        <button className={`table-filter-pill ${filter === 'AC' ? 'active' : ''}`} onClick={() => setFilter('AC')}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z" /></svg>
                            AC
                        </button>
                    </div>

                    <div className="table-tab-toggle">
                        <button className={`table-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Rooms</button>
                        <button className={`table-tab-btn ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => setActiveTab('devices')}>Devices</button>
                    </div>
                </div>

                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>
                                    <button className={`table-checkbox ${selectedRows.size === filteredDevices.length ? 'checked' : ''}`} onClick={toggleAll}>
                                        <CheckIcon />
                                    </button>
                                </th>
                                <th>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-7v4h4l-5 7z" /></svg>
                                    ID <span className="sort-icon">▼</span>
                                </th>
                                <th>System <span className="sort-icon">▼</span></th>
                                <th style={{ width: '40%' }}>Devices & System Regions</th>
                                <th style={{ width: 60 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDevices.map((device, idx) => (
                                <tr key={idx} className={selectedRows.has(idx) ? 'selected' : ''}>
                                    <td>
                                        <button className={`table-checkbox ${selectedRows.has(idx) ? 'checked' : ''}`} onClick={() => toggleRow(idx)}>
                                            <CheckIcon />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="table-id-cell">
                                            <span className="table-id-hash">#</span> {device.id}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`system-badge ${device.system.toLowerCase()}`}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                {device.system === 'Water'
                                                    ? <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                                                    : <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z" />
                                                }
                                            </svg>
                                            {device.system}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="device-name-cell">
                                            <span className="device-type-icon">{typeIcons[device.type] || null}</span>
                                            <span className={`device-name-text ${device.bold ? 'bold' : ''}`}>{device.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-dot ${device.status}`} title={device.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Detail Panel ── */}
            <div className="table-detail-panel">
                {/* Primary Pump System */}
                <div className="table-detail-section">
                    <div className="table-detail-header">
                        <h3>Primary Pump System</h3>
                        <button className="table-detail-close" title="Close">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        </button>
                    </div>

                    <div className="detail-pump-row">
                        <span className="detail-label">Level</span>
                        <span className="detail-value-box">10<small style={{ fontSize: 10, marginLeft: 1 }}>%</small></span>
                        <div className="detail-bar"><div className="detail-bar-fill blue" style={{ width: '10%' }} /></div>
                    </div>

                    <div className="detail-pump-row">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value-box">10<small style={{ fontSize: 10, marginLeft: 1 }}>%</small></span>
                        <div className="detail-bar"><div className="detail-bar-fill blue" style={{ width: '10%' }} /></div>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--obc-text-secondary)', marginBottom: 8 }}>MODE</div>
                    <div className="detail-mode-group">
                        <button className="detail-mode-btn">Manual</button>
                        <button className="detail-mode-btn active">Auto</button>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="detail-stop-btn" style={{ flex: 1 }}>Standby</button>
                        <button className="detail-run-btn" style={{ flex: 1 }}>Run</button>
                    </div>
                </div>

                {/* Status Section */}
                <div className="table-detail-section">
                    <div className="table-detail-header">
                        <h3>Status</h3>
                        <button className="table-detail-close" title="Close">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        </button>
                    </div>

                    <div className="detail-mode-group">
                        <button className="detail-mode-btn">Off</button>
                        <button className="detail-mode-btn active">Manual</button>
                        <button className="detail-mode-btn">Auto</button>
                    </div>

                    <div className="detail-pump-row" style={{ fontSize: 11, color: 'var(--obc-text-secondary)' }}>
                        Pump state
                    </div>

                    <div className="detail-pump-row">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value-box">10<small style={{ fontSize: 10, marginLeft: 1 }}>%</small></span>
                        <div className="detail-bar"><div className="detail-bar-fill blue" style={{ width: '10%' }} /></div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <button className="detail-stop-btn" style={{ flex: 1 }}>Stop</button>
                        <button className="detail-run-btn" style={{ flex: 1 }}>Run</button>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--obc-text-secondary)', marginBottom: 8 }}>READOUTS</div>
                    <div className="detail-readouts">
                        <div className="detail-readout">
                            <div className="readout-label">Speed</div>
                            <div className="readout-value">16<span className="readout-unit">%</span></div>
                        </div>
                        <div className="detail-readout">
                            <div className="readout-label">Current</div>
                            <div className="readout-value">16<span className="readout-unit">A</span></div>
                        </div>
                        <div className="detail-readout">
                            <div className="readout-label">Power</div>
                            <div className="readout-value">16<span className="readout-unit">kW</span></div>
                        </div>
                    </div>
                </div>

                {/* Secondary Pump System */}
                <div className="table-detail-section">
                    <div className="table-detail-header">
                        <h3>Secondary Pump System</h3>
                        <button className="table-detail-close" title="Close">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        </button>
                    </div>

                    <div className="detail-pump-row">
                        <span className="detail-label">Level</span>
                        <span className="detail-value-box">10<small style={{ fontSize: 10, marginLeft: 1 }}>%</small></span>
                        <div className="detail-bar"><div className="detail-bar-fill green" style={{ width: '10%' }} /></div>
                    </div>

                    <div className="detail-pump-row">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value-box">10<small style={{ fontSize: 10, marginLeft: 1 }}>%</small></span>
                        <div className="detail-bar"><div className="detail-bar-fill green" style={{ width: '10%' }} /></div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="detail-stop-btn" style={{ flex: 1 }}>Stop</button>
                        <button className="detail-run-btn" style={{ flex: 1 }}>Run</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableView;
