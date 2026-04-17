import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Plus, Trash2, CheckCircle2, Circle, CheckSquare } from 'lucide-react';

export default function ChecklistPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/activities/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await api.post('/api/activities/tasks/', { description: newTask });
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await api.patch(`/api/activities/tasks/${task.id}/`, {
        is_completed: !task.is_completed
      });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/activities/tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">
          <CheckSquare className="text-blue-500" size={24} /> Daily Checklist
        </h2>
        
        <form onSubmit={addTask} className="mb-6 flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" 
            placeholder="What needs to be done?" 
            value={newTask} 
            onChange={e => setNewTask(e.target.value)} 
          />
          <button type="submit" className="premium-btn flex justify-center items-center gap-2 py-3 w-full sm:w-auto">
            <Plus size={20} /> Add Task
          </button>
        </form>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-slate-400 py-8 italic">No tasks found. Add a task above to get started!</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                  task.is_completed 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : 'bg-white border-white/50 shadow-sm hover:shadow-md'
                }`}
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleTask(task)}
                >
                  <button className={`focus:outline-none transition-colors shrink-0 ${task.is_completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}>
                    {task.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <span className={`text-base sm:text-lg transition-all line-clamp-2 ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                    {task.description}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-2 shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
