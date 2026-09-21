import {
  ClassInfo,
  Student,
  Subject,
  ScoreRecord,
  SubjectAttendanceRecord,
  ScheduleItem,
  WeeklyScheduleDoc,
  SubjectDocument,
  SubjectNote,
  DisciplineRecord,
  AcademicRating,
  DisciplineCriterion,
} from './types';

export const initialClassInfo: ClassInfo = {
  className: '42QK1',
  majorName: 'Quản lý và kinh doanh du lịch',
  academicYear: 'Khóa 42 (2024 - 2026)',
  semester: 'Học kỳ I (Năm học 2024 - 2025)',
  homeroomTeacher: 'ThS. Trịnh Thị Thanh Nhàn',
  schoolName: 'Trường Trung cấp Kinh tế Khánh Hoà',
};

export const OFF_SUBJECT: Subject = {
  id: 'sub_off',
  name: 'Nghỉ học',
  code: 'NGHI',
  color: 'slate',
  credits: 0,
  totalPeriods: 0,
  completedPeriods: 0,
  currentLesson: 'Nghỉ theo kế hoạch đào tạo',
  teacherName: 'Không có tiết',
  roomDefault: 'Nghỉ',
  status: 'upcoming',
  notes: 'Buổi / Tiết nghỉ học của lớp',
};

export const CLASS_MEETING_SUBJECT: Subject = {
  id: 'sub_shl',
  name: 'Sinh hoạt lớp',
  code: 'SHL42',
  color: 'violet',
  credits: 1,
  totalPeriods: 15,
  completedPeriods: 2,
  currentLesson: 'Sinh hoạt lớp (Giáo viên nhập sau)',
  teacherName: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
  roomDefault: 'P.204 - Lớp 42QK1',
  status: 'in_progress',
  notes: 'Tiết sinh hoạt lớp do GVCN ThS. Trịnh Thị Thanh Nhàn phụ trách, nội dung chi tiết do giáo viên nhập sau.',
  syllabusOverview: 'Sơ kết đánh giá nề nếp chuyên cần, tác phong, trang phục, chuẩn bị tài liệu của sinh viên và triển khai kế hoạch học tập tuần tới.',
};

export const initialSubjects: Subject[] = [
  CLASS_MEETING_SUBJECT,
  {
    id: 'sub_tour',
    name: 'Thiết kế và điều hành tour',
    code: 'TOU101',
    color: 'emerald',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 18,
    currentLesson: 'Chuyên đề 3: Quy trình xây dựng tour Nha Trang - Khánh Hòa & Dự toán chi phí tuyến',
    teacherName: 'Cô Trịnh Thị Thanh Nhàn',
    roomDefault: 'Phòng Lab Lữ hành & Tour',
    notes: 'Môn chuyên ngành đang học do GVCN ThS. Trịnh Thị Thanh Nhàn trực tiếp giảng dạy.',
    syllabusOverview: 'Trang bị quy trình xây dựng chương trình du lịch trọn gói, tính giá tour, đàm phán nhà cung cấp dịch vụ và kỹ năng điều hành tour thực tế.',
    status: 'in_progress',
  },
  {
    id: 'sub_nhks',
    name: 'Quản trị KDKS-NH',
    code: 'NHKS201',
    color: 'indigo',
    credits: 4,
    totalPeriods: 60,
    completedPeriods: 24,
    currentLesson: 'Chương 4: Quản trị chi phí ẩm thực (F&B Cost Control) & Tiêu chuẩn vận hành nhà hàng',
    teacherName: 'Thầy Mai Anh Tuấn',
    roomDefault: 'P.201 - Giảng đường Khách sạn',
    notes: 'Môn chuyên ngành đang học do Thầy Mai Anh Tuấn phụ trách giảng dạy.',
    syllabusOverview: 'Tổng quan cơ cấu vận hành khách sạn - resort, quản lý chi phí F&B, chiến lược bán hàng và nâng cao trải nghiệm khách hàng sạn cao cấp.',
    status: 'in_progress',
  },
  {
    id: 'sub_letan',
    name: 'QT lễ tân',
    code: 'LET401',
    color: 'blue',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 20,
    currentLesson: 'Kỹ năng 5: Quy trình tiếp đón và làm thủ tục nhận buồng (Check-in) khách đoàn & VIP',
    teacherName: 'Cô Nguyễn Thị Hạnh',
    roomDefault: 'Phòng Mô phỏng Tiền sảnh Opera PMS',
    notes: 'Môn chuyên ngành đang học do Cô Nguyễn Thị Hạnh phụ trách giảng dạy.',
    syllabusOverview: 'Đào tạo chuẩn chức danh nhân viên và giám sát lễ tân: quy trình Check-in/out, đặt phòng, xử lý tình huống phát sinh và phần mềm quản lý PMS.',
    status: 'in_progress',
  },
  {
    id: 'sub_ban',
    name: 'NV bàn',
    code: 'BAN201',
    color: 'amber',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 0,
    currentLesson: 'Kế hoạch đào tạo: Sẽ học sau',
    teacherName: 'Bộ môn Nhà hàng',
    roomDefault: 'Phòng Thực hành Nhà hàng Á - Âu',
    notes: 'Môn học theo lộ trình đào tạo, lớp sẽ học sau.',
    syllabusOverview: 'Quy trình phục vụ bàn chuyên nghiệp theo tiêu chuẩn quốc tế: Set up bàn tiệc Á/Âu, bê khay, tiếp thức ăn, rót rượu.',
    status: 'upcoming',
  },
  {
    id: 'sub_bar',
    name: 'NV bar',
    code: 'BAR202',
    color: 'purple',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 0,
    currentLesson: 'Kế hoạch đào tạo: Sẽ học sau',
    teacherName: 'Bộ môn Pha chế',
    roomDefault: 'Quầy Bar Pha chế Thực hành',
    notes: 'Môn học theo lộ trình đào tạo, lớp sẽ học sau.',
    syllabusOverview: 'Kiến thức về các loại thức uống có cồn và không cồn, nghệ thuật pha chế Cocktail, Mocktail, Barista căn bản.',
    status: 'upcoming',
  },
  {
    id: 'sub_buong',
    name: 'NV buồng',
    code: 'BUO203',
    color: 'violet',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 0,
    currentLesson: 'Kế hoạch đào tạo: Sẽ học sau',
    teacherName: 'Bộ môn Khách sạn',
    roomDefault: 'Buồng Thực hành Khách sạn Mẫu',
    notes: 'Môn học theo lộ trình đào tạo, lớp sẽ học sau.',
    syllabusOverview: 'Quy trình dọn dẹp vệ sinh phòng khách sạn, làm giường tiêu chuẩn quốc tế, kiểm soát đồ giặt ủi, minibar.',
    status: 'upcoming',
  },
  {
    id: 'sub_event',
    name: 'QT tổ chức sự kiện - hội nghị',
    code: 'EVT301',
    color: 'rose',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 0,
    currentLesson: 'Kế hoạch đào tạo: Sẽ học sau',
    teacherName: 'Bộ môn Sự kiện',
    roomDefault: 'Hội trường Sự kiện MICE đa năng',
    notes: 'Môn học theo lộ trình đào tạo, lớp sẽ học sau.',
    syllabusOverview: 'Kỹ năng lập kế hoạch, dàn dựng, phân bổ nhân sự, âm thanh ánh sáng và điều phối tổ chức các hội nghị, hội thảo (MICE), triển lãm.',
    status: 'upcoming',
  },
  {
    id: 'sub_doanhnghiep',
    name: 'QT doanh nghiệp',
    code: 'DN302',
    color: 'teal',
    credits: 3,
    totalPeriods: 45,
    completedPeriods: 0,
    currentLesson: 'Kế hoạch đào tạo: Sẽ học sau',
    teacherName: 'Bộ môn Quản trị Kinh doanh',
    roomDefault: 'Phòng Máy tính Kinh tế & Khởi nghiệp',
    notes: 'Môn học theo lộ trình đào tạo, lớp sẽ học sau.',
    syllabusOverview: 'Nguyên lý quản trị doanh nghiệp du lịch, hoạch định chiến lược, tổ chức bộ máy và quản trị nguồn nhân lực trong kinh doanh.',
    status: 'upcoming',
  },
];

export const initialStudents: Student[] = [
  {
    id: 'sv_01',
    studentCode: '42QK1-01',
    name: 'Nguyễn Trần Khánh Vy',
    gender: 'Nữ',
    birthDate: '2005-04-12',
    group: 'Tổ 1 - Nghiệp vụ Lễ tân',
    phone: '0905123456',
    phoneParent: '0913888999',
    email: 'khanhvy.nguyen@student.edu.vn',
    address: '15 Trần Phú, Nha Trang, Khánh Hòa',
    notes: 'Tác phong dịch vụ xuất sắc, tiếng Anh giao tiếp lưu loát, lớp trưởng gương mẫu.',
    avatarColor: 'bg-indigo-600',
    conductScore: 98,
  },
  {
    id: 'sv_02',
    studentCode: '42QK1-02',
    name: 'Trần Đăng Khoa',
    gender: 'Nam',
    birthDate: '2005-08-23',
    group: 'Tổ 2 - Bộ phận F&B & Bar',
    phone: '0918765432',
    phoneParent: '0903112233',
    email: 'dangkhoa.tran@student.edu.vn',
    address: '42 Hùng Vương, Nha Trang, Khánh Hòa',
    notes: 'Kỹ năng nhà hàng - bar rất tốt, nhiệt tình tham gia hoạt động phong trào của trường.',
    avatarColor: 'bg-blue-600',
    conductScore: 95,
  },
  {
    id: 'sv_03',
    studentCode: '42QK1-03',
    name: 'Lê Hoàng Bảo Ngọc',
    gender: 'Nữ',
    birthDate: '2005-02-18',
    group: 'Tổ 1 - Nghiệp vụ Lễ tân',
    phone: '0935112244',
    phoneParent: '0912445566',
    email: 'baongoc.le@student.edu.vn',
    address: '78 Quang Trung, Nha Trang',
    notes: 'Ngoại hình sáng, giao tiếp chuẩn mực, chăm chỉ học hỏi trong giờ Quản trị lễ tân.',
    avatarColor: 'bg-emerald-600',
    conductScore: 96,
  },
  {
    id: 'sv_04',
    studentCode: '42QK1-04',
    name: 'Phạm Minh Tuấn',
    gender: 'Nam',
    birthDate: '2005-11-05',
    group: 'Tổ 3 - Hướng dẫn & Điều hành Tour',
    phone: '0988776655',
    phoneParent: '0908223344',
    email: 'minhtuan.pham@student.edu.vn',
    address: '03 Nguyễn Thị Minh Khai, Nha Trang',
    notes: 'Kiến thức tuyến điểm du lịch phong phú, thuyết minh tour Nha Trang - Khánh Hòa truyền cảm.',
    avatarColor: 'bg-teal-600',
    conductScore: 92,
  },
  {
    id: 'sv_05',
    studentCode: '42QK1-05',
    name: 'Võ Thị Thu Hà',
    gender: 'Nữ',
    birthDate: '2005-06-30',
    group: 'Tổ 4 - Nhà hàng & Khách sạn',
    phone: '0977223344',
    phoneParent: '0914556677',
    email: 'thuha.vo@student.edu.vn',
    address: '102 Lê Hồng Phong, Nha Trang',
    notes: 'Cẩn thận, khéo tay trong thực hành nhà hàng - khách sạn của Thầy Tuấn.',
    avatarColor: 'bg-rose-500',
    conductScore: 94,
  },
  {
    id: 'sv_06',
    studentCode: '42QK1-06',
    name: 'Hoàng Quốc Bảo',
    gender: 'Nam',
    birthDate: '2005-09-15',
    group: 'Tổ 2 - Bộ phận F&B & Bar',
    phone: '0944556677',
    phoneParent: '0905334455',
    email: 'quocbao.hoang@student.edu.vn',
    address: '56 Dã Tượng, Nha Trang',
    notes: 'Cần nhắc nhở đi học đúng giờ hơn ở tiết 1 chiều thứ 2 môn Thiết kế tour.',
    avatarColor: 'bg-amber-600',
    conductScore: 84,
  },
  {
    id: 'sv_07',
    studentCode: '42QK1-07',
    name: 'Đặng Thanh Thảo',
    gender: 'Nữ',
    birthDate: '2005-03-22',
    group: 'Tổ 3 - Hướng dẫn & Điều hành Tour',
    phone: '0966112233',
    phoneParent: '0918445566',
    email: 'thanhthao.dang@student.edu.vn',
    address: '19 Vân Đồn, Nha Trang',
    notes: 'Kỹ năng làm việc nhóm tốt, lập kế hoạch tour chi tiết.',
    avatarColor: 'bg-purple-600',
    conductScore: 90,
  },
  {
    id: 'sv_08',
    studentCode: '42QK1-08',
    name: 'Bùi Gia Huy',
    gender: 'Nam',
    birthDate: '2005-12-08',
    group: 'Tổ 4 - Nhà hàng & Khách sạn',
    phone: '0933998877',
    phoneParent: '0907112233',
    email: 'giahuy.bui@student.edu.vn',
    address: '88 Yersin, Nha Trang',
    notes: 'Tác phong học tập nghiêm túc, tham gia đóng góp thảo luận sôi nổi.',
    avatarColor: 'bg-cyan-600',
    conductScore: 88,
  },
];

export const initialDocuments: SubjectDocument[] = [
  {
    id: 'doc_tour_01',
    subjectId: 'sub_tour',
    title: 'Giáo trình Thiết kế Tour Du lịch & Phân tích Chi phí Tuyến điểm Khánh Hòa',
    fileName: 'GiaoTrinh_ThietKeTour_42QK1.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-10',
    teacherName: 'Cô Trịnh Thị Thanh Nhàn',
    description: 'Tài liệu hướng dẫn lập lịch trình tour, tính giá NET, giá bán và đàm phán nhà cung cấp tại Nha Trang - Khánh Hòa.',
  },
  {
    id: 'doc_tour_02',
    subjectId: 'sub_tour',
    title: 'Mẫu Bảng Tính Dự Toán Chi Phí & Kế Hoạch Điều Hành Tour Lữ Hành',
    fileName: 'Mau_DuToan_DieuHanhTour.xlsx',
    fileSize: '1.5 MB',
    fileType: 'xlsx',
    uploadedAt: '2025-02-25',
    teacherName: 'Cô Trịnh Thị Thanh Nhàn',
    description: 'Bảng tính Excel mẫu do ThS. Trịnh Thị Thanh Nhàn biên soạn cho lớp 42QK1 thực hành tính giá thành tour.',
  },
  {
    id: 'doc_nhks_01',
    subjectId: 'sub_nhks',
    title: 'Bài giảng Quản trị Kinh doanh Nhà hàng - Khách sạn & Tiêu chuẩn Phục vụ',
    fileName: 'BaiGiang_QuanTriKD_NHKS_ThayTuan.pptx',
    fileSize: '6.5 MB',
    fileType: 'pptx',
    uploadedAt: '2025-02-18',
    teacherName: 'Thầy Mai Anh Tuấn',
    description: 'Tài liệu quản trị chi phí ẩm thực F&B, định giá thực đơn và quy chuẩn phục vụ nhà hàng cao cấp.',
  },
  {
    id: 'doc_letan_01',
    subjectId: 'sub_letan',
    title: 'Sổ tay Nghiệp vụ Tiền sảnh: Quy trình Check-in/out & Giao tiếp Khách hàng',
    fileName: 'SoTay_NghiepVuLeTan_CoHanh.pdf',
    fileSize: '3.6 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-15',
    teacherName: 'Cô Nguyễn Thị Hạnh',
    description: 'Tài liệu chuẩn hóa chức danh lễ tân: đón tiếp khách đoàn, nhận phòng, xử lý tình huống phàn nàn và phần mềm khách sạn.',
  },
  {
    id: 'doc_ban_01',
    subjectId: 'sub_ban',
    title: 'Hình ảnh & Sơ đồ Tiêu chuẩn Set up Bàn tiệc Á - Âu (Fine Dining & Banquet)',
    fileName: 'Chuan_SetUpBanTiec_FineDining.pdf',
    fileSize: '6.4 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-28',
    teacherName: 'Thầy Đỗ Minh Tuấn',
    description: 'Tài liệu hình ảnh trực quan khoảng cách dao thìa nĩa, ly rượu vang, khăn ăn cho bàn tiệc 6 - 10 khách.',
  },
  {
    id: 'doc_bar_01',
    subjectId: 'sub_bar',
    title: 'Công thức 50 món Classic Cocktails quốc tế & Kỹ thuật Flair Bartending',
    fileName: 'ClassicCocktails_Recipe_Handbook.pdf',
    fileSize: '5.1 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-20',
    teacherName: 'Master Bartender Vũ Hoàng Hải',
    description: 'Tài liệu hướng dẫn tỷ lệ pha chế rượu nền, liqueur, syrup, garnish trang trí và an toàn vệ sinh quầy Bar.',
  },
  {
    id: 'doc_bplan_01',
    subjectId: 'sub_bplan',
    title: 'Khung Bản Kế hoạch Kinh doanh F&B Khởi nghiệp (Business Plan Canvas)',
    fileName: 'Mau_KeHoachKinhDoanh_Startup_FB.docx',
    fileSize: '1.9 MB',
    fileType: 'docx',
    uploadedAt: '2025-02-12',
    teacherName: 'TS. Đặng Quốc Hùng',
    description: 'Mẫu phân tích thị trường, định vị thương hiệu, bảng dự toán dòng tiền và chỉ số tài chính cho dự án mở quán cafe/nhà hàng.',
  },
  {
    id: 'doc_ktdl_01',
    subjectId: 'sub_ktdl',
    title: 'Báo cáo Kinh tế Du lịch Việt Nam & Xu hướng Du lịch Toàn cầu UNWTO',
    fileName: 'BaoCao_KinhTeDuLich_2024.pdf',
    fileSize: '3.9 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-05',
    teacherName: 'ThS. Bùi Lan Phương',
    description: 'Dữ liệu phân tích luồng khách quốc tế, chi tiêu trung bình và đóng góp của du lịch vào kinh tế các địa phương.',
  },
  {
    id: 'doc_buong_01',
    subjectId: 'sub_buong',
    title: 'Quy trình Làm sạch Buồng phòng Tiêu chuẩn Quốc tế & Kỹ thuật Gấp khăn Nghệ thuật',
    fileName: 'QuyTrinh_NghiepVuBuong_Housekeeping.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    uploadedAt: '2025-02-16',
    teacherName: 'Cô Trịnh Thanh Mai',
    description: 'Trình tự 16 bước dọn phòng khách trả, an toàn hóa chất tẩy rửa, cách gấp thiên nga, hoa sen bằng khăn tắm trang trí giường tân hôn.',
  },
];

export const initialNotes: SubjectNote[] = [
  {
    id: 'note_01',
    subjectId: 'sub_tour',
    title: 'Lưu ý thực tế cho chuyến đi tiền trạm Tuyến Nha Trang - Đà Lạt',
    content: 'Sinh viên nhớ kiểm tra trước danh sách giấy tờ tùy thân, chuẩn bị kịch bản thuyết minh đèo Khánh Lê và khảo sát ít nhất 2 nhà hàng phục vụ khách đoàn.',
    createdAt: '2025-03-01',
    author: 'ThS. Nguyễn Hoàng Nam',
    isImportant: true,
  },
  {
    id: 'note_02',
    subjectId: 'sub_bar',
    title: 'Nội quy phòng thực hành Bar và bảo quản chai rượu',
    content: 'Tất cả sinh viên phải đeo tạp dề đen, mang giày chống trơn trượt. Cuối buổi mỗi nhóm phân công 2 bạn vệ sinh sạch thảm bar mat và khay đá.',
    createdAt: '2025-03-03',
    author: 'Master Bartender Vũ Hoàng Hải',
    isImportant: true,
  },
  {
    id: 'note_03',
    subjectId: 'sub_letan',
    title: 'Quy định trang phục chuẩn lễ tân trong các buổi thi mô phỏng',
    content: 'Nữ sinh viên mặc áo dài/đồng phục vest lễ tân, tóc búi gọn bằng lưới màu đen, trang điểm nhẹ nhàng lịch sự. Nam mặc vest đen caravat xanh navy.',
    createdAt: '2025-02-28',
    author: 'Cô Phan Thục Quyên',
    isImportant: false,
  },
  {
    id: 'note_04',
    subjectId: 'sub_ban',
    title: 'Chuẩn bị đồ dùng cho bài kiểm tra Set up bàn tiệc Châu Âu',
    content: 'Mang theo khăn napkin màu trắng sạch sẽ để thực hiện 5 kiểu gấp khăn bàn tiệc căn bản. Chuẩn bị đồng phục gile đen và găng tay trắng phục vụ.',
    createdAt: '2025-03-05',
    author: 'Thầy Đỗ Minh Tuấn',
    isImportant: false,
  },
];

export const initialDisciplineRecords: DisciplineRecord[] = [
  {
    id: 'disc_01',
    studentId: 'sv_01',
    date: '2025-03-05',
    subjectId: 'sub_letan',
    criterion: 'positive',
    type: 'positive',
    points: 5,
    description: 'Trang phục lễ tân hoàn hảo, tác phong chuẩn 5 sao được giáo viên khen ngợi trước lớp.',
    reportedBy: 'Cô Nguyễn Thị Hạnh',
  },
  {
    id: 'disc_02',
    studentId: 'sv_02',
    date: '2025-03-04',
    subjectId: 'sub_nhks',
    criterion: 'positive',
    type: 'positive',
    points: 5,
    description: 'Tích cực xung phong chuẩn bị đồ dùng thực hành và vệ sinh phòng học sau giờ giảng.',
    reportedBy: 'Thầy Mai Anh Tuấn',
  },
  {
    id: 'disc_03',
    studentId: 'sv_06',
    date: '2025-03-07',
    subjectId: 'sub_tour',
    criterion: 'absent_unexcused',
    type: 'violation',
    points: -5,
    description: 'Vắng học không phép (-5 điểm nề nếp).',
    reportedBy: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
  },
  {
    id: 'disc_04',
    studentId: 'sv_08',
    date: '2025-03-06',
    subjectId: 'sub_nhks',
    criterion: 'slipper',
    type: 'violation',
    points: -5,
    description: 'Đi dép lê vào lớp học thực hành không đúng quy định giày tây/búp bê (-5 điểm).',
    reportedBy: 'Thầy Mai Anh Tuấn',
  },
  {
    id: 'disc_05',
    studentId: 'sv_07',
    date: '2025-03-05',
    subjectId: 'sub_letan',
    criterion: 'wrong_uniform',
    type: 'violation',
    points: -5,
    description: 'Sai đồng phục nghề nghiệp, không đeo bảng tên và cà vạt chuẩn (-5 điểm).',
    reportedBy: 'Cô Nguyễn Thị Hạnh',
  },
  {
    id: 'disc_06',
    studentId: 'sv_09',
    date: '2025-03-04',
    subjectId: 'sub_tour',
    criterion: 'no_materials',
    type: 'violation',
    points: -5,
    description: 'Không chuẩn bị tài liệu học tập, giáo trình và sổ tay tuyến tour khi lên lớp (-5 điểm).',
    reportedBy: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
  },
  {
    id: 'disc_07',
    studentId: 'sv_10',
    date: '2025-03-03',
    subjectId: 'sub_letan',
    criterion: 'hair',
    type: 'violation',
    points: -5,
    description: 'Vi phạm quy định tóc: nhuộm tóc màu sáng, chưa búi gọn gàng theo chuẩn tác phong du lịch (-5 điểm).',
    reportedBy: 'Cô Nguyễn Thị Hạnh',
  },
];

export function generateInitialScores(): ScoreRecord[] {
  const records: ScoreRecord[] = [];

  // Điểm theo các môn học để trống (null) cho giáo viên nhập sau theo yêu cầu
  initialStudents.forEach((student) => {
    initialSubjects.forEach((subject) => {
      records.push({
        studentId: student.id,
        subjectId: subject.id,
        attendanceScore: null,
        practicalScores: [null, null],
        midtermScore: null,
        finalScore: null,
        notes: undefined,
      });
    });
  });

  return records;
}

export function generateInitialSubjectAttendance(): SubjectAttendanceRecord[] {
  const records: SubjectAttendanceRecord[] = [];
  const dates = ['2025-03-03', '2025-03-04', '2025-03-05', '2025-03-06', '2025-03-07'];

  // 3 active subjects currently in session for class 42QK1
  const subjectByDate: Record<string, string[]> = {
    '2025-03-03': ['sub_tour'],
    '2025-03-04': ['sub_nhks'],
    '2025-03-05': ['sub_letan'],
    '2025-03-06': ['sub_tour'],
    '2025-03-07': ['sub_nhks'],
  };

  dates.forEach((date) => {
    const subs = subjectByDate[date] || ['sub_tour'];
    subs.forEach((subId, pIdx) => {
      initialStudents.forEach((student) => {
        let status: SubjectAttendanceRecord['status'] = 'present';
        let reason: string | undefined = undefined;

        if (student.id === 'sv_06' && date === '2025-03-03') {
          status = 'late';
          reason = 'Đến muộn 15 phút do hỏng xe trên đường';
        } else if (student.id === 'sv_08' && date === '2025-03-06') {
          status = 'absent_excused';
          reason = 'Có đơn xin phép gia đình có việc hiếu';
        } else if (student.id === 'sv_06' && date === '2025-03-07') {
          status = 'absent_unexcused';
          reason = 'Vắng không phép (-5đ)';
        }

        records.push({
          id: `att_${date}_${subId}_${student.id}`,
          subjectId: subId,
          date,
          period: (pIdx + 1) * 2,
          studentId: student.id,
          status,
          reason,
        });
      });
    });
  });

  return records;
}

export const initialWeeklyDocs: WeeklyScheduleDoc[] = [
  {
    id: 'wdoc_1',
    weekNumber: 1,
    weekLabel: 'Tuần 1 (03/03/2025 - 09/03/2025)',
    startDate: '2025-03-03',
    endDate: '2025-03-09',
    fileName: 'TKB_Tuan_01_Lop_42QK1_TCKT_KhanhHoa.pdf',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    uploadedAt: '2025-03-01',
    uploadedBy: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
    description: 'Thời khóa biểu tuần 1 buổi chiều (13h30 - 17h00). Thứ Năm và Thứ Bảy lớp được NGHỈ học.',
  },
  {
    id: 'wdoc_2',
    weekNumber: 2,
    weekLabel: 'Tuần 2 (10/03/2025 - 16/03/2025)',
    startDate: '2025-03-10',
    endDate: '2025-03-16',
    fileName: 'TKB_Tuan_02_Lop_42QK1_TCKT_KhanhHoa.xlsx',
    fileSize: '680 KB',
    fileType: 'xlsx',
    uploadedAt: '2025-03-08',
    uploadedBy: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)',
    description: 'Lịch học chi tiết tuần 2 buổi chiều (13h30 - 17h00). Thứ Năm được NGHỈ ôn tập thực hành.',
  },
];

export const initialSchedule: ScheduleItem[] = [
  // Thứ 2: 4 Tiết Chiều (13h30 - 17h00) - Môn Thiết kế và điều hành tour (ThS. Trịnh Thị Thanh Nhàn)
  { id: 'sch_2_1', dayOfWeek: 2, period: 1, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Tổng quan quy trình thiết kế và điều hành tour lữ hành', weekNumber: 1 },
  { id: 'sch_2_2', dayOfWeek: 2, period: 2, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Lập dự toán chi phí tuyến Tour Nha Trang - Khánh Hòa', weekNumber: 1 },
  { id: 'sch_2_3', dayOfWeek: 2, period: 3, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Kỹ năng đàm phán dịch vụ khách sạn & nhà hàng đối tác', weekNumber: 1 },
  { id: 'sch_2_4', dayOfWeek: 2, period: 4, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Xử lý các tình huống phát sinh và rủi ro điều hành tour', weekNumber: 1 },

  // Thứ 3: 4 Tiết Chiều (13h30 - 17h00) - Môn Quản trị KDKS-NH (Thầy Mai Anh Tuấn)
  { id: 'sch_3_1', dayOfWeek: 3, period: 1, subjectId: 'sub_nhks', room: 'P.201 - Giảng đường Khách sạn', teacher: 'Thầy Mai Anh Tuấn', lessonContent: 'Quản trị doanh thu khách sạn (Chỉ số RevPAR, ADR, Occupancy)', weekNumber: 1 },
  { id: 'sch_3_2', dayOfWeek: 3, period: 2, subjectId: 'sub_nhks', room: 'P.201 - Giảng đường Khách sạn', teacher: 'Thầy Mai Anh Tuấn', lessonContent: 'Chiến lược tối ưu hóa công suất phòng mùa cao điểm & thấp điểm', weekNumber: 1 },
  { id: 'sch_3_3', dayOfWeek: 3, period: 3, subjectId: 'sub_nhks', room: 'P.201 - Giảng đường Khách sạn', teacher: 'Thầy Mai Anh Tuấn', lessonContent: 'Quản trị chất lượng dịch vụ và tiêu chuẩn nhà hàng 5 sao', weekNumber: 1 },
  { id: 'sch_3_4', dayOfWeek: 3, period: 4, subjectId: 'sub_nhks', room: 'P.201 - Giảng đường Khách sạn', teacher: 'Thầy Mai Anh Tuấn', lessonContent: 'Kiểm soát chi phí nguyên vật liệu F&B và định lượng thực đơn', weekNumber: 1 },

  // Thứ 4: 4 Tiết Chiều (13h30 - 17h00) - Môn QT lễ tân (Cô Nguyễn Thị Hạnh)
  { id: 'sch_4_1', dayOfWeek: 4, period: 1, subjectId: 'sub_letan', room: 'Phòng Tiền sảnh Opera PMS', teacher: 'Cô Nguyễn Thị Hạnh', lessonContent: 'Quy trình tiếp đón khách đoàn & nhận phòng (Check-in)', weekNumber: 1 },
  { id: 'sch_4_2', dayOfWeek: 4, period: 2, subjectId: 'sub_letan', room: 'Phòng Tiền sảnh Opera PMS', teacher: 'Cô Nguyễn Thị Hạnh', lessonContent: 'Thực hành thao tác hệ thống lễ tân khách sạn Opera PMS', weekNumber: 1 },
  { id: 'sch_4_3', dayOfWeek: 4, period: 3, subjectId: 'sub_letan', room: 'Phòng Tiền sảnh Opera PMS', teacher: 'Cô Nguyễn Thị Hạnh', lessonContent: 'Kỹ năng xử lý phàn nàn của khách lưu trú (Guest Complaints)', weekNumber: 1 },
  { id: 'sch_4_4', dayOfWeek: 4, period: 4, subjectId: 'sub_letan', room: 'Phòng Tiền sảnh Opera PMS', teacher: 'Cô Nguyễn Thị Hạnh', lessonContent: 'Quy trình trả buồng (Check-out) và quyết toán hóa đơn', weekNumber: 1 },

  // Thứ 5: NGHỈ HỌC (Không có lịch học - Giáo viên có thể chỉnh sửa thêm môn hoặc giữ nghỉ)
  { id: 'sch_5_1', dayOfWeek: 5, period: 1, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học theo kế hoạch đào tạo', weekNumber: 1, isDayOff: true },
  { id: 'sch_5_2', dayOfWeek: 5, period: 2, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học theo kế hoạch đào tạo', weekNumber: 1, isDayOff: true },
  { id: 'sch_5_3', dayOfWeek: 5, period: 3, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học theo kế hoạch đào tạo', weekNumber: 1, isDayOff: true },
  { id: 'sch_5_4', dayOfWeek: 5, period: 4, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học theo kế hoạch đào tạo', weekNumber: 1, isDayOff: true },

  // Thứ 6: 4 Tiết Chiều (13h30 - 17h00) - Môn Thiết kế và điều hành tour (ThS. Trịnh Thị Thanh Nhàn)
  { id: 'sch_6_1', dayOfWeek: 6, period: 1, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Xây dựng chương trình teambuilding & du lịch trải nghiệm', weekNumber: 1 },
  { id: 'sch_6_2', dayOfWeek: 6, period: 2, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Phân tích bảng báo giá và hợp đồng lữ hành quốc tế', weekNumber: 1 },
  { id: 'sch_6_3', dayOfWeek: 6, period: 3, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Thực hành thuyết minh tuyến điểm danh thắng Nha Trang', weekNumber: 1 },
  { id: 'sch_6_4', dayOfWeek: 6, period: 4, subjectId: 'sub_tour', room: 'Phòng Lab Lữ hành & Tour', teacher: 'ThS. Trịnh Thị Thanh Nhàn', lessonContent: 'Thẩm định chương trình tour và đánh giá bài thực hành nhóm', weekNumber: 1 },

  // Thứ 7: Tiết 1 - 3: Nghỉ học | Tiết 4: Tiết Sinh hoạt lớp (GVCN ThS. Trịnh Thị Thanh Nhàn - Giáo viên nhập sau)
  { id: 'sch_7_1', dayOfWeek: 7, period: 1, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học cuối tuần', weekNumber: 1, isDayOff: true },
  { id: 'sch_7_2', dayOfWeek: 7, period: 2, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học cuối tuần', weekNumber: 1, isDayOff: true },
  { id: 'sch_7_3', dayOfWeek: 7, period: 3, subjectId: 'sub_off', room: 'Nghỉ', teacher: 'Không có tiết', lessonContent: 'Nghỉ học cuối tuần', weekNumber: 1, isDayOff: true },
  { id: 'sch_7_4', dayOfWeek: 7, period: 4, subjectId: 'sub_shl', room: 'P.204 - Lớp 42QK1', teacher: 'ThS. Trịnh Thị Thanh Nhàn (GVCN)', lessonContent: 'Sinh hoạt lớp định kỳ (Giáo viên nhập sau)', weekNumber: 1, isDayOff: false, isClassMeeting: true },
];

// Helper calculations
export function calculateSubjectAverage(score: ScoreRecord | undefined): number | null {
  if (!score) return null;
  const att = score.attendanceScore;
  const pScores = score.practicalScores.filter((s): s is number => s !== null && !isNaN(s));
  const mid = score.midtermScore;
  const fin = score.finalScore;

  if (att === null && pScores.length === 0 && mid === null && fin === null) return null;

  // Weight formula:
  // Chuyên cần 10%, Thực hành trung bình 30%, Giữa kỳ 20%, Cuối kỳ 40%
  let totalScore = 0;
  let totalWeight = 0;

  if (att !== null && !isNaN(att)) {
    totalScore += att * 0.1;
    totalWeight += 0.1;
  }

  if (pScores.length > 0) {
    const avgPract = pScores.reduce((a, b) => a + b, 0) / pScores.length;
    totalScore += avgPract * 0.3;
    totalWeight += 0.3;
  }

  if (mid !== null && !isNaN(mid)) {
    totalScore += mid * 0.2;
    totalWeight += 0.2;
  }

  if (fin !== null && !isNaN(fin)) {
    totalScore += fin * 0.4;
    totalWeight += 0.4;
  }

  if (totalWeight === 0) return null;
  const finalAverage = totalScore / totalWeight;
  return Math.round(finalAverage * 10) / 10;
}

export function getAcademicRating(gpa: number | null): AcademicRating {
  if (gpa === null) return 'Khá';
  if (gpa >= 9.0) return 'Xuất sắc';
  if (gpa >= 8.0) return 'Giỏi';
  if (gpa >= 6.5) return 'Khá';
  if (gpa >= 5.0) return 'Trung bình';
  return 'Yếu';
}

export function getAcademicRatingColor(rating: AcademicRating) {
  switch (rating) {
    case 'Xuất sắc':
      return { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' };
    case 'Giỏi':
      return { bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' };
    case 'Khá':
      return { bg: 'bg-blue-50 text-blue-700', border: 'border-blue-200' };
    case 'Trung bình':
      return { bg: 'bg-amber-50 text-amber-700', border: 'border-amber-200' };
    case 'Yếu':
      return { bg: 'bg-rose-50 text-rose-700', border: 'border-rose-200' };
  }
}

export function calculateStudentOverallGPA(
  studentId: string,
  scores: ScoreRecord[],
  subjects: Subject[]
): number | null {
  const studentScores = scores.filter((s) => s.studentId === studentId);
  let totalPoints = 0;
  let totalCredits = 0;

  studentScores.forEach((sc) => {
    const avg = calculateSubjectAverage(sc);
    const sub = subjects.find((s) => s.id === sc.subjectId);
    if (avg !== null && sub) {
      totalPoints += avg * sub.credits;
      totalCredits += sub.credits;
    }
  });

  if (totalCredits === 0) return null;
  return Math.round((totalPoints / totalCredits) * 10) / 10;
}

export function calculateStudentAttendanceStats(
  studentId: string,
  attendance: SubjectAttendanceRecord[]
) {
  const records = attendance.filter((a) => a.studentId === studentId);
  if (records.length === 0) return { total: 0, present: 0, late: 0, excused: 0, unexcused: 0, rate: 100 };

  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const late = records.filter((r) => r.status === 'late').length;
  const excused = records.filter((r) => r.status === 'absent_excused').length;
  const unexcused = records.filter((r) => r.status === 'absent_unexcused').length;

  // Rate: present count 100%, late counts as 50%
  const rate = Math.round(((present + late * 0.5) / total) * 100);

  return {
    total,
    present,
    late,
    excused,
    unexcused,
    rate,
  };
}

export function getDisciplineCriterionLabel(crit: DisciplineCriterion): { label: string; icon: string; tag: string } {
  switch (crit) {
    case 'absent_unexcused':
      return { label: 'Vắng không phép (-5đ)', icon: '🚪', tag: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'slipper':
      return { label: 'Đi dép lê (-5đ)', icon: '🩴', tag: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'wrong_uniform':
      return { label: 'Sai đồng phục (-5đ)', icon: '👔', tag: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'no_materials':
      return { label: 'Không chuẩn bị tài liệu (-5đ)', icon: '📚', tag: 'bg-red-50 text-red-700 border-red-200' };
    case 'hair':
      return { label: 'Vi phạm quy định tóc (-5đ)', icon: '💇', tag: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'posture':
      return { label: 'Vi phạm tác phong (-5đ)', icon: '🧍', tag: 'bg-pink-50 text-pink-700 border-pink-200' };
    case 'uniform':
      return { label: 'Trang phục nghề nghiệp', icon: '👔', tag: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'hygiene':
      return { label: 'Giữ gìn vệ sinh phòng/quầy', icon: '🧹', tag: 'bg-teal-50 text-teal-700 border-teal-200' };
    case 'footwear':
      return { label: 'Giày dép chuẩn quy định', icon: '👞', tag: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'punctuality':
      return { label: 'Đi học đúng giờ', icon: '⏰', tag: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'focus':
      return { label: 'Tác phong học tập (không việc riêng)', icon: '📖', tag: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'phone':
      return { label: 'Không sử dụng điện thoại', icon: '📵', tag: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'behavior':
      return { label: 'Văn minh, không đánh nhau', icon: '🤝', tag: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'positive':
      return { label: 'Khen thưởng / Tuyên dương (+5đ)', icon: '⭐', tag: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    default:
      return { label: 'Nề nếp khác', icon: '📋', tag: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}
