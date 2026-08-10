"use client";

import { useEffect, useRef, useState } from "react";
import { useChatWidget } from "./ChatWidgetContext";

type ChatMessage = { role: "ai" | "user"; content: string };

const SESSION_STORAGE_KEY = "dmc_chat_session";

// AI counsellor widget shell — DOC/AI_PERSONALIZATION_ARCHITECTURE.md,
// DOC/STATE_MANAGEMENT.md § 2 (message history in sessionStorage, not a
// global store). The mockup's client-side keyword-matching reply logic is an
// explicit placeholder per DOC/REQUIREMENTS_ANALYSIS.md § 7 — NOT ported.
// Replies come from the real (if currently rules-based) `/api/chat` seam per
// DOC/AI_PERSONALIZATION_ARCHITECTURE.md and PROJECT_STATUS.md's recommended
// build sequence item 6.
export function ChatWidget({ welcomeMessage }: { welcomeMessage: string }) {
  const { isOpen, seedMessage, openChat, closeChat } = useChatWidget();
  // Lazy initializer (not an effect): reads/creates the session id once per
  // mount. Guarded for SSR — Client Components still render once on the
  // server, where `sessionStorage` doesn't exist — and since `sessionId`
  // never appears in rendered JSX, resolving to `null` server-side then the
  // real id client-side causes no hydration mismatch.
  const [sessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentSeedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (isOpen && seedMessage && sentSeedRef.current !== seedMessage) {
      sentSeedRef.current = seedMessage;
      void send(seedMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, seedMessage]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed, pageSlug: "/" }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.reply ?? "Sorry, I didn't catch that — could you rephrase?",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I'm having trouble connecting right now — please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => openChat()}
        aria-label="Open AI counsellor chat"
        className="bg-saffron fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-xl md:bottom-6"
      >
        💬
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label="AI counsellor chat"
          className="border-hairline fixed bottom-36 right-6 z-50 flex h-[min(520px,70vh)] w-[min(360px,90vw)] flex-col overflow-hidden rounded-xl border bg-white shadow-xl md:bottom-24"
        >
          <div className="bg-navy flex items-center gap-3 px-4 py-3 text-white">
            <div className="bg-saffron font-display text-navy flex h-9 w-9 items-center justify-center rounded-full font-bold">
              A
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold">Aarya</div>
              <div className="text-xs text-white/70">AI Counsellor · Online</div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="text-xl"
            >
              ×
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "bg-saffron text-navy ml-auto max-w-[85%] rounded-lg rounded-br-sm px-3 py-2 text-sm"
                    : "bg-mist text-ink mr-auto max-w-[85%] rounded-lg rounded-bl-sm px-3 py-2 text-sm"
                }
              >
                {message.content}
              </div>
            ))}
          </div>

          <form
            className="border-hairline flex gap-2 border-t p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Aarya anything..."
              className="border-hairline focus-visible:border-navy focus-visible:outline-saffron flex-1 rounded-md border px-3 py-2 text-sm focus-visible:outline-2"
            />
            <button
              type="submit"
              disabled={isSending}
              className="bg-saffron text-navy rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
