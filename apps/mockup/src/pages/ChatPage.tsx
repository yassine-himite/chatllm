import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { MOCK_MESSAGES, MOCK_THREADS } from '../mockData';
import ChatInput from '../components/ChatInput';

interface ChatPageProps {
  threadId: string;
  onSendMessage: () => void;
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br/>');
}

export default function ChatPage({ threadId, onSendMessage }: ChatPageProps) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = { id: String(Date.now()), role: 'user' as const, content: inputValue };
    setMessages(m => [...m, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, {
        id: String(Date.now() + 1),
        role: 'ai' as const,
        content: 'Dit is een gesimuleerd antwoord in de mockup. In de echte applicatie zou hier een AI-reactie verschijnen op basis van je vraag.',
      }]);
    }, 1400);
  };

  const thread = MOCK_THREADS.find(t => t.id === threadId);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex h-11 flex-shrink-0 items-center border-b border-border px-4 gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Azure GPT-4o
        </div>
        {thread && (
          <span className="ml-2 truncate text-[12px] text-muted-foreground">{thread.title}</span>
        )}
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-8 pt-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-2xl rounded-tr-sm border border-border bg-secondary px-4 py-2.5 text-[14px] leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-brand">
                      <MessageSquare size={11} className="text-white" />
                    </div>
                    <div
                      className="flex-1 text-[14px] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: `<p>${renderMarkdown(msg.content)}</p>`,
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-brand">
                  <MessageSquare size={11} className="text-white" />
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        placeholder="Stel een vervolgvraag"
        showDisclaimer
      />
    </div>
  );
}
