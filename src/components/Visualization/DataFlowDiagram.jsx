import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Layers, Database } from 'lucide-react';

export function DataFlowDiagram({ log }) {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-play effect
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return p + 1;
                });
            }, 20); // 2 seconds for full traversal
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Reset on new log
    useEffect(() => {
        setProgress(0);
        setIsPlaying(true);
    }, [log]);

    // Determine path and max depth
    const getTarget = () => {
        if (!log) return 'cpu';
        if (log.accessType === 'ALU') return 'cpu';
        if (log.isHit) return 'l1';
        if (log.l2Hit) return 'l2';
        return 'ram';
    };

    const target = getTarget();

    // Calculate positions based on progress
    // Define the physical positions of nodes
    const NODE_POS = { cpu: 10, l1: 36, l2: 62, ram: 88 };

    // Calculate the path based on the target
    // The packet must visit every node on the way to the target and back
    const getPath = () => {
        const p = [NODE_POS.cpu, NODE_POS.l1]; // Always go to L1
        if (target === 'l1') return [...p, NODE_POS.cpu]; // Hit L1, return

        p.push(NODE_POS.l2); // Miss L1, go to L2
        if (target === 'l2') return [...p, NODE_POS.l1, NODE_POS.cpu]; // Hit L2, return

        p.push(NODE_POS.ram); // Miss L2, go to RAM
        return [...p, NODE_POS.l2, NODE_POS.l1, NODE_POS.cpu]; // Return from RAM
    };

    const path = getPath();
    const totalSegments = path.length - 1;

    const getPacketPos = () => {
        // Map progress (0-100) to the path segments
        const currentSegmentIndex = Math.min(
            Math.floor((progress / 100) * totalSegments),
            totalSegments - 1
        );

        const segmentProgress = ((progress / 100) * totalSegments) - currentSegmentIndex;

        const start = path[currentSegmentIndex];
        const end = path[currentSegmentIndex + 1];

        return start + (end - start) * segmentProgress;
    };

    const currentPos = getPacketPos();
    const isRequest = progress <= 50;
    const packetValue = isRequest ? (log ? `0x${log.address.toString(16).toUpperCase()}` : '---') : (log ? log.data : '---');
    const packetColor = isRequest ? '#3498db' : '#2ecc71';

    // Status Badges
    const l1Status = log ? (log.isHit ? 'HIT' : 'MISS') : '';
    const l2Status = log && !log.isHit ? (log.l2Hit ? 'HIT' : 'MISS') : '';

    // Tag Comparison Logic
    // Show comparison when packet is at L1 (approx 36%) or L2 (approx 62%) during Request phase
    const showL1Tag = isRequest && progress > 30 && progress < 42;
    const showL2Tag = isRequest && progress > 56 && progress < 68 && target !== 'l1'; // Only if passed L1

    const reqTag = log ? `0x${log.tag.toString(16).toUpperCase()}` : '---';
    // For visualization, we pretend the block tag is different on miss, same on hit
    const blockTagL1 = log?.isHit ? reqTag : '0x???';
    const blockTagL2 = log?.l2Hit ? reqTag : '0x???';

    // Miss Explanation Logic
    const showMissExplanation = !log?.isHit && log?.missType && isRequest && progress > 40 && progress < 60;
    const missExplanation = log?.missType === 'Compulsory'
        ? "Cold Miss: First access to this block."
        : log?.missType === 'Capacity'
            ? "Capacity Miss: Cache is full."
            : "Conflict Miss: Set is full.";

    return (
        <div className="data-flow-diagram" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Miss Explanation Popup */}
            {showMissExplanation && (
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 10,
                    animation: 'fadeIn 0.2s ease-out',
                    whiteSpace: 'nowrap'
                }}>
                    ⚠️ {log.missType} Miss: {missExplanation}
                </div>
            )}

            <div className="df-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                position: 'relative',
                padding: '0 40px',
                marginBottom: '40px',
                height: '100%'
            }}>
                <div className="df-line-bg" style={{
                    position: 'absolute',
                    top: '40px',
                    left: '60px',
                    right: '60px',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0
                }}></div>

                {/* Packet */}
                <div
                    className="df-packet-visual"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: `${currentPos}%`,
                        transform: 'translateX(-50%)',
                        background: packetColor,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                        whiteSpace: 'nowrap',
                        boxShadow: `0 0 10px ${packetColor}`,
                        zIndex: 10,
                        transition: 'left 0.02s linear',
                        border: '2px solid white'
                    }}
                >
                    {packetValue}
                    <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid white'
                    }}></div>
                </div>

                {/* CPU Node */}
                <div className="df-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: target === 'cpu' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${target === 'cpu' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px', transition: 'all 0.3s ease',
                        transform: target === 'cpu' && progress === 100 ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <Cpu size={32} color={target === 'cpu' ? '#3b82f6' : '#64748b'} />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>CPU Core</span>
                </div>

                {/* L1 Cache Node */}
                <div className="df-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: target === 'l1' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${target === 'l1' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px', transition: 'all 0.3s ease',
                        transform: target === 'l1' && progress === 50 ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <Zap size={32} color={target === 'l1' ? '#f59e0b' : '#64748b'} />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>L1 Cache</span>
                    {l1Status && (
                        <div style={{
                            position: 'absolute', top: '-12px', right: '-12px', padding: '2px 6px', borderRadius: '8px',
                            fontSize: '0.7rem', fontWeight: 'bold', color: 'white', zIndex: 5,
                            background: l1Status === 'HIT' ? '#2ecc71' : '#e74c3c',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>{l1Status}</div>
                    )}
                    {showL1Tag && (
                        <div style={{
                            position: 'absolute', top: '-80px', background: 'rgba(0, 0, 0, 0.8)', color: 'white',
                            padding: '8px', borderRadius: '8px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20,
                            border: '1px solid rgba(255,255,255,0.2)', animation: 'fadeIn 0.2s ease'
                        }}>
                            <div>Req Tag: <span style={{ color: '#3498db' }}>{reqTag}</span></div>
                            <div>Blk Tag: <span style={{ color: l1Status === 'HIT' ? '#2ecc71' : '#e74c3c' }}>{blockTagL1}</span></div>
                            <div style={{ borderTop: '1px solid #555', marginTop: '2px', paddingTop: '2px', textAlign: 'center', fontWeight: 'bold', color: l1Status === 'HIT' ? '#2ecc71' : '#e74c3c' }}>
                                {l1Status === 'HIT' ? 'MATCH' : 'MISMATCH'}
                            </div>
                        </div>
                    )}
                </div>

                {/* L2 Cache Node */}
                <div className="df-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: target === 'l2' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${target === 'l2' ? '#a855f7' : 'rgba(255, 255, 255, 0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px', transition: 'all 0.3s ease',
                        transform: target === 'l2' && progress === 50 ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <Layers size={32} color={target === 'l2' ? '#a855f7' : '#64748b'} />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>L2 Cache</span>
                    {l2Status && (
                        <div style={{
                            position: 'absolute', top: '-12px', right: '-12px', padding: '2px 6px', borderRadius: '8px',
                            fontSize: '0.7rem', fontWeight: 'bold', color: 'white', zIndex: 5,
                            background: l2Status === 'HIT' ? '#2ecc71' : '#e74c3c',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>{l2Status}</div>
                    )}
                    {showL2Tag && (
                        <div style={{
                            position: 'absolute', top: '-80px', background: 'rgba(0, 0, 0, 0.8)', color: 'white',
                            padding: '8px', borderRadius: '8px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20,
                            border: '1px solid rgba(255,255,255,0.2)', animation: 'fadeIn 0.2s ease'
                        }}>
                            <div>Req Tag: <span style={{ color: '#3498db' }}>{reqTag}</span></div>
                            <div>Blk Tag: <span style={{ color: l2Status === 'HIT' ? '#2ecc71' : '#e74c3c' }}>{blockTagL2}</span></div>
                            <div style={{ borderTop: '1px solid #555', marginTop: '2px', paddingTop: '2px', textAlign: 'center', fontWeight: 'bold', color: l2Status === 'HIT' ? '#2ecc71' : '#e74c3c' }}>
                                {l2Status === 'HIT' ? 'MATCH' : 'MISMATCH'}
                            </div>
                        </div>
                    )}
                </div>

                {/* RAM Node */}
                <div className="df-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: target === 'ram' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${target === 'ram' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px', transition: 'all 0.3s ease',
                        transform: target === 'ram' && progress === 50 ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <Database size={32} color={target === 'ram' ? '#10b981' : '#64748b'} />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Main Memory</span>
                </div>
            </div>

            <div className="df-controls" style={{
                display: 'flex', alignItems: 'center', gap: '15px', width: '80%',
                background: 'rgba(0,0,0,0.3)', padding: '10px 20px', borderRadius: '20px'
            }}>
                <button
                    onClick={() => { setProgress(0); setIsPlaying(true); }}
                    title="Replay Animation"
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ↺
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => { setIsPlaying(false); setProgress(Number(e.target.value)); }}
                    style={{ flex: 1, cursor: 'pointer' }}
                />
                <span style={{ minWidth: '40px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {Math.round(progress)}%
                </span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', gap: '20px' }}>
                <span>Request: {log?.address ? '0x' + log.address.toString(16).toUpperCase() : '---'}</span>
                <span>•</span>
                <span>L1: <strong style={{ color: l1Status === 'HIT' ? '#2ecc71' : (l1Status === 'MISS' ? '#e74c3c' : 'inherit') }}>{l1Status || '-'}</strong></span>
                <span>•</span>
                <span>L2: <strong style={{ color: l2Status === 'HIT' ? '#2ecc71' : (l2Status === 'MISS' ? '#e74c3c' : 'inherit') }}>{l2Status || '-'}</strong></span>
            </div>
        </div >
    );
}
