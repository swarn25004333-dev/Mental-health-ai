import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const PasswordInput = ({
  name = 'password',
  label = 'Password',
  value,
  onChange,
  error,
  disabled = false,
  placeholder = '••••••••',
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`glass-input w-full pl-10 pr-12 py-3 rounded-xl text-sm ${
            error ? 'error' : ''
          } disabled:opacity-50`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5 disabled:opacity-50"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs font-medium text-rose-400 flex items-center gap-1 mt-1">
          <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
