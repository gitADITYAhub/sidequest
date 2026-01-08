import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, ShoppingBag, User, Map } from 'lucide-react';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/quest', icon: Target, label: 'Quests' },
        { path: '/shop', icon: ShoppingBag, label: 'Shop' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/map', icon: Map, label: 'Map' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-yellow-50 z-50 safe-area-bottom">
            <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active
                                ? 'bg-yellow-400'
                                : 'hover:bg-yellow-100'
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`mb-1 ${active ? 'text-black' : 'text-white'}`}
                                strokeWidth={active ? 3 : 2}
                            />
                            <span className={`text-xs font-black uppercase ${active ? 'text-black' : 'text-white'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
