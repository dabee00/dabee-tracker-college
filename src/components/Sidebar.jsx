import {
  LayoutDashboard,
  ClipboardList,
  Lightbulb,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { format } from 'date-fns';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'pit', label: 'Performance Tasks', icon: Lightbulb },
  { id: 'calendar', label: 'Quiz Calendar', icon: Calendar },
];

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  assignments,
  pits,
  quizzes,
}) {
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed').length;
  const pendingPits = pits.filter((p) => p.status !== 'completed').length;
  const today = new Date();
  const upcomingQuizzes = quizzes.filter((q) => new Date(q.date) >= today).length;

  const getBadge = (id) => {
    if (id === 'assignments') return pendingAssignments;
    if (id === 'pit') return pendingPits;
    if (id === 'calendar') return upcomingQuizzes;
    return null;
  };

  return (
    <aside
      className="fixed top-0 left-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 z-50 flex flex-col shadow-2xl"
      style={{ width: sidebarOpen ? '256px' : '64px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-blue-700">
        {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-base leading-tight">Dabee's Tracker</p>
                <p className="text-slate-300 text-xs">Task Management</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-blue-800 hover:bg-blue-50 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Date */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-blue-700">
          <p className="text-blue-300 text-xs">{format(today, 'EEEE')}</p>
          <p className="text-white font-semibold text-sm">{format(today, 'MMMM d, yyyy')}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const badge = getBadge(id);
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white text-blue-800 shadow-md font-semibold'
                  : 'text-blue-100 hover:bg-blue-700/60'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-blue-200'}`} />
              {sidebarOpen && (
                <span className="text-sm flex-1 text-left">{label}</span>
              )}
              {sidebarOpen && badge > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {badge}
                </span>
              )}
              {!sidebarOpen && badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={`border-t border-blue-700 p-4 ${sidebarOpen ? '' : 'flex justify-center'}`}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-slate-300 text-sm">User</p>
            <Bell className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </aside>
  );
}

