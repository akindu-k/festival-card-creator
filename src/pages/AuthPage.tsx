import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Props { mode: 'login' | 'signup' }

export default function AuthPage({ mode }: Props) {
  const navigate    = useNavigate()
  const location    = useLocation()
  const from        = (location.state as { from?: string })?.from ?? '/'
  const [tab, setTab] = useState<'login' | 'signup'>(mode)

  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [name, setName]     = useState('')
  const [uname, setUname]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) { toast.error('Supabase not configured — see .env.example'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Welcome back! 🪷'); navigate(from) }
  }

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) { toast.error('Supabase not configured — see .env.example'); return }
    if (!uname.match(/^[a-z0-9_]{3,20}$/)) { toast.error('Username: 3-20 chars, lowercase, letters/numbers/_'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password: pass,
      options: { data: { display_name: name, username: uname } },
    })
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Account created! Check your email to verify. 🌸'); navigate('/') }
  }

  const googleLogin = async () => {
    if (!isSupabaseConfigured) { toast.error('Supabase not configured'); return }
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-600 transition-colors mb-6">
          <ArrowLeft size={14} /> Back to gallery
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Logo strip */}
          <div className="bg-gradient-to-r from-gold-600 to-vesak-saffron p-6 text-center">
            <div className="text-4xl mb-2">🪷</div>
            <h1 className="font-display text-xl font-bold text-white">Vesak Card Creator</h1>
            <p className="text-white/80 text-xs mt-1">Join the creative community</p>
          </div>

          <div className="p-6">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
              {(['login','signup'] as const).map((t) => (
                <button type="button" key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >{t === 'login' ? 'Sign In' : 'Create Account'}</button>
              ))}
            </div>

            {/* Google */}
            <button type="button" onClick={googleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <hr className="flex-1 border-gray-100 dark:border-gray-800" />
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">or</span>
              <hr className="flex-1 border-gray-100 dark:border-gray-800" />
            </div>

            {tab === 'login' ? (
              <form onSubmit={login} className="space-y-3">
                <Field icon={<Mail size={13} />} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
                <Field icon={<Lock size={13} />} type={showPass ? 'text' : 'password'} placeholder="Password" value={pass} onChange={setPass} required
                  right={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={13}/> : <Eye size={13}/>}</button>}
                />
                <SubmitBtn loading={loading} label="Sign In" />
              </form>
            ) : (
              <form onSubmit={signup} className="space-y-3">
                <Field icon={<User size={13} />} type="text" placeholder="Display name" value={name} onChange={setName} required />
                <Field icon={<User size={13} />} type="text" placeholder="Username (e.g. lotus_creator)" value={uname} onChange={setUname} required />
                <Field icon={<Mail size={13} />} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
                <Field icon={<Lock size={13} />} type={showPass ? 'text' : 'password'} placeholder="Password (min. 6 chars)" value={pass} onChange={setPass} required
                  right={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={13}/> : <Eye size={13}/>}</button>}
                />
                <SubmitBtn loading={loading} label="Create Account" />
              </form>
            )}

            {!isSupabaseConfigured && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-700 dark:text-amber-400">
                ⚠️ Demo mode — add your Supabase credentials in <code>.env</code> to enable auth.
              </div>
            )}

            <p className="text-center text-[11px] text-gray-400 mt-4">
              {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button type="button" onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-gold-600 font-medium hover:underline">
                {tab === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  icon:      React.ReactNode
  right?:    React.ReactNode
  onChange:  (v: string) => void
}

function Field({ icon, right, onChange, ...props }: FieldProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input {...props} onChange={(e) => onChange(e.target.value)} className="input-base pl-9 pr-9" />
      {right && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{right}</span>}
    </div>
  )
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-gold-700 hover:to-gold-600 disabled:opacity-60 transition-all shadow-lg shadow-gold-400/30 mt-1"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : null}
      {label}
    </button>
  )
}
