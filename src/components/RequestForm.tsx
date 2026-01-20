import React, { useState } from 'react';
import type { CreateRequestDto, State } from '../types/request.types';
import { validateRequest } from '../utils/validation';

type ValidationErrors = Record<string, string | undefined>;

interface RequestFormProps {
  onSubmit: (data: CreateRequestDto) => void;
  onCancel: () => void;
  isLoading: boolean;
  states: State[];
}

const RequestForm = ({
  onSubmit,
  onCancel,
  isLoading,
  states,
}: RequestFormProps) => {
  const [formData, setFormData] = useState<Partial<CreateRequestDto>>({
    propertyAddress: '',
    propertyType: undefined,
    stateId: '',
    purpose: '',
    estimatedValue: undefined,
    status: 'Draft',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validationErrors = validateRequest(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData as CreateRequestDto);
  };

  const handleChange = (field: keyof CreateRequestDto, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors && errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>
          Create Valuation Request
        </h2>

        <div>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="propertyAddress"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              Property Address *
            </label>
            <input
              id="propertyAddress"
              type="text"
              value={formData.propertyAddress}
              onChange={(e) => handleChange('propertyAddress', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${
                  errors.propertyAddress ? '#dc2626' : '#d1d5db'
                }`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
            />
            {errors.propertyAddress && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>
                {errors.propertyAddress}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="propertyType"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              Property Type *
            </label>
            <select
              id="propertyType"
              value={formData.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${
                  errors.propertyType ? '#dc2626' : '#d1d5db'
                }`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
            >
              <option value="">Select property type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
            {errors.propertyType && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>
                {errors.propertyType}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="state"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              State *
            </label>
            <select
              id="state"
              value={formData.stateId || ''}
              onChange={(e) => handleChange('stateId', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.stateId ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.stateId && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>
                {errors.stateId}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="purpose"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              Purpose *
            </label>
            <input
              id="purpose"
              type="text"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.purpose ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
            />
            {errors.purpose && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>
                {errors.purpose}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="estimatedValue"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              Estimated Value (RM) *
            </label>
            <input
              id="estimatedValue"
              type="number"
              value={formData.estimatedValue || ''}
              onChange={(e) =>
                handleChange('estimatedValue', parseFloat(e.target.value))
              }
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${
                  errors.estimatedValue ? '#dc2626' : '#d1d5db'
                }`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
              step="0.01"
            />
            {errors.estimatedValue && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>
                {errors.estimatedValue}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="status"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={isLoading}
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {isLoading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;