import { useState, useEffect, useCallback } from 'react';
import RequestForm from './components/RequestForm';
import FilterBar from './components/FilterBar';
import LoginForm from './components/LoginForm';
import { useDebounce } from './hooks/useDebounce';
import { api } from './services/api';
import type { ValuationRequest, State, CreateRequestDto, LoginCredentials } from './types/request.types';

interface User {
  name: string;
}

// Main App
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ValuationRequest[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [filters, setFilters] = useState({
    propertyType: '',
    status: '',
    stateId: '',
    search: '',
  });

  // Debounce search with 300ms delay
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    // Check if user is already authenticated
    if (api.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(api.getUser());
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [requestsData, statesData] = await Promise.all([
        api.getRequests(),
        api.getStates(),
      ]);
      setRequests(requestsData);
      setStates(statesData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const authResponse = await api.login(credentials);
      setIsAuthenticated(true);
      setUser(authResponse.user);
      await loadData();
    } catch (err) {
      console.error(err);
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setRequests([]);
    setStates([]);
  };

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredRequests = requests.filter((req) => {
    if (filters.propertyType && req.propertyType !== filters.propertyType)
      return false;
    if (filters.status && req.status !== filters.status) return false;
    if (filters.stateId && req.stateId !== filters.stateId) return false;
    if (
      debouncedSearch &&
      !req.propertyAddress.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateRequest = async (data: CreateRequestDto) => {
    try {
      setIsSubmitting(true);
      const newRequest = await api.createRequest(data);
      setRequests((prev) => [newRequest, ...prev]);
      setShowForm(false);
      setSuccessMessage('Valuation request created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return '#6b7280';
      case 'Submitted':
        return '#3b82f6';
      case 'Completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Valuation Requests</h1>
          {user && (
            <p
              style={{
                margin: '4px 0 0 0',
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              Welcome, {user.name}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            + Create New Request
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        states={states}
      />

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                Address
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                State
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                Value
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No requests found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  style={{ borderTop: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {request.propertyAddress}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {request.propertyType}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {request.stateName}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status),
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      textAlign: 'right',
                      fontWeight: '500',
                    }}
                  >
                    {formatCurrency(request.estimatedValue)}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}
                  >
                    {formatDate(request.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <RequestForm
          onSubmit={handleCreateRequest}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          states={states}
        />
      )}
    </div>
  );
}