import { SearchResultsList, StepStatus, TextShimmer } from '@repo/common/components';
import { Step } from '@repo/shared/types';
import { Badge } from '@repo/ui';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';

export type StepRendererType = {
    step: Step;
};

export const StepRenderer = ({ step }: StepRendererType) => {
    const renderTextStep = () => {
        if (step?.text) {
            return (
                <p className="text-muted-foreground text-sm">
                    {step.text}
                </p>
            );
        }
        return null;
    };

    const renderSearchStep = () => {
        if (step?.steps && 'search' in step?.steps) {
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2">
                        <div className="w-[100px]">
                            <TextShimmer
                                duration={0.7}
                                spread={step.steps?.search?.status === 'COMPLETED' ? 0 : 2}
                                className="text-xs"
                            >
                                Searching
                            </TextShimmer>
                        </div>

                        <div className="flex flex-row flex-wrap gap-1">
                            {Array.isArray(step.steps?.search?.data) &&
                                step.steps?.search?.data?.map((query: string, index: number) => (
                                    <div key={index}>
                                        <Badge>
                                            <IconSearch size={12} className="opacity-50" />
                                            {query}
                                        </Badge>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderReadStep = () => {
        if (step?.steps && 'read' in step.steps) {
            return (
                <div className="flex flex-col gap-2">
                    <div className="w-[100px]">
                        <TextShimmer
                            duration={0.7}
                            spread={step.steps?.read?.status === 'COMPLETED' ? 0 : 2}
                            className="text-xs"
                        >
                            Reading
                        </TextShimmer>
                    </div>
                    <SearchResultsList
                        sources={Array.isArray(step.steps?.read?.data) ? step.steps.read.data : []}
                    />
                </div>
            );
        }
        return null;
    };

    const renderReasoningStep = () => {
        if (step?.steps && 'reasoning' in step.steps) {
            const reasoningData =
                typeof step.steps?.reasoning?.data === 'string' ? step.steps.reasoning.data : '';

            return (
                <div className="flex flex-col gap-2">
                    <div className="w-[100px]">
                        <TextShimmer
                            duration={0.7}
                            spread={step.steps?.reasoning?.status === 'COMPLETED' ? 0 : 2}
                            className="text-xs"
                        >
                            Analyzing
                        </TextShimmer>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {reasoningData.split('\n\n').map((line: string, index: number) => (
                            <React.Fragment key={index}>
                                <span>{line}</span>
                                <br />
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderWrapupStep = () => {
        if (step?.steps && 'wrapup' in step.steps) {
            return (
                <div className="flex flex-col gap-2">
                    <div className="w-[100px]">
                        <TextShimmer
                            duration={0.7}
                            spread={step.steps?.wrapup?.status === 'COMPLETED' ? 0 : 2}
                            className="text-xs"
                        >
                            Wrapping up
                        </TextShimmer>
                    </div>
                    <p>{step.steps?.wrapup?.data || ''}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex w-full flex-row items-stretch justify-start gap-2">
            <div className="flex min-h-full shrink-0 flex-col items-center justify-start px-2">
                <div className="bg-border/50 h-1.5 shrink-0" />
                <div className="bg-background z-10">
                    <StepStatus status={step.status} />
                </div>
                <div className="border-border min-h-full w-[1px] flex-1 border-l border-dashed" />
            </div>
            <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden pb-2 pr-2">
                {renderWrapupStep()}
                {renderTextStep()}
                {renderReasoningStep()}
                {renderSearchStep()}
                {renderReadStep()}
            </div>
        </div>
    );
};
