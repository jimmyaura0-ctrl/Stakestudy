import React from 'react';
import {
  Search,
  X,
  Filter,
  Heart,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { SortOption, ViewMode, DocCategory, FileFormat } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSubject: string;
  onSelectSubject: (sub: string) => void;
  availableSubjects: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFormat: string;
  onSelectFormat: (fmt: string) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
}

const CATEGORIES: DocCategory[] = [
  'Lecture Notes',
  'Cheat Sheet',
  'Exam Prep',
  'Summary Sheet',
  'Lab Report',
  'Homework & Exercises',
  'Textbook Notes',
];

const FORMATS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Formats' },
  { value: 'pdf', label: 'PDF Documents' },
  { value: 'image', label: 'Scanned Images' },
  { value: 'markdown', label: 'Markdown (.md)' },
  { value: 'text', label: 'Text (.txt)' },
  { value: 'typed', label: 'Typed Notes' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSelectSubject,
  availableSubjects,
  selectedCategory,
  onSelectCategory,
  selectedFormat,
  onSelectFormat,
  favoritesOnly,
  onToggleFavoritesOnly,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Primary Filters Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="study-notes-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes by keyword, topic, course code (e.g. CS 106), or tag..."
            className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-indigo-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Controls Group */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-indigo-500 shadow-2xs font-medium"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Format Dropdown */}
          <select
            value={selectedFormat}
            onChange={(e) => onSelectFormat(e.target.value)}
            className="text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-indigo-500 shadow-2xs font-medium"
          >
            {FORMATS.map((fmt) => (
              <option key={fmt.value} value={fmt.value}>
                {fmt.label}
              </option>
            ))}
          </select>

          {/* Favorites Filter */}
          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap ${
              favoritesOnly
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-xs py-2.5 pl-3 pr-7 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-indigo-500 shadow-2xs font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
              <option value="views">Most Studied</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => onSelectSubject('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedSubject === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Subjects</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedSubject === 'all' ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {availableSubjects.reduce((acc, s) => acc + s.count, 0)}
          </span>
        </button>

        {availableSubjects.map((sub) => (
          <button
            key={sub.name}
            onClick={() => onSelectSubject(sub.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedSubject === sub.name
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{sub.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedSubject === sub.name ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {sub.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search results summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{totalResults}</strong> {totalResults === 1 ? 'study note' : 'study notes'}
          {selectedSubject !== 'all' && ` in ${selectedSubject}`}
          {selectedCategory !== 'all' && ` (${selectedCategory})`}
        </span>

        {(searchQuery || selectedSubject !== 'all' || selectedCategory !== 'all' || selectedFormat !== 'all' || favoritesOnly) && (
          <button
            onClick={() => {
              onSearchChange('');
              onSelectSubject('all');
              onSelectCategory('all');
              onSelectFormat('all');
              if (favoritesOnly) onToggleFavoritesOnly();
            }}
            className="text-xs text-indigo-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
