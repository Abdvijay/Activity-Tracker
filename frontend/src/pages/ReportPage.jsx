import { useState, useEffect } from 'react';
import api from '../api';
import { FileText, TrendingUp, CheckCircle2, Flame, Calendar as CalendarIcon } from 'lucide-react';

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, tasksRes, streakRes] = await Promise.all([
          api.get('/api/activities/tasks/report/'),
          api.get('/api/activities/tasks/'),
          api.get('/api/activities/tasks/streak/')
        ]);
        setReport(reportRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
        setStreak(streakRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!report) return <p className="text-center py-10 text-slate-500">Loading Report...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg shadow-blue-200">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Weekly Performance</h1>
          </div>
          <p className="text-slate-500">Deep dive into your productivity trends</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
              <CalendarIcon size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-slate-600">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Stats Card with SVG Gauge */}
        <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle 
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-blue-500 transition-all duration-1000 ease-out"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * (report.recent_tasks_count ? (report.completed_count / report.recent_tasks_count) : 0))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">
                {report.recent_tasks_count ? Math.round((report.completed_count / report.recent_tasks_count) * 100) : 0}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
             <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1 text-center md:text-left">Weekly Completion</h3>
                <p className="text-slate-500 text-sm text-center md:text-left">You've completed {report.completed_count} out of {report.recent_tasks_count} tasks this week.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                   <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Done</p>
                   <p className="text-2xl font-black text-emerald-700">{report.completed_count}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                   <p className="text-2xl font-black text-slate-700">{report.recent_tasks_count}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <span className="text-xs text-blue-500 font-semibold cursor-pointer hover:underline">View History</span>
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 transition-hover hover:border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${task.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${task.is_completed ? 'text-slate-700' : 'text-slate-400'}`}>{task.description}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        {new Date(task.created_at).toLocaleDateString()} • {task.is_completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <TrendingUp size={16} className={task.is_completed ? 'text-emerald-400' : 'text-slate-300'} />
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 text-sm py-8">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
