"use client";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useChatWidget } from "@/components/chat/ChatWidgetContext";

// "Chat with Aarya" invitation strip — DOC/REQUIREMENTS_ANALYSIS.md § 9.
// Opens the same global ChatWidget instance (DOC/STATE_MANAGEMENT.md § 4).
export function AiChatInvite({
  eyebrow,
  heading,
  headingAccent,
  body,
  ctaLabel,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  ctaLabel: string;
}) {
  const { openChat } = useChatWidget();

  return (
    <section className="bg-mist py-12 text-center md:py-16">
      <Container narrow>
        {eyebrow ? <Eyebrow center>{eyebrow}</Eyebrow> : null}
        <Heading as="h2" accent={headingAccent} className="mx-auto">
          {heading}
        </Heading>
        {body ? (
          <p className="text-slate mx-auto mt-4 max-w-[60ch] text-lg">{body}</p>
        ) : null}
        <Button
          type="button"
          variant="primary"
          className="mt-8"
          onClick={() => openChat()}
          withArrow
        >
          {ctaLabel}
        </Button>
      </Container>
    </section>
  );
}
