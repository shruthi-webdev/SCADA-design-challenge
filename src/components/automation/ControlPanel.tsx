import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    title,
    children,
    onClose,
    className = ''
}) => {
    return (
        <div className={`control-panel ${className}`}>
            <div className="control-panel-header">
                <span className="control-panel-title">{title}</span>
                <div className="control-panel-actions">
                    <button className="control-panel-menu" aria-label="Menu">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>
                    {onClose && (
                        <button className="control-panel-close" onClick={onClose} aria-label="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="control-panel-content">
                {children}
            </div>
        </div>
    );
};

export default ControlPanel;
