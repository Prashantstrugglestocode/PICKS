import { useState } from 'react';
import { Info, Settings, Database, Cpu, Play, Pause, FastForward, RotateCcw, SkipForward, Activity, Zap } from 'lucide-react';
import { useTooltip } from '../../context/TooltipContext';

export function ConfigPanel({ onStep, onReset, onConfigure, sim, historyLength, viewStep, onJumpToStep, onPlay, onPause, isPlaying, stepIndex, addressSequence, setAddressSequence }) {
    const { showTooltip } = useTooltip();
    const [cacheSize, setCacheSize] = useState(sim.cacheSize || 1024);
    const [blockSize, setBlockSize] = useState(sim.blockSize || 32);
    const [associativity, setAssociativity] = useState(sim.associativity || 1);
    const [policy, setPolicy] = useState(sim.replacementPolicy || 'LRU');
    const [voltage, setVoltage] = useState(sim.voltage || 1.0);
    const [staticPower, setStaticPower] = useState(50);
    const [speed, setSpeed] = useState(1000);

    const getLines = () => addressSequence.split('\n').filter(l => l.trim());

    const handleStep = () => {
        const lines = getLines();
        if (stepIndex < lines.length) onStep(lines[stepIndex]);
    };

    const handlePlay = () => {
        if (isPlaying) onPause();
        else onPlay(getLines(), speed);
    };

    const handleRunAll = () => {
        const lines = getLines();
        for (let i = stepIndex; i < lines.length; i++) onStep(lines[i]);
    };

    const handleConfigure = () => {
        onConfigure({
            cacheSize,
            blockSize,
            associativity,
            replacementPolicy: policy,
            staticPower: staticPower,
            voltage: voltage
        });
        onReset();
    };

    const traces = {
        custom: `0x100\n0x104\nvar s = "Hello"\ns\n0x108`,
        sequential: `0x100\n0x104\n0x108\n0x10C\n0x110\n0x114\n0x118\n0x11C`,
        looping: `0x100\n0x104\n0x108\n0x100\n0x104\n0x108\n0x100\n0x104\n0x108`,
        random: `0x4A0\n0x120\n0x9F0\n0x040\n0x880\n0x3C0\n0x100\n0x550`,
        matrix: `0x100\n0x200\n0x300\n0x104\n0x204\n0x304\n0x108\n0x208\n0x308`,
        conflict: `0x000\n0x400\n0x800\n0xC00\n0x000\n0x400\n0x800\n0xC00`,
        l2demo: `// Config: 1KB Cache, Direct Mapped\n0x000\n0x400\n0x000`,
        variables: `var a = 10\nvar b = 20\nvar c = a + b\nc\n0x100`,
        assembly: `ADDI x1, x0, 5\nADDI x2, x0, 10\nADD x3, x1, x2\nSW x3, 0x100(x0) \nLW x4, 0x100(x0)`
    };

    const handleTraceChange = (e) => {
        const selected = e.target.value;
        if (traces[selected]) {
            setAddressSequence(traces[selected]);

            // Auto-configure for L2 Demo to ensure it works as expected
            if (selected === 'l2demo') {
                const newSize = 1024;
                const newAssoc = 1;
                setCacheSize(newSize);
                setAssociativity(newAssoc);

                // We need to trigger the update in the simulator immediately
                // We'll use a timeout to allow state to settle or just call onConfigure directly with new values
                onConfigure({
                    cacheSize: newSize,
                    blockSize: blockSize, // Keep current block size
                    associativity: newAssoc,
                    replacementPolicy: policy,
                    staticPower: staticPower,
                    voltage: voltage
                });
            }

            onReset();
        }
    };

    return (
        <section className="config-panel glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: '600' }}>
                    <Settings size={20} className="text-blue-400" /> Configuration
                </h2>
                <button onClick={() => showTooltip("Configuration Formulas", <div>...</div>)} className="icon-btn">
                    <Info size={18} />
                </button>
            </div>

            {/* CACHE ARCHITECTURE */}
            <div className="config-section">
                <h3 className="section-title">
                    <Cpu size={14} /> CACHE ARCHITECTURE
                </h3>

                {/* Cache Size Control */}
                <div className="input-wrapper">
                    <label>Cache Size</label>
                    <div className="combined-input-group">
                        <select
                            className="group-select"
                            value={[64, 128, 256, 512, 1024, 2048, 4096, 8192].includes(cacheSize) ? cacheSize : 'custom'}
                            onChange={(e) => {
                                if (e.target.value !== 'custom') {
                                    setCacheSize(Number(e.target.value));
                                    handleConfigure();
                                }
                            }}
                        >
                            <option value="custom" disabled>Select Preset...</option>
                            <option value="64">64 B</option>
                            <option value="128">128 B</option>
                            <option value="256">256 B</option>
                            <option value="512">512 B</option>
                            <option value="1024">1 KB</option>
                            <option value="2048">2 KB</option>
                            <option value="4096">4 KB</option>
                            <option value="8192">8 KB</option>
                        </select>
                        <div className="group-separator"></div>
                        <input
                            type="number"
                            className="group-input"
                            value={cacheSize}
                            onChange={(e) => { setCacheSize(Number(e.target.value)); handleConfigure(); }}
                            placeholder="Size"
                            min="32"
                            max="65536"
                        />
                        <span className="group-unit">B</span>
                    </div>
                </div>

                {/* Block Size Control */}
                <div className="input-wrapper">
                    <label>Block Size</label>
                    <div className="combined-input-group">
                        <select
                            className="group-select"
                            value={[4, 8, 16, 32, 64, 128].includes(blockSize) ? blockSize : 'custom'}
                            onChange={(e) => {
                                if (e.target.value !== 'custom') {
                                    setBlockSize(Number(e.target.value));
                                    handleConfigure();
                                }
                            }}
                        >
                            <option value="custom" disabled>Select Preset...</option>
                            <option value="4">4 B</option>
                            <option value="8">8 B</option>
                            <option value="16">16 B</option>
                            <option value="32">32 B</option>
                            <option value="64">64 B</option>
                            <option value="128">128 B</option>
                        </select>
                        <div className="group-separator"></div>
                        <input
                            type="number"
                            className="group-input"
                            value={blockSize}
                            onChange={(e) => { setBlockSize(Number(e.target.value)); handleConfigure(); }}
                            placeholder="Size"
                            min="4"
                            max="256"
                        />
                        <span className="group-unit">B</span>
                    </div>
                </div>

                {/* Associativity Dropdown */}
                <div className="input-wrapper">
                    <label>Associativity</label>
                    <select value={associativity} onChange={(e) => { setAssociativity(Number(e.target.value)); handleConfigure(); }} className="sleek-select">
                        <option value="1">Direct Mapped (1-way)</option>
                        <option value="2">2-way Set Associative</option>
                        <option value="4">4-way Set Associative</option>
                        <option value="8">8-way Set Associative</option>
                    </select>
                </div>

                {/* Policy Dropdown */}
                <div className="input-wrapper">
                    <label>Replacement Policy</label>
                    <select value={policy} onChange={(e) => { setPolicy(e.target.value); handleConfigure(); }} className="sleek-select">
                        <option value="LRU">Least Recently Used (LRU)</option>
                        <option value="FIFO">First-In-First-Out (FIFO)</option>
                        <option value="RANDOM">Random</option>
                    </select>
                </div>
            </div>

            {/* POWER PARAMETERS */}
            <div className="config-section">
                <h3 className="section-title">
                    <Zap size={14} /> POWER PARAMETERS
                </h3>
                <div className="grid-2-col">
                    <div className="input-wrapper">
                        <label>Static (mW/KB)</label>
                        <div className="input-row">
                            <input
                                type="number"
                                value={staticPower}
                                onChange={(e) => { setStaticPower(Number(e.target.value)); handleConfigure(); }}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label>Voltage (V)</label>
                        <div className="input-row">
                            <input
                                type="number"
                                value={voltage}
                                step="0.1"
                                min="0.5"
                                max="2.0"
                                onChange={(e) => { setVoltage(Number(e.target.value)); handleConfigure(); }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* WORKLOAD */}
            <div className="config-section">
                <h3 className="section-title">
                    <Database size={14} /> WORKLOAD
                </h3>
                <div className="input-wrapper">
                    <label>Load Example Trace</label>
                    <select onChange={handleTraceChange} className="sleek-select">
                        <option value="assembly">RISC-V Assembly</option>
                        <option value="custom">Custom Sequence</option>
                        <option value="sequential">Sequential Access</option>
                        <option value="looping">Looping Pattern</option>
                        <option value="random">Random Access</option>
                        <option value="matrix">Matrix Multiplication</option>
                        <option value="l2demo">L2 Hit Demo</option>
                    </select>
                </div>
                <div className="input-wrapper">
                    <label>Memory Addresses / Data Input</label>
                    <textarea
                        value={addressSequence}
                        onChange={(e) => setAddressSequence(e.target.value)}
                        placeholder="Enter instructions..."
                        className="sleek-textarea"
                    />
                </div>
            </div>

            {/* SIMULATION CONTROLS */}
            <div className="config-section" style={{ marginTop: 'auto' }}>
                <h3 className="section-title">
                    <Activity size={14} /> SIMULATION
                </h3>

                <div className="control-bar">
                    <button onClick={handleStep} className="ctrl-btn" title="Step">
                        <SkipForward size={20} />
                    </button>
                    <button onClick={handlePlay} className="ctrl-btn primary" title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={handleRunAll} className="ctrl-btn" title="Run All">
                        <FastForward size={20} />
                    </button>
                    <button onClick={onReset} className="ctrl-btn danger" title="Reset">
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div className="timeline-ctrl">
                    <div className="label-row">
                        <label>Timeline</label>
                        <span className="value-display">{viewStep === -1 ? historyLength : viewStep} / {historyLength}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={historyLength}
                        value={viewStep === -1 ? historyLength : viewStep}
                        onChange={(e) => onJumpToStep(Number(e.target.value))}
                        disabled={historyLength === 0}
                        className="sleek-slider"
                    />
                </div>
            </div>

            <style>{`
                .section-title {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--text-secondary);
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                }
                .input-wrapper {
                    margin-bottom: 16px;
                }
                .label-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .input-wrapper label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    display: block;
                    margin-bottom: 8px;
                }
                .value-display {
                    font-size: 0.85rem;
                    color: var(--accent-color);
                    font-weight: 500;
                }
                
                .combined-input-group {
                    display: flex;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 0;
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .combined-input-group:focus-within {
                    border-color: var(--accent-color);
                }
                .group-select {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    padding: 10px 12px;
                    font-size: 0.9rem;
                    outline: none;
                    cursor: pointer;
                    min-width: 120px;
                }
                .group-select option {
                    background: #1a1a1a;
                    color: var(--text-color);
                }
                .group-separator {
                    width: 1px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.1);
                }
                .group-input {
                    width: 80px;
                    background: transparent;
                    border: none;
                    color: var(--accent-color);
                    padding: 10px 12px;
                    font-size: 0.9rem;
                    font-family: 'JetBrains Mono', monospace;
                    text-align: right;
                    outline: none;
                }
                .group-unit {
                    padding-right: 12px;
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                /* Hide Number Input Spinners */
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }

                /* Sleek Inputs */
                .sleek-select, .input-row {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 10px 12px;
                    color: var(--text-color);
                    font-size: 0.9rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .sleek-select:focus, .input-row:focus-within {
                    border-color: var(--accent-color);
                }
                .input-row input {
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    width: 100%;
                    outline: none;
                }
                .sleek-textarea {
                    width: 100%;
                    height: 120px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                    color: var(--text-color);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    resize: vertical;
                    outline: none;
                }
                .sleek-textarea:focus {
                    border-color: var(--accent-color);
                }

                /* Sleek Slider */
                .sleek-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    outline: none;
                }
                .sleek-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: var(--accent-color);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.1s;
                }
                .sleek-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                .grid-2-col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                
                .control-bar {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 16px;
                }
                .ctrl-btn {
                    flex: 1;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ctrl-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .ctrl-btn.primary {
                    background: var(--accent-color);
                    border-color: var(--accent-color);
                    color: white;
                }
                .ctrl-btn.danger {
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                }
            `}</style>
        </section>
    );
}
