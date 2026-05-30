import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Undo2, Redo2, ArrowLeft, Bell, Users, LayoutDashboard, Bookmark, LogOut, User, ChevronDown, Menu, X } from 'lucide-react'
import UserAvatar from './community/UserAvatar'
import { useAppStore } from '../store'
import { useAuthStore } from '../authStore'

export default function Header() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { view, darkMode, toggleDark, setView, undo, redo, canUndo, canRedo } = useAppStore()
  const { user, profile, unreadCount, signOut } = useAuthStore()

  const [menuOpen, setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenu] = useState(false)
  const [mobileMenuOpen, setMobile] = useState(false)

  const onRoot = location.pathname === '/'
  const inEditor = onRoot && view === 'editor'

  const navLinks = [
    { to: '/',          label: 'Templates',  exact: true },
    { to: '/community', label: 'Community',  exact: false },
  ]

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to && view === 'gallery'
          : location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

        {/* Back button (editor) */}
        {inEditor && (
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => setView('gallery')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-600 transition-colors shrink-0"
          >
            <ArrowLeft size={16} /><span className="hidden sm:inline">Templates</span>
          </motion.button>
        )}

        {/* Logo */}
        <Link to="/" onClick={() => setView('gallery')} className="flex items-center gap-2.5 mr-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-vesak-saffron flex items-center justify-center shadow-lg shadow-gold-400/30 shrink-0">
            <span className="text-white text-lg leading-none select-none">🪷</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-base font-semibold text-gray-900 dark:text-white leading-tight">Vesak Card Creator</h1>
            <p className="text-[9px] text-gold-600 uppercase tracking-widest leading-none">Spread the Light of Dhamma</p>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, exact }) => (
            <Link key={to} to={to} onClick={() => to === '/' && setView('gallery')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(to, exact) ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >{label}</Link>
          ))}
        </nav>

        {/* Undo/Redo (editor only) */}
        {inEditor && (
          <div className="hidden sm:flex items-center gap-1">
            <button type="button" onClick={undo} disabled={!canUndo()} title="Undo"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            ><Undo2 size={15} /></button>
            <button type="button" onClick={redo} disabled={!canRedo()} title="Redo"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            ><Redo2 size={15} /></button>
          </div>
        )}

        {/* Notifications */}
        {user && (
          <Link to="/notifications" className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gray-800 transition-all">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Link>
        )}

        {/* Dark mode */}
        <button onClick={toggleDark} title={darkMode ? 'Light mode' : 'Dark mode'}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gray-800 transition-all"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Auth */}
        {user ? (
          <div className="relative">
            <button type="button" onClick={() => setUserMenu(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <UserAvatar profile={profile} size="xs" />
              <span className="hidden sm:block text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                {profile?.display_name ?? user.email?.split('@')[0]}
              </span>
              <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{profile?.display_name ?? 'User'}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    {/* Menu items */}
                    {[
                      { to: profile ? `/profile/${profile.username}` : '#', icon: <User size={13}/>,            label: 'My Profile' },
                      { to: '/dashboard',     icon: <LayoutDashboard size={13}/>, label: 'Creator Dashboard' },
                      { to: '/saved',         icon: <Bookmark size={13}/>,        label: 'Saved Templates' },
                      { to: '/notifications', icon: <Bell size={13}/>,            label: 'Notifications', badge: unreadCount },
                    ].map(({ to, icon, label, badge }) => (
                      <Link key={to} to={to} onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-gray-400">{icon}</span>
                        {label}
                        {badge ? <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5">{badge}</span> : null}
                      </Link>
                    ))}
                    <button onClick={() => { setUserMenu(false); signOut() }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-gray-800"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/auth/login" className="btn-outline text-xs px-3 py-2">Sign In</Link>
            <Link to="/auth/signup" className="btn-gold text-xs px-3 py-2">Sign Up</Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button onClick={() => setMobile(!mobileMenuOpen)} className="sm:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="sm:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => { setMobile(false); to === '/' && setView('gallery') }}
                  className="block px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >{label}</Link>
              ))}
              {!user ? (
                <div className="flex gap-2 pt-2">
                  <Link to="/auth/login" onClick={() => setMobile(false)} className="flex-1 btn-outline text-xs justify-center py-2.5">Sign In</Link>
                  <Link to="/auth/signup" onClick={() => setMobile(false)} className="flex-1 btn-gold text-xs justify-center py-2.5">Sign Up</Link>
                </div>
              ) : (
                <button onClick={() => { setMobile(false); signOut() }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
