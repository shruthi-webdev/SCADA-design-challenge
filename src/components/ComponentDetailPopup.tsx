import React from 'react';
import './ComponentDetailPopup.css';

export type ComponentType = 'pump' | 'valve' | 'heatExchanger';
export type PumpMode = 'Off' | 'Manual' | 'Auto';

export interface ComponentDetail {
    type: ComponentType;
    tagId: string;
    name: string;
    // Pump-specific
    speed?: number;
    mode?: PumpMode;
    isOn?: boolean;
    readouts?: { speed: number; current: number; power: number };
    // Valve-specific
    isOpen?: boolean;
}

interface ComponentDetailPopupProps {
    detail: ComponentDetail;
    onClose: () => void;
    onModeChange?: (mode: PumpMode) => void;
    onSpeedChange?: (delta: number) => void;
    onToggle?: () => void;
}

const PumpSvgIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" stroke="#333" strokeWidth="2" fill="none" />
        <circle cx="32" cy="32" r="8" fill="#333" />
        <circle cx="32" cy="32" r="4" fill="#fff" />
        <line x1="32" y1="6" x2="32" y2="16" stroke="#333" strokeWidth="2" />
        <line x1="32" y1="48" x2="32" y2="58" stroke="#333" strokeWidth="2" />
        <line x1="6" y1="32" x2="16" y2="32" stroke="#333" strokeWidth="2" />
        <line x1="48" y1="32" x2="58" y2="32" stroke="#333" strokeWidth="2" />
    </svg>
);

const ValveSvgIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,14 10,50 32,32" fill={isOpen ? '#333' : '#ccc'} />
        <polygon points="54,14 54,50 32,32" fill={isOpen ? '#333' : '#ccc'} />
        <line x1="32" y1="4" x2="32" y2="14" stroke="#333" strokeWidth="3" />
        <rect x="22" y="2" width="20" height="8" rx="2" fill="none" stroke="#333" strokeWidth="1.5" />
    </svg>
);

const HeatExchangerSvgIcon = () => (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="60" height="44" rx="2" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="10" y1="10" x2="54" y2="38" stroke="#333" strokeWidth="1.5" />
        <line x1="10" y1="38" x2="54" y2="10" stroke="#333" strokeWidth="1.5" />
    </svg>
);

export const ComponentDetailPopup: React.FC<ComponentDetailPopupProps> = ({
    detail, onClose, onModeChange, onSpeedChange, onToggle
}) => {
    const isPump = detail.type === 'pump';
    const isValve = detail.type === 'valve';

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
                {/* ─── Header ─── */}
                <div className="popup-header">
                    <span className="popup-tag">{detail.tagId}</span>
                    <button className="popup-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                {/* ─── Readout + Name ─── */}
                <div className="popup-readout-hero">
                    <div className="popup-hero-value">
                        <span className="hero-leading">0</span>
                        <span className="hero-main">{isPump ? detail.speed ?? 10 : (isValve && detail.isOpen ? 100 : 0)}</span>
                        <span className="hero-unit">%</span>
                    </div>
                    <div className="popup-hero-name">{detail.name}</div>
                </div>

                {/* ─── Icon ─── */}
                <div className="popup-icon-area">
                    {isPump && <PumpSvgIcon />}
                    {isValve && <ValveSvgIcon isOpen={detail.isOpen ?? true} />}
                    {detail.type === 'heatExchanger' && <HeatExchangerSvgIcon />}
                </div>

                {/* ─── Mode Selector (Pump) ─── */}
                {isPump && (
                    <>
                        <div className="popup-mode-selector">
                            {(['Off', 'Manual', 'Auto'] as PumpMode[]).map(m => (
                                <button
                                    key={m}
                                    className={`mode-btn ${detail.mode === m ? 'active' : ''}`}
                                    onClick={() => onModeChange?.(m)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="popup-mode-label">Pump state</div>
                    </>
                )}

                {/* ─── Valve Toggle ─── */}
                {isValve && (
                    <div className="popup-mode-selector">
                        <button
                            className={`mode-btn ${!detail.isOpen ? 'active' : ''}`}
                            onClick={() => onToggle?.()}
                        >
                            Closed
                        </button>
                        <button
                            className={`mode-btn ${detail.isOpen ? 'active' : ''}`}
                            onClick={() => onToggle?.()}
                        >
                            Open
                        </button>
                    </div>
                )}

                {/* ─── Speed Control (Pump) ─── */}
                {isPump && (
                    <>
                        <div className="popup-speed-control">
                            <button className="speed-btn" onClick={() => onSpeedChange?.(-10)}>«</button>
                            <button className="speed-btn" onClick={() => onSpeedChange?.(-1)}>‹</button>
                            <div className="speed-display">{detail.speed ?? 10}%</div>
                            <button className="speed-btn" onClick={() => onSpeedChange?.(1)}>›</button>
                            <button className="speed-btn" onClick={() => onSpeedChange?.(10)}>»</button>
                        </div>
                        <div className="speed-labels">
                            <span>-10</span><span>-1</span><span>Speed</span><span>+1</span><span>+10</span>
                        </div>
                    </>
                )}

                {/* ─── Readouts (Pump) ─── */}
                {isPump && detail.readouts && (
                    <>
                        <div className="popup-readouts-section-label">READOUTS</div>
                        <div className="popup-readouts-grid">
                            <div className="readout-item">
                                <span className="readout-num">0<b>{detail.readouts.speed}</b></span>
                                <span className="readout-info">Speed<br /><span className="readout-unit">rpm</span></span>
                            </div>
                            <div className="readout-item">
                                <span className="readout-num">0<b>{detail.readouts.current}</b></span>
                                <span className="readout-info">Current<br /><span className="readout-unit">A</span></span>
                            </div>
                            <div className="readout-item">
                                <span className="readout-num">0<b>{detail.readouts.power}</b></span>
                                <span className="readout-info">Power<br /><span className="readout-unit">kW</span></span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ComponentDetailPopup;
