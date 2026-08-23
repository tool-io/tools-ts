import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type IsogramCheckerInput = {
  readonly text: string;
};

export type IsogramCheckerOutput = {
  readonly isIsogram: boolean;
};

export const isogramCheckerExample = {
  input: { text: "dialogue" },
  output: { isIsogram: true },
} satisfies ToolExample<IsogramCheckerInput, IsogramCheckerOutput>;

export const isogramCheckerTool = createSimpleTool({
  id: "text/isogram-checker",
  title: "Isogram Checker",
  description:
    "Check whether no letter repeats in text, case-insensitively, ignoring non-letter characters.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "isIsogram", label: "Is isogram", kind: "boolean" }],
  calculate: (input) => {
    const seen = new Set<string>();
    for (const character of (input.text as string).toLowerCase()) {
      if (!/[a-z]/i.test(character)) continue;
      if (seen.has(character)) return { isIsogram: false };
      seen.add(character);
    }
    return { isIsogram: true };
  },
});
export const runIsogramChecker = isogramCheckerTool.execute;
export default isogramCheckerTool;
