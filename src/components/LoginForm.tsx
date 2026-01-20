import React, { useState } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm = ({ 
  onLogin, 
  isLoading = false, 
  error = null 
}: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setValidationError('Email and password are required');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setValidationError('');
    onLogin({ email, password });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2
          style={{ marginTop: 0, marginBottom: '8px', textAlign: 'center' }}
        >
          Valuation Request System
        </h2>
        <p
          style={{
            marginBottom: '24px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          Sign in to continue
        </p>

        {(error || validationError) && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {error || validationError}
          </div>
        )}

        <div>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
                fontSize: '14px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
                }
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
                fontSize: '14px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
                }
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#166534',
            }}
          >
            <strong>Demo Mode:</strong> Enter any email and password to login
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;