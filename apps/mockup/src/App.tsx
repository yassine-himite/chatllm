import { useState } from 'react';
import Layout from './components/Layout';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

export type Screen = 'signin' | 'home' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('signin');
  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  if (screen === 'signin') {
    return (
      <div className={dark ? 'dark' : ''}>
        <SignInPage onSignIn={() => setScreen('home')} dark={dark} onToggleDark={toggleDark} />
      </div>
    );
  }

  return (
    <Layout
      screen={screen}
      activeThreadId={activeThreadId}
      dark={dark}
      onToggleDark={toggleDark}
      onNewChat={() => setScreen('home')}
      onSelectThread={(id) => { setActiveThreadId(id); setScreen('chat'); }}
      onSignOut={() => setScreen('signin')}
    >
      {screen === 'home'
        ? <HomePage onSendMessage={() => setScreen('chat')} />
        : <ChatPage threadId={activeThreadId} onSendMessage={() => {}} />
      }
    </Layout>
  );
}
