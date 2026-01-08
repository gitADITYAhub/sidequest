import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { Button } from '../components/Button';
import { QuestCard } from '../components/QuestCard';
import { BottomNav } from '../components/BottomNav';
import { Tv, Lightbulb } from 'lucide-react';

const HEALTH_FACTS = [
    "💪 Just 10 minutes of outdoor activity can boost your mood!",
    "🧠 Social interactions reduce stress and improve mental health.",
    "🌟 Small daily challenges build confidence and resilience.",
    "🚶 Walking 30 minutes a day can improve cardiovascular health.",
    "😊 Completing tasks releases dopamine, making you feel good!",
    "🌱 Trying new things creates new neural pathways in your brain.",
    "💚 Acts of kindness boost your happiness and reduce anxiety.",
    "🎯 Setting small goals makes big achievements more attainable.",
    "🌞 Sunlight exposure helps regulate your sleep cycle.",
    "🤝 Connecting with others strengthens your immune system.",
];

export const QuestPage = () => {
    const navigate = useNavigate();
    const user = useGameStore((state) => state.user);
    const activeQuest = useGameStore((state) => state.activeQuest);
    const rollQuest = useGameStore((state) => state.rollQuest);
    const completeQuest = useGameStore((state) => state.completeQuest);
    const watchAd = useGameStore((state) => state.watchAd);
    const [proofVideoUrl, setProofVideoUrl] = useState<string | null>(null);
    const [randomFact, setRandomFact] = useState('');

    // Press and hold state
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdTimerRef = useRef<number | null>(null);
    const progressIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        setRandomFact(HEALTH_FACTS[Math.floor(Math.random() * HEALTH_FACTS.length)]);
    }, []);

    const handleRoll = async () => {
        await rollQuest();
        setRandomFact(HEALTH_FACTS[Math.floor(Math.random() * HEALTH_FACTS.length)]);
    };

    const handleComplete = async () => {
        if (proofVideoUrl) {
            await completeQuest(proofVideoUrl);
            setProofVideoUrl(null);
        }
    };

    const handleWatchAd = async () => {
        await watchAd();
    };

    // Press and hold handlers
    const startHold = () => {
        setIsHolding(true);
        setHoldProgress(0);

        // Progress animation
        progressIntervalRef.current = window.setInterval(() => {
            setHoldProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 2; // 50 steps = 2 seconds
            });
        }, 40);

        // Complete after 2 seconds
        holdTimerRef.current = window.setTimeout(() => {
            handleRoll();
            resetHold();
        }, 2000);
    };

    const cancelHold = () => {
        resetHold();
    };

    const resetHold = () => {
        setIsHolding(false);
        setHoldProgress(0);
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            resetHold();
        };
    }, []);

    return (
        <div className="min-h-screen bg-yellow-50 font-mono pb-24">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* User Stats Card */}
                <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Quest Log</h1>
                            <p className="text-sm font-bold text-gray-600">Welcome back, {user?.fullName || user?.username}!</p>
                        </div>
                        <button
                            onClick={() => navigate('/active-quests')}
                            className="px-4 py-2 border-2 border-black bg-purple-400 font-bold hover:bg-purple-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-sm"
                        >
                            📋 Quest History
                        </button>
                    </div>
                    <div className="flex items-center gap-4 justify-end">
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-600 uppercase">Level</p>
                            <p className="text-2xl font-black">{user?.level}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-600 uppercase">XP</p>
                            <p className="text-2xl font-black text-blue-600">{user?.xp}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-600 uppercase">Gold</p>
                            <p className="text-2xl font-black text-yellow-600">{user?.gold} 🪙</p>
                        </div>
                    </div>
                </div>

                {/* Health Fact Card */}
                < div className="border-4 border-black bg-gradient-to-r from-purple-200 to-pink-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" >
                    <div className="flex items-start gap-3">
                        <Lightbulb className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <p className="text-xs font-black uppercase text-purple-800 mb-1">Did You Know?</p>
                            <p className="font-bold text-gray-800">{randomFact}</p>
                        </div>
                    </div>
                </div >

                {/* Watch Transmission Button */}
                < div className="flex justify-center" >
                    <Button
                        onClick={handleWatchAd}
                        className="px-6 py-3 bg-purple-500 border-purple-700 hover:bg-purple-600"
                    >
                        <Tv size={20} className="mr-2" /> 📡 Watch transmission from sponsors (+20 XP)
                    </Button>
                </div >

                {/* Quest Section */}
                {
                    !activeQuest ? (
                        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="text-8xl mb-4 animate-bounce">🎲</div>
                                <h2 className="text-3xl font-black uppercase">No Active Quest</h2>
                                <p className="font-bold text-gray-600 text-lg">
                                    Ready for an adventure? Press and hold to roll the dice!
                                </p>

                                {/* Massive Press-and-Hold Button */}
                                <div className="relative">
                                    <button
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            startHold();
                                        }}
                                        onPointerUp={(e) => {
                                            e.preventDefault();
                                            cancelHold();
                                        }}
                                        onPointerLeave={(e) => {
                                            e.preventDefault();
                                            cancelHold();
                                        }}
                                        className={`w-full h-32 border-4 border-black font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden touch-none ${isHolding ? 'bg-yellow-300' : 'bg-yellow-400 hover:bg-yellow-500 active:shadow-none active:translate-x-[8px] active:translate-y-[8px]'
                                            }`}
                                    >
                                        {/* Progress fill */}
                                        <div
                                            className="absolute inset-0 bg-orange-500 transition-all duration-100 pointer-events-none"
                                            style={{ width: `${holdProgress}%` }}
                                        />

                                        {/* Button text */}
                                        <span className="relative z-10 drop-shadow-lg pointer-events-none">
                                            {isHolding ? `${Math.floor(holdProgress / 50)}...` : '🎲 HOLD TO ROLL QUEST'}
                                        </span>
                                    </button>

                                    {!isHolding && (
                                        <p className="text-sm font-bold text-gray-600 mt-2">Press and hold for 2 seconds</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Quest Card */}
                            <QuestCard
                                title={activeQuest.title}
                                description={activeQuest.description}
                                xp={activeQuest.xp}
                                tags={activeQuest.tags}
                            />

                            {/* Proof Upload Section */}
                            <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                                    <span>📸</span> Submit Proof
                                </h3>

                                <div className="space-y-4">
                                    <div className="border-2 border-black bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
                                        {proofVideoUrl ? (
                                            <video src={proofVideoUrl} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <div className="text-4xl mb-2">🎥</div>
                                                <p className="font-bold text-gray-600">Upload video proof of quest completion</p>
                                                <p className="text-sm text-gray-500 mt-2">For testing, use the debug button below</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 items-center justify-between">
                                        <button
                                            onClick={() => setProofVideoUrl('mock-proof-url')}
                                            className="text-sm px-4 py-2 border-2 border-black bg-gray-200 font-bold hover:bg-gray-300"
                                        >
                                            🔧 Debug: Mock Video
                                        </button>

                                        {proofVideoUrl && (
                                            <button
                                                onClick={() => setProofVideoUrl(null)}
                                                className="text-sm px-4 py-2 border-2 border-black bg-red-200 font-bold hover:bg-red-300"
                                            >
                                                ✖ Clear Video
                                            </button>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleComplete}
                                        disabled={!proofVideoUrl}
                                        className="w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ✅ VERIFY & CLAIM REWARD
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >

            {/* Bottom Navigation */}
            < BottomNav />
        </div >
    );
};
