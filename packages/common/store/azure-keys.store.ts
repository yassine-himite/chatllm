import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AzureApiKey = {
    id: string;
    name: string;
    apiKey: string;
    endpoint: string;
    deploymentName: string;
};

type AzureKeysState = {
    keys: AzureApiKey[];
    selectedKeyId: string | null;
    addKey: (name: string, apiKey: string, endpoint: string, deploymentName: string) => void;
    updateKey: (id: string, updates: Partial<Omit<AzureApiKey, 'id'>>) => void;
    removeKey: (id: string) => void;
    setSelectedKeyId: (id: string | null) => void;
    getAllKeys: () => AzureApiKey[];
    getSelectedKey: () => AzureApiKey | undefined;
};

export const useAzureKeysStore = create<AzureKeysState>()(
    persist(
        (set, get) => ({
            keys: [],
            selectedKeyId: null,
            addKey: (name, apiKey, endpoint, deploymentName) => {
                const id = Math.random().toString(36).slice(2, 11);
                set(state => ({
                    keys: [...state.keys, { id, name, apiKey, endpoint, deploymentName }],
                    selectedKeyId: state.selectedKeyId ?? id,
                }));
            },
            updateKey: (id, updates) =>
                set(state => ({
                    keys: state.keys.map(k => (k.id === id ? { ...k, ...updates } : k)),
                })),
            removeKey: (id) =>
                set(state => {
                    const newKeys = state.keys.filter(k => k.id !== id);
                    return {
                        keys: newKeys,
                        selectedKeyId:
                            state.selectedKeyId === id
                                ? (newKeys[0]?.id ?? null)
                                : state.selectedKeyId,
                    };
                }),
            setSelectedKeyId: (id) => set({ selectedKeyId: id }),
            getAllKeys: () => get().keys,
            getSelectedKey: () => {
                const { keys, selectedKeyId } = get();
                return keys.find(k => k.id === selectedKeyId);
            },
        }),
        { name: 'azure-keys-storage' }
    )
);
