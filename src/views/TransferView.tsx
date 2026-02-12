import React, { useState, useCallback } from 'react';
import './TransferView.css';
import ComponentDetailPopup from '../components/ComponentDetailPopup';
import type { ComponentDetail, PumpMode } from '../components/ComponentDetailPopup';

// Import OpenBridge automation web components
import '@oicl/openbridge-webcomponents/dist/automation/horizontal-line/horizontal-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/vertical-line/vertical-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/corner-line/corner-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/direction-line/direction-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/end-point-line/end-point-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/three-way-line/three-way-line.js';

// ──────── Reusable Pipe Components ────────

const HPipe: React.FC<{ len?: number }> = ({ len = 1 }) => (
    <obc-horizontal-line medium="water" lineType="fluid" length={len}
        style={{ display: 'inline-block', width: `${len * 24}px`, height: '24px', flexShrink: 0 }} />
);

const VPipe: React.FC<{ len?: number }> = ({ len = 1 }) => (
    <obc-vertical-line medium="water" lineType="fluid" length={len}
        style={{ display: 'inline-block', width: '24px', height: `${len * 24}px`, flexShrink: 0 }} />
);

const DirArrow: React.FC = () => (
    <obc-direction-line medium="water" lineType="fluid"
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

const TJunction: React.FC<{ dir?: string }> = ({ dir = 'bottom' }) => (
    <obc-three-way-line medium="water" lineType="fluid" direction={dir}
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

const Corner: React.FC<{ dir: string }> = ({ dir }) => (
    <obc-corner-line medium="water" lineType="fluid" direction={dir}
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

// ──────── SCADA Component Icons ────────

// Valve (bowtie shape with stem)
const TValve: React.FC<{
    label?: string;
    isOpen?: boolean;
    onClick?: () => void;
}> = ({ label, isOpen = true, onClick }) => (
    <div className="t-valve" onClick={onClick} title={label || 'Valve'}>
        <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="4,6 4,18 12,12" fill={isOpen ? '#333' : '#ccc'} />
            <polygon points="20,6 20,18 12,12" fill={isOpen ? '#333' : '#ccc'} />
            <line x1="12" y1="2" x2="12" y2="6" stroke="#333" strokeWidth="2" />
        </svg>
        {label && <span className="t-valve-label">{label}</span>}
    </div>
);

// Pump (triangle pointing right)
const TPump: React.FC<{
    label?: string;
    isOn?: boolean;
    onClick?: () => void;
}> = ({ label, isOn = false, onClick }) => (
    <div className="t-pump" onClick={onClick} title={label || 'Pump'}>
        <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="4,20 12,4 20,20" fill="none" stroke={isOn ? '#0066cc' : '#333'} strokeWidth="1.5" />
            {isOn && <circle cx="12" cy="14" r="3" fill="#0066cc" />}
        </svg>
        {label && <span className="t-pump-label">{label}</span>}
    </div>
);

// Butterfly valve (circle with line)
const ButterflyValve: React.FC<{
    label?: string;
    isOpen?: boolean;
    onClick?: () => void;
}> = ({ label, isOpen = true, onClick }) => (
    <div className="t-valve" onClick={onClick} title={label || 'Butterfly Valve'}>
        <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="10" fill="none" stroke={isOpen ? '#555' : '#ccc'} strokeWidth="1.5" />
            <line x1="14" y1="4" x2="14" y2="24" stroke={isOpen ? '#555' : '#ccc'} strokeWidth="2" />
            <line x1="4" y1="14" x2="24" y2="14" stroke={isOpen ? '#555' : '#ccc'} strokeWidth="1" strokeDasharray="2,2" />
        </svg>
        {label && <span className="t-valve-label">{label}</span>}
    </div>
);

// ──────── Tank Widget ────────
const TankWidget: React.FC<{
    percentage?: number;
    volume?: number;
    capacity?: number;
    unit?: string;
    tag?: string;
    showIcons?: boolean;
    alertIcons?: ('alert' | 'info' | 'lock' | 'star')[];
    onClick?: () => void;
}> = ({
    percentage = 10,
    volume = 1000,
    capacity = 10000,
    unit = 'm³',
    tag,
    showIcons = false,
    alertIcons = [],
    onClick,
}) => (
        <div className="transfer-tank" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
            <div className="tank-body">
                <div className="tank-water" style={{ height: `${Math.min(100, percentage)}%` }} />
                <div className="tank-info">
                    {(showIcons || alertIcons.length > 0) && (
                        <div className="tank-icons">
                            {alertIcons.includes('alert') && (
                                <svg viewBox="0 0 16 16"><path d="M8 1L1 14h14L8 1zm0 4v4m0 2v1" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                            )}
                            {alertIcons.includes('info') && (
                                <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1" /><text x="8" y="11" textAnchor="middle" fontSize="8" fill="currentColor">i</text></svg>
                            )}
                            {alertIcons.includes('lock') && (
                                <svg viewBox="0 0 16 16"><rect x="4" y="7" width="8" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M6 7V5a2 2 0 014 0v2" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                            )}
                            {alertIcons.includes('star') && (
                                <svg viewBox="0 0 16 16"><path d="M8 2l1.8 3.6L14 6.2l-3 2.9.7 4.1L8 11.2 4.3 13.2l.7-4.1-3-2.9 4.2-.6z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                            )}
                        </div>
                    )}
                    <div className="tank-percentage">
                        <span className="tank-pct-indicator" />
                        <span className="tank-pct-value">{percentage}</span>
                        <span className="tank-pct-unit">%</span>
                    </div>
                    <span className="tank-volume">{volume} / {capacity}{unit}</span>
                </div>
            </div>
            {tag && <span className="tank-tag">{tag}</span>}
        </div>
    );

// Small data readout
const DataReadout: React.FC<{ value?: string }> = ({ value = '0000' }) => (
    <span className="data-value">{value}</span>
);

// Fuel Leak Indicator
const FuelLeakIndicator: React.FC = () => (
    <div className="fuel-leak">
        <span className="fuel-leak-label">Fuel leak</span>
        <div className="fuel-leak-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>
    </div>
);

// Overflow Tank
const OverflowTank: React.FC<{ value?: number }> = ({ value = 0 }) => (
    <div className="overflow-section">
        <span className="overflow-label">Overflow</span>
        <span className="data-value">{value.toString().padStart(4, '0')}</span>
        <div className="overflow-tank">
            <div className="tank-water" style={{ height: `${Math.min(100, value > 0 ? 30 : 0)}%` }} />
            <span className="overflow-value">{value.toString().padStart(4, '0')}</span>
        </div>
    </div>
);

// ══════════════════════════════════════════════════════════
// Main Transfer View
// ══════════════════════════════════════════════════════════
export const TransferView: React.FC = () => {
    // ── Popup state ──
    const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);

    // ── Valve states ──
    const [valves, setValves] = useState<Record<string, boolean>>({
        g1_v1: true, g1_v2: true, g1_v3: true, g1_v4: true,
        g2_v1: true, g2_v2: true, g2_v3: true,
        top_v1: true, top_v2: true,
        mid_v1: true, mid_v2: true, mid_v3: true,
        bot_v1: true, bot_v2: true, bot_v3: true, bot_v4: true, bot_v5: true,
    });
    const toggleValve = (id: string) =>
        setValves(prev => ({ ...prev, [id]: !prev[id] }));

    // ── Pump states ──
    const [pumps, setPumps] = useState<Record<string, boolean>>({
        g1_p1: false, g1_p2: false,
        g2_p1: false, g2_p2: false, g2_p3: false,
        bot_p1: false, bot_p2: false, bot_p3: false,
        top_p1: false, top_p2: false,
    });
    const togglePump = (id: string) =>
        setPumps(prev => ({ ...prev, [id]: !prev[id] }));

    // ── Pump speeds & modes ──
    const [pumpSpeeds, setPumpSpeeds] = useState<Record<string, number>>({
        g1_p1: 10, g1_p2: 10, g2_p1: 10, g2_p2: 10, g2_p3: 10,
        bot_p1: 10, bot_p2: 10, bot_p3: 10, top_p1: 10, top_p2: 10,
    });
    const [pumpModes, setPumpModes] = useState<Record<string, PumpMode>>({
        g1_p1: 'Manual', g1_p2: 'Manual', g2_p1: 'Manual', g2_p2: 'Manual', g2_p3: 'Manual',
        bot_p1: 'Manual', bot_p2: 'Manual', bot_p3: 'Manual', top_p1: 'Manual', top_p2: 'Manual',
    });

    // ── Open detail popups ──
    const openValveDetail = useCallback((id: string, name: string) => {
        setSelectedComponent({
            type: 'valve',
            tagId: `#${id.toUpperCase()}`,
            name,
            isOpen: valves[id] ?? true,
        });
    }, [valves]);

    const openPumpDetail = useCallback((id: string, name: string) => {
        setSelectedComponent({
            type: 'pump',
            tagId: `#${id.toUpperCase()}`,
            name,
            speed: pumpSpeeds[id] ?? 10,
            mode: pumpModes[id] ?? 'Manual',
            isOn: pumps[id] ?? false,
            readouts: { speed: 16, current: 16, power: 16 },
        });
    }, [pumps, pumpSpeeds, pumpModes]);

    const openTankDetail = useCallback((tag: string, name: string) => {
        setSelectedComponent({
            type: 'valve',
            tagId: tag,
            name,
            isOpen: true,
        });
    }, []);

    // ── Popup handlers ──
    const handlePopupModeChange = (mode: PumpMode) => {
        if (!selectedComponent) return;
        const id = selectedComponent.tagId.replace('#', '').toLowerCase();
        setPumpModes(prev => ({ ...prev, [id]: mode }));
        if (mode === 'Off') {
            setPumps(prev => ({ ...prev, [id]: false }));
        } else if (mode === 'Auto' || mode === 'Manual') {
            setPumps(prev => ({ ...prev, [id]: true }));
        }
        setSelectedComponent(prev => prev ? { ...prev, mode, isOn: mode !== 'Off' } : null);
    };

    const handlePopupSpeedChange = (delta: number) => {
        if (!selectedComponent) return;
        const id = selectedComponent.tagId.replace('#', '').toLowerCase();
        const currentSpeed = pumpSpeeds[id] ?? 10;
        const newSpeed = Math.max(0, Math.min(100, currentSpeed + delta));
        setPumpSpeeds(prev => ({ ...prev, [id]: newSpeed }));
        setSelectedComponent(prev => prev ? { ...prev, speed: newSpeed } : null);
    };

    const handlePopupToggle = () => {
        if (!selectedComponent) return;
        const id = selectedComponent.tagId.replace('#', '').toLowerCase();
        toggleValve(id);
        setSelectedComponent(prev => prev ? { ...prev, isOpen: !prev.isOpen } : null);
    };

    return (
        <div className="transfer-view">
            <div className="transfer-layout">

                {/* ════════ LEFT COLUMN ════════ */}
                <div className="transfer-left">

                    {/* ── Top pipes above GROUP 1 ── */}
                    <div className="pipe-row" style={{ paddingLeft: 40 }}>
                        <Corner dir="bottom-right" />
                        <HPipe len={3} />
                        <TJunction dir="bottom" />
                        <HPipe len={4} />
                        <TJunction dir="bottom" />
                        <HPipe len={2} />
                    </div>

                    {/* ── Capacity readouts ── */}
                    <div className="pipe-row" style={{ paddingLeft: 90, gap: 40 }}>
                        <div className="capacity-box">
                            <div className="capacity-value">200.0 m³</div>
                            <span className="data-tag">#0000</span>
                        </div>
                        <div className="capacity-box">
                            <div className="capacity-value">200.0 m³</div>
                            <span className="data-tag">#0000</span>
                        </div>
                    </div>

                    {/* ── GROUP 1 ── */}
                    <div className="transfer-group">
                        <div className="transfer-group-header">
                            <span>GROUP 1</span>
                            <button className="transfer-group-expand" title="Expand">↗</button>
                        </div>
                        <div className="group-inner">
                            {/* Valve + readout row */}
                            <div className="pipe-row">
                                <TValve isOpen={valves.g1_v1} onClick={() => openValveDetail('g1_v1', 'G1 Valve 1')} />
                                <HPipe len={1} />
                                <DataReadout value="0000" />
                                <HPipe len={2} />
                                <TValve isOpen={valves.g1_v2} onClick={() => openValveDetail('g1_v2', 'G1 Valve 2')} />
                                <HPipe len={1} />
                                <DataReadout value="0000" />
                                <HPipe len={2} />
                                <TValve isOpen={valves.g1_v3} onClick={() => openValveDetail('g1_v3', 'G1 Valve 3')} />
                                <HPipe len={1} />
                                <DataReadout value="0000" />
                                <HPipe len={2} />
                                <TValve isOpen={valves.g1_v4} onClick={() => openValveDetail('g1_v4', 'G1 Valve 4')} />
                                <HPipe len={1} />
                                <DataReadout value="0000" />
                            </div>

                            {/* Tanks row */}
                            <div className="group-tank-section">
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    showIcons alertIcons={['alert', 'info']}
                                    onClick={() => openTankDetail('#TK-G1-01', 'Tank G1-01')} />
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    onClick={() => openTankDetail('#TK-G1-02', 'Tank G1-02')} />
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    onClick={() => openTankDetail('#TK-G1-03', 'Tank G1-03')} />
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    showIcons alertIcons={['alert', 'info', 'lock', 'star']}
                                    onClick={() => openTankDetail('#TK-G1-04', 'Tank G1-04')} />
                            </div>
                        </div>
                    </div>

                    {/* ── Below GROUP 1: pump row ── */}
                    <div className="pipe-row">
                        <TPump label="# 0000" isOn={pumps.g1_p1} onClick={() => openPumpDetail('g1_p1', 'Pump G1-P1')} />
                        <HPipe len={3} />
                        <DataReadout value="0000" />
                    </div>

                    {/* ── Valve row ── */}
                    <div className="pipe-row">
                        <TValve isOpen={valves.mid_v1} onClick={() => openValveDetail('mid_v1', 'Mid Valve 1')} />
                        <HPipe len={3} />
                        <DataReadout value="0000" />
                    </div>

                    {/* ── Bottom pipes with butterfly valves ── */}
                    <div className="pipe-row">
                        <DirArrow />
                        <HPipe len={1} />
                        <ButterflyValve isOpen={valves.bot_v1} onClick={() => openValveDetail('bot_v1', 'Bottom Valve 1')} />
                        <HPipe len={3} />
                        <DirArrow />
                        <HPipe len={1} />
                        <ButterflyValve isOpen={valves.bot_v2} onClick={() => openValveDetail('bot_v2', 'Bottom Valve 2')} />
                    </div>

                    {/* ── Bottom valve/pump chain ── */}
                    <div className="pipe-row">
                        <TValve isOpen={valves.bot_v3} onClick={() => openValveDetail('bot_v3', 'Bottom Valve 3')} />
                        <HPipe len={1} />
                        <DataReadout value="0000" />
                        <HPipe len={2} />
                        <ButterflyValve isOpen={valves.bot_v4} onClick={() => openValveDetail('bot_v4', 'Bottom Valve 4')} label="# 0000" />
                        <HPipe len={1} />
                        <TValve isOpen={valves.bot_v5} onClick={() => openValveDetail('bot_v5', 'Bottom Valve 5')} />
                        <HPipe len={1} />
                        <DataReadout value="# 0000" />
                        <HPipe len={1} />
                        <TPump isOn={pumps.bot_p1} onClick={() => openPumpDetail('bot_p1', 'Bottom Pump 1')} />
                        <HPipe len={1} />
                        <DataReadout value="# 0000" />
                    </div>

                    {/* ── Bottom horizontal pipe ── */}
                    <div className="pipe-row">
                        <HPipe len={3} />
                        <TJunction dir="top" />
                        <HPipe len={3} />
                        <TJunction dir="top" />
                        <HPipe len={3} />
                        <TJunction dir="top" />
                        <HPipe len={3} />
                        <TValve isOpen={valves.mid_v2} onClick={() => openValveDetail('mid_v2', 'Mid Valve 2')} />
                        <HPipe len={1} />
                        <DataReadout value="0000" />
                    </div>
                </div>

                {/* ════════ RIGHT COLUMN ════════ */}
                <div className="transfer-right">

                    {/* ── Top connection ── */}
                    <div className="pipe-row">
                        <div className="junction-box">0000</div>
                        <HPipe len={1} />
                        <Corner dir="bottom-left" />
                        <HPipe len={2} />
                        <DataReadout value="0000" />
                        <HPipe len={3} />
                        <DataReadout value="0000" />
                    </div>

                    {/* ── Valve row with pumps ── */}
                    <div className="pipe-row">
                        <TValve isOpen={valves.top_v1} onClick={() => openValveDetail('top_v1', 'Top Valve 1')} />
                        <HPipe len={2} />
                        <DataReadout value="0000" />
                        <HPipe len={2} />
                        <DirArrow />
                        <HPipe len={2} />
                        <DataReadout value="0000" />
                    </div>

                    {/* ── Fuel leak section ── */}
                    <div className="pipe-row" style={{ gap: 16 }}>
                        <FuelLeakIndicator />
                        <div className="pipe-row">
                            <HPipe len={2} />
                            <TValve isOpen={valves.top_v2} onClick={() => openValveDetail('top_v2', 'Top Valve 2')} />
                            <HPipe len={2} />
                            <DataReadout value="0000" />
                        </div>
                    </div>

                    {/* ── GROUP 2 ── */}
                    <div className="transfer-group">
                        <div className="transfer-group-header">
                            <span>GROUP 2</span>
                            <button className="transfer-group-expand" title="Expand">↗</button>
                        </div>
                        <div className="group-inner">
                            {/* Top tanks */}
                            <div className="group-tank-section">
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    showIcons alertIcons={['alert', 'info']}
                                    onClick={() => openTankDetail('#TK-G2-01', 'Tank G2-01')} />
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    onClick={() => openTankDetail('#TK-G2-02', 'Tank G2-02')} />
                            </div>
                            {/* Bottom tanks */}
                            <div className="group-tank-section">
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    showIcons alertIcons={['alert', 'info', 'lock', 'star']}
                                    onClick={() => openTankDetail('#TK-G2-03', 'Tank G2-03')} />
                                <TankWidget percentage={95} volume={9500} capacity={10000} unit="m³" tag="#0000"
                                    onClick={() => openTankDetail('#TK-G2-04', 'Tank G2-04')} />
                                <TankWidget percentage={10} volume={1000} capacity={10000} unit="m³" tag="#0000"
                                    onClick={() => openTankDetail('#TK-G2-05', 'Tank G2-05')} />
                            </div>
                        </div>
                    </div>

                    {/* ── Below GROUP 2: pipes & valves ── */}
                    <div className="pipe-row">
                        <HPipe len={1} />
                        <DataReadout value="0000" />
                        <HPipe len={2} />
                        <TValve isOpen={valves.g2_v1} onClick={() => openValveDetail('g2_v1', 'G2 Valve 1')} />
                        <HPipe len={2} />
                        <TValve isOpen={valves.g2_v2} onClick={() => openValveDetail('g2_v2', 'G2 Valve 2')} />
                        <HPipe len={2} />
                        <TValve isOpen={valves.g2_v3} onClick={() => openValveDetail('g2_v3', 'G2 Valve 3')} />
                    </div>

                    <div className="pipe-row">
                        <DirArrow />
                        <HPipe len={1} />
                        <DataReadout value="0000" />
                        <HPipe len={1} />
                        <DirArrow />
                        <HPipe len={1} />
                        <TPump isOn={pumps.g2_p1} onClick={() => openPumpDetail('g2_p1', 'Pump G2-P1')} />
                        <HPipe len={1} />
                        <DataReadout value="0000" />
                    </div>

                    <div className="pipe-row">
                        <DirArrow />
                        <HPipe len={2} />
                        <TPump isOn={pumps.g2_p2} onClick={() => openPumpDetail('g2_p2', 'Pump G2-P2')} />
                        <HPipe len={2} />
                        <DataReadout value="0000" />
                        <HPipe len={2} />
                        <DataReadout value="0000" />
                    </div>
                </div>

                {/* ════════ BOTTOM ROW ════════ */}
                <div className="transfer-bottom">
                    <div className="bottom-center">
                        <div className="pipe-row">
                            <HPipe len={2} />
                            <DataReadout value="0000" />
                            <HPipe len={2} />
                            <TPump isOn={pumps.bot_p2} onClick={() => openPumpDetail('bot_p2', 'Bottom Pump 2')} />
                            <HPipe len={2} />
                            <DirArrow />
                            <HPipe len={2} />
                        </div>

                        <OverflowTank value={0} />

                        <div className="pipe-row">
                            <TPump isOn={pumps.bot_p3} onClick={() => openPumpDetail('bot_p3', 'Bottom Pump 3')} />
                            <HPipe len={2} />
                            <DataReadout value="#0000" />
                            <HPipe len={2} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Component Detail Popup ── */}
            {selectedComponent && (
                <ComponentDetailPopup
                    detail={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                    onModeChange={handlePopupModeChange}
                    onSpeedChange={handlePopupSpeedChange}
                    onToggle={handlePopupToggle}
                />
            )}
        </div>
    );
};

export default TransferView;
