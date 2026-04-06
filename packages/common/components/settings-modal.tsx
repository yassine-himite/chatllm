'use client';
import { useAuthFull } from '@repo/common/context';
import { useMcpToolsStore } from '@repo/common/store';
import { Alert, AlertDescription, DialogFooter } from '@repo/ui';
import { Button } from '@repo/ui/src/components/button';
import { IconBolt, IconBoltFilled, IconKey, IconSettings2, IconTrash, IconUser } from '@tabler/icons-react';

import { Badge, Dialog, DialogContent, Input } from '@repo/ui';

import { useChatEditor } from '@repo/common/hooks';
import moment from 'moment';
import { useState } from 'react';
import { ApiKeys, useApiKeysStore } from '../store/api-keys.store';
import { SETTING_TABS, useAppStore } from '../store/app.store';
import { useChatStore } from '../store/chat.store';
import { ChatEditor } from './chat-input';
import { BYOKIcon, ToolIcon } from './icons';

export const SettingsModal = () => {
    const isSettingOpen = useAppStore(state => state.isSettingsOpen);
    const setIsSettingOpen = useAppStore(state => state.setIsSettingsOpen);
    const settingTab = useAppStore(state => state.settingTab);
    const setSettingTab = useAppStore(state => state.setSettingTab);

    const settingMenu = [
        {
            icon: <IconUser size={16} strokeWidth={2} className="text-muted-foreground" />,
            title: 'Profiel',
            key: SETTING_TABS.PROFILE,
            component: <ProfileSettings />,
        },
        {
            icon: <IconSettings2 size={16} strokeWidth={2} className="text-muted-foreground" />,
            title: 'Aanpassen',
            key: SETTING_TABS.PERSONALIZATION,
            component: <PersonalizationSettings />,
        },
        {
            icon: <IconBolt size={16} strokeWidth={2} className="text-muted-foreground" />,
            title: 'Gebruik',
            key: SETTING_TABS.CREDITS,
            component: <CreditsSettings />,
        },
        {
            icon: <IconKey size={16} strokeWidth={2} className="text-muted-foreground" />,
            title: 'API-sleutels',
            key: SETTING_TABS.API_KEYS,
            component: <ApiKeySettings />,
        },
    ];

    return (
        <Dialog open={isSettingOpen} onOpenChange={() => setIsSettingOpen(false)}>
            <DialogContent
                ariaTitle="Settings"
                className="h-full max-h-[600px] !max-w-[760px] overflow-x-hidden rounded-xl p-0"
            >
                <div className="no-scrollbar relative max-w-full overflow-y-auto overflow-x-hidden">
                    <h3 className="border-border mx-5 border-b py-4 text-lg font-bold">Instellingen</h3>
                    <div className="flex flex-row gap-6 p-4">
                        <div className="flex w-[160px] shrink-0 flex-col gap-1">
                            {settingMenu.map(setting => (
                                <Button
                                    key={setting.key}
                                    rounded="full"
                                    className="justify-start"
                                    variant={settingTab === setting.key ? 'secondary' : 'ghost'}
                                    onClick={() => setSettingTab(setting.key)}
                                >
                                    {setting.icon}
                                    {setting.title}
                                </Button>
                            ))}
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden px-4">
                            {settingMenu.find(setting => setting.key === settingTab)?.component}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const MCPSettings = () => {
    const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
    const { mcpConfig, addMcpConfig, removeMcpConfig, updateSelectedMCP, selectedMCP } =
        useMcpToolsStore();

    return (
        <div className="flex w-full flex-col gap-6 overflow-x-hidden">
            <div className="flex flex-col">
                <h2 className="flex items-center gap-1 text-base font-medium">MCP-hulpmiddelen</h2>
                <p className="text-muted-foreground text-xs">
                    Verbind je MCP-hulpmiddelen. Dit werkt alleen met je eigen API-sleutels.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs font-medium">
                    Verbonden hulpmiddelen{' '}
                    <Badge
                        variant="secondary"
                        className="text-brand inline-flex items-center gap-1 rounded-full bg-transparent"
                    >
                        <span className="bg-brand inline-block size-2 rounded-full"></span>
                        {mcpConfig && Object.keys(mcpConfig).length} verbonden
                    </Badge>
                </p>
                {mcpConfig &&
                    Object.keys(mcpConfig).length > 0 &&
                    Object.keys(mcpConfig).map(key => (
                        <div
                            key={key}
                            className="bg-secondary divide-border border-border flex h-12 w-full flex-1 flex-row items-center gap-2 divide-x-2 rounded-lg border px-2.5 py-2"
                        >
                            <div className="flex w-full flex-row items-center gap-2">
                                <ToolIcon /> <Badge>{key}</Badge>
                                <p className="text-muted-foreground line-clamp-1 flex-1 text-sm">
                                    {mcpConfig[key]}
                                </p>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    tooltip="Hulpmiddel verwijderen"
                                    onClick={() => {
                                        removeMcpConfig(key);
                                    }}
                                >
                                    <IconTrash
                                        size={14}
                                        strokeWidth={2}
                                        className="text-muted-foreground"
                                    />
                                </Button>
                            </div>
                        </div>
                    ))}

                <Button
                    size="sm"
                    rounded="full"
                    className="mt-2 self-start"
                    onClick={() => setIsAddToolDialogOpen(true)}
                >
                    Hulpmiddel toevoegen
                </Button>
            </div>

            <div className="mt-6 border-t border-dashed pt-6">
                <p className="text-muted-foreground text-xs">Meer informatie over MCP:</p>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                    <a
                        href="https://mcp.composio.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center hover:underline"
                    >
                        Bladeren door Composio MCP-directory →
                    </a>
                    <a
                        href="https://www.anthropic.com/news/model-context-protocol"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center hover:underline"
                    >
                        MCP-documentatie lezen →
                    </a>
                </div>
            </div>

            <AddToolDialog
                isOpen={isAddToolDialogOpen}
                onOpenChange={setIsAddToolDialogOpen}
                onAddTool={addMcpConfig}
            />
        </div>
    );
};

type AddToolDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTool: (tool: Record<string, string>) => void;
};

const AddToolDialog = ({ isOpen, onOpenChange, onAddTool }: AddToolDialogProps) => {
    const [mcpToolName, setMcpToolName] = useState('');
    const [mcpToolUrl, setMcpToolUrl] = useState('');
    const [error, setError] = useState('');
    const { mcpConfig } = useMcpToolsStore();

    const handleAddTool = () => {
        // Validate inputs
        if (!mcpToolName.trim()) {
            setError('Tool name is required');
            return;
        }

        if (!mcpToolUrl.trim()) {
            setError('Tool URL is required');
            return;
        }

        // Check for duplicate names
        if (mcpConfig && mcpConfig[mcpToolName]) {
            setError('A tool with this name already exists');
            return;
        }

        // Clear error if any
        setError('');

        // Add the tool
        onAddTool({
            [mcpToolName]: mcpToolUrl,
        });

        // Reset form and close dialog
        setMcpToolName('');
        setMcpToolUrl('');
        onOpenChange(false);
    };

    // Reset error when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setError('');
            setMcpToolName('');
            setMcpToolUrl('');
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent ariaTitle="Add MCP Tool" className="!max-w-md">
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Nieuw MCP-hulpmiddel toevoegen</h3>

                    {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Naam hulpmiddel</label>
                        <Input
                            placeholder="Naam hulpmiddel"
                            value={mcpToolName}
                            onChange={e => {
                                const key = e.target.value?.trim().toLowerCase().replace(/ /g, '-');
                                setMcpToolName(key);
                                // Clear error when user types
                                if (error) setError('');
                            }}
                        />
                        <p className="text-muted-foreground text-xs">
                            Wordt automatisch omgezet naar kleine letters met koppeltekens
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Server-URL hulpmiddel</label>
                        <Input
                            placeholder="https://your-mcp-server.com"
                            value={mcpToolUrl}
                            onChange={e => {
                                setMcpToolUrl(e.target.value);
                                // Clear error when user types
                                if (error) setError('');
                            }}
                        />
                        <p className="text-muted-foreground text-xs">
                            Voorbeeld: https://jouw-mcp-server.com
                        </p>
                    </div>
                </div>
                <DialogFooter className="border-border mt-4 border-t pt-4">
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="bordered"
                            rounded={'full'}
                            onClick={() => handleOpenChange(false)}
                        >
                            Annuleren
                        </Button>
                        <Button onClick={handleAddTool} rounded="full">
                            Toevoegen
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const ApiKeySettings = () => {
    const apiKeys = useApiKeysStore(state => state.getAllKeys());
    const setApiKey = useApiKeysStore(state => state.setKey);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const apiKeyList = [
        {
            name: 'OpenAI',
            key: 'OPENAI_API_KEY' as keyof ApiKeys,
            value: apiKeys.OPENAI_API_KEY,
            url: 'https://platform.openai.com/api-keys',
        },
        {
            name: 'Anthropic',
            key: 'ANTHROPIC_API_KEY' as keyof ApiKeys,
            value: apiKeys.ANTHROPIC_API_KEY,
            url: 'https://console.anthropic.com/settings/keys',
        },
        {
            name: 'Google Gemini',
            key: 'GEMINI_API_KEY' as keyof ApiKeys,
            value: apiKeys.GEMINI_API_KEY,
            url: 'https://ai.google.dev/api',
        },
    ];

    const validateApiKey = (apiKey: string, provider: string) => {
        // Validation logic will be implemented later
        console.log(`Validating ${provider} API key: ${apiKey}`);
        return true;
    };

    const handleSave = (keyName: keyof ApiKeys, value: string) => {
        setApiKey(keyName, value);
        setIsEditing(null);
    };

    const getMaskedKey = (key: string) => {
        if (!key) return '';
        return '****************' + key.slice(-4);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <h2 className="flex items-center gap-1 text-base font-semibold">
                    API-sleutels <BYOKIcon />
                </h2>

                <p className="text-muted-foreground text-xs">
                    Standaard wordt je API-sleutel lokaal opgeslagen in je browser en nooit ergens
                    anders heen gestuurd.
                </p>
            </div>

            {apiKeyList.map(apiKey => (
                <div key={apiKey.key} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{apiKey.name} API Key:</span>
                        <a
                            href={apiKey.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 underline-offset-2 hover:underline"
                        >
                            (Haal hier je sleutel op)
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing === apiKey.key ? (
                            <>
                                <div className="flex-1">
                                    <Input
                                        value={apiKey.value || ''}
                                        placeholder={`Enter ${apiKey.name} API key`}
                                        onChange={e => setApiKey(apiKey.key, e.target.value)}
                                    />
                                </div>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSave(apiKey.key, apiKey.value || '')}
                                >
                                    <span className="flex items-center gap-1">✓ Save</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-1.5">
                                    {apiKey.value ? (
                                        <span className="flex-1">{getMaskedKey(apiKey.value)}</span>
                                    ) : (
                                        <span className="text-muted-foreground flex-1 text-sm">
                                            Geen API-sleutel ingesteld
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant={'bordered'}
                                    size="sm"
                                    onClick={() => setIsEditing(apiKey.key)}
                                >
                                    {apiKey.value ? 'Sleutel wijzigen' : 'Sleutel toevoegen'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const CreditsSettings = () => {
    const remainingCredits = useChatStore(state => state.creditLimit.remaining);
    const maxLimit = useChatStore(state => state.creditLimit.maxLimit);
    const resetDate = useChatStore(state => state.creditLimit.reset);

    const info = [
        {
            title: 'Abonnement',
            value: (
                <Badge variant="secondary" className="bg-brand/10 text-brand rounded-full">
                    <span className="text-xs font-medium">GRATIS</span>
                </Badge>
            ),
        },
        {
            title: 'Tegoed',
            value: (
                <div className="flex h-7 flex-row items-center gap-1 rounded-full py-1">
                    <IconBoltFilled size={14} strokeWidth={2} className="text-brand" />
                    <span className="text-brand text-sm font-medium">{remainingCredits}</span>
                    <span className="text-brand text-sm opacity-50">/</span>
                    <span className="text-brand text-sm opacity-50">{maxLimit}</span>
                </div>
            ),
        },
        {
            title: 'Volgende reset',
            value: moment(resetDate).fromNow(),
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
                <h2 className="flex items-center gap-1 text-base font-medium">Gebruikstegoed</h2>
                <Alert variant="info" className="w-full">
                    <AlertDescription className="text-muted-foreground/70 text-sm leading-tight">
                        Je ontvangt elke dag wat gratis tegoed. Zodra het tegoed op is, kun je je
                        eigen API-sleutels gebruiken om door te gaan.
                    </AlertDescription>
                </Alert>

                <div className="divide-border flex w-full flex-col gap-1 divide-y">
                    {info.map(item => (
                        <div key={item.title} className="flex flex-row justify-between gap-1 py-4">
                            <span className="text-muted-foreground text-sm">{item.title}</span>
                            <span className="text-sm font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ProfileSettings = () => {
    const { user, refetch, signOut } = useAuthFull();
    const setIsSettingsOpen = useAppStore(state => state.setIsSettingsOpen);

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!user) {
        return (
            <div className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm">
                    Je bent niet ingelogd. Log in om je profiel te bekijken.
                </p>
            </div>
        );
    }

    const handleSave = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Wachtwoorden komen niet overeen' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: name !== user.name ? name : undefined,
                    email: email !== user.email ? email : undefined,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || 'Bijwerken mislukt' });
            } else {
                setMessage({ type: 'success', text: 'Profiel bijgewerkt' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                await refetch();
            }
        } catch {
            setMessage({ type: 'error', text: 'Er is iets misgegaan' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;

        setDeleting(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                await signOut();
                setIsSettingsOpen(false);
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Verwijderen mislukt' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Er is iets misgegaan' });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <h2 className="text-base font-semibold">Profiel</h2>
                <p className="text-muted-foreground text-xs">Beheer je accountinformatie</p>
            </div>

            {message && (
                <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                    <AlertDescription className="text-sm">{message.text}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Naam</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Je naam" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">E-mailadres</label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="je@email.nl" type="email" />
                </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-dashed pt-4">
                <h3 className="text-sm font-semibold">Wachtwoord wijzigen</h3>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Huidig wachtwoord</label>
                    <Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="••••••••" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Nieuw wachtwoord</label>
                    <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="••••••••" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Bevestig nieuw wachtwoord</label>
                    <Input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" />
                </div>
            </div>

            <div className="flex flex-row justify-between gap-2 border-t border-dashed pt-4">
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Verwijderen...' : 'Account verwijderen'}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? 'Opslaan...' : 'Opslaan'}
                </Button>
            </div>
        </div>
    );
};

const MAX_CHAR_LIMIT = 6000;

export const PersonalizationSettings = () => {
    const customInstructions = useChatStore(state => state.customInstructions);
    const setCustomInstructions = useChatStore(state => state.setCustomInstructions);
    const { editor } = useChatEditor({
        charLimit: MAX_CHAR_LIMIT,
        defaultContent: customInstructions,
        placeholder: 'Enter your custom instructions',
        enableEnter: true,
        onUpdate(props) {
            setCustomInstructions(props.editor.getText());
        },
    });
    return (
        <div className="flex flex-col gap-1 pb-3">
            <h3 className="text-base font-semibold">Pas je AI-antwoord aan</h3>
            <p className="text-muted-foreground text-sm">
                Deze instructies worden aan het begin van elk bericht toegevoegd.
            </p>
            <div className=" shadow-subtle-sm border-border mt-2 rounded-lg border p-3">
                <ChatEditor editor={editor} />
            </div>
        </div>
    );
};
