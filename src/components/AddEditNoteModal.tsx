import React, { useState, useEffect } from 'react';
import { X, StickyNote } from 'lucide-react';
import { Subject, SubjectNote } from '../types';

interface AddEditNoteModalProps {
  isOpen: boolean;
  subjects: Subject[];
  initialSubjectId?: string;
  noteToEdit: SubjectNote | null;
  onClose: () => void;
  onSave: (noteData: Omit<SubjectNote, 'id'>, noteId?: string) => void;
}

export const AddEditNoteModal: React.FC<AddEditNoteModalProps> = ({
  isOpen,
  subjects,
  initialSubjectId,
  noteToEdit,
  onClose,
  onSave,
}) => {
  const [subjectId, setSubjectId] = useState<string>(
    noteToEdit?.subjectId || initialSubjectId || subjects[0]?.id || ''
  );
  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [content, setContent] = useState(noteToEdit?.content || '');
  const [isImportant, setIsImportant] = useState(noteToEdit?.isImportant || false);
  const [author, setAuthor] = useState(noteToEdit?.author || '');

  useEffect(() => {
    if (noteToEdit) {
      setSubjectId(noteToEdit.subjectId);
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setIsImportant(noteToEdit.isImportant || false);
      setAuthor(noteToEdit.author);
    } else {
      const activeSub = subjects.find((s) => s.id === (initialSubjectId || subjects[0]?.id));
      setSubjectId(initialSubjectId || subjects[0]?.id || '');
      setTitle('');
      setContent('');
      setIsImportant(false);
      setAuthor(activeSub?.teacherName || 'Giảng viên bộ môn');
    }
  }, [noteToEdit, initialSubjectId, subjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave(
      {
        subjectId,
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || 'Giảng viên bộ môn',
        createdAt: new Date().toISOString().slice(0, 10),
        isImportant,
      },
      noteToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              {noteToEdit ? 'Chỉnh Sửa Ghi Chú Môn Học' : 'Thêm Ghi Chú / Dặn Dò Môn Học'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                const sub = subjects.find((s) => s.id === e.target.value);
                if (sub) setAuthor(sub.teacherName);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề thông báo / Ghi chú <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chuẩn bị đồng phục & đồ dùng cho tiết thực hành Bar"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nội dung chi tiết cho sinh viên <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Nhập nội dung lưu ý, quy định bài tập hoặc dặn dò cho sinh viên..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Người đăng</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-amber-800">Ghim quan trọng (Lưu ý đỏ)</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {noteToEdit ? 'Lưu Ghi Chú' : 'Đăng Ghi Chú'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
