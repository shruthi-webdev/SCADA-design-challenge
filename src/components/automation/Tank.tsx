import React from 'react';
import './Tank.css';

interface TankProps {
    level: number; // 0-100 percentage
    capacity?: string;
    current?: string;
    tag?: string;
    showIcon?: boolean;
}

export const Tank: React.FC<TankProps> = ({
    level,
    capacity,
    current,
    tag,
    showIcon = true
}) => {
    return (
        <div className="tank">
            {showIcon && (
                <div className="tank-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M4 8 L20 8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
            )}
            <div className="tank-value">
                <span className="tank-level">
                    <span className="tank-chevron">⌄</span>
                    <span className="tank-percentage">
                        <span className="tank-number">0{level}</span>
                        <span className="tank-percent">%</span>
                    </span>
                </span>
                {capacity && current && (
                    <span className="tank-capacity">{current} / {capacity}</span>
                )}
            </div>
            <div className="tank-visual">
                <div className="tank-fill" style={{ height: `${level}%` }} />
            </div>
            {tag && <span className="tank-tag">#{tag}</span>}
        </div>
    );
};

export default Tank;
