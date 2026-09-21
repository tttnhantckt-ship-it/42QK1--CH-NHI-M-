import React, { useState, useEffect } from 'react';
import { X, CalendarDays, Coffee, Trash2, Zap, Users, Sparkles, FileText } from 'lucide-react';
import { ScheduleItem, Subject } from '../types';

interface ScheduleEditModalProps {
  isOpen: boolean;
  itemToEdit: ScheduleItem | null;
  initialDay?: 2 | 3 | 4 | 5 | 6 | 7;
  initialPeriod?: number;
  subjects: Subject[];
  onClose: () => void;
  onSave: (item: Omit<ScheduleItem, 'id'>, itemId?: string) => void;
  onDelete?: (itemId: string) => void;
  onSetDayOff?: (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7, note?: string) => void;
}

export const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({
  isOpen,
  itemToEdit,
  initialDay,
  initialPeriod,
  subjects,
  onClose,
  onSave,
  onDelete,
  onSetDayOff,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<2 | 3 | 4 | 5 | 6 | 7>(2);
  const [period, setPeriod] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [room, setRoom] = useState<string>('P.204');
  const [teacher, setTeacher] = useState<string>('');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isDayOff, setIsDayOff] = useState<boolean>(false);

  useEffect(() => {
    if (itemToEdit) {
      setDayOfWeek(itemToEdit.dayOfWeek);
      setPeriod(itemToEdit.period);
      const isOff = itemToEdit.subjectId === 'sub_off' || !!itemToEdit.isDayOff;
      setIsDayOff(isOff);
      setSubjectId(itemToEdit.subjectId);
      setRoom(itemToEdit.room);
      setTeacher(itemToEdit.teacher);
      setLessonContent(itemToEdit.lessonContent || (isOff ? 'Nghỉ học theo kế hoạch đào tạo' : ''));
    } else {
      setDayOfWeek(initialDay || 2);
      setPeriod(initialPeriod || 1);
      setIsDayOff(false);
      const firstSub = subjects[0];
      setSubjectId(firstSub?.id || '');
      setRoom(firstSub?.roomDefault || 'P.204');
      setTeacher(firstSub?.teacherName || '');
      setLessonContent('');
    }
  }, [itemToEdit, initialDay, initialPeriod, subjects, isOpen]);

  // When toggling day off status
  const handleToggleDayOff = (checked: boolean) => {
    setIsDayOff(checked);
    if (checked) {
      setSubjectId('sub_off');
      setRoom('Nghỉ');
      setTeacher('Không có tiết');
      if (!lessonContent) {
        setLessonContent('Nghỉ học theo kế hoạch đào tạo');
      }
    } else {
      const firstSub = subjects.find((s) => s.id !== 'sub_off') || subjects[0];
      setSubjectId(firstSub?.id || '');
      setRoom(firstSub?.roomDefault || 'P.204');
      setTeacher(firstSub?.teacherName || '');
      setLessonContent('');
    }
  };

  // Quick action: Set this slot as Homeroom / Class Meeting (Sinh hoạt lớp - Giáo viên nhập sau)
  const handleApplyClassMeeting = () => {
    setIsDayOff(false);
    setSubjectId('sub_shl');
    setTeacher('ThS. Trịnh Thị Thanh Nhàn (GVCN)');
    setRoom('P.204 - Lớp 42QK1');
    setLessonContent('Sinh hoạt lớp định kỳ (Giáo viên nhập sau)');
  };

  // When subject changes in add mode, auto-fill teacher name if empty
  const handleSubjectChange = (newSubId: string) => {
    setSubjectId(newSubId);
    if (newSubId === 'sub_off') {
      setIsDayOff(true);
      setRoom('Nghỉ');
      setTeacher('Không có tiết');
      if (!lessonContent) setLessonContent('Nghỉ học theo kế hoạch đào tạo');
      return;
    }

    setIsDayOff(false);
    if (newSubId === 'sub_shl') {
      setTeacher('ThS. Trịnh Thị Thanh Nhàn (GVCN)');
      setRoom('P.204 - Lớp 42QK1');
      if (!lessonContent || lessonContent.includes('Nghỉ')) {
        setLessonContent('Sinh hoạt lớp định kỳ (Giáo viên nhập sau)');
      }
      return;
    }

    const sub = subjects.find((s) => s.id === newSubId);
    if (sub) {
      setTeacher(sub.teacherName);
      setRoom(sub.roomDefault);
    }
  };

  const handleApplyDayOffFull = () => {
    if (onSetDayOff) {
      onSetDayOff(dayOfWeek, lessonContent.trim() || 'Nghỉ học theo kế hoạch đào tạo');
      onClose();
    } else {
      handleToggleDayOff(true);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSHL = subjectId === 'sub_shl' || subjectId.includes('shl');
    onSave(
      {
        dayOfWeek,
        period,
        subjectId: isDayOff ? 'sub_off' : subjectId,
        room: isDayOff ? 'Nghỉ' : room.trim() || 'P.204',
        teacher: isDayOff
          ? 'Không có tiết'
          : teacher.trim() || (isSHL ? 'ThS. Trịnh Thị Thanh Nhàn (GVCN)' : 'Giáo viên bộ môn'),
        lessonContent:
          lessonContent.trim() ||
          (isDayOff
            ? 'Nghỉ học'
            : isSHL
            ? 'Sinh hoạt lớp định kỳ (Giáo viên nhập sau)'
            : undefined),
        isDayOff,
        isClassMeeting: isSHL,
      },
      itemToEdit?.id
    );
    onClose();
  };

  const dayLabelMap: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              {itemToEdit ? 'Chỉnh Sửa Tiết Thời Khóa Biểu' : 'Thêm Tiết Học Mới'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Quick preset for Sinh hoạt lớp */}
          <div className="p-3 bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 border border-violet-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-violet-900 flex items-center gap-1.5 text-xs">
                <Users className="w-4 h-4 text-violet-600" />
                Tiết Sinh Hoạt Lớp (GVCN)
              </span>
              <button
                type="button"
                onClick={handleApplyClassMeeting}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-violet-800 bg-white hover:bg-violet-100/90 border border-violet-300 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Chọn Nhanh: Tiết Sinh Hoạt Lớp (GV nhập sau)</span>
              </button>
            </div>
            <p className="text-[11px] text-violet-700/90 leading-tight">
              Tự động chọn môn <strong className="text-violet-900">Sinh hoạt lớp</strong>, GVCN <strong className="text-violet-900">ThS. Trịnh Thị Thanh Nhàn</strong>, phòng <strong className="text-violet-900">P.204</strong> và đặt ghi chú <span className="underline italic">"Giáo viên nhập sau"</span>.
            </p>
          </div>

          {/* Day-off Switch & Fast actions */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isDayOff}
                  onChange={(e) => handleToggleDayOff(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  Đánh dấu tiết này là NGHỈ HỌC
                </span>
              </label>

              {isDayOff && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  Nghỉ
                </span>
              )}
            </div>

            {/* Set entire day off button */}
            {onSetDayOff && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Đặt nghỉ cho cả ngày:</span>
                <button
                  type="button"
                  onClick={handleApplyDayOffFull}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>Đặt NGHỈ cả {dayLabelMap[dayOfWeek]} (4 tiết)</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Thứ trong tuần */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thứ</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value) as 2 | 3 | 4 | 5 | 6 | 7)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={2}>Thứ Hai</option>
                <option value={3}>Thứ Ba</option>
                <option value={4}>Thứ Tư</option>
                <option value={5}>Thứ Năm</option>
                <option value={6}>Thứ Sáu</option>
                <option value={7}>Thứ Bảy</option>
              </select>
            </div>

            {/* Tiết học */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiết số</label>
              <select
                value={period}
                onChange={(e) => setPeriod(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={1}>Tiết 1 (13:30 - 14:15)</option>
                <option value={2}>Tiết 2 (14:25 - 15:10)</option>
                <option value={3}>Tiết 3 (15:25 - 16:10)</option>
                <option value={4}>Tiết 4 (16:15 - 17:00)</option>
              </select>
            </div>

            {/* Môn học */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học / Hoạt động <span className="text-rose-500">*</span>
              </label>
              <select
                value={isDayOff ? 'sub_off' : subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="sub_off">💤 [NGHỈ HỌC] - Không có tiết / Buổi nghỉ</option>
                <option value="sub_shl">✨ [SINH HOẠT LỚP] - ThS. Trịnh Thị Thanh Nhàn (GV nhập sau)</option>
                {subjects
                  .filter((sub) => sub.id !== 'sub_off' && sub.id !== 'sub_shl')
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} (GV: {sub.teacherName})
                    </option>
                  ))}
              </select>
            </div>

            {/* Phòng học */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng học</label>
              <input
                type="text"
                disabled={isDayOff}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="VD: P.204"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Giáo viên */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giáo viên</label>
              <input
                type="text"
                disabled={isDayOff}
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="VD: ThS. Trịnh Thị Thanh Nhàn"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Nội dung bài học */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isDayOff ? 'Lý do / Ghi chú ngày nghỉ' : 'Nội dung bài dạy / Ghi chú sinh hoạt'}
                </label>
                {!isDayOff && (
                  <button
                    type="button"
                    onClick={() => setLessonContent('Sinh hoạt lớp định kỳ (Giáo viên nhập sau)')}
                    className="text-[11px] font-medium text-violet-700 hover:text-violet-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Điền: "Giáo viên nhập sau"</span>
                  </button>
                )}
              </div>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                rows={2}
                placeholder={
                  isDayOff
                    ? 'VD: Nghỉ theo kế hoạch đào tạo / Nghỉ tự ôn tập...'
                    : 'VD: Sinh hoạt lớp (Giáo viên nhập sau) / Sơ kết tuần...'
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {itemToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(itemToEdit.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tiết này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {itemToEdit ? 'Lưu Thay Đổi' : 'Thêm Tiết Học'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
