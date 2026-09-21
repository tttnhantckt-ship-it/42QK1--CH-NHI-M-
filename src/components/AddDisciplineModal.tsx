import React, { useState } from 'react';
import { X, ShieldAlert, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Student, Subject, DisciplineRecord, DisciplineCriterion } from '../types';
import { getDisciplineCriterionLabel } from '../mockData';

interface AddDisciplineModalProps {
  isOpen: boolean;
  students: Student[];
  subjects: Subject[];
  initialStudentId?: string;
  onClose: () => void;
  onSave: (record: Omit<DisciplineRecord, 'id'>) => void;
}

export const AddDisciplineModal: React.FC<AddDisciplineModalProps> = ({
  isOpen,
  students,
  subjects,
  initialStudentId,
  onClose,
  onSave,
}) => {
  const [studentId, setStudentId] = useState<string>(initialStudentId || students[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [subjectId, setSubjectId] = useState<string>('general');
  const [criterion, setCriterion] = useState<DisciplineCriterion>('uniform');
  const [type, setType] = useState<'positive' | 'warning' | 'violation'>('warning');
  const [points, setPoints] = useState<number>(-3);
  const [description, setDescription] = useState<string>('');
  const [reportedBy, setReportedBy] = useState<string>('Giảng viên bộ môn');

  if (!isOpen) return null;

  const criteriaOptions: { id: DisciplineCriterion; label: string; desc: string; defaultPoints: number }[] = [
    { id: 'absent_unexcused', label: 'Vắng không phép (-5đ)', desc: 'Nghỉ học không phép theo quy định', defaultPoints: -5 },
    { id: 'slipper', label: 'Đi dép lê (-5đ)', desc: 'Đi dép lê/dép xỏ ngón vào trường hoặc phòng thực hành', defaultPoints: -5 },
    { id: 'wrong_uniform', label: 'Sai đồng phục (-5đ)', desc: 'Mặc sai đồng phục nghề, thiếu cà vạt, bảng tên', defaultPoints: -5 },
    { id: 'no_materials', label: 'Không chuẩn bị tài liệu (-5đ)', desc: 'Đi học không mang giáo trình, tập vở, tài liệu học tập', defaultPoints: -5 },
    { id: 'hair', label: 'Vi phạm quy định tóc (-5đ)', desc: 'Nhuộm tóc màu sáng, tóc nam quá dài, tóc nữ không búi gọn', defaultPoints: -5 },
    { id: 'posture', label: 'Vi phạm tác phong (-5đ)', desc: 'Tác phong nghề du lịch chưa nghiêm túc, đứng ngồi tùy tiện', defaultPoints: -5 },
    { id: 'uniform', label: 'Trang phục nghề nghiệp', desc: 'Đồng phục nghề, sơ mi ủi thẳng, cài bảng tên, tác phong chỉn chu', defaultPoints: -3 },
    { id: 'hygiene', label: 'Giữ gìn vệ sinh', desc: 'Vệ sinh phòng học, quầy bar, phòng thực hành bàn/buồng sau giờ học', defaultPoints: -3 },
    { id: 'footwear', label: 'Giày dép chưa chuẩn', desc: 'Không mang giày tây đen / giày búp bê công sở quy định', defaultPoints: -3 },
    { id: 'punctuality', label: 'Đi học đúng giờ', desc: 'Vào lớp trễ, chuẩn bị đồ nghề thực hành muộn', defaultPoints: -3 },
    { id: 'focus', label: 'Tác phong học tập', desc: 'Không làm việc riêng, tập trung thực hành kỹ năng', defaultPoints: -3 },
    { id: 'phone', label: 'Không sử dụng điện thoại', desc: 'Sử dụng điện thoại di động lướt mạng trong giờ học', defaultPoints: -3 },
    { id: 'behavior', label: 'Văn minh, không đánh nhau', desc: 'Thái độ hòa nhã, tôn trọng giảng viên & bạn bè, tuyệt đối không xô xát', defaultPoints: -10 },
    { id: 'positive', label: 'Khen thưởng / Tích cực (+5đ)', desc: 'Có thành tích nổi bật, gương mẫu, hỗ trợ lớp và giáo viên', defaultPoints: 5 },
    { id: 'other', label: 'Nề nếp khác', desc: 'Các nội quy học đường và quy chế đào tạo khác', defaultPoints: -3 },
  ];

  const quickRules: { criterion: DisciplineCriterion; label: string; desc: string; icon: string }[] = [
    { criterion: 'absent_unexcused', label: 'Vắng không phép', desc: 'Vắng học không phép theo quy định (-5đ)', icon: '🚪' },
    { criterion: 'slipper', label: 'Đi dép lê', desc: 'Đi dép lê vào lớp học / phòng thực hành (-5đ)', icon: '🩴' },
    { criterion: 'wrong_uniform', label: 'Sai đồng phục', desc: 'Sai đồng phục nghề nghiệp, thiếu bảng tên (-5đ)', icon: '👔' },
    { criterion: 'no_materials', label: 'Thiếu tài liệu', desc: 'Không chuẩn bị tài liệu, giáo trình học tập khi đi học (-5đ)', icon: '📚' },
    { criterion: 'hair', label: 'Vi phạm tóc', desc: 'Vi phạm quy định tóc: nhuộm màu sáng hoặc chưa gọn (-5đ)', icon: '💇' },
  ];

  const applyQuickRule = (rule: typeof quickRules[0]) => {
    setCriterion(rule.criterion);
    setType('violation');
    setPoints(-5);
    setDescription(rule.desc);
  };

  const handleTypeChange = (newType: 'positive' | 'warning' | 'violation') => {
    setType(newType);
    if (newType === 'positive') {
      setPoints(5);
    } else if (newType === 'warning') {
      setPoints(-3);
    } else {
      setPoints(-10);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSave({
      studentId,
      date,
      subjectId: subjectId === 'general' ? undefined : subjectId,
      criterion,
      type,
      points,
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Giáo viên bộ môn',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Đánh Giá Nề Nếp & Chuyên Cần Sinh Viên
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Quick Preset Buttons for -5 Rules */}
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-900">
              <span className="flex items-center gap-1.5">
                <span className="text-rose-600">⚡</span> Phím Tắt Vi Phạm Thường Gặp (-5 Điểm)
              </span>
              <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-semibold">
                Quy chế lớp 42QK1
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickRules.map((rule) => (
                <button
                  key={rule.criterion}
                  type="button"
                  onClick={() => applyQuickRule(rule)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-100/50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                  title={rule.desc}
                >
                  <span>{rule.icon}</span>
                  <span>{rule.label}</span>
                  <span className="text-rose-600 font-bold font-mono">-5đ</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Sinh viên */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Học sinh / Sinh viên <span className="text-rose-500">*</span>
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.studentCode} - {st.name} ({st.group})
                  </option>
                ))}
              </select>
            </div>

            {/* Môn học liên quan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học / Tiết</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="general">Nề nếp sinh hoạt chung cả lớp</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày ghi nhận */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày ghi nhận</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Phân loại đánh giá */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hình thức đánh giá</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('positive')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'positive'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Award className="h-3.5 w-3.5 text-emerald-600" />
                <span>Khen thưởng (+)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('warning')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'warning'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Nhắc nhở (-)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('violation')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'violation'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                <span>Vi phạm (- -)</span>
              </button>
            </div>
          </div>

          {/* Tiêu chí nề nếp */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu chí nề nếp vi phạm / khen thưởng <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50">
              {criteriaOptions.map((opt) => {
                const info = getDisciplineCriterionLabel(opt.id);
                const isSelected = criterion === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setCriterion(opt.id);
                      setPoints(opt.defaultPoints);
                      if (opt.defaultPoints > 0) setType('positive');
                      else if (opt.defaultPoints <= -5) setType('violation');
                      else setType('warning');
                    }}
                    className={`p-2 rounded-md border cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-2xs ring-1 ring-indigo-500'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <span>{info.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Điểm rèn luyện ảnh hưởng
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                placeholder="VD: -5 hoặc +5"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người ghi nhận
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="VD: Cô Trịnh Thanh Mai"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết sự việc <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="VD: Mang giày thể thao trắng không đúng quy định vào phòng thực hành bàn tiệc..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
              Lưu Đánh Giá Nề Nếp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
