export type Gender = 'Nam' | 'Nữ';

export type AcademicRating = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';

export type AttendanceStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'late';

export type DisciplineCriterion =
  | 'absent_unexcused' // Vắng không phép (-5 điểm)
  | 'slipper' // Đi dép lê (-5 điểm)
  | 'wrong_uniform' // Sai đồng phục (-5 điểm)
  | 'no_materials' // Không chuẩn bị tài liệu khi đi học (-5 điểm)
  | 'hair' // Vi phạm quy định tóc: nhuộm màu sáng, không gọn (-5 điểm)
  | 'posture' // Vi phạm tác phong
  | 'uniform' // Trang phục nghề nghiệp
  | 'hygiene' // Giữ gìn vệ sinh phòng học/thực hành
  | 'footwear' // Giày dép đúng quy chuẩn
  | 'punctuality' // Đi học đúng giờ
  | 'focus' // Không làm việc riêng trong giờ
  | 'phone' // Không sử dụng điện thoại
  | 'behavior' // Thái độ hòa nhã, văn minh, không đánh nhau
  | 'positive' // Khen thưởng / tích cực (+5 điểm)
  | 'other';

export interface Student {
  id: string;
  studentCode: string; // VD: SV240101
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  group: string; // Tổ 1, Tổ 2, Tổ 3, Tổ 4
  phone?: string;
  phoneParent: string;
  email?: string;
  address?: string;
  notes?: string;
  avatarColor: string;
  conductScore: number; // Điểm rèn luyện nề nếp (khởi điểm 100)
  hasMaterials?: boolean; // Tài liệu học sinh khi đi học (true: Đầy đủ, false: Thiếu tài liệu)
}

export type SubjectStatus = 'in_progress' | 'upcoming' | 'completed';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  credits: number; // Số tín chỉ / Hệ số môn
  totalPeriods: number; // Tổng số tiết theo phân phối chương trình (VD: 45, 60 tiết)
  completedPeriods: number; // Số tiết đã giảng dạy
  currentLesson: string; // Bài học / Chuyên đề hiện tại
  teacherName: string;
  roomDefault: string; // Phòng học / Phòng thực hành mặc định
  notes?: string; // Ghi chú chung của giảng viên về môn học
  syllabusOverview?: string; // Mô tả vắn tắt học phần
  status: SubjectStatus; // 'in_progress' (Đang học kỳ này) | 'upcoming' (Sẽ học sau) | 'completed'
}

export interface SubjectDocument {
  id: string;
  subjectId: string;
  title: string;
  fileName: string;
  fileSize: string; // VD: "2.4 MB"
  fileType: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'zip' | 'xlsx' | 'other';
  uploadedAt: string; // YYYY-MM-DD
  teacherName: string;
  description?: string;
  fileData?: string; // base64 hoặc chuỗi dữ liệu tải về
}

export interface SubjectNote {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  createdAt: string; // YYYY-MM-DD
  author: string;
  isImportant?: boolean;
}

export interface ScoreRecord {
  studentId: string;
  subjectId: string;
  attendanceScore: number | null; // Điểm chuyên cần (10%)
  practicalScores: (number | null)[]; // Điểm thực hành / kiểm tra thường xuyên (30%)
  midtermScore: number | null; // Giữa kỳ (20%)
  finalScore: number | null; // Điểm thi kết thúc học phần (40%)
  notes?: string;
}

export interface SubjectAttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  period: number; // Tiết/Ca học
  studentId: string;
  status: AttendanceStatus;
  reason?: string;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  criterion: DisciplineCriterion;
  type: 'positive' | 'warning' | 'violation';
  points: number; // e.g. +5 khen thưởng hoặc -5 vi phạm
  description: string;
  reportedBy: string;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7; // Thứ 2 -> Thứ 7
  period: number; // Tiết 1 - 4 (ca chiều 13:30 - 17:00)
  subjectId: string; // 'sub_off' nếu là ngày/tiết nghỉ, 'sub_shl' cho tiết sinh hoạt lớp
  room: string;
  teacher: string;
  lessonContent?: string;
  weekNumber?: number; // Tuần học tương ứng (VD: 1, 2, 3...)
  isDayOff?: boolean; // Đánh dấu tiết/ngày nghỉ
  isClassMeeting?: boolean; // Đánh dấu tiết sinh hoạt lớp (giáo viên nhập sau)
}

export interface WeeklyScheduleDoc {
  id: string;
  weekNumber: number; // VD: 1, 2, 3...
  weekLabel: string; // VD: "Tuần 1 (08/09 - 14/09/2025)"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xlsx' | 'image' | 'other';
  uploadedAt: string; // YYYY-MM-DD
  uploadedBy: string;
  description?: string;
  fileData?: string; // base64 hoặc chuỗi dữ liệu tải về
}

export interface ClassInfo {
  className: string;
  majorName: string;
  academicYear: string;
  semester: string;
  homeroomTeacher: string;
  schoolName: string;
}
