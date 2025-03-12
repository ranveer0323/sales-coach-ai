'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranscriptViewer } from '@/components/TranscriptViewer';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { getRecordingById, getTranscriptByRecordingId, getAnalysisByRecordingId } from '@/lib/storage';
import { Recording, Transcript, Analysis } from '@/types';
import { toast } from 'sonner';

export default function AnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const recordingId = params.id as string;

    const [recording, setRecording] = useState<Recording | null>(null);
    const [transcript, setTranscript] = useState<Transcript | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentAudioTime, setCurrentAudioTime] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const loadData = () => {
            try {
                const recordingData = getRecordingById(recordingId);
                if (!recordingData) {
                    toast.error('Recording not found');
                    router.push('/');
                    return;
                }

                const transcriptData = getTranscriptByRecordingId(recordingId);
                if (!transcriptData) {
                    toast.error('Transcript not found');
                    router.push('/');
                    return;
                }

                const analysisData = getAnalysisByRecordingId(recordingId);
                if (!analysisData) {
                    toast.error('Analysis not found');
                    router.push('/');
                    return;
                }

                setRecording(recordingData);
                setTranscript(transcriptData);
                setAnalysis(analysisData);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Failed to load analysis data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [recordingId, router]);

    // Update current audio time
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentAudioTime(audioRef.current.currentTime);
        }
    };

    // Handle back button click
    const handleBackClick = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-4">Loading Analysis</h2>
                            <p className="text-gray-500 mb-4">Please wait while we load your sales call analysis...</p>
                            <div className="animate-pulse flex space-x-4 justify-center">
                                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!recording || !transcript || !analysis) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-4">Data Not Found</h2>
                            <p className="text-gray-500 mb-4">We couldn't find the analysis data you're looking for.</p>
                            <Button onClick={handleBackClick}>Return to Home</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <Toaster />
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl font-bold">Sales Call Analysis</h1>
                        <Button variant="outline" onClick={handleBackClick}>
                            Back to Home
                        </Button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {recording.fileName} • {new Date(recording.createdAt).toLocaleDateString()}
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Call Recording</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <audio
                                    ref={audioRef}
                                    controls
                                    src={recording.fileUrl}
                                    className="w-full"
                                    onTimeUpdate={handleTimeUpdate}
                                />
                            </CardContent>
                        </Card>

                        <TranscriptViewer
                            transcript={transcript.text}
                            utterances={transcript.utterances}
                            highlights={transcript.highlights}
                            currentAudioTime={currentAudioTime}
                            audioRef={audioRef as React.RefObject<HTMLAudioElement>}
                        />
                    </div>

                    <div>
                        <AnalysisDashboard analysisResult={analysis} />
                    </div>
                </div>
            </div>
        </div>
    );
} 