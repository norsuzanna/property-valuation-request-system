import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { CreateRequestDto, ValuationRequest, State, LoginCredentials, AuthResponse } from '../../types/request.types';

// Mock timers for async delays
vi.useFakeTimers();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock data for states
const STATES: State[] = [
  { id: '1', name: 'Johor', code: 'JHR' },
  { id: '2', name: 'Kedah', code: 'KDH' },
  { id: '3', name: 'Kelantan', code: 'KTN' },
  { id: '4', name: 'Kuala Lumpur', code: 'KUL' },
  { id: '5', name: 'Labuan', code: 'LBN' },
  { id: '6', name: 'Melaka', code: 'MLK' },
  { id: '7', name: 'Negeri Sembilan', code: 'NSN' },
  { id: '8', name: 'Pahang', code: 'PHG' },
  { id: '9', name: 'Penang', code: 'PNG' },
  { id: '10', name: 'Perak', code: 'PRK' },
  { id: '11', name: 'Perlis', code: 'PLS' },
  { id: '12', name: 'Putrajaya', code: 'PJY' },
  { id: '13', name: 'Sabah', code: 'SBH' },
  { id: '14', name: 'Sarawak', code: 'SWK' },
  { id: '15', name: 'Selangor', code: 'SLG' },
  { id: '16', name: 'Terengganu', code: 'TRG' },
];

// In-memory storage for requests
const requests: ValuationRequest[] = [];

/**
 * Logs in with email and password
 */
async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!credentials.email || !credentials.password) {
        reject(new Error('Invalid credentials'));
        return;
      }

      // Extract username from email (part before @)
      const name = credentials.email.split('@')[0];
      
      // Generate a mock token
      const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const user = {
        id: `user-${Date.now()}`,
        name,
        email: credentials.email,
      };

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      resolve({ token, user });
    }, 100);
  });
}

/**
 * Logs out the current user
 */
function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

/**
 * Checks if user is authenticated
 */
function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

/**
 * Gets the current user from storage
 */
function getUser(): AuthResponse['user'] | null {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

/**
 * Gets the authentication token from storage
 */
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Fetches the list of Malaysian states
 */
async function getStates(): Promise<State[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...STATES]);
    }, 100);
  });
}

/**
 * Fetches all valuation requests
 */
async function getRequests(): Promise<ValuationRequest[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...requests]);
    }, 100);
  });
}

/**
 * Creates a new valuation request
 */
async function createRequest(data: CreateRequestDto): Promise<ValuationRequest> {
  return new Promise(resolve => {
    setTimeout(() => {
      const state = STATES.find(s => s.id === data.stateId);
      const user = getUser();
      const newRequest: ValuationRequest = {
        id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyAddress: data.propertyAddress,
        propertyType: data.propertyType,
        stateId: data.stateId,
        stateName: state?.name || '',
        purpose: data.purpose,
        estimatedValue: data.estimatedValue,
        status: data.status,
        requestedByName: user?.name || 'Current User',
        createdAt: new Date().toISOString(),
      };

      requests.push(newRequest);
      resolve(newRequest);
    }, 100);
  });
}

// Export as a namespace object for compatibility with test imports
export const api = {
  login,
  logout,
  isAuthenticated,
  getUser,
  getToken,
  getStates,
  getRequests,
  createRequest,
};

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('login', () => {
    it('successfully authenticates with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const promise = api.login(credentials);
      await vi.runAllTimersAsync();
      const response = await promise;

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(credentials.email);
    });

    it('stores token in localStorage after successful login', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const promise = api.login(credentials);
      await vi.runAllTimersAsync();
      await promise;

      const storedToken = localStorage.getItem('auth_token');
      expect(storedToken).toBeDefined();
      expect(storedToken).toContain('mock-jwt-token');
    });

    it('stores user data in localStorage after successful login', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };

      const promise = api.login(credentials);
      await vi.runAllTimersAsync();
      await promise;

      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeDefined();
      
      const user = JSON.parse(storedUser!);
      expect(user.email).toBe(credentials.email);
      expect(user.name).toBe('john'); // Extracted from email
    });

    it('extracts username from email for user name', async () => {
      const credentials = {
        email: 'alice.smith@company.com',
        password: 'password123',
      };

      const promise = api.login(credentials);
      await vi.runAllTimersAsync();
      const response = await promise;

      expect(response.user.name).toBe('alice.smith');
    });

    it('generates unique tokens for different login sessions', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const promise1 = api.login(credentials);
      await vi.runAllTimersAsync();
      const response1 = await promise1;

      // Clear and login again
      localStorageMock.clear();

      const promise2 = api.login(credentials);
      await vi.runAllTimersAsync();
      const response2 = await promise2;

      expect(response1.token).not.toBe(response2.token);
    });

    it('throws error when email is missing', async () => {
      const credentials = {
        email: '',
        password: 'password123',
      };

      const promise = api.login(credentials);
      const promiseCheck = expect(promise).rejects.toThrow('Invalid credentials');
      await vi.runAllTimersAsync();
      await promiseCheck;
    });

    it('throws error when password is missing', async () => {
      const credentials = {
        email: 'test@example.com',
        password: '',
      };

      const promise = api.login(credentials);
      const promiseCheck = expect(promise).rejects.toThrow('Invalid credentials');
      await vi.runAllTimersAsync();
      await promiseCheck;
    });
  });

  describe('logout', () => {
    it('removes auth token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test' }));

      api.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('removes user data from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test' }));

      api.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('can be called multiple times safely', () => {
      localStorage.setItem('auth_token', 'test-token');

      api.logout();
      api.logout();
      api.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');

      expect(api.isAuthenticated()).toBe(true);
    });

    it('returns false when token does not exist', () => {
      expect(api.isAuthenticated()).toBe(false);
    });

    it('returns false after logout', () => {
      localStorage.setItem('auth_token', 'test-token');
      
      expect(api.isAuthenticated()).toBe(true);
      
      api.logout();
      
      expect(api.isAuthenticated()).toBe(false);
    });
  });

  describe('getUser', () => {
    it('returns user data when stored', () => {
      const userData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      localStorage.setItem('user', JSON.stringify(userData));

      const user = api.getUser();

      expect(user).toEqual(userData);
    });

    it('returns null when no user data exists', () => {
      const user = api.getUser();

      expect(user).toBeNull();
    });

    it('returns null after logout', () => {
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test' }));
      
      api.logout();
      
      const user = api.getUser();
      expect(user).toBeNull();
    });

    it('parses user JSON correctly', () => {
      const userData = {
        id: '123',
        name: 'Alice',
        email: 'alice@example.com',
      };
      
      localStorage.setItem('user', JSON.stringify(userData));

      const user = api.getUser();

      expect(user).not.toBeNull();
      expect(user!.id).toBe('123');
      expect(user!.name).toBe('Alice');
      expect(user!.email).toBe('alice@example.com');
    });
  });

  describe('getToken', () => {
    it('returns token when stored', () => {
      const token = 'test-jwt-token-12345';
      localStorage.setItem('auth_token', token);

      expect(api.getToken()).toBe(token);
    });

    it('returns null when no token exists', () => {
      expect(api.getToken()).toBeNull();
    });

    it('returns null after logout', () => {
      localStorage.setItem('auth_token', 'test-token');
      
      api.logout();
      
      expect(api.getToken()).toBeNull();
    });
  });

  describe('authentication flow', () => {
    it('completes full login flow correctly', async () => {
      // User not authenticated initially
      expect(api.isAuthenticated()).toBe(false);
      expect(api.getUser()).toBeNull();

      // Login
      const credentials = {
        email: 'user@test.com',
        password: 'pass123',
      };

      const promise = api.login(credentials);
      await vi.runAllTimersAsync();
      const response = await promise;

      // Check authentication state
      expect(api.isAuthenticated()).toBe(true);
      expect(api.getUser()).toEqual(response.user);
      expect(api.getToken()).toBe(response.token);

      // Logout
      api.logout();

      // Check state after logout
      expect(api.isAuthenticated()).toBe(false);
      expect(api.getUser()).toBeNull();
      expect(api.getToken()).toBeNull();
    });
  });
});