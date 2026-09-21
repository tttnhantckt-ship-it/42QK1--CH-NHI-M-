import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  FileSpreadsheet,
  Upload,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Student, Subject, ScoreRecord, SubjectAttendanceRecord } from '../types';
import {
  calculateStudentOverallGPA,
  getAcademicRating,
  getAcademicRatingColor,
} from '../mockData';

interface StudentsTabProps {
  students: Student[];
  subjects: Subject[];
  scores: ScoreRecord[];
  attendanceRecords: SubjectAttendanceRecord[];
  onAddStudent: () => void;
  onOpenBulkImport: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  subjects,
  scores,
  attendanceRecords,
  onAddStudent,
  onOpenBulkImport,
  onEditStudent,
  onDeleteStudent,
  onSelectStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');

  // Compute calculated values for each student
  const studentDataList = useMemo(() => {
    return students.map((st) => {
      const gpa = calculateStudentOverallGPA(st.id, scores, subjects);
      const rating = getAcademicRating(gpa);

      // Attendance rate across all subjects
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
      const attRate =
        totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 100;

      return {
        ...st,
        gpa,
        rating,
        attRate,
        totalSessions,
      };
    });
  }, [students, scores, subjects, attendanceRecords]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return studentDataList.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.phoneParent.includes(searchTerm);

      const matchGroup = selectedGroup === 'all' || st.group === selectedGroup;
      const matchRating = selectedRating === 'all' || st.rating === selectedRating;

      return matchSearch && matchGroup && matchRating;
    });
  }, [studentDataList, searchTerm, selectedGroup, selectedRating]);

  // Export CSV for students
  const exportStudentsToCSV = () => {
    const headers = [
      'Mã SV',
      'Họ và tên',
      'Giới tính',
      'Ngày sinh',
      'Tổ',
      'SĐT Phụ huynh',
      'Điểm TB Tích Lũy',
      'Xếp loại',
      'Điểm Nề Nếp',
      'Chuyên cần (%)',
      'Ghi chú',
    ];
    const rows = filteredStudents.map((st) => [
      st.studentCode,
      `"${st.name}"`,
      st.gender,
      st.birthDate,
      st.group,
      `'${st.phoneParent}`,
      st.gpa !== null ? st.gpa.toFixed(1) : '',
      st.rating,
      st.conductScore,
      `${st.attRate}%`,
      `"${st.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Danh_sach_sinh_vien_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top action & filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="input-search-student"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo họ tên, mã sinh viên, SĐT phụ huynh..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Group and Rating filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Lọc:</span>
            </div>

            <select
              id="select-group-filter"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Tất cả tổ (4 tổ)</option>
              <option value="Tổ 1">Tổ 1</option>
              <option value="Tổ 2">Tổ 2</option>
              <option value="Tổ 3">Tổ 3</option>
              <option value="Tổ 4">Tổ 4</option>
            </select>

            <select
              id="select-rating-filter"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Tất cả học lực</option>
              <option value="Xuất sắc">Xuất sắc</option>
              <option value="Giỏi">Giỏi</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Yếu</option>
            </select>

            {/* Bulk import students */}
            <button
              type="button"
              id="btn-open-bulk-import-students"
              onClick={onOpenBulkImport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Nhập Danh Sách</span>
            </button>

            {/* Export CSV button */}
            <button
              type="button"
              id="btn-export-csv-students"
              onClick={exportStudentsToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              title="Tải về file CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Xuất CSV</span>
            </button>

            {/* Add student button */}
            <button
              type="button"
              id="btn-add-student"
              onClick={onAddStudent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-2xs ml-auto sm:ml-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm SV</span>
            </button>
          </div>
        </div>

        {/* Filter stats subtitle */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Hiển thị <strong>{filteredStudents.length}</strong> / {students.length} sinh viên
          </span>
          {(searchTerm || selectedGroup !== 'all' || selectedRating !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('all');
                setSelectedRating('all');
              }}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Mã SV</th>
                <th className="py-3 px-3">Giới tính</th>
                <th className="py-3 px-3">Tổ</th>
                <th className="py-3 px-3 text-center">ĐTB Tích lũy</th>
                <th className="py-3 px-3 text-center">Học lực</th>
                <th className="py-3 px-3 text-center">Nề nếp (100đ)</th>
                <th className="py-3 px-3 text-center">Chuyên cần</th>
                <th className="py-3 px-4">SĐT Phụ huynh</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Không tìm thấy sinh viên phù hợp</p>
                    <p className="text-xs mt-1">
                      Giáo viên có thể bấm &quot;Nhập Danh Sách&quot; để dán danh sách sinh viên nhanh chóng.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, index) => {
                  const ratingColor = getAcademicRatingColor(st.rating);
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => onSelectStudent(st)}
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${st.avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs`}
                          >
                            {st.name.slice(
                              st.name.lastIndexOf(' ') + 1,
                              st.name.lastIndexOf(' ') + 2
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {st.name}
                            </div>
                            {st.notes && (
                              <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                {st.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-medium text-slate-600">
                        {st.studentCode}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            st.gender === 'Nam'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          {st.gender}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{st.group}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-indigo-700">
                          {st.gpa !== null ? st.gpa.toFixed(1) : '--'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${ratingColor.bg} ${ratingColor.border}`}
                        >
                          {st.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            st.conductScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.conductScore >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : st.conductScore >= 65
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.conductScore}đ
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-semibold ${
                            st.attRate >= 90
                              ? 'text-emerald-600'
                              : st.attRate >= 80
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {st.attRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span className="font-mono text-xs">{st.phoneParent}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectStudent(st)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            title="Xem chi tiết học tập & chuyên cần"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditStudent(st)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteStudent(st.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Xóa sinh viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
