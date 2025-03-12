import { Recording, Transcript, Analysis } from '@/types';

// Storage keys
const STORAGE_KEYS = {
    RECORDINGS: 'sales_analysis_recordings',
    TRANSCRIPTS: 'sales_analysis_transcripts',
    ANALYSES: 'sales_analysis_analyses',
};

// Helper function to safely parse JSON from localStorage
const safelyParseJSON = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return defaultValue;
    }
};

// Helper function to safely stringify and save JSON to localStorage
const safelySaveJSON = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// Recordings
export const getRecordings = (): Recording[] => {
    return safelyParseJSON<Recording[]>(STORAGE_KEYS.RECORDINGS, []);
};

export const saveRecording = (recording: Recording): void => {
    const recordings = getRecordings();
    const updatedRecordings = [...recordings, recording];
    safelySaveJSON(STORAGE_KEYS.RECORDINGS, updatedRecordings);
};

export const updateRecording = (updatedRecording: Recording): void => {
    const recordings = getRecordings();
    const updatedRecordings = recordings.map(recording =>
        recording.id === updatedRecording.id ? updatedRecording : recording
    );
    safelySaveJSON(STORAGE_KEYS.RECORDINGS, updatedRecordings);
};

export const getRecordingById = (id: string): Recording | undefined => {
    const recordings = getRecordings();
    return recordings.find(recording => recording.id === id);
};

// Transcripts
export const getTranscripts = (): Transcript[] => {
    return safelyParseJSON<Transcript[]>(STORAGE_KEYS.TRANSCRIPTS, []);
};

export const saveTranscript = (transcript: Transcript): void => {
    const transcripts = getTranscripts();
    const updatedTranscripts = [...transcripts, transcript];
    safelySaveJSON(STORAGE_KEYS.TRANSCRIPTS, updatedTranscripts);

    // Update the associated recording with the transcript ID
    const recording = getRecordingById(transcript.recordingId);
    if (recording) {
        updateRecording({
            ...recording,
            transcriptId: transcript.id
        });
    }
};

export const getTranscriptById = (id: string): Transcript | undefined => {
    const transcripts = getTranscripts();
    return transcripts.find(transcript => transcript.id === id);
};

export const getTranscriptByRecordingId = (recordingId: string): Transcript | undefined => {
    const transcripts = getTranscripts();
    return transcripts.find(transcript => transcript.recordingId === recordingId);
};

// Analyses
export const getAnalyses = (): Analysis[] => {
    return safelyParseJSON<Analysis[]>(STORAGE_KEYS.ANALYSES, []);
};

export const saveAnalysis = (analysis: Analysis): void => {
    const analyses = getAnalyses();
    const updatedAnalyses = [...analyses, analysis];
    safelySaveJSON(STORAGE_KEYS.ANALYSES, updatedAnalyses);

    // Update the associated recording with the analysis ID
    const recording = getRecordingById(analysis.recordingId);
    if (recording) {
        updateRecording({
            ...recording,
            analysisId: analysis.id
        });
    }
};

export const getAnalysisById = (id: string): Analysis | undefined => {
    const analyses = getAnalyses();
    return analyses.find(analysis => analysis.id === id);
};

export const getAnalysisByRecordingId = (recordingId: string): Analysis | undefined => {
    const analyses = getAnalyses();
    return analyses.find(analysis => analysis.recordingId === recordingId);
};

// Clear all data
export const clearAllData = (): void => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.RECORDINGS);
    localStorage.removeItem(STORAGE_KEYS.TRANSCRIPTS);
    localStorage.removeItem(STORAGE_KEYS.ANALYSES);
}; 