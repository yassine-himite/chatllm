import { useChatStore } from '@repo/common/store';
import { Button } from '@repo/ui';
import {
    IconBook,
    IconBulb,
    IconChartBar,
    IconPencil,
    IconQuestionMark,
} from '@tabler/icons-react';
import { Editor } from '@tiptap/react';

export const examplePrompts = {
    howTo: [
        'Hoe plan je een duurzame moestuin voor kleine ruimtes?',
        'Hoe bereid je je voor op je eerste internationale reiservaring?',
        'Hoe stel je een persoonlijk budget in dat echt werkt?',
        'Hoe verbeter je je spreekvaardigheden voor professionele settings?',
    ],

    explainConcepts: [
        'Leg in eenvoudige termen uit hoe blockchain-technologie werkt.',
        'Wat is kwantumcomputing en hoe verschilt het van traditionele computers?',
        'Leg het concept emotionele intelligentie uit en waarom het belangrijk is.',
        'Hoe werkt koolstofafvangtechnologie om klimaatverandering te bestrijden?',
    ],

    creative: [
        'Schrijf een kort verhaal over een toevallige ontmoeting die iemands leven verandert.',
        'Maak een recept voor een fusiongerecht dat Italiaanse en Japanse keukens combineert.',
        'Ontwerp een fictieve duurzame stad van de toekomst.',
        'Ontwikkel een karakterprofiel voor de hoofdpersoon van een sciencefictionroman.',
    ],

    advice: [
        'Wat is de beste aanpak om een salarisverhoging te onderhandelen?',
        'Hoe bereid ik me als beginnende hardloper voor op een marathon?',
        'Welke strategieën helpen bij het beheren van de werk-privébalans bij thuiswerken?',
        'Waar moet ik op letten als ik voor het eerst een huisdier adopteer?',
    ],

    analysis: [
        'Analyseer de potentiële impact van kunstmatige intelligentie op de gezondheidszorg.',
        'Vergelijk verschillende benaderingen om klimaatverandering aan te pakken.',
        'Onderzoek de voor- en nadelen van verschillende hernieuwbare energiebronnen.',
        'Analyseer hoe sociale media de communicatie in het afgelopen decennium heeft veranderd.',
    ],
};

export const getRandomPrompt = (category?: keyof typeof examplePrompts) => {
    if (category && examplePrompts[category]) {
        const prompts = examplePrompts[category];
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    // If no category specified or invalid category, return a random prompt from any category
    const categories = Object.keys(examplePrompts) as Array<keyof typeof examplePrompts>;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const prompts = examplePrompts[randomCategory];
    return prompts[Math.floor(Math.random() * prompts.length)];
};

// Map of category to icon component
const categoryIcons = {
    howTo: { name: 'Hoe doe je', icon: IconQuestionMark, color: '!text-yellow-700' },
    explainConcepts: { name: 'Concepten uitleggen', icon: IconBulb, color: '!text-blue-700' },
    creative: { name: 'Creatief', icon: IconPencil, color: '!text-green-700' },
    advice: { name: 'Advies', icon: IconBook, color: '!text-purple-700' },
    analysis: { name: 'Analyse', icon: IconChartBar, color: '!text-red-700' },
};

export const ExamplePrompts = () => {
    const editor: Editor | undefined = useChatStore(state => state.editor);
    const handleCategoryClick = (category: keyof typeof examplePrompts) => {
        console.log('editor', editor);
        if (!editor) return;
        const randomPrompt = getRandomPrompt(category);
        editor.commands.clearContent();
        editor.commands.insertContent(randomPrompt);
    };

    return (
        <div className="mb-8 flex w-full flex-wrap justify-center gap-2 p-6">
            {Object.entries(categoryIcons).map(([category, value], index) => (
                <Button
                    key={index}
                    variant="bordered"
                    rounded="full"
                    size="sm"
                    onClick={() => handleCategoryClick(category as keyof typeof examplePrompts)}
                >
                    <value.icon size={16} className={'text-muted-foreground/50'} />
                    {value.name}
                </Button>
            ))}
        </div>
    );
};
