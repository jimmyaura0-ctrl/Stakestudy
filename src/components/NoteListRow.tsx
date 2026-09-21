import React from 'react';
import {
  Heart,
  FileText,
  ImageIcon,
  FileCode,
  File,
  Download,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import { StudyNote } from '../types';
import { getSubjectColor } from './NoteCard';
import { formatBytes } from '../utils/storage';

interface NoteListRowProps {
  note: StudyNote;
  onOpen: (note: StudyNote) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteListRow: React.FC<NoteListRowProps> = ({
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

  return (
    <div
      onClick={() => onOpen(note)}
      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          {note.format === 'image' ? (
            <ImageIcon className="w-5 h-5 text-blue-500" />
          ) : note.format === 'pdf' ? (
            <FileText className="w-5 h-5 text-rose-500" />
          ) : note.format === 'markdown' ? (
            <FileCode className="w-5 h-5 text-emerald-500" />
          ) : (
            <File className="w-5 h-5 text-slate-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {note.subject}
            </span>
            {note.courseCode && (
              <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {note.courseCode}
              </span>
            )}
            <span className="text-[11px] text-slate-400">{note.category}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {note.title}
          </h4>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {note.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formattedDate}
          </span>
          {note.fileSize && (
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">
              {formatBytes(note.fileSize)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
                onDelete(note.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
