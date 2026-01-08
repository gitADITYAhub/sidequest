import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { CheckCircle, Clock, XCircle, Zap, Coins } from 'lucide-react';
import { api } from '../lib/axios';

interface CompletedQuest {
    id: number;
    status: 'pending' | 'verified' | 'rejected';
    xpAwarded: number;
    goldAwarded: number;
    completedAt: string;
    verifiedAt: string;
    verificationNotes: string;
    quest: {
        id: number;
        title: string;
        description: string;
        xp: number;
    };
}

export const ActiveQuestsPage = () => {
    const user = useGameStore((state) => state.user);
    const [quests, setQuests] = useState<CompletedQuest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserQuests();
        }
    }, [user]);

    const fetchUserQuests = async () => {
        if (!user) return;

        try {
            const response = await api.get(`/quests/user/${user.id}`);
            setQuests(response.data.quests || []);
        } catch (error) {
            console.error('Error fetching quests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateVerification = async (questId: number) => {
        try {
            const response = await api.post(`/quests/verify/${questId}`);

            if (response.data.success) {
                alert(`✅ ${response.data.message}\n+${response.data.xpAwarded} XP\n+${response.data.goldAwarded} Gold`);
                // Refresh quests
                fetchUserQuests();
                // Refresh user data
                window.location.reload();
            } else {
                alert(`❌ ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error verifying quest:', error);
            alert('Failed to verify quest');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400 border-2 border-black font-bold text-sm">
                        <Clock size={16} />
                        PENDING
                    </div>
                );
            case 'verified':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-400 border-2 border-black font-bold text-sm">
                        <CheckCircle size={16} />
                        VERIFIED
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-400 border-2 border-black font-bold text-sm">
                        <XCircle size={16} />
                        REJECTED
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-yellow-50 font-mono pb-24">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Active Quests</h1>
                    <p className="text-sm font-bold text-gray-600 mt-1">
                        Track your quest submissions and verifications
                    </p>
                </div>

                {/* Quest List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="font-bold text-xl">Loading quests...</p>
                    </div>
                ) : quests.length === 0 ? (
                    <div className="border-4 border-black bg-white p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-2xl font-black uppercase mb-2">No Quests Yet</h2>
                        <p className="font-bold text-gray-600">
                            Complete your first quest to see it here!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quests.map((quest) => (
                            <div
                                key={quest.id}
                                className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {/* Quest Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black uppercase mb-1">
                                            {quest.quest.title}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-600">
                                            {quest.quest.description}
                                        </p>
                                    </div>
                                    {getStatusBadge(quest.status)}
                                </div>

                                {/* Quest Details */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="border-2 border-black p-3 bg-blue-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Zap className="text-yellow-600" size={18} />
                                            <span className="text-xs font-bold uppercase text-gray-600">
                                                XP Reward
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black">
                                            {quest.status === 'verified' ? quest.xpAwarded : quest.quest.xp}
                                        </p>
                                    </div>
                                    <div className="border-2 border-black p-3 bg-yellow-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Coins className="text-yellow-600" size={18} />
                                            <span className="text-xs font-bold uppercase text-gray-600">
                                                Gold Reward
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black">
                                            {quest.status === 'verified' ? quest.goldAwarded : Math.floor(quest.quest.xp / 2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="text-xs font-bold text-gray-600 mb-4">
                                    <p>Completed: {new Date(quest.completedAt).toLocaleString()}</p>
                                    {quest.status === 'verified' && (
                                        <p>Verified: {new Date(quest.verifiedAt).toLocaleString()}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                {quest.status === 'pending' && (
                                    <div className="border-t-2 border-black pt-4">
                                        <p className="text-sm font-bold text-gray-600 mb-3">
                                            🤖 Awaiting AI verification...
                                        </p>
                                        <Button
                                            onClick={() => handleSimulateVerification(quest.id)}
                                            className="w-full py-3 bg-purple-400 border-purple-600 hover:bg-purple-500"
                                        >
                                            🧪 Simulate Verification (Testing)
                                        </Button>
                                    </div>
                                )}

                                {quest.status === 'verified' && quest.verificationNotes && (
                                    <div className="border-t-2 border-black pt-4">
                                        <p className="text-sm font-bold text-green-700">
                                            ✅ {quest.verificationNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};
