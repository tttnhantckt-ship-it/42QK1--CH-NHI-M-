import React from 'react';
import {
  X,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CalendarCheck,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Student, Subject, ScoreRecord, DisciplineRecord, SubjectAttendanceRecord } from '../types';
import {
  calculateSubjectAverage,
  getAcademicRating,
  getAcademicRatingColor,
  calculateStudentOverallGPA,
  getDisciplineCriterionLabel,
} from '../mockData';

interface StudentDetailModalProps {
  student: Student | null;
  subjects: Subject[];
  scores: ScoreRecord[];
  disciplineRecords: DisciplineRecord[];
  attendanceRecords: SubjectAttendanceRecord[];
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  subjects,
  scores,
  disciplineRecords,
  attendanceRecords,
  onClose,
}) => {
  if (!student) return null;

  const gpa = calculateStudentOverallGPA(student.id, scores, subjects);
  const overallRating = getAcademicRating(gpa);
  const ratingStyle = getAcademicRatingColor(overallRating);

  // Student's discipline records
  const studentDiscipline = disciplineRecords.filter((d) => d.studentId === student.id);

  // Student's attendance records across all subjects
  let totalSubjectSessions = 0;
  let presentSessions = 0;
  let lateSessions = 0;
  let absentSessions = 0;

  if (Array.isArray(attendanceRecords)) {
    attendanceRecords.forEach((rec) => {
      if (rec && rec.studentId === student.id) {
        totalSubjectSessions++;
        if (rec.status === 'present') presentSessions++;
        else if (rec.status === 'late') lateSessions++;
        else absentSessions++;
      }
    });
  }

  const attendanceRate =
    totalSubjectSessions > 0 ? Math.round((presentSessions / totalSubjectSessions) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl ${student.avatarColor} text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs`}
            >
              {student.name.slice(
                student.name.lastIndexOf(' ') + 1,
                student.name.lastIndexOf(' ') + 2
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-slate-200 text-slate-700">
                  {student.studentCode}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {student.group}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${
                    student.conductScore >= 90
                      ? 'bg-emerald-100 text-emerald-800'
                      : student.conductScore >= 80
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Nề nếp: {student.conductScore}đ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Giới tính: <strong>{student.gender}</strong> • Ngày sinh: <strong>{student.birthDate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="In học bạ cá nhân"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Quick summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 flex items-center gap-3">
              <Award className="h-8 w-8 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs text-indigo-700 font-medium">Điểm TB Các Môn (GPA)</div>
                <div className="text-xl font-bold text-indigo-950">
                  {gpa !== null ? gpa.toFixed(1) : '--'}
                  <span
                    className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded border ${ratingStyle.bg} ${ratingStyle.border}`}
                  >
                    {overallRating}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-3">
              <CalendarCheck className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs text-emerald-700 font-medium">Tỷ Lệ Chuyên Cần</div>
                <div className="text-xl font-bold text-emerald-950">
                  {attendanceRate}%
                  <span className="text-xs font-normal text-emerald-700 ml-1">
                    ({presentSessions}/{totalSubjectSessions} buổi học)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-medium">Liên Hệ Phụ Huynh</div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono">{student.phoneParent}</span>
              </div>
              {student.address && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Report Table for all 9 subjects */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Bảng Điểm Chi Tiết 9 Môn Học Chuyên Ngành
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Môn học</th>
                    <th className="py-2.5 px-2 text-center">Tín chỉ</th>
                    <th className="py-2.5 px-2 text-center">Chuyên cần</th>
                    <th className="py-2.5 px-2 text-center">Thực hành 1</th>
                    <th className="py-2.5 px-2 text-center">Thực hành 2</th>
                    <th className="py-2.5 px-2 text-center">Giữa kỳ</th>
                    <th className="py-2.5 px-2 text-center">Cuối kỳ</th>
                    <th className="py-2.5 px-3 text-center font-bold bg-indigo-50/50 text-indigo-900">
                      ĐTB
                    </th>
                    <th className="py-2.5 px-3 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {subjects.map((sub) => {
                    const record = scores.find(
                      (s) => s.studentId === student.id && s.subjectId === sub.id
                    );
                    const avg = calculateSubjectAverage(record);
                    const rating = getAcademicRating(avg);
                    const rStyle = getAcademicRatingColor(rating);

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="py-2 px-2 text-center text-slate-500">{sub.credits}</td>
                        <td className="py-2 px-2 text-center font-mono">
                          {record?.attendanceScore ?? '--'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {record?.practicalScores[0] ?? '--'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {record?.practicalScores[1] ?? '--'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-medium text-indigo-900">
                          {record?.midtermScore ?? '--'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-medium text-purple-900">
                          {record?.finalScore ?? '--'}
                        </td>
                        <td className="py-2 px-3 text-center font-extrabold bg-indigo-50/30 text-indigo-700">
                          {avg !== null ? avg.toFixed(1) : '--'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${rStyle.bg} ${rStyle.border}`}
                          >
                            {rating}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discipline & Conduct History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Lịch Sử Đánh Giá Nề Nếp & Khen Thưởng
            </h4>

            {studentDiscipline.length === 0 ? (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <span>Chấp hành nghiêm túc nề nếp học đường, tác phong du lịch chuyên nghiệp.</span>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {studentDiscipline.map((rec) => {
                  const crit = getDisciplineCriterionLabel(rec.criterion);
                  return (
                    <div
                      key={rec.id}
                      className="p-3 text-xs flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{crit.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-400 font-semibold">{rec.date}</span>
                            <span className={`px-2 py-0.2 rounded font-semibold text-[10px] ${crit.tag}`}>
                              {crit.label}
                            </span>
                          </div>
                          <p className="text-slate-700 mt-0.5">{rec.description}</p>
                        </div>
                      </div>
                      <span
                        className={`font-bold font-mono text-xs px-2 py-0.5 rounded ${
                          rec.points > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {rec.points > 0 ? `+${rec.points}` : rec.points}đ
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Teacher's personal notes */}
          {student.notes && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-slate-700 mb-1">
                Ghi chú của Giáo viên chủ nhiệm:
              </div>
              <p className="text-xs text-slate-600 italic">&ldquo;{student.notes}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
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
