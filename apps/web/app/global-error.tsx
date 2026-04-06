'use client';

import Error from 'next/error';

export default function GlobalError({ error }: { error: Error }) {
    return (
        <html>
            <body>
                <div className="flex h-screen w-screen flex-col items-center justify-center bg-emerald-50">
                    <div className="flex w-[300px] flex-col gap-2">
                        <p className="text-base">Oeps! Er is iets misgegaan.</p>
                        <p className="text-brand text-sm">
                            Er lijkt een onverwachte fout te zijn opgetreden. Probeer de pagina te
                            vernieuwen of kom later terug. Als het probleem aanhoudt, neem dan{' '}
                            <a href="mailto:hello@twelo.ai">contact met ons op</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
}
