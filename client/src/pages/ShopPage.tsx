import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';
import { ShoppingBag, Coffee, Zap, Ticket, Crown, Lock } from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
    coffee: <Coffee />,
    zap: <Zap />,
    ticket: <Ticket />,
    crown: <Crown />,
};

export const ShopPage = () => {
    const user = useGameStore((state) => state.user);
    const fetchShopItems = useGameStore((state) => state.fetchShopItems);
    const buyItem = useGameStore((state) => state.buyItem);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetchShopItems().then(setItems);
    }, [fetchShopItems]);

    const handleBuy = async (item: any) => {
        if (user && user.gold >= item.cost) {
            await buyItem(item.id);
            alert(`Bought ${item.name}!`);
            // Refresh items
            fetchShopItems().then(setItems);
        } else {
            const needed = item.cost - (user?.gold || 0);
            alert(`Not enough gold! You need ${needed} more gold.`);
        }
    };

    const canAfford = (cost: number) => {
        return user && user.gold >= cost;
    };

    return (
        <div className="min-h-screen bg-yellow-50 text-black font-mono pb-24">
            <div className="max-w-md mx-auto p-4">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-3xl font-black uppercase">Shop</h1>
                    <div className="bg-black text-white px-4 py-2 font-black flex items-center gap-2 border-2 border-black">
                        <span className="text-yellow-400">{user?.gold || 0}</span>
                        <span>🪙</span>
                    </div>
                </div>

                {/* Shop Items Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {items.map((item) => {
                        const affordable = canAfford(item.cost);
                        const goldNeeded = item.cost - (user?.gold || 0);

                        return (
                            <Card
                                key={item.id}
                                className={`relative transition-all ${affordable
                                        ? 'bg-white'
                                        : 'bg-gray-100 opacity-60 grayscale'
                                    }`}
                            >
                                {/* Unaffordable Badge */}
                                {!affordable && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-black border-2 border-black flex items-center gap-1">
                                        <Lock size={12} />
                                        Need {goldNeeded} more
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 border-2 border-black rounded-full ${affordable ? 'bg-yellow-100' : 'bg-gray-200'
                                            }`}>
                                            {item.name.toLowerCase().includes('coffee') ? '☕' : IconMap[item.icon] || <ShoppingBag />}
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase text-lg">{item.name}</h3>
                                            <p className="text-sm text-gray-600 font-bold">{item.description}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleBuy(item)}
                                        disabled={!affordable}
                                        className={`px-6 py-3 text-lg font-black ${affordable
                                                ? 'bg-green-400 border-green-600 hover:bg-green-500'
                                                : 'bg-gray-300 border-gray-500 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        {item.cost} 🪙
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {items.length === 0 && (
                    <div className="text-center py-12 border-4 border-black bg-white">
                        <p className="text-xl font-black uppercase mb-2">Shop is Empty</p>
                        <p className="text-gray-600 font-bold">Check back later for items!</p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};
