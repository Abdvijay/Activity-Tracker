import { useState, useEffect, useRef } from 'react';
import api from '../api';
import html2canvas from 'html2canvas';
import { FileText, TrendingUp, CheckCircle2, Flame, Calendar as CalendarIcon, Share2, X, Download } from 'lucide-react';

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [streak, setStreak] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const reportRef = useRef(null);

  const handleShare = async () => {
    setCapturing(true);
    try {
      const el = reportRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
        scrollX: 0,
        scrollY: -window.scrollY,
        width: el.offsetWidth,
        height: el.scrollHeight,
        windowWidth: el.offsetWidth,
        windowHeight: el.scrollHeight,
      });
      const imgUrl = canvas.toDataURL('image/png');
      setPreviewImg(imgUrl);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setCapturing(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = previewImg;
    a.download = 'activity-report.png';
    a.click();
  };

  const handleWhatsApp = async () => {
    const res = await fetch(previewImg);
    const blob = await res.blob();
    const file = new File([blob], 'activity-report.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'My Activity Report' });
    } else {
      // Fallback: download + open WhatsApp
      handleDownload();
      window.open('https://wa.me/', '_blank');
    }
  };

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

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col max-h-[94vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-7 border-b border-slate-100 shrink-0">
              <h3 className="text-2xl md:text-4xl font-bold text-slate-800">Share Report</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Scrollable preview */}
            <div className="overflow-y-auto flex-1 px-6 py-5 md:px-10 md:py-8 bg-slate-50/70">
              {previewImg && (
                <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white p-3 md:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                  <img
                    src={previewImg}
                    alt="Report preview"
                    className="w-full rounded-2xl border border-slate-100 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Actions — always visible */}
            <div className="px-6 pb-6 pt-4 md:px-10 md:pb-8 md:pt-6 border-t border-slate-100 shrink-0 flex gap-3 md:gap-4">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-lg md:text-2xl py-4 md:py-5 rounded-2xl transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Share via WhatsApp
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-6 md:px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 md:py-5 rounded-2xl transition-colors"
              >
                <Download size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

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
           <button
             onClick={handleShare}
             disabled={capturing}
             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors disabled:opacity-60"
           >
             <Share2 size={16} /> {capturing ? 'Capturing...' : 'Share'}
           </button>
        </div>
      </div>

      <div ref={reportRef} className="grid grid-cols-1 gap-6">
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
        <div data-html2canvas-ignore className="lg:col-span-3 glass-card p-6">
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
