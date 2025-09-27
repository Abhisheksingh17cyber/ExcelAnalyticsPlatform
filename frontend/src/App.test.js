import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

// Mock components to avoid testing complex functionality
jest.mock('./pages/Dashboard', () => {
  return function Dashboard() {
    return <div>Dashboard</div>;
  };
});

jest.mock('./pages/Login', () => {
  return function Login() {
    return <div>Login</div>;
  };
});

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
});
