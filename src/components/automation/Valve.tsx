import React from 'react';
import './Valve.css';

interface ValveProps {
    type?: 'two-way' | 'three-way' | 'digital';
    state?: 'open' | 'closed' | 'partial';
    label?: string;
    rotation?: number;
}

export const Valve: React.FC<ValveProps> = ({
    type = 'two-way',
    state = 'open',
    label,
    rotation = 0
}) => {
    const getValveIcon = () => {
        if (type === 'three-way') {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${rotation}deg)` }}>
                    <path d="M4 12 L12 4 L20 12 L12 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="12" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        }
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${rotation}deg)` }}>
                <path d="M4 8 L4 16 L12 12 Z" fill="currentColor" />
                <path d="M20 8 L20 16 L12 12 Z" fill="currentColor" />
                <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    };

    return (
        <div className={`valve valve-${type} valve-${state}`}>
            {getValveIcon()}
            {label && <span className="valve-label">{label}</span>}
        </div>
    );
};

export default Valve;
