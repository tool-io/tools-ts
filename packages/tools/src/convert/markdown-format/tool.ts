import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const convertMarkdownFormat = (
  markdown: string,
  target: "slack" | "discord",
): string => {
  if (target === "discord") return markdown;
  let fenced = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return line;
      }
      if (fenced) return line;
      let converted = line;
      converted = converted.replace(
        /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
        "<$2|$1>",
      );
      const bold: string[] = [];
      converted = converted.replace(/\*\*([^*\n]+)\*\*/g, (_, text: string) => {
        bold.push(`*${text}*`);
        return `\u0000${bold.length - 1}\u0000`;
      });
      converted = converted.replace(/~~([^~\n]+)~~/g, "~$1~");
      converted = converted.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "_$1_");
      converted = converted.replace(
        /\u0000(\d+)\u0000/g,
        (_, index: string) => bold[Number(index)]!,
      );
      converted = converted.replace(
        /^#{1,6}\s+(.+)$/,
        (_, heading: string) => `*${heading}*`,
      );
      return converted;
    })
    .join("\n");
};

export const example = {
  input: {
    markdown: "# Title\n**bold** and [site](https://example.com)",
    target: "slack",
  },
  output: { converted: "*Title*\n*bold* and <https://example.com|site>" },
} satisfies ToolExample<
  { readonly markdown: string; readonly target: string },
  { readonly converted: string }
>;
export const tool = createSimpleTool({
  id: "convert/markdown-format",
  title: "Markdown Format Converter",
  description:
    "Convert a practical GitHub-flavored Markdown subset to Slack mrkdwn, or retain GFM-compatible Discord markup. Headings, emphasis, strikethrough and simple links are handled; complex tables, nested links and platform-specific blocks are not fully translated.",
  inputs: [
    { id: "markdown", kind: "string", label: "GitHub-flavored Markdown" },
    {
      id: "target",
      kind: "string",
      label: "Target format",
      enum: ["slack", "discord"],
    },
  ],
  outputs: [{ id: "converted", kind: "string", label: "Converted text" }],
  calculate: (input) => ({
    converted: convertMarkdownFormat(
      input.markdown as string,
      input.target as "slack" | "discord",
    ),
  }),
});
export type MarkdownFormatInput = Readonly<typeof example.input>;
export type MarkdownFormatOutput = Readonly<typeof example.output>;
export const markdownFormatTool = tool;
export const runMarkdownFormat = tool.execute;
export default tool;
