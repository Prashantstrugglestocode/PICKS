import { useAuth } from '../context/AuthContext';

export function useLogHistory() {
    const { token, isAuthenticated } = useAuth();

    const logAction = async (action, details = '') => {
        if (!isAuthenticated || !token) return;

        try {
            await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action, details })
            });
        } catch (error) {
            console.error('Failed to log history:', error);
        }
    };

    return logAction;
}
