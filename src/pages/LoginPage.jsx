import React from 'react'
import '../styles/loginpage.css'; // Assuming you have a CSS file for styling
const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-card">
        
        <div className="login-header">
          <h1>Welcome to Study Sync</h1>
          <p>Please log in to continue</p>
        </div>

        <a href="http://localhost:5000/auth/google" className="login-button">
          {/* Google Icon SVG */}
          <svg className="google-icon" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.151,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Login with Google</span>
        </a>

      </div>
    </div>
  );
};

export default LoginPage