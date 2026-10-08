import React from 'react';

const categoryColorMap = {
  'Tech & Coding': 'bg-blue-50 text-blue-700 border-blue-200',
  'Workshops & Seminars': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cultural & Arts': 'bg-pink-50 text-pink-700 border-pink-200',
  'Sports & Fitness': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Career & Placement': 'bg-purple-50 text-purple-700 border-purple-200',
  'Club Activities': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export function CategoryBadge({ category, className = '' }) {
  const colorClass = categoryColorMap[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {category}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const map = {
    CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    WAITLISTED: 'bg-amber-100 text-amber-800 border-amber-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    FULL: 'bg-red-100 text-red-800 border-red-200'
  };

  const current = map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current} ${className}`}
    >
      {status}
    </span>
  );
}
