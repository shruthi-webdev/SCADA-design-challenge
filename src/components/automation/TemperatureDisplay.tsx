import React from 'react';
import './TemperatureDisplay.css';

interface TemperatureDisplayProps {
    value: number;
    unit?: string;
    variant?: 'inline' | 'boxed';
}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
    value,
    unit = '°C',
    variant = 'boxed'
}) => {
    return (
        <div className={`temp-display ${variant}`}>
            <span className="temp-value">{value.toString().padStart(2, '0')}</span>
            <span className="temp-unit">{unit}</span>
        </div>
    );
};

export default TemperatureDisplay;
