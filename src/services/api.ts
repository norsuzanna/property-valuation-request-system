import type { CreateRequestDto, ValuationRequest, State, LoginCredentials, AuthResponse } from '../types/request.types';

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
const requests: ValuationRequest[] = [
    {
    id: '1',
    propertyAddress: '123 Jalan Ampang, Kuala Lumpur',
    propertyType: 'Residential',
    stateId: '3',
    stateName: 'Kuala Lumpur',
    purpose: 'Purchase financing',
    estimatedValue: 850000,
    status: 'Submitted',
    requestedByName: 'John Tan',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    propertyAddress: '45 Jalan Sultan Ismail, Kuala Lumpur',
    propertyType: 'Commercial',
    stateId: '3',
    stateName: 'Kuala Lumpur',
    purpose: 'Refinancing',
    estimatedValue: 2500000,
    status: 'Completed',
    requestedByName: 'Sarah Lee',
    createdAt: '2026-01-10T14:20:00Z',
  },
];

// In-memory storage for authentication
let currentUser: AuthResponse['user'] | null = null;
let authToken: string | null = null;

/**
 * Logs in with email and password (mock implementation)
 */
async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation - accept any email/password for demo
      if (credentials.email && credentials.password) {
        const user = {
          id: 'user-123',
          name: credentials.email.split('@')[0],
          email: credentials.email,
        };
        authToken = `token-${Date.now()}`;
        currentUser = user;
        resolve({ token: authToken, user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}

/**
 * Logs out the current user
 */
function logout(): void {
  currentUser = null;
  authToken = null;
}

/**
 * Checks if user is authenticated
 */
function isAuthenticated(): boolean {
  return !!authToken && !!currentUser;
}

/**
 * Gets the current user
 */
function getUser(): AuthResponse['user'] | null {
  return currentUser;
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
      const newRequest: ValuationRequest = {
        id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyAddress: data.propertyAddress,
        propertyType: data.propertyType,
        stateId: data.stateId,
        stateName: state?.name || '',
        purpose: data.purpose,
        estimatedValue: data.estimatedValue,
        status: data.status,
        requestedByName: currentUser?.name || 'Current User',
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
  getStates,
  getRequests,
  createRequest,
};