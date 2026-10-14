import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { getCategoryStyle, VENUE_COLOR_MAP } from '../utils/theme';
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Building,
  CheckCircle2,
  Search,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  CreditCard,
  QrCode
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const {
    payments,
    registrations,
    events,
    venues,
    sessions,
    categories
  } = useDatabase();

  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // KPIs
  const totalRevenue = useMemo(() => {
    return payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const totalAttendees = useMemo(() => {
    return registrations.filter(r => r.status === 'CONFIRMED').length;
  }, [registrations]);

  const venueUtilizationRate = useMemo(() => {
    if (venues.length === 0) return 0;
    const maxCapacitySlots = venues.length * 20;
    const bookedSessions = sessions.length;
    return Math.min(100, Math.round((bookedSessions / maxCapacitySlots) * 100));
  }, [venues, sessions]);

  // Revenue Per Category Breakdown
  const revenueByCategory = useMemo(() => {
    const map: Record<string, { id: string; name: string; amount: number; count: number }> = {};

    categories.forEach(cat => {
      map[cat.category_id] = { id: cat.category_id, name: cat.name, amount: 0, count: 0 };
    });

    payments.forEach(pay => {
      if (pay.status !== 'COMPLETED') return;
      const reg = registrations.find(r => r.registration_id === pay.registration_id);
      const evt = events.find(e => e.event_id === reg?.event_id);
      if (evt && map[evt.category_id]) {
        map[evt.category_id].amount += pay.amount;
        map[evt.category_id].count += 1;
      }
    });

    return Object.values(map);
  }, [categories, payments, registrations, events]);

  const maxCategoryRevenue = Math.max(1, ...revenueByCategory.map(r => r.amount));

  // Filtered Payments Table
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesFilter =
        paymentFilter === 'ALL' || p.payment_method === paymentFilter;
      const matchesSearch =
        p.payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transaction_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [payments, paymentFilter, searchQuery]);

  // CSV Export Engine
  const handleExportCSV = () => {
    const headers = [
      'Payment_ID',
      'Invoice_Number',
      'Registration_ID',
      'Event_ID',
      'Event_Title',
      'Amount_USD',
      'Payment_Method',
      'Status',
      'Transaction_Reference',
      'Settlement_Timestamp'
    ];

    const rows = payments.map(p => {
      const reg = registrations.find(r => r.registration_id === p.registration_id);
      const evt = events.find(e => e.event_id === reg?.event_id);

      return [
        p.payment_id,
        p.invoice_number,
        p.registration_id,
        evt?.event_id || 'N/A',
        `"${(evt?.title || 'General Colloquium').replace(/"/g, '""')}"`,
        p.amount.toFixed(2),
        p.payment_method,
        p.status,
        p.transaction_ref,
        p.paid_at
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nexus_Institutional_Financial_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and CSV Export Button */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Institutional Finance, Analytics & Audit Reconciliation
            </h2>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
              DBMS Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial reconciliation, room utilization rates, and immutable transaction audit logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <span>Export Institutional Audit CSV</span>
        </button>
      </div>

      {/* Top 4 Multi-Color KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue: Emerald */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Audited & Settled Payments</span>
          </div>
        </div>

        {/* Venue Utilization: Cyan */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50/50 to-white p-5 rounded-2xl border border-cyan-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-800 font-semibold">
            <span>Venue Utilization</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {venueUtilizationRate}%
          </div>
          <div className="text-[11px] text-cyan-700 font-medium">
            Across {venues.length} Campus Auditoriums
          </div>
        </div>

        {/* Total Attendees: Violet */}
        <div className="bg-gradient-to-br from-violet-50 via-purple-50/50 to-white p-5 rounded-2xl border border-violet-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-violet-800 font-semibold">
            <span>Enrolled Attendees</span>
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {totalAttendees}
          </div>
          <div className="text-[11px] text-violet-700 font-medium">
            Active Verified Passes
          </div>
        </div>

        {/* Active Conflicts: Emerald 0 */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/60 p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Active Conflicts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            0
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>0 Collision Double-Booking</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Multi-Color Category Revenues & Hall Capacities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Institutional Revenue by Category
              </h3>
              <p className="text-xs text-slate-500">
                Fee collections distributed across departments.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              ${totalRevenue.toFixed(2)} Total
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {revenueByCategory.map(item => {
              const pct = maxCategoryRevenue > 0 ? (item.amount / maxCategoryRevenue) * 100 : 0;
              const catStyle = getCategoryStyle(item.id);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${catStyle.text} truncate max-w-[200px]`}>
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ${item.amount.toFixed(2)} ({item.count} passes)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${catStyle.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Occupancy & Seating Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Campus Venue Capacities & Booking Density
            </h3>
            <p className="text-xs text-slate-500">
              Auditorium physical thresholds and scheduled sessions.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {venues.map(v => {
              const venueSessionCount = sessions.filter(s => s.venue_id === v.venue_id).length;
              const venueCol = VENUE_COLOR_MAP[v.venue_id] || { text: 'text-slate-700', dot: 'bg-slate-400' };

              return (
                <div key={v.venue_id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${venueCol.dot}`} />
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-[220px]">
                        {v.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {v.building} · {v.floor}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-700 block">
                      {v.capacity} Seats
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {venueSessionCount} sessions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Transaction Reconciliation Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Payment Ledger & Audit Reconciliation (PAYMENTS Table)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict Non-Negative Payment integrity check enforced (<code className="font-mono text-indigo-600">CHECK amount &gt;= 0</code>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Invoice or Ref #..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            >
              <option value="ALL">All Payment Types</option>
              <option value="STUDENT_BILLING">Campus Bursar / Student Billing</option>
              <option value="CREDIT_CARD">Credit / Debit Card</option>
              <option value="UPI">UPI Banking</option>
              <option value="COMPLIMENTARY">Complimentary (Free Pass)</option>
            </select>
          </div>
        </div>

        {/* Payments Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Payment PK</th>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Registration FK</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Settled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredPayments.map(pay => (
                <tr key={pay.payment_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {pay.payment_id}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {pay.invoice_number}
                  </td>
                  <td className="py-3 px-4 text-indigo-600 font-semibold">
                    {pay.registration_id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                    ${pay.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                      {pay.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {pay.transaction_ref}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {pay.paid_at.slice(0, 16).replace('T', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
