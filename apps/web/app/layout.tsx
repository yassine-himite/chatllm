import { ClerkProvider } from '@clerk/nextjs';
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
    title: 'twelo.ai - Go Deeper with AI-Powered Research & Agentic Workflows',
    description:
        'Experience deep, AI-powered research with agentic workflows and a wide variety of models for advanced productivity.',
    keywords: 'AI chat, LLM, language models, privacy, minimal UI, ollama, chatgpt',
    authors: [{ name: 'Trendy design', url: 'https://trendy.design' }],
    creator: 'Trendy design',
    publisher: 'Trendy design',
    openGraph: {
        title: 'twelo.ai - Go Deeper with AI-Powered Research & Agentic Workflows',
        siteName: 'twelo.ai',
        description:
            'Experience deep, AI-powered research with agentic workflows and a wide variety of models for advanced productivity.',
        url: 'https://twelo.ai',
        type: 'website',
        locale: 'en_US',
        images: [
            {
                url: 'https://twelo.ai/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Twelo AI Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'twelo.ai - Go Deeper with AI-Powered Research & Agentic Workflows',
        site: 'twelo.ai',
        creator: '@twelo_ai',
        description:
            'Experience deep, AI-powered research with agentic workflows and a wide variety of models for advanced productivity.',
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
            lang="en"
            className={cn(GeistMono.variable, inter.variable, clash.variable, bricolage.variable)}
            suppressHydrationWarning
        >
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />

                {/* <script
                    crossOrigin="anonymous"
                    src="//unpkg.com/react-scan/dist/auto.global.js"
                ></script> */}
            </head>
            <body>
                {/* <PostHogProvider> */}
                <ClerkProvider>
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
                </ClerkProvider>
                {/* </PostHogProvider> */}
            </body>
        </html>
    );
}
