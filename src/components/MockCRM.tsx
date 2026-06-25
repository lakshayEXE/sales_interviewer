import React, { useEffect, useState } from 'react';
import { Send, FileText, Mail, Building2, User, Clock } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

interface MockCRMProps {
  onCRMChange: (notes: string, email: string) => void;
  onSubmitEmail: (notes: string, email: string) => void;
  timeLimitMinutes?: number;
}

export const MockCRM: React.FC<MockCRMProps> = ({ onCRMChange, onSubmitEmail, timeLimitMinutes = 3 }) => {
  const crmNotes = useInterviewStore(state => state.crmNotes);
  const setCRMNotes = useInterviewStore(state => state.setCRMNotes);
  const emailDraft = useInterviewStore(state => state.emailDraft);
  const setEmailDraft = useInterviewStore(state => state.setEmailDraft);
  const companyInfo = useInterviewStore(state => state.companyInfo);

  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, timeLimitMinutes]);

  const [subject, setSubject] = useState('');
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCRMNotes(val);
    onCRMChange(val, `Subject: ${subject}\n\n${emailDraft}`);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSubject(val);
    onCRMChange(crmNotes, `Subject: ${val}\n\n${emailDraft}`);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEmailDraft(val);
    onCRMChange(crmNotes, `Subject: ${subject}\n\n${val}`);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmitEmail(crmNotes, `Subject: ${subject}\n\n${emailDraft}`);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col h-full w-full bg-background rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Building2 size={16} className="text-primary" />
          <span>Credee CRM</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${timeLeft < 30 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
          <Clock size={12} />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* CRM Notes Section */}
        <div className="flex-1 flex flex-col p-4 border-b border-gray-800 min-h-0">
          <label className="flex items-center gap-2 text-sm font-semibold text-textMuted mb-2">
            <FileText size={14} />
            Call Notes (Internal)
          </label>
          <textarea
            value={crmNotes}
            onChange={handleNotesChange}
            disabled={submitted}
            placeholder="Log your discovery notes here (pain points, timeline, budget)..."
            className="flex-1 w-full bg-surface/50 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none disabled:opacity-50"
          />
        </div>

        {/* Email Draft Section */}
        <div className="flex-1 flex flex-col p-4 bg-black/20 min-h-0">
          <div className="flex flex-col flex-1 bg-white rounded-t-lg rounded-b-none overflow-hidden shadow-2xl border border-gray-200">
            {/* Gmail-like Header */}
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between text-sm font-semibold text-gray-700">
              New Message
            </div>
            
            <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-sm bg-white">
              <span className="text-gray-500">To</span>
              <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-xs border border-gray-200">
                <User size={12} />
                Prospect
              </div>
            </div>
            
            <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-sm bg-white">
              <span className="text-gray-500">Subject</span>
              <input
                type="text"
                disabled={submitted}
                value={subject}
                className="flex-1 bg-transparent text-gray-800 focus:outline-none disabled:opacity-50"
                onChange={handleSubjectChange} 
              />
            </div>
            
            <textarea
              value={emailDraft}
              onChange={handleEmailChange}
              disabled={submitted}
              className="flex-1 w-full bg-white p-4 text-sm text-gray-800 focus:outline-none resize-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-surface border-t border-gray-800 flex justify-end shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {submitted ? 'Sent' : 'Send Email'}
        </button>
      </div>
    </div>
  );
};
