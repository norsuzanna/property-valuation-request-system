import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from '../api';
import type { CreateRequestDto } from '../../types/request.types';

// Mock timers for async delays
vi.useFakeTimers();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  describe('getStates', () => {
    it('returns list of states', async () => {
      const promise = api.getStates();
      
      // Fast-forward time to resolve the delay
      await vi.runAllTimersAsync();
      
      const states = await promise;

      expect(states).toBeDefined();
      expect(Array.isArray(states)).toBe(true);
      expect(states.length).toBeGreaterThan(0);
      expect(states[0]).toHaveProperty('id');
      expect(states[0]).toHaveProperty('name');
      expect(states[0]).toHaveProperty('code');
    });

    it('returns states with expected structure', async () => {
      const promise = api.getStates();
      await vi.runAllTimersAsync();
      const states = await promise;

      states.forEach(state => {
        expect(state).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          code: expect.any(String),
        });
      });
    });

    it('includes Malaysian states', async () => {
      const promise = api.getStates();
      await vi.runAllTimersAsync();
      const states = await promise;

      const stateNames = states.map(s => s.name);
      expect(stateNames).toContain('Johor');
      expect(stateNames).toContain('Selangor');
      expect(stateNames).toContain('Kuala Lumpur');
    });
  });

  describe('getRequests', () => {
    it('returns list of valuation requests', async () => {
      const promise = api.getRequests();
      await vi.runAllTimersAsync();
      const requests = await promise;

      expect(requests).toBeDefined();
      expect(Array.isArray(requests)).toBe(true);
    });

    it('returns requests with correct structure', async () => {
      const promise = api.getRequests();
      await vi.runAllTimersAsync();
      const requests = await promise;

      if (requests.length > 0) {
        const request = requests[0];
        expect(request).toHaveProperty('id');
        expect(request).toHaveProperty('propertyAddress');
        expect(request).toHaveProperty('propertyType');
        expect(request).toHaveProperty('stateId');
        expect(request).toHaveProperty('stateName');
        expect(request).toHaveProperty('purpose');
        expect(request).toHaveProperty('estimatedValue');
        expect(request).toHaveProperty('status');
        expect(request).toHaveProperty('requestedByName');
        expect(request).toHaveProperty('createdAt');
      }
    });

    it('returns requests with valid property types', async () => {
      const promise = api.getRequests();
      await vi.runAllTimersAsync();
      const requests = await promise;

      const validTypes = ['Residential', 'Commercial', 'Industrial'];
      requests.forEach(request => {
        expect(validTypes).toContain(request.propertyType);
      });
    });

    it('returns requests with valid statuses', async () => {
      const promise = api.getRequests();
      await vi.runAllTimersAsync();
      const requests = await promise;

      const validStatuses = ['Draft', 'Submitted', 'Completed'];
      requests.forEach(request => {
        expect(validStatuses).toContain(request.status);
      });
    });

    it('returns requests with positive estimated values', async () => {
      const promise = api.getRequests();
      await vi.runAllTimersAsync();
      const requests = await promise;

      requests.forEach(request => {
        expect(request.estimatedValue).toBeGreaterThan(0);
      });
    });
  });

  describe('createRequest', () => {
    const validRequestData: CreateRequestDto = {
      propertyAddress: '123 Test Street',
      propertyType: 'Residential',
      stateId: '1',
      purpose: 'Purchase financing',
      estimatedValue: 500000,
      status: 'Draft',
    };

    it('creates a new request and returns it', async () => {
      const promise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest).toBeDefined();
      expect(newRequest.id).toBeDefined();
      expect(newRequest.propertyAddress).toBe(validRequestData.propertyAddress);
      expect(newRequest.propertyType).toBe(validRequestData.propertyType);
      expect(newRequest.purpose).toBe(validRequestData.purpose);
      expect(newRequest.estimatedValue).toBe(validRequestData.estimatedValue);
      expect(newRequest.status).toBe(validRequestData.status);
    });

    it('assigns state name from state id', async () => {
      const promise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.stateName).toBeDefined();
      expect(newRequest.stateName.length).toBeGreaterThan(0);
    });

    it('generates unique id for new request', async () => {
      const promise1 = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const request1 = await promise1;

      const promise2 = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const request2 = await promise2;

      expect(request1.id).not.toBe(request2.id);
    });

    it('sets requestedByName', async () => {
      const promise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.requestedByName).toBeDefined();
      expect(newRequest.requestedByName).toBe('Current User');
    });

    it('sets createdAt timestamp', async () => {
      const promise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.createdAt).toBeDefined();
      expect(new Date(newRequest.createdAt).getTime()).not.toBeNaN();
    });

    it('adds created request to requests list', async () => {
      const beforePromise = api.getRequests();
      await vi.runAllTimersAsync();
      const requestsBefore = await beforePromise;
      const countBefore = requestsBefore.length;

      const createPromise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      await createPromise;

      const afterPromise = api.getRequests();
      await vi.runAllTimersAsync();
      const requestsAfter = await afterPromise;

      expect(requestsAfter.length).toBe(countBefore + 1);
    });

    it('handles Commercial property type', async () => {
      const commercialData: CreateRequestDto = {
        ...validRequestData,
        propertyType: 'Commercial',
      };

      const promise = api.createRequest(commercialData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.propertyType).toBe('Commercial');
    });

    it('handles Submitted status', async () => {
      const submittedData: CreateRequestDto = {
        ...validRequestData,
        status: 'Submitted',
      };

      const promise = api.createRequest(submittedData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.status).toBe('Submitted');
    });

    it('preserves all request data fields', async () => {
      const promise = api.createRequest(validRequestData);
      await vi.runAllTimersAsync();
      const newRequest = await promise;

      expect(newRequest.propertyAddress).toBe(validRequestData.propertyAddress);
      expect(newRequest.propertyType).toBe(validRequestData.propertyType);
      expect(newRequest.stateId).toBe(validRequestData.stateId);
      expect(newRequest.purpose).toBe(validRequestData.purpose);
      expect(newRequest.estimatedValue).toBe(validRequestData.estimatedValue);
      expect(newRequest.status).toBe(validRequestData.status);
    });
  });
});