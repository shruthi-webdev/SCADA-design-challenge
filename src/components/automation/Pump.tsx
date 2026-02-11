import React from 'react';
import './Pump.css';

interface PumpProps {
    state?: 'on' | 'off' | 'standby';
    speed?: number;
    label?: string;
}

export const Pump: React.FC<PumpProps> = ({
    state = 'off',
    speed,
    label
}) => {
    return (
        <div className={`pump pump-${state}`}>
            <div className="pump-icon">
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="16" cy="16" r="8" fill="currentColor" />
                    {state === 'on' && (
                        <path d="M16 8 L16 4 M16 28 L16 24 M8 16 L4 16 M28 16 L24 16"
                            stroke="currentColor" strokeWidth="2" />
                    )}
                </svg>
                {state === 'on' && (
                    <div className="pump-indicator">
                        <svg width="8" height="8" viewBox="0 0 8 8">
                            <polygon points="4,0 8,8 0,8" fill="currentColor" />
                        </svg>
                    </div>
                )}
            </div>
            {speed !== undefined && (
                <div className="pump-speed">
                    <span className="pump-speed-value">{speed}</span>
                    <span className="pump-speed-unit">%</span>
                </div>
            )}
            {label && <span className="pump-label"># {label}</span>}
        </div>
    );
};

export default Pump;
