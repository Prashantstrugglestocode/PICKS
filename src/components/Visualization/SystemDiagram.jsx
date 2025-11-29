import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Layers, Database } from 'lucide-react';

export function SystemDiagram() {
    const navigate = useNavigate();

    return (
        <section className="view active">
            <div className="system-diagram-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>System Architecture Overview</h2>
                    <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        Explore the complete memory hierarchy from the CPU Core down to Main Memory.
                        Click on any component to inspect its internal state, view access logs, and analyze performance metrics.
                    </p>
                </div>

                <div className="system-diagram" style={{ margin: '60px 0' }}>
                    <div className="sys-component cpu-unit" onClick={() => navigate('/cpu')}>
                        <div className="icon">
                            <Cpu size={48} strokeWidth={1.5} />
                        </div>
                        <h3>CPU Core</h3>
                        <div className="stats-mini">
                            <div>PC: <span id="sys-pc">0x1000</span></div>
                        </div>
                        <div className="hover-hint">Click to Inspect</div>
                    </div>

                    <div className="sys-bus bus-l1">
                        <div className="bus-arrow"></div>
                    </div>

                    <div className="sys-component cache-unit l1-cache" onClick={() => navigate('/l1')}>
                        <div className="icon">
                            <Zap size={48} strokeWidth={1.5} />
                        </div>
                        <h3>L1 Cache</h3>
                        <div className="stats-mini">
                            <div>Hit Rate: <span id="sys-l1-hit">0%</span></div>
                        </div>
                        <div className="hover-hint">Click to Inspect</div>
                    </div>

                    <div className="sys-bus bus-l2">
                        <div className="bus-arrow"></div>
                    </div>

                    <div className="sys-component cache-unit l2-cache" onClick={() => navigate('/l2')}>
                        <div className="icon">
                            <Layers size={48} strokeWidth={1.5} />
                        </div>
                        <h3>L2 Cache</h3>
                        <div className="stats-mini">
                            <div>Hit Rate: <span id="sys-l2-hit">0%</span></div>
                        </div>
                        <div className="hover-hint">Click to Inspect</div>
                    </div>

                    <div className="sys-bus bus-ram">
                        <div className="bus-arrow"></div>
                    </div>

                    <div className="sys-component ram-unit" onClick={() => navigate('/ram')}>
                        <div className="icon">
                            <Database size={48} strokeWidth={1.5} />
                        </div>
                        <h3>Main Memory</h3>
                        <div className="stats-mini">
                            <div>Size: 4GB</div>
                        </div>
                        <div className="hover-hint">Click to Inspect</div>
                    </div>
                </div>

                <div className="global-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '60px' }}>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/l1')}
                        style={{
                            padding: '16px 40px',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderRadius: '50px',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <Zap size={24} fill="currentColor" /> Start Simulation (L1 View)
                    </button>
                </div>

                <div className="info-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginTop: '40px'
                }}>
                    <InfoCard title="How it Works" icon={<Cpu size={24} color="#3b82f6" />}>
                        The CPU issues memory requests (Loads/Stores). These requests traverse the hierarchy, checking L1, then L2, and finally RAM.
                    </InfoCard>
                    <InfoCard title="Visual Feedback" icon={<Zap size={24} color="#10b981" />}>
                        Watch the data flow animations to see hits and misses in real-time. Green indicates a hit, while red indicates a miss.
                    </InfoCard>
                    <InfoCard title="Performance" icon={<Database size={24} color="#f59e0b" />}>
                        Monitor Hit Rates and AMAT (Average Memory Access Time) to understand the efficiency of your cache configuration.
                    </InfoCard>
                </div>
            </div>
        </section>
    );
}

function InfoCard({ title, icon, children }) {
    return (
        <div style={{
            background: 'var(--glass-bg)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {icon}
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{children}</p>
        </div>
    );
}
