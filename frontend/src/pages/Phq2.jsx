import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import questionnaireService from '../services/questionnaireService';
import { FiClipboard, FiInfo, FiCheckCircle, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const phqOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

const Phq2 = () => {
  const [activeTab, setActiveTab] = useState('assessment'); // 'assessment' | 'history'
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const data = await questionnaireService.getPhq2History();
      setHistory(data.assessments || []);
    } catch (err) {
      console.error('Failed to fetch PHQ-2 history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (q1 === null || q2 === null) {
      setError('Please answer both questions before submitting.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const responseData = await questionnaireService.submitPhq2({
        question1: q1,
        question2: q2,
      });
      setResult(responseData);
    } catch (err) {
      console.error('Failed to submit PHQ-2:', err);
      const score = parseInt(q1, 10) + parseInt(q2, 10);
      setResult({
        score,
        recommendation:
          score >= 3
            ? 'Score indicates possible depressive symptoms. A professional psychological evaluation is recommended.'
            : 'Score indicates low risk. Continue maintaining healthy routine and self-care practices.',
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQ1(null);
    setQ2(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeInUp">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <FiClipboard className="text-blue-400" />
            <span>PHQ-2 Depression Screening</span>
          </h1>
          <p className="page-subtitle">
            Standardized clinical 2-item questionnaire to screen for depressive indicators over the past 2 weeks.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass p-1.5 rounded-2xl flex items-center gap-1.5 w-fit">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'assessment'
              ? 'bg-blue-500 text-white shadow-glow-sm scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
          }`}
        >
          Screening Assessment
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-blue-500 text-white shadow-glow-sm scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
          }`}
        >
          Assessment History
        </button>
      </div>

      {activeTab === 'assessment' ? (
        <>
          {/* Info Disclaimer */}
          <div className="alert-info p-4 text-xs flex items-start gap-3">
            <FiInfo className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This screening is for informational purposes only and does not constitute a formal diagnosis. If you are experiencing crisis or severe distress, please visit Emergency Help or consult a healthcare professional.
            </p>
          </div>

          {/* Result View */}
          {result ? (
            <Card title="Screening Result" subtitle={`Completed on ${new Date(result.created_at || Date.now()).toLocaleDateString()}`} variant="elevated">
              <div className="space-y-5 py-2">
                <div className="flex items-center justify-between p-5 rounded-2xl glass border border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total PHQ-2 Score</span>
                    <div className="text-4xl font-black text-slate-100 mt-1">
                      {result.score} <span className="text-sm font-normal text-slate-400">/ 6</span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                      result.score >= 3
                        ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-glow-rose'
                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-glow-emerald'
                    }`}
                  >
                    {result.score >= 3 ? <FiAlertTriangle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                    <span>{result.score >= 3 ? 'Screening Positive (Score ≥ 3)' : 'Low Risk (Score < 3)'}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass border border-blue-500/20 bg-blue-500/[0.04]">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1.5">
                    Recommendation & Guidance
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {result.recommendation}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button onClick={handleReset} variant="outline">
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            /* Question Form */
            <Card title="Assessment Questions" subtitle="Over the last 2 weeks, how often have you been bothered by any of the following problems?" variant="elevated">
              {error && (
                <div className="alert-error p-3.5 mb-4 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 py-2">
                {/* Question 1 */}
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-100">
                    1. Little interest or pleasure in doing things?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phqOptions.map((opt) => {
                      const isSelected = q1 === opt.value;
                      return (
                        <label
                          key={opt.value}
                          onClick={() => {
                            setQ1(opt.value);
                            if (error) setError('');
                          }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 text-blue-300 shadow-glow-sm'
                              : 'glass border-white/[0.08] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q1"
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-blue-500"
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-100">
                    2. Feeling down, depressed, or hopeless?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phqOptions.map((opt) => {
                      const isSelected = q2 === opt.value;
                      return (
                        <label
                          key={opt.value}
                          onClick={() => {
                            setQ2(opt.value);
                            if (error) setError('');
                          }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 text-blue-300 shadow-glow-sm'
                              : 'glass border-white/[0.08] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q2"
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-blue-500"
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex justify-end">
                  <Button type="submit" isLoading={loading} disabled={loading || q1 === null || q2 === null}>
                    Submit PHQ-2 Screening
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </>
      ) : (
        /* History View */
        <Card title="Assessment History" subtitle="Your past PHQ-2 Screening scores and recommendations" variant="elevated">
          {fetchingHistory ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <FiRefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <span className="text-xs">Loading screening history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="text-5xl">📋</div>
              <div>
                <h3 className="text-base font-bold text-slate-200">No screening history yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Take your first PHQ-2 assessment to track depressive indicators over time.
                </p>
              </div>
              <Button onClick={() => setActiveTab('assessment')} variant="primary" size="sm">
                Take Screening Now
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {history.map((record, index) => {
                const formattedDate = new Date(record.created_at).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const formattedTime = new Date(record.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={index} className="py-4.5 flex flex-col gap-2 group hover:bg-white/[0.02] -mx-6 px-6 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-black text-slate-100">
                          Score: {record.score} / 6
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            record.score >= 3
                              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {record.score >= 3 ? 'Screening Positive (Score ≥ 3)' : 'Low Risk'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {formattedDate} · {formattedTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                      "{record.recommendation}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Phq2;
