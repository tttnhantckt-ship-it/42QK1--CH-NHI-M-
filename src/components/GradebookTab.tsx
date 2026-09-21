import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  Save,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Student, Subject, ScoreRecord } from '../types';
import { calculateSubjectAverage, getAcademicRating, getAcademicRatingColor } from '../mockData';

interface GradebookTabProps {
  students: Student[];
  subjects: Subject[];
  scores: ScoreRecord[];
  onUpdateScore: (studentId: string, subjectId: string, updatedRecord: Partial<ScoreRecord>) => void;
}

export const GradebookTab: React.FC<GradebookTabProps> = ({
  students,
  subjects,
  scores,
  onUpdateScore,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_tour');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Get score record for a student
  const getScore = (studentId: string): ScoreRecord => {
    const found = scores.find((s) => s.studentId === studentId && s.subjectId === selectedSubjectId);
    if (found) return found;
    return {
      studentId,
      subjectId: selectedSubjectId,
      attendanceScore: 10,
      practicalScores: [null, null],
      midtermScore: null,
      finalScore: null,
    };
  };

  const handleScoreChange = (
    studentId: string,
    field: 'att' | 'p0' | 'p1' | 'mid' | 'fin',
    valStr: string
  ) => {
    const num = valStr.trim() === '' ? null : parseFloat(valStr);
    if (num !== null && (isNaN(num) || num < 0 || num > 10)) {
      return; // Invalid score
    }

    const current = getScore(studentId);

    if (field === 'att') {
      onUpdateScore(studentId, selectedSubjectId, { attendanceScore: num });
      return;
    }

    if (field === 'mid') {
      onUpdateScore(studentId, selectedSubjectId, { midtermScore: num });
      return;
    }

    if (field === 'fin') {
      onUpdateScore(studentId, selectedSubjectId, { finalScore: num });
      return;
    }

    const newPracticals = [...current.practicalScores];
    if (field === 'p0') newPracticals[0] = num;
    if (field === 'p1') newPracticals[1] = num;

    onUpdateScore(studentId, selectedSubjectId, { practicalScores: newPracticals });
  };

  // Compute subject statistics
  const subjectAverages = students
    .map((st) => calculateSubjectAverage(getScore(st.id)))
    .filter((v): v is number => v !== null);

  const classSubjectAvg =
    subjectAverages.length > 0
      ? Math.round((subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length) * 10) / 10
      : null;

  const highestScore = subjectAverages.length > 0 ? Math.max(...subjectAverages) : null;
  const lowestScore = subjectAverages.length > 0 ? Math.min(...subjectAverages) : null;
  const passCount = subjectAverages.filter((v) => v >= 5.0).length;
  const passRate =
    subjectAverages.length > 0 ? Math.round((passCount / subjectAverages.length) * 100) : 0;

  // Convert 10 scale to 4 scale and letter grade
  const getLetterGrade = (gpa: number | null): string => {
    if (gpa === null) return '--';
    if (gpa >= 8.5) return 'A';
    if (gpa >= 7.8) return 'B+';
    if (gpa >= 7.0) return 'B';
    if (gpa >= 6.3) return 'C+';
    if (gpa >= 5.5) return 'C';
    if (gpa >= 4.8) return 'D+';
    if (gpa >= 4.0) return 'D';
    return 'F';
  };

  // Export to CSV
  const exportSubjectScoresToCSV = () => {
    const headers = [
      'Mã SV',
      'Họ và tên',
      'Tổ',
      'Chuyên cần (10%)',
      'Thực hành 1 (15%)',
      'Thực hành 2 (15%)',
      'Giữa kỳ (20%)',
      'Thi kết thúc HP (40%)',
      'ĐTB Môn (Hệ 10)',
      'Điểm Chữ',
      'Xếp loại',
    ];
    const rows = students.map((st) => {
      const sc = getScore(st.id);
      const avg = calculateSubjectAverage(sc);
      const rating = getAcademicRating(avg);
      const letter = getLetterGrade(avg);
      return [
        st.studentCode,
        `"${st.name}"`,
        st.group,
        sc.attendanceScore ?? '',
        sc.practicalScores[0] ?? '',
        sc.practicalScores[1] ?? '',
        sc.midtermScore ?? '',
        sc.finalScore ?? '',
        avg !== null ? avg.toFixed(1) : '',
        letter,
        rating,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Bang_diem_${currentSubject?.name || 'Mon'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNotice = () => {
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Subject selector bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Sổ Điểm Điện Tử 9 Môn Chuyên Ngành
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">
                {currentSubject?.credits} Tín chỉ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Giáo viên giảng dạy: <strong className="text-slate-800">{currentSubject?.teacherName}</strong> • Công thức: <em>ĐTB = Chuyên cần (10%) + Thực hành (30%) + Giữa kỳ (20%) + Thi hết môn (40%)</em>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {saveSuccessNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg animate-fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã tự động lưu điểm môn học
              </span>
            )}
            <button
              type="button"
              id="btn-export-subject-csv"
              onClick={exportSubjectScoresToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Xuất Bảng Điểm CSV</span>
            </button>
            <button
              type="button"
              onClick={handleSaveNotice}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Lưu Sổ Điểm</span>
            </button>
          </div>
        </div>

        {/* Subjects horizontal selector pills (9 subjects) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                id={`sub-select-${sub.id}`}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {sub.name} ({sub.code})
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">ĐTB Môn Cả Lớp</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {classSubjectAvg !== null ? classSubjectAvg.toFixed(1) : '--'}
            <span className="text-xs font-normal text-slate-500 ml-1">/ 10</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Tỷ Lệ Đạt (≥ 5.0)</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {passRate}%
            <span className="text-xs font-normal text-slate-500 ml-1">
              ({passCount}/{subjectAverages.length})
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Điểm Cao Nhất</div>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {highestScore !== null ? highestScore.toFixed(1) : '--'}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Điểm Thấp Nhất</div>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {lowestScore !== null ? lowestScore.toFixed(1) : '--'}
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-xs">
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-4 min-w-[160px]">Sinh viên</th>
                <th className="py-3 px-3 w-20 text-center">Mã SV</th>
                <th className="py-3 px-3 w-16 text-center">Tổ</th>
                <th className="py-3 px-2 w-20 text-center bg-emerald-50/50">Chuyên cần (10%)</th>
                <th className="py-3 px-2 w-20 text-center bg-blue-50/50">Thực hành 1 (15%)</th>
                <th className="py-3 px-2 w-20 text-center bg-blue-50/50">Thực hành 2 (15%)</th>
                <th className="py-3 px-2 w-24 text-center bg-indigo-50/60 font-bold text-indigo-900">
                  Giữa kỳ (20%)
                </th>
                <th className="py-3 px-2 w-24 text-center bg-purple-50/60 font-bold text-purple-900">
                  Thi hết môn (40%)
                </th>
                <th className="py-3 px-3 w-24 text-center bg-slate-100 font-bold text-slate-900">
                  ĐTB Môn
                </th>
                <th className="py-3 px-3 w-16 text-center">Điểm chữ</th>
                <th className="py-3 px-3 w-28 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    Chưa có học sinh nào. Giáo viên có thể nhập danh sách sinh viên bằng nút &quot;Nhập DS Học Sinh&quot;.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  const sc = getScore(student.id);
                  const avg = calculateSubjectAverage(sc);
                  const rating = getAcademicRating(avg);
                  const letter = getLetterGrade(avg);
                  const ratingStyle = getAcademicRatingColor(rating);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${student.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                          >
                            {student.name.slice(
                              student.name.lastIndexOf(' ') + 1,
                              student.name.lastIndexOf(' ') + 2
                            )}
                          </div>
                          <span className="truncate">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs text-slate-500">
                        {student.studentCode}
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs text-slate-600">
                        {student.group}
                      </td>

                      {/* Chuyên cần */}
                      <td className="py-1.5 px-1.5 text-center bg-emerald-50/20">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          id={`score-att-${student.id}`}
                          value={sc.attendanceScore !== null ? sc.attendanceScore : ''}
                          onChange={(e) => handleScoreChange(student.id, 'att', e.target.value)}
                          placeholder="--"
                          className="w-14 text-center py-1 text-xs font-semibold bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Thực hành 1 */}
                      <td className="py-1.5 px-1.5 text-center bg-blue-50/20">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          id={`score-p0-${student.id}`}
                          value={sc.practicalScores[0] !== null ? sc.practicalScores[0] : ''}
                          onChange={(e) => handleScoreChange(student.id, 'p0', e.target.value)}
                          placeholder="--"
                          className="w-14 text-center py-1 text-xs font-semibold bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Thực hành 2 */}
                      <td className="py-1.5 px-1.5 text-center bg-blue-50/20">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          id={`score-p1-${student.id}`}
                          value={sc.practicalScores[1] !== null ? sc.practicalScores[1] : ''}
                          onChange={(e) => handleScoreChange(student.id, 'p1', e.target.value)}
                          placeholder="--"
                          className="w-14 text-center py-1 text-xs font-semibold bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Giữa kỳ */}
                      <td className="py-1.5 px-1.5 text-center bg-indigo-50/30">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          id={`score-gk-${student.id}`}
                          value={sc.midtermScore !== null ? sc.midtermScore : ''}
                          onChange={(e) => handleScoreChange(student.id, 'mid', e.target.value)}
                          placeholder="--"
                          className="w-16 text-center py-1 text-xs font-bold text-indigo-900 bg-white border border-indigo-200 rounded focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                        />
                      </td>

                      {/* Thi kết thúc học phần */}
                      <td className="py-1.5 px-1.5 text-center bg-purple-50/30">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          id={`score-ck-${student.id}`}
                          value={sc.finalScore !== null ? sc.finalScore : ''}
                          onChange={(e) => handleScoreChange(student.id, 'fin', e.target.value)}
                          placeholder="--"
                          className="w-16 text-center py-1 text-xs font-bold text-purple-900 bg-white border border-purple-200 rounded focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                        />
                      </td>

                      {/* ĐTB Môn */}
                      <td className="py-2.5 px-3 text-center bg-slate-50 font-extrabold text-sm">
                        <span className={avg !== null && avg < 5 ? 'text-rose-600' : 'text-slate-900'}>
                          {avg !== null ? avg.toFixed(1) : '--'}
                        </span>
                      </td>

                      {/* Điểm chữ */}
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-xs text-indigo-800">
                        {letter}
                      </td>

                      {/* Xếp loại */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${ratingStyle.bg} ${ratingStyle.border}`}
                        >
                          {rating}
                        </span>
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
