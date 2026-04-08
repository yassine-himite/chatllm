'use client';
import { useAuth, useUser } from '@repo/common/context';
import {
    ImageAttachment,
    ImageDropzoneRoot,
    MessagesRemainingBadge,
} from '@repo/common/components';
import { useImageAttachment } from '@repo/common/hooks';
import { ChatModeConfig } from '@repo/shared/config';
import { cn, Flex } from '@repo/ui';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import { useAgentStream } from '../../hooks/agent-provider';
import { useChatEditor } from '../../hooks/use-editor';
import { useChatStore } from '../../store';
import { ExamplePrompts } from '../exmaple-prompts';
import { ChatModeButton, GeneratingStatus, SendStopButton, WebSearchButton } from './chat-actions';
import { ChatEditor } from './chat-editor';
import { ImageUpload } from './image-upload';

export const ChatInput = ({
    showGreeting = true,
    showBottomBar = true,
    isFollowUp = false,
}: {
    showGreeting?: boolean;
    showBottomBar?: boolean;
    isFollowUp?: boolean;
}) => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const firstName = user?.firstName || user?.name?.split(' ')[0] || '';

    const { threadId: currentThreadId } = useParams();
    const { editor } = useChatEditor({
        placeholder: isFollowUp ? 'Stel een vervolgvraag' : 'Vraag maar raak',
        onInit: ({ editor }) => {
            if (typeof window !== 'undefined' && !isFollowUp && !isSignedIn) {
                const draftMessage = window.localStorage.getItem('draft-message');
                if (draftMessage) {
                    editor.commands.setContent(draftMessage, true, { preserveWhitespace: true });
                }
            }
        },
        onUpdate: ({ editor }) => {
            if (typeof window !== 'undefined' && !isFollowUp) {
                window.localStorage.setItem('draft-message', editor.getText());
            }
        },
    });
    const size = currentThreadId ? 'base' : 'sm';
    const getThreadItems = useChatStore(state => state.getThreadItems);
    const threadItemsLength = useChatStore(useShallow(state => state.threadItems.length));
    const { handleSubmit } = useAgentStream();
    const createThread = useChatStore(state => state.createThread);
    const useWebSearch = useChatStore(state => state.useWebSearch);
    const isGenerating = useChatStore(state => state.isGenerating);
    const isChatPage = usePathname().startsWith('/chat');
    const imageAttachment = useChatStore(state => state.imageAttachment);
    const clearImageAttachment = useChatStore(state => state.clearImageAttachment);
    const stopGeneration = useChatStore(state => state.stopGeneration);
    const hasTextInput = !!editor?.getText();
    const { dropzonProps, handleImageUpload } = useImageAttachment();
    const { push, prefetch } = useRouter();
    const chatMode = useChatStore(state => state.chatMode);

    useEffect(() => {
        if (!currentThreadId) {
            prefetch('/chat/warmup');
        }
    }, [currentThreadId, prefetch]);

    const sendMessage = async () => {
        if (
            !isSignedIn &&
            !!ChatModeConfig[chatMode as keyof typeof ChatModeConfig]?.isAuthRequired
        ) {
            push('/sign-in');
            return;
        }

        if (!editor?.getText()) {
            return;
        }

        let threadId = currentThreadId?.toString();

        if (!threadId) {
            const optimisticId = uuidv4();
            push(`/chat/${optimisticId}`);
            createThread(optimisticId, {
                title: editor?.getText(),
            });
            threadId = optimisticId;
        }

        const formData = new FormData();
        formData.append('query', editor.getText());
        imageAttachment?.base64 && formData.append('imageAttachment', imageAttachment?.base64);
        const threadItems = currentThreadId ? await getThreadItems(currentThreadId.toString()) : [];

        handleSubmit({
            formData,
            newThreadId: threadId,
            messages: threadItems.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ),
            useWebSearch,
        });
        window.localStorage.removeItem('draft-message');
        editor.commands.clearContent();
        clearImageAttachment();
    };

    const renderChatInput = () => (
        <>
            <div className="w-full px-3">
                <Flex
                    direction="col"
                    className={cn(
                        'bg-background border-hard/50 shadow-subtle-sm relative z-10 w-full rounded-xl border'
                    )}
                >
                    <ImageDropzoneRoot dropzoneProps={dropzonProps}>
                        <div className="flex w-full flex-shrink-0 overflow-hidden rounded-lg">
                            <div className="w-full">
                                {editor?.isEditable ? (
                                    <>
                                        <ImageAttachment />
                                        <Flex className="flex w-full flex-row items-end gap-0">
                                            <ChatEditor
                                                sendMessage={sendMessage}
                                                editor={editor}
                                                className="px-3 pt-3"
                                            />
                                        </Flex>
                                    </>
                                ) : (
                                    <div className="min-h-[60px] w-full px-3 pt-3 pb-1 text-base leading-6 text-muted-foreground/50">
                                        {isFollowUp ? 'Stel een vervolgvraag' : 'Vraag maar raak'}
                                    </div>
                                )}

                                <Flex
                                    className="border-border w-full gap-0 border-t border-dashed px-2 py-2"
                                    gap="none"
                                    items="center"
                                    justify="between"
                                >
                                    {isGenerating && !isChatPage ? (
                                        <GeneratingStatus />
                                    ) : (
                                        <Flex gap="xs" items="center" className="shrink-0">
                                            <ChatModeButton />
                                            <WebSearchButton />
                                            <ImageUpload
                                                id="image-attachment"
                                                label="Image"
                                                tooltip="Image Attachment"
                                                showIcon={true}
                                                handleImageUpload={handleImageUpload}
                                            />
                                        </Flex>
                                    )}

                                    <Flex gap="md" items="center">
                                        <SendStopButton
                                            isGenerating={isGenerating}
                                            isChatPage={isChatPage}
                                            stopGeneration={stopGeneration}
                                            hasTextInput={hasTextInput}
                                            sendMessage={sendMessage}
                                        />
                                    </Flex>
                                </Flex>
                            </div>
                        </div>
                    </ImageDropzoneRoot>
                </Flex>
            </div>
            <MessagesRemainingBadge />
        </>
    );

    const renderChatBottom = () => renderChatInput();

    useEffect(() => {
        editor?.commands.focus('end');
    }, [currentThreadId]);

    return (
        <div
            className={cn(
                'bg-secondary w-full',
                currentThreadId
                    ? 'absolute bottom-0'
                    : 'absolute inset-0 flex h-full w-full flex-col items-center justify-center'
            )}
        >
            <div
                className={cn(
                    'mx-auto flex w-full max-w-3xl flex-col items-start',
                    !threadItemsLength && 'justify-start',
                    size === 'sm' && 'px-8'
                )}
            >
                <Flex
                    items="start"
                    justify="start"
                    direction="col"
                    className={cn('w-full pb-4', threadItemsLength > 0 ? 'mb-0' : 'h-full')}
                >
                    {!currentThreadId && showGreeting && (
                        <div className="mb-4 flex w-full flex-col items-center gap-1">
                            <AnimatedTitles firstName={firstName} />
                        </div>
                    )}

                    {renderChatBottom()}
                    {!currentThreadId && showGreeting && <ExamplePrompts />}

                    {currentThreadId && (
                        <p className="text-muted-foreground mt-4 w-full text-center text-[11px] opacity-50">
                            Twelo.ai kan fouten maken. Controleer belangrijke informatie altijd.
                        </p>
                    )}
                </Flex>
            </div>
        </div>
    );
};

type AnimatedTitlesProps = {
    titles?: string[];
    firstName?: string;
};

const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Goedemorgen';
    else if (hour >= 12 && hour < 18) return 'Goedemiddag';
    else return 'Goedenavond';
};

const AnimatedTitles = ({ titles = [], firstName = '' }: AnimatedTitlesProps) => {
    const [greeting, setGreeting] = React.useState<string>(getTimeBasedGreeting);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const newGreeting = getTimeBasedGreeting();
            if (newGreeting !== greeting) {
                setGreeting(newGreeting);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [greeting]);

    return (
        <Flex
            direction="col"
            className="relative h-[60px] w-full items-center justify-center overflow-hidden"
        >
            <h1 className="from-muted-foreground/50 via-muted-foreground/40 to-muted-foreground/20 bg-gradient-to-r bg-clip-text text-center text-[32px] font-semibold tracking-tight text-transparent">
                {greeting}
                {firstName ? ` ${firstName}` : ''}
            </h1>
        </Flex>
    );
};
