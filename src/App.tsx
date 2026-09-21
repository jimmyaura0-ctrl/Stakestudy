import React, { useState, useEffect, useMemo } from 'react';
import { StudyNote, SortOption, ViewMode, OwnerProfile } from './types';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
  resetToInitialNotes,
  loadOwnerProfileFromStorage,
  saveOwnerProfileToStorage,
} from './utils/storage';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { NoteCard } from './components/NoteCard';
import { NoteListRow } from './components/NoteListRow';
import { UploadModal } from './components/UploadModal';
import { NoteReaderModal } from './components/NoteReaderModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { OwnerSocialsModal } from './components/OwnerSocialsModal';
import { Footer } from './components/Footer';
import { BookOpen, Upload, Plus, FileQuestion, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [notes, setNotes] = useState<StudyNote[]>(() => loadNotesFromStorage());
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() =>
    loadOwnerProfileFromStorage()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOwnerSocialsModalOpen, setIsOwnerSocialsModalOpen] = useState(false);
  const [activeReadingNote, setActiveReadingNote] = useState<StudyNote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with storage on change
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveOwnerProfile = (newProfile: OwnerProfile) => {
    setOwnerProfile(newProfile);
    saveOwnerProfileToStorage(newProfile);
    showToast('Owner profile & social media accounts updated!');
  };

  const handleSaveNotes = (newNotes: StudyNote[]) => {
    setNotes((prev) => [...newNotes, ...prev]);
    showToast(`Successfully uploaded ${newNotes.length} ${newNotes.length === 1 ? 'note' : 'notes'}!`);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleUpdateNote = (updatedNote: StudyNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    if (activeReadingNote && activeReadingNote.id === updatedNote.id) {
      setActiveReadingNote(updatedNote);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, isFavorite: !n.isFavorite };
          if (activeReadingNote && activeReadingNote.id === id) {
            setActiveReadingNote(updated);
          }
          return updated;
        }
        return n;
      })
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeReadingNote && activeReadingNote.id === id) {
      setActiveReadingNote(null);
    }
    showToast('Note deleted');
  };

  const handleResetSampleNotes = () => {
    if (confirm('Reset your vault with the pre-loaded academic study notes? This will restore sample notes.')) {
      const initial = resetToInitialNotes();
      setNotes(initial);
      showToast('Restored sample study notes.');
    }
  };

  const handleOpenNote = (note: StudyNote) => {
    // Increment view count
    const updated = { ...note, viewsCount: (note.viewsCount || 0) + 1 };
    handleUpdateNote(updated);
    setActiveReadingNote(updated);
  };

  // Available subjects with counts
  const availableSubjects = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      counts[n.subject] = (counts[n.subject] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [notes]);

  // Filtered & Sorted Notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchContent = note.content.toLowerCase().includes(q);
          const matchSubject = note.subject.toLowerCase().includes(q);
          const matchCourse = note.courseCode?.toLowerCase().includes(q);
          const matchAuthor = note.author.toLowerCase().includes(q);
          const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));

          if (!matchTitle && !matchContent && !matchSubject && !matchCourse && !matchAuthor && !matchTags) {
            return false;
          }
        }

        // Subject filter
        if (selectedSubject !== 'all' && note.subject !== selectedSubject) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && note.category !== selectedCategory) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'all' && note.format !== selectedFormat) {
          return false;
        }

        // Favorites filter
        if (favoritesOnly && !note.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        if (sortBy === 'views') {
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        }
        return 0;
      });
  }, [notes, searchQuery, selectedSubject, selectedCategory, selectedFormat, favoritesOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        notes={notes}
        ownerProfile={ownerProfile}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onResetSampleNotes={handleResetSampleNotes}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenOwnerSocials={() => setIsOwnerSocialsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner */}
        <StatsBanner onOpenUpload={() => setIsUploadModalOpen(true)} />

        {/* Filters and Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          availableSubjects={availableSubjects}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
          favoritesOnly={favoritesOnly}
          onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={filteredNotes.length}
        />

        {/* Notes Grid / List */}
        {filteredNotes.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpen={handleOpenNote}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredNotes.map((note) => (
                <NoteListRow
                  key={note.id}
                  note={note}
                  onOpen={handleOpenNote}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FileQuestion className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No study notes found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || selectedSubject !== 'all' || selectedCategory !== 'all' || favoritesOnly
                  ? 'No notes match your current filter criteria. Try adjusting your query or resetting filters.'
                  : 'Your study vault is empty. Upload your first lecture note, PDF, or cheat sheet to begin.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {searchQuery || selectedSubject !== 'all' || selectedCategory !== 'all' || favoritesOnly ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('all');
                    setSelectedCategory('all');
                    setSelectedFormat('all');
                    setFavoritesOnly(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Upload Study Note
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        ownerProfile={ownerProfile}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenOwnerSocials={() => setIsOwnerSocialsModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onResetSampleNotes={handleResetSampleNotes}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveNotes={handleSaveNotes}
      />

      {/* Note Reader & Study Modal */}
      <NoteReaderModal
        note={activeReadingNote}
        isOpen={Boolean(activeReadingNote)}
        onClose={() => setActiveReadingNote(null)}
        onUpdateNote={handleUpdateNote}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* About Us Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        ownerProfile={ownerProfile}
        onOpenOwnerSocials={() => setIsOwnerSocialsModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        ownerProfile={ownerProfile}
        onOpenOwnerSocials={() => setIsOwnerSocialsModalOpen(true)}
      />

      {/* Owner Socials & Profile Modal */}
      <OwnerSocialsModal
        isOpen={isOwnerSocialsModalOpen}
        onClose={() => setIsOwnerSocialsModalOpen(false)}
        profile={ownerProfile}
        onSaveProfile={handleSaveOwnerProfile}
      />
    </div>
  );
}

