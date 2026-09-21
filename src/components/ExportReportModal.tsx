import React from 'react';
import { X, Printer, Download, GraduationCap, Award, CalendarCheck, Users, ShieldCheck } from 'lucide-react';
import { Student, Subject, ScoreRecord, SubjectAttendanceRecord, DisciplineRecord, ClassInfo } from '../types';
import {
  calculateStudentOverallGPA,
  getAcademicRating,
  getAcademicRatingColor,
} from '../mockData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  students: Student[];
  subjects: Subject[];
  scores: ScoreRecord[];
  attendanceRecords: SubjectAttendanceRecord[];
  disciplineRecords: DisciplineRecord[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  students,
  subjects,
  scores,
  attendanceRecords,
  disciplineRecords,
}) => {
  if (!isOpen) return null;

  const studentData = students.map((st) => {
    const gpa = calculateStudentOverallGPA(st.id, scores, subjects);
    const rating = getAcademicRating(gpa);

    // Attendance stats
    let totalSessions = 0;
    let presentSessions = 0;
    if (Array.isArray(attendanceRecords)) {
      attendanceRecords.forEach((rec) => {
        if (rec && rec.studentId === st.id) {
          totalSessions++;
          if (rec.status === 'present') presentSessions++;
        }
      });
    }
    const attRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 100;

    return {
      ...st,
      gpa,
      rating,
      attRate,
      totalSessions,
    };
  });

  const validGpas = studentData.filter((s) => s.gpa !== null).map((s) => s.gpa as number);
  const classAvgGpa =
    validGpas.length > 0
      ? Math.round((validGpas.reduce((a, b) => a + b, 0) / validGpas.length) * 10) / 10
      : null;

  const ratingCounts = {
    'Xuất sắc': studentData.filter((s) => s.rating === 'Xuất sắc').length,
    'Giỏi': studentData.filter((s) => s.rating === 'Giỏi').length,
    'Khá': studentData.filter((s) => s.rating === 'Khá').length,
    'Trung bình': studentData.filter((s) => s.rating === 'Trung bình').length,
    'Yếu': studentData.filter((s) => s.rating === 'Yếu').length,
  };

  const handlePrint = () => {
    window.print();
  };

  const exportAllToCSV = () => {
    const headers = [
      'STT',
      'Mã SV',
      'Họ và tên',
      'Giới tính',
      'Tổ',
      'SĐT Phụ huynh',
      'Điểm TB Học Kỳ',
      'Xếp loại Học Lực',
      'Điểm Rèn Luyện / Nề Nếp',
      'Chuyên cần (%)',
    ];
    const rows = studentData.map((s, idx) => [
      idx + 1,
      s.studentCode,
      `"${s.name}"`,
      s.gender,
      s.group,
      `'${s.phoneParent}`,
      s.gpa !== null ? s.gpa.toFixed(1) : '',
      s.rating,
      s.conductScore,
      `${s.attRate}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Bao_cao_tong_ket_${classInfo.className}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fade-in print:max-w-none print:shadow-none print:rounded-none print:border-none print:max-h-none print:overflow-visible">
        {/* Header with actions */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Báo Cáo Tổng Kết Điểm Số, Chuyên Cần & Nề Nếp
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportAllToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Xuất CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In Báo Cáo</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm print:p-0 print:overflow-visible">
          {/* Official Letterhead */}
          <div className="text-center border-b pb-4 border-slate-200">
            <div className="uppercase text-xs font-semibold tracking-wider text-slate-500">
              {classInfo.schoolName}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase mt-1">
              Báo Cáo Tổng Hợp Tình Hình Học Tập, Chuyên Cần & Nề Nếp
            </h2>
            <div className="text-xs text-slate-600 mt-1">
              Lớp: <strong>{classInfo.className}</strong> • Khóa: <strong>{classInfo.academicYear}</strong>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Cố vấn học tập / GVCN: <strong>{classInfo.homeroomTeacher}</strong> • Ngày lập:{' '}
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Key Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Sĩ số sinh viên</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{students.length} SV</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">ĐTB 9 Môn Chuyên Ngành</span>
              <div className="text-xl font-bold text-indigo-700 mt-0.5">
                {classAvgGpa !== null ? classAvgGpa.toFixed(1) : '--'}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Sinh viên Giỏi / XS</span>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">
                {ratingCounts['Xuất sắc'] + ratingCounts['Giỏi']} SV
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">SV cần phụ đạo</span>
              <div className="text-xl font-bold text-rose-600 mt-0.5">
                {ratingCounts['Yếu']} SV
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Danh sách chi tiết sinh viên & kết quả rèn luyện
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 text-center w-10">STT</th>
                    <th className="py-2.5 px-3">Mã SV</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-2 text-center">Tổ</th>
                    <th className="py-2.5 px-2 text-center">Điểm TB</th>
                    <th className="py-2.5 px-2 text-center">Xếp loại</th>
                    <th className="py-2.5 px-2 text-center">Nề nếp</th>
                    <th className="py-2.5 px-2 text-center">Chuyên cần</th>
                    <th className="py-2.5 px-3">SĐT Phụ huynh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentData.map((st, idx) => {
                    const rStyle = getAcademicRatingColor(st.rating);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{st.studentCode}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{st.name}</td>
                        <td className="py-2 px-2 text-center">{st.group}</td>
                        <td className="py-2 px-2 text-center font-bold text-indigo-700">
                          {st.gpa !== null ? st.gpa.toFixed(1) : '--'}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${rStyle.bg} ${rStyle.border}`}
                          >
                            {st.rating}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-800">
                          {st.conductScore}đ
                        </td>
                        <td className="py-2 px-2 text-center font-semibold text-slate-700">
                          {st.attRate}%
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600">{st.phoneParent}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures footer */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs">
            <div>
              <div className="font-semibold text-slate-500 uppercase">Ban Giám Hiệu Khoa Du Lịch</div>
              <div className="text-[11px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</div>
              <div className="h-16"></div>
            </div>
            <div>
              <div className="font-semibold text-slate-500 uppercase">Cố Vấn Học Tập / GVCN</div>
              <div className="text-[11px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</div>
              <div className="h-16"></div>
              <div className="font-bold text-slate-800">{classInfo.homeroomTeacher}</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
