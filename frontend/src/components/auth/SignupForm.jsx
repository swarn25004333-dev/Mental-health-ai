import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import Button from '../common/Button';
import { FiUser, FiMail, FiAlertCircle } from 'react-icons/fi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setAuthError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError('');

    try {
      await signup(formData.fullName.trim(), formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setAuthError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && (
        <div className="alert-error flex items-start gap-2.5 px-4 py-3 animate-fadeInUp">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{authError}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Alex Johnson"
            disabled={isLoading}
            className={`glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm ${
              errors.fullName ? 'error' : ''
            } disabled:opacity-50`}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs font-medium text-rose-400 flex items-center gap-1 mt-1">
            <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alex@example.com"
            disabled={isLoading}
            className={`glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm ${
              errors.email ? 'error' : ''
            } disabled:opacity-50`}
          />
        </div>
        {errors.email && (
          <p className="text-xs font-medium text-rose-400 flex items-center gap-1 mt-1">
            <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
      />

      {/* Confirm Password */}
      <PasswordInput
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={isLoading}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full py-3 mt-2 text-base"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignupForm;
