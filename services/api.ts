const API_URL = 'http://localhost:8001';

export const loginUser = async (phoneNumber: string, name: string) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phoneNumber, name }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};
