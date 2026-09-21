import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  UploadCloud,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ExternalLink,
  Coffee,
  Users,
} from 'lucide-react';
import { Subject, ScheduleItem, WeeklyScheduleDoc } from '../types';

interface ScheduleTabProps {
  schedule: ScheduleItem[];
  subjects: Subject[];
  weeklyDocs: WeeklyScheduleDoc[];
  onAddScheduleItem: () => void;
  onAddScheduleSlot?: (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7, period: number) => void;
  onEditScheduleItem: (item: ScheduleItem) => void;
  onDeleteScheduleItem: (itemId: string) => void;
  onToggleDayOff?: (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7) => void;
  onOpenUploadWeeklyModal: (weekNum: number) => void;
  onDeleteWeeklyDoc: (docId: string) => void;
}

export const PERIOD_TIMES: Record<number, string> = {
  1: '13:30 - 14:15',
  2: '14:25 - 15:10',
  3: '15:25 - 16:10',
  4: '16:15 - 17:00',
};

const DAYS: { value: 2 | 3 | 4 | 5 | 6 | 7; label: string; short: string }[] = [
  { value: 2, label: 'Thứ Hai', short: 'T2' },
  { value: 3, label: 'Thứ Ba', short: 'T3' },
  { value: 4, label: 'Thứ Tư', short: 'T4' },
  { value: 5, label: 'Thứ Năm', short: 'T5' },
  { value: 6, label: 'Thứ Sáu', short: 'T6' },
  { value: 7, label: 'Thứ Bảy', short: 'T7' },
];

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  schedule,
  subjects,
  weeklyDocs,
  onAddScheduleItem,
  onAddScheduleSlot,
  onEditScheduleItem,
  onDeleteScheduleItem,
  onToggleDayOff,
  onOpenUploadWeeklyModal,
  onDeleteWeeklyDoc,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<2 | 3 | 4 | 5 | 6 | 7>(2);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const currentRealDay = (new Date().getDay() + 1) as number;

  const currentWeeklyDoc = weeklyDocs.find((doc) => doc.weekNumber === selectedWeek);

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId);
  };

  const getSubjectColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50/90 text-blue-900 border-blue-200 hover:border-blue-300';
      case 'rose': return 'bg-rose-50/90 text-rose-900 border-rose-200 hover:border-rose-300';
      case 'emerald': return 'bg-emerald-50/90 text-emerald-900 border-emerald-200 hover:border-emerald-300';
      case 'indigo': return 'bg-indigo-50/90 text-indigo-900 border-indigo-200 hover:border-indigo-300';
      case 'amber': return 'bg-amber-50/90 text-amber-900 border-amber-200 hover:border-amber-300';
      case 'teal': return 'bg-teal-50/90 text-teal-900 border-teal-200 hover:border-teal-300';
      case 'orange': return 'bg-orange-50/90 text-orange-900 border-orange-200 hover:border-orange-300';
      case 'cyan': return 'bg-cyan-50/90 text-cyan-900 border-cyan-200 hover:border-cyan-300';
      case 'violet': return 'bg-violet-50/90 text-violet-900 border-violet-200 hover:border-violet-300';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const daySchedule = schedule
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.period - b.period);

  const isSelectedDayAllOff =
    daySchedule.length > 0 &&
    daySchedule.every((s) => s.subjectId === 'sub_off' || !!s.isDayOff);

  const handleDownloadDoc = (doc: WeeklyScheduleDoc) => {
    // Generate a downloadable text or mock file
    const content = `TRƯỜNG TRUNG CẤP KINH TẾ KHÁNH HOÀ\nLỚP: 42QK1 - QUẢN LÝ VÀ KINH DOANH DU LỊCH\nGVCN: ThS. Trịnh Thị Thanh Nhàn\n${doc.weekLabel}\n\nDANH SÁCH MÔN ĐANG HỌC:\n1. Thiết kế và điều hành tour - GV: Cô Trịnh Thị Thanh Nhàn\n2. Quản trị Kinh doanh nhà hàng - khách sạn - GV: Thầy Mai Anh Tuấn\n3. Quản trị lễ tân - GV: Cô Nguyễn Thị Hạnh\n\n(File đính kèm: ${doc.fileName})`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `TKB_Tuan_${doc.weekNumber}_42QK1.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 3 Active Subjects Notification Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Lớp 42QK1 • Khóa 42
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                3 Môn Học Đang Diễn Ra
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              <strong className="text-emerald-900">Thiết kế & điều hành tour</strong> (Cô Trịnh Thị Thanh Nhàn) •{' '}
              <strong className="text-indigo-900">Quản trị KD nhà hàng - khách sạn</strong> (Thầy Mai Anh Tuấn) •{' '}
              <strong className="text-blue-900">Quản trị lễ tân</strong> (Cô Nguyễn Thị Hạnh).
              <span className="text-slate-500 italic ml-1">Các môn còn lại sẽ học sau.</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenUploadWeeklyModal(selectedWeek)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-xs shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Tải Lên Lịch Học Tuần {selectedWeek}</span>
        </button>
      </div>

      {/* Week Selector & Upload Management Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={selectedWeek <= 1}
              onClick={() => setSelectedWeek((prev) => Math.max(1, prev - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Chọn tuần:</span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((w) => {
                  const hasDoc = weeklyDocs.some((d) => d.weekNumber === w);
                  return (
                    <option key={w} value={w}>
                      Tuần {w} {hasDoc ? '✓ (Đã có file)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="button"
              disabled={selectedWeek >= 20}
              onClick={() => setSelectedWeek((prev) => Math.min(20, prev + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Tuần sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Week Pills shortcut */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((w) => {
                const isSelected = selectedWeek === w;
                const hasDoc = weeklyDocs.some((d) => d.weekNumber === w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWeek(w)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    T{w} {hasDoc && '•'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View switcher & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thời Khóa Biểu Tuần
              </button>
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'day'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chi Tiết Theo Ngày
              </button>
            </div>

            <button
              type="button"
              id="btn-add-class-meeting"
              onClick={() => {
                const existingSHL = schedule.find(
                  (s) => s.subjectId === 'sub_shl' || s.isClassMeeting
                );
                if (existingSHL) {
                  onEditScheduleItem(existingSHL);
                } else if (onAddScheduleSlot) {
                  onAddScheduleSlot(7, 4);
                } else {
                  onAddScheduleItem();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Xem hoặc bổ sung tiết Sinh hoạt lớp (GV nhập sau)"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>Tiết Sinh Hoạt Lớp (GV nhập sau)</span>
            </button>

            <button
              type="button"
              id="btn-add-schedule-item"
              onClick={onAddScheduleItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm Tiết / Đặt Nghỉ</span>
            </button>
          </div>
        </div>

        {/* Days Status Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-600 text-[11px]">Trạng thái các buổi học:</span>
            {DAYS.map((d) => {
              const dayItems = schedule.filter((s) => s.dayOfWeek === d.value);
              const isOff =
                dayItems.length > 0 &&
                dayItems.every((s) => s.subjectId === 'sub_off' || s.isDayOff);
              const hasSHL = dayItems.some(
                (s) => s.subjectId === 'sub_shl' || s.isClassMeeting
              );
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => onToggleDayOff && onToggleDayOff(d.value)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                    isOff
                      ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      : hasSHL
                      ? 'bg-violet-50 text-violet-800 border-violet-300 hover:bg-violet-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={`Nhấp để đổi trạng thái học/nghỉ ngày ${d.label}`}
                >
                  {isOff ? (
                    <>
                      <Coffee className="w-3 h-3 text-amber-600" />
                      <span>{d.short}: Nghỉ</span>
                    </>
                  ) : hasSHL ? (
                    <>
                      <Users className="w-3 h-3 text-violet-600" />
                      <span>{d.short}: Có SHL</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{d.short}: Có lịch</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400 italic">
            * Nhấp vào thứ trong tuần để bật/tắt ngày nghỉ nhanh
          </span>
        </div>

        {/* Uploaded Weekly Document Banner for Selected Week */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {currentWeeklyDoc ? (
            <div className="p-3 bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {currentWeeklyDoc.fileName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {currentWeeklyDoc.fileSize}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Đăng tải: {currentWeeklyDoc.uploadedAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentWeeklyDoc.description || `Lịch học chính thức ${currentWeeklyDoc.weekLabel}`} • Đăng bởi: <span className="font-semibold text-slate-700">{currentWeeklyDoc.uploadedBy}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(currentWeeklyDoc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File TKB</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenUploadWeeklyModal(selectedWeek)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Thay thế file khác"
                >
                  Đổi file
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteWeeklyDoc(currentWeeklyDoc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Xóa file này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50/60 border border-dashed border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Tuần {selectedWeek}</strong> chưa có tệp lịch học đính kèm. ThS. Trịnh Thị Thanh Nhàn có thể tải lên file thời khóa biểu tuần mới cho lớp.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenUploadWeeklyModal(selectedWeek)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shrink-0 shadow-2xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Tải Tệp Tuần {selectedWeek}</span>
              </button>
            </div>
          )}
        </div>

        {/* Day selector if day mode */}
        {viewMode === 'day' && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1 no-scrollbar">
            {DAYS.map((d) => {
              const isSelected = selectedDay === d.value;
              const isToday = currentRealDay === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => setSelectedDay(d.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <span>{d.label}</span>
                  {isToday && (
                    <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      Hôm nay
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View Mode: Week Matrix Table */}
      {viewMode === 'week' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900">
                Lịch Học Trực Tiếp Tuần {selectedWeek} • Buổi Chiều (13h30 - 17h00)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                4 Tiết/Buổi • Học 1 Môn/Buổi
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Trường Trung cấp Kinh tế Khánh Hoà • Lớp 42QK1
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-xs text-slate-700 font-semibold">
                  <th className="py-3 px-3 w-28 text-center border-r border-slate-200">Tiết / Giờ</th>
                  {DAYS.map((d) => {
                    const isToday = currentRealDay === d.value;
                    const dayItems = schedule.filter((s) => s.dayOfWeek === d.value);
                    const isOff =
                      dayItems.length > 0 &&
                      dayItems.every((s) => s.subjectId === 'sub_off' || s.isDayOff);

                    return (
                      <th
                        key={d.value}
                        className={`py-2.5 px-3 text-center border-r border-slate-200 last:border-r-0 ${
                          isToday ? 'bg-emerald-50/60 font-bold text-emerald-900' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span>{d.label}</span>
                          {isOff && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                              NGHỈ
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                              Hôm nay
                            </span>
                          )}
                        </div>
                        {onToggleDayOff && (
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() => onToggleDayOff(d.value)}
                              className="text-[10px] text-slate-400 hover:text-indigo-600 font-normal hover:underline cursor-pointer"
                            >
                              {isOff ? 'Xếp lịch học' : 'Đặt ngày nghỉ'}
                            </button>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[1, 2, 3, 4].map((period) => (
                  <tr key={period} className="hover:bg-slate-50/40 transition-colors">
                    {/* Period label */}
                    <td className="py-3 px-2 text-center bg-slate-50/60 border-r border-slate-200">
                      <div className="font-bold text-slate-800">Tiết {period}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {PERIOD_TIMES[period]}
                      </div>
                    </td>

                    {/* Schedule slots for each day */}
                    {DAYS.map((d) => {
                      const item = schedule.find(
                        (s) => s.dayOfWeek === d.value && s.period === period
                      );
                      const isOff = item?.subjectId === 'sub_off' || !!item?.isDayOff;
                      const subject = item && !isOff ? getSubject(item.subjectId) : null;
                      const isToday = currentRealDay === d.value;

                      return (
                        <td
                          key={d.value}
                          className={`p-2 border-r border-slate-200 last:border-r-0 align-top ${
                            isToday ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          {item && isOff ? (
                            /* Day Off Slot */
                            <div
                              onClick={() => onEditScheduleItem(item)}
                              className="p-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-400 text-left cursor-pointer transition-all group shadow-2xs"
                              title="Nhấp để thay đổi hoặc xếp môn học"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-amber-900 flex items-center gap-1">
                                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Nghỉ học</span>
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200">
                                  Nghỉ
                                </span>
                              </div>
                              <p className="text-[11px] mt-1 line-clamp-1 text-slate-600 font-normal">
                                {item.lessonContent || 'Không có lịch học'}
                              </p>
                              <div className="text-[10px] text-amber-700/80 mt-1.5 flex items-center justify-between pt-1 border-t border-amber-200/60">
                                <span className="truncate italic">Theo kế hoạch</span>
                                <span className="opacity-0 group-hover:opacity-100 text-indigo-700 text-[10px] font-bold">
                                  Sửa / Đổi lịch
                                </span>
                              </div>
                            </div>
                          ) : item && (item.subjectId === 'sub_shl' || item.isClassMeeting) ? (
                            /* Class Meeting Slot (Sinh hoạt lớp - GV nhập sau) */
                            <div
                              onClick={() => onEditScheduleItem(item)}
                              className="p-2.5 rounded-xl border border-violet-300 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 hover:border-violet-400 hover:shadow-xs text-left cursor-pointer transition-all group shadow-2xs"
                              title="Nhấp để cập nhật nội dung tiết sinh hoạt lớp"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-violet-950 flex items-center gap-1 line-clamp-1">
                                  <Users className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                                  <span>Sinh hoạt lớp</span>
                                </span>
                                <span className="text-[10px] font-bold text-violet-800 bg-violet-100 px-1.5 py-0.2 rounded border border-violet-200 shrink-0 ml-1">
                                  SHL
                                </span>
                              </div>
                              <div className="text-[11px] mt-1 line-clamp-2 text-violet-900 font-medium">
                                {item.lessonContent && !item.lessonContent.includes('nhập sau') ? (
                                  <span>{item.lessonContent}</span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-white/90 px-1.5 py-0.5 rounded border border-violet-200 text-violet-700 font-bold">
                                    📝 GV nhập sau
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-violet-600 mt-1.5 flex items-center justify-between pt-1 border-t border-violet-200/60">
                                <span className="font-semibold truncate">Cô Trịnh Thị Thanh Nhàn</span>
                                <span className="text-violet-700 text-[10px] font-bold group-hover:underline">
                                  {item.room || 'P.204'} • Sửa
                                </span>
                              </div>
                            </div>
                          ) : item && subject ? (
                            /* Active Subject Slot */
                            <div
                              onClick={() => onEditScheduleItem(item)}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-xs group ${getSubjectColorClasses(
                                subject.color
                              )}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs line-clamp-1">{subject.name}</span>
                                <span className="text-[10px] font-semibold opacity-75 shrink-0 ml-1">{item.room}</span>
                              </div>
                              <p className="text-[11px] mt-1 line-clamp-1 opacity-90 font-normal">
                                {item.lessonContent || 'Theo chương trình đào tạo'}
                              </p>
                              <div className="text-[10px] text-slate-600 mt-1.5 flex items-center justify-between pt-1 border-t border-black/5">
                                <span className="font-medium truncate">{item.teacher}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-emerald-700 text-[10px] font-bold">
                                  Sửa
                                </span>
                              </div>
                            </div>
                          ) : (
                            /* Empty Slot */
                            <div
                              onClick={() =>
                                onAddScheduleSlot
                                  ? onAddScheduleSlot(d.value, period)
                                  : onAddScheduleItem()
                              }
                              className="h-16 rounded-xl border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 text-[11px] cursor-pointer transition-all group p-1"
                              title="Nhấp để thêm tiết học hoặc đặt nghỉ"
                            >
                              <span className="group-hover:hidden text-slate-300 text-base font-light">+</span>
                              <span className="hidden group-hover:inline-flex items-center gap-1 font-semibold text-[11px]">
                                <Plus className="w-3 h-3" /> Thêm / Nghỉ
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Day Detailed View */
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                Lịch học {DAYS.find((d) => d.value === selectedDay)?.label} • Buổi Chiều (13h30 - 17h00)
              </span>
              {isSelectedDayAllOff ? (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-600" />
                  Ngày Nghỉ Học
                </span>
              ) : (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                  4 Tiết • Học 1 Môn
                </span>
              )}
            </div>

            {onToggleDayOff && (
              <button
                type="button"
                onClick={() => onToggleDayOff(selectedDay)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isSelectedDayAllOff
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{isSelectedDayAllOff ? 'Chuyển sang có lịch học' : 'Đặt ngày này nghỉ học'}</span>
              </button>
            )}
          </div>

          {daySchedule.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <p>Chưa có tiết học hoặc thông tin nghỉ nào được xếp cho ngày này.</p>
              <button
                type="button"
                onClick={() => onAddScheduleSlot ? onAddScheduleSlot(selectedDay, 1) : onAddScheduleItem()}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Tiết hoặc Đặt Nghỉ Cho Ngày Này</span>
              </button>
            </div>
          ) : (
            daySchedule.map((item) => {
              const isOff = item.subjectId === 'sub_off' || !!item.isDayOff;
              const subject = !isOff ? getSubject(item.subjectId) : null;

              if (isOff) {
                return (
                  <div
                    key={item.id}
                    className="bg-amber-50/40 rounded-2xl border border-amber-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex flex-col items-center justify-center shrink-0 border border-amber-200">
                        <Coffee className="w-5 h-5 text-amber-700" />
                        <span className="text-[10px] font-bold uppercase mt-0.5">Tiết {item.period}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-amber-950">
                            Nghỉ học (Tiết {item.period})
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                            {PERIOD_TIMES[item.period]}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-200 font-semibold">
                            Ngày nghỉ theo kế hoạch
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 mt-1.5 flex items-start gap-1.5">
                          <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            Ghi chú: <strong>{item.lessonContent || 'Lớp được nghỉ học tiết này.'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onEditScheduleItem(item)}
                        className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                        title="Đổi thành có lịch học hoặc sửa ghi chú"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteScheduleItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tiết"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              const isSHL = item.subjectId === 'sub_shl' || item.isClassMeeting;
              if (isSHL) {
                return (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50/70 rounded-2xl border border-violet-300 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <Users className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-bold uppercase mt-0.5">Tiết {item.period}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-violet-950">
                            Tiết Sinh Hoạt Lớp (GVCN)
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white text-violet-900 font-mono border border-violet-200">
                            {PERIOD_TIMES[item.period]}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-bold border border-violet-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-violet-600" />
                            {item.lessonContent && !item.lessonContent.includes('nhập sau')
                              ? 'Đã có nội dung'
                              : 'Giáo viên nhập sau'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white text-violet-800 font-medium border border-violet-200">
                            <MapPin className="h-3 w-3 text-violet-600" />
                            {item.room || 'P.204 - Lớp 42QK1'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-violet-900 mt-1">
                          <User className="h-3.5 w-3.5 text-violet-500" />
                          <span>
                            Giáo viên chủ nhiệm phụ trách:{' '}
                            <strong className="text-violet-950 font-bold">
                              {item.teacher || 'ThS. Trịnh Thị Thanh Nhàn (GVCN)'}
                            </strong>
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 mt-1.5 flex items-start gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-violet-600 shrink-0 mt-0.5" />
                          <span>
                            Nội dung sinh hoạt:{' '}
                            <strong className="text-violet-900">
                              {item.lessonContent || 'Sinh hoạt lớp định kỳ (Giáo viên nhập sau)'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onEditScheduleItem(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-violet-800 bg-white hover:bg-violet-100 rounded-lg transition-colors border border-violet-300 cursor-pointer shadow-2xs"
                        title="Cập nhật nội dung sinh hoạt lớp"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-violet-600" />
                        <span>Nhập / Sửa nội dung</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteScheduleItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tiết"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center shrink-0 border border-emerald-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Tiết</span>
                      <span className="text-lg font-bold leading-none">{item.period}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">
                          {subject?.name || 'Môn học'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {PERIOD_TIMES[item.period]}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                          <MapPin className="h-3 w-3" />
                          {item.room}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Giảng viên phụ trách: <strong className="text-slate-800">{item.teacher}</strong></span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1.5 flex items-start gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          Nội dung: <strong>{item.lessonContent || 'Chưa cập nhật nội dung bài dạy'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onEditScheduleItem(item)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa tiết"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteScheduleItem(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa tiết"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
