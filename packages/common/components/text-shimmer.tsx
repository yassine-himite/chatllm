'use client';
import { cn } from '@repo/ui';
import React, { useMemo } from 'react';

export type TextShimmerProps = {
    children: string;
    as?: React.ElementType;
    className?: string;
    duration?: number;
    spread?: number;
};

function TextShimmerComponent({
    children,
    as: Component = 'p',
    className,
    duration = 1,
    spread = 2,
}: TextShimmerProps) {
    const dynamicSpread = useMemo(() => children.length * spread, [children, spread]);

    return (
        <>
            <style>{`
                @keyframes text-shimmer {
                    0% { background-position: 100% center; }
                    100% { background-position: 0% center; }
                }
            `}</style>
            <Component
                className={cn(
                    'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
                    'text-transparent [--base-color:hsl(var(--muted-foreground)/50)] [--base-gradient-color:hsl(var(--foreground))]',
                    '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
                    'dark:[--base-color:hsl(var(--muted-foreground)/50)] dark:[--base-gradient-color:hsl(var(--brand))]',
                    className
                )}
                style={
                    {
                        '--spread': `${dynamicSpread}px`,
                        backgroundImage: `linear-gradient(90deg,#0000 calc(50% - ${dynamicSpread}px),var(--base-gradient-color),#0000 calc(50% + ${dynamicSpread}px)), linear-gradient(var(--base-color), var(--base-color))`,
                        animation: `text-shimmer ${duration}s linear infinite`,
                    } as React.CSSProperties
                }
            >
                {children}
            </Component>
        </>
    );
}

export const TextShimmer = React.memo(TextShimmerComponent);
