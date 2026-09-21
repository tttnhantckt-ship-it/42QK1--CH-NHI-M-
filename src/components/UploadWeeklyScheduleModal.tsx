import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle, Calendar, FileText, User } from 'lucide-react';
import { WeeklyScheduleDoc } from '../types';

interface UploadWeeklyScheduleModalProps {
  isOpen: boolean;
  initialWeek?: number;
  onClose: () => void;
  onUpload: (newDoc: Omit<WeeklyScheduleDoc, 'id'>) => void;
}

export const UploadWeeklyScheduleModal: React.FC<UploadWeeklyScheduleModalProps> = ({
  isOpen,
  initialWeek = 1,
  onClose,
  onUpload,
}) => {
  const [weekNumber, setWeekNumber] = useState<number>(initialWeek);
  const [startDate, setStartDate] = useState<string>('2025-03-03');
  const [endDate, setEndDate] = useState<string>('2025-03-09');
  const [weekLabel, setWeekLabel] = useState<string>('');
  const [uploadedBy, setUploadedBy] = useState<string>('ThS. Trịnh Thị Thanh Nhàn (GVCN)');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate default dates based on weekNumber
  useEffect(() => {
    // Base date: Week 1 starts Monday 2025-03-03
    const baseStart = new Date(2025, 2, 3); // March is month index 2
    const daysOffset = (weekNumber - 1) * 7;
    const sDate = new Date(baseStart.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    const eDate = new Date(sDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    const formatYMD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDM = (d: Date) => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    };

    const sStr = formatYMD(sDate);
    const eStr = formatYMD(eDate);
    setStartDate(sStr);
    setEndDate(eStr);
    setWeekLabel(`Tuần ${weekNumber} (${formatDM(sDate)} - ${formatDM(eDate)}/${sDate.getFullYear()})`);
  }, [weekNumber]);

  useEffect(() => {
    if (isOpen) {
      setWeekNumber(initialWeek);
      setSelectedFile(null);
      setErrorMsg('');
    }
  }, [isOpen, initialWeek]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg('');
      if (!description) {
        setDescription(`Lịch học Tuần ${weekNumber} lớp 42QK1 - Quản lý và kinh doanh du lịch`);
      }
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
      setErrorMsg('');
      if (!description) {
        setDescription(`Lịch học Tuần ${weekNumber} lớp 42QK1 - Quản lý và kinh doanh du lịch`);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const detectFileType = (fileName: string): WeeklyScheduleDoc['fileType'] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc') return 'doc';
    if (ext === 'docx') return 'docx';
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'xlsx';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) return 'image';
    return 'other';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn hoặc kéo thả tệp lịch học của tuần!');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    onUpload({
      weekNumber,
      weekLabel: weekLabel.trim() || `Tuần ${weekNumber}`,
      startDate,
      endDate,
      fileName: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      fileType: detectFileType(selectedFile.name),
      uploadedAt: todayStr,
      uploadedBy: uploadedBy.trim() || 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
      description: description.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <UploadCloud className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Tải Lên Lịch Học Theo Tuần</h2>
              <p className="text-xs text-emerald-100">Lớp 42QK1 - Quản lý và kinh doanh du lịch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Week Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn Tuần Học *
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Tuần {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người Đăng Tải
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                  placeholder="ThS. Trịnh Thị Thanh Nhàn"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Date Range info */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Thời gian tuần học (Thứ 2 đến Chủ nhật)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-500">Từ ngày: </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-0.5 px-2 py-1 text-xs border border-emerald-200 rounded-lg bg-white w-full font-medium"
                />
              </div>
              <div>
                <span className="text-slate-500">Đến ngày: </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-0.5 px-2 py-1 text-xs border border-emerald-200 rounded-lg bg-white w-full font-medium"
                />
              </div>
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              File Lịch Học / Thời Khóa Biểu (PDF, Excel, Word, Ảnh) *
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(selectedFile.size)} • Nhấn để thay đổi tệp khác
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Kéo thả file vào đây hoặc <span className="text-emerald-600 underline">duyệt tệp</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Hỗ trợ file PDF, Excel (.xlsx, .xls), Word (.docx) hoặc ảnh chụp TKB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú / Dặn Dò Cho Lớp 42QK1 (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Tuần này thực hành phòng Lab Lữ hành và phòng Tiền sảnh, các em mang đồng phục chuẩn..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none"
            />
          </div>

          {/* Active subjects reminder */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-700">📌 3 Môn học đang học kỳ này:</span>
            <ul className="mt-1 space-y-0.5 list-disc list-inside">
              <li>Thiết kế và điều hành tour (Cô Trịnh Thị Thanh Nhàn)</li>
              <li>Quản trị Kinh doanh nhà hàng - khách sạn (Thầy Mai Anh Tuấn)</li>
              <li>Quản trị lễ tân (Cô Nguyễn Thị Hạnh)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Lưu & Cập Nhật Lịch Tuần
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
