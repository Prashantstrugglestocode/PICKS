import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Play, Activity, Grid, Zap, BookOpen, ArrowLeft, ChevronRight, Cpu, Database, Layers } from 'lucide-react';

export function DocumentationPage() {
    const navigate = useNavigate();

    return (
        <div className="doc-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-gradient)',
            color: 'var(--text-primary)',
            paddingTop: '100px',
            paddingBottom: '80px'
        }}>
            <div className="doc-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header Section */}
                <div className="doc-header" style={{
                    marginBottom: '60px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        className="secondary-btn"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px'
                        }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        User Guide
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Master the simulator. Learn how to configure parameters, run traces, and interpret the visualizations.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="doc-grid" style={{ display: 'grid', gap: '40px' }}>

                    <DocSection
                        icon={<Settings size={32} color="#3b82f6" />}
                        title="1. Configuration"
                        subtitle="Setup your cache architecture"
                    >
                        <p>
                            Before running a simulation, customize the cache parameters in the <strong>Config Panel</strong> on the left.
                        </p>
                        <div className="feature-list">
                            <FeatureItem label="Sets" desc="Number of sets (must be power of 2)." />
                            <FeatureItem label="Ways" desc="Associativity (1 = Direct Mapped, 2+ = Set Associative)." />
                            <FeatureItem label="Block Size" desc="Size of each cache block in bytes." />
                            <FeatureItem label="Trace" desc="Enter hex addresses (e.g., 100, 104) or generate random." />
                        </div>
                    </DocSection>

                    <DocSection
                        icon={<Play size={32} color="#10b981" />}
                        title="2. Simulation Controls"
                        subtitle="Execute and debug memory accesses"
                    >
                        <p>Control the flow of the simulation using the playback toolbar:</p>
                        <div className="controls-grid">
                            <ControlItem label="Step" desc="Execute one access at a time." />
                            <ControlItem label="Run All" desc="Process entire trace instantly." />
                            <ControlItem label="Play/Pause" desc="Auto-step with delay." />
                            <ControlItem label="Reset" desc="Clear cache and restart." />
                        </div>
                    </DocSection>

                    <DocSection
                        icon={<Grid size={32} color="#f59e0b" />}
                        title="3. Visualizations"
                        subtitle="Understanding the visual feedback"
                    >
                        <div className="viz-explained">
                            <div className="viz-item">
                                <h3><Grid size={20} /> Visual Grid</h3>
                                <p>Represents the cache state. Blocks change color based on activity:</p>
                                <ul>
                                    <li style={{ color: '#2ecc71' }}>● Green Border: Hit</li>
                                    <li style={{ color: '#e74c3c' }}>● Red Border: Miss</li>
                                    <li style={{ color: '#f1c40f' }}>● Yellow Glow: LRU Candidate</li>
                                </ul>
                            </div>
                            <div className="viz-item">
                                <h3><Activity size={20} /> Data Flow</h3>
                                <p>Animated diagram showing data movement between CPU, L1, L2, and RAM. Watch for "Hit" and "Miss" badges traveling along the bus.</p>
                            </div>
                        </div>
                    </DocSection>

                    <DocSection
                        icon={<Zap size={32} color="#8b5cf6" />}
                        title="4. Metrics & Analysis"
                        subtitle="Quantify performance and efficiency"
                    >
                        <div className="metrics-showcase">
                            <MetricCard label="Hit Rate" value="%" desc="Percentage of accesses found in cache." />
                            <MetricCard label="AMAT" value="ns" desc="Average Memory Access Time." />
                            <MetricCard label="Energy" value="pJ" desc="Dynamic energy consumption." />
                        </div>
                    </DocSection>

                </div>

                {/* Footer CTA */}
                <div className="doc-footer" style={{
                    marginTop: '80px',
                    padding: '40px',
                    background: 'var(--glass-bg)',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Ready to dive deeper?</h3>
                    <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>Explore the theoretical concepts behind caching.</p>
                    <Link to="/theory" className="primary-btn" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                        <BookOpen size={20} /> Read Theory
                    </Link>
                </div>
            </div>

            <style>{`
                .doc-block {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 40px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .doc-block:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .feature-list, .controls-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 24px;
                }
                .feature-item, .control-item {
                    background: rgba(255,255,255,0.05);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                }
                .viz-explained {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 24px;
                }
                .viz-item {
                    background: rgba(255,255,255,0.05);
                    padding: 24px;
                    border-radius: 16px;
                    border: 1px solid var(--glass-border);
                }
                .viz-item h3 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                }
                .viz-item ul {
                    list-style: none;
                    padding: 0;
                    margin-top: 12px;
                }
                .viz-item li {
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .metrics-showcase {
                    display: flex;
                    gap: 20px;
                    margin-top: 24px;
                    flex-wrap: wrap;
                }
                .metric-mini {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid var(--glass-border);
                    text-align: center;
                }
                @media (max-width: 768px) {
                    .viz-explained { grid-template-columns: 1fr; }
                    .doc-header h1 { fontSize: 2rem; }
                    .doc-header button { position: static; transform: none; margin-bottom: 20px; }
                }
            `}</style>
        </div>
    );
}

function DocSection({ icon, title, subtitle, children }) {
    return (
        <div className="doc-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    display: 'flex'
                }}>
                    {icon}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{subtitle}</p>
                </div>
            </div>
            <div className="doc-content" style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>
                {children}
            </div>
        </div>
    );
}

function FeatureItem({ label, desc }) {
    return (
        <div className="feature-item">
            <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--accent-color)' }}>{label}</strong>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{desc}</span>
        </div>
    );
}

function ControlItem({ label, desc }) {
    return (
        <div className="control-item">
            <strong style={{ display: 'block', marginBottom: '4px' }}>{label}</strong>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{desc}</span>
        </div>
    );
}

function MetricCard({ label, value, desc }) {
    return (
        <div className="metric-mini">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', margin: '8px 0', color: 'var(--text-primary)' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</div>
        </div>
    );
}
