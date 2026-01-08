import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { Button } from '../components/Button';
import { User, Check } from 'lucide-react';

const INTEREST_OPTIONS = [
    'Fitness', 'Foodie', 'Art', 'Music',
    'Tech', 'Travel', 'Nature', 'Gaming',
    'Reading', 'Photography', 'Nightlife',
    'Coffee', 'Fashion', 'History'
];

export const ProfileSetupPage = () => {
    const navigate = useNavigate();
    const updateProfile = useGameStore((state) => state.updateProfile);
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSubmit = async () => {
        if (!fullName || !age) {
            alert('Please fill all fields!');
            return;
        }
        if (selectedInterests.length < 3) {
            alert('Please select at least 3 interests!');
            return;
        }
        await updateProfile(fullName, parseInt(age), selectedInterests);
        navigate('/verification');
    };

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 font-mono">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
                <h1 className="text-4xl font-black mb-4 text-center uppercase tracking-tighter">Profile Setup</h1>
                <p className="text-center mb-8 text-sm">Tell us a bit about yourself</p>

                <div className="space-y-6 mb-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-bold mb-1">FULL NAME</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-100"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">AGE</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-100"
                                placeholder="Enter your age"
                                min="16"
                                max="99"
                            />
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div>
                        <label className="block font-bold mb-3 uppercase">What are you into? (Pick 3+)</label>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map((interest) => {
                                const isSelected = selectedInterests.includes(interest);
                                return (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`
                                            px-4 py-2 rounded-full border-2 border-black font-bold text-sm transition-all
                                            ${isSelected
                                                ? 'bg-black text-white transform scale-105'
                                                : 'bg-white text-black hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        {interest}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Button onClick={handleSubmit} className="w-full py-3 text-lg">
                    <User className="mr-2" /> CONTINUE
                </Button>
            </div>
        </div>
    );
};
