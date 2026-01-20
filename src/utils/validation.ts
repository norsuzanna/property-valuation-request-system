import type { CreateRequestDto } from '../types/request.types';

type ValidationErrors = Record<string, string>;

/**
 * Validates valuation request data
 * Returns an object with error messages for invalid fields
 */
export const validateRequest = (data: Partial<CreateRequestDto>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Property Address validation
  if (!data.propertyAddress?.trim()) {
    errors.propertyAddress = 'Property address is required';
  } else if (data.propertyAddress.length > 500) {
    errors.propertyAddress = 'Property address must not exceed 500 characters';
  }

  // Property Type validation
  if (!data.propertyType) {
    errors.propertyType = 'Property type is required';
  }

  // State validation
  if (!data.stateId) {
    errors.stateId = 'State is required';
  }

  // Purpose validation
  if (!data.purpose?.trim()) {
    errors.purpose = 'Purpose is required';
  } else if (data.purpose.length > 200) {
    errors.purpose = 'Purpose must not exceed 200 characters';
  }

  // Estimated Value validation
  if (!data.estimatedValue || data.estimatedValue <= 0) {
    errors.estimatedValue = 'Estimated value must be greater than 0';
  }

  return errors;
};