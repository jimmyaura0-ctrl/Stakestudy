import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  Globe,
  Share2,
  User,
  ShieldCheck,
  Link as LinkIcon,
} from 'lucide-react';
import { OwnerProfile, OwnerSocialLink, SocialPlatform } from '../types';
import { SocialIcon, getPlatformColorClass } from './SocialIcon';
import { DEFAULT_OWNER_PROFILE } from '../utils/storage';

interface OwnerSocialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OwnerProfile;
  onSaveProfile: (profile: OwnerProfile) => void;
}

const PLATFORM_OPTIONS: { id: SocialPlatform; name: string; placeholder: string }[] = [
  { id: 'github', name: 'GitHub', placeholder: 'https://github.com/username' },
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { id: 'twitter', name: 'Twitter / X', placeholder: 'https://x.com/username' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/username' },
  { id: 'website', name: 'Website / Portfolio', placeholder: 'https://mywebsite.com' },
  { id: 'email', name: 'Direct Email', placeholder: 'mailto:contact@domain.com' },
  { id: 'other', name: 'Other Link', placeholder: 'https://...' },
];

export const OwnerSocialsModal: React.FC<OwnerSocialsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<OwnerProfile>(profile);
  const [activeTab, setActiveTab] = useState<'socials' | 'profile'>('socials');

  // New social account form state
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('github');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setErrorNotice(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setErrorNotice('Please provide a valid URL for the social account.');
      return;
    }

    let formattedUrl = newUrl.trim();
    if (newPlatform === 'email' && !formattedUrl.startsWith('mailto:') && formattedUrl.includes('@')) {
      formattedUrl = `mailto:${formattedUrl}`;
    } else if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('mailto:')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const platformMeta = PLATFORM_OPTIONS.find((p) => p.id === newPlatform);
    const label = newLabel.trim() || platformMeta?.name || 'Social Link';

    const newLink: OwnerSocialLink = {
      id: `social_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      platform: newPlatform,
      label,
      url: formattedUrl,
      enabled: true,
    };

    setFormData((prev) => ({
      ...prev,
      socials: [...prev.socials, newLink],
    }));

    setNewLabel('');
    setNewUrl('');
    setErrorNotice(null);
  };

  const handleToggleSocial = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  const handleDeleteSocial = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((s) => s.id !== id),
    }));
  };

  const handleUpdateSocialUrl = (id: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((s) => (s.id === id ? { ...s, url } : s)),
    }));
  };

  const handleUpdateSocialLabel = (id: string, label: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((s) => (s.id === id ? { ...s, label } : s)),
    }));
  };

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (confirm('Reset social links and owner info to default preset?')) {
      setFormData(DEFAULT_OWNER_PROFILE);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Owner Social Media Manager</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Admin Control
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Add, manage, and showcase your social media accounts across Study Notes Hub
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('socials')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'socials'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Social Accounts ({formData.socials.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Owner Details & Bio
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'socials' ? (
            <>
              {/* Add New Social Form */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 sm:p-5">
                <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Add New Social Media Account
                </h3>

                <form onSubmit={handleAddSocial} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Platform
                      </label>
                      <select
                        value={newPlatform}
                        onChange={(e) => {
                          const p = e.target.value as SocialPlatform;
                          setNewPlatform(p);
                          const meta = PLATFORM_OPTIONS.find((item) => item.id === p);
                          if (meta && !newLabel) {
                            setNewLabel(meta.name);
                          }
                        }}
                        className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                      >
                        {PLATFORM_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GitHub or @handle"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Profile URL / Handle
                      </label>
                      <input
                        type="text"
                        placeholder={
                          PLATFORM_OPTIONS.find((p) => p.id === newPlatform)?.placeholder ||
                          'https://...'
                        }
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                      />
                    </div>
                  </div>

                  {errorNotice && (
                    <p className="text-xs text-rose-600 font-medium">{errorNotice}</p>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Account
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Social Links List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Configured Social Accounts ({formData.socials.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Toggle switch to show/hide publicly
                  </span>
                </div>

                {formData.socials.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500">
                      No social accounts added yet. Use the form above to add your first account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.socials.map((link) => (
                      <div
                        key={link.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          link.enabled
                            ? 'bg-white border-slate-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200/70 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${getPlatformColorClass(
                              link.platform
                            )}`}
                          >
                            <SocialIcon platform={link.platform} className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => handleUpdateSocialLabel(link.id, e.target.value)}
                              className="text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden px-1"
                              placeholder="Label"
                            />
                            <div className="flex items-center gap-1.5 min-w-0">
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => handleUpdateSocialUrl(link.id, e.target.value)}
                                className="text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden px-1 truncate flex-1"
                                placeholder="URL"
                              />
                              {link.url && (
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  title="Open link"
                                  className="text-slate-400 hover:text-indigo-600 p-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Toggle active switch */}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <span className="text-[11px] font-medium text-slate-500">
                              {link.enabled ? 'Active' : 'Hidden'}
                            </span>
                            <input
                              type="checkbox"
                              checked={link.enabled}
                              onChange={() => handleToggleSocial(link.id)}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                          </label>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSocial(link.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Profile & Bio Editor */
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-600">
                  These details will appear in the <strong>About Us</strong> and{' '}
                  <strong>Contact Us</strong> sections as the official study hub curator/owner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                    placeholder="e.g. Alex Johnson or Faculty Lead"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                    placeholder="e.g. Lead Academic Curator"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                  placeholder="e.g. owner@studynoteshub.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Bio / Welcome Message
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                  placeholder="Brief note introducing yourself and your study vault..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
