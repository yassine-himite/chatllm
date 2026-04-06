import { useUser } from '@repo/common/context';
import { cn, Dialog, DialogContent } from '@repo/ui';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Logo } from './logo';
export const IntroDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isSignedIn } = useUser();

    useEffect(() => {
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('hasSeenIntro', 'true');
        setIsOpen(false);
    };

    const icon = (
        <IconCircleCheckFilled className="text-muted-foreground/50 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full" />
    );

    const points = [
        {
            icon,
            text: `**Privacygericht**: Je chatgeschiedenis verlaat nooit je apparaat.`,
        },
        {
            icon,
            text: `**Open source**: Volledig transparant en aanpasbaar. Eenvoudig zelf te deployen.`,
        },
        {
            icon,
            text: `**Onderzoeksvriendelijk**: Gebruik Webzoeken, Pro Zoeken en Diepgaand Onderzoek.`,
        },
        {
            icon,
            text: `**Uitgebreide modelondersteuning**: Compatibel met alle grote modelaanbieders.`,
        },
        {
            icon,
            text: `**BYOK (eigen sleutel)**: Gebruik je eigen API-sleutel voor onbeperkt chatten.`,
        },
        {
            icon,
            text: `**MCP-compatibiliteit**: Verbind met MCP-servers en tools (binnenkort beschikbaar).`,
        },
        {
            icon,
            text: `**Gebruiksregistratie**: Bewaak je modelgebruik zonder te betalen (binnenkort beschikbaar).`,
        },
    ];

    if (isSignedIn) {
        return null;
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={open => {
                if (open) {
                    setIsOpen(true);
                } else {
                    handleClose();
                }
            }}
        >
            <DialogContent
                ariaTitle="Introduction"
                className="flex max-w-[420px] flex-col gap-0 overflow-hidden p-0"
            >
                <div className="flex flex-col gap-8 p-5">
                    <div className="flex flex-col gap-2">
                        <div
                            className={cn(
                                'flex h-8 w-full cursor-pointer items-center justify-start gap-1.5 '
                            )}
                        >
                            <Logo className="text-brand size-5" />
                            <p className="font-clash text-foreground text-lg font-bold tracking-wide">
                                twelo.ai
                            </p>
                        </div>
                        <p className="text-base font-semibold">
                            Privé, Open-Source en voor jou gemaakt
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold">Belangrijkste voordelen:</h3>

                        <div className="flex flex-col items-start gap-1.5">
                            {points.map((point, index) => (
                                <div key={index} className="flex-inline flex items-start gap-2">
                                    {point.icon}
                                    <ReactMarkdown
                                        className="text-sm"
                                        components={{
                                            p: ({ children }) => (
                                                <p className="text-muted-foreground text-sm">
                                                    {children}
                                                </p>
                                            ),
                                            strong: ({ children }) => (
                                                <span className="text-sm font-semibold">
                                                    {children}
                                                </span>
                                            ),
                                        }}
                                    >
                                        {point.text}
                                    </ReactMarkdown>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
