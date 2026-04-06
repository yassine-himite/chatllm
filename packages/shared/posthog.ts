import { v4 as uuidv4 } from 'uuid';

export enum EVENT_TYPES {
    WORKFLOW_SUMMARY = 'workflow_summary',
}

export type PostHogEvent = {
    event: EVENT_TYPES;
    userId: string;
    properties: Record<string, any>;
};

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let client: any = null;

if (key) {
    try {
        const { PostHog } = require('posthog-node');
        client = new PostHog(key, {
            host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        });
    } catch {
        // ignore
    }
}

export const posthog = {
    capture: (event: PostHogEvent) => {
        if (!client) return;
        client.capture({
            distinctId: event?.userId || uuidv4(),
            event: event.event,
            properties: event.properties,
        });
    },
    flush: () => {
        if (!client) return;
        client.flush();
    },
};
