import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Moon, Sun } from 'lucide-react';

interface SignInPageProps {
  onSignIn: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

export default function SignInPage({ onSignIn, dark, onToggleDark }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSignIn(); }, 800);
  };

  return (
    <div className={`fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-secondary/95 backdrop-blur-sm ${dark ? 'dark' : ''}`}>
      {/* Theme toggle */}
      <button
        onClick={onToggleDark}
        className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-tertiary hover:text-foreground"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-xl"
      >
        {/* Logo */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/30">
            <MessageSquare size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-clash text-[22px] font-bold tracking-tight">Welkom terug</h1>
            <p className="text-[13px] text-muted-foreground">Log in op je twelo.ai account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="je@email.nl"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center rounded-lg bg-foreground py-2.5 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="block h-4 w-4 rounded-full border-2 border-background/30 border-t-background"
              />
            ) : 'Inloggen'}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Door verder te gaan ga je akkoord met de{' '}
          <a href="#" className="text-brand underline-offset-2 hover:underline">Servicevoorwaarden</a>
          {' '}en het{' '}
          <a href="#" className="text-brand underline-offset-2 hover:underline">Privacybeleid</a>
        </p>
      </motion.div>
    </div>
  );
}
