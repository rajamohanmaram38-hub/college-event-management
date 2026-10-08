import React from 'react';
import { Users } from 'lucide-react';

export function CapacityBar({ current, max, showDetails = true, className = '' }) {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  const spotsLeft = Math.max(max - current, 0);

  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700 bg-emerald-50';

  if (percentage >= 90) {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-700 bg-rose-50';
  } else if (percentage >= 70) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700 bg-amber-50';
  }

  return (
    <div className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{current} / {max} Registered</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>
            {spotsLeft === 0 ? 'Full' : `${spotsLeft} seats left`}
          </span>
        </div>
      )}
      
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
