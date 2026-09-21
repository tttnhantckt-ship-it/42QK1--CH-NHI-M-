import React, { useState, useEffect, useMemo } from 'react';
import {
  initialClassInfo,
  initialStudents,
  initialSubjects,
  initialDocuments,
  initialNotes,
  generateInitialScores,
  generateInitialSubjectAttendance,
  initialDisciplineRecords,
  initialSchedule,
  initialWeeklyDocs,
  calculateStudentOverallGPA,
  CLASS_MEETING_SUBJECT,
} from './mockData';
import {
  Student,
  Subject,
  ScoreRecord,
  SubjectAttendanceRecord,
  DisciplineRecord,
  ScheduleItem,
  ClassInfo,
  SubjectDocument,
  SubjectNote,
  WeeklyScheduleDoc,
} from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { OverviewTab } from './components/OverviewTab';
import { SubjectsTab } from './components/SubjectsTab';
import { SubjectAttendanceTab } from './components/SubjectAttendanceTab';
import { DisciplineTab } from './components/DisciplineTab';
import { StudentsTab } from './components/StudentsTab';
import { GradebookTab } from './components/GradebookTab';
import { ScheduleTab } from './components/ScheduleTab';
import { ProgressTab } from './components/ProgressTab';

import { StudentDetailModal } from './components/StudentDetailModal';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { BulkImportStudentsModal } from './components/BulkImportStudentsModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { UploadWeeklyScheduleModal } from './components/UploadWeeklyScheduleModal';
import { AddEditNoteModal } from './components/AddEditNoteModal';
import { AddDisciplineModal } from './components/AddDisciplineModal';
import { ScheduleEditModal } from './components/ScheduleEditModal';
import { ExportReportModal } from './components/ExportReportModal';

export default function App() {
  // Local storage loaded states with fallbacks & seamless migration to 42QK1
  const [classInfo, setClassInfo] = useState<ClassInfo>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_class_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.className && parsed.className.includes('42QK1')) {
          return parsed;
        }
      }
      return initialClassInfo;
    } catch {
      return initialClassInfo;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].studentCode?.includes('42QK1')) {
          return parsed;
        }
      }
      return initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_subjects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some((s: Subject) => s.id === 'sub_tour') &&
          parsed.some((s: Subject) => s.teacherName?.includes('Nhàn'))
        ) {
          if (!parsed.some((s: Subject) => s.id === 'sub_shl')) {
            return [CLASS_MEETING_SUBJECT, ...parsed];
          }
          return parsed;
        }
      }
      return initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [scores, setScores] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_scores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return generateInitialScores();
    } catch {
      return generateInitialScores();
    }
  });

  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_attendance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].studentId) {
          return parsed;
        }
      }
      return generateInitialSubjectAttendance();
    } catch {
      return generateInitialSubjectAttendance();
    }
  });

  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_discipline');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return initialDisciplineRecords;
    } catch {
      return initialDisciplineRecords;
    }
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v4_schedule');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((s: ScheduleItem) => s.period <= 4)) {
          if (!parsed.some((s: ScheduleItem) => s.subjectId === 'sub_shl' || s.isClassMeeting)) {
            // Update Saturday period 4 to sub_shl
            return parsed.map((s: ScheduleItem) =>
              s.dayOfWeek === 7 && s.period === 4
                ? {
                    ...s,
                    subjectId: 'sub_shl',
                    room: 'P.204 - Lớp 42QK1',
                    teacher: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
                    lessonContent: 'Sinh hoạt lớp định kỳ (Giáo viên nhập sau)',
                    isDayOff: false,
                    isClassMeeting: true,
                  }
                : s
            );
          }
          return parsed;
        }
      }
      return initialSchedule;
    } catch {
      return initialSchedule;
    }
  });

  const [documents, setDocuments] = useState<SubjectDocument[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialDocuments;
    } catch {
      return initialDocuments;
    }
  });

  const [notes, setNotes] = useState<SubjectNote[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [weeklyDocs, setWeeklyDocs] = useState<WeeklyScheduleDoc[]>(() => {
    try {
      const saved = localStorage.getItem('edu_hospitality_v3_weekly_docs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialWeeklyDocs;
    } catch {
      return initialWeeklyDocs;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modals state
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [isAddEditStudentOpen, setIsAddEditStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [selectedSubjectIdForDoc, setSelectedSubjectIdForDoc] = useState<string | undefined>(undefined);

  const [isUploadWeeklyModalOpen, setIsUploadWeeklyModalOpen] = useState(false);
  const [selectedWeekForDoc, setSelectedWeekForDoc] = useState<number>(1);

  const [isAddEditNoteOpen, setIsAddEditNoteOpen] = useState(false);
  const [selectedSubjectIdForNote, setSelectedSubjectIdForNote] = useState<string | undefined>(undefined);
  const [noteToEdit, setNoteToEdit] = useState<SubjectNote | null>(null);

  const [isAddDisciplineOpen, setIsAddDisciplineOpen] = useState(false);
  const [disciplinePreselectedStudentId, setDisciplinePreselectedStudentId] = useState<string | undefined>(undefined);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleItemToEdit, setScheduleItemToEdit] = useState<ScheduleItem | null>(null);
  const [scheduleInitialDay, setScheduleInitialDay] = useState<2 | 3 | 4 | 5 | 6 | 7>(2);
  const [scheduleInitialPeriod, setScheduleInitialPeriod] = useState<number>(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_class_info', JSON.stringify(classInfo));
  }, [classInfo]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_attendance', JSON.stringify(subjectAttendance));
  }, [subjectAttendance]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_discipline', JSON.stringify(disciplineRecords));
  }, [disciplineRecords]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v4_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('edu_hospitality_v3_weekly_docs', JSON.stringify(weeklyDocs));
  }, [weeklyDocs]);

  // Overall calculations
  const classAvgGPA = useMemo(() => {
    const gpas = students
      .map((st) => calculateStudentOverallGPA(st.id, scores, subjects))
      .filter((v): v is number => v !== null);

    if (gpas.length === 0) return null;
    return Math.round((gpas.reduce((a, b) => a + b, 0) / gpas.length) * 10) / 10;
  }, [students, scores, subjects]);

  const overallAttendanceRate = useMemo(() => {
    if (!Array.isArray(subjectAttendance) || subjectAttendance.length === 0) return 100;
    const total = subjectAttendance.length;
    const present = subjectAttendance.filter((rec) => rec && rec.status === 'present').length;
    return Math.round((present / total) * 100);
  }, [subjectAttendance]);

  // Total conduct violations & issues today
  const unexcusedCountToday = useMemo(() => {
    if (!Array.isArray(subjectAttendance)) return 0;
    const today = new Date().toISOString().slice(0, 10);
    return subjectAttendance.filter((rec) => rec && rec.date === today && rec.status === 'absent_unexcused').length;
  }, [subjectAttendance]);

  // Handler: Reset Data to Demo
  const handleResetData = () => {
    if (
      window.confirm(
        'Bạn có chắc muốn đặt lại dữ liệu gốc của 9 môn học và danh sách sinh viên mẫu? Mọi thao tác bổ sung sẽ được hoàn tác.'
      )
    ) {
      setStudents(initialStudents);
      setSubjects(initialSubjects);
      setDocuments(initialDocuments);
      setNotes(initialNotes);
      setScores(generateInitialScores());
      setSubjectAttendance(generateInitialSubjectAttendance());
      setDisciplineRecords(initialDisciplineRecords);
      setSchedule(initialSchedule);
      setWeeklyDocs(initialWeeklyDocs);
      setClassInfo(initialClassInfo);
      localStorage.clear();
    }
  };

  // Student CRUD
  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsAddEditStudentOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsAddEditStudentOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (window.confirm(`Xác nhận xóa sinh viên "${target?.name || ''}" khỏi danh sách lớp?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setScores((prev) => prev.filter((sc) => sc.studentId !== studentId));
      setDisciplineRecords((prev) => prev.filter((d) => d.studentId !== studentId));
      if (selectedStudentDetail?.id === studentId) {
        setSelectedStudentDetail(null);
      }
    }
  };

  const handleSaveStudent = (data: Omit<Student, 'id'>, studentId?: string) => {
    if (studentId) {
      // Edit
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...data, id: studentId } : s))
      );
    } else {
      // Add
      const newId = `st_${Date.now()}`;
      const newStudent: Student = { ...data, id: newId };
      setStudents((prev) => [...prev, newStudent]);

      // Initialize score records for all 9 subjects
      const newScoreRecords: ScoreRecord[] = subjects.map((sub) => ({
        studentId: newId,
        subjectId: sub.id,
        attendanceScore: 10,
        practicalScores: [null, null],
        midtermScore: null,
        finalScore: null,
      }));
      setScores((prev) => [...prev, ...newScoreRecords]);
    }
  };

  // Bulk import students
  const handleBulkImportStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const timestamp = Date.now();
    const createdList: Student[] = newStudents.map((st, idx) => ({
      ...st,
      id: `st_${timestamp}_${idx}`,
    }));

    setStudents((prev) => [...prev, ...createdList]);

    // Initialize score records for all subjects for each student
    const newScoreRecords: ScoreRecord[] = [];
    createdList.forEach((st) => {
      subjects.forEach((sub) => {
        newScoreRecords.push({
          studentId: st.id,
          subjectId: sub.id,
          attendanceScore: 10,
          practicalScores: [null, null],
          midtermScore: null,
          finalScore: null,
        });
      });
    });
    setScores((prev) => [...prev, ...newScoreRecords]);
  };

  // Grade Update
  const handleUpdateScore = (
    studentId: string,
    subjectId: string,
    updatedRecord: Partial<ScoreRecord>
  ) => {
    setScores((prev) => {
      const idx = prev.findIndex((s) => s.studentId === studentId && s.subjectId === subjectId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...updatedRecord };
        return next;
      } else {
        return [
          ...prev,
          {
            studentId,
            subjectId,
            attendanceScore: updatedRecord.attendanceScore ?? 10,
            practicalScores: updatedRecord.practicalScores || [null, null],
            midtermScore: updatedRecord.midtermScore ?? null,
            finalScore: updatedRecord.finalScore ?? null,
          },
        ];
      }
    });
  };

  // Document Management
  const handleOpenUploadDoc = (subjectId?: string) => {
    setSelectedSubjectIdForDoc(subjectId || subjects[0]?.id);
    setIsUploadDocOpen(true);
  };

  const handleUploadDocument = (docData: Omit<SubjectDocument, 'id'>) => {
    const newDoc: SubjectDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedAt: docData.uploadedAt || new Date().toISOString().slice(0, 10),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploadDocOpen(false);
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  // Note Management
  const handleOpenAddNote = (subjectId?: string, note?: SubjectNote) => {
    setSelectedSubjectIdForNote(subjectId || subjects[0]?.id);
    setNoteToEdit(note || null);
    setIsAddEditNoteOpen(true);
  };

  const handleSaveNote = (noteData: Omit<SubjectNote, 'id'>, noteId?: string) => {
    const dateStr = new Date().toISOString().slice(0, 10);
    if (noteId) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...noteData, id: noteId, createdAt: n.createdAt || dateStr } : n))
      );
    } else {
      const newNote: SubjectNote = {
        ...noteData,
        id: `note_${Date.now()}`,
        createdAt: dateStr,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setIsAddEditNoteOpen(false);
    setNoteToEdit(null);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Xác nhận xóa ghi chú môn học này?')) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  };

  // Discipline / Conduct Management
  const handleOpenAddDiscipline = (studentId?: string) => {
    setDisciplinePreselectedStudentId(studentId);
    setIsAddDisciplineOpen(true);
  };

  const handleSaveDiscipline = (recordData: Omit<DisciplineRecord, 'id'>) => {
    const newRecord: DisciplineRecord = {
      ...recordData,
      id: `disc_${Date.now()}`,
    };
    setDisciplineRecords((prev) => [newRecord, ...prev]);

    // Update student's conduct score
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === recordData.studentId) {
          const updatedScore = Math.max(0, Math.min(100, st.conductScore + recordData.points));
          return { ...st, conductScore: updatedScore };
        }
        return st;
      })
    );
  };

  const handleDeleteDiscipline = (id: string) => {
    const record = disciplineRecords.find((r) => r.id === id);
    if (!record) return;

    if (window.confirm('Bạn có chắc muốn xóa bản ghi nề nếp này? Điểm rèn luyện của học sinh sẽ được hoàn lại.')) {
      setDisciplineRecords((prev) => prev.filter((r) => r.id !== id));
      setStudents((prev) =>
        prev.map((st) => {
          if (st.id === record.studentId) {
            const restoredScore = Math.max(0, Math.min(100, st.conductScore - record.points));
            return { ...st, conductScore: restoredScore };
          }
          return st;
        })
      );
    }
  };

  const handleUpdateStudentConduct = (studentId: string, newScore: number) => {
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, conductScore: Math.max(0, Math.min(100, newScore)) } : st))
    );
  };

  // Subject Attendance Save Batch
  const handleSaveSubjectAttendanceBatch = (newRecords: SubjectAttendanceRecord[]) => {
    setSubjectAttendance((prev) => {
      if (newRecords.length === 0) return prev;
      const { subjectId, date, period } = newRecords[0];
      const remaining = prev.filter(
        (r) => !(r.subjectId === subjectId && r.date === date && r.period === period)
      );
      return [...newRecords, ...remaining];
    });
  };

  // Syllabus Progress Update
  const handleUpdateTeachingProgress = (subjectId: string, completedPeriods: number, currentLesson: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            completedPeriods,
            currentLesson,
          };
        }
        return sub;
      })
    );
  };

  // Schedule CRUD
  const handleOpenAddSchedule = () => {
    setScheduleItemToEdit(null);
    setScheduleInitialDay(2);
    setScheduleInitialPeriod(1);
    setIsScheduleModalOpen(true);
  };

  const handleOpenAddScheduleSlot = (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7, period: number) => {
    setScheduleItemToEdit(null);
    setScheduleInitialDay(dayOfWeek);
    setScheduleInitialPeriod(period);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (item: ScheduleItem) => {
    setScheduleItemToEdit(item);
    setScheduleInitialDay(item.dayOfWeek);
    setScheduleInitialPeriod(item.period);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteScheduleItem = (itemId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tiết này khỏi thời khóa biểu?')) {
      setSchedule((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleToggleDayOff = (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7) => {
    setSchedule((prev) => {
      const dayItems = prev.filter((s) => s.dayOfWeek === dayOfWeek);
      const isCurrentlyOff =
        dayItems.length > 0 &&
        dayItems.every((s) => s.subjectId === 'sub_off' || !!s.isDayOff);

      const otherItems = prev.filter((s) => s.dayOfWeek !== dayOfWeek);

      if (isCurrentlyOff) {
        // Switch to active classes
        const activeSub = subjects.find((s) => s.status === 'in_progress') || subjects[0];
        const newItems: ScheduleItem[] = [1, 2, 3, 4].map((p) => ({
          id: `sch_${Date.now()}_${dayOfWeek}_${p}`,
          dayOfWeek,
          period: p,
          subjectId: activeSub?.id || 'sub_tour',
          room: activeSub?.roomDefault || 'P.302',
          teacher: activeSub?.teacherName || 'GV Phụ trách',
          lessonContent: `Nội dung học tập tiết ${p}`,
          isDayOff: false,
        }));
        return [...otherItems, ...newItems];
      } else {
        // Switch to Day Off (4 periods)
        const dayOffItems: ScheduleItem[] = [1, 2, 3, 4].map((p) => ({
          id: `sch_off_${Date.now()}_${dayOfWeek}_${p}`,
          dayOfWeek,
          period: p,
          subjectId: 'sub_off',
          room: 'Nghỉ',
          teacher: 'Không có tiết',
          lessonContent: 'Nghỉ học theo kế hoạch đào tạo',
          isDayOff: true,
        }));
        return [...otherItems, ...dayOffItems];
      }
    });
  };

  const handleSetEntireDayOff = (dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7, note?: string) => {
    setSchedule((prev) => {
      const otherItems = prev.filter((s) => s.dayOfWeek !== dayOfWeek);
      const dayOffItems: ScheduleItem[] = [1, 2, 3, 4].map((p) => ({
        id: `sch_off_${Date.now()}_${dayOfWeek}_${p}`,
        dayOfWeek,
        period: p,
        subjectId: 'sub_off',
        room: 'Nghỉ',
        teacher: 'Không có tiết',
        lessonContent: note || 'Nghỉ học theo kế hoạch đào tạo',
        isDayOff: true,
      }));
      return [...otherItems, ...dayOffItems];
    });
    setIsScheduleModalOpen(false);
  };

  const handleSaveScheduleItem = (data: Omit<ScheduleItem, 'id'>, itemId?: string) => {
    if (itemId) {
      setSchedule((prev) =>
        prev.map((item) => (item.id === itemId ? { ...data, id: itemId } : item))
      );
    } else {
      const newItem: ScheduleItem = {
        ...data,
        id: `sch_${Date.now()}`,
      };
      setSchedule((prev) => [...prev, newItem]);
    }
  };

  // Weekly Schedule Document Handlers
  const handleOpenUploadWeeklyDoc = (weekNum?: number) => {
    setSelectedWeekForDoc(weekNum || 1);
    setIsUploadWeeklyModalOpen(true);
  };

  const handleSaveWeeklyDoc = (newDoc: Omit<WeeklyScheduleDoc, 'id'>) => {
    const doc: WeeklyScheduleDoc = {
      ...newDoc,
      id: `wdoc_${Date.now()}`,
    };
    setWeeklyDocs((prev) => {
      const filtered = prev.filter((d) => d.weekNumber !== newDoc.weekNumber);
      return [doc, ...filtered];
    });
  };

  const handleDeleteWeeklyDoc = (docId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tệp lịch học tuần này?')) {
      setWeeklyDocs((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  const nextStudentCode = `SV${String(students.length + 1).padStart(3, '0')}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header with Class Info & Quick Actions */}
      <Header
        classInfo={classInfo}
        studentCount={students.length}
        averageClassGPA={classAvgGPA}
        overallAttendanceRate={overallAttendanceRate}
        onAddStudent={handleOpenAddStudent}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
        onResetData={handleResetData}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Navigation Tabs Bar with 8 functional tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        studentCount={students.length}
        unexcusedCountToday={unexcusedCountToday}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Tổng quan lớp học */}
        {activeTab === 'overview' && (
          <OverviewTab
            students={students}
            subjects={subjects}
            scores={scores}
            attendanceRecords={subjectAttendance}
            disciplineRecords={disciplineRecords}
            schedule={schedule}
            classInfo={classInfo}
            documents={documents}
            onNavigateTab={setActiveTab}
            onSelectStudent={(st) => setSelectedStudentDetail(st)}
          />
        )}

        {/* Tab 2: 9 Môn học, Tài liệu & Ghi chú */}
        {activeTab === 'subjects' && (
          <SubjectsTab
            subjects={subjects}
            documents={documents}
            notes={notes}
            onOpenUploadDoc={handleOpenUploadDoc}
            onOpenAddNote={(subId) => handleOpenAddNote(subId)}
            onDeleteDoc={handleDeleteDocument}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {/* Tab 3: Điểm danh theo môn học */}
        {activeTab === 'attendance' && (
          <SubjectAttendanceTab
            students={students}
            subjects={subjects}
            attendanceRecords={subjectAttendance}
            onSaveAttendanceBatch={handleSaveSubjectAttendanceBatch}
          />
        )}

        {/* Tab 4: Đánh giá nề nếp, chuyên cần (7 tiêu chí) */}
        {activeTab === 'discipline' && (
          <DisciplineTab
            students={students}
            subjects={subjects}
            records={disciplineRecords}
            onOpenAddDiscipline={handleOpenAddDiscipline}
            onDeleteRecord={handleDeleteDiscipline}
            onUpdateConductScore={handleUpdateStudentConduct}
          />
        )}

        {/* Tab 5: Danh sách sinh viên (Nhập lên sau / Bulk import) */}
        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            subjects={subjects}
            scores={scores}
            attendanceRecords={subjectAttendance}
            onAddStudent={handleOpenAddStudent}
            onOpenBulkImport={() => setIsBulkImportOpen(true)}
            onEditStudent={handleOpenEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudent={(st) => setSelectedStudentDetail(st)}
          />
        )}

        {/* Tab 6: Sổ điểm 9 môn học */}
        {activeTab === 'gradebook' && (
          <GradebookTab
            students={students}
            subjects={subjects}
            scores={scores}
            onUpdateScore={handleUpdateScore}
          />
        )}

        {/* Tab 7: Thời khóa biểu theo tuần */}
        {activeTab === 'schedule' && (
          <ScheduleTab
            schedule={schedule}
            subjects={subjects}
            weeklyDocs={weeklyDocs}
            onAddScheduleItem={handleOpenAddSchedule}
            onAddScheduleSlot={handleOpenAddScheduleSlot}
            onEditScheduleItem={handleOpenEditSchedule}
            onDeleteScheduleItem={handleDeleteScheduleItem}
            onToggleDayOff={handleToggleDayOff}
            onOpenUploadWeeklyModal={handleOpenUploadWeeklyDoc}
            onDeleteWeeklyDoc={handleDeleteWeeklyDoc}
          />
        )}

        {/* Tab 8: Tiến độ môn học */}
        {activeTab === 'progress' && (
          <ProgressTab
            subjects={subjects}
            onUpdateSubjectProgress={handleUpdateTeachingProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Phần mềm Quản lý Sinh viên & 9 Môn Chuyên Ngành Du Lịch - Khách Sạn •{' '}
            <strong>{classInfo.className}</strong> ({classInfo.academicYear})
          </div>
          <div>
            Khoa Du Lịch - Khách Sạn • Giảng viên chủ nhiệm / Cố vấn: {classInfo.homeroomTeacher}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedStudentDetail && (
        <StudentDetailModal
          student={selectedStudentDetail}
          subjects={subjects}
          scores={scores}
          disciplineRecords={disciplineRecords}
          attendanceRecords={subjectAttendance}
          onClose={() => setSelectedStudentDetail(null)}
        />
      )}

      {/* Add / Edit Student Single */}
      <AddEditStudentModal
        isOpen={isAddEditStudentOpen}
        studentToEdit={studentToEdit}
        onClose={() => setIsAddEditStudentOpen(false)}
        onSave={handleSaveStudent}
        nextStudentCode={nextStudentCode}
      />

      {/* Bulk Import Students (Dán danh sách học sinh lên sau) */}
      <BulkImportStudentsModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportStudents={handleBulkImportStudents}
        existingCount={students.length}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        subjects={subjects}
        initialSubjectId={selectedSubjectIdForDoc}
        onClose={() => setIsUploadDocOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* Upload Weekly Schedule Document Modal */}
      <UploadWeeklyScheduleModal
        isOpen={isUploadWeeklyModalOpen}
        initialWeek={selectedWeekForDoc}
        onClose={() => setIsUploadWeeklyModalOpen(false)}
        onUpload={handleSaveWeeklyDoc}
      />

      {/* Add / Edit Note Modal */}
      <AddEditNoteModal
        isOpen={isAddEditNoteOpen}
        subjects={subjects}
        initialSubjectId={selectedSubjectIdForNote}
        noteToEdit={noteToEdit}
        onClose={() => {
          setIsAddEditNoteOpen(false);
          setNoteToEdit(null);
        }}
        onSave={handleSaveNote}
      />

      {/* Add Discipline / Commendation Record */}
      <AddDisciplineModal
        isOpen={isAddDisciplineOpen}
        students={students}
        subjects={subjects}
        preselectedStudentId={disciplinePreselectedStudentId}
        onClose={() => setIsAddDisciplineOpen(false)}
        onSaveDiscipline={handleSaveDiscipline}
      />

      {/* Edit / Add Schedule Item */}
      <ScheduleEditModal
        isOpen={isScheduleModalOpen}
        itemToEdit={scheduleItemToEdit}
        initialDay={scheduleInitialDay}
        initialPeriod={scheduleInitialPeriod}
        subjects={subjects}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveScheduleItem}
        onDelete={handleDeleteScheduleItem}
        onSetDayOff={handleSetEntireDayOff}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        classInfo={classInfo}
        students={students}
        subjects={subjects}
        scores={scores}
        attendanceRecords={subjectAttendance}
        disciplineRecords={disciplineRecords}
      />
    </div>
  );
}
