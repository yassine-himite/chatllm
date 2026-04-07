import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, LogOut, MessageSquare, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { MOCK_THREADS, MOCK_USER, MOCK_AZURE_KEYS } from '../mockData';
import { Screen } from '../App';

interface SidebarProps {
  activeThreadId: string;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onToggleDark: () => void;
  dark: boolean;
  onSignOut: () => void;
  screen: Screen;
}

const grouped = [
  { label: 'Vandaag', ids: ['1', '2', '3'] },
  { label: 'Gisteren', ids: ['4', '5', '6'] },
  { label: '3 dagen geleden', ids: ['7'] },
];

export default function Sidebar({
  activeThreadId,
  onNewChat,
  onSelectThread,
  onToggleDark,
  dark,
  onSignOut,
  screen,
}: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(MOCK_AZURE_KEYS[0]);
  const [keyDropOpen, setKeyDropOpen] = useState(false);

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-border bg-secondary">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand">
          <MessageSquare size={14} className="text-white" />
        </div>
        <span className="font-clash text-[15px] font-bold tracking-tight">twelo.ai</span>
      </div>

      {/* New chat */}
      <div className="px-2 pb-2">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-tertiary"
        >
          <Plus size={14} />
          Nieuw gesprek
        </button>
      </div>

      {/* Thread list */}
      <div className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
        {grouped.map(group => {
          const threads = MOCK_THREADS.filter(t => group.ids.includes(t.id));
          return (
            <div key={group.label}>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              {threads.map(thread => (
                <motion.button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  whileHover={{ x: 1 }}
                  className={`w-full rounded-md px-3 py-1.5 text-left text-[13px] transition-colors ${
                    activeThreadId === thread.id && screen === 'chat'
                      ? 'bg-tertiary font-medium'
                      : 'hover:bg-tertiary'
                  }`}
                >
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {thread.title}
                  </span>
                </motion.button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom user area */}
      <div className="border-t border-border p-2">
        {/* Azure key selector */}
        <div className="relative mb-1">
          <button
            onClick={() => setKeyDropOpen(o => !o)}
            className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-tertiary"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {selectedKey.name}
            </div>
            <ChevronDown size={12} className={`transition-transform ${keyDropOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {keyDropOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-0 mb-1 w-full rounded-lg border border-border bg-background p-1 shadow-lg"
              >
                {MOCK_AZURE_KEYS.map(key => (
                  <button
                    key={key.id}
                    onClick={() => { setSelectedKey(key); setKeyDropOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-tertiary ${
                      selectedKey.id === key.id ? 'text-brand font-medium' : ''
                    }`}
                  >
                    {key.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User row */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            className="flex w-full items-center gap-2 rounded-lg p-2 transition-colors hover:bg-tertiary"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-semibold text-white">
              {MOCK_USER.initials}
            </div>
            <div className="flex-1 text-left">
              <div className="text-[13px] font-medium leading-tight">{MOCK_USER.name}</div>
              <div className="text-[11px] text-muted-foreground">{MOCK_USER.email}</div>
            </div>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full left-0 mb-1 w-full rounded-xl border border-border bg-background p-1 shadow-lg"
              >
                <button
                  onClick={onToggleDark}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-tertiary"
                >
                  {dark ? <Sun size={14} /> : <Moon size={14} />}
                  {dark ? 'Lichte modus' : 'Donkere modus'}
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => { setUserMenuOpen(false); onSignOut(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-red-500 transition-colors hover:bg-tertiary"
                >
                  <LogOut size={14} />
                  Uitloggen
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
