import React, { useState, useEffect, useId } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Heart,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  RefreshCw,
  ExternalLink,
  Tag as TagIcon,
  Maximize2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { StudyNote, Flashcard, QuizQuestion } from '../types';
import { getSubjectColor } from './NoteCard';
import { generateOfflineStudySummary, formatBytes } from '../utils/storage';

interface NoteReaderModalProps {
  note: StudyNote | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (updatedNote: StudyNote) => void;
  onToggleFavorite: (id: string) => void;
}

export const NoteReaderModal: React.FC<NoteReaderModalProps> = ({
  note,
  isOpen,
  onClose,
  onUpdateNote,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'ai-summary' | 'flashcards' | 'quiz'>('content');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // AI Loading states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    // Reset reader states when opening a new note
    setActiveTab('content');
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [note?.id]);

  if (!isOpen || !note) return null;

  const colors = getSubjectColor(note.subject);

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${note.title}. Subject: ${note.subject}. ${note.content.replace(/[#*`_]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 3000));
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleDownload = () => {
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

  // Generate / Load AI Summary
  const ensureAiSummary = async () => {
    if (note.aiSummary) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/notes/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          subject: note.subject,
          content: note.content,
          action: 'summary',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          onUpdateNote({ ...note, aiSummary: data.result });
          setIsGeneratingAI(false);
          return;
        }
      }
    } catch (err) {
      // Fallback
    }

    // Fallback offline generator
    const fallback = generateOfflineStudySummary(note);
    onUpdateNote({ ...note, aiSummary: fallback.summary });
    setIsGeneratingAI(false);
  };

  // Ensure Flashcards
  const ensureFlashcards = async () => {
    if (note.flashcards && note.flashcards.length > 0) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/notes/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          subject: note.subject,
          content: note.content,
          action: 'flashcards',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cards: Flashcard[] = parsed.map((item: any, idx: number) => ({
            id: `fc-ai-${idx}-${Date.now()}`,
            front: item.front || item.question || 'Concept',
            back: item.back || item.answer || 'Definition',
          }));
          onUpdateNote({ ...note, flashcards: cards });
          setIsGeneratingAI(false);
          return;
        }
      }
    } catch (err) {
      // fallback
    }

    const fallback = generateOfflineStudySummary(note);
    onUpdateNote({ ...note, flashcards: fallback.flashcards });
    setIsGeneratingAI(false);
  };

  // Ensure Quiz
  const ensureQuiz = async () => {
    if (note.quiz && note.quiz.length > 0) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/notes/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          subject: note.subject,
          content: note.content,
          action: 'quiz',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const questions: QuizQuestion[] = parsed.map((q: any, idx: number) => ({
            id: `qz-ai-${idx}-${Date.now()}`,
            question: q.question,
            options: q.options || [],
            answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
            explanation: q.explanation || '',
          }));
          onUpdateNote({ ...note, quiz: questions });
          setIsGeneratingAI(false);
          return;
        }
      }
    } catch (err) {
      // fallback
    }

    const fallback = generateOfflineStudySummary(note);
    onUpdateNote({ ...note, quiz: fallback.quiz });
    setIsGeneratingAI(false);
  };

  const currentFlashcards = note.flashcards || [];
  const currentQuiz = note.quiz || [];

  const handleSelectQuizOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    // calculate score
    let correctCount = 0;
    currentQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    if (correctCount > 0 && correctCount >= Math.ceil(currentQuiz.length / 2)) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full max-w-5xl h-[94vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 sm:px-6 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {note.subject}
              </span>
              {note.courseCode && (
                <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
                  {note.courseCode}
                </span>
              )}
              <span className="text-xs font-medium text-slate-500">
                {note.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {note.title}
            </h2>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Read Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Stop reading' : 'Read notes aloud'}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyContent}
              title="Copy note text to clipboard"
              className="p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              title="Download note file"
              className="p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(note.id)}
              title={note.isFavorite ? 'Favorited' : 'Favorite'}
              className={`p-2 rounded-lg transition-colors ${
                note.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Study Mode Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-5 sm:px-6 bg-white gap-2 sm:gap-6 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Study Document
          </button>

          <button
            onClick={() => {
              setActiveTab('ai-summary');
              ensureAiSummary();
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'ai-summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Summary & Takeaways
          </button>

          <button
            onClick={() => {
              setActiveTab('flashcards');
              ensureFlashcards();
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'flashcards'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            Flashcards {currentFlashcards.length > 0 && `(${currentFlashcards.length})`}
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              ensureQuiz();
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            Practice Quiz
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50/40">
          {/* TAB 1: Main Content Viewer */}
          {activeTab === 'content' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Note Metadata Banner */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <strong>Author:</strong> {note.author}
                  </span>
                  {note.semester && (
                    <span>
                      <strong>Term:</strong> {note.semester}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formattedDate}
                  </span>
                </div>
                {note.fileSize && (
                  <span className="font-mono text-slate-400">
                    {formatBytes(note.fileSize)}
                  </span>
                )}
              </div>

              {/* Image Preview if format is image */}
              {note.format === 'image' && note.fileDataUrl && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <img
                    src={note.fileDataUrl}
                    alt={note.title}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
                    <span>{note.fileName}</span>
                    <a
                      href={note.fileDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Open Full Image
                    </a>
                  </div>
                </div>
              )}

              {/* Rendered Document Body */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-2 prose-td:p-2">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>

              {/* Note Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <TagIcon className="w-4 h-4 text-slate-400" />
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Summary & Key Takeaways */}
          {activeTab === 'ai-summary' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">AI Study Summary & Key Takeaways</h3>
                    <p className="text-xs text-slate-500">
                      Synthesized academic breakdown with core formulas, concepts, and exam advice
                    </p>
                  </div>
                </div>
                <button
                  disabled={isGeneratingAI}
                  onClick={() => {
                    onUpdateNote({ ...note, aiSummary: undefined });
                    ensureAiSummary();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>

              {isGeneratingAI ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    Analyzing study notes and extracting core concepts...
                  </p>
                  <p className="text-xs text-slate-400">
                    Organizing high-yield study points and exam takeaways
                  </p>
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-lg prose-h4:text-base">
                  <ReactMarkdown>{note.aiSummary || 'No summary generated yet.'}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Interactive Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Revision Flashcards
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click card to flip and test your active recall
                  </p>
                </div>
                {currentFlashcards.length > 0 && (
                  <button
                    onClick={() => {
                      const shuffled = [...currentFlashcards].sort(() => Math.random() - 0.5);
                      onUpdateNote({ ...note, flashcards: shuffled });
                      setCurrentCardIndex(0);
                      setIsCardFlipped(false);
                    }}
                    title="Shuffle cards"
                    className="p-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 flex items-center gap-1"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Shuffle
                  </button>
                )}
              </div>

              {isGeneratingAI ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">Generating flashcards from notes...</p>
                </div>
              ) : currentFlashcards.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-sm text-slate-600">No flashcards found for this document.</p>
                  <button
                    onClick={ensureFlashcards}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
                  >
                    Generate Flashcards Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Card {currentCardIndex + 1} of {currentFlashcards.length}</span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                      {isCardFlipped ? 'Answer View' : 'Question View'}
                    </span>
                  </div>

                  {/* Flashcard Component */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="min-h-64 sm:min-h-72 p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-400 shadow-md cursor-pointer transition-all flex flex-col justify-between select-none"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">
                        {isCardFlipped ? 'Answer / Solution' : 'Prompt / Question'}
                      </span>
                      <span className="text-indigo-600 text-xs font-medium">Click to flip</span>
                    </div>

                    <div className="my-auto py-4 text-center">
                      <p className={`text-base sm:text-lg font-bold leading-relaxed ${isCardFlipped ? 'text-indigo-900 font-medium' : 'text-slate-900'}`}>
                        {isCardFlipped
                          ? currentFlashcards[currentCardIndex].back
                          : currentFlashcards[currentCardIndex].front}
                      </p>
                    </div>

                    <div className="text-center text-xs text-slate-400">
                      {isCardFlipped ? '💡 Click to see question again' : '🔍 Tap to reveal answer'}
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      disabled={currentCardIndex === 0}
                      onClick={() => {
                        setCurrentCardIndex((i) => Math.max(0, i - 1));
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      Flip Card
                    </button>

                    <button
                      disabled={currentCardIndex === currentFlashcards.length - 1}
                      onClick={() => {
                        setCurrentCardIndex((i) => Math.min(currentFlashcards.length - 1, i + 1));
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Practice Quiz */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Quick Practice Quiz
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test your understanding of key principles from this note
                  </p>
                </div>
                {quizSubmitted && (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                  </button>
                )}
              </div>

              {isGeneratingAI ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">Generating practice questions...</p>
                </div>
              ) : currentQuiz.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-sm text-slate-600">No practice quiz questions available yet.</p>
                  <button
                    onClick={ensureQuiz}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl"
                  >
                    Generate Practice Quiz Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentQuiz.map((q, qIndex) => {
                    const chosen = selectedAnswers[qIndex];
                    const isAnswered = typeof chosen === 'number';

                    return (
                      <div
                        key={q.id || `quiz-q-${qIndex}`}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 pt-1 pl-8">
                          {q.options.map((option, optIndex) => {
                            let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
                            
                            if (quizSubmitted) {
                              if (optIndex === q.answerIndex) {
                                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                              } else if (chosen === optIndex) {
                                optionStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                              } else {
                                optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                              }
                            } else if (chosen === optIndex) {
                              optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold';
                            }

                            return (
                              <button
                                key={optIndex}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuizOption(qIndex, optIndex)}
                                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${optionStyle}`}
                              >
                                <span>{option}</span>
                                {quizSubmitted && optIndex === q.answerIndex && (
                                  <span className="text-xs font-bold text-emerald-600">✓ Correct</span>
                                )}
                                {quizSubmitted && chosen === optIndex && optIndex !== q.answerIndex && (
                                  <span className="text-xs font-bold text-rose-600">✗ Your answer</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when submitted */}
                        {quizSubmitted && q.explanation && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 ml-8">
                            <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Submit / Grade Button */}
                  <div className="pt-2 flex justify-end">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleGradeQuiz}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
                      >
                        Submit Answers & Check Score
                      </button>
                    ) : (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between w-full">
                        <div className="text-xs font-semibold text-slate-800">
                          Score:{' '}
                          <span className="text-indigo-600 font-bold">
                            {
                              currentQuiz.filter((q, idx) => selectedAnswers[idx] === q.answerIndex)
                                .length
                            }{' '}
                            / {currentQuiz.length} correct
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
