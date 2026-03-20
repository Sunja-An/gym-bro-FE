import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export interface ActivityItem {
  id: string;
  date: string;
  score: number;
  status: "perfect" | "good" | "needs_improvement";
}

interface ActivityListProps {
  activities: ActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const { t } = useTranslation("mypage");

  if (activities.length === 0) {
    return (
      <div className="mypage-section mt-8 text-center text-gray-500 py-12 rounded-2xl bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border border-dashed border-gray-300 dark:border-gray-700">
        <p>{t("activity.no_activity")}</p>
      </div>
    );
  }

  const getStatusConfig = (status: ActivityItem["status"]) => {
    switch (status) {
      case "perfect":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          label: t("activity.perfect_posture"),
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-800/50",
          text: "text-emerald-700 dark:text-emerald-400"
        };
      case "good":
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          label: t("activity.good_posture"),
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800/50",
          text: "text-blue-700 dark:text-blue-400"
        };
      case "needs_improvement":
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          label: t("activity.needs_improvement"),
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800/50",
          text: "text-amber-700 dark:text-amber-400"
        };
    }
  };

  return (
    <div className="mypage-section mt-8">
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {t("activity.title")}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {activities.map((item) => {
          const config = getStatusConfig(item.status);
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md backdrop-blur-sm ${config.bg} ${config.border}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-950/50 shadow-sm">
                  {config.icon}
                </div>
                <div>
                  <p className={`font-medium ${config.text}`}>{config.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t("activity.score")}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{item.score}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
