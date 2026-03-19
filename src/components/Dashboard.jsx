import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import {
  ClipboardList,
  Lightbulb,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Star,
} from 'lucide-react';

const priorityConfig = {
  high: { label: 'High', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  medium: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  low: { label: 'Low', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-slate-500' },
  in_progress: { label: 'In Progress', icon: TrendingUp, color: 'text-blue-500' },
  completed: { label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
};

const quizTypeConfig = {
  short_quiz: { label: 'Short Quiz', color: 'bg-sky-100 text-sky-700' },
  long_quiz: { label: 'Long Quiz', color: 'bg-purple-100 text-purple-700' },
  exam: { label: 'Exam', color: 'bg-red-100 text-red-700' },
};

function getDueDateLabel(dateStr) {
  const date = new Date(dateStr);
  if (isToday(date)) return { label: 'Today', color: 'text-red-600 font-bold' };
  if (isTomorrow(date)) return { label: 'Tomorrow', color: 'text-orange-500 font-semibold' };
  const days = differenceInDays(date, new Date());
  if (days < 0) return { label: 'Overdue', color: 'text-red-700 font-bold' };
  if (days <= 3) return { label: `In ${days} days`, color: 'text-orange-500' };
  return { label: format(date, 'MMM d'), color: 'text-slate-500' };
}

export default function Dashboard({ assignments, pits, quizzes, setActivePage }) {
  const today = new Date();
  const pending = assignments.filter((a) => a.status !== 'completed');
  const completed = assignments.filter((a) => a.status === 'completed');
  const upcomingQuizzes = quizzes
    .filter((q) => new Date(q.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);
  const activePits = pits.filter((p) => p.status !== 'completed').slice(0, 3);
  const recentAssignments = pending
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const completionRate = assignments.length
    ? Math.round((completed.length / assignments.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 px-8 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
          <h1 className="text-white text-3xl font-bold mb-1">Juan Santos 👋</h1>
          <p className="text-blue-200 text-sm">{format(today, 'EEEE, MMMM d, yyyy')} · Grade 10 - Rizal</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Pending Tasks',
              value: pending.length,
              icon: ClipboardList,
              bg: 'bg-white',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
              sub: `${completed.length} completed`,
            },
            {
              label: 'Active PITs',
              value: activePits.length,
              icon: Lightbulb,
              bg: 'bg-white',
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-600',
              sub: `${pits.length} total`,
            },
            {
              label: 'Upcoming Quizzes',
              value: upcomingQuizzes.length,
              icon: Calendar,
              bg: 'bg-white',
              iconBg: 'bg-green-100',
              iconColor: 'text-green-600',
              sub: 'this month',
            },
            {
              label: 'Completion Rate',
              value: `${completionRate}%`,
              icon: Star,
              bg: 'bg-white',
              iconBg: 'bg-yellow-100',
              iconColor: 'text-yellow-600',
              sub: 'tasks done',
            },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl shadow-sm p-5 flex items-center gap-4`}>
              <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
                <p className="text-slate-400 text-xs">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Assignments Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignments */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">Assignments & Tasks</h2>
                    <p className="text-slate-400 text-xs">{pending.length} pending</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('assignments')}
                  className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {recentAssignments.length === 0 ? (
                  <div className="px-6 py-8 text-center text-slate-400 text-sm">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    All caught up!
                  </div>
                ) : (
                  recentAssignments.map((a) => {
                    const due = getDueDateLabel(a.dueDate);
                    const priority = priorityConfig[a.priority];
                    const status = statusConfig[a.status];
                    return (
                      <div key={a.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                            style={{ backgroundColor: a.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-700 leading-tight">{a.title}</p>
                              <span className={`text-xs flex-shrink-0 ${due.color}`}>{due.label}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{a.subject}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
                                {priority.label}
                              </span>
                              <span className={`text-xs flex items-center gap-1 ${status.color}`}>
                                <status.icon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* PIT Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">Performance Innovative Tasks</h2>
                    <p className="text-slate-400 text-xs">{activePits.length} active</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('pit')}
                  className="text-purple-600 text-xs font-medium flex items-center gap-1 hover:text-purple-700"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {activePits.map((pit) => (
                  <div key={pit.id} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pit.color }} />
                        <p className="text-sm font-semibold text-slate-700">{pit.title}</p>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        Due {format(new Date(pit.dueDate), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 ml-4 line-clamp-1">{pit.description}</p>
                    <div className="ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs font-semibold text-slate-700">{pit.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pit.progress}%`,
                            backgroundColor: pit.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div className="space-y-6">
            {/* Upcoming Quizzes */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">Upcoming Quizzes</h2>
                    <p className="text-slate-400 text-xs">{upcomingQuizzes.length} scheduled</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('calendar')}
                  className="text-green-600 text-xs font-medium flex items-center gap-1 hover:text-green-700"
                >
                  Calendar <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {upcomingQuizzes.map((quiz) => {
                  const quizType = quizTypeConfig[quiz.type];
                  const due = getDueDateLabel(quiz.date);
                  return (
                    <div key={quiz.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div
                        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white font-bold"
                        style={{ backgroundColor: quiz.color }}
                      >
                        <span className="text-xs leading-none">{format(new Date(quiz.date), 'MMM').toUpperCase()}</span>
                        <span className="text-sm leading-none">{format(new Date(quiz.date), 'd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 leading-tight truncate">{quiz.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${quizType.color}`}>
                            {quizType.label}
                          </span>
                          <span className={`text-xs ${due.color}`}>{due.label}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{quiz.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Progress */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl shadow-sm p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-200" />
                <h3 className="font-bold text-sm">Overall Progress</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Assignments', value: completionRate, color: 'bg-blue-300' },
                  {
                    label: 'PIT Progress',
                    value: pits.length
                      ? Math.round(pits.reduce((s, p) => s + p.progress, 0) / pits.length)
                      : 0,
                    color: 'bg-purple-300',
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-200">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-600">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-300" />
                  <p className="text-xs text-blue-200">
                    <span className="text-white font-semibold">
                      {assignments.filter((a) => {
                        const d = differenceInDays(new Date(a.dueDate), new Date());
                        return d >= 0 && d <= 3 && a.status !== 'completed';
                      }).length}
                    </span>{' '}
                    tasks due within 3 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
