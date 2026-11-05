"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [terminalState, setTerminalState] = useState<"normal" | "minimized" | "closed">("normal");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatusText("[ TRANSMITTING... ]");
    setStatusType("idle");

    try {
      const response = await fetch("https://contact.shamiltp.life/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Contact endpoint rejected the request.");
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatusType("success");
      setStatusText("[ MESSAGE SENT SUCCESSFULLY ]");
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setStatusType("error");
      setStatusText("[ TRANSMISSION FAILED — TRY AGAIN ]");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 font-mono select-text contact-ui-wrapper">
      <style jsx>{`
        .contact-terminal {
          overflow: hidden;
          border: 2px solid var(--foreground);
          background: var(--card);
          color: var(--foreground);
          font-family: "Courier New", Courier, monospace;
          transition: all 0.3s ease;
        }

        .terminal__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 42px;
          padding: 8px 14px;
          border-bottom: 2px solid var(--foreground);
          font-size: 13px;
          letter-spacing: 0.04em;
          background: var(--muted);
        }

        .window-controls {
          display: flex;
          gap: 6px;
        }

        .window-control {
          display: block;
          width: 14px;
          height: 14px;
          min-height: 14px;
          padding: 0;
          border: 1px solid var(--border);
          cursor: pointer;
        }

        .window-control:hover,
        .window-control:focus-visible {
          outline: 1px solid var(--foreground);
          outline-offset: 2px;
        }

        .window-control--close {
          background: #f08b8b;
        }

        .window-control--minimize {
          background: #edcf86;
        }

        .window-control--maximize {
          background: #9acb9b;
        }

        .terminal__body {
          min-height: 0;
          padding: clamp(24px, 5vw, 48px);
          transition: min-height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            padding 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prompt,
        .command {
          margin: 0;
          font-size: 14px;
        }

        .prompt::before,
        .command::before {
          content: "> ";
          color: var(--accent);
        }

        .page-title {
          margin: 18px 0 10px;
          font-size: clamp(28px, 6vw, 50px);
          line-height: 1;
          letter-spacing: -0.07em;
          text-transform: uppercase;
          font-weight: 800;
        }

        .cursor {
          display: inline-block;
          width: 0.55em;
          height: 0.92em;
          margin-left: 0.12em;
          vertical-align: -0.08em;
          background: var(--foreground);
          animation: cursor-blink 0.9s steps(1, end) infinite;
        }

        @keyframes cursor-blink {
          0%,
          48% {
            opacity: 1;
          }
          49%,
          100% {
            opacity: 0;
          }
        }

        .intro {
          max-width: 58ch;
          margin: 0 0 10px;
          font-size: 14px;
          color: var(--muted-foreground);
          line-height: 1.45;
        }

        .main-link {
          margin: 0 0 28px;
          font-size: 13px;
        }

        .main-link a {
          color: var(--foreground);
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }

        .main-link a:hover {
          background: var(--foreground);
          color: var(--background);
        }

        .divider {
          height: 2px;
          margin: 24px 0;
          border: 0;
          background: var(--foreground);
        }

        form {
          display: grid;
          width: 100%;
          gap: 20px;
          opacity: 1;
          overflow: hidden;
          transition: max-height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.26s ease,
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .field {
          display: grid;
          gap: 8px;
        }

        label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        label::before {
          content: "[ ";
        }
        label::after {
          content: " ]";
        }

        input,
        textarea {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid var(--foreground);
          background: var(--background);
          color: var(--foreground);
          caret-color: var(--foreground);
          font-family: inherit;
          font-size: 14px;
        }

        input::placeholder,
        textarea::placeholder {
          color: var(--muted-foreground);
          opacity: 0.6;
        }

        input:focus,
        textarea:focus {
          outline: none;
          background: var(--foreground);
          color: var(--background);
          box-shadow: 5px 5px 0 var(--border);
        }

        input:focus::placeholder,
        textarea:focus::placeholder {
          color: var(--background);
          opacity: 0.6;
        }

        textarea {
          min-height: 140px;
          resize: vertical;
        }

        .submit-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 4px;
        }

        .submit-button {
          min-height: 44px;
          padding: 10px 18px;
          border: 2px solid var(--foreground);
          background: var(--foreground);
          color: var(--background);
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          font-family: inherit;
          font-size: 13px;
          letter-spacing: 0.04em;
          transition: all 0.15s ease;
        }

        .submit-button:hover,
        .submit-button:focus-visible {
          background: var(--background);
          color: var(--foreground);
          outline: none;
          box-shadow: 4px 4px 0 var(--border);
        }

        .submit-button:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 var(--border);
        }

        .submit-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .status {
          min-height: 1.5em;
          margin: 0;
          font-size: 13px;
          font-weight: 700;
        }

        .status.success {
          color: #22c55e;
        }

        .status.error {
          color: #ef4444;
        }

        .page-content,
        .footer {
          opacity: 1;
          overflow: hidden;
          transition: max-height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.26s ease;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 28px;
          padding-top: 18px;
          border-top: 2px solid var(--foreground);
          font-size: 12px;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        /* Yellow minimized: content-only */
        .is-minimized form {
          max-height: 0;
          margin: 0;
          opacity: 0;
          pointer-events: none;
        }

        .is-minimized .footer {
          margin-top: 2px;
        }

        /* Red closed: compact form-only */
        .is-closed .page-content,
        .is-closed .footer {
          max-height: 0;
          margin-top: 0;
          padding-top: 0;
          border-top-width: 0;
          opacity: 0;
          pointer-events: none;
        }

        .is-closed .terminal__body {
          min-height: 280px;
        }

        .is-closed form {
          width: min(100%, 460px);
          margin: 0 auto;
          gap: 12px;
        }

        .is-closed textarea {
          min-height: 85px;
        }
      `}</style>

      <section
        className={`contact-terminal ${
          terminalState === "minimized"
            ? "is-minimized"
            : terminalState === "closed"
            ? "is-closed"
            : ""
        }`}
        aria-labelledby="page-title"
      >
        {/* Terminal Header Bar */}
        <div className="terminal__bar" aria-label="Terminal window header">
          <span>shamil@contact: ~/direct-message</span>
          <div className="window-controls" aria-label="Window controls">
            <button
              className="window-control window-control--close"
              type="button"
              onClick={() => setTerminalState("closed")}
              aria-label="Show compact form"
              title="Show compact form"
            />
            <button
              className="window-control window-control--minimize"
              type="button"
              onClick={() => setTerminalState("minimized")}
              aria-label="Show content only"
              title="Show content only"
            />
            <button
              className="window-control window-control--maximize"
              type="button"
              onClick={() => setTerminalState("normal")}
              aria-label="Restore full terminal"
              title="Restore full terminal"
            />
          </div>
        </div>

        {/* Terminal Window Body */}
        <div className="terminal__body">
          <div className="page-content">
            <p className="prompt">cd ~/contact</p>
            <p className="command">open direct-message-terminal</p>
            <h2 id="page-title" className="page-title">
              Contact Shamil TP<span className="cursor" aria-hidden="true" />
            </h2>
            <p className="intro">
              Official contact node for Shamil TP (shamil-tp). Use the terminal
              interface below to reach out directly about software engineering,
              development projects, or technical collaboration.
            </p>
            <p className="main-link">
              <a
                href="https://contact.shamiltp.life"
                target="_blank"
                rel="noopener noreferrer"
              >
                Standalone Portal: contact.shamiltp.life
              </a>
            </p>

            <hr className="divider" />
          </div>

          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="YOUR_NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="YOU@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="TYPE_MESSAGE_HERE..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="submit-row">
              <button
                className="submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "[ TRANSMITTING... ]" : "[ SEND MESSAGE ]"}
              </button>
              {statusText && (
                <p
                  id="form-status"
                  className={`status ${
                    statusType === "success"
                      ? "success"
                      : statusType === "error"
                      ? "error"
                      : ""
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {statusText}
                </p>
              )}
            </div>
          </form>

          <footer className="footer">
            <span>© {new Date().getFullYear()} Shamil TP</span>
            <span>status: ready</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
