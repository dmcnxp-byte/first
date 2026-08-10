"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

// The one React Context in the app — DOC/STATE_MANAGEMENT.md § 4: shared
// across otherwise-unrelated components (nav CTA, AI-invite section, mobile
// action bar) that all need to trigger the same ChatWidget instance.
type ChatWidgetContextValue = {
  isOpen: boolean;
  seedMessage?: string;
  openChat: (seedMessage?: string) => void;
  closeChat: () => void;
};

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

export function ChatWidgetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | undefined>(undefined);

  const openChat = useCallback((seed?: string) => {
    setSeedMessage(seed);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, seedMessage, openChat, closeChat }),
    [isOpen, seedMessage, openChat, closeChat],
  );

  return (
    <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>
  );
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  return ctx;
}
