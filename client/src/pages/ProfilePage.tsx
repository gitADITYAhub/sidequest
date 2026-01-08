import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';
import { User, Mail, Calendar, Trophy, Coins, Zap, Shield, LogOut } from 'lucide-react';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const user = useGameStore((state) => state.user);
    const logout = useGameStore((state) => state.logout);

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4 font-mono">
                <p className="text-xl font-bold">Please log in to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 p-4 font-mono pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">My Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
                    {/* User Avatar & Name Section */}
                    <div className="flex items-start gap-6 mb-6 pb-6 border-b-4 border-black">
                        <div className="w-24 h-24 border-4 border-black bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <User size={48} className="text-black" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black uppercase mb-2">{user.fullName || user.username}</h2>
                            <p className="text-lg font-bold text-gray-600">@{user.username}</p>
                            {user.isVerified && (
                                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-400 border-2 border-black font-bold text-sm">
                                    <Shield size={16} />
                                    VERIFIED
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="border-2 border-black p-4 bg-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="text-yellow-600" size={20} />
                                <span className="text-xs font-bold uppercase text-gray-600">XP</span>
                            </div>
                            <p className="text-2xl font-black">{user.xp}</p>
                        </div>
                        <div className="border-2 border-black p-4 bg-yellow-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Coins className="text-yellow-600" size={20} />
                                <span className="text-xs font-bold uppercase text-gray-600">Gold</span>
                            </div>
                            <p className="text-2xl font-black">{user.gold} 🪙</p>
                        </div>
                        <div className="border-2 border-black p-4 bg-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="text-purple-600" size={20} />
                                <span className="text-xs font-bold uppercase text-gray-600">Level</span>
                            </div>
                            <p className="text-2xl font-black">{user.level}</p>
                        </div>
                        <div className="border-2 border-black p-4 bg-pink-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">😎</span>
                                <span className="text-xs font-bold uppercase text-gray-600">Vibe</span>
                            </div>
                            <p className="text-lg font-black capitalize">{user.currentVibe}</p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase border-b-2 border-black pb-2">Personal Info</h3>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                            <Mail size={20} className="text-gray-600" />
                            <div>
                                <p className="text-xs font-bold text-gray-600 uppercase">Email</p>
                                <p className="font-bold">{user.email}</p>
                            </div>
                        </div>

                        {user.age && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                                <Calendar size={20} className="text-gray-600" />
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase">Age</p>
                                    <p className="font-bold">{user.age} years old</p>
                                </div>
                            </div>
                        )}

                        {user.profileVideoUrl && (
                            <div className="p-3 bg-gray-50 border-2 border-black">
                                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Verification Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                                    <p className="font-bold">Profile verified with video</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Card */}
                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <h3 className="text-xl font-black uppercase mb-4">Level Progress</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span>Level {user.level}</span>
                            <span>Level {user.level + 1}</span>
                        </div>
                        <div className="w-full h-8 border-4 border-black bg-gray-200 relative overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 border-r-4 border-black"
                                style={{ width: `${((user.xp % 100) / 100) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm font-bold text-gray-600">
                            {user.xp % 100} / 100 XP to next level
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={handleLogout}
                        className="w-full py-3 text-lg bg-red-400 border-red-600 hover:bg-red-500 flex items-center justify-center"
                    >
                        <LogOut size={20} className="mr-2" /> Logout
                    </Button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};
