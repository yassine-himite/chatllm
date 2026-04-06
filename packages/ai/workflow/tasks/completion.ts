import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createTask } from '@repo/orchestrator';
import { ChatMode } from '@repo/shared/config';
import { streamText } from 'ai';
import { getModelFromChatMode } from '../../models';
import { getLanguageModel } from '../../providers';
import { WorkflowContextSchema, WorkflowEventSchema } from '../flow';
import { ChunkBuffer, generateText, getHumanizedDate, handleError } from '../utils';

const MAX_ALLOWED_CUSTOM_INSTRUCTIONS_LENGTH = 6000;

export const completionTask = createTask<WorkflowEventSchema, WorkflowContextSchema>({
    name: 'completion',
    execute: async ({ events, context, signal, redirectTo }) => {
        if (!context) {
            throw new Error('Context is required but was not provided');
        }

        const customInstructions = context?.get('customInstructions');
        const mode = context.get('mode');
        const webSearch = context.get('webSearch') || false;

        let messages =
            context
                .get('messages')
                ?.filter(
                    message =>
                        (message.role === 'user' || message.role === 'assistant') &&
                        !!message.content
                ) || [];

        if (
            customInstructions &&
            customInstructions?.length < MAX_ALLOWED_CUSTOM_INSTRUCTIONS_LENGTH
        ) {
            messages = [
                {
                    role: 'system',
                    content: `Today is ${getHumanizedDate()}. and current location is ${context.get('gl')?.city}, ${context.get('gl')?.country}. \n\n ${customInstructions}`,
                },
                ...messages,
            ];
        }

        if (webSearch) {
            redirectTo('quickSearch');
            return;
        }

        const prompt = `You are a helpful assistant that can answer questions and help with tasks.
        Today is ${getHumanizedDate()}.
        `;

        const chunkBuffer = new ChunkBuffer({
            threshold: 200,
            breakOn: ['\n'],
            onFlush: (text: string) => {
                events?.update('answer', current => ({
                    ...current,
                    text,
                    status: 'PENDING' as const,
                }));
            },
        });

        let response: string;

        if (mode === ChatMode.AZURE_OPENAI) {
            const azureApiKey = context.get('azureApiKey');
            const azureEndpoint = context.get('azureEndpoint');
            const deploymentName = context.get('azureDeploymentName') || 'gpt-4o';

            if (!azureApiKey || !azureEndpoint) {
                throw new Error('Azure OpenAI API key or endpoint is missing. Configure them in the settings.');
            }

            const azureProvider = createOpenAICompatible({
                name: 'azure',
                baseURL: `${azureEndpoint.replace(/\/$/, '')}/openai/deployments/${deploymentName}`,
                headers: {
                    'api-key': azureApiKey,
                },
                queryParams: { 'api-version': '2024-12-01-preview' },
            });

            const azureModel = azureProvider(deploymentName);
            const { fullStream } = streamText({
                model: azureModel,
                system: prompt,
                messages: messages as any,
                abortSignal: signal,
            });

            let fullText = '';
            for await (const part of fullStream) {
                if (part.type === 'text-delta') {
                    fullText += part.textDelta;
                    chunkBuffer.add(part.textDelta);
                }
            }
            chunkBuffer.end();
            response = fullText;
        } else {
            const reasoningBuffer = new ChunkBuffer({
                threshold: 200,
                breakOn: ['\n\n'],
                onFlush: (_chunk: string, fullText: string) => {
                    events?.update('steps', prev => ({
                        ...prev,
                        0: {
                            ...prev?.[0],
                            id: 0,
                            status: 'COMPLETED',
                            steps: {
                                ...prev?.[0]?.steps,
                                reasoning: {
                                    data: fullText,
                                    status: 'COMPLETED',
                                },
                            },
                        },
                    }));
                },
            });

            response = await generateText({
                model: getModelFromChatMode(mode),
                messages,
                prompt,
                signal,
                toolChoice: 'auto',
                maxSteps: 2,
                onReasoning: (chunk, _fullText) => {
                    reasoningBuffer.add(chunk);
                },
                onChunk: (chunk, _fullText) => {
                    chunkBuffer.add(chunk);
                },
            });

            reasoningBuffer.end();
            chunkBuffer.end();
        }

        events?.update('answer', prev => ({
            ...prev,
            text: response,
            fullText: response,
            status: 'COMPLETED',
        }));

        context.update('answer', _ => response);

        events?.update('status', prev => 'COMPLETED');

        const onFinish = context.get('onFinish');
        if (onFinish) {
            onFinish({
                answer: response,
                threadId: context.get('threadId'),
                threadItemId: context.get('threadItemId'),
            });
        }
        return;
    },
    onError: handleError,
    route: ({ context }) => {
        if (context?.get('showSuggestions') && context.get('answer')) {
            return 'suggestions';
        }
        return 'end';
    },
});
