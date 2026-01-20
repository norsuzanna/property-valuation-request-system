import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RequestForm from '../RequestForm';

const mockStates = [
  { id: '1', name: 'Johor', code: 'JHR' },
  { id: '2', name: 'Selangor', code: 'SGR' },
];

describe('RequestForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isLoading: false,
    states: mockStates,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RequestForm {...defaultProps} />);

    expect(screen.getByLabelText(/property address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimated value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    render(<RequestForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/property address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/property type is required/i)).toBeInTheDocument();
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
      expect(screen.getByText(/purpose is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates property address max length', async () => {
    render(<RequestForm {...defaultProps} />);

    const addressInput = screen.getByLabelText(/property address/i) as HTMLInputElement;
    const longAddress = 'a'.repeat(501);

    fireEvent.change(addressInput, { target: { value: longAddress } });

    const submitButton = screen.getByRole('button', { name: /create request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/property address must not exceed 500 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates purpose max length', async () => {
    render(<RequestForm {...defaultProps} />);

    const purposeInput = screen.getByLabelText(/purpose/i) as HTMLInputElement;
    const longPurpose = 'a'.repeat(201);

    fireEvent.change(purposeInput, { target: { value: longPurpose } });

    const submitButton = screen.getByRole('button', { name: /create request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/purpose must not exceed 200 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates estimated value is greater than zero', async () => {
    const user = userEvent.setup();
    render(<RequestForm {...defaultProps} />);

    const valueInput = screen.getByLabelText(/estimated value/i);
    await user.type(valueInput, '0');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/estimated value must be greater than 0/i)
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<RequestForm {...defaultProps} />);

    // Fill in all fields
    await user.type(
      screen.getByLabelText(/property address/i),
      '123 Jalan Test'
    );
    await user.selectOptions(
      screen.getByLabelText(/property type/i),
      'Residential'
    );
    await user.selectOptions(screen.getByLabelText(/state/i), '1');
    await user.type(screen.getByLabelText(/purpose/i), 'Purchase financing');
    await user.type(screen.getByLabelText(/estimated value/i), '500000');

    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        propertyAddress: '123 Jalan Test',
        propertyType: 'Residential',
        stateId: '1',
        purpose: 'Purchase financing',
        estimatedValue: 500000,
        status: 'Draft',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<RequestForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form inputs when loading', () => {
    render(<RequestForm {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText(/property address/i)).toBeDisabled();
    expect(screen.getByLabelText(/property type/i)).toBeDisabled();
    expect(screen.getByLabelText(/state/i)).toBeDisabled();
    expect(screen.getByLabelText(/purpose/i)).toBeDisabled();
    expect(screen.getByLabelText(/estimated value/i)).toBeDisabled();
  });

  it('shows loading state on submit button', () => {
    render(<RequestForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
  });

  it('clears error when user starts typing in field', async () => {
    const user = userEvent.setup();
    render(<RequestForm {...defaultProps} />);

    // Trigger validation error
    const submitButton = screen.getByRole('button', { name: /create request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/property address is required/i)).toBeInTheDocument();
    });

    // Start typing in the field
    const addressInput = screen.getByLabelText(/property address/i);
    await user.type(addressInput, 'Test');

    // Error should be cleared
    await waitFor(() => {
      expect(
        screen.queryByText(/property address is required/i)
      ).not.toBeInTheDocument();
    });
  });

  it('populates state dropdown with provided states', () => {
    render(<RequestForm {...defaultProps} />);

    const stateSelect = screen.getByLabelText(/state/i);
    const options = Array.from(stateSelect.querySelectorAll('option'));

    expect(options).toHaveLength(3); // 1 placeholder + 2 states
    expect(options[1]).toHaveTextContent('Johor');
    expect(options[2]).toHaveTextContent('Selangor');
  });

  it('defaults status to Draft', () => {
    render(<RequestForm {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
    expect(statusSelect.value).toBe('Draft');
  });
});
