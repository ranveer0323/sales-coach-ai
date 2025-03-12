import { TranscriptionResponse, AnalysisResponse, Utterance } from '@/types';
import { AssemblyAI } from 'assemblyai';
import OpenAI from 'openai';

// Initialize API clients
// In a production app, these would be environment variables
const ASSEMBLY_AI_API_KEY = process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY || 'your_assembly_ai_api_key';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your_openai_api_key';

const assemblyClient = new AssemblyAI({
    apiKey: ASSEMBLY_AI_API_KEY
});

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for client-side use in development
});

// Function to transcribe an audio file using AssemblyAI
export async function transcribeAudio(audioFile: File): Promise<TranscriptionResponse> {
    try {
        // For development/testing, use mock data if API keys are not set
        if (ASSEMBLY_AI_API_KEY === 'your_assembly_ai_api_key') {
            console.warn('Using mock transcription data. Set ASSEMBLY_AI_API_KEY for real transcription.');
            return await fetch('/api/transcribe', {
                method: 'POST',
                body: new FormData()
            }).then(res => res.json());
        }

        // Create a URL for the audio file
        const audioUrl = URL.createObjectURL(audioFile);

        // Transcribe the audio using AssemblyAI
        const params = {
            audio: audioFile,
            speaker_labels: true
        };

        const transcript = await assemblyClient.transcripts.transcribe(params);

        if (!transcript.id) {
            throw new Error('Failed to get transcript ID');
        }

        // Convert AssemblyAI utterances to our app's format
        const utterances: Utterance[] = [];
        let startIndex = 0;

        if (transcript.utterances) {
            for (const utterance of transcript.utterances) {
                const speaker = `Speaker ${utterance.speaker}`;
                const text = utterance.text;
                const endIndex = startIndex + text.length;

                utterances.push({
                    speaker,
                    text,
                    startIndex,
                    endIndex
                });

                startIndex = endIndex + 2; // +2 for spacing between utterances
            }
        }

        return {
            id: transcript.id,
            text: transcript.text || '',
            utterances
        };
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
}

// Function to analyze a transcript using OpenAI
export async function analyzeTranscript(transcript: string): Promise<AnalysisResponse> {
    try {
        // For development/testing, use mock data if API keys are not set
        if (OPENAI_API_KEY === 'your_openai_api_key') {
            console.warn('Using mock analysis data. Set OPENAI_API_KEY for real analysis.');
            return await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transcript })
            }).then(res => res.json());
        }

        // Create a prompt for the OpenAI API
        const prompt = `
      You are an expert real estate sales coach. Analyze the following sales call transcript between a real estate agent and a potential client.
      
      Focus on these key areas:
      1. Information Gathering: How well did the agent collect customer details and understand their needs?
      2. Property Presentation: How effectively did the agent present property features and benefits?
      3. Amenities Coverage: How thoroughly did the agent discuss building amenities and facilities?
      4. Neighborhood Benefits: How well did the agent highlight location advantages and nearby services?
      5. Objection Handling: How effectively did the agent address customer concerns and objections?
      6. Closing Techniques: How well did the agent move the conversation toward a commitment?
      
      For each area, provide:
      - A score from 0-100
      - A brief description of performance
      
      Also provide:
      - An overall score from 0-100
      - 3-5 specific, actionable suggestions for improvement with priority levels (high, medium, low)
      - Highlight key moments in the transcript (positive points, negative points, questions, objections, closing attempts)
      
      Format your response as JSON with the following structure:
      {
        "overallScore": number,
        "metrics": [
          { "name": "Information Gathering", "value": number, "description": "string" },
          ...
        ],
        "suggestions": [
          { "title": "string", "description": "string", "priority": "high|medium|low" },
          ...
        ],
        "highlights": [
          { "startIndex": number, "endIndex": number, "type": "positive|negative|question|objection|closing", "comment": "string" },
          ...
        ]
      }
      
      Transcript:
      ${transcript}
    `;

        // Call the OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are an expert real estate sales coach.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        // Parse the response
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        const analysisData = JSON.parse(content);

        return {
            id: Date.now().toString(),
            ...analysisData
        };
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        throw error;
    }
} 