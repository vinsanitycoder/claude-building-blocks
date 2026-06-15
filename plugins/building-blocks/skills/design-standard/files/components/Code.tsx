import "../components.css";
import * as React from "react";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional language label shown in the header. */
  language?: string;
  /** Optional filename shown in the header (takes precedence over language). */
  filename?: string;
  /** Show a "Copy" button in the header. */
  copyable?: boolean;
  /** The code text. If omitted, children are rendered directly. */
  code?: string;
}

/** Code block — mono container with optional header (filename/lang + copy) and scroll.
 *  For INLINE code use a plain <code>; that's already styled by globals.css. */
export function CodeBlock({ language, filename, copyable = true, code, className = "", children, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const text = code ?? (typeof children === "string" ? children : "");
  async function onCopy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  }
  const showHeader = filename || language || copyable;
  return (
    <div className={["ds-codeblock", className].filter(Boolean).join(" ")} {...rest}>
      {showHeader && (
        <div className="ds-codeblock__header">
          <span className="ds-codeblock__label">{filename ?? language ?? ""}</span>
          {copyable && (
            <button type="button" className="ds-codeblock__copy" onClick={onCopy} aria-label="Copy code">
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      )}
      <pre className="ds-codeblock__body"><code>{children ?? code}</code></pre>
    </div>
  );
}
