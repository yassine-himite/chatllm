import { AuthProvider } from '@repo/common/context';
import { RootLayout } from '@repo/common/components';
import { ReactQueryProvider, RootProvider } from '@repo/common/context';
import { TooltipProvider, cn } from '@repo/ui';
import { GeistMono } from 'geist/font/mono';
import type { Viewport } from 'next';
import { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-bricolage',
});

import './globals.css';

export const metadata: Metadata = {
    title: 'twelo.ai - Dieper gaan met AI-onderzoek en agentische workflows',
    description:
        'Ervaar diepgaand AI-onderzoek met agentische workflows en een breed scala aan modellen voor geavanceerde productiviteit.',
    keywords: 'AI chat, LLM, taalmodellen, privacy, minimale UI, ollama, chatgpt',
    authors: [{ name: 'Trendy design', url: 'https://trendy.design' }],
    creator: 'Trendy design',
    publisher: 'Trendy design',
    openGraph: {
        title: 'twelo.ai - Dieper gaan met AI-onderzoek en agentische workflows',
        siteName: 'twelo.ai',
        description:
            'Ervaar diepgaand AI-onderzoek met agentische workflows en een breed scala aan modellen voor geavanceerde productiviteit.',
        url: 'https://twelo.ai',
        type: 'website',
        locale: 'nl_NL',
        images: [
            {
                url: 'https://twelo.ai/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Twelo AI voorbeeld',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'twelo.ai - Dieper gaan met AI-onderzoek en agentische workflows',
        site: 'twelo.ai',
        creator: '@twelo_ai',
        description:
            'Ervaar diepgaand AI-onderzoek met agentische workflows en een breed scala aan modellen voor geavanceerde productiviteit.',
        images: ['https://twelo.ai/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://twelo.ai',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const inter = localFont({
    src: './InterVariable.woff2',
    variable: '--font-inter',
});

const clash = localFont({
    src: './ClashGrotesk-Variable.woff2',
    variable: '--font-clash',
});

export default function ParentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="nl"
            className={cn(GeistMono.variable, inter.variable, clash.variable, bricolage.variable)}
            suppressHydrationWarning
        >
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body>
                <AuthProvider>
                    <RootProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange
                        >
                        <TooltipProvider>
                            <ReactQueryProvider>
                                <RootLayout>{children}</RootLayout>
                            </ReactQueryProvider>
                        </TooltipProvider>
                        </ThemeProvider>
                    </RootProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
