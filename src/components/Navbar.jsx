import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, RefreshCw, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const location = useLocation();
  const { users, resetToApiData, loading } = useUsers();

  const handleReset = async () => {
    const success = await resetToApiData();
    if (success) {
      toast.success('Reset users data back to DummyJSON API default');
    } else {
      toast.error('Failed to reset data');
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent truncate">
                  UserPulse
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block -mt-0.5">Management & Directory Portal</p>
            </div>
          </Link>

          {/* Navigation Links & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${isActive('/')
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="hidden min-[480px]:inline">Dashboard</span>
                <span className="px-1.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-indigo-100/80 text-indigo-800">
                  {users.length}
                </span>
              </Link>

              <Link
                to="/create"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${isActive('/create')
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xs'
                  }`}
                title="Add User"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Add User</span>
              </Link>
            </nav>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            {/* Sync / Reset Button */}
            <button
              onClick={handleReset}
              disabled={loading}
              title="Reset state to initial DummyJSON records"
              className="p-1.5 sm:p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors duration-150 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
