import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import Button from '../common/Button';
import { FiMail, FiAlertCircle } from 'react-icons/fi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setAuthError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Auth error banner */}
      {authError && (
        <div className="alert-error flex items-start gap-2.5 px-4 py-3 animate-fadeInUp">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{authError}</span>
        </div>
      )}

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
            placeholder="you@example.com"
            disabled={isLoading}
            className={`glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm ${
              errors.email ? 'error' : ''
            } disabled:opacity-50`}
          />
        </div>
        {errors.email && (
          <p className="text-xs font-medium text-rose-400 flex items-center gap-1">
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

      {/* Submit */}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full py-3 mt-2 text-base"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
