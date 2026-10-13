import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RotateCcw, X } from "lucide-react";
import logoSrcAsset from "@/assets/ri-brand-mark.webp.asset.json";
const logoSrc = logoSrcAsset.url;
const logo = { url: logoSrc };
import { Button } from "./ui/button";
import { LanguageSelect } from "./language-select";
const ChatConversation = lazy(() => import("./ripl-conversation"));
export function RiplChat() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [generation, setGeneration] = useState(0);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) close.current?.focus();
  }, [open]);
  if (!open)
    return (
      <Button
        onClick={() => setOpen(true)}
        aria-label="Chat with RIPL Assistant"
        className="chat-launch"
      >
        <img src={logo.url} alt="" width={26} height={26} />
        Ask RIPL
      </Button>
    );
  return (
    <section
      className="chat-panel"
      role="dialog"
      aria-label="RIPL Assistant"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <header className="chat-header">
        <img src={logo.url} alt="RIPL" width={36} height={36} />
        <div className="min-w-0 flex-1">
          <h2>RIPL Assistant</h2>
          <p>Rishishwar Industry</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="New conversation"
          title="New conversation"
          onClick={() => {
            setLanguage("");
            setGeneration((g) => g + 1);
          }}
        >
          <RotateCcw />
        </Button>
        <Button
          ref={close}
          variant="ghost"
          size="icon"
          title="Close chat"
          aria-label="Close chat"
          onClick={() => setOpen(false)}
        >
          <X />
        </Button>
      </header>
      {!language ? (
        <div className="chat-language-start">
          <img src={logo.url} alt="" width={64} height={64} />
          <h3>Welcome / स्वागत है</h3>
          <p>
            Choose your language
            <br />
            अपनी भाषा चुनें
          </p>
          <LanguageSelect value={language} onChange={setLanguage} />
        </div>
      ) : (
        <Suspense fallback={<p className="p-5 text-muted-foreground">Connecting…</p>}>
          <ChatConversation key={generation} language={language} onLanguageChange={setLanguage} />
        </Suspense>
      )}
    </section>
  );
}
