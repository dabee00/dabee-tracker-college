import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  BookOpen,
  Clock,
  StickyNote,
  Trash2,
} from 'lucide-react';
const subjectColors = {
  default: "#3b82f6"
};

const subjectOptions = [
  'CpE321-Basic Occuupational Health and Safety',
  'CpE322-Digital Signal Processing',
  'CpE323-Microprocessor',
  'CpE324-CpE Practice and Design 1',
  'CpE325-CpE laws and Professional Practice',
  'CpE326-Emerging Technologies in CpE',
  'ES302-Engineering Management',
  'PICPE-Philippine Indigenous Communities and Peace Education',
  'EC321-CpE Elective Course 2',
];

const quizTypeConfig = {
  short_quiz: { label: 'Short Quiz', bg: 'bg-sky-100', text: 'text-sky-700' },
  long_quiz: { label: 'Long Quiz', bg: 'bg-purple-100', text: 'text-purple-700' },
  exam: { label: 'Exam', bg: 'bg-red-100', text: 'text-red-700', bold: true },
};

const emptyForm = {
  subject: '',
  date: '',
  time: '8:00 AM',
  type: 'short_quiz',
  notes: '',
};

export default function CalendarPage({ quizzes, setQuizzes, addQuiz, updateQuiz, deleteQuiz }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const weeks = [];
  let day = calStart;
  while (day <= calEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getQuizzesForDate = (date) =>
    quizzes.filter((q) => isSameDay(parseISO(q.date), date));

  const selectedQuizzes = selectedDate ? getQuizzesForDate(selectedDate) : [];

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddQuiz = (date) => {
    setForm({ ...emptyForm, date: format(date, 'yyyy-MM-dd') });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (q) => {
    setForm({
      subject: q.subject,
      date: q.date,
      time: q.time,
      type: q.type,
      notes: q.notes || '',
    });
    setEditingId(q.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    try {
      if (deleteQuiz) await deleteQuiz(id);
    } catch (err) {
      console.error('Quiz delete error:', err);
    }
    if (selectedDate && getQuizzesForDate(selectedDate).length <= 1) {
      // keep selectedDate
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      color: subjectColors[form.subject] || '#3b82f6',
      createdAt: new Date(),
    };

    try {
      if (editingId) {
        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === editingId
              ? { ...q, ...payload }
              : q
          )
        );
        if (updateQuiz) await updateQuiz(editingId, payload);
      } else {
        setQuizzes((prev) => [
          ...prev,
          { ...payload, id: Date.now() },
        ]);
        if (addQuiz) await addQuiz(payload);
      }
    } catch (err) {
      console.error('Quiz write error:', err);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const upcomingQuizzes = quizzes
    .filter((q) => new Date(q.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-green-600" />
              Quiz Calendar
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Schedule and track your quizzes and exams</p>
          </div>
          <button
            onClick={() => {
              setForm({ ...emptyForm, date: format(new Date(), 'yyyy-MM-dd') });
              setEditingId(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Quiz/Exam
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="font-bold text-slate-800 text-lg">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-slate-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div>
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 border-b border-slate-50 last:border-0">
                    {week.map((date, di) => {
                      const dayQuizzes = getQuizzesForDate(date);
                      const inMonth = isSameMonth(date, currentMonth);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const today = isToday(date);

                      return (
                        <div
                          key={di}
                          onClick={() => handleDayClick(date)}
                          className={`min-h-[80px] p-2 border-r border-slate-50 last:border-0 cursor-pointer transition-colors relative group ${
                            !inMonth ? 'bg-slate-50/50' : 'hover:bg-blue-50/30'
                          } ${isSelected ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''}`}
                        >
                          {/* Date number */}
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full ${
                                today
                                  ? 'bg-blue-600 text-white'
                                  : isSelected
                                  ? 'text-blue-700'
                                  : !inMonth
                                  ? 'text-slate-300'
                                  : 'text-slate-700'
                              }`}
                            >
                              {format(date, 'd')}
                            </span>
                            {inMonth && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAddQuiz(date); }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-blue-100 rounded transition-all"
                              >
                                <Plus className="w-3 h-3 text-blue-500" />
                              </button>
                            )}
                          </div>

                          {/* Quiz dots */}
                          <div className="space-y-0.5">
                            {dayQuizzes.slice(0, 3).map((q, qi) => (
                              <div
                                key={qi}
                                className="text-xs px-1.5 py-0.5 rounded-md text-white font-medium truncate"
                                style={{ backgroundColor: q.color }}
                                title={q.subject}
                              >
                                {q.subject?.length > 12 ? q.subject.substring(0, 12) + '…' : q.subject}
                              </div>
                            ))}
                            {dayQuizzes.length > 3 && (
                              <div className="text-xs text-slate-500 px-1">
                                +{dayQuizzes.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Day Panel */}
            {selectedDate && (
              <div className="mt-4 bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <button
                    onClick={() => handleAddQuiz(selectedDate)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {selectedQuizzes.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No quizzes scheduled. Click + to add one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedQuizzes.map((q) => {
                      const qType = quizTypeConfig[q.type];
                      return (
                        <div
                          key={q.id}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                            style={{ backgroundColor: q.color }}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm">{q.subject}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qType.bg} ${qType.text}`}>
                                {qType.label}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {q.time}
                              </span>
                            </div>
                            {q.notes && (
                              <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                                <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {q.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(q)}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming */}
          <div className="space-y-4">
            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Quiz Types</h3>
              <div className="space-y-2">
                {Object.entries(quizTypeConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming quizzes */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Upcoming Quizzes</h3>
                <p className="text-slate-400 text-xs">{upcomingQuizzes.length} scheduled</p>
              </div>
              <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                {upcomingQuizzes.map((q) => {
                  const qType = quizTypeConfig[q.type];
                  return (
                    <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDate(parseISO(q.date));
                        setCurrentMonth(parseISO(q.date));
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white"
                          style={{ backgroundColor: q.color }}
                        >
                          <span className="text-xs leading-none font-bold">{format(parseISO(q.date), 'd')}</span>
                          <span className="text-xs leading-none opacity-80">{format(parseISO(q.date), 'MMM').slice(0, 3)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{q.subject}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${qType.bg} ${qType.text}`}>
                              {qType.label}
                            </span>
                            <span className="text-xs text-slate-400">{q.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {upcomingQuizzes.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No upcoming quizzes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Quiz' : 'Schedule Quiz/Exam'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setForm(emptyForm); setEditingId(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjectOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  >
                    <option value="short_quiz">Short Quiz</option>
                    <option value="long_quiz">Long Quiz</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g. 8:00 AM"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1 flex items-center gap-1">
                  <StickyNote className="w-4 h-4" /> Study Notes / Reminders
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="What topics to review? Any reminders..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm(emptyForm); setEditingId(null); }}
                  className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Schedule Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
