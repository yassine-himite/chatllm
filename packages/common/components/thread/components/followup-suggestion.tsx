import { useChatStore } from '@repo/common/store';
import { Button } from '@repo/ui';
import { IconHelpHexagon } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { useShallow } from 'zustand/react/shallow';

export const FollowupSuggestions = ({ suggestions }: { suggestions: string[] }) => {
    const editor: Editor | undefined = useChatStore(useShallow(state => state.editor));

    if (!suggestions || suggestions?.length === 0) {
        return null;
    }

    return (
        <div className="border-border my-4 flex flex-col items-start gap-2 border-t border-dashed py-4">
            <div className="text-muted-foreground flex flex-row items-center gap-1.5 py-2 text-xs font-medium">
                <IconHelpHexagon size={16} strokeWidth={2} className="text-muted-foreground" /> Vervolgvraag
            </div>
            <div className="flex flex-col gap-2">
                {suggestions?.map(suggestion => (
                    <div key={suggestion}>
                        <Button
                            variant="bordered"
                            size="default"
                            rounded="lg"
                            className=" hover:text-brand group h-auto min-h-7 max-w-full cursor-pointer justify-start overflow-hidden whitespace-normal py-1.5 text-left"
                            onClick={() => {
                                editor?.commands.clearContent();
                                editor?.commands.insertContent(suggestion);
                            }}
                        >
                            {suggestion}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
