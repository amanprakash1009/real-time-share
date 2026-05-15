import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, fetchMe, isLoading } = useAuthStore();

  // Fetch fresh user data on mount
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Format the join date nicely
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  // Get initials from name for avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col">
      {/* Ambient glow blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">RealTime Share</span>
          </div>

          <button
            id="logout-button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Welcome header */}
            <div className="mb-10">
              <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-2">Dashboard</p>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-slate-400 mt-2">Here's an overview of your account.</p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Profile card */}
              <div className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                  {initials}
                </div>
                <h2 className="text-white font-semibold text-xl">{user?.name || '—'}</h2>
                <p className="text-slate-400 text-sm mt-1">{user?.email || '—'}</p>
                <div className="mt-4 w-full pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Member since</p>
                  <p className="text-slate-300 text-sm mt-1">{joinDate}</p>
                </div>
              </div>

              {/* Stats cards */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Account Status */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium">Account Status</span>
                  </div>
                  <p className="text-2xl font-bold text-white">Active</p>
                  <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block animate-pulse" />
                    Verified & Secure
                  </p>
                </div>

                {/* Authentication */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium">Authentication</span>
                  </div>
                  <p className="text-2xl font-bold text-white">JWT</p>
                  <p className="text-purple-400 text-sm mt-1">Token-based auth</p>
                </div>

                {/* Security */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium">Password</span>
                  </div>
                  <p className="text-2xl font-bold text-white">bcrypt</p>
                  <p className="text-indigo-400 text-sm mt-1">12 salt rounds</p>
                </div>

                {/* User ID */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium">User ID</span>
                  </div>
                  <p className="text-sm font-mono font-bold text-white truncate">
                    {user?.id || '—'}
                  </p>
                  <p className="text-amber-400 text-sm mt-1">MongoDB ObjectId</p>
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/20 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Authentication System Active</h3>
                <p className="text-slate-400 text-sm mt-1">
                  You are authenticated via a secure JWT token. Your session will automatically expire after 7 days, at which point you will need to log in again.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
