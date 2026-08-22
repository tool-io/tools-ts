import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const endings = ["CRLF", "CR", "LF"] as const;

export const lineEndingNormalizerTool = createSimpleTool({
  id: "text/line-ending-normalize",
  title: "Line Ending Normalizer",
  description: "Normalize mixed line endings to LF, CRLF, or CR.",
  inputs: [
    {
      default: "LF",
      enum: [...endings],
      id: "ending",
      kind: "string",
      label: "Line ending",
    },
    { id: "text", label: "Text", kind: "string" },
  ],
  outputs: [{ id: "text", label: "Normalized text", kind: "string" }],
  calculate: (input) => {
    const lf = (input.text as string).replace(/\r\n?/gu, "\n");
    const ending = input.ending as string;
    if (ending === "CR") return { text: lf.split("\n").join("\r") };
    if (ending === "CRLF") return { text: lf.split("\n").join("\r\n") };
    return { text: lf };
  },
});
export const runLineEndingNormalizer = lineEndingNormalizerTool.execute;
export default lineEndingNormalizerTool;

export type LineEndingNormalizeInput = {
  readonly ending: string;
  readonly text: string;
};

export type LineEndingNormalizeOutput = {
  readonly text: string;
};

export const lineEndingNormalizeExample = {
  input: {
    ending: "CRLF",
    text: "example",
  },
  output: {
    text: "example",
  },
} satisfies ToolExample<LineEndingNormalizeInput, LineEndingNormalizeOutput>;
