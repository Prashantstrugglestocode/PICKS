import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, X, Activity } from 'lucide-react';

export function HistoryPanel({ isOpen, onClose }) {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && token) {
            fetchHistory();
        }
    }, [isOpen, token]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-6 overflow-y-auto border-l border-gray-200 dark:border-gray-800 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Clock size={24} className="text-tum-blue" />
                        Activity History
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tum-blue"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No activity recorded yet.</p>
                        ) : (
                            history.map((item) => (
                                <div key={item.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-tum-blue/30 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-tum-blue">
                                            <Activity size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.action}</h4>
                                            {item.details && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.details}</p>
                                            )}
                                            <span className="text-xs text-gray-400 mt-2 block">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
