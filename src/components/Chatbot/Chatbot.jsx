import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Settings, Sparkles } from 'lucide-react';

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Cache Assistant. Ask me about cache theory, the simulator, or RISC-V assembly!", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSaveSettings = () => {
        localStorage.setItem("gemini_api_key", apiKey.trim());
        setShowSettings(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const responseText = await getBotResponse(input);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, text: "Sorry, I encountered an error. Please check your API key.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const getBotResponse = async (query) => {
        const key = apiKey.trim();
        if (!key) {
            // Fallback to heuristics if no key
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(getHeuristicResponse(query));
                }, 600);
            });
        }

        // Call Gemini API
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an expert Computer Architecture assistant for a simulator called "Visually". 
                            Context: The user is asking about cache memory, RISC-V, or the simulator itself.
                            Keep answers concise (under 3 sentences if possible) and helpful.
                            User Query: ${query}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Gemini API Error:", data.error);
                if (data.error.message.includes('quota') || data.error.message.includes('rate limit')) {
                    return "⚠️ **Rate Limit Reached**: You're chatting a bit too fast for the free API tier. Please wait a moment and try again.";
                }
                return "Error: " + data.error.message;
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("API Request Failed:", error);
            return "Failed to connect to AI service. Please check your internet connection.";
        }
    };

    const getHeuristicResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('hit') || q.includes('miss')) {
            return "A **Hit** occurs when data is found in the cache. A **Miss** means the data wasn't found, so we have to fetch it from a lower level (L2 or RAM).";
        }
        if (q.includes('associativ')) {
            return "**Associativity** determines how many places a block can go. Direct Mapped = 1 place. Fully Associative = Any place. N-way = N places.";
        }
        if (q.includes('write back') || q.includes('write through')) {
            return "**Write-Through**: Updates RAM immediately. **Write-Back**: Updates RAM only when the dirty block is evicted.";
        }
        if (q.includes('risc') || q.includes('assembly')) {
            return "I support basic RISC-V instructions like `LW`, `SW`, `ADD`, `ADDI`. Try typing: `ADDI x1, x0, 5` then `SW x1, 0x100(x0)`.";
        }
        if (q.includes('play') || q.includes('run')) {
            return "Use the **Play** button to auto-step through the trace. **Run All** executes everything instantly.";
        }
        return "I'm still learning! Try asking about 'cache hits', 'associativity', or 'RISC-V commands'.";
    };

    return (
        <div className="chatbot-wrapper">
            {/* Trigger Button */}
            <button
                className={`chat-trigger ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open Chat"
            >
                <MessageCircle size={32} />
                <span className="pulse-ring"></span>
            </button>

            {/* Chat Window */}
            <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="header-left">
                        <div className="bot-avatar">
                            <Bot size={20} color="white" />
                        </div>
                        <div>
                            <h3>Cache Assistant</h3>
                            <span className="status-dot">Online</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => setShowSettings(!showSettings)} title="Settings">
                            <Settings size={18} />
                        </button>
                        <button onClick={() => setIsOpen(false)} title="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {showSettings ? (
                    <div className="chat-settings">
                        <h4><Sparkles size={16} /> AI Configuration</h4>
                        <div className="setting-group">
                            <label>Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                            <p className="hint">Key is stored locally in your browser.</p>
                        </div>
                        <button className="btn-save" onClick={handleSaveSettings}>
                            Save Configuration
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="chat-messages">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.sender}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="msg-avatar">
                                            <Bot size={14} />
                                        </div>
                                    )}
                                    <div className="bubble">
                                        {msg.text.split('**').map((part, i) =>
                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message bot">
                                    <div className="msg-avatar"><Bot size={14} /></div>
                                    <div className="bubble typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about caching..."
                            />
                            <button className="btn-send" onClick={handleSend} disabled={!input.trim()}>
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .chatbot-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }

                /* Trigger Button */
                .chat-trigger {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                }

                .chat-trigger:hover {
                    transform: scale(1.1);
                }

                .chat-trigger.hidden {
                    transform: scale(0);
                    opacity: 0;
                    pointer-events: none;
                }

                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid var(--accent-color);
                    animation: pulse 2s infinite;
                    opacity: 0;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                /* Chat Widget */
                .chatbot-widget {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 380px;
                    height: 600px;
                    max-height: 80vh;
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform-origin: bottom right;
                    transform: scale(0.9) translateY(20px);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .chatbot-widget.open {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                    pointer-events: all;
                }

                /* Header */
                .chat-header {
                    padding: 20px;
                    background: linear-gradient(135deg, var(--accent-color), #2563eb);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .bot-avatar {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .header-left h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }

                .status-dot {
                    font-size: 0.75rem;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .status-dot::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    display: block;
                }

                .header-actions button {
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.8);
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .header-actions button:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                /* Messages */
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: rgba(0,0,0,0.02);
                }

                .message {
                    display: flex;
                    gap: 8px;
                    max-width: 85%;
                }

                .message.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .msg-avatar {
                    width: 24px;
                    height: 24px;
                    background: var(--accent-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                .bubble {
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .message.bot .bubble {
                    background: var(--card-bg);
                    border: 1px solid var(--glass-border);
                    border-top-left-radius: 4px;
                    color: var(--text-primary);
                }

                .message.user .bubble {
                    background: var(--accent-color);
                    color: white;
                    border-top-right-radius: 4px;
                }

                /* Input Area */
                .chat-input-area {
                    padding: 16px;
                    background: var(--glass-bg);
                    border-top: 1px solid var(--glass-border);
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .chat-input-area input {
                    flex: 1;
                    padding: 12px 16px;
                    border-radius: 24px;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.05);
                    color: var(--text-primary);
                    outline: none;
                    transition: border-color 0.2s;
                }

                .chat-input-area input:focus {
                    border-color: var(--accent-color);
                    background: rgba(255,255,255,0.1);
                }

                .btn-send {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }

                .btn-send:hover:not(:disabled) {
                    transform: scale(1.05);
                }

                .btn-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Settings */
                .chat-settings {
                    flex: 1;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }

                .chat-settings h4 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    color: var(--text-primary);
                }

                .setting-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--text-secondary);
                }

                .setting-group input {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.05);
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }

                .hint {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }

                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 16px 20px;
                    align-items: center;
                }

                .typing-indicator span {
                    width: 6px;
                    height: 6px;
                    background: var(--text-secondary);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                .btn-save {
                    margin-top: auto;
                    width: 100%;
                    padding: 12px;
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
