import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { VerificationPage } from './pages/VerificationPage';
import { QuestPage } from './pages/QuestPage';
import { ProfilePage } from './pages/ProfilePage';
import { ShopPage } from './pages/ShopPage';
import { MapPage } from './pages/MapPage';
import { ActiveQuestsPage } from './pages/ActiveQuestsPage';
import { useGameStore } from './stores/useGameStore';

function App() {
  const user = useGameStore((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Profile Setup - requires logged-in user */}
      <Route
        path="/profile-setup"
        element={user ? <ProfileSetupPage /> : <Navigate to="/" />}
      />

      {/* Verification - requires logged-in user with profile */}
      <Route
        path="/verification"
        element={
          user && user.fullName ? <VerificationPage /> : <Navigate to="/" />
        }
      />

      {/* Quest - requires verified user */}
      <Route
        path="/quest"
        element={user && user.isVerified ? <QuestPage /> : <Navigate to="/" />}
      />

      {/* Profile - requires verified user */}
      <Route
        path="/profile"
        element={user && user.isVerified ? <ProfilePage /> : <Navigate to="/" />}
      />

      {/* Shop - requires verified user */}
      <Route
        path="/shop"
        element={user && user.isVerified ? <ShopPage /> : <Navigate to="/" />}
      />

      {/* Map - requires verified user */}
      <Route
        path="/map"
        element={user && user.isVerified ? <MapPage /> : <Navigate to="/" />}
      />

      {/* Active Quests - requires verified user */}
      <Route
        path="/active-quests"
        element={user && user.isVerified ? <ActiveQuestsPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
