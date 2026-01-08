import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/axios';

interface User {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    gold: number;
    currentVibe: string;
    fullName?: string;
    age?: number;
    isVerified: boolean;
    profileVideoUrl?: string;
    interests?: string[];
}

interface Quest {
    id: number;
    title: string;
    description: string;
    xp: number;
    tags: string[];
}

interface ShopItem {
    id: number;
    name: string;
    description: string;
    price: number;
    type: string;
}

interface GameState {
    user: User | null;
    activeQuest: Quest | null;
    setUser: (user: User) => void;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (fullName: string, age: number, interests: string[]) => Promise<void>;
    uploadVerificationVideo: (videoUrl: string) => Promise<void>;
    rollQuest: () => Promise<void>;
    completeQuest: (proofVideoUrl: string) => Promise<void>;
    watchAd: () => Promise<void>;
    fetchShopItems: () => Promise<ShopItem[]>;
    buyItem: (itemId: number) => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            user: null,
            activeQuest: null,
            setUser: (user) => set({ user }),
            login: async (username, password) => {
                try {
                    const response = await api.post('/auth/login', { username, password });
                    set({ user: response.data });
                } catch (error) {
                    console.error('Login failed', error);
                    alert('Login failed! Check credentials.');
                }
            },
            signup: async (username, password) => {
                try {
                    const response = await api.post('/auth/signup', { username, password });
                    set({ user: response.data });
                } catch (error) {
                    console.error('Signup failed', error);
                    alert('Signup failed!');
                }
            },
            logout: () => {
                set({ user: null, activeQuest: null });
                localStorage.removeItem('token');
            },
            updateProfile: async (fullName, age, interests) => {
                try {
                    const user = get().user;
                    if (!user) return;
                    const response = await api.post('/auth/profile', { userId: user.id, fullName, age, interests });
                    set({ user: response.data });
                } catch (error) {
                    console.error('Profile update failed', error);
                    alert('Profile update failed!');
                }
            },
            uploadVerificationVideo: async (videoUrl) => {
                try {
                    const user = get().user;
                    if (!user) return;
                    const response = await api.post('/auth/verify-video', { userId: user.id, videoUrl });
                    set({ user: response.data });
                } catch (error) {
                    console.error('Verification failed', error);
                    alert('Verification failed!');
                }
            },
            rollQuest: async () => {
                try {
                    const response = await api.get('/quests/roll');
                    set({ activeQuest: response.data });
                } catch (error) {
                    console.error('Roll quest failed', error);
                }
            },
            completeQuest: async (proofVideoUrl) => {
                try {
                    const user = get().user;
                    const activeQuest = get().activeQuest;

                    if (!user || !activeQuest) {
                        alert('No active quest or user!');
                        return;
                    }

                    console.log('Completing quest:', { userId: user.id, questId: activeQuest.id, proofVideoUrl });

                    const response = await api.post('/quests/complete', {
                        userId: user.id,
                        questId: activeQuest.id,
                        proofVideoUrl,
                    });

                    if (response.data.success) {
                        alert(`✅ ${response.data.message}`);
                        set({ activeQuest: null });
                    } else {
                        alert(`❌ ${response.data.message}`);
                    }
                } catch (error) {
                    console.error('Failed to complete quest', error);
                    alert('Failed to complete quest!');
                }
            },
            watchAd: async () => {
                try {
                    const { user } = get();
                    if (!user) return;

                    const response = await api.post('/users/watch-ad', { userId: user.id });
                    set({ user: response.data });
                    alert('Ad watched! +20 XP');
                } catch (error) {
                    console.error('Watch ad failed', error);
                    alert('Failed to watch ad!');
                }
            },
            fetchShopItems: async () => {
                try {
                    const response = await api.get('/shop');
                    return response.data;
                } catch (error) {
                    console.error('Fetch shop items failed', error);
                    return [];
                }
            },
            buyItem: async (itemId: number) => {
                const { user } = get();
                if (!user) return;
                try {
                    const response = await api.post(`/shop/buy/${user.id}/${itemId}`);
                    set({ user: response.data });
                    alert('Item purchased!');
                } catch (error) {
                    console.error('Buy item failed', error);
                    alert('Failed to buy item (maybe insufficient funds?)');
                }
            },
            fetchUser: async () => {
                const { user } = get();
                if (!user) return;
                try {
                    const response = await api.get(`/users/${user.id}`);
                    set({ user: response.data });
                } catch (error) {
                    console.error('Fetch user failed', error);
                }
            },
        }),
        {
            name: 'sidequest-storage',
        }
    )
);
