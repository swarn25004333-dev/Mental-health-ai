import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 animate-fadeInUp">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 shadow-glow">
        <FiAlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate('/')} icon={FiHome} size="md">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
