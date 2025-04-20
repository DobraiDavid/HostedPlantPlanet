import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProfilePage from '../Profile';
import { UserProvider } from '../../context/UserContext';
import * as api from '../../api/api';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// 1. First mock react-toastify with inline factory function
vi.mock('react-toastify', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn()
    },
    ToastContainer: () => <div data-testid="toast-container" />
  };
});

// 2. Mock the API functions
vi.mock('../../api/api', () => ({
  changeUserDetails: vi.fn(),
  logout: vi.fn()
}));

// 3. Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: actual.BrowserRouter,
  };
});

// 4. Mock browser APIs
beforeEach(() => {
  global.FileReader = class {
    constructor() {
      this.result = 'data:image/jpeg;base64,testbase64';
    }
    readAsDataURL() {
      this.onloadend();
    }
  };

  global.Image = class {
    constructor() {
      setTimeout(() => {
        this.onload();
      }, 0);
    }
  };

  global.URL.createObjectURL = vi.fn(() => 'blob:test');

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    canvas: {
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,compressedbase64')
    }
  }));

  window.prompt = vi.fn().mockImplementation(() => 'newpassword');
});

// Helper function to wrap component with necessary providers
const renderWithProviders = (ui, { user = null } = {}) => {
  return render(
    <BrowserRouter>
      <UserProvider initialUser={user}>
        {ui}
        <ToastContainer />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows login prompt when user is not logged in', () => {
    renderWithProviders(<ProfilePage />);
    
    expect(screen.getByText("You're not logged in")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it('navigates to login page when Login button is clicked', () => {
    renderWithProviders(<ProfilePage />);
    
    const loginButton = screen.getByText("Log In");
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to home page when Back to Home button is clicked', () => {
    renderWithProviders(<ProfilePage />);
    
    const homeButton = screen.getByText("Back to Home");
    fireEvent.click(homeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays user information when logged in', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'test-image-url'
    };
    
    // Mock localStorage to simulate logged-in state
    Storage.prototype.getItem = vi.fn((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('********')).toBeInTheDocument();
  });

  it('allows editing of user name', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    api.changeUserDetails.mockResolvedValue({
      ...mockUser,
      name: 'Updated Name'
    });
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    // Click the edit button for name
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Find the input and change the value
    const input = screen.getByDisplayValue('Test User');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    
    // Click Save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify API was called correctly
    await waitFor(() => {
      expect(api.changeUserDetails).toHaveBeenCalledWith({ name: 'Updated Name' });
    });
  });

  it('allows editing of user email', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    api.changeUserDetails.mockResolvedValue({
      ...mockUser,
      email: 'updated@example.com'
    });
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    // Click the edit button for email
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]);
    
    // Find the input and change the value
    const input = screen.getByDisplayValue('test@example.com');
    fireEvent.change(input, { target: { value: 'updated@example.com' } });
    
    // Click Save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify API was called correctly
    await waitFor(() => {
      expect(api.changeUserDetails).toHaveBeenCalledWith({ email: 'updated@example.com' });
    });
  });

  it('cancels editing when cancel button is clicked', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    // Click the edit button for name
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Find the input and verify it's there
    const input = screen.getByDisplayValue('Test User');
    expect(input).toBeInTheDocument();
    
    // Click Cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Verify input is no longer there
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Test User')).not.toBeInTheDocument();
    });
    
    // Verify API was not called
    expect(api.changeUserDetails).not.toHaveBeenCalled();
  });

  it('handles logout', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    api.logout.mockResolvedValue({});
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    // Click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    // Verify API was called
    await waitFor(() => {
      expect(api.logout).toHaveBeenCalled();
    });
    
    // Verify navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: { toast: { message: 'Successful logout!', type: 'success' } }
    });
  });

  it('handles API errors during field update', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    const errorMessage = 'Network error';
    api.changeUserDetails.mockRejectedValue(new Error(errorMessage));
    
    // Import toast after mocking
    const { toast } = await import('react-toastify');
    
    renderWithProviders(<ProfilePage />, { user: mockUser });
    
    // Click edit button for name
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Find the input and change the value
    const input = screen.getByDisplayValue('Test User');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    
    // Click Save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify API was called
    await waitFor(() => {
      expect(api.changeUserDetails).toHaveBeenCalled();
    });
    
    // Verify toast error was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update name');
    });
  });
});