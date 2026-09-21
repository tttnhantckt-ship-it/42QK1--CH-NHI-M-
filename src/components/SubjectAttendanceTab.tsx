import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Users,
  Search,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Student, Subject, SubjectAttendanceRecord, AttendanceStatus } from '../types';

interface SubjectAttendanceTabProps {
  students: Student[];
  subjects: Subject[];
  attendanceRecords: SubjectAttendanceRecord[];
  onSaveAttendanceBatch: (newRecords: SubjectAttendanceRecord[]) => void;
}

export const SubjectAttendanceTab: React.FC<SubjectAttendanceTabProps> = ({
  students,
  subjects,
  attendanceRecords,
  onSaveAttendanceBatch,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_tour');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'daily' | 'stats'>('daily');

  // Local draft state for current session
  const [currentSessionMap, setCurrentSessionMap] = useState<
    Record<string, { status: AttendanceStatus; reason?: string }>
  >({});
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Initialize or update draft whenever subject, date, or period changes
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Helper to load records for current session
  const getExistingSessionRecords = () => {
    const map: Record<string, { status: AttendanceStatus; reason?: string }> = {};

    students.forEach((s) => {
      const match = Array.isArray(attendanceRecords)
        ? attendanceRecords.find(
            (r) =>
              r &&
              r.subjectId === selectedSubjectId &&
              r.date === selectedDate &&
              r.period === selectedPeriod &&
              r.studentId === s.id
          )
        : undefined;

      if (match) {
        map[s.id] = { status: match.status, reason: match.reason };
      } else {
        map[s.id] = { status: 'present', reason: undefined };
      }
    });
    return map;
  };

  // Sync draft when parameters change
  React.useEffect(() => {
    setCurrentSessionMap(getExistingSessionRecords());
    setIsSavedNotice(false);
  }, [selectedSubjectId, selectedDate, selectedPeriod, attendanceRecords, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentSessionMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
    setIsSavedNotice(false);
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setCurrentSessionMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], reason },
    }));
    setIsSavedNotice(false);
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; reason?: string }> = {};
    students.forEach((s) => {
      updated[s.id] = { status: 'present', reason: undefined };
    });
    setCurrentSessionMap(updated);
    setIsSavedNotice(false);
  };

  const handleSaveAttendance = () => {
    const batch: SubjectAttendanceRecord[] = students.map((s) => ({
      id: `att_${selectedDate}_${selectedSubjectId}_p${selectedPeriod}_${s.id}`,
      subjectId: selectedSubjectId,
      date: selectedDate,
      period: selectedPeriod,
      studentId: s.id,
      status: currentSessionMap[s.id]?.status || 'present',
      reason: currentSessionMap[s.id]?.reason,
    }));

    onSaveAttendanceBatch(batch);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Quick statistics for current session
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.studentCode.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q)
    );
  });

  const sessionStatuses: { status: AttendanceStatus; reason?: string }[] = Object.values(currentSessionMap);
  const presentCount = sessionStatuses.filter((s) => s.status === 'present').length;
  const lateCount = sessionStatuses.filter((s) => s.status === 'late').length;
  const excusedCount = sessionStatuses.filter((s) => s.status === 'absent_excused').length;
  const unexcusedCount = sessionStatuses.filter((s) => s.status === 'absent_unexcused').length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-indigo-600" />
              <span>Điểm Danh Theo Từng Môn Học Chuyên Ngành</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn môn học, ngày và tiết học để theo dõi chuyên cần, phát hiện sinh viên vắng quá số tiết quy định
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveView('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeView === 'daily'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điểm Danh Buổi Học
            </button>
            <button
              type="button"
              onClick={() => setActiveView('stats')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeView === 'stats'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thống Kê Chuyên Cần 9 Môn
            </button>
          </div>
        </div>

        {activeView === 'daily' && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Môn học điểm danh
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-indigo-50/60 border border-indigo-200 text-indigo-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ngày học
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Period Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ca / Tiết học
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Tiết 1 (13:30 - 14:15)</option>
                <option value={2}>Tiết 2 (14:25 - 15:10)</option>
                <option value={3}>Tiết 3 (15:25 - 16:10)</option>
                <option value={4}>Tiết 4 (16:15 - 17:00)</option>
                <option value={12}>Tiết 1 - 2 (13:30 - 15:10)</option>
                <option value={34}>Tiết 3 - 4 (15:25 - 17:00)</option>
              </select>
            </div>

            {/* Teacher Info */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Giảng viên & Phòng:</span>
              <span className="text-xs font-bold text-slate-800 truncate">{activeSubject.teacherName}</span>
              <span className="text-[11px] text-slate-600 truncate">{activeSubject.roomDefault}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeView === 'daily' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Quick Metrics Bar & Actions */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-medium">
              <span className="text-slate-500">Sĩ số: <strong>{students.length}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3 w-3" /> Có mặt: {presentCount}
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                <Clock className="h-3 w-3" /> Muộn: {lateCount}
              </span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                <AlertCircle className="h-3 w-3" /> Phép: {excusedCount}
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                <XCircle className="h-3 w-3" /> Không phép: {unexcusedCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Đánh dấu tất cả có mặt
              </button>

              <button
                type="button"
                id="btn-save-attendance"
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Lưu Điểm Danh Môn</span>
              </button>
            </div>
          </div>

          {isSavedNotice && (
            <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Đã lưu thành công dữ liệu điểm danh môn {activeSubject.name} ngày {selectedDate}!</span>
            </div>
          )}

          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 bg-white flex items-center">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh sinh viên theo tên, mã SV, hoặc tổ..."
              className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
            />
          </div>

          {/* Students Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left w-12">STT</th>
                  <th scope="col" className="px-4 py-3 text-left">Mã SV</th>
                  <th scope="col" className="px-4 py-3 text-left">Họ và tên</th>
                  <th scope="col" className="px-4 py-3 text-left">Tổ / Nhóm</th>
                  <th scope="col" className="px-4 py-3 text-center w-72">Trạng thái điểm danh</th>
                  <th scope="col" className="px-4 py-3 text-left">Ghi chú / Lý do vắng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Chưa có sinh viên nào. Vui lòng thêm hoặc nhập danh sách học sinh.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const session = currentSessionMap[st.id] || { status: 'present' };

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800">{st.studentCode}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{st.name}</td>
                        <td className="px-4 py-3 text-slate-600">{st.group}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'present')}
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                session.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'late')}
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                session.status === 'late'
                                  ? 'bg-amber-500 text-white shadow-2xs font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Muộn
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'absent_excused')}
                              className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                session.status === 'absent_excused'
                                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Có phép
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'absent_unexcused')}
                              className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                session.status === 'absent_unexcused'
                                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Không phép
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={session.reason || ''}
                            onChange={(e) => handleReasonChange(st.id, e.target.value)}
                            placeholder="Ghi chú lý do đi muộn, đơn xin phép..."
                            className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Statistics View: Attendance rate per subject */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Bảng Tổng Kết Chuyên Cần Theo Từng Môn Học
            </h3>
            <p className="text-xs text-slate-500">
              Sinh viên vắng quá 20% tổng số tiết của môn học sẽ không đủ điều kiện dự thi kết thúc học phần
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-left">Sinh viên</th>
                  {subjects.map((sub) => (
                    <th key={sub.id} className="px-2 py-2.5 text-center whitespace-nowrap">
                      <div className="font-bold text-[11px]">{sub.code}</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-[80px]">
                        {sub.name}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center font-bold">Chuyên cần chung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {students.map((st) => {
                  let totalAllSubs = 0;
                  let presentAllSubs = 0;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-slate-900">{st.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{st.studentCode}</div>
                      </td>

                      {subjects.map((sub) => {
                        const subRecords = attendanceRecords.filter(
                          (r) => r.studentId === st.id && r.subjectId === sub.id
                        );
                        if (subRecords.length === 0) {
                          return (
                            <td key={sub.id} className="px-2 py-2.5 text-center text-slate-400 text-[11px]">
                              100%
                            </td>
                          );
                        }

                        const pCount = subRecords.filter((r) => r.status === 'present').length;
                        const lCount = subRecords.filter((r) => r.status === 'late').length;
                        const rate = Math.round(((pCount + lCount * 0.5) / subRecords.length) * 100);

                        totalAllSubs += subRecords.length;
                        presentAllSubs += pCount + lCount * 0.5;

                        return (
                          <td key={sub.id} className="px-2 py-2.5 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                rate >= 90
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : rate >= 80
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-rose-50 text-rose-700 font-extrabold'
                              }`}
                            >
                              {rate}%
                            </span>
                          </td>
                        );
                      })}

                      <td className="px-3 py-2.5 text-center font-bold">
                        {totalAllSubs > 0
                          ? `${Math.round((presentAllSubs / totalAllSubs) * 100)}%`
                          : '100%'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
