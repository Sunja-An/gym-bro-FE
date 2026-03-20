'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import gsap from 'gsap';

export default function AnalyzingPage() {
  const { t } = useTranslation('scan');
  const router = useRouter();
  const setFeedbackData = useFeedbackStore((state) => state.setFeedbackData);
  
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    
    // Simulate Backend API Call (e.g., waiting for 3-5 seconds)
    // Replace this setTimeout with an actual axios.post() call when the backend is ready.
    const analyzeVideo = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3500));
        
        // Mock Response Data
        // Backend returns feedback text, score, and detailed parts that need correction.
        setFeedbackData({
          score: 82,
          overall_feedback: "전반적인 자세는 안정적이나, 허리 각도에 주의가 필요합니다.",
          posture_details: [
            {
              part: "허리 (Lower Back)",
              issue: "스쿼트 시 허리가 과도하게 굽어 있습니다.",
              correction: "코어에 힘을 주고 가슴을 열어 허리를 곧게 펴주세요."
            },
            {
              part: "무릎 (Knees)",
              issue: "무릎이 발끝 선을 너무 많이 벗어납니다.",
              correction: "엉덩이를 뒤로 빼면서 체중을 발 뒤꿈치 쪽에 실어주세요."
            }
          ]
        });
        
        // Navigate to Feedback Page upon success
        router.push('/feedback');
      } catch (error) {
        console.error('Failed to analyze video', error);
      }
    };

    analyzeVideo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 pointer-events-none" 
      />
      
      <div className="flex flex-col items-center justify-center gap-8 relative z-10 max-w-lg text-center">
        {/* Custom GSAP Spinner */}
        <div 
          ref={spinnerRef} 
          className="relative w-32 h-32 flex items-center justify-center"
        >
          <div className="absolute w-full h-full border-4 border-primary/20 rounded-full" />
          <div className="absolute w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
        </div>

        <div ref={textRef} className="space-y-3">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t('analyzing_title')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('analyzing_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
