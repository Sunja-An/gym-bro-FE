import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SettingsSection() {
  const { t, i18n } = useTranslation("mypage");

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="mypage-section mt-8">
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {t("settings.title")}
        </h3>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/50">
        
        {/* Theme Setting */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-500 dark:text-gray-400 font-medium">✨</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {t("settings.theme")}
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Language Setting */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {t("settings.language")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange("ko")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                i18n.language === "ko"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                i18n.language === "en" || !i18n.language
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              EN
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
