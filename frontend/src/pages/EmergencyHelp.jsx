import React from 'react';
import Card from '../components/common/Card';
import { FiPhoneCall, FiMessageCircle, FiAlertOctagon, FiShield, FiHeart } from 'react-icons/fi';

const EmergencyHelp = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      {/* Alert Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-rose-900/60 via-rose-950/40 to-dark-900 border border-rose-500/30 shadow-glow-rose">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-400 backdrop-blur-md flex-shrink-0">
            <FiAlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Crisis & Emergency Resources
            </h1>
            <p className="text-rose-200/80 text-sm mt-1.5 leading-relaxed max-w-2xl">
              If you or someone you know is in immediate danger or experiencing a mental health crisis, free, confidential 24/7 help is available right now.
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Helpline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Call 988 */}
        <div className="glass-card p-6 border-rose-500/30 bg-rose-500/[0.04] space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <FiPhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">National Suicide & Crisis Lifeline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Free, confidential 24/7 support available across North America for anyone in distress or crisis.
          </p>
          <div className="pt-2">
            <a
              href="tel:988"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-glow-rose transition-all"
            >
              <span>Call or Text: 988</span>
            </a>
          </div>
        </div>

        {/* Text 741741 */}
        <div className="glass-card p-6 border-indigo-500/30 bg-indigo-500/[0.04] space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <FiMessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Crisis Text Line</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Text with a trained crisis counselor 24 hours a day, 7 days a week from anywhere in the US or UK.
          </p>
          <div className="pt-2">
            <a
              href="sms:741741?body=HOME"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-glow-brand transition-all"
            >
              <span>Text HOME to 741741</span>
            </a>
          </div>
        </div>
      </div>

      {/* International Support */}
      <Card title="International Help & Directory" subtitle="Looking for help outside North America?">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <h4 className="text-sm font-bold text-slate-100">Find A Helpline (Global Directory)</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Find free, confidential support from a local helpline in over 100 countries. Search by country and support topic.
            </p>
          </div>
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass px-5 py-3 rounded-xl text-xs font-bold text-center whitespace-nowrap text-blue-400 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-600/20 hover:text-blue-300 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FiHeart className="w-4 h-4 flex-shrink-0" />
            <span>Search Global Helplines</span>
          </a>
        </div>
      </Card>

      {/* Immediate Grounding Steps */}
      <Card title="Immediate Grounding Steps" subtitle="If you are feeling overwhelmed or panicked right now" variant="elevated">
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3.5 p-4 glass rounded-2xl border-white/[0.06]">
            <div className="w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-glow-sm">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Connect with a trusted person</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Call a close friend, family member, neighbor, or trusted mentor to stay in contact.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 glass rounded-2xl border-white/[0.06]">
            <div className="w-7 h-7 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-glow-sm">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Use the 5-4-3-2-1 Grounding Technique</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Acknowledge 5 things you see around you, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 glass rounded-2xl border-white/[0.06]">
            <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-glow-rose">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Visit your nearest Emergency Room</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">If you feel unable to keep yourself safe, go immediately to the nearest hospital emergency room or call local emergency services.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmergencyHelp;
