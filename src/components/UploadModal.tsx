import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  FileCode,
  File,
  CheckCircle,
  AlertCircle,
  Plus,
  BookOpen,
  Tag as TagIcon,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { StudyNote, SubjectType, DocCategory, FileFormat } from '../types';
import { formatBytes } from '../utils/storage';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (newNotes: StudyNote[]) => void;
}

const DEFAULT_SUBJECTS: SubjectType[] = [
  'Computer Science',
  'Mathematics',
  'Biology & Medicine',
  'Physics & Chemistry',
  'Economics & Finance',
  'History & Humanities',
  'Psychology & Sociology',
  'Engineering',
  'Literature & Languages',
  'Law & Political Science',
  'Other',
];

const DOC_CATEGORIES: DocCategory[] = [
  'Lecture Notes',
  'Cheat Sheet',
  'Exam Prep',
  'Summary Sheet',
  'Lab Report',
  'Homework & Exercises',
  'Textbook Notes',
];

const SUGGESTED_TAGS = ['Midterm', 'Final Exam', 'Formulas', 'Definitions', 'Important', 'Study Guide', 'Weekly Review'];

interface PendingUploadItem {
  id: string;
  file?: File;
  title: string;
  subject: string;
  courseCode: string;
  category: DocCategory;
  format: FileFormat;
  fileName: string;
  fileSize: number;
  fileDataUrl?: string;
  content: string;
  tags: string[];
  author: string;
  semester: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSaveNotes }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'write'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingItems, setPendingItems] = useState<PendingUploadItem[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Write Mode Single Form State
  const [writeTitle, setWriteTitle] = useState('');
  const [writeSubject, setWriteSubject] = useState<string>('Computer Science');
  const [writeCourseCode, setWriteCourseCode] = useState('');
  const [writeCategory, setWriteCategory] = useState<DocCategory>('Lecture Notes');
  const [writeAuthor, setWriteAuthor] = useState('');
  const [writeSemester, setWriteSemester] = useState('Current Term');
  const [writeContent, setWriteContent] = useState('');
  const [writeTags, setWriteTags] = useState<string[]>(['Exam Prep']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const determineFormat = (filename: string, mimeType: string): FileFormat => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || mimeType.startsWith('image/')) return 'image';
    if (['md', 'markdown'].includes(ext)) return 'markdown';
    if (['txt', 'log'].includes(ext)) return 'text';
    if (['doc', 'docx', 'rtf'].includes(ext)) return 'doc';
    return 'text';
  };

  const cleanTitleFromFilename = (filename: string): string => {
    const withoutExt = filename.replace(/\.[^/.]+$/, '');
    return withoutExt
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessingFiles(true);
    const newItems: PendingUploadItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const format = determineFormat(file.name, file.type);
      let content = '';
      let fileDataUrl: string | undefined = undefined;

      if (format === 'markdown' || format === 'text') {
        try {
          content = await file.text();
        } catch (e) {
          content = `Uploaded file: ${file.name}`;
        }
      }

      // Read as Data URL for preview/attachments if image or PDF
      if (format === 'image' || format === 'pdf' || format === 'doc') {
        try {
          fileDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(undefined);
            reader.readAsDataURL(file);
          });
        } catch (e) {
          // ignore
        }
      }

      if (!content && format === 'image') {
        content = `Visual study note / diagram uploaded from image: ${file.name}`;
      } else if (!content && format === 'pdf') {
        content = `PDF Lecture/Study Document: ${file.name}.\nSize: ${formatBytes(file.size)}`;
      }

      newItems.push({
        id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        title: cleanTitleFromFilename(file.name),
        subject: showCustomSubject && customSubject ? customSubject : writeSubject || 'General Studies',
        courseCode: writeCourseCode || '',
        category: 'Lecture Notes',
        format,
        fileName: file.name,
        fileSize: file.size,
        fileDataUrl,
        content,
        tags: ['Uploaded', format.toUpperCase()],
        author: writeAuthor.trim() || 'Student',
        semester: writeSemester || 'Fall 2024',
      });
    }

    setPendingItems((prev) => [...prev, ...newItems]);
    setIsProcessingFiles(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePendingItem = (id: string) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updatePendingItem = (id: string, updates: Partial<PendingUploadItem>) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddTagToItem = (itemId: string, tag: string) => {
    const clean = tag.trim().replace(/^#/, '');
    if (!clean) return;
    setPendingItems((prev) =>
      prev.map((item) =>
        item.id === itemId && !item.tags.includes(clean)
          ? { ...item, tags: [...item.tags, clean] }
          : item
      )
    );
  };

  const handleRemoveTagFromItem = (itemId: string, tagToRemove: string) => {
    setPendingItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, tags: item.tags.filter((t) => t !== tagToRemove) }
          : item
      )
    );
  };

  const handleSaveAllUploaded = () => {
    if (pendingItems.length === 0) return;

    const createdNotes: StudyNote[] = pendingItems.map((item) => ({
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: item.title.trim() || 'Untitled Study Note',
      subject: item.subject,
      courseCode: item.courseCode.trim() || undefined,
      category: item.category,
      format: item.format,
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileDataUrl: item.fileDataUrl,
      content: item.content || `Study note for ${item.title}`,
      tags: item.tags.length > 0 ? item.tags : ['Notes'],
      author: item.author.trim() || 'Student',
      semester: item.semester || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      viewsCount: 1,
    }));

    onSaveNotes(createdNotes);
    onClose();
  };

  const handleSaveWrittenNote = () => {
    if (!writeTitle.trim()) {
      alert('Please enter a note title.');
      return;
    }
    if (!writeContent.trim()) {
      alert('Please enter note content.');
      return;
    }

    const finalSubject = showCustomSubject && customSubject ? customSubject : writeSubject;

    const newNote: StudyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: writeTitle.trim(),
      subject: finalSubject,
      courseCode: writeCourseCode.trim() || undefined,
      category: writeCategory,
      format: 'typed',
      content: writeContent,
      tags: writeTags.length > 0 ? writeTags : ['Typed Notes'],
      author: writeAuthor.trim() || 'You',
      semester: writeSemester || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      viewsCount: 1,
    };

    onSaveNotes([newNote]);
    onClose();
  };

  const addWriteTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !writeTags.includes(clean)) {
      setWriteTags([...writeTags, clean]);
    }
    setTagInput('');
  };

  const removeWriteTag = (tagToRemove: string) => {
    setWriteTags(writeTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Upload Study Notes</h2>
              <p className="text-xs text-slate-500">
                Add lecture slides, PDF summaries, cheat sheets, or handwritten scan images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Document / Files
            {pendingItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 font-bold">
                {pendingItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'write'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Type or Paste Note
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'upload' ? (
            <>
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.markdown,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Drag & drop your study notes here, or <span className="text-indigo-600 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, Markdown (.md), Text (.txt), Word (.docx), and Images (PNG, JPG, scanned notes)
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                    PDF Documents
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                    Markdown (.md)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                    Scanned Images
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                    Text (.txt)
                  </span>
                </div>
              </div>

              {/* Pending Uploads Queue */}
              {pendingItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Ready to Upload ({pendingItems.length} {pendingItems.length === 1 ? 'file' : 'files'})
                    </h3>
                    <button
                      onClick={() => setPendingItems([])}
                      className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {pendingItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                              {item.format === 'image' ? (
                                <ImageIcon className="w-4 h-4 text-blue-500" />
                              ) : item.format === 'pdf' ? (
                                <FileText className="w-4 h-4 text-rose-500" />
                              ) : item.format === 'markdown' ? (
                                <FileCode className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <File className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updatePendingItem(item.id, { title: e.target.value })}
                                placeholder="Note title"
                                className="w-full text-xs sm:text-sm font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 rounded"
                              />
                              <p className="text-[11px] text-slate-400 px-1">
                                {item.fileName} • {formatBytes(item.fileSize)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removePendingItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Metadata inputs for this item */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Subject</label>
                            <select
                              value={item.subject}
                              onChange={(e) => updatePendingItem(item.id, { subject: e.target.value })}
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-indigo-500"
                            >
                              {DEFAULT_SUBJECTS.map((sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Course Code</label>
                            <input
                              type="text"
                              value={item.courseCode}
                              onChange={(e) => updatePendingItem(item.id, { courseCode: e.target.value })}
                              placeholder="e.g. CS 101, BIO 201"
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Document Type</label>
                            <select
                              value={item.category}
                              onChange={(e) => updatePendingItem(item.id, { category: e.target.value as DocCategory })}
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-indigo-500"
                            >
                              {DOC_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Tag Chips for this item */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTagFromItem(item.id, tag)}
                                className="text-slate-400 hover:text-slate-700"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="+ Add tag (Enter)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                handleAddTagToItem(item.id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-slate-300 text-slate-700 placeholder-slate-400 focus:outline-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Direct Write or Paste Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Note Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={writeTitle}
                    onChange={(e) => setWriteTitle(e.target.value)}
                    placeholder="e.g. Thermodynamics Laws & Entropy Formulas"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Subject</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomSubject(!showCustomSubject)}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      {showCustomSubject ? 'Select Standard' : '+ Custom Subject'}
                    </button>
                  </div>
                  {showCustomSubject ? (
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="e.g. Astrobiology"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <select
                      value={writeSubject}
                      onChange={(e) => setWriteSubject(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      {DEFAULT_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={writeCourseCode}
                    onChange={(e) => setWriteCourseCode(e.target.value)}
                    placeholder="e.g. PHYS 202"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={writeCategory}
                    onChange={(e) => setWriteCategory(e.target.value as DocCategory)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    {DOC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author / Uploader</label>
                  <input
                    type="text"
                    value={writeAuthor}
                    onChange={(e) => setWriteAuthor(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Study Note Content (Markdown or plain text) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                  placeholder={`Write or paste your study notes, formulas, lecture excerpts, or summary points here...
                  
# Topic Overview
- Main Concept 1: explanation
- Formula: E = mc^2
- Key Takeaway: remember this for exam`}
                  className="w-full text-xs sm:text-sm font-mono p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-300 bg-white min-h-10">
                  {writeTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 font-medium border border-indigo-100"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeWriteTag(tag)}
                        className="text-indigo-400 hover:text-indigo-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addWriteTag(tagInput);
                      }
                    }}
                    placeholder="+ Type tag & press Enter"
                    className="text-xs px-2 py-1 flex-1 min-w-32 focus:outline-none"
                  />
                </div>

                {/* Suggested Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 mr-1">Suggestions:</span>
                  {SUGGESTED_TAGS.map((sTag) => (
                    <button
                      key={sTag}
                      type="button"
                      onClick={() => addWriteTag(sTag)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      +{sTag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 sm:px-6 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          {activeTab === 'upload' ? (
            <button
              type="button"
              id="confirm-upload-btn"
              disabled={pendingItems.length === 0}
              onClick={handleSaveAllUploaded}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                pendingItems.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>
                Upload {pendingItems.length > 0 ? `(${pendingItems.length}) Notes` : 'Notes'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              id="save-written-note-btn"
              onClick={handleSaveWrittenNote}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Study Note</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
