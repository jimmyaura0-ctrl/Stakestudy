import React from 'react';
import {
  Heart,
  FileText,
  Image as ImageIcon,
  FileCode,
  File,
  Eye,
  Download,
  Trash2,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react';
import { StudyNote } from '../types';
import { formatBytes } from '../utils/storage';

interface NoteCardProps {
  note: StudyNote;
  onOpen: (note: StudyNote) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getSubjectColor = (subject: string): { bg: string; text: string; border: string; badge: string } => {
  const sub = subject.toLowerCase();
  if (sub.includes('computer') || sub.includes('code') || sub.includes('software')) {
    return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-600' };
  }
  if (sub.includes('math') || sub.includes('algebra') || sub.includes('calculus')) {
    return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', badge: 'bg-sky-600' };
  }
  if (sub.includes('bio') || sub.includes('medicine') || sub.includes('health')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-600' };
  }
  if (sub.includes('physic') || sub.includes('chem')) {
    return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-600' };
  }
  if (sub.includes('econ') || sub.includes('finance') || sub.includes('business')) {
    return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', badge: 'bg-amber-600' };
  }
  if (sub.includes('psych') || sub.includes('socio')) {
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-600' };
  }
  if (sub.includes('history') || sub.includes('human')) {
    return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', badge: 'bg-orange-600' };
  }
  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-700' };
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onOpen,
  onToggleFavorite,
  onDelete,
}) => {
  const colors = getSubjectColor(note.subject);

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.fileDataUrl) {
      const a = document.createElement('a');
      a.href = note.fileDataUrl;
      a.download = note.fileName || `${note.title}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title.replace(/\s+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  // Preview snippet: strip markdown headers/formatting for card preview
  const plainSnippet = note.content
    ? note.content
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*/g, '')
        .replace(/\n+/g, ' ')
        .slice(0, 160)
    : 'No text preview available.';

  return (
    <div
      id={`note-card-${note.id}`}
      onClick={() => onOpen(note)}
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-5 cursor-pointer overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          {/* Subject Badge & Course Code */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {note.subject}
            </span>
            {note.courseCode && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700">
                {note.courseCode}
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-400">
              {note.category}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              note.isFavorite
                ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {note.title}
          </h3>
        </div>

        {/* Image Attachment Preview if format is image */}
        {note.format === 'image' && note.fileDataUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={note.fileDataUrl}
              alt={note.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Text Excerpt */}
        {note.format !== 'image' && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
            {plainSnippet}
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 font-medium"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Metadata & Actions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1 text-slate-500 font-medium truncate max-w-[120px]">
            <User className="w-3.5 h-3.5" />
            {note.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            title="Download note"
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete note"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
                onDelete(note.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
