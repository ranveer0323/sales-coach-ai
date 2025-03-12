import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

type AudioUploaderProps = {
    onUploadComplete: (file: File, audioUrl: string) => void;
};

export function AudioUploader({ onUploadComplete }: AudioUploaderProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Check if file is an audio file
        if (!file.type.startsWith('audio/')) {
            setError('Please upload an audio file');
            toast.error('Invalid file type. Please upload an audio file.');
            return;
        }

        setSelectedFile(file);
        setError(null);

        // Create a preview URL for the audio file
        const previewUrl = URL.createObjectURL(file);
        setAudioPreview(previewUrl);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 100);

            // In a real application, you would upload the file to your API here
            // For now, we'll just simulate a successful upload after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            clearInterval(interval);
            setUploadProgress(100);

            // Call the onUploadComplete callback with the file and preview URL
            onUploadComplete(selectedFile, audioPreview as string);

            toast.success('Audio file uploaded successfully!');
        } catch (err) {
            setError('Failed to upload audio file');
            toast.error('Failed to upload audio file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                            <p className="text-lg font-medium">
                                {isDragActive
                                    ? 'Drop the audio file here'
                                    : 'Drag & drop an audio file here, or click to select'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Supports MP3, WAV, M4A, AAC, and OGG files
                            </p>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {audioPreview && (
                        <div className="mt-4 space-y-2">
                            <p className="font-medium">Selected file: {selectedFile?.name}</p>
                            <audio
                                controls
                                src={audioPreview}
                                className="w-full"
                            />
                        </div>
                    )}

                    {isUploading && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Analyze Call'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 