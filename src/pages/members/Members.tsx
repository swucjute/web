import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { User } from '../../types';
import { format } from 'date-fns';
import { Search, Plus, Edit2, Trash2, X, Users, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Members() {
  const { users, isAdmin, isLeader, addUser, updateUser, deleteUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as 'admin' | 'leader' | 'member',
    phone: '',
    birthDate: '',
    joinDate: '',
    department: '청년부',
    position: '',
  });

  const canEdit = isAdmin() || isLeader();

  const filteredUsers = users.filter(user =>
    user.isActive &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser({ ...formData, isActive: true });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'member',
      phone: '',
      birthDate: '',
      joinDate: '',
      department: '청년부',
      position: '',
    });
    setEditingUser(null);
    setIsDrawerOpen(false);
  };


  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteUser(id);
    }
  };

  const getRoleStyle = (role: string) => {
    if (role === 'admin') return 'bg-red-100 text-red-700';
    if (role === 'leader') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'admin') return '관리자';
    if (role === 'leader') return '리더';
    return '회원';
  };

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800">교적 관리</h1>
            <p className="text-xs text-gray-500">총 {filteredUsers.length}명</p>
          </div>
          {canEdit && (
            <button
              onClick={() => { setEditingUser(null); setIsDrawerOpen(true); }}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              추가
            </button>
          )}
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Member List */}
      <div className="px-4 py-3 space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">회원이 없습니다</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{user.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleStyle(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    {user.position && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{user.position}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={11} />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={11} />
                      <span>등록: {format(new Date(user.joinDate), 'yyyy-MM-dd')}</span>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => navigate(`/members/edit/${user.id}`)}
                      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 active:bg-blue-100 transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 active:bg-red-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Sheet Drawer */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingUser ? '회원 수정' : '회원 추가'}</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">이름 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">이메일 *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">비밀번호 *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">권한 *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">회원</SelectItem>
                      <SelectItem value="leader">리더</SelectItem>
                      {isAdmin() && <SelectItem value="admin">관리자</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">전화번호 *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">생년월일 *</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">등록일 *</Label>
                  <Input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">직책</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition"
                  >
                    {editingUser ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
