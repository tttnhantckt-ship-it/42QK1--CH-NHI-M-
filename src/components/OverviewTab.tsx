import React from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import {
  Student,
  Subject,
  ScoreRecord,
  SubjectAttendanceRecord,
  DisciplineRecord,
  ScheduleItem,
  ClassInfo,
  SubjectDocument,
} from '../types';
import { calculateStudentOverallGPA, getAcademicRating, getAcademicRatingColor } from '../mockData';
import { TabType } from './Navigation';
import { PERIOD_TIMES } from './ScheduleTab';

interface OverviewTabProps {
  students: Student[];
  subjects: Subject[];
  scores: ScoreRecord[];
  attendanceRecords: SubjectAttendanceRecord[];
  disciplineRecords: DisciplineRecord[];
  schedule: ScheduleItem[];
  classInfo: ClassInfo;
  documents?: SubjectDocument[];
  onNavigateTab: (tab: TabType) => void;
  onSelectStudent: (student: Student) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  students,
  subjects,
  scores,
  attendanceRecords,
  disciplineRecords,
  schedule,
  classInfo,
  documents = [],
  onNavigateTab,
  onSelectStudent,
}) => {
  // Compute overall stats
  const maleCount = students.filter((s) => s.gender === 'Nam').length;
  const femaleCount = students.filter((s) => s.gender === 'Nữ').length;

  // Student GPAs & Conduct
  const studentGPAList = students.map((st) => {
    const gpa = calculateStudentOverallGPA(st.id, scores, subjects);
    const rating = getAcademicRating(gpa);

    // Attendance rate
    let totalSessions = 0;
    let presentSessions = 0;
    let absentSessions = 0;
    let lateSessions = 0;
    if (Array.isArray(attendanceRecords)) {
      attendanceRecords.forEach((rec) => {
        if (rec && rec.studentId === st.id) {
          totalSessions++;
          if (rec.status === 'present') presentSessions++;
          else if (rec.status === 'late') lateSessions++;
          else absentSessions++;
        }
      });
    }
    const attRate =
      totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 100;

    return {
      student: st,
      gpa,
      rating,
      attRate,
      absentSessions,
      lateSessions,
      conductScore: st.conductScore,
    };
  });

  const validGpas = studentGPAList.filter((s) => s.gpa !== null).map((s) => s.gpa as number);
  const classAvgGpa =
    validGpas.length > 0
      ? Math.round((validGpas.reduce((a, b) => a + b, 0) / validGpas.length) * 10) / 10
      : null;

  const avgConduct =
    students.length > 0
      ? Math.round(
          (students.reduce((acc, st) => acc + st.conductScore, 0) / students.length) * 10
        ) / 10
      : 100;

  // Rating distribution
  const ratingDistribution = {
    'Xuất sắc': studentGPAList.filter((s) => s.rating === 'Xuất sắc').length,
    'Giỏi': studentGPAList.filter((s) => s.rating === 'Giỏi').length,
    'Khá': studentGPAList.filter((s) => s.rating === 'Khá').length,
    'Trung bình': studentGPAList.filter((s) => s.rating === 'Trung bình').length,
    'Yếu': studentGPAList.filter((s) => s.rating === 'Yếu').length,
  };

  // Overall attendance rate
  const totalAttRates = studentGPAList.map((s) => s.attRate);
  const avgAttendance =
    totalAttRates.length > 0
      ? Math.round(totalAttRates.reduce((a, b) => a + b, 0) / totalAttRates.length)
      : 100;

  // At-risk students
  const atRiskStudents = studentGPAList.filter(
    (s) =>
      (s.gpa !== null && s.gpa < 6.5) ||
      s.conductScore < 80 ||
      s.absentSessions >= 1 ||
      s.lateSessions >= 2
  );

  // Top performers
  const topStudents = [...studentGPAList]
    .filter((s) => s.gpa !== null)
    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0))
    .slice(0, 4);

  // Today's schedule
  const currentDay = Math.min(Math.max(new Date().getDay() + 1, 2), 7) as
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7;
  const todaySchedule = schedule
    .filter((s) => s.dayOfWeek === currentDay)
    .sort((a, b) => a.period - b.period);

  const getDayName = (d: number) => {
    switch (d) {
      case 2:
        return 'Thứ Hai';
      case 3:
        return 'Thứ Ba';
      case 4:
        return 'Thứ Tư';
      case 5:
        return 'Thứ Năm';
      case 6:
        return 'Thứ Sáu';
      case 7:
        return 'Thứ Bảy';
      default:
        return 'Chủ Nhật';
    }
  };

  // Total documents uploaded
  const totalDocsCount = Array.isArray(documents) ? documents.length : 0;

  return (
    <div className="space-y-6">
      {/* 4 Key Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sĩ số */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sĩ Số Sinh Viên
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500">sinh viên</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Nam: <strong className="text-slate-800">{maleCount}</strong>
            </span>
            <span>•</span>
            <span>
              Nữ: <strong className="text-slate-800">{femaleCount}</strong>
            </span>
            <span>•</span>
            <span>
              Tổ: <strong className="text-slate-800">4 tổ</strong>
            </span>
          </div>
        </div>

        {/* Điểm TB 9 Môn */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ĐTB 9 Môn Học
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {classAvgGpa !== null ? classAvgGpa.toFixed(1) : '--'}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              {classAvgGpa !== null ? getAcademicRating(classAvgGpa) : 'Chưa đủ điểm'}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>9 môn chuyên ngành du lịch</span>
          </div>
        </div>

        {/* Đánh giá nề nếp & rèn luyện */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Điểm Nề Nếp Trung Bình
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgConduct}</span>
            <span className="text-xs text-slate-500">/ 100 điểm</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>{disciplineRecords.length} lượt đánh giá</span>
            <button
              onClick={() => onNavigateTab('discipline')}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Xem nề nếp
            </button>
          </div>
        </div>

        {/* Tài liệu & Chuyên cần */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tài Liệu & Tiến Độ
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalDocsCount}</span>
            <span className="text-xs text-slate-500">tài liệu đã tải lên</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>9 môn giảng dạy</span>
            <button
              onClick={() => onNavigateTab('subjects')}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Môn học & Tài liệu
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Academic Distribution & Today's Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phân bố Học lực (2 columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Phân Phối Học Lực Của Lớp</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Đánh giá theo chuẩn đào tạo nghề Khách sạn - Nhà hàng & Du lịch
              </p>
            </div>
            <button
              id="btn-goto-gradebook"
              onClick={() => onNavigateTab('gradebook')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <span>Vào Sổ Điểm 9 Môn</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              {
                label: 'Xuất sắc',
                count: ratingDistribution['Xuất sắc'],
                color: 'bg-emerald-500',
              },
              {
                label: 'Giỏi',
                count: ratingDistribution['Giỏi'],
                color: 'bg-blue-500',
              },
              {
                label: 'Khá',
                count: ratingDistribution['Khá'],
                color: 'bg-indigo-500',
              },
              {
                label: 'Trung bình',
                count: ratingDistribution['Trung bình'],
                color: 'bg-amber-500',
              },
              {
                label: 'Yếu',
                count: ratingDistribution['Yếu'],
                color: 'bg-rose-500',
              },
            ].map((item) => {
              const percent =
                students.length > 0 ? Math.round((item.count / students.length) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </span>
                    <span className="text-slate-500">
                      <strong className="text-slate-900">{item.count}</strong> sinh viên ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick subjects overview badges */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                3 Môn học đang học kỳ này:
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Đang diễn ra
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {subjects
                .filter((sub) => sub.status === 'in_progress')
                .map((sub) => {
                  const subDocCount = Array.isArray(documents)
                    ? documents.filter((d) => d.subjectId === sub.id).length
                    : 0;
                  return (
                    <span
                      key={sub.id}
                      onClick={() => onNavigateTab('subjects')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {sub.name} ({sub.teacherName.split(' ').slice(-2).join(' ')})
                    </span>
                  );
                })}
            </div>

            <span className="text-[11px] text-slate-400 block mb-1.5">
              Các môn còn lại (sẽ học sau):
            </span>
            <div className="flex flex-wrap gap-1">
              {subjects
                .filter((sub) => sub.status !== 'in_progress')
                .map((sub) => (
                  <span
                    key={sub.id}
                    onClick={() => onNavigateTab('subjects')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    {sub.name}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Lịch học hôm nay */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Lịch Học {getDayName(currentDay)}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Buổi Chiều (13h30 - 17h)
              </span>
            </div>

            {todaySchedule.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Hôm nay không có tiết học nào.
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaySchedule.map((item) => {
                  const subject = subjects.find((s) => s.id === item.subjectId);
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            {item.period}
                          </span>
                          {subject?.name || 'Môn học'}
                          {PERIOD_TIMES[item.period] && (
                            <span className="text-[10px] text-slate-400 font-mono font-normal">
                              ({PERIOD_TIMES[item.period]})
                            </span>
                          )}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.room}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {item.lessonContent || 'Nội dung thực hành/lý thuyết theo đề cương'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">GV: {item.teacher}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            id="btn-goto-schedule"
            onClick={() => onNavigateTab('schedule')}
            className="w-full mt-4 py-2 text-xs font-semibold text-center text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            Xem Thời Khóa Biểu Cả Tuần
          </button>
        </div>
      </div>

      {/* Bottom Section: At-risk attention & Top Achievers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cảnh báo học sinh cần lưu ý nề nếp / học tập */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Sinh Viên Cần Lưu Ý Nề Nếp & Chuyên Cần
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {atRiskStudents.length} sinh viên
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Sinh viên có vi phạm nề nếp (trang phục, điện thoại, giờ giấc) hoặc điểm rèn luyện &lt; 85đ.
          </p>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {atRiskStudents.map((item) => (
              <div
                key={item.student.id}
                onClick={() => onSelectStudent(item.student)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${item.student.avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                  >
                    {item.student.name.slice(
                      item.student.name.lastIndexOf(' ') + 1,
                      item.student.name.lastIndexOf(' ') + 2
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {item.student.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({item.student.studentCode} • {item.student.group})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-indigo-700 font-semibold">
                        Nề nếp: {item.conductScore}đ
                      </span>
                      <span>•</span>
                      {item.absentSessions > 0 && (
                        <span className="text-rose-600 font-medium">
                          Vắng {item.absentSessions} buổi
                        </span>
                      )}
                      {item.lateSessions > 0 && (
                        <span className="text-amber-600">
                          Đi muộn {item.lateSessions} lần
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    ĐTB: {item.gpa !== null ? item.gpa.toFixed(1) : '--'}
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      getAcademicRatingColor(item.rating).bg
                    }`}
                  >
                    {item.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Học sinh tiêu biểu */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Sinh Viên Tiêu Biểu & Gương Mẫu</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Top thành tích
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Sinh viên đạt kết quả học tập xuất sắc, tác phong nghề nghiệp chuẩn mực.
          </p>

          <div className="divide-y divide-slate-100">
            {topStudents.map((item, idx) => (
              <div
                key={item.student.id}
                onClick={() => onSelectStudent(item.student)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.student.name}</span>
                      <span className="text-[11px] text-slate-400">
                        ({item.student.studentCode})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.student.group} • Nề nếp: <strong>{item.conductScore}đ</strong> • Chuyên cần:{' '}
                      <strong className="text-emerald-600">{item.attRate}%</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-indigo-700">
                    {item.gpa !== null ? item.gpa.toFixed(1) : '--'}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('students')}
            className="w-full mt-4 py-2 text-xs font-semibold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Xem Toàn Bộ Danh Sách Sinh Viên
          </button>
        </div>
      </div>
    </div>
  );
};
