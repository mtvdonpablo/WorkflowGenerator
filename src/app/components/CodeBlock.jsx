"use client";
import { useState } from "react";

const CodeBlock = ({ code, language = "XAML" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "relative",
      background: "#0d1117",
      borderRadius: "10px",
      border: "1px solid #30363d",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 14px",
        background: "#161b22",
        borderBottom: "1px solid #30363d",
      }}>
        <span style={{
          fontSize: "11px",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#8b949e",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {language}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            background: copied ? "#1f6feb22" : "transparent",
            border: `1px solid ${copied ? "#388bfd" : "#30363d"}`,
            borderRadius: "6px",
            cursor: "pointer",
            color: copied ? "#388bfd" : "#8b949e",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre style={{
        margin: 0,
        padding: "16px 18px",
        overflowX: "auto",
        fontSize: "13.5px",
        lineHeight: "1.65",
        color: "#e6edf3",
        whiteSpace: "pre",
        minHeight: "auto",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;