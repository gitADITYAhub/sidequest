import React from 'react';
import { Card } from './Card';
import { MapPin, Clock, Tag } from 'lucide-react';

interface QuestCardProps {
    title: string;
    description: string;
    xp: number;
    tags: string[];
    onComplete?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ title, description, xp, tags, onComplete }) => {
    return (
        <Card className="w-full max-w-md bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 px-3 py-1 font-bold border-l-2 border-b-2 border-black">
                {xp} XP
            </div>
            <h3 className="text-2xl font-black mb-2 uppercase">{title}</h3>
            <p className="text-lg mb-6 font-medium">{description}</p>

            <div className="flex gap-2 mb-6">
                {tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 border border-black text-xs font-bold uppercase">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>24h</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>Real World</span>
                </div>
            </div>
        </Card>
    );
};
