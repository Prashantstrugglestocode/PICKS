import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Activity } from 'lucide-react';

import { ConfigPanel } from '../Dashboard/ConfigPanel';
import { DashboardGrid } from '../Dashboard/DashboardGrid';
import { useSimulatorContext } from '../../context/SimulatorContext';
import { SignalWaveforms } from '../Visualization/SignalWaveforms';
import { AccessTimeline } from '../Visualization/AccessTimeline';
import { PowerMixChart } from '../Visualization/PowerMixChart';

import { VisualGrid } from '../Visualization/VisualGrid';
import { DataFlowDiagram } from '../Visualization/DataFlowDiagram';

export function L1Page({ level = 'L1' }) {
    const navigate = useNavigate();
    const {
        sim, stats, l2Stats, powerStats, logs,
        cacheState, l2CacheState,
        step, reset, configure,
        historyLength, viewStep, jumpToStep, play, pause, isPlaying, stepIndex,
        addressSequence, setAddressSequence
    } = useSimulatorContext();

    // Select data based on level
    const currentCacheState = level === 'L1' ? cacheState : l2CacheState;
    const currentStats = level === 'L1' ? stats : l2Stats;

    // Helper to calculate hit rate safely
    const hitRate = currentStats.accesses > 0
        ? ((currentStats.hits / currentStats.accesses) * 100).toFixed(1)
        : '0.0';

    const [activeTab, setActiveTab] = React.useState('grid');
    const [zoom, setZoom] = useState(1);
    const [selectedLogIndex, setSelectedLogIndex] = useState(-1);

    // Auto-select latest log when logs update, unless user manually selected one
    // Actually, for "Play" mode, we want to follow the latest log.
    // But if user clicks a row, we stay there?
    // Let's make it simple: If playing, always follow latest. If paused, allow selection.
    // Or just default to latest if index is out of bounds or -1.

    const effectiveLogIndex = selectedLogIndex === -1 || selectedLogIndex >= logs.length ? logs.length - 1 : selectedLogIndex;
    const selectedLog = logs[effectiveLogIndex];

    // Reset selection on reset
    React.useEffect(() => {
        if (logs.length === 0) setSelectedLogIndex(-1);
        else if (isPlaying) setSelectedLogIndex(-1); // Follow live when playing
    }, [logs.length, isPlaying]);

    return (
        <section className="view active">
            {/* ... header ... */}
            <div className="view-header">
                <button className="btn-back" onClick={() => navigate('/simulator')}>← Back to System</button>
                <h2>{level} Cache Detail</h2>
            </div>

            <div className="main-grid">
                {/* ... ConfigPanel and DashboardGrid ... */}
                <ConfigPanel
                    onStep={step}
                    onReset={reset}
                    onConfigure={configure}
                    sim={sim}
                    historyLength={historyLength}
                    viewStep={viewStep}
                    onJumpToStep={jumpToStep}
                    onPlay={play}
                    onPause={pause}
                    isPlaying={isPlaying}
                    stepIndex={stepIndex}
                    addressSequence={addressSequence}
                    setAddressSequence={setAddressSequence}
                />

                <DashboardGrid stats={currentStats} powerStats={powerStats} />

                {/* ... Waveforms and Insights ... */}
                <div className="waveform-row">
                    <div className="metric-card graylog-card full-width">
                        <div className="card-header">
                            <span className="card-label">Signal Waveforms</span>
                        </div>
                        <div className="card-body" style={{ height: '150px' }}>
                            <SignalWaveforms logs={logs} />
                        </div>
                    </div>
                </div>

                <div className="insight-grid">
                    <div className="metric-card graylog-card tall">
                        <div className="card-header">
                            <span className="card-label">Access Timeline</span>
                            <span className="pill live-pill">live</span>
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            <AccessTimeline logs={logs} />
                        </div>
                    </div>
                    <div className="metric-card graylog-card tall">
                        <div className="card-header">
                            <span className="card-label">Power Mix</span>
                            <div className="pill subtle">Stacked</div>
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            <PowerMixChart logs={logs} />
                        </div>
                    </div>
                </div>

                {/* Main Visualization Tabs */}
                <div className="viz-container glass-panel">
                    <div className="panel-header">
                        <h2>{level} Cache State Visualization</h2>
                        <div className="tabs">
                            <div className="zoom-control">
                                <label htmlFor="gridZoom" title="Zoom Grid">🔍</label>
                                <input
                                    type="range"
                                    id="gridZoom"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '30px' }}>{Math.round(zoom * 100)}%</span>
                            </div>
                            <button className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => setActiveTab('grid')}>Visual Grid</button>
                            <button className={`tab-btn ${activeTab === 'power' ? 'active' : ''}`} onClick={() => setActiveTab('power')}>Power Chart</button>
                            <button className={`tab-btn ${activeTab === 'misses' ? 'active' : ''}`} onClick={() => setActiveTab('misses')}>Miss Types</button>
                            <button className={`tab-btn ${activeTab === 'movement' ? 'active' : ''}`} onClick={() => setActiveTab('movement')}>Data Flow</button>
                        </div>
                    </div>
                    <div className="viz-content" style={{ overflow: 'auto', height: '100%', '--zoom-scale': zoom }}>
                        {activeTab === 'grid' && (
                            <div id="visualGrid" className="cache-grid-container">
                                <VisualGrid cacheState={currentCacheState} />
                            </div>
                        )}
                        {activeTab === 'power' && (
                            <div className="chart-wrapper" style={{ height: '300px', width: '100%' }}>
                                <PowerMixChart logs={logs} />
                            </div>
                        )}
                        {activeTab === 'misses' && (
                            <div className="chart-wrapper" style={{ height: '300px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Miss Type Breakdown</h3>
                                <div style={{ width: '220px', height: '220px' }}>
                                    <Doughnut
                                        data={{
                                            labels: ['Compulsory', 'Capacity', 'Conflict'],
                                            datasets: [{
                                                data: [
                                                    currentStats.compulsoryMisses || 0,
                                                    currentStats.capacityMisses || 0,
                                                    currentStats.conflictMisses || 0
                                                ],
                                                backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
                                                borderWidth: 0,
                                                cutout: '70%',
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: { color: '#aeb6bd', font: { size: 11 } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="stats-row" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '500' }}>Cold: {currentStats.compulsoryMisses || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '500' }}>Cap: {currentStats.capacityMisses || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '500' }}>Conf: {currentStats.conflictMisses || 0}</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'movement' && (
                            <div id="dataMovement" className="data-movement" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DataFlowDiagram log={selectedLog} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Logs */}
                <div className="logs-container glass-panel">
                    <div className="panel-header">
                        <h2>Access Log</h2>
                        <span style={{ fontSize: '0.8rem', color: '#a0a0a0', marginLeft: '10px' }}>(Click row to visualize)</span>
                    </div>
                    <div className="table-responsive">
                        <table id="resultsTable">
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Address</th>
                                    <th>Result</th>
                                    <th>Location</th>
                                    <th>Tag</th>
                                    <th>Energy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <Activity size={32} style={{ opacity: 0.5 }} />
                                                <span>No access logs yet. Run the simulation to see activity.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, i) => {
                                        const isALU = log.accessType === 'ALU';
                                        const isSelected = i === effectiveLogIndex;
                                        return (
                                            <tr
                                                key={i}
                                                onClick={() => setSelectedLogIndex(i)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                                    borderLeft: isSelected ? '4px solid var(--accent-color)' : '4px solid transparent'
                                                }}
                                            >
                                                <td>{log.step}</td>
                                                <td>{isALU ? '---' : `0x${log.address.toString(16).toUpperCase()}`}</td>
                                                <td className={isALU ? 'text-secondary' : (log.isHit ? 'success-text' : 'danger-text')}>
                                                    {isALU ? 'ALU' : (log.isHit ? 'HIT' : 'MISS')}
                                                </td>
                                                <td>{isALU ? '---' : `Set ${log.setIndex}, Way ${log.wayIndex}`}</td>
                                                <td>{isALU ? '---' : `0x${log.tag.toString(16).toUpperCase()}`}</td>
                                                <td>{log.energy.toFixed(2)} pJ</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
