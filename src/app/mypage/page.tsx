"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ProfileHeader } from "@/components/mypage/ProfileHeader";
import { ActivityList, ActivityItem } from "@/components/mypage/ActivityList";
import { SettingsSection } from "@/components/mypage/SettingsSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MyPage() {
  const { t } = useTranslation("mypage");
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock Data
  const mockActivities: ActivityItem[] = [
    { id: "1", date: "2026-03-20 14:30", score: 98, status: "perfect" },
    { id: "2", date: "2026-03-18 09:15", score: 85, status: "good" },
    { id: "3", date: "2026-03-15 18:45", score: 65, status: "needs_improvement" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entry animation for mypage sections
      gsap.fromTo(
        ".mypage-section",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-background text-foreground transition-colors duration-500 py-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mypage-section flex items-center mb-8 gap-4">
          <Link 
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 border border-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {t("title")}
          </h1>
        </div>

        <ProfileHeader userName="Gym Bro" level={5} totalScans={24} />
        <ActivityList activities={mockActivities} />
        <SettingsSection />
      </div>
    </main>
  );
}
