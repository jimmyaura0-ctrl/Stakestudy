import React from 'react';
import {
  BookOpen,
  Share2,
  Plus,
  Mail,
  Info,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';
import { OwnerProfile } from '../types';
import { SocialIcon, getPlatformColorClass } from './SocialIcon';

interface FooterProps {
  ownerProfile: OwnerProfile;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenOwnerSocials: () => void;
  onOpenUpload: () => void;
  onResetSampleNotes: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  ownerProfile,
  onOpenAbout,
  onOpenContact,
  onOpenOwnerSocials,
  onOpenUpload,
  onResetSampleNotes,
}) => {
  const activeSocials = ownerProfile.socials.filter((s) => s.enabled);

  return (
    <footer className="border-t border-slate-200 bg-white mt-14">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-slate-900">Study Notes Hub</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A comprehensive student workspace for uploading, categorizing, and mastering academic
              course materials. Built with 3D flashcards, active recall quizzes, and client-first
              storage privacy.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Local-first Privacy
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Active Recall Suite
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation & Vault
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Contact Us & Support
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUpload}
                  className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Upload New Notes
                </button>
              </li>
              <li>
                <button
                  onClick={onResetSampleNotes}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Restore Sample Vault Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Owner & Social Accounts Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Owner & Socials
              </h4>
              <button
                onClick={onOpenOwnerSocials}
                title="Add or edit owner social media accounts"
                className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Socials</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {ownerProfile.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate mb-2.5">
                {ownerProfile.title}
              </div>

              {/* Social Accounts Icon Badges */}
              {activeSocials.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={`${social.label} (${social.url})`}
                      className={`p-1.5 rounded-lg border border-slate-200 bg-white transition-all hover:scale-110 shadow-2xs ${getPlatformColorClass(
                        social.platform
                      )}`}
                    >
                      <SocialIcon platform={social.platform} className="w-3.5 h-3.5" />
                    </a>
                  ))}
                  <button
                    onClick={onOpenOwnerSocials}
                    title="Add more social accounts"
                    className="p-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenOwnerSocials}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" /> Click here to add your social accounts
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Study Notes Hub. Dedicated academic learning repository.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenAbout} className="hover:text-slate-800">
              About
            </button>
            <span>•</span>
            <button onClick={onOpenContact} className="hover:text-slate-800">
              Contact
            </button>
            <span>•</span>
            <button onClick={onOpenOwnerSocials} className="hover:text-slate-800">
              Owner Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
