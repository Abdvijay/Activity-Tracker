import { Outlet, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, LayoutDashboard, CheckSquare, BarChart } from 'lucide-react';

export default function HomeLayout() {
  const { user, logout } = useContext(AuthContext);

  const getBottomNavClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full text-[10px] sm:text-xs font-medium transition-colors ${
      isActive ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
    }`;

  const getDesktopNavClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16 md:pb-0">
      <header className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] sticky top-0 z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16 items-center">
            
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
                DailyTracker
              </span>
              
              <div className="hidden md:flex gap-2 h-full items-end pb-0">
                <NavLink to="/app/dashboard" className={getDesktopNavClass}>
                  <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                <NavLink to="/app/checklist" className={getDesktopNavClass}>
                  <CheckSquare size={18} /> Checklist
                </NavLink>
                <NavLink to="/app/report" className={getDesktopNavClass}>
                  <BarChart size={18} /> Report
                </NavLink>
              </div>
            </div>
            
            <div className="flex items-center gap-4 fade-in">
              <span className="font-medium text-slate-500 text-sm hidden sm:block">
                {user ? `Hi, ${user.username}` : ''}
              </span>
              <button 
                onClick={logout} 
                className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors p-2 md:bg-red-50 md:text-red-500 md:px-3 md:py-1.5 md:rounded-lg"
              >
                <LogOut size={20} className="md:w-4 md:h-4" /> 
                <span className="hidden md:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in h-full">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-20 h-16 md:hidden pb-safe">
        <div className="flex justify-around items-center h-full">
          <NavLink to="/app/dashboard" className={getBottomNavClass}>
            <LayoutDashboard size={22} className="mb-1" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/checklist" className={getBottomNavClass}>
            <CheckSquare size={22} className="mb-1" />
            <span>Checklist</span>
          </NavLink>
          <NavLink to="/app/report" className={getBottomNavClass}>
            <BarChart size={22} className="mb-1" />
            <span>Report</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
