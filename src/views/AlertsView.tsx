import React, { useState } from 'react';
import './AlertsView.css';

// Alert severity types
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface AlertEntry {
    id: number;
    severity: AlertSeverity;
    source: string;
    cause: string;
    tagId: string;
    time: string;
    date: string;
    pinned: boolean;
    acknowledged: boolean;
}

// Generate sample alert data
const generateAlerts = (): AlertEntry[] => {
    const severities: AlertSeverity[] = ['critical', 'critical', 'critical', 'high', 'medium', 'medium', 'medium', 'low', 'low', 'low', 'info', 'info', 'info', 'info', 'info', 'info'];
    return severities.map((severity, i) => ({
        id: i + 1,
        severity,
        source: 'GPS',
        cause: 'Loss of position',
        tagId: '#000000',
        time: '09:12:45',
        date: 'Today',
        pinned: i === 4 || i === 5,
        acknowledged: i < 3 || i === 4 || i === 5 || i === 6,
    }));
};

const severityIcon = (severity: AlertSeverity) => {
    switch (severity) {
        case 'critical':
            return (
                <span className="alert-icon alert-icon-critical">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21z" fill="#d32f2f" />
                        <path d="M12 16h.01M12 10v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>
            );
        case 'high':
            return (
                <span className="alert-icon alert-icon-high">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21z" fill="#f57c00" />
                        <path d="M12 16h.01M12 10v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>
            );
        case 'medium':
            return (
                <span className="alert-icon alert-icon-medium">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#f9a825" />
                        <path d="M12 16h.01M12 8v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>
            );
        case 'low':
            return (
                <span className="alert-icon alert-icon-low">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#ef5350" />
                        <path d="M12 16h.01M12 8v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>
            );
        default:
            return (
                <span className="alert-icon alert-icon-info">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#ef5350" />
                        <path d="M12 16h.01M12 8v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>
            );
    }
};

const PinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
);

export const AlertsView: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertEntry[]>(generateAlerts);
    const [selectedId, setSelectedId] = useState<number | null>(1);

    const selectedAlert = alerts.find(a => a.id === selectedId) || null;

    const acknowledgeAlert = (id: number) => {
        setAlerts(prev =>
            prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)
        );
    };

    const acknowledgeAll = () => {
        setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    };

    const pinnedAlerts = alerts.filter(a => a.pinned);

    return (
        <div className="alerts-view">
            {/* ─── Main Table ─── */}
            <div className="alerts-main">
                <div className="alerts-table">
                    {/* Header Row */}
                    <div className="alerts-header-row">
                        <div className="alerts-col-icon"></div>
                        <div className="alerts-col-source">Source</div>
                        <div className="alerts-col-cause">Cause</div>
                        <div className="alerts-col-tagid">Tag ID</div>
                        <div className="alerts-col-time">Time (UTC)</div>
                        <div className="alerts-col-pin">Pin</div>
                        <div className="alerts-col-ack">Ack</div>
                    </div>

                    {/* Data Rows */}
                    <div className="alerts-body">
                        {alerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`alerts-row ${selectedId === alert.id ? 'selected' : ''}`}
                                onClick={() => setSelectedId(alert.id)}
                            >
                                <div className="alerts-col-icon">{severityIcon(alert.severity)}</div>
                                <div className="alerts-col-source">{alert.source}</div>
                                <div className="alerts-col-cause">{alert.cause}</div>
                                <div className="alerts-col-tagid">{alert.tagId}</div>
                                <div className="alerts-col-time">
                                    {alert.time}&nbsp;&nbsp;{alert.date}
                                </div>
                                <div className="alerts-col-pin">
                                    {alert.pinned && <PinIcon />}
                                </div>
                                <div className="alerts-col-ack">
                                    {!alert.acknowledged ? (
                                        <button
                                            className="ack-btn"
                                            onClick={(e) => { e.stopPropagation(); acknowledgeAlert(alert.id); }}
                                        >ACK</button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Bottom Toolbar ─── */}
                <div className="alerts-toolbar">
                    <div className="alerts-toolbar-left">
                        <button className="toolbar-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        </button>
                        <button className="toolbar-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        </button>
                        <button className="toolbar-btn filter-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>
                            <span>Filters</span>
                        </button>
                    </div>
                    <div className="alerts-toolbar-right">
                        <button className="toolbar-btn mute-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                            <span>Mute</span>
                        </button>
                        <button className="toolbar-btn ack-all-btn" onClick={acknowledgeAll}>
                            Ack all visible
                        </button>
                        <button className="toolbar-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Right Side Panel ─── */}
            <div className="alerts-detail">
                {selectedAlert ? (
                    <>
                        <div className="detail-header">
                            <span className="detail-header-icon">⚙</span>
                            <span>Selected</span>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-header">
                                <span className="detail-severity">
                                    {severityIcon(selectedAlert.severity)}
                                </span>
                                <span className="detail-title">Radar</span>
                                <div className="detail-actions-mini">
                                    <PinIcon />
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
                                        <path d="M7 14l5-5 5 5H7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="detail-description">Crossing Safety Contour</div>
                            <div className="detail-sub-label">Details</div>
                            <div className="detail-sub-value">Check ahead on the DISP</div>

                            <div className="detail-meta-row">
                                <div className="detail-meta">
                                    <span className="detail-meta-label">Priority</span>
                                    <span className="detail-meta-value">Alarm</span>
                                </div>
                                <div className="detail-meta">
                                    <span className="detail-meta-label">Alert ID</span>
                                    <span className="detail-meta-value">3036</span>
                                </div>
                                <div className="detail-meta">
                                    <span className="detail-meta-label">Category</span>
                                    <span className="detail-meta-value">B</span>
                                </div>
                            </div>

                            <div className="detail-sub-label">Time updated</div>
                            <div className="detail-sub-value">Today 09:12:45</div>

                            <div className="detail-btn-row">
                                <button className="detail-btn">ACK</button>
                                <button className="detail-btn detail-btn-outline">Shelf</button>
                            </div>
                        </div>

                        {/* Pinned Section */}
                        <div className="detail-header" style={{ marginTop: '16px' }}>
                            <span className="detail-header-icon">
                                <PinIcon />
                            </span>
                            <span>Pinned</span>
                        </div>
                        {pinnedAlerts.map(pa => (
                            <div key={pa.id} className="pinned-item">
                                <span className="pinned-severity">{severityIcon(pa.severity)}</span>
                                <span className="pinned-title">Title</span>
                                <div className="pinned-actions">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}>
                                        <path d="M7 14l5-5 5 5H7z" />
                                    </svg>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}>
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="detail-empty">Select an alert to view details</div>
                )}
            </div>
        </div>
    );
};

export default AlertsView;
