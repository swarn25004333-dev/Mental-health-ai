import React from 'react';
import { FiCheck } from 'react-icons/fi';

export const MOOD_OPTIONS = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    description: 'Joyful, optimistic, cheerful',
    colorActive: 'border-amber-500 bg-amber-950/40 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 border border-amber-500/30 text-amber-200',
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    description: 'Peaceful, relaxed, centered',
    colorActive: 'border-teal-500 bg-teal-950/40 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)]',
    textColor: 'text-teal-300',
    badgeBg: 'bg-teal-500/20 border border-teal-500/30 text-teal-200',
  },
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '😰',
    description: 'Overwhelmed, tense, anxious',
    colorActive: 'border-rose-500 bg-rose-950/40 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)]',
    textColor: 'text-rose-300',
    badgeBg: 'bg-rose-500/20 border border-rose-500/30 text-rose-200',
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    description: 'Down, low energy, gloomy',
    colorActive: 'border-sky-500 bg-sky-950/40 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]',
    textColor: 'text-sky-300',
    badgeBg: 'bg-sky-500/20 border border-sky-500/30 text-sky-200',
  },
];

const MoodSelector = ({ selectedMood, onSelectMood, disabled = false }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {MOOD_OPTIONS.map((item) => {
        const isSelected = selectedMood === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectMood(item.id)}
            className={`p-5 relative flex flex-col items-center justify-center space-y-3 text-center select-none outline-none rounded-2xl border transition-all duration-200 ${
              isSelected
                ? `border-2 ${item.colorActive} scale-[1.02]`
                : 'bg-slate-900/85 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/90 hover:scale-[1.01]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-5.5 h-5.5 rounded-full bg-blue-600 border border-white/30 text-white flex items-center justify-center text-xs shadow-md">
                <FiCheck className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="text-4xl sm:text-5xl transition-transform duration-300 transform group-hover:scale-110">
              {item.emoji}
            </span>
            <div>
              <h3 className={`font-extrabold text-base ${isSelected ? 'text-white' : item.textColor}`}>
                {item.label}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-1 font-medium">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
