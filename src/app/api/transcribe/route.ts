import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/mockData';
import { SAMPLE_TRANSCRIPT } from '@/lib/mockData';

// In a real application, this would connect to OpenAI's Whisper API
export async function POST(request: NextRequest) {
    try {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real implementation, we would:
        // 1. Extract the audio file from the request
        // 2. Send it to OpenAI's Whisper API
        // 3. Return the transcription

        // For the MVP, we'll return a mock response
        return NextResponse.json({
            id: generateId(),
            text: SAMPLE_TRANSCRIPT
        });
    } catch (error) {
        console.error('Error in transcription:', error);
        return NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
        );
    }
} 