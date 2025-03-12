import { NextRequest, NextResponse } from 'next/server';
import { generateId, generateMockMetrics, generateMockSuggestions, generateMockHighlights } from '@/lib/mockData';

// In a real application, this would connect to OpenAI's API for analysis
export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        const { transcript } = body;

        if (!transcript) {
            return NextResponse.json(
                { error: 'Transcript is required' },
                { status: 400 }
            );
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // In a real implementation, we would:
        // 1. Send the transcript to OpenAI's API with a custom prompt
        // 2. Process the response to extract metrics, suggestions, and highlights
        // 3. Return the structured analysis

        // For the MVP, we'll return a mock response
        const overallScore = Math.floor(Math.random() * 30) + 65; // Random score between 65-95

        return NextResponse.json({
            id: generateId(),
            overallScore,
            metrics: generateMockMetrics(),
            suggestions: generateMockSuggestions(),
            highlights: generateMockHighlights()
        });
    } catch (error) {
        console.error('Error in analysis:', error);
        return NextResponse.json(
            { error: 'Failed to analyze transcript' },
            { status: 500 }
        );
    }
} 