import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { LanguageSelect } from "./language-select";
import { getLanguage } from "@/lib/languages";
export default function RiplConversation({
  language,
  onLanguageChange,
}: {
  language: string;
  onLanguageChange: (value: string) => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  const languageRef = useRef(language);
  languageRef.current = language;
  const [text, setText] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ language: languageRef.current }),
      }),
    [],
  );
  const { messages, sendMessage, status, error, stop } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const locale = getLanguage(language);
  useEffect(() => {
    input.current?.focus();
  }, [language, status]);
  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );
  const last = messages.at(-1);
  const waiting =
    busy &&
    (last?.role !== "assistant" || !last.parts.some((p) => p.type === "text" && p.text.trim()));
  return (
    <>
      <div className="chat-language-bar">
        <LanguageSelect value={language} onChange={onLanguageChange} disabled={busy} />
      </div>
      <Conversation className="min-h-0" initial="auto" resize="auto">
        <ConversationContent className="gap-6 p-5" dir={language === "ur" ? "rtl" : "ltr"}>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>{locale?.greeting ?? "Hello! How can I help?"}</MessageResponse>
            </MessageContent>
          </Message>
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent className={m.role === "user" ? "chat-user-content" : "leading-7"}>
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    <MessageResponse key={i} isAnimating={busy && m.id === last?.id}>
                      {p.text}
                    </MessageResponse>
                  ) : p.type === "reasoning" && p.text ? (
                    <Reasoning key={i} defaultOpen={false} isStreaming={busy && m.id === last?.id}>
                      <ReasoningTrigger />
                      <ReasoningContent>{p.text}</ReasoningContent>
                    </Reasoning>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {waiting && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>RIPL is thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton aria-label="Latest message" />
      </Conversation>
      <div className="chat-compose">
        <PromptInput
          onSubmit={({ text: question }) => {
            if (busy || !question.trim()) return;
            setText("");
            void sendMessage({ text: question.trim() });
            input.current?.focus();
          }}
        >
          <PromptInputTextarea
            ref={input}
            aria-label="Your question"
            placeholder={locale?.placeholder}
            maxLength={4000}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              aria-label={busy ? "Stop response" : "Send question"}
              title={busy ? "Stop response" : "Send question"}
              status={status}
              onStop={stop}
              disabled={!busy && !text.trim()}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}
