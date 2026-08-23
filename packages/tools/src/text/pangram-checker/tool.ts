import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PangramCheckerInput = {
  readonly text: string;
};

export type PangramCheckerOutput = {
  readonly isPangram: boolean;
};

export const pangramCheckerExample = {
  input: { text: "The quick brown fox jumps over the lazy dog" },
  output: { isPangram: true },
} satisfies ToolExample<PangramCheckerInput, PangramCheckerOutput>;

export const pangramCheckerTool = createSimpleTool({
  id: "text/pangram-checker",
  title: "Pangram Checker",
  description:
    "Check whether text contains every ASCII letter a through z, case-insensitively.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "isPangram", label: "Is pangram", kind: "boolean" }],
  calculate: (input) => ({
    isPangram:
      new Set(
        ((input.text as string).match(/[a-z]/gi) ?? []).map((letter) =>
          letter.toLowerCase(),
        ),
      ).size === 26,
  }),
});
export const runPangramChecker = pangramCheckerTool.execute;
export default pangramCheckerTool;
