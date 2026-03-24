import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getRoleLabel } from '../../utils/helpers';

export default function Header({ onToggleSidebar, onToggleMobileSidebar }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu size={18} />
        </button>
        {/* Mobile toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 w-72 border border-slate-100">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
          <kbd className="text-xs text-slate-300 font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Settings size={18} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.fullName?.[0] || user?.username?.[0] || '?'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">{user?.fullName?.split(' ')[0] || user?.username}</p>
              <p className="text-xs text-slate-400 leading-tight">{getRoleLabel(user?.role)}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-md border border-slate-100 z-20 py-1.5 animate-slide-up">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                </div>
                <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  My Profile
                </button>
                <button onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Settings
                </button>
                <div className="border-t border-slate-50 my-1" />
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
