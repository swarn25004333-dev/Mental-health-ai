import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import MoodChart from '../components/mood/MoodChart';
import { MOOD_OPTIONS } from '../components/mood/MoodSelector';
import moodService from '../services/moodService';
import {
  FiTrendingUp,
  FiCalendar,
  FiTrash2,
  FiRefreshCw,
  FiPlus,
  FiFilter,
  FiHeart,
  FiPieChart,
} from 'react-icons/fi';

const FILTER_OPTIONS = [
  { id: '7', label: 'Last 7 Days', days: 7 },
  { id: '30', label: 'Last 30 Days', days: 30 },
  { id: 'all', label: 'All Time', days: null },
];

const MoodHistory = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('7');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [selectedFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const activeFilter = FILTER_OPTIONS.find((f) => f.id === selectedFilter);
      const days = activeFilter ? activeFilter.days : 7;
      const data = await moodService.getMoodHistory(days, 200);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load mood history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this mood entry?')) return;
    setDeletingId(entryId);
    try {
      await moodService.deleteMoodEntry(entryId);
      setHistory((prev) => prev.filter((item) => item.id !== entryId));
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getMoodMeta = (moodName) => {
    const found = MOOD_OPTIONS.find((m) => m.id === moodName.toLowerCase());
    return (
      found || {
        label: moodName,
        emoji: '💭',
        textColor: 'text-slate-300',
        badgeBg: 'badge-glass text-slate-300',
      }
    );
  };

  const totalEntries = history.length;
  const positiveCount = history.filter(
    (h) => h.mood.toLowerCase() === 'happy' || h.mood.toLowerCase() === 'calm'
  ).length;
  const positivePercentage = totalEntries > 0 ? Math.round((positiveCount / totalEntries) * 100) : 0;

  const moodCounts = history.reduce((acc, curr) => {
    const m = curr.mood.toLowerCase();
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  let topMoodKey = null;
  let topMoodVal = 0;
  Object.entries(moodCounts).forEach(([k, v]) => {
    if (v > topMoodVal) {
      topMoodVal = v;
      topMoodKey = k;
    }
  });

  const topMoodMeta = topMoodKey ? getMoodMeta(topMoodKey) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <FiTrendingUp className="text-blue-400" />
            <span>Mood History & Analytics</span>
          </h1>
          <p className="page-subtitle">
            Visualize your emotional trend over time, identify patterns, and reflect on past check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigate('/mood-tracker')}
            className="btn-gradient px-4 py-2 text-xs rounded-xl flex items-center gap-1.5"
          >
            <FiPlus className="w-4 h-4" />
            <span>Log Mood</span>
          </button>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="btn-glass p-2 text-xs rounded-xl"
            title="Refresh history"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass p-2 rounded-2xl flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 hidden sm:flex items-center gap-1.5">
            <FiFilter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {FILTER_OPTIONS.map((opt) => {
            const isActive = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedFilter(opt.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-glow-sm scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-500 px-3 hidden md:block">
          {totalEntries} check-in{totalEntries !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Summary Cards */}
      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3.5">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Total Check-ins</div>
              <div className="text-xl font-black text-slate-100 mt-0.5">{totalEntries}</div>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FiHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Positive Days</div>
              <div className="text-xl font-black text-slate-100 mt-0.5">{positivePercentage}%</div>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3.5">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
              <FiPieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Most Frequent</div>
              <div className="text-xl font-black text-slate-100 mt-0.5 flex items-center gap-1.5">
                {topMoodMeta ? (
                  <>
                    <span>{topMoodMeta.emoji}</span>
                    <span className="capitalize text-base font-bold">{topMoodMeta.label}</span>
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Line Chart */}
      <Card
        title="Emotional Trend Line"
        subtitle={`Visual history chart (${FILTER_OPTIONS.find((f) => f.id === selectedFilter)?.label})`}
        variant="elevated"
      >
        {loading ? (
          <div className="h-64 flex items-center justify-center gap-3 text-slate-400">
            <FiRefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-sm">Loading trend data...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="text-5xl">📊</div>
            <h3 className="text-base font-bold text-slate-200">
              No mood records found for this period
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start logging your mood daily to see your emotional trends charted here!
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/mood-tracker')}
                className="btn-gradient px-4 py-2 text-xs rounded-xl"
              >
                Log Today's Mood
              </button>
            </div>
          </div>
        ) : (
          <MoodChart history={history} />
        )}
      </Card>

      {/* Logs list */}
      {!loading && history.length > 0 && (
        <Card title="Recorded Check-ins" subtitle="Detailed past log entries">
          <div className="divide-y divide-white/[0.05]">
            {history.map((log) => {
              const meta = getMoodMeta(log.mood);
              const formattedDate = new Date(log.created_at).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = new Date(log.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.03] px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-2.5 glass rounded-2xl flex-shrink-0">
                      {meta.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold capitalize ${meta.textColor}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400">
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                      {log.note ? (
                        <p className="text-xs text-slate-300 mt-1.5 bg-slate-900/60 p-3 rounded-xl border border-white/[0.05] italic">
                          "{log.note}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          No notes attached.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(log.id)}
                    disabled={deletingId === log.id}
                    title="Delete entry"
                    className="self-end sm:self-center p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MoodHistory;
