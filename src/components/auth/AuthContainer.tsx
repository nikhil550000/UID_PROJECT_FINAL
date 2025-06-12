
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import PharmaLanding from '../PharmaLanding';

type AuthView = 'landing' | 'login' | 'signup';

const AuthContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('landing');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <PharmaLanding
            onGetStarted={() => setCurrentView('signup')}
            onLogin={() => setCurrentView('login')}
          />
        );
      case 'login':
        return (
          <LoginForm 
            onSwitchToSignup={() => setCurrentView('signup')}
            onBackToLanding={() => setCurrentView('landing')}
          />
        );
      case 'signup':
        return (
          <SignupForm 
            onSwitchToLogin={() => setCurrentView('login')}
            onBackToLanding={() => setCurrentView('landing')}
          />
        );
      default:
        return (
          <PharmaLanding
            onGetStarted={() => setCurrentView('signup')}
            onLogin={() => setCurrentView('login')}
          />
        );
    }
  };

  return <>{renderCurrentView()}</>;
};

export default AuthContainer;
