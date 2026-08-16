import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, Copy, Eraser, ExternalLink, LoaderCircle, Sparkles } from "lucide-react";
import type { AppProps } from "../registry";
import { useOS } from "../store";
import { answerQuestion, getSuggestedQuestions } from "@/lib/profileAssistant";

export type ChatMessage = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  source?: string;
  timestamp: string;
  action?: "experience" | "projects" | "resume" | "github" | "linkedin" | "mail" | "finder" | "preview";
};

const initialWelcome = {
  id: "welcome",
  sender: "assistant" as const,
  text: "👋 What would you like to know about Ayush?",
  source: "Profile assistant",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function AskAyushAIApp(_props: AppProps) {
  const { openApp } = useOS();
  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcome]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggested = useMemo(() => getSuggestedQuestions(), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const ask = (question: string) => {
    if (!question.trim()) return;

    const nextUser: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, nextUser]);
    setInput("");
    setIsTyping(true);

    const answer = answerQuestion(question, context ?? undefined);
    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: answer.text,
        source: answer.source,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: answer.action,
      };
      setContext(question);
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  const clearChat = () => {
    setMessages([initialWelcome]);
    setContext(null);
    setInput("");
    setIsTyping(false);
  };

  const handleAction = (action?: string) => {
    if (!action) return;
    if (action === "experience") openApp("finder");
    if (action === "projects") openApp("safari");
    if (action === "resume" || action === "preview") openApp("preview");
    if (action === "github") window.open("https://github.com/AyushDEvElopEr-200119?tab=repositories", "_blank", "noreferrer");
    if (action === "linkedin") window.open("https://www.linkedin.com/in/ayush-srivastava-6995a9301/", "_blank", "noreferrer");
    if (action === "mail") openApp("mail");
    if (action === "finder") openApp("finder");
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.02)),rgba(255,255,255,0.72)] text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/65 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Ask Ayush AI</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">AI-style professional profile assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-emerald-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
          Profile Assistant Online
        </div>
      </div>

      {!messages.length || messages.length === 1 ? (
        <div className="p-4 md:p-5">
          <div className="rounded-[22px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_18px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">👋 What would you like to know about Ayush?</h3>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: "About",
                  items: ["Who is Ayush?", "Give me a quick introduction.", "What does Ayush currently do?"],
                },
                {
                  title: "Experience",
                  items: ["Where does Ayush currently work?", "How much experience does Ayush have?", "What did Ayush work on previously?"],
                },
                {
                  title: "Technical",
                  items: ["What is Ayush's tech stack?", "Does Ayush have React experience?", "Does he know Node.js?"],
                },
                {
                  title: "Projects",
                  items: ["What projects has Ayush built?", "What is his best project?", "Which project demonstrates his React skills?"],
                },
                {
                  title: "Career",
                  items: ["What type of role is Ayush looking for?", "Is Ayush open to opportunities?", "What are his career preferences?"],
                },
              ].map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{group.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((question) => (
                      <button
                        key={question}
                        onClick={() => ask(question)}
                        className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-white"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 md:px-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${message.sender === "user" ? "border border-slate-900 bg-slate-900 text-white" : "border border-slate-200 bg-white/80 text-slate-800 backdrop-blur-xl"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-current/70">
                    {message.sender === "user" ? "You" : "Ayush AI"}
                  </span>
                  <span className="text-[10px] text-current/60">{message.timestamp}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                {message.source ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                      {message.source}
                    </span>
                    {message.action ? (
                      <button
                        onClick={() => handleAction(message.action)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {message.action === "experience" ? "View Experience" : message.action === "projects" ? "View Projects" : message.action === "resume" || message.action === "preview" ? "View Resume" : message.action === "github" ? "Open GitHub" : message.action === "linkedin" ? "Open LinkedIn" : message.action === "mail" ? "Contact Ayush" : "Open Section"}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    ) : null}
                    <button
                      onClick={() => navigator.clipboard?.writeText(message.text)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-2.5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  Thinking
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white/75 p-3 backdrop-blur-xl md:p-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex flex-wrap gap-2">
            {suggested.slice(0, 5).map((question) => (
              <button
                key={question}
                onClick={() => ask(question)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600 transition hover:border-slate-300 hover:bg-white"
              >
                {question}
              </button>
            ))}
            <button onClick={clearChat} className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
              <Eraser className="h-3 w-3" /> Clear
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask(input);
                }
              }}
              rows={1}
              placeholder="Ask anything about Ayush..."
              className="max-h-28 min-h-[42px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
