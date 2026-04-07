import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAMPLE_PROMPTS, MOCK_USER } from '../mockData';
import ChatInput from '../components/ChatInput';

interface HomePageProps {
  onSendMessage: () => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Goedenacht';
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

export default function HomePage({ onSendMessage }: HomePageProps) {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex h-full flex-col">
      {/* Greeting + prompts */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="greeting-bubble relative inline-block rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-[15px]">
            {getGreeting()}, {MOCK_USER.name} 👋
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {EXAMPLE_PROMPTS.map((p, i) => (
            <motion.button
              key={p.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setInputValue(p.text); }}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-tertiary hover:text-foreground"
            >
              {p.emoji} {p.text}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={onSendMessage}
        placeholder="Vraag maar raak"
        showDisclaimer={false}
      />
    </div>
  );
}
