import React from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export function EventFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  availabilityFilter,
  setAvailabilityFilter
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      {/* Search Input and Top Selectors */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by event name, venue, organizer or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Availability Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="date-asc">Date: Upcoming First</option>
              <option value="date-desc">Date: Furthest First</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="popularity">Most Popular / Capacity</option>
            </select>
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="available">Spots Available</option>
            <option value="open-deadline">Registration Open</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name || (cat.id === 'all' && selectedCategory === 'all');
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
              }`}
            >
              {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
