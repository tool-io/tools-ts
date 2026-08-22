import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetabInput = {
  readonly tabStopsEvery?: number;
  readonly text: string;
};
export type DetabOutput = { readonly expandedText: string };

export const detabExample = {
  input: { text: "a\tb\tc\n\tx", tabStopsEvery: 4 },
  output: { expandedText: "a   b   c\n    x" },
} satisfies ToolExample<DetabInput, DetabOutput>;

export const calculateDetab = (input: DetabInput): DetabOutput => {
  const width = input.tabStopsEvery ?? 8;
  if (width < 1)
    simpleError("tabStopsEvery", "Tab stop width must be at least one.");
  const expanded = input.text.split("\n").map((line) => {
    let column = 0;
    let output = "";
    for (const character of line) {
      if (character === "\t") {
        const spaces = width - (column % width);
        output += " ".repeat(spaces);
        column += spaces;
      } else {
        output += character;
        column += 1;
      }
    }
    return output;
  });
  return { expandedText: expanded.join("\n") };
};

export const detabTool = createSimpleTool({
  calculate: (input) => calculateDetab(input as unknown as DetabInput),
  description:
    "Expand tab characters to spaces honoring fixed column tab stops.",
  id: "text/detab",
  inputs: [
    {
      description: "Input text (tabs expanded per line).",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      default: 8,
      minimum: 1,
      description: "Tab stop interval in columns.",
      id: "tabStopsEvery",
      kind: "integer",
      label: "Tab stop width",
    },
  ],
  outputs: [
    {
      description: "Text with tabs replaced by spaces.",
      id: "expandedText",
      kind: "string",
      label: "Expanded text",
    },
  ],
  title: "Text Detab",
});
export const runDetab = detabTool.execute;
export { detabExample as example };
export default detabTool;
