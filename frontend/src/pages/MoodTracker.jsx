import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import MoodSelector from '../components/mood/MoodSelector';
import TodayMoodCard from '../components/mood/TodayMoodCard';
import moodService from '../services/moodService';
import { formatErrorMessage } from '../utils/formatError';
import { FiSmile, FiBookOpen, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingToday, setFetchingToday] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    setFetchingToday(true);
    try {
      const data = await moodService.getTodayMood();
      if (data.has_logged_today && data.today_entry) {
        setTodayEntry(data.today_entry);
        setSelectedMood(data.today_entry.mood);
        setNote(data.today_entry.note || '');
        setShowForm(false);
      }
    } catch (err) {
      console.warn('Could not fetch today mood:', err);
    } finally {
      setFetchingToday(false);
    }
  };

  const handleDeleteTodayMood = async () => {
    if (!todayEntry) return;
    if (!window.confirm("Are you sure you want to delete today's mood check-in?")) return;

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await moodService.deleteMoodEntry(todayEntry.id);
      setTodayEntry(null);
      setSelectedMood(null);
      setNote('');
      setSuccessMessage("Today's mood entry has been deleted.");
      setShowForm(true);
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      console.error('Failed to delete today\'s mood check-in:', err);
      setErrorMessage('Failed to delete your mood check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedMood) {
      setErrorMessage('Please select how you are feeling today before saving.');
      return;
    }

    setLoading(true);

    try {
      const result = await moodService.logMood({
        mood: selectedMood,
        note: note.trim(),
      });

      setSuccessMessage('Your mood entry has been recorded! 🎉');
      setTodayEntry(result);
      setNote(result.note || '');
      setShowForm(false);

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Failed to save mood:', err);
      setErrorMessage(formatErrorMessage(err, 'Failed to save your mood. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h1 className="page-title flex items-center gap-2.5">
          <FiSmile className="text-blue-400" />
          <span>Daily Mood Tracker</span>
        </h1>
        <p className="page-subtitle">
          Log your daily emotional check-in. Consistent tracking builds self-awareness and emotional resilience.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="alert-success p-4 flex items-center gap-3 animate-fadeInUp">
          <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="alert-error p-4 flex items-center gap-3 animate-fadeInUp">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Today's Logged Mood Summary */}
      {fetchingToday ? (
        <div className="p-6 rounded-2xl glass animate-pulse flex items-center gap-3">
          <FiRefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-sm text-slate-400">Fetching today's check-in...</span>
        </div>
      ) : (
        todayEntry && (
          <TodayMoodCard
            todayEntry={todayEntry}
            onLogNewMood={() => setShowForm(!showForm)}
            onDeleteTodayMood={handleDeleteTodayMood}
          />
        )
      )}

      {/* Mood Entry Form Card */}
      {(!todayEntry || showForm) && (
        <Card
          title={todayEntry ? 'Update / Log Another Entry' : 'How are you feeling right now?'}
          subtitle="Select the primary emoji that matches your current state"
          variant="elevated"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Select Your Mood
              </label>
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={(moodId) => {
                  setSelectedMood(moodId);
                  if (errorMessage) setErrorMessage('');
                }}
                disabled={loading}
              />
            </div>

            {/* Optional Journal Note */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FiBookOpen className="text-blue-400" />
                  <span>Journal Reflections (Optional)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {note.length} / 1000
                </span>
              </div>
              <textarea
                rows="4"
                maxLength={1000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What triggered this feeling? Add any thoughts, triggers, or reflections..."
                disabled={loading}
                className="glass-input w-full p-4 rounded-2xl text-sm leading-relaxed resize-none disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {todayEntry && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="btn-glass px-4 py-2.5 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              )}
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || !selectedMood}
                className="w-full sm:w-auto"
              >
                {loading ? 'Saving Entry...' : 'Save Mood Log'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;
