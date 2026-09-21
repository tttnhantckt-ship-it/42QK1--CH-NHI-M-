import React from 'react';
import { GraduationCap, Users, Calendar, Award, RotateCcw, Printer, Plus, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { ClassInfo } from '../types';

interface HeaderProps {
  classInfo: ClassInfo;
  studentCount: number;
  averageClassGPA: number | null;
  overallAttendanceRate: number;
  conductAvg: number;
  onAddStudent: () => void;
  onBulkImport: () => void;
  onResetData: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classInfo,
  studentCount,
  averageClassGPA,
  overallAttendanceRate,
  conductAvg,
  onAddStudent,
  onBulkImport,
  onResetData,
  onOpenReport,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Class Info */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Quản Lý Sinh Viên & 9 Môn Học Chuyên Ngành
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                  Lớp {classInfo.className}
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {classInfo.majorName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {classInfo.semester} • GVCN: <span className="font-semibold text-slate-700">{classInfo.homeroomTeacher}</span> • {classInfo.schoolName}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-between md:justify-end">
            {/* Badges */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                <span>Sĩ số: <strong>{studentCount} SV</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Award className="h-3.5 w-3.5 text-emerald-600" />
                <span>ĐTB Môn: <strong>{averageClassGPA !== null ? averageClassGPA.toFixed(1) : '--'}</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Điểm nề nếp: <strong>{conductAvg}đ</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-purple-600" />
                <span>Chuyên cần: <strong>{overallAttendanceRate}%</strong></span>
              </div>
            </div>

            {/* Actions */}
            <button
              type="button"
              id="btn-print-report"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="Xuất / In báo cáo tổng kết"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Báo Cáo</span>
            </button>

            <button
              type="button"
              id="btn-reset-demo"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="Khôi phục dữ liệu mẫu ban đầu"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Đặt Lại Dữ Liệu</span>
            </button>

            <button
              type="button"
              id="btn-bulk-import-header"
              onClick={onBulkImport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer shadow-2xs"
              title="Nhập danh sách sinh viên nhanh chóng dạng Text hoặc CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
              <span>Nhập DS Học Sinh</span>
            </button>

            <button
              type="button"
              id="btn-add-student-header"
              onClick={onAddStudent}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm SV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
