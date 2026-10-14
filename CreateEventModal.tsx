import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { getCategoryStyle } from '../utils/theme';
import { X, Calendar, DollarSign, Award, MapPin, Users, PlusCircle } from 'lucide-react';

interface CreateEventModalProps {
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose }) => {
  const {
    categories,
    coordinators,
    currentCoordinator,
    createEvent
  } = useDatabase();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.category_id || 'CAT-01');
  const [coordinatorId, setCoordinatorId] = useState(currentCoordinator.coordinator_id);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-28');
  const [endDate, setEndDate] = useState('2026-10-28');
  const [certThresholdPct, setCertThresholdPct] = useState(75);
  const [fee, setFee] = useState(25);
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [locationSummary, setLocationSummary] = useState('Turing Hall (Auditorium A)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createEvent({
      category_id: categoryId,
      coordinator_id: coordinatorId,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      cert_threshold_pct: Number(certThresholdPct),
      fee: Number(fee),
      max_capacity: Number(maxCapacity),
      status: 'PUBLISHED',
      banner_color: 'indigo',
      location_summary: locationSummary
    });

    onClose();
  };

  const categoryStyle = getCategoryStyle(categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Category Gradient Stripe */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${categoryStyle.gradient}`} />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${categoryStyle.bgLight} ${categoryStyle.text}`}>
              COORDINATOR WORKFLOW
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              Create New Institutional Event
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Quantum Algorithms Research Symposium"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Coordinator
              </label>
              <select
                value={coordinatorId}
                onChange={e => setCoordinatorId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {coordinators.map(c => (
                  <option key={c.coordinator_id} value={c.coordinator_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fee ($ USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={fee}
                onChange={e => setFee(Number(e.target.value))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                min="5"
                required
                value={maxCapacity}
                onChange={e => setMaxCapacity(Number(e.target.value))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cert Threshold %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={certThresholdPct}
                onChange={e => setCertThresholdPct(Number(e.target.value))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Venue / Location Summary
            </label>
            <input
              type="text"
              required
              value={locationSummary}
              onChange={e => setLocationSummary(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Syllabus Outline
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of the workshop, objectives, and prerequisites..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r ${categoryStyle.gradient} text-white shadow-sm transition-all active:scale-95`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Persist Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
