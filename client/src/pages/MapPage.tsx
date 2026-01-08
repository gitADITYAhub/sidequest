import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
import { useGameStore } from '../stores/useGameStore';
import { api } from '../lib/axios';
import { BottomNav } from '../components/BottomNav';
import 'mapbox-gl/dist/mapbox-gl.css';

// IMPORTANT: Get your own token from https://account.mapbox.com/access-tokens/
// This is a public token that should work for testing
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWRpdHlhMDExMDIwMDIiLCJhIjoiY21pZTl0bm5yMDBocDNmc2c5ZGEwbDV1bCJ9.0b1LnNRLdgN-8zxWCgL0Ug';

export const MapPage = () => {
    const user = useGameStore((state) => state.user);
    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 13,
    });
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [unlockedTiles, setUnlockedTiles] = useState<string[]>([]);
    const [lastPing, setLastPing] = useState<number>(0);
    const mapRef = useRef<any>(null);

    // Helper functions (defined before effects)
    const fetchUnlockedTiles = async () => {
        if (!user) return;

        try {
            const response = await api.get(`/map/tiles/${user.id}`);
            setUnlockedTiles(response.data.tiles || []);
        } catch (error) {
            console.error('Error fetching tiles:', error);
        }
    };

    const pingLocation = async (lat: number, lng: number) => {
        if (!user) return;

        try {
            const response = await api.post('/map/ping', { userId: user.id, lat, lng });

            const data = response.data;

            if (data.status === 'NEW_UNLOCK') {
                // Show notification
                alert(`🎉 ${data.message}`);
                // Refresh tiles
                fetchUnlockedTiles();
            }
        } catch (error) {
            console.error('Error pinging location:', error);
        }
    };

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setViewState({
                        longitude,
                        latitude,
                        zoom: 15,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );

            // Watch position for continuous updates
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });

                    // Ping backend every 30 seconds
                    const now = Date.now();
                    if (now - lastPing > 30000) {
                        pingLocation(latitude, longitude);
                        setLastPing(now);
                    }
                },
                (error) => {
                    console.error('Error watching location:', error);
                },
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [lastPing]);

    // Load unlocked tiles on mount
    useEffect(() => {
        if (user) {
            fetchUnlockedTiles();
        }
    }, [user]);

    return (
        <div className="h-screen w-screen relative bg-yellow-50 pb-16">
            {/* Map Container */}
            <div className="absolute inset-0 pb-16">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={(evt: any) => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker
                            longitude={userLocation.lng}
                            latitude={userLocation.lat}
                            anchor="center"
                        >
                            <div className="w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg animate-pulse" />
                        </Marker>
                    )}

                    {/* Fog of War Layer - Coming soon */}
                    {/* Will render unlocked tiles here */}
                </Map>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-sm">
                    <h2 className="text-xl font-black uppercase mb-2">🗺️ Exploration</h2>
                    <div className="space-y-1">
                        <p className="font-bold">Tiles Unlocked: {unlockedTiles.length}</p>
                        <p className="font-bold">Area Explored: {(unlockedTiles.length * 0.25).toFixed(1)} km²</p>
                        <p className="text-sm text-gray-600 font-bold">
                            {unlockedTiles.length >= 10 ? '🏆 Explorer!' : '🌱 Keep exploring!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="absolute bottom-20 left-4 right-4 z-10">
                <div className="border-4 border-black bg-yellow-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black uppercase text-center">
                        🚧 Fog of War rendering coming soon! 🚧
                    </p>
                    <p className="text-sm font-bold text-center mt-2">
                        Walk around to unlock tiles and earn XP!
                    </p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};
