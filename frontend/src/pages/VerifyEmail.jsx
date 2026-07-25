import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiShield } from 'react-icons/fi';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';

const VerifyEmail = () => {
  const email = sessionStorage.getItem('pendingVerificationEmail') || 'your email address';

  return (
    <AuthLayout>
      <AuthCard
        title="Verify your email"
        subtitle="One final step before you can access Mental Health AI"
        footer={
          <p>
            Already verified?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>
        }
      >
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-center">
          <FiMail className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
          <h2 className="text-lg font-semibold text-emerald-300">Check your inbox</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            We sent a verification link to <span className="font-semibold break-all">{email}</span>.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-950/30 p-3 text-left text-xs leading-5 text-slate-400">
            <FiShield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300" />
            <span>Verify your email before signing in. Until then, the dashboard and chatbot stay locked.</span>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyEmail;
