import { StudyNote, OwnerProfile, ContactMessage } from '../types';
import { INITIAL_STUDY_NOTES } from '../data/initialNotes';

const STORAGE_KEY = 'study_notes_vault_v1';
const OWNER_PROFILE_KEY = 'study_notes_owner_profile_v1';
const CONTACT_MESSAGES_KEY = 'study_notes_contact_messages_v1';

export const DEFAULT_OWNER_PROFILE: OwnerProfile = {
  name: 'Academic Lead & Curator',
  title: 'Founder & Notes Curator',
  bio: 'Welcome to Study Notes Hub! Connect with me on social media or reach out for study collaborations, syllabus guides, or suggestions.',
  email: 'curator@studynoteshub.edu',
  avatarUrl: '',
  socials: [
    {
      id: 'github',
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com',
      enabled: true,
    },
    {
      id: 'linkedin',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com',
      enabled: true,
    },
    {
      id: 'twitter',
      platform: 'twitter',
      label: 'Twitter / X',
      url: 'https://x.com',
      enabled: true,
    },
    {
      id: 'instagram',
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://instagram.com',
      enabled: true,
    },
    {
      id: 'youtube',
      platform: 'youtube',
      label: 'YouTube',
      url: 'https://youtube.com',
      enabled: false,
    },
  ],
};

export function loadOwnerProfileFromStorage(): OwnerProfile {
  try {
    const raw = localStorage.getItem(OWNER_PROFILE_KEY);
    if (!raw) return DEFAULT_OWNER_PROFILE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.socials)) {
      return parsed;
    }
    return DEFAULT_OWNER_PROFILE;
  } catch (err) {
    console.error('Failed to load owner profile, returning default', err);
    return DEFAULT_OWNER_PROFILE;
  }
}

export function saveOwnerProfileToStorage(profile: OwnerProfile): boolean {
  try {
    localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error('Failed to save owner profile', err);
    return false;
  }
}

export function loadContactMessagesFromStorage(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(CONTACT_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveContactMessageToStorage(msg: ContactMessage): boolean {
  try {
    const existing = loadContactMessagesFromStorage();
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify([msg, ...existing]));
    return true;
  } catch (err) {
    console.error('Failed to save contact message', err);
    return false;
  }
}

export function loadNotesFromStorage(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDY_NOTES));
      return INITIAL_STUDY_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_STUDY_NOTES;
  } catch (err) {
    console.error('Failed to load notes from localStorage, falling back to initial data', err);
    return INITIAL_STUDY_NOTES;
  }
}

export function saveNotesToStorage(notes: StudyNote[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (err) {
    console.error('Failed to persist notes to localStorage', err);
    return false;
  }
}

export function resetToInitialNotes(): StudyNote[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDY_NOTES));
  return INITIAL_STUDY_NOTES;
}

export function exportNotesAsJson(notes: StudyNote[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `study_notes_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Fallback smart client-side note summarizer and flashcard generator if backend Gemini is offline or without key
export function generateOfflineStudySummary(note: StudyNote): {
  summary: string;
  flashcards: Array<{ id: string; front: string; back: string }>;
  quiz: Array<{ id: string; question: string; options: string[]; answerIndex: number; explanation: string }>;
} {
  const text = note.content || '';
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  
  // Extract key headings or bullet points
  const keyLines = lines.filter((l) => l.startsWith('#') || l.startsWith('-') || l.startsWith('*') || l.includes(':'));
  const sampleHighlights = keyLines.slice(0, 6).map((l) => l.replace(/^[#\-\*]+\s*/, '').trim());

  const summaryMarkdown = `### Study Note Summary: ${note.title}

**Subject**: ${note.subject} ${note.courseCode ? `(${note.courseCode})` : ''}  
**Document Type**: ${note.category} | **Author**: ${note.author}

#### Core Highlights & Essential Concepts
${
  sampleHighlights.length > 0
    ? sampleHighlights.map((h) => `- ${h}`).join('\n')
    : `- Synthesized review of ${note.title}\n- Contains key lecture and revision points for ${note.subject}.`
}

#### Study Recommendation
- Practice active recall by reviewing the generated flashcards below.
- Re-read key formulas and definitions before testing yourself with the practice quiz.`;

  // Generate flashcards from lines with colons or headers
  const cards: Array<{ id: string; front: string; back: string }> = [];
  lines.forEach((line, index) => {
    if (cards.length >= 6) return;
    if (line.includes(':') && !line.startsWith('http') && line.length > 20) {
      const parts = line.split(':');
      const term = parts[0].replace(/^[-*#\s\d.]+/, '').trim();
      const def = parts.slice(1).join(':').trim();
      if (term.length > 3 && def.length > 10) {
        cards.push({
          id: `fc-auto-${index}`,
          front: `Define / Explain: ${term}`,
          back: def,
        });
      }
    }
  });

  if (cards.length < 3) {
    cards.push(
      {
        id: 'fc-def-1',
        front: `What is the primary topic of ${note.title}?`,
        back: `The core principles and academic fundamentals of ${note.subject}.`,
      },
      {
        id: 'fc-def-2',
        front: 'Why is active recall superior to passive re-reading?',
        back: 'Active recall forces neural retrieval pathways to fire, creating stronger synaptic consolidation.',
      }
    );
  }

  const quiz = [
    {
      id: 'quiz-auto-1',
      question: `Which subject domain is focused in "${note.title}"?`,
      options: [note.subject, 'General Knowledge', 'Uncategorized Topic', 'Physical Education'],
      answerIndex: 0,
      explanation: `This document is specifically cataloged under ${note.subject}.`,
    },
    {
      id: 'quiz-auto-2',
      question: `What category of document is "${note.title}"?`,
      options: [note.category, 'Casual Fiction', 'Recipe Note', 'Shopping List'],
      answerIndex: 0,
      explanation: `The file was classified as ${note.category}.`,
    },
  ];

  return {
    summary: summaryMarkdown,
    flashcards: cards,
    quiz,
  };
}
