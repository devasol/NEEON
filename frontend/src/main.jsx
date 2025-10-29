import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

// Check for token or error in URL parameters (from Google OAuth callback) and handle appropriately
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const error = params.get('error');
  
  if (token) {
    try {
      localStorage.setItem('token', token);
      
      // Decode token to check if user is admin
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.role === 'admin';
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      
      // Remove token from URL to prevent it from appearing in the address bar
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    } catch (error) {
      console.error('Error processing token from URL:', error);
    }
  } else if (error) {
    // Handle error from OAuth - you can store it in localStorage or sessionStorage
    // to display in the UI if needed
    console.error('OAuth error:', error);
    // Optionally store error for display in UI
    sessionStorage.setItem('oauthError', error);
    
    // Remove error from URL to prevent it from appearing in the address bar
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
}

// Check for token or error when the app loads
checkUrlParams();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
)
