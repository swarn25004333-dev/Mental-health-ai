import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  FiSmile,
  FiMessageSquare,
  FiClipboard,
  FiTrendingUp,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moodService from '../services/moodService';
import chatService from '../services/chatService';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [todayMood, setTodayMood] = useState(null);
  const [chatCount, setChatCount] = useState(0);
  const [latestPhq2Score, setLatestPhq2Score] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Friend';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const summaryData = await dashboardService.getDashboardSummary();
      if (summaryData) {
        if (summaryData.has_logged_today && summaryData.today_mood) {
          setTodayMood({ mood: summaryData.today_mood });
        } else {
          setTodayMood(null);
        }
        setChatCount(summaryData.total_chat_messages || 0);
        setLatestPhq2Score(summaryData.latest_phq2_score);
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err);
      // Fallback to legacy endpoints if summary fails
      try {
        const [moodData, chatData] = await Promise.allSettled([
          moodService.getTodayMood(),
          chatService.getHistory(50),
        ]);
        if (moodData.status === 'fulfilled' && moodData.value?.has_logged_today) {
          setTodayMood(moodData.value.today_entry);
        }
        if (chatData.status === 'fulfilled' && chatData.value?.history) {
          setChatCount(chatData.value.history.length);
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };


  const getMoodEmoji = (moodName) => {
    switch (moodName?.toLowerCase()) {
      case 'happy':
        return '😊';
      case 'calm':
        return '😌';
      case 'stressed':
        return '😰';
      case 'sad':
        return '😢';
      default:
        return '💭';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeInUp">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 md:p-8 shadow-2xl">
        {/* Glow ambient background accents */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold mb-4 shadow-sm">
            <FiStar className="w-4 h-4 text-blue-300" />
            <span>AI Mental Wellness Space</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-300">{userName}</span> 👋
          </h1>

          <p className="text-slate-300 text-sm md:text-base mt-2.5 max-w-2xl leading-relaxed font-medium">
            Your personal mental wellness center. Check in with your daily mood or start a supportive conversation with your AI companion.
          </p>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <Button
              onClick={() => navigate('/chat')}
              icon={FiMessageSquare}
              size="md"
              variant="primary"
            >
              Talk with AI Companion
            </Button>
            <Button
              onClick={() => navigate('/mood-tracker')}
              variant="secondary"
              icon={FiSmile}
              size="md"
            >
              Log Today's Mood
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Mood Card */}
        <div 
          onClick={() => navigate('/mood-tracker')}
          className="glass-card p-5 border-l-4 border-l-blue-500 border-slate-700/80 bg-slate-900/85 cursor-pointer hover:scale-[1.02] hover:bg-slate-800/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest">
                Today's Mood
              </p>
              {loading ? (
                <div className="h-7 w-28 skeleton rounded-lg mt-2" />
              ) : todayMood ? (
                <h4 className="text-xl font-extrabold text-white mt-1 capitalize flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(todayMood.mood)}</span>
                  <span>{todayMood.mood}</span>
                </h4>
              ) : (
                <h4 className="text-sm font-semibold text-slate-300 mt-1.5">
                  Not logged yet
                </h4>
              )}
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 flex items-center justify-center flex-shrink-0">
              <FiSmile className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* AI Conversations Count */}
        <div 
          onClick={() => navigate('/chat')}
          className="glass-card p-5 border-l-4 border-l-indigo-500 border-slate-700/80 bg-slate-900/85 cursor-pointer hover:scale-[1.02] hover:bg-slate-800/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest">
                Chat Sessions
              </p>
              {loading ? (
                <div className="h-7 w-20 skeleton rounded-lg mt-2" />
              ) : (
                <h4 className="text-xl font-extrabold text-white mt-1">
                  {chatCount} {chatCount === 1 ? 'Message' : 'Messages'}
                </h4>
              )}
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center flex-shrink-0">
              <FiMessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Screening Tool */}
        <div 
          onClick={() => navigate('/phq-2')}
          className="glass-card p-5 border-l-4 border-l-violet-500 border-slate-700/80 bg-slate-900/85 cursor-pointer hover:scale-[1.02] hover:bg-slate-800/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-violet-400 uppercase tracking-widest">
                Screening Tool
              </p>
              {loading ? (
                <div className="h-7 w-28 skeleton rounded-lg mt-2" />
              ) : latestPhq2Score !== null && latestPhq2Score !== undefined ? (
                <h4 className="text-xl font-extrabold text-white mt-1">
                  PHQ-2: {latestPhq2Score}/6
                </h4>
              ) : (
                <h4 className="text-sm font-semibold text-slate-300 mt-1.5">
                  PHQ-2 Assessment
                </h4>
              )}
            </div>
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center flex-shrink-0">
              <FiClipboard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Analytics Link */}
        <div 
          onClick={() => navigate('/mood-history')}
          className="glass-card p-5 border-l-4 border-l-teal-500 border-slate-700/80 bg-slate-900/85 cursor-pointer hover:scale-[1.02] hover:bg-slate-800/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-teal-400 uppercase tracking-widest">
                Analytics
              </p>
              <h4 className="text-xl font-extrabold text-white mt-1">
                Mood Trends
              </h4>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center flex-shrink-0">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Tools Navigation Grid */}
      <Card
        title="Mental Wellness Suite"
        subtitle="Explore evidence-based tools designed for daily emotional care"
        variant="elevated"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Companion Tile */}
          <div
            onClick={() => navigate('/chat')}
            className="p-5 rounded-2xl bg-slate-900/85 border border-slate-700 hover:border-blue-500/60 cursor-pointer transition-all duration-300 group hover:shadow-glow-sm hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
              <FiMessageSquare className="w-5.5 h-5.5" />
            </div>
            <h4 className="font-extrabold text-white text-base group-hover:text-blue-300 transition-colors flex items-center justify-between">
              <span>AI Companion</span>
              <FiArrowRight className="w-4 h-4 text-blue-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              Empathetic, confidential conversational space powered by AI, available 24/7.
            </p>
          </div>

          {/* Mood Tracker Tile */}
          <div
            onClick={() => navigate('/mood-tracker')}
            className="p-5 rounded-2xl bg-slate-900/85 border border-slate-700 hover:border-violet-500/60 cursor-pointer transition-all duration-300 group hover:shadow-glow-violet hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
              <FiSmile className="w-5.5 h-5.5" />
            </div>
            <h4 className="font-extrabold text-white text-base group-hover:text-violet-300 transition-colors flex items-center justify-between">
              <span>Daily Mood Log</span>
              <FiArrowRight className="w-4 h-4 text-violet-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              Record daily emotional check-ins with notes to build self-awareness and track patterns.
            </p>
          </div>

          {/* PHQ-2 Screening Tile */}
          <div
            onClick={() => navigate('/phq-2')}
            className="p-5 rounded-2xl bg-slate-900/85 border border-slate-700 hover:border-teal-500/60 cursor-pointer transition-all duration-300 group hover:shadow-glow-sm hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
              <FiClipboard className="w-5.5 h-5.5" />
            </div>
            <h4 className="font-extrabold text-white text-base group-hover:text-teal-300 transition-colors flex items-center justify-between">
              <span>PHQ-2 Screening</span>
              <FiArrowRight className="w-4 h-4 text-teal-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              Clinical 2-question screening tool to assess depressive indicators over the last 2 weeks.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
