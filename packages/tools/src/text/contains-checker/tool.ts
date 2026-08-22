import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ContainsCheckerInput = {
  readonly text: string;
  readonly value: string;
};

export type ContainsCheckerOutput = {
  readonly contains: boolean;
};

export const containsCheckerExample = {
  input: { text: "The quick brown fox", value: "brown fox" },
  output: { contains: true },
} satisfies ToolExample<ContainsCheckerInput, ContainsCheckerOutput>;

export const containsCheckerTool = createSimpleTool({
  id: "text/contains-checker",
  title: "Contains Checker",
  description:
    "Check whether text contains a value as a case-sensitive substring.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "value", label: "Value", kind: "string" },
  ],
  outputs: [{ id: "contains", label: "Contains result", kind: "boolean" }],
  calculate: (input) => ({
    contains: (input.text as string).includes(input.value as string),
  }),
});
export const runContainsChecker = containsCheckerTool.execute;
export default containsCheckerTool;
