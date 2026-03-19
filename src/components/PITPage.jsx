import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import {
  Lightbulb,
  Plus,
  X,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
} from 'lucide-react';
import { subjectColors } from '../data/initialData';

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-slate-100', text: 'text-slate-600', icon: Clock },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700', icon: TrendingUp },
  completed: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
};

const emptyForm = {
  title: '',
  subject: '',
  dueDate: '',
  status: 'pending',
  description: '',
  progress: 0,
  team: '',
};

export default function PITPage({ pits, setPits }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamArr = form.team
      ? form.team.split(',').map((t) => t.trim()).filter(Boolean)
      : ['You'];
    if (!teamArr.includes('You')) teamArr.unshift('You');

    if (editingId) {
      setPits((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...form,
                team: teamArr,
                color: subjectColors[form.subject] || '#8b5cf6',
                progress: Number(form.progress),
              }
            : p
        )
      );
    } else {
      setPits((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now(),
          team: teamArr,
          color: subjectColors[form.subject] || '#8b5cf6',
          progress: Number(form.progress),
          criteria: [
            { label: 'Content & Research', score: 35 },
            { label: 'Creativity', score: 30 },
            { label: 'Presentation', score: 35 },
          ],
        },
      ]);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      subject: p.subject,
      dueDate: p.dueDate,
      status: p.status,
      description: p.description,
      progress: p.progress,
      team: p.team.join(', '),
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setPits((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProgress = (id, value) => {
    setPits((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const progress = Math.max(0, Math.min(100, Number(value)));
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';
        return { ...p, progress, status };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-7 h-7 text-purple-600" />
              Performance Innovative Tasks
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your creative and performance-based outputs</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setEditingId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add PIT
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = pits.filter((p) => p.status === key).length;
            return (
              <div key={key} className={`${cfg.bg} ${cfg.text} rounded-xl p-4 flex items-center gap-3`}>
                <cfg.icon className="w-5 h-5" />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs font-medium opacity-80">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* PIT Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pits.map((pit) => {
            const status = statusConfig[pit.status];
            const daysLeft = differenceInDays(new Date(pit.dueDate), new Date());
            const isExpanded = expandedId === pit.id;

            return (
              <div
                key={pit.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Color bar */}
                <div className="h-1.5" style={{ backgroundColor: pit.color }} />
                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${pit.color}20` }}
                      >
                        <Lightbulb className="w-4 h-4" style={{ color: pit.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{pit.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{pit.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(pit)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pit.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status & Due */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                    <span className={`text-xs font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-500' : 'text-slate-500'}`}>
                      {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                    </span>
                    <span className="text-xs text-slate-400">· Due {format(new Date(pit.dueDate), 'MMM d')}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pit.description}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500 font-medium">Progress</span>
                      <span className="text-xs font-bold text-slate-700">{pit.progress}%</span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pit.progress}%`, backgroundColor: pit.color }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={pit.progress}
                      onChange={(e) => updateProgress(pit.id, e.target.value)}
                      className="w-full mt-1 accent-purple-600"
                      style={{ accentColor: pit.color }}
                    />
                  </div>

                  {/* Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <div className="flex -space-x-1">
                        {pit.team.slice(0, 4).map((member, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                            style={{
                              backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i % 4],
                            }}
                            title={member}
                          >
                            {member.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-1">{pit.team.length} member{pit.team.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pit.id)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      {isExpanded ? 'Less' : 'Criteria'}
                    </button>
                  </div>

                  {/* Criteria */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-purple-500" />
                        <p className="text-xs font-bold text-slate-700">Grading Criteria</p>
                      </div>
                      <div className="space-y-2">
                        {pit.criteria.map((c, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg p-2">
                            <span className="text-xs text-slate-600">{c.label}</span>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: pit.color }}
                            >
                              {c.score} pts
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between bg-slate-100 rounded-lg p-2 mt-1">
                          <span className="text-xs font-bold text-slate-700">Total</span>
                          <span className="text-xs font-bold text-slate-700">
                            {pit.criteria.reduce((s, c) => s + c.score, 0)} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {pits.length === 0 && (
            <div className="col-span-2 bg-white rounded-2xl shadow-sm p-12 text-center text-slate-400">
              <Lightbulb className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No performance tasks yet</p>
              <p className="text-sm">Add your first PIT to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit PIT' : 'New Performance Task'}
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
                  placeholder="Project title..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
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
            placeholder="e.g. Physics, Literature"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Progress ({form.progress}%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.progress}
                    onChange={(e) => setForm({ ...form, progress: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Team Members</label>
                <input
                  type="text"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                  placeholder="Maria S., Juan D. (comma-separated)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <p className="text-xs text-slate-400 mt-1">You will be added automatically</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the task objectives..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add PIT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
