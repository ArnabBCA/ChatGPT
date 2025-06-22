import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const renderMarkdown = (content: string) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children, ...props }) => (
        <p className="inline" {...props}>
          {children}
        </p>
      ),
      code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <SyntaxHighlighter
            language={match[1]}
            style={vscDarkPlus}
            wrapLongLines
            customStyle={{
              borderRadius: "0.75rem",
              padding: "1rem",
              backgroundColor: "#171717",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code
            className="dark:bg-[#424242] px-1 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      },
      a: (props) => (
        <a
          {...props}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);
