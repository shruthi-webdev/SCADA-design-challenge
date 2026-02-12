import React, { useState, useMemo } from 'react';
import './HelpView.css';

/* ─── FAQ Data ─── */
interface FaqItem { q: string; a: string; category: string }

const faqData: FaqItem[] = [
    { category: 'General', q: 'What is Teknotherm SCADA?', a: 'Teknotherm SCADA is a Supervisory Control and Data Acquisition platform designed for marine water system automation. It provides real-time monitoring, control, and alerting for pumps, valves, tanks, and transfer systems aboard vessels.' },
    { category: 'General', q: 'What browsers are supported?', a: 'The platform supports all modern browsers including Chrome (v90+), Firefox (v88+), Edge (v90+), and Safari (v14+). For the best experience, we recommend using the latest version of Chrome or Edge.' },
    { category: 'General', q: 'Can I use the system on a tablet or mobile device?', a: 'The SCADA interface is optimized for desktop and large-screen displays used in control rooms. While basic monitoring is accessible on tablets, full control functionality requires a screen width of at least 1024px.' },
    { category: 'Dashboard', q: 'How do I read the water system dashboard?', a: 'The water system dashboard displays a schematic view of all connected equipment. Tanks show current fill levels as percentages, pumps display their operational status (running/stopped), and valves indicate open/closed state. Color coding is used: green for normal operation, yellow for warnings, and red for alarms.' },
    { category: 'Dashboard', q: 'What do the different component colors mean?', a: 'Green indicates normal operation within safe parameters. Yellow/amber shows a warning condition — the component is operating but approaching a threshold. Red signals an alarm — immediate attention is required. Gray indicates the component is offline or in maintenance mode.' },
    { category: 'Alerts', q: 'How do I acknowledge an alert?', a: 'Navigate to the Alerts page from the sidebar. Active alerts are shown in the alert list. Click on an alert to view its details, then click the "Acknowledge" button. Acknowledged alerts remain visible until the underlying condition is resolved.' },
    { category: 'Alerts', q: 'Can I configure custom alert thresholds?', a: 'Yes, go to Settings → Water System Automation → Alert Thresholds. You can configure high/low level warnings for tanks, maximum pump temperatures, and pressure relief limits. Changes take effect immediately after saving.' },
    { category: 'Transfer', q: 'How do I initiate a water transfer?', a: 'Open the Transfer page from the sidebar. Select the source and destination tanks, configure the transfer parameters (flow rate, volume), and start the transfer. The system will monitor the process and automatically stop when the target volume is reached or if any safety limit is triggered.' },
    { category: 'Transfer', q: 'Can a transfer be stopped mid-operation?', a: 'Yes, any active transfer can be stopped immediately by clicking the "Emergency Stop" button on the Transfer page. This will close all transfer valves and stop the associated pumps. The action is logged in the audit trail.' },
    { category: 'Account', q: 'How do I change my password?', a: 'Go to Settings → Profile and click "Edit Profile." From there, select "Change Password." You will need to enter your current password and then the new password twice for confirmation. Passwords must be at least 12 characters and include uppercase, lowercase, numbers, and symbols.' },
    { category: 'Account', q: 'What user roles are available?', a: 'There are three roles: Administrator (full system access including user management and configuration), Operator (can monitor and control equipment but cannot change system settings), and Viewer (read-only access to dashboards and reports).' },
];

/* ─── Keyboard Shortcuts ─── */
const shortcuts = [
    { keys: ['Ctrl', 'D'], action: 'Go to Dashboard' },
    { keys: ['Ctrl', 'W'], action: 'Go to Water System' },
    { keys: ['Ctrl', 'T'], action: 'Go to Transfer' },
    { keys: ['Ctrl', 'A'], action: 'Go to Alerts' },
    { keys: ['Ctrl', ','], action: 'Open Settings' },
    { keys: ['Ctrl', '/'], action: 'Open Help' },
    { keys: ['Ctrl', 'Shift', 'D'], action: 'Toggle Dark Mode' },
    { keys: ['Esc'], action: 'Close dialog / popup' },
];

/* ═══════════════════════════════════════════════════════
   Help View
   ═══════════════════════════════════════════════════════ */

const HelpView: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaq = useMemo(() => {
        if (!searchQuery.trim()) return faqData;
        const q = searchQuery.toLowerCase();
        return faqData.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }, [searchQuery]);

    const toggleFaq = (idx: number) => setOpenFaq(prev => (prev === idx ? null : idx));

    return (
        <div className="help-view">
            {/* ── Header + Search ── */}
            <div className="help-header">
                <h1>Help Center</h1>
                <p>Find answers, learn the system, and get support</p>
                <div className="help-search-wrapper">
                    <span className="help-search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                    </span>
                    <input
                        className="help-search"
                        type="text"
                        placeholder="Search for help topics..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Quick Start Cards ── */}
            {!searchQuery && (
                <>
                    <h2 className="help-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" /></svg>
                        Getting Started
                    </h2>
                    <div className="help-quickstart">
                        <div className="help-quickstart-card">
                            <div className="help-quickstart-icon" style={{ background: 'linear-gradient(135deg, #0066cc, #0050b4)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
                            </div>
                            <h3>Dashboard Overview</h3>
                            <p>Learn to navigate and read the main dashboard</p>
                        </div>
                        <div className="help-quickstart-card">
                            <div className="help-quickstart-icon" style={{ background: 'linear-gradient(135deg, #00897b, #00695c)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" /></svg>
                            </div>
                            <h3>Water System</h3>
                            <p>Monitor and control the water automation system</p>
                        </div>
                        <div className="help-quickstart-card">
                            <div className="help-quickstart-icon" style={{ background: 'linear-gradient(135deg, #e53935, #c62828)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
                            </div>
                            <h3>Alert System</h3>
                            <p>Understand and respond to system alerts</p>
                        </div>
                        <div className="help-quickstart-card">
                            <div className="help-quickstart-icon" style={{ background: 'linear-gradient(135deg, #fb8c00, #ef6c00)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" /></svg>
                            </div>
                            <h3>Transfer Operations</h3>
                            <p>Set up and manage water transfers between tanks</p>
                        </div>
                    </div>
                </>
            )}

            {/* ── FAQ Section ── */}
            <h2 className="help-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                Frequently Asked Questions
            </h2>
            <div className="help-faq-list">
                {filteredFaq.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--obc-text-secondary)' }}>
                        No results found for "{searchQuery}". Try a different search term.
                    </div>
                )}
                {filteredFaq.map((faq, idx) => (
                    <div key={idx} className={`help-faq-item ${openFaq === idx ? 'open' : ''}`}>
                        <button className="help-faq-question" onClick={() => toggleFaq(idx)}>
                            <span><span style={{ color: 'var(--obc-text-secondary)', fontSize: 11, marginRight: 8 }}>{faq.category}</span>{faq.q}</span>
                            <svg className="help-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
                        </button>
                        {openFaq === idx && (
                            <div className="help-faq-answer">{faq.a}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Keyboard Shortcuts ── */}
            {!searchQuery && (
                <>
                    <h2 className="help-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" /></svg>
                        Keyboard Shortcuts
                    </h2>
                    <table className="help-shortcuts-table">
                        <thead>
                            <tr><th>Shortcut</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {shortcuts.map((s, i) => (
                                <tr key={i}>
                                    <td>{s.keys.map((k, ki) => (
                                        <React.Fragment key={ki}>
                                            {ki > 0 && <span style={{ margin: '0 4px', color: 'var(--obc-text-secondary)' }}>+</span>}
                                            <kbd className="help-kbd">{k}</kbd>
                                        </React.Fragment>
                                    ))}</td>
                                    <td>{s.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* ── Contact Support ── */}
            {!searchQuery && (
                <>
                    <h2 className="help-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                        Contact Support
                    </h2>
                    <div className="help-contact-grid">
                        <div className="help-contact-card">
                            <div className="help-contact-icon" style={{ background: 'linear-gradient(135deg, #0066cc, #0050b4)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                            </div>
                            <div className="help-contact-info">
                                <h4>Email Support</h4>
                                <p><a href="mailto:support@teknotherm.no">support@teknotherm.no</a></p>
                                <p>Response within 24 hours</p>
                            </div>
                        </div>
                        <div className="help-contact-card">
                            <div className="help-contact-icon" style={{ background: 'linear-gradient(135deg, #00897b, #00695c)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                            </div>
                            <div className="help-contact-info">
                                <h4>Phone Support</h4>
                                <p>+47 22 33 44 55</p>
                                <p>Mon–Fri, 08:00–17:00 CET</p>
                            </div>
                        </div>
                        <div className="help-contact-card">
                            <div className="help-contact-icon" style={{ background: 'linear-gradient(135deg, #e53935, #c62828)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>
                            <div className="help-contact-info">
                                <h4>Emergency (24/7)</h4>
                                <p>+47 800 55 999</p>
                                <p>Critical system failures only</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Footer ── */}
            <div className="help-footer">
                Teknotherm SCADA v3.2.1 · Documentation last updated February 2026
            </div>
        </div>
    );
};

export default HelpView;
