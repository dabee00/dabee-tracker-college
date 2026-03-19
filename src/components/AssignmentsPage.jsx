import { useState } from 'react';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import { subjectColors } from '../data/initialData';

const priorityConfig = {
  high: { label: 'High', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  medium: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { label: 'Low', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
};

function getDueDateInfo(dateStr) {
  const date = new Date(dateStr);
  const days = differenceInDays(date, new Date());
  if (days < 0) return { label: 'Overdue', color: 'text-red-600 font-bold', urgent: true };
  if (isToday(date)) return { label: 'Due Today', color: 'text-red-500 font-bold', urgent: true };
  if (isTomorrow(date)) return { label: 'Due Tomorrow', color: 'text-orange-500 font-semibold', urgent: true };
  if (days <= 3) return { label: `In ${days} days`, color: 'text-orange-400 font-medium', urgent: false };
  return { label: format(date, 'MMM d, yyyy'), color: 'text-slate-500', urgent: false };
}

const emptyForm = {
  title: '',
  subject: '',
  dueDate: '',
  priority: 'medium',
  status: 'pending',
  description: '',
};

export default function AssignmentsPage({ assignments, setAssignments }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const filtered = assignments
    .filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchSubject = filterSubject === 'all' || a.subject === filterSubject;
      return matchSearch && matchStatus && matchSubject;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...form, color: subjectColors[form.subject] || '#3b82f6' }
            : a
        )
      );
    } else {
      const newAssignment = {
        ...form,
        id: Date.now(),
        color: subjectColors[form.subject] || '#3b82f6',
      };
      setAssignments((prev) => [...prev, newAssignment]);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      subject: a.subject,
      dueDate: a.dueDate,
      priority: a.priority,
      status: a.status,
      description: a.description,
    });
    setEditingId(a.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleStatus = (id) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
        return { ...a, status: next[a.status] };
      })
    );
  };

  const stats = {
    pending: assignments.filter((a) => a.status === 'pending').length,
    in_progress: assignments.filter((a) => a.status === 'in_progress').length,
    completed: assignments.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-blue-600" />
              Assignments & Tasks
            </h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your academic tasks professionally</p>

          </div>
          <button
            onClick={() => { setShowModal(true); setEditingId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending', value: stats.pending, color: 'bg-slate-100 text-slate-700', icon: Clock },
            { label: 'In Progress', value: stats.in_progress, color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
            { label: 'Completed', value: stats.completed, color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 flex items-center gap-3`}>
              <s.icon className="w-5 h-5" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium opacity-80">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-400">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No assignments found</p>
              <p className="text-sm">Try adjusting your filters or add a new task</p>
            </div>
          ) : (
            filtered.map((a) => {
              const due = getDueDateInfo(a.dueDate);
              const priority = priorityConfig[a.priority];
              return (
                <div
                  key={a.id}
                  className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 transition-all hover:shadow-md ${
                    a.status === 'completed' ? 'opacity-60' : ''
                  }`}
                  style={{ borderLeftColor: a.color }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStatus(a.id)}
                      className="flex-shrink-0 mt-0.5"
                      title="Toggle status"
                    >
                      {a.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : a.status === 'in_progress' ? (
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold text-slate-800 ${a.status === 'completed' ? 'line-through' : ''}`}>
                          {a.title}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {due.urgent && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                          <span className={`text-sm ${due.color}`}>{due.label}</span>
                        </div>
                      </div>
                      {a.description && (
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{a.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: a.color }}
                        >
                          {a.subject}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}>
                          {priority.label} Priority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(a)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Assignment' : 'New Assignment'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setForm(emptyForm); setEditingId(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Assignment title..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Mathematics, English"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add details or instructions..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
