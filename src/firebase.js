import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-app-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         !firebaseConfig.apiKey.includes('DummyKey') && 
         !firebaseConfig.authDomain.includes('your-app') &&
         !firebaseConfig.projectId.includes('your-app');
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure auth settings
auth.useDeviceLanguage(); // Use device language for OAuth

// Provider instances
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure provider scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

githubProvider.addScope('user:email');

// Firebase SSO service
export const firebaseSSO = {
  // Check if Firebase is configured
  isConfigured() {
    return isFirebaseConfigured();
  },

  // Sign in with Google
  async signInWithGoogle() {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured');
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google SSO Error:', error);
      throw error;
    }
  },

  // Sign in with Facebook
  async signInWithFacebook() {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured');
    }
    
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result.user;
    } catch (error) {
      console.error('Facebook SSO Error:', error);
      throw error;
    }
  },

  // Sign in with GitHub
  async signInWithGitHub() {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured');
    }
    
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      console.error('GitHub SSO Error:', error);
      throw error;
    }
  },

  // Sign in with redirect (for mobile)
  signInWithRedirect(provider) {
    const providers = {
      google: googleProvider,
      facebook: facebookProvider,
      github: githubProvider
    };

    return signInWithRedirect(auth, providers[provider]);
  },

  // Get redirect result
  async getRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      return result.user;
    } catch (error) {
      console.error('Redirect Result Error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Convert Firebase user to app user format
  formatUser(firebaseUser, provider) {
    return {
      id: firebaseUser.uid,
      providerId: `${provider}_${firebaseUser.uid}`,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]?.charAt(0).toUpperCase() + firebaseUser.email?.split('@')[0]?.slice(1) || 'User',
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email?.split('@')[0] || 'User'}&background=667eea&color=fff`,
      provider,
      token: firebaseUser.accessToken,
      refreshToken: firebaseUser.refreshToken,
      emailVerified: firebaseUser.emailVerified,
      createdAt: firebaseUser.metadata.creationTime,
      lastLogin: new Date().toISOString()
    };
  }
};

export default app;
