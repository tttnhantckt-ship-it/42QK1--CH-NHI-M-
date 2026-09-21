import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, Clock, Edit2, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Subject } from '../types';

interface ProgressTabProps {
  subjects: Subject[];
  onUpdateSubjectProgress: (
    subjectId: string,
    completedPeriods: number,
    currentLesson: string
  ) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  subjects,
  onUpdateSubjectProgress,
}) => {
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editCompleted, setEditCompleted] = useState<number>(0);
  const [editLesson, setEditLesson] = useState<string>('');

  const handleStartEdit = (sub: Subject) => {
    setEditingSubId(sub.id);
    setEditCompleted(sub.completedPeriods);
    setEditLesson(sub.currentLesson);
  };

  const handleSaveEdit = (subId: string) => {
    onUpdateSubjectProgress(subId, editCompleted, editLesson.trim());
    setEditingSubId(null);
  };

  // Overall statistics
  const totalPeriodsAll = subjects.reduce((acc, s) => acc + s.totalPeriods, 0);
  const completedPeriodsAll = subjects.reduce((acc, s) => acc + s.completedPeriods, 0);
  const overallPercentage = totalPeriodsAll > 0 ? Math.round((completedPeriodsAll / totalPeriodsAll) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Metric Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span>Tiến Độ Giảng Dạy & Kế Hoạch 9 Môn Học Cả Năm</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi phân phối chương trình, số tiết đã hoàn thành, bài giảng hiện tại và đánh giá hoàn tất học phần
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Tiến độ chung toàn khóa</div>
              <div className="text-lg font-extrabold text-indigo-600">
                {completedPeriodsAll} / {totalPeriodsAll} tiết ({overallPercentage}%)
              </div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <div className="text-xs font-bold text-slate-800">{overallPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subject Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const percent = Math.min(100, Math.round((sub.completedPeriods / sub.totalPeriods) * 100));
          const isFinished = sub.completedPeriods >= sub.totalPeriods;
          const isNearlyDone = percent >= 75 && !isFinished;
          const isEditing = editingSubId === sub.id;

          return (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {sub.code} • {sub.credits} Tín chỉ
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {sub.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isFinished
                        ? 'bg-emerald-100 text-emerald-800'
                        : isNearlyDone
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isFinished ? 'Đã hoàn thành' : isNearlyDone ? 'Giai đoạn nước rút' : 'Đang học'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mt-2 space-y-1">
                  <div>
                    Giảng viên: <strong className="text-slate-700">{sub.teacherName}</strong>
                  </div>
                  <div>
                    Phòng học: <strong className="text-slate-700">{sub.roomDefault}</strong>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Tiến độ tiết học</span>
                    <span className="font-bold text-slate-900">
                      {sub.completedPeriods}/{sub.totalPeriods} tiết ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isFinished
                          ? 'bg-emerald-500'
                          : isNearlyDone
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Current Lesson */}
                <div className="mt-3.5 bg-slate-50 rounded-lg p-3 border border-slate-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-indigo-600" />
                    <span>Bài học / Chuyên đề hiện tại</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {sub.currentLesson || 'Chưa cập nhật bài học hiện tại'}
                  </p>
                </div>
              </div>

              {/* Edit Progress Area */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {isEditing ? (
                  <div className="space-y-3 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Số tiết đã dạy (trên tổng {sub.totalPeriods} tiết)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={sub.totalPeriods}
                        value={editCompleted}
                        onChange={(e) => setEditCompleted(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Cập nhật bài học / chuyên đề đang học
                      </label>
                      <textarea
                        rows={2}
                        value={editLesson}
                        onChange={(e) => setEditLesson(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingSubId(null)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(sub.id)}
                        className="px-3 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-2xs cursor-pointer"
                      >
                        Lưu tiến độ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Còn {Math.max(0, sub.totalPeriods - sub.completedPeriods)} tiết nữa
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(sub)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Cập nhật tiến độ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
