import React from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Globe,
  Mail,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { SocialPlatform } from '../types';

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-4 h-4' }) => {
  switch (platform) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'twitter':
      return <Twitter className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'website':
      return <Globe className={className} />;
    case 'email':
      return <Mail className={className} />;
    default:
      return <Share2 className={className} />;
  }
};

export const getPlatformColorClass = (platform: SocialPlatform): string => {
  switch (platform) {
    case 'github':
      return 'hover:text-slate-900 hover:border-slate-800 hover:bg-slate-100 text-slate-700';
    case 'linkedin':
      return 'hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 text-blue-600';
    case 'twitter':
      return 'hover:text-sky-500 hover:border-sky-400 hover:bg-sky-50 text-sky-600';
    case 'instagram':
      return 'hover:text-pink-600 hover:border-pink-400 hover:bg-pink-50 text-pink-600';
    case 'youtube':
      return 'hover:text-red-600 hover:border-red-400 hover:bg-red-50 text-red-600';
    case 'telegram':
      return 'hover:text-sky-500 hover:border-sky-400 hover:bg-sky-50 text-sky-600';
    case 'website':
      return 'hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600';
    case 'email':
      return 'hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50 text-amber-600';
    default:
      return 'hover:text-slate-900 hover:border-slate-400 hover:bg-slate-100 text-slate-600';
  }
};
