import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Highlight, Utterance } from '@/types';

type TranscriptViewerProps = {
    transcript: string;
    utterances: Utterance[];
    highlights: Highlight[];
    currentAudioTime?: number;
    audioRef?: React.RefObject<HTMLAudioElement>;
};

export function TranscriptViewer({
    transcript,
    utterances,
    highlights,
    currentAudioTime = 0,
    audioRef
}: TranscriptViewerProps) {
    const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Function to get highlight color based on type
    const getHighlightColor = (type: Highlight['type']) => {
        switch (type) {
            case 'positive':
                return 'bg-green-100 dark:bg-green-900/30';
            case 'negative':
                return 'bg-red-100 dark:bg-red-900/30';
            case 'question':
                return 'bg-blue-100 dark:bg-blue-900/30';
            case 'objection':
                return 'bg-yellow-100 dark:bg-yellow-900/30';
            case 'closing':
                return 'bg-purple-100 dark:bg-purple-900/30';
            default:
                return 'bg-gray-100 dark:bg-gray-800';
        }
    };

    // Function to get highlight text color based on type
    const getHighlightTextColor = (type: Highlight['type']) => {
        switch (type) {
            case 'positive':
                return 'text-green-800 dark:text-green-200';
            case 'negative':
                return 'text-red-800 dark:text-red-200';
            case 'question':
                return 'text-blue-800 dark:text-blue-200';
            case 'objection':
                return 'text-yellow-800 dark:text-yellow-200';
            case 'closing':
                return 'text-purple-800 dark:text-purple-200';
            default:
                return '';
        }
    };

    // Function to get speaker badge color
    const getSpeakerBadgeColor = (speaker: string) => {
        if (speaker.toLowerCase().includes('agent')) {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
        } else {
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    // Function to render transcript with highlights and speaker information
    const renderTranscriptWithHighlights = () => {
        if (!transcript || !utterances.length) return null;

        return utterances.map((utterance, index) => {
            // Find highlights that overlap with this utterance
            const utteranceHighlights = highlights.filter(highlight =>
                (highlight.startIndex >= utterance.startIndex && highlight.startIndex < utterance.endIndex) ||
                (highlight.endIndex > utterance.startIndex && highlight.endIndex <= utterance.endIndex) ||
                (highlight.startIndex <= utterance.startIndex && highlight.endIndex >= utterance.endIndex)
            );

            // If there are no highlights, just render the utterance with speaker info
            if (utteranceHighlights.length === 0) {
                return (
                    <div key={`utterance-${index}`} className="mb-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${getSpeakerBadgeColor(utterance.speaker)}`}>
                            {utterance.speaker}
                        </span>
                        <p className="pl-2">{utterance.text}</p>
                    </div>
                );
            }

            // If there are highlights, render the utterance with highlighted sections
            let lastIndex = utterance.startIndex;
            const result = [];

            // Add the speaker badge
            result.push(
                <span key={`speaker-${index}`} className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${getSpeakerBadgeColor(utterance.speaker)}`}>
                    {utterance.speaker}
                </span>
            );

            // Sort highlights by startIndex
            const sortedHighlights = [...utteranceHighlights].sort((a, b) => a.startIndex - b.startIndex);

            for (const highlight of sortedHighlights) {
                // Ensure highlight boundaries are within the utterance
                const highlightStart = Math.max(highlight.startIndex, utterance.startIndex);
                const highlightEnd = Math.min(highlight.endIndex, utterance.endIndex);

                // Add text before the highlight
                if (highlightStart > lastIndex) {
                    result.push(
                        <span key={`text-${lastIndex}`}>
                            {transcript.substring(lastIndex, highlightStart)}
                        </span>
                    );
                }

                // Add the highlighted text
                result.push(
                    <span
                        key={`highlight-${highlightStart}`}
                        className={`${getHighlightColor(highlight.type)} ${getHighlightTextColor(highlight.type)} px-1 py-0.5 rounded cursor-pointer`}
                        onClick={() => setActiveHighlight(highlight)}
                    >
                        {transcript.substring(highlightStart, highlightEnd)}
                    </span>
                );

                lastIndex = highlightEnd;
            }

            // Add any remaining text
            if (lastIndex < utterance.endIndex) {
                result.push(
                    <span key={`text-${lastIndex}`}>
                        {transcript.substring(lastIndex, utterance.endIndex)}
                    </span>
                );
            }

            return (
                <div key={`utterance-${index}`} className="mb-4 pl-2">
                    {result}
                </div>
            );
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Call Transcript</span>
                    {audioRef?.current && (
                        <span className="text-sm font-normal">
                            {new Date(currentAudioTime * 1000).toISOString().substr(14, 5)} /
                            {new Date(audioRef.current.duration * 1000).toISOString().substr(14, 5)}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div
                        ref={transcriptRef}
                        className="max-h-[400px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-sm leading-relaxed whitespace-pre-wrap"
                    >
                        {renderTranscriptWithHighlights()}
                    </div>

                    {activeHighlight && (
                        <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                            <h4 className={`font-medium mb-1 ${getHighlightTextColor(activeHighlight.type)}`}>
                                {activeHighlight.type.charAt(0).toUpperCase() + activeHighlight.type.slice(1)} Point
                            </h4>
                            <p className="text-sm">{activeHighlight.comment}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 