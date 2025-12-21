import { Portfolio } from '@/lib/types';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000/uploads/';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
        const session = await getSession();
        const token = (session as any)?.accessToken;
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (error) {
        console.error("Error getting auth session:", error);
        return {};
    }
};

export const portfolioService = {
    getAllPortfolios: async (): Promise<Portfolio[]> => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/portfolio`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch portfolios: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Map backend response structure to Portfolio interface.
            return data.data.map((item: any) => ({
                ...item,
                photoUrl: item.photoUrl ? (item.photoUrl.startsWith('http') ? item.photoUrl : `${IMAGE_BASE_URL}${item.photoUrl}`) : '',
                endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
            }));
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            throw error;
        }
    },

    getPortfolioById: async (id: string): Promise<Portfolio> => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/portfolio/${id}`, {
                headers
            });

            if (!response.ok) throw new Error('Failed to fetch portfolio');

            const data = await response.json();
            const item = data.data;
            return {
                ...item,
                photoUrl: item.photoUrl ? (item.photoUrl.startsWith('http') ? item.photoUrl : `${IMAGE_BASE_URL}${item.photoUrl}`) : '',
                endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
            };
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            throw error;
        }
    },

    createPortfolio: async (payload: any): Promise<Portfolio> => {
        try {
            const headers = await getAuthHeaders();

            console.log("🚀 Sending Portfolio Data:", payload);

            const response = await fetch(`${API_URL}/portfolio`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create portfolio: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating portfolio:', error);
            throw error;
        }
    },

    updatePortfolio: async (id: string, payload: any): Promise<Portfolio> => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/portfolio/${id}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update portfolio');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating portfolio:', error);
            throw error;
        }
    },

    deletePortfolio: async (id: string): Promise<void> => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/portfolio/${id}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to delete portfolio');
            }
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            throw error;
        }
    }
};
