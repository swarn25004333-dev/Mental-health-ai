import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import {
  FiClock,
  FiMessageSquare,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiInbox,
  FiRefreshCw,
} from 'react-icons/fi';
import chatService from '../services/chatService';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const truncate = (text, length = 80) =>
  text && text.length > length ? text.slice(0, length) + '...' : text;

const HistoryItem = ({ item, onDelete, isDeleting }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/[0.05] last:border-b-0">
      <div
        className="py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.03] -mx-6 px-6 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <FiMessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {truncate(item.user_message)}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              <FiClock className="w-3 h-3 flex-shrink-0 text-slate-500" />
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            disabled={isDeleting === item.id}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
            title="Delete this record"
          >
            {isDeleting === item.id ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
          </button>
          {expanded ? (
            <FiChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="pb-4 pt-1 space-y-3 animate-fadeInUp">
          <div className="ml-14">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              You Said
            </p>
            <div className="chat-bubble-user rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
              {item.user_message}
            </div>
          </div>

          <div className="ml-14">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Aria Responded
            </p>
            <div className="chat-bubble-ai rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
              {item.ai_response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonItem = () => (
  <div className="py-4 flex items-center gap-3.5 border-b border-white/[0.05] animate-pulse">
    <div className="w-10 h-10 rounded-2xl skeleton flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 skeleton rounded-full w-3/4" />
      <div className="h-2.5 skeleton rounded-full w-1/3" />
    </div>
  </div>
);

const ChatHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getHistory(100);
      setHistory(data.history || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to load chat history. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await chatService.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('Failed to delete record. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await chatService.clearHistory();
      setHistory([]);
      setShowClearConfirm(false);
    } catch {
      setError('Failed to clear history. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <FiClock className="text-blue-400" />
            <span>Chat History</span>
          </h1>
          <p className="page-subtitle">
            {loading ? 'Loading history...' : `${history.length} conversation session${history.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={FiRefreshCw}
            onClick={loadHistory}
            disabled={loading}
          >
            Refresh
          </Button>
          {history.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={FiTrash2}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={FiMessageSquare}
            onClick={() => navigate('/chat')}
          >
            New Chat
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert-error p-3.5 flex items-center gap-2.5 text-xs font-medium">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main card */}
      <Card
        title="Saved Conversations"
        subtitle="Click any item to expand the message transcript"
        variant="elevated"
      >
        {loading ? (
          <div>
            {[...Array(5)].map((_, i) => <SkeletonItem key={i} />)}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FiInbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">
                No conversation history yet
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Start a conversation with Aria and your chat transcripts will appear here.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/chat')}>
              Start a Conversation
            </Button>
          </div>
        ) : (
          <div>
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isDeleting={deletingId}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Clear Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="glass-modal p-6 m-4 max-w-sm w-full animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">Clear all history?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              All {history.length} conversation records will be permanently deleted from the database.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="btn-gradient flex-1 py-2.5 rounded-xl text-sm font-semibold !from-rose-600 !to-rose-700 flex items-center justify-center gap-2"
              >
                {isClearing && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
