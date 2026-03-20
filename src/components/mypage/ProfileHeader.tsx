import { useTranslation } from "react-i18next";
import { User, Award, Activity } from "lucide-react";

interface ProfileHeaderProps {
  userName: string;
  level: number;
  totalScans: number;
}

export function ProfileHeader({ userName, level, totalScans }: ProfileHeaderProps) {
  const { t } = useTranslation("mypage");

  return (
    <div className="mypage-section relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-1 shadow-inner">
          <div className="absolute inset-0 rounded-full bg-black/10 mix-blend-overlay"></div>
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-950/80 backdrop-blur-sm">
            <User className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {userName}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-100/50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Award className="h-4 w-4" />
              <span>{t("profile.level")} {level}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Activity className="h-4 w-4" />
              <span>{t("profile.total_scans")} : {totalScans}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
