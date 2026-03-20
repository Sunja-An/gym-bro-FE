'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import { useToastStore } from '@/store/useToastStore';
import { Save, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';

export default function FeedbackPage() {
  const { t } = useTranslation('scan');
  const router = useRouter();
  const { feedbackData, clearFeedbackData } = useFeedbackStore();
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If there is no data, redirect to home or scan page to prevent empty states
    if (!feedbackData) {
      router.push('/scan');
      return;
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, [feedbackData, router]);

  if (!feedbackData) return null;

  const handleSave = () => {
    // Implement save logic (e.g. POST to backend)
    const { addToast } = useToastStore.getState();
    addToast({ message: "저장하였습니다!", type: "success" });
    router.push('/mypage'); 
  };

  const handleDiscard = () => {
    clearFeedbackData();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-x-hidden">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <div ref={contentRef} className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            {t('feedback_title')}
          </h1>
          <p className="text-2xl font-bold text-primary">
            {t('feedback_score', { score: feedbackData.score })}
          </p>
        </div>

        <div className="bg-card border shadow-sm rounded-3xl p-8 backdrop-blur-xl bg-opacity-50">
          <h2 className="text-xl font-semibold mb-4 border-b pb-4 flex items-center gap-2">
            {t('feedback_overall')}
          </h2>
          <p className="text-lg leading-relaxed text-card-foreground">
            {feedbackData.overall_feedback}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold px-4">{t('feedback_details')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbackData.posture_details.map((detail, idx) => (
              <div 
                key={idx} 
                className="bg-secondary/30 border border-secondary p-6 rounded-2xl flex flex-col gap-3 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {detail.part}
                </h3>
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium text-red-400">🚨 {detail.issue}</p>
                  <p className="text-sm text-muted-foreground flex items-start gap-1">
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{detail.correction}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t">
          <button
            onClick={handleDiscard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground text-lg font-medium rounded-full transition-colors"
          >
            <Trash2 size={22} />
            {t('action_discard')}
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground hover:scale-[1.02] text-lg font-medium rounded-full transition-transform shadow-lg shadow-primary/25"
          >
            <Save size={22} />
            {t('action_save')}
          </button>
        </div>
      </div>
    </div>
  );
}
