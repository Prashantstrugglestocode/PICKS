import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Play } from 'lucide-react';

export function RAMPage() {
    const navigate = useNavigate();

    return (
        <section className="view active">
            <div className="view-header">
                <button className="btn-back" onClick={() => navigate('/simulator')}>← Back to System</button>
                <h2>Main Memory (RAM)</h2>
            </div>
            <div className="ram-container glass-panel">
                <div className="ram-controls">
                    <input type="text" id="ramSearch" placeholder="Search Address (e.g., 0x1000)" />
                    <button className="btn-primary" id="ramSearchBtn">Go</button>
                </div>
                <div className="ram-grid" id="ramGrid">
                    <div className="empty-state" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        gridColumn: '1 / -1'
                    }}>
                        <Database size={64} style={{ marginBottom: '24px', opacity: 0.3, color: '#3b82f6' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>Memory Uninitialized</h3>
                        <p style={{ maxWidth: '400px', marginBottom: '32px', lineHeight: '1.6', fontSize: '1rem' }}>
                            The main memory is currently empty. Initialize the simulation to load data and visualize memory access patterns.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/l1')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
                        >
                            <Play size={18} fill="currentColor" /> Start Simulation
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
