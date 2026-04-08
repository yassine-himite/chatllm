import { useAuth, useUser } from '@repo/common/context';
import { ChatMode, ChatModeConfig } from '@repo/shared/config';
import { ThreadItem } from '@repo/shared/types';
import { buildCoreMessagesFromThreadItems, plausible } from '@repo/shared/utils';
import { nanoid } from 'nanoid';
import { useParams, useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { useApiKeysStore, useAppStore, useAzureKeysStore, useChatStore, useMcpToolsStore } from '../store';

export type AgentContextType = {
    runAgent: (body: any) => Promise<void>;
    handleSubmit: (args: {
        formData: FormData;
        newThreadId?: string;
        existingThreadItemId?: string;
        newChatMode?: string;
        messages?: ThreadItem[];
        useWebSearch?: boolean;
        showSuggestions?: boolean;
    }) => Promise<void>;
    updateContext: (threadId: string, data: any) => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
    const { threadId: currentThreadId } = useParams();
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const {
        updateThreadItem,
        setIsGenerating,
        setAbortController,
        createThreadItem,
        setCurrentThreadItem,
        setCurrentSources,
        updateThread,
        chatMode,
        fetchRemainingCredits,
        customInstructions,
    } = useChatStore(state => ({
        updateThreadItem: state.updateThreadItem,
        setIsGenerating: state.setIsGenerating,
        setAbortController: state.setAbortController,
        createThreadItem: state.createThreadItem,
        setCurrentThreadItem: state.setCurrentThreadItem,
        setCurrentSources: state.setCurrentSources,
        updateThread: state.updateThread,
        chatMode: state.chatMode,
        fetchRemainingCredits: state.fetchRemainingCredits,
        customInstructions: state.customInstructions,
    }));
    const { push } = useRouter();

    const getSelectedMCP = useMcpToolsStore(state => state.getSelectedMCP);
    const apiKeys = useApiKeysStore(state => state.getAllKeys);
    const hasApiKeyForChatMode = useApiKeysStore(state => state.hasApiKeyForChatMode);
    const getSelectedAzureKey = useAzureKeysStore(state => state.getSelectedKey);
    const setShowSignInModal = useAppStore(state => state.setShowSignInModal);

    // Fetch remaining credits when user changes
    useEffect(() => {
        fetchRemainingCredits();
    }, [user?.id, fetchRemainingCredits]);

    // In-memory store for thread items
    const threadItemMap = useMemo(() => new Map<string, ThreadItem>(), []);

    // Define common event types to reduce repetition
    const EVENT_TYPES = [
        'steps',
        'sources',
        'answer',
        'error',
        'status',
        'suggestions',
        'toolCalls',
        'toolResults',
        'object',
    ];

    // Helper: Update in-memory and store thread item
    const handleThreadItemUpdate = useCallback(
        (
            threadId: string,
            threadItemId: string,
            eventType: string,
            eventData: any,
            parentThreadItemId?: string,
            shouldPersistToDB: boolean = true
        ) => {
            const prevItem = threadItemMap.get(threadItemId) || ({} as ThreadItem);
            const updatedItem: ThreadItem = {
                ...prevItem,
                query: eventData?.query || prevItem.query || '',
                mode: eventData?.mode || prevItem.mode,
                threadId,
                parentId: parentThreadItemId || prevItem.parentId,
                id: threadItemId,
                object: eventData?.object || prevItem.object,
                createdAt: prevItem.createdAt || new Date(),
                updatedAt: new Date(),
                ...(eventType === 'answer'
                    ? {
                          answer: {
                              ...eventData.answer,
                              text:
                                  eventData.answer?.status === 'COMPLETED'
                                      ? eventData.answer.text || prevItem.answer?.text || ''
                                      : (prevItem.answer?.text || '') + (eventData.answer?.text || ''),
                          },
                      }
                    : { [eventType]: eventData[eventType] }),
            };

            threadItemMap.set(threadItemId, updatedItem);
            updateThreadItem(threadId, { ...updatedItem, persistToDB: true });
        },
        [threadItemMap, updateThreadItem]
    );

    // Workflow worker stubbed out — backend removed, runAgent handles mock responses
    const startWorkflow = (_: any) => {};
    const abortWorkflow = () => {};

    const runAgent = useCallback(
        async (body: any) => {
            const abortController = new AbortController();
            setAbortController(abortController);
            setIsGenerating(true);
            const startTime = performance.now();

            abortController.signal.addEventListener('abort', () => {
                console.info('Abort controller triggered');
                setIsGenerating(false);
                updateThreadItem(body.threadId, {
                    id: body.threadItemId,
                    status: 'ABORTED',
                    persistToDB: true,
                });
            });

            try {
                await new Promise<void>(resolve => setTimeout(resolve, 700));

                const mockWords = [
                    'Dit ', 'is ', 'een ', 'voorbeeldreactie ', 'in ', 'de ',
                    'designmodus. ', 'De ', 'AI-backend ', 'is ', 'verwijderd — ',
                    'alleen ', 'het ', 'ontwerp ', 'is ', 'actief.',
                ];

                for (let i = 0; i < mockWords.length; i++) {
                    if (abortController.signal.aborted) break;
                    const chunk = mockWords.slice(0, i + 1).join('');
                    handleThreadItemUpdate(
                        body.threadId,
                        body.threadItemId,
                        'answer',
                        {
                            ...body,
                            answer: { text: chunk, status: 'STREAMING' },
                        },
                        body.parentThreadItemId,
                        false
                    );
                    await new Promise(resolve => setTimeout(resolve, 40));
                }

                handleThreadItemUpdate(
                    body.threadId,
                    body.threadItemId,
                    'answer',
                    {
                        ...body,
                        answer: {
                            text: mockWords.join(''),
                            status: 'COMPLETED',
                        },
                    },
                    body.parentThreadItemId,
                    true
                );

                setIsGenerating(false);
                setTimeout(fetchRemainingCredits, 1000);
            } catch (streamError: any) {
                setIsGenerating(false);
                updateThreadItem(body.threadId, {
                    id: body.threadItemId,
                    status: 'ABORTED',
                    error: 'Generation aborted',
                });
            } finally {
                setIsGenerating(false);
            }
        },
        [
            setAbortController,
            setIsGenerating,
            updateThreadItem,
            handleThreadItemUpdate,
            fetchRemainingCredits,
            EVENT_TYPES,
            threadItemMap,
        ]
    );

    const handleSubmit = useCallback(
        async ({
            formData,
            newThreadId,
            existingThreadItemId,
            newChatMode,
            messages,
            useWebSearch,
            showSuggestions,
        }: {
            formData: FormData;
            newThreadId?: string;
            existingThreadItemId?: string;
            newChatMode?: string;
            messages?: ThreadItem[];
            useWebSearch?: boolean;
            showSuggestions?: boolean;
        }) => {
            const mode = (newChatMode || chatMode) as ChatMode;
            if (
                !isSignedIn &&
                !!ChatModeConfig[mode as keyof typeof ChatModeConfig]?.isAuthRequired
            ) {
                push('/sign-in');

                return;
            }

            const threadId = currentThreadId?.toString() || newThreadId;
            if (!threadId) return;

            // Update thread title
            updateThread({ id: threadId, title: formData.get('query') as string });

            const optimisticAiThreadItemId = existingThreadItemId || nanoid();
            const query = formData.get('query') as string;
            const imageAttachment = formData.get('imageAttachment') as string;

            const aiThreadItem: ThreadItem = {
                id: optimisticAiThreadItemId,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'QUEUED',
                threadId,
                query,
                imageAttachment,
                mode,
            };

            createThreadItem(aiThreadItem);
            setCurrentThreadItem(aiThreadItem);
            setIsGenerating(true);
            setCurrentSources([]);

            plausible.trackEvent('send_message', {
                props: {
                    mode,
                },
            });

            // Build core messages array
            const coreMessages = buildCoreMessagesFromThreadItems({
                messages: messages || [],
                query,
                imageAttachment,
            });

            if (hasApiKeyForChatMode(mode)) {
                const abortController = new AbortController();
                setAbortController(abortController);
                setIsGenerating(true);

                abortController.signal.addEventListener('abort', () => {
                    console.info('Abort signal received');
                    setIsGenerating(false);
                    abortWorkflow();
                    updateThreadItem(threadId, { id: optimisticAiThreadItemId, status: 'ABORTED' });
                });

                startWorkflow({
                    mode,
                    question: query,
                    threadId,
                    messages: coreMessages,
                    mcpConfig: getSelectedMCP(),
                    threadItemId: optimisticAiThreadItemId,
                    parentThreadItemId: '',
                    customInstructions,
                    apiKeys: apiKeys(),
                });
            } else {
                const resolvedMode = (newChatMode || chatMode) as ChatMode;
                const azureKey = resolvedMode === ChatMode.AZURE_OPENAI ? getSelectedAzureKey() : undefined;
                runAgent({
                    mode: resolvedMode,
                    prompt: query,
                    threadId,
                    messages: coreMessages,
                    mcpConfig: getSelectedMCP(),
                    threadItemId: optimisticAiThreadItemId,
                    customInstructions,
                    parentThreadItemId: '',
                    webSearch: useWebSearch,
                    showSuggestions: showSuggestions ?? false,
                    ...(azureKey ? {
                        azureApiKey: azureKey.apiKey,
                        azureEndpoint: azureKey.endpoint,
                        azureDeploymentName: azureKey.deploymentName,
                    } : {}),
                });
            }
        },
        [
            isSignedIn,
            currentThreadId,
            chatMode,
            setShowSignInModal,
            updateThread,
            createThreadItem,
            setCurrentThreadItem,
            setIsGenerating,
            setCurrentSources,
            abortWorkflow,
            startWorkflow,
            customInstructions,
            getSelectedMCP,
            apiKeys,
            hasApiKeyForChatMode,
            updateThreadItem,
            runAgent,
            getSelectedAzureKey,
        ]
    );

    const updateContext = useCallback(
        (threadId: string, data: any) => {
            updateThreadItem(threadId, {
                id: data.threadItemId,
                parentId: data.parentThreadItemId,
                threadId: data.threadId,
                metadata: data.context,
            });
        },
        [updateThreadItem]
    );

    const contextValue = useMemo(
        () => ({
            runAgent,
            handleSubmit,
            updateContext,
        }),
        [runAgent, handleSubmit, updateContext]
    );

    return <AgentContext.Provider value={contextValue}>{children}</AgentContext.Provider>;
};

export const useAgentStream = (): AgentContextType => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgentStream must be used within an AgentProvider');
    }
    return context;
};
