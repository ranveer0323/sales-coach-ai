'use client';

import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AudioUploader } from '@/components/AudioUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { generateMockData } from '@/lib/mockData';
import { saveRecording, saveTranscript, saveAnalysis } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { generateId } from '@/lib/mockData';
import { transcribeAudio, analyzeTranscript } from '@/lib/api';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleUploadComplete = async (file: File, audioUrl: string) => {
    try {
      setIsLoading(true);
      toast.info('Processing your audio file. This may take a minute...');

      // Create and save the recording
      const recordingId = generateId();
      const recording = {
        id: recordingId,
        fileName: file.name,
        fileUrl: audioUrl,
        duration: 0, // Will be updated after transcription
        createdAt: new Date().toISOString()
      };

      saveRecording(recording);

      // Transcribe the audio
      const transcriptionResult = await transcribeAudio(file);

      // Create and save the transcript
      const transcript = {
        id: transcriptionResult.id,
        recordingId,
        text: transcriptionResult.text,
        utterances: transcriptionResult.utterances,
        highlights: [],
        createdAt: new Date().toISOString()
      };

      saveTranscript(transcript);

      toast.info('Analyzing the transcript...');

      // Analyze the transcript
      const analysisResult = await analyzeTranscript(transcript.text);

      // Create and save the analysis
      const analysis = {
        id: analysisResult.id,
        recordingId,
        transcriptId: transcript.id,
        overallScore: analysisResult.overallScore,
        metrics: analysisResult.metrics,
        suggestions: analysisResult.suggestions,
        createdAt: new Date().toISOString()
      };

      // Update the transcript with highlights
      const updatedTranscript = {
        ...transcript,
        highlights: analysisResult.highlights
      };

      saveTranscript(updatedTranscript);
      saveAnalysis(analysis);

      toast.success('Analysis complete!');

      // Navigate to the results page
      router.push(`/analysis/${recordingId}`);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Error processing audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = () => {
    try {
      setIsLoading(true);

      // Generate and save mock data
      const { recording, transcript, analysis } = generateMockData();

      saveRecording(recording);
      saveTranscript(transcript);
      saveAnalysis(analysis);

      // Navigate to the results page
      router.push(`/analysis/${recording.id}`);
    } catch (error) {
      console.error('Error generating demo:', error);
      toast.error('Error generating demo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sales Call Analysis AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your real estate sales call recordings for AI-powered analysis and actionable feedback to improve your sales techniques.
          </p>
        </header>

        <div className="mb-8 max-w-2xl mx-auto">
          <Collapsible
            open={isHowItWorksOpen}
            onOpenChange={setIsHowItWorksOpen}
            className="w-full"
          >
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="border-b cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <CardTitle className="text-center">How It Works</CardTitle>
                      <CardDescription className="text-center">
                        Our AI analyzes your sales calls and provides actionable feedback
                      </CardDescription>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0">
                      {isHowItWorksOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-6">
                  <ol className="list-decimal list-inside space-y-3">
                    <li className="pl-2 text-center">
                      <span className="font-medium">Upload your call recording</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload an audio file of your real estate sales call
                      </p>
                    </li>
                    <li className="pl-2 text-center">
                      <span className="font-medium">AI transcribes your call</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        AssemblyAI automatically converts speech to text with speaker identification
                      </p>
                    </li>
                    <li className="pl-2 text-center">
                      <span className="font-medium">AI analyzes sales techniques</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        OpenAI GPT-4o mini evaluates key real estate sales metrics
                      </p>
                    </li>
                    <li className="pl-2 text-center">
                      <span className="font-medium">Review detailed feedback</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get actionable insights to improve your sales approach
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-center">Upload Your Sales Call</CardTitle>
              <CardDescription className="text-center">
                Upload an audio recording of your sales call to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AudioUploader onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-center">Try a Demo</CardTitle>
              <CardDescription className="text-center">
                See how the analysis works with a sample sales call
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-sm text-center text-muted-foreground">
                Not ready to upload your own call? Try our demo to see how the analysis works with a sample real estate sales call.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={handleDemoClick}
                  disabled={isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? 'Loading Demo...' : 'View Demo Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
