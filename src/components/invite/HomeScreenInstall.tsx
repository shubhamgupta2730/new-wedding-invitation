"use client";

import { useEffect, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function HomeScreenInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => setIsInstalled(true);
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setIsInstalled(true);
    } catch {
      setShowInstructions(true);
    } finally {
      setInstallPrompt(null);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button type="button" onClick={install} className="interactive-button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-gold/40 bg-ivory px-4 text-xs font-medium text-olive shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
        <Download size={15} aria-hidden="true" />
        Add to home screen
      </button>

      {showInstructions ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-olive/45 p-3 backdrop-blur-sm sm:items-center">
          <section role="dialog" aria-modal="true" aria-labelledby="install-title" className="relative w-full max-w-sm rounded-[1.6rem] border border-gold/30 bg-ivory p-6 shadow-[0_24px_70px_rgba(35,27,25,.28)] sm:p-7">
            <button type="button" onClick={() => setShowInstructions(false)} aria-label="Close instructions" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-olive/65 transition-colors hover:bg-champagne/40 hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
              <X size={18} aria-hidden="true" />
            </button>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white/70 text-sage" aria-hidden="true">
              {isIos ? <Share size={18} /> : <Smartphone size={18} />}
            </span>
            <h2 id="install-title" className="mt-4 font-serif text-2xl text-olive">Keep the invitation close</h2>
            {isIos ? (
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-olive/75">
                <li><span className="mr-2 font-semibold text-sage">1.</span>Open this link in Safari.</li>
                <li><span className="mr-2 font-semibold text-sage">2.</span>Tap the Share button <Share className="mx-1 inline-block align-[-3px] text-sage" size={15} aria-label="Share" /> at the bottom of the screen.</li>
                <li><span className="mr-2 font-semibold text-sage">3.</span>Choose <strong className="font-semibold text-olive">Add to Home Screen</strong>, then tap Add.</li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-olive/75">
                <li><span className="mr-2 font-semibold text-sage">1.</span>Open this invitation in Chrome.</li>
                <li><span className="mr-2 font-semibold text-sage">2.</span>Tap the browser menu <strong className="font-semibold text-olive">⋮</strong>.</li>
                <li><span className="mr-2 font-semibold text-sage">3.</span>Choose <strong className="font-semibold text-olive">Install app</strong> or <strong className="font-semibold text-olive">Add to Home screen</strong>.</li>
              </ol>
            )}
            <p className="mt-5 border-t border-gold/20 pt-4 text-xs leading-relaxed text-olive/55">The invitation will open from your home screen like an app.</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
