import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Plus, TrendingUp, TrendingDown, Wallet, X, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Finance() {
  const navigate = useNavigate();
  const { currentUser, isLeader } = useAuth();
  const { finances, addFinance, deleteFinance } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const canEdit = isLeader();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFinance({
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      createdBy: currentUser?.id || '',
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteFinance(id);
    }
  };

  const sortedFinances = [...finances].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const balance = totalIncome - totalExpense;

  const filteredFinances = sortedFinances.filter(f => {
    if (activeTab === 'all') return true;
    return f.type === activeTab;
  });

  // Chart data
  const monthlyData = finances.reduce((acc: any, finance) => {
    const month = format(new Date(finance.date), 'MM월');
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (finance.type === 'income') acc[month].income += finance.amount;
    else acc[month].expense += finance.amount;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-6);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/more')}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition shrink-0"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">재정 관리</h1>
              <p className="text-xs text-gray-500">전체 거래 내역</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              추가
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
            <TrendingUp size={18} className="text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-700 mb-0.5">수입</p>
            <p className="text-sm font-bold text-green-700">{(totalIncome / 10000).toFixed(0)}만원</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
            <TrendingDown size={18} className="text-red-500 mx-auto mb-1" />
            <p className="text-xs text-red-600 mb-0.5">지출</p>
            <p className="text-sm font-bold text-red-600">{(totalExpense / 10000).toFixed(0)}만원</p>
          </div>
          <div className={`rounded-2xl p-3 text-center border ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
            <Wallet size={18} className={`mx-auto mb-1 ${balance >= 0 ? 'text-blue-600' : 'text-orange-500'}`} />
            <p className={`text-xs mb-0.5 ${balance >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>잔액</p>
            <p className={`text-sm font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
              {(Math.abs(balance) / 10000).toFixed(0)}만원
            </p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm">월별 수입/지출</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/10000).toFixed(0)}만`} />
                <Tooltip formatter={(value: any) => `${value.toLocaleString()}원`} />
                <Bar dataKey="income" name="수입" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expense" name="지출" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(['all', 'income', 'expense'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {tab === 'all' ? '전체' : tab === 'income' ? '수입' : '지출'}
              </button>
            ))}
          </div>

          {filteredFinances.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">거래 내역이 없습니다</p>
            </div>
          ) : (
            <div>
              {filteredFinances.map((finance, idx) => (
                <div
                  key={finance.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${idx < filteredFinances.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    finance.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {finance.type === 'income'
                      ? <TrendingUp size={16} className="text-green-600" />
                      : <TrendingDown size={16} className="text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{finance.category}</p>
                    <p className="text-xs text-gray-500">{format(new Date(finance.date), 'yyyy-MM-dd')}</p>
                    {finance.description && (
                      <p className="text-xs text-gray-400 truncate">{finance.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <p className={`text-sm font-semibold ${finance.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {finance.type === 'income' ? '+' : '-'}{finance.amount.toLocaleString()}원
                    </p>
                    {canEdit && (
                      <button
                        onClick={() => handleDelete(finance.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 active:bg-red-100 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">거래 추가</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">유형 *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">수입</SelectItem>
                      <SelectItem value="expense">지출</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">카테고리 *</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="예: 헌금, 식비, 교재비"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">금액 *</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">날짜 *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">설명</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="상세 설명..."
                    rows={3}
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
                    추가
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
