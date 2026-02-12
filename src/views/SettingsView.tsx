import React, { useState } from 'react';
import './SettingsView.css';

/* ─── Types ─── */
type SettingsSection = 'profile' | 'water' | 'users' | 'appearance' | 'notifications' | 'terms' | 'privacy' | 'about';

interface SettingsViewProps {
    isDark?: boolean;
    onToggleTheme?: () => void;
}

/* ─── Section menu items ─── */
const sectionItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    {
        id: 'profile', label: 'Profile',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
    },
    {
        id: 'water', label: 'Water System Automation',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" /></svg>,
    },
    {
        id: 'users', label: 'Authorize Users',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
    },
    {
        id: 'appearance', label: 'Appearance',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>,
    },
    {
        id: 'notifications', label: 'Notifications',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>,
    },
    {
        id: 'terms', label: 'Terms & Conditions',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>,
    },
    {
        id: 'privacy', label: 'Privacy Policy',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>,
    },
    {
        id: 'about', label: 'About',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>,
    },
];

/* ─── Mock data ─── */
const mockUsers = [
    { name: 'shruthi', email: 'shruthisvenkatesan@gmail.com', role: 'admin' as const, status: 'Active' },
    { name: 'Maria Jensen', email: 'm.jensen@teknotherm.no', role: 'operator' as const, status: 'Active' },
    { name: 'Lars Andersen', email: 'l.andersen@teknotherm.no', role: 'operator' as const, status: 'Active' },
    { name: 'Kari Olsen', email: 'k.olsen@teknotherm.no', role: 'viewer' as const, status: 'Inactive' },
    { name: 'Erik Nilsen', email: 'e.nilsen@teknotherm.no', role: 'viewer' as const, status: 'Active' },
];

/* ═══════════════════════════════════════════════════════
   Section Content Components
   ═══════════════════════════════════════════════════════ */

const ProfileSection: React.FC = () => (
    <>
        <div className="settings-content-header">
            <h2>Profile</h2>
            <p>Manage your personal information and account details</p>
        </div>

        <div className="settings-card">
            <div className="settings-profile">
                <div className="settings-avatar">JE</div>
                <div className="settings-profile-info">
                    <h3>shruthi</h3>
                    <p>shruthisvenkatesan@gmail.com</p>
                    <span className="role-badge">System Administrator</span>
                </div>
            </div>

            <div className="settings-form-row">
                <span className="settings-form-label">Full Name</span>
                <span className="settings-form-value">shruthi</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Email</span>
                <span className="settings-form-value">shruthisvenkatesan@gmail.com</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Department</span>
                <span className="settings-form-value">Marine Engineering</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Vessel</span>
                <span className="settings-form-value">MV Northern Star</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Last Login</span>
                <span className="settings-form-value">12 Feb 2026, 17:45</span>
            </div>
        </div>

        <button className="settings-btn settings-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            Edit Profile
        </button>
    </>
);

const WaterSystemSection: React.FC = () => {
    const [refreshInterval, setRefreshInterval] = useState('5');
    const [units, setUnits] = useState('metric');

    return (
        <>
            <div className="settings-content-header">
                <h2>Water System Automation</h2>
                <p>Configure system behavior, units, and automation thresholds</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z" /></svg>
                    System Configuration
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Data Refresh Interval
                        <small>How often sensor data is polled</small>
                    </span>
                    <select className="settings-select" value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)}>
                        <option value="1">1 second</option>
                        <option value="2">2 seconds</option>
                        <option value="5">5 seconds</option>
                        <option value="10">10 seconds</option>
                        <option value="30">30 seconds</option>
                    </select>
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Measurement Units
                        <small>System-wide unit preference</small>
                    </span>
                    <select className="settings-select" value={units} onChange={e => setUnits(e.target.value)}>
                        <option value="metric">Metric (°C, L, bar)</option>
                        <option value="imperial">Imperial (°F, gal, psi)</option>
                    </select>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Alert Thresholds</div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Tank High Level Warning
                        <small>Percentage at which a high-level alert fires</small>
                    </span>
                    <input className="settings-input" type="number" defaultValue={90} min={50} max={100} style={{ width: 80, textAlign: 'center' }} />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Tank Low Level Warning
                        <small>Percentage at which a low-level alert fires</small>
                    </span>
                    <input className="settings-input" type="number" defaultValue={15} min={0} max={50} style={{ width: 80, textAlign: 'center' }} />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Max Pump Temperature
                        <small>Temperature (°C) that triggers overheating alarm</small>
                    </span>
                    <input className="settings-input" type="number" defaultValue={85} min={40} max={120} style={{ width: 80, textAlign: 'center' }} />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Pressure Relief Limit
                        <small>Maximum operating pressure (bar)</small>
                    </span>
                    <input className="settings-input" type="number" defaultValue={6} min={1} max={15} step={0.5} style={{ width: 80, textAlign: 'center' }} />
                </div>
            </div>

            <button className="settings-btn settings-btn-primary">Save Configuration</button>
        </>
    );
};

const AuthorizeUsersSection: React.FC = () => (
    <>
        <div className="settings-content-header">
            <h2>Authorize Users</h2>
            <p>Manage system access and user permissions</p>
        </div>

        <div className="settings-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="settings-card-title" style={{ margin: 0 }}>Registered Users</div>
                <button className="settings-btn settings-btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    Invite User
                </button>
            </div>

            <table className="settings-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mockUsers.map((u, i) => (
                        <tr key={i}>
                            <td style={{ fontWeight: 500 }}>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className={`role-${u.role}`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
                            <td><span className={u.status === 'Active' ? 'user-status-active' : 'user-status-inactive'}>● {u.status}</span></td>
                            <td>
                                <button className="settings-btn settings-btn-secondary" style={{ height: 28, fontSize: 12, padding: '0 10px' }}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
);

const AppearanceSection: React.FC<{ isDark?: boolean; onToggleTheme?: () => void }> = ({ isDark, onToggleTheme }) => {
    const [fontSize, setFontSize] = useState('13');

    return (
        <>
            <div className="settings-content-header">
                <h2>Appearance</h2>
                <p>Customize the visual look and feel of the application</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Theme</div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Dark Mode
                        <small>Switch between light and dark interface</small>
                    </span>
                    <button
                        className={`settings-toggle ${isDark ? 'active' : ''}`}
                        onClick={onToggleTheme}
                        aria-label="Toggle dark mode"
                    />
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Typography</div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Base Font Size
                        <small>Adjusts text throughout the interface</small>
                    </span>
                    <select className="settings-select" value={fontSize} onChange={e => setFontSize(e.target.value)}>
                        <option value="11">Small (11px)</option>
                        <option value="13">Default (13px)</option>
                        <option value="15">Large (15px)</option>
                        <option value="17">Extra Large (17px)</option>
                    </select>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Accent Color</div>
                <div className="settings-color-options">
                    {['#0066cc', '#00897b', '#e53935', '#fb8c00', '#8e24aa', '#43a047'].map(c => (
                        <button
                            key={c}
                            className={`settings-color-swatch ${c === '#0066cc' ? 'active' : ''}`}
                            style={{ background: c }}
                            title={c}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

const NotificationsSection: React.FC = () => {
    const [alerts, setAlerts] = useState({ critical: true, warning: true, info: false });
    const [channels, setChannels] = useState({ email: true, sms: false, push: true, sound: true });

    return (
        <>
            <div className="settings-content-header">
                <h2>Notifications</h2>
                <p>Control how and when you receive system alerts</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Alert Categories</div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Critical Alerts
                        <small>Equipment failures, safety warnings</small>
                    </span>
                    <button
                        className={`settings-toggle ${alerts.critical ? 'active' : ''}`}
                        onClick={() => setAlerts(p => ({ ...p, critical: !p.critical }))}
                    />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Warnings
                        <small>Threshold breaches, maintenance reminders</small>
                    </span>
                    <button
                        className={`settings-toggle ${alerts.warning ? 'active' : ''}`}
                        onClick={() => setAlerts(p => ({ ...p, warning: !p.warning }))}
                    />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">
                        Informational
                        <small>Status changes, routine updates</small>
                    </span>
                    <button
                        className={`settings-toggle ${alerts.info ? 'active' : ''}`}
                        onClick={() => setAlerts(p => ({ ...p, info: !p.info }))}
                    />
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-title">Delivery Channels</div>
                <div className="settings-form-row">
                    <span className="settings-form-label">Email Notifications</span>
                    <button
                        className={`settings-toggle ${channels.email ? 'active' : ''}`}
                        onClick={() => setChannels(p => ({ ...p, email: !p.email }))}
                    />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">SMS Alerts</span>
                    <button
                        className={`settings-toggle ${channels.sms ? 'active' : ''}`}
                        onClick={() => setChannels(p => ({ ...p, sms: !p.sms }))}
                    />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">Push Notifications</span>
                    <button
                        className={`settings-toggle ${channels.push ? 'active' : ''}`}
                        onClick={() => setChannels(p => ({ ...p, push: !p.push }))}
                    />
                </div>
                <div className="settings-form-row">
                    <span className="settings-form-label">Audible Alarm</span>
                    <button
                        className={`settings-toggle ${channels.sound ? 'active' : ''}`}
                        onClick={() => setChannels(p => ({ ...p, sound: !p.sound }))}
                    />
                </div>
            </div>

            <button className="settings-btn settings-btn-primary">Save Preferences</button>
        </>
    );
};

const TermsSection: React.FC = () => (
    <>
        <div className="settings-content-header">
            <h2>Terms & Conditions</h2>
            <p>Teknotherm SCADA Platform — Terms of Service</p>
        </div>

        <div className="settings-card">
            <div className="settings-legal">
                <h4>1. Acceptance of Terms</h4>
                <p>By accessing and using the Teknotherm SCADA Platform ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Service.</p>

                <h4>2. License Grant</h4>
                <p>Teknotherm AS grants you a limited, non-exclusive, non-transferable, revocable license to use the Service solely for monitoring and controlling water system automation equipment aboard authorized vessels. This license does not include the right to modify, distribute, or create derivative works based on the Service.</p>

                <h4>3. User Responsibilities</h4>
                <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify Teknotherm immediately of any unauthorized use of your account. You shall not attempt to access systems, data, or networks beyond your authorized access level. All system commands executed through the platform are logged and auditable.</p>

                <h4>4. System Availability</h4>
                <p>The Service is provided on an "as-is" and "as-available" basis. Teknotherm makes no warranties regarding uptime, although we target 99.5% availability. Scheduled maintenance windows will be communicated in advance through the notifications system. Critical safety overrides remain functional independent of Service availability.</p>

                <h4>5. Data Collection and Telemetry</h4>
                <p>The Service collects operational data including sensor readings, system events, user actions, and performance metrics. This data is used for system optimization, predictive maintenance, and regulatory compliance. Data retention policies comply with applicable maritime regulations and GDPR requirements.</p>

                <h4>6. Limitation of Liability</h4>
                <p>Teknotherm shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of the Service. Total liability shall not exceed the fees paid for the Service during the twelve (12) months preceding the claim. Physical safety systems must never rely solely on the SCADA platform for critical operations.</p>

                <h4>7. Governing Law</h4>
                <p>These Terms are governed by the laws of Norway. Any disputes shall be submitted to the exclusive jurisdiction of the courts of Oslo, Norway.</p>

                <p style={{ marginTop: 20, fontStyle: 'italic' }}>Last updated: January 15, 2026</p>
            </div>
        </div>
    </>
);

const PrivacySection: React.FC = () => (
    <>
        <div className="settings-content-header">
            <h2>Privacy Policy</h2>
            <p>How we handle and protect your data</p>
        </div>

        <div className="settings-card">
            <div className="settings-legal">
                <h4>1. Information We Collect</h4>
                <p>We collect personal information provided during account creation (name, email, role), system interaction data (commands issued, pages visited, session duration), and operational telemetry from connected equipment (sensor readings, status changes, alarm events).</p>

                <h4>2. How We Use Your Information</h4>
                <p>Personal data is used for authentication, authorization, and audit trail maintenance. Operational data is processed for real-time monitoring, historical trend analysis, predictive maintenance algorithms, and regulatory reporting. We do not sell personal data to third parties.</p>

                <h4>3. Data Storage and Security</h4>
                <p>All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Data is stored in geographically distributed data centers within the European Economic Area. Access to personal data is restricted to authorized personnel on a need-to-know basis. Regular security audits are conducted by independent third parties.</p>

                <h4>4. Data Retention</h4>
                <p>Personal account data is retained for the duration of the service agreement plus 24 months. Operational telemetry is retained for 5 years in compliance with maritime safety regulations. Audit logs are retained for 7 years. You may request deletion of personal data subject to regulatory retention requirements.</p>

                <h4>5. Your Rights</h4>
                <p>Under GDPR, you have the right to access, rectify, erase, restrict processing, and port your personal data. You may withdraw consent at any time. To exercise these rights, contact our Data Protection Officer at dpo@teknotherm.no.</p>

                <h4>6. Cookies and Tracking</h4>
                <p>The platform uses essential cookies for session management and authentication. No third-party advertising cookies are used. Analytics cookies are used only with explicit consent and can be disabled in the Appearance settings.</p>

                <p style={{ marginTop: 20, fontStyle: 'italic' }}>Last updated: January 15, 2026</p>
            </div>
        </div>
    </>
);

const AboutSection: React.FC = () => (
    <>
        <div className="settings-content-header">
            <h2>About</h2>
            <p>System information and version details</p>
        </div>

        <div className="settings-card">
            <div className="settings-about-grid">
                <div className="settings-about-item">
                    <div className="label">Version</div>
                    <div className="value">3.2.1</div>
                </div>
                <div className="settings-about-item">
                    <div className="label">Build</div>
                    <div className="value">2026.02.10</div>
                </div>
                <div className="settings-about-item">
                    <div className="label">Protocol</div>
                    <div className="value">Modbus TCP</div>
                </div>
                <div className="settings-about-item">
                    <div className="label">Uptime</div>
                    <div className="value">45d 12h</div>
                </div>
            </div>
        </div>

        <div className="settings-card">
            <div className="settings-card-title">System Details</div>
            <div className="settings-form-row">
                <span className="settings-form-label">Platform</span>
                <span className="settings-form-value">Teknotherm SCADA v3</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">License</span>
                <span className="settings-form-value">Enterprise — Valid until Dec 2027</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Server</span>
                <span className="settings-form-value">scada-prod-eu-01.teknotherm.no</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Connected PLCs</span>
                <span className="settings-form-value">4 of 4 online</span>
            </div>
            <div className="settings-form-row">
                <span className="settings-form-label">Database</span>
                <span className="settings-form-value">PostgreSQL 16.2 — Healthy</span>
            </div>
        </div>

        <div className="settings-branding">
            <div className="settings-branding-logo">T</div>
            <div className="settings-branding-info">
                <h4>Teknotherm SCADA</h4>
                <p>© 2026 Teknotherm AS. All rights reserved.</p>
            </div>
        </div>
    </>
);

/* ═══════════════════════════════════════════════════════
   Main Settings View
   ═══════════════════════════════════════════════════════ */

const SettingsView: React.FC<SettingsViewProps> = ({ isDark, onToggleTheme }) => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

    const renderSection = () => {
        switch (activeSection) {
            case 'profile': return <ProfileSection />;
            case 'water': return <WaterSystemSection />;
            case 'users': return <AuthorizeUsersSection />;
            case 'appearance': return <AppearanceSection isDark={isDark} onToggleTheme={onToggleTheme} />;
            case 'notifications': return <NotificationsSection />;
            case 'terms': return <TermsSection />;
            case 'privacy': return <PrivacySection />;
            case 'about': return <AboutSection />;
        }
    };

    return (
        <div className="settings-view">
            <aside className="settings-sidebar">
                <div className="settings-sidebar-title">Settings</div>
                {sectionItems.map(item => (
                    <button
                        key={item.id}
                        className={`settings-sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(item.id)}
                    >
                        <span className="settings-sidebar-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </aside>
            <div className="settings-content">
                {renderSection()}
            </div>
        </div>
    );
};

export default SettingsView;
