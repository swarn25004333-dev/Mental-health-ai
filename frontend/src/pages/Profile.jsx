import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { FiUser, FiMail, FiShield, FiBell, FiCheckCircle, FiLogOut, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, profile, updateProfile, logout } = useAuth();

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'User Profile';
  const email = user?.email || 'user@example.com';
  const avatarLetter = fullName ? fullName.charAt(0).toUpperCase() : 'U';

  const [nameValue, setNameValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (fullName) {
      setNameValue(fullName);
    }
  }, [fullName]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nameValue.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile(nameValue.trim());
      setSuccessMsg('Profile updated successfully! 🎉');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeInUp">
      <div>
        <h1 className="page-title flex items-center gap-2.5">
          <FiUser className="text-blue-400" />
          <span>Profile & Settings</span>
        </h1>
        <p className="page-subtitle">
          Manage your account profile and application preferences.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="alert-success p-4 flex items-center gap-3 animate-fadeInUp">
          <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div className="alert-error p-4 flex items-center gap-3 animate-fadeInUp">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <Card title="Account Identity" variant="elevated">
        <div className="flex items-center gap-4 pb-6 border-b border-white/[0.06]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center text-2xl font-bold shadow-glow flex-shrink-0">
            {avatarLetter}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{fullName}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full">
              <FiCheckCircle className="w-3 h-3 text-blue-400" />
              <span>Supabase Authenticated</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => {
                setNameValue(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              disabled={!isEditing || saving}
              className={`glass-input w-full px-4 py-3 rounded-xl text-sm transition-all ${
                !isEditing ? 'opacity-70 cursor-default bg-slate-950/40 border-slate-800/60' : ''
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              value={email}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm cursor-default opacity-50 bg-slate-950/40 border-slate-800/60"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setNameValue(fullName);
                    setIsEditing(false);
                    setErrorMsg('');
                  }}
                  disabled={saving}
                  className="btn-glass px-4 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button type="submit" isLoading={saving} disabled={saving || !nameValue.trim()}>
                  Save Changes
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-glass px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-500/10 border-blue-500/30 hover:bg-blue-600/20"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Preferences Card */}
      <Card title="Preferences & Privacy" variant="elevated">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Data Privacy</h4>
                <p className="text-xs text-slate-400">All responses are encrypted & stored securely</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <FiBell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Daily Wellness Check-in Reminder</h4>
                <p className="text-xs text-slate-400">Receive gentle daily mood log prompts</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500 cursor-pointer" />
          </div>
        </div>
      </Card>

      {/* Danger Zone / Logout Card */}
      <Card title="Danger Zone" variant="elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <h4 className="text-sm font-semibold text-rose-400">Sign Out of Account</h4>
            <p className="text-xs text-slate-400 mt-0.5">End your current session on this device</p>
          </div>
          <button
            onClick={handleLogoutClick}
            disabled={loggingOut}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-950/40 hover:text-rose-300 transition-all flex items-center gap-1.5"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
