'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import { useToastStore } from '@/store/useToastStore';
import { Dumbbell } from 'lucide-react';
import gsap from 'gsap';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import axios from 'axios';

export default function AnalyzingPage() {
  const { t } = useTranslation('scan');
  const router = useRouter();
  
  const videoUrl = useFeedbackStore((state) => state.videoUrl);
  const setFeedbackData = useFeedbackStore((state) => state.setFeedbackData);
  const addToast = useToastStore((state) => state.addToast);
  
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [statusText, setStatusText] = useState(t('analyzing_title') || "Analyzing...");
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Redirect back to scan if no videoUrl is found (e.g., user refreshed the page)
    if (!videoUrl) {
      router.push('/scan');
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // GSAP Spinner Animation
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 1.5,
        ease: 'linear',
      });
    }

    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 1, yoyo: true, repeat: -1, ease: 'power1.inOut' }
      );
    }

    const processVideo = async () => {
      try {
        setStatusText("Loading AI Model...");
        
        // 1. Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });

        setStatusText("Extracting Posture Data...");

        const video = videoRef.current;
        if (!video) return;

        // 2. Extract frames from video silently
        video.src = videoUrl;
        await video.play();

        const sampledFrames: any[] = [];
        const intervalId = setInterval(() => {
          if (video.currentTime >= video.duration || video.ended || video.paused) {
            clearInterval(intervalId);
          } else {
            const timeMs = performance.now();
            const result = poseLandmarker.detectForVideo(video, timeMs);
            if (result.landmarks && result.landmarks.length > 0) {
              sampledFrames.push(result.landmarks[0]);
            }
          }
        }, 1000); // 1 frame per second

        // Wait until video finishes
        await new Promise((resolve) => {
          video.onended = resolve;
        });
        clearInterval(intervalId);

        // 3. Send Coordinates to Server (Gemini API)
        setStatusText("Generating AI Feedback...");
        
        if (sampledFrames.length === 0) {
           throw new Error("No posture data could be extracted from the video.");
        }

        const response = await axios.post('/api/analyze', {
          frames: sampledFrames,
          exerciseType: "General Fitness"
        });

        if (response.data && response.data.score !== undefined) {
          setFeedbackData(response.data);
          addToast({ message: "분석이 완료되었습니다!", type: "success" });
          router.push('/feedback');
        } else {
          throw new Error("Invalid response format from AI.");
        }

      } catch (error: any) {
        console.error('Failed to analyze video', error);
        addToast({ 
          message: error.message || "분석 중 오류가 발생했습니다. 다시 시도해 주세요.", 
          type: "error" 
        });
        router.push('/scan');
      }
    };

    processVideo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 pointer-events-none" 
      />
      
      <div className="flex flex-col items-center justify-center gap-8 relative z-10 max-w-lg text-center">
        {/* Hidden video element for processing */}
        <video 
          ref={videoRef} 
          crossOrigin="anonymous" 
          playsInline 
          muted 
          className="hidden" 
        />

        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Static Logo in the Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-primary">
            <Dumbbell className="w-10 h-10 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest mt-1 opacity-80">GYMBRO</span>
          </div>

          {/* GSAP Spinner Ring */}
          <div 
            ref={spinnerRef} 
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute w-full h-full border-4 border-primary/20 rounded-full" />
            <div className="absolute w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
          </div>
        </div>

        <div ref={textRef} className="space-y-3">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {statusText}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('analyzing_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
