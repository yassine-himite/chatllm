'use client';

import { useAuthFull } from '@repo/common/context';
import { Button, Input } from '@repo/ui';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from './logo';

type CustomSignInProps = {
    redirectUrl?: string;
    onClose?: () => void;
};

export const CustomSignIn = ({ onClose }: CustomSignInProps) => {
    const { refetch } = useAuthFull();
    const router = useRouter();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login' ? { email, password } : { name, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Er is iets misgegaan');
                return;
            }

            await refetch();
            onClose?.();
            router.push('/chat');
        } catch {
            setError('Er is iets misgegaan. Probeer het opnieuw.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex w-[360px] flex-col items-center gap-6 rounded-2xl bg-background p-8 shadow-lg">
            <Button
                onClick={() => onClose?.()}
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3"
            >
                <IconX className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-center gap-2">
                <Logo className="text-brand size-8" />
                <h2 className="font-clash text-foreground text-center text-2xl font-bold">
                    {mode === 'login' ? 'Welkom terug' : 'Account aanmaken'}
                </h2>
                <p className="text-muted-foreground text-center text-sm">
                    {mode === 'login'
                        ? 'Log in op je twelo.ai account'
                        : 'Registreer voor geavanceerde AI-tools'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                {mode === 'register' && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Naam</label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Je volledige naam"
                            required
                        />
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">E-mailadres</label>
                    <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="je@email.nl"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Wachtwoord</label>
                    <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder="Minimaal 8 tekens"
                        required
                        minLength={8}
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                        ? 'Bezig...'
                        : mode === 'login'
                          ? 'Inloggen'
                          : 'Account aanmaken'}
                </Button>
            </form>

            <div className="flex flex-col items-center gap-2 text-sm">
                <p className="text-muted-foreground">
                    {mode === 'login' ? 'Nog geen account?' : 'Al een account?'}{' '}
                    <button
                        type="button"
                        className="text-brand font-medium hover:underline"
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                    >
                        {mode === 'login' ? 'Registreren' : 'Inloggen'}
                    </button>
                </p>
                <p className="text-muted-foreground/60 text-center text-xs">
                    Door verder te gaan ga je akkoord met de{' '}
                    <a href="/terms" className="hover:text-foreground underline">Servicevoorwaarden</a>
                    {' '}en het{' '}
                    <a href="/privacy" className="hover:text-foreground underline">Privacybeleid</a>
                </p>
            </div>
        </div>
    );
};
