import React from 'react';
import { Sparkles, UploadCloud, BookOpenCheck, BrainCircuit } from 'lucide-react';

interface StatsBannerProps {
  onOpenUpload: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ onOpenUpload }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm overflow-hidden relative border border-slate-800">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Study Vault & Academic Review</span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
          Centralize your study notes, lecture slides & exam prep
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Upload PDF documents, scanned handwritten notes, markdown files, and code cheat sheets.
          Automatically generate structured summaries, active-recall flashcards, and practice quizzes for your courses.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Notes Now</span>
          </button>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <BookOpenCheck className="w-4 h-4 text-emerald-400" /> Multi-format
            </span>
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-400" /> Smart Flashcards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
