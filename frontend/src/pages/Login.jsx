import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking session..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to access your Mental Health AI dashboard"
        footer={
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create Account
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
