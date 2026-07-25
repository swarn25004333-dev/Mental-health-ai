import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          &copy; {new Date().getFullYear()} Mental Health AI. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">|</span>
          <p className="text-slate-500 dark:text-slate-400">
            If you are in immediate danger, call <strong className="text-rose-600 dark:text-rose-400">911</strong> or visit{' '}
            <Link to="/emergency" className="underline hover:text-brand-600 dark:hover:text-brand-400">
              Emergency Help
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
