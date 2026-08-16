import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, X } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { playClick } from "../utils/sound";

// Demo Google accounts for the account chooser.
// NOTE: This is a simulated picker so the app works without OAuth credentials.
// To wire real Google Sign-In, swap onSelect for the Google Identity Services
// callback (needs a Google Cloud OAuth client ID) — the flow stays the same.
export const GOOGLE_ACCOUNTS = [
  { id: "g1", name: "Aziz Karimov", email: "aziz.karimov@gmail.com", color: "bg-blue-500", initials: "AK", avatar: "🦁" },
  { id: "g2", name: "Dilnoza Rahimova", email: "dilnoza.r@gmail.com", color: "bg-emerald-500", initials: "DR", avatar: "🦊" },
  { id: "g3", name: "Sardor Aliyev", email: "sardor.aliyev@gmail.com", color: "bg-rose-500", initials: "SA", avatar: "🚀" },
];

export function GoogleGLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

export default function GoogleAccountPicker({
  isOpen,
  onClose,
  onSelect,
  onUseAnother,
  loading = false,
}) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!loading) onClose();
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Google-style light card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden z-10"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-4">
            <GoogleGLogo className="w-8 h-8" />
            <button
              type="button"
              onClick={() => {
                playClick();
                if (!loading) onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="px-6 pt-3 pb-1">
            <h2 className="text-2xl font-semibold tracking-tight">{t("googlePickerTitle")}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {t("googlePickerSubtitle")} <span className="font-semibold text-slate-700">LingoQuest</span>
            </p>
          </div>

          {/* Account list */}
          <div className="px-2.5 py-3 space-y-1">
            {GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  playClick();
                  onSelect(acc);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 text-left transition-colors cursor-pointer disabled:opacity-50 group"
              >
                <span
                  className={`w-9 h-9 rounded-full ${acc.color} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
                >
                  {acc.initials}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-slate-800 truncate">
                    {acc.name}
                  </span>
                  <span className="block text-xs text-slate-500 truncate">{acc.email}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
              </button>
            ))}

            {/* Use another account */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                playClick();
                if (onUseAnother) onUseAnother();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 text-left transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm text-slate-600 font-bold shrink-0">
                +
              </span>
              <span className="text-sm font-medium text-blue-600">{t("useAnotherAccount")}</span>
            </button>
          </div>

          {/* Privacy hint */}
          <div className="px-6 pb-5 pt-1">
            <p className="text-[11px] leading-relaxed text-slate-400">
              Для просмотра приложения никакие данные не покидают ваше устройство.
              <br />
              Демо-аккаунты · LingoQuest Hackathon
            </p>
          </div>

          {/* Signing in overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">{t("signingIn")}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
