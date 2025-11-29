import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { SystemDiagram } from './components/Visualization/SystemDiagram';
import { CPUPage } from './components/Pages/CPUPage';
import { L1Page } from './components/Pages/L1Page';
import { RAMPage } from './components/Pages/RAMPage';
import { TheoryPage } from './components/Pages/TheoryPage';
import { LandingPage } from './components/Pages/LandingPage';
import { DocumentationPage } from './components/Pages/DocumentationPage';
import { LoginOverlay } from './components/Auth/LoginOverlay';
import { Chatbot } from './components/Chatbot/Chatbot';

function App() {
    const [theme, setTheme] = useState('dark');
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <Router>
            <div className="app-container">
                {!isAuthenticated && <LoginOverlay onLogin={handleLogin} />}

                <Header theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/docs" element={<DocumentationPage />} />
                    <Route path="/simulator" element={<SystemDiagram />} />
                    <Route path="/cpu" element={<CPUPage />} />
                    <Route path="/l1" element={<L1Page level="L1" />} />
                    <Route path="/l2" element={<L1Page level="L2" />} />
                    <Route path="/ram" element={<RAMPage />} />
                    <Route path="/theory" element={<TheoryPage />} />
                </Routes>

                <Chatbot />
            </div>
        </Router>
    );
}

export default App;
