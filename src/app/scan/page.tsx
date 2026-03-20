'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Send, StopCircle } from 'lucide-react';
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

  useEffect(() => {
    // Request Camera on mount
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        // Fallback or permission denied state can be handled here
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

  const handleSendVideo = async () => {
    if (!videoBlob) return;
    
    // We navigate to analyzing right away and do the processing in the background
    // Or we navigate to analyzing and let it handle the upload or wait.
    // Given the requirements, "/scan/analyzing" is the page while waiting for the API.
    
    router.push('/scan/analyzing');
    
    try {
      // Here you would do:
      // const formData = new FormData();
      // formData.append('video', videoBlob, 'scan.webm');
      // await axios.post('/api/v1/scan', formData);
      
      // Since there is no real backend, we simulate the request directly in analyzing page.
      // But passing the Blob via state can be tricky. 
      // For this hackathon scope, the actual form data upload happens here, 
      // but to decouple safely and keep the analyzing spinner going, 
      // we'll simulate the mock API call in the Analyzing page layout or next block.
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isRecording && (
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
