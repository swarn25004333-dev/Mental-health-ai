import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Signup = () => {
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
        title="Create Account"
        subtitle="Start your mental wellness journey with Mental Health AI"
        footer={
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>
        }
      >
        <SignupForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;
