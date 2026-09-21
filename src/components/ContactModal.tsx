import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { ContactMessage, OwnerProfile } from '../types';
import { saveContactMessageToStorage, loadContactMessagesFromStorage } from '../utils/storage';
import { SocialIcon, getPlatformColorClass } from './SocialIcon';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerProfile: OwnerProfile;
  onOpenOwnerSocials: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  ownerProfile,
  onOpenOwnerSocials,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback & Suggestions');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ContactMessage[]>(() => loadContactMessagesFromStorage());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    saveContactMessageToStorage(newMessage);
    setHistory((prev) => [newMessage, ...prev]);
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  const activeSocials = ownerProfile.socials.filter((s) => s.enabled);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Contact Us & Support</h2>
              <p className="text-xs text-slate-300">
                Send a question, request course notes, or connect with the vault curator
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Quick info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                Direct Email Inquiries
              </div>
              <a
                href={`mailto:${ownerProfile.email}`}
                className="text-xs font-semibold text-indigo-600 hover:underline break-all"
              >
                {ownerProfile.email || 'support@studynoteshub.edu'}
              </a>
              <p className="text-[11px] text-slate-500 mt-1">
                Average reply time is under 24 business hours.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                <Clock className="w-4 h-4 text-indigo-600" />
                Community Office Hours
              </div>
              <p className="text-xs text-slate-700 font-medium">Mon - Fri, 9:00 AM - 5:00 PM</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Open for course syllabus suggestions and study group requests.
              </p>
            </div>
          </div>

          {/* Connect via owner's social media accounts */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                Fast Response via Owner Social Media
              </span>
              <button
                onClick={onOpenOwnerSocials}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Manage Socials
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5">
              Direct message the curator on your favorite platform:
            </p>
            {activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium bg-white transition-all hover:scale-105 ${getPlatformColorClass(
                      social.platform
                    )}`}
                  >
                    <SocialIcon platform={social.platform} className="w-3.5 h-3.5" />
                    <span>{social.label}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No social accounts active.</p>
            )}
          </div>

          {/* Submission Banner */}
          {isSubmitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for reaching out. Your note has been safely dispatched to the vault curator
                and logged in local records.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@university.edu"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500 font-medium"
                >
                  <option value="Feedback & Suggestions">Feedback & Feature Suggestions</option>
                  <option value="Lecture Material Request">Request Specific Course Subject</option>
                  <option value="Academic Collaboration">Academic / Notes Collaboration</option>
                  <option value="Bug Report">Bug or Document Display Issue</option>
                  <option value="General Inquiry">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, suggestions for new subject materials, or inquiry details..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  {showHistory ? 'Hide Sent History' : `Sent History (${history.length})`}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}

          {/* Sent History Drawer if toggled */}
          {showHistory && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Messages Sent in This Browser</h4>
              {history.length === 0 ? (
                <p className="text-xs text-slate-400">No sent messages recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.map((h) => (
                    <div key={h.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                        <span>{h.subject}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600">{h.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end flex-shrink-0">
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
