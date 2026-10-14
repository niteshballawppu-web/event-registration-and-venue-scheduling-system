import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { InstitutionalEvent, Registration } from '../types/database';
import { X, Star, Send, CheckCircle, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  registration: Registration;
  event: InstitutionalEvent;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  registration,
  event,
  onClose
}) => {
  const { submitFeedback, feedbacks } = useDatabase();

  const existingFeedback = feedbacks.find(
    f => f.registration_id === registration.registration_id
  );

  const [overall, setOverall] = useState(existingFeedback?.overall_rating || 5);
  const [content, setContent] = useState(existingFeedback?.content_rating || 5);
  const [venue, setVenue] = useState(existingFeedback?.venue_rating || 5);
  const [organization, setOrganization] = useState(existingFeedback?.organization_rating || 5);
  const [comments, setComments] = useState(existingFeedback?.comments || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(
      registration.registration_id,
      { overall, content, venue, organization },
      comments
    );
    onClose();
  };

  const renderStars = (
    value: number,
    onChange: (val: number) => void,
    label: string
  ) => {
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-4 h-4 ${
                  star <= value
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-mono font-semibold text-slate-600 w-4 text-right ml-1">
            {value}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              FEEDBACK TABLE · {registration.registration_id}
            </span>
            <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
              Appraise: {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            {renderStars(overall, setOverall, 'Overall Event Quality')}
            {renderStars(content, setContent, 'Academic Content & Syllabus')}
            {renderStars(venue, setVenue, 'Venue Facilities & Acoustics')}
            {renderStars(organization, setOrganization, 'Staff Coordination & Check-in')}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Qualitative Feedback & Suggestions</span>
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="What did you learn? How can future symposia be improved?..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
