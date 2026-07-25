import React from 'react';
import { MOOD_OPTIONS } from './MoodSelector';
import { FiCheckCircle, FiEdit3, FiClock, FiTrash2 } from 'react-icons/fi';

const TodayMoodCard = ({ todayEntry, onLogNewMood, onDeleteTodayMood }) => {
  const moodMeta = MOOD_OPTIONS.find(
    (m) => m.id === todayEntry?.mood?.toLowerCase()
  ) || {
    label: todayEntry?.mood,
    emoji: '💭',
    textColor: 'text-white',
    badgeBg: 'badge-glass text-slate-200',
  };

  const formattedTime = todayEntry?.created_at
    ? new Date(todayEntry.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="glass-card-elevated p-6 animate-fadeInUp bg-slate-900/90 border border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Emoji Badge */}
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-4xl shadow-md flex-shrink-0">
            {moodMeta.emoji}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                Today's Check-in
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                <FiCheckCircle className="w-3 h-3 text-emerald-400" /> Logged
              </span>
            </div>

            <h3 className={`text-2xl font-extrabold mt-1 capitalize ${moodMeta.textColor}`}>
              {moodMeta.label}
            </h3>

            {formattedTime && (
              <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-1 font-medium">
                <FiClock className="w-3.5 h-3.5 text-blue-400" /> Logged at {formattedTime}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onLogNewMood}
            className="btn-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white hover:bg-slate-800"
          >
            <FiEdit3 className="w-3.5 h-3.5" />
            <span>Update Entry</span>
          </button>
          {onDeleteTodayMood && (
            <button
              onClick={onDeleteTodayMood}
              className="btn-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-rose-400 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-950/40 hover:text-rose-300"
              title="Delete today's mood check-in"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Note */}
      {todayEntry?.note && (
        <div className="mt-5 pt-4 border-t border-slate-700/80">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
            Your Reflections
          </p>
          <p className="text-sm text-slate-200 italic bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed font-medium">
            "{todayEntry.note}"
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayMoodCard;
