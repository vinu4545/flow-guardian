import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { slideInRight } from "@/lib/animations";
import { copilotPresets } from "@/lib/mockData";
import ReactMarkdown from "react-markdown";

const suggestedQuestions = [
  "What is FIU and what does it do?",
  "How does your fraud detection system work?",
  "What is layering in money laundering?",
  "Why is this account flagged as high risk?",
  "Explain circular transactions",
  "How do I generate an investigation report?",
];

interface Message {
  role: "assistant" | "user";
  content: string;
}

const welcomeMessage = `👋 Hey! I'm your **AI Fund Flow Copilot** — your intelligent financial crime investigation assistant.

I can help you:
- 🔍 Understand why a transaction was flagged
- 🕵️ Explain fraud patterns like layering, structuring, and round-tripping
- 📊 Guide you through the investigation dashboard
- 📄 Help generate FIU-compliant reports
- ❓ Answer your questions about financial intelligence

Try asking me something below 👇`;

export function CopilotOrb() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const answer = copilotPresets[userMsg] ||
        "I'm analyzing your query against our fraud detection knowledge base. This feature will be fully powered by AI in production. For now, try one of the suggested questions!";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Orb */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Copilot"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/30" />
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              {...slideInRight}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-card-strong border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-display font-semibold text-foreground">AI Copilot</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-li:my-0 prose-ul:my-1 max-w-none [&_strong]:text-foreground">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-4 py-3 bg-muted rounded-2xl rounded-bl-md w-fit">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Suggested Questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {q.length > 35 ? q.slice(0, 35) + "…" : q}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Ask about fraud patterns, FIU reports..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <motion.button
                    onClick={() => handleSend(input)}
                    className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
