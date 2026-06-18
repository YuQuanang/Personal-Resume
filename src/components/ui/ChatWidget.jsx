import React, { useState, useRef, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';

// ─── Starter Questions ────────────────────────────────────────────────────────
// These are shown when the chat opens to help recruiters get started quickly.
const STARTER_QUESTIONS = [
  "What internships has Yu Quan done?",
  "What are his technical skills?",
  "Tell me about his golf background.",
  "Is he open to opportunities?",
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconChat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const IconBot = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="chat-msg chat-msg--assistant" aria-live="polite" aria-label="Assistant is typing">
      <div className="chat-msg-avatar"><IconBot /></div>
      <div className="chat-msg-bubble chat-msg-bubble--assistant">
        <div className="chat-typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, isLast, onSuggestionClick }) {
  const isUser = message.role === 'user';
  // console.log('[MessageBubble] message:', JSON.stringify(message, null, 2));

  // In @ai-sdk/react v3, message content is an array of parts.
  let rawContent = Array.isArray(message.content)
    ? message.content
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('')
    : (message.content ?? '');

  // Extract dynamic suggestions if present
  let textContent = rawContent;
  let suggestions = [];

  if (!isUser && rawContent.includes('---SUGGESTIONS---')) {
    const parts = rawContent.split('---SUGGESTIONS---');
    textContent = parts[0].trim();
    const suggestionsPart = parts[1];
    
    if (suggestionsPart) {
      const lines = suggestionsPart.trim().split('\n');
      for (const line of lines) {
        const match = line.match(/^\d+\.\s+(.*)$/);
        if (match && match[1]) {
          suggestions.push(match[1].trim());
        }
      }
    }
  }

  return (
    <div className={`chat-msg ${isUser ? 'chat-msg--user' : 'chat-msg--assistant'}`}>
      {!isUser && (
        <div className="chat-msg-avatar" aria-hidden="true"><IconBot /></div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, maxWidth: '100%' }}>
        <div className={`chat-msg-bubble ${isUser ? 'chat-msg-bubble--user' : 'chat-msg-bubble--assistant'}`}>
          {/* ReactMarkdown safely parses the response and renders HTML lists, bold tags, etc. */}
          <ReactMarkdown>{textContent}</ReactMarkdown>
        </div>
        
        {/* Render dynamic suggestions ONLY on the very last message */}
        {isLast && suggestions.length > 0 && (
          <div className="chat-starters" style={{ padding: 0, marginTop: '0.2rem' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="chat-starter-chip"
                onClick={() => onSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ChatWidget Component ────────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  // In @ai-sdk/react v3, input is managed locally — useChat no longer owns it.
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isUserScrollingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Track if the user has manually scrolled up from the bottom.
  const handleScroll = (e) => {
    const container = e.target;
    // Allow a 50px buffer for the bottom
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    isUserScrollingRef.current = !isAtBottom;
  };

  // Prevent background scrolling via JS instead of hiding the scrollbar
  const handleGlobalScroll = (e) => {
    // If the user is scrolling while hovering over the chat messages, let it scroll naturally.
    // If they scroll while hovering over the header/input (not scrollable), block it so the background doesn't move.
    if (!e.target.closest('.chat-messages')) {
      e.preventDefault();
    }
  };

  const handleMouseEnter = () => {
    // Attach passive: false so we can call preventDefault()
    window.addEventListener('wheel', handleGlobalScroll, { passive: false });
    window.addEventListener('touchmove', handleGlobalScroll, { passive: false });
  };

  const handleMouseLeave = () => {
    window.removeEventListener('wheel', handleGlobalScroll);
    window.removeEventListener('touchmove', handleGlobalScroll);
  };

  // Auto-scroll to the latest message during streaming, but only if user hasn't scrolled up.
  useEffect(() => {
    if (!isOpen || !messagesContainerRef.current || !messagesEndRef.current) return;
    const container = messagesContainerRef.current;
    // Check if user is near the bottom (within 150px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
    if (isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleToggle = () => (isOpen ? handleClose() : handleOpen());

  // Submit the current input value.
  const submit = async (overrideText) => {
    const text = (typeof overrideText === 'string' ? overrideText : input).trim();
    if (!text || isLoading) return;
    setInput('');

    // 1. Optimistically add user message
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setStatus('streaming');
    setError(null);

    // Force scroll to bottom on new message submission
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      // 2. Fetch the stream from backend
      const res = await fetch(import.meta.env.VITE_CHAT_API_URL || '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error('API error: ' + res.statusText);

      // 3. Optimistically create assistant message placeholder
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      // 4. Stream response and update the assistant bubble chunk by chunk
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
      setStatus('idle');
    } catch (err) {
      console.error('[ChatWidget] fetch error:', err);
      setError(err);
      setStatus('error');
    }
  };

  // Allow pressing Enter to submit (Shift+Enter for newline).
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // Form submit handler.
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  // Handle starter question clicks.
  const handleStarterClick = (question) => {
    submit(question);
  };

  const showStarters = hasOpened && messages.length === 0 && !isLoading;

  return (
    <>
      {/* ── Floating Chat Panel ─────────────────────────────────────────── */}
      <div
        className={`chat-panel ${isOpen ? 'chat-panel--open' : ''}`}
        role="dialog"
        aria-label="Portfolio chat assistant"
        aria-hidden={!isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="chat-panel-header">
          <div className="chat-panel-header-info">
            <div className="chat-panel-avatar" aria-hidden="true">
              <IconBot />
            </div>
            <div>
              <p className="chat-panel-name">Yu Quan's Assistant</p>
              <p className="chat-panel-status">
                <span className="chat-status-dot" aria-hidden="true" />
                Ask me anything about his background
              </p>
            </div>
          </div>
          <button
            id="chat-close-btn"
            className="chat-close-btn"
            onClick={handleClose}
            aria-label="Close chat"
          >
            <IconClose />
          </button>
        </div>

        {/* Message List */}
        <div ref={messagesContainerRef} className="chat-messages" aria-live="polite" aria-relevant="additions">

          {/* Welcome message — always shown */}
          {hasOpened && (
            <div className="chat-msg chat-msg--assistant">
              <div className="chat-msg-avatar" aria-hidden="true"><IconBot /></div>
              <div className="chat-msg-bubble chat-msg-bubble--assistant">
                Hi! 👋 I'm Yu Quan's AI assistant. Ask me about his internships, skills, projects, or anything about his background.
              </div>
            </div>
          )}

          {/* Starter question chips */}
          {showStarters && (
            <div className="chat-starters" role="list" aria-label="Suggested questions">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  role="listitem"
                  className="chat-starter-chip"
                  onClick={() => handleStarterClick(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Conversation messages */}
          {messages.map((msg, idx) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLast={idx === messages.length - 1}
              onSuggestionClick={handleStarterClick}
            />
          ))}

          {/* Typing indicator while streaming */}
          {isLoading && <TypingIndicator />}

          {/* Error state */}
          {error && (
            <div className="chat-error" role="alert">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input Area */}
        <form className="chat-input-area" onSubmit={handleSubmit} noValidate>
          <textarea
            id="chat-input"
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Yu Quan…"
            rows={1}
            maxLength={2000}
            aria-label="Chat message input"
            disabled={isLoading}
          />
          <button
            id="chat-send-btn"
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <IconSend />
          </button>
        </form>
      </div>

      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <button
        id="chat-trigger-btn"
        className={`chat-trigger ${isOpen ? 'chat-trigger--active' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        {/* Idle pulse ring (hidden when open) */}
        {!isOpen && <span className="chat-trigger-pulse" aria-hidden="true" />}
        <span className="chat-trigger-icon">
          {isOpen ? <IconClose /> : <IconChat />}
        </span>
      </button>
    </>
  );
}
