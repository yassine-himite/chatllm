import { ReactNode } from 'react';
import { Screen } from '../App';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  screen: Screen;
  activeThreadId: string;
  dark: boolean;
  onToggleDark: () => void;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onSignOut: () => void;
}

export default function Layout({
  children,
  screen,
  activeThreadId,
  dark,
  onToggleDark,
  onNewChat,
  onSelectThread,
  onSignOut,
}: LayoutProps) {
  return (
    <div className={`flex h-screen w-full overflow-hidden bg-background text-foreground ${dark ? 'dark' : ''}`}>
      <Sidebar
        activeThreadId={activeThreadId}
        onNewChat={onNewChat}
        onSelectThread={onSelectThread}
        onToggleDark={onToggleDark}
        dark={dark}
        onSignOut={onSignOut}
        screen={screen}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
