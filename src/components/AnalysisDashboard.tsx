import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

type Metric = {
    name: string;
    value: number;
    description: string;
};

type Suggestion = {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
};

type AnalysisResult = {
    overallScore: number;
    metrics: Metric[];
    suggestions: Suggestion[];
};

type AnalysisDashboardProps = {
    analysisResult: AnalysisResult;
};

export function AnalysisDashboard({ analysisResult }: AnalysisDashboardProps) {
    const { overallScore, metrics, suggestions } = analysisResult;

    // Format metrics data for radar chart
    const chartData = metrics.map(metric => ({
        subject: metric.name,
        A: metric.value,
        fullMark: 100
    }));

    // Get color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Get priority badge color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Performance</CardTitle>
                        <CardDescription>
                            Your overall sales call performance score
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-[200px]">
                            <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                                {overallScore}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">out of 100</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                        <CardDescription>
                            Breakdown of your performance by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar
                                        name="Performance"
                                        dataKey="A"
                                        stroke="#2563eb"
                                        fill="#3b82f6"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
                    <TabsTrigger value="suggestions">Improvement Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Breakdown</CardTitle>
                            <CardDescription>
                                Detailed analysis of your performance in each category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {metrics.map((metric, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{metric.name}</span>
                                            <span className={`font-bold ${getScoreColor(metric.value)}`}>
                                                {metric.value}/100
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${metric.value}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500">{metric.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Improvement Suggestions</CardTitle>
                            <CardDescription>
                                Actionable tips to improve your sales calls
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {suggestions.map((suggestion, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium">{suggestion.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority || 'medium')}`}>
                                                {(suggestion.priority || 'medium').charAt(0).toUpperCase() + (suggestion.priority || 'medium').slice(1)} Priority
                                            </span>
                                        </div>
                                        <p className="text-sm">{suggestion.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 