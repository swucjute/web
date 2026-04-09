import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import {
  Plus, ClipboardList, X, TrendingUp, ChevronRight,
  Pencil, Trash2, Loader2, CheckCircle2,
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import { ko } from 'date-fns/locale';

export function Survey() {
  const { currentUser, isAdmin, isLeader } = useAuth();
  const {
    surveys, surveysLoading,
    addSurvey, updateSurvey, deleteSurvey, submitSurveyResponse,
  } = useData();

  // ── 목록 뷰 상태 ────────────────────────────────────
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [surveyViewMode, setSurveyViewMode] = useState<'respond' | 'results'>('respond');
  const [surveyAnswers, setSurveyAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── 생성 폼 상태 ────────────────────────────────────
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'text' as 'text' | 'choice' | 'multiple',
    options: [''],
  });
  const [creating, setCreating] = useState(false);

  // ── 수정 시트 상태 (제목·설명·마감일만) ───────────────
  const [editingSurvey, setEditingSurvey] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', deadline: '' });
  const [saving, setSaving] = useState(false);

  const canManage = isLeader();

  // ── 도우미 ──────────────────────────────────────────
  const hasUserResponded = (survey: any) =>
    survey.responses?.some((r: any) => r.userId === currentUser?.id);

  const getResults = (question: any, responses: any[]) => {
    const answers = responses.map((r: any) => r.answers[question.id]).filter(Boolean);
    if (question.type === 'text') return answers;
    const counts: any = {};
    question.options?.forEach((opt: string) => { counts[opt] = 0; });
    if (question.type === 'choice') {
      answers.forEach((a: string) => { if (counts[a] !== undefined) counts[a]++; });
    } else {
      answers.forEach((arr: string[]) => {
        if (Array.isArray(arr)) arr.forEach((a) => { if (counts[a] !== undefined) counts[a]++; });
      });
    }
    return counts;
  };

  const activeSurveys = surveys.filter((s) => s.isActive && !isPast(new Date(s.deadline)));
  const closedSurveys = surveys.filter((s) => !s.isActive || isPast(new Date(s.deadline)));

  // ── 핸들러 ──────────────────────────────────────────
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return;
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.type !== 'text' ? newQuestion.options.filter((o) => o.trim()) : undefined,
      },
    ]);
    setNewQuestion({ question: '', type: 'text', options: [''] });
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || questions.length === 0) return;
    setCreating(true);
    try {
      await addSurvey({
        title: formData.title,
        description: formData.description,
        questions,
        createdBy: currentUser.id,
        deadline: formData.deadline,
        isActive: true,
      });
      setFormData({ title: '', description: '', deadline: '' });
      setQuestions([]);
      setIsCreateDrawerOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!currentUser || !selectedSurvey) return;
    setSubmitting(true);
    try {
      await submitSurveyResponse(selectedSurvey.id, currentUser.id, currentUser.name, surveyAnswers);
      setSubmitted(true);
      setTimeout(() => {
        setSelectedSurvey(null);
        setSurveyAnswers({});
        setSubmitted(false);
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (survey: any) => {
    setEditingSurvey(survey);
    setEditForm({ title: survey.title, description: survey.description, deadline: survey.deadline });
    setSelectedSurvey(null);
  };

  const handleSaveEdit = async () => {
    if (!editingSurvey) return;
    setSaving(true);
    try {
      await updateSurvey(editingSurvey.id, {
        title: editForm.title,
        description: editForm.description,
        deadline: editForm.deadline,
      });
      setEditingSurvey(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 이 설문을 삭제하시겠습니까?')) return;
    await deleteSurvey(id);
    setSelectedSurvey(null);
  };

  // ── 렌더 ────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">설문 조사</h1>
            <p className="text-xs text-gray-500">진행 중 {activeSurveys.length}개</p>
          </div>
          {canManage && (
            <button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              만들기
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-3 space-y-4">
        {surveysLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="text-blue-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Active */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">진행 중인 설문</h2>
              {activeSurveys.length === 0 ? (
                <div className="bg-white rounded-2xl py-10 text-center border border-gray-100">
                  <ClipboardList size={36} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">진행 중인 설문이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSurveys.map((survey) => (
                    <button
                      key={survey.id}
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setSurveyViewMode('respond');
                        setSurveyAnswers({});
                        setSubmitted(false);
                      }}
                      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left active:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <ClipboardList size={18} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-800 text-sm truncate">{survey.title}</p>
                            {hasUserResponded(survey) ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">완료</span>
                            ) : (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full shrink-0">미응답</span>
                            )}
                          </div>
                          {survey.description && (
                            <p className="text-xs text-gray-500 truncate mb-1">{survey.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>질문 {survey.questions.length}개</span>
                            <span>응답 {survey.responses?.length ?? 0}명</span>
                            <span>마감 {format(new Date(survey.deadline), 'M월 d일', { locale: ko })}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Closed */}
            {closedSurveys.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-2">종료된 설문</h2>
                <div className="space-y-2">
                  {closedSurveys.map((survey) => (
                    <button
                      key={survey.id}
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setSurveyViewMode(canManage ? 'results' : 'respond');
                        setSurveyAnswers({});
                        setSubmitted(false);
                      }}
                      className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left opacity-70 active:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                          <ClipboardList size={18} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-600 text-sm truncate">{survey.title}</p>
                          <p className="text-xs text-gray-400">응답 {survey.responses?.length ?? 0}명</p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">종료</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Survey Detail Bottom Sheet ── */}
      {selectedSurvey && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedSurvey(null)} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className="font-bold text-gray-800">{selectedSurvey.title}</h2>
                  {selectedSurvey.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{selectedSurvey.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {canManage && (
                    <>
                      <button onClick={() => openEdit(selectedSurvey)} className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center" title="수정">
                        <Pencil size={14} className="text-blue-500" />
                      </button>
                      {isAdmin() && (
                        <button onClick={() => handleDelete(selectedSurvey.id)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center" title="삭제">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      )}
                    </>
                  )}
                  <button onClick={() => setSelectedSurvey(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${isPast(new Date(selectedSurvey.deadline)) ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                  {isPast(new Date(selectedSurvey.deadline)) ? '종료' : '진행 중'}
                </span>
                <span className="text-xs text-gray-500">마감: {format(new Date(selectedSurvey.deadline), 'yyyy.MM.dd')}</span>
                <span className="text-xs text-gray-400">응답 {selectedSurvey.responses?.length ?? 0}명</span>
              </div>

              {canManage && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setSurveyViewMode('respond')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${surveyViewMode === 'respond' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    설문 응답
                  </button>
                  <button onClick={() => setSurveyViewMode('results')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1 ${surveyViewMode === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <TrendingUp size={14} />
                    결과 ({selectedSurvey.responses?.length ?? 0})
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4">
              {surveyViewMode === 'respond' ? (
                <div className="space-y-5">
                  {selectedSurvey.questions.map((question: any, index: number) => (
                    <div key={question.id} className="space-y-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {index + 1}. {question.question}
                        {question.type !== 'text' && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            ({question.type === 'choice' ? '단일 선택' : '복수 선택'})
                          </span>
                        )}
                      </p>
                      {question.type === 'text' ? (
                        <textarea
                          value={surveyAnswers[question.id] || ''}
                          onChange={(e) => setSurveyAnswers({ ...surveyAnswers, [question.id]: e.target.value })}
                          disabled={hasUserResponded(selectedSurvey) || isPast(new Date(selectedSurvey.deadline))}
                          rows={3}
                          placeholder="답변을 입력하세요..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 resize-none"
                        />
                      ) : question.type === 'choice' ? (
                        <div className="space-y-2">
                          {question.options.map((option: string) => (
                            <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${surveyAnswers[question.id] === option ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}>
                              <input type="radio" name={question.id} value={option} checked={surveyAnswers[question.id] === option} onChange={(e) => setSurveyAnswers({ ...surveyAnswers, [question.id]: e.target.value })} disabled={hasUserResponded(selectedSurvey) || isPast(new Date(selectedSurvey.deadline))} className="hidden" />
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${surveyAnswers[question.id] === option ? 'border-blue-600' : 'border-gray-300'}`}>
                                {surveyAnswers[question.id] === option && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                              </div>
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {question.options.map((option: string) => {
                            const isChecked = Array.isArray(surveyAnswers[question.id]) && surveyAnswers[question.id].includes(option);
                            return (
                              <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${isChecked ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}>
                                <input type="checkbox" checked={isChecked} onChange={(e) => { const current = surveyAnswers[question.id] || []; const newVal = e.target.checked ? [...current, option] : current.filter((v: string) => v !== option); setSurveyAnswers({ ...surveyAnswers, [question.id]: newVal }); }} disabled={hasUserResponded(selectedSurvey) || isPast(new Date(selectedSurvey.deadline))} className="hidden" />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${isChecked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                  {isChecked && <span className="text-white text-xs">✓</span>}
                                </div>
                                <span className="text-sm text-gray-700">{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  {submitted ? (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <CheckCircle2 size={40} className="text-green-500" />
                      <p className="text-sm font-semibold text-green-700">응답이 저장되었습니다!</p>
                    </div>
                  ) : hasUserResponded(selectedSurvey) ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl py-3 text-center">
                      <p className="text-sm text-green-700">이미 응답하셨습니다 ✓</p>
                    </div>
                  ) : isPast(new Date(selectedSurvey.deadline)) ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl py-3 text-center">
                      <p className="text-sm text-gray-500">마감된 설문입니다</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setSelectedSurvey(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                      <button onClick={handleSubmitResponse} disabled={submitting} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60">
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                        {submitting ? '저장 중...' : '제출'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedSurvey.questions.map((question: any, index: number) => {
                    const results = getResults(question, selectedSurvey.responses ?? []);
                    const totalResponses = selectedSurvey.responses?.length ?? 0;
                    return (
                      <div key={question.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <h4 className="font-semibold text-gray-800 text-sm mb-3">{index + 1}. {question.question}</h4>
                        {question.type === 'text' ? (
                          <div className="space-y-2">
                            {Array.isArray(results) && results.length > 0 ? (
                              results.map((answer: string, i: number) => (
                                <div key={i} className="p-3 bg-white rounded-xl text-sm text-gray-700 border border-gray-100">{answer}</div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400">응답이 없습니다</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {question.options.map((option: string) => {
                              const count = results[option] || 0;
                              const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                              return (
                                <div key={option} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-700">{option}</span>
                                    <span className="text-gray-500">{count}명 ({percentage.toFixed(0)}%)</span>
                                  </div>
                                  <Progress value={percentage} className="h-2" />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Survey Bottom Sheet ── */}
      {editingSurvey && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingSurvey(null)} />
          <div className="relative bg-white rounded-t-3xl z-10">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">설문 수정</h2>
                <p className="text-xs text-gray-400 mt-0.5">제목·설명·마감일만 변경할 수 있습니다</p>
              </div>
              <button onClick={() => setEditingSurvey(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="space-y-1">
                <Label className="text-sm">제목 *</Label>
                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">설명</Label>
                <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">마감일 *</Label>
                <Input type="date" value={editForm.deadline} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} required className="rounded-xl" />
              </div>

              {/* 질문 목록 (읽기 전용) */}
              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-2">질문 목록 (수정 불가)</p>
                <div className="space-y-1.5">
                  {editingSurvey.questions.map((q: any, i: number) => (
                    <div key={q.id} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-400 shrink-0">{i + 1}.</span>
                      <span className="text-xs text-gray-700 flex-1 truncate">{q.question}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{q.type === 'text' ? '주관식' : q.type === 'choice' ? '단일' : '복수'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditingSurvey(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                <button onClick={handleSaveEdit} disabled={saving || !editForm.title || !editForm.deadline} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 transition">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Survey Bottom Sheet ── */}
      {isCreateDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCreateDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">새 설문 만들기</h2>
              <button onClick={() => setIsCreateDrawerOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleCreateSurvey} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">제목 *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">설명</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">마감일 *</Label>
                  <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required className="rounded-xl" />
                </div>

                {questions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">질문 목록 ({questions.length})</p>
                    {questions.map((q, index) => (
                      <div key={q.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{index + 1}. {q.question}</p>
                          <span className="text-xs text-gray-500">{q.type === 'text' ? '주관식' : q.type === 'choice' ? '단일 선택' : '복수 선택'}</span>
                        </div>
                        <button type="button" onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))} className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <X size={12} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-700">질문 추가</p>
                  <div className="space-y-1">
                    <Label className="text-xs">질문 내용</Label>
                    <Input value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} placeholder="질문을 입력하세요" className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">응답 형식</Label>
                    <Select value={newQuestion.type} onValueChange={(value: any) => setNewQuestion({ ...newQuestion, type: value })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">주관식</SelectItem>
                        <SelectItem value="choice">객관식 (단일)</SelectItem>
                        <SelectItem value="multiple">객관식 (복수)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newQuestion.type !== 'text' && (
                    <div className="space-y-2">
                      <Label className="text-xs">선택지</Label>
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input value={option} onChange={(e) => { const opts = [...newQuestion.options]; opts[index] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }} placeholder={`선택지 ${index + 1}`} className="rounded-xl" />
                          {index > 0 && (
                            <button type="button" onClick={() => { const opts = newQuestion.options.filter((_, i) => i !== index); setNewQuestion({ ...newQuestion, options: opts }); }} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                              <X size={14} className="text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">+ 선택지 추가</button>
                    </div>
                  )}
                  <button type="button" onClick={handleAddQuestion} className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium active:bg-blue-100 transition">질문 추가</button>
                </div>

                {questions.length === 0 && (
                  <p className="text-xs text-amber-600 text-center">질문을 1개 이상 추가해야 설문을 만들 수 있습니다.</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsCreateDrawerOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                  <button type="submit" disabled={creating || questions.length === 0 || !formData.title || !formData.deadline} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 transition">
                    {creating ? <Loader2 size={16} className="animate-spin" /> : null}
                    {creating ? '저장 중...' : '설문 만들기'}
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
