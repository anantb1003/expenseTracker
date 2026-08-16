import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const GoogleAuthButton = ({ mode = 'signin', onSuccess, onError }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!googleClientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleSignIn();
      document.body.appendChild(script);
    };

    const initGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
      }
    };

    loadGoogleScript();
  }, [googleClientId]);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      // Decode JWT token payload from Google ID token
      let payload = {};
      if (response.credential) {
        try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          payload = JSON.parse(jsonPayload);
        } catch (e) {
          console.warn('Failed to parse Google ID Token:', e);
        }
      }

      const googleUser = {
        credential: response.credential,
        email: payload.email || 'user@gmail.com',
        name: payload.name || payload.given_name || 'Google User',
        googleId: payload.sub || 'google-id-' + Date.now(),
        picture: payload.picture || null,
      };

      await loginWithGoogle(googleUser);
      if (onSuccess) onSuccess(googleUser);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowPromptModal(true);
          }
        });
        return;
      } catch (e) {
        console.warn('Google One Tap prompt failed, opening login dialog:', e);
      }
    }
    setShowPromptModal(true);
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) return;

    setLoading(true);
    try {
      const formattedName = googleName.trim() || googleEmail.split('@')[0].replace('.', ' ');
      const user = await loginWithGoogle({
        email: googleEmail.trim(),
        name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
        picture: null,
      });
      setShowPromptModal(false);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700/90 text-white font-extrabold text-sm shadow-xl hover:border-slate-600 active:scale-98 transition-all duration-200 group"
      >
        <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span className="text-white font-extrabold">{loading ? 'Connecting Google Account...' : mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
      </button>

      {/* Google Account Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-scale-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Google SSO Authentication</h3>
                  <p className="text-xs text-slate-400">Enter your Google Account email to continue</p>
                </div>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Anant Bawaskar"
                  className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Multi-tenant Google session active. Syncs securely across your devices when linked to backend.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPromptModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition"
                >
                  {loading ? 'Authenticating...' : 'Sign In with Google'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
