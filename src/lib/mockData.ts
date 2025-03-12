import { Recording, Transcript, Analysis, Highlight, Metric, Suggestion, Utterance } from '@/types';
import { REAL_ESTATE_METRICS } from '@/types';

// Generate a random ID
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
};

// Generate a random date within the last 30 days
export const generateRecentDate = (): string => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
};

// Generate a random score between min and max
export const generateScore = (min: number = 40, max: number = 95): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Sample transcript text for real estate sales calls
export const SAMPLE_TRANSCRIPT = `Agent: Good morning! Thanks for calling Luxury Homes Realty. This is Alex speaking. How can I help you today?

Customer: Hi Alex, I'm interested in the two-bedroom apartment you have listed on Oak Street. I'd like to know more about it.

Agent: Absolutely! I'd be happy to tell you all about our Oak Street property. It's one of our most popular listings right now. Before we dive in, may I have your name please?

Customer: Sure, it's Jamie Smith.

Agent: Thank you, Jamie. And are you looking for a place for yourself or will others be living there as well?

Customer: It's for me and my partner. We're looking to move in the next couple of months.

Agent: Perfect, thank you for sharing that. The Oak Street apartment is actually perfect for couples. It features two spacious bedrooms with the master having an en-suite bathroom. The living area is open concept with large windows that let in plenty of natural light.

Customer: That sounds nice. What about the kitchen? We both love to cook.

Agent: You're going to love the kitchen! It was completely renovated last year with quartz countertops, stainless steel appliances, and a gas range. There's also a breakfast bar that's perfect for casual dining or entertaining guests.

Customer: Great. And what about the neighborhood? Is it safe? Are there grocery stores nearby?

Agent: That's a great question. Oak Street is located in one of our safest neighborhoods with very low crime rates. There's a Whole Foods just two blocks away, and a farmer's market every Saturday morning within walking distance. You're also just a 5-minute walk from Central Park, which has great jogging trails.

Customer: What about parking? We have one car.

Agent: The building includes one designated parking spot for each unit, and there's also ample street parking for visitors. Additionally, there's a bus stop right outside and the subway station is just a 10-minute walk away if you prefer public transportation.

Customer: And how much is the rent again?

Agent: The apartment is $2,200 per month with a 12-month lease. This includes water and trash service. Tenants are responsible for electricity and internet. There's also a security deposit equal to one month's rent.

Customer: That's a bit higher than we were hoping to spend. Do you have any flexibility on the price?

Agent: I understand your concern about the budget. While the listed price is competitive for the neighborhood, the owner might consider $2,150 for qualified applicants with excellent credit. Also, if you sign an 18-month lease instead of 12 months, we could potentially offer a small discount. Would either of those options work better for your budget?

Customer: The 18-month lease might work. Can we see the apartment before making a decision?

Agent: Absolutely! I'd be happy to arrange a viewing for you. We have availability tomorrow afternoon at 3 PM or Saturday morning at 10 AM. Which would work better for you and your partner?

Customer: Saturday at 10 would be perfect.

Agent: Excellent! I'll schedule you for Saturday at 10 AM. Could I get your email address to send you a confirmation and some additional information about the property?

Customer: Sure, it's jamie.smith@email.com.

Agent: Thank you, Jamie. I've got you scheduled for Saturday at 10 AM. You'll receive an email confirmation shortly with all the details including the address and my contact information. Is there anything else you'd like to know about the property before our meeting?

Customer: No, I think that covers it for now. Thanks for your help.

Agent: You're very welcome! I'm looking forward to meeting you and your partner on Saturday and showing you this beautiful apartment. I think you'll really love it. If you have any questions before then, please don't hesitate to call me. Have a great day!

Customer: You too. Goodbye.

Agent: Goodbye, Jamie.`;

// Generate mock utterances for the transcript
export const generateMockUtterances = (): Utterance[] => {
    const lines = SAMPLE_TRANSCRIPT.split('\n\n');
    let startIndex = 0;
    const utterances: Utterance[] = [];

    for (const line of lines) {
        if (line.trim() === '') continue;

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const speaker = line.substring(0, colonIndex).trim();
        const text = line.substring(colonIndex + 1).trim();
        const endIndex = startIndex + line.length;

        utterances.push({
            speaker,
            text,
            startIndex,
            endIndex
        });

        startIndex = endIndex + 2; // +2 for the newline characters
    }

    return utterances;
};

// Generate mock highlights for the transcript
export const generateMockHighlights = (): Highlight[] => {
    return [
        {
            startIndex: 190,
            endIndex: 290,
            type: 'positive',
            comment: 'Good job gathering basic customer information to understand their needs.'
        },
        {
            startIndex: 590,
            endIndex: 750,
            type: 'positive',
            comment: 'Excellent property description highlighting key features that match customer needs.'
        },
        {
            startIndex: 1050,
            endIndex: 1250,
            type: 'positive',
            comment: 'Great neighborhood description covering safety and amenities.'
        },
        {
            startIndex: 1650,
            endIndex: 1800,
            type: 'objection',
            comment: 'Customer raised a price objection that could have been addressed more effectively.'
        },
        {
            startIndex: 1800,
            endIndex: 1950,
            type: 'closing',
            comment: 'Good attempt at addressing the price objection with alternative options.'
        },
        {
            startIndex: 2200,
            endIndex: 2400,
            type: 'closing',
            comment: 'Excellent job scheduling a viewing and collecting contact information.'
        }
    ];
};

// Generate mock metrics for real estate sales analysis
export const generateMockMetrics = (): Metric[] => {
    return REAL_ESTATE_METRICS.map(name => {
        const value = generateScore();
        let description = '';

        switch (name) {
            case 'Information Gathering':
                description = 'How well you collected customer details and understood their needs.';
                break;
            case 'Property Presentation':
                description = 'How effectively you presented the property features and benefits.';
                break;
            case 'Amenities Coverage':
                description = 'How thoroughly you discussed building amenities and facilities.';
                break;
            case 'Neighborhood Benefits':
                description = 'How well you highlighted location advantages and nearby services.';
                break;
            case 'Objection Handling':
                description = 'How effectively you addressed customer concerns and objections.';
                break;
            case 'Closing Techniques':
                description = 'How well you moved the conversation toward a commitment.';
                break;
            default:
                description = 'Performance in this area.';
        }

        return { name, value, description };
    });
};

// Generate mock suggestions for improvement
export const generateMockSuggestions = (): Suggestion[] => {
    return [
        {
            title: 'Improve objection handling techniques',
            description: 'When customers raise concerns about price, try to emphasize value rather than immediately offering discounts. Highlight the unique features that justify the price point.',
            priority: 'high'
        },
        {
            title: 'Enhance property presentation',
            description: 'Use more sensory language when describing the property. Help customers visualize themselves living in the space by painting a picture with your words.',
            priority: 'medium'
        },
        {
            title: 'Strengthen closing techniques',
            description: 'After scheduling a viewing, try to create more excitement about the next steps. Consider mentioning the application process to prepare them for a potential decision after the viewing.',
            priority: 'medium'
        },
        {
            title: 'Expand neighborhood benefits discussion',
            description: 'Include more details about lifestyle elements like restaurants, entertainment options, and community events to help customers connect emotionally with the neighborhood.',
            priority: 'low'
        }
    ];
};

// Generate a mock recording
export const generateMockRecording = (): Recording => {
    const id = generateId();
    return {
        id,
        fileName: `call-recording-${id.substring(0, 5)}.mp3`,
        fileUrl: '/mock-audio.mp3',
        duration: 180 + Math.floor(Math.random() * 240), // 3-7 minutes
        createdAt: generateRecentDate()
    };
};

// Generate a mock transcript
export const generateMockTranscript = (recordingId: string): Transcript => {
    return {
        id: generateId(),
        recordingId,
        text: SAMPLE_TRANSCRIPT,
        utterances: generateMockUtterances(),
        highlights: generateMockHighlights(),
        createdAt: generateRecentDate()
    };
};

// Generate a mock analysis
export const generateMockAnalysis = (recordingId: string, transcriptId: string): Analysis => {
    return {
        id: generateId(),
        recordingId,
        transcriptId,
        overallScore: generateScore(60, 85),
        metrics: generateMockMetrics(),
        suggestions: generateMockSuggestions(),
        createdAt: generateRecentDate()
    };
};

// Generate a complete mock data set
export const generateMockData = () => {
    const recording = generateMockRecording();
    const transcript = generateMockTranscript(recording.id);
    const analysis = generateMockAnalysis(recording.id, transcript.id);

    // Update recording with references
    const updatedRecording = {
        ...recording,
        transcriptId: transcript.id,
        analysisId: analysis.id
    };

    return {
        recording: updatedRecording,
        transcript,
        analysis
    };
}; 