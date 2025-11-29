import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Layers, Activity, BarChart2, ArrowRight } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="landing-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            paddingTop: '80px',
            transition: 'background 0.3s, color 0.3s'
        }}>
            {/* Hero Section */}
            <section className="hero" style={{
                textAlign: 'center',
                padding: '80px 20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    marginBottom: '24px',
                    lineHeight: '1.1',
                    background: 'linear-gradient(to right, var(--text-color), var(--text-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Master Computer Architecture<br />
                    <span style={{ color: '#3b82f6', WebkitTextFillColor: '#3b82f6' }}>Visually.</span>
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '800px',
                    margin: '0 auto 48px',
                    lineHeight: '1.6'
                }}>
                    An interactive, high-fidelity simulator for RISC-V cache hierarchies.
                    Visualize data flow, analyze power consumption, and debug memory access patterns in real-time.
                </p>
                <div className="cta-group" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/simulator" className="primary-btn" style={{
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                        transition: 'transform 0.2s'
                    }}>
                        Launch Simulator <ArrowRight size={20} />
                    </Link>
                    <Link to="/docs" className="secondary-btn" style={{
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        background: 'var(--glass-bg)',
                        color: 'var(--text-color)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        border: '1px solid var(--glass-border)',
                        transition: 'background 0.2s'
                    }}>
                        Read Documentation
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features" style={{
                padding: '80px 20px',
                background: 'var(--glass-bg)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: 'var(--text-color)' }}>What You Can Do</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        <FeatureCard
                            icon={<Layers size={32} color="#3b82f6" />}
                            title="Multi-Level Cache"
                            desc="Simulate L1 and L2 cache interactions with configurable parameters (sets, ways, block size)."
                        />
                        <FeatureCard
                            icon={<Activity size={32} color="#10b981" />}
                            title="Real-time Data Flow"
                            desc="Watch data packets travel between CPU, Caches, and RAM. See hits, misses, and evictions happen live."
                        />
                        <FeatureCard
                            icon={<Zap size={32} color="#f59e0b" />}
                            title="Power Analysis"
                            desc="Track dynamic and static energy consumption per operation. Optimize your code for energy efficiency."
                        />
                        <FeatureCard
                            icon={<BarChart2 size={32} color="#8b5cf6" />}
                            title="Performance Metrics"
                            desc="Analyze Hit Rates, AMAT (Average Memory Access Time), and Miss Penalties with detailed graphs."
                        />
                    </div>
                </div>
            </section>

            {/* Tech Stack / Footer */}
            <footer style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <p>Visually. • Interactive Architecture Simulator</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div style={{
            padding: '32px',
            background: 'var(--glass-bg)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            transition: 'transform 0.2s, background 0.2s'
        }} className="feature-card">
            <div style={{ marginBottom: '20px' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: '600', color: 'var(--text-color)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
