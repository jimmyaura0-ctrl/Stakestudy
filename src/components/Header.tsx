import React from 'react';
import {
  BookOpen,
  Upload,
  Download,
  RefreshCw,
  Sparkles,
  Info,
  Mail,
  Share2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { StudyNote, OwnerProfile } from '../types';
import { exportNotesAsJson } from '../utils/storage';
import { SocialIcon, getPlatformColorClass } from './SocialIcon';

interface HeaderProps {
  notes: StudyNote[];
  ownerProfile: OwnerProfile;
  onOpenUpload: () => void;
  onResetSampleNotes: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenOwnerSocials: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notes,
  ownerProfile,
  onOpenUpload,
  onResetSampleNotes,
  onOpenAbout,
  onOpenContact,
  onOpenOwnerSocials,
}) => {
  const totalNotes = notes.length;
  const uniqueSubjects = new Set(notes.map((n) => n.subject)).size;
  const totalFavorites = notes.filter((n) => n.isFavorite).length;

  const activeSocials = ownerProfile.socials.filter((s) => s.enabled);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                  Study Notes Hub
                </h1>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles className="w-3 h-3" /> All-in-One Vault
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate">
                Upload, categorize, study, and quiz yourself on academic lecture notes
              </p>
            </div>
          </div>

          {/* Center Navigation: About Us, Contact Us, and Owner Active Socials */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* About Us Link */}
            <button
              onClick={onOpenAbout}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-transparent hover:border-slate-200"
              title="About Study Notes Hub"
            >
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>About Us</span>
            </button>

            {/* Contact Us Link */}
            <button
              onClick={onOpenContact}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-transparent hover:border-slate-200"
              title="Contact Support or Curator"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Contact Us</span>
            </button>

            {/* Active Social Links preview in header (hidden on very small screens) */}
            {activeSocials.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-slate-200">
                {activeSocials.slice(0, 4).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={`${s.label}: ${s.url}`}
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 transition-all ${getPlatformColorClass(
                      s.platform
                    )}`}
                  >
                    <SocialIcon platform={s.platform} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}

            {/* OWNER SOCIAL MEDIA MANAGEMENT ICON BUTTON */}
            <button
              id="owner-socials-button"
              onClick={onOpenOwnerSocials}
              title="Owner: Add & Manage Social Media Accounts"
              className="relative p-1.5 sm:px-2.5 sm:py-1.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-indigo-200 shadow-2xs group"
            >
              <div className="relative">
                <Share2 className="w-4 h-4 text-indigo-600 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <span className="hidden md:inline font-medium">Socials</span>
              <span className="hidden sm:inline-flex items-center text-[10px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                Owner
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Backup / Export dropdown/button */}
            <button
              onClick={() => exportNotesAsJson(notes)}
              title="Export all notes as JSON backup"
              className="hidden sm:flex p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Backup</span>
            </button>

            {/* Reset to sample notes if needed */}
            <button
              onClick={onResetSampleNotes}
              title="Restore default academic notes"
              className="hidden sm:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold items-center transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Main Upload CTA Button */}
            <button
              id="upload-notes-cta"
              onClick={onOpenUpload}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

