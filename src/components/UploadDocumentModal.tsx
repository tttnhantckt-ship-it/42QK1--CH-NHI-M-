import React, { useState, useRef } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { Subject, SubjectDocument } from '../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  subjects: Subject[];
  initialSubjectId?: string;
  onClose: () => void;
  onUpload: (newDoc: Omit<SubjectDocument, 'id'>) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  subjects,
  initialSubjectId,
  onClose,
  onUpload,
}) => {
  const [subjectId, setSubjectId] = useState<string>(initialSubjectId || subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }
      setErrorMsg('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }
      setErrorMsg('');
    }
  };

  const getFileTypeFromExtension = (name: string): SubjectDocument['fileType'] => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return ext;
    if (ext === 'ppt' || ext === 'pptx') return ext;
    if (ext === 'zip' || ext === 'rar') return 'zip';
    if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tài liệu.');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn hoặc kéo thả tệp tài liệu cần tải lên.');
      return;
    }

    const fileType = getFileTypeFromExtension(selectedFile.name);
    const fileSize = formatFileSize(selectedFile.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;

      onUpload({
        subjectId,
        title: title.trim(),
        fileName: selectedFile.name,
        fileSize,
        fileType,
        uploadedAt: new Date().toISOString().slice(0, 10),
        teacherName: currentSubject?.teacherName || 'Giảng viên bộ môn',
        description: description.trim() || undefined,
        fileData,
      });

      onClose();
    };

    reader.onerror = () => {
      onUpload({
        subjectId,
        title: title.trim(),
        fileName: selectedFile.name,
        fileSize,
        fileType,
        uploadedAt: new Date().toISOString().slice(0, 10),
        teacherName: currentSubject?.teacherName || 'Giảng viên bộ môn',
        description: description.trim() || undefined,
      });
      onClose();
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Tải Lên Tài Liệu Môn Học Cho Sinh Viên
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
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Môn học áp dụng <span className="text-rose-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - GV: {s.teacherName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề tài liệu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-document-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Giáo trình Thực hành Set up bàn tiệc Châu Âu"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tệp tài liệu đính kèm <span className="text-rose-500">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate max-w-[240px]">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatFileSize(selectedFile.size)} • Nhấn để đổi tệp khác
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud className="h-9 w-9 mx-auto text-indigo-500 mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Kéo thả tệp vào đây hoặc <span className="text-indigo-600 underline">chọn tệp từ máy tính</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Hỗ trợ PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), ZIP
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú / Hướng dẫn sinh viên
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="VD: Sinh viên in bài tập trang 12 và mang theo trong buổi thực hành..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
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
              id="btn-confirm-upload-doc"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Đăng Tài Liệu Cho Lớp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
