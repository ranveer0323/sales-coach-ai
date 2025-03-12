# Sales Call Analysis AI for Real Estate Agents

A Next.js application that analyzes real estate sales call recordings to provide actionable feedback and insights.

## Features

- Audio file upload with preview and progress indicator
- Automatic transcription with speaker diarization using AssemblyAI
- AI-powered analysis of sales techniques using OpenAI GPT-4o mini
- Interactive dashboard with performance metrics and suggestions
- Highlighted transcript with key moments identified

## Getting Started

### Prerequisites

- Node.js 18.x or later
- An AssemblyAI API key (for transcription)
- An OpenAI API key (for analysis)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sales-analysis.git
cd sales-analysis
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:

```
NEXT_PUBLIC_ASSEMBLY_AI_API_KEY=your_assembly_ai_api_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Upload**: Users upload an audio recording of a real estate sales call
2. **Transcription**: AssemblyAI transcribes the audio with speaker identification
3. **Analysis**: OpenAI GPT-4o mini analyzes the transcript for sales techniques
4. **Visualization**: The application displays the analysis results in an interactive dashboard

## API Integration

### AssemblyAI

This application uses AssemblyAI for audio transcription with speaker diarization. To get an API key:

1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

### OpenAI

This application uses OpenAI GPT-4o mini for transcript analysis. To get an API key:

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create an API key in your account settings
3. Add it to your `.env.local` file

## Demo Mode

If you don't have API keys or want to test the application without uploading a real recording, you can use the "View Demo Analysis" button to see a sample analysis with mock data.

## Technologies Used

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- AssemblyAI API
- OpenAI API
- Recharts for data visualization

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
