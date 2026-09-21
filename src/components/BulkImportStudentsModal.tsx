import React, { useState } from 'react';
import { X, FileSpreadsheet, AlertCircle, Check, Sparkles } from 'lucide-react';
import { Student, Gender } from '../types';

interface BulkImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: Student[]) => void;
}

export const BulkImportStudentsModal: React.FC<BulkImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const colorPalette = [
    'bg-indigo-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-rose-500',
    'bg-amber-600',
    'bg-purple-600',
    'bg-cyan-600',
    'bg-pink-600',
  ];

  const handleFillSample = () => {
    const sample = `SV24DL09, Phan Minh Triết, Nam, 2005-07-14, Tổ 1 - Nghiệp vụ Lễ tân, 0905112233
SV24DL10, Hoàng Như Quỳnh, Nữ, 2005-10-25, Tổ 2 - Bộ phận F&B & Bar, 0914667788
SV24DL11, Đỗ Tuấn Kiệt, Nam, 2005-01-19, Tổ 3 - Hướng dẫn & Điều hành Tour, 0935889900
SV24DL12, Mai Phương Thảo, Nữ, 2005-09-03, Tổ 4 - Sự kiện & Buồng phòng, 0977334455
SV24DL13, Vũ Đình Trọng, Nam, 2005-04-16, Tổ 1 - Nghiệp vụ Lễ tân, 0988221144`;
    setRawText(sample);
    setErrorMsg('');
  };

  const handleProcessImport = () => {
    if (!rawText.trim()) {
      setErrorMsg('Vui lòng dán danh sách học sinh vào ô văn bản bên dưới.');
      return;
    }

    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedStudents: Student[] = [];

    lines.forEach((line, idx) => {
      // Split by comma or tab
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const cleanParts = parts.map((p) => p.trim());

      if (cleanParts.length >= 2) {
        const studentCode = cleanParts[0] || `SV24DL${String(idx + 9).padStart(2, '0')}`;
        const name = cleanParts[1];
        const genderRaw = cleanParts[2]?.toLowerCase();
        const gender: Gender = genderRaw === 'nữ' || genderRaw === 'nu' || genderRaw === 'female' ? 'Nữ' : 'Nam';
        const birthDate = cleanParts[3] || '2005-01-01';
        const group = cleanParts[4] || 'Tổ 1 - Nghiệp vụ Lễ tân';
        const phone = cleanParts[5] || '0901234567';

        const avatarColor = colorPalette[idx % colorPalette.length];

        parsedStudents.push({
          id: `sv_imported_${Date.now()}_${idx}`,
          studentCode,
          name,
          gender,
          birthDate,
          group,
          phone,
          phoneParent: phone,
          email: `${studentCode.toLowerCase()}@student.edu.vn`,
          avatarColor,
          conductScore: 100,
        });
      }
    });

    if (parsedStudents.length === 0) {
      setErrorMsg('Không thể phân tích dòng nào. Định dạng mỗi dòng: Mã SV, Họ và tên, Giới tính, Ngày sinh, Tổ, SĐT');
      return;
    }

    onImport(parsedStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nhập Danh Sách Học Sinh / Sinh Viên Hàng Loạt
              </h3>
              <p className="text-xs text-slate-500">
                Dán danh sách từ Excel, Google Sheets hoặc tệp danh sách của giáo viên
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900 flex items-start justify-between gap-3">
            <div>
              <span className="font-semibold block mb-0.5">Quy cách định dạng mỗi dòng:</span>
              <code className="text-[11px] bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-indigo-800">
                Mã SV, Họ và tên, Giới tính (Nam/Nữ), Ngày sinh (YYYY-MM-DD), Nhóm/Tổ, Số điện thoại
              </code>
              <p className="text-[11px] text-indigo-700 mt-1">
                (Có thể sao chép trực tiếp các cột từ Excel rồi dán vào đây)
              </p>
            </div>

            <button
              type="button"
              onClick={handleFillSample}
              className="shrink-0 px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-indigo-700 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Dán Dữ Liệu Mẫu</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dán nội dung danh sách học sinh vào đây:
            </label>
            <textarea
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setErrorMsg('');
              }}
              rows={8}
              placeholder={`SV24DL09, Phan Minh Triết, Nam, 2005-07-14, Tổ 1, 0905112233\nSV24DL10, Hoàng Như Quỳnh, Nữ, 2005-10-25, Tổ 2, 0914667788`}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {rawText.trim() ? `Đã nhập khoảng ${rawText.split('\n').filter(Boolean).length} dòng` : 'Chưa có dữ liệu'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                id="btn-confirm-bulk-import"
                onClick={handleProcessImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Nhập Ngay Vào Danh Sách Lớp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
