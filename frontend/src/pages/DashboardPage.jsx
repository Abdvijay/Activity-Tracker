import { useState, useEffect } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Flame, CheckCircle2, Circle } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateTasks, setDateTasks] = useState([]);
  const [dateTasksLoading, setDateTasksLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/activities/tasks/dashboard_stats/');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchStreak = async () => {
      try {
        const res = await api.get('/api/activities/tasks/streak/');
        setStreakData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    fetchStreak();
  }, []);

  const handleDayClick = async (date) => {
    setSelectedDate(date);
    const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    setDateTasksLoading(true);
    try {
      const res = await api.get(`/api/activities/tasks/by_date/?date=${dateStr}`);
      setDateTasks(res.data);
    } catch (err) {
      console.error(err);
      setDateTasks([]);
    } finally {
      setDateTasksLoading(false);
    }
  };

  if (!stats) return <p className="text-center py-10 text-slate-500">Loading Dashboard...</p>;

  const pieData = [
    { name: 'Completed', value: stats.today.completed },
    { name: 'Pending', value: stats.today.pending }
  ];
  
  const COLORS = ['#10b981', '#f43f5e'];

  const barData = [
    {
      name: 'This Week',
      Completed: stats.weekly.completed,
      Pending: stats.weekly.pending
    }
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-blue-500" size={28} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        </div>
        <p className="text-slate-500 text-sm sm:text-base sm:ml-auto">Track your daily and weekly progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 tracking-tight">Today's Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-slate-600">Completed ({stats.today.completed})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-sm text-slate-600">Pending ({stats.today.pending})</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Weekly Summary</h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">7 Days</span>
          </div>
          
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {/* Total Tasks Item */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">Total Tasks</span>
                <span className="text-lg font-bold text-slate-800">{stats.weekly.total}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full w-full opacity-50"></div>
              </div>
            </div>

            {/* Completion Item */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">Completed</span>
                <span className="text-lg font-bold text-emerald-600">{stats.weekly.completed}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.weekly.total ? (stats.weekly.completed / stats.weekly.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Item */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">Pending</span>
                <span className="text-lg font-bold text-rose-500">{stats.weekly.pending}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.weekly.total ? (stats.weekly.pending / stats.weekly.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Efficiency Score</span>
              <span className="text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded-lg">
                {stats.weekly.total ? Math.round((stats.weekly.completed / stats.weekly.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 tracking-tight">Actionable Insights</h3>
          <div className="bg-white/50 border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-medium text-slate-600 mb-2">Completion Rate</h4>
            <p className="text-3xl font-bold text-blue-600">
              {stats.weekly.total ? Math.round((stats.weekly.completed / stats.weekly.total) * 100) : 0}%
            </p>
            <p className="text-sm text-slate-500 mt-1">Overall tasks completed this week.</p>
          </div>
        </div>

      <div className="glass-card p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex flex-col sm:flex-row gap-8 items-center relative z-10">
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Flame size={14} fill="currentColor" /> Active Streak
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Consistency is Key</h3>
            <div className="flex items-center justify-center sm:justify-start gap-4 my-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 p-4 rounded-2xl shadow-lg shadow-orange-200">
                  <Flame size={40} className="text-white" fill="white" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black text-slate-800 leading-none">
                  {streakData ? streakData.current_streak : 0}
                </p>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Day Streak</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm italic">
              {streakData?.current_streak > 0 
                ? "You're on fire! Keep it up to reach the next milestone." 
                : "Start your streak today by completing your first task!"}
            </p>
          </div>
          
          <div className="flex-col items-center gap-4 hidden sm:flex">
             <div className="h-24 w-[1px] bg-slate-100"></div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full">
            <h4 className="text-sm font-semibold text-slate-500 mb-4 self-start sm:self-center uppercase tracking-widest">Activity Map</h4>
            <div className="custom-calendar-wrapper w-full flex justify-center scale-95 origin-center">
              {streakData && (
                <Calendar
                  value={selectedDate}
                  onClickDay={handleDayClick}
                  tileClassName={({ date, view }) => {
                    if (view === 'month') {
                      const dateStr = date.toLocaleDateString('en-CA');
                      if (streakData.active_dates.includes(dateStr)) {
                        return 'active-streak-day';
                      }
                    }
                    return null;
                  }}
                />
              )}
            </div>

            {selectedDate && (
              <div className="w-full mt-4 px-1">
                <h5 className="text-sm font-semibold text-slate-600 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h5>
                {dateTasksLoading ? (
                  <p className="text-xs text-slate-400">Loading...</p>
                ) : dateTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No tasks on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {dateTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-slate-100">
                        {task.is_completed
                          ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          : <Circle size={16} className="text-slate-300 shrink-0" />
                        }
                        <span className={`text-xs ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {task.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
