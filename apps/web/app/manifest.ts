import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'twelo.ai',
        short_name: 'twelo.ai',
        description:
            'twelo.ai is een moderne AI-chatclient waarmee je op een intuïtievere manier met AI kunt chatten.',
        start_url: '/',
        display: 'standalone',
        background_color: 'hsl(60 20% 99%)',
        theme_color: 'hsl(60 1% 10%)',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}
