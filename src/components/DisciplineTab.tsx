import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { Student, Subject, DisciplineRecord, DisciplineCriterion } from '../types';
import { getDisciplineCriterionLabel } from '../mockData';

interface DisciplineTabProps {
  students: Student[];
  subjects: Subject[];
  records: DisciplineRecord[];
  onOpenAddDiscipline: (studentId?: string) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateConductScore: (studentId: string, newScore: number) => void;
}

export const DisciplineTab: React.FC<DisciplineTabProps> = ({
  students = [],
  subjects = [],
  records = [],
  onOpenAddDiscipline,
  onDeleteRecord,
  onUpdateConductScore,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'warning' | 'violation'>('all');
  const [filterCriterion, setFilterCriterion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const safeRecords = Array.isArray(records) ? records : [];
  const safeStudents = Array.isArray(students) ? students : [];

  const criteriaList: { id: DisciplineCriterion; label: string; icon: string; count: number }[] = [
    {
      id: 'uniform',
      label: 'Trang phục & Tác phong',
      icon: '👔',
      count: safeRecords.filter((r) => r.criterion === 'uniform').length,
    },
    {
      id: 'hygiene',
      label: 'Giữ gìn vệ sinh',
      icon: '🧹',
      count: safeRecords.filter((r) => r.criterion === 'hygiene').length,
    },
    {
      id: 'footwear',
      label: 'Giày dép chuẩn quy định',
      icon: '👞',
      count: safeRecords.filter((r) => r.criterion === 'footwear').length,
    },
    {
      id: 'punctuality',
      label: 'Đi học đúng giờ',
      icon: '⏰',
      count: safeRecords.filter((r) => r.criterion === 'punctuality').length,
    },
    {
      id: 'focus',
      label: 'Không làm việc riêng',
      icon: '📖',
      count: safeRecords.filter((r) => r.criterion === 'focus').length,
    },
    {
      id: 'phone',
      label: 'Không sử dụng điện thoại',
      icon: '📵',
      count: safeRecords.filter((r) => r.criterion === 'phone').length,
    },
    {
      id: 'behavior',
      label: 'Văn minh, không đánh nhau',
      icon: '🤝',
      count: safeRecords.filter((r) => r.criterion === 'behavior').length,
    },
  ];

  const filteredRecords = safeRecords.filter((rec) => {
    if (filterType !== 'all' && rec.type !== filterType) return false;
    if (filterCriterion !== 'all' && rec.criterion !== filterCriterion) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const student = safeStudents.find((s) => s.id === rec.studentId);
      return (
        rec.description.toLowerCase().includes(q) ||
        rec.reportedBy.toLowerCase().includes(q) ||
        (student && student.name.toLowerCase().includes(q)) ||
        (student && student.studentCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const positiveCount = safeRecords.filter((r) => r.type === 'positive').length;
  const warningCount = safeRecords.filter((r) => r.type === 'warning').length;
  const violationCount = safeRecords.filter((r) => r.type === 'violation').length;

  return (
    <div className="space-y-6">
      {/* Top Card: Overview of Discipline Evaluation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <span>Đánh Giá Chuyên Cần & Thực Hiện Nề Nếp Học Đường</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi 7 tiêu chuẩn tác phong nghề nghiệp: Trang phục, vệ sinh, giày dép, giờ giấc, thái độ học tập, điện thoại và văn minh ứng xử
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-add-discipline"
              onClick={() => onOpenAddDiscipline()}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Ghi Nhận Nề Nếp / Khen Thưởng</span>
            </button>
          </div>
        </div>

        {/* 7 Discipline Criteria Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            7 Tiêu chí nề nếp trọng tâm ngành Du lịch - Khách sạn
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {criteriaList.map((crit) => (
              <div
                key={crit.id}
                onClick={() => setFilterCriterion(filterCriterion === crit.id ? 'all' : crit.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  filterCriterion === crit.id
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-lg">{crit.icon}</div>
                <div className="font-semibold text-slate-900 text-[11px] mt-1 line-clamp-2">
                  {crit.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {crit.count} lượt ghi nhận
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Student Conduct Board & Log of records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Bảng Điểm Rèn Luyện Sinh Viên */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Bảng Điểm Rèn Luyện & Nề Nếp (100đ)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Khởi điểm 100 điểm, tự động cộng trừ theo ghi nhận
            </p>
          </div>

          <div className="p-3 divide-y divide-slate-100 overflow-y-auto max-h-[560px]">
            {safeStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Chưa có sinh viên.</div>
            ) : (
              safeStudents.map((st) => {
                const stRecords = safeRecords.filter((r) => r.studentId === st.id);
                const pos = stRecords.filter((r) => r.type === 'positive').length;
                const neg = stRecords.filter((r) => r.type !== 'positive').length;

                return (
                  <div
                    key={st.id}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{st.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">({st.studentCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="text-emerald-600 font-medium">+{pos} khen</span>
                        <span>•</span>
                        <span className="text-rose-600 font-medium">-{neg} nhắc</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
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

                      <button
                        type="button"
                        onClick={() => onOpenAddDiscipline(st.id)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Thêm ghi nhận cho sinh viên này"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (2 cols): Nhật Ký Đánh Giá Chi Tiết */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({safeRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('positive')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === 'positive'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Khen thưởng (+{positiveCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('warning')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === 'warning'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                Nhắc nhở (-{warningCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('violation')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === 'violation'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                Vi phạm (-{violationCount})
              </button>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nội dung, tên sinh viên..."
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
              />
            </div>
          </div>

          {/* Records List */}
          <div className="p-4 divide-y divide-slate-100 overflow-y-auto max-h-[560px]">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Không tìm thấy bản ghi nề nếp nào phù hợp với bộ lọc.
              </div>
            ) : (
              filteredRecords.map((rec) => {
                const student = safeStudents.find((s) => s.id === rec.studentId);
                const sub = (Array.isArray(subjects) ? subjects : []).find((s) => s.id === rec.subjectId);
                const critInfo = getDisciplineCriterionLabel(rec.criterion);

                return (
                  <div key={rec.id} className="py-3.5 hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="text-xl shrink-0 mt-0.5">{critInfo.icon}</div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">
                              {student?.name || 'Học sinh'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {student?.studentCode}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${critInfo.tag}`}
                            >
                              {critInfo.label}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                            {rec.description}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5 flex-wrap">
                            <span>Ngày: <strong>{rec.date}</strong></span>
                            {sub && (
                              <span>
                                Môn: <strong>{sub.name}</strong>
                              </span>
                            )}
                            <span>
                              Người ghi nhận: <strong>{rec.reportedBy}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-bold font-mono text-xs px-2 py-0.5 rounded ${
                            rec.points > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {rec.points > 0 ? `+${rec.points}` : rec.points}đ
                        </span>

                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Xóa bản ghi này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
