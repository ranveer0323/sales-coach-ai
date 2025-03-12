// Recording types
export type Recording = {
    id: string;
    fileName: string;
    fileUrl: string;
    duration: number;
    createdAt: string;
    transcriptId?: string;
    analysisId?: string;
};

// Transcript types
export type Highlight = {
    startIndex: number;
    endIndex: number;
    type: 'positive' | 'negative' | 'question' | 'objection' | 'closing';
    comment: string;
};

export type Utterance = {
    speaker: string;
    text: string;
    startIndex: number;
    endIndex: number;
};

export type Transcript = {
    id: string;
    recordingId: string;
    text: string;
    utterances: Utterance[];
    highlights: Highlight[];
    createdAt: string;
};

// Analysis types
export type Metric = {
    name: string;
    value: number;
    description: string;
};

export type Suggestion = {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
};

export type Analysis = {
    id: string;
    recordingId: string;
    transcriptId: string;
    overallScore: number;
    metrics: Metric[];
    suggestions: Suggestion[];
    createdAt: string;
};

// API response types
export type TranscriptionResponse = {
    id: string;
    text: string;
    utterances: Utterance[];
};

export type AnalysisResponse = {
    id: string;
    overallScore: number;
    metrics: Metric[];
    suggestions: Suggestion[];
    highlights: Highlight[];
};

// State types
export type AppState = {
    recordings: Recording[];
    currentRecording: Recording | null;
    currentTranscript: Transcript | null;
    currentAnalysis: Analysis | null;
    isLoading: boolean;
    error: string | null;
};

// Real estate specific metrics
export const REAL_ESTATE_METRICS = [
    'Information Gathering',
    'Property Presentation',
    'Amenities Coverage',
    'Neighborhood Benefits',
    'Objection Handling',
    'Closing Techniques'
]; 