import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';
import { Student, Gender } from '../types';

interface AddEditStudentModalProps {
  isOpen: boolean;
  studentToEdit: Student | null;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id'>, studentId?: string) => void;
  nextStudentCode: string;
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-rose-500',
  'bg-pink-600',
  'bg-amber-600',
  'bg-cyan-600',
];

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  studentToEdit,
  onClose,
  onSave,
  nextStudentCode,
}) => {
  const [name, setName] = useState('');
  const [studentCode, setStudentCode] = useState(nextStudentCode);
  const [gender, setGender] = useState<Gender>('Nam');
  const [birthDate, setBirthDate] = useState('2009-01-01');
  const [group, setGroup] = useState('Tổ 1');
  const [phoneParent, setPhoneParent] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState('bg-indigo-600');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setStudentCode(studentToEdit.studentCode);
      setGender(studentToEdit.gender);
      setBirthDate(studentToEdit.birthDate);
      setGroup(studentToEdit.group);
      setPhoneParent(studentToEdit.phoneParent);
      setAddress(studentToEdit.address || '');
      setNotes(studentToEdit.notes || '');
      setAvatarColor(studentToEdit.avatarColor);
    } else {
      setName('');
      setStudentCode(nextStudentCode);
      setGender('Nam');
      setBirthDate('2009-05-15');
      setGroup('Tổ 1');
      setPhoneParent('');
      setAddress('');
      setNotes('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    }
    setErrorMsg('');
  }, [studentToEdit, nextStudentCode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên học sinh.');
      return;
    }
    if (!studentCode.trim()) {
      setErrorMsg('Vui lòng nhập mã học sinh.');
      return;
    }
    if (!phoneParent.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại phụ huynh để liên lạc.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        studentCode: studentCode.trim(),
        gender,
        birthDate,
        group,
        phoneParent: phoneParent.trim(),
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        avatarColor,
        conductScore: studentToEdit ? studentToEdit.conductScore : 100,
      },
      studentToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {studentToEdit ? (
              <UserCheck className="h-5 w-5 text-indigo-600" />
            ) : (
              <UserPlus className="h-5 w-5 text-indigo-600" />
            )}
            <h3 className="text-base font-bold text-slate-900">
              {studentToEdit ? 'Chỉnh Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới Vào Lớp'}
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
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Họ và tên */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-modal-student-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Minh Khôi"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            {/* Mã học sinh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-modal-student-code"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Phân tổ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tổ sinh hoạt</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>

            {/* SĐT Phụ huynh */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại phụ huynh <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneParent}
                onChange={(e) => setPhoneParent(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            {/* Địa chỉ */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ thường trú</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 25 Đường số 3, Phường 4, Quận 3"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Ghi chú */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú của giáo viên</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Học tốt môn Toán, cần rèn thêm kỹ năng thuyết trình..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
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
              id="btn-save-student-modal"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {studentToEdit ? 'Lưu Thay Đổi' : 'Thêm Học Sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
