import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
  showDisclaimer?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Vraag maar raak',
  showDisclaimer = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-shrink-0 px-6 pb-5 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-brand/40">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none placeholder:text-muted-foreground"
            style={{ minHeight: '24px', maxHeight: '200px' }}
          />
          <div className="mt-2 flex items-center justify-end">
            <motion.button
              onClick={onSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                value.trim()
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              disabled={!value.trim()}
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>

        {showDisclaimer && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Twelo.ai kan fouten maken. Controleer belangrijke informatie altijd.
          </p>
        )}
      </div>
    </div>
  );
}
