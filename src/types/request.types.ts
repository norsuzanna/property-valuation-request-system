// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Valuation request types
export interface State {
  id: string;
  name: string;
  code: string;
}

export interface CreateRequestDto {
  propertyAddress: string;
  propertyType: string;
  stateId: string;
  purpose: string;
  estimatedValue: number;
  status: string;
}

export interface ValuationRequest extends CreateRequestDto {
  id: string;
  stateName: string;
  requestedByName: string;
  createdAt: string;
}