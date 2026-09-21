import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Layers,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Mail,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { OwnerProfile } from '../types';
import { SocialIcon, getPlatformColorClass } from './SocialIcon';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerProfile: OwnerProfile;
  onOpenOwnerSocials: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  ownerProfile,
  onOpenOwnerSocials,
  onOpenContact,
}) => {
  if (!isOpen) return null;

  const activeSocials = ownerProfile.socials.filter((s) => s.enabled);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="relative px-6 py-6 bg-slate-900 text-white overflow-hidden flex-shrink-0">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">About Study Notes Hub</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    v1.2
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Academic notes vault, active recall suite, and collaborative study archive
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Mission statement */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Our Mission
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              <strong>Study Notes Hub</strong> was created to eliminate fragmented study materials.
              Whether you are organizing dense lecture slides, scanned handwritten formulas, PDF
              cheat sheets, or laboratory protocols, this platform gives you an organized academic
              sanctuary equipped with interactive flashcards and AI-assisted active recall quizzes.
            </p>
          </div>

          {/* Core Pillars */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Core Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Universal Document Upload
                </div>
                <p className="text-[12px] text-slate-500 leading-normal">
                  Support for PDFs, scanned notebook photos, Markdown, and direct text summaries with course code tagging.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  3D Flip Flashcards
                </div>
                <p className="text-[12px] text-slate-500 leading-normal">
                  Spaced repetition flashcards generated from your study notes to lock in core definitions and formulas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Self-Testing Quizzes
                </div>
                <p className="text-[12px] text-slate-500 leading-normal">
                  Instant practice assessments with automated scoring and detailed conceptual explanations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Local-First Privacy & Backup
                </div>
                <p className="text-[12px] text-slate-500 leading-normal">
                  All your lecture documents remain secured in browser local storage with zero-latency full JSON backups.
                </p>
              </div>
            </div>
          </div>

          {/* Owner & Curator Spotlight with Social Media Links */}
          <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Vault Curator & Owner
                </span>
                <h4 className="text-base font-bold text-slate-900">{ownerProfile.name}</h4>
                <p className="text-xs text-indigo-700 font-medium">{ownerProfile.title}</p>
              </div>

              {/* Quick edit button for owner */}
              <button
                onClick={() => {
                  onClose();
                  onOpenOwnerSocials();
                }}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Edit Owner Socials & Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Socials</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{ownerProfile.bio}</p>

            {/* Social Media Link Badges */}
            <div className="pt-2 border-t border-indigo-100/80">
              <span className="text-[11px] font-semibold text-slate-700 block mb-2">
                Connect with the Owner:
              </span>
              {activeSocials.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-white shadow-2xs transition-all hover:scale-105 ${getPlatformColorClass(
                        social.platform
                      )}`}
                    >
                      <SocialIcon platform={social.platform} className="w-3.5 h-3.5" />
                      <span>{social.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No public social accounts enabled yet. Click &quot;Edit Socials&quot; above to add yours.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            Have feedback? Contact Us &rarr;
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
