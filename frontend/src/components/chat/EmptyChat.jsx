import React from 'react';
import { FiMessageSquare, FiSmile, FiShield, FiHeart, FiStar } from 'react-icons/fi';

const SUGGESTED_PROMPTS = [
  {
    icon: FiSmile,
    title: 'Feeling Anxious',
    prompt: "I'm feeling anxious right now and my mind is racing. Can you guide me through a quick grounding exercise?",
  },
  {
    icon: FiHeart,
    title: 'Self-Care Ideas',
    prompt: 'Can you suggest 3 simple self-care activities I can do today to improve my mental well-being?',
  },
  {
    icon: FiShield,
    title: 'Stress Relief',
    prompt: "I've had a really stressful day at work/school. How can I unwind and release this tension?",
  },
  {
    icon: FiStar,
    title: 'Positive Affirmation',
    prompt: "I'm doubting myself today. Can you share a thoughtful positive perspective or affirmation with me?",
  },
];

const EmptyChat = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-2xl mx-auto space-y-8 animate-fadeInUp">
      {/* Icon orb */}
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-glow-lg border border-white/20">
          <FiMessageSquare className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Intro text */}
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          How can I support you today?
        </h2>
        <p className="text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
          I am Aria, your empathetic AI companion. Select a prompt below or type how you are feeling.
        </p>
      </div>

      {/* Suggested prompts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {SUGGESTED_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="p-4 text-left rounded-2xl bg-slate-900/85 border border-slate-700/80 hover:border-blue-500/60 hover:bg-slate-800/90 transition-all duration-200 group flex items-start gap-3 shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed font-medium">
                  "{item.prompt}"
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyChat;
