import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  UploadCloud,
  StickyNote,
  Download,
  Trash2,
  Plus,
  Pin,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Subject, SubjectDocument, SubjectNote, SubjectStatus } from '../types';

interface SubjectsTabProps {
  subjects: Subject[];
  documents: SubjectDocument[];
  notes: SubjectNote[];
  onOpenUploadDoc: (subjectId?: string) => void;
  onOpenAddNote: (subjectId?: string) => void;
  onDeleteDoc: (docId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const SubjectsTab: React.FC<SubjectsTabProps> = ({
  subjects = [],
  documents = [],
  notes = [],
  onOpenUploadDoc,
  onOpenAddNote,
  onDeleteDoc,
  onDeleteNote,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeDocs = Array.isArray(documents) ? documents : [];
  const safeNotes = Array.isArray(notes) ? notes : [];

  const inProgressCount = safeSubjects.filter((s) => s.status === 'in_progress').length;
  const upcomingCount = safeSubjects.filter((s) => s.status === 'upcoming').length;

  const filteredSubjects = safeSubjects.filter((sub) => {
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (selectedSubjectId !== 'all' && sub.id !== selectedSubjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.code.toLowerCase().includes(q) ||
        sub.teacherName.toLowerCase().includes(q) ||
        sub.roomDefault.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getDocTypeBadge = (type: SubjectDocument['fileType']) => {
    switch (type) {
      case 'pdf':
        return { bg: 'bg-rose-100 text-rose-700', label: 'PDF' };
      case 'doc':
      case 'docx':
        return { bg: 'bg-blue-100 text-blue-700', label: 'WORD' };
      case 'ppt':
      case 'pptx':
        return { bg: 'bg-amber-100 text-amber-800', label: 'POWERPOINT' };
      case 'xlsx':
        return { bg: 'bg-emerald-100 text-emerald-800', label: 'EXCEL' };
      case 'zip':
        return { bg: 'bg-purple-100 text-purple-800', label: 'ZIP' };
      default:
        return { bg: 'bg-slate-100 text-slate-700', label: 'TÀI LIỆU' };
    }
  };

  const handleDownloadDoc = (doc: SubjectDocument) => {
    if (doc.fileData) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob(
        [
          `TRƯỜNG TRUNG CẤP KINH TẾ KHÁNH HOÀ\nLỚP 42QK1 - QUẢN LÝ VÀ KINH DOANH DU LỊCH\n\nTài liệu môn: ${doc.title}\nGiảng viên: ${doc.teacherName}\nNgày tải: ${doc.uploadedAt}\n\n${doc.description || ''}`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || 'tai_lieu_mon_hoc.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Active Subjects Notice */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">
                  Lớp 42QK1 đang học 3 môn chuyên ngành trong kỳ này
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  3 Môn Đang Học
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>1. Thiết kế và điều hành tour:</strong> Cô Trịnh Thị Thanh Nhàn (GVCN) •{' '}
                <strong>2. Quản trị Kinh doanh nhà hàng - khách sạn:</strong> Thầy Mai Anh Tuấn •{' '}
                <strong>3. Quản trị lễ tân:</strong> Cô Nguyễn Thị Hạnh. (6 môn còn lại trong CTĐT sẽ được học sau).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter('in_progress')}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-300 transition-colors shrink-0 shadow-2xs"
          >
            Chỉ xem 3 môn đang học
          </button>
        </div>
      </div>

      {/* Top Filter & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <span>Chương Trình Đào Tạo Ngành Quản Lý & Kinh Doanh Du Lịch</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tài liệu bài giảng, giáo trình thực hành và sổ tay ghi chú của các giảng viên phụ trách
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <button
              type="button"
              id="btn-upload-doc-tab"
              onClick={() => onOpenUploadDoc(selectedSubjectId !== 'all' ? selectedSubjectId : undefined)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Tải Lên Tài Liệu</span>
            </button>

            <button
              type="button"
              id="btn-add-note-tab"
              onClick={() => onOpenAddNote(selectedSubjectId !== 'all' ? selectedSubjectId : undefined)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="h-4 w-4 text-amber-600" />
              <span>Thêm Ghi Chú</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs & Search */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-medium self-start">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả môn ({safeSubjects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Đang học kỳ này ({inProgressCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === 'upcoming'
                  ? 'bg-white text-slate-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3 h-3 text-slate-400" />
              Sẽ học sau ({upcomingCount})
            </button>
          </div>

          {/* Search & Subject Dropdown */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm môn học, giảng viên, mã môn..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">Tất cả môn</option>
              {safeSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subject Cards List */}
      <div className="space-y-6">
        {filteredSubjects.map((sub) => {
          const subDocs = safeDocs.filter((d) => d.subjectId === sub.id);
          const subNotes = safeNotes.filter((n) => n.subjectId === sub.id);
          const isInProgress = sub.status === 'in_progress';

          return (
            <div
              key={sub.id}
              className={`bg-white rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                isInProgress
                  ? 'border-emerald-200 hover:border-emerald-300 ring-1 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              {/* Subject Header */}
              <div
                className={`p-4 sm:p-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                  isInProgress
                    ? 'bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border-emerald-100'
                    : 'bg-gradient-to-r from-slate-50 to-white border-slate-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono border ${
                      isInProgress
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {sub.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                      {isInProgress ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Đang Học Kỳ Này
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Sẽ Học Sau
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {sub.credits} Tín chỉ ({sub.totalPeriods} tiết)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                      <span>
                        Giảng viên:{' '}
                        <strong className="text-slate-800">
                          {sub.teacherName}
                          {sub.teacherName.includes('Trịnh Thị Thanh Nhàn') && ' (GVCN)'}
                        </strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        Phòng học: <strong className="text-slate-800">{sub.roomDefault}</strong>
                      </span>
                      {isInProgress && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-medium">
                            Tiến độ: <strong>{sub.completedPeriods}/{sub.totalPeriods} tiết</strong>
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onOpenAddNote(sub.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                    <span>Thêm Ghi Chú</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenUploadDoc(sub.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Tải Tài Liệu</span>
                  </button>
                </div>
              </div>

              {/* Subject Description / Objective */}
              {sub.syllabusOverview && (
                <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Mục tiêu học phần: </span>
                  {sub.syllabusOverview}
                  {sub.currentLesson && (
                    <span className="ml-3 text-slate-500">
                      • Hiện tại: <span className="text-slate-700 font-medium">{sub.currentLesson}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Content Grid: Notes & Documents */}
              <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Ghi chú của giáo viên */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <StickyNote className="h-4 w-4 text-amber-600" />
                      <span>Ghi chú & Dặn dò của Giảng viên ({subNotes.length})</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Lưu ý sinh viên</span>
                  </div>

                  {subNotes.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                      Chưa có ghi chú riêng cho môn này.{' '}
                      <button
                        onClick={() => onOpenAddNote(sub.id)}
                        className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                      >
                        Thêm ghi chú
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {subNotes.map((note) => (
                        <div
                          key={note.id}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            note.isImportant
                              ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              {note.isImportant && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                                  <Pin className="h-2.5 w-2.5" /> Lưu ý quan trọng
                                </span>
                              )}
                              <span>{note.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onDeleteNote(note.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                              title="Xóa ghi chú"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                            {note.content}
                          </p>
                          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>
                              Đăng bởi: <strong>{note.author}</strong>
                            </span>
                            <span>{note.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Tài liệu môn học */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span>Tài Liệu Môn Học Giáo Viên Tải Lên ({subDocs.length})</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Giáo trình & Slide</span>
                  </div>

                  {subDocs.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                      Chưa có tài liệu tải lên cho môn này.{' '}
                      <button
                        onClick={() => onOpenUploadDoc(sub.id)}
                        className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                      >
                        Tải lên tài liệu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {subDocs.map((doc) => {
                        const badge = getDocTypeBadge(doc.fileType);
                        return (
                          <div
                            key={doc.id}
                            className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 mt-0.5 ${badge.bg}`}
                                >
                                  {badge.label}
                                </span>
                                <div>
                                  <h5 className="font-semibold text-slate-900 leading-snug">
                                    {doc.title}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                    <span className="font-mono">{doc.fileName}</span>
                                    <span>•</span>
                                    <span>{doc.fileSize}</span>
                                    <span>•</span>
                                    <span>Ngày tải: {doc.uploadedAt}</span>
                                  </div>
                                  {doc.description && (
                                    <p className="text-[11px] text-slate-600 mt-1 italic">
                                      {doc.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDoc(doc)}
                                  className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                  title="Tải tệp về máy"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteDoc(doc.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Xóa tài liệu"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
