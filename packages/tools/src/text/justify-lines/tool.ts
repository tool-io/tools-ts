import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const justifyParagraph = (paragraph: string, width: number): string => {
  const words = paragraph.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.some((word) => word.length > width))
    simpleError(
      "width",
      "A word is longer than the requested width; this tool does not split words.",
    );
  const lines: string[][] = [];
  let current: string[] = [],
    length = 0;
  for (const word of words) {
    if (current.length && length + current.length + word.length > width) {
      lines.push(current);
      current = [];
      length = 0;
    }
    current.push(word);
    length += word.length;
  }
  if (current.length) lines.push(current);
  return lines
    .map((line, index) => {
      if (index === lines.length - 1 || line.length === 1)
        return line.join(" ");
      const spaces = width - line.reduce((sum, word) => sum + word.length, 0);
      const gaps = line.length - 1,
        base = Math.floor(spaces / gaps),
        extra = spaces % gaps;
      return line
        .map(
          (word, i) =>
            word + (i < gaps ? " ".repeat(base + Number(i < extra)) : ""),
        )
        .join("");
    })
    .join("\n");
};

export const example = {
  input: { text: "one two three four", width: 13 },
  output: { text: "one two three\nfour" },
} satisfies ToolExample<
  { readonly text: string; readonly width: number },
  { readonly text: string }
>;
export const tool = createSimpleTool({
  id: "text/justify-lines",
  title: "Text Line Justifier",
  description:
    "Wrap ASCII text to a requested character width and distribute spaces across nonfinal lines. Paragraph breaks are preserved; long words are rejected rather than broken.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    {
      id: "width",
      kind: "integer",
      label: "Line width",
      minimum: 1,
      maximum: 500,
    },
  ],
  outputs: [{ id: "text", kind: "string", label: "Justified text" }],
  calculate: (input) => {
    const text = input.text as string;
    if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text))
      simpleError(
        "text",
        "Use ASCII text so character widths are unambiguous.",
      );
    return {
      text: text
        .split(/\n\s*\n/)
        .map((paragraph) => justifyParagraph(paragraph, input.width as number))
        .join("\n\n"),
    };
  },
});
export type JustifyLinesInput = Readonly<typeof example.input>;
export type JustifyLinesOutput = Readonly<typeof example.output>;
export const justifyLinesTool = tool;
export const runJustifyLines = tool.execute;
export default tool;
