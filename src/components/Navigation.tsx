import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CalendarCheck,
  ShieldCheck,
  BookOpenCheck,
  CalendarDays,
  Users,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'subjects'
  | 'progress'
  | 'attendance'
  | 'discipline'
  | 'gradebook'
  | 'schedule'
  | 'students';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  studentCount: number;
  documentCount: number;
  warningCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  studentCount,
  documentCount,
  warningCount,
}) => {
  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Tổng Quan Lớp',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'subjects' as TabType,
      label: 'Môn Học & Tài Liệu',
      icon: BookOpen,
      badge: documentCount > 0 ? `${documentCount} tệp` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'progress' as TabType,
      label: 'Tiến Độ Môn Học',
      icon: TrendingUp,
      badge: '9 môn',
    },
    {
      id: 'attendance' as TabType,
      label: 'Điểm Danh Theo Môn',
      icon: CalendarCheck,
      badge: null,
    },
    {
      id: 'discipline' as TabType,
      label: 'Đánh Giá Nề Nếp',
      icon: ShieldCheck,
      badge: warningCount > 0 ? `${warningCount} nhắc nhở` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'gradebook' as TabType,
      label: 'Sổ Điểm Các Môn',
      icon: BookOpenCheck,
      badge: null,
    },
    {
      id: 'schedule' as TabType,
      label: 'Thời Khóa Biểu Tuần',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'students' as TabType,
      label: 'Danh Sách Học Sinh',
      icon: Users,
      badge: studentCount > 0 ? `${studentCount} SV` : 'Chưa nhập',
      badgeColor: studentCount === 0 ? 'bg-rose-100 text-rose-700' : undefined,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      tab.badgeColor
                        ? tab.badgeColor
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
