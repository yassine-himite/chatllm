export type Model = {
    id: string;
    name: string;
    provider: string;
    maxTokens: number;
    contextWindow: number;
};

export const models: Model[] = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'o4-mini', name: 'O4 Mini', provider: 'openai', maxTokens: 16384, contextWindow: 16384 },
    { id: 'deepseek-r1-distill-qwen-14b', name: 'DeepSeek R1 Distill Qwen 14B', provider: 'together', maxTokens: 16384, contextWindow: 16384 },
    { id: 'accounts/fireworks/models/deepseek-r1', name: 'DeepSeek R1', provider: 'fireworks', maxTokens: 16384, contextWindow: 16384 },
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 16384, contextWindow: 16384 },
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', provider: 'anthropic', maxTokens: 16384, contextWindow: 16384 },
    { id: 'gemini-2.0-flash', name: 'Gemini 2 Flash', provider: 'google', maxTokens: 200000, contextWindow: 200000 },
    { id: 'accounts/fireworks/models/qwq-32b', name: 'QWQ 32B', provider: 'fireworks', maxTokens: 16384, contextWindow: 16384 },
    { id: 'accounts/fireworks/models/llama4-scout-instruct-basic', name: 'Llama 4 Scout', provider: 'fireworks', maxTokens: 16384, contextWindow: 16384 },
];
