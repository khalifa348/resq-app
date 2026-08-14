import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import SelectServicePage from './pages/SelectServicePage';
import ServiceTrackingPage from './pages/ServiceTrackingPage';
import LoadingScreenPage from './pages/LoadingScreenPage';
import ProviderTrackingPage from './pages/ProviderTrackingPage';
import RingingScreenPage from './pages/RingingScreenPage';
import CallScreenPage from './pages/CallScreenPage';
import ChatScreenPage from './pages/ChatScreenPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ServiceCompletePage from './pages/ServiceCompletePage';
import GarageListPage from './pages/GarageListPage';
import './App.css';

export default function App() {
  return (
    <div className="iphone-frame">
      {/* Dynamic Island notch */}
      <div className="notch" />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/home" element={<SplashPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/select-service" element={<SelectServicePage />} />
        <Route path="/service-tracking" element={<ServiceTrackingPage />} />
        <Route path="/loading-screen" element={<LoadingScreenPage />} />
        <Route path="/provider-tracking" element={<ProviderTrackingPage />} />
        <Route path="/ringing-screen" element={<RingingScreenPage />} />
        <Route path="/call-screen" element={<CallScreenPage />} />
        <Route path="/chat-screen" element={<ChatScreenPage />} />
        <Route path="/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="/service-complete" element={<ServiceCompletePage />} />
        <Route path="/garages" element={<GarageListPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
