'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Send, StopCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import axios from 'axios';

export default function ScanPage() {
  const { t } = useTranslation('scan');
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Request Camera on mount
    const initCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported in this browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(stream);
        setCameraError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error: any) {
        console.error('Error accessing camera:', error);
        setCameraError(error.name === "NotFoundError" ? "No camera device found." : "Please allow camera access.");
      }
    };
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartRecording = () => {
    if (!stream) return;
    
    // Clear previous recording just in case
    setVideoBlob(null);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm' 
    });
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setSecondsLeft(10);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (isRecording && secondsLeft === 0) {
      // Auto stop after 10 seconds
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isRecording, secondsLeft]);

  const setVideoUrl = useFeedbackStore((state) => state.setVideoUrl);

  const handleSendVideo = async () => {
    if (!videoBlob) return;
    
    // Convert Blob to URL and store in global state to let analyzing page process it
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    
    router.push('/scan/analyzing');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full flex flex-col items-center gap-6 relative">
        <div className="w-full flex justify-start">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-secondary">
            <ArrowLeft size={20} />
            <span className="font-medium">Home</span>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
          {cameraError ? (
            <div className="text-center text-red-400 p-6 flex flex-col items-center gap-2">
              <Camera size={48} className="opacity-50" />
              <p className="text-lg font-medium">{cameraError}</p>
              <p className="text-sm text-gray-400">Please check your camera connection or permissions.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          {isRecording && !cameraError && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-full animate-pulse font-medium">
              <div className="w-2 h-2 rounded-full bg-white" />
              {t('recording', { seconds: secondsLeft })}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!videoBlob && !isRecording && (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <Camera size={24} />
              {t('start_scan')}
            </button>
          )}

          {isRecording && (
            <button
              disabled
              className="flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground text-lg font-medium rounded-full cursor-not-allowed"
            >
              <StopCircle size={24} className="animate-spin" />
              {t('recording', { seconds: secondsLeft })}
            </button>
          )}

          {videoBlob && !isRecording && (
            <button
              onClick={handleSendVideo}
              className="flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-full hover:scale-105 transition-transform shadow-lg animate-in fade-in slide-in-from-bottom-4"
            >
              <Send size={24} />
              {t('send_video')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
