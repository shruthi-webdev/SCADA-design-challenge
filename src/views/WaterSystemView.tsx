import React, { useState, useEffect, useCallback } from 'react';
import './WaterSystemView.css';
import ComponentDetailPopup from '../components/ComponentDetailPopup';
import type { ComponentDetail, PumpMode } from '../components/ComponentDetailPopup';

// Import OpenBridge automation web components (pre-compiled Lit custom elements)
import '@oicl/openbridge-webcomponents/dist/automation/horizontal-line/horizontal-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/vertical-line/vertical-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/corner-line/corner-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/direction-line/direction-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/end-point-line/end-point-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/three-way-line/three-way-line.js';
import '@oicl/openbridge-webcomponents/dist/automation/line-cross/line-cross.js';
import '@oicl/openbridge-webcomponents/dist/automation/line-overlap/line-overlap.js';
import '@oicl/openbridge-webcomponents/dist/automation/automation-readout/automation-readout.js';

// Augment React's JSX type definitions with our custom element types
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'obc-horizontal-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; lineType?: string; length?: number;
            };
            'obc-vertical-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; lineType?: string; length?: number;
            };
            'obc-corner-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; direction?: string; lineType?: string;
            };
            'obc-direction-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; lineType?: string;
            };
            'obc-end-point-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; direction?: string; lineType?: string;
            };
            'obc-three-way-line': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; direction?: string; lineType?: string;
            };
            'obc-line-cross': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; lineType?: string;
            };
            'obc-line-overlap': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                medium?: string; lineType?: string;
            };
            'obc-automation-readout': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                value?: number; unit?: string; numberOfDigits?: number; position?: string; lineType?: string;
            };
        }
    }
}

// ──────── Reusable Sub-Components ────────

const Panel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
    title, children, className = ''
}) => (
    <div className={`panel ${className}`}>
        <div className="panel-header">
            <span className="panel-title">{title}</span>
            <button className="panel-menu">⋯</button>
        </div>
        <div className="panel-body">{children}</div>
    </div>
);

const TempBadge: React.FC<{
    value?: number;
    editable?: boolean;
    onIncrement?: () => void;
    onDecrement?: () => void;
}> = ({ value = 0, editable = false, onIncrement, onDecrement }) => (
    <span
        className="temp-badge"
        style={editable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
    >
        {editable && (
            <button
                onClick={(e) => { e.stopPropagation(); onDecrement?.(); }}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: '#0066cc', padding: '0 2px', lineHeight: 1
                }}
                title="Decrease"
            >−</button>
        )}
        <span className="temp-value">{value.toString().padStart(2, '0')}</span>
        <span className="temp-unit">°C</span>
        {editable && (
            <button
                onClick={(e) => { e.stopPropagation(); onIncrement?.(); }}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: '#0066cc', padding: '0 2px', lineHeight: 1
                }}
                title="Increase"
            >+</button>
        )}
    </span>
);

const FlowIndicator: React.FC<{ flowUp?: number; flowDown?: number }> = ({
    flowUp = 100, flowDown = 0
}) => (
    <div className="flow-indicator">
        <span>↑ {flowUp}%</span>
        <span>↓&nbsp;&nbsp;{flowDown}%</span>
    </div>
);

const ValveIcon: React.FC<{
    label?: string;
    isOpen?: boolean;
    onClick?: () => void;
    onDetailClick?: (e: React.MouseEvent) => void;
}> = ({ label, isOpen = true, onClick, onDetailClick }) => (
    <div
        className="valve clickable-component"
        onClick={(e) => { if (onDetailClick) onDetailClick(e); else onClick?.(); }}
        style={{ cursor: 'pointer' }}
        title="Click for details"
    >
        <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="4,6 4,18 12,12" fill={isOpen ? '#333' : '#ccc'} />
            <polygon points="20,6 20,18 12,12" fill={isOpen ? '#333' : '#ccc'} />
            <line x1="12" y1="2" x2="12" y2="6" stroke="#333" strokeWidth="2" />
        </svg>
        {label !== undefined && (
            <span className="valve-label">{isOpen ? 'Open' : 'Closed'}</span>
        )}
    </div>
);

const HeatExchanger: React.FC = () => (
    <div className="heat-exchanger">
        <svg width="48" height="36" viewBox="0 0 48 36">
            <rect x="1" y="1" width="46" height="34" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="8" y1="8" x2="40" y2="28" stroke="#333" strokeWidth="1" />
            <line x1="8" y1="28" x2="40" y2="8" stroke="#333" strokeWidth="1" />
        </svg>
    </div>
);

const PumpIcon: React.FC<{
    speed?: number;
    label?: string;
    isOn?: boolean;
    onClick?: () => void;
    onSpeedClick?: () => void;
    onDetailClick?: (e: React.MouseEvent) => void;
}> = ({ speed, label, isOn = false, onClick, onSpeedClick, onDetailClick }) => (
    <div
        className="pump clickable-component"
        style={{ cursor: 'pointer' }}
        title="Click for details"
        onClick={(e) => { if (onDetailClick) onDetailClick(e); else onClick?.(); }}
    >
        <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="none" stroke={isOn ? '#0066cc' : '#333'} strokeWidth="1.5" />
            <circle cx="14" cy="14" r="6" fill={isOn ? '#0066cc' : '#333'} />
            {isOn && (
                <>
                    <line x1="14" y1="2" x2="14" y2="7" stroke="#0066cc" strokeWidth="1.5" />
                    <line x1="14" y1="21" x2="14" y2="26" stroke="#0066cc" strokeWidth="1.5" />
                    <line x1="2" y1="14" x2="7" y2="14" stroke="#0066cc" strokeWidth="1.5" />
                    <line x1="21" y1="14" x2="26" y2="14" stroke="#0066cc" strokeWidth="1.5" />
                </>
            )}
        </svg>
        {speed !== undefined && (
            <span
                className="pump-speed"
                onClick={(e) => { e.stopPropagation(); onSpeedClick?.(); }}
                style={onSpeedClick ? { cursor: 'pointer', textDecoration: 'underline' } : undefined}
                title={onSpeedClick ? 'Click to change speed' : undefined}
            >{speed}%</span>
        )}
        {label && <span className="pump-label"># {label}</span>}
    </div>
);

const ToggleSwitch: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
    <button
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={onClick}
        style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
        aria-label={active ? 'Toggle off' : 'Toggle on'}
    >
        <div
            style={{
                width: 36, height: 18, borderRadius: 9,
                background: active ? '#0066cc' : '#ccc',
                position: 'relative', transition: 'background 0.2s',
            }}
        >
            <div
                style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: 2,
                    left: active ? 20 : 2, transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
            />
        </div>
    </button>
);

// ──────── Pipe helper components ────────

// Horizontal pipe segment wrapper
const HPipe: React.FC<{ len?: number }> = ({ len = 1 }) => (
    <obc-horizontal-line medium="water" lineType="fluid" length={len}
        style={{ display: 'inline-block', width: `${len * 24}px`, height: '24px', flexShrink: 0 }} />
);

// Vertical pipe segment
const VPipe: React.FC<{ len?: number }> = ({ len = 1 }) => (
    <obc-vertical-line medium="water" lineType="fluid" length={len}
        style={{ display: 'inline-block', width: '24px', height: `${len * 24}px`, flexShrink: 0 }} />
);

// Corner pipe
const Corner: React.FC<{ dir: string }> = ({ dir }) => (
    <obc-corner-line medium="water" lineType="fluid" direction={dir}
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

// Direction arrow on pipe
const DirArrow: React.FC = () => (
    <obc-direction-line medium="water" lineType="fluid"
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

// T-junction
const TJunction: React.FC<{ dir?: string }> = ({ dir = 'bottom' }) => (
    <obc-three-way-line medium="water" lineType="fluid" direction={dir}
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

// End point
const EndPoint: React.FC<{ dir?: string }> = ({ dir = 'right' }) => (
    <obc-end-point-line medium="water" lineType="fluid" direction={dir}
        style={{ display: 'inline-block', width: '24px', height: '24px', flexShrink: 0 }} />
);

// Speed cycle values
const SPEED_STEPS = [10, 25, 50, 75, 100];
const nextSpeed = (current: number) => {
    const idx = SPEED_STEPS.indexOf(current);
    return SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
};

// ══════════════════════════════════════════════════════════
// Main View
// ══════════════════════════════════════════════════════════

export const WaterSystemView: React.FC = () => {
    // ── Popup state ──
    const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);
    const [pumpModes, setPumpModes] = useState<Record<string, PumpMode>>({
        sec1: 'Manual', sec2: 'Manual', pri1: 'Manual', pri2: 'Manual',
        heatdump1: 'Manual', heatdump2: 'Manual', sec_right: 'Manual',
        pri_right_1: 'Manual', pri_right_2: 'Manual', cooling: 'Manual',
    });

    const openPumpDetail = (id: string, name: string) => {
        setSelectedComponent({
            type: 'pump',
            tagId: `#${id.toUpperCase()}`,
            name,
            speed: pumpSpeeds[id] ?? 10,
            mode: pumpModes[id] ?? 'Manual',
            isOn: pumps[id] ?? false,
            readouts: { speed: 16, current: 16, power: 16 },
        });
    };

    const openValveDetail = (id: string, name: string) => {
        setSelectedComponent({
            type: 'valve',
            tagId: `#${id.toUpperCase()}`,
            name,
            isOpen: valves[id] ?? true,
        });
    };

    const openHeatExDetail = (name: string) => {
        setSelectedComponent({
            type: 'heatExchanger',
            tagId: `#HX-${name.replace(/\s/g, '')}`,
            name,
        });
    };

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

    // ── System-level state ──
    const [systemEnabled, setSystemEnabled] = useState(false);
    const [fullAuto, setFullAuto] = useState(true);
    const [controlMode, setControlMode] = useState<'hotwater' | 'cooling'>('cooling');

    // ── Valve states ──
    const [valves, setValves] = useState<Record<string, boolean>>({
        aft1_v1: true, aft1_v2: true,
        aft2_v1: true, aft2_v2: true,
        selection_main: true,
        recovery: true,
        mixing: true,
        sel_right_1: true, sel_right_2: true,
    });
    const toggleValve = (id: string) =>
        setValves(prev => ({ ...prev, [id]: !prev[id] }));

    // ── Pump states ──
    const [pumps, setPumps] = useState<Record<string, boolean>>({
        sec1: false, sec2: false,
        pri1: false, pri2: false,
        heatdump1: false, heatdump2: false,
        sec_right: false,
        pri_right_1: false, pri_right_2: false,
        cooling: false,
    });
    const togglePump = (id: string) =>
        setPumps(prev => ({ ...prev, [id]: !prev[id] }));

    // ── Pump speeds ──
    const [pumpSpeeds, setPumpSpeeds] = useState<Record<string, number>>({
        sec1: 10, sec2: 10,
        pri1: 10, pri2: 10,
        sec_right: 10,
    });
    const cycleSpeed = (id: string) =>
        setPumpSpeeds(prev => ({ ...prev, [id]: nextSpeed(prev[id]) }));

    // ── Temperature readouts ──
    const [temps, setTemps] = useState({
        seawater: 0, outdoor: 0, warmWaterS: 0, coldWaterS: 0,
        aft1_in: 0, aft1_mid: 0, aft1_out: 0, aft1_sec_in: 0, aft1_sec_out: 0,
        aft2_in: 0, aft2_mid: 0, aft2_out: 0, aft2_sec_in: 0, aft2_sec_out: 0,
        pri_in: 0, pri_out: 0,
        heatdump_in: 0, heatdump_out: 0, heatdump2_in: 0, heatdump2_out: 0,
        cooling1: 0, cooling2: 0, cooling3: 0,
        pri_right_1: 0, pri_right_2: 0,
    });

    // ── Set points ──
    const [setPoints, setSetPoints] = useState({ warmWater: 45, coldWater: 7 });
    const adjustSetPoint = (key: 'warmWater' | 'coldWater', delta: number) =>
        setSetPoints(prev => ({
            ...prev,
            [key]: Math.max(0, Math.min(99, prev[key] + delta))
        }));

    // ── Temperature simulation ──
    const randomFluctuation = useCallback((base: number, range: number) => {
        return Math.max(0, Math.min(99, base + Math.floor(Math.random() * range * 2) - range));
    }, []);

    useEffect(() => {
        if (!systemEnabled) {
            setTemps({
                seawater: 0, outdoor: 0, warmWaterS: 0, coldWaterS: 0,
                aft1_in: 0, aft1_mid: 0, aft1_out: 0, aft1_sec_in: 0, aft1_sec_out: 0,
                aft2_in: 0, aft2_mid: 0, aft2_out: 0, aft2_sec_in: 0, aft2_sec_out: 0,
                pri_in: 0, pri_out: 0,
                heatdump_in: 0, heatdump_out: 0, heatdump2_in: 0, heatdump2_out: 0,
                cooling1: 0, cooling2: 0, cooling3: 0,
                pri_right_1: 0, pri_right_2: 0,
            });
            return;
        }

        setTemps({
            seawater: 18, outdoor: 22, warmWaterS: 42, coldWaterS: 8,
            aft1_in: 35, aft1_mid: 40, aft1_out: 45, aft1_sec_in: 28, aft1_sec_out: 32,
            aft2_in: 34, aft2_mid: 39, aft2_out: 44, aft2_sec_in: 27, aft2_sec_out: 31,
            pri_in: 38, pri_out: 46,
            heatdump_in: 50, heatdump_out: 35, heatdump2_in: 48, heatdump2_out: 33,
            cooling1: 12, cooling2: 8, cooling3: 15,
            pri_right_1: 42, pri_right_2: 41,
        });

        const interval = setInterval(() => {
            setTemps(prev => ({
                seawater: randomFluctuation(prev.seawater, 1),
                outdoor: randomFluctuation(prev.outdoor, 1),
                warmWaterS: randomFluctuation(prev.warmWaterS, 2),
                coldWaterS: randomFluctuation(prev.coldWaterS, 1),
                aft1_in: randomFluctuation(prev.aft1_in, 2),
                aft1_mid: randomFluctuation(prev.aft1_mid, 2),
                aft1_out: randomFluctuation(prev.aft1_out, 2),
                aft1_sec_in: randomFluctuation(prev.aft1_sec_in, 1),
                aft1_sec_out: randomFluctuation(prev.aft1_sec_out, 1),
                aft2_in: randomFluctuation(prev.aft2_in, 2),
                aft2_mid: randomFluctuation(prev.aft2_mid, 2),
                aft2_out: randomFluctuation(prev.aft2_out, 2),
                aft2_sec_in: randomFluctuation(prev.aft2_sec_in, 1),
                aft2_sec_out: randomFluctuation(prev.aft2_sec_out, 1),
                pri_in: randomFluctuation(prev.pri_in, 2),
                pri_out: randomFluctuation(prev.pri_out, 2),
                heatdump_in: randomFluctuation(prev.heatdump_in, 2),
                heatdump_out: randomFluctuation(prev.heatdump_out, 2),
                heatdump2_in: randomFluctuation(prev.heatdump2_in, 2),
                heatdump2_out: randomFluctuation(prev.heatdump2_out, 2),
                cooling1: randomFluctuation(prev.cooling1, 1),
                cooling2: randomFluctuation(prev.cooling2, 1),
                cooling3: randomFluctuation(prev.cooling3, 1),
                pri_right_1: randomFluctuation(prev.pri_right_1, 2),
                pri_right_2: randomFluctuation(prev.pri_right_2, 2),
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [systemEnabled, randomFluctuation]);

    // ── Derived flow ──
    const getFlowForPump = (pumpId: string) => pumps[pumpId] ? 100 : 0;

    return (
        <div className="water-view">
            <div className="main-grid">

                {/* ════════ LEFT COLUMN ════════ */}
                <div className="left-column">

                    {/* ─── Auxiliary Heat Recover AFT 1 ─── */}
                    <Panel title="AUXILIARY HEAT RECOVER AFT" className="flow-panel">
                        <div className="schematic-row">
                            <DirArrow />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft1_in} />
                            <HPipe len={1} />
                            <FlowIndicator flowUp={getFlowForPump('sec1')} flowDown={100 - getFlowForPump('sec1')} />
                            <HPipe len={1} />
                            <ValveIcon label="Open" isOpen={valves.aft1_v1} onClick={() => toggleValve('aft1_v1')} onDetailClick={() => openValveDetail('aft1_v1', 'AFT1 Valve 1')} />
                            <HPipe len={1} />
                            <div className="clickable-component" onClick={() => openHeatExDetail('AFT1 HX')}><HeatExchanger /></div>
                            <HPipe len={1} />
                            <TempBadge value={temps.aft1_mid} />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft1_out} />
                            <HPipe len={1} />
                            <DirArrow />
                        </div>
                        <div className="schematic-row" style={{ paddingLeft: '72px' }}>
                            <ValveIcon label="Open" isOpen={valves.aft1_v2} onClick={() => toggleValve('aft1_v2')} onDetailClick={() => openValveDetail('aft1_v2', 'AFT1 Valve 2')} />
                        </div>
                        <div className="schematic-row secondary-row">
                            <DirArrow />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft1_sec_in} />
                            <HPipe len={2} />
                            <HeatExchanger />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft1_sec_out} />
                            <HPipe len={1} />
                            <DirArrow />
                        </div>
                    </Panel>

                    {/* ─── Auxiliary Heat Recover AFT 2 ─── */}
                    <Panel title="AUXILIARY HEAT RECOVER AFT" className="flow-panel">
                        <div className="schematic-row">
                            <DirArrow />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft2_in} />
                            <HPipe len={1} />
                            <FlowIndicator flowUp={getFlowForPump('sec2')} flowDown={100 - getFlowForPump('sec2')} />
                            <HPipe len={1} />
                            <ValveIcon label="Open" isOpen={valves.aft2_v1} onClick={() => toggleValve('aft2_v1')} onDetailClick={() => openValveDetail('aft2_v1', 'AFT2 Valve 1')} />
                            <HPipe len={1} />
                            <HeatExchanger />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft2_mid} />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft2_out} />
                            <HPipe len={1} />
                            <DirArrow />
                        </div>
                        <div className="schematic-row" style={{ paddingLeft: '72px' }}>
                            <ValveIcon label="Open" isOpen={valves.aft2_v2} onClick={() => toggleValve('aft2_v2')} onDetailClick={() => openValveDetail('aft2_v2', 'AFT2 Valve 2')} />
                        </div>
                        <div className="schematic-row secondary-row">
                            <DirArrow />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft2_sec_in} />
                            <HPipe len={2} />
                            <HeatExchanger />
                            <HPipe len={1} />
                            <TempBadge value={temps.aft2_sec_out} />
                            <HPipe len={1} />
                            <DirArrow />
                        </div>
                    </Panel>

                    {/* ─── Bottom Row: Secondary + Primary Pump + Selection ─── */}
                    <div className="bottom-row">
                        <Panel title="SECONDARY" className="small-panel">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <div className="pump-row">
                                    <div className="pump-item">
                                        <span>{pumpSpeeds.sec1}%</span>
                                        <PumpIcon isOn={pumps.sec1} onClick={() => togglePump('sec1')} onDetailClick={() => openPumpDetail('sec1', 'CW-01')} />
                                    </div>
                                    <VPipe len={1} />
                                    <div className="pump-item">
                                        <span>{pumpSpeeds.sec2}%</span>
                                        <PumpIcon isOn={pumps.sec2} onClick={() => togglePump('sec2')} onDetailClick={() => openPumpDetail('sec2', 'CW-02')} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={2} />
                                    <TempBadge value={temps.pri_in} />
                                    <HPipe len={2} />
                                </div>
                            </div>
                        </Panel>

                        <Panel title="PRIMARY PUMP" className="small-panel">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <TempBadge value={temps.pri_in} />
                                    <HPipe len={1} />
                                </div>
                                <div className="pump-group">
                                    <PumpIcon
                                        speed={pumpSpeeds.pri1}
                                        isOn={pumps.pri1}
                                        onClick={() => togglePump('pri1')}
                                        onSpeedClick={() => cycleSpeed('pri1')}
                                        onDetailClick={() => openPumpDetail('pri1', 'PRI-01')}
                                    />
                                    <PumpIcon
                                        speed={pumpSpeeds.pri2}
                                        isOn={pumps.pri2}
                                        onClick={() => togglePump('pri2')}
                                        onSpeedClick={() => cycleSpeed('pri2')}
                                        onDetailClick={() => openPumpDetail('pri2', 'PRI-02')}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={1} />
                                    <TempBadge value={temps.pri_out} />
                                </div>
                            </div>
                        </Panel>

                        <Panel title="SELECTION" className="small-panel">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <FlowIndicator flowUp={getFlowForPump('pri1')} flowDown={100 - getFlowForPump('pri1')} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={1} />
                                    <ValveIcon isOpen={valves.selection_main} onClick={() => toggleValve('selection_main')} onDetailClick={() => openValveDetail('selection_main', 'Main Selection Valve')} />
                                    <HPipe len={1} />
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* ─── Heat Dumping ─── */}
                    <Panel title="HEAT DUMPING" className="flow-panel">
                        <div className="schematic-row">
                            <HPipe len={1} />
                            <TempBadge value={temps.heatdump_in} />
                            <HPipe len={1} />
                            <HeatExchanger />
                            <HPipe len={1} />
                            <PumpIcon isOn={pumps.heatdump1} onClick={() => togglePump('heatdump1')} onDetailClick={() => openPumpDetail('heatdump1', 'HD-01')} />
                            <HPipe len={1} />
                            <FlowIndicator flowUp={getFlowForPump('heatdump1')} flowDown={100 - getFlowForPump('heatdump1')} />
                            <HPipe len={1} />
                            <TempBadge value={temps.heatdump_out} />
                        </div>
                        <div className="schematic-row secondary-row">
                            <HPipe len={1} />
                            <span style={{ fontSize: '10px', color: '#666', zIndex: 2, position: 'relative' }}>{pumps.heatdump2 ? 'On' : 'Off'}</span>
                            <HPipe len={1} />
                            <TempBadge value={temps.heatdump2_in} />
                            <HPipe len={1} />
                            <PumpIcon isOn={pumps.heatdump2} onClick={() => togglePump('heatdump2')} onDetailClick={() => openPumpDetail('heatdump2', 'HD-02')} />
                            <HPipe len={2} />
                            <TempBadge value={temps.heatdump2_out} />
                        </div>
                    </Panel>
                </div>

                {/* ════════ MIDDLE COLUMN ════════ */}
                <div className="middle-column">
                    <Panel title="RECOVERY" className="recovery-panel">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <VPipe len={1} />
                            <FlowIndicator flowUp={getFlowForPump('pri1')} flowDown={100 - getFlowForPump('pri1')} />
                            <VPipe len={1} />
                            <ValveIcon isOpen={valves.recovery} onClick={() => toggleValve('recovery')} onDetailClick={() => openValveDetail('recovery', 'Recovery Valve')} />
                            <VPipe len={1} />
                        </div>
                    </Panel>

                    {/* Vertical pipe connectors between panels */}
                    <div className="connector-vertical">
                        <VPipe len={2} />
                    </div>

                    {/* Additional vertical pipes */}
                    <div className="connector-vertical">
                        <VPipe len={3} />
                    </div>

                    <div className="connector-vertical">
                        <VPipe len={2} />
                    </div>
                </div>

                {/* ════════ RIGHT COLUMN ════════ */}
                <div className="right-column">

                    {/* Water Control Toggle */}
                    <div className="control-toggles">
                        <button
                            className={`control-btn ${controlMode === 'hotwater' ? 'active' : ''}`}
                            onClick={() => setControlMode('hotwater')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                            </svg>
                            <span>Hot water con.</span>
                        </button>
                        <button
                            className={`control-btn ${controlMode === 'cooling' ? 'active' : ''}`}
                            onClick={() => setControlMode('cooling')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z" />
                            </svg>
                            <span>Hot water con.</span>
                        </button>
                    </div>

                    {/* Temperature Readouts */}
                    <div className="info-section">
                        <h4 className="section-label">TEMP. READOUTS</h4>
                        <div className="readout-list">
                            <div className="readout"><span className="val">{temps.seawater.toString().padStart(2, '0')}°</span> Seawater C</div>
                            <div className="readout"><span className="val">{temps.outdoor.toString().padStart(2, '0')}°</span> Outdoor C</div>
                            <div className="readout"><span className="val">{temps.warmWaterS.toString().padStart(2, '0')}°</span> Warm water S. C</div>
                            <div className="readout"><span className="val">{temps.coldWaterS.toString().padStart(2, '0')}°</span> Cold water S. C</div>
                        </div>
                    </div>

                    {/* Set Points */}
                    <div className="info-section">
                        <h4 className="section-label">SET POINTS</h4>
                        <div className="setpoint-list">
                            <div className="setpoint">
                                <span className="indicator">▶</span>
                                <TempBadge
                                    value={setPoints.warmWater}
                                    editable
                                    onIncrement={() => adjustSetPoint('warmWater', 1)}
                                    onDecrement={() => adjustSetPoint('warmWater', -1)}
                                />
                                <span>Warm water C C</span>
                            </div>
                            <div className="setpoint">
                                <span className="indicator">▶</span>
                                <TempBadge
                                    value={setPoints.coldWater}
                                    editable
                                    onIncrement={() => adjustSetPoint('coldWater', 1)}
                                    onDecrement={() => adjustSetPoint('coldWater', -1)}
                                />
                                <span>Cold water C C</span>
                            </div>
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="info-section">
                        <h4 className="section-label">OPERATIONS</h4>
                        <div className="operation-list">
                            <div className="operation">
                                <span>Enable System</span>
                                <ToggleSwitch active={systemEnabled} onClick={() => setSystemEnabled(prev => !prev)} />
                            </div>
                            <div className="operation">
                                <span>Full auto</span>
                                <ToggleSwitch active={fullAuto} onClick={() => setFullAuto(prev => !prev)} />
                            </div>
                        </div>
                    </div>

                    {/* Mixing & Secondary Row */}
                    <div className="side-row">
                        <Panel title="MIXING" className="side-panel">
                            <div className="mixing-schematic">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={1} />
                                    <TempBadge value={temps.aft1_mid} />
                                    <HPipe len={1} />
                                </div>
                                <ValveIcon isOpen={valves.mixing} onClick={() => toggleValve('mixing')} onDetailClick={() => openValveDetail('mixing', 'Mixing Valve')} />
                                <FlowIndicator flowUp={getFlowForPump('sec_right')} flowDown={100 - getFlowForPump('sec_right')} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={1} />
                                    <TempBadge value={temps.aft2_mid} />
                                    <HPipe len={1} />
                                </div>
                            </div>
                        </Panel>
                        <Panel title="SECONDARY" className="side-panel">
                            <div className="secondary-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span
                                        style={{ cursor: 'pointer', fontSize: '10px', color: '#666' }}
                                        onClick={() => cycleSpeed('sec_right')}
                                        title="Click to change speed"
                                    >{pumpSpeeds.sec_right}%</span>
                                    <HPipe len={1} />
                                </div>
                                <PumpIcon
                                    speed={pumpSpeeds.sec_right}
                                    isOn={pumps.sec_right}
                                    onClick={() => togglePump('sec_right')}
                                    onSpeedClick={() => cycleSpeed('sec_right')}
                                    onDetailClick={() => openPumpDetail('sec_right', 'SEC-R')}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HPipe len={1} />
                                    <span style={{ fontSize: '10px', color: '#666' }}>{pumpSpeeds.sec_right}%</span>
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* Selection & Primary Pump Row */}
                    <div className="side-row">
                        <Panel title="SELECTION" className="side-panel">
                            <div className="selection-items">
                                <div className="item">
                                    <span>{valves.sel_right_1 ? 'Open' : 'Closed'}</span>
                                    <HPipe len={1} />
                                    <ValveIcon isOpen={valves.sel_right_1} onClick={() => toggleValve('sel_right_1')} onDetailClick={() => openValveDetail('sel_right_1', 'Selection Right 1')} />
                                    <HPipe len={1} />
                                </div>
                                <div className="item">
                                    <span>{valves.sel_right_2 ? 'Open' : 'Closed'}</span>
                                    <HPipe len={1} />
                                    <ValveIcon isOpen={valves.sel_right_2} onClick={() => toggleValve('sel_right_2')} onDetailClick={() => openValveDetail('sel_right_2', 'Selection Right 2')} />
                                    <HPipe len={1} />
                                </div>
                            </div>
                        </Panel>
                        <Panel title="PRIMARY PUMP" className="side-panel">
                            <div className="pump-items">
                                <div className="item">
                                    <span>{pumps.pri_right_1 ? 'On' : 'Off'}</span>
                                    <HPipe len={1} />
                                    <PumpIcon isOn={pumps.pri_right_1} onClick={() => togglePump('pri_right_1')} onDetailClick={() => openPumpDetail('pri_right_1', 'PRI-R1')} />
                                    <HPipe len={1} />
                                    <TempBadge value={temps.pri_right_1} />
                                </div>
                                <div className="item">
                                    <span>{pumps.pri_right_2 ? 'On' : 'Off'}</span>
                                    <HPipe len={1} />
                                    <PumpIcon isOn={pumps.pri_right_2} onClick={() => togglePump('pri_right_2')} onDetailClick={() => openPumpDetail('pri_right_2', 'PRI-R2')} />
                                    <HPipe len={1} />
                                    <TempBadge value={temps.pri_right_2} />
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* Free Cooling */}
                    <Panel title="FREE COOLING AND HEAT COLLECTION" className="full-panel">
                        <div className="cooling-content">
                            <div className="cooling-row">
                                <TempBadge value={temps.cooling1} />
                                <HPipe len={2} />
                                <TempBadge value={temps.cooling2} />
                                <HPipe len={1} />
                                <DirArrow />
                            </div>
                            <div className="cooling-row">
                                <FlowIndicator flowUp={getFlowForPump('cooling')} flowDown={100 - getFlowForPump('cooling')} />
                                <HPipe len={1} />
                                <TempBadge value={temps.cooling3} />
                                <HPipe len={1} />
                                <HeatExchanger />
                                <HPipe len={1} />
                                <TempBadge value={temps.cooling1} />
                                <HPipe len={1} />
                                <span
                                    style={{ cursor: 'pointer', userSelect: 'none', fontSize: '10px', color: '#666', zIndex: 2, position: 'relative' as const }}
                                    onClick={() => togglePump('cooling')}
                                    title="Click to toggle"
                                >{pumps.cooling ? 'On' : 'Off'}</span>
                            </div>
                            <div className="cooling-row">
                                <TempBadge value={temps.cooling1} />
                                <HPipe len={1} />
                                <DirArrow />
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            {/* ──── Component Detail Popup ──── */}
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

export default WaterSystemView;
