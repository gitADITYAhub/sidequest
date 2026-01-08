import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { Button } from '../components/Button';
import { UserPlus } from 'lucide-react';

export const SignupPage = () => {
    const navigate = useNavigate();
    const signup = useGameStore((state) => state.signup);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!username || !password) {
            alert('Please fill all fields!');
            return;
        }
        await signup(username, password);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 font-mono">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-tighter">Join SideQuest</h1>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block font-bold mb-1">USERNAME</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-100"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-100"
                            placeholder="Enter password"
                        />
                    </div>
                </div>

                <Button onClick={handleSignup} className="w-full py-3 text-lg">
                    <UserPlus className="mr-2" /> SIGN UP
                </Button>

                <p className="mt-4 text-center text-sm">
                    Already have an account? <span className="font-bold cursor-pointer underline" onClick={() => navigate('/')}>Login</span>
                </p>
            </div>
        </div>
    );
};
