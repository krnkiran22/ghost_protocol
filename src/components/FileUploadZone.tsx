'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisData {
  title: string;
  publicationYear: number | null;
  genre: string;
  description: string;
  detectedInfluences: Array<{
    name: string;
    creator: string;
    year: number | null;
    confidence: number;
  }>;
  ipfsHash?: string;
  fileName?: string;
}

interface FileUploadZoneProps {
  onUploadComplete: (data: AnalysisData & { ipfsUrl: string }) => void;
}

type UploadState = 'empty' | 'uploading' | 'analyzing' | 'success' | 'error';

export default function FileUploadZone({ onUploadComplete }: FileUploadZoneProps) {
  const [uploadState, setUploadState] = useState<UploadState>('empty');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadState('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      // Step 1: Upload to IPFS
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('http://localhost:3001/api/upload-to-ipfs', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      setProgress(50); // 50% after upload

      // Step 2: Analyze content
      setUploadState('analyzing');

      const analyzeFormData = new FormData();
      analyzeFormData.append('file', file);
      analyzeFormData.append('ipfsHash', uploadResult.data.ipfsHash);

      const analyzeResponse = await fetch('http://localhost:3001/api/analyze-content', {
        method: 'POST',
        body: analyzeFormData,
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analyzeResult = await analyzeResponse.json();
      setProgress(100); // 100% after analysis

      // Success!
      setUploadState('success');
      setAnalysisData(analyzeResult.data);

      // Pass complete data to parent
      onUploadComplete({
        ...analyzeResult.data,
        ipfsUrl: uploadResult.data.ipfsUrl,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadState('error');
      setErrorMessage(error.message || 'Something went wrong');
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
      'application/epub+zip': ['.epub'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'video/mp4': ['.mp4'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 1,
    multiple: false,
  });

  const resetUpload = () => {
    setUploadState('empty');
    setProgress(0);
    setErrorMessage('');
    setUploadedFile(null);
    setAnalysisData(null);
  };

  // EMPTY STATE
  if (uploadState === 'empty') {
    return (
      <div
        {...getRootProps()}
        className={cn(
          "h-96 border-2 border-dashed rounded-2xl",
          "flex flex-col items-center justify-center",
          "cursor-pointer transition-all duration-300",
          isDragActive
            ? "border-accent-gold bg-cream/20 scale-105"
            : "border-stone-300 bg-stone-50 hover:bg-cream/10 hover:border-accent-gold"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 text-stone-400 mb-4" />
        <p className="text-lg text-stone-600 font-medium">
          {isDragActive ? 'Drop file here' : 'Drag files here or click to browse'}
        </p>
        <p className="text-sm text-stone-500 mt-2">
          Supported: PDF, DOCX, TXT, EPUB, JPG, PNG, MP3, MP4
        </p>
        <p className="text-xs text-stone-400 mt-1">Max file size: 100MB</p>
      </div>
    );
  }

  // UPLOADING STATE
  if (uploadState === 'uploading') {
    return (
      <div className="h-96 border-2 border-stone-300 rounded-2xl bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent-gold animate-spin mb-4" />
        <p className="text-lg font-medium text-stone-900">Uploading to IPFS...</p>
        <div className="w-64 h-2 bg-stone-200 rounded-full mt-4">
          <div
            className="h-full bg-accent-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-stone-600 mt-2">{progress}% complete</p>
      </div>
    );
  }

  // ANALYZING STATE
  if (uploadState === 'analyzing') {
    return (
      <div className="h-96 border-2 border-stone-300 rounded-2xl bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent-gold animate-spin mb-4" />
        <p className="text-lg font-medium text-stone-900">Analyzing content with AI...</p>
        <p className="text-sm text-stone-600 mt-2">This may take a moment</p>
        <div className="w-64 h-1 bg-stone-200 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-accent-gold animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  if (uploadState === 'success' && analysisData) {
    return (
      <div className="border-2 border-green-700 rounded-2xl bg-white p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-12 h-12 text-green-700" />
          <div>
            <h3 className="text-xl font-semibold text-stone-900">Upload Successful!</h3>
            <p className="text-sm text-stone-600">Content analyzed and ready</p>
          </div>
        </div>

        <div className="bg-stone-50 rounded-xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <FileText className="w-8 h-8 text-accent-gold mt-1" />
            <div className="flex-1">
              <p className="font-medium text-stone-900">{uploadedFile?.name}</p>
              <p className="text-sm text-stone-600 mt-1">
                Size: {((uploadedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <p className="text-sm font-medium text-stone-700">Detected Title:</p>
            <p className="text-base text-stone-900">{analysisData.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-700">Genre:</p>
            <p className="text-base text-stone-900">{analysisData.genre}</p>
          </div>
          {analysisData.detectedInfluences.length > 0 && (
            <div>
              <p className="text-sm font-medium text-stone-700">Detected Influences:</p>
              <ul className="text-sm text-stone-600 mt-1">
                {analysisData.detectedInfluences.slice(0, 3).map((influence, idx) => (
                  <li key={idx}>
                    • {influence.name} ({influence.confidence}% confidence)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={resetUpload}
          className="text-accent-gold hover:underline text-sm font-medium"
        >
          Upload a different file
        </button>
      </div>
    );
  }

  // ERROR STATE
  if (uploadState === 'error') {
    return (
      <div className="h-96 border-2 border-red-700 rounded-2xl bg-white flex flex-col items-center justify-center p-8">
        <XCircle className="w-12 h-12 text-red-700 mb-4" />
        <p className="text-lg font-medium text-stone-900">Upload Failed</p>
        <p className="text-sm text-red-700 mt-2 text-center max-w-md">{errorMessage}</p>
        <button
          onClick={resetUpload}
          className="mt-6 px-6 py-3 bg-accent-gold text-stone-900 rounded-lg font-semibold hover:bg-accent-gold/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}